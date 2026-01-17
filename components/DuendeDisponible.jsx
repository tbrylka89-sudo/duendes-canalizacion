'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGET: DUENDE DISPONIBLE
// Muestra un guardián real a la venta - desaparece cuando lo adoptan
// ═══════════════════════════════════════════════════════════════════════════════

export default function DuendeDisponible({ compacto = false }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDuende();
    // Polling cada 60 segundos
    const interval = setInterval(cargarDuende, 60000);
    return () => clearInterval(interval);
  }, []);

  async function cargarDuende() {
    try {
      const res = await fetch('/api/duende-disponible');
      const data = await res.json();
      if (data.success) {
        setDatos(data);
      }
    } catch (e) {
      console.error('Error cargando duende:', e);
    }
    setCargando(false);
  }

  if (cargando) {
    return (
      <div className={`duende-widget ${compacto ? 'compacto' : ''}`}>
        <div className="cargando">
          <span className="icono-carga">✦</span>
        </div>
        <style jsx>{estilos}</style>
      </div>
    );
  }

  if (!datos) return null;

  // Duende adoptado recientemente
  if (datos.adoptado) {
    return (
      <div className={`duende-widget adoptado ${compacto ? 'compacto' : ''}`}>
        <div className="adoptado-content">
          <span className="adoptado-icono">🏠</span>
          <h3>{datos.mensaje}</h3>
          <p className="adoptado-tiempo">{datos.hace}</p>
          <p className="adoptado-proximo">Próximo guardián pronto...</p>
        </div>
        <style jsx>{estilos}</style>
      </div>
    );
  }

  // No hay duende disponible
  if (!datos.disponible) {
    return (
      <div className={`duende-widget sin-duende ${compacto ? 'compacto' : ''}`}>
        <span className="sin-icono">✦</span>
        <p>{datos.mensaje}</p>
        <style jsx>{estilos}</style>
      </div>
    );
  }

  // Duende disponible
  const duende = datos.duende;

  if (compacto) {
    return (
      <div className="duende-widget compacto disponible">
        <div className="compacto-header">
          <span className="urgencia-badge">EN ADOPCIÓN</span>
        </div>
        <div className="compacto-content">
          {duende.imagen && <img src={duende.imagen} alt={duende.nombre} className="duende-img-mini" />}
          <div className="compacto-info">
            <h4>{duende.nombre}</h4>
            <p className="compacto-precio">${duende.precio}</p>
          </div>
          <a href={duende.url} target="_blank" rel="noopener" className="btn-conocer-mini">
            Ver
          </a>
        </div>
        <style jsx>{estilos}</style>
      </div>
    );
  }

  return (
    <div className="duende-widget disponible">
      <div className="widget-header">
        <span className="urgencia-badge">EN ADOPCIÓN</span>
        <span className="pulso"></span>
      </div>

      <div className="duende-content">
        {duende.imagen && (
          <div className="duende-imagen">
            <img src={duende.imagen} alt={duende.nombre} />
          </div>
        )}

        <div className="duende-info">
          <h3>{duende.nombre}</h3>

          {duende.proposito && (
            <p className="duende-proposito">{duende.proposito}</p>
          )}

          {duende.cristales && duende.cristales.length > 0 && (
            <div className="duende-cristales">
              {duende.cristales.slice(0, 3).map((c, i) => (
                <span key={i} className="cristal">{c}</span>
              ))}
            </div>
          )}

          {duende.descripcion && (
            <p className="duende-desc">{duende.descripcion}</p>
          )}

          <div className="duende-footer">
            <span className="duende-precio">${duende.precio}</span>
            <a href={duende.url} target="_blank" rel="noopener" className="btn-conocer">
              Conocer
            </a>
          </div>
        </div>
      </div>

      <div className="widget-nota">
        <span>✦</span> Este guardián es único y cuando lo adoptan, desaparece
      </div>

      <style jsx>{estilos}</style>
    </div>
  );
}

const estilos = `
  .duende-widget {
    background: linear-gradient(135deg, #faf8f3 0%, #fff 100%);
    border: 2px solid #d4af37;
    border-radius: 16px;
    padding: 1.5rem;
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  .duende-widget.compacto {
    padding: 1rem;
  }

  .cargando {
    text-align: center;
    padding: 2rem;
  }

  .icono-carga {
    font-size: 2rem;
    color: #d4af37;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
  }

  /* Adoptado */
  .duende-widget.adoptado {
    background: linear-gradient(135deg, #f0f8f0 0%, #fff 100%);
    border-color: #27ae60;
    text-align: center;
  }

  .adoptado-content { padding: 1rem 0; }
  .adoptado-icono { font-size: 3rem; display: block; margin-bottom: 1rem; }
  .adoptado-content h3 { font-family: 'Cinzel', serif; color: #27ae60; margin: 0 0 0.5rem; }
  .adoptado-tiempo { color: #888; font-size: 0.9rem; margin: 0 0 1rem; }
  .adoptado-proximo { color: #d4af37; font-style: italic; margin: 0; }

  /* Sin duende */
  .duende-widget.sin-duende {
    text-align: center;
    padding: 2rem;
  }

  .sin-icono { font-size: 2rem; color: #d4af37; display: block; margin-bottom: 0.5rem; }
  .sin-duende p { color: #666; margin: 0; font-style: italic; }

  /* Disponible */
  .widget-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
  }

  .urgencia-badge {
    background: #e74c3c;
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .pulso {
    width: 10px;
    height: 10px;
    background: #e74c3c;
    border-radius: 50%;
    animation: pulsar 1s infinite;
  }

  @keyframes pulsar {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
  }

  .duende-content {
    display: flex;
    gap: 1.5rem;
  }

  .duende-imagen {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    background: #f5f5f5;
  }

  .duende-imagen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .duende-info { flex: 1; }

  .duende-info h3 {
    font-family: 'Cinzel', serif;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
    font-size: 1.3rem;
  }

  .duende-proposito {
    color: #d4af37;
    font-style: italic;
    margin: 0 0 0.75rem;
    font-size: 0.95rem;
  }

  .duende-cristales {
    display: flex;
    gap: 8px;
    margin-bottom: 0.75rem;
  }

  .cristal {
    background: #f5f5f5;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    color: #666;
  }

  .duende-desc {
    color: #555;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 1rem;
  }

  .duende-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .duende-precio {
    font-family: 'Cinzel', serif;
    font-size: 1.5rem;
    color: #1a1a1a;
    font-weight: 700;
  }

  .btn-conocer {
    background: linear-gradient(135deg, #d4af37, #b8962e);
    color: #1a1a1a;
    padding: 10px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-family: 'Cinzel', serif;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .btn-conocer:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }

  .widget-nota {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed #e0d6c3;
    font-size: 0.8rem;
    color: #888;
    text-align: center;
  }

  .widget-nota span { color: #d4af37; }

  /* Compacto */
  .compacto .compacto-header {
    margin-bottom: 0.75rem;
  }

  .compacto .compacto-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .duende-img-mini {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
  }

  .compacto-info { flex: 1; }
  .compacto-info h4 { margin: 0; font-family: 'Cinzel', serif; font-size: 1rem; }
  .compacto-precio { margin: 0; color: #d4af37; font-weight: 600; }

  .btn-conocer-mini {
    background: #d4af37;
    color: #1a1a1a;
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    .duende-content { flex-direction: column; }
    .duende-imagen { width: 100%; height: 150px; }
  }
`;
