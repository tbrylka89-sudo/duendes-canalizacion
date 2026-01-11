'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════
// NUEVA PALETA DE COLORES VIBRANTE
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  // Fondos
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgElevated: '#1a1a25',
  bgHover: '#22222f',

  // Bordes
  border: '#2a2a3a',
  borderLight: '#3a3a4a',

  // Texto
  text: '#ffffff',
  textMuted: '#9ca3af',
  textDim: '#6b7280',

  // Colores principales (Contenido = Purple)
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  purpleDark: '#7C3AED',

  // Colores secundarios
  cyan: '#06B6D4',
  pink: '#EC4899',
  emerald: '#10B981',
  orange: '#F97316',
  rose: '#F43F5E',
  amber: '#F59E0B',
  blue: '#3B82F6',
  gold: '#D4A853',

  // Estados
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const GLASS = {
  background: 'rgba(18, 18, 26, 0.8)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${COLORS.border}`,
};

// ═══════════════════════════════════════════════════════════════
// PLANTILLAS PREDISEÑADAS CON NUEVOS COLORES
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
    color: COLORS.purple,
    gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)'
  },
  {
    id: 'guia-cristal',
    nombre: 'Guía de Cristal',
    icono: '💎',
    categoria: 'sanacion',
    tipo: 'guia',
    estructura: ['Descripción del cristal', 'Propiedades energéticas', 'Chakras asociados', 'Cómo usarlo', 'Cómo limpiarlo', 'Meditación con el cristal'],
    palabras: 2000,
    color: COLORS.cyan,
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)'
  },
  {
    id: 'sabbat-completo',
    nombre: 'Guía de Sabbat',
    icono: '🔥',
    categoria: 'celebraciones',
    tipo: 'articulo',
    estructura: ['Historia y significado', 'Energía del sabbat', 'Altar y decoración', 'Ritual principal', 'Recetas tradicionales', 'Actividades mágicas'],
    palabras: 4000,
    color: COLORS.orange,
    gradient: 'linear-gradient(135deg, #F97316, #EA580C)'
  },
  {
    id: 'meditacion-guiada',
    nombre: 'Meditación Guiada',
    icono: '🧘',
    categoria: 'sanacion',
    tipo: 'meditacion',
    estructura: ['Preparación', 'Respiración inicial', 'Visualización detallada', 'Encuentro con guía/guardián', 'Mensaje recibido', 'Regreso suave'],
    palabras: 1500,
    color: COLORS.emerald,
    gradient: 'linear-gradient(135deg, #10B981, #059669)'
  },
  {
    id: 'diy-altar',
    nombre: 'DIY Mágico',
    icono: '✂️',
    categoria: 'diy',
    tipo: 'diy',
    estructura: ['Materiales', 'Herramientas', 'Paso a paso con fotos', 'Consagración', 'Variaciones creativas', 'Tips de uso'],
    palabras: 2000,
    color: COLORS.pink,
    gradient: 'linear-gradient(135deg, #EC4899, #DB2777)'
  },
  {
    id: 'lectura-colectiva',
    nombre: 'Lectura del Mes',
    icono: '🔮',
    categoria: 'esoterico',
    tipo: 'lectura',
    estructura: ['Energía general del mes', 'Mensaje para cada elemento', 'Carta/runa destacada', 'Ritual recomendado', 'Afirmación del mes'],
    palabras: 1800,
    color: COLORS.purpleLight,
    gradient: 'linear-gradient(135deg, #A78BFA, #8B5CF6)'
  },
  {
    id: 'conexion-guardian',
    nombre: 'Conexión con Guardián',
    icono: '🧙',
    categoria: 'duendes',
    tipo: 'ritual',
    estructura: ['Sobre tu guardián', 'Preparación del espacio', 'Invocación', 'Meditación de conexión', 'Señales y mensajes', 'Agradecimiento'],
    palabras: 2500,
    color: COLORS.amber,
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)'
  },
  {
    id: 'post-redes',
    nombre: 'Post para Redes',
    icono: '📱',
    categoria: 'marketing',
    tipo: 'post',
    estructura: ['Hook inicial', 'Contenido de valor', 'Call to action', 'Hashtags sugeridos'],
    palabras: 300,
    color: COLORS.rose,
    gradient: 'linear-gradient(135deg, #F43F5E, #E11D48)'
  }
];

const CATEGORIAS = [
  { id: 'cosmos', nombre: 'Cosmos y Luna', icono: '🌙', color: COLORS.purple },
  { id: 'duendes', nombre: 'Mundo Duende', icono: '🧙', color: COLORS.amber },
  { id: 'diy', nombre: 'DIY Mágico', icono: '✂️', color: COLORS.pink },
  { id: 'esoterico', nombre: 'Esotérico', icono: '🔮', color: COLORS.purpleLight },
  { id: 'sanacion', nombre: 'Sanación', icono: '💚', color: COLORS.emerald },
  { id: 'celebraciones', nombre: 'Celebraciones', icono: '🎉', color: COLORS.orange },
  { id: 'marketing', nombre: 'Redes Sociales', icono: '📱', color: COLORS.rose }
];

// ═══════════════════════════════════════════════════════════════
// ESTILOS DE IMAGEN (para DALL-E)
// ═══════════════════════════════════════════════════════════════
const ESTILOS_IMAGEN = [
  {
    id: 'duendes-magico',
    nombre: 'Estilo Duendes',
    icono: '🧙',
    color: COLORS.amber,
    prompt: 'mystical whimsical art style, magical forest atmosphere, soft golden lighting, enchanted woodland creatures, fairy tale aesthetic, hand-crafted artisan feel, warm earth tones with gold accents, ethereal glow, Uruguay mystical folklore inspired'
  },
  {
    id: 'celestial',
    nombre: 'Celestial/Cosmos',
    icono: '🌙',
    color: COLORS.purple,
    prompt: 'celestial mystical art, moon phases, starry night sky, cosmic energy, sacred geometry, deep purple and gold colors, ethereal luminescent, astrology aesthetic'
  },
  {
    id: 'botanico',
    nombre: 'Botánico Mágico',
    icono: '🌿',
    color: COLORS.emerald,
    prompt: 'magical botanical illustration, herbs and flowers, witchy garden aesthetic, pressed flower style, vintage botanical art with mystical twist, earth tones, handcrafted feel'
  },
  {
    id: 'cristales',
    nombre: 'Cristales y Minerales',
    icono: '💎',
    color: COLORS.cyan,
    prompt: 'crystal and gemstone art, luminescent minerals, chakra colors, healing stones aesthetic, geometric crystal formations, ethereal lighting, mystical mineral photography style'
  },
  {
    id: 'altar',
    nombre: 'Altar/Ritual',
    icono: '🕯️',
    color: COLORS.orange,
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
  const [vista, setVista] = useState(nuevo ? 'crear' : 'lista');
  const [paso, setPaso] = useState(1);

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
  const [parteAudio, setParteAudio] = useState('inicio');
  const [textoAudioPersonalizado, setTextoAudioPersonalizado] = useState('');
  const [generarAudioAuto, setGenerarAudioAuto] = useState(false);

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

        if (generarAudioAuto && data.contenido) {
          setExito('¡Contenido generado! Generando audio con Thibisay...');
          await generarAudioDesdeContenido(data.contenido);
          setPaso(4);
        } else {
          setPaso(4);
          setExito('¡Contenido generado! Ahora podés agregar imagen y audio.');
          setTimeout(() => setExito(''), 3000);
        }
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
  // GENERAR AUDIO CON ELEVEN LABS
  // ═══════════════════════════════════════════════════════════════
  const generarAudio = async () => {
    if (!contenido && parteAudio !== 'personalizado') {
      setError('Primero generá el contenido de texto');
      return;
    }

    if (parteAudio === 'personalizado' && !textoAudioPersonalizado.trim()) {
      setError('Ingresá el texto personalizado para convertir a audio');
      return;
    }

    setGenerandoAudio(true);
    setError('');

    try {
      let textoParaAudio;
      if (parteAudio === 'personalizado') {
        textoParaAudio = textoAudioPersonalizado.substring(0, 5000);
      } else if (parteAudio === 'completo') {
        textoParaAudio = contenido.substring(0, 5000);
      } else {
        textoParaAudio = contenido.substring(0, 2000);
      }

      textoParaAudio = textoParaAudio
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/\n{2,}/g, '\n')
        .trim();

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
        setExito(`¡Audio generado con voz de Thibisay! (${textoParaAudio.length} caracteres)`);
        setTimeout(() => setExito(''), 4000);
      } else {
        setError(data.error || 'Error generando audio');
      }
    } catch (e) {
      setError('Error de conexión: ' + e.message);
    }

    setGenerandoAudio(false);
  };

  const generarAudioDesdeContenido = async (textoContenido) => {
    setGenerandoAudio(true);

    try {
      let textoParaAudio = textoContenido
        .substring(0, 5000)
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/\n{2,}/g, '\n')
        .trim();

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
        setExito(`¡Contenido y audio generados! (${textoParaAudio.length} caracteres de audio)`);
        setTimeout(() => setExito(''), 4000);
      } else {
        setError('Contenido generado, pero hubo error en el audio: ' + (data.error || 'Error desconocido'));
      }
    } catch (e) {
      setError('Contenido generado, pero hubo error en el audio: ' + e.message);
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
    setParteAudio('inicio');
    setTextoAudioPersonalizado('');
    setGenerarAudioAuto(false);
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
        {/* Header con gradiente */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          padding: '24px',
          background: COLORS.bgCard,
          borderRadius: 20,
          border: `1px solid ${COLORS.border}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gradiente decorativo */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink}, ${COLORS.cyan})`
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${COLORS.purple}33, ${COLORS.purple}11)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>
                ✨
              </div>
              <div>
                <h1 style={{ color: COLORS.text, fontSize: 26, fontWeight: 700, margin: 0 }}>
                  Centro de Contenido
                </h1>
                <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>
                  Creá contenido mágico con inteligencia artificial
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setVista('crear'); setPaso(1); }}
            style={{
              padding: '14px 28px',
              background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDark})`,
              border: 'none',
              borderRadius: 14,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: `0 4px 20px ${COLORS.purple}44`,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 25px ${COLORS.purple}66`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 20px ${COLORS.purple}44`;
            }}
          >
            <span style={{ fontSize: 18 }}>✦</span> Crear Contenido
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          padding: 20,
          background: `linear-gradient(135deg, ${COLORS.purple}11, ${COLORS.pink}11)`,
          borderRadius: 16,
          border: `1px solid ${COLORS.purple}33`,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <span style={{ fontSize: 28 }}>💡</span>
          <div>
            <p style={{ color: COLORS.text, margin: 0, fontWeight: 500 }}>
              ¿Qué podés hacer aquí?
            </p>
            <p style={{ color: COLORS.textMuted, margin: '4px 0 0', fontSize: 14 }}>
              Generá artículos, rituales, meditaciones guiadas, y más usando IA.
              Cada contenido puede incluir texto, imágenes DALL-E y audio con voz de Thibisay.
            </p>
          </div>
        </div>

        {/* Filtros con estilo */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'todos', label: 'Todos', icon: '📚' },
            { id: 'borrador', label: 'Borradores', icon: '📝' },
            { id: 'programado', label: 'Programados', icon: '📅' },
            { id: 'publicado', label: 'Publicados', icon: '✅' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              style={{
                padding: '10px 18px',
                background: filtro === f.id ? `${COLORS.purple}22` : COLORS.bgCard,
                border: `1px solid ${filtro === f.id ? COLORS.purple : COLORS.border}`,
                borderRadius: 12,
                color: filtro === f.id ? COLORS.purple : COLORS.textMuted,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {cargandoLista ? (
          <div style={{ textAlign: 'center', padding: 80, color: COLORS.textMuted }}>
            <div style={{
              width: 48, height: 48,
              border: `3px solid ${COLORS.border}`,
              borderTopColor: COLORS.purple,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ fontSize: 16 }}>Cargando contenidos...</p>
          </div>
        ) : contenidos.length === 0 ? (
          <div style={{
            ...GLASS,
            borderRadius: 20,
            padding: 80,
            textAlign: 'center'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${COLORS.purple}22, ${COLORS.pink}22)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: 40
            }}>
              ✨
            </div>
            <h3 style={{ color: COLORS.text, fontSize: 22, marginBottom: 12 }}>
              Tu biblioteca está vacía
            </h3>
            <p style={{ color: COLORS.textMuted, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              Creá tu primer contenido mágico con ayuda de inteligencia artificial.
              Elegí una plantilla y dejá que Claude haga la magia.
            </p>
            <button
              onClick={() => { setVista('crear'); setPaso(1); }}
              style={{
                padding: '16px 32px',
                background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDark})`,
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: `0 4px 20px ${COLORS.purple}44`
              }}
            >
              ✦ Crear mi primer contenido
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 20
          }}>
            {contenidos.map((c) => {
              const cat = CATEGORIAS.find(cat => cat.id === c.categoria);
              return (
                <div
                  key={c.id}
                  style={{
                    background: COLORS.bgCard,
                    borderRadius: 20,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: `1px solid ${COLORS.border}`,
                    transition: 'transform 0.2s, border-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = cat?.color || COLORS.purple;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = COLORS.border;
                  }}
                >
                  {c.imagen ? (
                    <img
                      src={c.imagen}
                      alt={c.titulo}
                      style={{ width: '100%', height: 180, objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      height: 180,
                      background: `linear-gradient(135deg, ${cat?.color || COLORS.purple}22, ${cat?.color || COLORS.purple}11)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 48
                    }}>
                      {cat?.icono || '✨'}
                    </div>
                  )}
                  <div style={{ padding: 20 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 12
                    }}>
                      <span style={{
                        padding: '5px 12px',
                        background: c.estado === 'publicado' ? `${COLORS.success}22` :
                                    c.estado === 'programado' ? `${COLORS.info}22` : `${COLORS.textMuted}22`,
                        color: c.estado === 'publicado' ? COLORS.success :
                               c.estado === 'programado' ? COLORS.info : COLORS.textMuted,
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {c.estado}
                      </span>
                      <span style={{
                        color: cat?.color || COLORS.textDim,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {cat?.icono} {cat?.nombre || c.categoria}
                      </span>
                    </div>
                    <h3 style={{
                      color: COLORS.text,
                      fontSize: 17,
                      fontWeight: 600,
                      margin: '0 0 10px',
                      lineHeight: 1.4
                    }}>
                      {c.titulo}
                    </h3>
                    <p style={{
                      color: COLORS.textMuted,
                      fontSize: 14,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.5
                    }}>
                      {c.contenido?.substring(0, 120)}...
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: 10,
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: `1px solid ${COLORS.border}`
                    }}>
                      {c.imagen && (
                        <span style={{
                          padding: '4px 10px',
                          background: `${COLORS.cyan}15`,
                          color: COLORS.cyan,
                          borderRadius: 6,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          🖼️ Imagen
                        </span>
                      )}
                      {c.audio && (
                        <span style={{
                          padding: '4px 10px',
                          background: `${COLORS.purple}15`,
                          color: COLORS.purple,
                          borderRadius: 6,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          🔊 Audio
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
        marginBottom: 32,
        padding: '20px 24px',
        background: COLORS.bgCard,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`
      }}>
        <div>
          <button
            onClick={() => { setVista('lista'); resetearFormulario(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: COLORS.textMuted,
              cursor: 'pointer',
              fontSize: 14,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: 0
            }}
          >
            ← Volver a biblioteca
          </button>
          <h1 style={{ color: COLORS.text, fontSize: 22, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${COLORS.purple}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}>
              ✨
            </span>
            Crear Contenido Mágico
          </h1>
        </div>

        {/* Indicador de pasos mejorado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { n: 1, label: 'Plantilla' },
            { n: 2, label: 'Detalles' },
            { n: 3, label: 'Generar' },
            { n: 4, label: 'Media' },
            { n: 5, label: 'Publicar' }
          ].map((p, i) => (
            <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: p.n < paso ? COLORS.purple : p.n === paso ? `${COLORS.purple}33` : COLORS.bgElevated,
                  border: `2px solid ${p.n <= paso ? COLORS.purple : COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: p.n <= paso ? (p.n < paso ? '#fff' : COLORS.purple) : COLORS.textDim,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.3s'
                }}>
                  {p.n < paso ? '✓' : p.n}
                </div>
                <span style={{
                  fontSize: 10,
                  color: p.n === paso ? COLORS.purple : COLORS.textDim,
                  fontWeight: p.n === paso ? 600 : 400
                }}>
                  {p.label}
                </span>
              </div>
              {i < 4 && (
                <div style={{
                  width: 24,
                  height: 2,
                  background: p.n < paso ? COLORS.purple : COLORS.border,
                  marginBottom: 18,
                  borderRadius: 1
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div style={{
          padding: 18,
          background: `${COLORS.error}15`,
          border: `1px solid ${COLORS.error}44`,
          borderRadius: 14,
          color: COLORS.error,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          {error}
        </div>
      )}
      {exito && (
        <div style={{
          padding: 18,
          background: `${COLORS.success}15`,
          border: `1px solid ${COLORS.success}44`,
          borderRadius: 14,
          color: COLORS.success,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 20 }}>✨</span>
          {exito}
        </div>
      )}

      {/* ═══ PASO 1: ELEGIR PLANTILLA ═══ */}
      {paso === 1 && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ color: COLORS.text, fontSize: 20, margin: '0 0 8px' }}>
              Elegí una plantilla
            </h2>
            <p style={{ color: COLORS.textMuted, margin: 0 }}>
              Cada plantilla está optimizada para un tipo específico de contenido
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16
          }}>
            {PLANTILLAS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPlantilla(p);
                  setPalabras(p.palabras);
                  if (p.tipo === 'meditacion') {
                    setGenerarAudioAuto(true);
                  }
                  setPaso(2);
                }}
                style={{
                  background: COLORS.bgCard,
                  padding: 24,
                  borderRadius: 20,
                  border: `2px solid ${plantilla?.id === p.id ? p.color : COLORS.border}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = p.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseOut={(e) => {
                  if (plantilla?.id !== p.id) {
                    e.currentTarget.style.borderColor = COLORS.border;
                  }
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Gradiente superior */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: p.gradient,
                  opacity: 0.8
                }} />

                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: `${p.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  fontSize: 28
                }}>
                  {p.icono}
                </div>
                <h3 style={{ color: COLORS.text, fontSize: 17, margin: '0 0 6px', fontWeight: 600 }}>
                  {p.nombre}
                </h3>
                <p style={{ color: COLORS.textMuted, fontSize: 13, margin: '0 0 12px' }}>
                  ~{p.palabras.toLocaleString()} palabras
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.estructura.slice(0, 3).map((s, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      background: `${p.color}15`,
                      color: p.color,
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 500
                    }}>
                      {s}
                    </span>
                  ))}
                  {p.estructura.length > 3 && (
                    <span style={{
                      padding: '4px 10px',
                      background: COLORS.bgElevated,
                      color: COLORS.textMuted,
                      borderRadius: 6,
                      fontSize: 11
                    }}>
                      +{p.estructura.length - 3} más
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
                  color: COLORS.gold,
                  gradient: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.amber})`
                });
                setPaso(2);
              }}
              style={{
                background: COLORS.bgCard,
                padding: 24,
                borderRadius: 20,
                border: `2px dashed ${COLORS.border}`,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = COLORS.gold;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: `${COLORS.gold}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 28
              }}>
                ✨
              </div>
              <h3 style={{ color: COLORS.text, fontSize: 17, margin: '0 0 6px', fontWeight: 600 }}>
                Personalizado
              </h3>
              <p style={{ color: COLORS.textMuted, fontSize: 13, margin: 0 }}>
                Definí tu propia estructura
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ═══ PASO 2: DETALLES ═══ */}
      {paso === 2 && plantilla && (
        <div>
          <h2 style={{ color: COLORS.text, fontSize: 20, marginBottom: 24 }}>
            Detalles del contenido
          </h2>
          <div style={{
            background: COLORS.bgCard,
            borderRadius: 20,
            padding: 28,
            border: `1px solid ${COLORS.border}`
          }}>
            {/* Plantilla seleccionada */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 28,
              padding: 20,
              background: `${plantilla.color}11`,
              borderRadius: 16,
              border: `1px solid ${plantilla.color}33`
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: `${plantilla.color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28
              }}>
                {plantilla.icono}
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ color: COLORS.text, fontSize: 17 }}>{plantilla.nombre}</strong>
                <p style={{ color: COLORS.textMuted, fontSize: 13, margin: '4px 0 0' }}>
                  {plantilla.estructura.length > 0 ? plantilla.estructura.join(' → ') : 'Estructura libre'}
                </p>
              </div>
              <button
                onClick={() => setPaso(1)}
                style={{
                  padding: '8px 16px',
                  background: COLORS.bgElevated,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  color: COLORS.textMuted,
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                Cambiar
              </button>
            </div>

            {/* Tema */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: COLORS.text, marginBottom: 10, fontWeight: 600, fontSize: 15 }}>
                ¿Sobre qué tema querés escribir? *
              </label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej: Ritual para luna llena en Acuario, Guía del cuarzo rosa..."
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  background: COLORS.bgElevated,
                  border: `2px solid ${tema.trim() ? plantilla.color : COLORS.border}`,
                  borderRadius: 14,
                  color: COLORS.text,
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {/* Categoría (si es custom) */}
            {plantilla.id === 'custom' && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', color: COLORS.text, marginBottom: 10, fontWeight: 600, fontSize: 15 }}>
                  Categoría
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPlantilla({...plantilla, categoria: cat.id, color: cat.color})}
                      style={{
                        padding: '10px 18px',
                        background: plantilla.categoria === cat.id ? `${cat.color}22` : COLORS.bgElevated,
                        border: `2px solid ${plantilla.categoria === cat.id ? cat.color : COLORS.border}`,
                        borderRadius: 12,
                        color: plantilla.categoria === cat.id ? cat.color : COLORS.textMuted,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{cat.icono}</span>
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Longitud */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: COLORS.text, marginBottom: 10, fontWeight: 600, fontSize: 15 }}>
                Extensión aproximada
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { val: 1000, label: '1.000', desc: 'Post corto' },
                  { val: 2000, label: '2.000', desc: 'Artículo' },
                  { val: 3000, label: '3.000', desc: 'Guía' },
                  { val: 5000, label: '5.000', desc: 'Épico' }
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPalabras(p.val)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: palabras === p.val ? `${plantilla.color}22` : COLORS.bgElevated,
                      border: `2px solid ${palabras === p.val ? plantilla.color : COLORS.border}`,
                      borderRadius: 12,
                      color: palabras === p.val ? plantilla.color : COLORS.textMuted,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 16 }}>~{p.label}</div>
                    <div style={{ fontSize: 11, marginTop: 2, opacity: 0.7 }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Instrucciones extra */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: COLORS.text, marginBottom: 10, fontWeight: 600, fontSize: 15 }}>
                Instrucciones adicionales (opcional)
              </label>
              <textarea
                value={instruccionesExtra}
                onChange={(e) => setInstruccionesExtra(e.target.value)}
                placeholder="Ej: Que mencione el cuarzo amatista, que incluya una visualización guiada, tono más serio..."
                style={{
                  width: '100%',
                  minHeight: 100,
                  padding: '16px 18px',
                  background: COLORS.bgElevated,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 14,
                  color: COLORS.text,
                  fontSize: 15,
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: 1.5
                }}
              />
            </div>

            {/* Opción de generar audio automáticamente */}
            <div
              style={{
                marginBottom: 28,
                padding: 20,
                background: generarAudioAuto ? `${COLORS.purple}15` : COLORS.bgElevated,
                border: `2px solid ${generarAudioAuto ? COLORS.purple : COLORS.border}`,
                borderRadius: 16,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setGenerarAudioAuto(!generarAudioAuto)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: `2px solid ${generarAudioAuto ? COLORS.purple : COLORS.border}`,
                  background: generarAudioAuto ? COLORS.purple : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  {generarAudioAuto && <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: COLORS.text, fontWeight: 600, fontSize: 15 }}>
                      🎙️ Generar audio automáticamente con Thibisay
                    </span>
                    {plantilla?.tipo === 'meditacion' && (
                      <span style={{
                        fontSize: 11,
                        background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`,
                        color: 'white',
                        padding: '3px 10px',
                        borderRadius: 12,
                        fontWeight: 600
                      }}>
                        RECOMENDADO
                      </span>
                    )}
                  </div>
                  <p style={{ color: COLORS.textMuted, fontSize: 13, margin: '6px 0 0' }}>
                    Al generar el contenido, se creará automáticamente el audio con voz de Thibisay
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: 14 }}>
              <button
                onClick={() => setPaso(1)}
                style={{
                  padding: '16px 28px',
                  background: 'transparent',
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 14,
                  color: COLORS.textMuted,
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 500
                }}
              >
                ← Atrás
              </button>
              <button
                onClick={() => setPaso(3)}
                disabled={!tema.trim()}
                style={{
                  flex: 1,
                  padding: '16px 28px',
                  background: tema.trim() ? plantilla.gradient : COLORS.bgElevated,
                  border: 'none',
                  borderRadius: 14,
                  color: tema.trim() ? '#fff' : COLORS.textDim,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: tema.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: tema.trim() ? `0 4px 20px ${plantilla.color}44` : 'none',
                  transition: 'all 0.2s'
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
          <h2 style={{ color: COLORS.text, fontSize: 20, marginBottom: 24 }}>
            Generar contenido con IA
          </h2>
          <div style={{
            background: COLORS.bgCard,
            borderRadius: 20,
            padding: 28,
            border: `1px solid ${COLORS.border}`
          }}>
            {/* Resumen */}
            <div style={{
              padding: 20,
              background: `${plantilla?.color}11`,
              borderRadius: 16,
              marginBottom: 28,
              border: `1px solid ${plantilla?.color}33`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{plantilla?.icono}</span>
                <h3 style={{ color: plantilla?.color, fontSize: 18, margin: 0, fontWeight: 600 }}>
                  {plantilla?.nombre}: {tema}
                </h3>
              </div>
              <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0 }}>
                Categoría: {CATEGORIAS.find(c => c.id === plantilla?.categoria)?.nombre} • ~{palabras.toLocaleString()} palabras
                {generarAudioAuto && <span style={{ color: COLORS.purple }}> • Con audio automático</span>}
              </p>
              {instruccionesExtra && (
                <p style={{ color: COLORS.textDim, fontSize: 13, marginTop: 10 }}>
                  📝 {instruccionesExtra}
                </p>
              )}
            </div>

            {contenido ? (
              <>
                {/* Vista previa del contenido */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14
                  }}>
                    <label style={{ color: COLORS.text, fontWeight: 600, fontSize: 15 }}>
                      Contenido generado
                    </label>
                    <span style={{
                      padding: '6px 14px',
                      background: `${COLORS.success}22`,
                      color: COLORS.success,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500
                    }}>
                      ✓ {contenido.split(/\s+/).length.toLocaleString()} palabras
                    </span>
                  </div>
                  <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 400,
                      padding: 20,
                      background: COLORS.bgElevated,
                      border: `2px solid ${COLORS.border}`,
                      borderRadius: 14,
                      color: COLORS.text,
                      fontSize: 15,
                      lineHeight: 1.7,
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <button
                    onClick={generarContenido}
                    disabled={generando}
                    style={{
                      padding: '16px 28px',
                      background: COLORS.bgElevated,
                      border: `2px solid ${COLORS.border}`,
                      borderRadius: 14,
                      color: COLORS.textMuted,
                      cursor: 'pointer',
                      fontSize: 15,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {generando ? 'Regenerando...' : '↻ Regenerar'}
                  </button>
                  <button
                    onClick={() => setPaso(4)}
                    style={{
                      flex: 1,
                      padding: '16px 28px',
                      background: plantilla?.gradient,
                      border: 'none',
                      borderRadius: 14,
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: 'pointer',
                      boxShadow: `0 4px 20px ${plantilla?.color}44`
                    }}
                  >
                    Agregar Multimedia →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: 24,
                    background: `linear-gradient(135deg, ${COLORS.purple}22, ${COLORS.pink}22)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: 40
                  }}>
                    🤖
                  </div>
                  <p style={{ color: COLORS.text, fontSize: 17, marginBottom: 8 }}>
                    Claude va a generar contenido de alta calidad
                  </p>
                  <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
                    Basado en tu tema y la plantilla seleccionada. Esto puede tomar 30-60 segundos.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <button
                    onClick={() => setPaso(2)}
                    style={{
                      padding: '16px 28px',
                      background: 'transparent',
                      border: `2px solid ${COLORS.border}`,
                      borderRadius: 14,
                      color: COLORS.textMuted,
                      cursor: 'pointer',
                      fontSize: 15
                    }}
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={generarContenido}
                    disabled={generando}
                    style={{
                      flex: 1,
                      padding: '16px 28px',
                      background: generando ? COLORS.bgElevated : `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDark})`,
                      border: 'none',
                      borderRadius: 14,
                      color: generando ? COLORS.textMuted : '#fff',
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: generando ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      boxShadow: generando ? 'none' : `0 4px 20px ${COLORS.purple}44`
                    }}
                  >
                    {generando ? (
                      <>
                        <div style={{
                          width: 20, height: 20,
                          border: '3px solid transparent',
                          borderTopColor: COLORS.textMuted,
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
          <h2 style={{ color: COLORS.text, fontSize: 20, marginBottom: 24 }}>
            Agregar multimedia
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Imagen */}
            <div style={{
              background: COLORS.bgCard,
              borderRadius: 20,
              padding: 24,
              border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ color: COLORS.text, fontSize: 17, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${COLORS.cyan}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  🖼️
                </span>
                Imagen con DALL-E
              </h3>

              {/* Estilos */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: 10, fontSize: 13, fontWeight: 500 }}>
                  Estilo visual
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ESTILOS_IMAGEN.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setEstiloImagen(e)}
                      style={{
                        padding: '8px 14px',
                        background: estiloImagen.id === e.id ? `${e.color}22` : COLORS.bgElevated,
                        border: `2px solid ${estiloImagen.id === e.id ? e.color : COLORS.border}`,
                        borderRadius: 10,
                        color: estiloImagen.id === e.id ? e.color : COLORS.textMuted,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s'
                      }}
                    >
                      <span>{e.icono}</span>
                      {e.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt personalizado */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: 10, fontSize: 13, fontWeight: 500 }}>
                  Descripción de la imagen (opcional)
                </label>
                <input
                  type="text"
                  value={promptImagen}
                  onChange={(e) => setPromptImagen(e.target.value)}
                  placeholder={`Ej: ${titulo} con luna llena y cristales`}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: COLORS.bgElevated,
                    border: `2px solid ${COLORS.border}`,
                    borderRadius: 12,
                    color: COLORS.text,
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Preview imagen */}
              {imagen ? (
                <div style={{ marginBottom: 20 }}>
                  <img
                    src={imagen}
                    alt="Generada"
                    style={{ width: '100%', borderRadius: 16 }}
                  />
                </div>
              ) : (
                <div style={{
                  height: 200,
                  background: COLORS.bgElevated,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.textDim,
                  marginBottom: 20,
                  border: `2px dashed ${COLORS.border}`
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>🖼️</span>
                    <span>Vista previa</span>
                  </div>
                </div>
              )}

              <button
                onClick={generarImagen}
                disabled={generandoImagen}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: generandoImagen ? COLORS.bgElevated : `linear-gradient(135deg, ${COLORS.cyan}, #0891B2)`,
                  border: 'none',
                  borderRadius: 14,
                  color: generandoImagen ? COLORS.textMuted : '#fff',
                  fontWeight: 600,
                  cursor: generandoImagen ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: generandoImagen ? 'none' : `0 4px 20px ${COLORS.cyan}44`
                }}
              >
                {generandoImagen ? (
                  <>
                    <div style={{
                      width: 18, height: 18,
                      border: '2px solid transparent',
                      borderTopColor: COLORS.textMuted,
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
              background: COLORS.bgCard,
              borderRadius: 20,
              padding: 24,
              border: plantilla?.tipo === 'meditacion' ? `2px solid ${COLORS.purple}` : `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ color: COLORS.text, fontSize: 17, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${COLORS.purple}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  🎙️
                </span>
                Audio con Thibisay
                {plantilla?.tipo === 'meditacion' && (
                  <span style={{
                    fontSize: 11,
                    background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontWeight: 600
                  }}>
                    IDEAL
                  </span>
                )}
              </h3>

              <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>
                Convertí el contenido a audio con la voz mágica de Thibisay (Eleven Labs)
              </p>

              {/* Selector de parte */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: 10, fontSize: 13, fontWeight: 500 }}>
                  ¿Qué parte convertir?
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'inicio', label: 'Inicio', desc: '2000 chars' },
                    { id: 'completo', label: 'Completo', desc: '5000 chars' },
                    { id: 'personalizado', label: 'Custom', desc: 'Tu texto' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setParteAudio(opt.id)}
                      style={{
                        flex: 1,
                        padding: '12px 8px',
                        background: parteAudio === opt.id ? `${COLORS.purple}22` : COLORS.bgElevated,
                        border: `2px solid ${parteAudio === opt.id ? COLORS.purple : COLORS.border}`,
                        borderRadius: 12,
                        color: parteAudio === opt.id ? COLORS.purple : COLORS.textMuted,
                        fontSize: 13,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Texto personalizado */}
              {parteAudio === 'personalizado' && (
                <div style={{ marginBottom: 20 }}>
                  <textarea
                    value={textoAudioPersonalizado}
                    onChange={(e) => setTextoAudioPersonalizado(e.target.value)}
                    placeholder="Pegá aquí el texto que querés convertir a audio..."
                    style={{
                      width: '100%',
                      minHeight: 100,
                      padding: 14,
                      background: COLORS.bgElevated,
                      border: `2px solid ${COLORS.border}`,
                      borderRadius: 12,
                      color: COLORS.text,
                      fontSize: 14,
                      resize: 'vertical'
                    }}
                    maxLength={5000}
                  />
                  <div style={{ textAlign: 'right', color: COLORS.textDim, fontSize: 12, marginTop: 6 }}>
                    {textoAudioPersonalizado.length}/5000 caracteres
                  </div>
                </div>
              )}

              {/* Preview audio */}
              {audio ? (
                <div style={{ marginBottom: 20 }}>
                  <audio
                    controls
                    src={`data:audio/mpeg;base64,${audio}`}
                    style={{ width: '100%', borderRadius: 12 }}
                  />
                  <p style={{ color: COLORS.success, fontSize: 13, marginTop: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span>✓</span> Audio generado con voz de Thibisay
                  </p>
                </div>
              ) : (
                <div style={{
                  height: 80,
                  background: COLORS.bgElevated,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.textDim,
                  marginBottom: 20,
                  border: `2px dashed ${COLORS.border}`
                }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>🎙️</span>
                  Sin audio generado
                </div>
              )}

              <button
                onClick={generarAudio}
                disabled={generandoAudio || !contenido}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: generandoAudio || !contenido ? COLORS.bgElevated : `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDark})`,
                  border: 'none',
                  borderRadius: 14,
                  color: !contenido ? COLORS.textDim : '#fff',
                  fontWeight: 600,
                  cursor: generandoAudio || !contenido ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: generandoAudio || !contenido ? 'none' : `0 4px 20px ${COLORS.purple}44`
                }}
              >
                {generandoAudio ? (
                  <>
                    <div style={{
                      width: 18, height: 18,
                      border: '2px solid transparent',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Generando audio...
                  </>
                ) : audio ? '↻ Regenerar Audio' : '🎙️ Generar Audio'}
              </button>
            </div>
          </div>

          {/* Botones navegación */}
          <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
            <button
              onClick={() => setPaso(3)}
              style={{
                padding: '16px 28px',
                background: 'transparent',
                border: `2px solid ${COLORS.border}`,
                borderRadius: 14,
                color: COLORS.textMuted,
                cursor: 'pointer',
                fontSize: 15
              }}
            >
              ← Editar Texto
            </button>
            <button
              onClick={() => setPaso(5)}
              style={{
                flex: 1,
                padding: '16px 28px',
                background: plantilla?.gradient,
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: `0 4px 20px ${plantilla?.color}44`
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
          <h2 style={{ color: COLORS.text, fontSize: 20, marginBottom: 24 }}>
            Publicar contenido
          </h2>

          <div style={{
            background: COLORS.bgCard,
            borderRadius: 20,
            padding: 28,
            border: `1px solid ${COLORS.border}`
          }}>
            {/* Vista previa final */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: imagen ? '240px 1fr' : '1fr',
              gap: 24,
              marginBottom: 28,
              padding: 24,
              background: COLORS.bgElevated,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`
            }}>
              {imagen && (
                <img
                  src={imagen}
                  alt={titulo}
                  style={{ width: '100%', borderRadius: 12 }}
                />
              )}
              <div>
                <h3 style={{ color: COLORS.text, margin: '0 0 12px', fontSize: 20 }}>{titulo}</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 14, margin: '0 0 16px' }}>
                  {plantilla?.icono} {CATEGORIAS.find(c => c.id === plantilla?.categoria)?.nombre} • {contenido?.split(/\s+/).length.toLocaleString()} palabras
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {imagen && (
                    <span style={{
                      padding: '6px 14px',
                      background: `${COLORS.cyan}15`,
                      color: COLORS.cyan,
                      borderRadius: 8,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      🖼️ Imagen
                    </span>
                  )}
                  {audio && (
                    <span style={{
                      padding: '6px 14px',
                      background: `${COLORS.purple}15`,
                      color: COLORS.purple,
                      borderRadius: 8,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      🔊 Audio
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Título editable */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: COLORS.text, marginBottom: 10, fontWeight: 600, fontSize: 15 }}>
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  background: COLORS.bgElevated,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 14,
                  color: COLORS.text,
                  fontSize: 16,
                  outline: 'none'
                }}
              />
            </div>

            {/* Dónde publicar */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: COLORS.text, marginBottom: 10, fontWeight: 600, fontSize: 15 }}>
                Publicar en
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { id: 'circulo', label: '☽ Círculo', desc: 'Solo miembros premium', color: COLORS.purple },
                  { id: 'publico', label: '🌐 Blog público', desc: 'Visible para todos', color: COLORS.emerald },
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
                      padding: '18px',
                      background: publicarEn.includes(opt.id) ? `${opt.color}15` : COLORS.bgElevated,
                      border: `2px solid ${publicarEn.includes(opt.id) ? opt.color : COLORS.border}`,
                      borderRadius: 14,
                      color: publicarEn.includes(opt.id) ? opt.color : COLORS.textMuted,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: 16, marginBottom: 4 }}>{opt.label}</strong>
                    <small style={{ opacity: 0.8 }}>{opt.desc}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Programar */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: COLORS.text, marginBottom: 10, fontWeight: 600, fontSize: 15 }}>
                Programar publicación (opcional)
              </label>
              <input
                type="datetime-local"
                value={fechaPublicacion}
                onChange={(e) => setFechaPublicacion(e.target.value)}
                style={{
                  padding: '16px 18px',
                  background: COLORS.bgElevated,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 14,
                  color: COLORS.text,
                  fontSize: 15,
                  outline: 'none'
                }}
              />
            </div>

            {/* Botones finales */}
            <div style={{ display: 'flex', gap: 14 }}>
              <button
                onClick={() => setPaso(4)}
                style={{
                  padding: '16px 28px',
                  background: 'transparent',
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 14,
                  color: COLORS.textMuted,
                  cursor: 'pointer',
                  fontSize: 15
                }}
              >
                ← Atrás
              </button>
              <button
                onClick={() => guardarContenido('borrador')}
                disabled={guardando}
                style={{
                  padding: '16px 28px',
                  background: COLORS.bgElevated,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 14,
                  color: COLORS.text,
                  cursor: 'pointer',
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                💾 Guardar Borrador
              </button>
              <button
                onClick={() => guardarContenido(fechaPublicacion ? 'programado' : 'publicado')}
                disabled={guardando}
                style={{
                  flex: 1,
                  padding: '16px 28px',
                  background: `linear-gradient(135deg, ${COLORS.success}, #16a34a)`,
                  border: 'none',
                  borderRadius: 14,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: guardando ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: `0 4px 20px ${COLORS.success}44`
                }}
              >
                {guardando ? (
                  <>
                    <div style={{
                      width: 20, height: 20,
                      border: '3px solid transparent',
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
