import { vi } from 'vitest';
import { borrarTodoLocal, guardarLocal, leerLocal } from './almacenLocal';

describe('almacenamiento local', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.useRealTimers());

  test('guarda y lee un valor', () => {
    guardarLocal('filtros-rutas', { region: 'Valparaíso' });
    expect(leerLocal('filtros-rutas')).toEqual({ region: 'Valparaíso' });
  });

  test('devuelve null si no existe', () => {
    expect(leerLocal('no-existe')).toBeNull();
  });

  test('descarta los datos más antiguos que el máximo de horas', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-01T10:00:00Z'));
    guardarLocal('rutas-inicio', [1, 2, 3]);

    vi.setSystemTime(new Date('2026-12-04T11:00:00Z'));
    expect(leerLocal('rutas-inicio', 72)).toBeNull();
  });

  test('al cerrar sesión solo borra los datos de Trekia', () => {
    localStorage.setItem('otra-app', 'x');
    guardarLocal('rutas-inicio', [1]);
    borrarTodoLocal();
    expect(leerLocal('rutas-inicio')).toBeNull();
    expect(localStorage.getItem('otra-app')).toBe('x');
  });
});
