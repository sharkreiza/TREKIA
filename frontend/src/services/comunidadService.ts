import { eliminar, enviar, modificar, obtener } from './api';
import { haceCuanto } from '../utils/formatos';

export interface Publicacion {
  id: number;
  usuarioId: number;
  autor: string;
  cuando: string;
  texto: string;
}

export interface SolicitudAmistad {
  id: number;
  usuarioId: number;
  nombre: string;
  cuando: string;
}

export interface Amigo {
  idAmistad: number;
  id: number;
  nombre: string;
  ubicacion: string | null;
}

interface PublicacionApi {
  id_publicacion: number;
  usuario_id: number;
  autor: string;
  contenido: string;
  fecha_creacion: string;
}

function convertirPublicacion(p: PublicacionApi): Publicacion {
  return {
    id: p.id_publicacion,
    usuarioId: p.usuario_id,
    autor: p.autor,
    cuando: haceCuanto(p.fecha_creacion),
    texto: p.contenido,
  };
}

export async function obtenerPublicaciones() {
  const publicaciones = await obtener<PublicacionApi[]>('/publicaciones');
  return publicaciones.map(convertirPublicacion);
}

export async function publicar(texto: string) {
  return convertirPublicacion(await enviar<PublicacionApi>('/publicaciones', { contenido: texto }));
}

export async function eliminarPublicacion(id: number) {
  await eliminar(`/publicaciones/${id}`);
}

export async function obtenerSolicitudesAmistad() {
  const solicitudes = await obtener<{ id_amistad: number; solicitante_id: number; solicitante: string; fecha_solicitud: string }[]>(
    '/amistades/solicitudes',
  );
  return solicitudes.map<SolicitudAmistad>((s) => ({
    id: s.id_amistad,
    usuarioId: s.solicitante_id,
    nombre: s.solicitante,
    cuando: haceCuanto(s.fecha_solicitud),
  }));
}

export async function responderSolicitudAmistad(id: number, acepta: boolean) {
  await modificar(`/amistades/${id}`, { estado: acepta ? 'aceptada' : 'rechazada' });
}

export async function obtenerAmigos() {
  const amigos = await obtener<{ id_amistad: number; id_usuario: number; nombre: string; ubicacion: string | null }[]>('/amistades');
  return amigos.map<Amigo>((a) => ({ idAmistad: a.id_amistad, id: a.id_usuario, nombre: a.nombre, ubicacion: a.ubicacion }));
}

export async function enviarSolicitudAmistad(usuarioId: number) {
  await enviar('/amistades', { usuarioId });
}
