import { enviar, modificar, obtener } from './api';

export type Rol = 'usuario' | 'administrador';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
  ubicacion: string | null;
  biografia: string | null;
}

interface UsuarioApi {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: Rol;
  ubicacion: string | null;
  biografia: string | null;
}

interface SesionApi {
  token: string;
  usuario: UsuarioApi;
}

function convertirUsuario(u: UsuarioApi): Usuario {
  return {
    id: u.id_usuario,
    nombre: u.nombre,
    correo: u.correo,
    rol: u.rol,
    ubicacion: u.ubicacion,
    biografia: u.biografia,
  };
}

export async function login(correo: string, password: string) {
  const sesion = await enviar<SesionApi>('/auth/login', { correo, password });
  return { token: sesion.token, usuario: convertirUsuario(sesion.usuario) };
}

export async function registrar(nombre: string, correo: string, password: string) {
  const sesion = await enviar<SesionApi>('/auth/register', { nombre, correo, password });
  return { token: sesion.token, usuario: convertirUsuario(sesion.usuario) };
}

export async function obtenerSesion() {
  return convertirUsuario(await obtener<UsuarioApi>('/auth/me'));
}

export async function obtenerUsuario(id: number) {
  return convertirUsuario(await obtener<UsuarioApi>(`/usuarios/${id}`));
}

export async function actualizarPerfil(cambios: { nombre?: string; ubicacion?: string; biografia?: string }) {
  return convertirUsuario(await modificar<UsuarioApi>('/usuarios/me', cambios));
}
