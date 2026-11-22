const notificacionesRepo = require('../repositories/notificaciones.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');

async function listar(req, res) {
  const notificaciones = await notificacionesRepo.listar(req.usuario.id, req.valid);
  return ok(res, notificaciones);
}

async function noLeidas(req, res) {
  const total = await notificacionesRepo.contarNoLeidas(req.usuario.id);
  return ok(res, { total });
}

async function marcarLeida(req, res) {
  const notificacion = await notificacionesRepo.marcarLeida(req.valid.id, req.usuario.id);
  if (!notificacion) {
    throw new HttpError(404, 'Notificación no encontrada');
  }
  return ok(res, notificacion, 'Notificación leída');
}

async function marcarTodasLeidas(req, res) {
  const actualizadas = await notificacionesRepo.marcarTodasLeidas(req.usuario.id);
  return ok(res, { actualizadas }, 'Notificaciones marcadas como leídas');
}

async function eliminar(req, res) {
  const eliminada = await notificacionesRepo.eliminar(req.valid.id, req.usuario.id);
  if (!eliminada) {
    throw new HttpError(404, 'Notificación no encontrada');
  }
  return ok(res, null, 'Notificación eliminada');
}

module.exports = { listar, noLeidas, marcarLeida, marcarTodasLeidas, eliminar };
