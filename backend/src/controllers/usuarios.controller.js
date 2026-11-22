const usuariosRepo = require('../repositories/usuarios.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');

async function obtener(req, res) {
  const usuario = await usuariosRepo.buscarPerfil(req.valid.id);
  if (!usuario) {
    throw new HttpError(404, 'Usuario no encontrado');
  }
  return ok(res, usuario);
}

async function actualizarPerfil(req, res) {
  if (req.valid.correoAdicional) {
    const actual = await usuariosRepo.buscarPorId(req.usuario.id);
    if (actual && actual.correo === req.valid.correoAdicional) {
      throw new HttpError(400, 'El correo adicional debe ser distinto al correo principal');
    }
  }

  const usuario = await usuariosRepo.actualizar(req.usuario.id, req.valid);
  if (usuario === undefined) {
    throw new HttpError(400, 'No se envió ningún campo para actualizar');
  }
  return ok(res, usuario, 'Perfil actualizado');
}

module.exports = { obtener, actualizarPerfil };
