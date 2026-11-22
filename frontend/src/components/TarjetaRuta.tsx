import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { locationOutline } from 'ionicons/icons';
import { Ruta } from '../services/rutasService';
import './TarjetaRuta.css';

export function claseDificultad(dificultad: string) {
  return `etiqueta etiqueta-${dificultad.toLowerCase()}`;
}

export default function TarjetaRuta({ ruta }: { ruta: Ruta }) {
  const navigate = useNavigate();

  return (
    <div className="tarjeta-ruta" onClick={() => navigate(`/app/rutas/${ruta.id}`)}>
      <div className="tarjeta-ruta-foto" />
      <div className="tarjeta-ruta-info">
        <p className="tarjeta-ruta-nombre">{ruta.nombre}</p>
        <span className={claseDificultad(ruta.dificultad)}>{ruta.dificultad}</span>
        <p className="tarjeta-ruta-datos">
          <span>{ruta.distancia ?? '-'} km</span>
          <span>{ruta.desnivel ?? '-'} m</span>
          <span>{ruta.duracion}</span>
        </p>
      </div>
      <span className="tarjeta-ruta-puntuacion">
        <IonIcon icon={locationOutline} /> {ruta.comuna}
      </span>
    </div>
  );
}
