'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: CALENDARIO EDITORIAL
// Vista de mes con fases lunares, celebraciones celtas y contenido programado
// ═══════════════════════════════════════════════════════════════════════════════

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarioEditorial() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());
  const [calendario, setCalendario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  useEffect(() => {
    cargarCalendario();
  }, [mes, año]);

  async function cargarCalendario() {
    setCargando(true);
    try {
      const res = await fetch(`/api/admin/calendario?mes=${mes}&ano=${año}`);
      const data = await res.json();
      if (data.success) {
        setCalendario(data);
      }
    } catch (err) {
      console.error('Error cargando calendario:', err);
    }
    setCargando(false);
  }

  function cambiarMes(delta) {
    let nuevoMes = mes + delta;
    let nuevoAño = año;

    if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAño--;
    } else if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAño++;
    }

    setMes(nuevoMes);
    setAño(nuevoAño);
  }

  function irAHoy() {
    const hoy = new Date();
    setMes(hoy.getMonth() + 1);
    setAño(hoy.getFullYear());
  }

  // Construir grid del calendario
  function construirGrid() {
    if (!calendario) return [];

    const grid = [];
    let semana = [];

    // Espacios vacíos antes del primer día
    for (let i = 0; i < calendario.primerDia; i++) {
      semana.push(null);
    }

    // Días del mes
    for (const dia of calendario.dias) {
      semana.push(dia);

      if (semana.length === 7) {
        grid.push(semana);
        semana = [];
      }
    }

    // Completar última semana
    while (semana.length > 0 && semana.length < 7) {
      semana.push(null);
    }
    if (semana.length > 0) {
      grid.push(semana);
    }

    return grid;
  }

  const grid = construirGrid();

  return (
    <div className="admin-calendario">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <a href="/admin" className="back-link">← Admin</a>
          <h1>Calendario Editorial</h1>
        </div>
        <div className="header-actions">
          <a href="/admin/circulo/duende-semana" className="btn-link">Duende de la Semana</a>
          <a href="/admin/circulo/contenido" className="btn-link">Generar Contenido</a>
        </div>
      </header>

      <main className="admin-main">
        {/* Navegación del mes */}
        <div className="mes-nav">
          <button onClick={() => cambiarMes(-1)} className="btn-nav">←</button>
          <div className="mes-titulo">
            <h2>{MESES[mes - 1]} {año}</h2>
            <button onClick={irAHoy} className="btn-hoy">Hoy</button>
          </div>
          <button onClick={() => cambiarMes(1)} className="btn-nav">→</button>
        </div>

        {/* Stats */}
        {calendario && (
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-num">{calendario.stats.diasConContenido}</span>
              <span className="stat-label">Publicados</span>
            </div>
            <div className="stat">
              <span className="stat-num">{calendario.stats.diasProgramados}</span>
              <span className="stat-label">Programados</span>
            </div>
            <div className="stat">
              <span className="stat-num">{calendario.stats.diasVacios}</span>
              <span className="stat-label">Sin contenido</span>
            </div>
            <div className="stat">
              <span className="stat-num">{calendario.stats.celebraciones}</span>
              <span className="stat-label">Celebraciones</span>
            </div>
          </div>
        )}

        {/* Leyenda */}
        <div className="leyenda">
          <span><span className="dot publicado"></span> Publicado</span>
          <span><span className="dot programado"></span> Programado</span>
          <span><span className="dot vacio"></span> Vacío</span>
          <span>🌑🌒🌕🌘 Fases lunares</span>
          <span>☀ Celebración celta</span>
        </div>

        {/* Calendario */}
        <div className="calendario-grid">
          {/* Header de días */}
          <div className="calendario-header">
            {DIAS_SEMANA.map(dia => (
              <div key={dia} className="dia-header">{dia}</div>
            ))}
          </div>

          {/* Semanas */}
          {cargando ? (
            <div className="cargando">
              <div className="spinner"></div>
              <p>Cargando calendario...</p>
            </div>
          ) : (
            grid.map((semana, i) => (
              <div key={i} className="semana">
                {semana.map((dia, j) => (
                  <div
                    key={j}
                    className={`dia-cell ${!dia ? 'vacio' : ''} ${dia?.esHoy ? 'hoy' : ''} ${dia?.contenido ? 'con-contenido' : ''} ${dia?.celebracion ? 'celebracion' : ''}`}
                    onClick={() => dia && setDiaSeleccionado(dia)}
                  >
                    {dia && (
                      <>
                        <div className="dia-num">{dia.dia}</div>
                        <div className="dia-icons">
                          {dia.faseLunar && (
                            <span className="fase-lunar" title={dia.faseLunar.nombre}>
                              {dia.faseLunar.icono}
                            </span>
                          )}
                          {dia.celebracion && (
                            <span className="icono-celebracion" title={dia.celebracion.nombre}>☀</span>
                          )}
                        </div>
                        {dia.contenido && (
                          <div className={`contenido-indicator ${dia.contenido.estado}`}>
                            {dia.contenido.estado === 'publicado' ? '✓' : '•'}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Detalle del día seleccionado */}
        {diaSeleccionado && (
          <div className="modal-overlay" onClick={() => setDiaSeleccionado(null)}>
            <div className="modal-detalle" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  {diaSeleccionado.dia} de {MESES[mes - 1]}
                  {diaSeleccionado.esHoy && <span className="badge-hoy">Hoy</span>}
                </h3>
                <button onClick={() => setDiaSeleccionado(null)} className="btn-cerrar">×</button>
              </div>

              <div className="modal-body">
                {/* Info del día */}
                <div className="info-dia">
                  <div className="info-item">
                    <span className="label">Fase Lunar</span>
                    <span className="value">
                      {diaSeleccionado.faseLunar.icono} {diaSeleccionado.faseLunar.nombre}
                    </span>
                  </div>

                  {diaSeleccionado.celebracion && (
                    <div className="info-item celebracion-info">
                      <span className="label">Celebración Celta</span>
                      <span className="value">☀ {diaSeleccionado.celebracion.nombre}</span>
                      <p className="celebracion-desc">{diaSeleccionado.celebracion.significado}</p>
                    </div>
                  )}
                </div>

                {/* Contenido del día */}
                {diaSeleccionado.contenido ? (
                  <div className="contenido-dia">
                    <h4>Contenido {diaSeleccionado.contenido.estado}</h4>
                    <div className="contenido-preview">
                      <span className="tipo">{diaSeleccionado.contenido.tipo}</span>
                      <span className="titulo">{diaSeleccionado.contenido.titulo}</span>
                    </div>
                    <div className="contenido-actions">
                      <button className="btn-ver">Ver contenido</button>
                      <button className="btn-editar">Editar</button>
                      <button className="btn-eliminar">Eliminar</button>
                    </div>
                  </div>
                ) : (
                  <div className="sin-contenido">
                    <p>No hay contenido para este día</p>
                    <a
                      href={`/admin/circulo/contenido?fecha=${diaSeleccionado.fecha}`}
                      className="btn-generar"
                    >
                      Generar contenido para este día
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-calendario {
          min-height: 100vh;
          background: #0f0f0f;
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* Header */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
        }

        .header-left { display: flex; align-items: center; gap: 20px; }

        .back-link { color: #888; text-decoration: none; font-size: 14px; }
        .back-link:hover { color: #d4af37; }

        .admin-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-actions { display: flex; gap: 10px; }

        .btn-link {
          color: #888;
          text-decoration: none;
          font-size: 13px;
          padding: 8px 16px;
          border: 1px solid #333;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .btn-link:hover { border-color: #d4af37; color: #d4af37; }

        /* Main */
        .admin-main { padding: 30px; max-width: 1200px; margin: 0 auto; }

        /* Navegación del mes */
        .mes-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .mes-titulo {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .mes-titulo h2 {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
          color: #d4af37;
        }

        .btn-nav {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #888;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-nav:hover { border-color: #d4af37; color: #d4af37; }

        .btn-hoy {
          background: #333;
          border: none;
          color: #888;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-hoy:hover { background: #444; color: #fff; }

        /* Stats */
        .stats-bar {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
        }

        .stat {
          background: #1a1a1a;
          padding: 15px 25px;
          border-radius: 12px;
          text-align: center;
        }

        .stat-num {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #d4af37;
        }

        .stat-label { font-size: 12px; color: #888; }

        /* Leyenda */
        .leyenda {
          display: flex;
          gap: 25px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #888;
        }

        .leyenda span { display: flex; align-items: center; gap: 6px; }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot.publicado { background: #2ecc71; }
        .dot.programado { background: #f39c12; }
        .dot.vacio { background: #333; }

        /* Calendario Grid */
        .calendario-grid {
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
        }

        .calendario-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: #252525;
        }

        .dia-header {
          padding: 15px;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
        }

        .semana {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }

        .dia-cell {
          min-height: 100px;
          padding: 10px;
          border: 1px solid #252525;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .dia-cell:hover:not(.vacio) { background: #252525; }

        .dia-cell.vacio {
          background: #151515;
          cursor: default;
        }

        .dia-cell.hoy {
          background: rgba(212, 175, 55, 0.1);
          border-color: #d4af37;
        }

        .dia-cell.celebracion {
          background: rgba(201, 162, 39, 0.1);
        }

        .dia-num {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .hoy .dia-num { color: #d4af37; }

        .dia-icons {
          display: flex;
          gap: 5px;
          margin-top: 5px;
        }

        .fase-lunar { font-size: 16px; }

        .icono-celebracion {
          color: #c9a227;
          font-size: 14px;
        }

        .contenido-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        .contenido-indicator.publicado {
          background: #2ecc71;
          color: #fff;
        }

        .contenido-indicator.programado {
          background: #f39c12;
          color: #fff;
        }

        /* Cargando */
        .cargando {
          text-align: center;
          padding: 60px;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #333;
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-detalle {
          background: #1a1a1a;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 1px solid #2a2a2a;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 20px;
          color: #d4af37;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .badge-hoy {
          background: #d4af37;
          color: #000;
          font-size: 10px;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 600;
        }

        .btn-cerrar {
          background: none;
          border: none;
          color: #888;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
        }

        .modal-body { padding: 25px; }

        .info-dia {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 25px;
        }

        .info-item {
          background: #252525;
          padding: 15px;
          border-radius: 10px;
        }

        .info-item .label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 5px;
        }

        .info-item .value { font-size: 16px; }

        .celebracion-info { border-left: 3px solid #c9a227; }

        .celebracion-desc {
          font-size: 13px;
          color: #888;
          margin: 10px 0 0 0;
        }

        .contenido-dia h4 {
          font-size: 14px;
          color: #888;
          margin: 0 0 15px 0;
        }

        .contenido-preview {
          background: #252525;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .contenido-preview .tipo {
          display: inline-block;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 8px;
        }

        .contenido-preview .titulo {
          display: block;
          font-weight: 500;
        }

        .contenido-actions {
          display: flex;
          gap: 10px;
        }

        .contenido-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-ver { background: #d4af37; border: none; color: #000; }
        .btn-editar { background: #333; border: none; color: #888; }
        .btn-eliminar { background: transparent; border: 1px solid #e74c3c; color: #e74c3c; }

        .sin-contenido {
          text-align: center;
          padding: 30px;
        }

        .sin-contenido p {
          color: #666;
          margin-bottom: 15px;
        }

        .sin-contenido .btn-generar {
          display: inline-block;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .stats-bar { flex-wrap: wrap; }
          .stat { flex: 1; min-width: 100px; }
          .leyenda { flex-wrap: wrap; }
          .dia-cell { min-height: 70px; padding: 5px; }
          .dia-num { font-size: 14px; }
          .dia-icons { font-size: 12px; }
        }
      `}</style>
    </div>
  );
}
