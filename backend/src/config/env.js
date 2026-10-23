// Carga .env y verifica las variables críticas antes de arrancar.
// Si falta alguna se muestra solo su NOMBRE (nunca un valor) y el proceso termina.
require('dotenv').config();

const REQUERIDAS = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'CORS_ORIGINS',
];

const faltantes = REQUERIDAS.filter((nombre) => !process.env[nombre] || !process.env[nombre].trim());

if (faltantes.length > 0) {
  console.error('[config] Faltan variables de entorno obligatorias:');
  faltantes.forEach((nombre) => console.error(`  - ${nombre}`));
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('[config] JWT_SECRET debe tener al menos 32 caracteres');
  process.exit(1);
}

const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  corsOrigins: process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
};

module.exports = env;
