const pool = require('../db/pool');
const {
  RUTA_COLUMNAS_PUBLICAS,
  RUTA_FILTROS_IGUALDAD,
  RUTA_FILTROS_RANGO,
  RUTA_COLUMNAS_BUSQUEDA,
  RUTA_ORDEN,
  RUTA_ACTUALIZABLES,
} = require('../db/columnas');

// Consultas dinámicas seguras:
// - Los NOMBRES de columna salen solo de las listas blancas de db/columnas.js.
// - Los VALORES del usuario van siempre como parámetros $n, nunca en el texto SQL.

// Las consultas públicas solo muestran rutas con visibilidad 'publico'.
// Es una condición fija escrita en el código, no viene del usuario.
const SOLO_PUBLICAS = "visibilidad = 'publico'";

async function listar(filtros = {}) {
  const condiciones = [SOLO_PUBLICAS];
  const valores = [];

  for (const [clave, columna] of Object.entries(RUTA_FILTROS_IGUALDAD)) {
    if (filtros[clave] !== undefined) {
      valores.push(filtros[clave]);
      condiciones.push(`${columna} = $${valores.length}`);
    }
  }

  for (const [clave, { columna, operador }] of Object.entries(RUTA_FILTROS_RANGO)) {
    if (filtros[clave] !== undefined) {
      valores.push(filtros[clave]);
      condiciones.push(`${columna} ${operador} $${valores.length}`);
    }
  }

  if (filtros.busqueda !== undefined) {
    // Los comodines % y _ del usuario se escapan para que se busquen literalmente.
    valores.push(`%${filtros.busqueda.replace(/[\\%_]/g, '\\$&')}%`);
    const n = valores.length;
    condiciones.push(`(${RUTA_COLUMNAS_BUSQUEDA.map((c) => `${c} ILIKE $${n}`).join(' OR ')})`);
  }

  const where = `WHERE ${condiciones.join(' AND ')}`;

  // ORDER BY no acepta $n: la columna se elige de la lista blanca y la
  // dirección solo puede ser ASC o DESC (el validador ya lo garantizó).
  const columnaOrden = RUTA_ORDEN[filtros.orden] || 'id_ruta';
  const direccion = filtros.direccion === 'desc' ? 'DESC' : 'ASC';

  const limite = filtros.limite || 20;
  const pagina = filtros.pagina || 1;
  valores.push(limite, (pagina - 1) * limite);

  const sql = `
    SELECT ${RUTA_COLUMNAS_PUBLICAS}
    FROM rutas
    ${where}
    ORDER BY ${columnaOrden} ${direccion}, id_ruta ASC
    LIMIT $${valores.length - 1} OFFSET $${valores.length}`;

  const { rows } = await pool.query(sql, valores);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${RUTA_COLUMNAS_PUBLICAS} FROM rutas WHERE id_ruta = $1 AND ${SOLO_PUBLICAS}`,
    [id],
  );
  return rows[0] || null;
}

// UPDATE parcial: solo entran al SET las claves que estén en RUTA_ACTUALIZABLES.
// Devuelve null si la ruta no existe, o undefined si no había nada que actualizar.
async function actualizar(id, cambios) {
  const sets = [];
  const valores = [];

  for (const [clave, columna] of Object.entries(RUTA_ACTUALIZABLES)) {
    if (cambios[clave] !== undefined) {
      valores.push(cambios[clave]);
      sets.push(`${columna} = $${valores.length}`);
    }
  }

  if (sets.length === 0) return undefined;

  valores.push(id);
  const { rows } = await pool.query(
    `UPDATE rutas SET ${sets.join(', ')}
     WHERE id_ruta = $${valores.length}
     RETURNING ${RUTA_COLUMNAS_PUBLICAS}`,
    valores,
  );
  return rows[0] || null;
}

module.exports = { listar, buscarPorId, actualizar };
