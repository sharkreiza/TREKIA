import { IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';

export default function DetalleGrupo() {
  const { id } = useParams();

  return (
    <IonPage>
      <AppHeader titulo="Detalle de grupo" volverA="/app/grupos" />
      <IonContent className="ion-padding">
        <p>Información del grupo {id} y solicitud para unirse.</p>
      </IonContent>
    </IonPage>
  );
}
