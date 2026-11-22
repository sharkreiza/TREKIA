import { obtener } from './api';

export interface DiaClima {
  fecha: string;
  codigo: number;
  descripcion: string;
  maxima: number;
  minima: number;
  lluvia: number | null;
  viento: number;
}

interface ClimaApi {
  ruta_id: number;
  fuente: string;
  dias: {
    fecha: string;
    codigo: number;
    descripcion: string;
    temperatura_max: number;
    temperatura_min: number;
    probabilidad_lluvia: number | null;
    viento_max: number;
  }[];
}

export async function obtenerClima(rutaId: number, dias = 7) {
  const clima = await obtener<ClimaApi>(`/rutas/${rutaId}/clima`, { dias });
  return clima.dias.map<DiaClima>((d) => ({
    fecha: d.fecha,
    codigo: d.codigo,
    descripcion: d.descripcion,
    maxima: Math.round(d.temperatura_max),
    minima: Math.round(d.temperatura_min),
    lluvia: d.probabilidad_lluvia,
    viento: Math.round(d.viento_max),
  }));
}
