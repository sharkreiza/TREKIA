const pool = require('../db/pool');
const { USUARIO_COLUMNAS_PUBLICAS } = require('../db/columnas');

// Todas las consultas usan parámetros $1, $2... y la lista fija de columnas
// públicas (nunca SELECT *), así password_hash no sale de esta capa.

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${USUARIO_COLUMNAS_PUBLICAS} FROM usuarios WHERE id_usuario = $1`,
    [id],
  );
  return rows[0] || null;
}

// Única función que lee password_hash: la usa solo el login para comparar.
async function buscarCredenciales(correo) {
  const { rows } = await pool.query(
    `SELECT ${USUARIO_COLUMNAS_PUBLICAS}, password_hash FROM usuarios WHERE correo = $1`,
    [correo],
  );
  return rows[0] || null;
}

// El rol lo decide el servidor: se pasa siempre 'usuario' como parámetro fijo.
async function crear({ nombre, correo, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING ${USUARIO_COLUMNAS_PUBLICAS}`,
    [nombre, correo, passwordHash, 'usuario'],
  );
  return rows[0];
}

module.exports = { buscarPorId, buscarCredenciales, crear };
