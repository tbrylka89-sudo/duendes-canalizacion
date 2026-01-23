'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// BANNER DE PROMOCIONES
// Muestra promociones activas en Mi Magia
// ═══════════════════════════════════════════════════════════════

export function BannerPromociones({ usuario, ubicacion = 'mi-magia-promos' }) {
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [promoCerrada, setPromoCerrada] = useState({});

  useEffect(() => {
    cargarPromociones();
  }, [usuario?.email]);

  const cargarPromociones = async () => {
    try {
      const params = new URLSearchParams({
        ubicacion,
        ...(usuario?.email && { email: usuario.email })
      });

      const res = await fetch(`/api/mi-magia/promociones?${params}`);
      const data = await res.json();

      if (data.success) {
        setPromociones(data.promociones || []);
      }
    } catch (e) {
      console.error('Error cargando promociones:', e);
    }
    setCargando(false);
  };

  const cerrarPromo = (promoId) => {
    setPromoCerrada(prev => ({ ...prev, [promoId]: true }));
    // Guardar en localStorage para recordar
    try {
      const cerradas = JSON.parse(localStorage.getItem('promos_cerradas') || '{}');
      cerradas[promoId] = Date.now();
      localStorage.setItem('promos_cerradas', JSON.stringify(cerradas));
    } catch (e) {}
  };

  // Filtrar promociones cerradas
  const promosVisibles = promociones.filter(p => !promoCerrada[p.id]);

  if (cargando || promosVisibles.length === 0) return null;

  return (
    <div className="banners-promociones">
      {promosVisibles.map((promo, index) => (
        <BannerPromoIndividual
          key={promo.id || index}
          promo={promo}
          onCerrar={() => cerrarPromo(promo.id)}
        />
      ))}

      <style jsx>{`
        .banners-promociones {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 25px;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BANNER INDIVIDUAL
// ═══════════════════════════════════════════════════════════════

function BannerPromoIndividual({ promo, onCerrar }) {
  const [tiempoRestante, setTiempoRestante] = useState(promo.cuentaRegresiva);

  // Actualizar cuenta regresiva cada minuto
  useEffect(() => {
    if (!promo.cuentaRegresiva) return;

    const interval = setInterval(() => {
      setTiempoRestante(prev => {
        if (!prev) return null;

        let { dias, horas, minutos } = prev;
        minutos--;

        if (minutos < 0) {
          minutos = 59;
          horas--;
        }
        if (horas < 0) {
          horas = 23;
          dias--;
        }
        if (dias < 0) return null;

        return { dias, horas, minutos };
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [promo.cuentaRegresiva]);

  // Colores por defecto o personalizados
  const colores = promo.colores || {
    fondo: 'linear-gradient(135deg, rgba(198, 169, 98, 0.15), rgba(198, 169, 98, 0.05))',
    borde: 'rgba(198, 169, 98, 0.3)',
    texto: '#C6A962',
    boton: 'linear-gradient(135deg, #C6A962, #a88a42)'
  };

  // Efectos
  const efectos = promo.efectos || {};

  return (
    <div
      className={`banner-promo ${efectos.brillo ? 'con-brillo' : ''} ${efectos.pulso ? 'con-pulso' : ''}`}
      style={{
        background: colores.fondo,
        borderColor: colores.borde
      }}
    >
      {/* Botón cerrar */}
      {promo.permitirCerrar && (
        <button className="banner-cerrar" onClick={onCerrar}>
          ×
        </button>
      )}

      {/* Icono */}
      {promo.icono && (
        <div className="banner-icono">{promo.icono}</div>
      )}

      {/* Contenido */}
      <div className="banner-contenido">
        <h4 className="banner-titulo" style={{ color: colores.texto }}>
          {promo.titulo}
        </h4>

        {promo.subtitulo && (
          <p className="banner-subtitulo">{promo.subtitulo}</p>
        )}

        {/* Cuenta regresiva */}
        {tiempoRestante && (
          <div className="banner-countdown">
            {tiempoRestante.dias > 0 && (
              <span className="countdown-item">
                <strong>{tiempoRestante.dias}</strong> días
              </span>
            )}
            <span className="countdown-item">
              <strong>{tiempoRestante.horas}</strong> hs
            </span>
            <span className="countdown-item">
              <strong>{tiempoRestante.minutos}</strong> min
            </span>
          </div>
        )}
      </div>

      {/* Botón */}
      {promo.url && promo.url !== '#' && (
        <a
          href={promo.url}
          className="banner-btn"
          style={{ background: colores.boton }}
          target={promo.url.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
        >
          {promo.textoBoton || 'Ver más'}
        </a>
      )}

      <style jsx>{`
        .banner-promo {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px 25px;
          border: 1px solid;
          border-radius: 15px;
          position: relative;
          transition: all 0.3s ease;
        }

        .banner-promo:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .banner-promo.con-brillo::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 15px;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: brillo 2s infinite;
        }

        @keyframes brillo {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .banner-promo.con-pulso {
          animation: pulso 2s infinite;
        }

        @keyframes pulso {
          0%, 100% { box-shadow: 0 0 0 0 rgba(198, 169, 98, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(198, 169, 98, 0); }
        }

        .banner-cerrar {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
          line-height: 1;
          transition: color 0.2s;
        }

        .banner-cerrar:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .banner-icono {
          font-size: 36px;
          flex-shrink: 0;
        }

        .banner-contenido {
          flex: 1;
          min-width: 0;
        }

        .banner-titulo {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
          font-family: Georgia, serif;
        }

        .banner-subtitulo {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          line-height: 1.4;
        }

        .banner-countdown {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .countdown-item {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .countdown-item strong {
          color: #C6A962;
          font-size: 16px;
          margin-right: 3px;
        }

        .banner-btn {
          flex-shrink: 0;
          padding: 10px 22px;
          color: #000;
          text-decoration: none;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .banner-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 3px 15px rgba(198, 169, 98, 0.4);
        }

        @media (max-width: 600px) {
          .banner-promo {
            flex-wrap: wrap;
            padding: 15px;
          }

          .banner-icono {
            font-size: 28px;
          }

          .banner-contenido {
            width: calc(100% - 50px);
          }

          .banner-btn {
            width: 100%;
            text-align: center;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BANNER FIJO (para header)
// ═══════════════════════════════════════════════════════════════

export function BannerFijoHeader({ usuario }) {
  const [promo, setPromo] = useState(null);
  const [cerrado, setCerrado] = useState(false);

  useEffect(() => {
    // Verificar si ya se cerró hoy
    try {
      const cerradas = JSON.parse(localStorage.getItem('promos_cerradas') || '{}');
      const ultimoCierre = cerradas['header'];
      if (ultimoCierre && Date.now() - ultimoCierre < 24 * 60 * 60 * 1000) {
        setCerrado(true);
        return;
      }
    } catch (e) {}

    cargarPromo();
  }, []);

  const cargarPromo = async () => {
    try {
      const params = new URLSearchParams({
        ubicacion: 'header',
        ...(usuario?.email && { email: usuario.email })
      });

      const res = await fetch(`/api/mi-magia/promociones?${params}`);
      const data = await res.json();

      if (data.success && data.promociones.length > 0) {
        setPromo(data.promociones[0]); // Solo mostrar la primera (más prioritaria)
      }
    } catch (e) {}
  };

  const cerrar = () => {
    setCerrado(true);
    try {
      const cerradas = JSON.parse(localStorage.getItem('promos_cerradas') || '{}');
      cerradas['header'] = Date.now();
      localStorage.setItem('promos_cerradas', JSON.stringify(cerradas));
    } catch (e) {}
  };

  if (cerrado || !promo) return null;

  return (
    <div className="banner-header-fijo">
      <div className="banner-header-contenido">
        {promo.icono && <span className="banner-header-icono">{promo.icono}</span>}
        <span className="banner-header-texto">
          <strong>{promo.titulo}</strong>
          {promo.subtitulo && ` - ${promo.subtitulo}`}
        </span>
        {promo.url && promo.url !== '#' && (
          <a href={promo.url} className="banner-header-link">
            {promo.textoBoton || 'Ver'}
          </a>
        )}
      </div>

      {promo.permitirCerrar && (
        <button className="banner-header-cerrar" onClick={cerrar}>×</button>
      )}

      <style jsx>{`
        .banner-header-fijo {
          position: sticky;
          top: 0;
          z-index: 100;
          background: linear-gradient(90deg, #C6A962, #a88a42);
          padding: 10px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .banner-header-contenido {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #000;
          font-size: 14px;
        }

        .banner-header-icono {
          font-size: 18px;
        }

        .banner-header-texto strong {
          font-weight: 600;
        }

        .banner-header-link {
          background: rgba(0, 0, 0, 0.2);
          color: #fff;
          padding: 4px 12px;
          border-radius: 15px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          margin-left: 5px;
        }

        .banner-header-link:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        .banner-header-cerrar {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          color: rgba(0, 0, 0, 0.5);
          font-size: 22px;
          cursor: pointer;
          line-height: 1;
        }

        .banner-header-cerrar:hover {
          color: rgba(0, 0, 0, 0.8);
        }

        @media (max-width: 600px) {
          .banner-header-fijo {
            padding: 8px 40px 8px 15px;
          }

          .banner-header-contenido {
            flex-wrap: wrap;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default BannerPromociones;
