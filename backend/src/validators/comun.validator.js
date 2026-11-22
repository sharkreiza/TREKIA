const { param, body, query } = require('express-validator');

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

function paginacion(maximo = 100) {
  return [
    query('limite').optional().isInt({ min: 1, max: maximo }).withMessage(`Debe ser un entero entre 1 y ${maximo}`).toInt(),
    query('pagina').optional().isInt({ min: 1 }).withMessage('Debe ser un entero positivo').toInt(),
  ];
}

module.exports = { idParam, obligatorios, paginacion };
