const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { listarRules, crearRules, eliminarRules } = require('../validators/publicaciones.validator');
const publicaciones = require('../controllers/publicaciones.controller');

const router = Router();

router.use(requireAuth);

router.get('/', listarRules, validate, asyncHandler(publicaciones.listar));
router.post('/', crearRules, validate, asyncHandler(publicaciones.crear));
router.delete('/:id', eliminarRules, validate, asyncHandler(publicaciones.eliminar));

module.exports = router;
