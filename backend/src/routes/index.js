// Junta todas las rutas de la API
const { Router } = require('express');
const { ok } = require('../utils/respuesta');

const router = Router();

// Para comprobar que el servidor está funcionando
router.get('/salud', (req, res) => ok(res, null, 'Servidor funcionando'));

router.use('/auth', require('./auth.routes'));
router.use('/usuarios', require('./usuarios.routes'));
router.use('/rutas', require('./rutas.routes'));

module.exports = router;
