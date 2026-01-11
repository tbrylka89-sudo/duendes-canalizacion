'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════
// NUEVA PALETA DE COLORES VIBRANTE
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  // Fondos
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgElevated: '#1a1a25',
  bgHover: '#22222f',

  // Bordes
  border: '#2a2a3a',
  borderLight: '#3a3a4a',

  // Texto
  text: '#ffffff',
  textMuted: '#9ca3af',
  textDim: '#6b7280',

  // Colores principales (Dashboard = Cyan)
  cyan: '#06B6D4',
  cyanLight: '#22D3EE',
  cyanDark: '#0891B2',

  // Colores secundarios
  purple: '#8B5CF6',
  pink: '#EC4899',
  emerald: '#10B981',
  orange: '#F97316',
  rose: '#F43F5E',
  amber: '#F59E0B',
  blue: '#3B82F6',
  gold: '#D4A853',

  // Estados
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════

const RANGOS = [
  { id: 'semilla', nombre: 'Semilla Magica', min: 0, icono: '🌱', color: COLORS.emerald },
  { id: 'brote', nombre: 'Brote de Luz', min: 50, icono: '🌿', color: '#4ade80' },
  { id: 'aprendiz', nombre: 'Aprendiz Elemental', min: 150, icono: '✨', color: COLORS.amber },
  { id: 'guardian', nombre: 'Guardiana del Bosque', min: 300, icono: '🌳', color: '#16a34a' },
  { id: 'hechicera', nombre: 'Hechicera de Cristal', min: 500, icono: '💎', color: COLORS.purple },
  { id: 'alquimista', nombre: 'Alquimista del Alba', min: 800, icono: '⚗️', color: COLORS.rose },
  { id: 'maestra', nombre: 'Maestra Elemental', min: 1200, icono: '👑', color: COLORS.gold }
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: `3px solid ${COLORS.border}`,
          borderTopColor: COLORS.cyan,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: COLORS.textMuted, marginTop: 20 }}>Cargando estadisticas...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header con gradiente */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        padding: 24,
        background: COLORS.bgCard,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Gradiente decorativo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple}, ${COLORS.pink})`
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${COLORS.cyan}33, ${COLORS.cyan}11)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28
            }}>
              {saludo.icono}
            </div>
            <div>
              <h1 style={{ color: COLORS.text, fontSize: 28, fontWeight: 700, margin: 0 }}>
                {saludo.texto}
              </h1>
              <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14, textTransform: 'capitalize' }}>
                {hoy}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={cargarTodo}
          style={{
            padding: '12px 24px',
            background: COLORS.bgElevated,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            color: COLORS.textMuted,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: 18 }}>↻</span>
          Actualizar
        </button>
      </div>

      {/* Info Box */}
      <div style={{
        padding: 20,
        background: `linear-gradient(135deg, ${COLORS.cyan}11, ${COLORS.purple}11)`,
        borderRadius: 16,
        border: `1px solid ${COLORS.cyan}33`,
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        <span style={{ fontSize: 28 }}>📊</span>
        <div>
          <p style={{ color: COLORS.text, margin: 0, fontWeight: 500 }}>
            Panel de Control
          </p>
          <p style={{ color: COLORS.textMuted, margin: '4px 0 0', fontSize: 14 }}>
            Resumen de ventas, miembros del Circulo, pedidos y actividad de tu tienda magica.
          </p>
        </div>
      </div>

      {/* Stats Grid Principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        {/* Ingresos del mes - Destacado */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.emerald}22, ${COLORS.emerald}11)`,
          border: `2px solid ${COLORS.emerald}44`,
          borderRadius: 20,
          padding: 24,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.cyan})`
          }} />
          <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>💰</span>
          <div style={{ color: COLORS.emerald, fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
            ${wooStats?.ingresosMes || stats?.ingresosMes || 0}
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Ingresos este mes</div>
          {wooStats?.comparativaMes && (
            <div style={{
              marginTop: 10,
              padding: '6px 14px',
              background: wooStats.comparativaMes >= 0 ? `${COLORS.success}22` : `${COLORS.error}22`,
              borderRadius: 10,
              fontSize: 13,
              color: wooStats.comparativaMes >= 0 ? COLORS.success : COLORS.error,
              display: 'inline-block'
            }}>
              {wooStats.comparativaMes >= 0 ? '↑' : '↓'} {Math.abs(wooStats.comparativaMes)}% vs mes anterior
            </div>
          )}
        </div>

        {/* Pedidos del mes */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 24,
          textAlign: 'center'
        }}>
          <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>🛒</span>
          <div style={{ color: COLORS.text, fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
            {wooStats?.ventasMes || stats?.ventasMes || 0}
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Pedidos este mes</div>
          {wooStats?.ventasHoy > 0 && (
            <div style={{
              marginTop: 10,
              padding: '6px 14px',
              background: `${COLORS.cyan}22`,
              borderRadius: 10,
              fontSize: 13,
              color: COLORS.cyan,
              display: 'inline-block'
            }}>
              +{wooStats.ventasHoy} hoy
            </div>
          )}
        </div>

        {/* Miembros Circulo */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 24,
          textAlign: 'center'
        }}>
          <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>☽</span>
          <div style={{ color: COLORS.text, fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
            {stats?.miembrosCirculo || 0}
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Miembros Circulo</div>
          {stats?.pruebasActivas > 0 && (
            <div style={{
              marginTop: 10,
              padding: '6px 14px',
              background: `${COLORS.purple}22`,
              borderRadius: 10,
              fontSize: 13,
              color: COLORS.purple,
              display: 'inline-block'
            }}>
              {stats.pruebasActivas} en prueba
            </div>
          )}
        </div>

        {/* Total clientes */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 24,
          textAlign: 'center'
        }}>
          <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>👥</span>
          <div style={{ color: COLORS.text, fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
            {wooStats?.clientesWoo || stats?.clientesTotal || 0}
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Total clientes</div>
        </div>

        {/* Pedidos pendientes */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 24,
          textAlign: 'center'
        }}>
          <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>📦</span>
          <div style={{ color: COLORS.text, fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
            {wooStats?.pendientes || 0}
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Pedidos pendientes</div>
        </div>

        {/* Circulos por vencer */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 24,
          textAlign: 'center'
        }}>
          <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>⏰</span>
          <div style={{ color: COLORS.text, fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
            {stats?.circulosPorVencer || 0}
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Circulos por vencer</div>
        </div>
      </div>

      {/* Pedidos recientes de WooCommerce */}
      {wooStats?.ultimosPedidos?.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            color: COLORS.text,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${COLORS.orange}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}>🛍️</span>
            Pedidos recientes
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16
          }}>
            {wooStats.ultimosPedidos.slice(0, 4).map((pedido, i) => (
              <div key={i} style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 20,
                transition: 'all 0.2s'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <span style={{ color: COLORS.cyan, fontWeight: 600, fontSize: 15 }}>#{pedido.id}</span>
                  <span style={{
                    padding: '5px 12px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    background: pedido.status === 'processing' ? `${COLORS.amber}22` :
                               pedido.status === 'completed' ? `${COLORS.success}22` :
                               `${COLORS.textMuted}22`,
                    color: pedido.status === 'processing' ? COLORS.amber :
                           pedido.status === 'completed' ? COLORS.success : COLORS.textMuted
                  }}>
                    {pedido.status === 'processing' ? 'Procesando' :
                     pedido.status === 'completed' ? 'Completado' :
                     pedido.status === 'on-hold' ? 'En espera' : pedido.status}
                  </span>
                </div>
                <div style={{ color: COLORS.text, fontSize: 15, marginBottom: 6 }}>{pedido.cliente}</div>
                <div style={{ color: COLORS.emerald, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>${pedido.total}</div>
                <div style={{ color: COLORS.textDim, fontSize: 13 }}>{pedido.fecha}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mi Magia Stats */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          color: COLORS.text,
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${COLORS.purple}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18
          }}>✨</span>
          Mi Magia
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16
        }}>
          {[
            { icono: '📖', valor: stats?.totalGrimorioEntradas || 0, label: 'Entradas grimorio', color: COLORS.purple },
            { icono: '☘️', valor: stats?.totalCanjes || 0, label: 'Canjes realizados', color: COLORS.emerald },
            { icono: '🎁', valor: stats?.totalRegalosEnviados || 0, label: 'Regalos enviados', color: COLORS.pink },
            { icono: '🌟', valor: stats?.pruebasActivas || 0, label: 'Pruebas activas', color: COLORS.amber }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 24,
              background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
              border: `1px solid ${item.color}33`,
              borderRadius: 16
            }}>
              <span style={{ fontSize: 24, marginBottom: 10 }}>{item.icono}</span>
              <span style={{ color: COLORS.text, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{item.valor}</span>
              <span style={{ color: COLORS.textMuted, fontSize: 13, textAlign: 'center' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones rapidas */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          color: COLORS.text,
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${COLORS.cyan}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18
          }}>⚡</span>
          Acciones rapidas
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16
        }}>
          {[
            { href: '/admin/clientes', icono: '👥', label: 'Buscar cliente', color: COLORS.blue },
            { href: '/admin/contenido', icono: '✨', label: 'Crear contenido', color: COLORS.purple },
            { href: '/admin/regalos', icono: '🎁', label: 'Enviar regalo', color: COLORS.pink },
            { href: '/admin/circulo', icono: '☽', label: 'Ver circulo', color: COLORS.emerald }
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: '24px 20px',
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                color: COLORS.text,
                textDecoration: 'none',
                fontSize: 15,
                transition: 'all 0.2s'
              }}
            >
              <span style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `${item.color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>
                {item.icono}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Top Clientes y Por vencer */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: 24,
        marginBottom: 32
      }}>
        {/* Top clientes */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 24
        }}>
          <h3 style={{
            color: COLORS.text,
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: `${COLORS.gold}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16
            }}>🏆</span>
            Top clientes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats?.topClientes?.length > 0 ? (
              stats.topClientes.slice(0, 8).map((cliente, i) => {
                const rango = getRango(cliente.gastado || 0);
                return (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: COLORS.bgElevated,
                    borderRadius: 12,
                    border: `1px solid ${i < 3 ? `${COLORS.gold}33` : COLORS.border}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: i < 3 ? `${COLORS.gold}22` : COLORS.bgCard,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: i < 3 ? COLORS.gold : COLORS.textDim,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 18 }}>{rango.icono}</span>
                      <span style={{ color: COLORS.text, fontSize: 14 }}>
                        {cliente.nombre || cliente.email?.split('@')[0]}
                      </span>
                    </div>
                    <span style={{ color: COLORS.gold, fontWeight: 600, fontSize: 15 }}>
                      ${cliente.gastado || 0}
                    </span>
                  </div>
                );
              })
            ) : (
              <p style={{ color: COLORS.textDim, textAlign: 'center', padding: 30 }}>
                No hay datos de clientes
              </p>
            )}
          </div>
        </div>

        {/* Por vencer */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 24
        }}>
          <h3 style={{
            color: COLORS.text,
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: `${COLORS.rose}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16
            }}>⏰</span>
            Circulos por vencer (7 dias)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats?.proximosVencer?.length > 0 ? (
              stats.proximosVencer.map((cliente, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: COLORS.bgElevated,
                  borderRadius: 12
                }}>
                  <span style={{ color: COLORS.text, fontSize: 14 }}>
                    {cliente.nombre || cliente.email?.split('@')[0]}
                  </span>
                  <span style={{
                    padding: '5px 12px',
                    background: `${COLORS.rose}22`,
                    borderRadius: 8,
                    color: COLORS.rose,
                    fontSize: 13,
                    fontWeight: 600
                  }}>
                    {cliente.diasRestantes} dias
                  </span>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: 30,
                color: COLORS.textDim
              }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>✨</span>
                No hay circulos por vencer
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: 24
      }}>
        <h3 style={{
          color: COLORS.text,
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: `${COLORS.cyan}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16
          }}>📋</span>
          Actividad reciente
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats?.actividad?.length > 0 ? (
            stats.actividad.slice(0, 10).map((act, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 14px',
                background: COLORS.bgElevated,
                borderRadius: 12
              }}>
                <span style={{ fontSize: 18 }}>{act.icono || '•'}</span>
                <span style={{ flex: 1, color: COLORS.text, fontSize: 14 }}>{act.texto}</span>
                <span style={{ color: COLORS.textDim, fontSize: 13 }}>{act.tiempo}</span>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: 40,
              color: COLORS.textDim
            }}>
              <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>🌿</span>
              No hay actividad reciente
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
