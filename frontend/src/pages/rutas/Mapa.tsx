import { useEffect, useRef, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonChip, IonContent, IonIcon, IonInput, IonPage, IonRange, useIonViewDidEnter,
} from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppHeader from '../../components/AppHeader';
import { Dificultad, Ruta, filtrarRutas } from '../../services/rutasService';
import './Mapa.css';

const opcionesDificultad: Dificultad[] = ['Fácil', 'Media', 'Difícil'];

export default function Mapa() {
  const divMapa = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcadores = useRef<L.LayerGroup | null>(null);

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [dificultades, setDificultades] = useState<Dificultad[]>([]);
  const [ubicacion, setUbicacion] = useState('');
  const [distanciaMax, setDistanciaMax] = useState(15);
  const [seleccionada, setSeleccionada] = useState<Ruta | null>(null);

  const rutas = filtrarRutas(dificultades, ubicacion, distanciaMax);

  useEffect(() => {
    if (!divMapa.current || mapa.current) {
      return;
    }

    mapa.current = L.map(divMapa.current).setView([-33.0, -71.35], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa.current);
    marcadores.current = L.layerGroup().addTo(mapa.current);

    return () => {
      mapa.current?.remove();
      mapa.current = null;
    };
  }, []);

  useEffect(() => {
    if (!marcadores.current) {
      return;
    }

    marcadores.current.clearLayers();
    rutas.forEach((ruta) => {
      L.circleMarker([ruta.lat, ruta.lng], {
        radius: 10,
        color: '#ffffff',
        weight: 2,
        fillColor: '#0088ff',
        fillOpacity: 1,
      })
        .addTo(marcadores.current!)
        .on('click', () => setSeleccionada(ruta));
    });
  }, [rutas]);

  useIonViewDidEnter(() => {
    mapa.current?.invalidateSize();
  });

  function cambiarDificultad(dificultad: Dificultad) {
    if (dificultades.includes(dificultad)) {
      setDificultades(dificultades.filter((d) => d !== dificultad));
    } else {
      setDificultades([...dificultades, dificultad]);
    }
  }

  return (
    <IonPage>
      <AppHeader titulo="Mapa" />
      <IonContent scrollY={false}>
        <div className="mapa-contenedor">
          <div ref={divMapa} className="mapa" />

          <IonButton className="boton-filtros" size="small" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
            <IonIcon slot="start" icon={funnelOutline} />
            Filtros
          </IonButton>

          {mostrarFiltros && (
            <div className="panel-filtros">
              <h3>Dificultad</h3>
              {opcionesDificultad.map((dificultad) => (
                <IonChip
                  key={dificultad}
                  color="primary"
                  outline={!dificultades.includes(dificultad)}
                  onClick={() => cambiarDificultad(dificultad)}
                >
                  {dificultad}
                </IonChip>
              ))}

              <h3>Ubicación</h3>
              <IonInput
                fill="outline"
                placeholder="Escribe la ubicación"
                value={ubicacion}
                onIonInput={(e) => setUbicacion(e.detail.value ?? '')}
              />

              <h3>Distancia máxima</h3>
              <IonRange
                min={1}
                max={15}
                pin
                pinFormatter={(valor: number) => `${valor} km`}
                value={distanciaMax}
                onIonInput={(e) => setDistanciaMax(e.detail.value as number)}
              />

              <p className="resultado">
                {rutas.length === 1 ? '1 ruta encontrada' : `${rutas.length} rutas encontradas`}
              </p>
            </div>
          )}

          {seleccionada && (
            <IonCard className="tarjeta-ruta">
              <IonCardHeader>
                <IonCardTitle>{seleccionada.nombre}</IonCardTitle>
                <IonCardSubtitle>
                  {seleccionada.ubicacion}, {seleccionada.dificultad}, {seleccionada.distancia} km
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton size="small" routerLink={`/app/mapa/ruta/${seleccionada.id}`}>
                  Ver detalle
                </IonButton>
                <IonButton size="small" fill="clear" color="medium" onClick={() => setSeleccionada(null)}>
                  Cerrar
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
