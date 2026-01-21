'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL DE APROBACIÓN DE CANALIZACIONES
// Lista de canalizaciones pendientes, aprobadas y enviadas
// ═══════════════════════════════════════════════════════════════════════════════

export default function CanalizacionesAdmin() {
  const router = useRouter();
  const [tabActiva, setTabActiva] = useState('pendiente');
  const [canalizaciones, setCanalizaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [contadores, setContadores] = useState({ pendiente: 0, aprobada: 0, enviada: 0 });

  useEffect(() => {
    cargarCanalizaciones(tabActiva);
    cargarContadores();
  }, [tabActiva]);

  async function cargarCanalizaciones(estado) {
    setCargando(true);
    try {
      const res = await fetch(`/api/admin/canalizaciones?estado=${estado}`);
      const data = await res.json();
      if (data.success) {
        setCanalizaciones(data.canalizaciones || []);
      }
    } catch (error) {
      console.error('Error cargando canalizaciones:', error);
    }
    setCargando(false);
  }

  async function cargarContadores() {
    try {
      const [pendientes, aprobadas, enviadas] = await Promise.all([
        fetch('/api/admin/canalizaciones?estado=pendiente').then(r => r.json()),
        fetch('/api/admin/canalizaciones?estado=aprobada').then(r => r.json()),
        fetch('/api/admin/canalizaciones?estado=enviada').then(r => r.json())
      ]);

      setContadores({
        pendiente: pendientes.canalizaciones?.length || 0,
        aprobada: aprobadas.canalizaciones?.length || 0,
        enviada: enviadas.canalizaciones?.length || 0
      });
    } catch (error) {
      console.error('Error cargando contadores:', error);
    }
  }

  function formatearFecha(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    const ahora = new Date();
    const diff = ahora - d;
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const dias = Math.floor(horas / 24);

    if (horas < 1) return 'hace menos de 1 hora';
    if (horas < 24) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (dias < 7) return `hace ${dias} día${dias > 1 ? 's' : ''}`;
    return d.toLocaleDateString('es-UY');
  }

  const tabs = [
    { id: 'pendiente', label: 'Pendientes', count: contadores.pendiente },
    { id: 'aprobada', label: 'Aprobadas', count: contadores.aprobada },
    { id: 'enviada', label: 'Enviadas', count: contadores.enviada }
  ];

  return (
    <div className="canalizaciones-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-icon">&#10022;</div>
          <div>
            <h1 className="titulo">Canalizaciones</h1>
            <p className="subtitulo">Panel de aprobación</p>
          </div>
        </div>
        <button onClick={() => router.push('/admin/circulo')} className="btn-volver">
          Volver al Hub
        </button>
      </header>

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${tabActiva === tab.id ? 'activa' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Lista */}
      <main className="lista-container">
        {cargando ? (
          <div className="cargando">
            <div className="spinner"></div>
            <p>Cargando canalizaciones...</p>
          </div>
        ) : canalizaciones.length === 0 ? (
          <div className="vacio">
            <p>No hay canalizaciones {tabActiva === 'pendiente' ? 'pendientes' : tabActiva === 'aprobada' ? 'aprobadas' : 'enviadas'}.</p>
          </div>
        ) : (
          <div className="lista">
            {canalizaciones.map(c => (
              <div key={c.id} className="card-canalizacion" onClick={() => router.push(`/admin/canalizaciones/${encodeURIComponent(c.id)}`)}>
                <div className="card-imagen">
                  {c.guardian?.imagen ? (
                    <img src={c.guardian.imagen} alt={c.guardian.nombre} />
                  ) : (
                    <div className="placeholder-img">&#10022;</div>
                  )}
                </div>
                <div className="card-info">
                  <h3 className="card-titulo">
                    {c.guardian?.nombre || 'Guardián'} para {c.nombreCliente}
                  </h3>
                  <p className="card-meta">
                    Orden #{c.ordenId?.toString().slice(-4) || '????'} - {formatearFecha(c.fechaCompra)}
                  </p>
                  <p className="card-descripcion">
                    {c.resumen || `Canalización de ${c.guardian?.categoria || 'protección'}`}
                  </p>
                </div>
                <div className="card-acciones">
                  <span className={`estado ${c.estado}`}>
                    {c.estado === 'pendiente' ? 'Pendiente' :
                     c.estado === 'aprobada' ? 'Aprobada' : 'Enviada'}
                  </span>
                  <button className="btn-ver">
                    {c.estado === 'pendiente' ? 'Ver y Aprobar' : 'Ver detalle'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=MedievalSharp&display=swap');

        .canalizaciones-container {
          min-height: 100vh;
          background: #0a0a0a;
          font-family: 'Cinzel', serif;
          color: #e8e0d5;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          background: linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(10,10,10,0) 100%);
          border-bottom: 1px solid rgba(212,175,55,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #0a0a0a;
          box-shadow: 0 0 20px rgba(212,175,55,0.3);
        }

        .titulo {
          font-family: 'MedievalSharp', cursive;
          font-size: 1.5rem;
          color: #d4af37;
          margin: 0;
          letter-spacing: 1px;
        }

        .subtitulo {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
          font-weight: 400;
        }

        .btn-volver {
          padding: 0.6rem 1.25rem;
          background: transparent;
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-volver:hover {
          background: rgba(212,175,55,0.1);
          border-color: #d4af37;
        }

        /* Tabs */
        .tabs-container {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #888;
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab:hover {
          background: rgba(255,255,255,0.05);
          color: #e8e0d5;
        }

        .tab.activa {
          background: rgba(212,175,55,0.15);
          border-color: rgba(212,175,55,0.3);
          color: #d4af37;
        }

        .tab-count {
          background: rgba(212,175,55,0.3);
          color: #d4af37;
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .tab.activa .tab-count {
          background: #d4af37;
          color: #0a0a0a;
        }

        /* Lista */
        .lista-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cargando, .vacio {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(212,175,55,0.2);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .lista {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-canalizacion {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .card-canalizacion:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(212,175,55,0.2);
          transform: translateY(-2px);
        }

        .card-imagen {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(212,175,55,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-imagen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-img {
          font-size: 2rem;
          color: #d4af37;
          opacity: 0.5;
        }

        .card-info {
          flex: 1;
          min-width: 0;
        }

        .card-titulo {
          font-size: 1.1rem;
          color: #e8e0d5;
          margin: 0 0 0.25rem;
          font-weight: 500;
        }

        .card-meta {
          font-size: 0.8rem;
          color: #666;
          margin: 0 0 0.5rem;
        }

        .card-descripcion {
          font-size: 0.85rem;
          color: #999;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .card-acciones {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.75rem;
        }

        .estado {
          font-size: 0.7rem;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .estado.pendiente {
          background: rgba(255,180,50,0.15);
          color: #ffb432;
        }

        .estado.aprobada {
          background: rgba(100,200,100,0.15);
          color: #6c6;
        }

        .estado.enviada {
          background: rgba(100,150,255,0.15);
          color: #7af;
        }

        .btn-ver {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border: none;
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-ver:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(212,175,55,0.3);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .tabs-container {
            padding: 1rem;
            overflow-x: auto;
          }

          .tab {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
            white-space: nowrap;
          }

          .lista-container {
            padding: 1rem;
          }

          .card-canalizacion {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .card-imagen {
            width: 60px;
            height: 60px;
          }

          .card-acciones {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.5rem;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(255,255,255,0.05);
          }
        }
      `}</style>
    </div>
  );
}
