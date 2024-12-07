import './Home.css';
import { Layout } from '../../components/Layout';
import { useUser } from '@/hooks/useUser';
import { IonAvatar, IonGrid, IonRow, IonSpinner, IonTitle } from '@ionic/react';
import { UserResponse } from '@/types/Auth';
import Card from '@/components/Card/Card';
import { useEffect, useState } from 'react';
import { axiosClient } from '@/utils/axios';
import { CourseInitated, CourseInitatedList } from '@/types/Courses';
import { getNextClassBySchedules } from '@/utils/dataMappers';
import emptyImage from '@/assets/empty.png';

const CustomToolbar: React.FC<{user: UserResponse | null}> = ({user}) => {
  return (
    <div className="header">
      <div className='image-name'>
        <IonAvatar>
          <img alt="Imagen perfil" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </IonAvatar> 
        <h1>Hola {user?.name} </h1>
      </div>
      <p>Tu resumen con todo lo que necesitas</p>
    </div>
  );
}

const Home: React.FC = () => {
  const {user} = useUser();
  const [stateResponse, setStateResponse] = useState<'loading' | 'error' | 'success'>('loading');
  const [courses, setCourses] = useState<{name: string, location: string, nearestDate?: string}[]>();

  useEffect(() => {
    const getCoursersTeacher = async () => {
      setStateResponse('loading');
      try{
        const {data} = await axiosClient.get<CourseInitatedList>('/teacher_courses');
        const coursesData = data?.map(({course: {name}, headquarter: {name: location}, course_schedules}) => ({
          name,
          location,
          nearestDate: getNextClassBySchedules(course_schedules)
        })).filter(({nearestDate}) => nearestDate);
        setStateResponse('success');

        return setCourses(coursesData);
      }catch(error){
        console.error(error);
        setStateResponse('error');
      }
    }

    getCoursersTeacher();
  }, []);

  return (
    <Layout customToolbar={<CustomToolbar user={user} />} title="XD">
      <div className="container">
        <h2 className='subtitle'>Proximas clases:</h2>
        {stateResponse === 'success' && courses?.length === 0 && 
          <div className='empty-container'>
            <img src={emptyImage} alt='empty' />
            <p className='empty-text'>No tienes clases proximas</p>
          </div>}
        {stateResponse === 'loading' && (<div className='empty-container'><IonSpinner name="crescent" /></div>)}
        {stateResponse === 'success' && courses?.map(({location, name, nearestDate}) => 
          (<Card 
              title={name} 
              description={`${location} - ${nearestDate}`} 
            />)
        )}
      </div>
    </Layout>
  );
};

export default Home;
