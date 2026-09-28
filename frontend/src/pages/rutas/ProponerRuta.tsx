import { useState } from 'react';
import {
  IonButton, IonContent, IonInput, IonPage, IonRadio, IonRadioGroup,
  IonSelect, IonSelectOption, IonTextarea, useIonToast,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
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
  const [tipo, setTipo] = useState('');
  const [dificultad, setDificultad] = useState('');
  const [error, setError] = useState('');

  function publicar() {
    if (nombre === '' || descripcion === '' || region === '' || distancia === '' || dificultad === '') {
      setError('Completa el nombre, la descripción, la región, la distancia y la dificultad.');
      return;
    }

    setError('');
    mostrarToast({
      message: 'Tu ruta quedó en revisión, te avisaremos cuando la aprueben',
      duration: 2500,
      color: 'success',
    });
    navigate('/app/inicio', { replace: true });
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
                  label="Duración"
                  labelPlacement="stacked"
                  fill="outline"
                  placeholder="Ej: 4 horas"
                  value={duracion}
                  onIonInput={(e) => setDuracion(e.detail.value ?? '')}
                />
              </div>

              <p>Tipo de ruta</p>
              <IonRadioGroup value={tipo} onIonChange={(e) => setTipo(e.detail.value)}>
                <IonRadio value="Ida y vuelta">Ida y vuelta</IonRadio>
                <br />
                <IonRadio value="Circuito">Circuito</IonRadio>
                <br />
                <IonRadio value="Solo ida">Solo ida</IonRadio>
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
                <li>Incluye fotos reales de la ruta.</li>
              </ul>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="propuesta-botones">
              <IonButton fill="outline">Guardar borrador</IonButton>
              <IonButton onClick={publicar}>Publicar ruta</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
