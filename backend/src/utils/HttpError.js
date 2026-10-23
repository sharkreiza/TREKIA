// Error con código HTTP que el manejador global responde tal cual.
class HttpError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.errors = errors;
  }
}

module.exports = HttpError;
