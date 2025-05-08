import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonText
} from '@ionic/react'

import { useLocation } from 'react-router-dom'
import {
  homeOutline,
  bookOutline,
  logOutOutline,
  gridOutline,
  peopleOutline,
  calendarOutline,
  settingsOutline
} from 'ionicons/icons'
import './Menu.css'
import { useUser } from '@/hooks/useUser'
import NetworkStatus from '../NetworkStatus/NetworkStatus'

interface AppPage {
  url: string
  icon: string
  title: string
}

const appPages: AppPage[] = [
  {
    title: 'Inicio',
    url: '/home',
    icon: homeOutline
  }
  // {
  //   title: 'Cursos',
  //   url: '/courses',
  //   icon: bookOutline
  // },
  // {
  //   title: 'Calendario',
  //   url: '/calendar',
  //   icon: calendarOutline
  // },
  // {
  //   title: 'Estudiantes',
  //   url: '/students',
  //   icon: peopleOutline
  // },
  // {
  //   title: 'Recursos',
  //   url: '/resources',
  //   icon: gridOutline
  // },
  // {
  //   title: 'Configuración',
  //   url: '/settings',
  //   icon: settingsOutline
  // }
]

const Menu: React.FC = () => {
  const location = useLocation()
  const { logout, user } = useUser()

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <div className="menu-header">
          <div className="menu-header-content">
            <h1 className="menu-title">ACHAC</h1>
            <p className="menu-subtitle">Portal del Profesor</p>
          </div>
        </div>

        <div className="menu-content">
          <IonList>
            {appPages.map((appPage, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? 'selected' : ''
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon slot="start" icon={appPage.icon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>

          <div className="network-status-wrapper">
            <NetworkStatus />
          </div>

          <div className="menu-footer">
            <IonMenuToggle autoHide={false}>
              <IonItem
                className="logout-button"
                onClick={() => logout()}
                lines="none"
                detail={false}
              >
                <IonIcon slot="start" icon={logOutOutline} />
                <IonLabel>Cerrar sesión</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </div>
        </div>
      </IonContent>
    </IonMenu>
  )
}

export default Menu
