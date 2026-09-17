import { IonButton, IonContent, IonPage } from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function Registro() {
  return (
    <IonPage>
      <AppHeader titulo="Crear cuenta" volverA="/login" />
      <IonContent className="ion-padding">
        <p>Formulario de registro.</p>
        <IonButton fill="clear" routerLink="/login">Ya tengo cuenta</IonButton>
      </IonContent>
    </IonPage>
  );
}
