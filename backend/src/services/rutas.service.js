// Lógica de datos. En la EP 2.2 aquí se reemplazan los datos de prueba por consultas a la base de datos.
const rutas = require('../data/rutas.data');

// Filtros opcionales: ?busqueda=cerro&region=Valparaíso&dificultad=Baja
function listar({ busqueda = '', region, dificultad }) {
  return rutas.filter((ruta) =>
    ruta.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (!region || ruta.region === region) &&
    (!dificultad || ruta.dificultad === dificultad)
  );
}

function obtenerPorId(id) {
  return rutas.find((ruta) => ruta.id === id);
}

module.exports = { listar, obtenerPorId };
