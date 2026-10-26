import axios, { AxiosError } from 'axios';

interface RespuestaApi<T> {
  ok: boolean;
  data: T;
  message: string;
  errors: { campo: string; mensaje: string }[] | null;
}

export class ErrorApi extends Error {
  status: number;
  campos: Record<string, string>;

  constructor(mensaje: string, status: number, campos: Record<string, string> = {}) {
    super(mensaje);
    this.status = status;
    this.campos = campos;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10000,
});

export function leerToken() {
  return localStorage.getItem('token') ?? sessionStorage.getItem('token');
}

api.interceptors.request.use((config) => {
  const token = leerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error: AxiosError<RespuestaApi<null>>) => {
    if (!error.response) {
      return Promise.reject(new ErrorApi('No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.', 0));
    }

    const { status, data } = error.response;

    if (status === 401 && leerToken()) {
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    const campos: Record<string, string> = {};
    (data?.errors ?? []).forEach((e) => {
      campos[e.campo] = e.mensaje;
    });

    return Promise.reject(new ErrorApi(data?.message ?? 'Ocurrió un error inesperado', status, campos));
  },
);

export async function obtener<T>(url: string, params?: object) {
  const respuesta = await api.get<RespuestaApi<T>>(url, { params });
  return respuesta.data.data;
}

export async function enviar<T>(url: string, cuerpo?: object) {
  const respuesta = await api.post<RespuestaApi<T>>(url, cuerpo);
  return respuesta.data.data;
}

export async function modificar<T>(url: string, cuerpo: object) {
  const respuesta = await api.patch<RespuestaApi<T>>(url, cuerpo);
  return respuesta.data.data;
}

export async function eliminar(url: string) {
  await api.delete(url);
}
