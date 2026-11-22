import { useState } from 'react';
import {
  IonButton, IonContent, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList,
  IonPage, IonSegment, IonSegmentButton, useIonToast,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import {
  checkmarkDoneOutline, closeCircleOutline, mapOutline, notificationsOutline, peopleOutline, personAddOutline, trashOutline,
} from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import Estado from '../../components/Estado';
import { useNotificaciones } from '../../context/NotificacionesContext';
import { useDatos } from '../../hooks/useDatos';
import {
  Notificacion, eliminarNotificacion, marcarLeida, marcarTodasLeidas, obtenerNotificaciones,
} from '../../services/notificacionesService';
import './Notificaciones.css';

const iconos: Record<string, string> = {
  solicitud_grupo: peopleOutline,
  respuesta_grupo: peopleOutline,
  grupo_cancelado: closeCircleOutline,
  amistad: personAddOutline,
  respuesta_amistad: personAddOutline,
  propuesta: mapOutline,
};

export default function Notificaciones() {
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();
  const { noLeidas, actualizar } = useNotificaciones();
  const [filtro, setFiltro] = useState('todas');

  const notificaciones = useDatos(() => obtenerNotificaciones(filtro === 'no-leidas'), [], [filtro]);

  function avisarError(error: unknown) {
    mostrarToast({ message: (error as Error).message, duration: 2500, color: 'danger' });
  }

  async function abrir(notificacion: Notificacion) {
    if (!notificacion.leida) {
      try {
        await marcarLeida(notificacion.id);
        actualizar();
      } catch (error) {
        avisarError(error);
      }
    }
    if (notificacion.enlace) {
      navigate(notificacion.enlace);
    } else {
      notificaciones.recargar();
    }
  }

  async function leerTodas() {
    try {
      await marcarTodasLeidas();
      notificaciones.setDatos(
        filtro === 'no-leidas' ? [] : notificaciones.datos.map((n) => ({ ...n, leida: true })),
      );
      actualizar();
    } catch (error) {
      avisarError(error);
    }
  }

  async function borrar(id: number) {
    try {
      await eliminarNotificacion(id);
      notificaciones.setDatos(notificaciones.datos.filter((n) => n.id !== id));
      actualizar();
    } catch (error) {
      avisarError(error);
    }
  }

  return (
    <IonPage>
      <AppHeader titulo="Notificaciones" />
      <IonContent className="ion-padding">
        <div className="notificaciones-encabezado">
          <h1>Notificaciones</h1>
          <IonButton fill="clear" size="small" onClick={leerTodas} disabled={noLeidas === 0}>
            <IonIcon slot="start" icon={checkmarkDoneOutline} />
            Marcar todas como leídas
          </IonButton>
        </div>

        <IonSegment value={filtro} onIonChange={(e) => setFiltro(String(e.detail.value))}>
          <IonSegmentButton value="todas">Todas</IonSegmentButton>
          <IonSegmentButton value="no-leidas">No leídas ({noLeidas})</IonSegmentButton>
        </IonSegment>

        <Estado cargando={notificaciones.cargando} error={notificaciones.error} reintentar={notificaciones.recargar} />

        {!notificaciones.cargando && !notificaciones.error && notificaciones.datos.length === 0 && (
          <div className="notificaciones-vacio">
            <IonIcon icon={notificationsOutline} />
            <p>{filtro === 'no-leidas' ? 'No tienes notificaciones sin leer.' : 'Todavía no tienes notificaciones.'}</p>
          </div>
        )}

        {!notificaciones.cargando && notificaciones.datos.length > 0 && (
          <IonList className="notificaciones-lista" lines="full">
            {notificaciones.datos.map((notificacion) => (
              <IonItemSliding key={notificacion.id}>
                <IonItem
                  button
                  detail={false}
                  className={notificacion.leida ? '' : 'notificacion-nueva'}
                  onClick={() => abrir(notificacion)}
                >
                  <IonIcon slot="start" icon={iconos[notificacion.tipo] ?? notificationsOutline} />
                  <IonLabel className="ion-text-wrap">
                    <p className="notificacion-mensaje">{notificacion.mensaje}</p>
                    <p className="notificacion-cuando">{notificacion.cuando}</p>
                  </IonLabel>
                  {!notificacion.leida && <span slot="end" className="notificacion-punto" aria-label="Sin leer" />}
                  <IonButton
                    slot="end"
                    fill="clear"
                    color="medium"
                    aria-label="Eliminar notificación"
                    onClick={(e) => {
                      e.stopPropagation();
                      borrar(notificacion.id);
                    }}
                  >
                    <IonIcon slot="icon-only" icon={trashOutline} />
                  </IonButton>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => borrar(notificacion.id)}>
                    Eliminar
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}
