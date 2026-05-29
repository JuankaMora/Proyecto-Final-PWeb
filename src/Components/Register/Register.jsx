import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../Supabase/config';
import './Register.css';

const CLAVE_ADMIN = 'udla2026';

function Register() {
  const [nombre, setNombre]         = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [claveAdmin, setClaveAdmin] = useState('');
  const [message, setMessage]       = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [success, setSuccess]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setMessage(error.message); setIsLoading(false); return; }

    const esAdmin = claveAdmin === CLAVE_ADMIN;

    await supabase.rpc('registrar_perfil', {
      user_id:   data.user.id,
      user_nombre: nombre,
      user_role: esAdmin ? 'admin' : 'user'
    });

    setIsLoading(false);
    setSuccess(true);
    setMessage(esAdmin
      ? 'Cuenta creada como administrador. Confirma tu correo para iniciar sesión.'
      : 'Cuenta creada. Revisa tu correo y confirma tu registro para iniciar sesión.'
    );
  };

  return (
    <section className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logos">
            <img src="/udla.png" alt="Logo UDLA" className="register-img-logo" />
          </div>
          <h1 className="register-title">Crear cuenta</h1>
          <p className="register-subtitle">Regístrate con tu correo institucional</p>
          <hr className="register-divider" />
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-group">
            <label className="register-label" htmlFor="register-nombre">Nombre completo</label>
            <input className="register-input" id="register-nombre" type="text"
              placeholder="Tu nombre completo"
              value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
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
          <div className="register-group">
            <label className="register-label" htmlFor="register-clave">
              Clave de administrador <span className="register-opcional">(opcional)</span>
            </label>
            <input className="register-input" id="register-clave" type="password"
              placeholder="Solo si eres administrador"
              value={claveAdmin} onChange={e => setClaveAdmin(e.target.value)} />
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

        <div className="register-card-footer">
          <p>Copyright © 2026 Universidad de la Amazonia</p>
          <p>Departamento de Tecnologías de la Información</p>
          <p>Área de Investigación y Desarrollo</p>
        </div>
      </div>
    </section>
  );
}

export default Register;