import { useState } from 'react';
import { IonButton, IonContent, IonPage, IonTextarea, useIonToast } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import Estado from '../../components/Estado';
import { claseDificultad } from '../../components/TarjetaRuta';
import { useDatos } from '../../hooks/useDatos';
import { obtenerPropuesta, revisarPropuesta } from '../../services/propuestasService';
import './Admin.css';

export default function DetallePropuesta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const propuesta = useDatos(() => obtenerPropuesta(Number(id)), null, [id]);

  async function responder(aprueba: boolean) {
    setEnviando(true);
    try {
      await revisarPropuesta(Number(id), aprueba, comentario);
      mostrarToast({
        message: aprueba ? 'Ruta aprobada y publicada en el mapa' : 'Ruta rechazada',
        duration: 2000,
        color: aprueba ? 'success' : undefined,
      });
      navigate('/admin/propuestas', { replace: true });
    } catch (error) {
      mostrarToast({ message: (error as Error).message, duration: 2500, color: 'danger' });
    }
    setEnviando(false);
  }

  if (!propuesta.datos) {
    return (
      <IonPage>
        <AppHeader titulo="Propuesta" volverA="/admin/propuestas" />
        <IonContent className="ion-padding">
          <Estado cargando={propuesta.cargando} error={propuesta.error} />
        </IonContent>
      </IonPage>
    );
  }

  const datos = propuesta.datos;

  return (
    <IonPage>
      <AppHeader titulo="Revisar propuesta" volverA="/admin/propuestas" />
      <IonContent className="ion-padding">
        <div className="admin-portada" />
        <h1 className="admin-titulo">{datos.nombre}</h1>
        <span className={claseDificultad(datos.dificultad)}>{datos.dificultad}</span>
        <p className="admin-bajada">Propuesta por {datos.autor}, {datos.cuando}</p>

        <div className="admin-panel">
          <h2>Información de la ruta</h2>
          <div className="admin-dato">
            <span>Ubicación</span>
            <span>{datos.ubicacion}</span>
          </div>
          <div className="admin-dato">
            <span>Distancia</span>
            <span>{datos.distancia ?? '-'} km</span>
          </div>
          <div className="admin-dato">
            <span>Duración</span>
            <span>{datos.duracion}</span>
          </div>
          <p>{datos.descripcion}</p>
        </div>

        {datos.estado === 'pendiente' ? (
          <>
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
              <IonButton fill="outline" color="danger" onClick={() => responder(false)} disabled={enviando}>Rechazar</IonButton>
              <IonButton onClick={() => responder(true)} disabled={enviando}>Aprobar</IonButton>
            </div>
          </>
        ) : (
          <p>Esta propuesta ya fue {datos.estado}.</p>
        )}
      </IonContent>
    </IonPage>
  );
}
