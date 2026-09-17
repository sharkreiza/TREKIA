import { useState } from 'react';
import { IonButton, IonContent, IonInput, IonPage, IonText } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { paginaInicio } from '../../routes/Proteccion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function iniciarSesion() {
    setError('');

    if (correo === '' || password === '') {
      setError('Ingresa tu correo y contraseña');
      return;
    }

    try {
      const usuario = await login(correo, password);
      navigate(paginaInicio(usuario.rol), { replace: true });
    } catch {
      setError('Correo o contraseña incorrectos');
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1 style={{ fontFamily: 'Rationale', fontSize: '48px', textAlign: 'center' }}>Trekia</h1>

        <IonInput
          label="Correo"
          labelPlacement="floating"
          fill="outline"
          type="email"
          value={correo}
          onIonInput={(e) => setCorreo(e.detail.value ?? '')}
        />
        <br />
        <IonInput
          label="Contraseña"
          labelPlacement="floating"
          fill="outline"
          type="password"
          value={password}
          onIonInput={(e) => setPassword(e.detail.value ?? '')}
        />

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonButton expand="block" className="ion-margin-top" onClick={iniciarSesion}>
          Iniciar sesión
        </IonButton>

        <IonButton expand="block" fill="clear" routerLink="/registro">
          Crear cuenta
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
