import { enviar, modificar, obtener } from './api';
import { capitalizar, haceCuanto, textoDuracion } from '../utils/formatos';

export interface Propuesta {
  id: number;
  nombre: string;
  ubicacion: string;
  dificultad: string;
  distancia: number | null;
  duracion: string;
  autor: string;
  cuando: string;
  descripcion: string;
  estado: string;
  observaciones: string | null;
}

interface PropuestaApi {
  id_propuesta: number;
  nombre: string;
  descripcion: string;
  region: string | null;
  comuna: string | null;
  dificultad: string;
  distancia_km: number | null;
  duracion_minutos: number | null;
  autor: string;
  estado: string;
  observaciones_admin: string | null;
  fecha_propuesta: string;
}

export interface NuevaPropuesta {
  nombre: string;
  descripcion: string;
  region: string;
  comuna: string;
  dificultad: string;
  tipoRecorrido: string;
  distancia?: number;
  duracion?: number;
}

function convertirPropuesta(p: PropuestaApi): Propuesta {
  return {
    id: p.id_propuesta,
    nombre: p.nombre,
    ubicacion: [p.comuna, p.region].filter(Boolean).join(', '),
    dificultad: capitalizar(p.dificultad),
    distancia: p.distancia_km,
    duracion: textoDuracion(p.duracion_minutos),
    autor: p.autor,
    cuando: haceCuanto(p.fecha_propuesta),
    descripcion: p.descripcion,
    estado: p.estado,
    observaciones: p.observaciones_admin,
  };
}

export async function crearPropuesta(datos: NuevaPropuesta) {
  return convertirPropuesta(await enviar<PropuestaApi>('/propuestas', datos));
}

export async function obtenerPropuestas(estado?: string) {
  const propuestas = await obtener<PropuestaApi[]>('/propuestas', { estado });
  return propuestas.map(convertirPropuesta);
}

export async function obtenerPropuesta(id: number) {
  return convertirPropuesta(await obtener<PropuestaApi>(`/propuestas/${id}`));
}

export async function revisarPropuesta(id: number, aprueba: boolean, observaciones: string) {
  return convertirPropuesta(
    await modificar<PropuestaApi>(`/propuestas/${id}/revision`, {
      estado: aprueba ? 'aprobada' : 'rechazada',
      observaciones: observaciones.trim() || undefined,
    }),
  );
}
