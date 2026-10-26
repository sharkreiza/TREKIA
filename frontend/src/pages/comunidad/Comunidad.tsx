import { useState } from 'react';
import { IonButton, IonContent, IonPage, IonSegment, IonSegmentButton, IonTextarea, useIonToast } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import Estado from '../../components/Estado';
import { useAuth } from '../../context/AuthContext';
import { useDatos } from '../../hooks/useDatos';
import {
  SolicitudAmistad, eliminarPublicacion, obtenerAmigos, obtenerPublicaciones, obtenerSolicitudesAmistad,
  publicar, responderSolicitudAmistad,
} from '../../services/comunidadService';
import { proximosGrupos } from '../../services/gruposService';
import { diaYMes } from '../../utils/formatos';
import './Comunidad.css';

export default function Comunidad() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mostrarToast] = useIonToast();
  const [pestana, setPestana] = useState('publicaciones');
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  const publicaciones = useDatos(obtenerPublicaciones, []);
  const solicitudes = useDatos(obtenerSolicitudesAmistad, []);
  const amigos = useDatos(obtenerAmigos, []);
  const grupos = useDatos(proximosGrupos, []);

  function avisarError(error: unknown) {
    mostrarToast({ message: (error as Error).message, duration: 2500, color: 'danger' });
  }

  async function enviarPublicacion() {
    if (texto.trim() === '') {
      return;
    }
    setEnviando(true);
    try {
      const nueva = await publicar(texto);
      publicaciones.setDatos([nueva, ...publicaciones.datos]);
      setTexto('');
    } catch (error) {
      avisarError(error);
    }
    setEnviando(false);
  }

  async function borrarPublicacion(id: number) {
    try {
      await eliminarPublicacion(id);
      publicaciones.setDatos(publicaciones.datos.filter((p) => p.id !== id));
    } catch (error) {
      avisarError(error);
    }
  }

  async function responder(solicitud: SolicitudAmistad, acepta: boolean) {
    try {
      await responderSolicitudAmistad(solicitud.id, acepta);
      solicitudes.setDatos(solicitudes.datos.filter((s) => s.id !== solicitud.id));
      if (acepta) {
        amigos.recargar();
      }
      mostrarToast({
        message: acepta ? `Ahora eres amigo de ${solicitud.nombre}` : 'Solicitud rechazada',
        duration: 2000,
        color: acepta ? 'success' : undefined,
      });
    } catch (error) {
      avisarError(error);
    }
  }

  function filaGrupo(grupo: (typeof grupos.datos)[number], conBoton: boolean) {
    const { dia, mes } = diaYMes(grupo.fechaSalida);
    return (
      <div className="comunidad-fila" key={grupo.id}>
        <div className="evento-fecha">
          {dia}
          <br />
          {mes}
        </div>
        <div className="comunidad-fila-info">
          <p className="nombre">{grupo.nombre}</p>
          <p>{grupo.participantes}/{grupo.cupos} participantes</p>
        </div>
        {conBoton && (
          <IonButton size="small" fill="outline" onClick={() => navigate(`/app/grupos/${grupo.id}`)}>Ver</IonButton>
        )}
      </div>
    );
  }

  return (
    <IonPage>
      <AppHeader titulo="Comunidad" />
      <IonContent className="ion-padding">
        <section className="comunidad-hero">
          <h1>Comunidad Trekia</h1>
          <p>Conecta con personas que comparten tu pasión por la naturaleza.</p>
        </section>

        <IonSegment className="ion-margin-top" value={pestana} onIonChange={(e) => setPestana(String(e.detail.value))}>
          <IonSegmentButton value="publicaciones">Publicaciones</IonSegmentButton>
          <IonSegmentButton value="grupos">Grupos</IonSegmentButton>
          <IonSegmentButton value="eventos">Eventos</IonSegmentButton>
        </IonSegment>

        <div className="comunidad-columnas">
          <div>
            {pestana === 'publicaciones' && (
              <>
                <div className="publicacion">
                  <IonTextarea
                    fill="outline"
                    autoGrow
                    placeholder="¿Qué quieres compartir con la comunidad?"
                    value={texto}
                    onIonInput={(e) => setTexto(e.detail.value ?? '')}
                  />
                  <IonButton className="ion-margin-top" size="small" onClick={enviarPublicacion} disabled={enviando}>
                    Publicar
                  </IonButton>
                </div>

                <Estado cargando={publicaciones.cargando} error={publicaciones.error} reintentar={publicaciones.recargar} />
                {publicaciones.datos.map((publicacion) => (
                  <div className="publicacion" key={publicacion.id}>
                    <p className="publicacion-autor" onClick={() => navigate(`/app/cuenta/${publicacion.usuarioId}`)}>
                      {publicacion.autor}
                    </p>
                    <p className="publicacion-cuando">{publicacion.cuando}</p>
                    <p>{publicacion.texto}</p>
                    {(publicacion.usuarioId === user?.id || user?.rol === 'administrador') && (
                      <IonButton size="small" fill="clear" color="danger" onClick={() => borrarPublicacion(publicacion.id)}>
                        Eliminar
                      </IonButton>
                    )}
                  </div>
                ))}
              </>
            )}

            {pestana === 'grupos' && (
              <div className="comunidad-panel">
                <h2>Grupos de trekking abiertos</h2>
                <Estado cargando={grupos.cargando} error={grupos.error} reintentar={grupos.recargar} />
                {!grupos.cargando && grupos.datos.length === 0 && <p>No hay grupos abiertos.</p>}
                {grupos.datos.map((grupo) => (
                  <div className="comunidad-fila" key={grupo.id}>
                    <div className="comunidad-fila-info">
                      <p className="nombre">{grupo.nombre}</p>
                      <p>{grupo.rutaNombre}, {grupo.participantes}/{grupo.cupos} participantes</p>
                    </div>
                    <IonButton size="small" fill="outline" onClick={() => navigate(`/app/grupos/${grupo.id}`)}>Unirse</IonButton>
                  </div>
                ))}
              </div>
            )}

            {pestana === 'eventos' && (
              <div className="comunidad-panel">
                <h2>Próximos eventos</h2>
                <Estado cargando={grupos.cargando} error={grupos.error} reintentar={grupos.recargar} />
                {!grupos.cargando && grupos.datos.length === 0 && <p>No hay salidas programadas.</p>}
                {grupos.datos.map((grupo) => filaGrupo(grupo, true))}
              </div>
            )}
          </div>

          <div>
            <div className="comunidad-panel">
              <h2>Solicitudes de amistad</h2>
              <Estado cargando={solicitudes.cargando} error={solicitudes.error} />
              {!solicitudes.cargando && solicitudes.datos.length === 0 && <p>No tienes solicitudes pendientes.</p>}
              {solicitudes.datos.map((solicitud) => (
                <div className="comunidad-fila" key={solicitud.id}>
                  <div className="comunidad-fila-info">
                    <p className="nombre" onClick={() => navigate(`/app/cuenta/${solicitud.usuarioId}`)}>{solicitud.nombre}</p>
                    <p>{solicitud.cuando}</p>
                  </div>
                  <IonButton size="small" onClick={() => responder(solicitud, true)}>Aceptar</IonButton>
                  <IonButton size="small" fill="outline" onClick={() => responder(solicitud, false)}>Rechazar</IonButton>
                </div>
              ))}
            </div>

            <div className="comunidad-panel">
              <h2>Mis amigos</h2>
              <Estado cargando={amigos.cargando} error={amigos.error} />
              {!amigos.cargando && amigos.datos.length === 0 && <p>Todavía no tienes amigos agregados.</p>}
              {amigos.datos.map((amigo) => (
                <div className="comunidad-fila" key={amigo.idAmistad} onClick={() => navigate(`/app/cuenta/${amigo.id}`)}>
                  <div className="comunidad-fila-info">
                    <p className="nombre">{amigo.nombre}</p>
                    <p>{amigo.ubicacion ?? 'Sin ubicación'}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="comunidad-panel">
              <h2>Próximos eventos</h2>
              {grupos.datos.slice(0, 3).map((grupo) => filaGrupo(grupo, false))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
