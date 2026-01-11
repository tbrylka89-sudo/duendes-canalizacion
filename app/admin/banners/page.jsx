'use client';

import { useState, useEffect } from 'react';

// Colores de la marca
const COLORS = {
  gold: '#C6A962',
  goldLight: '#D4BC7D',
  dark: '#0a0a0a',
  darkCard: '#141414',
  darkBorder: '#2a2a2a',
  green: '#4A5D4A',
  greenDark: '#1B4D3E'
};

// Estilos glassmorphism
const GLASS = {
  background: 'rgba(20, 20, 20, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(198, 169, 98, 0.1)'
};

// Ubicaciones de banners en Mi Magia
const UBICACIONES = [
  { id: 'hero', nombre: 'Banner Principal (Hero)', descripcion: 'Banner grande al inicio de Mi Magia', aspecto: '16:9' },
  { id: 'sidebar', nombre: 'Sidebar', descripcion: 'Banner lateral en escritorio', aspecto: '1:2' },
  { id: 'circulo-cta', nombre: 'CTA Círculo', descripcion: 'Promoción del Círculo de Duendes', aspecto: '3:1' },
  { id: 'promo-tienda', nombre: 'Promo Tienda', descripcion: 'Ofertas y novedades de la tienda', aspecto: '16:9' },
  { id: 'evento', nombre: 'Evento Especial', descripcion: 'Sabbats, luna llena, promociones', aspecto: '4:3' },
  { id: 'footer', nombre: 'Footer Banner', descripcion: 'Banner antes del pie de página', aspecto: '4:1' }
];

// Plantillas de texto predefinidas
const PLANTILLAS_TEXTO = [
  { id: 'sabbat', titulo: '🌙 {NOMBRE_SABBAT}', subtitulo: 'Celebrá la magia de la rueda del año', cta: 'Ver ritual' },
  { id: 'luna-llena', titulo: '🌕 Luna Llena en {SIGNO}', subtitulo: 'Aprovechá esta energía para {PROPOSITO}', cta: 'Descubrir ritual' },
  { id: 'oferta', titulo: '✨ {PORCENTAJE}% OFF', subtitulo: 'En {PRODUCTO} por tiempo limitado', cta: 'Ir a la tienda' },
  { id: 'circulo', titulo: '☽ El Círculo te espera', subtitulo: 'Contenido exclusivo, rituales y más', cta: 'Unirme ahora' },
  { id: 'nuevo', titulo: '🎉 ¡Nuevo!', subtitulo: '{DESCRIPCION}', cta: 'Descubrir' },
  { id: 'regalo', titulo: '🎁 Regalo para vos', subtitulo: '{DESCRIPCION_REGALO}', cta: 'Reclamar' }
];

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [generandoImagen, setGenerandoImagen] = useState(false);

  // Nuevo banner
  const [nuevo, setNuevo] = useState({
    ubicacion: 'hero',
    titulo: '',
    subtitulo: '',
    ctaTexto: '',
    ctaUrl: '',
    imagenUrl: '',
    colorFondo: '#1B4D3E',
    colorTexto: '#FFFFFF',
    activo: true,
    fechaInicio: '',
    fechaFin: ''
  });

  // Prompt para imagen AI
  const [promptImagen, setPromptImagen] = useState('');
  const [estiloImagen, setEstiloImagen] = useState('duendes');

  useEffect(() => {
    cargarBanners();
  }, []);

  const cargarBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners || []);
      }
    } catch (e) {
      console.error('Error cargando banners:', e);
    } finally {
      setLoading(false);
    }
  };

  const generarImagen = async () => {
    if (!promptImagen.trim()) return;

    setGenerandoImagen(true);
    try {
      const res = await fetch('/api/admin/imagen/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: promptImagen,
          estilo: estiloImagen,
          tamaño: '1792x1024'
        })
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNuevo(prev => ({ ...prev, imagenUrl: data.url }));
      } else {
        alert(data.error || 'Error generando imagen');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setGenerandoImagen(false);
    }
  };

  const guardarBanner = async () => {
    if (!nuevo.titulo) {
      alert('El título es requerido');
      return;
    }

    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editando ? { ...nuevo, id: editando } : nuevo)
      });
      const data = await res.json();
      if (data.success) {
        cargarBanners();
        limpiarFormulario();
      } else {
        alert(data.error || 'Error guardando banner');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const eliminarBanner = async (id) => {
    if (!confirm('¿Eliminar este banner?')) return;

    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        cargarBanners();
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const toggleActivo = async (banner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, activo: !banner.activo })
      });
      if ((await res.json()).success) {
        cargarBanners();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editarBanner = (banner) => {
    setEditando(banner.id);
    setNuevo({
      ubicacion: banner.ubicacion || 'hero',
      titulo: banner.titulo || '',
      subtitulo: banner.subtitulo || '',
      ctaTexto: banner.ctaTexto || '',
      ctaUrl: banner.ctaUrl || '',
      imagenUrl: banner.imagenUrl || '',
      colorFondo: banner.colorFondo || '#1B4D3E',
      colorTexto: banner.colorTexto || '#FFFFFF',
      activo: banner.activo !== false,
      fechaInicio: banner.fechaInicio || '',
      fechaFin: banner.fechaFin || ''
    });
  };

  const limpiarFormulario = () => {
    setEditando(null);
    setNuevo({
      ubicacion: 'hero',
      titulo: '',
      subtitulo: '',
      ctaTexto: '',
      ctaUrl: '',
      imagenUrl: '',
      colorFondo: '#1B4D3E',
      colorTexto: '#FFFFFF',
      activo: true,
      fechaInicio: '',
      fechaFin: ''
    });
    setPromptImagen('');
  };

  const aplicarPlantilla = (plantilla) => {
    setNuevo(prev => ({
      ...prev,
      titulo: plantilla.titulo,
      subtitulo: plantilla.subtitulo,
      ctaTexto: plantilla.cta
    }));
  };

  // Estilos
  const cardStyle = {
    ...GLASS,
    borderRadius: '16px',
    padding: '24px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(198, 169, 98, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
    border: 'none',
    borderRadius: '8px',
    color: COLORS.dark,
    fontWeight: '600',
    cursor: 'pointer'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px'
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
          🖼️ Gestión de Banners
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>
          Creá y gestioná los banners de Mi Magia con IA
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        {/* Lista de banners */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '20px' }}>
            Banners Activos
          </h2>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '40px' }}>
              Cargando...
            </p>
          ) : banners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.5)' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</p>
              <p>No hay banners creados</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Creá tu primer banner desde el panel derecho</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {banners.map(banner => (
                <div
                  key={banner.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    opacity: banner.activo ? 1 : 0.5
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {/* Preview imagen */}
                    <div
                      style={{
                        width: '160px',
                        height: '90px',
                        borderRadius: '8px',
                        background: banner.imagenUrl
                          ? `url(${banner.imagenUrl}) center/cover`
                          : banner.colorFondo,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {!banner.imagenUrl && (
                        <span style={{ fontSize: '24px' }}>🖼️</span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h3 style={{ color: 'white', fontSize: '16px', marginBottom: '4px' }}>
                            {banner.titulo}
                          </h3>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                            {banner.subtitulo}
                          </p>
                        </div>
                        <span
                          style={{
                            padding: '4px 8px',
                            background: banner.activo ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                            color: banner.activo ? '#22c55e' : 'rgba(255,255,255,0.5)',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}
                        >
                          {banner.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(198, 169, 98, 0.1)',
                            color: COLORS.gold,
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}
                        >
                          {UBICACIONES.find(u => u.id === banner.ubicacion)?.nombre || banner.ubicacion}
                        </span>
                        {banner.fechaFin && (
                          <span
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}
                          >
                            Hasta {new Date(banner.fechaFin).toLocaleDateString('es-UY')}
                          </span>
                        )}
                      </div>

                      {/* Acciones */}
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => editarBanner(banner)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(198, 169, 98, 0.2)',
                            border: 'none',
                            borderRadius: '6px',
                            color: COLORS.gold,
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => toggleActivo(banner)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          {banner.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => eliminarBanner(banner.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#ef4444',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de creación */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '20px' }}>
            {editando ? '✏️ Editar Banner' : '✨ Crear Banner'}
          </h2>

          {/* Plantillas rápidas */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Plantillas rápidas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PLANTILLAS_TEXTO.map(p => (
                <button
                  key={p.id}
                  onClick={() => aplicarPlantilla(p)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(198, 169, 98, 0.1)',
                    border: '1px solid rgba(198, 169, 98, 0.2)',
                    borderRadius: '6px',
                    color: COLORS.gold,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Ubicación</label>
            <select
              value={nuevo.ubicacion}
              onChange={e => setNuevo(prev => ({ ...prev, ubicacion: e.target.value }))}
              style={inputStyle}
            >
              {UBICACIONES.map(u => (
                <option key={u.id} value={u.id}>{u.nombre} ({u.aspecto})</option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Título *</label>
            <input
              type="text"
              value={nuevo.titulo}
              onChange={e => setNuevo(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ej: 🌙 Luna Llena en Leo"
              style={inputStyle}
            />
          </div>

          {/* Subtítulo */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Subtítulo</label>
            <input
              type="text"
              value={nuevo.subtitulo}
              onChange={e => setNuevo(prev => ({ ...prev, subtitulo: e.target.value }))}
              placeholder="Ej: Descubrí el ritual especial"
              style={inputStyle}
            />
          </div>

          {/* CTA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Texto del botón</label>
              <input
                type="text"
                value={nuevo.ctaTexto}
                onChange={e => setNuevo(prev => ({ ...prev, ctaTexto: e.target.value }))}
                placeholder="Ver más"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>URL del botón</label>
              <input
                type="text"
                value={nuevo.ctaUrl}
                onChange={e => setNuevo(prev => ({ ...prev, ctaUrl: e.target.value }))}
                placeholder="/circulo"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Generar imagen con IA */}
          <div style={{
            marginBottom: '16px',
            padding: '16px',
            background: 'rgba(198, 169, 98, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(198, 169, 98, 0.1)'
          }}>
            <label style={{ ...labelStyle, color: COLORS.gold }}>✨ Generar imagen con IA</label>
            <textarea
              value={promptImagen}
              onChange={e => setPromptImagen(e.target.value)}
              placeholder="Describí la imagen que querés: Ej: 'bosque mágico con luciérnagas y cristales brillantes'"
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={estiloImagen}
                onChange={e => setEstiloImagen(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="duendes">Estilo Duendes</option>
                <option value="celestial">Celestial</option>
                <option value="botanico">Botánico</option>
                <option value="cristales">Cristales</option>
                <option value="altar">Altar</option>
              </select>
              <button
                onClick={generarImagen}
                disabled={generandoImagen || !promptImagen.trim()}
                style={{
                  ...buttonStyle,
                  opacity: generandoImagen || !promptImagen.trim() ? 0.5 : 1
                }}
              >
                {generandoImagen ? '⏳' : '🎨'} Generar
              </button>
            </div>
          </div>

          {/* URL de imagen o preview */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>URL de imagen</label>
            <input
              type="text"
              value={nuevo.imagenUrl}
              onChange={e => setNuevo(prev => ({ ...prev, imagenUrl: e.target.value }))}
              placeholder="https://..."
              style={inputStyle}
            />
            {nuevo.imagenUrl && (
              <div
                style={{
                  marginTop: '12px',
                  height: '150px',
                  borderRadius: '8px',
                  background: `url(${nuevo.imagenUrl}) center/cover`,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
            )}
          </div>

          {/* Colores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Color de fondo</label>
              <input
                type="color"
                value={nuevo.colorFondo}
                onChange={e => setNuevo(prev => ({ ...prev, colorFondo: e.target.value }))}
                style={{ ...inputStyle, height: '44px', cursor: 'pointer' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Color de texto</label>
              <input
                type="color"
                value={nuevo.colorTexto}
                onChange={e => setNuevo(prev => ({ ...prev, colorTexto: e.target.value }))}
                style={{ ...inputStyle, height: '44px', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Fechas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Fecha inicio (opcional)</label>
              <input
                type="date"
                value={nuevo.fechaInicio}
                onChange={e => setNuevo(prev => ({ ...prev, fechaInicio: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Fecha fin (opcional)</label>
              <input
                type="date"
                value={nuevo.fechaFin}
                onChange={e => setNuevo(prev => ({ ...prev, fechaFin: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={guardarBanner} style={{ ...buttonStyle, flex: 1 }}>
              {editando ? '💾 Guardar cambios' : '✨ Crear banner'}
            </button>
            {editando && (
              <button
                onClick={limpiarFormulario}
                style={{
                  ...buttonStyle,
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview en vivo */}
      {(nuevo.titulo || nuevo.imagenUrl) && (
        <div style={{ ...cardStyle, marginTop: '24px' }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>👁️ Preview</h3>
          <div
            style={{
              borderRadius: '12px',
              padding: '40px',
              background: nuevo.imagenUrl
                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${nuevo.imagenUrl}) center/cover`
                : nuevo.colorFondo,
              color: nuevo.colorTexto,
              textAlign: 'center'
            }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
              {nuevo.titulo || 'Título del banner'}
            </h2>
            {nuevo.subtitulo && (
              <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '16px' }}>
                {nuevo.subtitulo}
              </p>
            )}
            {nuevo.ctaTexto && (
              <button
                style={{
                  padding: '12px 32px',
                  background: COLORS.gold,
                  border: 'none',
                  borderRadius: '8px',
                  color: COLORS.dark,
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {nuevo.ctaTexto}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
