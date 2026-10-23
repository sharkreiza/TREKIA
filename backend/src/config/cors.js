const env = require('./env');
const HttpError = require('../utils/HttpError');

// CORS restringido a los orígenes de la app definidos en CORS_ORIGINS.
// Las peticiones sin cabecera Origin (Postman, curl, llamadas nativas) no son
// peticiones de navegador entre orígenes, por eso se dejan pasar.
const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new HttpError(403, 'Origen no permitido por CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
};

module.exports = corsOptions;
