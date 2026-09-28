import { useState } from 'react';
import {
  IonButton, IonContent, IonHeader, IonIcon, IonInput, IonModal, IonPage,
  IonSelect, IonSelectOption, IonTitle, IonToolbar,
} from '@ionic/react';
import { useSearchParams } from 'react-router-dom';
import { funnelOutline, refreshOutline, searchOutline } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import TarjetaRuta from '../../components/TarjetaRuta';
import { Filtros, filtrarRutas, filtrosVacios } from '../../services/rutasService';
import './ExplorarRutas.css';

export default function ExplorarRutas() {
  const [parametros] = useSearchParams();
  const [filtros, setFiltros] = useState<Filtros>({
    ...filtrosVacios,
    busqueda: parametros.get('busqueda') ?? '',
    region: parametros.get('region') ?? '',
    dificultad: parametros.get('dificultad') ?? '',
    orden: parametros.get('orden') ?? '',
  });
  const [borrador, setBorrador] = useState<Filtros>(filtros);
  const [abierto, setAbierto] = useState(false);

  const rutas = filtrarRutas(filtros);

  function abrirFiltros() {
    setBorrador(filtros);
    setAbierto(true);
  }

  function aplicarFiltros() {
    setFiltros(borrador);
    setAbierto(false);
  }

  function limpiarFiltros() {
    setBorrador({ ...filtrosVacios, busqueda: borrador.busqueda });
  }

  return (
    <IonPage>
      <AppHeader titulo="Explorar rutas" />
      <IonContent className="ion-padding">
        <div className="rutas-buscador">
          <IonInput
            fill="solid"
            placeholder="Busca ubicaciones, rutas o palabras clave"
            value={filtros.busqueda}
            onIonInput={(e) => setFiltros({ ...filtros, busqueda: e.detail.value ?? '' })}
          >
            <IonIcon slot="start" icon={searchOutline} />
          </IonInput>
          <IonButton onClick={abrirFiltros}>
            <IonIcon slot="start" icon={funnelOutline} />
            Filtros
          </IonButton>
        </div>

        {rutas.length === 0 && <p className="rutas-vacio">No encontramos rutas con esos filtros.</p>}
        {rutas.map((ruta) => (
          <TarjetaRuta key={ruta.id} ruta={ruta} />
        ))}

        <IonModal isOpen={abierto} onDidDismiss={() => setAbierto(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Filtros</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding filtros-modal">
            <IonSelect
              label="Ubicación"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Todas las regiones"
              value={borrador.region}
              onIonChange={(e) => setBorrador({ ...borrador, region: e.detail.value })}
            >
              <IonSelectOption value="">Todas las regiones</IonSelectOption>
              <IonSelectOption value="Valparaíso">Valparaíso</IonSelectOption>
              <IonSelectOption value="Metropolitana">Metropolitana</IonSelectOption>
            </IonSelect>

            <IonSelect
              className="ion-margin-top"
              label="Dificultad"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Todas"
              value={borrador.dificultad}
              onIonChange={(e) => setBorrador({ ...borrador, dificultad: e.detail.value })}
            >
              <IonSelectOption value="">Todas</IonSelectOption>
              <IonSelectOption value="Baja">Baja</IonSelectOption>
              <IonSelectOption value="Moderada">Moderada</IonSelectOption>
              <IonSelectOption value="Alta">Alta</IonSelectOption>
            </IonSelect>

            <IonSelect
              className="ion-margin-top"
              label="Duración"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Cualquier duración"
              value={borrador.duracion}
              onIonChange={(e) => setBorrador({ ...borrador, duracion: e.detail.value })}
            >
              <IonSelectOption value="">Cualquier duración</IonSelectOption>
              <IonSelectOption value="corta">Hasta 6 km</IonSelectOption>
              <IonSelectOption value="media">Entre 6 y 12 km</IonSelectOption>
              <IonSelectOption value="larga">Más de 12 km</IonSelectOption>
            </IonSelect>

            <IonSelect
              className="ion-margin-top"
              label="Tipo de ruta"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Todas"
              value={borrador.tipo}
              onIonChange={(e) => setBorrador({ ...borrador, tipo: e.detail.value })}
            >
              <IonSelectOption value="">Todas</IonSelectOption>
              <IonSelectOption value="Ida y vuelta">Ida y vuelta</IonSelectOption>
              <IonSelectOption value="Circuito">Circuito</IonSelectOption>
            </IonSelect>

            <div className="filtros-acciones">
              <IonButton fill="clear" size="small" onClick={limpiarFiltros}>
                <IonIcon slot="start" icon={refreshOutline} />
                Limpiar filtros
              </IonButton>
              <div>
                <IonButton fill="outline" onClick={() => setAbierto(false)}>Cancelar</IonButton>
                <IonButton onClick={aplicarFiltros}>Aplicar filtros</IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
