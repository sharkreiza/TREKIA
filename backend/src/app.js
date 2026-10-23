// Configuración de Express
const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const routes = require('./routes');
const { noEncontrado, manejarErrores } = require('./middlewares/errores');

const app = express();

app.use(cors({ origin: config.corsOrigin })); // solo el frontend puede llamar a la API
app.use(express.json());                      // permite leer JSON en el body

app.use('/api', routes);

app.use(noEncontrado);
app.use(manejarErrores);

module.exports = app;
