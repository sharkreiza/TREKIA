const { query, body } = require('express-validator');
const { idParam } = require('./comun.validator');
const { RUTA_ORDEN } = require('../db/columnas');

// Valores de los ENUM de la base de datos (database/trekia_schema.sql)
const DIFICULTADES = ['baja', 'moderada', 'alta'];
const TIPOS_RECORRIDO = ['solo_ida', 'ida_vuelta'];
const VISIBILIDADES = ['publico', 'solo_amigos', 'privado'];

const texto = (campo, max) =>
  campo.optional().isString().withMessage('Debe ser texto').bail().trim()
    .isLength({ min: 1, max }).withMessage(`Debe tener entre 1 y ${max} caracteres`);

const enumerado = (campo, valores) =>
  campo.optional().isString().withMessage('Debe ser texto').bail().trim().toLowerCase()
    .isIn(valores).withMessage(`Debe ser uno de: ${valores.join(', ')}`);

const listarRules = [
  texto(query('busqueda'), 100),
  texto(query('region'), 100),
  texto(query('comuna'), 100),
  enumerado(query('dificultad'), DIFICULTADES),
  enumerado(query('tipoRecorrido'), TIPOS_RECORRIDO),
  query('distanciaMin').optional().isFloat({ min: 0 }).withMessage('Debe ser un número mayor o igual a 0').toFloat(),
  query('distanciaMax').optional().isFloat({ min: 0 }).withMessage('Debe ser un número mayor o igual a 0').toFloat(),
  query('duracionMax').optional().isInt({ min: 1 }).withMessage('Debe ser un entero positivo (minutos)').toInt(),
  // ORDER BY no admite parámetros $n, por eso solo se aceptan claves de la lista blanca.
  query('orden').optional().isIn(Object.keys(RUTA_ORDEN))
    .withMessage(`Debe ser uno de: ${Object.keys(RUTA_ORDEN).join(', ')}`),
  query('direccion').optional().toLowerCase().isIn(['asc', 'desc']).withMessage('Debe ser asc o desc'),
  query('limite').optional().isInt({ min: 1, max: 100 }).withMessage('Debe ser un entero entre 1 y 100').toInt(),
  query('pagina').optional().isInt({ min: 1 }).withMessage('Debe ser un entero positivo').toInt(),
];

const obtenerRules = [idParam()];

// Los límites siguen los tipos y CHECK de la tabla rutas.
const actualizarRules = [
  idParam(),
  texto(body('nombre'), 150),
  texto(body('descripcion'), 5000),
  texto(body('region'), 100),
  texto(body('comuna'), 100),
  body('latitud').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida').toFloat(),
  body('longitud').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida').toFloat(),
  enumerado(body('dificultad'), DIFICULTADES),
  body('distancia').optional().isFloat({ gt: 0, max: 99999.99 }).withMessage('Debe ser un número mayor que 0 (km)').toFloat(),
  body('desnivelPositivo').optional().isInt({ min: 0, max: 9000 }).withMessage('Debe ser un entero entre 0 y 9000').toInt(),
  body('desnivelNegativo').optional().isInt({ min: 0, max: 9000 }).withMessage('Debe ser un entero entre 0 y 9000').toInt(),
  body('duracion').optional().isInt({ min: 1, max: 20160 }).withMessage('Debe ser un entero positivo (minutos)').toInt(),
  texto(body('tipoRuta'), 30),
  enumerado(body('tipoRecorrido'), TIPOS_RECORRIDO),
  enumerado(body('visibilidad'), VISIBILIDADES),
];

module.exports = { listarRules, obtenerRules, actualizarRules };
