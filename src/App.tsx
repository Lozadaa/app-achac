import { IonApp, IonLoading, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu/Menu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
//import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Home from './pages/Home/Home';
import { useEffect, useState } from 'react';
import Login from './pages/Login/Login';
import { getUser } from './utils/userUtils';

setupIonicReact();

const App: React.FC = () => {
  const [isUserLogged, setIsUserLogged] = useState<boolean | undefined>();

  useEffect(() => {
    const getDataLogged = async () => {
      const user = await getUser();
      setIsUserLogged(!!user);
    }

    getDataLogged();
  }, []);

  if (isUserLogged === undefined) {
    return (
      <IonApp>
        <IonLoading />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          {isUserLogged && <Menu />}
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to={isUserLogged ? "/home" : "/login"} />
            </Route>
            <Route path="/home" exact={true}>
              <Home />
            </Route>
            <Route path="/login" exact={true}>
              <Login />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
