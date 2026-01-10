'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// ADMIN DE PRODUCTOS INTELIGENTE
// ═══════════════════════════════════════════════════════════════

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [ordenar, setOrdenar] = useState('nombre');
  const [estadisticas, setEstadisticas] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/productos');
      const data = await res.json();
      if (data.success) {
        setProductos(data.productos || []);
        setEstadisticas(data.estadisticas);
      }
    } catch (e) {
      console.error('Error cargando productos:', e);
      setMensaje({ tipo: 'error', texto: 'Error al cargar productos' });
    }
    setCargando(false);
  };

  const sincronizarWoo = async () => {
    setSincronizando(true);
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/productos/sincronizar', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'exito', texto: `Sincronizados ${data.total} productos de WooCommerce` });
        await cargarProductos();
      } else {
        setMensaje({ tipo: 'error', texto: data.error || 'Error al sincronizar' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error de conexion' });
    }
    setSincronizando(false);
  };

  const guardarProducto = async (producto) => {
    try {
      const res = await fetch('/api/admin/productos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'exito', texto: 'Producto actualizado' });
        setModoEdicion(false);
        await cargarProductos();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar' });
    }
  };

  // Filtrar y ordenar productos
  const productosFiltrados = productos
    .filter(p => {
      const matchBusqueda = p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = categoriaFiltro === 'todas' || p.categoria === categoriaFiltro;
      return matchBusqueda && matchCategoria;
    })
    .sort((a, b) => {
      switch (ordenar) {
        case 'precio_asc': return (a.precio || 0) - (b.precio || 0);
        case 'precio_desc': return (b.precio || 0) - (a.precio || 0);
        case 'stock': return (b.stock || 0) - (a.stock || 0);
        case 'ventas': return (b.vendidos || 0) - (a.vendidos || 0);
        default: return (a.nombre || '').localeCompare(b.nombre || '');
      }
    });

  // Obtener categorias unicas
  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))];

  if (cargando) {
    return (
      <div style={estilos.loading}>
        <div style={estilos.spinner}></div>
        <p style={{ color: '#666', marginTop: '16px' }}>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div style={estilos.contenedor}>
      {/* Header */}
      <div style={estilos.header}>
        <div>
          <h1 style={estilos.titulo}>Productos</h1>
          <p style={estilos.subtitulo}>Gestion inteligente de tu catalogo</p>
        </div>
        <div style={estilos.headerAcciones}>
          <button
            onClick={sincronizarWoo}
            style={estilos.btnSincronizar}
            disabled={sincronizando}
          >
            {sincronizando ? '⟳ Sincronizando...' : '⟳ Sincronizar WooCommerce'}
          </button>
          <button onClick={cargarProductos} style={estilos.btnRefresh}>
            ↻ Actualizar
          </button>
        </div>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div style={{
          ...estilos.mensaje,
          background: mensaje.tipo === 'exito' ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
          borderColor: mensaje.tipo === 'exito' ? '#4CAF50' : '#f44336'
        }}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)} style={estilos.mensajeCerrar}>×</button>
        </div>
      )}

      {/* Stats rapidos */}
      {estadisticas && (
        <div style={estilos.statsGrid}>
          <div style={estilos.statCard}>
            <span style={estilos.statIcono}>📦</span>
            <span style={estilos.statValor}>{estadisticas.total || 0}</span>
            <span style={estilos.statLabel}>Total productos</span>
          </div>
          <div style={estilos.statCard}>
            <span style={estilos.statIcono}>✓</span>
            <span style={estilos.statValor}>{estadisticas.enStock || 0}</span>
            <span style={estilos.statLabel}>En stock</span>
          </div>
          <div style={estilos.statCard}>
            <span style={estilos.statIcono}>⚠</span>
            <span style={estilos.statValor}>{estadisticas.sinStock || 0}</span>
            <span style={estilos.statLabel}>Sin stock</span>
          </div>
          <div style={estilos.statCard}>
            <span style={estilos.statIcono}>💰</span>
            <span style={estilos.statValor}>${estadisticas.valorInventario || 0}</span>
            <span style={estilos.statLabel}>Valor inventario</span>
          </div>
          <div style={estilos.statCard}>
            <span style={estilos.statIcono}>🔥</span>
            <span style={estilos.statValor}>{estadisticas.masVendido || '-'}</span>
            <span style={estilos.statLabel}>Mas vendido</span>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={estilos.filtros}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={estilos.inputBusqueda}
        />
        <select
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
          style={estilos.select}
        >
          <option value="todas">Todas las categorias</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={ordenar}
          onChange={e => setOrdenar(e.target.value)}
          style={estilos.select}
        >
          <option value="nombre">Ordenar por nombre</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
          <option value="stock">Stock disponible</option>
          <option value="ventas">Mas vendidos</option>
        </select>
      </div>

      {/* Productos Grid */}
      <div style={estilos.productosGrid}>
        {productosFiltrados.length === 0 ? (
          <div style={estilos.vacio}>
            <span style={{ fontSize: '48px' }}>📦</span>
            <p>No se encontraron productos</p>
            <button onClick={sincronizarWoo} style={estilos.btnPrimario}>
              Sincronizar desde WooCommerce
            </button>
          </div>
        ) : (
          productosFiltrados.map(producto => (
            <div
              key={producto.id}
              style={estilos.productoCard}
              onClick={() => setProductoSeleccionado(producto)}
            >
              <div style={estilos.productoImgContainer}>
                <img
                  src={producto.imagen || 'https://placehold.co/200x200/1a1a1a/666?text=Sin+imagen'}
                  alt={producto.nombre}
                  style={estilos.productoImg}
                  onError={e => e.target.src = 'https://placehold.co/200x200/1a1a1a/666?text=Error'}
                />
                {producto.stock <= 0 && (
                  <div style={estilos.badgeSinStock}>Sin stock</div>
                )}
                {producto.destacado && (
                  <div style={estilos.badgeDestacado}>★</div>
                )}
              </div>
              <div style={estilos.productoInfo}>
                <h3 style={estilos.productoNombre}>{producto.nombre}</h3>
                <p style={estilos.productoCategoria}>{producto.categoria || 'Sin categoria'}</p>
                <div style={estilos.productoFooter}>
                  <span style={estilos.productoPrecio}>${producto.precio || 0}</span>
                  <span style={{
                    ...estilos.productoStock,
                    color: producto.stock > 0 ? '#4CAF50' : '#f44336'
                  }}>
                    {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal detalle producto */}
      {productoSeleccionado && (
        <div style={estilos.modalOverlay} onClick={() => { setProductoSeleccionado(null); setModoEdicion(false); }}>
          <div style={estilos.modal} onClick={e => e.stopPropagation()}>
            <div style={estilos.modalHeader}>
              <h2 style={estilos.modalTitulo}>
                {modoEdicion ? 'Editar producto' : 'Detalle del producto'}
              </h2>
              <button
                onClick={() => { setProductoSeleccionado(null); setModoEdicion(false); }}
                style={estilos.modalCerrar}
              >×</button>
            </div>

            <div style={estilos.modalBody}>
              <div style={estilos.modalGrid}>
                <div style={estilos.modalImgSection}>
                  <img
                    src={productoSeleccionado.imagen || 'https://placehold.co/300x300/1a1a1a/666?text=Sin+imagen'}
                    alt={productoSeleccionado.nombre}
                    style={estilos.modalImg}
                  />
                  {productoSeleccionado.wooId && (
                    <p style={estilos.wooId}>WooCommerce ID: {productoSeleccionado.wooId}</p>
                  )}
                </div>

                <div style={estilos.modalInfoSection}>
                  {modoEdicion ? (
                    <ProductoForm
                      producto={productoSeleccionado}
                      onGuardar={guardarProducto}
                      onCancelar={() => setModoEdicion(false)}
                    />
                  ) : (
                    <>
                      <h3 style={estilos.modalNombre}>{productoSeleccionado.nombre}</h3>
                      <p style={estilos.modalCategoria}>{productoSeleccionado.categoria}</p>

                      <div style={estilos.modalStats}>
                        <div style={estilos.modalStat}>
                          <span style={estilos.modalStatLabel}>Precio</span>
                          <span style={estilos.modalStatValor}>${productoSeleccionado.precio}</span>
                        </div>
                        <div style={estilos.modalStat}>
                          <span style={estilos.modalStatLabel}>Stock</span>
                          <span style={{
                            ...estilos.modalStatValor,
                            color: productoSeleccionado.stock > 0 ? '#4CAF50' : '#f44336'
                          }}>
                            {productoSeleccionado.stock || 0}
                          </span>
                        </div>
                        <div style={estilos.modalStat}>
                          <span style={estilos.modalStatLabel}>Vendidos</span>
                          <span style={estilos.modalStatValor}>{productoSeleccionado.vendidos || 0}</span>
                        </div>
                      </div>

                      {productoSeleccionado.descripcion && (
                        <div style={estilos.modalDescripcion}>
                          <h4 style={{ color: '#C6A962', marginBottom: '8px' }}>Descripcion</h4>
                          <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.6' }}>
                            {productoSeleccionado.descripcion}
                          </p>
                        </div>
                      )}

                      {/* Metadata adicional */}
                      {productoSeleccionado.guardian && (
                        <div style={estilos.modalMeta}>
                          <span style={estilos.metaLabel}>Guardian asociado:</span>
                          <span style={estilos.metaValor}>{productoSeleccionado.guardian}</span>
                        </div>
                      )}
                      {productoSeleccionado.cristales?.length > 0 && (
                        <div style={estilos.modalMeta}>
                          <span style={estilos.metaLabel}>Cristales:</span>
                          <span style={estilos.metaValor}>{productoSeleccionado.cristales.join(', ')}</span>
                        </div>
                      )}
                      {productoSeleccionado.elemento && (
                        <div style={estilos.modalMeta}>
                          <span style={estilos.metaLabel}>Elemento:</span>
                          <span style={estilos.metaValor}>{productoSeleccionado.elemento}</span>
                        </div>
                      )}

                      <div style={estilos.modalAcciones}>
                        <button
                          onClick={() => setModoEdicion(true)}
                          style={estilos.btnEditar}
                        >
                          ✏️ Editar
                        </button>
                        {productoSeleccionado.wooUrl && (
                          <a
                            href={productoSeleccionado.wooUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={estilos.btnWoo}
                          >
                            Ver en WooCommerce ↗
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Formulario de Edicion
// ═══════════════════════════════════════════════════════════════

function ProductoForm({ producto, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    ...producto,
    guardian: producto.guardian || '',
    elemento: producto.elemento || '',
    cristales: producto.cristales?.join(', ') || '',
    proposito: producto.proposito || '',
    destacado: producto.destacado || false
  });

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = () => {
    const productoActualizado = {
      ...form,
      cristales: form.cristales ? form.cristales.split(',').map(c => c.trim()) : []
    };
    onGuardar(productoActualizado);
  };

  return (
    <div style={estilos.form}>
      <div style={estilos.formGrupo}>
        <label style={estilos.formLabel}>Nombre</label>
        <input
          type="text"
          value={form.nombre}
          onChange={e => handleChange('nombre', e.target.value)}
          style={estilos.formInput}
        />
      </div>

      <div style={estilos.formRow}>
        <div style={estilos.formGrupo}>
          <label style={estilos.formLabel}>Precio ($)</label>
          <input
            type="number"
            value={form.precio}
            onChange={e => handleChange('precio', parseFloat(e.target.value))}
            style={estilos.formInput}
          />
        </div>
        <div style={estilos.formGrupo}>
          <label style={estilos.formLabel}>Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={e => handleChange('stock', parseInt(e.target.value))}
            style={estilos.formInput}
          />
        </div>
      </div>

      <div style={estilos.formGrupo}>
        <label style={estilos.formLabel}>Descripcion</label>
        <textarea
          value={form.descripcion || ''}
          onChange={e => handleChange('descripcion', e.target.value)}
          style={{ ...estilos.formInput, minHeight: '80px', resize: 'vertical' }}
        />
      </div>

      <div style={estilos.formDivider}>
        <span>Datos magicos del producto</span>
      </div>

      <div style={estilos.formRow}>
        <div style={estilos.formGrupo}>
          <label style={estilos.formLabel}>Guardian asociado</label>
          <input
            type="text"
            value={form.guardian}
            onChange={e => handleChange('guardian', e.target.value)}
            style={estilos.formInput}
            placeholder="Nombre del guardian"
          />
        </div>
        <div style={estilos.formGrupo}>
          <label style={estilos.formLabel}>Elemento</label>
          <select
            value={form.elemento}
            onChange={e => handleChange('elemento', e.target.value)}
            style={estilos.formInput}
          >
            <option value="">Sin elemento</option>
            <option value="tierra">Tierra</option>
            <option value="agua">Agua</option>
            <option value="fuego">Fuego</option>
            <option value="aire">Aire</option>
            <option value="eter">Eter</option>
          </select>
        </div>
      </div>

      <div style={estilos.formGrupo}>
        <label style={estilos.formLabel}>Cristales (separados por coma)</label>
        <input
          type="text"
          value={form.cristales}
          onChange={e => handleChange('cristales', e.target.value)}
          style={estilos.formInput}
          placeholder="cuarzo, amatista, obsidiana..."
        />
      </div>

      <div style={estilos.formGrupo}>
        <label style={estilos.formLabel}>Proposito</label>
        <select
          value={form.proposito}
          onChange={e => handleChange('proposito', e.target.value)}
          style={estilos.formInput}
        >
          <option value="">Sin proposito especifico</option>
          <option value="proteccion">Proteccion</option>
          <option value="abundancia">Abundancia</option>
          <option value="amor">Amor</option>
          <option value="sanacion">Sanacion</option>
          <option value="creatividad">Creatividad</option>
          <option value="intuicion">Intuicion</option>
          <option value="equilibrio">Equilibrio</option>
        </select>
      </div>

      <div style={estilos.formCheckbox}>
        <input
          type="checkbox"
          id="destacado"
          checked={form.destacado}
          onChange={e => handleChange('destacado', e.target.checked)}
        />
        <label htmlFor="destacado" style={{ color: '#ccc', marginLeft: '8px' }}>
          Producto destacado
        </label>
      </div>

      <div style={estilos.formAcciones}>
        <button onClick={onCancelar} style={estilos.btnCancelar}>
          Cancelar
        </button>
        <button onClick={handleSubmit} style={estilos.btnGuardar}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  contenedor: {
    maxWidth: '1400px',
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
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  titulo: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  subtitulo: {
    color: '#666',
    fontSize: '14px'
  },
  headerAcciones: {
    display: 'flex',
    gap: '12px'
  },
  btnSincronizar: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    color: '#C6A962',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  btnRefresh: {
    padding: '10px 16px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer'
  },

  // Mensaje
  mensaje: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff'
  },
  mensajeCerrar: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer'
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statIcono: {
    fontSize: '20px'
  },
  statValor: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700'
  },
  statLabel: {
    color: '#666',
    fontSize: '12px'
  },

  // Filtros
  filtros: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  inputBusqueda: {
    flex: '1 1 300px',
    padding: '12px 16px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },
  select: {
    padding: '12px 16px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '180px'
  },

  // Productos Grid
  productosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px'
  },
  productoCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  productoImgContainer: {
    position: 'relative',
    aspectRatio: '1',
    background: '#0a0a0a'
  },
  productoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  badgeSinStock: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(244,67,54,0.9)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600'
  },
  badgeDestacado: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    background: '#C6A962',
    color: '#0a0a0a',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px'
  },
  productoInfo: {
    padding: '16px'
  },
  productoNombre: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px',
    lineHeight: '1.4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  productoCategoria: {
    color: '#666',
    fontSize: '12px',
    marginBottom: '12px'
  },
  productoFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productoPrecio: {
    color: '#C6A962',
    fontSize: '16px',
    fontWeight: '600'
  },
  productoStock: {
    fontSize: '11px'
  },

  // Vacio
  vacio: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  },
  btnPrimario: {
    marginTop: '20px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitulo: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600'
  },
  modalCerrar: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '28px',
    cursor: 'pointer'
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto'
  },
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '32px'
  },
  modalImgSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  modalImg: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: '12px',
    border: '1px solid #2a2a2a'
  },
  wooId: {
    color: '#666',
    fontSize: '12px',
    textAlign: 'center'
  },
  modalInfoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  modalNombre: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '0'
  },
  modalCategoria: {
    color: '#C6A962',
    fontSize: '14px'
  },
  modalStats: {
    display: 'flex',
    gap: '24px',
    padding: '16px',
    background: '#0a0a0a',
    borderRadius: '8px'
  },
  modalStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  modalStatLabel: {
    color: '#666',
    fontSize: '12px'
  },
  modalStatValor: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: '600'
  },
  modalDescripcion: {
    padding: '16px',
    background: '#0a0a0a',
    borderRadius: '8px'
  },
  modalMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '14px'
  },
  metaLabel: {
    color: '#666'
  },
  metaValor: {
    color: '#ccc'
  },
  modalAcciones: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  btnEditar: {
    padding: '10px 20px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer'
  },
  btnWoo: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #C6A962',
    borderRadius: '8px',
    color: '#C6A962',
    fontSize: '14px',
    textDecoration: 'none',
    cursor: 'pointer'
  },

  // Formulario
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGrupo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1
  },
  formLabel: {
    color: '#888',
    fontSize: '13px'
  },
  formInput: {
    padding: '10px 14px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },
  formRow: {
    display: 'flex',
    gap: '16px'
  },
  formDivider: {
    padding: '12px 0',
    borderTop: '1px solid #2a2a2a',
    marginTop: '8px',
    color: '#C6A962',
    fontSize: '13px'
  },
  formCheckbox: {
    display: 'flex',
    alignItems: 'center'
  },
  formAcciones: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    justifyContent: 'flex-end'
  },
  btnCancelar: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer'
  },
  btnGuardar: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
