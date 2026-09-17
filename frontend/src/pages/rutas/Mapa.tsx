import { IonButton, IonContent, IonPage } from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function Mapa() {
  return (
    <IonPage>
      <AppHeader titulo="Mapa" />
      <IonContent className="ion-padding">
        <p>Mapa con las rutas de trekking y filtros.</p>
        <IonButton routerLink="/app/mapa/ruta/1">Ver ruta de ejemplo</IonButton>
      </IonContent>
    </IonPage>
  );
}
