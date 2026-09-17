import { useState } from 'react';
import { IonButton, IonCheckbox, IonContent, IonInput, IonPage, IonRouterLink, IonSpinner } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { paginaInicio } from '../../routes/Proteccion';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [errores, setErrores] = useState({ correo: '', password: '' });
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion() {
    const nuevosErrores = { correo: '', password: '' };

    if (correo === '') {
      nuevosErrores.correo = 'Ingresa tu correo';
    } else if (!correo.includes('@') || !correo.includes('.')) {
      nuevosErrores.correo = 'El correo no tiene un formato válido';
    }

    if (password === '') {
      nuevosErrores.password = 'Ingresa tu contraseña';
    }

    setErrores(nuevosErrores);
    setErrorGeneral('');

    if (nuevosErrores.correo || nuevosErrores.password) {
      return;
    }

    setCargando(true);
    try {
      const usuario = await login(correo, password, recordar);
      navigate(paginaInicio(usuario.rol), { replace: true });
    } catch {
      setErrorGeneral('Correo o contraseña incorrectos');
    }
    setCargando(false);
  }

  return (
    <IonPage>
      <IonContent>
        <div className="auth">
          <div className="auth-imagen" />

          <div className="auth-formulario">
            <h1 className="auth-logo">Trekia</h1>
            <h2 className="auth-titulo">Bienvenido de vuelta</h2>
            <p className="auth-subtitulo">Ingresa tus datos para entrar a tu cuenta</p>

            <IonInput
              className={`auth-campo ${errores.correo ? 'ion-invalid ion-touched' : ''}`}
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
              className={`auth-campo ${errores.password ? 'ion-invalid ion-touched' : ''}`}
              label="Contraseña"
              labelPlacement="stacked"
              fill="outline"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              errorText={errores.password}
              onIonInput={(e) => setPassword(e.detail.value ?? '')}
            />

            <IonCheckbox
              labelPlacement="end"
              checked={recordar}
              onIonChange={(e) => setRecordar(e.detail.checked)}
            >
              Recordarme en este equipo
            </IonCheckbox>

            {errorGeneral && <p className="auth-error">{errorGeneral}</p>}

            <IonButton expand="block" className="ion-margin-top" onClick={iniciarSesion} disabled={cargando}>
              {cargando ? <IonSpinner name="crescent" /> : 'Iniciar sesión'}
            </IonButton>

            <p className="auth-pie">
              ¿No tienes cuenta? <IonRouterLink routerLink="/registro">Regístrate</IonRouterLink>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
