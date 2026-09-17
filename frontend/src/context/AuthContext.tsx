import { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario, login as loginService } from '../services/authService';

interface AuthContextType {
  user: Usuario | null;
  login: (correo: string, password: string, recordar: boolean) => Promise<Usuario>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function sesionGuardada() {
  const guardado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  return guardado ? JSON.parse(guardado) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(sesionGuardada());

  async function login(correo: string, password: string, recordar: boolean) {
    const usuario = await loginService(correo, password);
    setUser(usuario);

    if (recordar) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
    }

    return usuario;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('usuario');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
