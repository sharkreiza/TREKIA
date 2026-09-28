import { IonButton, IonContent, IonPage, IonTextarea, useIonToast } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { claseDificultad } from '../../components/TarjetaRuta';
import { obtenerPropuesta } from '../../services/propuestasService';
import './Admin.css';

export default function DetallePropuesta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();
  const [comentario, setComentario] = useState('');

  const propuesta = obtenerPropuesta(Number(id));

  if (!propuesta) {
    return (
      <IonPage>
        <AppHeader titulo="Propuesta" volverA="/admin/propuestas" />
        <IonContent className="ion-padding">
          <p>No encontramos esta propuesta.</p>
        </IonContent>
      </IonPage>
    );
  }

  function responder(aprueba: boolean) {
    mostrarToast({
      message: aprueba ? 'Ruta aprobada y publicada en el mapa' : 'Ruta rechazada',
      duration: 2000,
      color: aprueba ? 'success' : undefined,
    });
    navigate('/admin/propuestas', { replace: true });
  }

  return (
    <IonPage>
      <AppHeader titulo="Revisar propuesta" volverA="/admin/propuestas" />
      <IonContent className="ion-padding">
        <div className="admin-portada" />
        <h1 className="admin-titulo">{propuesta.nombre}</h1>
        <span className={claseDificultad(propuesta.dificultad)}>{propuesta.dificultad}</span>
        <p className="admin-bajada">Propuesta por {propuesta.autor}, {propuesta.cuando}</p>

        <div className="admin-panel">
          <h2>Información de la ruta</h2>
          <div className="admin-dato">
            <span>Ubicación</span>
            <span>{propuesta.ubicacion}</span>
          </div>
          <div className="admin-dato">
            <span>Distancia</span>
            <span>{propuesta.distancia} km</span>
          </div>
          <div className="admin-dato">
            <span>Duración</span>
            <span>{propuesta.duracion}</span>
          </div>
          <p>{propuesta.descripcion}</p>
        </div>

        <div className="admin-panel">
          <h2>Comentario para el usuario</h2>
          <IonTextarea
            fill="outline"
            autoGrow
            placeholder="Cuéntale por qué apruebas o rechazas la ruta"
            value={comentario}
            onIonInput={(e) => setComentario(e.detail.value ?? '')}
          />
        </div>

        <div className="admin-botones">
          <IonButton fill="outline" color="danger" onClick={() => responder(false)}>Rechazar</IonButton>
          <IonButton onClick={() => responder(true)}>Aprobar</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
