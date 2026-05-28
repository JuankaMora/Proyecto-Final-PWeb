import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import IncidentList from './Components/IncidentList/IncidentList';
import IncidentForm from './Components/IncidentForm/IncidentForm';
import AdminPanel from './Components/AdminPanel/AdminPanel';
import Statistics from './Components/Statistics/Statistics';
import './App.css';

// Protege rutas que requieren sesión activa
function PrivateRoute({ children, adminOnly = false }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && role !== 'admin') return <Navigate to="/incidents" replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Cargando...</div>;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/login"      element={user ? <Navigate to="/incidents" /> : <Login />} />
          <Route path="/register"   element={user ? <Navigate to="/incidents" /> : <Register />} />
          <Route path="/incidents"  element={<PrivateRoute><IncidentList /></PrivateRoute>} />
          <Route path="/incidents/new" element={<PrivateRoute><IncidentForm /></PrivateRoute>} />
          <Route path="/admin"      element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
          <Route path="/statistics" element={<PrivateRoute adminOnly><Statistics /></PrivateRoute>} />
          <Route path="*"           element={<Navigate to={user ? '/incidents' : '/login'} replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
