const pool = require('../db/pool');
const { NOTIFICACION_COLUMNAS } = require('../db/columnas');

async function listar(usuarioId, { soloNoLeidas, limite = 20, pagina = 1 } = {}) {
  const condiciones = ['usuario_id = $1'];
  if (soloNoLeidas) {
    condiciones.push('leida = false');
  }

  const { rows } = await pool.query(
    `SELECT ${NOTIFICACION_COLUMNAS}
     FROM notificaciones
     WHERE ${condiciones.join(' AND ')}
     ORDER BY fecha_creacion DESC, id_notificacion DESC
     LIMIT $2 OFFSET $3`,
    [usuarioId, limite, (pagina - 1) * limite],
  );
  return rows;
}

async function contarNoLeidas(usuarioId) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total FROM notificaciones WHERE usuario_id = $1 AND leida = false',
    [usuarioId],
  );
  return rows[0].total;
}

async function crearVarias(usuarioIds, { tipo, mensaje, enlace }) {
  if (usuarioIds.length === 0) return;
  await pool.query(
    `INSERT INTO notificaciones (usuario_id, tipo, mensaje, enlace)
     SELECT unnest($1::int[]), $2, $3, $4`,
    [usuarioIds, tipo, mensaje, enlace ?? null],
  );
}

async function marcarLeida(id, usuarioId) {
  const { rows } = await pool.query(
    `UPDATE notificaciones SET leida = true
     WHERE id_notificacion = $1 AND usuario_id = $2
     RETURNING ${NOTIFICACION_COLUMNAS}`,
    [id, usuarioId],
  );
  return rows[0] || null;
}

async function marcarTodasLeidas(usuarioId) {
  const { rowCount } = await pool.query(
    'UPDATE notificaciones SET leida = true WHERE usuario_id = $1 AND leida = false',
    [usuarioId],
  );
  return rowCount;
}

async function eliminar(id, usuarioId) {
  const { rowCount } = await pool.query(
    'DELETE FROM notificaciones WHERE id_notificacion = $1 AND usuario_id = $2',
    [id, usuarioId],
  );
  return rowCount > 0;
}

module.exports = { listar, contarNoLeidas, crearVarias, marcarLeida, marcarTodasLeidas, eliminar };
