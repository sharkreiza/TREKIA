import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Usuario, login as loginService, obtenerSesion } from '../services/authService';
import { leerToken } from '../services/api';

interface AuthContextType {
  user: Usuario | null;
  login: (correo: string, password: string, recordar: boolean) => Promise<Usuario>;
  logout: () => void;
  actualizarUsuario: (usuario: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function almacen() {
  return localStorage.getItem('token') ? localStorage : sessionStorage;
}

function sesionGuardada(): Usuario | null {
  const guardado = localStorage.getItem('usuario') ?? sessionStorage.getItem('usuario');
  return guardado && leerToken() ? JSON.parse(guardado) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(sesionGuardada());

  function logout() {
    setUser(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }

  async function login(correo: string, password: string, recordar: boolean) {
    const { token, usuario } = await loginService(correo, password);
    const destino = recordar ? localStorage : sessionStorage;

    destino.setItem('token', token);
    destino.setItem('usuario', JSON.stringify(usuario));
    setUser(usuario);
    return usuario;
  }

  function actualizarUsuario(usuario: Usuario) {
    almacen().setItem('usuario', JSON.stringify(usuario));
    setUser(usuario);
  }

  useEffect(() => {
    window.addEventListener('sesion-expirada', logout);

    if (leerToken()) {
      obtenerSesion().then(actualizarUsuario).catch(() => undefined);
    }

    return () => window.removeEventListener('sesion-expirada', logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth tiene que usarse dentro de AuthProvider');
  }
  return context;
}
