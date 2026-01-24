'use client';
import { useState, useEffect } from 'react';
import { obtenerGuardianPorFecha, obtenerSemanaActual, GUARDIANES_MAESTROS } from '@/lib/circulo/duendes-semanales-2026';

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD DEL CÍRCULO DE DUENDES
// Vista principal después del portal de entrada
// ═══════════════════════════════════════════════════════════════════════════════

// URLs centralizadas - cambiar aquí cuando migre el dominio
const WORDPRESS_URL = 'https://duendesdeluruguay.com';

// Helper para renderizar valores de forma segura (evita React error #31)
// Convierte objetos a string para prevenir "Objects are not valid as React child"
function safeRender(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 'sí' : 'no';
  if (Array.isArray(value)) return value.map(v => safeRender(v)).join(', ');
  if (typeof value === 'object') {
    // Si es un objeto, intentar extraer campos comunes o convertir a string
    if (value.nombre) return value.nombre;
    if (value.texto) return value.texto;
    if (value.titulo) return value.titulo;
    if (value.mensaje) return value.mensaje;
    try {
      return JSON.stringify(value);
    } catch {
      return '[objeto]';
    }
  }
  return String(value);
}

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
          <span>{safeRender(actividad?.viendoAhora) || 12} personas viendo ahora</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">👥</span>
          <span>{safeRender(stats.totalMiembros)} guardianas en el Círculo</span>
        </div>
        {actividad?.escribiendo && (
          <div className="stat-item escribiendo">
            <span className="stat-icon">✍️</span>
            <span>{safeRender(actividad.escribiendo)} está escribiendo...</span>
          </div>
        )}
      </div>

      {/* Notificación de compra (toast) */}
      {mostrarCompra && actividad?.ultimaCompra && (
        <div className="toast-compra">
          <div className="toast-avatar">{safeRender(actividad.ultimaCompra.pais)}</div>
          <div className="toast-info">
            <strong>{safeRender(actividad.ultimaCompra.nombre)}</strong>
            <span>adoptó a {safeRender(actividad.ultimaCompra.guardian)}</span>
            <small>hace {safeRender(actividad.ultimaCompra.hace)}</small>
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
          background: rgba(0, 240, 255, 0.03);
          border-bottom: 1px solid rgba(0, 240, 255, 0.1);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
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
          background: var(--neon-green, #39ff14);
          box-shadow: 0 0 12px rgba(57, 255, 20, 0.6);
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(57, 255, 20, 0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 20px rgba(57, 255, 20, 0.8); }
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

        /* Toast de compra - NEÓN */
        .toast-compra {
          position: fixed;
          bottom: 30px;
          left: 30px;
          background: linear-gradient(135deg, #0a0a15, #101020);
          border: 1px solid var(--neon-orange, #ff6b00);
          border-radius: 15px;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 107, 0, 0.2);
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
          color: var(--neon-orange, #ff6b00);
          font-size: 13px;
        }

        .toast-info small {
          color: rgba(255, 255, 255, 0.5);
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
          background: rgba(5, 5, 8, 0.97);
          padding: 20px;
          font-family: 'Cormorant Garamond', serif;
        }

        .tour-circulo-card {
          background: linear-gradient(135deg, #0a0a15 0%, #050510 100%);
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 500px;
          width: 100%;
          text-align: center;
          border: 1px solid rgba(0, 240, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 60px rgba(0, 240, 255, 0.1);
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
          background: #222;
          transition: all 0.3s;
        }

        .tour-dot.activo {
          background: var(--neon-magenta, #ff00ff);
          transform: scale(1.3);
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.6);
        }

        .tour-dot.completado {
          background: var(--neon-blue, #00f0ff);
          box-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
        }

        .tour-content {
          margin-bottom: 2rem;
        }

        .tour-icono {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 25px rgba(255, 0, 255, 0.5));
        }

        .tour-circulo-card h1 {
          font-family: 'Tangerine', cursive;
          font-size: 2.5rem;
          background: linear-gradient(135deg, #fff, var(--neon-blue, #00f0ff));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 1rem;
        }

        .tour-mensaje {
          color: rgba(255, 255, 255, 0.9);
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
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.2);
          border-radius: 10px;
          font-size: 0.9rem;
          color: var(--neon-green, #39ff14);
        }

        .tour-nav {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 1rem;
        }

        .tour-btn-primary {
          background: linear-gradient(135deg, var(--neon-magenta, #ff00ff), #cc00cc);
          color: #fff;
          border: none;
          padding: 14px 30px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
        }

        .tour-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 35px rgba(255, 0, 255, 0.5);
        }

        .tour-btn-sec {
          background: transparent;
          border: 1px solid rgba(0, 240, 255, 0.4);
          color: var(--neon-blue, #00f0ff);
          padding: 14px 25px;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-sec:hover {
          border-color: var(--neon-blue, #00f0ff);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
        }

        .tour-btn-skip {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          cursor: pointer;
          padding: 10px;
        }

        .tour-btn-skip:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .tour-counter {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

// Configuración de portales/temporadas por hemisferio
const PORTALES_SUR = {
  yule: {
    nombre: 'Portal de Yule',
    meses: [5, 6, 7], // junio-agosto (invierno sur)
    colores: { primario: '#4a90d9', secundario: '#1a3a5c', acento: '#c0d8f0' },
    icono: '❄️',
    descripcion: 'Introspección y renacimiento'
  },
  ostara: {
    nombre: 'Portal de Ostara',
    meses: [8, 9, 10], // septiembre-noviembre (primavera sur)
    colores: { primario: '#4a9d4a', secundario: '#1a3c1a', acento: '#90ee90' },
    icono: '🌱',
    descripcion: 'Nuevos comienzos'
  },
  litha: {
    nombre: 'Portal de Litha',
    meses: [11, 0, 1], // diciembre-febrero (verano sur)
    colores: { primario: '#d4af37', secundario: '#5c4a1a', acento: '#ffd700' },
    icono: '☀️',
    descripcion: 'Abundancia plena'
  },
  mabon: {
    nombre: 'Portal de Mabon',
    meses: [2, 3, 4], // marzo-mayo (otoño sur)
    colores: { primario: '#d2691e', secundario: '#4a2a0a', acento: '#deb887' },
    icono: '🍂',
    descripcion: 'Gratitud y cosecha'
  }
};

const PORTALES_NORTE = {
  yule: {
    nombre: 'Portal de Yule',
    meses: [11, 0, 1], // diciembre-febrero (invierno norte)
    colores: { primario: '#4a90d9', secundario: '#1a3a5c', acento: '#c0d8f0' },
    icono: '❄️',
    descripcion: 'Introspección y renacimiento'
  },
  ostara: {
    nombre: 'Portal de Ostara',
    meses: [2, 3, 4], // marzo-mayo (primavera norte)
    colores: { primario: '#4a9d4a', secundario: '#1a3c1a', acento: '#90ee90' },
    icono: '🌱',
    descripcion: 'Nuevos comienzos'
  },
  litha: {
    nombre: 'Portal de Litha',
    meses: [5, 6, 7], // junio-agosto (verano norte)
    colores: { primario: '#d4af37', secundario: '#5c4a1a', acento: '#ffd700' },
    icono: '☀️',
    descripcion: 'Abundancia plena'
  },
  mabon: {
    nombre: 'Portal de Mabon',
    meses: [8, 9, 10], // septiembre-noviembre (otoño norte)
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

// Detectar hemisferio por geolocalización o usar ambos
function obtenerPortalActual(latitud = null) {
  const mes = new Date().getMonth();

  // Si tenemos latitud, determinamos hemisferio
  // latitud > 0 = norte, latitud < 0 = sur
  // Si no tenemos latitud, asumimos sur (Uruguay)
  const esSur = latitud === null || latitud < 0;
  const PORTALES = esSur ? PORTALES_SUR : PORTALES_NORTE;

  for (const [id, portal] of Object.entries(PORTALES)) {
    if (portal.meses.includes(mes)) {
      return { id, ...portal, hemisferio: esSur ? 'sur' : 'norte' };
    }
  }
  return { id: 'litha', ...PORTALES.litha, hemisferio: esSur ? 'sur' : 'norte' };
}

// Obtener portal del hemisferio opuesto para mostrar ambos
function obtenerPortalOpuesto(portalActual) {
  const mes = new Date().getMonth();
  const PORTALES = portalActual.hemisferio === 'sur' ? PORTALES_NORTE : PORTALES_SUR;

  for (const [id, portal] of Object.entries(PORTALES)) {
    if (portal.meses.includes(mes)) {
      return { id, ...portal, hemisferio: portalActual.hemisferio === 'sur' ? 'norte' : 'sur' };
    }
  }
  return null;
}

export default function CirculoDashboard({ usuario }) {
  const [seccion, setSeccion] = useState('inicio');
  const [contenidoSemana, setContenidoSemana] = useState(null);
  const [guardianSemana, setGuardianSemana] = useState(null);
  const [portalActual, setPortalActual] = useState(obtenerPortalActual());
  const [portalOpuesto, setPortalOpuesto] = useState(null);
  const [hemisferioDetectado, setHemisferioDetectado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [coloresDuende, setColoresDuende] = useState(COLORES_ELEMENTO.espiritu);
  const [mostrandoTour, setMostrandoTour] = useState(false);

  useEffect(() => {
    cargarDatos();
    detectarHemisferio();
    // Verificar si es la primera vez (mostrar tour)
    const tourVisto = localStorage.getItem('tour_circulo_visto');
    if (!tourVisto) {
      setMostrandoTour(true);
    }
  }, []);

  // Detectar hemisferio por geolocalización
  function detectarHemisferio() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitud = position.coords.latitude;
          const nuevoPortal = obtenerPortalActual(latitud);
          setPortalActual(nuevoPortal);
          setPortalOpuesto(obtenerPortalOpuesto(nuevoPortal));
          setHemisferioDetectado(latitud >= 0 ? 'norte' : 'sur');
        },
        () => {
          // Si falla, usar Uruguay (sur) y mostrar ambos
          const portalSur = obtenerPortalActual(-34);
          setPortalActual(portalSur);
          setPortalOpuesto(obtenerPortalOpuesto(portalSur));
        }
      );
    } else {
      // Sin geolocalización, mostrar ambos (sur como principal)
      const portalSur = obtenerPortalActual(-34);
      setPortalActual(portalSur);
      setPortalOpuesto(obtenerPortalOpuesto(portalSur));
    }
  }

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

      {/* Banner de Temporada - Ambos Hemisferios */}
      <div className={`banner-temporada banner-${portalActual.id}`}>
        <div className="banner-particulas"></div>
        <div className="banner-contenido-dual">
          {/* Hemisferio Sur (principal para Uruguay) */}
          <div className={`banner-hemisferio ${portalActual.hemisferio === 'sur' ? 'activo' : ''}`}>
            <span className="hemisferio-label">Hemisferio Sur</span>
            <div className="portal-info">
              <span className="banner-icono">{portalActual.icono}</span>
              <div className="banner-texto">
                <span className="banner-nombre">{portalActual.nombre}</span>
                <span className="banner-desc">{portalActual.descripcion}</span>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="banner-separador">
            <span className="separador-linea"></span>
          </div>

          {/* Hemisferio Norte */}
          {portalOpuesto && (
            <div className={`banner-hemisferio ${portalActual.hemisferio === 'norte' ? 'activo' : ''}`}>
              <span className="hemisferio-label">Hemisferio Norte</span>
              <div className="portal-info">
                <span className="banner-icono">{portalOpuesto.icono}</span>
                <div className="banner-texto">
                  <span className="banner-nombre">{portalOpuesto.nombre}</span>
                  <span className="banner-desc">{portalOpuesto.descripcion}</span>
                </div>
              </div>
            </div>
          )}
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
            onClick={() => setSeccion('cursos')}
            className={`nav-btn ${seccion === 'cursos' ? 'active' : ''}`}
          >
            Cursos
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
        {seccion === 'cursos' && <SeccionCursos usuario={usuario} />}
        {seccion === 'foro' && <SeccionForo usuario={usuario} />}
        {seccion === 'archivo' && <SeccionArchivo />}
      </main>

      <style jsx>{`
        /* ═══════════════════════════════════════════════════════════════════════════
           PALETA NEÓN PREMIUM - El Círculo
           ═══════════════════════════════════════════════════════════════════════════ */
        .circulo-dashboard {
          min-height: 100vh;
          background: #050508;
          color: #ffffff;
          font-family: 'Cormorant Garamond', Georgia, serif;
          --neon-magenta: #ff00ff;
          --neon-blue: #00f0ff;
          --neon-green: #39ff14;
          --neon-orange: #ff6b00;
          --neon-magenta-glow: rgba(255, 0, 255, 0.4);
          --neon-blue-glow: rgba(0, 240, 255, 0.4);
          --neon-green-glow: rgba(57, 255, 20, 0.4);
          --neon-orange-glow: rgba(255, 107, 0, 0.4);
        }

        /* Banner de Temporada - Ambos Hemisferios */
        .banner-temporada {
          position: relative;
          padding: 15px 20px;
          overflow: hidden;
        }

        .banner-yule {
          background: linear-gradient(135deg, #1a3a5c 0%, #0a1520 50%, #1a3a5c 100%);
        }
        .banner-ostara {
          background: linear-gradient(135deg, #1a3c1a 0%, #0a1510 50%, #1a3c1a 100%);
        }
        .banner-litha {
          background: linear-gradient(135deg, #3d3510 0%, #1a1508 50%, #3d3510 100%);
        }
        .banner-mabon {
          background: linear-gradient(135deg, #4a2a0a 0%, #1a0a00 50%, #4a2a0a 100%);
        }

        .banner-particulas {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, var(--portal-acento) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.2;
          animation: particulasFloat 20s linear infinite;
        }

        @keyframes particulasFloat {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }

        .banner-contenido-dual {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .banner-hemisferio {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.6;
          transition: opacity 0.3s;
        }

        .banner-hemisferio.activo {
          opacity: 1;
        }

        .hemisferio-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.5);
        }

        .portal-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .banner-separador {
          display: flex;
          align-items: center;
          height: 50px;
        }

        .separador-linea {
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent);
        }

        .banner-icono {
          font-size: 28px;
          animation: iconoPulse 3s ease-in-out infinite;
        }

        @keyframes iconoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .banner-texto {
          display: flex;
          flex-direction: column;
        }

        .banner-nombre {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--portal-acento);
        }

        .banner-desc {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        @media (max-width: 600px) {
          .banner-contenido-dual {
            flex-direction: column;
            gap: 15px;
          }
          .banner-separador {
            height: 1px;
            width: 100px;
          }
          .separador-linea {
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          }
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
          background: rgba(5, 5, 8, 0.95);
          border-bottom: 1px solid rgba(0, 240, 255, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(20px);
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
          background: linear-gradient(135deg, var(--neon-magenta), var(--neon-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px var(--neon-magenta-glow);
          margin: 0;
        }

        .portal-badge {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--neon-green);
          background: rgba(57, 255, 20, 0.08);
          padding: 6px 15px;
          border-radius: 20px;
          border: 1px solid rgba(57, 255, 20, 0.3);
          text-shadow: 0 0 10px var(--neon-green-glow);
        }

        .circulo-nav {
          display: flex;
          gap: 10px;
        }

        .nav-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.7);
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
          border-color: var(--neon-blue);
          color: #ffffff;
          box-shadow: 0 0 15px var(--neon-blue-glow);
        }

        .nav-btn.active {
          background: rgba(0, 240, 255, 0.1);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
          box-shadow: 0 0 20px var(--neon-blue-glow);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-name {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: #ffffff;
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
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .link-externo:hover {
          color: #fff;
          border-color: var(--neon-magenta);
          background: rgba(255, 0, 255, 0.1);
          box-shadow: 0 0 15px var(--neon-magenta-glow);
        }

        .link-externo.link-tienda {
          border-color: var(--neon-orange);
          color: var(--neon-orange);
        }

        .link-externo.link-tienda:hover {
          background: rgba(255, 107, 0, 0.15);
          color: var(--neon-orange);
          border-color: var(--neon-orange);
          box-shadow: 0 0 15px var(--neon-orange-glow);
        }

        .btn-tour-mini {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 0, 255, 0.1);
          border: 1px solid rgba(255, 0, 255, 0.4);
          color: var(--neon-magenta);
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-tour-mini:hover {
          background: rgba(255, 0, 255, 0.2);
          border-color: var(--neon-magenta);
          box-shadow: 0 0 15px var(--neon-magenta-glow);
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

  // Guardian de la semana desde la configuracion local
  const [guardianLocal, setGuardianLocal] = useState(null);
  const [semanaActual, setSemanaActual] = useState(null);

  useEffect(() => {
    cargarInfoVisita();
    // Obtener guardian de la semana desde la configuracion local
    const hoy = new Date();
    const guardian = obtenerGuardianPorFecha(hoy);
    const semana = obtenerSemanaActual(hoy);
    setGuardianLocal(guardian);
    setSemanaActual(semana);
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
            <span className="toast-titulo">{safeRender(infoVisita.mensaje?.titulo)}</span>
            <span className="toast-texto">{safeRender(infoVisita.mensaje?.texto)}</span>
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
              <h3 className="consejo-titulo">{safeRender(consejo.consejo?.titulo)}</h3>
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
                <p className="consejo-mensaje">{safeRender(consejo.consejo?.mensaje)}</p>
                <p className="consejo-reflexion">"{safeRender(consejo.consejo?.reflexion)}"</p>
              </>
            )}
          </div>
          <div className="consejo-footer">
            <span>Semana {safeRender(consejo.semana)} • {safeRender(consejo.diasRestantes)} días más con {safeRender(consejo.guardian?.nombre)}</span>
          </div>
        </div>
      )}

      {/* Bienvenida */}
      <div className="bienvenida">
        <h2>{personalizarGenero(`Bienvenido/a al Círculo, ${nombreUsuario}`)}</h2>
        <p>Estamos en el {safeRender(portalActual?.nombre)} - {safeRender(portalActual?.energia)}</p>
        {infoVisita && infoVisita.visitaNumero > 1 && (
          <span className="visita-contador">Visita #{infoVisita.visitaNumero} de hoy</span>
        )}
      </div>

      {/* Guardián de la semana - Diseño destacado */}
      {(guardianLocal || guardianSemana || consejo?.guardian) && (() => {
        // Priorizar el guardian local (del archivo de configuracion), luego API, luego consejo
        const guardian = guardianLocal || guardianSemana || consejo?.guardian;
        const tieneProducto = guardian?.productoWooCommerce;

        return (
          <div className="guardian-destacado">
            <div className="guardian-glow"></div>
            <div className="guardian-contenedor">
              {/* Banner decorativo con info de la semana */}
              <div className="guardian-banner">
                <div className="banner-patron"></div>
                <span className="banner-estrella izq">✦</span>
                <div className="banner-titulo-wrap">
                  <span className="banner-titulo">✧ Guardián de la Semana ✧</span>
                  {semanaActual && (
                    <span className="banner-tema">{semanaActual.tema}</span>
                  )}
                </div>
                <span className="banner-estrella der">✦</span>
              </div>

              {/* Contenido principal */}
              <div className="guardian-cuerpo">
                {/* Imagen circular destacada - MAS GRANDE */}
                <div className="guardian-foto-contenedor grande">
                  <div className="foto-aureola"></div>
                  <div className="foto-marco">
                    <img
                      src={guardian?.imagen || '/images/guardian-default.jpg'}
                      alt={guardian?.nombre}
                      className="guardian-foto"
                    />
                  </div>
                  <div className="foto-brillo"></div>
                  {/* Color del guardian */}
                  {guardian?.color && (
                    <div
                      className="foto-color-accent"
                      style={{ background: guardian.color }}
                    ></div>
                  )}
                </div>

                {/* Info del guardián */}
                <div className="guardian-datos">
                  <span className="guardian-especie">
                    {guardian?.categoria || 'Guardián Ancestral'}
                  </span>
                  <h3 className="guardian-nombre-grande">
                    {guardian?.nombre}
                  </h3>
                  <span className="guardian-titulo-completo">
                    {guardian?.nombreCompleto || guardian?.nombre}
                  </span>

                  {/* Mensaje de saludo del guardian */}
                  {guardian?.saludo && (
                    <p className="guardian-saludo">
                      "{guardian.saludo}"
                    </p>
                  )}

                  <p className="guardian-arquetipo-desc">
                    {guardian?.personalidad?.substring(0, 150) || guardian?.arquetipo || 'Guardián ancestral de la magia'}
                    {guardian?.personalidad?.length > 150 ? '...' : ''}
                  </p>

                  {/* Cristales y elemento */}
                  <div className="guardian-atributos">
                    {guardian?.cristales && (
                      <span className="atributo">
                        <span className="atributo-icono">💎</span>
                        {Array.isArray(guardian.cristales)
                          ? guardian.cristales.join(', ')
                          : guardian.cristales}
                      </span>
                    )}
                    {guardian?.elemento && (
                      <span className="atributo">
                        <span className="atributo-icono">🌿</span>
                        {guardian.elemento}
                      </span>
                    )}
                  </div>

                  {/* Frases tipicas */}
                  {guardian?.frasesTipicas && guardian.frasesTipicas.length > 0 && (
                    <div className="guardian-frase-tipica">
                      <span className="frase-etiqueta">Una de sus frases:</span>
                      <p className="frase-texto">"{guardian.frasesTipicas[Math.floor(Math.random() * guardian.frasesTipicas.length)]}"</p>
                    </div>
                  )}

                  {/* Botones de accion */}
                  <div className="guardian-acciones">
                    {tieneProducto && (
                      <a
                        href={`${WORDPRESS_URL}/?p=${guardian.productoWooCommerce}`}
                        target="_blank"
                        rel="noopener"
                        className="guardian-btn-tienda"
                      >
                        <span>Conoce mas sobre {guardian.nombre}</span>
                        <span className="btn-flecha">→</span>
                      </a>
                    )}
                    {!tieneProducto && guardian?.url_tienda && (
                      <a
                        href={guardian.url_tienda}
                        target="_blank"
                        rel="noopener"
                        className="guardian-btn-tienda"
                      >
                        <span>Conocer a {guardian.nombre}</span>
                        <span className="btn-flecha">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripcion de la semana */}
              {semanaActual?.descripcion && (
                <div className="guardian-semana-descripcion">
                  <p>{semanaActual.descripcion}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
          background: linear-gradient(135deg, #ffffff, var(--neon-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px var(--neon-blue-glow);
          margin-bottom: 10px;
        }

        .bienvenida p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        .visita-contador {
          display: inline-block;
          margin-top: 10px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--neon-green);
          background: rgba(57, 255, 20, 0.08);
          padding: 4px 12px;
          border-radius: 12px;
          border: 1px solid rgba(57, 255, 20, 0.2);
        }

        /* Toast de visitas - NEÓN */
        .mensaje-visita-toast {
          position: fixed;
          top: 100px;
          right: 20px;
          background: linear-gradient(135deg, #0a0a15 0%, #151525 100%);
          border: 1px solid var(--neon-blue);
          border-radius: 16px;
          padding: 20px 45px 20px 25px;
          max-width: 350px;
          z-index: 1000;
          animation: slideInRight 0.4s ease, glowNeon 2s ease infinite;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px var(--neon-blue-glow);
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

        @keyframes glowNeon {
          0%, 100% { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px var(--neon-blue-glow); }
          50% { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 35px var(--neon-blue-glow); }
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
          border-color: var(--neon-green);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px var(--neon-green-glow);
        }

        .mensaje-visita-toast.tercera_visita {
          border-color: var(--neon-magenta);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px var(--neon-magenta-glow);
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

        /* Guardián de la semana - Diseño destacado NEÓN */
        .guardian-destacado {
          position: relative;
          margin-bottom: 50px;
          border-radius: 24px;
          overflow: hidden;
        }

        .guardian-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, var(--neon-magenta), var(--neon-blue), var(--neon-green), var(--neon-orange));
          background-size: 400% 400%;
          animation: borderGlowNeon 6s ease infinite;
          border-radius: 26px;
          z-index: -1;
        }

        @keyframes borderGlowNeon {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .guardian-contenedor {
          background: linear-gradient(135deg, #080810 0%, #0a0a15 50%, #050508 100%);
          border-radius: 24px;
          overflow: hidden;
        }

        .guardian-banner {
          position: relative;
          padding: 18px 30px;
          background: linear-gradient(90deg, rgba(255, 0, 255, 0.08), rgba(0, 240, 255, 0.12), rgba(255, 0, 255, 0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          border-bottom: 1px solid rgba(0, 240, 255, 0.2);
        }

        .banner-patron {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0, 240, 255, 0.03) 20px, rgba(0, 240, 255, 0.03) 21px);
          pointer-events: none;
        }

        .banner-titulo {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--neon-blue);
          text-shadow: 0 0 20px var(--neon-blue-glow);
        }

        .banner-estrella {
          font-size: 20px;
          color: var(--neon-magenta);
          animation: starPulseNeon 2s ease-in-out infinite;
          text-shadow: 0 0 15px var(--neon-magenta-glow);
        }

        .banner-estrella.izq { animation-delay: 0s; }
        .banner-estrella.der { animation-delay: 1s; }

        @keyframes starPulseNeon {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); text-shadow: 0 0 25px var(--neon-magenta-glow); }
        }

        .guardian-cuerpo {
          display: flex;
          align-items: center;
          gap: 50px;
          padding: 50px;
        }

        .guardian-foto-contenedor {
          position: relative;
          flex-shrink: 0;
        }

        .foto-aureola {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, rgba(255, 0, 255, 0.1) 50%, transparent 70%);
          animation: aureolaPulseNeon 3s ease-in-out infinite;
        }

        @keyframes aureolaPulseNeon {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .foto-marco {
          position: relative;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, var(--neon-magenta), var(--neon-blue), var(--neon-magenta));
          box-shadow:
            0 0 30px var(--neon-magenta-glow),
            0 0 60px var(--neon-blue-glow),
            inset 0 0 20px rgba(0, 240, 255, 0.1);
        }

        .guardian-foto {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        .foto-brillo {
          position: absolute;
          top: 10%;
          left: 15%;
          width: 30%;
          height: 20%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
          border-radius: 50%;
          filter: blur(5px);
          pointer-events: none;
        }

        .guardian-datos {
          flex: 1;
        }

        .guardian-especie {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--neon-green);
          background: rgba(57, 255, 20, 0.08);
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid rgba(57, 255, 20, 0.3);
          margin-bottom: 12px;
          text-shadow: 0 0 10px var(--neon-green-glow);
        }

        .guardian-nombre-grande {
          font-family: 'Tangerine', cursive;
          font-size: 72px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 5px;
          line-height: 1;
          text-shadow: 0 0 40px var(--neon-magenta-glow);
        }

        .guardian-proposito {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--neon-blue);
          display: block;
          margin-bottom: 15px;
          text-shadow: 0 0 10px var(--neon-blue-glow);
        }

        .guardian-arquetipo-desc {
          font-size: 17px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .guardian-atributos {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .atributo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .atributo-icono {
          font-size: 16px;
        }

        .guardian-btn-tienda {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, var(--neon-orange), #ff8c00);
          color: #000;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          text-decoration: none;
          padding: 16px 30px;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px var(--neon-orange-glow);
        }

        .guardian-btn-tienda:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 35px var(--neon-orange-glow), 0 0 25px var(--neon-orange-glow);
        }

        .btn-flecha {
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        .guardian-btn-tienda:hover .btn-flecha {
          transform: translateX(5px);
        }

        /* Banner titulo wrap para tema de semana */
        .banner-titulo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .banner-tema {
          font-size: 11px;
          color: var(--neon-magenta);
          font-style: italic;
          text-shadow: 0 0 10px var(--neon-magenta-glow);
        }

        /* Foto contenedor grande */
        .guardian-foto-contenedor.grande .foto-marco {
          width: 280px;
          height: 280px;
        }

        .foto-color-accent {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 4px;
          border-radius: 2px;
          opacity: 0.8;
          box-shadow: 0 0 15px currentColor;
        }

        /* Titulo completo del guardian */
        .guardian-titulo-completo {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--neon-blue);
          display: block;
          margin-bottom: 15px;
          text-shadow: 0 0 10px var(--neon-blue-glow);
        }

        /* Saludo del guardian */
        .guardian-saludo {
          font-size: 20px;
          font-style: italic;
          color: var(--neon-green);
          text-shadow: 0 0 15px var(--neon-green-glow);
          margin: 0 0 15px;
          padding: 15px 20px;
          background: rgba(57, 255, 20, 0.05);
          border-left: 3px solid var(--neon-green);
          border-radius: 0 10px 10px 0;
        }

        /* Frase tipica del guardian */
        .guardian-frase-tipica {
          margin-bottom: 20px;
          padding: 12px 16px;
          background: rgba(0, 240, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(0, 240, 255, 0.15);
        }

        .frase-etiqueta {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.5);
          display: block;
          margin-bottom: 6px;
        }

        .frase-texto {
          font-size: 15px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          line-height: 1.5;
        }

        /* Acciones del guardian */
        .guardian-acciones {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        /* Descripcion de la semana */
        .guardian-semana-descripcion {
          padding: 20px 30px;
          background: rgba(0, 240, 255, 0.03);
          border-top: 1px solid rgba(0, 240, 255, 0.15);
          text-align: center;
        }

        .guardian-semana-descripcion p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
          font-style: italic;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .guardian-cuerpo {
            flex-direction: column;
            text-align: center;
            padding: 30px;
            gap: 30px;
          }

          .foto-marco {
            width: 180px;
            height: 180px;
          }

          .guardian-foto-contenedor.grande .foto-marco {
            width: 220px;
            height: 220px;
          }

          .guardian-nombre-grande {
            font-size: 54px;
          }

          .guardian-atributos {
            justify-content: center;
          }

          .guardian-saludo {
            border-left: none;
            border-top: 3px solid var(--neon-green);
            border-radius: 10px 10px 0 0;
          }

          .guardian-acciones {
            justify-content: center;
          }
        }

        /* Grid de accesos - NEÓN */
        .accesos-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }

        .acceso-card {
          background: rgba(10, 10, 20, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px 25px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .acceso-card:nth-child(1):hover {
          background: rgba(255, 0, 255, 0.08);
          border-color: var(--neon-magenta);
          box-shadow: 0 0 25px var(--neon-magenta-glow);
          transform: translateY(-5px);
        }
        .acceso-card:nth-child(1):hover h4 { color: var(--neon-magenta); }

        .acceso-card:nth-child(2):hover {
          background: rgba(0, 240, 255, 0.08);
          border-color: var(--neon-blue);
          box-shadow: 0 0 25px var(--neon-blue-glow);
          transform: translateY(-5px);
        }
        .acceso-card:nth-child(2):hover h4 { color: var(--neon-blue); }

        .acceso-card:nth-child(3):hover {
          background: rgba(57, 255, 20, 0.08);
          border-color: var(--neon-green);
          box-shadow: 0 0 25px var(--neon-green-glow);
          transform: translateY(-5px);
        }
        .acceso-card:nth-child(3):hover h4 { color: var(--neon-green); }

        .acceso-card:nth-child(4):hover {
          background: rgba(255, 107, 0, 0.08);
          border-color: var(--neon-orange);
          box-shadow: 0 0 25px var(--neon-orange-glow);
          transform: translateY(-5px);
        }
        .acceso-card:nth-child(4):hover h4 { color: var(--neon-orange); }

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
          transition: color 0.3s;
        }

        .acceso-card p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
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

        /* Consejo del Día - NEÓN */
        .consejo-del-dia-card {
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.05), rgba(255, 0, 255, 0.05));
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 25px;
          padding: 0;
          margin-bottom: 40px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 240, 255, 0.1);
        }

        .consejo-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px 25px;
          background: rgba(0, 240, 255, 0.08);
          border-bottom: 1px solid rgba(0, 240, 255, 0.15);
        }

        .consejo-guardian-mini {
          flex-shrink: 0;
        }

        .consejo-guardian-mini img {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--neon-blue);
          box-shadow: 0 0 15px var(--neon-blue-glow);
        }

        .consejo-titulo-wrap {
          flex: 1;
        }

        .consejo-etiqueta {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--neon-green);
          text-shadow: 0 0 10px var(--neon-green-glow);
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
          background: rgba(255, 0, 255, 0.15);
          border: 1px solid rgba(255, 0, 255, 0.4);
          color: var(--neon-magenta);
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-regenerar:hover:not(:disabled) {
          background: rgba(255, 0, 255, 0.25);
          transform: rotate(180deg);
          box-shadow: 0 0 20px var(--neon-magenta-glow);
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
          color: var(--neon-blue) !important;
          padding-left: 20px !important;
          border-left: 2px solid var(--neon-blue) !important;
          margin: 0 !important;
          text-shadow: 0 0 10px var(--neon-blue-glow);
        }

        .consejo-footer {
          padding: 15px 30px !important;
          background: rgba(0, 0, 0, 0.3) !important;
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
  const [contenidos, setContenidos] = useState([]);
  const [contenidoActivo, setContenidoActivo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [duendeSemana, setDuendeSemana] = useState(null);
  const [guardianesWoo, setGuardianesWoo] = useState({});

  useEffect(() => {
    cargarContenido();
    cargarGuardianesWoo();
  }, []);

  // Cargar fotos de producto de WooCommerce
  async function cargarGuardianesWoo() {
    try {
      const res = await fetch('/api/admin/circulo/duendes-reales');
      const data = await res.json();
      if (data.success && data.duendes) {
        // Crear mapa por nombre para búsqueda rápida
        const mapa = {};
        data.duendes.forEach(d => {
          mapa[d.nombre?.toLowerCase()] = d;
        });
        setGuardianesWoo(mapa);
      }
    } catch (error) {
      console.error('Error cargando guardianes WooCommerce:', error);
    }
  }

  async function cargarContenido() {
    setCargando(true);
    try {
      // Cargar duende de la semana
      const resDuende = await fetch('/api/circulo/duende-del-dia');
      const dataDuende = await resDuende.json();
      if (dataDuende.success) {
        setDuendeSemana(dataDuende.guardian);
      }

      // Cargar contenido del mes actual
      const hoy = new Date();
      const res = await fetch(`/api/circulo/contenido?tipo=mes&mes=${hoy.getMonth() + 1}&ano=${hoy.getFullYear()}`);
      const data = await res.json();
      if (data.success && data.contenidos?.length > 0) {
        // Ordenar por fecha descendente
        const ordenados = data.contenidos.sort((a, b) => {
          const fechaA = new Date(a.fecha || `${a.fecha?.año}-${a.fecha?.mes}-${a.fecha?.dia}`);
          const fechaB = new Date(b.fecha || `${b.fecha?.año}-${b.fecha?.mes}-${b.fecha?.dia}`);
          return fechaB - fechaA;
        });
        setContenidos(ordenados);
        // Mostrar el más reciente por defecto
        setContenidoActivo(ordenados[0]);
      }
    } catch (error) {
      console.error('Error cargando contenido:', error);
    } finally {
      setCargando(false);
    }
  }

  function formatearFecha(fecha) {
    if (typeof fecha === 'string') {
      const [year, month, day] = fecha.split('-');
      return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
    return new Date(fecha.año, fecha.mes - 1, fecha.dia).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  // Formato corto para sidebar: "Lun 13"
  function formatearFechaCorta(fecha) {
    let date;
    if (typeof fecha === 'string') {
      const [year, month, day] = fecha.split('-');
      date = new Date(year, month - 1, day);
    } else if (fecha?.año) {
      date = new Date(fecha.año, fecha.mes - 1, fecha.dia);
    } else {
      return '';
    }
    const dia = date.toLocaleDateString('es-ES', { weekday: 'short' });
    const num = date.getDate();
    return `${dia.charAt(0).toUpperCase() + dia.slice(1)} ${num}`;
  }

  // Obtener guardian del archivo de configuracion por nombre
  function obtenerGuardianLocalPorNombre(nombreDuende) {
    if (!nombreDuende) return null;
    const nombreLower = nombreDuende.toLowerCase();
    // Buscar en GUARDIANES_MAESTROS
    for (const key in GUARDIANES_MAESTROS) {
      if (GUARDIANES_MAESTROS[key].nombre.toLowerCase() === nombreLower) {
        return GUARDIANES_MAESTROS[key];
      }
    }
    return null;
  }

  // Obtener guardian por fecha del contenido
  function obtenerGuardianPorFechaContenido(fecha) {
    if (!fecha) return null;
    let fechaObj;
    if (typeof fecha === 'string') {
      fechaObj = new Date(fecha);
    } else if (fecha?.año) {
      fechaObj = new Date(fecha.año, fecha.mes - 1, fecha.dia);
    } else {
      return null;
    }
    return obtenerGuardianPorFecha(fechaObj);
  }

  // Obtener imagen del duende - prioriza archivo local, luego WooCommerce
  function obtenerImagenDuende(nombreDuende, fechaContenido) {
    // Primero intentar desde el archivo de configuracion local
    const guardianLocal = obtenerGuardianLocalPorNombre(nombreDuende);
    if (guardianLocal?.imagen) {
      return guardianLocal.imagen;
    }

    // Si no hay nombre pero hay fecha, obtener guardian de esa fecha
    if (!nombreDuende && fechaContenido) {
      const guardianFecha = obtenerGuardianPorFechaContenido(fechaContenido);
      if (guardianFecha?.imagen) {
        return guardianFecha.imagen;
      }
    }

    // Fallback a WooCommerce
    if (!nombreDuende) return null;
    const duende = guardianesWoo[nombreDuende.toLowerCase()];
    return duende?.imagen || duende?.imagenPrincipal || null;
  }

  // Obtener info completa del guardian para mostrar en contenido
  function obtenerInfoGuardian(nombreDuende, fechaContenido) {
    // Prioridad 1: Guardian local por nombre
    const guardianLocal = obtenerGuardianLocalPorNombre(nombreDuende);
    if (guardianLocal) {
      return {
        nombre: guardianLocal.nombre,
        nombreCompleto: guardianLocal.nombreCompleto,
        imagen: guardianLocal.imagen,
        categoria: guardianLocal.categoria,
        productoWooCommerce: guardianLocal.productoWooCommerce
      };
    }

    // Prioridad 2: Guardian por fecha
    if (fechaContenido) {
      const guardianFecha = obtenerGuardianPorFechaContenido(fechaContenido);
      if (guardianFecha) {
        return {
          nombre: guardianFecha.nombre,
          nombreCompleto: guardianFecha.nombreCompleto,
          imagen: guardianFecha.imagen,
          categoria: guardianFecha.categoria,
          productoWooCommerce: guardianFecha.productoWooCommerce
        };
      }
    }

    // Prioridad 3: WooCommerce
    if (nombreDuende) {
      const duende = guardianesWoo[nombreDuende.toLowerCase()];
      if (duende) {
        return {
          nombre: duende.nombre,
          nombreCompleto: duende.nombre,
          imagen: duende.imagen || duende.imagenPrincipal,
          categoria: duende.categoria,
          productoWooCommerce: null
        };
      }
    }

    return null;
  }

  // Configuración de tipos de contenido - NEÓN
  const TIPOS_CONTENIDO = {
    presentacion: {
      icono: '🌟',
      label: 'Presentación',
      color: '#ff00ff', // magenta neón
      banner: 'linear-gradient(135deg, rgba(255, 0, 255, 0.12), rgba(150, 0, 150, 0.08))'
    },
    ensenanza: {
      icono: '📚',
      label: 'Enseñanza',
      color: '#00f0ff', // azul neón
      banner: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(0, 120, 150, 0.08))'
    },
    ritual: {
      icono: '🕯️',
      label: 'Ritual',
      color: '#ff00ff', // magenta neón
      banner: 'linear-gradient(135deg, rgba(255, 0, 255, 0.12), rgba(150, 0, 150, 0.08))'
    },
    meditacion: {
      icono: '🧘',
      label: 'Meditación',
      color: '#00f0ff', // azul neón
      banner: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(0, 120, 150, 0.08))'
    },
    diy: {
      icono: '✂️',
      label: 'Hazlo tú misma',
      color: '#ff6b00', // naranja neón
      banner: 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(150, 60, 0, 0.08))'
    },
    reflexion: {
      icono: '💭',
      label: 'Reflexión',
      color: '#39ff14', // verde neón
      banner: 'linear-gradient(135deg, rgba(57, 255, 20, 0.12), rgba(30, 150, 10, 0.08))'
    },
    ejercicio: {
      icono: '⚡',
      label: 'Ejercicio',
      color: '#ff6b00', // naranja neón
      banner: 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(150, 60, 0, 0.08))'
    },
    quiz: {
      icono: '❓',
      label: 'Quiz',
      color: '#39ff14', // verde neón
      banner: 'linear-gradient(135deg, rgba(57, 255, 20, 0.12), rgba(30, 150, 10, 0.08))'
    },
    cierre: {
      icono: '🌙',
      label: 'Cierre de Semana',
      color: '#ff00ff', // magenta neón
      banner: 'linear-gradient(135deg, rgba(255, 0, 255, 0.12), rgba(150, 0, 150, 0.08))'
    },
    default: {
      icono: '✨',
      label: 'Contenido',
      color: '#00f0ff', // azul neón
      banner: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(0, 100, 130, 0.05))'
    }
  };

  function getTipoConfig(tipo) {
    return TIPOS_CONTENIDO[tipo] || TIPOS_CONTENIDO.default;
  }

  if (cargando) {
    return (
      <div className="seccion-contenido cargando">
        <div className="loading-orbe">
          <div className="orbe-inner"></div>
        </div>
        <p>Cargando contenido mágico...</p>
        <style jsx>{`
          .seccion-contenido.cargando {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            color: rgba(255, 255, 255, 0.6);
          }
          .loading-orbe {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: orbePulse 2s ease-in-out infinite;
            margin-bottom: 20px;
          }
          .orbe-inner {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(135deg, #d4af37, #8b6914);
            animation: orbeRotate 1.5s linear infinite;
          }
          @keyframes orbePulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          @keyframes orbeRotate {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="seccion-contenido-nueva">
      {/* Header del Círculo */}
      <div className="contenido-cabecera">
        <div className="cabecera-decoracion izq"></div>
        <h2 className="contenido-titulo-principal">Contenido del Círculo</h2>
        <div className="cabecera-decoracion der"></div>
      </div>

      {contenidos.length === 0 ? (
        <div className="sin-contenido-card">
          <div className="sin-contenido-orbe"></div>
          <p>El contenido de esta semana está siendo preparado con mucho amor...</p>
          <span className="sin-contenido-firma">— Los Guardianes</span>
        </div>
      ) : (
        <div className="contenido-grid">
          {/* Lista lateral de contenidos */}
          <aside className="contenido-sidebar">
            <h3 className="sidebar-titulo">Esta semana</h3>
            <div className="sidebar-lista">
              {contenidos.map((item, idx) => {
                const config = getTipoConfig(item.tipo);
                const guardianInfo = obtenerInfoGuardian(item.duendeNombre, item.fecha);
                return (
                  <button
                    key={item.fecha || idx}
                    className={`sidebar-item ${contenidoActivo === item ? 'activo' : ''}`}
                    onClick={() => setContenidoActivo(item)}
                    style={{ '--tipo-color': config.color }}
                  >
                    {/* Imagen mini del guardian */}
                    <div className="sidebar-guardian-mini">
                      <img
                        src={guardianInfo?.imagen || obtenerImagenDuende(item.duendeNombre, item.fecha) || duendeSemana?.imagen || '/images/guardian-default.jpg'}
                        alt={guardianInfo?.nombre || item.duendeNombre || 'Guardian'}
                        className="sidebar-guardian-img"
                      />
                    </div>
                    <div className="sidebar-info">
                      <div className="sidebar-meta">
                        <span className="sidebar-tipo">{config.label}</span>
                        <span className="sidebar-fecha-corta">{formatearFechaCorta(item.fecha)}</span>
                      </div>
                      <span className="sidebar-titulo-item">{item.titulo?.substring(0, 30)}{item.titulo?.length > 30 ? '...' : ''}</span>
                      <span className="sidebar-guardian-nombre">{guardianInfo?.nombre || item.duendeNombre || 'Guardian'}</span>
                    </div>
                    <span className="sidebar-indicador"></span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Contenido principal con plantilla estética */}
          {contenidoActivo && (
            <article className="contenido-principal">
              {/* Banner decorativo */}
              <div
                className="contenido-banner"
                style={{ background: getTipoConfig(contenidoActivo.tipo).banner }}
              >
                <div className="banner-particulas-contenido"></div>
                <div className="banner-contenido-info">
                  <span
                    className="banner-tipo-badge"
                    style={{ borderColor: getTipoConfig(contenidoActivo.tipo).color }}
                  >
                    {getTipoConfig(contenidoActivo.tipo).icono} {getTipoConfig(contenidoActivo.tipo).label}
                  </span>
                  <span className="banner-fecha">{formatearFecha(contenidoActivo.fecha)}</span>
                </div>
              </div>

              {/* Cabecera con foto del duende */}
              {(() => {
                const guardianInfo = obtenerInfoGuardian(contenidoActivo.duendeNombre, contenidoActivo.fecha);
                const tipoConfig = getTipoConfig(contenidoActivo.tipo);
                return (
                  <div className="contenido-header-estetico">
                    {/* Foto circular del duende autor */}
                    <div className="autor-foto-wrap">
                      <div className="autor-foto-glow" style={{ background: tipoConfig.color }}></div>
                      <div className="autor-foto-marco">
                        <img
                          src={guardianInfo?.imagen || obtenerImagenDuende(contenidoActivo.duendeNombre, contenidoActivo.fecha) || duendeSemana?.imagen || '/images/guardian-default.jpg'}
                          alt={guardianInfo?.nombre || contenidoActivo.duendeNombre || 'Guardian'}
                          className="autor-foto"
                        />
                      </div>
                    </div>

                    <div className="contenido-meta">
                      <span className="contenido-por">Transmitido por</span>
                      <h4 className="contenido-autor-nombre">{guardianInfo?.nombre || contenidoActivo.duendeNombre || 'Un Guardian'}</h4>
                      {guardianInfo?.categoria && (
                        <span className="contenido-guardian-categoria">{guardianInfo.categoria}</span>
                      )}
                    </div>

                    {/* Tipo de contenido badge */}
                    <div className="contenido-tipo-badge" style={{ borderColor: tipoConfig.color, color: tipoConfig.color }}>
                      <span className="tipo-icono">{tipoConfig.icono}</span>
                      <span className="tipo-label">{tipoConfig.label}</span>
                    </div>

                    {/* Boton sutil a la tienda si tiene producto */}
                    {guardianInfo?.productoWooCommerce && (
                      <a
                        href={`${WORDPRESS_URL}/?p=${guardianInfo.productoWooCommerce}`}
                        target="_blank"
                        rel="noopener"
                        className="contenido-btn-guardian"
                      >
                        Conoce mas sobre {guardianInfo.nombre}
                      </a>
                    )}
                  </div>
                );
              })()}

              {/* Título y subtítulo */}
              <div className="contenido-titulos">
                <h3 className="contenido-titulo">{contenidoActivo.titulo}</h3>
                {contenidoActivo.subtitulo && (
                  <p className="contenido-subtitulo">{contenidoActivo.subtitulo}</p>
                )}
              </div>

              {/* Sección animada decorativa */}
              <div className="contenido-separador-animado">
                <div className="separador-linea"></div>
                <div className="separador-orbe">
                  <span className="orbe-simbolo">✧</span>
                </div>
                <div className="separador-linea"></div>
              </div>

              {/* Cuerpo del contenido - soporta todos los formatos */}
              <div className="contenido-cuerpo">
                {/* Formato 1: cuerpo (generar-contenido-pro) */}
                {contenidoActivo.cuerpo && contenidoActivo.cuerpo.split('\n\n').map((parrafo, i) => (
                  <p key={i} className="contenido-parrafo">{parrafo}</p>
                ))}

                {/* Formato 2: secciones (regenerar-contenido) */}
                {!contenidoActivo.cuerpo && contenidoActivo.secciones && (
                  <>
                    {contenidoActivo.secciones.intro && (
                      <div className="contenido-intro">
                        <p className="contenido-parrafo">{contenidoActivo.secciones.intro}</p>
                      </div>
                    )}
                    {contenidoActivo.secciones.desarrollo && (
                      <div className="contenido-desarrollo">
                        {contenidoActivo.secciones.desarrollo.split('\n\n').map((parrafo, i) => (
                          <p key={i} className="contenido-parrafo">{parrafo}</p>
                        ))}
                      </div>
                    )}
                    {contenidoActivo.secciones.practica && (
                      <div className="contenido-practica-sec">
                        <span className="practica-label">🌿 Práctica</span>
                        <p className="contenido-parrafo">{contenidoActivo.secciones.practica}</p>
                      </div>
                    )}
                    {contenidoActivo.secciones.cierre && (
                      <div className="contenido-cierre-sec">
                        <p className="contenido-parrafo contenido-cierre-texto">{contenidoActivo.secciones.cierre}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Formato 3: mensaje + enseñanza + práctica + reflexión (legacy) */}
                {!contenidoActivo.cuerpo && !contenidoActivo.secciones && contenidoActivo.mensaje && (
                  <>
                    <p className="contenido-parrafo contenido-mensaje">{contenidoActivo.mensaje}</p>
                    {contenidoActivo.ensenanza && (
                      <div className="contenido-ensenanza">
                        <span className="ensenanza-label">✨ Enseñanza</span>
                        <p>{contenidoActivo.ensenanza}</p>
                      </div>
                    )}
                    {contenidoActivo.practica && (
                      <div className="contenido-practica">
                        <span className="practica-label">🌿 Práctica del día</span>
                        <p>{contenidoActivo.practica}</p>
                      </div>
                    )}
                    {contenidoActivo.reflexion && (
                      <p className="contenido-reflexion">"{contenidoActivo.reflexion}"</p>
                    )}
                  </>
                )}

                {/* Si no hay contenido en ningún formato */}
                {!contenidoActivo.cuerpo && !contenidoActivo.secciones && !contenidoActivo.mensaje && (
                  <div className="contenido-vacio">
                    <p>Este contenido está siendo preparado...</p>
                  </div>
                )}
              </div>

              {/* Si es ritual, mostrar pasos */}
              {contenidoActivo.ritual && (
                <div className="contenido-ritual">
                  <div className="ritual-header">
                    <span className="ritual-icono">🕯️</span>
                    <div className="ritual-info">
                      <h4 className="ritual-nombre">{safeRender(contenidoActivo.ritual.nombre)}</h4>
                      <span className="ritual-duracion">{safeRender(contenidoActivo.ritual.duracion)}</span>
                    </div>
                  </div>

                  {contenidoActivo.ritual.materiales && (
                    <div className="ritual-materiales">
                      <h5>Materiales</h5>
                      <ul>
                        {contenidoActivo.ritual.materiales.map((m, i) => (
                          <li key={i}>{safeRender(m)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {contenidoActivo.ritual.pasos && (
                    <div className="ritual-pasos">
                      <h5>Pasos del Ritual</h5>
                      {contenidoActivo.ritual.pasos.map((paso, i) => (
                        <div key={i} className="ritual-paso">
                          <div className="paso-numero">{safeRender(paso.numero) || i + 1}</div>
                          <div className="paso-contenido">
                            <h6>{safeRender(paso.titulo)}</h6>
                            <p>{safeRender(paso.descripcion)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Afirmación del día */}
              {contenidoActivo.afirmacion && (
                <div className="contenido-afirmacion">
                  <div className="afirmacion-decoracion-izq">✦</div>
                  <div className="afirmacion-contenido">
                    <span className="afirmacion-etiqueta">Afirmación del día</span>
                    <p className="afirmacion-texto">"{contenidoActivo.afirmacion}"</p>
                  </div>
                  <div className="afirmacion-decoracion-der">✦</div>
                </div>
              )}

              {/* Imagen generada o placeholder */}
              <div className="contenido-imagen-generada">
                {contenidoActivo.imagen ? (
                  <img
                    src={contenidoActivo.imagen}
                    alt={contenidoActivo.titulo}
                    className="imagen-contenido-real"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div className="imagen-placeholder" style={{ display: contenidoActivo.imagen ? 'none' : 'flex' }}>
                  <div className="imagen-patron-fondo"></div>
                  <div className="imagen-overlay">
                    <span className="imagen-icono">{getTipoConfig(contenidoActivo.tipo).icono}</span>
                    <span className="imagen-texto">{contenidoActivo.titulo?.substring(0, 50)}</span>
                  </div>
                </div>
              </div>

              {/* Cierre */}
              {contenidoActivo.cierre && (
                <div className="contenido-cierre">
                  <div className="cierre-borde"></div>
                  <p>{contenidoActivo.cierre}</p>
                </div>
              )}

              {/* Firma del autor */}
              <div className="contenido-firma">
                <span className="firma-linea"></span>
                <span className="firma-texto">Con amor, {contenidoActivo.duendeNombre || 'Tu Guardián'}</span>
                <span className="firma-linea"></span>
              </div>
            </article>
          )}
        </div>
      )}

      <style jsx>{`
        /* ═══════════════════════════════════════════════════════════════════════════
           ESTILOS SECCION CONTENIDO - PLANTILLA ESTÉTICA
           ═══════════════════════════════════════════════════════════════════════════ */

        .seccion-contenido-nueva {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Cabecera */
        .contenido-cabecera {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          margin-bottom: 40px;
        }

        .cabecera-decoracion {
          flex: 1;
          max-width: 200px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent);
        }

        .contenido-titulo-principal {
          font-family: 'Tangerine', cursive;
          font-size: 52px;
          background: linear-gradient(135deg, var(--neon-magenta), var(--neon-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          text-shadow: 0 0 30px var(--neon-blue-glow);
        }

        /* Sin contenido - NEÓN */
        .sin-contenido-card {
          text-align: center;
          padding: 80px 40px;
          background: rgba(10, 10, 18, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 20px;
        }

        .sin-contenido-orbe {
          width: 80px;
          height: 80px;
          margin: 0 auto 25px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 240, 255, 0.15), rgba(255, 0, 255, 0.1), transparent);
          animation: orbePulse 3s ease-in-out infinite;
          box-shadow: 0 0 30px var(--neon-blue-glow);
        }

        .sin-contenido-card p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 15px;
        }

        .sin-contenido-firma {
          font-style: italic;
          color: var(--neon-magenta);
          text-shadow: 0 0 10px var(--neon-magenta-glow);
          font-size: 14px;
        }

        /* Grid principal */
        .contenido-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        @media (min-width: 1000px) {
          .contenido-grid {
            grid-template-columns: 320px 1fr;
          }
        }

        /* Sidebar - NEÓN */
        .contenido-sidebar {
          background: rgba(8, 8, 15, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 16px;
          padding: 20px;
          height: fit-content;
          max-height: 700px;
          overflow-y: auto;
        }

        .sidebar-titulo {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--neon-blue);
          text-shadow: 0 0 10px var(--neon-blue-glow);
          margin: 0 0 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 240, 255, 0.2);
        }

        .sidebar-lista {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: rgba(15, 15, 25, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          position: relative;
        }

        .sidebar-item:hover {
          background: rgba(0, 240, 255, 0.08);
          border-color: var(--tipo-color, var(--neon-blue));
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.15);
        }

        .sidebar-item.activo {
          background: rgba(0, 240, 255, 0.1);
          border-color: var(--tipo-color, var(--neon-blue));
          box-shadow: 0 0 20px var(--neon-blue-glow);
        }

        .sidebar-item.activo .sidebar-indicador {
          width: 4px;
          background: var(--tipo-color, var(--neon-blue));
          box-shadow: 0 0 10px var(--tipo-color, var(--neon-blue-glow));
        }

        .sidebar-icono {
          font-size: 22px;
          flex-shrink: 0;
        }

        /* Imagen mini del guardian en sidebar */
        .sidebar-guardian-mini {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: border-color 0.3s ease;
        }

        .sidebar-item:hover .sidebar-guardian-mini,
        .sidebar-item.activo .sidebar-guardian-mini {
          border-color: var(--tipo-color, var(--neon-blue));
          box-shadow: 0 0 10px var(--tipo-color, var(--neon-blue-glow));
        }

        .sidebar-guardian-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sidebar-guardian-nombre {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        .sidebar-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .sidebar-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .sidebar-tipo {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--tipo-color, var(--neon-magenta));
        }

        .sidebar-fecha-corta {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
        }

        .sidebar-titulo-item {
          font-size: 13px;
          color: #ffffff;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-indicador {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 60%;
          border-radius: 2px 0 0 2px;
          transition: all 0.3s ease;
        }

        /* Contenido principal - NEÓN */
        .contenido-principal {
          background: linear-gradient(180deg, rgba(10, 10, 18, 0.95) 0%, rgba(5, 5, 12, 0.98) 100%);
          border: 1px solid rgba(255, 0, 255, 0.2);
          border-radius: 20px;
          overflow: hidden;
        }

        /* Banner decorativo */
        .contenido-banner {
          position: relative;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .banner-particulas-contenido {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }

        .banner-contenido-info {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .banner-tipo-badge {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .banner-fecha {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: capitalize;
        }

        /* Header estético - NEÓN */
        .contenido-header-estetico {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px 30px;
          border-bottom: 1px solid rgba(0, 240, 255, 0.15);
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .contenido-header-estetico {
            flex-direction: column;
            text-align: center;
          }
          .contenido-tipo-badge {
            margin-left: 0;
          }
        }

        .autor-foto-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .autor-foto-glow {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          opacity: 0.4;
          filter: blur(10px);
        }

        .autor-foto-marco {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, var(--neon-magenta), var(--neon-blue));
          position: relative;
          box-shadow: 0 0 15px var(--neon-magenta-glow);
        }

        .autor-foto {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        .contenido-meta {
          flex: 1;
        }

        .contenido-por {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.6);
          display: block;
          margin-bottom: 4px;
        }

        .contenido-autor-nombre {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          color: var(--neon-magenta);
          text-shadow: 0 0 15px var(--neon-magenta-glow);
          margin: 0;
        }

        .contenido-guardian-categoria {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--neon-green);
          display: block;
          margin-top: 4px;
        }

        /* Badge de tipo de contenido en header */
        .contenido-tipo-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid;
          border-radius: 20px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(0, 0, 0, 0.3);
          margin-left: auto;
        }

        .tipo-icono {
          font-size: 14px;
        }

        /* Boton sutil para conocer al guardian */
        .contenido-btn-guardian {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 1px;
          color: var(--neon-orange);
          text-decoration: none;
          padding: 8px 16px;
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 20px;
          background: rgba(255, 107, 0, 0.08);
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .contenido-btn-guardian:hover {
          background: rgba(255, 107, 0, 0.15);
          border-color: var(--neon-orange);
          box-shadow: 0 0 15px var(--neon-orange-glow);
        }

        /* Titulos */
        .contenido-titulos {
          padding: 30px 30px 20px;
        }

        .contenido-titulo {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          color: #ffffff;
          margin: 0 0 12px;
          line-height: 1.3;
        }

        .contenido-subtitulo {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          margin: 0;
        }

        /* Separador animado - NEÓN */
        .contenido-separador-animado {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 0 30px 30px;
        }

        .separador-linea {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.4), transparent);
        }

        .separador-orbe {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 0, 255, 0.1);
          border: 1px solid rgba(255, 0, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: orbeRotateSlow 8s linear infinite;
          box-shadow: 0 0 15px var(--neon-magenta-glow);
        }

        @keyframes orbeRotateSlow {
          to { transform: rotate(360deg); }
        }

        .orbe-simbolo {
          font-size: 16px;
          color: var(--neon-blue);
          text-shadow: 0 0 10px var(--neon-blue-glow);
        }

        /* Cuerpo */
        .contenido-cuerpo {
          padding: 0 30px 30px;
        }

        .contenido-parrafo {
          font-size: 16px;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 20px;
        }

        /* Formato secciones - regenerar-contenido */
        .contenido-intro {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 240, 255, 0.1);
        }

        .contenido-desarrollo {
          margin-bottom: 30px;
        }

        .contenido-practica-sec {
          background: linear-gradient(135deg, rgba(57, 255, 20, 0.08), rgba(30, 150, 10, 0.05));
          border: 1px solid rgba(57, 255, 20, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin: 30px 0;
        }

        .contenido-practica-sec .practica-label {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: var(--neon-green, #39ff14);
          margin-bottom: 15px;
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.4);
        }

        .contenido-cierre-sec {
          background: linear-gradient(135deg, rgba(255, 0, 255, 0.08), rgba(150, 0, 150, 0.05));
          border: 1px solid rgba(255, 0, 255, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin-top: 30px;
          text-align: center;
        }

        .contenido-cierre-texto {
          font-style: italic;
          color: rgba(255, 255, 255, 0.9);
        }

        .contenido-vacio {
          text-align: center;
          padding: 60px 30px;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        /* Ritual */
        .contenido-ritual {
          margin: 30px;
          padding: 30px;
          background: rgba(155, 89, 182, 0.08);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 16px;
        }

        .ritual-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .ritual-icono {
          font-size: 36px;
        }

        .ritual-nombre {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          color: #ffffff;
          margin: 0;
        }

        .ritual-duracion {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .ritual-materiales {
          margin-bottom: 25px;
        }

        .ritual-materiales h5,
        .ritual-pasos h5 {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(155, 89, 182, 0.9);
          margin: 0 0 12px;
        }

        .ritual-materiales ul {
          margin: 0;
          padding-left: 20px;
        }

        .ritual-materiales li {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
          font-size: 14px;
        }

        .ritual-paso {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .paso-numero {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(155, 89, 182, 0.3);
          border: 1px solid rgba(155, 89, 182, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          flex-shrink: 0;
        }

        .paso-contenido h6 {
          font-family: 'Cinzel', serif;
          font-size: 15px;
          color: #ffffff;
          margin: 0 0 8px;
        }

        .paso-contenido p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
          line-height: 1.7;
        }

        /* Afirmación - NEÓN */
        .contenido-afirmacion {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 30px;
          padding: 25px 30px;
          background: linear-gradient(135deg, rgba(255, 107, 0, 0.08), rgba(255, 0, 255, 0.05));
          border: 1px solid rgba(255, 107, 0, 0.4);
          border-radius: 16px;
          box-shadow: 0 0 25px rgba(255, 107, 0, 0.1);
        }

        .afirmacion-decoracion-izq,
        .afirmacion-decoracion-der {
          font-size: 24px;
          color: var(--neon-orange);
          text-shadow: 0 0 15px var(--neon-orange-glow);
        }

        .afirmacion-contenido {
          flex: 1;
          text-align: center;
        }

        .afirmacion-etiqueta {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--neon-green);
          text-shadow: 0 0 10px var(--neon-green-glow);
          margin-bottom: 10px;
        }

        .afirmacion-texto {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-style: italic;
          color: var(--neon-orange);
          text-shadow: 0 0 10px var(--neon-orange-glow);
          margin: 0;
          line-height: 1.5;
        }

        /* Imagen generada o placeholder - NEÓN */
        .contenido-imagen-generada {
          padding: 0 30px 30px;
        }

        .imagen-contenido-real {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: cover;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 240, 255, 0.2);
        }

        .imagen-placeholder {
          position: relative;
          height: 200px;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.05), rgba(255, 0, 255, 0.05));
          border: 1px solid rgba(0, 240, 255, 0.2);
        }

        .imagen-patron-fondo {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(255, 0, 255, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(0, 240, 255, 0.1) 0%, transparent 40%);
        }

        .imagen-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .imagen-icono {
          font-size: 40px;
          opacity: 0.6;
        }

        .imagen-texto {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        /* Cierre - NEÓN */
        .contenido-cierre {
          margin: 0 30px 30px;
          padding: 20px;
          border-left: 3px solid var(--neon-green);
          background: rgba(57, 255, 20, 0.05);
          border-radius: 0 12px 12px 0;
        }

        .contenido-cierre p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
          margin: 0;
        }

        /* Firma - NEÓN */
        .contenido-firma {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 25px 30px;
          border-top: 1px solid rgba(255, 0, 255, 0.15);
        }

        .firma-linea {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 0, 255, 0.4), transparent);
        }

        .firma-texto {
          font-family: 'Tangerine', cursive;
          font-size: 28px;
          color: var(--neon-magenta);
          text-shadow: 0 0 15px var(--neon-magenta-glow);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .contenido-cabecera {
            gap: 15px;
          }

          .contenido-titulo-principal {
            font-size: 38px;
          }

          .contenido-banner {
            padding: 15px 20px;
          }

          .contenido-header-estetico {
            padding: 20px;
          }

          .contenido-titulos,
          .contenido-cuerpo,
          .contenido-imagen-generada {
            padding-left: 20px;
            padding-right: 20px;
          }

          .contenido-afirmacion,
          .contenido-cierre {
            margin-left: 20px;
            margin-right: 20px;
          }

          .contenido-ritual {
            margin: 20px;
            padding: 20px;
          }

          .contenido-titulo {
            font-size: 22px;
          }

          .sidebar-item {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN CURSOS
// Cursos mensuales del Círculo - 4 módulos, 4 duendes
// ═══════════════════════════════════════════════════════════════════════════════

function SeccionCursos({ usuario }) {
  const [cursos, setCursos] = useState([]);
  const [cursoActivo, setCursoActivo] = useState(null);
  const [progreso, setProgreso] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCursos();
  }, []);

  async function cargarCursos() {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/cursos?tipo=publico');
      const data = await res.json();
      if (data.success) {
        const publicados = data.cursos.filter(c => c.estado === 'publicado');
        setCursos(publicados);
        if (publicados.length > 0) {
          setCursoActivo(publicados[0]);
        }
      }
    } catch (error) {
      console.error('Error cargando cursos:', error);
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <div className="seccion-cursos cargando">
        <div className="curso-loader">
          <div className="loader-libro">📚</div>
          <p>Cargando cursos mágicos...</p>
        </div>
        <style jsx>{`
          .seccion-cursos.cargando {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            color: rgba(255, 255, 255, 0.6);
          }
          .loader-libro {
            font-size: 48px;
            animation: floatBook 2s ease-in-out infinite;
            margin-bottom: 20px;
          }
          @keyframes floatBook {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="seccion-cursos">
      {/* Header */}
      <div className="cursos-header">
        <div className="header-decoracion izq"></div>
        <div className="header-centro">
          <span className="header-icono">📚</span>
          <h2>Academia de los Guardianes</h2>
          <p>Cursos mensuales impartidos por los duendes más sabios</p>
        </div>
        <div className="header-decoracion der"></div>
      </div>

      {cursos.length === 0 ? (
        <div className="cursos-vacio">
          <div className="vacio-icono">📖</div>
          <h3>Próximamente</h3>
          <p>Los guardianes están preparando cursos mágicos para vos...</p>
          <span className="vacio-firma">— El Círculo</span>
        </div>
      ) : (
        <div className="cursos-contenido">
          {/* Lista de cursos disponibles */}
          <div className="cursos-lista">
            {cursos.map(curso => (
              <button
                key={curso.id}
                className={`curso-card ${cursoActivo?.id === curso.id ? 'activo' : ''}`}
                onClick={() => setCursoActivo(curso)}
              >
                <div className="curso-card-header">
                  <span className="curso-mes">{curso.mes} {curso.año}</span>
                  {curso.badge && <span className="curso-badge-icon">{curso.badge.icono}</span>}
                </div>
                <h4 className="curso-nombre">{curso.nombre}</h4>
                <div className="curso-stats">
                  <span>📖 {curso.totalModulos || 4} módulos</span>
                  <span>🧙 {curso.duendes?.length || 4} guardianes</span>
                </div>
                {curso.progreso?.porcentaje > 0 && (
                  <div className="curso-progreso-mini">
                    <div className="progreso-barra-mini">
                      <div className="progreso-fill-mini" style={{ width: `${curso.progreso.porcentaje}%` }}></div>
                    </div>
                    <span>{curso.progreso.porcentaje}%</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Detalle del curso activo */}
          {cursoActivo && (
            <div className="curso-detalle">
              {/* Banner del curso */}
              <div className="curso-banner">
                <div className="banner-patron-curso"></div>
                <div className="banner-info">
                  <span className="curso-portal">{cursoActivo.portalInfo?.nombre || 'Portal Mágico'}</span>
                  <h3>{cursoActivo.nombre}</h3>
                  <p>{cursoActivo.descripcion}</p>
                </div>
                {cursoActivo.badge && (
                  <div className="banner-badge">
                    <span className="badge-big-icon">{cursoActivo.badge.icono}</span>
                    <span className="badge-nombre">{cursoActivo.badge.nombre}</span>
                  </div>
                )}
              </div>

              {/* Módulos del curso */}
              <div className="modulos-grid">
                <h4 className="modulos-titulo">
                  <span className="titulo-linea"></span>
                  <span>Los 4 Módulos</span>
                  <span className="titulo-linea"></span>
                </h4>

                {cursoActivo.modulos?.map((modulo, idx) => (
                  <div key={idx} className="modulo-card">
                    {/* Número de semana */}
                    <div className="modulo-numero">
                      <span className="numero-semana">Semana {idx + 1}</span>
                      <span className="numero-big">{idx + 1}</span>
                    </div>

                    {/* Info del módulo */}
                    <div className="modulo-info">
                      <h5>{modulo.titulo}</h5>

                      {/* Duende profesor */}
                      {modulo.duende && (
                        <div className="modulo-duende">
                          <div className="duende-avatar-mini">
                            <span className="avatar-placeholder">🧙</span>
                          </div>
                          <div className="duende-datos">
                            <span className="duende-nombre">{modulo.duende.nombre}</span>
                            <span className="duende-categoria">{modulo.duende.categoria}</span>
                          </div>
                        </div>
                      )}

                      {/* Preview del contenido */}
                      {modulo.contenido?.introduccion && (
                        <p className="modulo-preview">
                          {modulo.contenido.introduccion.substring(0, 150)}...
                        </p>
                      )}

                      {/* Cristales del duende */}
                      {modulo.duende?.cristales && (
                        <div className="modulo-cristales">
                          {modulo.duende.cristales.map((cristal, i) => (
                            <span key={i} className="cristal-tag">💎 {cristal}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Duración */}
                    <div className="modulo-duracion">
                      <span className="duracion-icono">⏱️</span>
                      <span>{modulo.duracion_minutos || 30} min</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón para ir al curso */}
              <div className="curso-cta">
                <a href={`/circulo/cursos/${cursoActivo.id}`} className="btn-empezar-curso">
                  <span>Comenzar el Curso</span>
                  <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .seccion-cursos {
          animation: fadeIn 0.5s ease;
        }

        /* Header */
        .cursos-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          margin-bottom: 50px;
          text-align: center;
        }

        .header-decoracion {
          flex: 1;
          max-width: 150px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
        }

        .header-centro {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .header-icono {
          font-size: 48px;
          animation: floatBook 3s ease-in-out infinite;
        }

        .header-centro h2 {
          font-family: 'Tangerine', cursive;
          font-size: 52px;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
        }

        .header-centro p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        /* Vacío */
        .cursos-vacio {
          text-align: center;
          padding: 80px 40px;
          background: rgba(30, 35, 25, 0.5);
          border: 1px solid rgba(85, 107, 47, 0.3);
          border-radius: 20px;
        }

        .vacio-icono {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .cursos-vacio h3 {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          color: #d4af37;
          margin: 0 0 15px;
        }

        .cursos-vacio p {
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 20px;
        }

        .vacio-firma {
          font-style: italic;
          color: rgba(212, 175, 55, 0.6);
        }

        /* Contenido */
        .cursos-contenido {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        @media (min-width: 1100px) {
          .cursos-contenido {
            grid-template-columns: 300px 1fr;
          }
        }

        /* Lista de cursos */
        .cursos-lista {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        @media (min-width: 1100px) {
          .cursos-lista {
            position: sticky;
            top: 100px;
            height: fit-content;
          }
        }

        .curso-card {
          background: rgba(30, 35, 25, 0.8);
          border: 1px solid rgba(85, 107, 47, 0.3);
          border-radius: 16px;
          padding: 20px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .curso-card:hover {
          border-color: rgba(212, 175, 55, 0.4);
          transform: translateX(5px);
        }

        .curso-card.activo {
          background: rgba(85, 107, 47, 0.3);
          border-color: #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
        }

        .curso-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .curso-mes {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.8);
        }

        .curso-badge-icon {
          font-size: 20px;
        }

        .curso-nombre {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          color: #ffffff;
          margin: 0 0 12px;
        }

        .curso-stats {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .curso-progreso-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 12px;
        }

        .progreso-barra-mini {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .progreso-fill-mini {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #8b6914);
          transition: width 0.3s ease;
        }

        .curso-progreso-mini span {
          font-size: 11px;
          color: #d4af37;
        }

        /* Detalle del curso */
        .curso-detalle {
          background: rgba(20, 25, 18, 0.9);
          border: 1px solid rgba(85, 107, 47, 0.3);
          border-radius: 20px;
          overflow: hidden;
        }

        .curso-banner {
          position: relative;
          padding: 40px 30px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(85, 107, 47, 0.1));
        }

        .banner-patron-curso {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(212, 175, 55, 0.1) 1px, transparent 1px);
          background-size: 25px 25px;
          pointer-events: none;
        }

        .banner-info {
          position: relative;
          z-index: 1;
        }

        .curso-portal {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(212, 175, 55, 0.8);
          display: block;
          margin-bottom: 10px;
        }

        .banner-info h3 {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          color: #ffffff;
          margin: 0 0 15px;
        }

        .banner-info p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          line-height: 1.6;
        }

        .banner-badge {
          position: absolute;
          top: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          text-align: center;
        }

        .badge-big-icon {
          font-size: 40px;
        }

        .badge-nombre {
          font-size: 11px;
          color: rgba(212, 175, 55, 0.8);
          max-width: 100px;
        }

        /* Módulos */
        .modulos-grid {
          padding: 30px;
        }

        .modulos-titulo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-family: 'Cinzel', serif;
          font-size: 16px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #d4af37;
          margin: 0 0 30px;
        }

        .titulo-linea {
          flex: 1;
          max-width: 100px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
        }

        .modulo-card {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 25px;
          padding: 25px;
          background: rgba(45, 55, 40, 0.3);
          border: 1px solid rgba(85, 107, 47, 0.3);
          border-radius: 16px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .modulo-card:hover {
          border-color: rgba(212, 175, 55, 0.4);
          background: rgba(85, 107, 47, 0.2);
        }

        .modulo-numero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .numero-semana {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 5px;
        }

        .numero-big {
          font-family: 'Tangerine', cursive;
          font-size: 48px;
          color: #d4af37;
          line-height: 1;
        }

        .modulo-info h5 {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          color: #ffffff;
          margin: 0 0 15px;
        }

        .modulo-duende {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
        }

        .duende-avatar-mini {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #8b6914);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-placeholder {
          font-size: 24px;
        }

        .duende-datos {
          display: flex;
          flex-direction: column;
        }

        .duende-nombre {
          font-family: 'Cinzel', serif;
          font-size: 15px;
          color: #ffffff;
        }

        .duende-categoria {
          font-size: 12px;
          color: rgba(212, 175, 55, 0.8);
        }

        .modulo-preview {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin: 0 0 15px;
        }

        .modulo-cristales {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cristal-tag {
          font-size: 11px;
          color: rgba(212, 175, 55, 0.7);
          background: rgba(212, 175, 55, 0.1);
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .modulo-duracion {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .duracion-icono {
          font-size: 20px;
        }

        /* CTA */
        .curso-cta {
          padding: 30px;
          text-align: center;
          border-top: 1px solid rgba(85, 107, 47, 0.2);
        }

        .btn-empezar-curso {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-decoration: none;
          padding: 18px 40px;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .btn-empezar-curso:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
        }

        .btn-arrow {
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        .btn-empezar-curso:hover .btn-arrow {
          transform: translateX(5px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-centro h2 {
            font-size: 38px;
          }

          .modulo-card {
            grid-template-columns: 60px 1fr;
          }

          .modulo-duracion {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: flex-start;
            padding-top: 15px;
            border-top: 1px solid rgba(85, 107, 47, 0.2);
            margin-top: 15px;
          }

          .banner-badge {
            position: static;
            margin-top: 20px;
            flex-direction: row;
            gap: 10px;
          }
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
        /* ═══════════════════════════════════════════════════════════════════════════
           FORO - ESTÉTICA NEÓN PREMIUM
           ═══════════════════════════════════════════════════════════════════════════ */
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
          background: linear-gradient(135deg, var(--neon-green), var(--neon-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 5px;
        }

        .foro-miembros {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .btn-nuevo-post {
          background: linear-gradient(135deg, var(--neon-green), #2dcc70);
          color: #000;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          padding: 15px 30px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px var(--neon-green-glow);
        }

        .btn-nuevo-post:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 35px var(--neon-green-glow);
        }

        /* Categorías - NEÓN */
        .foro-categorias {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .cat-btn {
          background: rgba(15, 15, 25, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          padding: 10px 18px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cat-btn:hover {
          border-color: var(--neon-blue);
          color: #ffffff;
          box-shadow: 0 0 15px var(--neon-blue-glow);
        }

        .cat-btn.active {
          background: rgba(0, 240, 255, 0.1);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
          box-shadow: 0 0 20px var(--neon-blue-glow);
        }

        /* Posts - NEÓN */
        .posts-lista {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cargando, .sin-posts {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          padding: 60px;
          font-style: italic;
        }

        .post-card {
          background: rgba(15, 15, 25, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 25px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .post-card:hover {
          background: rgba(25, 25, 40, 0.8);
          border-color: var(--neon-magenta);
          box-shadow: 0 0 20px var(--neon-magenta-glow);
        }

        .post-card.expandido {
          background: rgba(255, 0, 255, 0.05);
          border-color: var(--neon-magenta);
          box-shadow: 0 0 25px var(--neon-magenta-glow);
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
          color: rgba(255, 255, 255, 0.6);
        }

        .post-meta {
          text-align: right;
        }

        .post-categoria {
          display: block;
          font-size: 12px;
          color: var(--neon-orange);
          margin-bottom: 4px;
        }

        .post-fecha {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .post-contenido {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
          margin-bottom: 15px;
        }

        .post-guardian-tag {
          display: inline-block;
          background: rgba(255, 0, 255, 0.1);
          border: 1px solid rgba(255, 0, 255, 0.4);
          color: var(--neon-magenta);
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
          color: rgba(255, 255, 255, 0.7);
        }

        .btn-responder {
          background: transparent;
          border: 1px solid rgba(0, 240, 255, 0.4);
          color: var(--neon-blue);
          font-size: 12px;
          padding: 8px 15px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-responder:hover {
          border-color: var(--neon-blue);
          background: rgba(0, 240, 255, 0.1);
          box-shadow: 0 0 15px var(--neon-blue-glow);
        }

        /* Respuestas - NEÓN */
        .respuestas-preview {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 240, 255, 0.15);
        }

        .respuesta-item {
          display: flex;
          gap: 12px;
          padding: 15px;
          background: rgba(10, 10, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
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
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 5px;
          line-height: 1.5;
        }

        .respuesta-contenido small {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .btn-ver-todas {
          width: 100%;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          color: var(--neon-green);
          font-size: 13px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-ver-todas:hover {
          background: rgba(57, 255, 20, 0.2);
          box-shadow: 0 0 15px var(--neon-green-glow);
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
          background: linear-gradient(135deg, var(--neon-orange), var(--neon-magenta));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 20px;
        }

        .placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
