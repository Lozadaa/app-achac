import {
  IonContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, bookOutline, heartOutline, heartSharp, homeOutline, logOutOutline, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import { useUser } from '@/hooks/useUser';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Inicio',
    url: '/home',
    iosIcon: homeOutline,
    mdIcon: homeOutline
  },
  {
    title: 'Cursos',
    url: '/courses',
    iosIcon: bookOutline,
    mdIcon: bookOutline
  }
];

const Menu: React.FC = () => {
  const location = useLocation();
  const {logout} = useUser();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>ACHAC</IonListHeader>
          <IonNote>Aplicación de Profesores</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        <IonMenuToggle autoHide={false}>
          <IonItem onClick={() => logout()} routerDirection="none" lines="none" detail={false}>
            <IonIcon aria-hidden="true" slot="start" ios={logOutOutline} md={logOutOutline} />
            <IonLabel>Cerrar sesión</IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
