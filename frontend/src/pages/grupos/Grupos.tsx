import { IonButton, IonContent, IonPage } from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function Grupos() {
  return (
    <IonPage>
      <AppHeader titulo="Grupos" />
      <IonContent className="ion-padding">
        <p>Lista de grupos de trekking.</p>
        <IonButton routerLink="/app/grupos/nuevo">Crear grupo</IonButton>
      </IonContent>
    </IonPage>
  );
}
