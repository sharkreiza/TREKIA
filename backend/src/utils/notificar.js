const notificacionesRepo = require('../repositories/notificaciones.repo');

// La acción principal (aceptar una solicitud, revisar una propuesta, etc.) ya se
// guardó cuando se llama a esta función, así que si la notificación falla solo se
// registra en la consola y la respuesta al cliente no cambia.
async function notificar(destinatarios, { tipo, mensaje, enlace }) {
  const ids = [].concat(destinatarios).filter(Boolean);
  try {
    await notificacionesRepo.crearVarias(ids, { tipo, mensaje: mensaje.slice(0, 300), enlace });
  } catch (err) {
    console.error('[notificaciones] No se pudo crear la notificación:', err.message);
  }
}

module.exports = notificar;
