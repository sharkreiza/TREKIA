const publicacionesRepo = require('../repositories/publicaciones.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');
const { esDuenoOAdmin } = require('../utils/permisos');

async function listar(req, res) {
  const publicaciones = await publicacionesRepo.listar(req.usuario.id);
  return ok(res, publicaciones);
}

async function crear(req, res) {
  const publicacion = await publicacionesRepo.crear(req.usuario.id, req.valid);
  return ok(res, publicacion, 'Publicación creada', 201);
}

async function eliminar(req, res) {
  const publicacion = await publicacionesRepo.buscarPorId(req.valid.id);
  if (!publicacion) {
    throw new HttpError(404, 'Publicación no encontrada');
  }
  if (!esDuenoOAdmin(req.usuario, publicacion.usuario_id)) {
    throw new HttpError(403, 'Solo el autor puede eliminar esta publicación');
  }
  await publicacionesRepo.eliminar(req.valid.id);
  return ok(res, null, 'Publicación eliminada');
}

module.exports = { listar, crear, eliminar };
