import { IonRouterOutlet } from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';
import { paginaDiferida } from './paginaDiferida';

const Propuestas = paginaDiferida(() => import('../pages/admin/Propuestas'));
const DetallePropuesta = paginaDiferida(() => import('../pages/admin/DetallePropuesta'));

export default function RutasAdmin() {
  return (
    <IonRouterOutlet ionPage>
      <Route path="propuestas" element={<Propuestas />} />
      <Route path="propuestas/:id" element={<DetallePropuesta />} />
      <Route index element={<Navigate to="propuestas" replace />} />
    </IonRouterOutlet>
  );
}
