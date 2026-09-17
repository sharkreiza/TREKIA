import { IonContent, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { obtenerRuta } from '../../services/rutasService';

export default function DetalleRuta() {
  const { id } = useParams();
  const ruta = obtenerRuta(Number(id));

  if (!ruta) {
    return (
      <IonPage>
        <AppHeader titulo="Ruta" volverA="/app/mapa" />
        <IonContent className="ion-padding">
          <p>No encontramos esta ruta.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader titulo={ruta.nombre} volverA="/app/mapa" />
      <IonContent className="ion-padding">
        <p>{ruta.descripcion}</p>
        <IonList>
          <IonItem>
            <IonLabel>Ubicación</IonLabel>
            <IonLabel slot="end">{ruta.ubicacion}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Dificultad</IonLabel>
            <IonLabel slot="end">{ruta.dificultad}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Distancia</IonLabel>
            <IonLabel slot="end">{ruta.distancia} km</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Duración estimada</IonLabel>
            <IonLabel slot="end">{ruta.duracion}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
