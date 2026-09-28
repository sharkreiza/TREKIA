import { IonBackButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import './AppHeader.css';

interface Props {
  titulo: string;
  volverA?: string;
}

export default function AppHeader({ titulo, volverA }: Props) {
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
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
