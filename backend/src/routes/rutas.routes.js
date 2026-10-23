// Asocia cada URL con su controlador
const { Router } = require('express');
const rutasController = require('../controllers/rutas.controller');

const router = Router();

router.get('/', rutasController.listar);         // GET /api/rutas
router.get('/:id', rutasController.obtenerPorId); // GET /api/rutas/:id

module.exports = router;
