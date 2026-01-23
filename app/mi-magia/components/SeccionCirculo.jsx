'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// CÍRCULO - Sección simplificada (redirecciona a página completa)
// ═══════════════════════════════════════════════════════════════

export default function SeccionCirculo({ usuario, pais }) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar historial de mensajes del Duende de la Semana
  useEffect(() => {
    if (usuario?.esCirculo && usuario?.email) {
      cargarHistorial();
    }
  }, [usuario?.esCirculo, usuario?.email]);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const res = await fetch(`/api/circulo/historial-mensajes?email=${encodeURIComponent(usuario.email)}`);
      const data = await res.json();
      if (data.success && data.mensajes) {
        setHistorial(data.mensajes.slice(0, 10)); // Últimos 10 mensajes
      }
    } catch(e) {
      console.error('Error cargando historial:', e);
    }
    setCargando(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // SI ES MIEMBRO DEL CÍRCULO
  // ═══════════════════════════════════════════════════════════════

  if (usuario?.esCirculo) {
    return (
      <div className="sec">
        <div className="circulo-miembro-card">
          <span className="circulo-miembro-icon">★</span>
          <h2>✓ Sos parte del Círculo</h2>
          <p>Tu membresía está activa. Entrá al Círculo para ver todo tu contenido exclusivo.</p>
          <a href="/mi-magia/circulo" className="btn-ir-circulo">
            Ir al Círculo →
          </a>
        </div>

        {/* Historial de mensajes del Duende de la Semana */}
        <div className="historial-mensajes">
          <h3>📜 Mensajes recibidos del Duende de la Semana</h3>
          {cargando ? (
            <p className="historial-cargando">Cargando historial...</p>
          ) : historial.length > 0 ? (
            <div className="mensajes-lista">
              {historial.map((msg, i) => (
                <div key={i} className="mensaje-item">
                  <div className="mensaje-header">
                    <span className="mensaje-guardian">{msg.guardian || 'Guardián'}</span>
                    <span className="mensaje-fecha">{msg.fecha || ''}</span>
                  </div>
                  <p className="mensaje-texto">{msg.mensaje}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="historial-vacio">Tus mensajes del Duende de la Semana aparecerán aquí.</p>
          )}
        </div>

        <style jsx>{`
          .circulo-miembro-card { background: linear-gradient(135deg, #f0fff0, #e8f5e9); border: 2px solid #2a7a2a; border-radius: 16px; padding: 2rem; text-align: center; margin-bottom: 2rem; }
          .circulo-miembro-icon { font-size: 3rem; color: #2a7a2a; display: block; margin-bottom: 1rem; }
          .circulo-miembro-card h2 { font-family: 'Cinzel', serif; color: #2a7a2a; margin: 0 0 0.5rem; }
          .circulo-miembro-card p { color: #555; margin-bottom: 1.5rem; }
          .btn-ir-circulo { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #2a7a2a, #1a5a1a); color: #fff; text-decoration: none; border-radius: 8px; font-family: 'Cinzel', serif; font-weight: 600; transition: all 0.2s; }
          .btn-ir-circulo:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(42,122,42,0.3); }

          .historial-mensajes { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; }
          .historial-mensajes h3 { font-family: 'Cinzel', serif; color: #1a1a1a; margin: 0 0 1rem; font-size: 1rem; }
          .historial-cargando, .historial-vacio { color: #888; font-style: italic; text-align: center; padding: 2rem; }
          .mensajes-lista { display: flex; flex-direction: column; gap: 1rem; }
          .mensaje-item { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 1rem; }
          .mensaje-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
          .mensaje-guardian { font-family: 'Cinzel', serif; color: #d4af37; font-weight: 600; }
          .mensaje-fecha { font-size: 0.8rem; color: #999; }
          .mensaje-texto { color: #444; line-height: 1.6; margin: 0; font-size: 0.95rem; }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SI NO ES MIEMBRO - MOSTRAR PROMOCIÓN
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="sec">
      <div className="circulo-promo-card">
        <span className="circulo-promo-icon">★</span>
        <h2>Círculo de Duendes</h2>
        <p className="circulo-promo-sub">El santuario secreto para quienes sienten el llamado</p>

        <div className="beneficios-lista-simple">
          <div className="beneficio-item">✦ Duende guardián semanal con mensajes únicos</div>
          <div className="beneficio-item">☽ Guía lunar completa cada mes</div>
          <div className="beneficio-item">🕯️ Rituales y prácticas exclusivas</div>
          <div className="beneficio-item">❧ Comunidad privada de buscadores</div>
          <div className="beneficio-item">◈ 5-10% OFF en guardianes</div>
          <div className="beneficio-item destacado">🎁 100 runas de regalo para usar en la tienda</div>
        </div>

        <a href="/mi-magia/circulo" className="btn-unirse-circulo">
          Probá 15 días gratis →
        </a>
      </div>

      <style jsx>{`
        .circulo-promo-card { background: linear-gradient(135deg, #faf8f3, #fff); border: 2px solid #d4af37; border-radius: 16px; padding: 2rem; text-align: center; }
        .circulo-promo-icon { font-size: 3rem; color: #d4af37; display: block; margin-bottom: 1rem; }
        .circulo-promo-card h2 { font-family: 'Tangerine', cursive; font-size: 2.5rem; color: #1a1a1a; margin: 0 0 0.5rem; }
        .circulo-promo-sub { color: #666; margin-bottom: 1.5rem; }
        .beneficios-lista-simple { text-align: left; max-width: 350px; margin: 0 auto 1.5rem; }
        .beneficio-item { padding: 0.6rem 0; border-bottom: 1px dashed #e0e0e0; color: #444; font-size: 0.95rem; }
        .beneficio-item:last-child { border-bottom: none; }
        .beneficio-item.destacado { background: linear-gradient(90deg, rgba(212,175,55,0.1), transparent); padding: 0.8rem 0.5rem; margin: 0.5rem -0.5rem 0; border-radius: 6px; border-bottom: none; font-weight: 600; color: #b8962e; }
        .btn-unirse-circulo { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #d4af37, #b8962e); color: #1a1a1a; text-decoration: none; border-radius: 8px; font-family: 'Cinzel', serif; font-weight: 600; transition: all 0.2s; }
        .btn-unirse-circulo:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(212,175,55,0.3); }
      `}</style>
    </div>
  );
}
