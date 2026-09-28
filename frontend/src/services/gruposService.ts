export interface Grupo {
  id: number;
  nombre: string;
  fecha: string;
  hora: string;
  cupos: number;
  participantes: number;
  dificultad: string;
  descripcion: string;
}

const grupos: Grupo[] = [
  {
    id: 1,
    nombre: 'Ascenso Cerro Provincia',
    fecha: '15 de noviembre de 2026',
    hora: '07:00',
    cupos: 8,
    participantes: 4,
    dificultad: 'Alta',
    descripcion: 'Salida de día completo. Llevar 3 litros de agua y bloqueador.',
  },
  {
    id: 2,
    nombre: 'Ruta a Parque La Campana',
    fecha: '8 de octubre de 2026',
    hora: '11:00',
    cupos: 10,
    participantes: 6,
    dificultad: 'Baja',
    descripcion: 'Caminata tranquila, apta para principiantes.',
  },
  {
    id: 3,
    nombre: 'Salida fotográfica Laguna El Yeso',
    fecha: '30 de noviembre de 2026',
    hora: '08:30',
    cupos: 12,
    participantes: 9,
    dificultad: 'Moderada',
    descripcion: 'Nos juntamos temprano para aprovechar la luz de la mañana.',
  },
];

export function obtenerGrupos() {
  return grupos;
}

export function obtenerGrupo(id: number) {
  return grupos.find((grupo) => grupo.id === id);
}
