const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { actualizarRules, eliminarRules } = require('../validators/comentarios.validator');
const comentarios = require('../controllers/comentarios.controller');

const router = Router();

router.patch('/:id', requireAuth, actualizarRules, validate, asyncHandler(comentarios.actualizar));
router.delete('/:id', requireAuth, eliminarRules, validate, asyncHandler(comentarios.eliminar));

module.exports = router;
