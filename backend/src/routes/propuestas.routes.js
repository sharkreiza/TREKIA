const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth, requireRol } = require('../middlewares/auth');
const { listarRules, obtenerRules, crearRules, revisarRules } = require('../validators/propuestas.validator');
const propuestas = require('../controllers/propuestas.controller');

const router = Router();

router.use(requireAuth);

router.get('/', listarRules, validate, asyncHandler(propuestas.listar));
router.get('/:id', obtenerRules, validate, asyncHandler(propuestas.obtener));
router.post('/', crearRules, validate, asyncHandler(propuestas.crear));
router.patch('/:id/revision', requireRol('administrador'), revisarRules, validate, asyncHandler(propuestas.revisar));
router.delete('/:id', obtenerRules, validate, asyncHandler(propuestas.eliminar));

module.exports = router;
