const propuestasRepo = require('../repositories/propuestas.repo');
const HttpError = require('../utils/HttpError');
const { ok } = require('../utils/respuesta');
const { esDuenoOAdmin } = require('../utils/permisos');

function esAdmin(usuario) {
  return usuario.rol === 'administrador';
}

async function listar(req, res) {
  const filtros = { estado: req.valid.estado };
  if (!esAdmin(req.usuario)) {
    filtros.usuarioId = req.usuario.id;
  }
  const propuestas = await propuestasRepo.listar(filtros);
  return ok(res, propuestas);
}

async function buscarPropuestaPropia(req) {
  const propuesta = await propuestasRepo.buscarPorId(req.valid.id);
  if (!propuesta || !esDuenoOAdmin(req.usuario, propuesta.usuario_id)) {
    throw new HttpError(404, 'Propuesta no encontrada');
  }
  return propuesta;
}

async function obtener(req, res) {
  const propuesta = await buscarPropuestaPropia(req);
  return ok(res, propuesta);
}

async function crear(req, res) {
  const propuesta = await propuestasRepo.crear(req.usuario.id, req.valid);
  return ok(res, propuesta, 'Propuesta enviada a revisión', 201);
}

async function revisar(req, res) {
  const { id, ...revision } = req.valid;
  const propuesta = await propuestasRepo.revisar(id, req.usuario.id, revision);

  if (propuesta === null) {
    throw new HttpError(404, 'Propuesta no encontrada');
  }
  if (propuesta === undefined) {
    throw new HttpError(409, 'La propuesta ya fue revisada');
  }
  const mensaje = propuesta.estado === 'aprobada' ? 'Propuesta aprobada y ruta publicada' : 'Propuesta rechazada';
  return ok(res, propuesta, mensaje);
}

async function eliminar(req, res) {
  const propuesta = await buscarPropuestaPropia(req);
  if (!esAdmin(req.usuario) && propuesta.estado !== 'pendiente') {
    throw new HttpError(409, 'Solo puedes eliminar propuestas pendientes');
  }
  await propuestasRepo.eliminar(propuesta.id_propuesta);
  return ok(res, null, 'Propuesta eliminada');
}

module.exports = { listar, obtener, crear, revisar, eliminar };
