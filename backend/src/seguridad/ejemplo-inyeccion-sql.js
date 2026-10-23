// EJEMPLO PARA EL INFORME: este archivo no está montado en ninguna ruta.
// Compara una consulta vulnerable a inyección SQL con su versión segura.

const pool = require('../db/pool');

// ------------------------------------------------------------ VULNERABLE
// El correo del usuario se concatena dentro del texto SQL.
// Si el cliente envía como correo:   ' OR '1'='1
// la consulta queda:
//   SELECT ... FROM usuarios WHERE correo = '' OR '1'='1'
// y devuelve TODOS los usuarios. Con  '; DROP TABLE usuarios; --
// podría incluso borrar la tabla.
//
// async function buscarUsuarioVulnerable(correo) {
//   const sql = "SELECT id_usuario, nombre FROM usuarios WHERE correo = '" + correo + "'";
//   const { rows } = await pool.query(sql);
//   return rows;
// }

// ------------------------------------------------------------ SEGURA
// El texto SQL es fijo y el valor viaja aparte como parámetro $1.
// PostgreSQL lo trata siempre como un dato, nunca como código SQL, así que
// ' OR '1'='1 se busca literalmente como correo y no devuelve nada.
async function buscarUsuarioSeguro(correo) {
  const { rows } = await pool.query(
    'SELECT id_usuario, nombre FROM usuarios WHERE correo = $1',
    [correo],
  );
  return rows;
}

// ------------------------------------------------------------ ORDER BY
// Los nombres de columna NO se pueden pasar como $n. La solución vulnerable es
// concatenar lo que manda el cliente:
//
//   const sql = `SELECT ... FROM rutas ORDER BY ${req.query.orden}`;   // VULNERABLE
//
// La segura (usada en repositories/rutas.repo.js) es traducir la clave del
// cliente con una lista blanca definida en el código; si no está, se usa un
// valor por defecto y el texto del cliente nunca entra en el SQL:
//
//   const columna = RUTA_ORDEN[req.query.orden] || 'id_ruta';         // SEGURA
//   const sql = `SELECT ... FROM rutas ORDER BY ${columna}`;

module.exports = { buscarUsuarioSeguro };
