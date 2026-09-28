import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';
import { chatbubblesOutline, homeOutline, mapOutline, peopleOutline, personCircleOutline } from 'ionicons/icons';

import Inicio from '../pages/inicio/Inicio';
import ExplorarRutas from '../pages/rutas/ExplorarRutas';
import DetalleRuta from '../pages/rutas/DetalleRuta';
import ProponerRuta from '../pages/rutas/ProponerRuta';
import Grupos from '../pages/grupos/Grupos';
import CrearGrupo from '../pages/grupos/CrearGrupo';
import DetalleGrupo from '../pages/grupos/DetalleGrupo';
import Comunidad from '../pages/comunidad/Comunidad';
import Cuenta from '../pages/cuenta/Cuenta';
import './tabs.css';

export default function Tabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="inicio" element={<Inicio />} />

        <Route path="rutas" element={<ExplorarRutas />} />
        <Route path="rutas/:id" element={<DetalleRuta />} />

        <Route path="grupos" element={<Grupos />} />
        <Route path="grupos/nuevo" element={<CrearGrupo />} />
        <Route path="grupos/:id" element={<DetalleGrupo />} />

        <Route path="comunidad" element={<Comunidad />} />

        <Route path="cuenta" element={<Cuenta />} />
        <Route path="cuenta/:userId" element={<Cuenta />} />

        <Route path="propuesta" element={<ProponerRuta />} />

        <Route index element={<Navigate to="inicio" replace />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="inicio" href="/app/inicio">
          <IonIcon icon={homeOutline} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>

        <IonTabButton tab="rutas" href="/app/rutas">
          <IonIcon icon={mapOutline} />
          <IonLabel>Rutas</IonLabel>
        </IonTabButton>

        <IonTabButton tab="grupos" href="/app/grupos">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Grupos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="comunidad" href="/app/comunidad">
          <IonIcon icon={chatbubblesOutline} />
          <IonLabel>Comunidad</IonLabel>
        </IonTabButton>

        <IonTabButton tab="cuenta" href="/app/cuenta">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Cuenta</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
