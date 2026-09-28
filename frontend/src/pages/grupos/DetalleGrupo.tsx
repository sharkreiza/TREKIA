import { useState } from 'react';
import { IonButton, IonContent, IonPage, useIonToast } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { claseDificultad } from '../../components/TarjetaRuta';
import { obtenerGrupo } from '../../services/gruposService';

export default function DetalleGrupo() {
  const { id } = useParams();
  const [mostrarToast] = useIonToast();
  const [estado, setEstado] = useState('');
  const grupo = obtenerGrupo(Number(id));

  if (!grupo) {
    return (
      <IonPage>
        <AppHeader titulo="Grupo" volverA="/app/grupos" />
        <IonContent className="ion-padding">
          <p>No encontramos este grupo.</p>
        </IonContent>
      </IonPage>
    );
  }

  function solicitar() {
    setEstado('Pendiente');
    mostrarToast({ message: 'Enviamos tu solicitud al creador del grupo', duration: 2000 });
  }

  return (
    <IonPage>
      <AppHeader titulo={grupo.nombre} volverA="/app/grupos" />
      <IonContent className="ion-padding">
        <span className={claseDificultad(grupo.dificultad)}>{grupo.dificultad}</span>
        <p>{grupo.descripcion}</p>
        <p>{grupo.fecha}, {grupo.hora}</p>
        <p>{grupo.participantes} de {grupo.cupos} participantes</p>

        {estado === '' ? (
          <IonButton onClick={solicitar}>Solicitar participación</IonButton>
        ) : (
          <p>Estado de tu solicitud: {estado}</p>
        )}
      </IonContent>
    </IonPage>
  );
}
