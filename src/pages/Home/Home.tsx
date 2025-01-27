import './Home.css';
import { Layout } from '../../components/Layout';
import { useUser } from '@/hooks/useUser';
import { IonAvatar, IonIcon, IonSpinner } from '@ionic/react';
import { UserResponse } from '@/types/Auth';
import Card from '@/components/Card/Card';
import { useEffect, useState } from 'react';
import { axiosClient } from '@/utils/axios';
import { CourseList } from '@/types/Courses';
import { getNextClassBySchedules } from '@/utils/dataMappers';
import emptyImage from '@/assets/empty.png';
import { calendarOutline } from 'ionicons/icons';

const CustomToolbar: React.FC<{user: UserResponse | null}> = ({user}) => {
  return (
    <div className="header-home">
      <div className='image-name'>
        <IonAvatar>
          <img alt="Imagen perfil" src={user?.photo_url ?? "https://ionicframework.com/docs/img/demos/avatar.svg"} />
        </IonAvatar> 
        <h1>Hola {user?.name} </h1>
      </div>
      <p>Tu resumen con todo lo que necesitas</p>
    </div>
  );
}


const Home: React.FC = () => {
  const {user} = useUser();
  const [stateResponse, setStateResponse] = useState<'loading' | 'error' | 'success'>('success');
  const [courses, setCourses] = useState<CourseList>([]);

  useEffect(() => {
    const getCoursersTeacher = async () => {
      setStateResponse('loading');
      try{
        const {data} = await axiosClient.get<CourseList>('/courses');
        setStateResponse('success');

        return setCourses(data);
      }catch(error){
        console.error(error);
        setStateResponse('error');
      }
    }

    getCoursersTeacher();
  }, []);

  return (
    <Layout customToolbar={<CustomToolbar user={user} />} title="Inicio">
      <div className="container">
        <h2 className='subtitle'><IonIcon src={calendarOutline} /> Tus cursos:</h2>
        {stateResponse === 'success' && courses?.length === 0 && 
          <div className='empty-container'>
            <img src={emptyImage} alt='empty' />
            <p className='empty-text'>No tienes clases proximas</p>
          </div>}
        {stateResponse === 'loading' && (<div className='empty-container'><IonSpinner name="crescent" /></div>)}
        {stateResponse === 'success' && courses?.map(({id, name, color = '#222D3A'}) => 
          (<Card 
              title={name} 
              description={''} 
              backgroundColor={color}
              onClick={() => window.location.href = `/detail/${id}`}
            />)
        )}
      </div>
    </Layout>
  );
};

export default Home;
