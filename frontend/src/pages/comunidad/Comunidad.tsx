import { useState } from 'react';
import { IonButton, IonContent, IonPage, IonSegment, IonSegmentButton, IonTextarea, useIonToast } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import {
  obtenerEventos, obtenerGruposDestacados, obtenerPublicaciones, obtenerSolicitudes, Solicitud,
} from '../../services/comunidadService';
import './Comunidad.css';

export default function Comunidad() {
  const [mostrarToast] = useIonToast();
  const [pestana, setPestana] = useState('publicaciones');
  const [texto, setTexto] = useState('');
  const [publicaciones, setPublicaciones] = useState(obtenerPublicaciones());
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(obtenerSolicitudes());

  const gruposDestacados = obtenerGruposDestacados();
  const eventos = obtenerEventos();

  function publicar() {
    if (texto === '') {
      return;
    }

    setPublicaciones([
      { id: Date.now(), autor: 'Tú', cuando: 'recién', texto, likes: 0, comentarios: 0 },
      ...publicaciones,
    ]);
    setTexto('');
  }

  function responder(solicitud: Solicitud, acepta: boolean) {
    setSolicitudes(solicitudes.filter((s) => s.id !== solicitud.id));
    mostrarToast({
      message: acepta ? `Ahora eres amigo de ${solicitud.nombre}` : 'Solicitud rechazada',
      duration: 2000,
      color: acepta ? 'success' : undefined,
    });
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
                  <IonButton className="ion-margin-top" size="small" onClick={publicar}>Publicar</IonButton>
                </div>

                {publicaciones.map((publicacion) => (
                  <div className="publicacion" key={publicacion.id}>
                    <p className="publicacion-autor">{publicacion.autor}</p>
                    <p className="publicacion-cuando">{publicacion.cuando}</p>
                    <p>{publicacion.texto}</p>
                    <p className="publicacion-datos">
                      {publicacion.likes} me gusta, {publicacion.comentarios} comentarios
                    </p>
                  </div>
                ))}
              </>
            )}

            {pestana === 'grupos' && (
              <div className="comunidad-panel">
                <h2>Grupos de la comunidad</h2>
                {gruposDestacados.map((grupo) => (
                  <div className="comunidad-fila" key={grupo.id}>
                    <div className="comunidad-fila-info">
                      <p className="nombre">{grupo.nombre}</p>
                      <p>{grupo.miembros}</p>
                    </div>
                    <IonButton size="small" fill="outline">Unirse</IonButton>
                  </div>
                ))}
              </div>
            )}

            {pestana === 'eventos' && (
              <div className="comunidad-panel">
                <h2>Próximos eventos</h2>
                {eventos.map((evento) => (
                  <div className="comunidad-fila" key={evento.id}>
                    <div className="evento-fecha">
                      {evento.dia}
                      <br />
                      {evento.mes}
                    </div>
                    <div className="comunidad-fila-info">
                      <p className="nombre">{evento.nombre}</p>
                      <p>{evento.participantes} participantes</p>
                    </div>
                    <IonButton size="small" fill="outline">Inscribirme</IonButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="comunidad-panel">
              <h2>Solicitudes de amistad</h2>
              {solicitudes.length === 0 && <p>No tienes solicitudes pendientes.</p>}
              {solicitudes.map((solicitud) => (
                <div className="comunidad-fila" key={solicitud.id}>
                  <div className="comunidad-fila-info">
                    <p className="nombre">{solicitud.nombre}</p>
                    <p>{solicitud.detalle}</p>
                  </div>
                  <IonButton size="small" onClick={() => responder(solicitud, true)}>Aceptar</IonButton>
                  <IonButton size="small" fill="outline" onClick={() => responder(solicitud, false)}>Rechazar</IonButton>
                </div>
              ))}
            </div>

            <div className="comunidad-panel">
              <h2>Grupos destacados</h2>
              {gruposDestacados.map((grupo) => (
                <div className="comunidad-fila" key={grupo.id}>
                  <div className="comunidad-fila-info">
                    <p className="nombre">{grupo.nombre}</p>
                    <p>{grupo.miembros}</p>
                  </div>
                  <IonButton size="small" fill="outline">Unirse</IonButton>
                </div>
              ))}
            </div>

            <div className="comunidad-panel">
              <h2>Próximos eventos</h2>
              {eventos.map((evento) => (
                <div className="comunidad-fila" key={evento.id}>
                  <div className="evento-fecha">
                    {evento.dia}
                    <br />
                    {evento.mes}
                  </div>
                  <div className="comunidad-fila-info">
                    <p className="nombre">{evento.nombre}</p>
                    <p>{evento.participantes} participantes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
