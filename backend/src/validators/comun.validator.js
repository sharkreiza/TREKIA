const { param } = require('express-validator');

// :id de la URL debe ser un entero positivo. toInt() deja el número ya convertido.
function idParam(nombre = 'id') {
  return param(nombre)
    .isInt({ min: 1, max: 2147483647 })
    .withMessage('Debe ser un entero positivo')
    .toInt();
}

module.exports = { idParam };
