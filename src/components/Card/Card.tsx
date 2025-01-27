import React from 'react'
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';

import './Card.css';

type Props = {
  title: string;
  description: string;
  onClick?: () => void;
  backgroundColor?: string;
}

const Card = ({title, description, onClick, backgroundColor = 'transparent'}: Props) => {
  return (
    <IonCard onClick={onClick} >
      <div className='color-card' style={{ backgroundColor }} />
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
        <IonCardSubtitle>{description}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  )
}

export default Card