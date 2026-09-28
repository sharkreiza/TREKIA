export interface Publicacion {
  id: number;
  autor: string;
  cuando: string;
  texto: string;
  likes: number;
  comentarios: number;
}

export interface GrupoDestacado {
  id: number;
  nombre: string;
  miembros: string;
}

export interface Evento {
  id: number;
  dia: string;
  mes: string;
  nombre: string;
  participantes: number;
}

export interface Solicitud {
  id: number;
  nombre: string;
  detalle: string;
}

export function obtenerPublicaciones(): Publicacion[] {
  return [
    {
      id: 1,
      autor: 'Sofía Torres',
      cuando: 'hace 2 días',
      texto: '¡Increíbles vistas en el Cerro Provincia! La vista en la cumbre vale totalmente el esfuerzo. Si alguien quiere sumarse a la próxima, avisen.',
      likes: 28,
      comentarios: 5,
    },
    {
      id: 2,
      autor: 'Matías Rojas',
      cuando: 'hace 4 días',
      texto: '¿Alguien tiene recomendaciones de chaquetas impermeables para trekking en la zona central? Busco algo liviano que aguante bien la lluvia.',
      likes: 12,
      comentarios: 18,
    },
  ];
}

export function obtenerGruposDestacados(): GrupoDestacado[] {
  return [
    { id: 1, nombre: 'Trekking región de Valparaíso', miembros: '1,2k miembros' },
    { id: 2, nombre: 'Amantes de la montaña', miembros: '800 miembros' },
    { id: 3, nombre: 'Fotografías de la naturaleza', miembros: '630 miembros' },
  ];
}

export function obtenerEventos(): Evento[] {
  return [
    { id: 1, dia: '16', mes: 'Nov', nombre: 'Ruta a Laguna El Yeso', participantes: 12 },
    { id: 2, dia: '23', mes: 'Nov', nombre: 'Trekking Cerro La Campana', participantes: 8 },
    { id: 3, dia: '30', mes: 'Nov', nombre: 'Salida fotográfica Cajón del Maipo', participantes: 15 },
  ];
}

export function obtenerSolicitudes(): Solicitud[] {
  return [
    { id: 3, nombre: 'sandra_cano', detalle: '10 amigos en común' },
    { id: 4, nombre: 'antonia_trekia', detalle: '1 amigo en común' },
  ];
}
