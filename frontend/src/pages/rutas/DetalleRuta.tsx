import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { star } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import { claseDificultad } from '../../components/TarjetaRuta';
import { obtenerRuta } from '../../services/rutasService';

export default function DetalleRuta() {
  const { id } = useParams();
  const ruta = obtenerRuta(Number(id));

  if (!ruta) {
    return (
      <IonPage>
        <AppHeader titulo="Ruta" volverA="/app/rutas" />
        <IonContent className="ion-padding">
          <p>No encontramos esta ruta.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader titulo={ruta.nombre} volverA="/app/rutas" />
      <IonContent className="ion-padding">
        <span className={claseDificultad(ruta.dificultad)}>{ruta.dificultad}</span>
        <p>
          <IonIcon icon={star} color="warning" /> {ruta.puntuacion} ({ruta.resenas} reseñas)
        </p>
        <p>{ruta.descripcion}</p>

        <IonList>
          <IonItem>
            <IonLabel>Ubicación</IonLabel>
            <IonLabel slot="end">{ruta.ubicacion}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Distancia</IonLabel>
            <IonLabel slot="end">{ruta.distancia} km</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Desnivel</IonLabel>
            <IonLabel slot="end">{ruta.desnivel} m</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Duración estimada</IonLabel>
            <IonLabel slot="end">{ruta.duracion}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Tipo de ruta</IonLabel>
            <IonLabel slot="end">{ruta.tipo}</IonLabel>
          </IonItem>
        </IonList>

        <IonButton className="ion-margin-top" routerLink="/app/grupos">
          Ver grupos para esta ruta
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
