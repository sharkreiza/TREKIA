import { useState } from 'react';
import { IonButton, IonContent, IonInput, IonPage, IonSelect, IonSelectOption, IonTextarea, useIonToast } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { useDatos } from '../../hooks/useDatos';
import { obtenerRutas } from '../../services/rutasService';
import { crearGrupo } from '../../services/gruposService';
import { ErrorApi } from '../../services/api';

export default function CrearGrupo() {
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();
  const rutas = useDatos(() => obtenerRutas(), []);

  const [ruta, setRuta] = useState<number | null>(null);
  const [fecha, setFecha] = useState('');
  const [cupos, setCupos] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function crear() {
    if (ruta === null || fecha === '' || cupos === '') {
      setError('Completa la ruta, la fecha y la cantidad de participantes.');
      return;
    }

    const nombreRuta = rutas.datos.find((r) => r.id === ruta)?.nombre ?? '';

    setError('');
    setEnviando(true);
    try {
      const grupo = await crearGrupo({
        rutaId: ruta,
        nombre: `Salida a ${nombreRuta}`,
        fechaSalida: fecha,
        cupoMaximo: Number(cupos),
        descripcion,
      });
      mostrarToast({ message: 'Tu grupo quedó publicado', duration: 2000, color: 'success' });
      navigate(`/app/grupos/${grupo.id}`, { replace: true });
    } catch (e) {
      const campos = e instanceof ErrorApi ? Object.values(e.campos) : [];
      setError(campos.length > 0 ? campos.join('. ') : (e as Error).message);
    }
    setEnviando(false);
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
          placeholder={rutas.cargando ? 'Cargando rutas...' : 'Selecciona una ruta'}
          value={ruta}
          onIonChange={(e) => setRuta(e.detail.value)}
        >
          {rutas.datos.map((r) => (
            <IonSelectOption key={r.id} value={r.id}>{r.nombre}</IonSelectOption>
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

        {(error || rutas.error) && <p className="auth-error">{error || rutas.error}</p>}

        <IonButton className="ion-margin-top" onClick={crear} disabled={enviando}>Publicar grupo</IonButton>
      </IonContent>
    </IonPage>
  );
}
