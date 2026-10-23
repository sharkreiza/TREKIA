// Punto de entrada: levanta el servidor
const app = require('./app');
const config = require('./config/env');

app.listen(config.port, () => {
  console.log(`Servidor en http://localhost:${config.port}`);
});
