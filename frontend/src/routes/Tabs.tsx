import { IonRouterOutlet } from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';
import { paginaDiferida } from './paginaDiferida';

const Inicio = paginaDiferida(() => import('../pages/inicio/Inicio'));
const ExplorarRutas = paginaDiferida(() => import('../pages/rutas/ExplorarRutas'));
const DetalleRuta = paginaDiferida(() => import('../pages/rutas/DetalleRuta'));
const ProponerRuta = paginaDiferida(() => import('../pages/rutas/ProponerRuta'));
const Grupos = paginaDiferida(() => import('../pages/grupos/Grupos'));
const CrearGrupo = paginaDiferida(() => import('../pages/grupos/CrearGrupo'));
const DetalleGrupo = paginaDiferida(() => import('../pages/grupos/DetalleGrupo'));
const Comunidad = paginaDiferida(() => import('../pages/comunidad/Comunidad'));
const Cuenta = paginaDiferida(() => import('../pages/cuenta/Cuenta'));
const Notificaciones = paginaDiferida(() => import('../pages/notificaciones/Notificaciones'));

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

      <Route path="notificaciones" element={<Notificaciones />} />

      <Route index element={<Navigate to="inicio" replace />} />
    </IonRouterOutlet>
  );
}
