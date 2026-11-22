// Formato único de todas las respuestas de la API: { ok, data, message, errors }

function ok(res, data = null, message = 'OK', status = 200) {
  return res.status(status).json({ ok: true, data, message, errors: null });
}

function fail(res, status, message, errors = null) {
  return res.status(status).json({ ok: false, data: null, message, errors });
}

module.exports = { ok, fail };
