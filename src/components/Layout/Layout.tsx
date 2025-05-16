import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import { RefresherEventDetail } from '@ionic/core'

import './Layout.css'

type LayoutProps = {
  title: string
  customToolbar?: React.JSX.Element
  onRefresh?: () => Promise<void>
}

const Layout = ({
  title,
  customToolbar,
  children,
  onRefresh
}: React.PropsWithChildren<LayoutProps>) => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    try {
      if (onRefresh) {
        await onRefresh()
      }
    } finally {
      event.detail.complete()
    }
  }

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
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>

          <IonHeader collapse="condense" mode="ios">
            <IonToolbar>
              {customToolbar ? (
                customToolbar
              ) : (
                <IonTitle size="small">{title}</IonTitle>
              )}
            </IonToolbar>
          </IonHeader>
          {children}
        </IonContent>
      </IonPage>
    </>
  )
}

export default Layout
