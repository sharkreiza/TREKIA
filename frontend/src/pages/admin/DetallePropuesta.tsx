import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';

export default function DetallePropuesta() {
  const { id } = useParams();

  return (
    <IonPage>
      <AppHeader titulo="Revisar propuesta" volverA="/admin/propuestas" />
      <IonContent className="ion-padding">
        <p>Propuesta {id}.</p>
        <IonButton color="success">Aprobar</IonButton>
        <IonButton color="danger" fill="outline">Rechazar</IonButton>
      </IonContent>
    </IonPage>
  );
}
