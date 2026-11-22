import { fechaLocal, formatearHora, textoDuracion, usarZonaHoraria } from './formatos';

describe('textoDuracion', () => {
  test('muestra horas y minutos', () => {
    expect(textoDuracion(90)).toBe('1 h 30 min');
    expect(textoDuracion(60)).toBe('1 hora');
    expect(textoDuracion(45)).toBe('45 min');
  });

  test('sin dato cuando no hay duración', () => {
    expect(textoDuracion(null)).toBe('Sin dato');
  });
});

describe('zona horaria del usuario', () => {
  afterEach(() => usarZonaHoraria(undefined));

  test('la hora cambia según la zona horaria elegida', () => {
    usarZonaHoraria('America/Santiago');
    expect(formatearHora('2026-12-06T14:00:00.000Z')).toMatch(/^11:00/);

    usarZonaHoraria('Pacific/Easter');
    expect(formatearHora('2026-12-06T14:00:00.000Z')).toMatch(/^0?9:00/);
  });

  test('la fecha local respeta la zona horaria', () => {
    usarZonaHoraria('America/Santiago');
    expect(fechaLocal('2026-12-06T02:00:00.000Z')).toBe('2026-12-05');
  });
});
