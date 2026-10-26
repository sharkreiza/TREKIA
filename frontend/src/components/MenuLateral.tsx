import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle } from '@ionic/react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  add, chatbubblesOutline, documentTextOutline, exitOutline, homeOutline,
  mapOutline, peopleOutline, personCircleOutline,
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import './MenuLateral.css';

const opcionesUsuario = [
  { titulo: 'Inicio', url: '/app/inicio', icono: homeOutline },
  { titulo: 'Explorar rutas', url: '/app/rutas', icono: mapOutline },
  { titulo: 'Grupos de trekking', url: '/app/grupos', icono: peopleOutline },
  { titulo: 'Comunidad', url: '/app/comunidad', icono: chatbubblesOutline },
  { titulo: 'Cuenta', url: '/app/cuenta', icono: personCircleOutline },
];

const opcionesAdmin = [
  { titulo: 'Rutas propuestas', url: '/admin/propuestas', icono: documentTextOutline },
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
          lines="none"
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
        <div className="menu-logo">
          <img src="/assets/Logo_trekia.png" alt="Trekia" />
        </div>

        <IonList>
          {opcionesUsuario.map((o) => opcion(o.titulo, o.url, o.icono))}
        </IonList>

        <IonMenuToggle autoHide={false}>
          <IonButton className="menu-proponer" expand="block" routerLink="/app/propuesta" routerDirection="root">
            <IonIcon slot="start" icon={add} />
            Proponer ruta
          </IonButton>
        </IonMenuToggle>

        {user?.rol === 'administrador' && (
          <IonList>
            <IonListHeader>Administración</IonListHeader>
            {opcionesAdmin.map((o) => opcion(o.titulo, o.url, o.icono))}
          </IonList>
        )}

        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem button lines="none" detail={false} onClick={cerrarSesion}>
              <IonIcon slot="start" icon={exitOutline} />
              <IonLabel>Cerrar sesión</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
