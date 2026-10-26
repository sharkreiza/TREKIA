const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth, requireRol } = require('../middlewares/auth');
const { listarRules, obtenerRules, crearRules, actualizarRules } = require('../validators/rutas.validator');
const comentariosRules = require('../validators/comentarios.validator');
const rutas = require('../controllers/rutas.controller');
const comentarios = require('../controllers/comentarios.controller');

const router = Router();

const soloAdmin = [requireAuth, requireRol('administrador')];

router.get('/', listarRules, validate, asyncHandler(rutas.listar));
router.get('/:id', obtenerRules, validate, asyncHandler(rutas.obtener));
router.post('/', soloAdmin, crearRules, validate, asyncHandler(rutas.crear));
router.patch('/:id', soloAdmin, actualizarRules, validate, asyncHandler(rutas.actualizar));
router.delete('/:id', soloAdmin, obtenerRules, validate, asyncHandler(rutas.eliminar));

router.get('/:id/comentarios', comentariosRules.listarRules, validate, asyncHandler(comentarios.listar));
router.post('/:id/comentarios', requireAuth, comentariosRules.crearRules, validate, asyncHandler(comentarios.crear));

module.exports = router;
