const crypto = require('crypto');
const bcrypt = require('bcrypt');
const env = require('../config/env');
const usuariosRepo = require('../repositories/usuarios.repo');
const { firmarToken } = require('../middlewares/auth');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');

const CREDENCIALES_INVALIDAS = 'Credenciales inválidas';

// Hash ficticio con el mismo costo que los reales. Si el correo no existe se
// compara igual contra este hash, así la respuesta tarda lo mismo que cuando
// el correo existe y la contraseña es incorrecta (no se filtra qué correos hay).
const hashFicticio = bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), env.bcryptRounds);

async function registrar(req, res) {
  // req.valid solo contiene nombre, correo y password (ver middlewares/validate.js).
  const { nombre, correo, password } = req.valid;

  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
  // Si el correo ya existe, PostgreSQL lanza 23505 y el errorHandler responde 409.
  const usuario = await usuariosRepo.crear({ nombre, correo, passwordHash });

  const token = firmarToken(usuario);
  return ok(res, { token, usuario }, 'Usuario registrado', 201);
}

async function login(req, res) {
  const { correo, password } = req.valid;

  const registro = await usuariosRepo.buscarCredenciales(correo);
  const coincide = await bcrypt.compare(password, registro ? registro.password_hash : hashFicticio);

  if (!registro || !coincide) {
    throw new HttpError(401, CREDENCIALES_INVALIDAS);
  }

  const { password_hash: _omitido, ...usuario } = registro;
  const token = firmarToken(usuario);
  return ok(res, { token, usuario }, 'Sesión iniciada');
}

async function yo(req, res) {
  const usuario = await usuariosRepo.buscarPorId(req.usuario.id);
  if (!usuario) {
    throw new HttpError(401, 'La sesión ya no es válida');
  }
  return ok(res, usuario);
}

module.exports = { registrar, login, yo };
