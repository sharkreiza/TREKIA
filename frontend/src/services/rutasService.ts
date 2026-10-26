import { eliminar, enviar, obtener } from './api';
import { capitalizar, textoDuracion } from '../utils/formatos';

export type Dificultad = 'Baja' | 'Moderada' | 'Alta';

export interface Ruta {
  id: number;
  nombre: string;
  ubicacion: string;
  region: string;
  comuna: string;
  dificultad: Dificultad;
  distancia: number | null;
  desnivel: number | null;
  duracion: string;
  tipo: string;
  descripcion: string;
  lat: number | null;
  lng: number | null;
}

interface RutaApi {
  id_ruta: number;
  nombre: string;
  descripcion: string;
  region: string;
  comuna: string;
  latitud: number | null;
  longitud: number | null;
  dificultad: string;
  distancia_km: number | null;
  desnivel_positivo_m: number | null;
  duracion_minutos: number | null;
  tipo_recorrido: string;
}

export interface Comentario {
  id: number;
  usuarioId: number;
  autor: string;
  contenido: string;
  fecha: string;
}

interface ComentarioApi {
  id_comentario: number;
  usuario_id: number;
  autor: string;
  contenido: string;
  fecha_creacion: string;
}

export const tiposRecorrido: Record<string, string> = {
  ida_vuelta: 'Ida y vuelta',
  solo_ida: 'Solo ida',
};

function convertirRuta(r: RutaApi): Ruta {
  return {
    id: r.id_ruta,
    nombre: r.nombre,
    ubicacion: `${r.comuna}, ${r.region}`,
    region: r.region,
    comuna: r.comuna,
    dificultad: capitalizar(r.dificultad) as Dificultad,
    distancia: r.distancia_km,
    desnivel: r.desnivel_positivo_m,
    duracion: textoDuracion(r.duracion_minutos),
    tipo: tiposRecorrido[r.tipo_recorrido] ?? r.tipo_recorrido,
    descripcion: r.descripcion,
    lat: r.latitud,
    lng: r.longitud,
  };
}

function convertirComentario(c: ComentarioApi): Comentario {
  return {
    id: c.id_comentario,
    usuarioId: c.usuario_id,
    autor: c.autor,
    contenido: c.contenido,
    fecha: c.fecha_creacion,
  };
}

export interface Filtros {
  busqueda: string;
  region: string;
  dificultad: string;
  duracion: string;
  tipo: string;
  orden: string;
}

export const filtrosVacios: Filtros = {
  busqueda: '',
  region: '',
  dificultad: '',
  duracion: '',
  tipo: '',
  orden: '',
};

const rangosDistancia: Record<string, object> = {
  corta: { distanciaMax: 6 },
  media: { distanciaMin: 6, distanciaMax: 12 },
  larga: { distanciaMin: 12.01 },
};

const ordenes: Record<string, object> = {
  distancia: { orden: 'distancia', direccion: 'asc' },
  recientes: { orden: 'fecha', direccion: 'desc' },
};

function parametros(filtros: Filtros) {
  const tipo = Object.keys(tiposRecorrido).find((clave) => tiposRecorrido[clave] === filtros.tipo);

  return {
    limite: 100,
    busqueda: filtros.busqueda.trim() || undefined,
    region: filtros.region || undefined,
    dificultad: filtros.dificultad.toLowerCase() || undefined,
    tipoRecorrido: tipo,
    ...rangosDistancia[filtros.duracion],
    ...ordenes[filtros.orden],
  };
}

export async function obtenerRutas(filtros: Filtros = filtrosVacios) {
  const rutas = await obtener<RutaApi[]>('/rutas', parametros(filtros));
  return rutas.map(convertirRuta);
}

export async function obtenerRuta(id: number) {
  return convertirRuta(await obtener<RutaApi>(`/rutas/${id}`));
}

export async function rutasRecientes() {
  return (await obtenerRutas({ ...filtrosVacios, orden: 'recientes' })).slice(0, 3);
}

export async function obtenerComentarios(rutaId: number) {
  const comentarios = await obtener<ComentarioApi[]>(`/rutas/${rutaId}/comentarios`);
  return comentarios.map(convertirComentario);
}

export async function comentar(rutaId: number, contenido: string) {
  return convertirComentario(await enviar<ComentarioApi>(`/rutas/${rutaId}/comentarios`, { contenido }));
}

export async function eliminarComentario(id: number) {
  await eliminar(`/comentarios/${id}`);
}
