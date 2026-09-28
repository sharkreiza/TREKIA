import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { claseDificultad } from '../../components/TarjetaRuta';
import { obtenerPropuestas } from '../../services/propuestasService';
import './Admin.css';

export default function Propuestas() {
  const navigate = useNavigate();
  const propuestas = obtenerPropuestas();

  return (
    <IonPage>
      <AppHeader titulo="Rutas propuestas" />
      <IonContent className="ion-padding">
        <h1 className="admin-titulo">Rutas propuestas</h1>
        <p className="admin-bajada">Revisa las rutas que envió la comunidad antes de publicarlas.</p>

        {propuestas.map((propuesta) => (
          <div className="admin-tarjeta" key={propuesta.id}>
            <div className="admin-tarjeta-foto" />
            <div className="admin-tarjeta-info">
              <p className="admin-tarjeta-nombre">{propuesta.nombre}</p>
              <p className="admin-tarjeta-datos">
                {propuesta.ubicacion}, {propuesta.distancia} km
              </p>
              <p className="admin-tarjeta-datos">Propuesta por {propuesta.autor}, {propuesta.cuando}</p>
              <span className={claseDificultad(propuesta.dificultad)}>{propuesta.dificultad}</span>
            </div>
            <IonButton size="small" onClick={() => navigate(`/admin/propuestas/${propuesta.id}`)}>
              Revisar
            </IonButton>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
}
