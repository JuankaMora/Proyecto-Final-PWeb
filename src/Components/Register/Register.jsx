import { useState } from 'react';
import { supabase } from '../../Supabase/config';
import './Register.css';

function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Registro creado. Revisa tu correo si Supabase pide confirmacion.');
  };

  return (
    <section className="register-container">
      <div className="register-card">
        <h1 className="register-title">Crear cuenta</h1>
        <p className="register-subtitle">Registra tu usuario para reportar incidentes</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-group">
            <label className="register-label" htmlFor="register-email">
              Correo
            </label>
            <input
              className="register-input"
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="register-group">
            <label className="register-label" htmlFor="register-password">
              Contrasena
            </label>
            <input
              className="register-input"
              id="register-password"
              type="password"
              minLength="6"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {message && <p className="register-footer">{message}</p>}

          <button className="register-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="register-footer">
          Ya tienes cuenta?{' '}
          <span className="register-link" onClick={onSwitchToLogin}>
            Inicia sesion
          </span>
        </p>
      </div>
    </section>
  );
}

export default Register;
