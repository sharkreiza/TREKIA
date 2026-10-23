const { validationResult, matchedData } = require('express-validator');
const { fail } = require('../utils/respuesta');

// Se pone después de las reglas de express-validator.
// - Si hay errores: 400 con [{ campo, mensaje }] (un mensaje por campo).
// - Si no: deja en req.valid SOLO los campos validados (matchedData), así un
//   campo extra como "rol" que mande el cliente nunca llega al controlador.
function validate(req, res, next) {
  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const errors = resultado
      .array({ onlyFirstError: true })
      .map((e) => ({ campo: e.path, mensaje: e.msg }));
    return fail(res, 400, 'Datos inválidos', errors);
  }

  req.valid = matchedData(req, { includeOptionals: false });
  return next();
}

module.exports = validate;
