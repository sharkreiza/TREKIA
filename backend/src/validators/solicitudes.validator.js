const { body } = require('express-validator');
const { idParam } = require('./comun.validator');

const RESPUESTAS = ['aceptada', 'rechazada'];

const grupoRules = [idParam()];

const solicitudRules = [idParam(), idParam('solicitudId')];

const responderRules = [
  ...solicitudRules,
  body('estado')
    .exists({ values: 'falsy' }).withMessage('El estado es obligatorio').bail()
    .isString().withMessage('Debe ser texto').bail()
    .trim()
    .toLowerCase()
    .isIn(RESPUESTAS).withMessage(`Debe ser uno de: ${RESPUESTAS.join(', ')}`),
];

module.exports = { grupoRules, solicitudRules, responderRules };
