import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import {
  addCircleOutline, documentTextOutline, logOutOutline, mapOutline,
  peopleCircleOutline, peopleOutline, personOutline, settingsOutline,
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';

const opcionesUsuario = [
  { titulo: 'Mapa', url: '/app/mapa', icono: mapOutline },
  { titulo: 'Grupos', url: '/app/grupos', icono: peopleOutline },
  { titulo: 'Amigos', url: '/app/amigos', icono: peopleCircleOutline },
  { titulo: 'Proponer ruta', url: '/app/propuesta', icono: addCircleOutline },
  { titulo: 'Perfil', url: '/app/perfil', icono: personOutline },
  { titulo: 'Configuración', url: '/app/configuracion', icono: settingsOutline },
];

const opcionesAdmin = [
  { titulo: 'Rutas propuestas', url: '/admin/propuestas', icono: documentTextOutline },
];

export default function MenuLateral() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <IonMenu contentId="main" disabled={!user}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Trekia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {opcionesUsuario.map((opcion) => (
            <IonMenuToggle key={opcion.url} autoHide={false}>
              <IonItem routerLink={opcion.url} routerDirection="root" lines="none">
                <IonIcon slot="start" icon={opcion.icono} />
                <IonLabel>{opcion.titulo}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>

        {user?.rol === 'admin' && (
          <IonList>
            <IonListHeader>Administración</IonListHeader>
            {opcionesAdmin.map((opcion) => (
              <IonMenuToggle key={opcion.url} autoHide={false}>
                <IonItem routerLink={opcion.url} routerDirection="root" lines="none">
                  <IonIcon slot="start" icon={opcion.icono} />
                  <IonLabel>{opcion.titulo}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
        )}

        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem button lines="none" onClick={cerrarSesion}>
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Cerrar sesión</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
