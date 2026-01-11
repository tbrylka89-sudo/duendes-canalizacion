'use client';
import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
// TITO MAESTRO - PAGINA COMPLETA DE ADMIN
// El asistente omnipotente con historial
// ═══════════════════════════════════════════════════════════════

const TITO_IMG = 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg';

// Acciones rápidas para contenido
const ACCIONES_CONTENIDO = [
  { icon: '📱', label: 'Post Instagram', prompt: 'Generame un post para Instagram sobre ' },
  { icon: '📘', label: 'Post Facebook', prompt: 'Generame un post para Facebook sobre ' },
  { icon: '📝', label: 'Caption Story', prompt: 'Generame un caption para una story de Instagram sobre ' },
  { icon: '🧵', label: 'Hilo Twitter', prompt: 'Generame un hilo de Twitter/X sobre ' },
  { icon: '📧', label: 'Email Marketing', prompt: 'Generame un email de marketing para el Círculo sobre ' },
  { icon: '🎬', label: 'Guión Reel', prompt: 'Generame un guión para un reel corto sobre ' },
];

export default function TitoMaestroPage() {
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [stats, setStats] = useState(null);
  const [conversaciones, setConversaciones] = useState([]);
  const [conversacionActual, setConversacionActual] = useState(null);
  const [showHistorial, setShowHistorial] = useState(false);
  const [modoContenido, setModoContenido] = useState(false);
  const messagesEndRef = useRef(null);

  // Cargar conversaciones guardadas
  useEffect(() => {
    cargarStats();
    cargarConversaciones();
  }, []);

  const cargarConversaciones = () => {
    try {
      const saved = localStorage.getItem('tito_conversaciones');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConversaciones(parsed);
      }
    } catch (e) {
      console.error('Error cargando conversaciones:', e);
    }

    // Mensaje de bienvenida
    setMensajes([{
      rol: 'asistente',
      texto: `¡Hola! 👋 Soy **Tito Maestro**, tu asistente omnipotente.

Puedo ayudarte con absolutamente todo:

📋 **Clientes** - Buscar, editar, dar runas/treboles, ver historial
⭐ **Circulo** - Activar, extender, desactivar, ver miembros
🛒 **Ordenes** - Ver pendientes, actualizar estados, reembolsar
📦 **Productos** - Stock, precios, sincronizar WooCommerce
🎫 **Cupones** - Crear, ver, desactivar
📊 **Stats** - Ventas, clientes, productos, proyecciones
📝 **Contenido** - Articulos, posts para redes, emails marketing
🎨 **Creatividad** - Generar imágenes y audio
💡 **Inteligencia** - Sugerencias, clientes en riesgo, oportunidades

**Ejemplos de lo que podes pedirme:**
- "Busca a maria"
- "Dale 50 runas a juan@mail.com por su cumpleaños"
- "Genera un post de Instagram sobre luna llena"
- "Que deberia hacer hoy?"

¡Preguntame lo que necesites!`
    }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  const cargarStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success !== false) {
        setStats(data);
      }
    } catch (e) {}
  };

  // Guardar conversación actual
  const guardarConversacion = () => {
    if (mensajes.length <= 1) return; // Solo bienvenida

    const titulo = mensajes.find(m => m.rol === 'usuario')?.texto?.substring(0, 50) || 'Conversación';
    const conv = {
      id: Date.now(),
      titulo,
      mensajes: mensajes,
      fecha: new Date().toISOString()
    };

    const nuevas = [conv, ...conversaciones].slice(0, 20); // Max 20 conversaciones
    setConversaciones(nuevas);
    setConversacionActual(conv.id);
    localStorage.setItem('tito_conversaciones', JSON.stringify(nuevas));
  };

  // Cargar conversación guardada
  const cargarConversacion = (conv) => {
    setMensajes(conv.mensajes);
    setConversacionActual(conv.id);
    setShowHistorial(false);
  };

  // Nueva conversación
  const nuevaConversacion = () => {
    if (mensajes.length > 1) {
      guardarConversacion();
    }
    setConversacionActual(null);
    cargarConversaciones();
  };

  // Eliminar conversación
  const eliminarConversacion = (id) => {
    const nuevas = conversaciones.filter(c => c.id !== id);
    setConversaciones(nuevas);
    localStorage.setItem('tito_conversaciones', JSON.stringify(nuevas));
  };

  const enviarMensaje = async () => {
    if (!input.trim() || cargando) return;

    const mensaje = input.trim();
    setInput('');

    // Agregar mensaje del usuario
    const nuevosMensajes = [...mensajes, { rol: 'usuario', texto: mensaje }];
    setMensajes(nuevosMensajes);

    const nuevoHistorial = [...historial, { rol: 'usuario', texto: mensaje }];
    setHistorial(nuevoHistorial);

    setCargando(true);

    try {
      const res = await fetch('/api/tito/maestro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje,
          historial: nuevoHistorial.slice(-15)
        })
      });

      const data = await res.json();

      if (data.success) {
        const mensajesFinal = [...nuevosMensajes, { rol: 'asistente', texto: data.respuesta }];
        setMensajes(mensajesFinal);
        setHistorial([...nuevoHistorial, { rol: 'tito', texto: data.respuesta }]);

        // Auto-guardar conversación después de cada respuesta
        setTimeout(() => {
          const titulo = nuevosMensajes.find(m => m.rol === 'usuario')?.texto?.substring(0, 50) || 'Conversación';
          const convId = conversacionActual || Date.now();
          const conv = {
            id: convId,
            titulo,
            mensajes: mensajesFinal,
            fecha: new Date().toISOString()
          };

          let nuevas;
          if (conversacionActual) {
            nuevas = conversaciones.map(c => c.id === conversacionActual ? conv : c);
          } else {
            nuevas = [conv, ...conversaciones].slice(0, 20);
            setConversacionActual(convId);
          }
          setConversaciones(nuevas);
          localStorage.setItem('tito_conversaciones', JSON.stringify(nuevas));
        }, 100);
      } else {
        setMensajes([...nuevosMensajes, { rol: 'asistente', texto: data.respuesta || 'Error procesando tu mensaje.' }]);
      }

      // Recargar stats si se hicieron cambios
      if (data.acciones_ejecutadas > 0) {
        cargarStats();
      }

    } catch (error) {
      setMensajes([...nuevosMensajes, { rol: 'asistente', texto: 'Error de conexion. Intenta de nuevo.' }]);
    }

    setCargando(false);
  };

  const enviarRapido = (texto) => {
    setInput(texto);
    setTimeout(() => {
      const btn = document.getElementById('tito-send-btn');
      if (btn) btn.click();
    }, 100);
  };

  const formatearMensaje = (texto) => {
    if (!texto) return '';

    return texto
      // Headers
      .replace(/^### (.+)$/gm, '<h4 style="color:#C6A962;margin:16px 0 8px;font-size:14px">$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 style="color:#C6A962;margin:16px 0 8px;font-size:16px">$1</h3>')
      .replace(/^# (.+)$/gm, '<h3 style="color:#C6A962;margin:16px 0 8px;font-size:18px">$1</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>')
      // Italic
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Code inline
      .replace(/`(.+?)`/g, '<code style="background:#0a0a0a;padding:2px 6px;border-radius:4px;font-family:monospace">$1</code>')
      // Lists
      .replace(/^- (.+)$/gm, '• $1')
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  return (
    <div style={estilos.container}>
      {/* Header */}
      <div style={estilos.header}>
        <div style={estilos.headerLeft}>
          <img src={TITO_IMG} alt="Tito" style={estilos.avatar} onError={e => e.target.style.background='#C6A962'} />
          <div>
            <h1 style={estilos.titulo}>Tito Maestro</h1>
            <p style={estilos.subtitulo}>Tu asistente omnipotente - Sin limitaciones</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setShowHistorial(!showHistorial)}
            style={{
              padding: '8px 16px',
              background: showHistorial ? 'rgba(198,169,98,0.2)' : '#1f1f1f',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: showHistorial ? '#C6A962' : '#888',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            📜 Historial ({conversaciones.length})
          </button>
          <button
            onClick={nuevaConversacion}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, rgba(198,169,98,0.2), rgba(198,169,98,0.1))',
              border: '1px solid rgba(198,169,98,0.3)',
              borderRadius: '8px',
              color: '#C6A962',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            + Nueva
          </button>
          <div style={estilos.status}>
            <span style={estilos.statusDot}></span>
            En linea
          </div>
        </div>
      </div>

      {/* Panel de historial */}
      {showHistorial && (
        <div style={{
          position: 'absolute',
          top: '70px',
          right: '20px',
          width: '350px',
          maxHeight: '500px',
          background: '#141414',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          zIndex: 100,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #2a2a2a' }}>
            <h3 style={{ color: '#C6A962', fontSize: '14px', margin: 0 }}>📜 Conversaciones guardadas</h3>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {conversaciones.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '30px', fontSize: '13px' }}>
                No hay conversaciones guardadas
              </p>
            ) : (
              conversaciones.map(conv => (
                <div
                  key={conv.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #1f1f1f',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: conv.id === conversacionActual ? 'rgba(198,169,98,0.1)' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => cargarConversacion(conv)}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: '13px', margin: 0, marginBottom: '4px' }}>
                      {conv.titulo}...
                    </p>
                    <p style={{ color: '#666', fontSize: '11px', margin: 0 }}>
                      {new Date(conv.fecha).toLocaleDateString('es-UY')} • {conv.mensajes.length} mensajes
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); eliminarConversacion(conv.id); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div style={estilos.main}>
        {/* Chat */}
        <div style={estilos.chatArea}>
          <div style={estilos.messages}>
            {mensajes.map((m, i) => (
              <div
                key={i}
                style={{
                  ...estilos.message,
                  ...(m.rol === 'usuario' ? estilos.messageUser : estilos.messageAssistant)
                }}
                dangerouslySetInnerHTML={{ __html: formatearMensaje(m.texto) }}
              />
            ))}
            {cargando && (
              <div style={estilos.typing}>
                <span style={estilos.typingDot}></span>
                <span style={{ ...estilos.typingDot, animationDelay: '0.2s' }}></span>
                <span style={{ ...estilos.typingDot, animationDelay: '0.4s' }}></span>
                <span style={{ marginLeft: '8px', color: '#888' }}>Tito esta pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias */}
          <div style={estilos.suggestions}>
            {[
              'Que hacer hoy',
              'Stats generales',
              'Ordenes pendientes',
              'Clientes en riesgo',
              'Productos sin stock'
            ].map((s, i) => (
              <button
                key={i}
                onClick={() => enviarRapido(s)}
                style={estilos.suggestionBtn}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={estilos.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
              placeholder="Escribi tu mensaje... (ej: busca a maria, dale 50 runas a juan@mail.com)"
              style={estilos.input}
              disabled={cargando}
            />
            <button
              id="tito-send-btn"
              onClick={enviarMensaje}
              style={estilos.sendBtn}
              disabled={cargando}
            >
              {cargando ? '...' : 'Enviar'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={estilos.sidebar}>
          {/* Stats */}
          {stats && (
            <div style={estilos.card}>
              <h3 style={estilos.cardTitle}>📊 Resumen</h3>
              <div style={estilos.statsGrid}>
                <div style={estilos.statItem}>
                  <span style={estilos.statValue}>{stats.clientesTotal || 0}</span>
                  <span style={estilos.statLabel}>Clientes</span>
                </div>
                <div style={estilos.statItem}>
                  <span style={estilos.statValue}>{stats.miembrosCirculo || 0}</span>
                  <span style={estilos.statLabel}>Circulo</span>
                </div>
                <div style={estilos.statItem}>
                  <span style={estilos.statValue}>{stats.ventasMes || 0}</span>
                  <span style={estilos.statLabel}>Ventas/mes</span>
                </div>
                <div style={estilos.statItem}>
                  <span style={estilos.statValue}>${stats.ingresosMes || 0}</span>
                  <span style={estilos.statLabel}>Ingresos</span>
                </div>
              </div>
            </div>
          )}

          {/* Acciones rapidas */}
          <div style={estilos.card}>
            <h3 style={estilos.cardTitle}>⚡ Acciones rapidas</h3>
            <div style={estilos.quickActions}>
              {[
                { icon: '📊', text: 'Stats generales', msg: 'Mostrame las estadisticas generales' },
                { icon: '🛒', text: 'Ordenes de hoy', msg: 'Ordenes del dia' },
                { icon: '⭐', text: 'Ver circulo', msg: 'Ver miembros del circulo activos' },
                { icon: '📦', text: 'Sin stock', msg: 'Productos sin stock' },
                { icon: '🔄', text: 'Sync WooCommerce', msg: 'Sincronizar productos con WooCommerce' },
                { icon: '💡', text: 'Sugerencias', msg: 'Sugerime mejoras para el negocio' },
                { icon: '⚠️', text: 'En riesgo', msg: 'Clientes en riesgo de abandono' },
                { icon: '📈', text: 'Ventas mes', msg: 'Stats de ventas del mes' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => enviarRapido(action.msg)}
                  style={estilos.quickBtn}
                >
                  <span>{action.icon}</span>
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Generación de Contenido */}
          <div style={estilos.card}>
            <h3 style={estilos.cardTitle}>📝 Generar Contenido</h3>
            <p style={{ color: '#666', fontSize: '11px', marginBottom: '12px' }}>
              Pedile a Tito que genere contenido para redes sociales
            </p>
            <div style={estilos.quickActions}>
              {ACCIONES_CONTENIDO.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const tema = prompt(`¿Sobre qué tema querés el ${action.label}?`);
                    if (tema) enviarRapido(action.prompt + tema);
                  }}
                  style={estilos.quickBtn}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ejemplos */}
          <div style={estilos.card}>
            <h3 style={estilos.cardTitle}>🎯 Ejemplos de uso</h3>
            <div style={estilos.quickActions}>
              {[
                { icon: '🔍', text: 'Buscar cliente', msg: 'Busca a maria' },
                { icon: '🎁', text: 'Dar runas', msg: 'Dale 50 runas a ejemplo@mail.com por su cumpleaños' },
                { icon: '⭐', text: 'Activar circulo', msg: 'Activa el circulo de ejemplo@mail.com por 30 dias' },
                { icon: '🎫', text: 'Crear cupon', msg: 'Crea un cupon del 20% llamado PROMO20' },
                { icon: '🎨', text: 'Generar imagen', msg: 'Genera una imagen de un duende en un bosque magico' },
                { icon: '🎙️', text: 'Generar audio', msg: 'Convierte este texto a voz: Bienvenida al Círculo de Duendes' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => enviarRapido(action.msg)}
                  style={estilos.quickBtn}
                >
                  <span>{action.icon}</span>
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Capacidades */}
          <div style={estilos.card}>
            <h3 style={estilos.cardTitle}>🦸 Superpoderes</h3>
            <div style={estilos.capabilities}>
              <span style={estilos.capBadge}>Clientes</span>
              <span style={estilos.capBadge}>Circulo</span>
              <span style={estilos.capBadge}>Ordenes</span>
              <span style={estilos.capBadge}>Productos</span>
              <span style={estilos.capBadge}>Cupones</span>
              <span style={estilos.capBadge}>Stats</span>
              <span style={estilos.capBadge}>Contenido</span>
              <span style={estilos.capBadge}>Emails</span>
              <span style={estilos.capBadge}>Redes</span>
              <span style={estilos.capBadge}>WooCommerce</span>
              <span style={estilos.capBadge}>Automatizacion</span>
              <span style={estilos.capBadge}>Inteligencia</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes typingDot {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)',
    marginTop: '-32px',
    marginLeft: '-32px',
    marginRight: '-32px',
    background: '#0a0a0a'
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: '#0f0f0f',
    borderBottom: '1px solid #2a2a2a'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '3px solid #C6A962',
    objectFit: 'cover'
  },
  titulo: {
    color: '#C6A962',
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '2px'
  },
  subtitulo: {
    color: '#888',
    fontSize: '13px'
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#4CAF50',
    fontSize: '13px'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    background: '#4CAF50',
    borderRadius: '50%',
    animation: 'pulse 2s infinite'
  },

  // Main
  main: {
    flex: 1,
    display: 'flex',
    gap: '20px',
    padding: '20px',
    overflow: 'hidden'
  },

  // Chat
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#141414',
    borderRadius: '12px',
    border: '1px solid #2a2a2a',
    overflow: 'hidden'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  message: {
    maxWidth: '85%',
    padding: '14px 18px',
    borderRadius: '16px',
    lineHeight: '1.6',
    fontSize: '14px'
  },
  messageUser: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(135deg, rgba(198,169,98,0.2) 0%, rgba(198,169,98,0.1) 100%)',
    color: '#fff',
    borderBottomRightRadius: '4px'
  },
  messageAssistant: {
    alignSelf: 'flex-start',
    background: '#1f1f1f',
    color: '#ccc',
    borderBottomLeftRadius: '4px'
  },
  typing: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    padding: '14px 18px',
    background: '#1f1f1f',
    borderRadius: '16px',
    borderBottomLeftRadius: '4px'
  },
  typingDot: {
    width: '6px',
    height: '6px',
    background: '#C6A962',
    borderRadius: '50%',
    marginRight: '4px',
    animation: 'typingDot 1.4s infinite'
  },

  // Suggestions
  suggestions: {
    display: 'flex',
    gap: '8px',
    padding: '10px 20px',
    flexWrap: 'wrap'
  },
  suggestionBtn: {
    padding: '6px 12px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    color: '#aaa',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // Input
  inputArea: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    borderTop: '1px solid #2a2a2a',
    background: '#0f0f0f'
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },
  sendBtn: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0a0a0a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Sidebar
  sidebar: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto'
  },
  card: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '16px'
  },
  cardTitle: {
    color: '#C6A962',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  },
  statItem: {
    background: '#1f1f1f',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  statValue: {
    display: 'block',
    color: '#fff',
    fontSize: '20px',
    fontWeight: '700'
  },
  statLabel: {
    color: '#888',
    fontSize: '11px',
    marginTop: '4px'
  },

  // Quick actions
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  quickBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#ccc',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  },

  // Capabilities
  capabilities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  capBadge: {
    padding: '4px 10px',
    background: 'rgba(198,169,98,0.1)',
    border: '1px solid rgba(198,169,98,0.3)',
    borderRadius: '12px',
    color: '#C6A962',
    fontSize: '10px'
  }
};
