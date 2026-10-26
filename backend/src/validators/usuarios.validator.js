const { body } = require('express-validator');

const texto = (campo, min, max) =>
  body(campo).optional().isString().withMessage('Debe ser texto').bail().trim()
    .isLength({ min, max }).withMessage(`Debe tener entre ${min} y ${max} caracteres`);

const perfilRules = [
  texto('nombre', 2, 100),
  texto('ubicacion', 0, 120),
  texto('biografia', 0, 500),
];

module.exports = { perfilRules };
