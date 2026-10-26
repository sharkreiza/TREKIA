import { IonButton, IonSpinner } from '@ionic/react';

interface Props {
  cargando: boolean;
  error: string;
  reintentar?: () => void;
}

export default function Estado({ cargando, error, reintentar }: Props) {
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

  return null;
}
