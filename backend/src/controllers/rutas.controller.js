const rutasRepo = require('../repositories/rutas.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');

async function listar(req, res) {
  const rutas = await rutasRepo.listar(req.valid);
  return ok(res, rutas);
}

async function obtener(req, res) {
  const ruta = await rutasRepo.buscarPorId(req.valid.id);
  if (!ruta) {
    throw new HttpError(404, 'Ruta no encontrada');
  }
  return ok(res, ruta);
}

async function actualizar(req, res) {
  const { id, ...cambios } = req.valid;
  const ruta = await rutasRepo.actualizar(id, cambios);

  if (ruta === undefined) {
    throw new HttpError(400, 'No se envió ningún campo para actualizar');
  }
  if (ruta === null) {
    throw new HttpError(404, 'Ruta no encontrada');
  }
  return ok(res, ruta, 'Ruta actualizada');
}

module.exports = { listar, obtener, actualizar };
