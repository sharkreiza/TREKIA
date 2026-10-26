const pool = require('../db/pool');
const { PROPUESTA_COLUMNAS_PUBLICAS, PROPUESTA_CAMPOS } = require('../db/columnas');

const SELECT_PROPUESTA = `
  SELECT ${PROPUESTA_COLUMNAS_PUBLICAS}
  FROM propuestas_ruta p
  JOIN usuarios u ON u.id_usuario = p.usuario_id`;

async function listar({ usuarioId, estado } = {}) {
  const condiciones = [];
  const valores = [];

  if (usuarioId !== undefined) {
    valores.push(usuarioId);
    condiciones.push(`p.usuario_id = $${valores.length}`);
  }
  if (estado !== undefined) {
    valores.push(estado);
    condiciones.push(`p.estado = $${valores.length}`);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `${SELECT_PROPUESTA} ${where} ORDER BY p.fecha_propuesta DESC, p.id_propuesta DESC`,
    valores,
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`${SELECT_PROPUESTA} WHERE p.id_propuesta = $1`, [id]);
  return rows[0] || null;
}

async function crear(usuarioId, datos) {
  const columnas = ['usuario_id'];
  const valores = [usuarioId];

  for (const [clave, columna] of Object.entries(PROPUESTA_CAMPOS)) {
    if (datos[clave] !== undefined) {
      columnas.push(columna);
      valores.push(datos[clave]);
    }
  }

  const marcadores = valores.map((_, i) => `$${i + 1}`).join(', ');
  const { rows } = await pool.query(
    `INSERT INTO propuestas_ruta (${columnas.join(', ')})
     VALUES (${marcadores})
     RETURNING id_propuesta`,
    valores,
  );
  return buscarPorId(rows[0].id_propuesta);
}

async function revisar(id, adminId, { estado, observaciones, tipoRuta }) {
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');

    const { rows } = await cliente.query(
      'SELECT estado FROM propuestas_ruta WHERE id_propuesta = $1 FOR UPDATE',
      [id],
    );
    if (rows.length === 0 || rows[0].estado !== 'pendiente') {
      await cliente.query('ROLLBACK');
      return rows.length === 0 ? null : undefined;
    }

    let rutaId = null;
    if (estado === 'aprobada') {
      const ruta = await cliente.query(
        `INSERT INTO rutas (creador_id, nombre, descripcion, region, comuna, latitud, longitud, dificultad,
                            distancia_km, desnivel_positivo_m, desnivel_negativo_m, duracion_minutos,
                            tipo_ruta, tipo_recorrido, visibilidad)
         SELECT usuario_id, nombre, descripcion, region, comuna, latitud, longitud, dificultad,
                distancia_km, desnivel_positivo_m, desnivel_negativo_m, duracion_minutos,
                $2, tipo_ruta, visibilidad
         FROM propuestas_ruta WHERE id_propuesta = $1
         RETURNING id_ruta`,
        [id, tipoRuta || 'sendero'],
      );
      rutaId = ruta.rows[0].id_ruta;
    }

    await cliente.query(
      `UPDATE propuestas_ruta
       SET estado = $1, observaciones_admin = $2, revisado_por = $3,
           ruta_aprobada_id = $4, fecha_revision = CURRENT_TIMESTAMP
       WHERE id_propuesta = $5`,
      [estado, observaciones ?? null, adminId, rutaId, id],
    );

    await cliente.query('COMMIT');
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
  return buscarPorId(id);
}

async function eliminar(id) {
  await pool.query('DELETE FROM propuestas_ruta WHERE id_propuesta = $1', [id]);
}

module.exports = { listar, buscarPorId, crear, revisar, eliminar };
