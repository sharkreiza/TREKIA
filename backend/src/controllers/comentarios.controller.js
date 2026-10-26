const comentariosRepo = require('../repositories/comentarios.repo');
const rutasRepo = require('../repositories/rutas.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');
const { esDuenoOAdmin } = require('../utils/permisos');

async function listar(req, res) {
  const ruta = await rutasRepo.buscarPorId(req.valid.id);
  if (!ruta) {
    throw new HttpError(404, 'Ruta no encontrada');
  }
  const comentarios = await comentariosRepo.listarPorRuta(req.valid.id);
  return ok(res, comentarios);
}

async function crear(req, res) {
  const comentario = await comentariosRepo.crear(req.usuario.id, req.valid.id, req.valid.contenido);
  if (!comentario) {
    throw new HttpError(404, 'Ruta no encontrada');
  }
  return ok(res, comentario, 'Comentario publicado', 201);
}

async function buscarComentarioPropio(req) {
  const comentario = await comentariosRepo.buscarPorId(req.valid.id);
  if (!comentario) {
    throw new HttpError(404, 'Comentario no encontrado');
  }
  if (!esDuenoOAdmin(req.usuario, comentario.usuario_id)) {
    throw new HttpError(403, 'Solo el autor puede modificar este comentario');
  }
  return comentario;
}

async function actualizar(req, res) {
  const comentario = await comentariosRepo.buscarPorId(req.valid.id);
  if (!comentario) {
    throw new HttpError(404, 'Comentario no encontrado');
  }
  if (comentario.usuario_id !== req.usuario.id) {
    throw new HttpError(403, 'Solo el autor puede editar este comentario');
  }
  const actualizado = await comentariosRepo.actualizar(req.valid.id, req.valid.contenido);
  return ok(res, actualizado, 'Comentario actualizado');
}

async function eliminar(req, res) {
  await buscarComentarioPropio(req);
  await comentariosRepo.eliminar(req.valid.id);
  return ok(res, null, 'Comentario eliminado');
}

module.exports = { listar, crear, actualizar, eliminar };
