'use client';
import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// ESTUDIO DE CONTENIDO - EDITOR COMPLETO CON PREVIEW
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgElevated: '#1a1a25',
  bgHover: '#22222f',
  border: '#2a2a3a',
  borderLight: '#3a3a4a',
  text: '#ffffff',
  textMuted: '#9ca3af',
  textDim: '#6b7280',
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  cyan: '#06B6D4',
  pink: '#EC4899',
  emerald: '#10B981',
  orange: '#F97316',
  amber: '#F59E0B',
  gold: '#D4A853',
  success: '#22c55e',
  error: '#ef4444',
};

const CATEGORIAS = [
  { id: 'cosmos', nombre: 'Cosmos y Luna', icono: '🌙', color: '#8B5CF6' },
  { id: 'duendes', nombre: 'Mundo Duende', icono: '🧙', color: '#F59E0B' },
  { id: 'diy', nombre: 'DIY Mágico', icono: '✂️', color: '#EC4899' },
  { id: 'esoterico', nombre: 'Esotérico', icono: '🔮', color: '#A78BFA' },
  { id: 'sanacion', nombre: 'Sanación', icono: '💚', color: '#10B981' },
  { id: 'rituales', nombre: 'Rituales', icono: '🕯️', color: '#F97316' },
];

const TIPOS = [
  { id: 'articulo', nombre: 'Artículo', icono: '📝' },
  { id: 'ritual', nombre: 'Ritual', icono: '🕯️' },
  { id: 'guia', nombre: 'Guía', icono: '📖' },
  { id: 'meditacion', nombre: 'Meditación', icono: '🧘' },
  { id: 'reflexion', nombre: 'Reflexión', icono: '💭' },
  { id: 'historia', nombre: 'Historia', icono: '📚' },
];

const INSTRUCCIONES_RAPIDAS = [
  { label: 'Más místico', instruccion: 'Hacelo más místico y mágico, con más referencias esotéricas' },
  { label: 'Más personal', instruccion: 'Hacelo más íntimo y personal, como hablándole a una amiga' },
  { label: 'Más práctico', instruccion: 'Hacelo más práctico y aplicable, con pasos concretos' },
  { label: 'Más corto', instruccion: 'Reducí la extensión a la mitad, mantené lo esencial' },
  { label: 'Más largo', instruccion: 'Extendé y profundizá más en el tema' },
  { label: 'Más simple', instruccion: 'Simplificá el lenguaje para principiantes' },
  { label: 'Más profundo', instruccion: 'Profundizá con más detalles y capas de significado' },
  { label: 'Agregar ritual', instruccion: 'Agregá un ritual práctico relacionado al final' },
];

export default function EstudioContenido() {
  // Estado principal del contenido
  const [contenido, setContenido] = useState({
    titulo: '',
    extracto: '',
    categoria: 'cosmos',
    tipo: 'articulo',
    imagen: null,
    secciones: [
      { id: 'intro', nombre: 'Introducción', contenido: '', audio: null, mostrarAudio: false },
      { id: 'desarrollo', nombre: 'Desarrollo', contenido: '', audio: null, mostrarAudio: false },
      { id: 'practica', nombre: 'Práctica/Ritual', contenido: '', audio: null, mostrarAudio: false },
      { id: 'cierre', nombre: 'Cierre', contenido: '', audio: null, mostrarAudio: false },
    ],
    autor: 'Thibisay',
    publicado: false,
  });

  // Estados de UI
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [panelInstrucciones, setPanelInstrucciones] = useState(null);
  const [instruccionPersonalizada, setInstruccionPersonalizada] = useState('');
  const [loading, setLoading] = useState({});
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile
  const [showPreview, setShowPreview] = useState(true);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState(null);

  // Estado para generación inicial
  const [temaInicial, setTemaInicial] = useState('');
  const [generandoCompleto, setGenerandoCompleto] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // GENERACIÓN DE CONTENIDO COMPLETO
  // ═══════════════════════════════════════════════════════════════
  const generarContenidoCompleto = async () => {
    if (!temaInicial.trim()) return;

    setGenerandoCompleto(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/estudio/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: temaInicial,
          categoria: contenido.categoria,
          tipo: contenido.tipo,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContenido(prev => ({
          ...prev,
          titulo: data.titulo || prev.titulo,
          extracto: data.extracto || '',
          secciones: data.secciones || prev.secciones,
        }));
      } else {
        setError(data.error || 'Error al generar contenido');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerandoCompleto(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // REGENERAR SECCIÓN
  // ═══════════════════════════════════════════════════════════════
  const regenerarSeccion = async (seccionId, instruccion = '') => {
    setLoading(prev => ({ ...prev, [seccionId]: true }));
    setError(null);

    try {
      const seccion = contenido.secciones.find(s => s.id === seccionId);

      const response = await fetch('/api/admin/estudio/regenerar-seccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seccionId,
          seccionNombre: seccion.nombre,
          contenidoActual: seccion.contenido,
          contexto: {
            titulo: contenido.titulo,
            categoria: contenido.categoria,
            tipo: contenido.tipo,
            otrasSecciones: contenido.secciones.filter(s => s.id !== seccionId).map(s => s.contenido).join('\n\n'),
          },
          instruccion,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContenido(prev => ({
          ...prev,
          secciones: prev.secciones.map(s =>
            s.id === seccionId ? { ...s, contenido: data.contenido } : s
          ),
        }));
        setPanelInstrucciones(null);
        setInstruccionPersonalizada('');
      } else {
        setError(data.error || 'Error al regenerar sección');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, [seccionId]: false }));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAR TÍTULO
  // ═══════════════════════════════════════════════════════════════
  const regenerarTitulo = async () => {
    setLoading(prev => ({ ...prev, titulo: true }));

    try {
      const response = await fetch('/api/admin/estudio/regenerar-titulo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tituloActual: contenido.titulo,
          contenido: contenido.secciones.map(s => s.contenido).join('\n\n'),
          categoria: contenido.categoria,
          tipo: contenido.tipo,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setContenido(prev => ({ ...prev, titulo: data.titulo }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, titulo: false }));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAR IMAGEN
  // ═══════════════════════════════════════════════════════════════
  const generarImagen = async () => {
    setLoading(prev => ({ ...prev, imagen: true }));
    setError(null);

    try {
      const response = await fetch('/api/admin/estudio/generar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: contenido.titulo,
          extracto: contenido.extracto || contenido.secciones[0]?.contenido?.substring(0, 200),
          categoria: contenido.categoria,
          tipo: contenido.tipo,
        }),
      });

      const data = await response.json();

      if (data.success && data.imagen) {
        setContenido(prev => ({ ...prev, imagen: data.imagen }));
      } else {
        setError(data.error || 'Error al generar imagen');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, imagen: false }));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAR AUDIO CORTO PARA SECCIÓN
  // ═══════════════════════════════════════════════════════════════
  const generarAudio = async (seccionId) => {
    setLoading(prev => ({ ...prev, [`audio-${seccionId}`]: true }));

    try {
      const seccion = contenido.secciones.find(s => s.id === seccionId);
      // Tomar solo los primeros 300 caracteres para audio corto (10-20 seg)
      const textoCorto = seccion.contenido.substring(0, 300).split('.').slice(0, 2).join('.') + '.';

      const response = await fetch('/api/admin/voz/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: textoCorto,
          vozId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - voz cálida
          proposito: 'preview',
        }),
      });

      const data = await response.json();

      if (data.success && data.audio) {
        setContenido(prev => ({
          ...prev,
          secciones: prev.secciones.map(s =>
            s.id === seccionId ? { ...s, audio: data.audio, mostrarAudio: true } : s
          ),
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, [`audio-${seccionId}`]: false }));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GUARDAR CONTENIDO
  // ═══════════════════════════════════════════════════════════════
  const guardarContenido = async (publicar = false) => {
    setLoading(prev => ({ ...prev, guardar: true }));
    setError(null);

    try {
      // Combinar secciones en contenido completo
      const contenidoCompleto = contenido.secciones
        .filter(s => s.contenido.trim())
        .map(s => `## ${s.nombre}\n\n${s.contenido}`)
        .join('\n\n---\n\n');

      const response = await fetch('/api/circulo/contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: contenido.titulo,
          contenido: contenidoCompleto,
          extracto: contenido.extracto || contenido.secciones[0]?.contenido?.substring(0, 200),
          categoria: contenido.categoria,
          tipo: contenido.tipo,
          imagen: contenido.imagen,
          autor: contenido.autor,
          publicado: publicar,
          secciones: contenido.secciones, // Guardar estructura para edición futura
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
      } else {
        setError(data.error || 'Error al guardar');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, guardar: false }));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ACTUALIZAR SECCIÓN
  // ═══════════════════════════════════════════════════════════════
  const actualizarSeccion = (seccionId, campo, valor) => {
    setContenido(prev => ({
      ...prev,
      secciones: prev.secciones.map(s =>
        s.id === seccionId ? { ...s, [campo]: valor } : s
      ),
    }));
  };

  const categoria = CATEGORIAS.find(c => c.id === contenido.categoria) || CATEGORIAS[0];

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: COLORS.bgCard,
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/admin" style={{
            color: COLORS.textMuted,
            textDecoration: 'none',
            fontSize: '14px',
          }}>← Admin</a>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.pink})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Estudio de Contenido
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Toggle Preview */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              padding: '10px 16px',
              background: showPreview ? `${COLORS.primary}22` : COLORS.bgElevated,
              border: `1px solid ${showPreview ? COLORS.primary : COLORS.border}`,
              borderRadius: '8px',
              color: showPreview ? COLORS.primary : COLORS.textMuted,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {showPreview ? '👁️ Preview ON' : '👁️ Preview OFF'}
          </button>

          {/* Guardar borrador */}
          <button
            onClick={() => guardarContenido(false)}
            disabled={loading.guardar || !contenido.titulo}
            style={{
              padding: '10px 20px',
              background: COLORS.bgElevated,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              color: COLORS.text,
              cursor: 'pointer',
              fontSize: '14px',
              opacity: loading.guardar || !contenido.titulo ? 0.5 : 1,
            }}
          >
            {loading.guardar ? '...' : '💾 Guardar borrador'}
          </button>

          {/* Publicar */}
          <button
            onClick={() => guardarContenido(true)}
            disabled={loading.guardar || !contenido.titulo}
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.cyan})`,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: loading.guardar || !contenido.titulo ? 0.5 : 1,
            }}
          >
            {loading.guardar ? '...' : '🚀 Publicar'}
          </button>
        </div>
      </div>

      {/* Notificaciones */}
      {error && (
        <div style={{
          padding: '12px 24px',
          background: `${COLORS.error}22`,
          borderBottom: `1px solid ${COLORS.error}`,
          color: COLORS.error,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          ⚠️ {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: COLORS.error, cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {guardado && (
        <div style={{
          padding: '12px 24px',
          background: `${COLORS.success}22`,
          borderBottom: `1px solid ${COLORS.success}`,
          color: COLORS.success,
        }}>
          ✅ Contenido guardado exitosamente
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr',
        gap: '0',
        height: 'calc(100vh - 65px)',
      }}>
        {/* ═══ PANEL DE EDICIÓN ═══ */}
        <div style={{
          overflowY: 'auto',
          padding: '24px',
          borderRight: showPreview ? `1px solid ${COLORS.border}` : 'none',
        }}>
          {/* Generación inicial */}
          {!contenido.titulo && (
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.pink}15)`,
              border: `1px solid ${COLORS.primary}40`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}>
              <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>✨</span> Crear nuevo contenido
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.textMuted, fontSize: '13px' }}>Categoría</label>
                  <select
                    value={contenido.categoria}
                    onChange={(e) => setContenido(prev => ({ ...prev, categoria: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: COLORS.bgElevated,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '8px',
                      color: COLORS.text,
                      fontSize: '14px',
                    }}
                  >
                    {CATEGORIAS.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icono} {cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: COLORS.textMuted, fontSize: '13px' }}>Tipo</label>
                  <select
                    value={contenido.tipo}
                    onChange={(e) => setContenido(prev => ({ ...prev, tipo: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: COLORS.bgElevated,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '8px',
                      color: COLORS.text,
                      fontSize: '14px',
                    }}
                  >
                    {TIPOS.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.icono} {tipo.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: COLORS.textMuted, fontSize: '13px' }}>¿Sobre qué querés escribir?</label>
                <textarea
                  value={temaInicial}
                  onChange={(e) => setTemaInicial(e.target.value)}
                  placeholder="Ej: Ritual de luna nueva para manifestar abundancia, incluyendo materiales simples y pasos prácticos..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: COLORS.bgElevated,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    color: COLORS.text,
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                onClick={generarContenidoCompleto}
                disabled={generandoCompleto || !temaInicial.trim()}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: generandoCompleto ? COLORS.bgElevated : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.pink})`,
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: generandoCompleto ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                {generandoCompleto ? (
                  <>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Generando contenido...
                  </>
                ) : (
                  <>✨ Generar contenido completo</>
                )}
              </button>
            </div>
          )}

          {/* Editor de título */}
          {contenido.titulo && (
            <>
              <div style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ color: COLORS.textMuted, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Título
                  </label>
                  <button
                    onClick={regenerarTitulo}
                    disabled={loading.titulo}
                    style={{
                      padding: '6px 12px',
                      background: COLORS.bgElevated,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '6px',
                      color: COLORS.textMuted,
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {loading.titulo ? '...' : '🔄 Regenerar'}
                  </button>
                </div>
                <input
                  type="text"
                  value={contenido.titulo}
                  onChange={(e) => setContenido(prev => ({ ...prev, titulo: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: COLORS.bgElevated,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    color: COLORS.text,
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                />
              </div>

              {/* Imagen/Banner */}
              <div style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ color: COLORS.textMuted, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Imagen / Banner
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {contenido.imagen && (
                      <button
                        onClick={() => setContenido(prev => ({ ...prev, imagen: null }))}
                        style={{
                          padding: '6px 12px',
                          background: `${COLORS.error}22`,
                          border: `1px solid ${COLORS.error}`,
                          borderRadius: '6px',
                          color: COLORS.error,
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        🗑️ Quitar
                      </button>
                    )}
                    <button
                      onClick={generarImagen}
                      disabled={loading.imagen}
                      style={{
                        padding: '6px 12px',
                        background: `${COLORS.orange}22`,
                        border: `1px solid ${COLORS.orange}`,
                        borderRadius: '6px',
                        color: COLORS.orange,
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      {loading.imagen ? '...' : contenido.imagen ? '🔄 Regenerar' : '🎨 Generar con IA'}
                    </button>
                  </div>
                </div>

                {contenido.imagen ? (
                  <div style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    background: COLORS.bgElevated,
                  }}>
                    <img
                      src={contenido.imagen}
                      alt="Banner"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    borderRadius: '8px',
                    aspectRatio: '16/9',
                    background: COLORS.bgElevated,
                    border: `2px dashed ${COLORS.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: COLORS.textDim,
                  }}>
                    {loading.imagen ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          border: '3px solid rgba(255,255,255,0.1)',
                          borderTopColor: COLORS.orange,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          margin: '0 auto 12px',
                        }} />
                        <p>Generando imagen con DALL-E...</p>
                      </div>
                    ) : (
                      <p>Click en "Generar con IA" para crear una imagen</p>
                    )}
                  </div>
                )}
              </div>

              {/* Secciones editables */}
              {contenido.secciones.map((seccion, idx) => (
                <div
                  key={seccion.id}
                  style={{
                    background: COLORS.bgCard,
                    border: `1px solid ${seccionActiva === seccion.id ? COLORS.primary : COLORS.border}`,
                    borderRadius: '12px',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* Header de sección */}
                  <div style={{
                    padding: '16px 20px',
                    background: seccionActiva === seccion.id ? `${COLORS.primary}15` : COLORS.bgElevated,
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        background: COLORS.bgCard,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        color: COLORS.textMuted,
                      }}>
                        {idx + 1}
                      </span>
                      <input
                        value={seccion.nombre}
                        onChange={(e) => actualizarSeccion(seccion.id, 'nombre', e.target.value)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: COLORS.text,
                          fontSize: '15px',
                          fontWeight: '600',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* Toggle Audio */}
                      <button
                        onClick={() => actualizarSeccion(seccion.id, 'mostrarAudio', !seccion.mostrarAudio)}
                        style={{
                          padding: '6px 10px',
                          background: seccion.mostrarAudio ? `${COLORS.cyan}22` : COLORS.bgCard,
                          border: `1px solid ${seccion.mostrarAudio ? COLORS.cyan : COLORS.border}`,
                          borderRadius: '6px',
                          color: seccion.mostrarAudio ? COLORS.cyan : COLORS.textMuted,
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                        title="Activar/desactivar audio para esta sección"
                      >
                        🎙️ Audio
                      </button>

                      {/* Regenerar */}
                      <button
                        onClick={() => setPanelInstrucciones(panelInstrucciones === seccion.id ? null : seccion.id)}
                        style={{
                          padding: '6px 10px',
                          background: panelInstrucciones === seccion.id ? `${COLORS.primary}22` : COLORS.bgCard,
                          border: `1px solid ${panelInstrucciones === seccion.id ? COLORS.primary : COLORS.border}`,
                          borderRadius: '6px',
                          color: panelInstrucciones === seccion.id ? COLORS.primary : COLORS.textMuted,
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        🔄 Regenerar
                      </button>
                    </div>
                  </div>

                  {/* Panel de instrucciones de regeneración */}
                  {panelInstrucciones === seccion.id && (
                    <div style={{
                      padding: '16px 20px',
                      background: `${COLORS.primary}08`,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}>
                      <p style={{ color: COLORS.textMuted, fontSize: '13px', marginBottom: '12px' }}>
                        Instrucciones rápidas:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {INSTRUCCIONES_RAPIDAS.map(instr => (
                          <button
                            key={instr.label}
                            onClick={() => regenerarSeccion(seccion.id, instr.instruccion)}
                            disabled={loading[seccion.id]}
                            style={{
                              padding: '6px 12px',
                              background: COLORS.bgCard,
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: '20px',
                              color: COLORS.text,
                              cursor: 'pointer',
                              fontSize: '12px',
                              transition: 'all 0.2s',
                            }}
                          >
                            {instr.label}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={instruccionPersonalizada}
                          onChange={(e) => setInstruccionPersonalizada(e.target.value)}
                          placeholder="O escribí tu propia instrucción..."
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            background: COLORS.bgElevated,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: '8px',
                            color: COLORS.text,
                            fontSize: '14px',
                          }}
                        />
                        <button
                          onClick={() => regenerarSeccion(seccion.id, instruccionPersonalizada)}
                          disabled={loading[seccion.id] || !instruccionPersonalizada.trim()}
                          style={{
                            padding: '10px 16px',
                            background: COLORS.primary,
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          {loading[seccion.id] ? '...' : 'Aplicar'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Textarea de contenido */}
                  <div style={{ padding: '16px 20px' }}>
                    <textarea
                      value={seccion.contenido}
                      onChange={(e) => actualizarSeccion(seccion.id, 'contenido', e.target.value)}
                      onFocus={() => setSeccionActiva(seccion.id)}
                      onBlur={() => setSeccionActiva(null)}
                      placeholder={`Contenido de ${seccion.nombre}...`}
                      rows={8}
                      style={{
                        width: '100%',
                        padding: '0',
                        background: 'transparent',
                        border: 'none',
                        color: COLORS.text,
                        fontSize: '15px',
                        lineHeight: '1.7',
                        resize: 'vertical',
                        outline: 'none',
                      }}
                    />

                    {/* Audio section */}
                    {seccion.mostrarAudio && (
                      <div style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: `1px solid ${COLORS.border}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ color: COLORS.textMuted, fontSize: '13px' }}>
                            🎙️ Audio corto (10-20 seg)
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {seccion.audio && (
                              <button
                                onClick={() => actualizarSeccion(seccion.id, 'audio', null)}
                                style={{
                                  padding: '4px 10px',
                                  background: `${COLORS.error}22`,
                                  border: `1px solid ${COLORS.error}`,
                                  borderRadius: '6px',
                                  color: COLORS.error,
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                }}
                              >
                                🗑️ Quitar
                              </button>
                            )}
                            <button
                              onClick={() => generarAudio(seccion.id)}
                              disabled={loading[`audio-${seccion.id}`]}
                              style={{
                                padding: '4px 10px',
                                background: `${COLORS.cyan}22`,
                                border: `1px solid ${COLORS.cyan}`,
                                borderRadius: '6px',
                                color: COLORS.cyan,
                                cursor: 'pointer',
                                fontSize: '11px',
                              }}
                            >
                              {loading[`audio-${seccion.id}`] ? '...' : seccion.audio ? '🔄 Regenerar' : '🎙️ Generar'}
                            </button>
                          </div>
                        </div>

                        {seccion.audio ? (
                          <audio
                            controls
                            src={`data:audio/mp3;base64,${seccion.audio}`}
                            style={{ width: '100%', height: '40px' }}
                          />
                        ) : (
                          <div style={{
                            padding: '20px',
                            background: COLORS.bgElevated,
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: COLORS.textDim,
                            fontSize: '13px',
                          }}>
                            {loading[`audio-${seccion.id}`] ? 'Generando audio...' : 'Click en "Generar" para crear audio'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Agregar nueva sección */}
              <button
                onClick={() => {
                  const newId = `seccion-${Date.now()}`;
                  setContenido(prev => ({
                    ...prev,
                    secciones: [...prev.secciones, {
                      id: newId,
                      nombre: 'Nueva sección',
                      contenido: '',
                      audio: null,
                      mostrarAudio: false,
                    }],
                  }));
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: COLORS.bgElevated,
                  border: `2px dashed ${COLORS.border}`,
                  borderRadius: '12px',
                  color: COLORS.textMuted,
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}
              >
                + Agregar sección
              </button>
            </>
          )}
        </div>

        {/* ═══ PANEL DE PREVIEW ═══ */}
        {showPreview && (
          <div style={{
            overflowY: 'auto',
            background: '#f8f5f0', // Fondo claro tipo papel
            padding: '0',
          }}>
            {/* Selector de dispositivo */}
            <div style={{
              padding: '12px 20px',
              background: '#fff',
              borderBottom: '1px solid #e5e0d8',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              {[
                { id: 'desktop', icono: '🖥️', width: '100%' },
                { id: 'tablet', icono: '📱', width: '768px' },
                { id: 'mobile', icono: '📱', width: '375px' },
              ].map(device => (
                <button
                  key={device.id}
                  onClick={() => setPreviewMode(device.id)}
                  style={{
                    padding: '8px 16px',
                    background: previewMode === device.id ? '#1a1a25' : '#fff',
                    border: '1px solid #e5e0d8',
                    borderRadius: '6px',
                    color: previewMode === device.id ? '#fff' : '#666',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {device.icono} {device.id}
                </button>
              ))}
            </div>

            {/* Preview container */}
            <div style={{
              maxWidth: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
              margin: '0 auto',
              padding: previewMode === 'mobile' ? '0' : '24px',
              transition: 'max-width 0.3s',
            }}>
              {contenido.titulo ? (
                <article style={{
                  background: '#fff',
                  borderRadius: previewMode === 'mobile' ? '0' : '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}>
                  {/* Imagen banner */}
                  {contenido.imagen && (
                    <div style={{
                      aspectRatio: '16/9',
                      background: '#eee',
                      position: 'relative',
                    }}>
                      <img
                        src={contenido.imagen}
                        alt={contenido.titulo}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        display: 'flex',
                        gap: '8px',
                      }}>
                        <span style={{
                          background: categoria.color,
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {categoria.icono} {categoria.nombre}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contenido */}
                  <div style={{ padding: previewMode === 'mobile' ? '20px' : '32px' }}>
                    {/* Categoría si no hay imagen */}
                    {!contenido.imagen && (
                      <span style={{
                        display: 'inline-block',
                        background: `${categoria.color}15`,
                        color: categoria.color,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '16px',
                      }}>
                        {categoria.icono} {categoria.nombre}
                      </span>
                    )}

                    {/* Título */}
                    <h1 style={{
                      fontSize: previewMode === 'mobile' ? '24px' : '32px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      lineHeight: '1.3',
                      marginBottom: '16px',
                      fontFamily: 'Georgia, serif',
                    }}>
                      {contenido.titulo}
                    </h1>

                    {/* Autor y fecha */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      paddingBottom: '24px',
                      borderBottom: '1px solid #eee',
                      marginBottom: '24px',
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.pink})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '18px',
                      }}>
                        🧙
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{contenido.autor}</div>
                        <div style={{ color: '#888', fontSize: '13px' }}>
                          {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Secciones */}
                    {contenido.secciones.map((seccion, idx) => (
                      seccion.contenido && (
                        <div key={seccion.id} style={{ marginBottom: '32px' }}>
                          <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1a1a1a',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}>
                            <span style={{
                              width: '32px',
                              height: '32px',
                              background: `${categoria.color}15`,
                              color: categoria.color,
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                            }}>
                              {idx + 1}
                            </span>
                            {seccion.nombre}
                          </h2>

                          <div style={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                            color: '#444',
                            whiteSpace: 'pre-wrap',
                          }}>
                            {seccion.contenido}
                          </div>

                          {seccion.mostrarAudio && seccion.audio && (
                            <div style={{
                              marginTop: '16px',
                              padding: '16px',
                              background: '#f8f5f0',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                            }}>
                              <span style={{ fontSize: '24px' }}>🎙️</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
                                  Escuchá esta sección
                                </div>
                                <audio
                                  controls
                                  src={`data:audio/mp3;base64,${seccion.audio}`}
                                  style={{ width: '100%', height: '32px' }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                </article>
              ) : (
                <div style={{
                  padding: '60px 40px',
                  textAlign: 'center',
                  color: '#888',
                }}>
                  <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📝</span>
                  <p>El preview aparecerá aquí cuando generes contenido</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: ${COLORS.border};
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
