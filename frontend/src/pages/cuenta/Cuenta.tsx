import { useState } from 'react';
import {
  IonButton, IonChip, IonContent, IonIcon, IonInput, IonPage,
  IonSegment, IonSegmentButton, IonSelect, IonSelectOption, useIonToast,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { personCircle } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import TarjetaRuta from '../../components/TarjetaRuta';
import { useAuth } from '../../context/AuthContext';
import { rutasDestacadas } from '../../services/rutasService';
import './Cuenta.css';

const intereses = ['Trekking', 'Montaña', 'Fotografía', 'Naturaleza', 'Vida al aire libre', 'Camping'];

export default function Cuenta() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [mostrarToast] = useIonToast();

  const [pestana, setPestana] = useState('perfil');
  const [ubicacion, setUbicacion] = useState('Valparaíso, Chile');
  const [correoExtra, setCorreoExtra] = useState('');
  const [zonaHoraria, setZonaHoraria] = useState('UTC-3');

  const misRutas = rutasDestacadas();

  if (userId) {
    return (
      <IonPage>
        <AppHeader titulo="Perfil" volverA="/app/comunidad" />
        <IonContent className="ion-padding">
          <div className="cuenta-portada" />
          <div className="cuenta-cabecera">
            <div className="cuenta-avatar">
              <IonIcon icon={personCircle} />
            </div>
            <div>
              <h1 className="cuenta-nombre">Usuario {userId}</h1>
              <p className="cuenta-rol">Miembro de la comunidad</p>
            </div>
          </div>
          <IonButton className="ion-margin-top" onClick={() => mostrarToast({ message: 'Solicitud enviada', duration: 2000, color: 'success' })}>
            Enviar solicitud de amistad
          </IonButton>
        </IonContent>
      </IonPage>
    );
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
            <p className="cuenta-rol">Comunidad Trekia</p>
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
                  <span>{ubicacion}</span>
                </div>
              </div>

              <div className="cuenta-panel">
                <h2>Intereses</h2>
                <div className="cuenta-intereses">
                  {intereses.map((interes) => (
                    <IonChip key={interes} outline>{interes}</IonChip>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="cuenta-panel">
                <h2>Mis estadísticas</h2>
                <div className="cuenta-estadisticas">
                  <div className="cuenta-estadistica">
                    <strong>22</strong>
                    <span>Rutas realizadas</span>
                  </div>
                  <div className="cuenta-estadistica">
                    <strong>256 km</strong>
                    <span>Distancia total</span>
                  </div>
                  <div className="cuenta-estadistica">
                    <strong>48 h</strong>
                    <span>Tiempo en ruta</span>
                  </div>
                </div>
              </div>

              <div className="cuenta-panel">
                <h2>Actividad reciente</h2>
                {misRutas.slice(0, 2).map((ruta) => (
                  <TarjetaRuta key={ruta.id} ruta={ruta} />
                ))}
              </div>
            </div>
          </div>
        )}

        {pestana === 'rutas' && (
          <div className="cuenta-panel ion-margin-top">
            <h2>Mis rutas</h2>
            {misRutas.map((ruta) => (
              <TarjetaRuta key={ruta.id} ruta={ruta} />
            ))}
          </div>
        )}

        {pestana === 'configuracion' && (
          <div className="cuenta-panel ion-margin-top">
            <h2>Configuración de la cuenta</h2>
            <IonInput
              className="ion-margin-bottom"
              label="Ubicación"
              labelPlacement="stacked"
              fill="outline"
              value={ubicacion}
              onIonInput={(e) => setUbicacion(e.detail.value ?? '')}
            />
            <IonInput
              className="ion-margin-bottom"
              label="Correo adicional"
              labelPlacement="stacked"
              fill="outline"
              type="email"
              placeholder="otro@correo.cl"
              value={correoExtra}
              onIonInput={(e) => setCorreoExtra(e.detail.value ?? '')}
            />
            <IonSelect
              label="Zona horaria"
              labelPlacement="stacked"
              fill="outline"
              value={zonaHoraria}
              onIonChange={(e) => setZonaHoraria(e.detail.value)}
            >
              <IonSelectOption value="UTC-3">UTC-3</IonSelectOption>
              <IonSelectOption value="UTC-4">UTC-4</IonSelectOption>
              <IonSelectOption value="UTC-5">UTC-5</IonSelectOption>
            </IonSelect>
            <IonButton
              className="ion-margin-top"
              onClick={() => mostrarToast({ message: 'Cambios guardados', duration: 2000, color: 'success' })}
            >
              Guardar cambios
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
