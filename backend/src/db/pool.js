const { Pool, types } = require('pg');
const env = require('../config/env');

// pg devuelve NUMERIC como string para no perder precisión. Las columnas
// numeric de Trekia (distancia_km numeric(7,2), latitud/longitud numeric(10,7))
// caben sin problema en un número de JS, así que se convierten a number.
const NUMERIC_OID = 1700;
types.setTypeParser(NUMERIC_OID, (valor) => (valor === null ? null : parseFloat(valor)));

// Las credenciales salen de .env (DB_PASSWORD nunca está en el código).
const pool = new Pool(env.db);

pool.on('error', (err) => {
  console.error('[db] Error inesperado en el pool:', err.message);
});

module.exports = pool;
