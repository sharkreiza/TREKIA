const pool = require('../db/pool');

const SELECT_COMENTARIO = `
  SELECT c.id_comentario, c.ruta_id, c.usuario_id, u.nombre AS autor, c.contenido, c.fecha_creacion
  FROM comentarios c
  JOIN usuarios u ON u.id_usuario = c.usuario_id`;

async function listarPorRuta(rutaId) {
  const { rows } = await pool.query(
    `${SELECT_COMENTARIO} WHERE c.ruta_id = $1 ORDER BY c.fecha_creacion DESC, c.id_comentario DESC`,
    [rutaId],
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`${SELECT_COMENTARIO} WHERE c.id_comentario = $1`, [id]);
  return rows[0] || null;
}

async function crear(usuarioId, rutaId, contenido) {
  const { rows } = await pool.query(
    `INSERT INTO comentarios (usuario_id, ruta_id, contenido)
     SELECT $1, id_ruta, $3 FROM rutas WHERE id_ruta = $2 AND visibilidad = 'publico'
     RETURNING id_comentario`,
    [usuarioId, rutaId, contenido],
  );
  return rows[0] ? buscarPorId(rows[0].id_comentario) : null;
}

async function actualizar(id, contenido) {
  await pool.query('UPDATE comentarios SET contenido = $1 WHERE id_comentario = $2', [contenido, id]);
  return buscarPorId(id);
}

async function eliminar(id) {
  await pool.query('DELETE FROM comentarios WHERE id_comentario = $1', [id]);
}

module.exports = { listarPorRuta, buscarPorId, crear, actualizar, eliminar };
