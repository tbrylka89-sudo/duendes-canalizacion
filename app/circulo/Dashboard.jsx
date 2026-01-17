'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD DEL CÍRCULO DE DUENDES
// Vista principal después del portal de entrada
// ═══════════════════════════════════════════════════════════════════════════════

// Configuración de portales/temporadas
const PORTALES = {
  yule: {
    nombre: 'Portal de Yule',
    meses: [5, 6, 7], // junio-agosto
    colores: { primario: '#4a90d9', secundario: '#1a3a5c', acento: '#c0d8f0' },
    icono: '❄️',
    descripcion: 'Introspección y renacimiento'
  },
  ostara: {
    nombre: 'Portal de Ostara',
    meses: [8, 9, 10], // septiembre-noviembre
    colores: { primario: '#4a9d4a', secundario: '#1a3c1a', acento: '#90ee90' },
    icono: '🌱',
    descripcion: 'Nuevos comienzos'
  },
  litha: {
    nombre: 'Portal de Litha',
    meses: [11, 0, 1], // diciembre-febrero
    colores: { primario: '#d4af37', secundario: '#5c4a1a', acento: '#ffd700' },
    icono: '☀️',
    descripcion: 'Abundancia plena'
  },
  mabon: {
    nombre: 'Portal de Mabon',
    meses: [2, 3, 4], // marzo-mayo
    colores: { primario: '#d2691e', secundario: '#4a2a0a', acento: '#deb887' },
    icono: '🍂',
    descripcion: 'Gratitud y cosecha'
  }
};

// Colores según elemento del duende
const COLORES_ELEMENTO = {
  fuego: { primario: '#ff6b35', secundario: '#8b2500', glow: 'rgba(255, 107, 53, 0.4)' },
  agua: { primario: '#4a90d9', secundario: '#1a3a5c', glow: 'rgba(74, 144, 217, 0.4)' },
  tierra: { primario: '#8b7355', secundario: '#3d2914', glow: 'rgba(139, 115, 85, 0.4)' },
  aire: { primario: '#b8a9c9', secundario: '#4a3a5c', glow: 'rgba(184, 169, 201, 0.4)' },
  espiritu: { primario: '#d4af37', secundario: '#5c4a1a', glow: 'rgba(212, 175, 55, 0.4)' }
};

function obtenerPortalActual() {
  const mes = new Date().getMonth();
  for (const [id, portal] of Object.entries(PORTALES)) {
    if (portal.meses.includes(mes)) {
      return { id, ...portal };
    }
  }
  return { id: 'litha', ...PORTALES.litha };
}

export default function CirculoDashboard({ usuario }) {
  const [seccion, setSeccion] = useState('inicio');
  const [contenidoSemana, setContenidoSemana] = useState(null);
  const [guardianSemana, setGuardianSemana] = useState(null);
  const [portalActual, setPortalActual] = useState(obtenerPortalActual());
  const [cargando, setCargando] = useState(true);
  const [coloresDuende, setColoresDuende] = useState(COLORES_ELEMENTO.espiritu);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      // Cargar duende del día (que también tiene info del portal)
      const resDuende = await fetch('/api/circulo/duende-del-dia');
      const dataDuende = await resDuende.json();
      if (dataDuende.success) {
        setGuardianSemana(dataDuende.guardian);
        // Actualizar colores según elemento del duende
        const elemento = dataDuende.guardian?.elemento?.toLowerCase() || 'espiritu';
        setColoresDuende(COLORES_ELEMENTO[elemento] || COLORES_ELEMENTO.espiritu);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  }

  // Semana del año para animaciones
  const semanaAno = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));

  return (
    <div
      className="circulo-dashboard"
      style={{
        '--portal-primario': portalActual.colores.primario,
        '--portal-secundario': portalActual.colores.secundario,
        '--portal-acento': portalActual.colores.acento,
        '--duende-primario': coloresDuende.primario,
        '--duende-secundario': coloresDuende.secundario,
        '--duende-glow': coloresDuende.glow
      }}
    >
      {/* Banner de Temporada */}
      <div className={`banner-temporada banner-${portalActual.id}`}>
        <div className="banner-particulas"></div>
        <div className="banner-contenido">
          <span className="banner-icono">{portalActual.icono}</span>
          <div className="banner-texto">
            <span className="banner-nombre">{portalActual.nombre}</span>
            <span className="banner-desc">{portalActual.descripcion}</span>
          </div>
        </div>
        <div className={`banner-animacion animacion-semana-${semanaAno % 4}`}></div>
      </div>

      {/* Header con navegación */}
      <header className="circulo-header">
        <div className="header-left">
          <h1 className="circulo-logo">El Círculo</h1>
          {portalActual && (
            <span className="portal-badge">{portalActual.nombre}</span>
          )}
        </div>
        <nav className="circulo-nav">
          <button
            onClick={() => setSeccion('inicio')}
            className={`nav-btn ${seccion === 'inicio' ? 'active' : ''}`}
          >
            Inicio
          </button>
          <button
            onClick={() => setSeccion('contenido')}
            className={`nav-btn ${seccion === 'contenido' ? 'active' : ''}`}
          >
            Contenido
          </button>
          <button
            onClick={() => setSeccion('foro')}
            className={`nav-btn ${seccion === 'foro' ? 'active' : ''}`}
          >
            Foro
          </button>
          <button
            onClick={() => setSeccion('archivo')}
            className={`nav-btn ${seccion === 'archivo' ? 'active' : ''}`}
          >
            Archivo
          </button>
        </nav>
        <div className="header-right">
          <span className="user-name">{usuario?.nombre || 'Viajero'}</span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="circulo-main">
        {seccion === 'inicio' && (
          <SeccionInicio
            guardianSemana={guardianSemana}
            portalActual={portalActual}
            usuario={usuario}
            onCambiarSeccion={setSeccion}
          />
        )}
        {seccion === 'contenido' && <SeccionContenido />}
        {seccion === 'foro' && <SeccionForo usuario={usuario} />}
        {seccion === 'archivo' && <SeccionArchivo />}
      </main>

      <style jsx>{`
        .circulo-dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, var(--portal-secundario, #0a0a0a) 0%, #0d0810 50%, #0a0a0a 100%);
          color: #ffffff;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        /* Banner de Temporada */
        .banner-temporada {
          position: relative;
          height: 80px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-yule {
          background: linear-gradient(135deg, #1a3a5c 0%, #0a1520 50%, #1a3a5c 100%);
        }
        .banner-ostara {
          background: linear-gradient(135deg, #1a3c1a 0%, #0a1510 50%, #1a3c1a 100%);
        }
        .banner-litha {
          background: linear-gradient(135deg, #5c4a1a 0%, #201508 50%, #5c4a1a 100%);
        }
        .banner-mabon {
          background: linear-gradient(135deg, #4a2a0a 0%, #1a0a00 50%, #4a2a0a 100%);
        }

        .banner-particulas {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, var(--portal-acento) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.3;
          animation: particulasFloat 20s linear infinite;
        }

        @keyframes particulasFloat {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }

        .banner-contenido {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .banner-icono {
          font-size: 32px;
          animation: iconoPulse 3s ease-in-out infinite;
        }

        @keyframes iconoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .banner-texto {
          display: flex;
          flex-direction: column;
        }

        .banner-nombre {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--portal-acento);
        }

        .banner-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        .banner-animacion {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Animaciones semanales rotativas */
        .animacion-semana-0 .banner-animacion::before,
        .banner-temporada:has(.animacion-semana-0)::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          animation: shimmer 3s infinite;
        }

        .animacion-semana-1 .banner-animacion::before,
        .banner-temporada:has(.animacion-semana-1)::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, var(--portal-acento) 0%, transparent 30%);
          opacity: 0.2;
          animation: orbMove 8s ease-in-out infinite;
        }

        .animacion-semana-2 .banner-animacion::before,
        .banner-temporada:has(.animacion-semana-2)::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 40%, var(--portal-acento) 50%, transparent 60%);
          opacity: 0.1;
          animation: diagonalMove 5s linear infinite;
        }

        .animacion-semana-3 .banner-animacion::before,
        .banner-temporada:has(.animacion-semana-3)::before {
          content: '';
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--portal-acento);
          opacity: 0.1;
          filter: blur(30px);
          animation: floatAround 10s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes orbMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(100%); }
        }

        @keyframes diagonalMove {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }

        @keyframes floatAround {
          0%, 100% { top: 20%; left: 10%; }
          25% { top: 60%; left: 80%; }
          50% { top: 10%; left: 90%; }
          75% { top: 70%; left: 20%; }
        }

        /* Header */
        .circulo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          background: rgba(0, 0, 0, 0.5);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .circulo-logo {
          font-family: 'Tangerine', cursive;
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .portal-badge {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          padding: 6px 15px;
          border-radius: 20px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .circulo-nav {
          display: flex;
          gap: 10px;
        }

        .nav-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 12px 25px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          border-color: rgba(212, 175, 55, 0.5);
          color: rgba(255, 255, 255, 0.9);
        }

        .nav-btn.active {
          background: rgba(212, 175, 55, 0.15);
          border-color: #d4af37;
          color: #d4af37;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-name {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Main */
        .circulo-main {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .circulo-header {
            flex-direction: column;
            gap: 20px;
            padding: 20px;
          }

          .circulo-nav {
            flex-wrap: wrap;
            justify-content: center;
          }

          .nav-btn {
            padding: 10px 18px;
            font-size: 11px;
          }

          .circulo-main {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN INICIO
// ═══════════════════════════════════════════════════════════════════════════════

function SeccionInicio({ guardianSemana, portalActual, usuario, onCambiarSeccion }) {
  const [consejo, setConsejo] = useState(null);
  const [cargandoConsejo, setCargandoConsejo] = useState(true);

  useEffect(() => {
    cargarConsejoDelDia();
  }, [usuario]);

  async function cargarConsejoDelDia() {
    setCargandoConsejo(true);
    try {
      const nombre = usuario?.nombre || usuario?.nombrePreferido || 'viajero';
      const email = usuario?.email || '';
      const params = new URLSearchParams({
        nombre,
        ...(email && { email })
      });
      const res = await fetch(`/api/circulo/consejo-del-dia?${params}`);
      const data = await res.json();
      if (data.success) {
        setConsejo(data);
      }
    } catch (error) {
      console.error('Error cargando consejo:', error);
    } finally {
      setCargandoConsejo(false);
    }
  }

  async function regenerarConsejo() {
    setCargandoConsejo(true);
    try {
      const nombre = usuario?.nombre || usuario?.nombrePreferido || 'viajero';
      const email = usuario?.email || '';
      const params = new URLSearchParams({
        nombre,
        ...(email && { email }),
        t: Date.now().toString()
      });
      const res = await fetch(`/api/circulo/consejo-del-dia?${params}`);
      const data = await res.json();
      if (data.success) {
        setConsejo(data);
      }
    } catch (error) {
      console.error('Error regenerando consejo:', error);
    } finally {
      setCargandoConsejo(false);
    }
  }

  return (
    <div className="seccion-inicio">
      {/* Consejo del Día - Mensaje único cada visita */}
      {consejo && (
        <div className="consejo-del-dia-card">
          <div className="consejo-header">
            <div className="consejo-guardian-mini">
              <img src={consejo.guardian?.imagen} alt={consejo.guardian?.nombre} />
            </div>
            <div className="consejo-titulo-wrap">
              <span className="consejo-etiqueta">Mensaje para vos</span>
              <h3 className="consejo-titulo">{consejo.consejo?.titulo}</h3>
            </div>
            <button className="btn-regenerar" onClick={regenerarConsejo} disabled={cargandoConsejo}>
              {cargandoConsejo ? '...' : '↻'}
            </button>
          </div>
          <div className="consejo-contenido">
            {cargandoConsejo ? (
              <p className="cargando-consejo">Generando mensaje...</p>
            ) : (
              <>
                <p className="consejo-mensaje">{consejo.consejo?.mensaje}</p>
                <p className="consejo-reflexion">"{consejo.consejo?.reflexion}"</p>
              </>
            )}
          </div>
          <div className="consejo-footer">
            <span>Semana {consejo.semana} • {consejo.diasRestantes} días más con {consejo.guardian?.nombre}</span>
          </div>
        </div>
      )}

      {/* Bienvenida */}
      <div className="bienvenida">
        <h2>Bienvenido al Círculo, {usuario?.nombre || 'viajero'}</h2>
        <p>Estamos en el {portalActual?.nombre} - {portalActual?.energia}</p>
      </div>

      {/* Guardián de la semana */}
      {(guardianSemana || consejo?.guardian) && (
        <div className="guardian-semana-card">
          <div className="guardian-semana-header">
            <span className="etiqueta">Guardián de la Semana</span>
          </div>
          <div className="guardian-semana-content">
            <div className="guardian-imagen-wrap">
              <img src={consejo?.guardian?.imagen || guardianSemana?.imagen} alt={consejo?.guardian?.nombre || guardianSemana?.nombre} />
            </div>
            <div className="guardian-info">
              <span className="guardian-categoria">{consejo?.guardian?.tipo_ser_nombre || guardianSemana?.tipo_ser_nombre} de {consejo?.guardian?.categoria || guardianSemana?.categoria}</span>
              <h3 className="guardian-nombre">{consejo?.guardian?.nombre || guardianSemana?.nombre}</h3>
              <p className="guardian-arquetipo">{consejo?.guardian?.arquetipo || guardianSemana?.arquetipo}</p>
              <a href={consejo?.guardian?.url_tienda || guardianSemana?.url_tienda} target="_blank" className="ver-en-tienda">
                Ver en la tienda →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Grid de accesos rápidos */}
      <div className="accesos-grid">
        <div className="acceso-card" onClick={() => onCambiarSeccion('contenido')}>
          <span className="acceso-icono">📜</span>
          <h4>Contenido de Hoy</h4>
          <p>La enseñanza del día te espera</p>
        </div>
        <div className="acceso-card" onClick={() => onCambiarSeccion('contenido')}>
          <span className="acceso-icono">🕯️</span>
          <h4>Ritual de la Semana</h4>
          <p>Práctica guiada por el guardián</p>
        </div>
        <div className="acceso-card" onClick={() => onCambiarSeccion('foro')}>
          <span className="acceso-icono">💬</span>
          <h4>Foro del Círculo</h4>
          <p>Conectá con la comunidad</p>
        </div>
        <div className="acceso-card" onClick={() => onCambiarSeccion('archivo')}>
          <span className="acceso-icono">📚</span>
          <h4>Archivo</h4>
          <p>Contenido de semanas anteriores</p>
        </div>
      </div>

      <style jsx>{`
        .seccion-inicio {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bienvenida {
          text-align: center;
          margin-bottom: 50px;
        }

        .bienvenida h2 {
          font-family: 'Tangerine', cursive;
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .bienvenida p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        /* Guardián de la semana */
        .guardian-semana-card {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(107, 33, 168, 0.1));
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 30px;
          overflow: hidden;
          margin-bottom: 50px;
        }

        .guardian-semana-header {
          background: rgba(212, 175, 55, 0.1);
          padding: 15px 30px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .etiqueta {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #d4af37;
        }

        .guardian-semana-content {
          display: flex;
          align-items: center;
          gap: 40px;
          padding: 40px;
        }

        .guardian-imagen-wrap {
          flex-shrink: 0;
        }

        .guardian-imagen-wrap img {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
        }

        .guardian-info {
          flex: 1;
        }

        .guardian-categoria {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.8);
        }

        .guardian-nombre {
          font-family: 'Tangerine', cursive;
          font-size: 60px;
          font-weight: 700;
          color: #ffffff;
          margin: 10px 0;
        }

        .guardian-arquetipo {
          font-size: 18px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 20px;
        }

        .ver-en-tienda {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 2px;
          color: #d4af37;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .ver-en-tienda:hover {
          color: #e8d5a3;
        }

        /* Grid de accesos */
        .accesos-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }

        .acceso-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px 25px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .acceso-card:hover {
          background: rgba(212, 175, 55, 0.08);
          border-color: rgba(212, 175, 55, 0.4);
          transform: translateY(-5px);
        }

        .acceso-icono {
          font-size: 36px;
          display: block;
          margin-bottom: 15px;
        }

        .acceso-card h4 {
          font-family: 'Cinzel', serif;
          font-size: 15px;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .acceso-card p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 900px) {
          .guardian-semana-content {
            flex-direction: column;
            text-align: center;
            padding: 30px;
          }

          .guardian-nombre {
            font-size: 45px;
          }

          .accesos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .accesos-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Consejo del Día */
        .consejo-del-dia-card {
          background: linear-gradient(135deg, rgba(139, 90, 43, 0.15), rgba(212, 175, 55, 0.1));
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 25px;
          padding: 0;
          margin-bottom: 40px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .consejo-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px 25px;
          background: rgba(212, 175, 55, 0.1);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .consejo-guardian-mini {
          flex-shrink: 0;
        }

        .consejo-guardian-mini img {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(212, 175, 55, 0.5);
        }

        .consejo-titulo-wrap {
          flex: 1;
        }

        .consejo-etiqueta {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.8);
          display: block;
          margin-bottom: 4px;
        }

        .consejo-titulo {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #ffffff;
          margin: 0;
          font-weight: 500;
        }

        .btn-regenerar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #d4af37;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-regenerar:hover:not(:disabled) {
          background: rgba(212, 175, 55, 0.3);
          transform: rotate(180deg);
        }

        .btn-regenerar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .consejo-contenido {
          padding: 25px 30px !important;
        }

        .consejo-mensaje {
          font-size: 18px !important;
          line-height: 1.7 !important;
          color: #ffffff !important;
          margin-bottom: 20px !important;
        }

        .consejo-reflexion {
          font-size: 16px !important;
          font-style: italic !important;
          color: #d4af37 !important;
          padding-left: 20px !important;
          border-left: 2px solid rgba(212, 175, 55, 0.4) !important;
          margin: 0 !important;
        }

        .consejo-footer {
          padding: 15px 30px !important;
          background: rgba(0, 0, 0, 0.2) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
          font-size: 12px !important;
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .cargando-consejo {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
          padding: 20px 0;
        }

        @media (max-width: 600px) {
          .consejo-header {
            padding: 15px 20px;
          }

          .consejo-guardian-mini img {
            width: 45px;
            height: 45px;
          }

          .consejo-titulo {
            font-size: 14px;
          }

          .consejo-contenido {
            padding: 20px;
          }

          .consejo-mensaje {
            font-size: 16px;
          }

          .consejo-reflexion {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN CONTENIDO
// ═══════════════════════════════════════════════════════════════════════════════

function SeccionContenido() {
  return (
    <div className="seccion-contenido">
      <h2>Contenido de la Semana</h2>
      <p className="placeholder">El contenido de esta semana aparecerá aquí...</p>

      <style jsx>{`
        .seccion-contenido {
          text-align: center;
          padding: 60px 20px;
        }

        h2 {
          font-family: 'Tangerine', cursive;
          font-size: 48px;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN FORO
// ═══════════════════════════════════════════════════════════════════════════════

function SeccionForo({ usuario }) {
  const [posts, setPosts] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [cargando, setCargando] = useState(true);
  const [mostrarNuevoPost, setMostrarNuevoPost] = useState(false);

  useEffect(() => {
    cargarPosts();
  }, [categoriaActiva]);

  async function cargarPosts() {
    setCargando(true);
    try {
      const url = categoriaActiva === 'todas'
        ? '/api/circulo/foro'
        : `/api/circulo/foro?categoria=${categoriaActiva}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
        setCategorias(data.categorias);
      }
    } catch (error) {
      console.error('Error cargando posts:', error);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="seccion-foro">
      <div className="foro-header">
        <h2>Foro del Círculo</h2>
        <button className="btn-nuevo-post" onClick={() => setMostrarNuevoPost(true)}>
          + Nuevo Post
        </button>
      </div>

      {/* Filtros de categoría */}
      <div className="foro-categorias">
        <button
          className={`cat-btn ${categoriaActiva === 'todas' ? 'active' : ''}`}
          onClick={() => setCategoriaActiva('todas')}
        >
          Todas
        </button>
        {Object.entries(categorias).map(([id, cat]) => (
          <button
            key={id}
            className={`cat-btn ${categoriaActiva === id ? 'active' : ''}`}
            onClick={() => setCategoriaActiva(id)}
          >
            {cat.icono} {cat.nombre}
          </button>
        ))}
      </div>

      {/* Lista de posts */}
      <div className="posts-lista">
        {cargando ? (
          <p className="cargando">Cargando...</p>
        ) : posts.length === 0 ? (
          <p className="sin-posts">Aún no hay posts en esta categoría. ¡Sé el primero!</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-categoria">{post.categoria_info?.icono} {post.categoria_info?.nombre}</span>
                <span className="post-fecha">{new Date(post.creado_en).toLocaleDateString()}</span>
              </div>
              <h3 className="post-titulo">{post.titulo}</h3>
              <p className="post-preview">{post.contenido.substring(0, 150)}...</p>
              <div className="post-footer">
                <span className="post-autor">Por {post.usuario_nombre}</span>
                <div className="post-stats">
                  <span>❤️ {post.total_likes}</span>
                  <span>💬 {post.total_comentarios}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .seccion-foro {
          animation: fadeIn 0.5s ease;
        }

        .foro-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .foro-header h2 {
          font-family: 'Tangerine', cursive;
          font-size: 48px;
          color: #ffffff;
          margin: 0;
        }

        .btn-nuevo-post {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          padding: 15px 30px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-nuevo-post:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        /* Categorías */
        .foro-categorias {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .cat-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          padding: 10px 18px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cat-btn:hover {
          border-color: rgba(212, 175, 55, 0.5);
          color: #ffffff;
        }

        .cat-btn.active {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Posts */
        .posts-lista {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cargando, .sin-posts {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          padding: 60px;
          font-style: italic;
        }

        .post-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 25px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .post-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .post-categoria {
          font-size: 12px;
          color: rgba(212, 175, 55, 0.8);
        }

        .post-fecha {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        .post-titulo {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .post-preview {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .post-autor {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .post-stats {
          display: flex;
          gap: 15px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN ARCHIVO
// ═══════════════════════════════════════════════════════════════════════════════

function SeccionArchivo() {
  return (
    <div className="seccion-archivo">
      <h2>Archivo del Círculo</h2>
      <p className="placeholder">Aquí encontrarás todo el contenido de semanas anteriores...</p>

      <style jsx>{`
        .seccion-archivo {
          text-align: center;
          padding: 60px 20px;
        }

        h2 {
          font-family: 'Tangerine', cursive;
          font-size: 48px;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
