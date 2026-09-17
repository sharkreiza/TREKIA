export type Dificultad = 'Fácil' | 'Media' | 'Difícil';

export interface Ruta {
  id: number;
  nombre: string;
  ubicacion: string;
  dificultad: Dificultad;
  distancia: number;
  duracion: string;
  descripcion: string;
  lat: number;
  lng: number;
}

const rutas: Ruta[] = [
  {
    id: 1,
    nombre: 'Cerro La Campana',
    ubicacion: 'Olmué',
    dificultad: 'Difícil',
    distancia: 7,
    duracion: '5 horas',
    descripcion: 'Subida exigente con mucha pendiente y vista a la costa y la cordillera.',
    lat: -32.957,
    lng: -71.129,
  },
  {
    id: 2,
    nombre: 'Lago Peñuelas',
    ubicacion: 'Valparaíso',
    dificultad: 'Fácil',
    distancia: 4,
    duracion: '1 hora y media',
    descripcion: 'Sendero plano alrededor del lago, ideal para empezar.',
    lat: -33.147,
    lng: -71.544,
  },
  {
    id: 3,
    nombre: 'Cerro Mauco',
    ubicacion: 'Concón',
    dificultad: 'Media',
    distancia: 6,
    duracion: '3 horas',
    descripcion: 'Subida constante con vista al río Aconcagua.',
    lat: -32.87,
    lng: -71.455,
  },
  {
    id: 4,
    nombre: 'Palmas de Ocoa',
    ubicacion: 'Hijuelas',
    dificultad: 'Media',
    distancia: 10,
    duracion: '4 horas',
    descripcion: 'Recorrido entre palmas chilenas, con poca sombra en verano.',
    lat: -32.928,
    lng: -71.071,
  },
  {
    id: 5,
    nombre: 'Dunas de Concón',
    ubicacion: 'Concón',
    dificultad: 'Fácil',
    distancia: 2,
    duracion: '1 hora',
    descripcion: 'Paseo corto por las dunas frente al mar.',
    lat: -32.938,
    lng: -71.535,
  },
];

export function obtenerRuta(id: number) {
  return rutas.find((ruta) => ruta.id === id);
}

export function filtrarRutas(dificultades: Dificultad[], ubicacion: string, distanciaMax: number) {
  return rutas.filter((ruta) => {
    const cumpleDificultad = dificultades.length === 0 || dificultades.includes(ruta.dificultad);
    const cumpleUbicacion = ruta.ubicacion.toLowerCase().includes(ubicacion.toLowerCase());
    const cumpleDistancia = ruta.distancia <= distanciaMax;
    return cumpleDificultad && cumpleUbicacion && cumpleDistancia;
  });
}
