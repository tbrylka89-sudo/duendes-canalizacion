'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════

const RANGOS = [
  { id: 'semilla', nombre: 'Semilla Magica', min: 0, icono: '🌱', color: '#90EE90' },
  { id: 'brote', nombre: 'Brote de Luz', min: 50, icono: '🌿', color: '#98FB98' },
  { id: 'aprendiz', nombre: 'Aprendiz Elemental', min: 150, icono: '✨', color: '#d4af37' },
  { id: 'guardian', nombre: 'Guardiana del Bosque', min: 300, icono: '🌳', color: '#228B22' },
  { id: 'hechicera', nombre: 'Hechicera de Cristal', min: 500, icono: '💎', color: '#9b59b6' },
  { id: 'alquimista', nombre: 'Alquimista del Alba', min: 800, icono: '⚗️', color: '#e74c3c' },
  { id: 'maestra', nombre: 'Maestra Elemental', min: 1200, icono: '👑', color: '#f39c12' }
];

function getRango(gastado) {
  for (let i = RANGOS.length - 1; i >= 0; i--) {
    if (gastado >= RANGOS[i].min) return RANGOS[i];
  }
  return RANGOS[0];
}

function getSaludo() {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return { texto: 'Buen dia', icono: '☀️' };
  if (hora >= 12 && hora < 19) return { texto: 'Buenas tardes', icono: '🌤️' };
  return { texto: 'Buenas noches', icono: '🌙' };
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [wooStats, setWooStats] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setCargando(true);
    await Promise.all([cargarStats(), cargarWooStats()]);
    setCargando(false);
  };

  const cargarStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Error cargando stats:', e);
    }
  };

  const cargarWooStats = async () => {
    try {
      const res = await fetch('/api/admin/woo-stats');
      const data = await res.json();
      if (data.success) {
        setWooStats(data);
      }
    } catch (e) {
      console.error('Error cargando WooCommerce stats:', e);
    }
  };

  const saludo = getSaludo();
  const hoy = new Date().toLocaleDateString('es-UY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  if (cargando) {
    return (
      <div style={estilos.loading}>
        <div style={estilos.spinner}></div>
        <p style={{ color: '#666', marginTop: '16px' }}>Cargando estadisticas...</p>
      </div>
    );
  }

  return (
    <div style={estilos.dashboard}>
      {/* Header */}
      <div style={estilos.header}>
        <div>
          <h1 style={estilos.titulo}>{saludo.texto} {saludo.icono}</h1>
          <p style={estilos.fecha}>{hoy}</p>
        </div>
        <button onClick={cargarTodo} style={estilos.refreshBtn}>
          &#8635; Actualizar
        </button>
      </div>

      {/* Stats Grid - WooCommerce primero */}
      <div style={estilos.statsGrid}>
        <div style={{ ...estilos.statCard, ...estilos.statCardGold }}>
          <span style={estilos.statIcono}>💰</span>
          <div style={estilos.statValor}>${wooStats?.ingresosMes || stats?.ingresosMes || 0}</div>
          <div style={estilos.statLabel}>Ingresos este mes</div>
          {wooStats?.comparativaMes && (
            <div style={{
              ...estilos.statComparativa,
              color: wooStats.comparativaMes >= 0 ? '#22c55e' : '#ef4444'
            }}>
              {wooStats.comparativaMes >= 0 ? '↑' : '↓'} {Math.abs(wooStats.comparativaMes)}% vs mes anterior
            </div>
          )}
        </div>

        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>🛒</span>
          <div style={estilos.statValor}>{wooStats?.ventasMes || stats?.ventasMes || 0}</div>
          <div style={estilos.statLabel}>Pedidos este mes</div>
          {wooStats?.ventasHoy > 0 && (
            <div style={estilos.statComparativa}>+{wooStats.ventasHoy} hoy</div>
          )}
        </div>

        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>★</span>
          <div style={estilos.statValor}>{stats?.miembrosCirculo || 0}</div>
          <div style={estilos.statLabel}>Miembros Circulo</div>
          {stats?.pruebasActivas > 0 && (
            <div style={estilos.statComparativa}>{stats.pruebasActivas} en prueba</div>
          )}
        </div>

        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>👥</span>
          <div style={estilos.statValor}>{wooStats?.clientesWoo || stats?.clientesTotal || 0}</div>
          <div style={estilos.statLabel}>Total clientes</div>
        </div>

        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>📦</span>
          <div style={estilos.statValor}>{wooStats?.pendientes || 0}</div>
          <div style={estilos.statLabel}>Pedidos pendientes</div>
        </div>

        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>⏰</span>
          <div style={estilos.statValor}>{stats?.circulosPorVencer || 0}</div>
          <div style={estilos.statLabel}>Circulos por vencer</div>
        </div>
      </div>

      {/* Pedidos recientes de WooCommerce */}
      {wooStats?.ultimosPedidos?.length > 0 && (
        <div style={estilos.seccion}>
          <h2 style={estilos.seccionTitulo}>Pedidos recientes</h2>
          <div style={estilos.pedidosGrid}>
            {wooStats.ultimosPedidos.slice(0, 4).map((pedido, i) => (
              <div key={i} style={estilos.pedidoCard}>
                <div style={estilos.pedidoHeader}>
                  <span style={estilos.pedidoId}>#{pedido.id}</span>
                  <span style={{
                    ...estilos.pedidoEstado,
                    background: pedido.status === 'processing' ? 'rgba(245, 158, 11, 0.15)' :
                               pedido.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' :
                               'rgba(107, 114, 128, 0.15)',
                    color: pedido.status === 'processing' ? '#f59e0b' :
                           pedido.status === 'completed' ? '#22c55e' : '#888'
                  }}>
                    {pedido.status === 'processing' ? 'Procesando' :
                     pedido.status === 'completed' ? 'Completado' :
                     pedido.status === 'on-hold' ? 'En espera' : pedido.status}
                  </span>
                </div>
                <div style={estilos.pedidoCliente}>{pedido.cliente}</div>
                <div style={estilos.pedidoTotal}>${pedido.total}</div>
                <div style={estilos.pedidoFecha}>{pedido.fecha}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Mi Magia */}
      <div style={estilos.seccion}>
        <h2 style={estilos.seccionTitulo}>Mi Magia</h2>
        <div style={estilos.miMagiaGrid}>
          <div style={estilos.miMagiaCard}>
            <span style={estilos.miMagiaIcono}>📖</span>
            <span style={estilos.miMagiaValor}>{stats?.totalGrimorioEntradas || 0}</span>
            <span style={estilos.miMagiaLabel}>Entradas grimorio</span>
          </div>
          <div style={estilos.miMagiaCard}>
            <span style={estilos.miMagiaIcono}>☘</span>
            <span style={estilos.miMagiaValor}>{stats?.totalCanjes || 0}</span>
            <span style={estilos.miMagiaLabel}>Canjes realizados</span>
          </div>
          <div style={estilos.miMagiaCard}>
            <span style={estilos.miMagiaIcono}>🎁</span>
            <span style={estilos.miMagiaValor}>{stats?.totalRegalosEnviados || 0}</span>
            <span style={estilos.miMagiaLabel}>Regalos enviados</span>
          </div>
          <div style={estilos.miMagiaCard}>
            <span style={estilos.miMagiaIcono}>🌟</span>
            <span style={estilos.miMagiaValor}>{stats?.pruebasActivas || 0}</span>
            <span style={estilos.miMagiaLabel}>Pruebas activas</span>
          </div>
        </div>
      </div>

      {/* Acciones rapidas */}
      <div style={estilos.seccion}>
        <h2 style={estilos.seccionTitulo}>Acciones rapidas</h2>
        <div style={estilos.accionesGrid}>
          <Link href="/admin/clientes" style={estilos.accionBtn}>
            <span style={estilos.accionIcono}>👥</span>
            <span>Buscar cliente</span>
          </Link>
          <Link href="/admin/contenido" style={estilos.accionBtn}>
            <span style={estilos.accionIcono}>📝</span>
            <span>Crear contenido</span>
          </Link>
          <Link href="/admin/regalos" style={estilos.accionBtn}>
            <span style={estilos.accionIcono}>🎁</span>
            <span>Enviar regalo</span>
          </Link>
          <Link href="/admin/circulo" style={estilos.accionBtn}>
            <span style={estilos.accionIcono}>★</span>
            <span>Ver circulo</span>
          </Link>
        </div>
      </div>

      {/* Top Clientes y Por vencer */}
      <div style={estilos.dosColumnas}>
        {/* Top clientes */}
        <div style={estilos.tarjeta}>
          <h3 style={estilos.tarjetaTitulo}>🏆 Top clientes</h3>
          <div style={estilos.listaClientes}>
            {stats?.topClientes?.length > 0 ? (
              stats.topClientes.slice(0, 8).map((cliente, i) => {
                const rango = getRango(cliente.gastado || 0);
                return (
                  <div key={i} style={estilos.clienteItem}>
                    <div style={estilos.clienteInfo}>
                      <span style={estilos.clientePosicion}>#{i + 1}</span>
                      <span style={estilos.clienteRango}>{rango.icono}</span>
                      <span style={estilos.clienteNombre}>{cliente.nombre || cliente.email}</span>
                    </div>
                    <span style={estilos.clienteGastado}>${cliente.gastado || 0}</span>
                  </div>
                );
              })
            ) : (
              <p style={estilos.vacio}>No hay datos de clientes</p>
            )}
          </div>
        </div>

        {/* Por vencer */}
        <div style={estilos.tarjeta}>
          <h3 style={estilos.tarjetaTitulo}>⏰ Circulos por vencer (7 dias)</h3>
          <div style={estilos.listaClientes}>
            {stats?.proximosVencer?.length > 0 ? (
              stats.proximosVencer.map((cliente, i) => (
                <div key={i} style={estilos.clienteItem}>
                  <div style={estilos.clienteInfo}>
                    <span style={estilos.clienteNombre}>{cliente.nombre || cliente.email}</span>
                  </div>
                  <span style={{ ...estilos.clienteGastado, color: '#e74c3c' }}>
                    {cliente.diasRestantes} dias
                  </span>
                </div>
              ))
            ) : (
              <p style={estilos.vacio}>No hay circulos por vencer</p>
            )}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div style={estilos.tarjeta}>
        <h3 style={estilos.tarjetaTitulo}>📋 Actividad reciente</h3>
        <div style={estilos.actividad}>
          {stats?.actividad?.length > 0 ? (
            stats.actividad.slice(0, 10).map((act, i) => (
              <div key={i} style={estilos.actividadItem}>
                <span style={estilos.actividadIcono}>{act.icono || '•'}</span>
                <span style={estilos.actividadTexto}>{act.texto}</span>
                <span style={estilos.actividadTiempo}>{act.tiempo}</span>
              </div>
            ))
          ) : (
            <p style={estilos.vacio}>No hay actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #222',
    borderTopColor: '#C6A962',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px'
  },
  titulo: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  fecha: {
    color: '#666',
    fontSize: '14px',
    textTransform: 'capitalize'
  },
  refreshBtn: {
    padding: '10px 16px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  statCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center'
  },
  statCardGold: {
    background: 'linear-gradient(135deg, rgba(198,169,98,0.15) 0%, rgba(198,169,98,0.05) 100%)',
    borderColor: 'rgba(198,169,98,0.3)'
  },
  statIcono: {
    fontSize: '24px',
    marginBottom: '8px',
    display: 'block'
  },
  statValor: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  statLabel: {
    color: '#666',
    fontSize: '13px'
  },
  statComparativa: {
    marginTop: '6px',
    fontSize: '11px',
    color: '#888'
  },

  // Pedidos
  pedidosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px'
  },
  pedidoCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '16px'
  },
  pedidoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  pedidoId: {
    color: '#C6A962',
    fontWeight: '600',
    fontSize: '14px'
  },
  pedidoEstado: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  pedidoCliente: {
    color: '#fff',
    fontSize: '14px',
    marginBottom: '4px'
  },
  pedidoTotal: {
    color: '#22c55e',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  pedidoFecha: {
    color: '#666',
    fontSize: '12px'
  },

  // Seccion
  seccion: {
    marginBottom: '32px'
  },
  seccionTitulo: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px'
  },

  // Mi Magia stats
  miMagiaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  miMagiaCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 16px',
    background: 'linear-gradient(135deg, rgba(75,85,99,0.2) 0%, rgba(55,65,81,0.1) 100%)',
    border: '1px solid #2a2a2a',
    borderRadius: '12px'
  },
  miMagiaIcono: {
    fontSize: '20px',
    marginBottom: '8px'
  },
  miMagiaValor: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  miMagiaLabel: {
    color: '#888',
    fontSize: '12px',
    textAlign: 'center'
  },

  // Acciones
  accionesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  accionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 16px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  accionIcono: {
    fontSize: '24px'
  },

  // Dos columnas
  dosColumnas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },

  // Tarjeta
  tarjeta: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px'
  },
  tarjetaTitulo: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '16px'
  },

  // Lista clientes
  listaClientes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  clienteItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: '#0a0a0a',
    borderRadius: '8px'
  },
  clienteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  clientePosicion: {
    color: '#666',
    fontSize: '12px',
    width: '24px'
  },
  clienteRango: {
    fontSize: '16px'
  },
  clienteNombre: {
    color: '#ccc',
    fontSize: '14px'
  },
  clienteGastado: {
    color: '#C6A962',
    fontWeight: '600',
    fontSize: '14px'
  },

  // Actividad
  actividad: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  actividadItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: '#0a0a0a',
    borderRadius: '8px'
  },
  actividadIcono: {
    fontSize: '16px'
  },
  actividadTexto: {
    flex: 1,
    color: '#ccc',
    fontSize: '14px'
  },
  actividadTiempo: {
    color: '#666',
    fontSize: '12px'
  },

  vacio: {
    color: '#555',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px'
  }
};
