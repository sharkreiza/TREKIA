import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RutaPrivada, RutaPublica, paginaInicio } from './Proteccion';
import MenuLateral from '../components/MenuLateral';
import Tabs from './Tabs';
import RutasAdmin from './RutasAdmin';
import Login from '../pages/auth/Login';
import Registro from '../pages/auth/Registro';

export default function Rutas() {
  const { user } = useAuth();

  return (
    <IonSplitPane contentId="main" when="lg" disabled={!user}>
      <MenuLateral />

      <IonRouterOutlet id="main">
        <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
        <Route path="/registro" element={<RutaPublica><Registro /></RutaPublica>} />

        <Route path="/app/*" element={<RutaPrivada><Tabs /></RutaPrivada>} />

        <Route path="/admin/*" element={<RutaPrivada rol="admin"><RutasAdmin /></RutaPrivada>} />

        <Route path="/" element={<Navigate to={user ? paginaInicio(user.rol) : '/login'} replace />} />
      </IonRouterOutlet>
    </IonSplitPane>
  );
}
