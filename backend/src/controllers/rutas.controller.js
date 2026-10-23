// Recibe la petición, llama al servicio y responde
const rutasService = require('../services/rutas.service');

function listar(req, res) {
  const rutas = rutasService.listar(req.query);
  res.status(200).json({ ok: true, data: rutas });
}

function obtenerPorId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ ok: false, error: 'El id debe ser un número' });
  }

  const ruta = rutasService.obtenerPorId(id);
  if (!ruta) {
    return res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
  }

  res.status(200).json({ ok: true, data: ruta });
}

module.exports = { listar, obtenerPorId };
