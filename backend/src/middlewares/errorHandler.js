const { fail } = require('../utils/respuesta');

// Mensajes específicos para restricciones UNIQUE del esquema (23505).
const MENSAJES_UNIQUE = {
  usuarios_correo_key: 'El correo ya está registrado',
  uq_solicitud_usuario_grupo: 'Ya enviaste una solicitud a este grupo',
  uq_amistad_usuarios: 'Ya existe una solicitud de amistad entre estos usuarios',
  uq_amistad_par_unico: 'Ya existe una solicitud de amistad entre estos usuarios',
  pk_rutas_guardadas: 'La ruta ya está guardada',
};

function mensajeUnique(err) {
  if (MENSAJES_UNIQUE[err.constraint]) return MENSAJES_UNIQUE[err.constraint];
  if (err.table === 'usuarios' && /\(correo\)/.test(err.detail || '')) {
    return 'El correo ya está registrado';
  }
  return 'El registro ya existe';
}

// Traduce errores de PostgreSQL a { status, message } sin exponer el detalle.
function traducirErrorPg(err) {
  switch (err.code) {
    case '23505': // unique_violation
      return { status: 409, message: mensajeUnique(err) };
    case '23503': // foreign_key_violation
      return { status: 409, message: 'El registro está relacionado con datos que no existen o que dependen de él' };
    case '23514': // check_violation (p. ej. chk_distancia_positiva, chk_duracion_positiva)
      return { status: 400, message: 'Algún dato no cumple las restricciones permitidas' };
    case '23502': // not_null_violation
      return { status: 400, message: 'Falta un dato obligatorio' };
    case '22P02': // invalid_text_representation (p. ej. valor inválido para un ENUM)
      return { status: 400, message: 'Formato de dato inválido' };
    case '22001': // string_data_right_truncation (texto más largo que el varchar)
      return { status: 400, message: 'Algún texto supera el largo permitido' };
    case '22003': // numeric_value_out_of_range
      return { status: 400, message: 'Algún número está fuera del rango permitido' };
    default:
      return null;
  }
}

function notFound(req, res) {
  return fail(res, 404, 'Recurso no encontrado');
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return fail(res, 400, 'El cuerpo de la petición no es un JSON válido');
  }
  if (err.type === 'entity.too.large') {
    return fail(res, 413, 'El cuerpo de la petición es demasiado grande');
  }

  // Errores lanzados por la propia app (HttpError)
  if (err.status && err.status < 500) {
    return fail(res, err.status, err.message, err.errors || null);
  }

  const pg = traducirErrorPg(err);
  if (pg) {
    return fail(res, pg.status, pg.message);
  }

  // Cualquier otro error: se registra SOLO en la consola del servidor
  // y al cliente se le responde un mensaje genérico, sin stack ni detalle.
  console.error('[error]', req.method, req.originalUrl, err);
  return fail(res, 500, 'Error interno del servidor');
}

module.exports = { notFound, errorHandler };
