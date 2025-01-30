import './Detail.css'
import { Layout } from '../../components/Layout'
import { useParams } from 'react-router'
import Card from '@/components/Card/Card'
import { IonIcon } from '@ionic/react'
import { arrowBackOutline } from 'ionicons/icons'

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

const CustomToolbar: React.FC<{ courseName: string }> = ({ courseName }) => {
  return (
    <div className="header-detail">
      <div className="image-name">
        <IonIcon
          src={arrowBackOutline}
          onClick={() => (window.location.href = '/home')}
        />
        <h1>{courseName}</h1>
        <div />
      </div>
      <p>Ver detalle del curso con la información relevante</p>
    </div>
  )
}

const Detail: React.FC = () => {
  const { id: idCourse } = useParams<{ id: string }>()
  const queryParams = new URLSearchParams(window.location.search)
  const courseName = queryParams.get('courseName') || ''

  const handleNavigate = (id: number) => {
    if (id === 1) {
      window.location.href = `/detail/${idCourse}/attendants`
    } else {
      window.location.href = `/detail/${idCourse}/feedback`
    }
  }

  return (
    <Layout
      customToolbar={<CustomToolbar courseName={courseName} />}
      title={courseName}
    >
      <div className="container">
        <h2 className="subtitle">Acciones rapidas:</h2>
        {QUICK_ACTIONS.map((card) => (
          <Card
            {...card}
            key={card.title}
            onClick={() => handleNavigate(card.id)}
          />
        ))}
      </div>
    </Layout>
  )
}

export default Detail
