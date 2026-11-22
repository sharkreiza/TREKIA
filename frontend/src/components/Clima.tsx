import { IonIcon } from '@ionic/react';
import {
  cloudOutline, partlySunnyOutline, rainyOutline, snowOutline, sunnyOutline, thunderstormOutline, umbrellaOutline,
} from 'ionicons/icons';
import Estado from './Estado';
import { useDatos } from '../hooks/useDatos';
import { DiaClima, obtenerClima } from '../services/climaService';
import { capitalizar } from '../utils/formatos';
import './Clima.css';

interface Props {
  rutaId: number;
  fecha?: string;
}

const DIAS_PRONOSTICO = 16;

function icono(codigo: number) {
  if (codigo === 0 || codigo === 1) return sunnyOutline;
  if (codigo === 2) return partlySunnyOutline;
  if (codigo >= 95) return thunderstormOutline;
  if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) return snowOutline;
  if (codigo >= 51) return rainyOutline;
  return cloudOutline;
}

function nombreDia(fecha: string) {
  return capitalizar(new Date(`${fecha}T12:00:00`).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' }));
}

function Dia({ dia, destacado }: { dia: DiaClima; destacado?: boolean }) {
  return (
    <div className={`clima-dia ${destacado ? 'clima-dia-destacado' : ''}`}>
      <span className="clima-fecha">{nombreDia(dia.fecha)}</span>
      <IonIcon icon={icono(dia.codigo)} aria-hidden="true" />
      <span className="clima-temperatura">{dia.maxima}° / {dia.minima}°</span>
      <span className="clima-descripcion">{dia.descripcion}</span>
      {dia.lluvia !== null && (
        <span className="clima-lluvia">
          <IonIcon icon={umbrellaOutline} aria-hidden="true" /> {dia.lluvia}%
        </span>
      )}
    </div>
  );
}

export default function Clima({ rutaId, fecha }: Props) {
  const clima = useDatos(() => obtenerClima(rutaId, fecha ? DIAS_PRONOSTICO : 7), [], [rutaId, fecha]);

  if (clima.cargando || clima.error) {
    return (
      <div className="clima">
        <h2>Pronóstico del tiempo</h2>
        <Estado
          cargando={clima.cargando}
          error={clima.error}
          reintentar={clima.recargar}
        />
      </div>
    );
  }

  const diaSalida = fecha ? clima.datos.find((d) => d.fecha === fecha) : undefined;

  return (
    <div className="clima">
      <h2>{fecha ? 'Clima para el día de la salida' : 'Pronóstico del tiempo'}</h2>

      {fecha && (
        diaSalida ? (
          <>
            <Dia dia={diaSalida} destacado />
            {diaSalida.lluvia !== null && diaSalida.lluvia >= 50 && (
              <p className="clima-alerta">Hay alta probabilidad de lluvia. Revisa el equipo y el estado del camino antes de salir.</p>
            )}
          </>
        ) : (
          <p>El pronóstico para esta fecha estará disponible {DIAS_PRONOSTICO} días antes de la salida.</p>
        )
      )}

      {!fecha && (
        <div className="clima-dias">
          {clima.datos.map((dia) => <Dia key={dia.fecha} dia={dia} />)}
        </div>
      )}

      <p className="clima-fuente">
        Datos de <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
      </p>
    </div>
  );
}
