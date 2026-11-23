const bcrypt = require('bcrypt');
const env = require('../config/env');
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

async function cambiarPassword(req, res) {
  const { passwordActual, passwordNueva } = req.valid;

  const hashActual = await usuariosRepo.buscarHashPorId(req.usuario.id);
  if (!hashActual) {
    throw new HttpError(401, 'La sesión ya no es válida');
  }

  // Se responde 400 y no 401: el 401 significa "sesión inválida" y haría que la
  // app cierre la sesión, cuando el problema es solo un dato mal escrito.
  if (!(await bcrypt.compare(passwordActual, hashActual))) {
    throw new HttpError(400, 'Datos inválidos', [
      { campo: 'passwordActual', mensaje: 'La contraseña actual es incorrecta' },
    ]);
  }

  const passwordHash = await bcrypt.hash(passwordNueva, env.bcryptRounds);
  await usuariosRepo.actualizarPassword(req.usuario.id, passwordHash);
  return ok(res, null, 'Contraseña actualizada');
}

module.exports = { obtener, actualizarPerfil, cambiarPassword };
