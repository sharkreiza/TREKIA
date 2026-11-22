const jwt = require('jsonwebtoken');
const env = require('../config/env');
const HttpError = require('../utils/HttpError');

// Exige "Authorization: Bearer <token>" válido y deja en req.usuario { id, rol }.
function requireAuth(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Debes iniciar sesión'));
  }

  try {
    // Se fija el algoritmo para que no se acepte un token con "alg" distinto.
    const payload = jwt.verify(token, env.jwt.secret, { algorithms: ['HS256'] });
    req.usuario = { id: Number(payload.sub), rol: payload.rol };
    return next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'La sesión expiró' : 'Token inválido';
    return next(new HttpError(401, message));
  }
}

// Se usa después de requireAuth: requireRol('administrador')
function requireRol(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return next(new HttpError(403, 'No tienes permisos para esta acción'));
    }
    return next();
  };
}

function firmarToken(usuario) {
  return jwt.sign({ rol: usuario.rol }, env.jwt.secret, {
    subject: String(usuario.id_usuario),
    expiresIn: env.jwt.expiresIn,
    algorithm: 'HS256',
  });
}

module.exports = { requireAuth, requireRol, firmarToken };
