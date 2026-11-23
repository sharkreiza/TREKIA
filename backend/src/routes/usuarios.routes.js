const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { idParam } = require('../validators/comun.validator');
const { cambioPasswordLimiter } = require('../middlewares/rateLimit');
const { perfilRules, cambioPasswordRules } = require('../validators/usuarios.validator');
const usuarios = require('../controllers/usuarios.controller');

const router = Router();

router.patch('/me', requireAuth, perfilRules, validate, asyncHandler(usuarios.actualizarPerfil));
router.patch(
  '/me/password',
  requireAuth,
  cambioPasswordLimiter,
  cambioPasswordRules,
  validate,
  asyncHandler(usuarios.cambiarPassword),
);
router.get('/:id', requireAuth, idParam(), validate, asyncHandler(usuarios.obtener));

module.exports = router;
