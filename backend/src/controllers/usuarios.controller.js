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

module.exports = { obtener };
