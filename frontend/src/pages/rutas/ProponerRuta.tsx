import { useState } from 'react';
import {
  IonButton, IonContent, IonInput, IonPage, IonRadio, IonRadioGroup,
  IonSelect, IonSelectOption, IonTextarea, useIonToast,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { crearPropuesta } from '../../services/propuestasService';
import { ErrorApi } from '../../services/api';
import './ProponerRuta.css';

export default function ProponerRuta() {
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [distancia, setDistancia] = useState('');
  const [duracion, setDuracion] = useState('');
  const [tipo, setTipo] = useState('ida_vuelta');
  const [dificultad, setDificultad] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function publicar() {
    if (nombre === '' || descripcion === '' || region === '' || comuna === '' || dificultad === '') {
      setError('Completa el nombre, la descripción, la región, la comuna y la dificultad.');
      return;
    }

    setError('');
    setEnviando(true);
    try {
      await crearPropuesta({
        nombre,
        descripcion,
        region,
        comuna,
        dificultad: dificultad.toLowerCase(),
        tipoRecorrido: tipo,
        distancia: distancia ? Number(distancia) : undefined,
        duracion: duracion ? Math.round(Number(duracion) * 60) : undefined,
      });
      mostrarToast({
        message: 'Tu ruta quedó en revisión, te avisaremos cuando la aprueben',
        duration: 2500,
        color: 'success',
      });
      navigate('/app/inicio', { replace: true });
    } catch (e) {
      const campos = e instanceof ErrorApi ? Object.values(e.campos) : [];
      setError(campos.length > 0 ? campos.join('. ') : (e as Error).message);
    }
    setEnviando(false);
  }

  return (
    <IonPage>
      <AppHeader titulo="Proponer ruta" volverA="/app/inicio" />
      <IonContent className="ion-padding">
        <h1 className="propuesta-titulo">Proponer ruta</h1>
        <p className="propuesta-bajada">Comparte nuevos destinos con la comunidad</p>

        <div className="propuesta-columnas">
          <div>
            <div className="propuesta-tarjeta">
              <h2>Información general</h2>
              <div className="propuesta-fila">
                <IonInput
                  label="Nombre de la ruta"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: Laguna El Yeso"
                  value={nombre}
                  onIonInput={(e) => setNombre(e.detail.value ?? '')}
                />
                <IonSelect
                  label="Categoría"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Selecciona una categoría"
                  value={categoria}
                  onIonChange={(e) => setCategoria(e.detail.value)}
                >
                  <IonSelectOption value="Montaña">Montaña</IonSelectOption>
                  <IonSelectOption value="Bosque">Bosque</IonSelectOption>
                  <IonSelectOption value="Costa">Costa</IonSelectOption>
                </IonSelect>
              </div>
              <IonTextarea
                label="Descripción"
                labelPlacement="stacked"
                fill="outline"
                autoGrow
                placeholder="Cuéntanos sobre la ruta, qué la hace especial, paisajes, recomendaciones"
                value={descripcion}
                onIonInput={(e) => setDescripcion(e.detail.value ?? '')}
              />
            </div>

            <div className="propuesta-tarjeta">
              <h2>Ubicación</h2>
              <div className="propuesta-fila">
                <IonSelect
                  label="Región"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Selecciona una región"
                  value={region}
                  onIonChange={(e) => setRegion(e.detail.value)}
                >
                  <IonSelectOption value="Valparaíso">Valparaíso</IonSelectOption>
                  <IonSelectOption value="Metropolitana">Metropolitana</IonSelectOption>
                </IonSelect>
                <IonInput
                  label="Comuna"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: Olmué"
                  value={comuna}
                  onIonInput={(e) => setComuna(e.detail.value ?? '')}
                />
              </div>
            </div>

            <div className="propuesta-tarjeta">
              <h2>Detalles de la ruta</h2>
              <div className="propuesta-fila">
                <IonInput
                  label="Distancia (km)"
                  labelPlacement="stacked"
                  fill="outline"
                  type="number"
                  placeholder="Ej: 12"
                  value={distancia}
                  onIonInput={(e) => setDistancia(e.detail.value ?? '')}
                />
                <IonInput
                  label="Duración (horas)"
                  labelPlacement="stacked"
                  fill="outline"
                  type="number"
                  placeholder="Ej: 4"
                  value={duracion}
                  onIonInput={(e) => setDuracion(e.detail.value ?? '')}
                />
              </div>

              <p>Tipo de ruta</p>
              <IonRadioGroup value={tipo} onIonChange={(e) => setTipo(e.detail.value)}>
                <IonRadio value="ida_vuelta">Ida y vuelta</IonRadio>
                <br />
                <IonRadio value="solo_ida">Solo ida</IonRadio>
              </IonRadioGroup>

              <IonSelect
                className="ion-margin-top"
                label="Dificultad"
                labelPlacement="stacked"
                fill="outline"
                placeholder="Selecciona"
                value={dificultad}
                onIonChange={(e) => setDificultad(e.detail.value)}
              >
                <IonSelectOption value="Baja">Baja</IonSelectOption>
                <IonSelectOption value="Moderada">Moderada</IonSelectOption>
                <IonSelectOption value="Alta">Alta</IonSelectOption>
              </IonSelect>
            </div>
          </div>

          <div>
            <div className="propuesta-aviso">
              Antes de publicar
              <ul>
                <li>Revisa que toda la información sea correcta.</li>
                <li>Asegúrate de tener permiso para compartir la ruta.</li>
                <li>Un administrador revisará la ruta antes de publicarla.</li>
              </ul>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="propuesta-botones">
              <IonButton onClick={publicar} disabled={enviando}>Enviar a revisión</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
