import { IonButton, IonContent, IonPage } from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function Propuestas() {
  return (
    <IonPage>
      <AppHeader titulo="Rutas propuestas" />
      <IonContent className="ion-padding">
        <p>Rutas que los usuarios propusieron y falta revisar.</p>
        <IonButton routerLink="/admin/propuestas/1">Ver propuesta de ejemplo</IonButton>
      </IonContent>
    </IonPage>
  );
}
