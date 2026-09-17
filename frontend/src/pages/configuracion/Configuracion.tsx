import { useState } from 'react';
import {
  IonAvatar, IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel,
  IonList, IonListHeader, IonPage, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption,
} from '@ionic/react';
import { mailOutline, personCircleOutline } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';

export default function Configuracion() {
  const { user } = useAuth();
  const [editando, setEditando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [sobrenombre, setSobrenombre] = useState('');
  const [genero, setGenero] = useState('');
  const [pais, setPais] = useState('Chile');
  const [idioma, setIdioma] = useState('Español');
  const [zonaHoraria, setZonaHoraria] = useState('UTC-3');

  return (
    <IonPage>
      <AppHeader titulo="Configuración" />
      <IonContent className="ion-padding">
        <IonItem lines="none">
          <IonAvatar slot="start">
            <IonIcon icon={personCircleOutline} style={{ fontSize: '48px' }} />
          </IonAvatar>
          <IonLabel>
            <h2>{user?.nombre}</h2>
            <p>{user?.correo}</p>
          </IonLabel>
          <IonButton slot="end" onClick={() => setEditando(!editando)}>
            {editando ? 'Guardar' : 'Editar'}
          </IonButton>
        </IonItem>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonInput
                label="Nombre completo"
                labelPlacement="stacked"
                fill="outline"
                placeholder="Escribe aquí tu nombre completo"
                value={nombre}
                disabled={!editando}
                onIonInput={(e) => setNombre(e.detail.value ?? '')}
              />
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonInput
                label="Sobrenombre"
                labelPlacement="stacked"
                fill="outline"
                placeholder="Sobrenombre"
                value={sobrenombre}
                disabled={!editando}
                onIonInput={(e) => setSobrenombre(e.detail.value ?? '')}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonLabel>Género</IonLabel>
              <IonRadioGroup value={genero} onIonChange={(e) => setGenero(e.detail.value)}>
                <IonRadio value="femenino" disabled={!editando}>Femenino</IonRadio>
                <br />
                <IonRadio value="masculino" disabled={!editando}>Masculino</IonRadio>
                <br />
                <IonRadio value="otro" disabled={!editando}>Otro</IonRadio>
              </IonRadioGroup>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonSelect
                label="País"
                labelPlacement="stacked"
                fill="outline"
                value={pais}
                disabled={!editando}
                onIonChange={(e) => setPais(e.detail.value)}
              >
                <IonSelectOption value="Chile">Chile</IonSelectOption>
                <IonSelectOption value="Argentina">Argentina</IonSelectOption>
                <IonSelectOption value="Perú">Perú</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonSelect
                label="Idioma"
                labelPlacement="stacked"
                fill="outline"
                value={idioma}
                disabled={!editando}
                onIonChange={(e) => setIdioma(e.detail.value)}
              >
                <IonSelectOption value="Español">Español</IonSelectOption>
                <IonSelectOption value="Inglés">Inglés</IonSelectOption>
              </IonSelect>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonSelect
                label="Zona horaria"
                labelPlacement="stacked"
                fill="outline"
                value={zonaHoraria}
                disabled={!editando}
                onIonChange={(e) => setZonaHoraria(e.detail.value)}
              >
                <IonSelectOption value="UTC-3">UTC-3</IonSelectOption>
                <IonSelectOption value="UTC-4">UTC-4</IonSelectOption>
                <IonSelectOption value="UTC-5">UTC-5</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonList>
          <IonListHeader>Mis correos</IonListHeader>
          <IonItem>
            <IonIcon slot="start" icon={mailOutline} color="primary" />
            <IonLabel>
              <h3>{user?.correo}</h3>
              <p>Agregado hace 1 mes</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonButton fill="outline" disabled={!editando}>
          Agregar correo
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
