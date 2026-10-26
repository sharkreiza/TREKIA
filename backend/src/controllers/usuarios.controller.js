const usuariosRepo = require('../repositories/usuarios.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');

async function obtener(req, res) {
  const usuario = await usuariosRepo.buscarPorId(req.valid.id);
  if (!usuario) {
    throw new HttpError(404, 'Usuario no encontrado');
  }
  return ok(res, usuario);
}

async function actualizarPerfil(req, res) {
  const usuario = await usuariosRepo.actualizar(req.usuario.id, req.valid);
  if (usuario === undefined) {
    throw new HttpError(400, 'No se envió ningún campo para actualizar');
  }
  return ok(res, usuario, 'Perfil actualizado');
}

module.exports = { obtener, actualizarPerfil };
