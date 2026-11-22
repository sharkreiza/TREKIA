import { ComponentType, lazy, Suspense } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';

export function paginaDiferida(importar: () => Promise<{ default: ComponentType }>) {
  const Pagina = lazy(importar);

  return function PaginaDiferida() {
    return (
      <Suspense
        fallback={
          <IonPage>
            <IonContent className="ion-padding ion-text-center">
              <IonSpinner name="crescent" />
            </IonContent>
          </IonPage>
        }
      >
        <Pagina />
      </Suspense>
    );
  };
}
