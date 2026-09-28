export type Dificultad = 'Baja' | 'Moderada' | 'Alta';

export interface Ruta {
  id: number;
  nombre: string;
  ubicacion: string;
  region: string;
  dificultad: Dificultad;
  distancia: number;
  desnivel: number;
  duracion: string;
  tipo: string;
  puntuacion: number;
  resenas: number;
  descripcion: string;
  lat: number;
  lng: number;
}

const rutas: Ruta[] = [
  {
    id: 1,
    nombre: 'Laguna El Yeso',
    ubicacion: 'San José de Maipo',
    region: 'Metropolitana',
    dificultad: 'Moderada',
    distancia: 12,
    desnivel: 900,
    duracion: '5 horas',
    tipo: 'Ida y vuelta',
    puntuacion: 4.8,
    resenas: 124,
    descripcion: 'Recorrido junto al embalse, con vistas a la cordillera y agua turquesa.',
    lat: -33.667,
    lng: -70.083,
  },
  {
    id: 2,
    nombre: 'Cerro Provincia',
    ubicacion: 'Lo Barnechea',
    region: 'Metropolitana',
    dificultad: 'Alta',
    distancia: 16,
    desnivel: 1600,
    duracion: '8 horas',
    tipo: 'Ida y vuelta',
    puntuacion: 4.6,
    resenas: 98,
    descripcion: 'Subida exigente y muy expuesta al sol, con vista completa a Santiago.',
    lat: -33.36,
    lng: -70.48,
  },
  {
    id: 3,
    nombre: 'Parque La Campana',
    ubicacion: 'Olmué',
    region: 'Valparaíso',
    dificultad: 'Baja',
    distancia: 6,
    desnivel: 400,
    duracion: '3 horas',
    tipo: 'Circuito',
    puntuacion: 4.7,
    resenas: 210,
    descripcion: 'Sendero entre palmas chilenas, con sombra y agua en el camino.',
    lat: -32.957,
    lng: -71.129,
  },
  {
    id: 4,
    nombre: 'Lago Peñuelas',
    ubicacion: 'Valparaíso',
    region: 'Valparaíso',
    dificultad: 'Baja',
    distancia: 4,
    desnivel: 150,
    duracion: '1 hora y media',
    tipo: 'Circuito',
    puntuacion: 4.3,
    resenas: 64,
    descripcion: 'Sendero plano alrededor del lago, ideal para empezar.',
    lat: -33.147,
    lng: -71.544,
  },
  {
    id: 5,
    nombre: 'Cerro Mauco',
    ubicacion: 'Concón',
    region: 'Valparaíso',
    dificultad: 'Moderada',
    distancia: 6,
    desnivel: 700,
    duracion: '3 horas',
    tipo: 'Ida y vuelta',
    puntuacion: 4.4,
    resenas: 41,
    descripcion: 'Subida constante con vista al río Aconcagua y a la costa.',
    lat: -32.87,
    lng: -71.455,
  },
];

export interface Filtros {
  busqueda: string;
  region: string;
  dificultad: string;
  duracion: string;
  tipo: string;
  orden: string;
}

export const filtrosVacios: Filtros = {
  busqueda: '',
  region: '',
  dificultad: '',
  duracion: '',
  tipo: '',
  orden: '',
};

export function obtenerRutas() {
  return rutas;
}

export function obtenerRuta(id: number) {
  return rutas.find((ruta) => ruta.id === id);
}

export function rutasDestacadas() {
  return [...rutas].sort((a, b) => b.puntuacion - a.puntuacion).slice(0, 3);
}

export function filtrarRutas(filtros: Filtros) {
  const encontradas = rutas.filter((ruta) => {
    const texto = `${ruta.nombre} ${ruta.ubicacion} ${ruta.region}`.toLowerCase();
    const cumpleBusqueda = texto.includes(filtros.busqueda.toLowerCase());
    const cumpleRegion = filtros.region === '' || ruta.region === filtros.region;
    const cumpleDificultad = filtros.dificultad === '' || ruta.dificultad === filtros.dificultad;
    const cumpleTipo = filtros.tipo === '' || ruta.tipo === filtros.tipo;

    let cumpleDuracion = true;
    if (filtros.duracion === 'corta') {
      cumpleDuracion = ruta.distancia <= 6;
    }
    if (filtros.duracion === 'media') {
      cumpleDuracion = ruta.distancia > 6 && ruta.distancia <= 12;
    }
    if (filtros.duracion === 'larga') {
      cumpleDuracion = ruta.distancia > 12;
    }

    return cumpleBusqueda && cumpleRegion && cumpleDificultad && cumpleTipo && cumpleDuracion;
  });

  if (filtros.orden === 'puntuacion') {
    return [...encontradas].sort((a, b) => b.puntuacion - a.puntuacion);
  }

  return encontradas;
}
