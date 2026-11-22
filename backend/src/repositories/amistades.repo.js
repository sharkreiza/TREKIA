const pool = require('../db/pool');

async function listarAmigos(usuarioId) {
  const { rows } = await pool.query(
    `SELECT a.id_amistad, u.id_usuario, u.nombre, u.ubicacion, a.fecha_solicitud
     FROM amistades a
     JOIN usuarios u ON u.id_usuario = CASE WHEN a.solicitante_id = $1 THEN a.destinatario_id ELSE a.solicitante_id END
     WHERE a.estado = 'aceptada' AND (a.solicitante_id = $1 OR a.destinatario_id = $1)
     ORDER BY u.nombre`,
    [usuarioId],
  );
  return rows;
}

async function listarRecibidas(usuarioId) {
  const { rows } = await pool.query(
    `SELECT a.id_amistad, a.solicitante_id, u.nombre AS solicitante, a.fecha_solicitud
     FROM amistades a
     JOIN usuarios u ON u.id_usuario = a.solicitante_id
     WHERE a.destinatario_id = $1 AND a.estado = 'pendiente'
     ORDER BY a.fecha_solicitud DESC`,
    [usuarioId],
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    'SELECT id_amistad, solicitante_id, destinatario_id, estado, fecha_solicitud FROM amistades WHERE id_amistad = $1',
    [id],
  );
  return rows[0] || null;
}

async function crear(solicitanteId, destinatarioId) {
  const { rows } = await pool.query(
    `INSERT INTO amistades (solicitante_id, destinatario_id)
     VALUES ($1, $2)
     RETURNING id_amistad, solicitante_id, destinatario_id, estado, fecha_solicitud`,
    [solicitanteId, destinatarioId],
  );
  return rows[0];
}

async function responder(id, estado) {
  const { rows } = await pool.query(
    `UPDATE amistades SET estado = $1 WHERE id_amistad = $2
     RETURNING id_amistad, solicitante_id, destinatario_id, estado, fecha_solicitud`,
    [estado, id],
  );
  return rows[0];
}

async function eliminar(id) {
  await pool.query('DELETE FROM amistades WHERE id_amistad = $1', [id]);
}

module.exports = { listarAmigos, listarRecibidas, buscarPorId, crear, responder, eliminar };
