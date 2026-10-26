import { useState } from 'react';
import {
  IonButton, IonCheckbox, IonContent, IonIcon, IonInput, IonPage,
  IonRouterLink, IonSpinner, useIonToast,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { arrowForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons';
import { registrar } from '../../services/authService';
import { ErrorApi } from '../../services/api';
import './Auth.css';

const erroresVacios = { nombre: '', correo: '', password: '', confirmar: '', terminos: '' };

export default function Registro() {
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [errores, setErrores] = useState(erroresVacios);
  const [cargando, setCargando] = useState(false);

  const tieneLargo = password.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);

  function validar() {
    const nuevosErrores = { ...erroresVacios };

    if (nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Ingresa tu nombre completo';
    }

    if (correo === '') {
      nuevosErrores.correo = 'Ingresa tu correo';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = 'El correo no tiene un formato válido';
    }

    if (!tieneLargo || !tieneMayuscula || !tieneNumero) {
      nuevosErrores.password = 'La contraseña no cumple los requisitos';
    }

    if (confirmar === '' || confirmar !== password) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden';
    }

    if (!terminos) {
      nuevosErrores.terminos = 'Debes aceptar los términos y condiciones';
    }

    setErrores(nuevosErrores);
    return Object.values(nuevosErrores).every((error) => error === '');
  }

  async function crearCuenta() {
    if (!validar()) {
      return;
    }

    setCargando(true);
    try {
      await registrar(nombre, correo, password);
      mostrarToast({ message: 'Cuenta creada, ya puedes iniciar sesión', duration: 2500, color: 'success' });
      navigate('/login', { replace: true });
    } catch (error) {
      const campos = error instanceof ErrorApi ? error.campos : {};
      setErrores({
        ...erroresVacios,
        nombre: campos.nombre ?? '',
        password: campos.password ?? '',
        correo: campos.correo ?? (Object.keys(campos).length === 0 ? (error as Error).message : ''),
      });
    }
    setCargando(false);
  }

  function claseError(mensaje: string) {
    return `auth-campo ${mensaje ? 'ion-invalid ion-touched' : ''}`;
  }

  return (
    <IonPage>
      <IonContent>
        <div className="auth">
          <div className="auth-imagen">
            <h2>Explora.<br />Conecta.<br />Disfruta.</h2>
            <p>Descubre rutas de trekking, encuentra compañeros y comparte tus experiencias.</p>
          </div>

          <div className="auth-formulario">
            <img className="auth-logo" src="/assets/Logo_trekia.png" alt="Trekia" />
            <h1 className="auth-titulo">Crear cuenta</h1>
            <p className="auth-subtitulo">Únete a la comunidad y empieza a vivir nuevas aventuras</p>
            <p className="auth-nota">Todos los campos son obligatorios.</p>

            <IonInput
              className={claseError(errores.nombre)}
              label="Nombre completo"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Tu nombre completo"
              value={nombre}
              errorText={errores.nombre}
              onIonInput={(e) => setNombre(e.detail.value ?? '')}
            >
              <IonIcon slot="start" icon={personOutline} />
            </IonInput>

            <IonInput
              className={claseError(errores.correo)}
              label="Correo electrónico"
              labelPlacement="stacked"
              fill="outline"
              type="email"
              placeholder="tu.correo@ejemplo.com"
              value={correo}
              errorText={errores.correo}
              onIonInput={(e) => setCorreo(e.detail.value ?? '')}
            >
              <IonIcon slot="start" icon={mailOutline} />
            </IonInput>

            <IonInput
              className={claseError(errores.password)}
              label="Contraseña"
              labelPlacement="stacked"
              fill="outline"
              type={verPassword ? 'text' : 'password'}
              placeholder="Crea una contraseña"
              value={password}
              errorText={errores.password}
              onIonInput={(e) => setPassword(e.detail.value ?? '')}
            >
              <IonIcon slot="start" icon={lockClosedOutline} />
              <IonIcon
                slot="end"
                icon={verPassword ? eyeOffOutline : eyeOutline}
                onClick={() => setVerPassword(!verPassword)}
              />
            </IonInput>

            <ul className="auth-reglas">
              <li className={tieneLargo ? 'cumple' : ''}>Mínimo 8 caracteres</li>
              <li className={tieneMayuscula ? 'cumple' : ''}>Al menos una mayúscula</li>
              <li className={tieneNumero ? 'cumple' : ''}>Al menos un número</li>
            </ul>

            <IonInput
              className={claseError(errores.confirmar)}
              label="Confirma contraseña"
              labelPlacement="stacked"
              fill="outline"
              type={verPassword ? 'text' : 'password'}
              placeholder="Confirma tu contraseña"
              value={confirmar}
              errorText={errores.confirmar}
              onIonInput={(e) => setConfirmar(e.detail.value ?? '')}
            >
              <IonIcon slot="start" icon={lockClosedOutline} />
            </IonInput>

            <IonCheckbox labelPlacement="end" checked={terminos} onIonChange={(e) => setTerminos(e.detail.checked)}>
              Acepto los términos y condiciones y la política de privacidad
            </IonCheckbox>
            {errores.terminos && <p className="auth-error">{errores.terminos}</p>}

            <IonButton className="ion-margin-top" expand="block" onClick={crearCuenta} disabled={cargando}>
              {cargando ? <IonSpinner name="crescent" /> : 'Crear cuenta'}
              {!cargando && <IonIcon slot="end" icon={arrowForward} />}
            </IonButton>

            <p className="auth-pie">
              ¿Ya tienes una cuenta? <IonRouterLink routerLink="/login">Iniciar sesión</IonRouterLink>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
