import { useState } from 'react'
import { IonIcon } from '@ionic/react'
import {
  trashOutline,
  chevronDownOutline,
  chevronUpOutline
} from 'ionicons/icons'
import moment from 'moment'
import './FeedbackCard.css'

interface FeedbackCardProps {
  id: string
  detail: string
  createdAt: Date | string
  onDelete: (id: number) => void
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  id,
  detail,
  createdAt,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Determinar si el texto es largo y necesita truncarse
  const isLongText = detail.length > 100

  return (
    <div className={`feedback-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="feedback-card-header">
        <div className="feedback-date">
          <span className="feedback-date-label">Feedback del</span>
          <span className="feedback-date-value">
            {moment(createdAt).format('DD/MM/YYYY')}
          </span>
        </div>
        <button
          className="feedback-delete-btn"
          onClick={() => onDelete(Number(id))}
          aria-label="Eliminar feedback"
        >
          <IonIcon icon={trashOutline} />
        </button>
      </div>

      <div className="feedback-card-content">
        <p className={`feedback-text ${isExpanded ? 'expanded' : ''}`}>
          {detail}
        </p>

        {isLongText && (
          <button
            className="feedback-expand-btn"
            onClick={toggleExpand}
            aria-label={isExpanded ? 'Mostrar menos' : 'Mostrar más'}
          >
            <IonIcon
              icon={isExpanded ? chevronUpOutline : chevronDownOutline}
            />
            <span>{isExpanded ? 'Mostrar menos' : 'Mostrar más'}</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default FeedbackCard
