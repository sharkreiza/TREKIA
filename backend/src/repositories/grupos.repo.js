const pool = require('../db/pool');
const { GRUPO_COLUMNAS_PUBLICAS, GRUPO_FILTROS_IGUALDAD, GRUPO_HORARIOS, GRUPO_ACTUALIZABLES } = require('../db/columnas');

// Los participantes son el creador más las solicitudes aceptadas. El conteo se hace
// con un JOIN LATERAL para poder filtrar por cupos sin repetir la subconsulta, y usa
// el índice idx_solicitudes_grupo_estado (grupo_id, estado).
const SELECT_GRUPO = `
  SELECT ${GRUPO_COLUMNAS_PUBLICAS},
         1 + a.aceptadas AS participantes
  FROM grupos_trekking g
  JOIN rutas r ON r.id_ruta = g.ruta_id
  CROSS JOIN LATERAL (
    SELECT COUNT(*)::int AS aceptadas FROM solicitudes_grupo s
    WHERE s.grupo_id = g.id_grupo AND s.estado = 'aceptada'
  ) a`;

async function listar(filtros = {}) {
  const condiciones = [];
  const valores = [];

  for (const [clave, columna] of Object.entries(GRUPO_FILTROS_IGUALDAD)) {
    if (filtros[clave] !== undefined) {
      valores.push(filtros[clave]);
      condiciones.push(`${columna} = $${valores.length}`);
    }
  }

  if (filtros.desde !== undefined) {
    valores.push(filtros.desde);
    condiciones.push(`g.fecha_salida >= $${valores.length}`);
  }

  if (filtros.hasta !== undefined) {
    valores.push(filtros.hasta);
    condiciones.push(`g.fecha_salida < $${valores.length}::date + 1`);
  }

  if (filtros.horario !== undefined) {
    const [desdeHora, hastaHora] = GRUPO_HORARIOS[filtros.horario];
    valores.push(desdeHora, hastaHora);
    condiciones.push(
      `EXTRACT(HOUR FROM g.fecha_salida) >= $${valores.length - 1} AND EXTRACT(HOUR FROM g.fecha_salida) < $${valores.length}`,
    );
  }

  if (filtros.cupoMax !== undefined) {
    valores.push(filtros.cupoMax);
    condiciones.push(`g.cupo_maximo <= $${valores.length}`);
  }

  if (filtros.conCupos) {
    condiciones.push('1 + a.aceptadas < g.cupo_maximo');
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

  const limite = filtros.limite || 20;
  const pagina = filtros.pagina || 1;
  valores.push(limite, (pagina - 1) * limite);

  const { rows } = await pool.query(
    `${SELECT_GRUPO}
     ${where}
     ORDER BY g.fecha_salida ASC, g.id_grupo ASC
     LIMIT $${valores.length - 1} OFFSET $${valores.length}`,
    valores,
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`${SELECT_GRUPO} WHERE g.id_grupo = $1`, [id]);
  return rows[0] || null;
}

async function crear(creadorId, datos) {
  const { rows } = await pool.query(
    `INSERT INTO grupos_trekking (creador_id, ruta_id, nombre, descripcion, fecha_salida, cupo_maximo, dificultad)
     SELECT $1, id_ruta, $3, $4, $5, $6, dificultad
     FROM rutas
     WHERE id_ruta = $2 AND visibilidad = 'publico'
     RETURNING id_grupo`,
    [creadorId, datos.rutaId, datos.nombre, datos.descripcion ?? null, datos.fechaSalida, datos.cupoMaximo],
  );
  return rows[0] ? buscarPorId(rows[0].id_grupo) : null;
}

async function actualizar(id, cambios) {
  const sets = [];
  const valores = [];

  for (const [clave, columna] of Object.entries(GRUPO_ACTUALIZABLES)) {
    if (cambios[clave] !== undefined) {
      valores.push(cambios[clave]);
      sets.push(`${columna} = $${valores.length}`);
    }
  }

  if (sets.length === 0) return undefined;

  valores.push(id);
  const { rowCount } = await pool.query(
    `UPDATE grupos_trekking SET ${sets.join(', ')} WHERE id_grupo = $${valores.length}`,
    valores,
  );
  return rowCount > 0 ? buscarPorId(id) : null;
}

async function eliminar(id) {
  const { rowCount } = await pool.query(
    `WITH borrar_solicitudes AS (DELETE FROM solicitudes_grupo WHERE grupo_id = $1)
     DELETE FROM grupos_trekking WHERE id_grupo = $1`,
    [id],
  );
  return rowCount > 0;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };
