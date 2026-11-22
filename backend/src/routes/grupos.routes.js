const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { listarRules, obtenerRules, crearRules, actualizarRules } = require('../validators/grupos.validator');
const { grupoRules, solicitudRules, responderRules } = require('../validators/solicitudes.validator');
const grupos = require('../controllers/grupos.controller');
const solicitudes = require('../controllers/solicitudes.controller');

const router = Router();

router.get('/', listarRules, validate, asyncHandler(grupos.listar));
router.get('/:id', obtenerRules, validate, asyncHandler(grupos.obtener));
router.post('/', requireAuth, crearRules, validate, asyncHandler(grupos.crear));
router.patch('/:id', requireAuth, actualizarRules, validate, asyncHandler(grupos.actualizar));
router.delete('/:id', requireAuth, obtenerRules, validate, asyncHandler(grupos.eliminar));

router.get('/:id/solicitudes', requireAuth, grupoRules, validate, asyncHandler(solicitudes.listar));
router.post('/:id/solicitudes', requireAuth, grupoRules, validate, asyncHandler(solicitudes.crear));
router.patch('/:id/solicitudes/:solicitudId', requireAuth, responderRules, validate, asyncHandler(solicitudes.responder));
router.delete('/:id/solicitudes/:solicitudId', requireAuth, solicitudRules, validate, asyncHandler(solicitudes.eliminar));

module.exports = router;
