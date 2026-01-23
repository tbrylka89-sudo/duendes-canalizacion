'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// COMPONENTE DE ACCESO RESTRINGIDO
// Muestra contenido borroso para usuarios sin acceso suficiente
// ═══════════════════════════════════════════════════════════════

const NIVELES = {
  gratis: 1,
  compro: 2,
  circulo: 3
};

const MENSAJES = {
  gratis: {
    titulo: 'Contenido para Guardianes',
    descripcion: 'Esta sección está disponible cuando adoptes tu primer guardián.',
    cta: 'Conocer guardianes',
    ctaLink: 'https://duendesdeluruguay.com/tienda'
  },
  compro: {
    titulo: 'Contenido exclusivo del Círculo',
    descripcion: 'Los miembros del Círculo tienen acceso a funciones especiales.',
    cta: 'Probar 15 días gratis',
    ctaAction: 'activar-trial'
  }
};

export function AccesoRestringido({
  children,
  nivelRequerido = 'compro',
  usuario,
  onActivarTrial,
  mensajePersonalizado,
  mostrarVistaPrevia = true,
  className = ''
}) {
  const [activandoTrial, setActivandoTrial] = useState(false);

  // Obtener nivel del usuario
  const nivelUsuario = usuario?.nivelAcceso?.nivel || 'gratis';
  const codigoUsuario = NIVELES[nivelUsuario] || 1;
  const codigoRequerido = NIVELES[nivelRequerido] || 2;

  // Si el usuario tiene suficiente acceso, mostrar contenido normal
  if (codigoUsuario >= codigoRequerido) {
    return <>{children}</>;
  }

  // Determinar qué mensaje mostrar
  const tipoMensaje = nivelRequerido === 'circulo' ? 'compro' : 'gratis';
  const mensaje = mensajePersonalizado || MENSAJES[tipoMensaje];

  // Verificar si puede usar trial
  const puedeUsarTrial = nivelRequerido === 'circulo' && !usuario?.circuloPruebaUsada;

  const handleActivarTrial = async () => {
    if (!puedeUsarTrial || activandoTrial) return;

    setActivandoTrial(true);
    try {
      const res = await fetch('/api/mi-magia/circulo/prueba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email })
      });
      const data = await res.json();

      if (data.success) {
        if (onActivarTrial) {
          onActivarTrial(data);
        }
        // Recargar para ver cambios
        window.location.reload();
      } else {
        alert(data.error || 'No se pudo activar la prueba');
      }
    } catch (e) {
      console.error('Error activando trial:', e);
      alert('Error de conexión');
    }
    setActivandoTrial(false);
  };

  return (
    <div className={`acceso-restringido-wrapper ${className}`}>
      {/* Contenido borroso (vista previa) */}
      {mostrarVistaPrevia && (
        <div className="acceso-contenido-blur">
          {children}
        </div>
      )}

      {/* Overlay con mensaje */}
      <div className="acceso-overlay">
        <div className="acceso-card">
          <div className="acceso-icono">
            {nivelRequerido === 'circulo' ? '✨' : '🔒'}
          </div>

          <h3 className="acceso-titulo">{mensaje.titulo}</h3>
          <p className="acceso-descripcion">{mensaje.descripcion}</p>

          {/* Botón de acción */}
          {mensaje.ctaLink && (
            <a
              href={mensaje.ctaLink}
              className="acceso-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              {mensaje.cta}
            </a>
          )}

          {mensaje.ctaAction === 'activar-trial' && puedeUsarTrial && (
            <button
              className="acceso-btn trial"
              onClick={handleActivarTrial}
              disabled={activandoTrial}
            >
              {activandoTrial ? 'Activando...' : mensaje.cta}
            </button>
          )}

          {mensaje.ctaAction === 'activar-trial' && !puedeUsarTrial && !usuario?.esCirculo && (
            <a
              href="https://duendesdeluruguay.com/circulo"
              className="acceso-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unirse al Círculo
            </a>
          )}

          {/* Info adicional para trial */}
          {puedeUsarTrial && (
            <p className="acceso-trial-info">
              15 días gratis + 100 runas + 1 tirada gratis
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .acceso-restringido-wrapper {
          position: relative;
          min-height: 200px;
        }

        .acceso-contenido-blur {
          filter: blur(8px);
          opacity: 0.5;
          pointer-events: none;
          user-select: none;
        }

        .acceso-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 10, 15, 0.7);
          backdrop-filter: blur(4px);
          border-radius: 15px;
          z-index: 10;
        }

        .acceso-card {
          background: linear-gradient(135deg, rgba(26, 26, 40, 0.95), rgba(15, 15, 24, 0.95));
          border: 1px solid rgba(198, 169, 98, 0.3);
          border-radius: 20px;
          padding: 30px 40px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .acceso-icono {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .acceso-titulo {
          color: #C6A962;
          font-size: 20px;
          margin: 0 0 10px 0;
          font-family: Georgia, serif;
        }

        .acceso-descripcion {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .acceso-btn {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #C6A962, #a88a42);
          color: #000;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .acceso-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(198, 169, 98, 0.4);
        }

        .acceso-btn.trial {
          background: linear-gradient(135deg, #9370DB, #7B68EE);
          color: #fff;
        }

        .acceso-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .acceso-trial-info {
          color: rgba(198, 169, 98, 0.8);
          font-size: 12px;
          margin: 15px 0 0 0;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BADGE DE NIVEL DE ACCESO
// Muestra el nivel actual del usuario
// ═══════════════════════════════════════════════════════════════

export function BadgeNivelAcceso({ usuario, mostrarDetalle = true }) {
  const nivelAcceso = usuario?.nivelAcceso;

  if (!nivelAcceso) return null;

  const colores = {
    gratis: { bg: 'rgba(139, 154, 70, 0.2)', border: '#8B9A46', text: '#8B9A46' },
    compro: { bg: 'rgba(198, 169, 98, 0.2)', border: '#C6A962', text: '#C6A962' },
    circulo: { bg: 'rgba(147, 112, 219, 0.2)', border: '#9370DB', text: '#9370DB' }
  };

  const iconos = {
    gratis: '🌱',
    compro: '🛡️',
    circulo: '✨'
  };

  const color = colores[nivelAcceso.nivel] || colores.gratis;
  const icono = iconos[nivelAcceso.nivel] || '🌱';

  return (
    <div className="badge-nivel-acceso">
      <span className="badge-icono">{icono}</span>
      <span className="badge-nombre">{nivelAcceso.nombre}</span>

      {mostrarDetalle && nivelAcceso.esPrueba && (
        <span className="badge-prueba">Trial</span>
      )}

      <style jsx>{`
        .badge-nivel-acceso {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: ${color.bg};
          border: 1px solid ${color.border};
          border-radius: 20px;
          font-size: 13px;
        }

        .badge-icono {
          font-size: 14px;
        }

        .badge-nombre {
          color: ${color.text};
          font-weight: 500;
        }

        .badge-prueba {
          background: rgba(147, 112, 219, 0.3);
          color: #9370DB;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BANNER DE UPGRADE
// Sugiere al usuario subir de nivel
// ═══════════════════════════════════════════════════════════════

export function BannerUpgrade({ usuario, onActivarTrial }) {
  const [activandoTrial, setActivandoTrial] = useState(false);
  const nivelAcceso = usuario?.nivelAcceso;

  if (!nivelAcceso || nivelAcceso.nivel === 'circulo') return null;

  const handleActivarTrial = async () => {
    if (activandoTrial || usuario?.circuloPruebaUsada) return;

    setActivandoTrial(true);
    try {
      const res = await fetch('/api/mi-magia/circulo/prueba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email })
      });
      const data = await res.json();

      if (data.success) {
        if (onActivarTrial) onActivarTrial(data);
        window.location.reload();
      } else {
        alert(data.error || 'No se pudo activar la prueba');
      }
    } catch (e) {
      alert('Error de conexión');
    }
    setActivandoTrial(false);
  };

  // Banner para usuarios gratis
  if (nivelAcceso.nivel === 'gratis') {
    return (
      <div className="banner-upgrade gratis">
        <div className="banner-contenido">
          <span className="banner-icono">🌟</span>
          <div className="banner-texto">
            <h4>Desbloquea el portal completo</h4>
            <p>Adoptá tu primer guardián y accedé a todas las experiencias mágicas.</p>
          </div>
          <a
            href="https://duendesdeluruguay.com/tienda"
            className="banner-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver guardianes
          </a>
        </div>

        <style jsx>{`
          .banner-upgrade {
            background: linear-gradient(135deg, rgba(139, 154, 70, 0.15), rgba(139, 154, 70, 0.05));
            border: 1px solid rgba(139, 154, 70, 0.3);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 25px;
          }

          .banner-contenido {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
          }

          .banner-icono {
            font-size: 36px;
          }

          .banner-texto {
            flex: 1;
            min-width: 200px;
          }

          .banner-texto h4 {
            color: #C6A962;
            margin: 0 0 5px 0;
            font-size: 16px;
          }

          .banner-texto p {
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
            font-size: 13px;
          }

          .banner-btn {
            padding: 10px 25px;
            background: linear-gradient(135deg, #8B9A46, #6B7A36);
            color: #fff;
            text-decoration: none;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .banner-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(139, 154, 70, 0.3);
          }
        `}</style>
      </div>
    );
  }

  // Banner para usuarios que compraron (ofrecer Círculo)
  return (
    <div className="banner-upgrade compro">
      <div className="banner-contenido">
        <span className="banner-icono">✨</span>
        <div className="banner-texto">
          <h4>Únete al Círculo de Duendes</h4>
          <p>Acceso a contenido exclusivo, tiradas gratis, descuentos especiales y más.</p>
        </div>

        {!usuario?.circuloPruebaUsada ? (
          <button
            className="banner-btn trial"
            onClick={handleActivarTrial}
            disabled={activandoTrial}
          >
            {activandoTrial ? 'Activando...' : 'Probar 15 días gratis'}
          </button>
        ) : (
          <a
            href="https://duendesdeluruguay.com/circulo"
            className="banner-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver planes
          </a>
        )}
      </div>

      <style jsx>{`
        .banner-upgrade.compro {
          background: linear-gradient(135deg, rgba(147, 112, 219, 0.15), rgba(147, 112, 219, 0.05));
          border: 1px solid rgba(147, 112, 219, 0.3);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .banner-contenido {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .banner-icono {
          font-size: 36px;
        }

        .banner-texto {
          flex: 1;
          min-width: 200px;
        }

        .banner-texto h4 {
          color: #9370DB;
          margin: 0 0 5px 0;
          font-size: 16px;
        }

        .banner-texto p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 13px;
        }

        .banner-btn {
          padding: 10px 25px;
          background: linear-gradient(135deg, #9370DB, #7B68EE);
          color: #fff;
          text-decoration: none;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .banner-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(147, 112, 219, 0.3);
        }

        .banner-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
}

export default AccesoRestringido;
