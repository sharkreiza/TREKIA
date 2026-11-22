const { query, body } = require('express-validator');
const { idParam, obligatorios } = require('./comun.validator');
const { GRUPO_HORARIOS } = require('../db/columnas');

const ESTADOS = ['abierto', 'cerrado', 'cancelado'];

const estado = (campo) =>
  campo.optional().isString().withMessage('Debe ser texto').bail().trim().toLowerCase()
    .isIn(ESTADOS).withMessage(`Debe ser uno de: ${ESTADOS.join(', ')}`);

const listarRules = [
  query('rutaId').optional().isInt({ min: 1 }).withMessage('Debe ser un entero positivo').toInt(),
  query('creadorId').optional().isInt({ min: 1 }).withMessage('Debe ser un entero positivo').toInt(),
  estado(query('estado')),
  query('desde').optional().isISO8601().withMessage('Debe ser una fecha válida (AAAA-MM-DD)'),
  query('hasta').optional().isISO8601().withMessage('Debe ser una fecha válida (AAAA-MM-DD)'),
  query('horario').optional().isIn(Object.keys(GRUPO_HORARIOS))
    .withMessage(`Debe ser uno de: ${Object.keys(GRUPO_HORARIOS).join(', ')}`),
  query('cupoMax').optional().isInt({ min: 2, max: 50 }).withMessage('Debe ser un entero entre 2 y 50').toInt(),
  query('conCupos').optional().isBoolean().withMessage('Debe ser true o false').toBoolean(),
  query('limite').optional().isInt({ min: 1, max: 100 }).withMessage('Debe ser un entero entre 1 y 100').toInt(),
  query('pagina').optional().isInt({ min: 1 }).withMessage('Debe ser un entero positivo').toInt(),
];

const obtenerRules = [idParam()];

const camposGrupo = [
  body('nombre').optional().isString().withMessage('Debe ser texto').bail().trim()
    .isLength({ min: 3, max: 150 }).withMessage('Debe tener entre 3 y 150 caracteres'),
  body('descripcion').optional().isString().withMessage('Debe ser texto').bail().trim()
    .isLength({ max: 2000 }).withMessage('No puede superar 2000 caracteres'),
  body('fechaSalida').optional()
    .isISO8601().withMessage('Debe ser una fecha y hora válida (AAAA-MM-DDTHH:MM)').bail()
    .custom((valor) => new Date(valor) > new Date()).withMessage('Debe ser una fecha futura'),
  body('cupoMaximo').optional().isInt({ min: 2, max: 50 }).withMessage('Debe ser un entero entre 2 y 50').toInt(),
];

const crearRules = [
  ...obligatorios('rutaId', 'nombre', 'fechaSalida', 'cupoMaximo'),
  body('rutaId').optional().isInt({ min: 1 }).withMessage('Debe ser un entero positivo').toInt(),
  ...camposGrupo,
];

const actualizarRules = [idParam(), ...camposGrupo, estado(body('estado'))];

module.exports = { listarRules, obtenerRules, crearRules, actualizarRules };
