const pool = require('../db/pool');

const SELECT_PUBLICACION = `
  SELECT p.id_publicacion, p.usuario_id, u.nombre AS autor, p.contenido, p.tipo, p.fecha_creacion
  FROM publicaciones p
  JOIN usuarios u ON u.id_usuario = p.usuario_id`;

async function listar(usuarioId) {
  const { rows } = await pool.query(
    `${SELECT_PUBLICACION}
     WHERE p.visibilidad = 'publico' OR p.usuario_id = $1
     ORDER BY p.fecha_creacion DESC, p.id_publicacion DESC
     LIMIT 50`,
    [usuarioId],
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`${SELECT_PUBLICACION} WHERE p.id_publicacion = $1`, [id]);
  return rows[0] || null;
}

async function crear(usuarioId, { contenido, tipo }) {
  const { rows } = await pool.query(
    `INSERT INTO publicaciones (usuario_id, contenido, tipo)
     VALUES ($1, $2, $3)
     RETURNING id_publicacion`,
    [usuarioId, contenido, tipo || 'experiencia'],
  );
  return buscarPorId(rows[0].id_publicacion);
}

async function eliminar(id) {
  await pool.query('DELETE FROM publicaciones WHERE id_publicacion = $1', [id]);
}

module.exports = { listar, buscarPorId, crear, eliminar };
