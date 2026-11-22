const PREFIJO = 'trekia:';

interface Guardado<T> {
  valor: T;
  fecha: number;
}

export function guardarLocal<T>(clave: string, valor: T) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify({ valor, fecha: Date.now() }));
  } catch {
    return;
  }
}

export function leerLocal<T>(clave: string, maxHoras?: number): T | null {
  try {
    const texto = localStorage.getItem(PREFIJO + clave);
    if (!texto) {
      return null;
    }
    const guardado: Guardado<T> = JSON.parse(texto);
    if (maxHoras && Date.now() - guardado.fecha > maxHoras * 3600000) {
      localStorage.removeItem(PREFIJO + clave);
      return null;
    }
    return guardado.valor;
  } catch {
    return null;
  }
}

export function borrarLocal(clave: string) {
  try {
    localStorage.removeItem(PREFIJO + clave);
  } catch {
    return;
  }
}

export function borrarTodoLocal() {
  try {
    Object.keys(localStorage)
      .filter((clave) => clave.startsWith(PREFIJO))
      .forEach((clave) => localStorage.removeItem(clave));
  } catch {
    return;
  }
}
