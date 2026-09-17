import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rol } from '../services/authService';

export function paginaInicio(rol: Rol) {
  if (rol === 'admin') {
    return '/admin/propuestas';
  }
  return '/app/mapa';
}

export function RutaPrivada({ children, rol }: { children: ReactNode; rol?: Rol }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (rol && user.rol !== rol) {
    return <Navigate to={paginaInicio(user.rol)} replace />;
  }

  return <>{children}</>;
}

export function RutaPublica({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={paginaInicio(user.rol)} replace />;
  }

  return <>{children}</>;
}
