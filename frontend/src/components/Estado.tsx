import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { cloudOfflineOutline } from 'ionicons/icons';

interface Props {
  cargando: boolean;
  error: string;
  sinConexion?: boolean;
  reintentar?: () => void;
}

export default function Estado({ cargando, error, sinConexion, reintentar }: Props) {
  if (cargando) {
    return (
      <div className="ion-text-center ion-padding">
        <IonSpinner name="crescent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ion-padding-vertical">
        <p className="auth-error">{error}</p>
        {reintentar && <IonButton size="small" fill="outline" onClick={reintentar}>Reintentar</IonButton>}
      </div>
    );
  }

  if (sinConexion) {
    return (
      <div className="aviso-sin-conexion" role="status">
        <IonIcon icon={cloudOfflineOutline} />
        <span>Sin conexión. Estás viendo los datos guardados en este dispositivo.</span>
        {reintentar && <IonButton size="small" fill="clear" onClick={reintentar}>Reintentar</IonButton>}
      </div>
    );
  }

  return null;
}
