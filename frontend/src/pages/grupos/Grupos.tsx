import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { addOutline } from 'ionicons/icons';
import AppHeader from '../../components/AppHeader';
import { claseDificultad } from '../../components/TarjetaRuta';
import { obtenerGrupos } from '../../services/gruposService';
import '../inicio/Inicio.css';

export default function Grupos() {
  const navigate = useNavigate();
  const grupos = obtenerGrupos();

  return (
    <IonPage>
      <AppHeader titulo="Grupos de trekking" />
      <IonContent className="ion-padding">
        <IonButton className="ion-margin-bottom" routerLink="/app/grupos/nuevo">
          <IonIcon slot="start" icon={addOutline} />
          Crear grupo
        </IonButton>

        <div className="inicio-panel">
          {grupos.map((grupo) => (
            <div key={grupo.id} className="grupo-fila" onClick={() => navigate(`/app/grupos/${grupo.id}`)}>
              <div className="grupo-fila-foto" />
              <div>
                <p className="grupo-nombre">{grupo.nombre}</p>
                <p>{grupo.fecha}, {grupo.hora}</p>
                <p>{grupo.participantes}/{grupo.cupos} participantes</p>
              </div>
              <span className={claseDificultad(grupo.dificultad)}>{grupo.dificultad}</span>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}
