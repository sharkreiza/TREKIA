import { enviar, modificar, obtener } from './api';
import { capitalizar, formatearFecha, formatearHora } from '../utils/formatos';

export interface Grupo {
  id: number;
  rutaId: number;
  rutaNombre: string;
  creadorId: number;
  nombre: string;
  fechaSalida: string;
  fecha: string;
  hora: string;
  cupos: number;
  participantes: number;
  dificultad: string;
  descripcion: string;
  estado: string;
}

interface GrupoApi {
  id_grupo: number;
  ruta_id: number;
  ruta_nombre: string;
  creador_id: number;
  nombre: string;
  descripcion: string | null;
  fecha_salida: string;
  cupo_maximo: number;
  participantes: number;
  dificultad: string;
  estado: string;
}

export interface Solicitud {
  id: number;
  usuarioId: number;
  usuario: string;
  estado: string;
}

export interface MiSolicitud {
  id: number;
  grupoId: number;
  grupo: string;
  rutaNombre: string;
  fecha: string;
  estado: string;
}

function convertirGrupo(g: GrupoApi): Grupo {
  return {
    id: g.id_grupo,
    rutaId: g.ruta_id,
    rutaNombre: g.ruta_nombre,
    creadorId: g.creador_id,
    nombre: g.nombre,
    fechaSalida: g.fecha_salida,
    fecha: formatearFecha(g.fecha_salida),
    hora: formatearHora(g.fecha_salida),
    cupos: g.cupo_maximo,
    participantes: g.participantes,
    dificultad: capitalizar(g.dificultad),
    descripcion: g.descripcion ?? '',
    estado: g.estado,
  };
}

export async function obtenerGrupos(filtros: { rutaId?: number; creadorId?: number; estado?: string; desde?: string } = {}) {
  const grupos = await obtener<GrupoApi[]>('/grupos', { limite: 100, ...filtros });
  return grupos.map(convertirGrupo);
}

export async function proximosGrupos() {
  return obtenerGrupos({ desde: new Date().toISOString().slice(0, 10), estado: 'abierto' });
}

export async function obtenerGrupo(id: number) {
  return convertirGrupo(await obtener<GrupoApi>(`/grupos/${id}`));
}

export async function crearGrupo(datos: { rutaId: number; nombre: string; fechaSalida: string; cupoMaximo: number; descripcion: string }) {
  return convertirGrupo(await enviar<GrupoApi>('/grupos', datos));
}

export async function solicitarParticipacion(grupoId: number) {
  await enviar(`/grupos/${grupoId}/solicitudes`);
}

export async function obtenerSolicitudesGrupo(grupoId: number) {
  const solicitudes = await obtener<{ id_solicitud: number; usuario_id: number; usuario: string; estado: string }[]>(
    `/grupos/${grupoId}/solicitudes`,
  );
  return solicitudes.map<Solicitud>((s) => ({ id: s.id_solicitud, usuarioId: s.usuario_id, usuario: s.usuario, estado: s.estado }));
}

export async function responderSolicitud(grupoId: number, solicitudId: number, acepta: boolean) {
  await modificar(`/grupos/${grupoId}/solicitudes/${solicitudId}`, { estado: acepta ? 'aceptada' : 'rechazada' });
}

export async function obtenerMisSolicitudes() {
  const solicitudes = await obtener<{ id_solicitud: number; grupo_id: number; grupo: string; ruta_nombre: string; fecha_salida: string; estado: string }[]>(
    '/solicitudes',
  );
  return solicitudes.map<MiSolicitud>((s) => ({
    id: s.id_solicitud,
    grupoId: s.grupo_id,
    grupo: s.grupo,
    rutaNombre: s.ruta_nombre,
    fecha: formatearFecha(s.fecha_salida),
    estado: s.estado,
  }));
}
