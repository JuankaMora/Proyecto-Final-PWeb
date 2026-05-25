import { useState } from 'react';
import { supabase } from '../../Supabase/config';
import './Login.css';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    onLoginSuccess(data.user);
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar sesion</h1>
        <p className="login-subtitle">Ingresa con tu correo institucional</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-group">
            <label className="login-label" htmlFor="login-email">
              Correo
            </label>
            <input
              className="login-input"
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label className="login-label" htmlFor="login-password">
              Contrasena
            </label>
            <input
              className="login-input"
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {message && <p className="login-footer">{message}</p>}

          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="login-footer">
          No tienes cuenta?{' '}
          <span className="login-link" onClick={onSwitchToRegister}>
            Registrate
          </span>
        </p>
      </div>
    </section>
  );
}

export default Login;
