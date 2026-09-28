import { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonRouterLink, IonSpinner, useIonToast } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { arrowForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { paginaInicio } from '../../routes/Proteccion';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mostrarToast] = useIonToast();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState({ correo: '', password: '' });
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion() {
    const nuevosErrores = { correo: '', password: '' };

    if (correo === '') {
      nuevosErrores.correo = 'Ingresa tu correo';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
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
      const usuario = await login(correo, password, true);
      navigate(paginaInicio(usuario.rol), { replace: true });
    } catch {
      setErrorGeneral('Correo o contraseña incorrectos');
    }
    setCargando(false);
  }

  function proximamente() {
    mostrarToast({ message: 'Esta opción estará disponible más adelante', duration: 2000 });
  }

  return (
    <IonPage>
      <IonContent>
        <div className="auth">
          <div className="auth-imagen">
            <img className="auth-logo-foto" src="/assets/Logo_trekia.png" alt="Trekia" />
            <h2>Explora.<br />Conecta.<br />Disfruta.</h2>
            <p>Descubre rutas de trekking, encuentra compañeros y comparte tus experiencias.</p>
          </div>

          <div className="auth-formulario">
            <img className="auth-logo" src="/assets/Logo_trekia.png" alt="Trekia" />
            <h1 className="auth-titulo">Iniciar sesión</h1>
            <p className="auth-subtitulo">Bienvenido de vuelta a la comunidad de Trekia</p>

            <IonInput
              className={`auth-campo ${errores.correo ? 'ion-invalid ion-touched' : ''}`}
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
              className={`auth-campo ${errores.password ? 'ion-invalid ion-touched' : ''}`}
              label="Contraseña"
              labelPlacement="stacked"
              fill="outline"
              type={verPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
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

            <p className="auth-olvido">
              <IonRouterLink onClick={proximamente}>¿Olvidaste tu contraseña?</IonRouterLink>
            </p>

            {errorGeneral && <p className="auth-error">{errorGeneral}</p>}

            <IonButton expand="block" onClick={iniciarSesion} disabled={cargando}>
              {cargando ? <IonSpinner name="crescent" /> : 'Iniciar sesión'}
              {!cargando && <IonIcon slot="end" icon={arrowForward} />}
            </IonButton>

            <p className="auth-separador">O continúa con</p>
            <div className="auth-externos">
              <IonButton fill="outline" size="small" onClick={proximamente}>Google</IonButton>
              <IonButton fill="outline" size="small" onClick={proximamente}>Apple</IonButton>
            </div>

            <p className="auth-pie">
              ¿No tienes una cuenta? <IonRouterLink routerLink="/registro">Crear cuenta</IonRouterLink>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
