'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: GESTOR DE DUENDES REALES
// Agregar, editar y seleccionar duendes para el contenido del Círculo
// ═══════════════════════════════════════════════════════════════════════════════

export default function GestorDuendes() {
  const [duendes, setDuendes] = useState([]);
  const [duendeActual, setDuendeActual] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    nombreCompleto: '',
    descripcion: '',
    proposito: '',
    cristales: '',
    elemento: '',
    imagen: '',
    personalidad: ''
  });

  useEffect(() => {
    cargarDuendes();
  }, []);

  async function cargarDuendes() {
    try {
      const res = await fetch('/api/admin/circulo/duendes-reales');
      const data = await res.json();
      if (data.success) {
        setDuendes(data.duendes || []);
        setDuendeActual(data.duendeActual);
      }
    } catch (e) {
      console.error('Error cargando duendes:', e);
    }
    setCargando(false);
  }

  async function guardarDuende() {
    if (!form.nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre es requerido' });
      return;
    }

    setGuardando(true);
    try {
      const duendeData = {
        ...form,
        cristales: form.cristales.split(',').map(c => c.trim()).filter(c => c),
        id: editando || `duende_${Date.now()}`
      };

      const res = await fetch('/api/admin/circulo/duendes-reales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: editando ? 'editar' : 'crear',
          duende: duendeData
        })
      });

      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: editando ? 'Duende actualizado' : 'Duende agregado' });
        setMostrarForm(false);
        setEditando(null);
        setForm({ nombre: '', nombreCompleto: '', descripcion: '', proposito: '', cristales: '', elemento: '', imagen: '', personalidad: '' });
        cargarDuendes();
      } else {
        setMensaje({ tipo: 'error', texto: data.error || 'Error guardando' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    }
    setGuardando(false);
  }

  async function eliminarDuende(id) {
    if (!confirm('¿Eliminar este duende?')) return;

    try {
      const res = await fetch('/api/admin/circulo/duendes-reales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'eliminar', id })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: 'Duende eliminado' });
        cargarDuendes();
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    }
  }

  async function seleccionarComoActual(duende) {
    try {
      const res = await fetch('/api/admin/circulo/duendes-reales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'seleccionar-actual', id: duende.id })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: `${duende.nombre} es ahora el Duende de la Semana` });
        setDuendeActual(duende);
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    }
  }

  function editarDuende(duende) {
    setForm({
      nombre: duende.nombre || '',
      nombreCompleto: duende.nombreCompleto || '',
      descripcion: duende.descripcion || '',
      proposito: duende.proposito || '',
      cristales: (duende.cristales || []).join(', '),
      elemento: duende.elemento || '',
      imagen: duende.imagen || '',
      personalidad: duende.personalidad || ''
    });
    setEditando(duende.id);
    setMostrarForm(true);
  }

  async function sincronizarWoo() {
    setMensaje({ tipo: 'info', texto: 'Sincronizando con WooCommerce...' });
    try {
      const res = await fetch('/api/admin/circulo/duendes-reales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'sincronizar-woo' })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: `Sincronizados ${data.importados} duendes de WooCommerce` });
        cargarDuendes();
      } else {
        setMensaje({ tipo: 'error', texto: data.error || 'Error sincronizando' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    }
  }

  if (cargando) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Cargando duendes...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Duendes Reales</h1>
          <p style={styles.subtitle}>Gestiona los guardianes para el contenido del Círculo</p>
        </div>
        <div style={styles.headerBtns}>
          <button onClick={sincronizarWoo} style={styles.btnSync}>
            🔄 Sincronizar WooCommerce
          </button>
          <button onClick={() => { setMostrarForm(true); setEditando(null); setForm({ nombre: '', nombreCompleto: '', descripcion: '', proposito: '', cristales: '', elemento: '', imagen: '', personalidad: '' }); }} style={styles.btnAdd}>
            + Agregar Duende
          </button>
          <Link href="/admin/circulo" style={styles.btnBack}>← Hub</Link>
        </div>
      </header>

      {mensaje && (
        <div style={{
          ...styles.mensaje,
          background: mensaje.tipo === 'ok' ? '#27ae60' : mensaje.tipo === 'error' ? '#e74c3c' : '#3498db'
        }}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)} style={styles.cerrarMsg}>×</button>
        </div>
      )}

      {/* Duende de la Semana Actual */}
      {duendeActual && (
        <section style={styles.seccionActual}>
          <h2 style={styles.seccionTitulo}>★ Duende de la Semana Actual</h2>
          <div style={styles.duendeActualCard}>
            {duendeActual.imagen && (
              <img src={duendeActual.imagen} alt={duendeActual.nombre} style={styles.duendeActualImg} />
            )}
            <div style={styles.duendeActualInfo}>
              <h3>{duendeActual.nombre}</h3>
              <p>{duendeActual.proposito}</p>
              {duendeActual.cristales?.length > 0 && (
                <div style={styles.cristales}>
                  {duendeActual.cristales.map((c, i) => (
                    <span key={i} style={styles.cristal}>{c}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Formulario */}
      {mostrarForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>{editando ? 'Editar Duende' : 'Agregar Duende'}</h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label>Nombre corto *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Finnian"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label>Nombre completo</label>
                <input
                  type="text"
                  value={form.nombreCompleto}
                  onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
                  placeholder="Ej: Finnian el Guardián del Bosque"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroupFull}>
                <label>Descripción / Historia</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Historia y personalidad del duende..."
                  style={styles.textarea}
                  rows={4}
                />
              </div>

              <div style={styles.formGroup}>
                <label>Propósito</label>
                <input
                  type="text"
                  value={form.proposito}
                  onChange={(e) => setForm({ ...form, proposito: e.target.value })}
                  placeholder="Ej: Protección y claridad mental"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label>Elemento</label>
                <select
                  value={form.elemento}
                  onChange={(e) => setForm({ ...form, elemento: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Seleccionar...</option>
                  <option value="tierra">Tierra</option>
                  <option value="agua">Agua</option>
                  <option value="fuego">Fuego</option>
                  <option value="aire">Aire</option>
                </select>
              </div>

              <div style={styles.formGroupFull}>
                <label>Cristales (separados por coma)</label>
                <input
                  type="text"
                  value={form.cristales}
                  onChange={(e) => setForm({ ...form, cristales: e.target.value })}
                  placeholder="Ej: Amatista, Cuarzo Rosa, Obsidiana"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroupFull}>
                <label>URL de imagen</label>
                <input
                  type="text"
                  value={form.imagen}
                  onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                  placeholder="https://..."
                  style={styles.input}
                />
                {form.imagen && (
                  <img src={form.imagen} alt="Preview" style={styles.imgPreview} />
                )}
              </div>

              <div style={styles.formGroupFull}>
                <label>Personalidad (cómo habla, su estilo)</label>
                <textarea
                  value={form.personalidad}
                  onChange={(e) => setForm({ ...form, personalidad: e.target.value })}
                  placeholder="Describe cómo se expresa este duende, su tono, sus temas favoritos..."
                  style={styles.textarea}
                  rows={3}
                />
              </div>
            </div>

            <div style={styles.modalBtns}>
              <button onClick={() => { setMostrarForm(false); setEditando(null); }} style={styles.btnCancel}>
                Cancelar
              </button>
              <button onClick={guardarDuende} disabled={guardando} style={styles.btnSave}>
                {guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Agregar')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Duendes */}
      <section style={styles.seccion}>
        <h2 style={styles.seccionTitulo}>Duendes Disponibles ({duendes.length})</h2>

        {duendes.length === 0 ? (
          <div style={styles.empty}>
            <p>No hay duendes cargados todavía.</p>
            <p>Podés agregarlos manualmente o sincronizar desde WooCommerce.</p>
          </div>
        ) : (
          <div style={styles.duendesGrid}>
            {duendes.map((duende) => (
              <div key={duende.id} style={styles.duendeCard}>
                {duende.imagen && (
                  <img src={duende.imagen} alt={duende.nombre} style={styles.duendeImg} />
                )}
                <div style={styles.duendeInfo}>
                  <h3 style={styles.duendeNombre}>{duende.nombre}</h3>
                  {duende.proposito && <p style={styles.duendeProposito}>{duende.proposito}</p>}
                  {duende.cristales?.length > 0 && (
                    <div style={styles.cristalesSmall}>
                      {duende.cristales.slice(0, 3).map((c, i) => (
                        <span key={i} style={styles.cristalSmall}>{c}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={styles.duendeBtns}>
                  <button
                    onClick={() => seleccionarComoActual(duende)}
                    style={duendeActual?.id === duende.id ? styles.btnActivo : styles.btnSeleccionar}
                    disabled={duendeActual?.id === duende.id}
                  >
                    {duendeActual?.id === duende.id ? '★ Actual' : 'Seleccionar'}
                  </button>
                  <button onClick={() => editarDuende(duende)} style={styles.btnEditar}>
                    Editar
                  </button>
                  <button onClick={() => eliminarDuende(duende.id)} style={styles.btnEliminar}>
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Acciones */}
      <section style={styles.seccion}>
        <h2 style={styles.seccionTitulo}>Acciones</h2>
        <div style={styles.acciones}>
          <Link href="/admin/circulo/contenido" style={styles.btnAccion}>
            ✍️ Generar Contenido con Duende Actual
          </Link>
          <button
            onClick={() => window.location.href = '/api/admin/circulo/regenerar-contenido?duendeId=' + duendeActual?.id}
            style={styles.btnAccion}
            disabled={!duendeActual}
          >
            🔄 Regenerar Contenido del Mes
          </button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '2rem',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: '#fff'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: '#d4af37'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    color: '#d4af37',
    margin: 0
  },
  subtitle: {
    color: '#888',
    margin: '0.25rem 0 0'
  },
  headerBtns: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  btnSync: {
    background: 'transparent',
    border: '1px solid #3498db',
    color: '#3498db',
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  btnAdd: {
    background: '#d4af37',
    border: 'none',
    color: '#1a1a1a',
    padding: '0.6rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  btnBack: {
    color: '#888',
    textDecoration: 'none',
    padding: '0.6rem 1rem',
    border: '1px solid #444',
    borderRadius: '6px'
  },
  mensaje: {
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cerrarMsg: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  seccion: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  seccionActual: {
    background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.02) 100%)',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  seccionTitulo: {
    fontSize: '1.25rem',
    color: '#d4af37',
    marginTop: 0,
    marginBottom: '1rem'
  },
  duendeActualCard: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  duendeActualImg: {
    width: '120px',
    height: '120px',
    borderRadius: '12px',
    objectFit: 'cover'
  },
  duendeActualInfo: {
    flex: 1
  },
  cristales: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  cristal: {
    background: 'rgba(212,175,55,0.2)',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    color: '#d4af37'
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#888'
  },
  duendesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem'
  },
  duendeCard: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  duendeImg: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  duendeInfo: {
    padding: '1rem'
  },
  duendeNombre: {
    margin: '0 0 0.5rem',
    fontSize: '1.1rem'
  },
  duendeProposito: {
    color: '#d4af37',
    fontSize: '0.9rem',
    margin: '0 0 0.5rem'
  },
  cristalesSmall: {
    display: 'flex',
    gap: '0.25rem',
    flexWrap: 'wrap'
  },
  cristalSmall: {
    background: 'rgba(255,255,255,0.1)',
    padding: '2px 6px',
    borderRadius: '10px',
    fontSize: '0.7rem',
    color: '#aaa'
  },
  duendeBtns: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0 1rem 1rem'
  },
  btnSeleccionar: {
    flex: 1,
    background: 'transparent',
    border: '1px solid #d4af37',
    color: '#d4af37',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  btnActivo: {
    flex: 1,
    background: '#d4af37',
    border: 'none',
    color: '#1a1a1a',
    padding: '0.5rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  btnEditar: {
    background: 'transparent',
    border: '1px solid #888',
    color: '#888',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  btnEliminar: {
    background: 'transparent',
    border: '1px solid #e74c3c',
    color: '#e74c3c',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modalContent: {
    background: '#1a1a2e',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalTitle: {
    color: '#d4af37',
    marginTop: 0
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  formGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  input: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    padding: '0.6rem',
    color: '#fff',
    fontSize: '1rem'
  },
  textarea: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    padding: '0.6rem',
    color: '#fff',
    fontSize: '1rem',
    resize: 'vertical'
  },
  imgPreview: {
    marginTop: '0.5rem',
    maxWidth: '200px',
    borderRadius: '8px'
  },
  modalBtns: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'flex-end'
  },
  btnCancel: {
    background: 'transparent',
    border: '1px solid #888',
    color: '#888',
    padding: '0.6rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  btnSave: {
    background: '#d4af37',
    border: 'none',
    color: '#1a1a1a',
    padding: '0.6rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  acciones: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  btnAccion: {
    background: 'rgba(212,175,55,0.1)',
    border: '1px solid #d4af37',
    color: '#d4af37',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '0.95rem'
  }
};
