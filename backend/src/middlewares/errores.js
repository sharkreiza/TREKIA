// Ruta que no existe → 404
function noEncontrado(req, res) {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
}

// Cualquier error no controlado → 500 (sin mostrar detalles al cliente)
function manejarErrores(err, req, res, next) {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
}

module.exports = { noEncontrado, manejarErrores };
