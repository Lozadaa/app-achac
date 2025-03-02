import React from 'react'
import { IonCard, IonIcon } from '@ionic/react'
import {
  arrowForwardOutline,
  checkmarkCircleOutline,
  chatbubblesOutline
} from 'ionicons/icons'

import './ActionCard.css'

type Props = {
  id: number
  title: string
  description: string
  backgroundColor?: string
  onClick?: () => void
}

const ActionCard: React.FC<Props> = ({
  id,
  title,
  description,
  backgroundColor = '#3880ff',
  onClick
}) => {
  // Choose icon based on id or title
  const getIcon = () => {
    if (id === 1 || title.includes('Asistencia')) {
      return checkmarkCircleOutline
    } else if (id === 2 || title.includes('Feedback')) {
      return chatbubblesOutline
    }
    return arrowForwardOutline
  }

  return (
    <IonCard className="action-card" onClick={onClick}>
      <div className="action-card-content" style={{ backgroundColor }}>
        <div className="action-card-icon">
          <IonIcon icon={getIcon()} />
        </div>
        <div className="action-card-text">
          <h3 className="action-card-title">{title}</h3>
          <p className="action-card-description">{description}</p>
        </div>
        <div className="action-card-arrow">
          <IonIcon icon={arrowForwardOutline} />
        </div>
      </div>
    </IonCard>
  )
}

export default ActionCard
