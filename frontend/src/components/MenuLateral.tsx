import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle } from '@ionic/react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  addCircle, documentText, exitOutline, home, people, peopleCircle, person, settings,
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import './MenuLateral.css';

const opcionesUsuario = [
  { titulo: 'Mapa', url: '/app/mapa', icono: home },
  { titulo: 'Grupos', url: '/app/grupos', icono: people },
  { titulo: 'Amigos', url: '/app/amigos', icono: peopleCircle },
  { titulo: 'Proponer ruta', url: '/app/propuesta', icono: addCircle },
  { titulo: 'Perfil', url: '/app/perfil', icono: person },
  { titulo: 'Configuración', url: '/app/configuracion', icono: settings },
];

const opcionesAdmin = [
  { titulo: 'Rutas propuestas', url: '/admin/propuestas', icono: documentText },
];

export default function MenuLateral() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function cerrarSesion() {
    logout();
    navigate('/login', { replace: true });
  }

  function opcion(titulo: string, url: string, icono: string) {
    return (
      <IonMenuToggle key={url} autoHide={false}>
        <IonItem
          routerLink={url}
          routerDirection="root"
          lines="inset"
          detail={false}
          className={location.pathname.startsWith(url) ? 'menu-activo' : ''}
        >
          <IonIcon slot="start" icon={icono} />
          <IonLabel>{titulo}</IonLabel>
        </IonItem>
      </IonMenuToggle>
    );
  }

  return (
    <IonMenu contentId="main" disabled={!user} className="menu-lateral">
      <IonContent>
        <IonList>
          {opcionesUsuario.map((o) => opcion(o.titulo, o.url, o.icono))}
        </IonList>

        {user?.rol === 'admin' && (
          <IonList>
            <IonListHeader>Administración</IonListHeader>
            {opcionesAdmin.map((o) => opcion(o.titulo, o.url, o.icono))}
          </IonList>
        )}

        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem button lines="inset" detail={false} onClick={cerrarSesion}>
              <IonIcon slot="start" icon={exitOutline} />
              <IonLabel>Cerrar sesión</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
