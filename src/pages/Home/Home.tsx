import './Home.css'
import { Layout } from '../../components/Layout'
import { useUser } from '@/hooks/useUser'
import {
  IonAvatar,
  IonIcon,
  IonSpinner,
  IonText,
  IonRippleEffect
} from '@ionic/react'
import { UserResponse } from '@/types/Auth'
import Card from '@/components/Card/Card'
import { useEffect, useState } from 'react'
import { axiosClient } from '@/utils/axios'
import { CourseList } from '@/types/Courses'
import { getClosestCourses } from '@/utils/dataMappers'
import emptyImage from '@/assets/empty.png'
import { calendarOutline, schoolOutline } from 'ionicons/icons'

const CustomToolbar: React.FC<{ user: UserResponse | null }> = ({ user }) => {
  return (
    <div className="header-home">
      <div className="image-name">
        <IonAvatar>
          <img
            alt="Imagen perfil"
            src={
              user?.photo_url ??
              'https://ionicframework.com/docs/img/demos/avatar.svg'
            }
          />
        </IonAvatar>
        <div>
          <IonText>
            <h1>¡Hola, {user?.name}!</h1>
          </IonText>
          <p>Bienvenido a tu espacio de aprendizaje</p>
        </div>
      </div>
    </div>
  )
}

const Home: React.FC = () => {
  const { user } = useUser()
  const [stateResponse, setStateResponse] = useState<
    'loading' | 'error' | 'success'
  >('success')
  const [courses, setCourses] = useState<CourseList>([])

  useEffect(() => {
    const getCoursersTeacher = async () => {
      setStateResponse('loading')
      try {
        const { data } = await axiosClient.get<any>('/teacher/courses')
        setStateResponse('success')
        const dataFormatter = getClosestCourses(data.data)
        return setCourses(dataFormatter)
      } catch (error) {
        console.error(error)
        setStateResponse('error')
      }
    }

    getCoursersTeacher()
  }, [])
  console.log('courses', courses)
  return (
    <Layout customToolbar={<CustomToolbar user={user} />} title="Inicio">
      <div className="container">
        <h2 className="subtitle">
          <IonIcon icon={calendarOutline} /> Tus cursos activos
        </h2>

        {stateResponse === 'loading' && (
          <div className="loading-spinner">
            <IonSpinner name="crescent" />
          </div>
        )}

        {stateResponse === 'success' && courses?.length === 0 && (
          <div className="empty-container ion-activatable">
            <IonRippleEffect />
            <img src={emptyImage} alt="No hay cursos" />
            <IonText color="medium">
              <h2>No tienes cursos activos</h2>
              <p>Los cursos que agregues aparecerán aquí</p>
            </IonText>
          </div>
        )}

        {stateResponse === 'success' && courses?.length > 0 && (
          <div className="courses-grid">
            {courses.map((item) => (
              <div className="course-card" key={item.id}>
                <Card
                  title={item.attributes.course_name}
                  description={''}
                  backgroundColor={item.attributes.course_color ?? '#222D3A'}
                  start_date={item.attributes.start_date}
                  headquarters_name={item.attributes.headquarter_name}
                  subject_name={item.attributes.subject_name}
                  onClick={() =>
                    (window.location.href = `/detail/${item.attributes.id}?courseName=${item.attributes.course_name}`)
                  }
                />
              </div>
            ))}
          </div>
        )}

        {stateResponse === 'error' && (
          <div className="empty-container">
            <IonIcon icon={schoolOutline} size="large" color="medium" />
            <IonText color="medium">
              <p>Ocurrió un error al cargar los cursos</p>
              <p>Por favor, intenta nuevamente</p>
            </IonText>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Home
