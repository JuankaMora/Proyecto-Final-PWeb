import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/udlapie.png" alt="Logo UDLA" className="footer-img-logo" />
          <div className="footer-logo">UA</div>
          <div>
            <p className="footer-title">Universidad de la Amazonia</p>
            <p className="footer-sub">Sistema de Reporte de Incidentes</p>
          </div>
        </div>
        <p className="footer-copy">© 2026 — Ingeniería de Sistemas</p>
      </div>
    </footer>
  );
}

export default Footer;
