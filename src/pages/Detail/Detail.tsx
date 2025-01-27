import './Detail.css';
import { Layout } from '../../components/Layout';
import { useParams } from 'react-router';
import Card from '@/components/Card/Card';
import { IonIcon } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { Course } from '@/types/Courses';
import { axiosClient } from '@/utils/axios';

const QUICK_ACTIONS = [{
  title: 'Asistencias',
  description: 'Accionar las asistencias del curso',
  backgroundColor: '#0a4aa3',

}, {
  title: 'Notas',
  description: 'Accionar las notas del curso',
  backgroundColor: '#32a852',
}]

const CustomToolbar: React.FC<{courseName: string}> = ({courseName}) => {
  return (
    <div className="header-detail">
      <div className='image-name'>
        <IonIcon src={arrowBackOutline} onClick={() => window.location.href = '/home'} />
        <h1>{courseName}</h1>
        <div />
      </div>
      <p>Ver detalle del curso con la información relevante</p>
    </div>
  );
}

const Detail: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const [course, setCourse] = useState<Course>();

  // use effect to get the course detail like home page
  useEffect(() => {
    const getCourseDetail = async () => {
      try {
        const {data} = await axiosClient.get<Course>(`/course/${id}`);
        if(!data) {
          window.location.href = '/home';
          return;
        }
        setCourse(data);
      } catch (error) {
        console.error(error);
        window.location.href = '/home';
      }
    }
  }, [id]);

  return (
    <Layout customToolbar={<CustomToolbar courseName={course!.name} />} title={course!.name} >
      <div className="container">
        <h2 className='subtitle'>Acciones rapidas:</h2>
        {QUICK_ACTIONS.map((card) =>
          <Card {...card} onClick={() => window.location.href = `/detail/${id}/attendants`}/>
        )}
      </div>
    </Layout>
  );
};

export default Detail;
