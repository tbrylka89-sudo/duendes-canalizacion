'use client';
import { useState, useEffect } from 'react';

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

// ═══════════════════════════════════════════════════════════════
// CLIENTES PAGE
// ═══════════════════════════════════════════════════════════════

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cargandoCliente, setCargandoCliente] = useState(false);

  // Modal de moneda
  const [modalMoneda, setModalMoneda] = useState(null); // 'runas' o 'treboles'
  const [cantidadMoneda, setCantidadMoneda] = useState('');
  const [motivoMoneda, setMotivoMoneda] = useState('');
  const [accionMoneda, setAccionMoneda] = useState('agregar'); // 'agregar' o 'quitar'
  const [guardandoMoneda, setGuardandoMoneda] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const buscar = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    try {
      const res = await fetch(`/api/admin/clientes?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      setResultados(data.clientes || []);
    } catch (e) {
      mostrarToast('Error al buscar', 'error');
    }
    setBuscando(false);
  };

  const seleccionarCliente = async (email) => {
    setCargandoCliente(true);
    try {
      const res = await fetch(`/api/admin/clientes/${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setClienteSeleccionado(data.cliente);
      } else {
        mostrarToast('Error al cargar cliente', 'error');
      }
    } catch (e) {
      mostrarToast('Error de conexion', 'error');
    }
    setCargandoCliente(false);
  };

  const guardarMoneda = async () => {
    if (!cantidadMoneda || !clienteSeleccionado) return;
    setGuardandoMoneda(true);

    try {
      const cantidad = parseInt(cantidadMoneda);
      const cambio = accionMoneda === 'agregar' ? cantidad : -cantidad;

      const res = await fetch(`/api/admin/clientes/${encodeURIComponent(clienteSeleccionado.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campo: modalMoneda,
          valor: (clienteSeleccionado[modalMoneda] || 0) + cambio,
          motivo: motivoMoneda
        })
      });

      const data = await res.json();
      if (data.success) {
        setClienteSeleccionado(prev => ({
          ...prev,
          [modalMoneda]: (prev[modalMoneda] || 0) + cambio
        }));
        mostrarToast(`${modalMoneda === 'runas' ? 'Runas' : 'Treboles'} actualizados`);
        setModalMoneda(null);
        setCantidadMoneda('');
        setMotivoMoneda('');
      } else {
        mostrarToast('Error al actualizar', 'error');
      }
    } catch (e) {
      mostrarToast('Error de conexion', 'error');
    }
    setGuardandoMoneda(false);
  };

  const copiarLink = () => {
    if (clienteSeleccionado?.token) {
      navigator.clipboard.writeText(`https://duendesdeluruguay.com/mi-magia?token=${clienteSeleccionado.token}`);
      mostrarToast('Link copiado');
    }
  };

  return (
    <div style={estilos.container}>
      {/* Toast */}
      {toast && (
        <div style={{
          ...estilos.toast,
          background: toast.tipo === 'error' ? '#ef4444' : '#22c55e'
        }}>
          {toast.mensaje}
        </div>
      )}

      {/* Header */}
      <div style={estilos.header}>
        <h1 style={estilos.titulo}>👥 Clientes</h1>
        <p style={estilos.subtitulo}>Busca, edita y gestiona usuarios</p>
      </div>

      {/* Buscador */}
      <div style={estilos.buscador}>
        <input
          type="text"
          placeholder="Buscar por email o nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && buscar()}
          style={estilos.input}
        />
        <button onClick={buscar} style={estilos.buscarBtn} disabled={buscando}>
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Layout de dos columnas */}
      <div style={estilos.layout}>
        {/* Lista de resultados */}
        <div style={estilos.listaPanel}>
          <h3 style={estilos.panelTitulo}>Resultados ({resultados.length})</h3>
          <div style={estilos.lista}>
            {resultados.length === 0 ? (
              <p style={estilos.vacio}>Busca un cliente para comenzar</p>
            ) : (
              resultados.map((cliente, i) => {
                const rango = getRango(cliente.gastado || 0);
                const activo = clienteSeleccionado?.email === cliente.email;
                return (
                  <div
                    key={i}
                    onClick={() => seleccionarCliente(cliente.email)}
                    style={{
                      ...estilos.clienteItem,
                      ...(activo ? estilos.clienteItemActivo : {})
                    }}
                  >
                    <div style={estilos.clienteInfo}>
                      <span style={estilos.clienteRango}>{rango.icono}</span>
                      <div>
                        <div style={estilos.clienteNombre}>
                          {cliente.nombre || cliente.nombrePreferido || 'Sin nombre'}
                        </div>
                        <div style={estilos.clienteEmail}>{cliente.email}</div>
                      </div>
                    </div>
                    <div style={estilos.clienteStats}>
                      <span style={estilos.clienteMoneda}>ᚱ {cliente.runas || 0}</span>
                      <span style={estilos.clienteMoneda}>☘ {cliente.treboles || 0}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detalle del cliente */}
        <div style={estilos.detallePanel}>
          {cargandoCliente ? (
            <div style={estilos.cargando}>
              <div style={estilos.spinner}></div>
            </div>
          ) : clienteSeleccionado ? (
            <ClienteDetalle
              cliente={clienteSeleccionado}
              onAbrirMoneda={setModalMoneda}
              onCopiarLink={copiarLink}
            />
          ) : (
            <div style={estilos.vacio}>
              <p>Selecciona un cliente para ver detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de moneda */}
      {modalMoneda && (
        <div style={estilos.modalOverlay} onClick={() => setModalMoneda(null)}>
          <div style={estilos.modal} onClick={e => e.stopPropagation()}>
            <h3 style={estilos.modalTitulo}>
              {modalMoneda === 'runas' ? 'ᚱ Gestionar Runas' : '☘ Gestionar Treboles'}
            </h3>

            <div style={estilos.modalGrupo}>
              <label style={estilos.label}>Accion</label>
              <div style={estilos.toggleGroup}>
                <button
                  onClick={() => setAccionMoneda('agregar')}
                  style={{
                    ...estilos.toggleBtn,
                    ...(accionMoneda === 'agregar' ? estilos.toggleBtnActivo : {})
                  }}
                >
                  + Agregar
                </button>
                <button
                  onClick={() => setAccionMoneda('quitar')}
                  style={{
                    ...estilos.toggleBtn,
                    ...(accionMoneda === 'quitar' ? estilos.toggleBtnActivoRojo : {})
                  }}
                >
                  - Quitar
                </button>
              </div>
            </div>

            <div style={estilos.modalGrupo}>
              <label style={estilos.label}>Cantidad</label>
              <div style={estilos.cantidadGrid}>
                {[5, 10, 20, 50, 100].map(n => (
                  <button
                    key={n}
                    onClick={() => setCantidadMoneda(n.toString())}
                    style={{
                      ...estilos.cantidadBtn,
                      ...(cantidadMoneda === n.toString() ? estilos.cantidadBtnActivo : {})
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="O escribe cantidad..."
                value={cantidadMoneda}
                onChange={e => setCantidadMoneda(e.target.value)}
                style={estilos.inputModal}
              />
            </div>

            <div style={estilos.modalGrupo}>
              <label style={estilos.label}>Motivo (opcional)</label>
              <input
                type="text"
                placeholder="Ej: Regalo por cumple..."
                value={motivoMoneda}
                onChange={e => setMotivoMoneda(e.target.value)}
                style={estilos.inputModal}
              />
            </div>

            <div style={estilos.modalAcciones}>
              <button onClick={() => setModalMoneda(null)} style={estilos.cancelarBtn}>
                Cancelar
              </button>
              <button
                onClick={guardarMoneda}
                disabled={!cantidadMoneda || guardandoMoneda}
                style={estilos.guardarBtn}
              >
                {guardandoMoneda ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE DETALLE CLIENTE
// ═══════════════════════════════════════════════════════════════

function ClienteDetalle({ cliente, onAbrirMoneda, onCopiarLink }) {
  const rango = getRango(cliente.gastado || 0);
  const [tab, setTab] = useState('info');
  const [actividad, setActividad] = useState(null);
  const [cargandoActividad, setCargandoActividad] = useState(false);

  const cargarActividad = async () => {
    if (actividad) return; // Ya cargada
    setCargandoActividad(true);
    try {
      const res = await fetch(`/api/admin/clientes/${encodeURIComponent(cliente.email)}/actividad`);
      const data = await res.json();
      if (data.success) {
        setActividad(data.actividad);
      }
    } catch (e) {
      console.error('Error cargando actividad:', e);
    }
    setCargandoActividad(false);
  };

  const abrirMiMagia = () => {
    if (cliente.token) {
      window.open(`/mi-magia?token=${cliente.token}`, '_blank');
    }
  };

  return (
    <div style={estilos.detalle}>
      {/* Cabecera */}
      <div style={estilos.detalleCabecera}>
        <div style={estilos.detalleAvatar}>
          <span style={{ fontSize: '32px' }}>{rango.icono}</span>
        </div>
        <div>
          <h2 style={estilos.detalleNombre}>
            {cliente.nombre || cliente.nombrePreferido || 'Sin nombre'}
          </h2>
          <p style={estilos.detalleEmail}>{cliente.email}</p>
          <div style={{ ...estilos.rangoTag, background: rango.color + '30', color: rango.color }}>
            {rango.nombre}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={estilos.tabs}>
        <button
          onClick={() => setTab('info')}
          style={{ ...estilos.tabBtn, ...(tab === 'info' ? estilos.tabBtnActivo : {}) }}
        >
          Informacion
        </button>
        <button
          onClick={() => { setTab('actividad'); cargarActividad(); }}
          style={{ ...estilos.tabBtn, ...(tab === 'actividad' ? estilos.tabBtnActivo : {}) }}
        >
          Mi Magia
        </button>
      </div>

      {/* Tab: Informacion */}
      {tab === 'info' && (
        <>
          {/* Monedas */}
          <div style={estilos.monedasGrid}>
            <div style={estilos.monedaCard} onClick={() => onAbrirMoneda('runas')}>
              <span style={estilos.monedaIcono}>ᚱ</span>
              <span style={estilos.monedaValor}>{cliente.runas || 0}</span>
              <span style={estilos.monedaLabel}>Runas</span>
              <button style={estilos.monedaBtn}>Gestionar</button>
            </div>
            <div style={estilos.monedaCard} onClick={() => onAbrirMoneda('treboles')}>
              <span style={estilos.monedaIcono}>☘</span>
              <span style={estilos.monedaValor}>{cliente.treboles || 0}</span>
              <span style={estilos.monedaLabel}>Treboles</span>
              <button style={estilos.monedaBtn}>Gestionar</button>
            </div>
          </div>

          {/* Info basica */}
          <div style={estilos.infoGrid}>
            <div style={estilos.infoItem}>
              <span style={estilos.infoLabel}>Total gastado</span>
              <span style={estilos.infoValor}>${cliente.gastado || cliente.totalCompras || 0}</span>
            </div>
            <div style={estilos.infoItem}>
              <span style={estilos.infoLabel}>Miembro Circulo</span>
              <span style={{
                ...estilos.infoValor,
                color: cliente.esCirculo ? '#22c55e' : '#666'
              }}>
                {cliente.esCirculo ? 'Si' : 'No'}
              </span>
            </div>
            {cliente.esCirculo && cliente.circuloExpira && (
              <div style={estilos.infoItem}>
                <span style={estilos.infoLabel}>Expira</span>
                <span style={estilos.infoValor}>
                  {new Date(cliente.circuloExpira).toLocaleDateString('es-UY')}
                </span>
              </div>
            )}
            <div style={estilos.infoItem}>
              <span style={estilos.infoLabel}>Guardianes</span>
              <span style={estilos.infoValor}>{cliente.guardianes?.length || 0}</span>
            </div>
          </div>

          {/* Acciones */}
          <div style={estilos.acciones}>
            {cliente.token && (
              <>
                <button onClick={onCopiarLink} style={estilos.accionBtn}>
                  📋 Copiar link magico
                </button>
                <button onClick={abrirMiMagia} style={estilos.accionBtn}>
                  ✨ Ver Mi Magia
                </button>
              </>
            )}
          </div>

          {/* Guardianes */}
          {cliente.guardianes?.length > 0 && (
            <div style={estilos.seccion}>
              <h4 style={estilos.seccionTitulo}>Guardianes ({cliente.guardianes.length})</h4>
              <div style={estilos.guardianesLista}>
                {cliente.guardianes.map((g, i) => (
                  <div key={i} style={estilos.guardianItem}>
                    <span>🧙</span>
                    <span>{g.nombre || g}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab: Mi Magia / Actividad */}
      {tab === 'actividad' && (
        <div style={estilos.actividadContainer}>
          {cargandoActividad ? (
            <div style={estilos.cargandoActividad}>
              <div style={estilos.spinner}></div>
              <p>Cargando actividad...</p>
            </div>
          ) : actividad ? (
            <>
              {/* Resumen rapido */}
              <div style={estilos.actResumenGrid}>
                <div style={estilos.actResumenItem}>
                  <span style={estilos.actResumenValor}>{actividad.grimorio.totalEntradas}</span>
                  <span style={estilos.actResumenLabel}>Entradas grimorio</span>
                </div>
                <div style={estilos.actResumenItem}>
                  <span style={estilos.actResumenValor}>{actividad.canjes.totalCanjes}</span>
                  <span style={estilos.actResumenLabel}>Canjes realizados</span>
                </div>
                <div style={estilos.actResumenItem}>
                  <span style={estilos.actResumenValor}>{actividad.regalos.totalRegalos}</span>
                  <span style={estilos.actResumenLabel}>Regalos recibidos</span>
                </div>
                <div style={estilos.actResumenItem}>
                  <span style={estilos.actResumenValor}>{actividad.estadisticas.diasComoMiembro}</span>
                  <span style={estilos.actResumenLabel}>Dias con nosotros</span>
                </div>
              </div>

              {/* Estado Circulo */}
              {actividad.circulo && (
                <div style={estilos.actSeccion}>
                  <h4 style={estilos.actSeccionTitulo}>★ Estado del Circulo</h4>
                  <div style={estilos.circuloEstado}>
                    <div style={{
                      ...estilos.circuloBadge,
                      background: actividad.circulo.activo ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: actividad.circulo.activo ? '#22c55e' : '#ef4444'
                    }}>
                      {actividad.circulo.activo ? 'Activo' : 'Inactivo'}
                      {actividad.circulo.esPrueba && ' (Prueba)'}
                    </div>
                    <span style={estilos.circuloPlan}>{actividad.circulo.plan}</span>
                    {actividad.circulo.expira && (
                      <span style={estilos.circuloExpira}>
                        Expira: {new Date(actividad.circulo.expira).toLocaleDateString('es-UY')}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Ultimas entradas del grimorio */}
              {actividad.grimorio.ultimasEntradas.length > 0 && (
                <div style={estilos.actSeccion}>
                  <h4 style={estilos.actSeccionTitulo}>📖 Ultimas entradas del Grimorio</h4>
                  <div style={estilos.grimorioLista}>
                    {actividad.grimorio.ultimasEntradas.map((entrada, i) => (
                      <div key={i} style={estilos.grimorioItem}>
                        <div style={estilos.grimorioHeader}>
                          <span style={estilos.grimorioTipo}>{entrada.tipo}</span>
                          <span style={estilos.grimorioFecha}>
                            {new Date(entrada.fecha).toLocaleDateString('es-UY')}
                          </span>
                        </div>
                        <p style={estilos.grimorioContenido}>{entrada.contenido}</p>
                        {entrada.lunaFase && (
                          <span style={estilos.grimorioLuna}>Luna: {entrada.lunaFase}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historial de canjes */}
              {actividad.canjes.historial.length > 0 && (
                <div style={estilos.actSeccion}>
                  <h4 style={estilos.actSeccionTitulo}>☘ Historial de Canjes</h4>
                  <div style={estilos.canjesLista}>
                    {actividad.canjes.historial.map((canje, i) => (
                      <div key={i} style={estilos.canjeItem}>
                        <span style={estilos.canjeTipo}>{canje.tipo}</span>
                        <span style={estilos.canjeCosto}>{canje.costo} treboles</span>
                        <span style={estilos.canjeFecha}>
                          {new Date(canje.fecha).toLocaleDateString('es-UY')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regalos recibidos */}
              {actividad.regalos.historial.length > 0 && (
                <div style={estilos.actSeccion}>
                  <h4 style={estilos.actSeccionTitulo}>🎁 Regalos Recibidos</h4>
                  <div style={estilos.regalosLista}>
                    {actividad.regalos.historial.map((regalo, i) => (
                      <div key={i} style={estilos.regaloItem}>
                        <div style={estilos.regaloInfo}>
                          <span style={estilos.regaloDesc}>{regalo.descripcion}</span>
                          {regalo.mensaje && (
                            <span style={estilos.regaloMensaje}>"{regalo.mensaje}"</span>
                          )}
                        </div>
                        <span style={estilos.regaloFecha}>
                          {new Date(regalo.fecha).toLocaleDateString('es-UY')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lecturas y cupones pendientes */}
              {(actividad.lecturasGratis.length > 0 || actividad.cupones.length > 0) && (
                <div style={estilos.actSeccion}>
                  <h4 style={estilos.actSeccionTitulo}>🎟️ Beneficios Pendientes</h4>
                  <div style={estilos.beneficiosGrid}>
                    {actividad.lecturasGratis.map((l, i) => (
                      <div key={`l${i}`} style={estilos.beneficioItem}>
                        <span style={estilos.beneficioIcono}>📜</span>
                        <span>Lectura: {l.tipo}</span>
                      </div>
                    ))}
                    {actividad.cupones.map((c, i) => (
                      <div key={`c${i}`} style={estilos.beneficioItem}>
                        <span style={estilos.beneficioIcono}>🎟️</span>
                        <span>Cupon {c.descuento}: {c.codigo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p style={estilos.sinActividad}>No se pudo cargar la actividad</p>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },

  // Toast
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 1000,
    animation: 'fadeIn 0.3s'
  },

  // Header
  header: {
    marginBottom: '24px'
  },
  titulo: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  subtitulo: {
    color: '#666',
    fontSize: '14px'
  },

  // Buscador
  buscador: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  input: {
    flex: 1,
    padding: '14px 16px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  },
  buscarBtn: {
    padding: '14px 28px',
    background: '#C6A962',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Layout
  layout: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '24px'
  },

  // Panel lista
  listaPanel: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  panelTitulo: {
    padding: '16px 20px',
    borderBottom: '1px solid #2a2a2a',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600'
  },
  lista: {
    maxHeight: 'calc(100vh - 300px)',
    overflowY: 'auto'
  },
  clienteItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #1f1f1f',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  clienteItemActivo: {
    background: 'rgba(198, 169, 98, 0.1)'
  },
  clienteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  clienteRango: {
    fontSize: '20px'
  },
  clienteNombre: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500'
  },
  clienteEmail: {
    color: '#666',
    fontSize: '12px'
  },
  clienteStats: {
    display: 'flex',
    gap: '12px'
  },
  clienteMoneda: {
    color: '#888',
    fontSize: '13px'
  },

  // Panel detalle
  detallePanel: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    minHeight: '400px'
  },
  cargando: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '400px'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #222',
    borderTopColor: '#C6A962',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  vacio: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '400px',
    color: '#555',
    fontSize: '14px'
  },

  // Detalle
  detalle: {
    padding: '24px'
  },
  detalleCabecera: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px'
  },
  detalleAvatar: {
    width: '64px',
    height: '64px',
    background: '#0a0a0a',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detalleNombre: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  detalleEmail: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '8px'
  },
  rangoTag: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },

  // Monedas
  monedasGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  },
  monedaCard: {
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  },
  monedaIcono: {
    display: 'block',
    fontSize: '28px',
    marginBottom: '8px'
  },
  monedaValor: {
    display: 'block',
    color: '#fff',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  monedaLabel: {
    display: 'block',
    color: '#666',
    fontSize: '13px',
    marginBottom: '12px'
  },
  monedaBtn: {
    padding: '8px 16px',
    background: 'rgba(198, 169, 98, 0.15)',
    border: '1px solid rgba(198, 169, 98, 0.3)',
    borderRadius: '6px',
    color: '#C6A962',
    fontSize: '12px',
    cursor: 'pointer'
  },

  // Info grid
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  infoItem: {
    background: '#0a0a0a',
    padding: '16px',
    borderRadius: '8px'
  },
  infoLabel: {
    display: 'block',
    color: '#666',
    fontSize: '12px',
    marginBottom: '4px'
  },
  infoValor: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600'
  },

  // Acciones
  acciones: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  accionBtn: {
    padding: '12px 20px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#ccc',
    fontSize: '14px',
    cursor: 'pointer'
  },

  // Seccion
  seccion: {
    marginTop: '24px'
  },
  seccionTitulo: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  guardianesLista: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  guardianItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    background: '#0a0a0a',
    borderRadius: '6px',
    color: '#ccc',
    fontSize: '13px'
  },

  // Tabs
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '1px solid #2a2a2a',
    paddingBottom: '12px'
  },
  tabBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabBtnActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    color: '#C6A962'
  },

  // Actividad container
  actividadContainer: {
    paddingTop: '8px'
  },
  cargandoActividad: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    color: '#666'
  },
  sinActividad: {
    textAlign: 'center',
    color: '#555',
    padding: '40px'
  },

  // Resumen actividad
  actResumenGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '24px'
  },
  actResumenItem: {
    background: '#0a0a0a',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center'
  },
  actResumenValor: {
    display: 'block',
    color: '#C6A962',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  actResumenLabel: {
    color: '#666',
    fontSize: '11px'
  },

  // Secciones de actividad
  actSeccion: {
    marginBottom: '20px'
  },
  actSeccionTitulo: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px'
  },

  // Circulo estado
  circuloEstado: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#0a0a0a',
    borderRadius: '10px'
  },
  circuloBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  circuloPlan: {
    color: '#ccc',
    fontSize: '14px'
  },
  circuloExpira: {
    color: '#888',
    fontSize: '13px',
    marginLeft: 'auto'
  },

  // Grimorio
  grimorioLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  grimorioItem: {
    background: '#0a0a0a',
    borderRadius: '10px',
    padding: '14px'
  },
  grimorioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  grimorioTipo: {
    color: '#C6A962',
    fontSize: '12px',
    textTransform: 'capitalize'
  },
  grimorioFecha: {
    color: '#666',
    fontSize: '12px'
  },
  grimorioContenido: {
    color: '#ccc',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0
  },
  grimorioLuna: {
    display: 'inline-block',
    marginTop: '8px',
    color: '#888',
    fontSize: '11px',
    background: '#141414',
    padding: '4px 8px',
    borderRadius: '4px'
  },

  // Canjes
  canjesLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  canjeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    background: '#0a0a0a',
    borderRadius: '8px'
  },
  canjeTipo: {
    color: '#ccc',
    fontSize: '14px',
    flex: 1
  },
  canjeCosto: {
    color: '#22c55e',
    fontSize: '13px'
  },
  canjeFecha: {
    color: '#666',
    fontSize: '12px'
  },

  // Regalos
  regalosLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  regaloItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 14px',
    background: '#0a0a0a',
    borderRadius: '8px'
  },
  regaloInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  regaloDesc: {
    color: '#ccc',
    fontSize: '14px'
  },
  regaloMensaje: {
    color: '#888',
    fontSize: '12px',
    fontStyle: 'italic'
  },
  regaloFecha: {
    color: '#666',
    fontSize: '12px'
  },

  // Beneficios
  beneficiosGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  beneficioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    background: '#0a0a0a',
    borderRadius: '8px',
    color: '#ccc',
    fontSize: '13px'
  },
  beneficioIcono: {
    fontSize: '16px'
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px'
  },
  modalTitulo: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px'
  },
  modalGrupo: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: '#888',
    fontSize: '13px',
    marginBottom: '8px'
  },
  toggleGroup: {
    display: 'flex',
    gap: '8px'
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer'
  },
  toggleBtnActivo: {
    background: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    color: '#22c55e'
  },
  toggleBtnActivoRojo: {
    background: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    color: '#ef4444'
  },
  cantidadGrid: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px'
  },
  cantidadBtn: {
    flex: 1,
    padding: '10px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer'
  },
  cantidadBtnActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    borderColor: 'rgba(198, 169, 98, 0.3)',
    color: '#C6A962'
  },
  inputModal: {
    width: '100%',
    padding: '12px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },
  modalAcciones: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  cancelarBtn: {
    flex: 1,
    padding: '12px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer'
  },
  guardarBtn: {
    flex: 1,
    padding: '12px',
    background: '#C6A962',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
