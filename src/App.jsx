import { useState } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
// El espacio queda listo para cuando crees tus componentes de Header/Nav/Footer
// import Navbar from './components/Navbar/Navbar.jsx'
// import Footer from './components/Footer/Footer.jsx'

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (sessionUser) => {
    setUser(sessionUser);
  };

  return (
    <div className="app-shell">
      {/* <Navbar user={user} /> */}

      <main className="app-content">
        {!user ? (
          // Envolvemos el Login y Registro en el wrapper de centrado
          <div className="auth-wrapper">
            {currentView === 'login' ? (
              <Login 
                onLoginSuccess={handleLoginSuccess} 
                onSwitchToRegister={() => setCurrentView('register')} 
              />
            ) : (
              <Register 
                onSwitchToLogin={() => setCurrentView('login')} 
              />
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h1>¡Bienvenido al Sistema de Incidentes!</h1>
            <p style={{ margin: '15px 0', color: '#666' }}>Sesión activa: {user.email}</p>
            <button 
              onClick={() => setUser(null)}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
