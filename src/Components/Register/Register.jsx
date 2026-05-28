import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../Supabase/config';
import './Register.css';

function Register() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [message, setMessage]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoading(false);
    if (error) { setMessage(error.message); return; }
    setSuccess(true);
    setMessage('Cuenta creada exitosamente. Ya puedes iniciar sesión.');
  };

  return (
    <section className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logos">
            <img src="/udla.png" alt="Logo UDLA" className="register-img-logo" />
            <div className="register-escudo">UA</div>
          </div>
          <h1 className="register-title">Crear cuenta</h1>
          <p className="register-subtitle">Regístrate con tu correo institucional</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-group">
            <label className="register-label" htmlFor="register-email">Correo institucional</label>
            <input className="register-input" id="register-email" type="email"
              placeholder="usuario@udla.edu.co"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="register-group">
            <label className="register-label" htmlFor="register-password">Contraseña</label>
            <input className="register-input" id="register-password" type="password"
              minLength="6" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {message && <p className={success ? 'register-success' : 'form-error'}>{message}</p>}
          <button className="register-btn" type="submit" disabled={isLoading || success}>
            {isLoading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="register-footer">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="register-link">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
