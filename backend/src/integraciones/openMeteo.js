const env = require('../config/env');
const HttpError = require('../utils/HttpError');

// Pronóstico del tiempo de Open-Meteo (https://open-meteo.com), servicio gratuito
// que no necesita API key. La URL, el tiempo de espera y la duración del caché se
// configuran con variables de entorno (ver config/env.js).

const VARIABLES_DIARIAS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'wind_speed_10m_max',
];

// Códigos WMO que usa Open-Meteo para describir el tiempo
const DESCRIPCIONES = {
  0: 'Despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna débil',
  53: 'Llovizna',
  55: 'Llovizna intensa',
  56: 'Llovizna helada',
  57: 'Llovizna helada intensa',
  61: 'Lluvia débil',
  63: 'Lluvia',
  65: 'Lluvia intensa',
  66: 'Lluvia helada',
  67: 'Lluvia helada intensa',
  71: 'Nevada débil',
  73: 'Nevada',
  75: 'Nevada intensa',
  77: 'Granos de nieve',
  80: 'Chubascos débiles',
  81: 'Chubascos',
  82: 'Chubascos fuertes',
  85: 'Chubascos de nieve',
  86: 'Chubascos de nieve fuertes',
  95: 'Tormenta eléctrica',
  96: 'Tormenta con granizo',
  99: 'Tormenta con granizo fuerte',
};

const cache = new Map();

function convertir(datos) {
  const diario = datos.daily;
  return diario.time.map((fecha, i) => ({
    fecha,
    codigo: diario.weather_code[i],
    descripcion: DESCRIPCIONES[diario.weather_code[i]] ?? 'Sin descripción',
    temperatura_max: diario.temperature_2m_max[i],
    temperatura_min: diario.temperature_2m_min[i],
    probabilidad_lluvia: diario.precipitation_probability_max[i],
    viento_max: diario.wind_speed_10m_max[i],
  }));
}

async function pronostico(latitud, longitud, dias) {
  const clave = `${latitud},${longitud},${dias}`;
  const guardado = cache.get(clave);
  if (guardado && guardado.expira > Date.now()) {
    return guardado.datos;
  }

  const url = new URL(env.clima.url);
  url.search = new URLSearchParams({
    latitude: latitud,
    longitude: longitud,
    daily: VARIABLES_DIARIAS.join(','),
    timezone: 'auto',
    forecast_days: dias,
  });

  let respuesta;
  try {
    respuesta = await fetch(url, { signal: AbortSignal.timeout(env.clima.timeoutMs) });
  } catch (err) {
    console.error('[clima] No se pudo conectar con Open-Meteo:', err.message);
    throw new HttpError(503, 'El servicio del clima no está disponible en este momento');
  }

  if (!respuesta.ok) {
    console.error('[clima] Open-Meteo respondió', respuesta.status);
    throw new HttpError(502, 'El servicio del clima respondió con un error');
  }

  let datos;
  try {
    datos = convertir(await respuesta.json());
  } catch (err) {
    console.error('[clima] Respuesta inesperada de Open-Meteo:', err.message);
    throw new HttpError(502, 'El servicio del clima respondió con un formato inesperado');
  }

  cache.set(clave, { datos, expira: Date.now() + env.clima.cacheMinutos * 60 * 1000 });
  return datos;
}

module.exports = { pronostico };
