import { eliminar, modificar, obtener } from './api';
import { haceCuanto } from '../utils/formatos';

export interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  enlace: string | null;
  leida: boolean;
  cuando: string;
}

interface NotificacionApi {
  id_notificacion: number;
  tipo: string;
  mensaje: string;
  enlace: string | null;
  leida: boolean;
  fecha_creacion: string;
}

function convertirNotificacion(n: NotificacionApi): Notificacion {
  return {
    id: n.id_notificacion,
    tipo: n.tipo,
    mensaje: n.mensaje,
    enlace: n.enlace,
    leida: n.leida,
    cuando: haceCuanto(n.fecha_creacion),
  };
}

export async function obtenerNotificaciones(soloNoLeidas = false) {
  const notificaciones = await obtener<NotificacionApi[]>('/notificaciones', {
    limite: 50,
    soloNoLeidas: soloNoLeidas || undefined,
  });
  return notificaciones.map(convertirNotificacion);
}

export async function contarNoLeidas() {
  const { total } = await obtener<{ total: number }>('/notificaciones/no-leidas');
  return total;
}

export async function marcarLeida(id: number) {
  await modificar(`/notificaciones/${id}`, {});
}

export async function marcarTodasLeidas() {
  await modificar('/notificaciones/leidas', {});
}

export async function eliminarNotificacion(id: number) {
  await eliminar(`/notificaciones/${id}`);
}
