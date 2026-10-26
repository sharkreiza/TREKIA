const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const solicitudes = require('../controllers/solicitudes.controller');

const router = Router();

router.get('/', requireAuth, asyncHandler(solicitudes.misSolicitudes));

module.exports = router;
