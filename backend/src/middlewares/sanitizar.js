// Protección contra XSS almacenado: quita etiquetas HTML y caracteres de control de
// todos los textos del body antes de validarlos y guardarlos. React ya escapa lo que
// muestra, pero así la API tampoco entrega HTML a otros clientes (por ejemplo, una app
// que use innerHTML). La contraseña no se toca porque se guarda como hash.
const ETIQUETAS_HTML = /<\/?[a-z!][^>]*>/gi;
const CARACTERES_CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SIN_LIMPIAR = ['password'];

function limpiar(valor) {
  if (typeof valor === 'string') {
    return valor.replace(ETIQUETAS_HTML, '').replace(CARACTERES_CONTROL, '');
  }
  if (Array.isArray(valor)) {
    return valor.map(limpiar);
  }
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(
      Object.entries(valor).map(([clave, v]) => [clave, SIN_LIMPIAR.includes(clave) ? v : limpiar(v)]),
    );
  }
  return valor;
}

function sanitizar(req, res, next) {
  if (req.body) {
    req.body = limpiar(req.body);
  }
  return next();
}

module.exports = sanitizar;
