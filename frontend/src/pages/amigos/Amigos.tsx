import { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonPage, useIonToast } from '@ionic/react';
import { person } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { Amigo, obtenerAmigos, obtenerSolicitudes } from '../../services/amigosService';
import './Amigos.css';

export default function Amigos() {
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();

  const [solicitudes, setSolicitudes] = useState<Amigo[]>(obtenerSolicitudes());
  const [amigos, setAmigos] = useState<Amigo[]>(obtenerAmigos());

  function aceptar(solicitud: Amigo) {
    setSolicitudes(solicitudes.filter((s) => s.id !== solicitud.id));
    setAmigos([...amigos, { ...solicitud, detalle: 'Nuevo amigo' }]);
    mostrarToast({ message: `Ahora eres amigo de ${solicitud.nombre}`, duration: 2000, color: 'success' });
  }

  function rechazar(solicitud: Amigo) {
    setSolicitudes(solicitudes.filter((s) => s.id !== solicitud.id));
    mostrarToast({ message: 'Solicitud rechazada', duration: 2000 });
  }

  return (
    <IonPage>
      <AppHeader titulo="Amigos" />
      <IonContent className="amigos ion-padding">
        <h2>Solicitudes</h2>
        {solicitudes.length === 0 && <p className="amigos-vacio">No tienes solicitudes pendientes.</p>}
        {solicitudes.map((solicitud) => (
          <div className="amigo" key={solicitud.id}>
            <div className="amigo-avatar">
              <IonIcon icon={person} />
            </div>
            <div className="amigo-info">
              <p className="amigo-nombre">{solicitud.nombre}</p>
              <p className="amigo-detalle">{solicitud.detalle}</p>
            </div>
            <IonButton size="small" onClick={() => aceptar(solicitud)}>Aceptar</IonButton>
            <IonButton size="small" fill="outline" color="light" onClick={() => rechazar(solicitud)}>
              Rechazar
            </IonButton>
          </div>
        ))}

        <h2>Mis amigos</h2>
        {amigos.map((amigo) => (
          <div className="amigo" key={amigo.id}>
            <div className="amigo-avatar">
              <IonIcon icon={person} />
            </div>
            <div className="amigo-info" onClick={() => navigate(`/app/perfil/${amigo.id}`)}>
              <p className="amigo-nombre">{amigo.nombre}</p>
              <p className="amigo-detalle">{amigo.detalle}</p>
            </div>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
}
