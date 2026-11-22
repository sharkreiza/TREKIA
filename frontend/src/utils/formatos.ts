let zonaHoraria: string | undefined;

export function usarZonaHoraria(zona: string | undefined) {
  zonaHoraria = zona;
}

export const zonasHorarias = [
  { valor: 'America/Santiago', nombre: 'Chile continental (Santiago)' },
  { valor: 'America/Punta_Arenas', nombre: 'Magallanes (Punta Arenas)' },
  { valor: 'Pacific/Easter', nombre: 'Isla de Pascua' },
  { valor: 'America/Argentina/Buenos_Aires', nombre: 'Argentina (Buenos Aires)' },
  { valor: 'America/Lima', nombre: 'Perú (Lima)' },
  { valor: 'America/Bogota', nombre: 'Colombia (Bogotá)' },
  { valor: 'America/Mexico_City', nombre: 'México (Ciudad de México)' },
  { valor: 'Europe/Madrid', nombre: 'España (Madrid)' },
  { valor: 'UTC', nombre: 'UTC' },
];

export function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: zonaHoraria });
}

export function formatearHora(iso: string) {
  return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', timeZone: zonaHoraria });
}

export function diaYMes(iso: string) {
  const fecha = new Date(iso);
  return {
    dia: fecha.toLocaleDateString('es-CL', { day: 'numeric', timeZone: zonaHoraria }),
    mes: capitalizar(fecha.toLocaleDateString('es-CL', { month: 'short', timeZone: zonaHoraria }).replace('.', '')),
  };
}

export function fechaLocal(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: zonaHoraria });
}

export function haceCuanto(iso: string) {
  const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);

  if (minutos < 1) return 'recién';
  if (minutos < 60) return `hace ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias < 30) return dias === 1 ? 'hace 1 día' : `hace ${dias} días`;

  return formatearFecha(iso);
}

export function textoDuracion(minutos: number | null) {
  if (!minutos) return 'Sin dato';

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  if (horas === 0) return `${resto} min`;
  if (resto === 0) return horas === 1 ? '1 hora' : `${horas} horas`;
  return `${horas} h ${resto} min`;
}
