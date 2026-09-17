import { IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';

export default function DetalleRuta() {
  const { id } = useParams();

  return (
    <IonPage>
      <AppHeader titulo="Detalle de ruta" volverA="/app/mapa" />
      <IonContent className="ion-padding">
        <p>Información y comentarios de la ruta {id}.</p>
      </IonContent>
    </IonPage>
  );
}
