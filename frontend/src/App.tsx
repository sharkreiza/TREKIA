import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './context/AuthContext';
import Rutas from './routes/Rutas';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <Rutas />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
}
