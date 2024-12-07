import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './Layout.css'

type LayoutProps = {
  title: string;
  customToolbar?: React.JSX.Element;
}

const Layout = ({title, customToolbar, children}: React.PropsWithChildren<LayoutProps>) => {
  return (
    <>
    <IonPage>
      <IonHeader mode="ios">
        <IonToolbar mode="ios">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense" mode="ios">
          <IonToolbar>
            {customToolbar ? customToolbar : <IonTitle size="small">{title}</IonTitle>}
          </IonToolbar>
        </IonHeader>
        {children}
      </IonContent>
    </IonPage>
    </>
  )
}

export default Layout;