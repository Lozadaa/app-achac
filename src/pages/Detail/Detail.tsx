import './Detail.css'
import { Layout } from '../../components/Layout'
import { useParams } from 'react-router'
import ActionCard from '@/components/ActionCard/ActionCard'
import { IonIcon, useIonRouter } from '@ionic/react'
import { arrowBackOutline } from 'ionicons/icons'
import { useNetwork } from '@/components/NetworkStatusProvider/NetworkStatusProvider'
import OfflineNotification from '@/components/OfflineNotification/OfflineNotification'

const QUICK_ACTIONS = [
  {
    id: 1,
    title: 'Asistencias',
    description: 'Accionar las asistencias del curso',
    backgroundColor: '#0a4aa3'
  },
  {
    id: 2,
    title: 'Feedback',
    description: 'Accionar feedback de los alumnos',
    backgroundColor: '#32a852'
  }
]

const CustomToolbar: React.FC<{ courseName: string; onBack: () => void }> = ({
  courseName,
  onBack
}) => {
  return (
    <div className="header-detail">
      <div className="toolbar-container">
        <div className="back-button" onClick={onBack}>
          <IonIcon icon={arrowBackOutline} />
        </div>
        <div className="course-info">
          <h1>{courseName}</h1>
          <div className="course-subtitle">Información del curso</div>
        </div>
      </div>
    </div>
  )
}

const Detail: React.FC = () => {
  const { id: idCourse } = useParams<{ id: string }>()
  const router = useIonRouter()
  const { isOnline } = useNetwork()
  const queryParams = new URLSearchParams(window.location.search)
  const courseName = queryParams.get('courseName') || ''

  const handleNavigate = (id: number) => {
    if (id === 1) {
      router.push(`/detail/${idCourse}/attendants`)
    } else {
      router.push(`/detail/${idCourse}/feedback`)
    }
  }

  const handleBack = () => {
    router.push('/home')
  }

  return (
    <Layout
      customToolbar={
        <CustomToolbar courseName={courseName} onBack={handleBack} />
      }
      title={courseName}
    >
      <div className="container">
        <OfflineNotification />

        <h2 className="subtitle">Acciones rápidas:</h2>
        {QUICK_ACTIONS.map((action) => (
          <ActionCard
            key={action.id}
            id={action.id}
            title={action.title}
            description={action.description}
            backgroundColor={action.backgroundColor}
            onClick={() => handleNavigate(action.id)}
          />
        ))}
      </div>
    </Layout>
  )
}

export default Detail
