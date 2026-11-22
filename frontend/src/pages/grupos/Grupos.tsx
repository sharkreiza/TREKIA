import { useEffect, useState } from 'react';
import {
  IonButton, IonContent, IonHeader, IonIcon, IonInput, IonModal, IonPage, IonSegment, IonSegmentButton,
  IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar,
} from '@ionic/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addOutline, funnelOutline, refreshOutline } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import Estado from '../../components/Estado';
import { claseDificultad } from '../../components/TarjetaRuta';
import { useDatos } from '../../hooks/useDatos';
import { FiltrosGrupos, obtenerGrupos } from '../../services/gruposService';
import { obtenerRutas } from '../../services/rutasService';
import { guardarLocal, leerLocal } from '../../utils/almacenLocal';
import '../inicio/Inicio.css';
import '../rutas/ExplorarRutas.css';

interface Filtros {
  rutaId: string;
  desde: string;
  hasta: string;
  horario: string;
  cupoMax: string;
  conCupos: boolean;
}

const filtrosVacios: Filtros = { rutaId: '', desde: '', hasta: '', horario: '', cupoMax: '', conCupos: false };

function parametros(filtros: Filtros): FiltrosGrupos {
  return {
    rutaId: filtros.rutaId ? Number(filtros.rutaId) : undefined,
    desde: filtros.desde || undefined,
    hasta: filtros.hasta || undefined,
    horario: filtros.horario || undefined,
    cupoMax: filtros.cupoMax ? Number(filtros.cupoMax) : undefined,
    conCupos: filtros.conCupos || undefined,
  };
}

function cantidadActivos(filtros: Filtros) {
  return Object.values(filtros).filter((valor) => valor !== '' && valor !== false).length;
}

export default function Grupos() {
  const navigate = useNavigate();
  const [busqueda] = useSearchParams();
  const rutaParametro = busqueda.get('rutaId');

  const [filtros, setFiltros] = useState<Filtros>(() =>
    rutaParametro ? { ...filtrosVacios, rutaId: rutaParametro } : { ...filtrosVacios, ...leerLocal<Filtros>('filtros-grupos') },
  );
  const [borrador, setBorrador] = useState<Filtros>(filtros);
  const [abierto, setAbierto] = useState(false);

  const grupos = useDatos(() => obtenerGrupos(parametros(filtros)), [], [filtros], `grupos-${JSON.stringify(filtros)}`);
  const rutas = useDatos(() => obtenerRutas(), [], [], 'rutas-inicio');

  useEffect(() => {
    if (rutaParametro) {
      setFiltros({ ...filtrosVacios, rutaId: rutaParametro });
    }
  }, [rutaParametro]);

  useEffect(() => {
    guardarLocal('filtros-grupos', filtros);
  }, [filtros]);

  function abrirFiltros() {
    setBorrador(filtros);
    setAbierto(true);
  }

  function aplicarFiltros() {
    setFiltros(borrador);
    setAbierto(false);
  }

  const activos = cantidadActivos(filtros);

  return (
    <IonPage>
      <AppHeader titulo="Grupos de trekking" />
      <IonContent className="ion-padding">
        <div className="rutas-buscador">
          <IonButton routerLink="/app/grupos/nuevo">
            <IonIcon slot="start" icon={addOutline} />
            Crear grupo
          </IonButton>
          <IonButton fill="outline" onClick={abrirFiltros}>
            <IonIcon slot="start" icon={funnelOutline} />
            Filtros{activos > 0 && ` (${activos})`}
          </IonButton>
          {activos > 0 && (
            <IonButton fill="clear" onClick={() => setFiltros(filtrosVacios)}>
              Ver todos los grupos
            </IonButton>
          )}
        </div>

        <IonSegment
          className="ion-margin-bottom"
          value={filtros.horario}
          onIonChange={(e) => setFiltros({ ...filtros, horario: String(e.detail.value) })}
        >
          <IonSegmentButton value="">Todos</IonSegmentButton>
          <IonSegmentButton value="manana">Mañana</IonSegmentButton>
          <IonSegmentButton value="tarde">Tarde</IonSegmentButton>
          <IonSegmentButton value="noche">Noche</IonSegmentButton>
        </IonSegment>

        <div className="inicio-panel">
          <Estado cargando={grupos.cargando} error={grupos.error} sinConexion={grupos.sinConexion} reintentar={grupos.recargar} />
          {!grupos.cargando && !grupos.error && grupos.datos.length === 0 && (
            <p>{activos > 0 ? 'No hay grupos con esos filtros.' : 'No hay grupos para mostrar.'}</p>
          )}
          {!grupos.cargando && grupos.datos.map((grupo) => (
            <div key={grupo.id} className="grupo-fila" onClick={() => navigate(`/app/grupos/${grupo.id}`)}>
              <div className="grupo-fila-foto" />
              <div>
                <p className="grupo-nombre">{grupo.nombre}</p>
                <p>{grupo.rutaNombre}</p>
                <p>{grupo.fecha}, {grupo.hora}</p>
                <p>{grupo.participantes}/{grupo.cupos} participantes{grupo.estado !== 'abierto' && `, ${grupo.estado}`}</p>
              </div>
              <span className={claseDificultad(grupo.dificultad)}>{grupo.dificultad}</span>
            </div>
          ))}
        </div>

        <IonModal isOpen={abierto} onDidDismiss={() => setAbierto(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Filtrar grupos</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding filtros-modal">
            <IonSelect
              label="Ruta"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Todas las rutas"
              value={borrador.rutaId}
              onIonChange={(e) => setBorrador({ ...borrador, rutaId: e.detail.value })}
            >
              <IonSelectOption value="">Todas las rutas</IonSelectOption>
              {rutas.datos.map((ruta) => (
                <IonSelectOption key={ruta.id} value={String(ruta.id)}>{ruta.nombre}</IonSelectOption>
              ))}
            </IonSelect>

            <IonInput
              className="ion-margin-top"
              type="date"
              label="Desde"
              labelPlacement="stacked"
              fill="outline"
              value={borrador.desde}
              onIonInput={(e) => setBorrador({ ...borrador, desde: e.detail.value ?? '' })}
            />

            <IonInput
              className="ion-margin-top"
              type="date"
              label="Hasta"
              labelPlacement="stacked"
              fill="outline"
              min={borrador.desde || undefined}
              value={borrador.hasta}
              onIonInput={(e) => setBorrador({ ...borrador, hasta: e.detail.value ?? '' })}
            />

            <IonSelect
              className="ion-margin-top"
              label="Horario de salida"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Cualquier horario"
              value={borrador.horario}
              onIonChange={(e) => setBorrador({ ...borrador, horario: e.detail.value })}
            >
              <IonSelectOption value="">Cualquier horario</IonSelectOption>
              <IonSelectOption value="manana">Mañana (antes de las 12:00)</IonSelectOption>
              <IonSelectOption value="tarde">Tarde (12:00 a 18:00)</IonSelectOption>
              <IonSelectOption value="noche">Noche (desde las 18:00)</IonSelectOption>
            </IonSelect>

            <IonSelect
              className="ion-margin-top"
              label="Cantidad de participantes"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Cualquier tamaño"
              value={borrador.cupoMax}
              onIonChange={(e) => setBorrador({ ...borrador, cupoMax: e.detail.value })}
            >
              <IonSelectOption value="">Cualquier tamaño</IonSelectOption>
              <IonSelectOption value="4">Grupos pequeños (hasta 4)</IonSelectOption>
              <IonSelectOption value="8">Hasta 8 personas</IonSelectOption>
              <IonSelectOption value="12">Hasta 12 personas</IonSelectOption>
            </IonSelect>

            <IonToggle
              className="ion-margin-top"
              checked={borrador.conCupos}
              onIonChange={(e) => setBorrador({ ...borrador, conCupos: e.detail.checked })}
            >
              Solo grupos con cupos disponibles
            </IonToggle>

            <div className="filtros-acciones">
              <IonButton fill="clear" size="small" onClick={() => setBorrador(filtrosVacios)}>
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
