export type Rol = 'usuario' | 'admin';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
}

const usuarios = [
  { id: 1, nombre: 'usuario_trekia', correo: 'usuario@gmail.com', password: 'Trekia123', rol: 'usuario' as Rol },
  { id: 2, nombre: 'admin_trekia', correo: 'admin@gmail.com', password: 'Admin123', rol: 'admin' as Rol },
];

export async function login(correo: string, password: string): Promise<Usuario> {
  const encontrado = usuarios.find((u) => u.correo === correo && u.password === password);

  if (!encontrado) {
    throw new Error('Correo o contraseña incorrectos');
  }

  return {
    id: encontrado.id,
    nombre: encontrado.nombre,
    correo: encontrado.correo,
    rol: encontrado.rol,
  };
}

export async function registrar(nombre: string, correo: string, password: string) {
  if (usuarios.some((u) => u.correo === correo)) {
    throw new Error('Este correo ya está registrado');
  }

  usuarios.push({ id: usuarios.length + 1, nombre, correo, password, rol: 'usuario' });
}
