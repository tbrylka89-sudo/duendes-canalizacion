'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// CIRCULO PAGE
// ═══════════════════════════════════════════════════════════════

export default function CirculoPage() {
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // todos, activos, por-vencer, vencidos
  const [busqueda, setBusqueda] = useState('');
  const [toast, setToast] = useState(null);

  // Modal extender
  const [modalExtender, setModalExtender] = useState(null);
  const [diasExtender, setDiasExtender] = useState(30);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarMiembros();
  }, []);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const cargarMiembros = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/circulo');
      const data = await res.json();
      if (data.success) {
        setMiembros(data.miembros || []);
      }
    } catch (e) {
      mostrarToast('Error al cargar miembros', 'error');
    }
    setCargando(false);
  };

  const toggleMiembro = async (email, activar) => {
    try {
      const res = await fetch(`/api/admin/circulo/${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: activar ? 'activar' : 'desactivar' })
      });
      const data = await res.json();
      if (data.success) {
        setMiembros(prev => prev.map(m =>
          m.email === email ? { ...m, activo: activar } : m
        ));
        mostrarToast(activar ? 'Membresia activada' : 'Membresia desactivada');
      }
    } catch (e) {
      mostrarToast('Error al actualizar', 'error');
    }
  };

  const extenderMembresia = async () => {
    if (!modalExtender) return;
    setGuardando(true);

    try {
      const res = await fetch(`/api/admin/circulo/${encodeURIComponent(modalExtender.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'extender', dias: diasExtender })
      });
      const data = await res.json();
      if (data.success) {
        setMiembros(prev => prev.map(m =>
          m.email === modalExtender.email
            ? { ...m, expira: data.nuevaExpiracion, activo: true }
            : m
        ));
        mostrarToast(`Membresia extendida ${diasExtender} dias`);
        setModalExtender(null);
      }
    } catch (e) {
      mostrarToast('Error al extender', 'error');
    }
    setGuardando(false);
  };

  // Filtrar miembros
  const ahora = new Date();
  const en7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

  const miembrosFiltrados = miembros.filter(m => {
    // Filtro de busqueda
    if (busqueda) {
      const q = busqueda.toLowerCase();
      if (!m.email?.toLowerCase().includes(q) && !m.nombre?.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Filtro de estado
    const expira = m.expira ? new Date(m.expira) : null;

    if (filtro === 'activos') return m.activo && expira && expira > ahora;
    if (filtro === 'por-vencer') return m.activo && expira && expira <= en7Dias && expira > ahora;
    if (filtro === 'vencidos') return !m.activo || (expira && expira <= ahora);
    return true;
  });

  // Estadisticas
  const totalActivos = miembros.filter(m => m.activo).length;
  const porVencer = miembros.filter(m => {
    const expira = m.expira ? new Date(m.expira) : null;
    return m.activo && expira && expira <= en7Dias && expira > ahora;
  }).length;
  const vencidos = miembros.filter(m => {
    const expira = m.expira ? new Date(m.expira) : null;
    return expira && expira <= ahora;
  }).length;

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
        <div>
          <h1 style={estilos.titulo}>★ Circulo</h1>
          <p style={estilos.subtitulo}>Gestiona las membresias premium</p>
        </div>
        <button onClick={cargarMiembros} style={estilos.refreshBtn}>
          &#8635; Actualizar
        </button>
      </div>

      {/* Stats */}
      <div style={estilos.statsGrid}>
        <div style={estilos.statCard} onClick={() => setFiltro('activos')}>
          <span style={estilos.statValor}>{totalActivos}</span>
          <span style={estilos.statLabel}>Activos</span>
        </div>
        <div style={{ ...estilos.statCard, ...estilos.statCardWarning }} onClick={() => setFiltro('por-vencer')}>
          <span style={estilos.statValor}>{porVencer}</span>
          <span style={estilos.statLabel}>Por vencer (7d)</span>
        </div>
        <div style={{ ...estilos.statCard, ...estilos.statCardError }} onClick={() => setFiltro('vencidos')}>
          <span style={estilos.statValor}>{vencidos}</span>
          <span style={estilos.statLabel}>Vencidos</span>
        </div>
        <div style={estilos.statCard} onClick={() => setFiltro('todos')}>
          <span style={estilos.statValor}>{miembros.length}</span>
          <span style={estilos.statLabel}>Total</span>
        </div>
      </div>

      {/* Filtros */}
      <div style={estilos.filtros}>
        <div style={estilos.filtrosBtns}>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'activos', label: 'Activos' },
            { id: 'por-vencer', label: 'Por vencer' },
            { id: 'vencidos', label: 'Vencidos' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              style={{
                ...estilos.filtroBtn,
                ...(filtro === f.id ? estilos.filtroBtnActivo : {})
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar por email o nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={estilos.busquedaInput}
        />
      </div>

      {/* Lista de miembros */}
      <div style={estilos.lista}>
        {cargando ? (
          <div style={estilos.cargando}>
            <div style={estilos.spinner}></div>
          </div>
        ) : miembrosFiltrados.length === 0 ? (
          <div style={estilos.vacio}>No hay miembros en esta categoria</div>
        ) : (
          miembrosFiltrados.map((miembro, i) => {
            const expira = miembro.expira ? new Date(miembro.expira) : null;
            const diasRestantes = expira ? Math.ceil((expira - ahora) / (24 * 60 * 60 * 1000)) : null;
            const vencido = expira && expira <= ahora;
            const porVencerProx = diasRestantes !== null && diasRestantes <= 7 && diasRestantes > 0;

            return (
              <div key={i} style={estilos.miembroCard}>
                <div style={estilos.miembroInfo}>
                  <div style={estilos.miembroNombre}>
                    {miembro.nombre || miembro.nombrePreferido || 'Sin nombre'}
                  </div>
                  <div style={estilos.miembroEmail}>{miembro.email}</div>
                  <div style={estilos.miembroPlan}>
                    {miembro.plan || 'Sin plan'}
                    {miembro.esPrueba && <span style={estilos.tagPrueba}>Prueba</span>}
                  </div>
                </div>

                <div style={estilos.miembroExpira}>
                  {expira ? (
                    <>
                      <div style={{
                        ...estilos.expiraFecha,
                        color: vencido ? '#ef4444' : porVencerProx ? '#f59e0b' : '#22c55e'
                      }}>
                        {vencido ? 'Vencido' : `${diasRestantes} dias`}
                      </div>
                      <div style={estilos.expiraDetalle}>
                        {expira.toLocaleDateString('es-UY')}
                      </div>
                    </>
                  ) : (
                    <div style={estilos.expiraFecha}>Sin fecha</div>
                  )}
                </div>

                <div style={estilos.miembroAcciones}>
                  <button
                    onClick={() => setModalExtender(miembro)}
                    style={estilos.accionBtn}
                  >
                    + Extender
                  </button>
                  <button
                    onClick={() => toggleMiembro(miembro.email, !miembro.activo)}
                    style={{
                      ...estilos.toggleBtn,
                      ...(miembro.activo ? estilos.toggleBtnActivo : estilos.toggleBtnInactivo)
                    }}
                  >
                    {miembro.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal extender */}
      {modalExtender && (
        <div style={estilos.modalOverlay} onClick={() => setModalExtender(null)}>
          <div style={estilos.modal} onClick={e => e.stopPropagation()}>
            <h3 style={estilos.modalTitulo}>Extender membresia</h3>
            <p style={estilos.modalSubtitulo}>{modalExtender.nombre || modalExtender.email}</p>

            <div style={estilos.diasGrid}>
              {[7, 15, 30, 60, 90].map(d => (
                <button
                  key={d}
                  onClick={() => setDiasExtender(d)}
                  style={{
                    ...estilos.diaBtn,
                    ...(diasExtender === d ? estilos.diaBtnActivo : {})
                  }}
                >
                  {d} dias
                </button>
              ))}
            </div>

            <div style={estilos.modalAcciones}>
              <button onClick={() => setModalExtender(null)} style={estilos.cancelarBtn}>
                Cancelar
              </button>
              <button
                onClick={extenderMembresia}
                disabled={guardando}
                style={estilos.guardarBtn}
              >
                {guardando ? 'Guardando...' : 'Extender'}
              </button>
            </div>
          </div>
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
    maxWidth: '1000px',
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
    zIndex: 1000
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  refreshBtn: {
    padding: '10px 16px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer'
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  statCardWarning: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
    background: 'rgba(245, 158, 11, 0.05)'
  },
  statCardError: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    background: 'rgba(239, 68, 68, 0.05)'
  },
  statValor: {
    display: 'block',
    color: '#fff',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  statLabel: {
    color: '#666',
    fontSize: '13px'
  },

  // Filtros
  filtros: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '16px'
  },
  filtrosBtns: {
    display: 'flex',
    gap: '8px'
  },
  filtroBtn: {
    padding: '10px 16px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filtroBtnActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    borderColor: 'rgba(198, 169, 98, 0.4)',
    color: '#C6A962'
  },
  busquedaInput: {
    padding: '10px 16px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    width: '250px',
    outline: 'none'
  },

  // Lista
  lista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  cargando: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px'
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
    textAlign: 'center',
    padding: '60px',
    color: '#555',
    fontSize: '14px'
  },

  // Miembro card
  miembroCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px'
  },
  miembroInfo: {
    flex: 1
  },
  miembroNombre: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '4px'
  },
  miembroEmail: {
    color: '#666',
    fontSize: '13px',
    marginBottom: '6px'
  },
  miembroPlan: {
    color: '#888',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  tagPrueba: {
    padding: '2px 8px',
    background: 'rgba(59, 130, 246, 0.15)',
    borderRadius: '10px',
    color: '#3b82f6',
    fontSize: '11px'
  },
  miembroExpira: {
    textAlign: 'center',
    minWidth: '100px'
  },
  expiraFecha: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '2px'
  },
  expiraDetalle: {
    color: '#666',
    fontSize: '12px'
  },
  miembroAcciones: {
    display: 'flex',
    gap: '10px',
    marginLeft: '20px'
  },
  accionBtn: {
    padding: '10px 16px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#ccc',
    fontSize: '13px',
    cursor: 'pointer'
  },
  toggleBtn: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    minWidth: '80px'
  },
  toggleBtnActivo: {
    background: 'rgba(34, 197, 94, 0.15)',
    color: '#22c55e'
  },
  toggleBtnInactivo: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444'
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
    marginBottom: '4px'
  },
  modalSubtitulo: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '24px'
  },
  diasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
    marginBottom: '24px'
  },
  diaBtn: {
    padding: '12px 8px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  diaBtnActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    borderColor: 'rgba(198, 169, 98, 0.4)',
    color: '#C6A962'
  },
  modalAcciones: {
    display: 'flex',
    gap: '12px'
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
