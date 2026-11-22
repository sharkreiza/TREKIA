const pool = require('../db/pool');

async function listarPorGrupo(grupoId) {
  const { rows } = await pool.query(
    `SELECT s.id_solicitud, s.grupo_id, s.usuario_id, u.nombre AS usuario, s.estado,
            s.fecha_solicitud, s.fecha_respuesta
     FROM solicitudes_grupo s
     JOIN usuarios u ON u.id_usuario = s.usuario_id
     WHERE s.grupo_id = $1
     ORDER BY s.fecha_solicitud ASC`,
    [grupoId],
  );
  return rows;
}

async function listarPorUsuario(usuarioId) {
  const { rows } = await pool.query(
    `SELECT s.id_solicitud, s.grupo_id, g.nombre AS grupo, g.fecha_salida, r.nombre AS ruta_nombre,
            s.estado, s.fecha_solicitud, s.fecha_respuesta
     FROM solicitudes_grupo s
     JOIN grupos_trekking g ON g.id_grupo = s.grupo_id
     JOIN rutas r ON r.id_ruta = g.ruta_id
     WHERE s.usuario_id = $1
     ORDER BY g.fecha_salida ASC`,
    [usuarioId],
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT id_solicitud, grupo_id, usuario_id, estado, fecha_solicitud, fecha_respuesta
     FROM solicitudes_grupo WHERE id_solicitud = $1`,
    [id],
  );
  return rows[0] || null;
}

async function crear(grupoId, usuarioId) {
  const { rows } = await pool.query(
    `INSERT INTO solicitudes_grupo (grupo_id, usuario_id)
     VALUES ($1, $2)
     RETURNING id_solicitud, grupo_id, usuario_id, estado, fecha_solicitud, fecha_respuesta`,
    [grupoId, usuarioId],
  );
  return rows[0];
}

async function responder(id, estado) {
  const { rows } = await pool.query(
    `UPDATE solicitudes_grupo SET estado = $1, fecha_respuesta = CURRENT_TIMESTAMP
     WHERE id_solicitud = $2
     RETURNING id_solicitud, grupo_id, usuario_id, estado, fecha_solicitud, fecha_respuesta`,
    [estado, id],
  );
  return rows[0];
}

async function eliminar(id) {
  await pool.query('DELETE FROM solicitudes_grupo WHERE id_solicitud = $1', [id]);
}

module.exports = { listarPorGrupo, listarPorUsuario, buscarPorId, crear, responder, eliminar };
