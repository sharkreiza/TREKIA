const { body } = require('express-validator');
const { idParam } = require('./comun.validator');

const crearRules = [
  body('usuarioId')
    .exists({ values: 'falsy' }).withMessage('Es obligatorio').bail()
    .isInt({ min: 1 }).withMessage('Debe ser un entero positivo')
    .toInt(),
];

const responderRules = [
  idParam(),
  body('estado')
    .exists({ values: 'falsy' }).withMessage('El estado es obligatorio').bail()
    .isString().withMessage('Debe ser texto').bail()
    .trim()
    .toLowerCase()
    .isIn(['aceptada', 'rechazada']).withMessage('Debe ser uno de: aceptada, rechazada'),
];

const eliminarRules = [idParam()];

module.exports = { crearRules, responderRules, eliminarRules };
