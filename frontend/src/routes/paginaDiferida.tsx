import { ComponentType, lazy, Suspense } from 'react';

// El fallback NO es un IonPage: si lo fuera, IonRouterOutlet registraría el
// spinner como la página, haría la transición con él y dejaría la página real
// marcada como invisible (pantalla en blanco la primera vez que se abre).
// Mientras se descarga el código, sigue visible la página anterior.
export function paginaDiferida(importar: () => Promise<{ default: ComponentType }>) {
  const Pagina = lazy(importar);

  return function PaginaDiferida() {
    return (
      <Suspense fallback={null}>
        <Pagina />
      </Suspense>
    );
  };
}