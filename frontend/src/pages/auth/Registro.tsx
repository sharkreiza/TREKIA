import { useState } from 'react';
import {
  IonButton, IonCheckbox, IonContent, IonInput, IonPage, IonRouterLink,
  IonSelect, IonSelectOption, IonSpinner, useIonToast,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { registrar } from '../../services/authService';
import './Auth.css';

const erroresVacios = { nombre: '', correo: '', password: '', confirmar: '', terminos: '' };

export default function Registro() {
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [region, setRegion] = useState('');
  const [terminos, setTerminos] = useState(false);
  const [errores, setErrores] = useState(erroresVacios);
  const [cargando, setCargando] = useState(false);

  const tieneLargo = password.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);

  function validar() {
    const nuevosErrores = { ...erroresVacios };

    if (nombre === '') {
      nuevosErrores.nombre = 'Ingresa un nombre de usuario';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(nombre)) {
      nuevosErrores.nombre = 'Usa entre 3 y 20 letras, números o guion bajo';
    }

    if (correo === '') {
      nuevosErrores.correo = 'Ingresa tu correo';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = 'El correo no tiene un formato válido';
    }

    if (!tieneLargo || !tieneMayuscula || !tieneNumero) {
      nuevosErrores.password = 'La contraseña no cumple los requisitos';
    }

    if (confirmar !== password || confirmar === '') {
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
      setErrores({ ...erroresVacios, correo: (error as Error).message });
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
          <div className="auth-imagen" />

          <div className="auth-formulario">
            <h1 className="auth-logo">Trekia</h1>
            <h2 className="auth-titulo">Crea tu cuenta</h2>
            <p className="auth-nota">Todos los campos son obligatorios, salvo los que dicen opcional.</p>

            <IonInput
              className={claseError(errores.nombre)}
              label="Nombre de usuario"
              labelPlacement="stacked"
              fill="outline"
              placeholder="ej: camila_trek"
              value={nombre}
              errorText={errores.nombre}
              helperText="Así te verán los demás usuarios"
              onIonInput={(e) => setNombre(e.detail.value ?? '')}
            />

            <IonInput
              className={claseError(errores.correo)}
              label="Correo"
              labelPlacement="stacked"
              fill="outline"
              type="email"
              placeholder="nombre@correo.cl"
              value={correo}
              errorText={errores.correo}
              onIonInput={(e) => setCorreo(e.detail.value ?? '')}
            />

            <IonInput
              className={claseError(errores.password)}
              label="Contraseña"
              labelPlacement="stacked"
              fill="outline"
              type="password"
              value={password}
              errorText={errores.password}
              onIonInput={(e) => setPassword(e.detail.value ?? '')}
            />
            <ul className="auth-reglas">
              <li className={tieneLargo ? 'cumple' : ''}>{tieneLargo ? '✓' : '•'} Mínimo 8 caracteres</li>
              <li className={tieneMayuscula ? 'cumple' : ''}>{tieneMayuscula ? '✓' : '•'} Al menos una mayúscula</li>
              <li className={tieneNumero ? 'cumple' : ''}>{tieneNumero ? '✓' : '•'} Al menos un número</li>
            </ul>

            <IonInput
              className={claseError(errores.confirmar)}
              label="Confirmar contraseña"
              labelPlacement="stacked"
              fill="outline"
              type="password"
              value={confirmar}
              errorText={errores.confirmar}
              onIonInput={(e) => setConfirmar(e.detail.value ?? '')}
            />

            <IonSelect
              className="auth-campo"
              label="Región (opcional)"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Selecciona tu región"
              value={region}
              onIonChange={(e) => setRegion(e.detail.value)}
            >
              <IonSelectOption value="Valparaíso">Valparaíso</IonSelectOption>
              <IonSelectOption value="Metropolitana">Metropolitana</IonSelectOption>
              <IonSelectOption value="O'Higgins">O'Higgins</IonSelectOption>
              <IonSelectOption value="Otra">Otra</IonSelectOption>
            </IonSelect>

            <IonCheckbox labelPlacement="end" checked={terminos} onIonChange={(e) => setTerminos(e.detail.checked)}>
              Acepto los términos y condiciones
            </IonCheckbox>
            {errores.terminos && <p className="auth-error">{errores.terminos}</p>}

            <IonButton expand="block" className="ion-margin-top" onClick={crearCuenta} disabled={cargando}>
              {cargando ? <IonSpinner name="crescent" /> : 'Crear cuenta'}
            </IonButton>

            <p className="auth-pie">
              ¿Ya tienes cuenta? <IonRouterLink routerLink="/login">Inicia sesión</IonRouterLink>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
