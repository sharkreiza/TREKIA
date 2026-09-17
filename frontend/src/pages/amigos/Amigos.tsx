import { IonButton, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonPage } from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function Amigos() {
  return (
    <IonPage>
      <AppHeader titulo="Amigos" />
      <IonContent className="ion-padding">
        <IonList>
          <IonListHeader>Solicitudes de amistad</IonListHeader>
          <IonItem>
            <IonLabel>valentina_eco</IonLabel>
            <IonButton size="small">Aceptar</IonButton>
            <IonButton size="small" fill="outline" color="medium">Rechazar</IonButton>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>Mis amigos</IonListHeader>
          <IonItem routerLink="/app/perfil/3">
            <IonLabel>pedro_cerros</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
