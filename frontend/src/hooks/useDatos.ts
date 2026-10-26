import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useDatos<T>(cargar: () => Promise<T>, inicial: T, dependencias: DependencyList = []) {
  const location = useLocation();
  const [datos, setDatos] = useState<T>(inicial);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const cargarActual = useRef(cargar);
  const rutaPropia = useRef(location.pathname);
  const ultimaVisita = useRef(location.key);

  cargarActual.current = cargar;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setDatos(await cargarActual.current());
    } catch (e) {
      setError((e as Error).message);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    recargar();
  }, dependencias);

  useEffect(() => {
    if (location.pathname === rutaPropia.current && location.key !== ultimaVisita.current) {
      ultimaVisita.current = location.key;
      recargar();
    }
  }, [location.key]);

  return { datos, setDatos, cargando, error, recargar };
}
