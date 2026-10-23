// env debe cargarse primero: si falta una variable crítica el proceso termina aquí.
const env = require('./config/env');
const app = require('./app');
const pool = require('./db/pool');

app.listen(env.port, () => {
  console.log(`Trekia API escuchando en http://localhost:${env.port}/api`);
});

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
