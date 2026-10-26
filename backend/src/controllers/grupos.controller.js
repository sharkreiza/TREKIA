const gruposRepo = require('../repositories/grupos.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');
const { esDuenoOAdmin } = require('../utils/permisos');

async function listar(req, res) {
  const grupos = await gruposRepo.listar(req.valid);
  return ok(res, grupos);
}

async function obtener(req, res) {
  const grupo = await gruposRepo.buscarPorId(req.valid.id);
  if (!grupo) {
    throw new HttpError(404, 'Grupo no encontrado');
  }
  return ok(res, grupo);
}

async function crear(req, res) {
  const grupo = await gruposRepo.crear(req.usuario.id, req.valid);
  if (!grupo) {
    throw new HttpError(400, 'La ruta indicada no existe');
  }
  return ok(res, grupo, 'Grupo creado', 201);
}

async function buscarGrupoPropio(req) {
  const grupo = await gruposRepo.buscarPorId(req.valid.id);
  if (!grupo) {
    throw new HttpError(404, 'Grupo no encontrado');
  }
  if (!esDuenoOAdmin(req.usuario, grupo.creador_id)) {
    throw new HttpError(403, 'Solo el creador del grupo puede hacer esto');
  }
  return grupo;
}

async function actualizar(req, res) {
  const { id, ...cambios } = req.valid;
  const grupo = await buscarGrupoPropio(req);

  if (cambios.cupoMaximo !== undefined && cambios.cupoMaximo < grupo.participantes) {
    throw new HttpError(400, 'El cupo máximo no puede ser menor que los participantes actuales');
  }

  const actualizado = await gruposRepo.actualizar(id, cambios);
  if (actualizado === undefined) {
    throw new HttpError(400, 'No se envió ningún campo para actualizar');
  }
  return ok(res, actualizado, 'Grupo actualizado');
}

async function eliminar(req, res) {
  await buscarGrupoPropio(req);
  await gruposRepo.eliminar(req.valid.id);
  return ok(res, null, 'Grupo eliminado');
}

module.exports = { listar, obtener, crear, actualizar, eliminar, buscarGrupoPropio };
