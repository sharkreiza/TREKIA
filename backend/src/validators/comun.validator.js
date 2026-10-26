const { param, body } = require('express-validator');

// :id de la URL debe ser un entero positivo. toInt() deja el número ya convertido.
function idParam(nombre = 'id') {
  return param(nombre)
    .isInt({ min: 1, max: 2147483647 })
    .withMessage('Debe ser un entero positivo')
    .toInt();
}

function obligatorios(...campos) {
  return campos.map((campo) => body(campo).exists({ values: 'falsy' }).withMessage('Es obligatorio'));
}

module.exports = { idParam, obligatorios };
