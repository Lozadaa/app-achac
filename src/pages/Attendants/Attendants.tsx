import './Attendants.css';
import { Layout } from '../../components/Layout';
import { useParams } from 'react-router';
import { IonIcon, IonSpinner } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { axiosClient } from '@/utils/axios';
import StudentAttendant from '@/components/StudentItem/StudentAttendant';

const CustomToolbar: React.FC<{courseName: string}> = ({courseName}) => {
  return (
    <div className="header-detail">
      <div className='image-name'>
        <IonIcon src={arrowBackOutline} onClick={() => window.history.back()} />
        <h1>{courseName}</h1>
        <div />
      </div>
      <p>Listado de alumnos para el día</p>
    </div>
  );
}
type Student = {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
}
const Attendants: React.FC = () => {
  const [stateResponse, setStateResponse] = useState<'loading' | 'error' | 'success'>('success');
  const [students, setStudents] = useState<Student[]>([]);
  const {id} = useParams<{id: string}>();

  useEffect(() => {
    setStateResponse('loading');

    const getStudents = async () => {
      try {
        const {data} = await axiosClient.get<Student[]>(`/courses/${id}/students`);
        setStudents(data);
        setStateResponse('success');
      }catch(error){
        setStateResponse('error');
        console.error(error);
      }
    }

    getStudents();
  }, [id]);

  return (
    <Layout customToolbar={<CustomToolbar courseName={"Pilotaje"} />} title="Pilotaje">
      <div className="container">
        {stateResponse === 'loading' && (<div className='empty-container'><IonSpinner name="crescent" /></div>)}
        {stateResponse === 'success' && students.length === 0 && <h1>No hay alumnos para el día</h1>}
        {stateResponse === 'success' && students.map((student: Student) => (
          <StudentAttendant 
            key={student.id} 
            name={`${student.first_name} ${student.last_name}`}
            id={student.id}
            image={student.image}
            onChange={(id, value) => console.log(id, value)}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Attendants;
