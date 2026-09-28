export interface Propuesta {
  id: number;
  nombre: string;
  ubicacion: string;
  dificultad: string;
  distancia: number;
  duracion: string;
  autor: string;
  cuando: string;
  descripcion: string;
}

const propuestas: Propuesta[] = [
  {
    id: 1,
    nombre: 'Salto del Apoquindo',
    ubicacion: 'La Reina',
    dificultad: 'Alta',
    distancia: 18,
    duracion: '9 horas',
    autor: 'Sofía Torres',
    cuando: 'hace 2 días',
    descripcion: 'Ruta larga que termina en una cascada. Conviene salir muy temprano y llevar harta agua.',
  },
  {
    id: 2,
    nombre: 'Sendero Quebrada Verde',
    ubicacion: 'Valparaíso',
    dificultad: 'Baja',
    distancia: 5,
    duracion: '2 horas',
    autor: 'Matías Rojas',
    cuando: 'hace 5 días',
    descripcion: 'Circuito corto dentro del parque, con bosque nativo y vista al mar.',
  },
];

export function obtenerPropuestas() {
  return propuestas;
}

export function obtenerPropuesta(id: number) {
  return propuestas.find((propuesta) => propuesta.id === id);
}
