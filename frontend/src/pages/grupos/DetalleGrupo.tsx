import { IonButton, IonContent, IonPage, useIonToast } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import Estado from '../../components/Estado';
import { claseDificultad } from '../../components/TarjetaRuta';
import { useAuth } from '../../context/AuthContext';
import { useDatos } from '../../hooks/useDatos';
import {
  Solicitud, obtenerGrupo, obtenerMisSolicitudes, obtenerSolicitudesGrupo, responderSolicitud, solicitarParticipacion,
} from '../../services/gruposService';
import { capitalizar } from '../../utils/formatos';
import '../comunidad/Comunidad.css';

export default function DetalleGrupo() {
  const { id } = useParams();
  const { user } = useAuth();
  const [mostrarToast] = useIonToast();

  const grupo = useDatos(() => obtenerGrupo(Number(id)), null, [id]);
  const misSolicitudes = useDatos(obtenerMisSolicitudes, []);
  const esCreador = grupo.datos !== null && grupo.datos.creadorId === user?.id;
  const puedeGestionar = esCreador || user?.rol === 'administrador';

  const solicitudes = useDatos<Solicitud[]>(
    () => (puedeGestionar ? obtenerSolicitudesGrupo(Number(id)) : Promise.resolve([])),
    [],
    [id, puedeGestionar],
  );

  const miSolicitud = misSolicitudes.datos.find((s) => s.grupoId === Number(id));

  async function solicitar() {
    try {
      await solicitarParticipacion(Number(id));
      mostrarToast({ message: 'Enviamos tu solicitud al creador del grupo', duration: 2000, color: 'success' });
      misSolicitudes.recargar();
    } catch (error) {
      mostrarToast({ message: (error as Error).message, duration: 2500, color: 'danger' });
    }
  }

  async function responder(solicitud: Solicitud, acepta: boolean) {
    try {
      await responderSolicitud(Number(id), solicitud.id, acepta);
      mostrarToast({
        message: acepta ? `${solicitud.usuario} ahora es parte del grupo` : 'Solicitud rechazada',
        duration: 2000,
        color: acepta ? 'success' : undefined,
      });
      solicitudes.recargar();
      grupo.recargar();
    } catch (error) {
      mostrarToast({ message: (error as Error).message, duration: 2500, color: 'danger' });
    }
  }

  if (!grupo.datos) {
    return (
      <IonPage>
        <AppHeader titulo="Grupo" volverA="/app/grupos" />
        <IonContent className="ion-padding">
          <Estado cargando={grupo.cargando} error={grupo.error} />
        </IonContent>
      </IonPage>
    );
  }

  const datos = grupo.datos;
  const completo = datos.participantes >= datos.cupos;

  return (
    <IonPage>
      <AppHeader titulo={datos.nombre} volverA="/app/grupos" />
      <IonContent className="ion-padding">
        <h1>{datos.nombre}</h1>
        <span className={claseDificultad(datos.dificultad)}>{datos.dificultad}</span>
        <p>Ruta: {datos.rutaNombre}</p>
        <p>{datos.descripcion}</p>
        <p>{datos.fecha}, {datos.hora}</p>
        <p>{datos.participantes} de {datos.cupos} participantes</p>
        {datos.estado !== 'abierto' && <p>Este grupo está {datos.estado}.</p>}

        {!esCreador && (
          miSolicitud ? (
            <p>Estado de tu solicitud: <strong>{capitalizar(miSolicitud.estado)}</strong></p>
          ) : (
            datos.estado === 'abierto' && !completo && (
              <IonButton onClick={solicitar}>Solicitar participación</IonButton>
            )
          )
        )}

        {puedeGestionar && (
          <div className="comunidad-panel ion-margin-top">
            <h2>Solicitudes de participación</h2>
            <Estado cargando={solicitudes.cargando} error={solicitudes.error} />
            {!solicitudes.cargando && solicitudes.datos.length === 0 && <p>Todavía no hay solicitudes.</p>}
            {solicitudes.datos.map((solicitud) => (
              <div className="comunidad-fila" key={solicitud.id}>
                <div className="comunidad-fila-info">
                  <p className="nombre">{solicitud.usuario}</p>
                  <p>{capitalizar(solicitud.estado)}</p>
                </div>
                {solicitud.estado === 'pendiente' && (
                  <>
                    <IonButton size="small" onClick={() => responder(solicitud, true)}>Aceptar</IonButton>
                    <IonButton size="small" fill="outline" onClick={() => responder(solicitud, false)}>Rechazar</IonButton>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
