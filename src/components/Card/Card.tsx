import { IonCard, IonCardHeader, IonCardSubtitle, IonIcon } from '@ionic/react'
import { locationOutline, bookOutline, calendarOutline } from 'ionicons/icons'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import './Card.css'

type Props = {
  title: string
  description: string
  onClick?: () => void

  start_date?: string
  headquarters_name?: string
  subject_name?: string
  end_date?: string
}

const Card = ({
  title,
  description,
  onClick,

  start_date,
  headquarters_name,
  subject_name
}: Props) => {
  // Format the date if it exists
  const formattedTime = start_date
    ? format(new Date(start_date), 'HH:mm', { locale: es })
    : null

  // Format the date in DD/MM/YYYY format
  const formattedDate = start_date
    ? format(new Date(start_date), 'dd/MM/yyyy', { locale: es })
    : null

  return (
    <IonCard onClick={onClick}>
      <div className="card-content">
        <div className="color-card " />

        <div className="card-header">
          <div className="card-title-row">
            <h3 className="card-title">{title}</h3>
            {formattedTime && (
              <span className="card-time">{formattedTime}</span>
            )}
          </div>

          <div className="card-info">
            {headquarters_name && (
              <div className="card-info-item">
                <IonIcon icon={locationOutline} />
                <span>{headquarters_name}</span>
              </div>
            )}

            {subject_name && (
              <div className="card-info-item">
                <IonIcon icon={bookOutline} />
                <span>{subject_name}</span>
              </div>
            )}

            {formattedDate && (
              <div className="card-info-item">
                <IonIcon icon={calendarOutline} />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        </div>

        {description && (
          <IonCardHeader>
            <IonCardSubtitle>{description}</IonCardSubtitle>
          </IonCardHeader>
        )}
      </div>
    </IonCard>
  )
}

export default Card
