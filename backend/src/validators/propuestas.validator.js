const { query, body } = require('express-validator');
const { idParam, obligatorios } = require('./comun.validator');
const { camposRuta } = require('./rutas.validator');

const ESTADOS = ['pendiente', 'aprobada', 'rechazada'];

const listarRules = [
  query('estado').optional().isString().withMessage('Debe ser texto').bail().trim().toLowerCase()
    .isIn(ESTADOS).withMessage(`Debe ser uno de: ${ESTADOS.join(', ')}`),
];

const obtenerRules = [idParam()];

const crearRules = [
  ...obligatorios('nombre', 'descripcion', 'region', 'comuna', 'dificultad', 'tipoRecorrido'),
  ...camposRuta,
];

const revisarRules = [
  idParam(),
  body('estado')
    .exists({ values: 'falsy' }).withMessage('El estado es obligatorio').bail()
    .isString().withMessage('Debe ser texto').bail()
    .trim()
    .toLowerCase()
    .isIn(['aprobada', 'rechazada']).withMessage('Debe ser uno de: aprobada, rechazada'),
  body('observaciones').optional().isString().withMessage('Debe ser texto').bail().trim()
    .isLength({ max: 2000 }).withMessage('No puede superar 2000 caracteres'),
  body('tipoRuta').optional().isString().withMessage('Debe ser texto').bail().trim()
    .isLength({ min: 1, max: 30 }).withMessage('Debe tener entre 1 y 30 caracteres'),
];

module.exports = { listarRules, obtenerRules, crearRules, revisarRules };
