import { useEffect, useRef, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonPage, useIonViewDidEnter } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { flameOutline, funnelOutline, leafOutline, locationOutline, searchOutline, statsChartOutline, timeOutline, triangleOutline } from 'ionicons/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppHeader from '../../components/AppHeader';
import TarjetaRuta from '../../components/TarjetaRuta';
import Estado from '../../components/Estado';
import { useDatos } from '../../hooks/useDatos';
import { obtenerRutas } from '../../services/rutasService';
import { proximosGrupos } from '../../services/gruposService';
import './Inicio.css';

const categorias = [
  { nombre: 'Todas', icono: triangleOutline, filtro: '' },
  { nombre: 'Principiantes', icono: leafOutline, filtro: 'dificultad=Baja' },
  { nombre: 'Intermedio', icono: statsChartOutline, filtro: 'dificultad=Moderada' },
  { nombre: 'Avanzado', icono: flameOutline, filtro: 'dificultad=Alta' },
  { nombre: 'Cercanas', icono: locationOutline, filtro: 'region=Valparaíso' },
  { nombre: 'Recientes', icono: timeOutline, filtro: 'orden=recientes' },
];

export default function Inicio() {
  const navigate = useNavigate();
  const divMapa = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcadores = useRef<L.LayerGroup | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const rutas = useDatos(() => obtenerRutas(), []);
  const grupos = useDatos(proximosGrupos, []);

  const recientes = [...rutas.datos].sort((a, b) => b.id - a.id).slice(0, 3);

  useEffect(() => {
    if (!divMapa.current || mapa.current) {
      return;
    }

    mapa.current = L.map(divMapa.current).setView([-33.3, -71.0], 8);
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
    marcadores.current?.clearLayers();

    rutas.datos.forEach((ruta) => {
      if (ruta.lat === null || ruta.lng === null) {
        return;
      }
      L.circleMarker([ruta.lat, ruta.lng], {
        radius: 9,
        color: '#ffffff',
        weight: 2,
        fillColor: '#2e4f3b',
        fillOpacity: 1,
      })
        .addTo(marcadores.current!)
        .bindTooltip(ruta.nombre)
        .on('click', () => navigate(`/app/rutas/${ruta.id}`));
    });
  }, [rutas.datos, navigate]);

  useIonViewDidEnter(() => {
    mapa.current?.invalidateSize();
  });

  function buscar() {
    navigate(`/app/rutas?busqueda=${encodeURIComponent(busqueda)}`);
  }

  return (
    <IonPage>
      <AppHeader titulo="Inicio" />
      <IonContent className="ion-padding">
        <section className="inicio-hero">
          <img className="inicio-logo" src="/assets/Logo_trekia.png" alt="Trekia" />
          <h1>Explora. Conecta. Disfruta.</h1>
          <p>Descubre rutas de trekking, encuentra compañeros y comparte tus experiencias.</p>
          <div className="inicio-buscador">
            <IonInput
              fill="solid"
              placeholder="Busca ubicaciones, rutas o palabras clave"
              value={busqueda}
              onIonInput={(e) => setBusqueda(e.detail.value ?? '')}
            >
              <IonIcon slot="start" icon={searchOutline} />
            </IonInput>
            <IonButton onClick={buscar}>
              <IonIcon slot="start" icon={funnelOutline} />
              Filtros
            </IonButton>
          </div>
        </section>

        <div className="inicio-columnas">
          <div>
            <div ref={divMapa} className="inicio-mapa" />

            <h2 className="inicio-titulo">Explorar por categoría</h2>
            <div className="inicio-categorias">
              {categorias.map((categoria) => (
                <div
                  key={categoria.nombre}
                  className="inicio-categoria"
                  onClick={() => navigate(`/app/rutas?${categoria.filtro}`)}
                >
                  <IonIcon icon={categoria.icono} />
                  {categoria.nombre}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="inicio-panel">
              <h2>Rutas recientes</h2>
              <Estado cargando={rutas.cargando} error={rutas.error} reintentar={rutas.recargar} />
              {recientes.map((ruta) => (
                <TarjetaRuta key={ruta.id} ruta={ruta} />
              ))}
              <IonButton fill="clear" size="small" routerLink="/app/rutas">Ver todas</IonButton>
            </div>

            <div className="inicio-panel ion-margin-top">
              <h2>Próximos grupos de trekking</h2>
              <Estado cargando={grupos.cargando} error={grupos.error} reintentar={grupos.recargar} />
              {!grupos.cargando && !grupos.error && grupos.datos.length === 0 && <p>No hay salidas programadas.</p>}
              {grupos.datos.slice(0, 3).map((grupo) => (
                <div key={grupo.id} className="grupo-fila" onClick={() => navigate(`/app/grupos/${grupo.id}`)}>
                  <div className="grupo-fila-foto" />
                  <div>
                    <p className="grupo-nombre">{grupo.nombre}</p>
                    <p>{grupo.fecha}, {grupo.hora}</p>
                    <p>{grupo.participantes}/{grupo.cupos} participantes</p>
                  </div>
                </div>
              ))}
              <IonButton fill="clear" size="small" routerLink="/app/grupos">Ver todos</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
