import { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario, login as loginService } from '../services/authService';

interface AuthContextType {
  user: Usuario | null;
  login: (correo: string, password: string) => Promise<Usuario>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const guardado = localStorage.getItem('usuario');
  const [user, setUser] = useState<Usuario | null>(guardado ? JSON.parse(guardado) : null);

  async function login(correo: string, password: string) {
    const usuario = await loginService(correo, password);
    setUser(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    return usuario;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('usuario');
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
