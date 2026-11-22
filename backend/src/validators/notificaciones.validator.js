const { query } = require('express-validator');
const { idParam } = require('./comun.validator');

const listarRules = [
  query('soloNoLeidas').optional().isBoolean().withMessage('Debe ser true o false').toBoolean(),
  query('limite').optional().isInt({ min: 1, max: 50 }).withMessage('Debe ser un entero entre 1 y 50').toInt(),
  query('pagina').optional().isInt({ min: 1 }).withMessage('Debe ser un entero positivo').toInt(),
];

const idRules = [idParam()];

module.exports = { listarRules, idRules };
