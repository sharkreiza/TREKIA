const { body } = require('express-validator');

// bcrypt solo usa los primeros 72 BYTES. Con tildes o emojis un carácter puede
// ocupar 2-4 bytes, así que además de contar caracteres se cuentan bytes.
const MAX_BYTES_BCRYPT = 72;

const correo = () =>
  body('correo')
    .exists({ values: 'falsy' }).withMessage('El correo es obligatorio').bail()
    .isString().withMessage('El correo debe ser texto').bail()
    .trim()
    .toLowerCase()
    .isEmail().withMessage('El correo no es válido').bail()
    .isLength({ max: 150 }).withMessage('El correo no puede superar 150 caracteres');

const registroRules = [
  body('nombre')
    .exists({ values: 'falsy' }).withMessage('El nombre es obligatorio').bail()
    .isString().withMessage('El nombre debe ser texto').bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  correo(),

  body('password')
    .exists({ values: 'falsy' }).withMessage('La contraseña es obligatoria').bail()
    .isString().withMessage('La contraseña debe ser texto').bail()
    .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres').bail()
    .custom((value) => Buffer.byteLength(value, 'utf8') <= MAX_BYTES_BCRYPT)
    .withMessage('La contraseña es demasiado larga (máximo 72 bytes)').bail()
    .matches(/\p{L}/u).withMessage('La contraseña debe contener al menos una letra').bail()
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),

  // No hay regla para "rol": aunque venga en el body, matchedData lo descarta.
];

const loginRules = [
  correo(),
  body('password')
    .exists({ values: 'falsy' }).withMessage('La contraseña es obligatoria').bail()
    .isString().withMessage('La contraseña debe ser texto'),
];

module.exports = { registroRules, loginRules };
