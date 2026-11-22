const solicitudesRepo = require('../repositories/solicitudes.repo');
const gruposRepo = require('../repositories/grupos.repo');
const usuariosRepo = require('../repositories/usuarios.repo');
const { buscarGrupoPropio } = require('./grupos.controller');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');
const { esDuenoOAdmin } = require('../utils/permisos');
const notificar = require('../utils/notificar');

async function misSolicitudes(req, res) {
  const solicitudes = await solicitudesRepo.listarPorUsuario(req.usuario.id);
  return ok(res, solicitudes);
}

async function listar(req, res) {
  await buscarGrupoPropio(req);
  const solicitudes = await solicitudesRepo.listarPorGrupo(req.valid.id);
  return ok(res, solicitudes);
}

async function crear(req, res) {
  const grupo = await gruposRepo.buscarPorId(req.valid.id);
  if (!grupo) {
    throw new HttpError(404, 'Grupo no encontrado');
  }
  if (grupo.creador_id === req.usuario.id) {
    throw new HttpError(400, 'Ya eres el creador de este grupo');
  }
  if (grupo.estado !== 'abierto') {
    throw new HttpError(409, 'El grupo no está recibiendo solicitudes');
  }
  if (grupo.participantes >= grupo.cupo_maximo) {
    throw new HttpError(409, 'El grupo está completo');
  }
  const solicitud = await solicitudesRepo.crear(req.valid.id, req.usuario.id);

  const solicitante = await usuariosRepo.buscarPorId(req.usuario.id);
  await notificar(grupo.creador_id, {
    tipo: 'solicitud_grupo',
    mensaje: `${solicitante.nombre} quiere unirse a tu grupo ${grupo.nombre}`,
    enlace: `/app/grupos/${grupo.id_grupo}`,
  });

  return ok(res, solicitud, 'Solicitud enviada', 201);
}

async function buscarSolicitudDelGrupo(req) {
  const solicitud = await solicitudesRepo.buscarPorId(req.valid.solicitudId);
  if (!solicitud || solicitud.grupo_id !== req.valid.id) {
    throw new HttpError(404, 'Solicitud no encontrada');
  }
  return solicitud;
}

async function responder(req, res) {
  const grupo = await buscarGrupoPropio(req);
  const solicitud = await buscarSolicitudDelGrupo(req);

  if (solicitud.estado !== 'pendiente') {
    throw new HttpError(409, 'La solicitud ya fue respondida');
  }
  if (req.valid.estado === 'aceptada' && grupo.participantes >= grupo.cupo_maximo) {
    throw new HttpError(409, 'El grupo está completo');
  }

  const actualizada = await solicitudesRepo.responder(solicitud.id_solicitud, req.valid.estado);

  await notificar(solicitud.usuario_id, {
    tipo: 'respuesta_grupo',
    mensaje: `Tu solicitud para unirte a ${grupo.nombre} fue ${req.valid.estado}`,
    enlace: `/app/grupos/${grupo.id_grupo}`,
  });

  return ok(res, actualizada, 'Solicitud respondida');
}

async function eliminar(req, res) {
  const grupo = await gruposRepo.buscarPorId(req.valid.id);
  if (!grupo) {
    throw new HttpError(404, 'Grupo no encontrado');
  }
  const solicitud = await buscarSolicitudDelGrupo(req);

  if (solicitud.usuario_id !== req.usuario.id && !esDuenoOAdmin(req.usuario, grupo.creador_id)) {
    throw new HttpError(403, 'No puedes eliminar esta solicitud');
  }

  await solicitudesRepo.eliminar(solicitud.id_solicitud);
  return ok(res, null, 'Solicitud eliminada');
}

module.exports = { misSolicitudes, listar, crear, responder, eliminar };
