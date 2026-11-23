const { body } = require('express-validator');
const { passwordSegura } = require('./auth.validator');

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

// Cambio de contraseña: se pide la actual (para que alguien con el celular
// desbloqueado o un token robado no pueda cambiarla) y una nueva con las mismas
// reglas del registro.
const cambioPasswordRules = [
  body('passwordActual')
    .exists({ values: 'falsy' }).withMessage('La contraseña actual es obligatoria').bail()
    .isString().withMessage('La contraseña actual debe ser texto'),
  passwordSegura('passwordNueva').bail()
    .custom((nueva, { req }) => nueva !== req.body.passwordActual)
    .withMessage('La contraseña nueva debe ser distinta a la actual'),
];

module.exports = { perfilRules, cambioPasswordRules, ZONAS_HORARIAS };
