'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// ADMIN DE PRODUCTOS MÁGICOS
// Gestión de guardianes con generación de historias IA
// ═══════════════════════════════════════════════════════════════

const C = {
  bg: '#0a0a0f',
  card: '#12121a',
  elevated: '#1a1a24',
  border: '#2a2a35',
  gold: '#D4A853',
  goldLight: '#E8C97D',
  text: '#fff',
  muted: '#9ca3af',
  dim: '#6b7280',
  success: '#22c55e',
  purple: '#8B5CF6',
  error: '#ef4444',
  cyan: '#06b6d4',
};

const TIPOS = ['Duende', 'Elfo', 'Hada', 'Mago', 'Bruja', 'Gnomo'];
const ELEMENTOS = ['Tierra', 'Agua', 'Fuego', 'Aire', 'Éter'];
const PROPOSITOS = ['Protección', 'Abundancia', 'Amor', 'Sanación', 'Sabiduría', 'Creatividad'];

export default function ProductosMagicos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [filtro, setFiltro] = useState('');

  // Formulario de edición
  const [form, setForm] = useState({
    tipo: 'Duende',
    elemento: 'Tierra',
    proposito: 'Protección',
    caracteristicas: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const mostrarMensaje = (texto, tipo = 'ok') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 5000);
  };

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/productos/sync-to-woo');
      const data = await res.json();
      if (data.success) {
        setProductos(data.productos || []);
      }
    } catch (e) {
      mostrarMensaje('Error cargando productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    // Cargar datos existentes si los hay
    if (producto.datosEnriquecidos) {
      setForm({
        tipo: producto.datosEnriquecidos.tipo || 'Duende',
        elemento: producto.datosEnriquecidos.elemento || 'Tierra',
        proposito: producto.datosEnriquecidos.proposito || 'Protección',
        caracteristicas: producto.datosEnriquecidos.caracteristicas || ''
      });
    } else {
      setForm({
        tipo: 'Duende',
        elemento: 'Tierra',
        proposito: 'Protección',
        caracteristicas: ''
      });
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAR HISTORIA CON CLAUDE
  // ═══════════════════════════════════════════════════════════════
  const generarHistoria = async () => {
    if (!productoSeleccionado) return;

    setGenerando(true);
    mostrarMensaje('Generando historia con IA... (puede tardar 30 segundos)', 'info');

    try {
      const res = await fetch('/api/admin/productos/generar-historia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: productoSeleccionado.nombre,
          tipo: form.tipo,
          elemento: form.elemento,
          proposito: form.proposito,
          caracteristicas: form.caracteristicas,
          productId: productoSeleccionado.id
        })
      });

      const data = await res.json();

      if (data.success) {
        // Actualizar producto seleccionado con la nueva historia
        setProductoSeleccionado(prev => ({
          ...prev,
          tieneHistoria: true,
          datosEnriquecidos: {
            ...prev.datosEnriquecidos,
            historia: data.contenido.historia,
            neuromarketing: data.contenido.neuromarketing,
            tipo: form.tipo,
            elemento: form.elemento,
            proposito: form.proposito
          }
        }));

        // Actualizar lista
        setProductos(prev => prev.map(p =>
          p.id === productoSeleccionado.id
            ? { ...p, tieneHistoria: true, tieneNeuro: true }
            : p
        ));

        mostrarMensaje('¡Historia generada y guardada!');
      } else {
        mostrarMensaje(data.error || 'Error al generar', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    } finally {
      setGenerando(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // SINCRONIZAR A WOOCOMMERCE
  // ═══════════════════════════════════════════════════════════════
  const sincronizarAWoo = async () => {
    if (!productoSeleccionado?.datosEnriquecidos) {
      mostrarMensaje('Primero generá la historia', 'error');
      return;
    }

    setSincronizando(true);
    mostrarMensaje('Sincronizando con WooCommerce...', 'info');

    try {
      const res = await fetch('/api/admin/productos/sync-to-woo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productoSeleccionado.id,
          datos: productoSeleccionado.datosEnriquecidos
        })
      });

      const data = await res.json();

      if (data.success) {
        mostrarMensaje('¡Sincronizado con WooCommerce!');
      } else {
        mostrarMensaje(data.error || 'Error al sincronizar', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    } finally {
      setSincronizando(false);
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, display: 'flex' }}>

      {/* Toast */}
      {mensaje && (
        <div style={{
          position: 'fixed', top: 20, right: 20, padding: '16px 24px', zIndex: 1000,
          background: mensaje.tipo === 'error' ? C.error : mensaje.tipo === 'info' ? C.purple : C.success,
          borderRadius: 12, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', maxWidth: 400
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* LISTA DE PRODUCTOS */}
      <div style={{
        width: 380, background: C.card, borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column', height: '100vh'
      }}>
        {/* Header */}
        <div style={{ padding: 20, borderBottom: `1px solid ${C.border}` }}>
          <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🧙</span> Productos Mágicos
          </h1>
          <p style={{ fontSize: 12, color: C.muted }}>
            Generá historias únicas para cada guardián
          </p>

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar guardián..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{
              width: '100%', marginTop: 12, padding: '10px 14px',
              background: C.elevated, border: `1px solid ${C.border}`,
              borderRadius: 8, color: C.text, fontSize: 14
            }}
          />
        </div>

        {/* Lista */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
              Cargando productos...
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
              No hay productos
            </div>
          ) : (
            productosFiltrados.map(producto => (
              <div
                key={producto.id}
                onClick={() => seleccionarProducto(producto)}
                style={{
                  display: 'flex', gap: 12, padding: 12, marginBottom: 8,
                  background: productoSeleccionado?.id === producto.id ? `${C.gold}20` : C.elevated,
                  border: `2px solid ${productoSeleccionado?.id === producto.id ? C.gold : C.border}`,
                  borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {/* Imagen */}
                <div style={{
                  width: 60, height: 60, borderRadius: 10, flexShrink: 0,
                  background: producto.imagen
                    ? `url(${producto.imagen}) center/cover`
                    : `linear-gradient(135deg, ${C.purple}, ${C.gold})`,
                  border: `2px solid ${C.border}`
                }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 14, marginBottom: 4,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {producto.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
                    ${producto.precio} USD
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {producto.tieneHistoria && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 10, fontSize: 10,
                        background: `${C.success}20`, color: C.success
                      }}>
                        ✓ Historia
                      </span>
                    )}
                    {!producto.tieneHistoria && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 10, fontSize: 10,
                        background: `${C.error}20`, color: C.error
                      }}>
                        Sin historia
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con stats */}
        <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, background: C.elevated }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted }}>
            <span>{productos.length} productos</span>
            <span style={{ color: C.success }}>
              {productos.filter(p => p.tieneHistoria).length} con historia
            </span>
          </div>
        </div>
      </div>

      {/* PANEL DE EDICIÓN */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {!productoSeleccionado ? (
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: C.muted
          }}>
            <span style={{ fontSize: 64, marginBottom: 16 }}>🧙</span>
            <p>Seleccioná un producto para editar su historia</p>
          </div>
        ) : (
          <>
            {/* Header del producto */}
            <div style={{
              display: 'flex', gap: 20, marginBottom: 24, padding: 20,
              background: C.card, borderRadius: 16, border: `1px solid ${C.border}`
            }}>
              {/* Imagen grande */}
              <div style={{
                width: 150, height: 150, borderRadius: 16, flexShrink: 0,
                background: productoSeleccionado.imagen
                  ? `url(${productoSeleccionado.imagen}) center/cover`
                  : `linear-gradient(135deg, ${C.purple}, ${C.gold})`,
                border: `3px solid ${C.gold}`
              }} />

              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 24, fontWeight: 'bold', color: C.gold, marginBottom: 8 }}>
                  {productoSeleccionado.nombre}
                </h2>
                <p style={{ color: C.muted, marginBottom: 12 }}>
                  ID: {productoSeleccionado.id} • ${productoSeleccionado.precio} USD
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {productoSeleccionado.categorias?.map(c => (
                    <span key={c.id} style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12,
                      background: `${C.purple}20`, color: C.purple
                    }}>
                      {c.nombre}
                    </span>
                  ))}
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    onClick={generarHistoria}
                    disabled={generando}
                    style={{
                      padding: '12px 20px', borderRadius: 10, border: 'none',
                      background: generando ? C.dim : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                      color: '#000', fontWeight: 600, cursor: generando ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {generando ? '⏳ Generando...' : '✨ Generar Historia con IA'}
                  </button>

                  {productoSeleccionado.tieneHistoria && (
                    <button
                      onClick={sincronizarAWoo}
                      disabled={sincronizando}
                      style={{
                        padding: '12px 20px', borderRadius: 10,
                        background: C.cyan, border: 'none', color: '#000',
                        fontWeight: 600, cursor: sincronizando ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {sincronizando ? '⏳ Sincronizando...' : '🔄 Sync a WooCommerce'}
                    </button>
                  )}

                  <a
                    href={productoSeleccionado.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '12px 20px', borderRadius: 10,
                      background: C.elevated, border: `1px solid ${C.border}`,
                      color: C.text, textDecoration: 'none', fontWeight: 500
                    }}
                  >
                    Ver en tienda →
                  </a>
                </div>
              </div>
            </div>

            {/* Configuración del guardián */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
              marginBottom: 24, padding: 20, background: C.card, borderRadius: 16,
              border: `1px solid ${C.border}`
            }}>
              <div>
                <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>
                  Tipo de Guardián
                </label>
                <select
                  value={form.tipo}
                  onChange={e => setForm({ ...form, tipo: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', background: C.elevated,
                    border: `1px solid ${C.border}`, borderRadius: 8, color: C.text
                  }}
                >
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>
                  Elemento
                </label>
                <select
                  value={form.elemento}
                  onChange={e => setForm({ ...form, elemento: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', background: C.elevated,
                    border: `1px solid ${C.border}`, borderRadius: 8, color: C.text
                  }}
                >
                  {ELEMENTOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>
                  Propósito Principal
                </label>
                <select
                  value={form.proposito}
                  onChange={e => setForm({ ...form, proposito: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', background: C.elevated,
                    border: `1px solid ${C.border}`, borderRadius: 8, color: C.text
                  }}
                >
                  {PROPOSITOS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>
                  Características Extra
                </label>
                <input
                  type="text"
                  value={form.caracteristicas}
                  onChange={e => setForm({ ...form, caracteristicas: e.target.value })}
                  placeholder="ej: sabio, ancestral..."
                  style={{
                    width: '100%', padding: '10px 14px', background: C.elevated,
                    border: `1px solid ${C.border}`, borderRadius: 8, color: C.text
                  }}
                />
              </div>
            </div>

            {/* Preview de la historia */}
            {productoSeleccionado.datosEnriquecidos?.historia && (
              <div style={{
                padding: 24, background: C.card, borderRadius: 16,
                border: `1px solid ${C.border}`
              }}>
                <h3 style={{ color: C.gold, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>📜</span> Historia Generada
                </h3>

                {/* Origen */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, color: C.gold, marginBottom: 8 }}>🔮 Origen</h4>
                  <p style={{ color: C.text, lineHeight: 1.7, fontSize: 14 }}>
                    {productoSeleccionado.datosEnriquecidos.historia.origen}
                  </p>
                </div>

                {/* Personalidad */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, color: C.gold, marginBottom: 8 }}>✨ Personalidad</h4>
                  <p style={{ color: C.text, lineHeight: 1.7, fontSize: 14 }}>
                    {productoSeleccionado.datosEnriquecidos.historia.personalidad}
                  </p>
                </div>

                {/* Fortalezas */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, color: C.gold, marginBottom: 8 }}>💪 Fortalezas</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {productoSeleccionado.datosEnriquecidos.historia.fortalezas?.map((f, i) => (
                      <span key={i} style={{
                        padding: '6px 12px', borderRadius: 20, fontSize: 12,
                        background: `${C.success}15`, border: `1px solid ${C.success}40`, color: C.success
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mensaje de poder */}
                <div style={{
                  padding: 20, background: `${C.gold}10`, borderRadius: 12,
                  borderLeft: `4px solid ${C.gold}`, marginBottom: 20
                }}>
                  <p style={{ fontStyle: 'italic', fontSize: 18, color: C.gold }}>
                    "{productoSeleccionado.datosEnriquecidos.historia.mensajePoder}"
                  </p>
                </div>

                {/* Ritual */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, color: C.gold, marginBottom: 8 }}>📜 Ritual de Bienvenida</h4>
                  <p style={{ color: C.text, lineHeight: 1.7, fontSize: 14 }}>
                    {productoSeleccionado.datosEnriquecidos.historia.ritual}
                  </p>
                </div>

                {/* Neuromarketing */}
                {productoSeleccionado.datosEnriquecidos.neuromarketing && (
                  <div style={{
                    marginTop: 24, padding: 20, background: C.elevated, borderRadius: 12
                  }}>
                    <h4 style={{ fontSize: 14, color: C.purple, marginBottom: 12 }}>
                      🧠 Datos de Neuromarketing
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <span style={{ fontSize: 11, color: C.muted }}>Urgencia:</span>
                        <p style={{ fontSize: 13, color: C.text }}>
                          {productoSeleccionado.datosEnriquecidos.neuromarketing.urgencia}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: C.muted }}>Escasez:</span>
                        <p style={{ fontSize: 13, color: C.text }}>
                          {productoSeleccionado.datosEnriquecidos.neuromarketing.escasez}
                        </p>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ fontSize: 11, color: C.muted }}>Promesa:</span>
                        <p style={{ fontSize: 13, color: C.gold }}>
                          {productoSeleccionado.datosEnriquecidos.neuromarketing.promesa}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
