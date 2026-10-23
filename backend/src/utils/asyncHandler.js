// Express 5 ya envía al manejador de errores las promesas rechazadas, pero
// Express 4 no. Envolver cada handler async hace que funcione igual en ambos.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
