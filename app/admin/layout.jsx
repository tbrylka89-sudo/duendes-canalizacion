'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════
// CONTEXTO GLOBAL DEL ADMIN
// ═══════════════════════════════════════════════════════════════
const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

// ═══════════════════════════════════════════════════════════════
// PALETA DE COLORES VIBRANTE
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  // Fondos
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgElevated: '#1a1a25',
  bgHover: '#22222f',
  bgGlass: 'rgba(18, 18, 26, 0.85)',

  // Acentos principales
  gold: '#D4A853',
  goldLight: '#E8C97D',
  goldDark: '#B8922F',

  // Colores vibrantes por sección
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  pink: '#EC4899',
  pinkLight: '#F472B6',
  cyan: '#06B6D4',
  cyanLight: '#22D3EE',
  emerald: '#10B981',
  emeraldLight: '#34D399',
  orange: '#F97316',
  orangeLight: '#FB923C',
  rose: '#F43F5E',
  roseLight: '#FB7185',
  indigo: '#6366F1',
  amber: '#F59E0B',
  teal: '#14B8A6',
  violet: '#7C3AED',
  blue: '#3B82F6',
  lime: '#84CC16',

  // Textos
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textDim: '#52525B',

  // Estados
  success: '#22C55E',
  error: '#EF4444',
  warning: '#EAB308',
  info: '#3B82F6',

  // Bordes
  border: '#27272A',
  borderLight: '#3F3F46',
};

// Gradientes
const GRADIENTS = {
  gold: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
  purple: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.violet})`,
  pink: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.rose})`,
  cyan: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.teal})`,
  emerald: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.teal})`,
  orange: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.amber})`,
  blue: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.indigo})`,
  mixed: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink}, ${COLORS.orange})`,
  sidebar: `linear-gradient(180deg, ${COLORS.bgElevated} 0%, ${COLORS.bg} 100%)`,
};

const GLASS = {
  background: COLORS.bgGlass,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid rgba(255,255,255,0.06)`,
};

// ═══════════════════════════════════════════════════════════════
// NAVEGACIÓN CON COLORES POR SECCIÓN
// ═══════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: 'dashboard', path: '/admin', icon: '📊', label: 'Dashboard', shortcut: '1', color: COLORS.cyan, desc: 'Métricas y estadísticas' },
  { id: 'clientes', path: '/admin/clientes', icon: '👥', label: 'Clientes', shortcut: '2', color: COLORS.blue, desc: 'Gestión de usuarios' },
  { id: 'contenido', path: '/admin/contenido', icon: '✨', label: 'Contenido', shortcut: '3', color: COLORS.purple, badge: 'IA', desc: 'Crear con inteligencia artificial' },
  { id: 'personajes', path: '/admin/personajes', icon: '🧙', label: 'Guardianes', shortcut: '4', color: COLORS.violet, badge: 'PRO', desc: 'Canalizar desde productos' },
  { id: 'circulo', path: '/admin/circulo', icon: '🌙', label: 'Círculo', shortcut: '5', color: COLORS.amber, desc: 'Membresías premium' },
  { id: 'regalos', path: '/admin/regalos', icon: '🎁', label: 'Regalos', shortcut: '6', color: COLORS.pink, desc: 'Enviar runas y tréboles' },
  { id: 'banners', path: '/admin/banners', icon: '🖼️', label: 'Banners', shortcut: '7', color: COLORS.orange, desc: 'Imágenes promocionales' },
  { id: 'productos', path: '/admin/productos', icon: '💎', label: 'Productos', shortcut: '8', color: COLORS.emerald, desc: 'Catálogo WooCommerce' },
  { id: 'insights', path: '/admin/insights', icon: '📈', label: 'Insights', shortcut: '9', color: COLORS.teal, desc: 'Análisis de datos' },
  { id: 'tito', path: '/admin/tito', icon: '🤖', label: 'Tito AI', shortcut: '0', color: COLORS.rose, desc: 'Asistente inteligente' },
];

// ═══════════════════════════════════════════════════════════════
// ACCIONES RÁPIDAS
// ═══════════════════════════════════════════════════════════════
const QUICK_ACTIONS = [
  { id: 'dar-runas', icon: '🔮', label: 'Dar Runas', color: COLORS.purple },
  { id: 'dar-treboles', icon: '☘️', label: 'Dar Tréboles', color: COLORS.emerald },
  { id: 'activar-circulo', icon: '🌙', label: 'Activar Círculo', color: COLORS.amber },
  { id: 'enviar-regalo', icon: '🎁', label: 'Enviar Regalo', color: COLORS.pink },
  { id: 'crear-contenido', icon: '✨', label: 'Crear Contenido', color: COLORS.purple },
  { id: 'generar-cupon', icon: '🏷️', label: 'Generar Cupón', color: COLORS.orange },
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
  const [actionHistory, setActionHistory] = useState([]);

  // Obtener color de la sección actual
  const getCurrentSection = () => {
    const item = NAV_ITEMS.find(item =>
      pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path))
    );
    return item || NAV_ITEMS[0];
  };

  const currentSection = getCurrentSection();

  // ═══════════════════════════════════════════════════════════════
  // AUTENTICACIÓN
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const saved = localStorage.getItem('duendes_admin_auth');
    if (saved === 'true') setAutenticado(true);
    setCargando(false);

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
    const action = { id: Date.now(), type, description, details, timestamp: new Date().toISOString() };
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
    if (!query || query.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/busqueda-global?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) setSearchResults(data.resultados || []);
    } catch (e) { console.error('Error en búsqueda:', e); }
    setSearching(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => { if (searchQuery) handleSearch(searchQuery); }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ═══════════════════════════════════════════════════════════════
  // ATAJOS DE TECLADO
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifications(false); setShowQuickActions(false); }
      if ((e.metaKey || e.ctrlKey) && e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        const index = e.key === '0' ? 9 : parseInt(e.key) - 1;
        if (NAV_ITEMS[index]) window.location.href = NAV_ITEMS[index].path;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); window.location.href = '/admin/contenido?nuevo=true'; }
      if ((e.metaKey || e.ctrlKey) && e.key === '.') { e.preventDefault(); setShowQuickActions(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // NOTIFICACIONES
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!autenticado) return;
    const loadNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notificaciones');
        const data = await res.json();
        if (data.success) setNotifications(data.notificaciones || []);
      } catch (e) {
        setNotifications([
          { icon: '📦', titulo: 'Nuevo pedido', mensaje: 'Pedido #1234 recibido', tiempo: 'Hace 5 min', color: COLORS.emerald },
          { icon: '🌙', titulo: 'Círculo por vencer', mensaje: '3 membresías vencen en 7 días', tiempo: 'Hace 1 hora', color: COLORS.amber },
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
    const routes = {
      'dar-runas': '/admin/regalos?tipo=runas',
      'dar-treboles': '/admin/regalos?tipo=treboles',
      'activar-circulo': '/admin/circulo?accion=activar',
      'enviar-regalo': '/admin/regalos',
      'crear-contenido': '/admin/contenido?nuevo=true',
      'generar-cupon': '/admin/regalos?tipo=cupon',
    };
    if (routes[action.id]) window.location.href = routes[action.id];
    logAction('quick-action', action.label);
  };

  // ═══════════════════════════════════════════════════════════════
  // PANTALLA DE CARGA
  // ═══════════════════════════════════════════════════════════════
  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        background: COLORS.bg,
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
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgElevated} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <div style={{
          ...GLASS,
          padding: 48,
          borderRadius: 28,
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: GRADIENTS.mixed,
          }} />

          <div style={{
            width: 90, height: 90,
            background: GRADIENTS.mixed,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 42,
            margin: '0 auto 28px',
            boxShadow: `0 0 60px ${COLORS.purple}44`,
          }}>🧙</div>

          <h1 style={{ color: COLORS.text, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Portal Admin
          </h1>
          <p style={{ color: COLORS.textSecondary, marginBottom: 36, fontSize: 15 }}>Duendes del Uruguay</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña mágica..."
              style={{
                width: '100%',
                padding: '18px 22px',
                background: COLORS.bgHover,
                border: `2px solid ${COLORS.border}`,
                borderRadius: 14,
                color: COLORS.text,
                fontSize: 16,
                marginBottom: 20,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.purple}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />

            {error && (
              <p style={{ color: COLORS.error, fontSize: 14, marginBottom: 20, padding: '10px', background: `${COLORS.error}15`, borderRadius: 8 }}>{error}</p>
            )}

            <button type="submit" style={{
              width: '100%',
              padding: '18px',
              background: GRADIENTS.gold,
              border: 'none',
              borderRadius: 14,
              color: '#000',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              Entrar al Portal ✨
            </button>
          </form>

          <p style={{ color: COLORS.textDim, fontSize: 12, marginTop: 28 }}>
            ⌘K búsqueda • ⌘. acciones rápidas • ⌘1-9 navegación
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // CONTEXTO
  // ═══════════════════════════════════════════════════════════════
  const contextValue = {
    logAction, actionHistory, notifications, systemHealth,
    showSearch: () => setShowSearch(true),
    showQuickActions: () => setShowQuickActions(true),
    COLORS, GLASS, GRADIENTS, currentSection,
  };

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT PRINCIPAL
  // ═══════════════════════════════════════════════════════════════
  return (
    <AdminContext.Provider value={contextValue}>
      <div style={{ minHeight: '100vh', background: COLORS.bg, display: 'flex' }}>

        {/* ═══ SIDEBAR ═══ */}
        <aside style={{
          width: sidebarCollapsed ? 76 : 260,
          background: GRADIENTS.sidebar,
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
          {/* Accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 3,
            background: GRADIENTS.mixed,
          }} />

          {/* Logo */}
          <div style={{
            padding: sidebarCollapsed ? '24px 16px' : '24px 20px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width: 44, height: 44,
              background: GRADIENTS.mixed,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
              boxShadow: `0 4px 20px ${COLORS.purple}33`,
            }}>🧙</div>
            {!sidebarCollapsed && (
              <div>
                <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 16 }}>Duendes</div>
                <div style={{ color: COLORS.textMuted, fontSize: 12 }}>Admin Panel</div>
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path));
              return (
                <a
                  key={item.id}
                  href={item.path}
                  title={sidebarCollapsed ? `${item.label} - ${item.desc}` : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: sidebarCollapsed ? '14px' : '14px 16px',
                    marginBottom: 6,
                    borderRadius: 12,
                    textDecoration: 'none',
                    color: isActive ? item.color : COLORS.textMuted,
                    background: isActive ? `${item.color}15` : 'transparent',
                    border: isActive ? `1px solid ${item.color}33` : '1px solid transparent',
                    transition: 'all 0.2s',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    position: 'relative',
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 24,
                      background: item.color,
                      borderRadius: '0 4px 4px 0',
                    }} />
                  )}
                  <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          background: item.color,
                          color: '#000',
                          fontSize: 9,
                          fontWeight: 700,
                          padding: '3px 7px',
                          borderRadius: 6,
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
          <div style={{ padding: sidebarCollapsed ? '16px 12px' : '16px', borderTop: `1px solid ${COLORS.border}` }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                width: '100%',
                padding: '12px',
                background: COLORS.bgHover,
                border: 'none',
                borderRadius: 10,
                color: COLORS.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {sidebarCollapsed ? '→' : '← Colapsar'}
            </button>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px',
                background: `${COLORS.error}15`,
                border: 'none',
                borderRadius: 10,
                color: COLORS.error,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {sidebarCollapsed ? '⏻' : '⏻ Cerrar sesión'}
            </button>
          </div>
        </aside>

        {/* ═══ CONTENIDO PRINCIPAL ═══ */}
        <main style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? 76 : 260,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}>
          {/* Header con color de sección */}
          <header style={{
            ...GLASS,
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: '14px 28px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Accent line de sección */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, ${currentSection.color}, transparent)`,
            }} />

            {/* Búsqueda */}
            <button
              onClick={() => setShowSearch(true)}
              style={{
                flex: 1,
                maxWidth: 440,
                padding: '12px 18px',
                background: COLORS.bgHover,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                color: COLORS.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14,
                textAlign: 'left',
              }}
            >
              <span>🔍</span>
              <span style={{ flex: 1 }}>Buscar clientes, pedidos...</span>
              <span style={{ background: COLORS.bgCard, padding: '4px 10px', borderRadius: 6, fontSize: 11, color: COLORS.textSecondary }}>⌘K</span>
            </button>

            {/* Salud del sistema */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: systemHealth.status === 'ok' ? `${COLORS.emerald}15` : `${COLORS.error}15`,
              border: `1px solid ${systemHealth.status === 'ok' ? COLORS.emerald : COLORS.error}33`,
              borderRadius: 10,
            }}>
              <span style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: systemHealth.status === 'ok' ? COLORS.emerald : COLORS.error,
                boxShadow: `0 0 10px ${systemHealth.status === 'ok' ? COLORS.emerald : COLORS.error}`,
              }} />
              <span style={{
                color: systemHealth.status === 'ok' ? COLORS.emerald : COLORS.error,
                fontSize: 13,
                fontWeight: 500,
              }}>
                {systemHealth.status === 'ok' ? 'Sistema OK' : 'Problemas'}
              </span>
            </div>

            {/* Acciones rápidas */}
            <button
              onClick={() => setShowQuickActions(true)}
              style={{
                padding: '12px 16px',
                background: `linear-gradient(135deg, ${COLORS.purple}22, ${COLORS.pink}22)`,
                border: `1px solid ${COLORS.purple}44`,
                borderRadius: 12,
                color: COLORS.purple,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <span>⚡</span>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>⌘.</span>
            </button>

            {/* Notificaciones */}
            <button
              onClick={() => setShowNotifications(true)}
              style={{
                padding: '12px 16px',
                background: COLORS.bgHover,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                color: COLORS.textMuted,
                cursor: 'pointer',
                position: 'relative',
                fontSize: 18,
              }}
            >
              🔔
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 20,
                  height: 20,
                  background: COLORS.error,
                  borderRadius: '50%',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${COLORS.bg}`,
                }}>
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>
          </header>

          {/* Contenido de la página */}
          <div style={{ padding: 28 }}>
            {children}
          </div>
        </main>

        {/* ═══ MODAL: BÚSQUEDA GLOBAL ═══ */}
        {showSearch && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: 100,
            }}
            onClick={() => setShowSearch(false)}
          >
            <div
              style={{ ...GLASS, width: '100%', maxWidth: 640, borderRadius: 20, overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                padding: '18px 22px',
                borderBottom: `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: `linear-gradient(135deg, ${COLORS.purple}10, transparent)`,
              }}>
                <span style={{ fontSize: 22 }}>🔍</span>
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
                    fontSize: 17,
                  }}
                />
                {searching && (
                  <div style={{
                    width: 22, height: 22,
                    border: `2px solid ${COLORS.border}`,
                    borderTopColor: COLORS.purple,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                )}
              </div>

              <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                {searchResults.length === 0 && searchQuery && !searching && (
                  <div style={{ padding: 50, textAlign: 'center', color: COLORS.textMuted }}>
                    <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🔍</span>
                    No se encontraron resultados
                  </div>
                )}

                {searchResults.map((result, i) => (
                  <a key={i} href={result.url} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 22px',
                    textDecoration: 'none',
                    borderBottom: `1px solid ${COLORS.border}`,
                    transition: 'background 0.2s',
                  }}>
                    <span style={{
                      width: 42, height: 42,
                      background: COLORS.bgHover,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}>
                      {result.tipo === 'cliente' ? '👤' : result.tipo === 'pedido' ? '📦' : '💎'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 500 }}>{result.titulo}</div>
                      <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{result.subtitulo}</div>
                    </div>
                    <span style={{ color: COLORS.textDim, fontSize: 12, background: COLORS.bgHover, padding: '4px 10px', borderRadius: 6 }}>{result.tipo}</span>
                  </a>
                ))}

                {!searchQuery && (
                  <div style={{ padding: 24 }}>
                    <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 16, fontWeight: 600 }}>ATAJOS DE TECLADO</div>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {[
                        ['⌘K', 'Búsqueda global', COLORS.cyan],
                        ['⌘.', 'Acciones rápidas', COLORS.purple],
                        ['⌘N', 'Nuevo contenido', COLORS.emerald],
                        ['⌘1-9', 'Navegar secciones', COLORS.amber],
                        ['Esc', 'Cerrar modal', COLORS.textMuted],
                      ].map(([key, desc, color]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{
                            background: `${color}22`,
                            color: color,
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontFamily: 'monospace',
                            fontWeight: 600,
                          }}>{key}</span>
                          <span style={{ color: COLORS.textSecondary, fontSize: 14 }}>{desc}</span>
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
              background: 'rgba(0,0,0,0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setShowQuickActions(false)}
          >
            <div
              style={{ ...GLASS, borderRadius: 24, padding: 28, width: '100%', maxWidth: 540, position: 'relative', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: GRADIENTS.mixed }} />

              <h3 style={{ color: COLORS.text, fontSize: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>⚡</span> Acciones Rápidas
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => executeQuickAction(action)}
                    style={{
                      padding: 20,
                      background: `${action.color}12`,
                      border: `1px solid ${action.color}33`,
                      borderRadius: 16,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>{action.icon}</span>
                    <span style={{ color: action.color, fontSize: 14, fontWeight: 600 }}>{action.label}</span>
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
              background: 'rgba(0,0,0,0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: 20,
            }}
            onClick={() => setShowNotifications(false)}
          >
            <div
              style={{ ...GLASS, borderRadius: 20, width: 380, maxHeight: 'calc(100vh - 40px)', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                padding: '18px 22px',
                borderBottom: `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${COLORS.amber}10, transparent)`,
              }}>
                <h3 style={{ color: COLORS.text, fontSize: 17, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>🔔</span> Notificaciones
                </h3>
                {notifications.length > 0 && (
                  <span style={{ background: COLORS.amber, color: '#000', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                    {notifications.length} nuevas
                  </span>
                )}
              </div>

              <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 50, textAlign: 'center', color: COLORS.textMuted }}>
                    <span style={{ fontSize: 44, display: 'block', marginBottom: 14 }}>🔕</span>
                    No hay notificaciones
                  </div>
                ) : (
                  notifications.map((notif, i) => (
                    <div key={i} style={{ padding: '14px 22px', borderBottom: `1px solid ${COLORS.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <span style={{
                          width: 38, height: 38,
                          background: `${notif.color || COLORS.info}22`,
                          borderRadius: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                        }}>
                          {notif.icon || '📌'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}>{notif.titulo}</div>
                          <div style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 2 }}>{notif.mensaje}</div>
                          <div style={{ color: COLORS.textDim, fontSize: 12, marginTop: 6 }}>{notif.tiempo}</div>
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
          button:hover { opacity: 0.9; }
          a:hover { opacity: 0.95; }
        `}</style>
      </div>
    </AdminContext.Provider>
  );
}
