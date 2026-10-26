const amistadesRepo = require('../repositories/amistades.repo');
const usuariosRepo = require('../repositories/usuarios.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');

async function amigos(req, res) {
  const lista = await amistadesRepo.listarAmigos(req.usuario.id);
  return ok(res, lista);
}

async function recibidas(req, res) {
  const lista = await amistadesRepo.listarRecibidas(req.usuario.id);
  return ok(res, lista);
}

async function crear(req, res) {
  const { usuarioId } = req.valid;
  if (usuarioId === req.usuario.id) {
    throw new HttpError(400, 'No puedes enviarte una solicitud a ti mismo');
  }
  if (!(await usuariosRepo.buscarPorId(usuarioId))) {
    throw new HttpError(404, 'Usuario no encontrado');
  }
  const amistad = await amistadesRepo.crear(req.usuario.id, usuarioId);
  return ok(res, amistad, 'Solicitud de amistad enviada', 201);
}

async function responder(req, res) {
  const amistad = await amistadesRepo.buscarPorId(req.valid.id);
  if (!amistad || amistad.destinatario_id !== req.usuario.id) {
    throw new HttpError(404, 'Solicitud no encontrada');
  }
  if (amistad.estado !== 'pendiente') {
    throw new HttpError(409, 'La solicitud ya fue respondida');
  }
  const actualizada = await amistadesRepo.responder(amistad.id_amistad, req.valid.estado);
  return ok(res, actualizada, 'Solicitud respondida');
}

async function eliminar(req, res) {
  const amistad = await amistadesRepo.buscarPorId(req.valid.id);
  const participa = amistad && [amistad.solicitante_id, amistad.destinatario_id].includes(req.usuario.id);
  if (!participa) {
    throw new HttpError(404, 'Amistad no encontrada');
  }
  await amistadesRepo.eliminar(amistad.id_amistad);
  return ok(res, null, 'Amistad eliminada');
}

module.exports = { amigos, recibidas, crear, responder, eliminar };
