import { Layout } from '@/components/Layout';
import { Datum, Students, StudentsFeedback } from '@/types/Courses';
import { axiosClient } from '@/utils/axios';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/react';
import {
  arrowBackOutline,
  trashOutline,
  chevronDownOutline,
  chevronUpOutline,
} from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './FeedBack.css';
import styles from './list.module.css';
import moment from 'moment';
import FeedbackCard from '@/components/FeedbackCard/FeedbackCard';
import FeedbackForm from '@/components/FeedbackForm/FeedbackForm';

const CustomToolbar: React.FC<{ courseName: string }> = ({ courseName }) => {
  return (
    <div className="header-detail">
      <div className="toolbar-container">
        <div
          className="back-button"
          onClick={() => (window.location.href = '/home')}
        >
          <IonIcon icon={arrowBackOutline} />
        </div>
        <div className="course-info">
          <h1>{courseName}</h1>
          <div className="course-subtitle">
            Listado de alumnos para colocar feedbacks
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedBack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<Students[]>([]);
  const [feedbacks, setFeedbacks] = useState<Datum[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const { id: idCourse } = useParams<{ id: string }>();

  const getStudents = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosClient.get<Students[]>(
        '/student/student_attendance/course_schedule',
        {
          params: {
            course_schedule_id: idCourse,
          },
        }
      );
      setStudents(data);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedbackStudent = async (studentId: number) => {
    if (!studentId) return;

    setIsLoading(true);
    try {
      const { data } = await axiosClient.get<StudentsFeedback>(
        `/feedbacks/student/${studentId}`
      );
      setFeedbacks(data.data);
    } catch (error) {
      console.error('Error al obtener feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/feedbacks/${id}`);
      getFeedbackStudent(selectedStudent);
    } catch (error) {
      console.error('Error al eliminar feedback:', error);
    }
  };

  const handleAddFeedback = async (text: string) => {
    if (!selectedStudent || !text.trim()) return;

    setIsSubmitting(true);
    try {
      await axiosClient.post('/feedbacks', {
        feedback: {
          detail: text,
          student_id: selectedStudent,
        },
      });
      getFeedbackStudent(selectedStudent);
    } catch (error) {
      console.error('Error al añadir feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentChange = (studentId: number) => {
    setSelectedStudent(studentId);
    getFeedbackStudent(studentId);
  };

  useEffect(() => {
    if (idCourse) {
      getStudents();
    }
  }, [idCourse]);

  return (
    <Layout
      customToolbar={<CustomToolbar courseName={students?.[0]?.subject} />}
      title={students?.[0]?.subject}
    >
      <div className="feedback-container">
        <div className="student-selector">
          {selectedStudent > 0 && !isLoading && (
            <>
              <h2 className="section-title">Selecciona un estudiante</h2>

              <IonList className="select-list">
                <IonItem lines="none" className="select-item">
                  <IonSelect
                    interface="popover"
                    placeholder="Seleccione un alumno"
                    onIonChange={(e) => handleStudentChange(e.detail.value)}
                    value={selectedStudent}
                    className="student-select white-bg"
                    interfaceOptions={{
                      cssClass: 'select-interface-popover',
                    }}
                  >
                    {students.map((student) => (
                      <IonSelectOption
                        value={student.student_id}
                        key={student.student_id}
                        className="white-bg"
                      >
                        {student.first_name} {student.last_name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonList>
            </>
          )}
        </div>

        {isLoading && (
          <div className="loading-container">
            <IonSpinner name="crescent" />
          </div>
        )}

        {selectedStudent > 0 && !isLoading && (
          <>
            <FeedbackForm
              onSubmit={handleAddFeedback}
              isLoading={isSubmitting}
            />

            <div className="feedbacks-list">
              <h2 className="section-title">
                {feedbacks.length > 0
                  ? 'Feedbacks anteriores'
                  : 'No hay feedbacks para este estudiante'}
              </h2>

              {feedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  id={feedback.id}
                  detail={feedback.attributes.detail}
                  createdAt={feedback.attributes.created_at}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        {!isLoading && students.length === 0 && (
          <div className="empty-state">
            <h2>No hay alumnos disponibles para colocar feedback</h2>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FeedBack;
