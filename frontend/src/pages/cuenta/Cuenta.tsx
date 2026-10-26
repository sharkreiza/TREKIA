import { useState } from 'react';
import {
  IonButton, IonChip, IonContent, IonIcon, IonInput, IonPage,
  IonSegment, IonSegmentButton, IonTextarea, useIonToast,
} from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { personCircle } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import Estado from '../../components/Estado';
import { claseDificultad } from '../../components/TarjetaRuta';
import { useAuth } from '../../context/AuthContext';
import { useDatos } from '../../hooks/useDatos';
import { actualizarPerfil, obtenerUsuario } from '../../services/authService';
import { enviarSolicitudAmistad } from '../../services/comunidadService';
import { obtenerGrupos, obtenerMisSolicitudes } from '../../services/gruposService';
import { obtenerPropuestas } from '../../services/propuestasService';
import { ErrorApi } from '../../services/api';
import { capitalizar } from '../../utils/formatos';
import '../inicio/Inicio.css';
import './Cuenta.css';

function PerfilAjeno({ id }: { id: number }) {
  const [mostrarToast] = useIonToast();
  const perfil = useDatos(() => obtenerUsuario(id), null, [id]);

  async function agregar() {
    try {
      await enviarSolicitudAmistad(id);
      mostrarToast({ message: 'Solicitud enviada', duration: 2000, color: 'success' });
    } catch (error) {
      mostrarToast({ message: (error as Error).message, duration: 2500, color: 'danger' });
    }
  }

  return (
    <IonPage>
      <AppHeader titulo="Perfil" volverA="/app/comunidad" />
      <IonContent className="ion-padding">
        <Estado cargando={perfil.cargando} error={perfil.error} />
        {perfil.datos && (
          <>
            <div className="cuenta-portada" />
            <div className="cuenta-cabecera">
              <div className="cuenta-avatar">
                <IonIcon icon={personCircle} />
              </div>
              <div>
                <h1 className="cuenta-nombre">{perfil.datos.nombre}</h1>
                <p className="cuenta-rol">{perfil.datos.ubicacion ?? 'Miembro de la comunidad'}</p>
              </div>
            </div>
            {perfil.datos.biografia && <p>{perfil.datos.biografia}</p>}
            <IonButton className="ion-margin-top" onClick={agregar}>
              Enviar solicitud de amistad
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}

export default function Cuenta() {
  const { userId } = useParams();
  const { user, actualizarUsuario } = useAuth();
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();

  const [pestana, setPestana] = useState('perfil');
  const [nombre, setNombre] = useState(user?.nombre ?? '');
  const [ubicacion, setUbicacion] = useState(user?.ubicacion ?? '');
  const [biografia, setBiografia] = useState(user?.biografia ?? '');
  const [error, setError] = useState('');

  const misGrupos = useDatos(() => obtenerGrupos({ creadorId: user?.id }), [], [user?.id]);
  const misSolicitudes = useDatos(obtenerMisSolicitudes, []);
  const misPropuestas = useDatos(() => obtenerPropuestas(), []);

  if (userId && Number(userId) !== user?.id) {
    return <PerfilAjeno id={Number(userId)} />;
  }

  const salidas = misSolicitudes.datos.filter((s) => s.estado === 'aceptada');

  async function guardar() {
    setError('');
    try {
      const actualizado = await actualizarPerfil({ nombre, ubicacion, biografia });
      actualizarUsuario(actualizado);
      mostrarToast({ message: 'Cambios guardados', duration: 2000, color: 'success' });
    } catch (e) {
      const campos = e instanceof ErrorApi ? Object.values(e.campos) : [];
      setError(campos.length > 0 ? campos.join('. ') : (e as Error).message);
    }
  }

  return (
    <IonPage>
      <AppHeader titulo="Cuenta" />
      <IonContent className="ion-padding">
        <div className="cuenta-portada" />
        <div className="cuenta-cabecera">
          <div className="cuenta-avatar">
            <IonIcon icon={personCircle} />
          </div>
          <div>
            <h1 className="cuenta-nombre">{user?.nombre}</h1>
            <p className="cuenta-rol">{user?.rol === 'administrador' ? 'Administrador' : 'Comunidad Trekia'}</p>
          </div>
        </div>

        <IonSegment className="ion-margin-top" value={pestana} onIonChange={(e) => setPestana(String(e.detail.value))}>
          <IonSegmentButton value="perfil">Mi perfil</IonSegmentButton>
          <IonSegmentButton value="rutas">Mis rutas</IonSegmentButton>
          <IonSegmentButton value="configuracion">Configuración</IonSegmentButton>
        </IonSegment>

        {pestana === 'perfil' && (
          <div className="cuenta-columnas">
            <div>
              <div className="cuenta-panel">
                <h2>Información personal</h2>
                <div className="cuenta-dato">
                  <span>Nombre</span>
                  <span>{user?.nombre}</span>
                </div>
                <div className="cuenta-dato">
                  <span>Correo electrónico</span>
                  <span>{user?.correo}</span>
                </div>
                <div className="cuenta-dato">
                  <span>Ubicación</span>
                  <span>{user?.ubicacion || 'Sin ubicación'}</span>
                </div>
              </div>

              <div className="cuenta-panel">
                <h2>Sobre mí</h2>
                <p>{user?.biografia || 'Todavía no escribes una biografía.'}</p>
              </div>
            </div>

            <div>
              <div className="cuenta-panel">
                <h2>Mis estadísticas</h2>
                <div className="cuenta-estadisticas">
                  <div className="cuenta-estadistica">
                    <strong>{misGrupos.datos.length}</strong>
                    <span>Grupos creados</span>
                  </div>
                  <div className="cuenta-estadistica">
                    <strong>{salidas.length}</strong>
                    <span>Salidas con otros grupos</span>
                  </div>
                  <div className="cuenta-estadistica">
                    <strong>{misPropuestas.datos.length}</strong>
                    <span>Rutas propuestas</span>
                  </div>
                </div>
              </div>

              <div className="cuenta-panel">
                <h2>Mis grupos</h2>
                <Estado cargando={misGrupos.cargando} error={misGrupos.error} />
                {!misGrupos.cargando && misGrupos.datos.length === 0 && <p>Todavía no creas grupos.</p>}
                {misGrupos.datos.map((grupo) => (
                  <div key={grupo.id} className="grupo-fila" onClick={() => navigate(`/app/grupos/${grupo.id}`)}>
                    <div className="grupo-fila-foto" />
                    <div>
                      <p className="grupo-nombre">{grupo.nombre}</p>
                      <p>{grupo.fecha}, {grupo.hora}</p>
                      <p>{grupo.participantes}/{grupo.cupos} participantes</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cuenta-panel">
                <h2>Mis solicitudes a grupos</h2>
                <Estado cargando={misSolicitudes.cargando} error={misSolicitudes.error} />
                {!misSolicitudes.cargando && misSolicitudes.datos.length === 0 && <p>No has solicitado unirte a grupos.</p>}
                {misSolicitudes.datos.map((solicitud) => (
                  <div key={solicitud.id} className="cuenta-dato" onClick={() => navigate(`/app/grupos/${solicitud.grupoId}`)}>
                    <span>{solicitud.grupo}, {solicitud.fecha}</span>
                    <span>{capitalizar(solicitud.estado)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {pestana === 'rutas' && (
          <div className="cuenta-panel ion-margin-top">
            <h2>Rutas que propuse</h2>
            <Estado cargando={misPropuestas.cargando} error={misPropuestas.error} />
            {!misPropuestas.cargando && misPropuestas.datos.length === 0 && <p>Todavía no propones rutas.</p>}
            {misPropuestas.datos.map((propuesta) => (
              <div key={propuesta.id} className="cuenta-dato">
                <span>
                  {propuesta.nombre} <span className={claseDificultad(propuesta.dificultad)}>{propuesta.dificultad}</span>
                  {propuesta.observaciones && <><br /><small>{propuesta.observaciones}</small></>}
                </span>
                <IonChip outline>{capitalizar(propuesta.estado)}</IonChip>
              </div>
            ))}
          </div>
        )}

        {pestana === 'configuracion' && (
          <div className="cuenta-panel ion-margin-top">
            <h2>Configuración de la cuenta</h2>
            <IonInput
              className="ion-margin-bottom"
              label="Nombre"
              labelPlacement="stacked"
              fill="outline"
              value={nombre}
              onIonInput={(e) => setNombre(e.detail.value ?? '')}
            />
            <IonInput
              className="ion-margin-bottom"
              label="Ubicación"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Ej: Valparaíso, Chile"
              value={ubicacion}
              onIonInput={(e) => setUbicacion(e.detail.value ?? '')}
            />
            <IonTextarea
              label="Sobre mí"
              labelPlacement="stacked"
              fill="outline"
              autoGrow
              placeholder="Cuéntale a la comunidad qué rutas te gustan"
              value={biografia}
              onIonInput={(e) => setBiografia(e.detail.value ?? '')}
            />
            {error && <p className="auth-error">{error}</p>}
            <IonButton className="ion-margin-top" onClick={guardar}>
              Guardar cambios
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
