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
  const [contadores, setContadores] = useState({ borrador: 0, pendiente: 0, aprobada: 0, enviada: 0 });
  // Buscar por pedido
  const [numeroPedido, setNumeroPedido] = useState('');
  const [buscandoPedido, setBuscandoPedido] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [errorPedido, setErrorPedido] = useState(null);
  const [enviandoFormItem, setEnviandoFormItem] = useState(null);

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
      const [borradores, pendientes, aprobadas, enviadas] = await Promise.all([
        fetch('/api/admin/canalizaciones?estado=borrador').then(r => r.json()),
        fetch('/api/admin/canalizaciones?estado=pendiente').then(r => r.json()),
        fetch('/api/admin/canalizaciones?estado=aprobada').then(r => r.json()),
        fetch('/api/admin/canalizaciones?estado=enviada').then(r => r.json())
      ]);

      setContadores({
        borrador: borradores.canalizaciones?.length || 0,
        pendiente: pendientes.canalizaciones?.length || 0,
        aprobada: aprobadas.canalizaciones?.length || 0,
        enviada: enviadas.canalizaciones?.length || 0
      });
    } catch (error) {
      console.error('Error cargando contadores:', error);
    }
  }

  async function buscarPedido() {
    if (!numeroPedido.trim()) return;
    setBuscandoPedido(true);
    setErrorPedido(null);
    setPedido(null);
    try {
      const res = await fetch(`/api/admin/canalizaciones/por-pedido?orden=${numeroPedido.trim()}`);
      const data = await res.json();
      if (data.success) {
        setPedido(data.pedido);
      } else {
        setErrorPedido(data.error || 'Pedido no encontrado');
      }
    } catch {
      setErrorPedido('Error de conexión');
    }
    setBuscandoPedido(false);
  }

  async function enviarFormItem(item, formType) {
    if (!pedido) return;
    setEnviandoFormItem(item.product_id);
    try {
      // 1. Crear borrador vinculado a la orden
      const resBorrador = await fetch('/api/admin/canalizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          esManual: true,
          ordenId: pedido.id,
          email: pedido.email,
          nombreCliente: pedido.nombre,
          productoManual: {
            nombre: item.nombre,
            tipo: 'guardian',
            categoria: 'proteccion',
            productId: item.product_id,
            imagenUrl: item.imagen || null
          },
          formType,
          notaAdmin: `Pedido #${pedido.numero}`
        })
      });
      const dataBorrador = await resBorrador.json();

      if (!dataBorrador.success) {
        console.error('Error creando borrador:', dataBorrador.error);
        setEnviandoFormItem(null);
        return;
      }

      // 2. Enviar formulario vinculado al borrador
      const res = await fetch('/api/admin/formularios/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pedido.email,
          nombre: pedido.nombre,
          formType,
          ordenId: pedido.id,
          productName: item.nombre,
          canalizacionId: dataBorrador.id
        })
      });
      const data = await res.json();
      if (data.success) {
        buscarPedido();
        cargarContadores();
      }
    } catch {
      // silenciar
    }
    setEnviandoFormItem(null);
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
    { id: 'borrador', label: 'Borradores', count: contadores.borrador },
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
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button className="btn-nuevo" onClick={() => router.push('/admin/canalizaciones/nueva')}>+ Nueva Canalización</button>
            <span className="btn-nuevo-hint">Ventas fuera de la web</span>
          </div>
          <button onClick={() => window.history.length > 1 ? window.history.back() : window.close()} className="btn-volver">
            ← Volver
          </button>
        </div>
      </header>

      {/* Buscar por Pedido — para ventas web */}
      <div className="buscar-pedido-container">
        <h3 className="seccion-titulo">Buscar Pedido</h3>
        <p className="seccion-desc">Usá esto si alguien compró en la web y necesitás enviarle el formulario de canalización. Ponés el número de pedido, te muestra los guardianes que compró, y desde ahí le mandás el formulario a cada uno.</p>
        <div className="buscar-pedido-row">
          <input
            className="buscar-input"
            type="text"
            value={numeroPedido}
            onChange={e => setNumeroPedido(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarPedido()}
            placeholder="Nro de pedido (ej: 1234)"
          />
          <button className="btn-buscar" onClick={buscarPedido} disabled={buscandoPedido || !numeroPedido.trim()}>
            {buscandoPedido ? 'Buscando...' : 'Buscar Pedido'}
          </button>
          {pedido && (
            <button className="btn-cerrar-pedido" onClick={() => { setPedido(null); setNumeroPedido(''); }}>Cerrar</button>
          )}
        </div>
        {errorPedido && <p className="error-pedido">{errorPedido}</p>}
        {pedido && (
          <div className="pedido-panel">
            <div className="pedido-header">
              <div>
                <h3 className="pedido-titulo">Pedido #{pedido.numero} — {pedido.nombre}</h3>
                <p className="pedido-meta">{pedido.email} | {pedido.estado} | ${pedido.total} {pedido.moneda} | Tipo: {pedido.tipoDestinatario || 'no definido'}</p>
              </div>
            </div>
            <div className="pedido-items">
              {pedido.items.map(item => {
                const canalExistente = pedido.canalizaciones.find(c => String(c.productId) === String(item.product_id));
                const invExistente = pedido.invitaciones.find(i => i.formType);
                return (
                  <div key={item.id} className="pedido-item">
                    <div className="pedido-item-img">
                      {item.imagen ? <img src={item.imagen} alt={item.nombre} /> : <span className="placeholder-img">&#10022;</span>}
                    </div>
                    <div className="pedido-item-info">
                      <h4 className="pedido-item-nombre">{item.nombre}</h4>
                      <p className="pedido-item-meta">x{item.cantidad} — ${item.total}</p>
                    </div>
                    <div className="pedido-item-acciones">
                      {canalExistente ? (
                        <>
                          <span className={`estado ${canalExistente.estado}`}>
                            {canalExistente.estado === 'borrador' ? 'Borrador' : canalExistente.estado === 'pendiente' ? 'Pendiente' : canalExistente.estado === 'aprobada' ? 'Aprobada' : 'Enviada'}
                          </span>
                          <button className="btn-ver-sm" onClick={() => router.push(`/admin/canalizaciones/${encodeURIComponent(canalExistente.id)}`)}>
                            Ver
                          </button>
                        </>
                      ) : (
                        <div className="pedido-item-enviar">
                          <select className="form-input-sm" id={`tipo-${item.product_id}`} defaultValue={pedido.tipoDestinatario || 'para_mi'}>
                            <option value="para_mi">Para mí</option>
                            <option value="regalo_sabe">Regalo (sabe)</option>
                            <option value="regalo_sorpresa">Sorpresa</option>
                            <option value="para_nino">Niño/a</option>
                            <option value="reconexion">Reconexión</option>
                          </select>
                          <button
                            className="btn-enviar-sm"
                            disabled={enviandoFormItem === item.product_id}
                            onClick={() => {
                              const sel = document.getElementById(`tipo-${item.product_id}`);
                              enviarFormItem(item, sel.value);
                            }}
                          >
                            {enviandoFormItem === item.product_id ? '...' : 'Enviar Form'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <p className="tabs-desc">Acá abajo están todas las canalizaciones. Borradores = esperando que el cliente llene el formulario. Pendientes = la IA ya generó, revisá y aprobá. Aprobadas = listas para enviar. Enviadas = el cliente ya las recibió.</p>
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
                    {c.estado === 'borrador' ? 'Borrador' :
                     c.estado === 'pendiente' ? 'Pendiente' :
                     c.estado === 'aprobada' ? 'Aprobada' : 'Enviada'}
                  </span>
                  <button className="btn-ver">
                    {c.estado === 'borrador' ? 'Editar' :
                     c.estado === 'pendiente' ? 'Ver y Aprobar' : 'Ver detalle'}
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

        /* Buscar por Pedido */
        .buscar-pedido-container {
          padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .buscar-pedido-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .buscar-input {
          padding: 10px 14px;
          background: #111;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 0.9rem;
          font-family: inherit;
          width: 200px;
          outline: none;
        }
        .buscar-input:focus {
          border-color: rgba(212,175,55,0.5);
        }
        .btn-buscar {
          padding: 10px 18px;
          background: rgba(212,175,55,0.15);
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-buscar:hover:not(:disabled) {
          background: rgba(212,175,55,0.25);
        }
        .btn-buscar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-cerrar-pedido {
          padding: 10px 14px;
          background: transparent;
          border: 1px solid #444;
          color: #888;
          font-family: inherit;
          font-size: 0.85rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .error-pedido {
          color: #f66;
          font-size: 0.85rem;
          margin: 0.5rem 0 0;
        }
        .pedido-panel {
          margin-top: 1rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 12px;
          padding: 1.25rem;
        }
        .pedido-header {
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .pedido-titulo {
          font-family: 'MedievalSharp', cursive;
          color: #d4af37;
          font-size: 1.1rem;
          margin: 0 0 0.25rem;
        }
        .pedido-meta {
          color: #888;
          font-size: 0.8rem;
          margin: 0;
        }
        .pedido-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pedido-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
        }
        .pedido-item-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(212,175,55,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pedido-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pedido-item-info {
          flex: 1;
          min-width: 0;
        }
        .pedido-item-nombre {
          font-size: 0.95rem;
          color: #e8e0d5;
          margin: 0 0 0.15rem;
        }
        .pedido-item-meta {
          font-size: 0.8rem;
          color: #666;
          margin: 0;
        }
        .pedido-item-acciones {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .pedido-item-enviar {
          display: flex;
          gap: 0.4rem;
          align-items: center;
        }
        .form-input-sm {
          padding: 6px 8px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 6px;
          color: #fff;
          font-size: 0.8rem;
          font-family: inherit;
        }
        .btn-enviar-sm {
          padding: 6px 12px;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border: none;
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-enviar-sm:disabled {
          opacity: 0.5;
        }
        .btn-ver-sm {
          padding: 6px 12px;
          background: rgba(212,175,55,0.15);
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Botón Nuevo */
        .btn-nuevo {
          padding: 0.6rem 1.25rem;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border: none;
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-nuevo:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(212,175,55,0.3);
        }

        /* Descripción de sección */
        .seccion-titulo {
          font-family: 'MedievalSharp', cursive;
          color: #d4af37;
          font-size: 1rem;
          margin: 0 0 0.4rem;
        }
        .seccion-desc {
          color: #777;
          font-size: 0.8rem;
          margin: 0 0 0.75rem;
          font-weight: 400;
          line-height: 1.5;
        }
        .tabs-desc {
          color: #555;
          font-size: 0.75rem;
          margin: 0;
          padding: 0.75rem 2rem 0;
          line-height: 1.5;
        }
        .btn-nuevo-hint {
          display: block;
          text-align: center;
          font-size: 0.65rem;
          color: #666;
          margin-top: 0.25rem;
        }

        /* Estado borrador */
        .estado.borrador {
          background: rgba(150,100,255,0.15);
          color: #b89aff;
        }

      `}</style>
    </div>
  );
}
