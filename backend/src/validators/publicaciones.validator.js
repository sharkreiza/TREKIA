const { body } = require('express-validator');
const { idParam, paginacion } = require('./comun.validator');

const TIPOS = ['experiencia', 'consejo', 'foto', 'otro'];

const crearRules = [
  body('contenido')
    .exists({ values: 'falsy' }).withMessage('La publicación es obligatoria').bail()
    .isString().withMessage('Debe ser texto').bail()
    .trim()
    .isLength({ min: 1, max: 2000 }).withMessage('Debe tener entre 1 y 2000 caracteres'),
  body('tipo').optional().isString().withMessage('Debe ser texto').bail().trim().toLowerCase()
    .isIn(TIPOS).withMessage(`Debe ser uno de: ${TIPOS.join(', ')}`),
];

const listarRules = paginacion(50);

const eliminarRules = [idParam()];

module.exports = { listarRules, crearRules, eliminarRules };
