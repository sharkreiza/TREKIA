import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';

export default function Perfil() {
  const { userId } = useParams();
  const { user } = useAuth();

  if (!userId) {
    return (
      <IonPage>
        <AppHeader titulo="Mi perfil" />
        <IonContent className="ion-padding">
          <p>Perfil de {user?.nombre}.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader titulo="Perfil" volverA="/app/amigos" />
      <IonContent className="ion-padding">
        <p>Perfil del usuario {userId}.</p>
        <IonButton>Enviar solicitud de amistad</IonButton>
      </IonContent>
    </IonPage>
  );
}
