import React from 'react'
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';

import './Card.css';

type Props = {
  title: string;
  description: string;
}

const Card = ({title, description}: Props) => {
  return (
    <IonCard>
      <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
        <IonCardSubtitle>{description}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  )
}

export default Card