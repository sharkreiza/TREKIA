import { IonRouterOutlet } from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';
import Propuestas from '../pages/admin/Propuestas';
import DetallePropuesta from '../pages/admin/DetallePropuesta';

export default function RutasAdmin() {
  return (
    <IonRouterOutlet ionPage>
      <Route path="propuestas" element={<Propuestas />} />
      <Route path="propuestas/:id" element={<DetallePropuesta />} />
      <Route index element={<Navigate to="propuestas" replace />} />
    </IonRouterOutlet>
  );
}
