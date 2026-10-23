// Junta todas las rutas de la API
const { Router } = require('express');

const router = Router();

// Para comprobar que el servidor está funcionando
router.get('/salud', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor funcionando' });
});

router.use('/rutas', require('./rutas.routes'));

module.exports = router;
