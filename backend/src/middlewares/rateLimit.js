const rateLimit = require('express-rate-limit');
const { fail } = require('../utils/respuesta');

// Responde el 429 con el mismo formato JSON que el resto de la API.
function limitador({ windowMs, limit, message }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => fail(res, 429, message),
  });
}

// 10 intentos de login cada 15 minutos por IP
const loginLimiter = limitador({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos',
});

// 5 registros por hora por IP
const registroLimiter = limitador({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: 'Demasiados registros desde esta IP. Intenta de nuevo más tarde',
});

module.exports = { loginLimiter, registroLimiter };
