import './Home.css'
import { Layout } from '../../components/Layout'
import { useUser } from '@/hooks/useUser'
import {
  IonAvatar,
  IonIcon,
  IonSpinner,
  IonText,
  IonRippleEffect,
  useIonRouter
} from '@ionic/react'
import { UserResponse } from '@/types/Auth'
import Card from '@/components/Card/Card'
import { useEffect, useState } from 'react'
import { CourseList } from '@/types/Courses'
import { getClosestCourses } from '@/utils/dataMappers'
import emptyImage from '@/assets/empty.png'
import { calendarOutline, schoolOutline } from 'ionicons/icons'
import { useNetwork } from '@/components/NetworkStatusProvider/NetworkStatusProvider'
import OfflineNotification from '@/components/OfflineNotification/OfflineNotification'
import { useOfflineData } from '@/hooks/useOfflineData'

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
  const { isOnline } = useNetwork()
  const router = useIonRouter()

  // Usar el hook para obtener los cursos
  const { data, loading, error } = useOfflineData<CourseList>({
    url: '/teacher/courses',
    dataTransform: (responseData) => getClosestCourses(responseData.data),
    initialData: []
  })

  const navigateToDetail = (id: string, courseName: string) => {
    router.push(`/detail/${id}?courseName=${courseName}`)
    localStorage.setItem('courseName', courseName)
  }

  return (
    <Layout customToolbar={<CustomToolbar user={user} />} title="Inicio">
      <div className="container">
        <OfflineNotification />

        <h2 className="subtitle">
          <IonIcon icon={calendarOutline} /> Tus cursos activos
        </h2>

        {loading && (
          <div className="loading-spinner">
            <IonSpinner name="crescent" />
          </div>
        )}

        {!loading && !error && data?.length === 0 && (
          <div className="empty-container ion-activatable">
            <IonRippleEffect />
            <img src={emptyImage} alt="No hay cursos" />
            <IonText color="medium">
              <h2>No tienes cursos activos</h2>
              <p>Los cursos que agregues aparecerán aquí</p>
            </IonText>
          </div>
        )}

        {!loading && !error && data && data.length > 0 && (
          <div className="courses-grid">
            {data.map((item) => (
              <div className="course-card" key={item.id}>
                <Card
                  title={item.attributes.course_name}
                  description={''}
                  backgroundColor={item.attributes.course_color ?? '#222D3A'}
                  start_date={item.attributes.start_date}
                  headquarters_name={item.attributes.headquarter_name}
                  subject_name={item.attributes.subject_name}
                  onClick={() =>
                    navigateToDetail(
                      item.attributes.id.toString(),
                      item.attributes.course_name
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="empty-container">
            <IonIcon icon={schoolOutline} size="large" color="medium" />
            <IonText color="medium">
              <p>Ocurrió un error al cargar los cursos</p>
              <p>
                {!isOnline
                  ? 'No hay datos en caché. Conéctate a internet para cargar los cursos.'
                  : 'Por favor, intenta nuevamente'}
              </p>
            </IonText>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Home
