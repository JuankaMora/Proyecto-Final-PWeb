import { useEffect, useState } from 'react';
import { supabase } from '../../Supabase/config';
import './AdminPanel.css';

const ESTADOS = ['Reportado', 'En proceso', 'Resuelto'];
const ESTADO_COLOR = {
  'Reportado':  '#dc3545',
  'En proceso': '#ffc107',
  'Resuelto':   '#28a745',
};

// Cámbiala por la clave que quieras usar
const CLAVE_ADMIN = 'udla2026';

function AdminPanel() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState([]);
  const [feedback, setFeedback]   = useState('');
  const [correoNuevoAdmin, setCorreoNuevoAdmin] = useState('');
  const [claveIngresada, setClaveIngresada]     = useState('');
  const [promoMsg, setPromoMsg]                 = useState('');
  const [promoLoading, setPromoLoading]         = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('incidents').select('*').order('fecha_creacion', { ascending: false });
    setIncidents(data ?? []);
    setLoading(false);
  };

  const changeEstado = async (id, grupoId, nuevoEstado) => {
    if (grupoId) await supabase.from('incidents').update({ estado: nuevoEstado }).eq('grupo_id', grupoId);
    else         await supabase.from('incidents').update({ estado: nuevoEstado }).eq('id', id);
    fetchAll();
  };

  const groupSelected = async () => {
    if (selected.length < 2) { setFeedback('Selecciona al menos 2 incidentes para agrupar.'); return; }
    const grupoId = `grupo_${Date.now()}`;
    await supabase.from('incidents').update({ grupo_id: grupoId }).in('id', selected);
    setSelected([]);
    setFeedback(`${selected.length} incidentes agrupados correctamente.`);
    fetchAll();
  };

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handlePromoverAdmin = async (e) => {
    e.preventDefault();
    setPromoMsg('');
    if (claveIngresada !== CLAVE_ADMIN) {
      setPromoMsg('error:Clave incorrecta. No tienes autorización.');
      return;
    }
    setPromoLoading(true);
    const { data, error } = await supabase
      .rpc('promover_admin_por_correo', { correo: correoNuevoAdmin });
    setPromoLoading(false);
    if (error || !data) {
      setPromoMsg('error:No se encontró ningún usuario con ese correo. Debe registrarse primero.');
      return;
    }
    setPromoMsg('ok:' + correoNuevoAdmin + ' ahora es administrador.');
    setCorreoNuevoAdmin('');
    setClaveIngresada('');
  };

  return (
    <section className="admin-container">
      <h2>Panel de administración</h2>

      <div className="admin-toolbar">
        <div className="toolbar-left">
          <button className="btn-group" onClick={groupSelected} disabled={selected.length < 2}>
            Agrupar seleccionados ({selected.length})
          </button>
          <span className="toolbar-hint">
            Agrupa incidentes del mismo problema — el cambio de estado se propaga a todo el grupo.
          </span>
        </div>
        {feedback && <span className="feedback-msg">{feedback}</span>}
      </div>

      {loading ? <p>Cargando incidentes...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sel.</th><th>Tipo</th><th>Descripción</th><th>Ubicación</th>
                <th>Fecha</th><th>Foto</th><th>Estado</th><th>Grupo</th><th>Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(inc => (
                <tr key={inc.id}
                  className={`${selected.includes(inc.id) ? 'row-selected' : ''} ${inc.grupo_id ? 'row-grouped' : ''}`}>
                  <td><input type="checkbox" checked={selected.includes(inc.id)} onChange={() => toggleSelect(inc.id)} /></td>
                  <td><strong>{inc.tipo}</strong></td>
                  <td className="td-desc" title={inc.descripcion}>
                    {inc.descripcion.length > 55 ? inc.descripcion.slice(0, 55) + '...' : inc.descripcion}
                  </td>
                  <td>{inc.ubicacion_texto}</td>
                  <td className="td-date">{new Date(inc.fecha_creacion).toLocaleDateString('es-CO')}</td>
                  <td>{inc.imagen_url && <a href={inc.imagen_url} target="_blank" rel="noreferrer" className="img-link">Ver foto</a>}</td>
                  <td><span className="estado-pill" style={{ backgroundColor: ESTADO_COLOR[inc.estado] ?? '#6c757d' }}>{inc.estado}</span></td>
                  <td>{inc.grupo_id ? <span className="grupo-tag">Agrupado</span> : <span className="no-grupo">—</span>}</td>
                  <td>
                    <select value={inc.estado} className="estado-select"
                      onChange={e => changeEstado(inc.id, inc.grupo_id, e.target.value)}>
                      {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="promo-admin-section">
        <h3>Promover nuevo administrador</h3>
        <p className="promo-desc">
          Solo un administrador puede otorgar este rol. El usuario debe estar registrado en la app.
        </p>
        <form className="promo-form" onSubmit={handlePromoverAdmin}>
          <div className="promo-row">
            <div className="promo-group">
              <label>Correo del usuario</label>
              <input type="email" placeholder="usuario@udla.edu.co"
                value={correoNuevoAdmin} onChange={e => setCorreoNuevoAdmin(e.target.value)} required />
            </div>
            <div className="promo-group">
              <label>Clave de autorización</label>
              <input type="password" placeholder="Clave secreta"
                value={claveIngresada} onChange={e => setClaveIngresada(e.target.value)} required />
            </div>
            <button type="submit" className="btn-promo" disabled={promoLoading}>
              {promoLoading ? 'Procesando...' : 'Promover'}
            </button>
          </div>
          {promoMsg && (
            <p className={promoMsg.startsWith('ok:') ? 'promo-ok' : 'promo-err'}>
              {promoMsg.replace(/^(ok:|error:)/, '')}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default AdminPanel;
