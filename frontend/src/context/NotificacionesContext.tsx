import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useIonToast } from '@ionic/react';
import { useAuth } from './AuthContext';
import { contarNoLeidas } from '../services/notificacionesService';

const INTERVALO_MS = 60000;

interface NotificacionesContextType {
  noLeidas: number;
  actualizar: () => Promise<void>;
}

const NotificacionesContext = createContext<NotificacionesContextType | null>(null);

export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [mostrarToast] = useIonToast();
  const [noLeidas, setNoLeidas] = useState(0);
  const anterior = useRef<number | null>(null);

  const actualizar = useCallback(async () => {
    try {
      const total = await contarNoLeidas();
      if (anterior.current !== null && total > anterior.current) {
        mostrarToast({
          message: total - anterior.current === 1 ? 'Tienes una notificación nueva' : 'Tienes notificaciones nuevas',
          duration: 2500,
          position: 'top',
        });
      }
      anterior.current = total;
      setNoLeidas(total);
    } catch {
      return;
    }
  }, [mostrarToast]);

  useEffect(() => {
    anterior.current = null;
    setNoLeidas(0);

    if (!user) {
      return;
    }

    actualizar();
    const intervalo = setInterval(() => {
      if (document.visibilityState === 'visible') {
        actualizar();
      }
    }, INTERVALO_MS);

    return () => clearInterval(intervalo);
  }, [user?.id]);

  return (
    <NotificacionesContext.Provider value={{ noLeidas, actualizar }}>
      {children}
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  const context = useContext(NotificacionesContext);
  if (!context) {
    throw new Error('useNotificaciones tiene que usarse dentro de NotificacionesProvider');
  }
  return context;
}
