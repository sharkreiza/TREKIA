const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth, requireRol } = require('../middlewares/auth');
const { listarRules, obtenerRules, actualizarRules } = require('../validators/rutas.validator');
const rutas = require('../controllers/rutas.controller');

const router = Router();

router.get('/', listarRules, validate, asyncHandler(rutas.listar));
router.get('/:id', obtenerRules, validate, asyncHandler(rutas.obtener));
router.patch(
  '/:id',
  requireAuth,
  requireRol('administrador'),
  actualizarRules,
  validate,
  asyncHandler(rutas.actualizar),
);

module.exports = router;
