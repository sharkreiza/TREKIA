import { IonContent, IonPage } from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function ProponerRuta() {
  return (
    <IonPage>
      <AppHeader titulo="Proponer ruta" />
      <IonContent className="ion-padding">
        <p>Formulario para proponer una ruta nueva.</p>
      </IonContent>
    </IonPage>
  );
}
