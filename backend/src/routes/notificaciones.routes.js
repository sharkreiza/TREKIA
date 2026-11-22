const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { listarRules, idRules } = require('../validators/notificaciones.validator');
const notificaciones = require('../controllers/notificaciones.controller');

const router = Router();

router.use(requireAuth);

router.get('/', listarRules, validate, asyncHandler(notificaciones.listar));
router.get('/no-leidas', asyncHandler(notificaciones.noLeidas));
router.patch('/leidas', asyncHandler(notificaciones.marcarTodasLeidas));
router.patch('/:id', idRules, validate, asyncHandler(notificaciones.marcarLeida));
router.delete('/:id', idRules, validate, asyncHandler(notificaciones.eliminar));

module.exports = router;
