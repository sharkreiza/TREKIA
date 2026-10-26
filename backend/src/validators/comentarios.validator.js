const { body } = require('express-validator');
const { idParam } = require('./comun.validator');

const contenido = () =>
  body('contenido')
    .exists({ values: 'falsy' }).withMessage('El comentario es obligatorio').bail()
    .isString().withMessage('Debe ser texto').bail()
    .trim()
    .isLength({ min: 1, max: 1000 }).withMessage('Debe tener entre 1 y 1000 caracteres');

const listarRules = [idParam()];

const crearRules = [idParam(), contenido()];

const actualizarRules = [idParam(), contenido()];

const eliminarRules = [idParam()];

module.exports = { listarRules, crearRules, actualizarRules, eliminarRules };
