const rutasRepo = require('../repositories/rutas.repo');
const openMeteo = require('../integraciones/openMeteo');
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

async function clima(req, res) {
  const ruta = await rutasRepo.buscarPorId(req.valid.id);
  if (!ruta) {
    throw new HttpError(404, 'Ruta no encontrada');
  }
  if (ruta.latitud === null || ruta.longitud === null) {
    throw new HttpError(404, 'La ruta no tiene coordenadas para consultar el clima');
  }

  const dias = await openMeteo.pronostico(ruta.latitud, ruta.longitud, req.valid.dias || 7);
  return ok(res, { ruta_id: ruta.id_ruta, fuente: 'Open-Meteo', dias });
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

async function crear(req, res) {
  const ruta = await rutasRepo.crear(req.usuario.id, req.valid);
  return ok(res, ruta, 'Ruta creada', 201);
}

async function eliminar(req, res) {
  const eliminada = await rutasRepo.eliminar(req.valid.id);
  if (!eliminada) {
    throw new HttpError(404, 'Ruta no encontrada');
  }
  return ok(res, null, 'Ruta eliminada');
}

module.exports = { listar, obtener, clima, crear, actualizar, eliminar };
