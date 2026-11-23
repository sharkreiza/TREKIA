import { useState } from 'react';
import { IonButton, IonIcon, IonInput, IonSpinner, useIonToast } from '@ionic/react';
import { eyeOffOutline, eyeOutline, lockClosedOutline } from 'ionicons/icons';
import { cambiarPassword } from '../services/authService';
import { ErrorApi } from '../services/api';
import '../pages/auth/Auth.css';

const erroresVacios = { passwordActual: '', passwordNueva: '', confirmar: '' };

// Formulario de cambio de contraseña (Cuenta → Configuración).
// Valida en el navegador lo mismo que el registro para avisar antes de enviar,
// pero la validación que vale es la del backend: sus errores se muestran en el
// campo que corresponde.
export default function CambiarPassword() {
  const [mostrarToast] = useIonToast();

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState(erroresVacios);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const tieneLargo = nueva.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(nueva);
  const tieneNumero = /[0-9]/.test(nueva);

  function validar() {
    const nuevosErrores = { ...erroresVacios };

    if (actual === '') {
      nuevosErrores.passwordActual = 'Ingresa tu contraseña actual';
    }
    if (!tieneLargo || !tieneMayuscula || !tieneNumero) {
      nuevosErrores.passwordNueva = 'La contraseña no cumple los requisitos';
    } else if (nueva === actual) {
      nuevosErrores.passwordNueva = 'La contraseña nueva debe ser distinta a la actual';
    }
    if (confirmar === '' || confirmar !== nueva) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.values(nuevosErrores).every((e) => e === '');
  }

  async function guardar() {
    setError('');
    if (!validar()) return;

    setCargando(true);
    try {
      await cambiarPassword(actual, nueva);
      // Se vacían los campos para que la contraseña no quede en pantalla.
      setActual('');
      setNueva('');
      setConfirmar('');
      setVerPassword(false);
      mostrarToast({ message: 'Contraseña actualizada', duration: 2000, color: 'success' });
    } catch (e) {
      const campos = e instanceof ErrorApi ? e.campos : {};
      setErrores({
        passwordActual: campos.passwordActual ?? '',
        passwordNueva: campos.passwordNueva ?? '',
        confirmar: '',
      });
      if (!campos.passwordActual && !campos.passwordNueva) {
        setError((e as Error).message);
      }
    } finally {
      setCargando(false);
    }
  }

  const claseError = (mensaje: string) => `ion-margin-bottom ${mensaje ? 'ion-invalid ion-touched' : ''}`;
  const tipo = verPassword ? 'text' : 'password';

  return (
    <div className="cuenta-panel ion-margin-top">
      <h2>Cambiar contraseña</h2>
      <IonInput
        className={claseError(errores.passwordActual)}
        label="Contraseña actual"
        labelPlacement="stacked"
        fill="outline"
        type={tipo}
        autocomplete="current-password"
        value={actual}
        errorText={errores.passwordActual}
        onIonInput={(e) => setActual(e.detail.value ?? '')}
      >
        <IonIcon slot="start" icon={lockClosedOutline} aria-hidden="true" />
        <IonIcon
          slot="end"
          icon={verPassword ? eyeOffOutline : eyeOutline}
          role="button"
          aria-label={verPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
          onClick={() => setVerPassword(!verPassword)}
        />
      </IonInput>

      <IonInput
        className={claseError(errores.passwordNueva)}
        label="Contraseña nueva"
        labelPlacement="stacked"
        fill="outline"
        type={tipo}
        autocomplete="new-password"
        value={nueva}
        errorText={errores.passwordNueva}
        onIonInput={(e) => setNueva(e.detail.value ?? '')}
      >
        <IonIcon slot="start" icon={lockClosedOutline} aria-hidden="true" />
      </IonInput>

      <ul className="auth-reglas">
        <li className={tieneLargo ? 'cumple' : ''}>Mínimo 8 caracteres</li>
        <li className={tieneMayuscula ? 'cumple' : ''}>Al menos una mayúscula</li>
        <li className={tieneNumero ? 'cumple' : ''}>Al menos un número</li>
      </ul>

      <IonInput
        className={claseError(errores.confirmar)}
        label="Confirma la contraseña nueva"
        labelPlacement="stacked"
        fill="outline"
        type={tipo}
        autocomplete="new-password"
        value={confirmar}
        errorText={errores.confirmar}
        onIonInput={(e) => setConfirmar(e.detail.value ?? '')}
      >
        <IonIcon slot="start" icon={lockClosedOutline} aria-hidden="true" />
      </IonInput>

      {error && <p className="auth-error">{error}</p>}
      <IonButton className="ion-margin-top" onClick={guardar} disabled={cargando}>
        {cargando ? <IonSpinner name="crescent" /> : 'Cambiar contraseña'}
      </IonButton>
    </div>
  );
}
