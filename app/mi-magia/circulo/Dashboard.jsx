'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD DEL CÍRCULO DE DUENDES
// Vista principal después del portal de entrada
// ═══════════════════════════════════════════════════════════════════════════════

// URLs centralizadas - cambiar aquí cuando migre el dominio
const WORDPRESS_URL = 'https://duendesuy.10web.cloud'; // Cambiar a duendesdeluruguay.com cuando 10Web arregle SSL

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE: INDICADORES DE COMUNIDAD EN VIVO
// Muestra actividad simulada de la comunidad (social proof)
// ═══════════════════════════════════════════════════════════════════════════════

function ComunidadIndicadores() {
  const [stats, setStats] = useState(null);
  const [actividad, setActividad] = useState(null);
  const [mostrarCompra, setMostrarCompra] = useState(false);

  useEffect(() => {
    cargarStats();
    cargarActividad();

    // Actualizar actividad cada 30 segundos
    const interval = setInterval(() => {
      cargarActividad();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Mostrar notificación de compra cada 45-90 segundos
  useEffect(() => {
    const mostrarNotificacion = () => {
      setMostrarCompra(true);
      setTimeout(() => setMostrarCompra(false), 5000);
    };

    // Primera notificación después de 10 segundos
    const timeout = setTimeout(mostrarNotificacion, 10000);

    // Siguientes notificaciones cada 45-90 segundos
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% de probabilidad
        cargarActividad();
        mostrarNotificacion();
      }
    }, 45000 + Math.random() * 45000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  async function cargarStats() {
    try {
      const res = await fetch('/api/comunidad/bots?tipo=stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error cargando stats:', error);
    }
  }

  async function cargarActividad() {
    try {
      const res = await fetch('/api/comunidad/bots?tipo=actividad');
      const data = await res.json();
      if (data.success) {
        setActividad(data.actividad);
      }
    } catch (error) {
      console.error('Error cargando actividad:', error);
    }
  }

  if (!stats) return null;

  return (
    <>
      {/* Barra superior de stats */}
      <div className="comunidad-stats-bar">
        <div className="stat-item">
          <span className="stat-dot verde"></span>
          <span>{actividad?.viendoAhora || 12} personas viendo ahora</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">👥</span>
          <span>{stats.totalMiembros} guardianas en el Círculo</span>
        </div>
        {actividad?.escribiendo && (
          <div className="stat-item escribiendo">
            <span className="stat-icon">✍️</span>
            <span>{actividad.escribiendo} está escribiendo...</span>
          </div>
        )}
      </div>

      {/* Notificación de compra (toast) */}
      {mostrarCompra && actividad?.ultimaCompra && (
        <div className="toast-compra">
          <div className="toast-avatar">{actividad.ultimaCompra.pais}</div>
          <div className="toast-info">
            <strong>{actividad.ultimaCompra.nombre}</strong>
            <span>adoptó a {actividad.ultimaCompra.guardian}</span>
            <small>hace {actividad.ultimaCompra.hace}</small>
          </div>
        </div>
      )}

      <style jsx>{`
        .comunidad-stats-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          padding: 10px 20px;
          background: rgba(212, 175, 55, 0.05);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        .stat-dot.verde {
          background: #4ade80;
          box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .stat-icon {
          font-size: 14px;
        }

        .escribiendo {
          animation: fadeInOut 2s infinite;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Toast de compra */
        .toast-compra {
          position: fixed;
          bottom: 30px;
          left: 30px;
          background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 15px;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          animation: slideInUp 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
        }

        @keyframes slideInUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .toast-avatar {
          font-size: 24px;
        }

        .toast-info {
          display: flex;
          flex-direction: column;
        }

        .toast-info strong {
          color: #fff;
          font-size: 14px;
        }

        .toast-info span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
        }

        .toast-info small {
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          margin-top: 3px;
        }

        @media (max-width: 600px) {
          .comunidad-stats-bar {
            gap: 15px;
            font-size: 11px;
          }

          .toast-compra {
            left: 15px;
            right: 15px;
            bottom: 15px;
          }
        }
      `}</style>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOUR DEL CÍRCULO - Pasos
// ═══════════════════════════════════════════════════════════════════════════════

const PASOS_TOUR_CIRCULO = [
  {
    id: 'bienvenida',
    titulo: 'Bienvenido/a al Círculo',
    icono: '★',
    mensaje: 'Has entrado al santuario secreto de Duendes del Uruguay. Aquí la magia fluye cada día, guiada por la sabiduría ancestral de los guardianes.',
    tip: 'Este es tu espacio sagrado'
  },
  {
    id: 'duende-semana',
    titulo: 'El Guardián de la Semana',
    icono: '🧙',
    mensaje: 'Cada semana, un guardián diferente toma el liderazgo y guía nuestra comunidad. Todo el contenido de la semana viene desde su mirada y sabiduría única.',
    tip: 'Si ese guardián es adoptado... desaparece, pero su legado permanece'
  },
  {
    id: 'contenido-diario',
    titulo: 'Contenido Exclusivo',
    icono: '📜',
    mensaje: 'Cada semana recibís contenido nuevo: mensajes del guardián, enseñanzas profundas, rituales guiados, y mensajes de cierre. Todo personalizado según la energía de la temporada.',
    tip: 'Lunes: Presentación · Miércoles: Enseñanza · Viernes: Ritual · Domingo: Cierre'
  },
  {
    id: 'portales',
    titulo: 'Los 4 Portales del Año',
    icono: '◎',
    mensaje: 'Seguimos el calendario celta con 4 grandes celebraciones: Yule (invierno), Ostara (primavera), Litha (verano) y Mabon (otoño). Cada portal trae energías y prácticas únicas.',
    tip: 'Estás en el Portal actual - mirá el banner arriba'
  },
  {
    id: 'luna',
    titulo: 'Guía Lunar',
    icono: '☽',
    mensaje: 'Cada mes recibís la guía lunar completa: rituales, intenciones y prácticas alineadas con las fases de la luna. Nueva, creciente, llena, menguante... cada fase tiene su propósito.',
    tip: 'Sincronizá tus prácticas con la luna'
  },
  {
    id: 'comunidad',
    titulo: 'La Comunidad',
    icono: '❧',
    mensaje: 'Conectá con otros buscadores en nuestro foro privado. Compartí experiencias, hacé preguntas, sugerí temas. El Círculo es una familia.',
    tip: 'Encontrás el foro en la navegación'
  },
  {
    id: 'regalos',
    titulo: 'Tus Beneficios',
    icono: '🎁',
    mensaje: 'Como miembro del Círculo tenés: runas de regalo, descuentos exclusivos en guardianes (5-10%), acceso anticipado a novedades, y contenido que no está en ningún otro lado.',
    tip: 'Mirá tu balance de runas arriba'
  },
  {
    id: 'final',
    titulo: 'La magia te espera',
    icono: '✨',
    mensaje: 'Explorá el Círculo a tu ritmo. Cada día hay algo nuevo esperándote. Que los guardianes iluminen tu camino.',
    tip: 'Podés volver a ver este tour desde el menú'
  }
];

// Componente Tour del Círculo
function TourCirculo({ onFinish }) {
  const [paso, setPaso] = useState(0);
  const pasoActual = PASOS_TOUR_CIRCULO[paso];
  const esUltimo = paso === PASOS_TOUR_CIRCULO.length - 1;
  const esPrimero = paso === 0;

  return (
    <div className="tour-circulo-container">
      <div className="tour-circulo-card">
        <div className="tour-progress">
          {PASOS_TOUR_CIRCULO.map((_, i) => (
            <div key={i} className={`tour-dot ${i === paso ? 'activo' : ''} ${i < paso ? 'completado' : ''}`} />
          ))}
        </div>

        <div className="tour-content">
          <span className="tour-icono">{pasoActual.icono}</span>
          <h1>{pasoActual.titulo}</h1>
          <p className="tour-mensaje">{pasoActual.mensaje}</p>
          <div className="tour-tip">
            <span>💡</span>
            <span>{pasoActual.tip}</span>
          </div>
        </div>

        <div className="tour-nav">
          {!esPrimero && (
            <button className="tour-btn-sec" onClick={() => setPaso(paso - 1)}>
              ← Anterior
            </button>
          )}
          {esPrimero && (
            <button className="tour-btn-skip" onClick={onFinish}>
              Saltar tour
            </button>
          )}
          <button className="tour-btn-primary" onClick={() => esUltimo ? onFinish() : setPaso(paso + 1)}>
            {esUltimo ? '¡Comenzar! ✨' : 'Siguiente →'}
          </button>
        </div>

        <div className="tour-counter">
          {paso + 1} de {PASOS_TOUR_CIRCULO.length}
        </div>
      </div>

      <style jsx>{`
        .tour-circulo-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(5, 5, 8, 0.95);
          padding: 20px;
          font-family: 'Cormorant Garamond', serif;
        }

        .tour-circulo-card {
          background: linear-gradient(135deg, #111 0%, #0a0a0a 100%);
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 500px;
          width: 100%;
          text-align: center;
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(212, 175, 55, 0.1);
        }

        .tour-progress {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 2rem;
        }

        .tour-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #333;
          transition: all 0.3s;
        }

        .tour-dot.activo {
          background: #d4af37;
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }

        .tour-dot.completado {
          background: rgba(212, 175, 55, 0.5);
        }

        .tour-content {
          margin-bottom: 2rem;
        }

        .tour-icono {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.5));
        }

        .tour-circulo-card h1 {
          font-family: 'Tangerine', cursive;
          font-size: 2.5rem;
          color: #fff;
          margin: 0 0 1rem;
        }

        .tour-mensaje {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          line-height: 1.7;
          margin: 0;
        }

        .tour-tip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 1.5rem;
          padding: 12px 20px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 10px;
          font-size: 0.9rem;
          color: #d4af37;
        }

        .tour-nav {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 1rem;
        }

        .tour-btn-primary {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border: none;
          padding: 14px 30px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .tour-btn-sec {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
          padding: 14px 25px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-sec:hover {
          border-color: rgba(255, 255, 255, 0.4);
          color: #fff;
        }

        .tour-btn-skip {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
          cursor: pointer;
          padding: 10px;
        }

        .tour-btn-skip:hover {
          color: rgba(255, 255, 255, 0.7);
        }

        .tour-counter {
          color: rgba(255, 255, 255, 0.3);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

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
  const [mostrandoTour, setMostrandoTour] = useState(false);

  useEffect(() => {
    cargarDatos();
    // Verificar si es la primera vez (mostrar tour)
    const tourVisto = localStorage.getItem('tour_circulo_visto');
    if (!tourVisto) {
      setMostrandoTour(true);
    }
  }, []);

  function finalizarTour() {
    setMostrandoTour(false);
    localStorage.setItem('tour_circulo_visto', 'true');
  }

  function verTourDeNuevo() {
    setMostrandoTour(true);
  }

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

  // Mostrar tour si es necesario
  if (mostrandoTour) {
    return <TourCirculo onFinish={finalizarTour} />;
  }

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
      {/* Indicadores de comunidad en vivo */}
      <ComunidadIndicadores />

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
          <div className="nav-links-externos">
            <a href="/mi-magia" className="link-externo">Mi Magia</a>
            <a href={WORDPRESS_URL} target="_blank" rel="noopener" className="link-externo link-tienda">
              Tienda
            </a>
          </div>
          <button className="btn-tour-mini" onClick={verTourDeNuevo} title="Ver tour">
            ?
          </button>
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

        .nav-links-externos {
          display: flex;
          gap: 8px;
          margin-right: 10px;
        }

        .link-externo {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .link-externo:hover {
          color: #fff;
          border-color: rgba(212, 175, 55, 0.5);
          background: rgba(212, 175, 55, 0.1);
        }

        .link-externo.link-tienda {
          border-color: rgba(212, 175, 55, 0.3);
          color: rgba(212, 175, 55, 0.8);
        }

        .link-externo.link-tienda:hover {
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
          border-color: #d4af37;
        }

        .btn-tour-mini {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-tour-mini:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
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
  const [infoVisita, setInfoVisita] = useState(null);
  const [mensajeVisible, setMensajeVisible] = useState(true);

  useEffect(() => {
    cargarInfoVisita();
  }, [usuario]);

  // Registrar visita y determinar qué mensaje mostrar
  async function cargarInfoVisita() {
    try {
      const email = usuario?.email;
      const nombre = usuario?.nombre || usuario?.nombrePreferido || 'viajero';
      const genero = usuario?.genero || 'el';

      if (!email) {
        // Sin email, mostrar consejo por defecto
        cargarConsejoDelDia();
        return;
      }

      const params = new URLSearchParams({ email, nombre, genero });
      const res = await fetch(`/api/circulo/visitas?${params}`);
      const data = await res.json();

      if (data.success) {
        setInfoVisita(data);

        // Solo cargar consejo completo si es primera visita
        if (data.tipoMensaje === 'bienvenida_completa' || data.visitaNumero === 1) {
          cargarConsejoDelDia();
        } else {
          setCargandoConsejo(false);
        }

        // Auto-ocultar mensaje después de cierto tiempo según tipo
        if (data.mostrarMensaje && data.tipoMensaje !== 'bienvenida_completa') {
          const tiempoOcultar = data.tipoMensaje === 'segunda_visita' ? 4000 : 6000;
          setTimeout(() => setMensajeVisible(false), tiempoOcultar);
        }
      } else {
        cargarConsejoDelDia();
      }
    } catch (error) {
      console.error('Error cargando info visita:', error);
      cargarConsejoDelDia();
    }
  }

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

  // Personalizar texto según género
  const personalizarGenero = (texto) => {
    const genero = usuario?.genero;
    if (!genero || genero === 'el') return texto.replace(/Bienvenido\/a/g, 'Bienvenido').replace(/guardiana\/guardián/g, 'guardián');
    if (genero === 'ella') return texto.replace(/Bienvenido\/a/g, 'Bienvenida').replace(/guardiana\/guardián/g, 'guardiana');
    if (genero === 'neutro') return texto.replace(/Bienvenido\/a/g, 'Bienvenide').replace(/guardiana\/guardián/g, 'guardiane');
    return texto;
  };

  const nombreUsuario = usuario?.nombre || usuario?.nombrePreferido || 'viajero';
  const esPrimeraVisita = !infoVisita || infoVisita.visitaNumero === 1 || infoVisita.tipoMensaje === 'bienvenida_completa';

  return (
    <div className="seccion-inicio">
      {/* Mensaje de visita (2da, 3ra visita) - toast flotante */}
      {infoVisita?.mostrarMensaje && !esPrimeraVisita && mensajeVisible && (
        <div className={`mensaje-visita-toast ${infoVisita.tipoMensaje} ${!mensajeVisible ? 'oculto' : ''}`}>
          <div className="toast-contenido">
            <span className="toast-titulo">{infoVisita.mensaje?.titulo}</span>
            <span className="toast-texto">{infoVisita.mensaje?.texto}</span>
          </div>
          <button className="toast-cerrar" onClick={() => setMensajeVisible(false)}>×</button>
        </div>
      )}

      {/* Consejo del Día - Solo en primera visita */}
      {esPrimeraVisita && consejo && (
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
        <h2>{personalizarGenero(`Bienvenido/a al Círculo, ${nombreUsuario}`)}</h2>
        <p>Estamos en el {portalActual?.nombre} - {portalActual?.energia}</p>
        {infoVisita && infoVisita.visitaNumero > 1 && (
          <span className="visita-contador">Visita #{infoVisita.visitaNumero} de hoy</span>
        )}
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

        .visita-contador {
          display: inline-block;
          margin-top: 10px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.5);
          background: rgba(212, 175, 55, 0.05);
          padding: 4px 12px;
          border-radius: 12px;
        }

        /* Toast de visitas */
        .mensaje-visita-toast {
          position: fixed;
          top: 100px;
          right: 20px;
          background: linear-gradient(135deg, #1a1a25 0%, #252535 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 20px 45px 20px 25px;
          max-width: 350px;
          z-index: 1000;
          animation: slideInRight 0.4s ease, glow 2s ease infinite;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.1); }
          50% { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(212, 175, 55, 0.2); }
        }

        .mensaje-visita-toast.oculto {
          animation: slideOutRight 0.3s ease forwards;
        }

        @keyframes slideOutRight {
          to {
            opacity: 0;
            transform: translateX(100px);
          }
        }

        .mensaje-visita-toast.segunda_visita {
          border-color: rgba(100, 200, 255, 0.3);
        }

        .mensaje-visita-toast.tercera_visita {
          border-color: rgba(180, 100, 255, 0.3);
        }

        .toast-contenido {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .toast-titulo {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }

        .toast-texto {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }

        .toast-cerrar {
          position: absolute;
          top: 10px;
          right: 12px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
          line-height: 1;
          transition: color 0.2s;
        }

        .toast-cerrar:hover {
          color: rgba(255, 255, 255, 0.8);
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

const CATEGORIAS_FORO = {
  todas: { nombre: 'Todas', icono: '✨' },
  experiencia: { nombre: 'Experiencias', icono: '💫' },
  pregunta: { nombre: 'Preguntas', icono: '❓' },
  tip: { nombre: 'Tips', icono: '💡' },
  agradecimiento: { nombre: 'Agradecimientos', icono: '💜' },
  ritual: { nombre: 'Rituales', icono: '🕯️' },
  sincronicidad: { nombre: 'Sincronicidades', icono: '🔮' }
};

function SeccionForo({ usuario }) {
  const [posts, setPosts] = useState([]);
  const [postsComunidad, setPostsComunidad] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [cargando, setCargando] = useState(true);
  const [mostrarNuevoPost, setMostrarNuevoPost] = useState(false);
  const [postExpandido, setPostExpandido] = useState(null);

  useEffect(() => {
    cargarPosts();
    cargarPostsComunidad();
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
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error cargando posts:', error);
    } finally {
      setCargando(false);
    }
  }

  async function cargarPostsComunidad() {
    try {
      const res = await fetch('/api/comunidad/bots?limite=15');
      const data = await res.json();
      if (data.success) {
        // Filtrar por categoría si es necesario
        let postsFiltrados = data.posts || [];
        if (categoriaActiva !== 'todas') {
          postsFiltrados = postsFiltrados.filter(p => p.tipo === categoriaActiva);
        }
        setPostsComunidad(postsFiltrados);
      }
    } catch (error) {
      console.error('Error cargando posts comunidad:', error);
    }
  }

  // Combinar posts reales con posts de la comunidad simulada
  const todosLosPosts = [...posts, ...postsComunidad].sort((a, b) => {
    const fechaA = new Date(a.creado_en || a.fecha);
    const fechaB = new Date(b.creado_en || b.fecha);
    return fechaB - fechaA;
  });

  return (
    <div className="seccion-foro">
      <div className="foro-header">
        <div className="foro-titulo-wrap">
          <h2>Foro del Círculo</h2>
          <span className="foro-miembros">👥 324 guardianas participando</span>
        </div>
        <button className="btn-nuevo-post" onClick={() => setMostrarNuevoPost(true)}>
          + Nuevo Post
        </button>
      </div>

      {/* Filtros de categoría */}
      <div className="foro-categorias">
        {Object.entries(CATEGORIAS_FORO).map(([id, cat]) => (
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
        ) : todosLosPosts.length === 0 ? (
          <p className="sin-posts">Aún no hay posts en esta categoría. ¡Sé el primero!</p>
        ) : (
          todosLosPosts.map((post, idx) => (
            <div
              key={post.id || `post-${idx}`}
              className={`post-card ${postExpandido === (post.id || idx) ? 'expandido' : ''}`}
              onClick={() => setPostExpandido(postExpandido === (post.id || idx) ? null : (post.id || idx))}
            >
              <div className="post-header">
                <div className="post-autor-info">
                  <span className="autor-avatar">{post.autor?.avatar || '👤'}</span>
                  <div className="autor-detalles">
                    <span className="autor-nombre">{post.autor?.nombre || post.usuario_nombre || 'Anónima'}</span>
                    <span className="autor-nivel">{post.autor?.pais} {post.autor?.nivel === 'diamante' ? '💎' : post.autor?.nivel === 'oro' ? '🥇' : post.autor?.nivel === 'plata' ? '🥈' : '🥉'}</span>
                  </div>
                </div>
                <div className="post-meta">
                  <span className="post-categoria">{CATEGORIAS_FORO[post.tipo]?.icono || '✨'} {CATEGORIAS_FORO[post.tipo]?.nombre || 'General'}</span>
                  <span className="post-fecha">{post.hace || new Date(post.creado_en).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="post-contenido">{post.contenido || post.titulo}</p>

              {post.guardian && (
                <span className="post-guardian-tag">🧙 Sobre {post.guardian}</span>
              )}

              <div className="post-footer">
                <div className="post-stats">
                  <span className="stat-item">❤️ {post.likes || post.total_likes || 0}</span>
                  <span className="stat-item">💬 {post.respuestas || post.total_comentarios || 0}</span>
                </div>
                <button className="btn-responder">Responder</button>
              </div>

              {/* Respuestas preview */}
              {postExpandido === (post.id || idx) && post.respuestasPreview?.length > 0 && (
                <div className="respuestas-preview">
                  {post.respuestasPreview.map((resp, i) => (
                    <div key={i} className="respuesta-item">
                      <span className="respuesta-avatar">{resp.autor?.avatar || '👤'}</span>
                      <div className="respuesta-contenido">
                        <strong>{resp.autor?.nombre}</strong>
                        <p>{resp.contenido}</p>
                        <small>{resp.hace}</small>
                      </div>
                    </div>
                  ))}
                  <button className="btn-ver-todas">Ver todas las respuestas</button>
                </div>
              )}
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
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .foro-titulo-wrap h2 {
          font-family: 'Tangerine', cursive;
          font-size: 48px;
          color: #ffffff;
          margin: 0 0 5px;
        }

        .foro-miembros {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
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

        .post-card.expandido {
          background: rgba(212, 175, 55, 0.05);
          border-color: rgba(212, 175, 55, 0.4);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .post-autor-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .autor-avatar {
          font-size: 28px;
        }

        .autor-detalles {
          display: flex;
          flex-direction: column;
        }

        .autor-nombre {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .autor-nivel {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .post-meta {
          text-align: right;
        }

        .post-categoria {
          display: block;
          font-size: 12px;
          color: rgba(212, 175, 55, 0.8);
          margin-bottom: 4px;
        }

        .post-fecha {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }

        .post-contenido {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.7;
          margin-bottom: 15px;
        }

        .post-guardian-tag {
          display: inline-block;
          background: rgba(107, 33, 168, 0.2);
          border: 1px solid rgba(107, 33, 168, 0.4);
          color: #b794f6;
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 15px;
          margin-bottom: 15px;
        }

        .post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .post-stats {
          display: flex;
          gap: 15px;
        }

        .stat-item {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .btn-responder {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          padding: 8px 15px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-responder:hover {
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Respuestas */
        .respuestas-preview {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .respuesta-item {
          display: flex;
          gap: 12px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .respuesta-avatar {
          font-size: 20px;
          flex-shrink: 0;
        }

        .respuesta-contenido {
          flex: 1;
        }

        .respuesta-contenido strong {
          display: block;
          font-size: 13px;
          color: #fff;
          margin-bottom: 5px;
        }

        .respuesta-contenido p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 5px;
          line-height: 1.5;
        }

        .respuesta-contenido small {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }

        .btn-ver-todas {
          width: 100%;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          font-size: 13px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-ver-todas:hover {
          background: rgba(212, 175, 55, 0.2);
        }

        @media (max-width: 600px) {
          .foro-header {
            flex-direction: column;
            gap: 20px;
          }

          .post-header {
            flex-direction: column;
            gap: 15px;
          }

          .post-meta {
            text-align: left;
          }
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
