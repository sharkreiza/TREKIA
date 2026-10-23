// Lee las variables del archivo .env
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8100',
};
