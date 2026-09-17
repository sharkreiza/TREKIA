import { IonBackButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';

interface Props {
  titulo: string;
  volverA?: string;
}

export default function AppHeader({ titulo, volverA }: Props) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          {volverA ? <IonBackButton defaultHref={volverA} text="" /> : <IonMenuButton />}
        </IonButtons>
        <IonTitle>{titulo}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
}
