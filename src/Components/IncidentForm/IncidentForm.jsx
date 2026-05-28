import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Supabase/config';
import { useAuth } from '../../context/AuthContext';
import './IncidentForm.css';

const TIPOS = ['Baño', 'Electricidad', 'Infraestructura', 'Seguridad', 'Agua', 'Otro'];

/**
 * Formulario de registro de incidentes (RF-05, RF-06, RF-07).
 * Captura tipo, descripción, ubicación, foto (obligatoria) y geolocalización opcional.
 * Sube la imagen a Supabase Storage y guarda el incidente en la tabla incidents.
 */
function IncidentForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tipo, setTipo]             = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion]   = useState('');
  const [foto, setFoto]             = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [latitud, setLatitud]       = useState(null);
  const [longitud, setLongitud]     = useState(null);
  const [geoMsg, setGeoMsg]         = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [message, setMessage]       = useState('');
  const [isLoading, setIsLoading]   = useState(false);

  // Manejo de foto seleccionada o capturada
  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // Geolocalización por GPS del navegador (RF-05 opcional)
  const handleGeo = () => {
    if (!navigator.geolocation) {
      setGeoMsg('Tu navegador no soporta geolocalización.');
      return;
    }
    setGeoLoading(true);
    setGeoMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitud(pos.coords.latitude);
        setLongitud(pos.coords.longitude);
        setGeoLoading(false);
        setGeoMsg(`Ubicación capturada: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
      },
      () => {
        setGeoLoading(false);
        setGeoMsg('No se pudo obtener el GPS. Usa la ubicación textual.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foto) { setMessage('La fotografía es obligatoria (RF-05).'); return; }
    setIsLoading(true);
    setMessage('');

    // 1. Subir imagen a Storage (RF-07: imagenURL, RNF-05, RNF-11)
    const ext = foto.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('incident-images')
      .upload(fileName, foto, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setMessage('Error al subir la imagen: ' + uploadError.message);
      setIsLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('incident-images')
      .getPublicUrl(uploadData.path);

    // 2. Insertar incidente en la base de datos (RF-06, RF-07)
    const { error: insertError } = await supabase.from('incidents').insert({
      usuario_id:      user.id,
      tipo,
      descripcion,
      imagen_url:      publicUrl,
      ubicacion_texto: ubicacion,
      latitud:         latitud ?? null,
      longitud:        longitud ?? null,
      estado:          'Reportado',  // RF-05: estado inicial
    });

    setIsLoading(false);
    if (insertError) {
      setMessage('Error al registrar el incidente: ' + insertError.message);
      return;
    }
    navigate('/incidents');
  };

  return (
    <section className="iform-container">
      <div className="iform-card">
        <h2 className="iform-title">Reportar incidente</h2>

        <form onSubmit={handleSubmit} className="iform">

          <div className="iform-group">
            <label>Tipo de incidente *</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} required>
              <option value="">— Selecciona un tipo —</option>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="iform-group">
            <label>Descripción detallada *</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={4}
              required
              placeholder="Describe el problema con el mayor detalle posible..."
            />
          </div>

          <div className="iform-group">
            <label>Ubicación (texto) *</label>
            <input
              type="text"
              value={ubicacion}
              onChange={e => setUbicacion(e.target.value)}
              required
              placeholder="Ej: Bloque B, piso 2, baño de hombres"
            />
          </div>

          <div className="iform-group">
            <label>Geolocalización GPS (opcional)</label>
            <button type="button" className="btn-geo" onClick={handleGeo} disabled={geoLoading}>
              {geoLoading ? 'Obteniendo GPS...' : '📍 Capturar ubicación GPS'}
            </button>
            {geoMsg && <span className={latitud ? 'geo-ok' : 'geo-err'}>{geoMsg}</span>}
          </div>

          <div className="iform-group">
            <label>Fotografía del incidente * (obligatoria)</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFoto}
              className="file-input"
            />
            {fotoPreview && (
              <img src={fotoPreview} alt="Vista previa" className="foto-preview" />
            )}
          </div>

          {message && <p className="form-error">{message}</p>}

          <div className="iform-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/incidents')}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default IncidentForm;
