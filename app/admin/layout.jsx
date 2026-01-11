'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════
// CONTEXTO DE ADMIN
// ═══════════════════════════════════════════════════════════════

const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

// Tito's image URL
const TITO_IMG = 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg';

// ═══════════════════════════════════════════════════════════════
// LAYOUT PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function AdminLayout({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [clave, setClave] = useState('');
  const [cargando, setCargando] = useState(true);
  const [titoAbierto, setTitoAbierto] = useState(false);
  const [titoMensajes, setTitoMensajes] = useState([]);
  const [titoInput, setTitoInput] = useState('');
  const [titoCargando, setTitoCargando] = useState(false);
  const pathname = usePathname();

  // Cargar historial de Tito y clave guardada
  useEffect(() => {
    const claveGuardada = localStorage.getItem('admin_key');
    if (claveGuardada === 'DuendesAdmin2026') {
      setAutenticado(true);
    }
    // Recuperar historial de Tito
    try {
      const historialGuardado = localStorage.getItem('tito_historial_admin');
      if (historialGuardado) {
        setTitoMensajes(JSON.parse(historialGuardado));
      }
    } catch (e) {}
    setCargando(false);
  }, []);

  // Persistir historial de Tito cuando cambie
  useEffect(() => {
    if (titoMensajes.length > 0) {
      localStorage.setItem('tito_historial_admin', JSON.stringify(titoMensajes.slice(-30)));
    }
  }, [titoMensajes]);

  const login = () => {
    if (clave === 'DuendesAdmin2026') {
      localStorage.setItem('admin_key', clave);
      setAutenticado(true);
    }
  };

  const enviarTito = async () => {
    if (!titoInput.trim() || titoCargando) return;

    const mensaje = titoInput.trim();
    setTitoInput('');
    setTitoMensajes(prev => [...prev, { rol: 'usuario', texto: mensaje }]);
    setTitoCargando(true);

    try {
      const res = await fetch('/api/admin/tito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, historial: titoMensajes })
      });
      const data = await res.json();
      setTitoMensajes(prev => [...prev, { rol: 'tito', texto: data.respuesta || 'Error al procesar' }]);
    } catch (e) {
      setTitoMensajes(prev => [...prev, { rol: 'tito', texto: 'Error de conexion' }]);
    }
    setTitoCargando(false);
  };

  if (cargando) {
    return (
      <div style={estilos.loadingPage}>
        <style>{estilosGlobales}</style>
        <div style={estilos.spinner}></div>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div style={estilos.loginPage}>
        <style>{estilosGlobales}</style>
        <div style={estilos.loginBox}>
          <div style={estilos.loginLogo}>&#10022;</div>
          <h1 style={estilos.loginTitulo}>Panel Admin</h1>
          <p style={estilos.loginSubtitulo}>Duendes del Uruguay</p>
          <input
            type="password"
            placeholder="Clave de acceso"
            value={clave}
            onChange={e => setClave(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={estilos.loginInput}
          />
          <button onClick={login} style={estilos.loginBtn}>Entrar</button>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', icono: '◇', texto: 'Dashboard' },
    { href: '/admin/insights', icono: '💡', texto: 'Insights' },
    { href: '/admin/clientes', icono: '👥', texto: 'Clientes' },
    { href: '/admin/productos', icono: '📦', texto: 'Productos' },
    { href: '/admin/contenido', icono: '📝', texto: 'Contenido' },
    { href: '/admin/circulo', icono: '★', texto: 'Circulo' },
    { href: '/admin/regalos', icono: '🎁', texto: 'Regalos' },
  ];

  return (
    <AdminContext.Provider value={{ titoAbierto, setTitoAbierto }}>
      <div style={estilos.container}>
        <style>{estilosGlobales}</style>

        {/* Sidebar */}
        <aside style={estilos.sidebar}>
          <div style={estilos.sidebarHeader}>
            <span style={estilos.sidebarLogo}>&#10022;</span>
            <span style={estilos.sidebarTitulo}>Admin</span>
          </div>

          <nav style={estilos.nav}>
            {navItems.map(item => {
              const activo = pathname === item.href ||
                (item.href !== '/admin' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...estilos.navItem,
                    ...(activo ? estilos.navItemActivo : {})
                  }}
                >
                  <span style={estilos.navIcono}>{item.icono}</span>
                  <span>{item.texto}</span>
                </Link>
              );
            })}
          </nav>

          <div style={estilos.sidebarFooter}>
            <button
              onClick={() => setTitoAbierto(true)}
              style={estilos.titoBtn}
            >
              <img src={TITO_IMG} alt="Tito" style={estilos.titoImgSmall} onError={e => e.target.style.display='none'} />
              <span>Hablar con Tito</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={estilos.main}>
          {children}
        </main>

        {/* Tito Chat Modal */}
        {titoAbierto && (
          <div style={estilos.titoOverlay} onClick={() => setTitoAbierto(false)}>
            <div style={estilos.titoModal} onClick={e => e.stopPropagation()}>
              <div style={estilos.titoHeader}>
                <div style={estilos.titoHeaderInfo}>
                  <img src={TITO_IMG} alt="Tito" style={estilos.titoAvatar} onError={e => e.target.style.display='none'} />
                  <div>
                    <strong style={{display:'block'}}>Tito</strong>
                    <small style={{color:'#888',fontSize:'12px'}}>Tu asistente magico</small>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {titoMensajes.length > 0 && (
                    <button
                      onClick={() => { setTitoMensajes([]); localStorage.removeItem('tito_historial_admin'); }}
                      style={{ ...estilos.titoCerrar, fontSize: '14px', opacity: 0.7 }}
                      title="Limpiar historial"
                    >
                      🗑️
                    </button>
                  )}
                  <button onClick={() => setTitoAbierto(false)} style={estilos.titoCerrar}>×</button>
                </div>
              </div>

              <div style={estilos.titoMensajes}>
                {titoMensajes.length === 0 && (
                  <div style={estilos.titoVacio}>
                    <p>Hola! Soy Tito, tu asistente.</p>
                    <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px' }}>
                      Puedo ayudarte a buscar clientes, dar regalos, generar contenido y mas.
                    </p>
                  </div>
                )}
                {titoMensajes.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...estilos.titoMensaje,
                      ...(msg.rol === 'usuario' ? estilos.titoMensajeUsuario : estilos.titoMensajeTito)
                    }}
                  >
                    {msg.texto}
                  </div>
                ))}
                {titoCargando && (
                  <div style={estilos.titoMensajeTito}>
                    <span style={estilos.titoTyping}>...</span>
                  </div>
                )}
              </div>

              <div style={estilos.titoInputArea}>
                <input
                  type="text"
                  placeholder="Escribi tu mensaje..."
                  value={titoInput}
                  onChange={e => setTitoInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && enviarTito()}
                  style={estilos.titoInputField}
                />
                <button onClick={enviarTito} style={estilos.titoEnviar} disabled={titoCargando}>
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilosGlobales = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #444;
  }
`;

const estilos = {
  // Loading
  loadingPage: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #222',
    borderTopColor: '#C6A962',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  // Login
  loginPage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loginBox: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '48px 40px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '380px'
  },
  loginLogo: {
    fontSize: '48px',
    color: '#C6A962',
    marginBottom: '16px'
  },
  loginTitulo: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  loginSubtitulo: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '32px'
  },
  loginInput: {
    width: '100%',
    padding: '14px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    marginBottom: '16px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  loginBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },

  // Main Layout
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0a0a0a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  // Sidebar
  sidebar: {
    width: '240px',
    background: '#0f0f0f',
    borderRight: '1px solid #1f1f1f',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 100
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid #1f1f1f',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  sidebarLogo: {
    fontSize: '24px',
    color: '#C6A962'
  },
  sidebarTitulo: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600'
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#888',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'all 0.2s'
  },
  navItemActivo: {
    background: 'rgba(198, 169, 98, 0.1)',
    color: '#C6A962'
  },
  navIcono: {
    fontSize: '18px',
    width: '24px',
    textAlign: 'center'
  },
  sidebarFooter: {
    padding: '16px 12px',
    borderTop: '1px solid #1f1f1f'
  },
  titoBtn: {
    width: '100%',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    color: '#C6A962',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  titoImgSmall: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #C6A962'
  },
  titoAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #C6A962'
  },
  titoHeaderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  // Main Content
  main: {
    flex: 1,
    marginLeft: '240px',
    padding: '32px',
    minHeight: '100vh'
  },

  // Tito Modal
  titoOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  titoModal: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  titoHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#C6A962',
    fontWeight: '600'
  },
  titoCerrar: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 8px'
  },
  titoMensajes: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: '300px'
  },
  titoVacio: {
    textAlign: 'center',
    color: '#888',
    padding: '40px 20px'
  },
  titoMensaje: {
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '85%',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  titoMensajeUsuario: {
    background: 'rgba(198, 169, 98, 0.15)',
    color: '#fff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px'
  },
  titoMensajeTito: {
    background: '#1f1f1f',
    color: '#ccc',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px'
  },
  titoTyping: {
    animation: 'pulse 1s infinite'
  },
  titoInputArea: {
    padding: '16px 20px',
    borderTop: '1px solid #2a2a2a',
    display: 'flex',
    gap: '12px'
  },
  titoInputField: {
    flex: 1,
    padding: '12px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },
  titoEnviar: {
    padding: '12px 20px',
    background: '#C6A962',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  }
};
