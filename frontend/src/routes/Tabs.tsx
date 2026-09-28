import { IonRouterOutlet } from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';

import Inicio from '../pages/inicio/Inicio';
import ExplorarRutas from '../pages/rutas/ExplorarRutas';
import DetalleRuta from '../pages/rutas/DetalleRuta';
import ProponerRuta from '../pages/rutas/ProponerRuta';
import Grupos from '../pages/grupos/Grupos';
import CrearGrupo from '../pages/grupos/CrearGrupo';
import DetalleGrupo from '../pages/grupos/DetalleGrupo';
import Comunidad from '../pages/comunidad/Comunidad';
import Cuenta from '../pages/cuenta/Cuenta';

export default function Tabs() {
  return (
    <IonRouterOutlet ionPage>
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
  );
}
