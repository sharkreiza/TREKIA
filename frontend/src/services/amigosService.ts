export interface Amigo {
  id: number;
  nombre: string;
  detalle: string;
}

export function obtenerSolicitudes(): Amigo[] {
  return [
    { id: 3, nombre: 'sandra_cano', detalle: '10 amigos en común' },
    { id: 4, nombre: 'antonia_trekia', detalle: '1 amigo en común' },
  ];
}

export function obtenerAmigos(): Amigo[] {
  return [
    { id: 5, nombre: 'camila_trekia', detalle: '2 salidas juntos' },
    { id: 6, nombre: 'vicente_trekia', detalle: '1 salida juntos' },
  ];
}
