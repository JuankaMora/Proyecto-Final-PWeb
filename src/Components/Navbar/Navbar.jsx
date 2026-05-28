import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-brand">
          <img src="./udla.png" alt="Logo UDLA" className="navbar-img-logo" />
          <div className="navbar-logo">UA</div>
          <div className="navbar-brand-text">
            <span className="navbar-title">Sistema de Incidentes</span>
            <span className="navbar-subtitle">Universidad de la Amazonia</span>
          </div>
        </div>

        <div className="navbar-user">
          <span className="nav-email">{user.email}</span>
          {role === 'admin' && <span className="nav-badge">Administrador</span>}
          <button className="nav-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="navbar-links">
        <div className="navbar-links-inner">
          <Link to="/incidents">Mis incidentes</Link>
          <Link to="/incidents/new" className="nav-btn-report">+ Reportar incidente</Link>
          {role === 'admin' && <Link to="/admin">Panel admin</Link>}
          {role === 'admin' && <Link to="/statistics">Estadísticas</Link>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
