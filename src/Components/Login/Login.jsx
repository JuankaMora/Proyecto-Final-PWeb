import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../Supabase/config';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [message, setMessage]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) { setMessage(error.message); return; }
    navigate('/incidents');
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logos">
            <img src="/udla.png" alt="Logo UDLA" className="login-img-logo" />
            <div className="login-escudo">UA</div>
          </div>
          <h1 className="login-title">Iniciar sesión</h1>
          <p className="login-subtitle">Sistema de Reporte de Incidentes</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-group">
            <label className="login-label" htmlFor="login-email">Correo institucional</label>
            <input className="login-input" id="login-email" type="email"
              placeholder="usuario@udla.edu.co"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="login-group">
            <label className="login-label" htmlFor="login-password">Contraseña</label>
            <input className="login-input" id="login-password" type="password"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {message && <p className="form-error">{message}</p>}
          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="login-footer">
          No tienes cuenta?{' '}
          <Link to="/register" className="login-link">Regístrate aquí</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
