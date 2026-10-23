const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { idParam } = require('../validators/comun.validator');
const usuarios = require('../controllers/usuarios.controller');

const router = Router();

router.get('/:id', requireAuth, idParam(), validate, asyncHandler(usuarios.obtener));

module.exports = router;
