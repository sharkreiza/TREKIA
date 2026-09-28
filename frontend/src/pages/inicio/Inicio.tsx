import { useEffect, useRef, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonPage, useIonViewDidEnter } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { flameOutline, funnelOutline, leafOutline, locationOutline, searchOutline, starOutline, statsChartOutline, triangleOutline } from 'ionicons/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppHeader from '../../components/AppHeader';
import TarjetaRuta from '../../components/TarjetaRuta';
import { obtenerRutas, rutasDestacadas } from '../../services/rutasService';
import { obtenerGrupos } from '../../services/gruposService';
import './Inicio.css';

const categorias = [
  { nombre: 'Todas', icono: triangleOutline, filtro: '' },
  { nombre: 'Principiantes', icono: leafOutline, filtro: 'dificultad=Baja' },
  { nombre: 'Intermedio', icono: statsChartOutline, filtro: 'dificultad=Moderada' },
  { nombre: 'Avanzado', icono: flameOutline, filtro: 'dificultad=Alta' },
  { nombre: 'Cercanas', icono: locationOutline, filtro: 'region=Valparaíso' },
  { nombre: 'Mejores valoradas', icono: starOutline, filtro: 'orden=puntuacion' },
];

export default function Inicio() {
  const navigate = useNavigate();
  const divMapa = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const destacadas = rutasDestacadas();
  const grupos = obtenerGrupos().slice(0, 3);

  useEffect(() => {
    if (!divMapa.current || mapa.current) {
      return;
    }

    mapa.current = L.map(divMapa.current).setView([-33.3, -71.0], 8);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa.current);

    obtenerRutas().forEach((ruta) => {
      L.circleMarker([ruta.lat, ruta.lng], {
        radius: 9,
        color: '#ffffff',
        weight: 2,
        fillColor: '#2e4f3b',
        fillOpacity: 1,
      })
        .addTo(mapa.current!)
        .bindTooltip(ruta.nombre)
        .on('click', () => navigate(`/app/rutas/${ruta.id}`));
    });

    return () => {
      mapa.current?.remove();
      mapa.current = null;
    };
  }, [navigate]);

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
              <h2>Rutas destacadas</h2>
              {destacadas.map((ruta) => (
                <TarjetaRuta key={ruta.id} ruta={ruta} />
              ))}
              <IonButton fill="clear" size="small" routerLink="/app/rutas">Ver todas</IonButton>
            </div>

            <div className="inicio-panel ion-margin-top">
              <h2>Próximos grupos de trekking</h2>
              {grupos.map((grupo) => (
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
