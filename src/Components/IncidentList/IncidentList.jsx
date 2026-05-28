import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../Supabase/config';
import { useAuth } from '../../context/AuthContext';
import IncidentCard from '../IncidentCard/IncidentCard';
import './IncidentList.css';

const ESTADOS = ['Todos', 'Reportado', 'En proceso', 'Resuelto'];

/**
 * Listado de incidencias con filtro por estado (RF-08).
 * - Usuario: solo ve sus propios incidentes.
 * - Administrador: ve todos los incidentes.
 */
function IncidentList() {
  const { user, role }     = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filtro, setFiltro]       = useState('Todos');
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchIncidents(); }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    let query = supabase
      .from('incidents')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    // Usuarios normales solo ven sus incidentes
    if (role !== 'admin') query = query.eq('usuario_id', user.id);

    const { data, error } = await query;
    if (!error) setIncidents(data ?? []);
    setLoading(false);
  };

  const filtrados = filtro === 'Todos'
    ? incidents
    : incidents.filter(i => i.estado === filtro);

  return (
    <section className="ilist-container">
      <div className="ilist-header">
        <div>
          <h2>Incidentes</h2>
          {role === 'admin' && <span className="ilist-admin-badge">Vista administrador — todos los reportes</span>}
        </div>
        <Link to="/incidents/new" className="btn-new-incident">+ Reportar nuevo</Link>
      </div>

      {/* Filtro por estado (RF-08) */}
      <div className="ilist-filters">
        {ESTADOS.map(e => (
          <button
            key={e}
            className={`filter-btn ${filtro === e ? 'active' : ''}`}
            onClick={() => setFiltro(e)}
          >
            {e}
            <span className="filter-count">
              {e === 'Todos' ? incidents.length : incidents.filter(i => i.estado === e).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="ilist-empty">Cargando incidentes...</p>
      ) : filtrados.length === 0 ? (
        <p className="ilist-empty">
          {filtro !== 'Todos'
            ? `No hay incidentes con estado "${filtro}".`
            : 'Aún no has reportado ningún incidente.'}
        </p>
      ) : (
        <div className="ilist-grid">
          {filtrados.map(inc => (
            <IncidentCard key={inc.id} incident={inc} />
          ))}
        </div>
      )}
    </section>
  );
}

export default IncidentList;
