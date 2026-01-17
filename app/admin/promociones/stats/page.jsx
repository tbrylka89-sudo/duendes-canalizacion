'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: STATS DE PROMOCIONES
// Panel de estadísticas y rendimiento
// ═══════════════════════════════════════════════════════════════════════════════

const UBICACIONES_NOMBRES = {
  'header': 'Header Principal',
  'mi-magia-promos': 'Mi Magia - Promociones',
  'mi-magia-popup': 'Mi Magia - Popup',
  'mi-magia-lateral': 'Mi Magia - Lateral',
  'circulo-exclusivo': 'Círculo Exclusivo',
  'tienda-arriba': 'Tienda - Arriba',
  'checkout': 'Checkout',
  'desconocida': 'Sin especificar'
};

export default function StatsPromociones() {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [periodo, setPeriodo] = useState('30'); // días
  const [promoSeleccionada, setPromoSeleccionada] = useState(null);
  const [statsPromo, setStatsPromo] = useState(null);

  useEffect(() => {
    cargarStats();
  }, [periodo]);

  async function cargarStats() {
    setCargando(true);
    try {
      const desde = new Date();
      desde.setDate(desde.getDate() - parseInt(periodo));

      const res = await fetch(`/api/admin/promociones/stats?desde=${desde.toISOString()}`);
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (e) {
      console.error('Error cargando stats:', e);
    }
    setCargando(false);
  }

  async function cargarStatsPromo(promoId) {
    try {
      const desde = new Date();
      desde.setDate(desde.getDate() - parseInt(periodo));

      const res = await fetch(`/api/admin/promociones/stats?promoId=${promoId}&desde=${desde.toISOString()}`);
      const data = await res.json();
      if (data.success) {
        setStatsPromo(data);
        setPromoSeleccionada(promoId);
      }
    } catch (e) {
      console.error('Error cargando stats de promo:', e);
    }
  }

  function formatearNumero(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  if (cargando) {
    return (
      <div className="stats-loading">
        <div className="spinner">◆</div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="stats-page">
      {/* Header */}
      <header className="stats-header">
        <div className="header-left">
          <a href="/admin/promociones" className="back-link">← Promociones</a>
          <h1>Estadísticas</h1>
        </div>
        <div className="header-right">
          <select value={periodo} onChange={e => setPeriodo(e.target.value)}>
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
        </div>
      </header>

      <main className="stats-main">
        {/* Resumen General */}
        <section className="resumen-section">
          <h2>Resumen General</h2>
          <div className="resumen-grid">
            <div className="resumen-card">
              <span className="resumen-icon">📊</span>
              <div className="resumen-data">
                <span className="resumen-num">{stats?.resumen?.totalPromociones || 0}</span>
                <span className="resumen-label">Promociones</span>
              </div>
            </div>
            <div className="resumen-card">
              <span className="resumen-icon">👁</span>
              <div className="resumen-data">
                <span className="resumen-num">{formatearNumero(stats?.resumen?.totalVistas || 0)}</span>
                <span className="resumen-label">Vistas totales</span>
              </div>
            </div>
            <div className="resumen-card">
              <span className="resumen-icon">👆</span>
              <div className="resumen-data">
                <span className="resumen-num">{formatearNumero(stats?.resumen?.totalClicks || 0)}</span>
                <span className="resumen-label">Clicks totales</span>
              </div>
            </div>
            <div className="resumen-card destacado">
              <span className="resumen-icon">📈</span>
              <div className="resumen-data">
                <span className="resumen-num">{stats?.resumen?.ctrGeneral || 0}%</span>
                <span className="resumen-label">CTR Promedio</span>
              </div>
            </div>
          </div>
        </section>

        {/* Gráfico de clicks */}
        <section className="grafico-section">
          <h2>Clicks en el tiempo</h2>
          <div className="grafico-container">
            {stats?.grafico && (
              <div className="grafico-barras">
                {stats.grafico.map((dia, idx) => {
                  const maxClicks = Math.max(...stats.grafico.map(d => d.clicks), 1);
                  const altura = (dia.clicks / maxClicks) * 100;
                  return (
                    <div key={idx} className="barra-container" title={`${dia.fecha}: ${dia.clicks} clicks`}>
                      <div className="barra" style={{ height: `${altura}%` }}>
                        {dia.clicks > 0 && <span className="barra-valor">{dia.clicks}</span>}
                      </div>
                      <span className="barra-fecha">{new Date(dia.fecha).getDate()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="dos-columnas">
          {/* Top promociones */}
          <section className="top-section">
            <h2>Top Promociones (por CTR)</h2>
            <div className="top-lista">
              {stats?.topPromos?.map((promo, idx) => (
                <div
                  key={promo.id}
                  className={`top-item ${promoSeleccionada === promo.id ? 'seleccionada' : ''}`}
                  onClick={() => cargarStatsPromo(promo.id)}
                >
                  <span className="top-pos">#{idx + 1}</span>
                  <div className="top-info">
                    <span className="top-titulo">{promo.titulo}</span>
                    <span className="top-meta">{promo.vistas} vistas • {promo.clicks} clicks</span>
                  </div>
                  <span className="top-ctr">{promo.ctr}%</span>
                </div>
              ))}
              {(!stats?.topPromos || stats.topPromos.length === 0) && (
                <div className="sin-datos">No hay datos suficientes</div>
              )}
            </div>
          </section>

          {/* Clicks por ubicación */}
          <section className="ubicaciones-section">
            <h2>Clicks por Ubicación</h2>
            <div className="ubicaciones-lista">
              {stats?.clicksPorUbicacion && Object.entries(stats.clicksPorUbicacion)
                .sort((a, b) => b[1] - a[1])
                .map(([ubi, clicks]) => {
                  const total = Object.values(stats.clicksPorUbicacion).reduce((a, b) => a + b, 0);
                  const porcentaje = total > 0 ? ((clicks / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={ubi} className="ubicacion-item">
                      <div className="ubicacion-info">
                        <span className="ubicacion-nombre">{UBICACIONES_NOMBRES[ubi] || ubi}</span>
                        <span className="ubicacion-clicks">{clicks} clicks</span>
                      </div>
                      <div className="ubicacion-barra">
                        <div className="ubicacion-progreso" style={{ width: `${porcentaje}%` }}></div>
                      </div>
                      <span className="ubicacion-pct">{porcentaje}%</span>
                    </div>
                  );
                })}
              {(!stats?.clicksPorUbicacion || Object.keys(stats.clicksPorUbicacion).length === 0) && (
                <div className="sin-datos">No hay datos de ubicación</div>
              )}
            </div>
          </section>
        </div>

        {/* Detalle de promo seleccionada */}
        {statsPromo && (
          <section className="detalle-section">
            <div className="detalle-header">
              <h2>Detalle: {statsPromo.promo.titulo}</h2>
              <button onClick={() => { setPromoSeleccionada(null); setStatsPromo(null); }}>×</button>
            </div>

            <div className="detalle-stats">
              <div className="detalle-stat">
                <span className="num">{statsPromo.stats.vistas}</span>
                <span className="label">Vistas</span>
              </div>
              <div className="detalle-stat">
                <span className="num">{statsPromo.stats.clicks}</span>
                <span className="label">Clicks</span>
              </div>
              <div className="detalle-stat destacado">
                <span className="num">{statsPromo.stats.ctr}%</span>
                <span className="label">CTR</span>
              </div>
            </div>

            {/* Clicks por ubicación de esta promo */}
            {statsPromo.stats.clicksPorUbicacion && Object.keys(statsPromo.stats.clicksPorUbicacion).length > 0 && (
              <div className="detalle-ubicaciones">
                <h4>Por ubicación</h4>
                {Object.entries(statsPromo.stats.clicksPorUbicacion).map(([ubi, clicks]) => (
                  <div key={ubi} className="mini-ubicacion">
                    <span>{UBICACIONES_NOMBRES[ubi] || ubi}</span>
                    <span>{clicks}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tabla completa */}
        <section className="tabla-section">
          <h2>Todas las Promociones</h2>
          <div className="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Promoción</th>
                  <th>Estado</th>
                  <th>Vistas</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats?.promociones?.map(promo => (
                  <tr key={promo.id} className={promo.estado}>
                    <td>{promo.titulo}</td>
                    <td><span className={`estado-badge ${promo.estado}`}>{promo.estado}</span></td>
                    <td>{promo.vistas}</td>
                    <td>{promo.clicks}</td>
                    <td className="ctr">{promo.ctr}%</td>
                    <td>
                      <button onClick={() => cargarStatsPromo(promo.id)} className="btn-ver">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style jsx>{`
        .stats-page {
          min-height: 100vh;
          background: #0f0f0f;
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .stats-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          font-size: 3rem;
          color: #d4af37;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
        }

        .header-left { display: flex; align-items: center; gap: 20px; }
        .back-link { color: #888; text-decoration: none; }
        .back-link:hover { color: #d4af37; }

        .stats-header h1 {
          font-size: 24px;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-right select {
          padding: 10px 15px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
        }

        .stats-main { padding: 30px; }

        section { margin-bottom: 30px; }
        section h2 { font-size: 18px; color: #d4af37; margin: 0 0 20px; }

        .resumen-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .resumen-card {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .resumen-card.destacado { border: 2px solid #d4af37; }

        .resumen-icon { font-size: 2.5rem; }
        .resumen-data { display: flex; flex-direction: column; }
        .resumen-num { font-size: 2rem; font-weight: 700; color: #fff; }
        .resumen-label { color: #888; font-size: 0.9rem; }

        .grafico-section .grafico-container {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 25px;
          height: 250px;
        }

        .grafico-barras {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 100%;
          gap: 4px;
        }

        .barra-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .barra {
          width: 100%;
          background: linear-gradient(180deg, #d4af37, #8b7355);
          border-radius: 4px 4px 0 0;
          min-height: 2px;
          position: relative;
          transition: height 0.3s;
        }

        .barra-valor {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: #d4af37;
        }

        .barra-fecha {
          font-size: 10px;
          color: #666;
          margin-top: 5px;
        }

        .dos-columnas {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .top-section, .ubicaciones-section {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 25px;
        }

        .top-lista { display: flex; flex-direction: column; gap: 10px; }

        .top-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #252525;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .top-item:hover { background: #2a2a2a; }
        .top-item.seleccionada { border: 2px solid #d4af37; }

        .top-pos { font-size: 1.2rem; font-weight: 700; color: #d4af37; width: 35px; }
        .top-info { flex: 1; }
        .top-titulo { display: block; color: #fff; font-weight: 500; }
        .top-meta { font-size: 0.85rem; color: #888; }
        .top-ctr { font-size: 1.25rem; font-weight: 700; color: #27ae60; }

        .ubicaciones-lista { display: flex; flex-direction: column; gap: 15px; }

        .ubicacion-item { display: flex; align-items: center; gap: 15px; }
        .ubicacion-info { flex: 1; }
        .ubicacion-nombre { display: block; color: #fff; font-size: 0.95rem; }
        .ubicacion-clicks { font-size: 0.85rem; color: #888; }

        .ubicacion-barra {
          width: 100px;
          height: 8px;
          background: #333;
          border-radius: 4px;
          overflow: hidden;
        }

        .ubicacion-progreso {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #8b7355);
          border-radius: 4px;
        }

        .ubicacion-pct { width: 50px; text-align: right; color: #d4af37; font-weight: 600; }

        .sin-datos { color: #666; text-align: center; padding: 20px; }

        .detalle-section {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 25px;
          border: 2px solid #d4af37;
        }

        .detalle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .detalle-header button {
          background: none;
          border: none;
          color: #888;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .detalle-stats {
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
        }

        .detalle-stat {
          background: #252525;
          padding: 20px 30px;
          border-radius: 8px;
          text-align: center;
        }

        .detalle-stat.destacado { border: 2px solid #d4af37; }
        .detalle-stat .num { display: block; font-size: 2rem; font-weight: 700; }
        .detalle-stat .label { color: #888; font-size: 0.85rem; }

        .detalle-ubicaciones h4 { color: #888; font-size: 0.9rem; margin: 0 0 10px; }

        .mini-ubicacion {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #333;
          font-size: 0.9rem;
        }

        .tabla-section .tabla-container {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
        }

        table { width: 100%; border-collapse: collapse; }

        th, td {
          padding: 15px 20px;
          text-align: left;
          border-bottom: 1px solid #252525;
        }

        th { background: #252525; color: #888; font-size: 0.85rem; font-weight: 600; }

        td { color: #fff; }
        td.ctr { color: #27ae60; font-weight: 600; }

        .estado-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .estado-badge.activa { background: rgba(39, 174, 96, 0.2); color: #27ae60; }
        .estado-badge.pausada { background: rgba(241, 196, 15, 0.2); color: #f1c40f; }
        .estado-badge.borrador { background: rgba(136, 136, 136, 0.2); color: #888; }
        .estado-badge.finalizada { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }

        .btn-ver {
          padding: 6px 12px;
          background: #333;
          border: none;
          border-radius: 6px;
          color: #888;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .btn-ver:hover { background: #444; color: #fff; }

        @media (max-width: 1024px) {
          .resumen-grid { grid-template-columns: repeat(2, 1fr); }
          .dos-columnas { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .resumen-grid { grid-template-columns: 1fr; }
          .detalle-stats { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
