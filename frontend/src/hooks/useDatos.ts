import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorApi } from '../services/api';
import { guardarLocal, leerLocal } from '../utils/almacenLocal';

export function useDatos<T>(cargar: () => Promise<T>, inicial: T, dependencias: DependencyList = [], claveCache?: string) {
  const location = useLocation();
  const [datos, setDatos] = useState<T>(inicial);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [sinConexion, setSinConexion] = useState(false);
  const cargarActual = useRef(cargar);
  const claveActual = useRef(claveCache);
  const rutaPropia = useRef(location.pathname);
  const ultimaVisita = useRef(location.key);

  cargarActual.current = cargar;
  claveActual.current = claveCache;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError('');
    setSinConexion(false);
    try {
      const nuevos = await cargarActual.current();
      setDatos(nuevos);
      if (claveActual.current) {
        guardarLocal(claveActual.current, nuevos);
      }
    } catch (e) {
      const guardados = claveActual.current ? leerLocal<T>(claveActual.current, 72) : null;
      if (e instanceof ErrorApi && e.status === 0 && guardados !== null) {
        setDatos(guardados);
        setSinConexion(true);
      } else {
        setError((e as Error).message);
      }
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

  return { datos, setDatos, cargando, error, sinConexion, recargar };
}
