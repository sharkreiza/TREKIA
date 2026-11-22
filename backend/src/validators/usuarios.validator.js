const { body } = require('express-validator');

const texto = (campo, min, max) =>
  body(campo).optional().isString().withMessage('Debe ser texto').bail().trim()
    .isLength({ min, max }).withMessage(`Debe tener entre ${min} y ${max} caracteres`);

const ZONAS_HORARIAS = Intl.supportedValuesOf('timeZone');

const perfilRules = [
  texto('nombre', 2, 100),
  texto('ubicacion', 0, 120),
  texto('biografia', 0, 500),
  body('correoAdicional').optional().isString().withMessage('Debe ser texto').bail().trim().toLowerCase()
    .if((valor) => valor !== '')
    .isEmail().withMessage('El correo adicional no es válido').bail()
    .isLength({ max: 150 }).withMessage('El correo adicional no puede superar 150 caracteres'),
  body('zonaHoraria').optional().isString().withMessage('Debe ser texto').bail().trim()
    .isIn(ZONAS_HORARIAS).withMessage('La zona horaria no es válida'),
];

module.exports = { perfilRules, ZONAS_HORARIAS };
