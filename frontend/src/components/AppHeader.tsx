import { IonBackButton, IonBadge, IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import { useNotificaciones } from '../context/NotificacionesContext';
import './AppHeader.css';

interface Props {
  titulo: string;
  volverA?: string;
}

export default function AppHeader({ titulo, volverA }: Props) {
  const { noLeidas } = useNotificaciones();

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          {volverA && <IonBackButton defaultHref={volverA} text="Volver" />}
        </IonButtons>

        <IonTitle className="encabezado-titulo">
          <img className="encabezado-logo" src="/assets/Logo_trekia.png" alt={titulo} />
        </IonTitle>

        <IonButtons slot="end">
          <IonButton
            className="encabezado-campana"
            routerLink="/app/notificaciones"
            aria-label={noLeidas > 0 ? `Notificaciones, ${noLeidas} sin leer` : 'Notificaciones'}
          >
            <IonIcon slot="icon-only" icon={notificationsOutline} />
            {noLeidas > 0 && <IonBadge color="danger">{noLeidas > 9 ? '9+' : noLeidas}</IonBadge>}
          </IonButton>
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
