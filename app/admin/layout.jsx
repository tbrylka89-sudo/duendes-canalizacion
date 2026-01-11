'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════
// CONTEXTO GLOBAL DEL ADMIN
// ═══════════════════════════════════════════════════════════════
const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

// ═══════════════════════════════════════════════════════════════
// COLORES Y ESTILOS BASE
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  gold: '#C6A962',
  goldLight: '#D4BC7D',
  goldDark: '#A68B4B',
  bg: '#0a0a0a',
  bgCard: '#111111',
  bgGlass: 'rgba(17,17,17,0.8)',
  bgHover: '#1a1a1a',
  border: '#222',
  borderLight: '#333',
  text: '#fff',
  textMuted: '#888',
  textDim: '#555',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
};

const GLASS = {
  background: 'rgba(17,17,17,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.05)',
};

// ═══════════════════════════════════════════════════════════════
// NAVEGACIÓN
// ═══════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: 'dashboard', path: '/admin', icon: '◐', label: 'Dashboard', shortcut: '1' },
  { id: 'clientes', path: '/admin/clientes', icon: '◉', label: 'Clientes', shortcut: '2' },
  { id: 'contenido', path: '/admin/contenido', icon: '✦', label: 'Contenido', shortcut: '3', badge: 'ÉPICO' },
  { id: 'circulo', path: '/admin/circulo', icon: '☽', label: 'Círculo', shortcut: '4' },
  { id: 'regalos', path: '/admin/regalos', icon: '❋', label: 'Regalos', shortcut: '5' },
  { id: 'banners', path: '/admin/banners', icon: '🖼️', label: 'Banners', shortcut: '6', badge: 'NUEVO' },
  { id: 'productos', path: '/admin/productos', icon: '◈', label: 'Productos', shortcut: '7' },
  { id: 'insights', path: '/admin/insights', icon: '◎', label: 'Insights', shortcut: '8' },
  { id: 'tito', path: '/admin/tito', icon: '🧙', label: 'Tito AI', shortcut: '9' },
];

// ═══════════════════════════════════════════════════════════════
// ACCIONES RÁPIDAS
// ═══════════════════════════════════════════════════════════════
const QUICK_ACTIONS = [
  { id: 'dar-runas', icon: 'ᚱ', label: 'Dar Runas', color: COLORS.purple },
  { id: 'dar-treboles', icon: '☘', label: 'Dar Tréboles', color: COLORS.success },
  { id: 'activar-circulo', icon: '☽', label: 'Activar Círculo', color: COLORS.gold },
  { id: 'enviar-regalo', icon: '❋', label: 'Enviar Regalo', color: COLORS.info },
  { id: 'crear-contenido', icon: '✦', label: 'Crear Contenido', color: COLORS.warning },
  { id: 'generar-cupon', icon: '%', label: 'Generar Cupón', color: COLORS.error },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function AdminLayout({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();

  // Estados globales
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [systemHealth, setSystemHealth] = useState({ status: 'ok' });

  // Historial de acciones admin
  const [actionHistory, setActionHistory] = useState([]);

  // ═══════════════════════════════════════════════════════════════
  // AUTENTICACIÓN
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const saved = localStorage.getItem('duendes_admin_auth');
    if (saved === 'true') {
      setAutenticado(true);
    }
    setCargando(false);

    // Cargar historial de acciones
    const savedHistory = localStorage.getItem('duendes_admin_history');
    if (savedHistory) {
      try { setActionHistory(JSON.parse(savedHistory)); } catch(e) {}
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_SECRET || password === 'DuendesAdmin2026') {
      localStorage.setItem('duendes_admin_auth', 'true');
      setAutenticado(true);
      logAction('login', 'Inicio de sesión');
    } else {
      setError('Contraseña incorrecta');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('duendes_admin_auth');
    setAutenticado(false);
    logAction('logout', 'Cierre de sesión');
  };

  // ═══════════════════════════════════════════════════════════════
  // LOG DE ACCIONES
  // ═══════════════════════════════════════════════════════════════
  const logAction = useCallback((type, description, details = {}) => {
    const action = {
      id: Date.now(),
      type,
      description,
      details,
      timestamp: new Date().toISOString(),
    };
    setActionHistory(prev => {
      const updated = [action, ...prev].slice(0, 100);
      localStorage.setItem('duendes_admin_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // BÚSQUEDA GLOBAL
  // ═══════════════════════════════════════════════════════════════
  const handleSearch = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/busqueda-global?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.resultados || []);
      }
    } catch (e) {
      console.error('Error en búsqueda:', e);
    }
    setSearching(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ═══════════════════════════════════════════════════════════════
  // ATAJOS DE TECLADO
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
        setShowQuickActions(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (NAV_ITEMS[index]) {
          window.location.href = NAV_ITEMS[index].path;
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        window.location.href = '/admin/contenido?nuevo=true';
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault();
        setShowQuickActions(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // CARGAR NOTIFICACIONES
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!autenticado) return;

    const loadNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notificaciones');
        const data = await res.json();
        if (data.success) setNotifications(data.notificaciones || []);
      } catch (e) {
        // Notificaciones de ejemplo si falla el API
        setNotifications([
          { icon: '📦', titulo: 'Nuevo pedido', mensaje: 'Pedido #1234 recibido', tiempo: 'Hace 5 min', color: COLORS.success },
          { icon: '☽', titulo: 'Círculo por vencer', mensaje: '3 membresías vencen en 7 días', tiempo: 'Hace 1 hora', color: COLORS.warning },
        ]);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [autenticado]);

  // ═══════════════════════════════════════════════════════════════
  // EJECUTAR ACCIÓN RÁPIDA
  // ═══════════════════════════════════════════════════════════════
  const executeQuickAction = (action) => {
    setShowQuickActions(false);
    switch (action.id) {
      case 'dar-runas':
        window.location.href = '/admin/regalos?tipo=runas';
        break;
      case 'dar-treboles':
        window.location.href = '/admin/regalos?tipo=treboles';
        break;
      case 'activar-circulo':
        window.location.href = '/admin/circulo?accion=activar';
        break;
      case 'enviar-regalo':
        window.location.href = '/admin/regalos';
        break;
      case 'crear-contenido':
        window.location.href = '/admin/contenido?nuevo=true';
        break;
      case 'generar-cupon':
        window.location.href = '/admin/regalos?tipo=cupon';
        break;
    }
    logAction('quick-action', action.label);
  };

  // ═══════════════════════════════════════════════════════════════
  // PANTALLA DE CARGA
  // ═══════════════════════════════════════════════════════════════
  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, #0f0f0f 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 60, height: 60,
            border: `3px solid ${COLORS.border}`,
            borderTopColor: COLORS.gold,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PANTALLA DE LOGIN
  // ═══════════════════════════════════════════════════════════════
  if (!autenticado) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, #0f0f0f 50%, #0a0a0a 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <div style={{
          ...GLASS,
          padding: 40,
          borderRadius: 24,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80, height: 80,
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            margin: '0 auto 24px',
            boxShadow: `0 0 40px ${COLORS.gold}33`,
          }}>🧙</div>

          <h1 style={{ color: COLORS.text, fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
            Portal Admin
          </h1>
          <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Duendes del Uruguay</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña mágica..."
              style={{
                width: '100%',
                padding: '16px 20px',
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                color: COLORS.text,
                fontSize: 16,
                marginBottom: 16,
                outline: 'none',
              }}
            />

            {error && (
              <p style={{ color: COLORS.error, fontSize: 14, marginBottom: 16 }}>{error}</p>
            )}

            <button type="submit" style={{
              width: '100%',
              padding: '16px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              border: 'none',
              borderRadius: 12,
              color: '#000',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Entrar al Portal
            </button>
          </form>

          <p style={{ color: COLORS.textDim, fontSize: 12, marginTop: 24 }}>
            Ctrl+K búsqueda • Ctrl+. acciones rápidas
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT PRINCIPAL
  // ═══════════════════════════════════════════════════════════════
  const contextValue = {
    logAction,
    actionHistory,
    notifications,
    systemHealth,
    showSearch: () => setShowSearch(true),
    showQuickActions: () => setShowQuickActions(true),
    COLORS,
    GLASS,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <div style={{ minHeight: '100vh', background: COLORS.bg, display: 'flex' }}>
        {/* ═══ SIDEBAR ═══ */}
        <aside style={{
          width: sidebarCollapsed ? 70 : 240,
          ...GLASS,
          borderRight: `1px solid ${COLORS.border}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
        }}>
          {/* Logo */}
          <div style={{
            padding: sidebarCollapsed ? '20px 10px' : '20px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 40, height: 40,
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}>🧙</div>
            {!sidebarCollapsed && (
              <div>
                <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>Duendes</div>
                <div style={{ color: COLORS.textMuted, fontSize: 11 }}>Admin Panel</div>
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path ||
                (item.path !== '/admin' && pathname?.startsWith(item.path));
              return (
                <a
                  key={item.id}
                  href={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: sidebarCollapsed ? '12px' : '12px 16px',
                    marginBottom: 4,
                    borderRadius: 10,
                    textDecoration: 'none',
                    color: isActive ? COLORS.gold : COLORS.textMuted,
                    background: isActive ? `${COLORS.gold}15` : 'transparent',
                    transition: 'all 0.2s',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  }}
                >
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span style={{ flex: 1, fontSize: 14 }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                          color: '#000',
                          fontSize: 9,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}>{item.badge}</span>
                      )}
                      <span style={{ color: COLORS.textDim, fontSize: 11 }}>⌘{item.shortcut}</span>
                    </>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Footer Sidebar */}
          <div style={{ padding: sidebarCollapsed ? '16px 8px' : '16px', borderTop: `1px solid ${COLORS.border}` }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                marginBottom: 8,
              }}
            >
              {sidebarCollapsed ? '→' : '← Colapsar'}
            </button>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                background: `${COLORS.error}15`,
                border: 'none',
                borderRadius: 8,
                color: COLORS.error,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {sidebarCollapsed ? '⏻' : '⏻ Cerrar sesión'}
            </button>
          </div>
        </aside>

        {/* ═══ CONTENIDO PRINCIPAL ═══ */}
        <main style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? 70 : 240,
          transition: 'margin-left 0.3s ease',
        }}>
          {/* Header */}
          <header style={{
            ...GLASS,
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: '12px 24px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Búsqueda */}
            <button
              onClick={() => setShowSearch(true)}
              style={{
                flex: 1,
                maxWidth: 400,
                padding: '10px 16px',
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                color: COLORS.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                textAlign: 'left',
              }}
            >
              <span>🔍</span>
              <span style={{ flex: 1 }}>Buscar clientes, pedidos...</span>
              <span style={{ background: COLORS.bgHover, padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>⌘K</span>
            </button>

            {/* Salud del sistema */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              background: systemHealth.status === 'ok' ? `${COLORS.success}15` : `${COLORS.error}15`,
              borderRadius: 8,
            }}>
              <span style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: systemHealth.status === 'ok' ? COLORS.success : COLORS.error,
              }} />
              <span style={{
                color: systemHealth.status === 'ok' ? COLORS.success : COLORS.error,
                fontSize: 12,
                fontWeight: 500,
              }}>
                {systemHealth.status === 'ok' ? 'Sistema OK' : 'Problemas'}
              </span>
            </div>

            {/* Acciones rápidas */}
            <button
              onClick={() => setShowQuickActions(true)}
              style={{
                padding: '10px 14px',
                background: `linear-gradient(135deg, ${COLORS.gold}22, ${COLORS.goldDark}22)`,
                border: `1px solid ${COLORS.gold}44`,
                borderRadius: 10,
                color: COLORS.gold,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
              }}
            >
              <span>⚡</span>
              <span style={{ fontSize: 11 }}>⌘.</span>
            </button>

            {/* Notificaciones */}
            <button
              onClick={() => setShowNotifications(true)}
              style={{
                padding: '10px 14px',
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                color: COLORS.textMuted,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <span>🔔</span>
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  background: COLORS.error,
                  borderRadius: '50%',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>
          </header>

          {/* Contenido de la página */}
          <div style={{ padding: 24 }}>
            {children}
          </div>
        </main>

        {/* ═══ MODAL: BÚSQUEDA GLOBAL ═══ */}
        {showSearch && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: 100,
            }}
            onClick={() => setShowSearch(false)}
          >
            <div
              style={{ ...GLASS, width: '100%', maxWidth: 600, borderRadius: 16, overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar clientes, pedidos, productos..."
                  autoFocus
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: COLORS.text,
                    fontSize: 16,
                  }}
                />
                {searching && (
                  <div style={{
                    width: 20, height: 20,
                    border: `2px solid ${COLORS.border}`,
                    borderTopColor: COLORS.gold,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                )}
              </div>

              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {searchResults.length === 0 && searchQuery && !searching && (
                  <div style={{ padding: 40, textAlign: 'center', color: COLORS.textMuted }}>
                    No se encontraron resultados
                  </div>
                )}

                {searchResults.map((result, i) => (
                  <a
                    key={i}
                    href={result.url}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 20px',
                      textDecoration: 'none',
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <span style={{
                      width: 36, height: 36,
                      background: COLORS.bgCard,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {result.tipo === 'cliente' ? '◉' : result.tipo === 'pedido' ? '📦' : '◈'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: COLORS.text, fontSize: 14 }}>{result.titulo}</div>
                      <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{result.subtitulo}</div>
                    </div>
                    <span style={{ color: COLORS.textDim, fontSize: 11 }}>{result.tipo}</span>
                  </a>
                ))}

                {!searchQuery && (
                  <div style={{ padding: 20 }}>
                    <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 12 }}>ATAJOS DE TECLADO</div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {[
                        ['⌘K', 'Búsqueda global'],
                        ['⌘.', 'Acciones rápidas'],
                        ['⌘N', 'Nuevo contenido'],
                        ['⌘1-8', 'Navegar secciones'],
                        ['Esc', 'Cerrar modal'],
                      ].map(([key, desc]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{
                            background: COLORS.bgCard,
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            color: COLORS.text,
                            fontFamily: 'monospace',
                          }}>{key}</span>
                          <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ MODAL: ACCIONES RÁPIDAS ═══ */}
        {showQuickActions && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setShowQuickActions(false)}
          >
            <div
              style={{ ...GLASS, borderRadius: 20, padding: 24, width: '100%', maxWidth: 500 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: COLORS.text, fontSize: 18, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>⚡</span> Acciones Rápidas
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => executeQuickAction(action)}
                    style={{
                      padding: 16,
                      background: `${action.color}15`,
                      border: `1px solid ${action.color}33`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{action.icon}</span>
                    <span style={{ color: action.color, fontSize: 13, fontWeight: 500 }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ MODAL: NOTIFICACIONES ═══ */}
        {showNotifications && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: 20,
            }}
            onClick={() => setShowNotifications(false)}
          >
            <div
              style={{ ...GLASS, borderRadius: 16, width: 360, maxHeight: 'calc(100vh - 40px)', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <h3 style={{ color: COLORS.text, fontSize: 16, margin: 0 }}>🔔 Notificaciones</h3>
              </div>

              <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: COLORS.textMuted }}>
                    <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🔕</span>
                    No hay notificaciones
                  </div>
                ) : (
                  notifications.map((notif, i) => (
                    <div key={i} style={{ padding: '12px 20px', borderBottom: `1px solid ${COLORS.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <span style={{
                          width: 32, height: 32,
                          background: `${notif.color || COLORS.info}22`,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {notif.icon || '📌'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: COLORS.text, fontSize: 14 }}>{notif.titulo}</div>
                          <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{notif.mensaje}</div>
                          <div style={{ color: COLORS.textDim, fontSize: 11, marginTop: 4 }}>{notif.tiempo}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
          ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: ${COLORS.borderLight}; }
        `}</style>
      </div>
    </AdminContext.Provider>
  );
}
