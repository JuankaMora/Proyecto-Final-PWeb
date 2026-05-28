import { useEffect, useState } from 'react';
import { supabase } from '../../Supabase/config';
import './Statistics.css';

/**
 * Dashboard de estadísticas por período (RF-11, RF-12).
 * Muestra total de incidentes, conteo por estado, por tipo y un gráfico de barras.
 * El botón de impresión activa window.print() con estilos @media print (RF-12).
 */
function Statistics() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [desde, setDesde]         = useState('');
  const [hasta, setHasta]         = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    let query = supabase.from('incidents').select('*');
    if (desde) query = query.gte('fecha_creacion', desde + 'T00:00:00');
    if (hasta) query = query.lte('fecha_creacion', hasta + 'T23:59:59');
    const { data } = await query;
    setIncidents(data ?? []);
    setLoading(false);
  };

  const total = incidents.length;

  const porEstado = ['Reportado', 'En proceso', 'Resuelto'].map(e => ({
    estado: e,
    count: incidents.filter(i => i.estado === e).length,
    color: e === 'Reportado' ? '#dc3545' : e === 'En proceso' ? '#ffc107' : '#28a745',
  }));

  const tipos = [...new Set(incidents.map(i => i.tipo))].sort();
  const porTipo = tipos.map(t => ({
    tipo: t,
    count: incidents.filter(i => i.tipo === t).length,
  }));

  const maxCount = porTipo.reduce((m, t) => Math.max(m, t.count), 1);

  return (
    <section className="stats-container">
      <div className="stats-header">
        <h2>Estadísticas de incidentes</h2>
        <button className="btn-print no-print" onClick={() => window.print()}>
          🖨 Imprimir / Exportar PDF
        </button>
      </div>

      {/* Filtro por período (RF-11) */}
      <div className="stats-filters no-print">
        <label>
          Desde
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
        </label>
        <label>
          Hasta
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
        </label>
        <button className="btn-filter" onClick={fetchAll}>Aplicar filtro</button>
        <button className="btn-clear" onClick={() => { setDesde(''); setHasta(''); }}>
          Limpiar
        </button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <div className="stats-content">

          {/* Total */}
          <div className="stat-hero">
            <span className="stat-hero-num">{total}</span>
            <span className="stat-hero-label">Total de incidentes</span>
          </div>

          {/* Por estado */}
          <div className="stats-section">
            <h3>Por estado</h3>
            <div className="stat-cards-row">
              {porEstado.map(({ estado, count, color }) => (
                <div key={estado} className="stat-card" style={{ borderTopColor: color }}>
                  <span className="stat-num">{count}</span>
                  <span className="stat-lbl">{estado}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Por tipo */}
          <div className="stats-section">
            <h3>Por tipo</h3>
            <div className="stat-cards-row">
              {porTipo.map(({ tipo, count }) => (
                <div key={tipo} className="stat-card">
                  <span className="stat-num">{count}</span>
                  <span className="stat-lbl">{tipo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de barras (RF-11 opcional) */}
          {porTipo.length > 0 && (
            <div className="stats-section">
              <h3>Gráfico por tipo</h3>
              <div className="bar-chart">
                {porTipo.map(({ tipo, count }) => (
                  <div key={tipo} className="bar-item">
                    <div
                      className="bar-fill"
                      style={{ height: `${Math.round((count / maxCount) * 140)}px` }}
                    />
                    <span className="bar-count">{count}</span>
                    <span className="bar-label">{tipo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </section>
  );
}

export default Statistics;
