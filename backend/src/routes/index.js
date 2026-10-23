const { Router } = require('express');

const router = Router();

router.use('/auth', require('./auth.routes'));
router.use('/usuarios', require('./usuarios.routes'));
router.use('/rutas', require('./rutas.routes'));

module.exports = router;
