const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { crearRules, responderRules, eliminarRules } = require('../validators/amistades.validator');
const amistades = require('../controllers/amistades.controller');

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(amistades.amigos));
router.get('/solicitudes', asyncHandler(amistades.recibidas));
router.post('/', crearRules, validate, asyncHandler(amistades.crear));
router.patch('/:id', responderRules, validate, asyncHandler(amistades.responder));
router.delete('/:id', eliminarRules, validate, asyncHandler(amistades.eliminar));

module.exports = router;
