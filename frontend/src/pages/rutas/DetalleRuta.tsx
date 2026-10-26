import { useState } from 'react';
import { IonButton, IonContent, IonItem, IonLabel, IonList, IonPage, IonTextarea, useIonToast } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import Estado from '../../components/Estado';
import { claseDificultad } from '../../components/TarjetaRuta';
import { useAuth } from '../../context/AuthContext';
import { useDatos } from '../../hooks/useDatos';
import { comentar, eliminarComentario, obtenerComentarios, obtenerRuta } from '../../services/rutasService';
import { haceCuanto } from '../../utils/formatos';
import '../comunidad/Comunidad.css';

export default function DetalleRuta() {
  const { id } = useParams();
  const { user } = useAuth();
  const [mostrarToast] = useIonToast();
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  const ruta = useDatos(() => obtenerRuta(Number(id)), null, [id]);
  const comentarios = useDatos(() => obtenerComentarios(Number(id)), [], [id]);

  async function publicarComentario() {
    if (texto.trim() === '') {
      return;
    }
    setEnviando(true);
    try {
      const nuevo = await comentar(Number(id), texto);
      comentarios.setDatos([nuevo, ...comentarios.datos]);
      setTexto('');
    } catch (error) {
      mostrarToast({ message: (error as Error).message, duration: 2500, color: 'danger' });
    }
    setEnviando(false);
  }

  async function borrarComentario(comentarioId: number) {
    try {
      await eliminarComentario(comentarioId);
      comentarios.setDatos(comentarios.datos.filter((c) => c.id !== comentarioId));
    } catch (error) {
      mostrarToast({ message: (error as Error).message, duration: 2500, color: 'danger' });
    }
  }

  if (!ruta.datos) {
    return (
      <IonPage>
        <AppHeader titulo="Ruta" volverA="/app/rutas" />
        <IonContent className="ion-padding">
          <Estado cargando={ruta.cargando} error={ruta.error} />
        </IonContent>
      </IonPage>
    );
  }

  const datos = ruta.datos;

  return (
    <IonPage>
      <AppHeader titulo={datos.nombre} volverA="/app/rutas" />
      <IonContent className="ion-padding">
        <h1>{datos.nombre}</h1>
        <span className={claseDificultad(datos.dificultad)}>{datos.dificultad}</span>
        <p>{datos.descripcion}</p>

        <IonList>
          <IonItem>
            <IonLabel>Ubicación</IonLabel>
            <IonLabel slot="end">{datos.ubicacion}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Distancia</IonLabel>
            <IonLabel slot="end">{datos.distancia ?? '-'} km</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Desnivel</IonLabel>
            <IonLabel slot="end">{datos.desnivel ?? '-'} m</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Duración estimada</IonLabel>
            <IonLabel slot="end">{datos.duracion}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Tipo de ruta</IonLabel>
            <IonLabel slot="end">{datos.tipo}</IonLabel>
          </IonItem>
        </IonList>

        <IonButton className="ion-margin-top" routerLink={`/app/grupos?rutaId=${datos.id}`}>
          Ver grupos para esta ruta
        </IonButton>

        <h2>Comentarios</h2>
        <div className="publicacion">
          <IonTextarea
            fill="outline"
            autoGrow
            placeholder="Comparte tu experiencia, recomendaciones o advertencias"
            value={texto}
            onIonInput={(e) => setTexto(e.detail.value ?? '')}
          />
          <IonButton className="ion-margin-top" size="small" onClick={publicarComentario} disabled={enviando}>
            Comentar
          </IonButton>
        </div>

        <Estado cargando={comentarios.cargando} error={comentarios.error} />
        {!comentarios.cargando && comentarios.datos.length === 0 && <p>Todavía no hay comentarios.</p>}
        {comentarios.datos.map((comentario) => (
          <div className="publicacion" key={comentario.id}>
            <p className="publicacion-autor">{comentario.autor}</p>
            <p className="publicacion-cuando">{haceCuanto(comentario.fecha)}</p>
            <p>{comentario.contenido}</p>
            {(comentario.usuarioId === user?.id || user?.rol === 'administrador') && (
              <IonButton size="small" fill="clear" color="danger" onClick={() => borrarComentario(comentario.id)}>
                Eliminar
              </IonButton>
            )}
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
}
