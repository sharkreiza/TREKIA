import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addOutline } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import Estado from '../../components/Estado';
import { claseDificultad } from '../../components/TarjetaRuta';
import { useDatos } from '../../hooks/useDatos';
import { obtenerGrupos } from '../../services/gruposService';
import '../inicio/Inicio.css';

export default function Grupos() {
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const rutaId = parametros.get('rutaId');

  const grupos = useDatos(() => obtenerGrupos(rutaId ? { rutaId: Number(rutaId) } : {}), [], [rutaId]);

  return (
    <IonPage>
      <AppHeader titulo="Grupos de trekking" />
      <IonContent className="ion-padding">
        <IonButton className="ion-margin-bottom" routerLink="/app/grupos/nuevo">
          <IonIcon slot="start" icon={addOutline} />
          Crear grupo
        </IonButton>
        {rutaId && (
          <IonButton className="ion-margin-bottom" fill="outline" routerLink="/app/grupos">
            Ver todos los grupos
          </IonButton>
        )}

        <div className="inicio-panel">
          <Estado cargando={grupos.cargando} error={grupos.error} reintentar={grupos.recargar} />
          {!grupos.cargando && !grupos.error && grupos.datos.length === 0 && <p>No hay grupos para mostrar.</p>}
          {grupos.datos.map((grupo) => (
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
      </IonContent>
    </IonPage>
  );
}
