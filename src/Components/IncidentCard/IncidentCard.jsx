import './Incidentcard.css';

// Colores por estado para el indicador visual (RF-08)
const ESTADO_COLOR = {
  'Reportado':  '#dc3545',
  'En proceso': '#ffc107',
  'Resuelto':   '#28a745',
};

/**
 * Tarjeta de vista resumida de un incidente (RF-08).
 * Muestra tipo, estado con indicador de color, imagen, descripción y ubicación.
 */
function IncidentCard({ incident }) {
  const { tipo, descripcion, imagen_url, ubicacion_texto, estado, fecha_creacion } = incident;

  return (
    <div className="icard">
      {imagen_url && (
        <img src={imagen_url} alt="Foto del incidente" className="icard-img" />
      )}
      <div className="icard-body">
        <div className="icard-header">
          <span className="icard-tipo">{tipo}</span>
          <span
            className="icard-estado"
            style={{ backgroundColor: ESTADO_COLOR[estado] ?? '#6c757d' }}
          >
            {estado}
          </span>
        </div>
        <p className="icard-desc">{descripcion}</p>
        <p className="icard-ubicacion">📍 {ubicacion_texto}</p>
        <p className="icard-fecha">
          {new Date(fecha_creacion).toLocaleString('es-CO', {
            dateStyle: 'medium', timeStyle: 'short',
          })}
        </p>
      </div>
    </div>
  );
}

export default IncidentCard;
