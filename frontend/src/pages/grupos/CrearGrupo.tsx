import { IonContent, IonPage } from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function CrearGrupo() {
  return (
    <IonPage>
      <AppHeader titulo="Crear grupo" volverA="/app/grupos" />
      <IonContent className="ion-padding">
        <p>Formulario para crear un grupo.</p>
      </IonContent>
    </IonPage>
  );
}
