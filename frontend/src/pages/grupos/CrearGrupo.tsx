import { useState } from 'react';
import { IonButton, IonContent, IonInput, IonPage, IonSelect, IonSelectOption, IonTextarea, useIonToast } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { obtenerRutas } from '../../services/rutasService';

export default function CrearGrupo() {
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();

  const [ruta, setRuta] = useState('');
  const [fecha, setFecha] = useState('');
  const [cupos, setCupos] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  function crear() {
    if (ruta === '' || fecha === '' || cupos === '') {
      setError('Completa la ruta, la fecha y la cantidad de participantes.');
      return;
    }

    setError('');
    mostrarToast({ message: 'Tu grupo quedó publicado', duration: 2000, color: 'success' });
    navigate('/app/grupos', { replace: true });
  }

  return (
    <IonPage>
      <AppHeader titulo="Crear grupo" volverA="/app/grupos" />
      <IonContent className="ion-padding">
        <IonSelect
          className="ion-margin-bottom"
          label="Ruta"
          labelPlacement="stacked"
          fill="outline"
          placeholder="Selecciona una ruta"
          value={ruta}
          onIonChange={(e) => setRuta(e.detail.value)}
        >
          {obtenerRutas().map((r) => (
            <IonSelectOption key={r.id} value={r.nombre}>{r.nombre}</IonSelectOption>
          ))}
        </IonSelect>

        <IonInput
          className="ion-margin-bottom"
          label="Fecha y hora"
          labelPlacement="stacked"
          fill="outline"
          type="datetime-local"
          value={fecha}
          onIonInput={(e) => setFecha(e.detail.value ?? '')}
        />

        <IonInput
          className="ion-margin-bottom"
          label="Cantidad de participantes"
          labelPlacement="stacked"
          fill="outline"
          type="number"
          placeholder="Ej: 8"
          value={cupos}
          onIonInput={(e) => setCupos(e.detail.value ?? '')}
        />

        <IonTextarea
          label="Descripción"
          labelPlacement="stacked"
          fill="outline"
          autoGrow
          placeholder="Cuéntales a los demás cómo será la salida"
          value={descripcion}
          onIonInput={(e) => setDescripcion(e.detail.value ?? '')}
        />

        {error && <p className="auth-error">{error}</p>}

        <IonButton className="ion-margin-top" onClick={crear}>Publicar grupo</IonButton>
      </IonContent>
    </IonPage>
  );
}
