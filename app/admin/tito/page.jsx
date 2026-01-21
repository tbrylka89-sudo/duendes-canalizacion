'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// TITO ADMIN: ASISTENTE TODOPODEROSO
// Chat con IA que puede ejecutar cualquier acción del sistema
// ═══════════════════════════════════════════════════════════════════════════════

const LOGO_RECTANGULAR = 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/gemini-image-2_artistic_portrait_photography_of_recrea_este_exacto_logo_con_color_negro_el_meda-1-scaled.jpg';

const EJEMPLOS_COMANDOS = [
  { cat: '📜 Canalizaciones', cmds: [
    '¿Hay canalizaciones pendientes?',
    'Aprueba todas las canalizaciones',
    'Muéstrame la canalización de María',
    'Dame las stats de canalizaciones'
  ]},
  { cat: '🔄 Recanalizaciones', cmds: [
    '¿Hay solicitudes de recanalización?',
    'Crea recanalización para cliente@email.com',
    'Aprueba la recanalización pendiente',
    'Lista todas las recanalizaciones'
  ]},
  { cat: '👥 Usuarios', cmds: [
    'Busca al cliente María González',
    'Dale 100 tréboles a cliente@email.com',
    'Regala 1 mes de Círculo a X',
    'Muéstrame los clientes VIP'
  ]},
  { cat: '📝 Contenido', cmds: [
    'Genera el contenido de mañana',
    'Cambia el duende de la semana',
    '¿Qué contenido hay programado?',
    'Publica el contenido de hoy'
  ]},
  { cat: '📢 Promociones', cmds: [
    'Crea promo 20% por 3 días',
    'Lanza promo relámpago 24h',
    'Stats de promociones',
    'Clona la mejor promo'
  ]},
  { cat: '📊 Reportes', cmds: [
    'Dame el reporte completo',
    '¿Cuántas ventas esta semana?',
    'Stats del Círculo',
    '¿Cuál fue el contenido más popular?'
  ]}
];

// Wrapper con Suspense para useSearchParams
export default function TitoAdminPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <TitoAdmin />
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#d4af37',
      fontFamily: "'Cormorant Garamond', Georgia, serif"
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
        <p>Cargando Tito Admin...</p>
      </div>
    </div>
  );
}

function TitoAdmin() {
  const searchParams = useSearchParams();
  const [autorizado, setAutorizado] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [historialLog, setHistorialLog] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    // Verificar autorización
    const key = searchParams.get('key');
    if (key === 'DuendesAdmin2026') {
      setAutorizado(true);
      // Mensaje de bienvenida
      setMensajes([{
        tipo: 'tito',
        texto: '¡Hola! Soy Tito Admin, tu asistente todopoderoso. Puedo hacer cualquier cosa en el sistema: gestionar usuarios, crear contenido, lanzar promociones, generar reportes... Solo escribí lo que necesitás en lenguaje natural.',
        timestamp: new Date().toISOString()
      }]);
      cargarHistorial();
    }
  }, [searchParams]);

  useEffect(() => {
    // Scroll al último mensaje
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  async function cargarHistorial() {
    try {
      const res = await fetch('/api/admin/tito-admin?accion=historial');
      const data = await res.json();
      if (data.success) {
        setHistorialLog(data.historial || []);
      }
    } catch (e) {
      console.error('Error cargando historial:', e);
    }
  }

  async function enviarMensaje(texto = input) {
    if (!texto.trim() || procesando) return;

    const mensajeUsuario = {
      tipo: 'usuario',
      texto: texto.trim(),
      timestamp: new Date().toISOString()
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setInput('');
    setProcesando(true);

    // Agregar mensaje de "pensando"
    setMensajes(prev => [...prev, {
      tipo: 'tito',
      texto: '🔄 Procesando...',
      pensando: true,
      timestamp: new Date().toISOString()
    }]);

    try {
      const res = await fetch('/api/admin/tito-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comando: texto.trim(),
          historialConversacion: mensajes.slice(-10) // Últimos 10 mensajes para contexto
        })
      });

      const data = await res.json();

      // Remover mensaje de "pensando" y agregar respuesta
      setMensajes(prev => {
        const sinPensando = prev.filter(m => !m.pensando);
        return [...sinPensando, {
          tipo: 'tito',
          texto: data.respuesta || 'Hubo un error procesando tu solicitud.',
          acciones: data.acciones || [],
          error: !data.success,
          timestamp: new Date().toISOString()
        }];
      });

      // Actualizar historial
      if (data.success) {
        cargarHistorial();
      }

    } catch (error) {
      setMensajes(prev => {
        const sinPensando = prev.filter(m => !m.pensando);
        return [...sinPensando, {
          tipo: 'tito',
          texto: `Error de conexión: ${error.message}`,
          error: true,
          timestamp: new Date().toISOString()
        }];
      });
    }

    setProcesando(false);
  }

  function usarEjemplo(cmd) {
    setInput(cmd);
  }

  if (!autorizado) {
    return (
      <div style={styles.container}>
        <div style={styles.noAuth}>
          <img src={LOGO_RECTANGULAR} alt="Duendes" style={styles.logoSmall} />
          <h1>🔒 Acceso Restringido</h1>
          <p>Tito Admin requiere autorización.</p>
          <p style={{color: '#666', fontSize: '0.9rem'}}>Agrega ?key=TuClave a la URL</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <img src={LOGO_RECTANGULAR} alt="Duendes" style={styles.logoSmall} />
        <div style={styles.headerInfo}>
          <h1 style={styles.title}>🤖 Tito Admin</h1>
          <p style={styles.subtitle}>Asistente Todopoderoso</p>
        </div>
        <a href="/admin/circulo" style={styles.btnBack}>← Hub Admin</a>
      </header>

      <div style={styles.mainLayout}>
        {/* Panel de ejemplos */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Ejemplos de comandos</h3>
          {EJEMPLOS_COMANDOS.map((grupo, i) => (
            <div key={i} style={styles.grupoEjemplos}>
              <h4 style={styles.grupoTitulo}>{grupo.cat}</h4>
              {grupo.cmds.map((cmd, j) => (
                <button
                  key={j}
                  style={styles.btnEjemplo}
                  onClick={() => usarEjemplo(cmd)}
                >
                  {cmd}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Chat principal */}
        <main style={styles.chatArea}>
          <div ref={chatRef} style={styles.mensajes}>
            {mensajes.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.mensaje,
                  ...(msg.tipo === 'usuario' ? styles.mensajeUsuario : styles.mensajeTito),
                  ...(msg.error ? styles.mensajeError : {}),
                  ...(msg.pensando ? styles.mensajePensando : {})
                }}
              >
                {msg.tipo === 'tito' && <span style={styles.titoAvatar}>🤖</span>}
                <div style={styles.mensajeContenido}>
                  <p style={styles.mensajeTexto}>{msg.texto}</p>
                  {msg.acciones && msg.acciones.length > 0 && (
                    <div style={styles.acciones}>
                      {msg.acciones.map((acc, j) => (
                        <div key={j} style={styles.accion}>
                          <span style={styles.accionIcon}>{acc.ok ? '✓' : '✗'}</span>
                          <span>{acc.descripcion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <span style={styles.timestamp}>
                    {new Date(msg.timestamp).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
              placeholder="Escribí lo que necesitás..."
              style={styles.input}
              disabled={procesando}
            />
            <button
              onClick={() => enviarMensaje()}
              style={styles.btnEnviar}
              disabled={procesando || !input.trim()}
            >
              {procesando ? '...' : '→'}
            </button>
          </div>
        </main>

        {/* Historial de acciones */}
        <aside style={styles.historialPanel}>
          <h3 style={styles.sidebarTitle}>Últimas acciones</h3>
          <div style={styles.historialList}>
            {historialLog.slice(0, 15).map((log, i) => (
              <div key={i} style={styles.historialItem}>
                <span style={styles.historialIcon}>{log.ok ? '✓' : '!'}</span>
                <div>
                  <p style={styles.historialAccion}>{log.accion}</p>
                  <span style={styles.historialFecha}>
                    {new Date(log.fecha).toLocaleString('es-UY', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {historialLog.length === 0 && (
              <p style={{color: '#666', fontSize: '0.85rem'}}>Sin acciones recientes</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: '#fff'
  },
  noAuth: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    gap: '1rem'
  },
  logoSmall: {
    width: '150px',
    borderRadius: '8px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(212,175,55,0.2)',
    background: 'rgba(0,0,0,0.2)'
  },
  headerInfo: {
    flex: 1
  },
  title: {
    fontSize: '1.5rem',
    color: '#d4af37',
    margin: 0
  },
  subtitle: {
    color: '#888',
    margin: 0,
    fontSize: '0.9rem'
  },
  btnBack: {
    color: '#888',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    border: '1px solid #444',
    borderRadius: '6px',
    fontSize: '0.9rem'
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr 250px',
    height: 'calc(100vh - 80px)',
    gap: '0'
  },
  sidebar: {
    background: 'rgba(0,0,0,0.2)',
    padding: '1rem',
    overflowY: 'auto',
    borderRight: '1px solid rgba(255,255,255,0.1)'
  },
  sidebarTitle: {
    fontSize: '0.9rem',
    color: '#d4af37',
    margin: '0 0 1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  grupoEjemplos: {
    marginBottom: '1.5rem'
  },
  grupoTitulo: {
    fontSize: '0.85rem',
    color: '#888',
    margin: '0 0 0.5rem'
  },
  btnEjemplo: {
    display: 'block',
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    marginBottom: '0.5rem',
    color: '#ccc',
    fontSize: '0.8rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(0,0,0,0.1)'
  },
  mensajes: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  mensaje: {
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '85%'
  },
  mensajeUsuario: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse'
  },
  mensajeTito: {
    alignSelf: 'flex-start'
  },
  mensajeError: {
    opacity: 0.8
  },
  mensajePensando: {
    opacity: 0.6
  },
  titoAvatar: {
    fontSize: '1.5rem',
    background: 'linear-gradient(135deg, #d4af37, #b8962e)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  mensajeContenido: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '0.75rem 1rem'
  },
  mensajeTexto: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5
  },
  acciones: {
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  accion: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#aaa',
    marginBottom: '0.25rem'
  },
  accionIcon: {
    color: '#27ae60',
    fontWeight: 'bold'
  },
  timestamp: {
    display: 'block',
    fontSize: '0.7rem',
    color: '#666',
    marginTop: '0.5rem',
    textAlign: 'right'
  },
  inputArea: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)'
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'inherit'
  },
  btnEnviar: {
    background: 'linear-gradient(135deg, #d4af37, #b8962e)',
    border: 'none',
    borderRadius: '8px',
    padding: '0 1.5rem',
    color: '#1a1a1a',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  historialPanel: {
    background: 'rgba(0,0,0,0.2)',
    padding: '1rem',
    overflowY: 'auto',
    borderLeft: '1px solid rgba(255,255,255,0.1)'
  },
  historialList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  historialItem: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.5rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '6px'
  },
  historialIcon: {
    color: '#27ae60',
    fontWeight: 'bold'
  },
  historialAccion: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#ccc'
  },
  historialFecha: {
    fontSize: '0.7rem',
    color: '#666'
  }
};
