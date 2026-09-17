import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';
import { mapOutline, peopleOutline, peopleCircleOutline, personOutline } from 'ionicons/icons';

import Mapa from '../pages/rutas/Mapa';
import DetalleRuta from '../pages/rutas/DetalleRuta';
import ProponerRuta from '../pages/rutas/ProponerRuta';
import Grupos from '../pages/grupos/Grupos';
import CrearGrupo from '../pages/grupos/CrearGrupo';
import DetalleGrupo from '../pages/grupos/DetalleGrupo';
import Amigos from '../pages/amigos/Amigos';
import Perfil from '../pages/perfil/Perfil';
import Configuracion from '../pages/configuracion/Configuracion';
import './tabs.css';

export default function Tabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="mapa" element={<Mapa />} />
        <Route path="mapa/ruta/:id" element={<DetalleRuta />} />

        <Route path="grupos" element={<Grupos />} />
        <Route path="grupos/nuevo" element={<CrearGrupo />} />
        <Route path="grupos/:id" element={<DetalleGrupo />} />

        <Route path="amigos" element={<Amigos />} />

        <Route path="perfil" element={<Perfil />} />
        <Route path="perfil/:userId" element={<Perfil />} />

        <Route path="propuesta" element={<ProponerRuta />} />
        <Route path="configuracion" element={<Configuracion />} />

        <Route index element={<Navigate to="mapa" replace />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="mapa" href="/app/mapa">
          <IonIcon icon={mapOutline} />
          <IonLabel>Mapa</IonLabel>
        </IonTabButton>

        <IonTabButton tab="grupos" href="/app/grupos">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Grupos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="amigos" href="/app/amigos">
          <IonIcon icon={peopleCircleOutline} />
          <IonLabel>Amigos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="perfil" href="/app/perfil">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
