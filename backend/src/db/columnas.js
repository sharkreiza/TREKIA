// Único lugar donde se escriben nombres de columnas que se usan en SQL dinámico.
// Las claves son lo que el cliente puede enviar; los valores son las columnas
// reales. Si una clave no está aquí, nunca llega a la consulta.
// Esquema de referencia: database/trekia_schema.sql

// ---------------------------------------------------------------- usuarios
// Columnas públicas: se usan en todos los SELECT/RETURNING de usuarios.
// password_hash NO está en esta lista, por eso nunca sale en una respuesta.
const USUARIO_COLUMNAS_PUBLICAS = [
  'id_usuario',
  'nombre',
  'correo',
  'rol',
  'ubicacion',
  'biografia',
  'foto_perfil_url',
  'foto_portada_url',
  'fecha_creacion',
].join(', ');

// ---------------------------------------------------------------- rutas
const RUTA_COLUMNAS_PUBLICAS = [
  'id_ruta',
  'creador_id',
  'nombre',
  'descripcion',
  'region',
  'comuna',
  'latitud',
  'longitud',
  'dificultad',
  'distancia_km',
  'desnivel_positivo_m',
  'desnivel_negativo_m',
  'duracion_minutos',
  'tipo_ruta',
  'tipo_recorrido',
  'visibilidad',
  'fecha_creacion',
].join(', ');

// Filtros de igualdad permitidos en GET /rutas?region=...&dificultad=...
const RUTA_FILTROS_IGUALDAD = {
  region: 'region',
  comuna: 'comuna',
  dificultad: 'dificultad',
  tipoRecorrido: 'tipo_recorrido',
};

// Filtros de rango permitidos en GET /rutas?distanciaMin=...&duracionMax=...
const RUTA_FILTROS_RANGO = {
  distanciaMin: { columna: 'distancia_km', operador: '>=' },
  distanciaMax: { columna: 'distancia_km', operador: '<=' },
  duracionMax: { columna: 'duracion_minutos', operador: '<=' },
};

// Columnas por las que se busca texto con ?busqueda=
const RUTA_COLUMNAS_BUSQUEDA = ['nombre', 'region', 'comuna'];

// Columnas permitidas en ORDER BY (?orden=distancia&direccion=desc)
const RUTA_ORDEN = {
  nombre: 'nombre',
  distancia: 'distancia_km',
  desnivel: 'desnivel_positivo_m',
  duracion: 'duracion_minutos',
  fecha: 'fecha_creacion',
};

// Columnas que un administrador puede modificar con PATCH /rutas/:id.
// id_ruta, creador_id y fecha_creacion quedan fuera a propósito.
const RUTA_ACTUALIZABLES = {
  nombre: 'nombre',
  descripcion: 'descripcion',
  region: 'region',
  comuna: 'comuna',
  latitud: 'latitud',
  longitud: 'longitud',
  dificultad: 'dificultad',
  distancia: 'distancia_km',
  desnivelPositivo: 'desnivel_positivo_m',
  desnivelNegativo: 'desnivel_negativo_m',
  duracion: 'duracion_minutos',
  tipoRuta: 'tipo_ruta',
  tipoRecorrido: 'tipo_recorrido',
  visibilidad: 'visibilidad',
};

const GRUPO_COLUMNAS_PUBLICAS = [
  'g.id_grupo',
  'g.creador_id',
  'g.ruta_id',
  'r.nombre AS ruta_nombre',
  'g.nombre',
  'g.descripcion',
  'g.fecha_salida',
  'g.cupo_maximo',
  'g.dificultad',
  'g.estado',
  'g.fecha_creacion',
].join(', ');

const GRUPO_FILTROS_IGUALDAD = {
  rutaId: 'g.ruta_id',
  creadorId: 'g.creador_id',
  estado: 'g.estado',
};

const GRUPO_ACTUALIZABLES = {
  nombre: 'nombre',
  descripcion: 'descripcion',
  fechaSalida: 'fecha_salida',
  cupoMaximo: 'cupo_maximo',
  estado: 'estado',
};

const PROPUESTA_COLUMNAS_PUBLICAS = [
  'p.id_propuesta',
  'p.usuario_id',
  'u.nombre AS autor',
  'p.nombre',
  'p.descripcion',
  'p.region',
  'p.comuna',
  'p.latitud',
  'p.longitud',
  'p.dificultad',
  'p.distancia_km',
  'p.desnivel_positivo_m',
  'p.desnivel_negativo_m',
  'p.duracion_minutos',
  'p.tipo_ruta AS tipo_recorrido',
  'p.visibilidad',
  'p.estado',
  'p.observaciones_admin',
  'p.revisado_por',
  'p.ruta_aprobada_id',
  'p.fecha_propuesta',
  'p.fecha_revision',
].join(', ');

const PROPUESTA_CAMPOS = {
  nombre: 'nombre',
  descripcion: 'descripcion',
  region: 'region',
  comuna: 'comuna',
  latitud: 'latitud',
  longitud: 'longitud',
  dificultad: 'dificultad',
  distancia: 'distancia_km',
  desnivelPositivo: 'desnivel_positivo_m',
  desnivelNegativo: 'desnivel_negativo_m',
  duracion: 'duracion_minutos',
  tipoRecorrido: 'tipo_ruta',
  visibilidad: 'visibilidad',
};

module.exports = {
  USUARIO_COLUMNAS_PUBLICAS,
  RUTA_COLUMNAS_PUBLICAS,
  RUTA_FILTROS_IGUALDAD,
  RUTA_FILTROS_RANGO,
  RUTA_COLUMNAS_BUSQUEDA,
  RUTA_ORDEN,
  RUTA_ACTUALIZABLES,
  GRUPO_COLUMNAS_PUBLICAS,
  GRUPO_FILTROS_IGUALDAD,
  GRUPO_ACTUALIZABLES,
  PROPUESTA_COLUMNAS_PUBLICAS,
  PROPUESTA_CAMPOS,
};
