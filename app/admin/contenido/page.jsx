'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════
// COLORES (coincide con layout)
// ═══════════════════════════════════════════════════════════════
const C = {
  gold: '#C6A962',
  goldDark: '#A68B4B',
  bg: '#0a0a0a',
  bgCard: '#111111',
  bgHover: '#1a1a1a',
  border: '#222',
  text: '#fff',
  textMuted: '#888',
  textDim: '#555',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
};

const GLASS = {
  background: 'rgba(17,17,17,0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.05)',
};

// ═══════════════════════════════════════════════════════════════
// PLANTILLAS PREDISEÑADAS
// ═══════════════════════════════════════════════════════════════
const PLANTILLAS = [
  {
    id: 'ritual-luna',
    nombre: 'Ritual de Luna',
    icono: '🌙',
    categoria: 'cosmos',
    tipo: 'ritual',
    estructura: ['Introducción mística', 'Materiales necesarios', 'Preparación del espacio', 'Pasos del ritual', 'Mensaje de cierre', 'Variaciones según fase lunar'],
    palabras: 2500,
    color: '#8b5cf6'
  },
  {
    id: 'guia-cristal',
    nombre: 'Guía de Cristal',
    icono: '💎',
    categoria: 'sanacion',
    tipo: 'guia',
    estructura: ['Descripción del cristal', 'Propiedades energéticas', 'Chakras asociados', 'Cómo usarlo', 'Cómo limpiarlo', 'Meditación con el cristal'],
    palabras: 2000,
    color: '#3b82f6'
  },
  {
    id: 'sabbat-completo',
    nombre: 'Guía de Sabbat',
    icono: '🔥',
    categoria: 'celebraciones',
    tipo: 'articulo',
    estructura: ['Historia y significado', 'Energía del sabbat', 'Altar y decoración', 'Ritual principal', 'Recetas tradicionales', 'Actividades mágicas'],
    palabras: 4000,
    color: '#f59e0b'
  },
  {
    id: 'meditacion-guiada',
    nombre: 'Meditación Guiada',
    icono: '🧘',
    categoria: 'sanacion',
    tipo: 'meditacion',
    estructura: ['Preparación', 'Respiración inicial', 'Visualización detallada', 'Encuentro con guía/guardián', 'Mensaje recibido', 'Regreso suave'],
    palabras: 1500,
    color: '#22c55e'
  },
  {
    id: 'diy-altar',
    nombre: 'DIY Mágico',
    icono: '✂️',
    categoria: 'diy',
    tipo: 'diy',
    estructura: ['Materiales', 'Herramientas', 'Paso a paso con fotos', 'Consagración', 'Variaciones creativas', 'Tips de uso'],
    palabras: 2000,
    color: '#ec4899'
  },
  {
    id: 'lectura-colectiva',
    nombre: 'Lectura del Mes',
    icono: '🔮',
    categoria: 'esoterico',
    tipo: 'lectura',
    estructura: ['Energía general del mes', 'Mensaje para cada elemento', 'Carta/runa destacada', 'Ritual recomendado', 'Afirmación del mes'],
    palabras: 1800,
    color: '#6366f1'
  },
  {
    id: 'conexion-guardian',
    nombre: 'Conexión con Guardián',
    icono: '🧙',
    categoria: 'duendes',
    tipo: 'ritual',
    estructura: ['Sobre tu guardián', 'Preparación del espacio', 'Invocación', 'Meditación de conexión', 'Señales y mensajes', 'Agradecimiento'],
    palabras: 2500,
    color: '#84cc16'
  },
  {
    id: 'post-redes',
    nombre: 'Post para Redes',
    icono: '📱',
    categoria: 'marketing',
    tipo: 'post',
    estructura: ['Hook inicial', 'Contenido de valor', 'Call to action', 'Hashtags sugeridos'],
    palabras: 300,
    color: '#f43f5e'
  }
];

const CATEGORIAS = [
  { id: 'cosmos', nombre: 'Cosmos y Luna', icono: '🌙' },
  { id: 'duendes', nombre: 'Mundo Duende', icono: '🧙' },
  { id: 'diy', nombre: 'DIY Mágico', icono: '✂️' },
  { id: 'esoterico', nombre: 'Esotérico', icono: '🔮' },
  { id: 'sanacion', nombre: 'Sanación', icono: '💚' },
  { id: 'celebraciones', nombre: 'Celebraciones', icono: '🎉' },
  { id: 'marketing', nombre: 'Redes Sociales', icono: '📱' }
];

// ═══════════════════════════════════════════════════════════════
// ESTILOS DE IMAGEN (para DALL-E)
// ═══════════════════════════════════════════════════════════════
const ESTILOS_IMAGEN = [
  {
    id: 'duendes-magico',
    nombre: 'Estilo Duendes',
    prompt: 'mystical whimsical art style, magical forest atmosphere, soft golden lighting, enchanted woodland creatures, fairy tale aesthetic, hand-crafted artisan feel, warm earth tones with gold accents, ethereal glow, Uruguay mystical folklore inspired'
  },
  {
    id: 'celestial',
    nombre: 'Celestial/Cosmos',
    prompt: 'celestial mystical art, moon phases, starry night sky, cosmic energy, sacred geometry, deep purple and gold colors, ethereal luminescent, astrology aesthetic'
  },
  {
    id: 'botanico',
    nombre: 'Botánico Mágico',
    prompt: 'magical botanical illustration, herbs and flowers, witchy garden aesthetic, pressed flower style, vintage botanical art with mystical twist, earth tones, handcrafted feel'
  },
  {
    id: 'cristales',
    nombre: 'Cristales y Minerales',
    prompt: 'crystal and gemstone art, luminescent minerals, chakra colors, healing stones aesthetic, geometric crystal formations, ethereal lighting, mystical mineral photography style'
  },
  {
    id: 'altar',
    nombre: 'Altar/Ritual',
    prompt: 'witchy altar aesthetic, candles and crystals, sacred objects, moody atmospheric lighting, ritual tools, pentacle and moon symbols, dark academia meets cottage witch'
  }
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function ContenidoPage() {
  const searchParams = useSearchParams();
  const nuevo = searchParams.get('nuevo');

  // Estados principales
  const [vista, setVista] = useState(nuevo ? 'crear' : 'lista'); // 'lista', 'crear', 'editar'
  const [paso, setPaso] = useState(1); // 1: plantilla, 2: detalles, 3: generar, 4: multimedia, 5: publicar

  // Estado del contenido actual
  const [plantilla, setPlantilla] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [contenido, setContenido] = useState('');
  const [palabras, setPalabras] = useState(2500);
  const [instruccionesExtra, setInstruccionesExtra] = useState('');

  // Estado multimedia
  const [imagen, setImagen] = useState(null);
  const [estiloImagen, setEstiloImagen] = useState(ESTILOS_IMAGEN[0]);
  const [promptImagen, setPromptImagen] = useState('');
  const [audio, setAudio] = useState(null);

  // Estado de publicación
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [publicarEn, setPublicarEn] = useState(['circulo']);

  // Estados de UI
  const [generando, setGenerando] = useState(false);
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const [generandoAudio, setGenerandoAudio] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Lista de contenidos
  const [contenidos, setContenidos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargandoLista, setCargandoLista] = useState(true);

  // ═══════════════════════════════════════════════════════════════
  // CARGAR LISTA DE CONTENIDOS
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (vista === 'lista') {
      cargarContenidos();
    }
  }, [vista, filtro]);

  const cargarContenidos = async () => {
    setCargandoLista(true);
    try {
      const res = await fetch(`/api/admin/contenido?filtro=${filtro}`);
      const data = await res.json();
      if (data.success) {
        setContenidos(data.contenidos || []);
      }
    } catch (e) {
      console.error('Error cargando contenidos:', e);
    }
    setCargandoLista(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAR CONTENIDO CON CLAUDE
  // ═══════════════════════════════════════════════════════════════
  const generarContenido = async () => {
    if (!tema.trim()) {
      setError('Ingresá un tema para generar contenido');
      return;
    }

    setGenerando(true);
    setError('');

    try {
      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantilla: plantilla?.id,
          categoria: plantilla?.categoria,
          tipo: plantilla?.tipo,
          tema,
          palabras,
          estructura: plantilla?.estructura,
          instruccionesExtra
        })
      });

      const data = await res.json();

      if (data.success) {
        setTitulo(data.titulo || tema);
        setContenido(data.contenido);
        setPaso(4); // Ir a multimedia
        setExito('¡Contenido generado! Ahora podés agregar imagen y audio.');
        setTimeout(() => setExito(''), 3000);
      } else {
        setError(data.error || 'Error generando contenido');
      }
    } catch (e) {
      setError('Error de conexión: ' + e.message);
    }

    setGenerando(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAR IMAGEN CON DALL-E
  // ═══════════════════════════════════════════════════════════════
  const generarImagen = async () => {
    setGenerandoImagen(true);
    setError('');

    try {
      const promptFinal = promptImagen ||
        `${titulo}, ${estiloImagen.prompt}, high quality, detailed, professional`;

      const res = await fetch('/api/admin/imagen/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptFinal,
          estilo: estiloImagen.id
        })
      });

      const data = await res.json();

      if (data.success) {
        setImagen(data.imagen);
        setExito('¡Imagen generada!');
        setTimeout(() => setExito(''), 3000);
      } else {
        setError(data.error || 'Error generando imagen');
      }
    } catch (e) {
      setError('Error de conexión: ' + e.message);
    }

    setGenerandoImagen(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAR AUDIO CON ELEVEN LABS (VOZ THIBISAY)
  // ═══════════════════════════════════════════════════════════════
  const generarAudio = async () => {
    if (!contenido) {
      setError('Primero generá el contenido de texto');
      return;
    }

    setGenerandoAudio(true);
    setError('');

    try {
      // Tomar solo los primeros 2000 caracteres para el audio
      const textoParaAudio = contenido.substring(0, 2000);

      const res = await fetch('/api/admin/voz/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: textoParaAudio,
          voz: 'thibisay'
        })
      });

      const data = await res.json();

      if (data.success) {
        setAudio(data.audio);
        setExito('¡Audio generado con voz de Thibisay!');
        setTimeout(() => setExito(''), 3000);
      } else {
        setError(data.error || 'Error generando audio');
      }
    } catch (e) {
      setError('Error de conexión: ' + e.message);
    }

    setGenerandoAudio(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // GUARDAR/PUBLICAR CONTENIDO
  // ═══════════════════════════════════════════════════════════════
  const guardarContenido = async (estado = 'borrador') => {
    setGuardando(true);
    setError('');

    try {
      const res = await fetch('/api/admin/contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          contenido,
          categoria: plantilla?.categoria,
          tipo: plantilla?.tipo,
          plantilla: plantilla?.id,
          imagen,
          audio,
          estado,
          fechaPublicacion: estado === 'programado' ? fechaPublicacion : null,
          publicarEn
        })
      });

      const data = await res.json();

      if (data.success) {
        setExito(estado === 'publicado' ? '¡Publicado exitosamente!' : '¡Guardado como borrador!');
        setTimeout(() => {
          setVista('lista');
          resetearFormulario();
        }, 2000);
      } else {
        setError(data.error || 'Error guardando contenido');
      }
    } catch (e) {
      setError('Error de conexión: ' + e.message);
    }

    setGuardando(false);
  };

  const resetearFormulario = () => {
    setPlantilla(null);
    setTitulo('');
    setTema('');
    setContenido('');
    setImagen(null);
    setAudio(null);
    setPaso(1);
    setError('');
    setExito('');
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER: LISTA DE CONTENIDOS
  // ═══════════════════════════════════════════════════════════════
  if (vista === 'lista') {
    return (
      <div>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}>
          <div>
            <h1 style={{ color: C.text, fontSize: 28, fontWeight: 700, margin: 0 }}>
              ✦ Centro de Contenido
            </h1>
            <p style={{ color: C.textMuted, margin: '8px 0 0' }}>
              Crea contenido mágico con IA para el Círculo
            </p>
          </div>
          <button
            onClick={() => { setVista('crear'); setPaso(1); }}
            style={{
              padding: '14px 28px',
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
              border: 'none',
              borderRadius: 12,
              color: '#000',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>✦</span> Crear Contenido
          </button>
        </div>

        {/* Filtros */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          {['todos', 'borrador', 'programado', 'publicado'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '8px 16px',
                background: filtro === f ? `${C.gold}22` : C.bgCard,
                border: `1px solid ${filtro === f ? C.gold : C.border}`,
                borderRadius: 8,
                color: filtro === f ? C.gold : C.textMuted,
                fontSize: 13,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lista */}
        {cargandoLista ? (
          <div style={{ textAlign: 'center', padding: 60, color: C.textMuted }}>
            <div style={{
              width: 40, height: 40,
              border: `3px solid ${C.border}`,
              borderTopColor: C.gold,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            Cargando contenidos...
          </div>
        ) : contenidos.length === 0 ? (
          <div style={{
            ...GLASS,
            borderRadius: 16,
            padding: 60,
            textAlign: 'center'
          }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>✦</span>
            <h3 style={{ color: C.text, marginBottom: 8 }}>No hay contenidos</h3>
            <p style={{ color: C.textMuted, marginBottom: 24 }}>
              Creá tu primer contenido mágico con ayuda de IA
            </p>
            <button
              onClick={() => { setVista('crear'); setPaso(1); }}
              style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                border: 'none',
                borderRadius: 10,
                color: '#000',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Crear Contenido
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16
          }}>
            {contenidos.map((c) => (
              <div
                key={c.id}
                style={{
                  ...GLASS,
                  borderRadius: 16,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onClick={() => {/* TODO: editar contenido */}}
              >
                {c.imagen && (
                  <img
                    src={c.imagen}
                    alt={c.titulo}
                    style={{ width: '100%', height: 160, objectFit: 'cover' }}
                  />
                )}
                <div style={{ padding: 16 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      background: c.estado === 'publicado' ? `${C.success}22` :
                                  c.estado === 'programado' ? `${C.info}22` : `${C.textMuted}22`,
                      color: c.estado === 'publicado' ? C.success :
                             c.estado === 'programado' ? C.info : C.textMuted,
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {c.estado}
                    </span>
                    <span style={{ color: C.textDim, fontSize: 12 }}>
                      {CATEGORIAS.find(cat => cat.id === c.categoria)?.icono} {c.categoria}
                    </span>
                  </div>
                  <h3 style={{
                    color: C.text,
                    fontSize: 16,
                    fontWeight: 600,
                    margin: '0 0 8px',
                    lineHeight: 1.3
                  }}>
                    {c.titulo}
                  </h3>
                  <p style={{
                    color: C.textMuted,
                    fontSize: 13,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {c.contenido?.substring(0, 100)}...
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 12
                  }}>
                    {c.imagen && <span style={{ fontSize: 16 }}>🖼️</span>}
                    {c.audio && <span style={{ fontSize: 16 }}>🔊</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: CREAR CONTENIDO
  // ═══════════════════════════════════════════════════════════════
  return (
    <div>
      {/* Header con pasos */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <button
            onClick={() => { setVista('lista'); resetearFormulario(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: C.textMuted,
              cursor: 'pointer',
              fontSize: 14,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            ← Volver a lista
          </button>
          <h1 style={{ color: C.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
            ✦ Crear Contenido Épico
          </h1>
        </div>

        {/* Indicador de pasos */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5].map((p) => (
            <div
              key={p}
              style={{
                width: 32,
                height: 6,
                borderRadius: 3,
                background: p <= paso ? C.gold : C.border,
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div style={{
          padding: 16,
          background: `${C.error}15`,
          border: `1px solid ${C.error}`,
          borderRadius: 12,
          color: C.error,
          marginBottom: 24
        }}>
          {error}
        </div>
      )}
      {exito && (
        <div style={{
          padding: 16,
          background: `${C.success}15`,
          border: `1px solid ${C.success}`,
          borderRadius: 12,
          color: C.success,
          marginBottom: 24
        }}>
          {exito}
        </div>
      )}

      {/* ═══ PASO 1: ELEGIR PLANTILLA ═══ */}
      {paso === 1 && (
        <div>
          <h2 style={{ color: C.text, fontSize: 18, marginBottom: 20 }}>
            1. Elegí una plantilla
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16
          }}>
            {PLANTILLAS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPlantilla(p); setPalabras(p.palabras); setPaso(2); }}
                style={{
                  ...GLASS,
                  padding: 20,
                  borderRadius: 16,
                  border: `2px solid ${plantilla?.id === p.id ? p.color : 'transparent'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>{p.icono}</span>
                <h3 style={{ color: C.text, fontSize: 16, margin: '0 0 4px' }}>{p.nombre}</h3>
                <p style={{ color: C.textMuted, fontSize: 12, margin: '0 0 8px' }}>
                  ~{p.palabras} palabras
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {p.estructura.slice(0, 3).map((s, i) => (
                    <span key={i} style={{
                      padding: '2px 6px',
                      background: `${p.color}22`,
                      color: p.color,
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {s}
                    </span>
                  ))}
                  {p.estructura.length > 3 && (
                    <span style={{
                      padding: '2px 6px',
                      background: C.bgHover,
                      color: C.textMuted,
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      +{p.estructura.length - 3}
                    </span>
                  )}
                </div>
              </button>
            ))}

            {/* Opción personalizada */}
            <button
              onClick={() => {
                setPlantilla({
                  id: 'custom',
                  nombre: 'Personalizado',
                  icono: '✨',
                  categoria: 'cosmos',
                  tipo: 'articulo',
                  estructura: [],
                  palabras: 2500,
                  color: C.gold
                });
                setPaso(2);
              }}
              style={{
                ...GLASS,
                padding: 20,
                borderRadius: 16,
                border: `2px dashed ${C.border}`,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>✨</span>
              <h3 style={{ color: C.text, fontSize: 16, margin: '0 0 4px' }}>Personalizado</h3>
              <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>
                Definí tu propia estructura
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ═══ PASO 2: DETALLES ═══ */}
      {paso === 2 && plantilla && (
        <div>
          <h2 style={{ color: C.text, fontSize: 18, marginBottom: 20 }}>
            2. Detalles del contenido
          </h2>
          <div style={{
            ...GLASS,
            borderRadius: 16,
            padding: 24
          }}>
            {/* Plantilla seleccionada */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
              padding: 16,
              background: `${plantilla.color}11`,
              borderRadius: 12
            }}>
              <span style={{ fontSize: 28 }}>{plantilla.icono}</span>
              <div>
                <strong style={{ color: C.text }}>{plantilla.nombre}</strong>
                <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>
                  {plantilla.estructura.join(' → ')}
                </p>
              </div>
              <button
                onClick={() => setPaso(1)}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: C.textMuted,
                  cursor: 'pointer',
                  fontSize: 12
                }}
              >
                Cambiar
              </button>
            </div>

            {/* Tema */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                ¿Sobre qué tema querés escribir? *
              </label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej: Ritual para luna llena en Acuario, Guía del cuarzo rosa..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: C.text,
                  fontSize: 15,
                  outline: 'none'
                }}
              />
            </div>

            {/* Categoría (si es custom) */}
            {plantilla.id === 'custom' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                  Categoría
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPlantilla({...plantilla, categoria: cat.id})}
                      style={{
                        padding: '8px 14px',
                        background: plantilla.categoria === cat.id ? `${C.gold}22` : C.bgCard,
                        border: `1px solid ${plantilla.categoria === cat.id ? C.gold : C.border}`,
                        borderRadius: 8,
                        color: plantilla.categoria === cat.id ? C.gold : C.textMuted,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>{cat.icono}</span>
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Longitud */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                Extensión aproximada
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1000, 2000, 3000, 5000].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPalabras(p)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: palabras === p ? `${C.gold}22` : C.bgCard,
                      border: `1px solid ${palabras === p ? C.gold : C.border}`,
                      borderRadius: 8,
                      color: palabras === p ? C.gold : C.textMuted,
                      cursor: 'pointer'
                    }}
                  >
                    ~{p} palabras
                  </button>
                ))}
              </div>
            </div>

            {/* Instrucciones extra */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                Instrucciones adicionales (opcional)
              </label>
              <textarea
                value={instruccionesExtra}
                onChange={(e) => setInstruccionesExtra(e.target.value)}
                placeholder="Ej: Que mencione el cuarzo amatista, que incluya una visualización guiada, tono más serio..."
                style={{
                  width: '100%',
                  minHeight: 100,
                  padding: '14px 16px',
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: C.text,
                  fontSize: 14,
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setPaso(1)}
                style={{
                  padding: '14px 24px',
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: C.textMuted,
                  cursor: 'pointer'
                }}
              >
                Atrás
              </button>
              <button
                onClick={() => setPaso(3)}
                disabled={!tema.trim()}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: tema.trim() ? `linear-gradient(135deg, ${C.gold}, ${C.goldDark})` : C.bgHover,
                  border: 'none',
                  borderRadius: 10,
                  color: tema.trim() ? '#000' : C.textDim,
                  fontWeight: 600,
                  cursor: tema.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Continuar →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PASO 3: GENERAR CONTENIDO ═══ */}
      {paso === 3 && (
        <div>
          <h2 style={{ color: C.text, fontSize: 18, marginBottom: 20 }}>
            3. Generar contenido con IA
          </h2>
          <div style={{
            ...GLASS,
            borderRadius: 16,
            padding: 24
          }}>
            {/* Resumen */}
            <div style={{
              padding: 16,
              background: C.bgCard,
              borderRadius: 12,
              marginBottom: 24
            }}>
              <h3 style={{ color: C.gold, fontSize: 16, margin: '0 0 8px' }}>
                {plantilla?.icono} {plantilla?.nombre}: {tema}
              </h3>
              <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>
                Categoría: {plantilla?.categoria} • ~{palabras} palabras
              </p>
              {instruccionesExtra && (
                <p style={{ color: C.textDim, fontSize: 12, marginTop: 8 }}>
                  Extra: {instruccionesExtra}
                </p>
              )}
            </div>

            {contenido ? (
              <>
                {/* Vista previa del contenido */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}>
                    <label style={{ color: C.text, fontWeight: 500 }}>
                      Contenido generado
                    </label>
                    <span style={{ color: C.textMuted, fontSize: 12 }}>
                      {contenido.split(/\s+/).length} palabras
                    </span>
                  </div>
                  <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 400,
                      padding: 16,
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.text,
                      fontSize: 14,
                      lineHeight: 1.6,
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={generarContenido}
                    disabled={generando}
                    style={{
                      padding: '14px 24px',
                      background: 'transparent',
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.textMuted,
                      cursor: 'pointer'
                    }}
                  >
                    {generando ? 'Regenerando...' : '↻ Regenerar'}
                  </button>
                  <button
                    onClick={() => setPaso(4)}
                    style={{
                      flex: 1,
                      padding: '14px 24px',
                      background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                      border: 'none',
                      borderRadius: 10,
                      color: '#000',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Agregar Multimedia →
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ color: C.textMuted, marginBottom: 24, textAlign: 'center' }}>
                  Claude va a generar contenido de alta calidad basado en tu tema y la plantilla seleccionada.
                  <br />
                  <small>Esto puede tomar 30-60 segundos.</small>
                </p>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setPaso(2)}
                    style={{
                      padding: '14px 24px',
                      background: 'transparent',
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      color: C.textMuted,
                      cursor: 'pointer'
                    }}
                  >
                    Atrás
                  </button>
                  <button
                    onClick={generarContenido}
                    disabled={generando}
                    style={{
                      flex: 1,
                      padding: '14px 24px',
                      background: generando ? C.bgHover : `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                      border: 'none',
                      borderRadius: 10,
                      color: generando ? C.textMuted : '#000',
                      fontWeight: 600,
                      cursor: generando ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    {generando ? (
                      <>
                        <div style={{
                          width: 18, height: 18,
                          border: '2px solid transparent',
                          borderTopColor: C.textMuted,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Generando con Claude...
                      </>
                    ) : (
                      <>✨ Generar Contenido</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ PASO 4: MULTIMEDIA ═══ */}
      {paso === 4 && (
        <div>
          <h2 style={{ color: C.text, fontSize: 18, marginBottom: 20 }}>
            4. Agregar multimedia
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Imagen */}
            <div style={{
              ...GLASS,
              borderRadius: 16,
              padding: 24
            }}>
              <h3 style={{ color: C.text, fontSize: 16, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                🖼️ Imagen (DALL-E)
              </h3>

              {/* Estilo */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: C.textMuted, marginBottom: 8, fontSize: 13 }}>
                  Estilo visual
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ESTILOS_IMAGEN.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setEstiloImagen(e)}
                      style={{
                        padding: '6px 12px',
                        background: estiloImagen.id === e.id ? `${C.gold}22` : C.bgCard,
                        border: `1px solid ${estiloImagen.id === e.id ? C.gold : C.border}`,
                        borderRadius: 6,
                        color: estiloImagen.id === e.id ? C.gold : C.textMuted,
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                    >
                      {e.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt personalizado */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: C.textMuted, marginBottom: 8, fontSize: 13 }}>
                  Descripción de la imagen (opcional)
                </label>
                <input
                  type="text"
                  value={promptImagen}
                  onChange={(e) => setPromptImagen(e.target.value)}
                  placeholder={`Ej: ${titulo} con luna llena y cristales`}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.text,
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Preview imagen */}
              {imagen ? (
                <div style={{ marginBottom: 16 }}>
                  <img
                    src={imagen}
                    alt="Generada"
                    style={{ width: '100%', borderRadius: 12 }}
                  />
                </div>
              ) : (
                <div style={{
                  height: 200,
                  background: C.bgCard,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: C.textDim,
                  marginBottom: 16
                }}>
                  Vista previa de imagen
                </div>
              )}

              <button
                onClick={generarImagen}
                disabled={generandoImagen}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: generandoImagen ? C.bgHover : `${C.info}22`,
                  border: `1px solid ${C.info}`,
                  borderRadius: 10,
                  color: C.info,
                  cursor: generandoImagen ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                {generandoImagen ? (
                  <>
                    <div style={{
                      width: 16, height: 16,
                      border: '2px solid transparent',
                      borderTopColor: C.info,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Generando imagen...
                  </>
                ) : imagen ? '↻ Regenerar Imagen' : '🖼️ Generar Imagen'}
              </button>
            </div>

            {/* Audio */}
            <div style={{
              ...GLASS,
              borderRadius: 16,
              padding: 24
            }}>
              <h3 style={{ color: C.text, fontSize: 16, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                🔊 Audio (Voz Thibisay)
              </h3>

              <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 16 }}>
                Genera una versión de audio del contenido con la voz de Thibisay (Eleven Labs).
                <br />
                <small>Se usarán los primeros 2000 caracteres.</small>
              </p>

              {audio ? (
                <div style={{ marginBottom: 16 }}>
                  <audio
                    controls
                    src={`data:audio/mpeg;base64,${audio}`}
                    style={{ width: '100%' }}
                  />
                </div>
              ) : (
                <div style={{
                  height: 80,
                  background: C.bgCard,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: C.textDim,
                  marginBottom: 16
                }}>
                  Sin audio generado
                </div>
              )}

              <button
                onClick={generarAudio}
                disabled={generandoAudio || !contenido}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: generandoAudio || !contenido ? C.bgHover : `${C.purple}22`,
                  border: `1px solid ${C.purple}`,
                  borderRadius: 10,
                  color: !contenido ? C.textDim : C.purple,
                  cursor: generandoAudio || !contenido ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                {generandoAudio ? (
                  <>
                    <div style={{
                      width: 16, height: 16,
                      border: '2px solid transparent',
                      borderTopColor: C.purple,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Generando audio...
                  </>
                ) : audio ? '↻ Regenerar Audio' : '🔊 Generar Audio'}
              </button>
            </div>
          </div>

          {/* Botones navegación */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              onClick={() => setPaso(3)}
              style={{
                padding: '14px 24px',
                background: 'transparent',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                color: C.textMuted,
                cursor: 'pointer'
              }}
            >
              ← Editar Texto
            </button>
            <button
              onClick={() => setPaso(5)}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                border: 'none',
                borderRadius: 10,
                color: '#000',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Publicar →
            </button>
          </div>
        </div>
      )}

      {/* ═══ PASO 5: PUBLICAR ═══ */}
      {paso === 5 && (
        <div>
          <h2 style={{ color: C.text, fontSize: 18, marginBottom: 20 }}>
            5. Publicar contenido
          </h2>

          <div style={{
            ...GLASS,
            borderRadius: 16,
            padding: 24
          }}>
            {/* Vista previa final */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: imagen ? '200px 1fr' : '1fr',
              gap: 20,
              marginBottom: 24,
              padding: 16,
              background: C.bgCard,
              borderRadius: 12
            }}>
              {imagen && (
                <img
                  src={imagen}
                  alt={titulo}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              )}
              <div>
                <h3 style={{ color: C.text, margin: '0 0 8px' }}>{titulo}</h3>
                <p style={{ color: C.textMuted, fontSize: 13, margin: '0 0 8px' }}>
                  {plantilla?.icono} {plantilla?.categoria} • {contenido?.split(/\s+/).length} palabras
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {imagen && <span style={{ background: `${C.info}22`, color: C.info, padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>🖼️ Imagen</span>}
                  {audio && <span style={{ background: `${C.purple}22`, color: C.purple, padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>🔊 Audio</span>}
                </div>
              </div>
            </div>

            {/* Título editable */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.text,
                  fontSize: 15,
                  outline: 'none'
                }}
              />
            </div>

            {/* Dónde publicar */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                Publicar en
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'circulo', label: '☽ Círculo', desc: 'Solo miembros' },
                  { id: 'publico', label: '🌐 Blog público', desc: 'Visible para todos' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setPublicarEn(prev =>
                        prev.includes(opt.id)
                          ? prev.filter(p => p !== opt.id)
                          : [...prev, opt.id]
                      );
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: publicarEn.includes(opt.id) ? `${C.gold}22` : C.bgCard,
                      border: `1px solid ${publicarEn.includes(opt.id) ? C.gold : C.border}`,
                      borderRadius: 8,
                      color: publicarEn.includes(opt.id) ? C.gold : C.textMuted,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <strong style={{ display: 'block' }}>{opt.label}</strong>
                    <small>{opt.desc}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Programar */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: C.text, marginBottom: 8, fontWeight: 500 }}>
                Programar publicación (opcional)
              </label>
              <input
                type="datetime-local"
                value={fechaPublicacion}
                onChange={(e) => setFechaPublicacion(e.target.value)}
                style={{
                  padding: '12px 14px',
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.text,
                  fontSize: 14,
                  outline: 'none'
                }}
              />
            </div>

            {/* Botones finales */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setPaso(4)}
                style={{
                  padding: '14px 24px',
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: C.textMuted,
                  cursor: 'pointer'
                }}
              >
                ← Atrás
              </button>
              <button
                onClick={() => guardarContenido('borrador')}
                disabled={guardando}
                style={{
                  padding: '14px 24px',
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: C.text,
                  cursor: 'pointer'
                }}
              >
                💾 Guardar Borrador
              </button>
              <button
                onClick={() => guardarContenido(fechaPublicacion ? 'programado' : 'publicado')}
                disabled={guardando}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: `linear-gradient(135deg, ${C.success}, #16a34a)`,
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontWeight: 600,
                  cursor: guardando ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                {guardando ? (
                  <>
                    <div style={{
                      width: 18, height: 18,
                      border: '2px solid transparent',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Guardando...
                  </>
                ) : fechaPublicacion ? '📅 Programar' : '🚀 Publicar Ahora'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
