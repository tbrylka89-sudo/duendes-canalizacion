'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// PALETA DE COLORES VIBRANTE Y VARIADA
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  // Fondos
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgElevated: '#1a1a25',
  bgHover: '#22222f',

  // Acentos principales
  gold: '#D4A853',
  goldLight: '#E8C97D',
  goldDark: '#B8922F',

  // Colores vibrantes para categorías
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  pink: '#EC4899',
  pinkLight: '#F472B6',
  cyan: '#06B6D4',
  cyanLight: '#22D3EE',
  emerald: '#10B981',
  emeraldLight: '#34D399',
  orange: '#F97316',
  orangeLight: '#FB923C',
  rose: '#F43F5E',
  roseLight: '#FB7185',
  indigo: '#6366F1',
  amber: '#F59E0B',
  teal: '#14B8A6',
  violet: '#7C3AED',

  // Textos
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textDim: '#52525B',

  // Estados
  success: '#22C55E',
  error: '#EF4444',
  warning: '#EAB308',
  info: '#3B82F6',

  // Bordes
  border: '#27272A',
  borderLight: '#3F3F46',
};

// Gradientes predefinidos
const GRADIENTS = {
  gold: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
  purple: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.violet})`,
  pink: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.rose})`,
  cyan: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.teal})`,
  emerald: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.teal})`,
  orange: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.amber})`,
  mixed: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink}, ${COLORS.orange})`,
};

// ═══════════════════════════════════════════════════════════════
// TIPOS DE CONTENIDO
// ═══════════════════════════════════════════════════════════════
const MODOS_CONTENIDO = {
  escrito: {
    id: 'escrito',
    nombre: 'Material Escrito',
    icono: '📝',
    descripcion: 'Textos para blog, email o redes sociales',
    color: COLORS.cyan,
    gradient: GRADIENTS.cyan,
    tipos: [
      { id: 'articulo', nombre: 'Artículo de Blog', icono: '📰', palabras: 1500 },
      { id: 'guia', nombre: 'Guía Práctica', icono: '📋', palabras: 2000 },
      { id: 'email', nombre: 'Email para Círculo', icono: '💌', palabras: 600 },
      { id: 'post', nombre: 'Post para Redes', icono: '📱', palabras: 300 },
      { id: 'descripcion', nombre: 'Descripción de Producto', icono: '🏷️', palabras: 400 },
    ]
  },
  audio: {
    id: 'audio',
    nombre: 'Contenido con Audio',
    icono: '🎙️',
    descripcion: 'Meditaciones, rituales y contenido narrado',
    color: COLORS.purple,
    gradient: GRADIENTS.purple,
    tipos: [
      { id: 'meditacion', nombre: 'Meditación Guiada', icono: '🧘', palabras: 1200, audioConfig: 'meditacion' },
      { id: 'ritual', nombre: 'Ritual Mágico', icono: '🕯️', palabras: 1000, audioConfig: 'ritual' },
      { id: 'cuento', nombre: 'Cuento del Bosque', icono: '🌲', palabras: 1500, audioConfig: 'cuento' },
      { id: 'sanacion', nombre: 'Sesión de Sanación', icono: '💚', palabras: 1000, audioConfig: 'sanacion' },
      { id: 'leccion', nombre: 'Lección Ancestral', icono: '📜', palabras: 1200, audioConfig: 'leccion' },
      { id: 'mensaje', nombre: 'Mensaje Canalizado', icono: '✨', palabras: 500, audioConfig: 'mensaje' },
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// DETECTOR INTELIGENTE DE CARACTERÍSTICAS
// ═══════════════════════════════════════════════════════════════
const detectarCaracteristicas = (producto) => {
  const texto = `${producto.nombre || ''} ${producto.descripcion || ''} ${producto.descripcionCompleta || ''}`.toLowerCase();

  // Detectar género
  let genero = 'neutro';
  const palabrasFemeninas = ['ella', 'guardiana', 'hada', 'bruja', 'diosa', 'madre', 'abuela', 'niña', 'princesa', 'reina', 'dama', 'señora', 'femenin', 'mujer'];
  const palabrasMasculinas = ['él', 'guardian', 'mago', 'brujo', 'dios', 'padre', 'abuelo', 'niño', 'principe', 'rey', 'señor', 'masculin', 'hombre', 'duende'];

  const countFem = palabrasFemeninas.filter(p => texto.includes(p)).length;
  const countMasc = palabrasMasculinas.filter(p => texto.includes(p)).length;

  if (countFem > countMasc) genero = 'femenino';
  else if (countMasc > countFem) genero = 'masculino';

  // Detectar elemento
  let elemento = 'eter';
  const elementos = {
    tierra: ['tierra', 'raíz', 'raiz', 'bosque', 'árbol', 'arbol', 'piedra', 'montaña', 'estabilidad', 'abundancia', 'prosperidad', 'hogar', 'protección', 'proteccion'],
    agua: ['agua', 'mar', 'océano', 'oceano', 'río', 'rio', 'lluvia', 'lágrima', 'emoción', 'intuición', 'sueño', 'luna', 'fluir', 'purificación'],
    fuego: ['fuego', 'llama', 'sol', 'calor', 'pasión', 'pasion', 'transformación', 'transformacion', 'energía', 'fuerza', 'coraje', 'acción', 'voluntad'],
    aire: ['aire', 'viento', 'cielo', 'nube', 'pluma', 'comunicación', 'comunicacion', 'mente', 'idea', 'libertad', 'viaje', 'mensaje', 'inspiración'],
    eter: ['éter', 'eter', 'espíritu', 'espiritu', 'cosmos', 'universo', 'magia', 'místico', 'mistico', 'ancestral', 'sagrado', 'divino', 'cristal']
  };

  let maxElemento = 0;
  Object.entries(elementos).forEach(([elem, palabras]) => {
    const count = palabras.filter(p => texto.includes(p)).length;
    if (count > maxElemento) {
      maxElemento = count;
      elemento = elem;
    }
  });

  // Detectar cristales mencionados
  const cristales = [];
  const listaCristales = ['cuarzo', 'amatista', 'citrino', 'turmalina', 'obsidiana', 'pirita', 'labradorita', 'selenita', 'jade', 'ágata', 'agata', 'jaspe', 'fluorita', 'turquesa', 'ópalo', 'opalo', 'esmeralda', 'rubí', 'rubi', 'zafiro', 'granate', 'moonstone', 'piedra luna', 'ojo de tigre', 'malaquita', 'lapislázuli', 'lapislazuli', 'rodocrosita', 'amazonita', 'howlita', 'sodalita'];
  listaCristales.forEach(cristal => {
    if (texto.includes(cristal)) cristales.push(cristal);
  });

  // Detectar propósito
  let proposito = 'guía espiritual';
  const propositos = {
    'abundancia y prosperidad': ['abundancia', 'prosperidad', 'dinero', 'riqueza', 'éxito', 'exito', 'fortuna'],
    'protección': ['protección', 'proteccion', 'proteger', 'escudo', 'defensa', 'seguridad'],
    'amor y relaciones': ['amor', 'relación', 'relacion', 'corazón', 'corazon', 'pareja', 'romance', 'afecto'],
    'sanación': ['sanación', 'sanacion', 'sanar', 'curación', 'curacion', 'salud', 'bienestar'],
    'intuición': ['intuición', 'intuicion', 'clarividencia', 'visión', 'vision', 'sueños', 'suenos', 'tercer ojo'],
    'creatividad': ['creatividad', 'arte', 'inspiración', 'inspiracion', 'musa', 'crear', 'expresión'],
    'paz interior': ['paz', 'calma', 'serenidad', 'tranquilidad', 'armonía', 'armonia', 'equilibrio'],
    'transformación': ['transformación', 'transformacion', 'cambio', 'renovación', 'renacimiento', 'evolución']
  };

  Object.entries(propositos).forEach(([prop, palabras]) => {
    if (palabras.some(p => texto.includes(p))) proposito = prop;
  });

  // Detectar edad/antigüedad
  let edad = 'adulto';
  if (texto.includes('ancian') || texto.includes('abuel') || texto.includes('milenari') || texto.includes('ancestr')) edad = 'anciano';
  else if (texto.includes('joven') || texto.includes('niñ') || texto.includes('pequeñ')) edad = 'joven';

  // Detectar personalidad
  const personalidades = [];
  const rasgos = {
    'sabio': ['sabio', 'sabiduría', 'sabiduria', 'conocimiento', 'ancestral'],
    'tierno': ['tierno', 'dulce', 'cariñoso', 'amoroso', 'gentil'],
    'misterioso': ['misterioso', 'enigmático', 'enigmatico', 'secreto', 'oculto'],
    'alegre': ['alegre', 'feliz', 'divertido', 'juguetón', 'jugeton'],
    'protector': ['protector', 'guardián', 'guardian', 'defensor', 'cuidador'],
    'sanador': ['sanador', 'curador', 'terapéutico', 'terapeutico', 'curativo']
  };

  Object.entries(rasgos).forEach(([rasgo, palabras]) => {
    if (palabras.some(p => texto.includes(p))) personalidades.push(rasgo);
  });

  return {
    genero,
    elemento,
    cristales: cristales.length > 0 ? cristales : ['cuarzo'],
    proposito,
    edad,
    personalidades: personalidades.length > 0 ? personalidades : ['mágico'],
    confianza: Math.min(100, (countFem + countMasc + maxElemento + cristales.length + personalidades.length) * 15)
  };
};

// Mapeo de elemento a voz recomendada (IDs verificados de ElevenLabs)
const ELEMENTO_A_VOZ = {
  tierra: { masculino: 'patrick', femenino: 'glinda', neutro: 'guardian-bosque' },
  agua: { masculino: 'josh', femenino: 'bella', neutro: 'ninfa' },
  fuego: { masculino: 'arnold', femenino: 'domi', neutro: 'hechicero' },
  aire: { masculino: 'antoni', femenino: 'elli', neutro: 'hada' },
  eter: { masculino: 'clyde', femenino: 'charlotte', neutro: 'thibisay' }
};

// ═══════════════════════════════════════════════════════════════
// PLANTILLAS RÁPIDAS
// ═══════════════════════════════════════════════════════════════
const PLANTILLAS = [
  { id: 'bienvenida', nombre: 'Bienvenida al Guardián', tema: 'Mensaje de bienvenida para quien acaba de adoptar este guardián', icono: '👋', tipo: 'mensaje' },
  { id: 'luna-llena', nombre: 'Ritual de Luna Llena', tema: 'Un ritual para hacer con este guardián durante la luna llena', icono: '🌕', tipo: 'ritual' },
  { id: 'despertar', nombre: 'Meditación de Despertar', tema: 'Meditación matutina con la energía de este guardián', icono: '🌅', tipo: 'meditacion' },
  { id: 'proteccion', nombre: 'Círculo de Protección', tema: 'Ritual de protección guiado por este guardián', icono: '🛡️', tipo: 'ritual' },
  { id: 'abundancia', nombre: 'Activación de Abundancia', tema: 'Meditación para activar la abundancia con este guardián', icono: '💰', tipo: 'meditacion' },
  { id: 'sanacion', nombre: 'Sanación Profunda', tema: 'Sesión de sanación energética guiada', icono: '💚', tipo: 'sanacion' },
];

// ═══════════════════════════════════════════════════════════════
// ESTILOS REUTILIZABLES
// ═══════════════════════════════════════════════════════════════
const CARD_STYLE = {
  background: COLORS.bgCard,
  borderRadius: 16,
  border: `1px solid ${COLORS.border}`,
  overflow: 'hidden',
};

const GLASS_STYLE = {
  background: 'rgba(18, 18, 26, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid rgba(255,255,255,0.08)`,
};

const BUTTON_PRIMARY = {
  padding: '14px 28px',
  background: GRADIENTS.gold,
  border: 'none',
  borderRadius: 12,
  color: '#000',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 14,
  transition: 'all 0.2s',
};

const BUTTON_SECONDARY = {
  padding: '12px 20px',
  background: 'transparent',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  color: COLORS.text,
  cursor: 'pointer',
  fontSize: 13,
  transition: 'all 0.2s',
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function PersonajesPage() {
  // Estados principales
  const [paso, setPaso] = useState(1);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);

  // Estados de selección
  const [guardianSeleccionado, setGuardianSeleccionado] = useState(null);
  const [caracteristicasDetectadas, setCaracteristicasDetectadas] = useState(null);
  const [modoContenido, setModoContenido] = useState(null);
  const [tipoContenido, setTipoContenido] = useState(null);
  const [tema, setTema] = useState('');
  const [instrucciones, setInstrucciones] = useState('');

  // Estados de voz
  const [catalogoVoces, setCatalogoVoces] = useState(null);
  const [vozSeleccionada, setVozSeleccionada] = useState('auto');
  const [mostrarSelectorVoz, setMostrarSelectorVoz] = useState(false);
  const [categoriaVozActiva, setCategoriaVozActiva] = useState('todas');
  const [previewAudio, setPreviewAudio] = useState(null);
  const [generandoPreview, setGenerandoPreview] = useState(null);
  const [conIntro, setConIntro] = useState(true);

  // Estados de generación
  const [generando, setGenerando] = useState(false);
  const [generandoAudio, setGenerandoAudio] = useState(false);
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const [contenidoGenerado, setContenidoGenerado] = useState('');
  const [tituloGenerado, setTituloGenerado] = useState('');
  const [audioGenerado, setAudioGenerado] = useState(null);
  const [imagenGenerada, setImagenGenerada] = useState(null);

  // Estados de UI
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // ═══════════════════════════════════════════════════════════════
  // EFECTOS
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (guardianSeleccionado) {
      const caracteristicas = detectarCaracteristicas(guardianSeleccionado);
      setCaracteristicasDetectadas(caracteristicas);

      // Auto-seleccionar voz basada en características
      const vozRecomendada = ELEMENTO_A_VOZ[caracteristicas.elemento]?.[caracteristicas.genero] || 'thibisay';
      setVozSeleccionada(vozRecomendada);
    }
  }, [guardianSeleccionado]);

  // ═══════════════════════════════════════════════════════════════
  // FUNCIONES DE CARGA
  // ═══════════════════════════════════════════════════════════════
  const cargarDatos = async () => {
    setCargando(true);
    await Promise.all([cargarProductos(), cargarCatalogoVoces()]);
    setCargando(false);
  };

  const cargarProductos = async () => {
    try {
      await fetch('/api/admin/productos/sincronizar', { method: 'POST' });
      const res = await fetch('/api/admin/productos');
      const data = await res.json();
      if (data.success && data.productos) {
        setProductos(data.productos);
      }
    } catch (e) {
      console.error('Error cargando productos:', e);
    }
  };

  const cargarCatalogoVoces = async () => {
    try {
      const res = await fetch('/api/admin/voz/generar');
      const data = await res.json();
      if (data.success) {
        setCatalogoVoces(data);
      }
    } catch (e) {
      console.error('Error cargando voces:', e);
    }
  };

  const sincronizarProductos = async () => {
    setSincronizando(true);
    setError('');
    try {
      const res = await fetch('/api/admin/productos/sincronizar', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setExito(`¡${data.total} productos sincronizados!`);
        setTimeout(() => setExito(''), 3000);
        await cargarProductos();
      } else {
        setError(data.error || 'Error sincronizando');
      }
    } catch (e) {
      setError('Error de conexión');
    }
    setSincronizando(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // FUNCIONES DE VOZ
  // ═══════════════════════════════════════════════════════════════
  const previewVoz = async (vozId) => {
    if (generandoPreview) return;
    setGenerandoPreview(vozId);
    setPreviewAudio(null);
    try {
      const res = await fetch('/api/admin/voz/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voz: vozId, preview: true })
      });
      const data = await res.json();
      if (data.success) {
        setPreviewAudio({ vozId, audio: data.audio });
      }
    } catch (e) {
      console.error('Error preview:', e);
    }
    setGenerandoPreview(null);
  };

  const getVozInfo = () => {
    if (vozSeleccionada === 'auto') {
      const vozAuto = caracteristicasDetectadas
        ? ELEMENTO_A_VOZ[caracteristicasDetectadas.elemento]?.[caracteristicasDetectadas.genero]
        : 'thibisay';
      const vozData = catalogoVoces?.todasLasVoces?.find(v => v.id === vozAuto);
      return {
        nombre: `Auto: ${vozData?.nombre || 'Thibisay'}`,
        icono: vozData?.icono || '🎭',
        descripcion: 'Seleccionada según características del guardián'
      };
    }
    return catalogoVoces?.todasLasVoces?.find(v => v.id === vozSeleccionada) || null;
  };

  // ═══════════════════════════════════════════════════════════════
  // FUNCIONES DE GENERACIÓN
  // ═══════════════════════════════════════════════════════════════
  const generarContenido = async () => {
    if (!guardianSeleccionado || !tipoContenido || !tema.trim()) {
      setError('Completá todos los campos');
      return;
    }

    setGenerando(true);
    setError('');

    try {
      const caract = caracteristicasDetectadas;
      const esAudio = modoContenido === 'audio';

      const prompt = `Sos ${guardianSeleccionado.guardian || guardianSeleccionado.nombre}, un guardián mágico.

IDENTIDAD DEL GUARDIÁN:
- Nombre: ${guardianSeleccionado.guardian || guardianSeleccionado.nombre}
- Género: ${caract?.genero || 'neutro'}
- Elemento: ${caract?.elemento || 'éter'}
- Cristales: ${caract?.cristales?.join(', ') || 'cuarzo'}
- Propósito: ${caract?.proposito || 'guía espiritual'}
- Personalidad: ${caract?.personalidades?.join(', ') || 'mágico, sabio'}
- Historia: ${guardianSeleccionado.descripcion || 'Guardián ancestral del bosque'}

TIPO DE CONTENIDO: ${tipoContenido.nombre}
TEMA: ${tema}
${instrucciones ? `INSTRUCCIONES: ${instrucciones}` : ''}

${esAudio ? `
FORMATO PARA AUDIO:
- Hablá en primera persona como el guardián
- Usá pausas naturales (...) para dar ritmo
- Incluí momentos de respiración y silencio
- Sé inmersivo y cálido
- Español rioplatense (vos, tenés, podés)
` : `
FORMATO ESCRITO:
- Usá markdown (# títulos, ## subtítulos, **negrita**)
- Estructura clara con secciones
- Incluí consejos prácticos
- Español rioplatense
`}`;

      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: prompt,
          palabras: tipoContenido.palabras || 1000,
          categoria: caract?.elemento || 'esoterico',
          tipo: tipoContenido.id
        })
      });

      const data = await res.json();
      if (data.success) {
        setContenidoGenerado(data.contenido);
        setTituloGenerado(data.titulo || `${tipoContenido.nombre} con ${guardianSeleccionado.guardian}`);
        setPaso(4);
        setExito('¡Contenido generado!');
        setTimeout(() => setExito(''), 3000);

        // Auto-generar audio si es modo audio
        if (esAudio) {
          await generarAudioAutomatico(data.contenido);
        }
      } else {
        setError(data.error || 'Error generando');
      }
    } catch (e) {
      setError('Error: ' + e.message);
    }
    setGenerando(false);
  };

  const generarAudioAutomatico = async (texto) => {
    setGenerandoAudio(true);
    try {
      const vozFinal = vozSeleccionada === 'auto'
        ? ELEMENTO_A_VOZ[caracteristicasDetectadas?.elemento]?.[caracteristicasDetectadas?.genero] || 'thibisay'
        : vozSeleccionada;

      const textoLimpio = texto.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '').substring(0, 5000);

      const res = await fetch('/api/admin/voz/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: textoLimpio,
          voz: vozFinal,
          tipo: tipoContenido?.audioConfig || 'narracion',
          conIntro
        })
      });

      const data = await res.json();
      if (data.success) {
        setAudioGenerado(data.audio);
      }
    } catch (e) {
      console.error('Error audio:', e);
    }
    setGenerandoAudio(false);
  };

  const generarAudio = async () => {
    if (!contenidoGenerado) return;
    await generarAudioAutomatico(contenidoGenerado);
  };

  const generarImagen = async () => {
    if (!guardianSeleccionado) return;
    setGenerandoImagen(true);
    setError('');
    try {
      const caract = caracteristicasDetectadas;
      const prompt = `Magical forest guardian named ${guardianSeleccionado.guardian}, ${caract?.elemento} element, ${caract?.genero} energy, mystical ${tipoContenido?.id || 'meditation'} scene, ethereal lighting, ${caract?.cristales?.join(' and ') || 'crystals'}, enchanted atmosphere, fantasy art style`;

      const res = await fetch('/api/admin/imagen/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, estilo: 'duendes' })
      });

      const data = await res.json();
      if (data.success) {
        setImagenGenerada(data.url || data.imagen);
      } else {
        setError(data.error || 'Error generando imagen');
      }
    } catch (e) {
      setError('Error: ' + e.message);
    }
    setGenerandoImagen(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // FUNCIONES DE UI
  // ═══════════════════════════════════════════════════════════════
  const seleccionarGuardian = (producto) => {
    setGuardianSeleccionado(producto);
    setPaso(2);
  };

  const seleccionarModo = (modo) => {
    setModoContenido(modo);
    setPaso(3);
  };

  const usarPlantilla = (plantilla) => {
    setTema(plantilla.tema);
    const tipoEncontrado = [...MODOS_CONTENIDO.escrito.tipos, ...MODOS_CONTENIDO.audio.tipos].find(t => t.id === plantilla.tipo);
    if (tipoEncontrado) {
      setTipoContenido(tipoEncontrado);
      if (MODOS_CONTENIDO.audio.tipos.some(t => t.id === plantilla.tipo)) {
        setModoContenido('audio');
      } else {
        setModoContenido('escrito');
      }
    }
  };

  const resetear = () => {
    setPaso(1);
    setGuardianSeleccionado(null);
    setCaracteristicasDetectadas(null);
    setModoContenido(null);
    setTipoContenido(null);
    setTema('');
    setInstrucciones('');
    setContenidoGenerado('');
    setAudioGenerado(null);
    setImagenGenerada(null);
    setVozSeleccionada('auto');
  };

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(p =>
    !busqueda ||
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.guardian?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg }}>
      {/* ═══ HEADER ÉPICO ═══ */}
      <div style={{
        background: `linear-gradient(180deg, ${COLORS.bgElevated} 0%, ${COLORS.bg} 100%)`,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '28px 0'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: GRADIENTS.mixed,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28
              }}>
                🧙
              </div>
              <div>
                <h1 style={{ color: COLORS.text, fontSize: 28, fontWeight: 700, margin: 0 }}>
                  Canalizador de Guardianes
                </h1>
                <p style={{ color: COLORS.textSecondary, margin: '4px 0 0', fontSize: 14 }}>
                  Creá contenido mágico desde la esencia de tus productos
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={sincronizarProductos}
                disabled={sincronizando}
                style={{
                  ...BUTTON_SECONDARY,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderColor: COLORS.cyan,
                  color: COLORS.cyan
                }}
              >
                {sincronizando ? '⏳' : '🔄'} Sincronizar WooCommerce
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { num: 1, label: 'Elegir Guardián', color: COLORS.cyan },
              { num: 2, label: 'Modo de Contenido', color: COLORS.purple },
              { num: 3, label: 'Configurar', color: COLORS.orange },
              { num: 4, label: 'Resultado', color: COLORS.emerald }
            ].map((step) => (
              <div key={step.num} style={{
                flex: 1,
                padding: '12px 16px',
                background: paso >= step.num ? `${step.color}15` : COLORS.bgCard,
                border: `1px solid ${paso >= step.num ? step.color : COLORS.border}`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.3s'
              }}>
                <span style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: paso >= step.num ? step.color : COLORS.border,
                  color: paso >= step.num ? '#fff' : COLORS.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {paso > step.num ? '✓' : step.num}
                </span>
                <span style={{
                  color: paso >= step.num ? step.color : COLORS.textMuted,
                  fontSize: 13,
                  fontWeight: paso === step.num ? 600 : 400
                }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENIDO PRINCIPAL ═══ */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>

        {/* Mensajes */}
        {error && (
          <div style={{
            padding: 16,
            background: `${COLORS.error}15`,
            border: `1px solid ${COLORS.error}`,
            borderRadius: 12,
            color: COLORS.error,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: COLORS.error, cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {exito && (
          <div style={{
            padding: 16,
            background: `${COLORS.success}15`,
            border: `1px solid ${COLORS.success}`,
            borderRadius: 12,
            color: COLORS.success,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span style={{ fontSize: 20 }}>✨</span>
            <span>{exito}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PASO 1: ELEGIR GUARDIÁN */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {paso === 1 && (
          <div>
            {/* Explicación */}
            <div style={{
              ...CARD_STYLE,
              padding: 24,
              marginBottom: 24,
              background: `linear-gradient(135deg, ${COLORS.cyan}10, ${COLORS.purple}10)`,
              borderColor: `${COLORS.cyan}33`
            }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ fontSize: 40 }}>💡</div>
                <div>
                  <h3 style={{ color: COLORS.text, margin: '0 0 8px', fontSize: 18 }}>
                    ¿Qué es el Canalizador de Guardianes?
                  </h3>
                  <p style={{ color: COLORS.textSecondary, margin: 0, lineHeight: 1.6 }}>
                    Esta herramienta <strong style={{ color: COLORS.cyan }}>analiza automáticamente</strong> las características de cada producto
                    (género, elemento, cristales, propósito) y genera contenido <strong style={{ color: COLORS.purple }}>desde la perspectiva del guardián</strong>.
                    Podés crear desde artículos de blog hasta meditaciones guiadas con audio, todo manteniendo la esencia única de cada guardián.
                  </p>
                </div>
              </div>
            </div>

            {/* Buscador */}
            <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="🔍 Buscar guardián por nombre..."
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 12,
                    color: COLORS.text,
                    fontSize: 15,
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ color: COLORS.textMuted, fontSize: 14 }}>
                {productosFiltrados.length} de {productos.length} productos
              </div>
            </div>

            {/* Grid de Guardianes */}
            {cargando ? (
              <div style={{ textAlign: 'center', padding: 80 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  border: `3px solid ${COLORS.border}`,
                  borderTopColor: COLORS.gold,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px'
                }} />
                <p style={{ color: COLORS.textMuted }}>Invocando guardianes...</p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div style={{ ...CARD_STYLE, padding: 60, textAlign: 'center' }}>
                <span style={{ fontSize: 56, display: 'block', marginBottom: 16 }}>🌲</span>
                <h3 style={{ color: COLORS.text, marginBottom: 8 }}>No se encontraron guardianes</h3>
                <p style={{ color: COLORS.textMuted, marginBottom: 24 }}>
                  {busqueda ? 'Probá con otra búsqueda' : 'Sincronizá con WooCommerce para cargar tus productos'}
                </p>
                {!busqueda && (
                  <button onClick={sincronizarProductos} style={BUTTON_PRIMARY}>
                    🔄 Sincronizar Productos
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20
              }}>
                {productosFiltrados.map((producto) => {
                  const caract = detectarCaracteristicas(producto);
                  const colorElemento = {
                    tierra: COLORS.amber,
                    agua: COLORS.cyan,
                    fuego: COLORS.orange,
                    aire: COLORS.purple,
                    eter: COLORS.violet
                  }[caract.elemento] || COLORS.gold;

                  return (
                    <button
                      key={producto.id}
                      onClick={() => seleccionarGuardian(producto)}
                      style={{
                        ...CARD_STYLE,
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Imagen */}
                      <div style={{
                        height: 180,
                        background: producto.imagen
                          ? `url(${producto.imagen}) center/cover`
                          : `linear-gradient(135deg, ${colorElemento}44, ${COLORS.bgCard})`,
                        position: 'relative'
                      }}>
                        {/* Badge de confianza */}
                        <div style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          padding: '4px 10px',
                          background: 'rgba(0,0,0,0.7)',
                          borderRadius: 20,
                          fontSize: 11,
                          color: caract.confianza > 50 ? COLORS.success : COLORS.warning,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          🎯 {caract.confianza}% detectado
                        </div>

                        {/* Overlay con info rápida */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '40px 16px 12px',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.9))'
                        }}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '3px 8px',
                              background: `${colorElemento}33`,
                              borderRadius: 6,
                              fontSize: 11,
                              color: colorElemento
                            }}>
                              {caract.elemento}
                            </span>
                            <span style={{
                              padding: '3px 8px',
                              background: `${COLORS.pink}33`,
                              borderRadius: 6,
                              fontSize: 11,
                              color: COLORS.pink
                            }}>
                              {caract.genero}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: 16 }}>
                        <h3 style={{ color: COLORS.text, fontSize: 17, margin: '0 0 6px', fontWeight: 600 }}>
                          {producto.guardian || producto.nombre?.split(' - ')[0] || producto.nombre}
                        </h3>
                        <p style={{
                          color: COLORS.textMuted,
                          fontSize: 13,
                          margin: '0 0 12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.5
                        }}>
                          {producto.descripcion?.substring(0, 100) || 'Guardián mágico del bosque encantado'}
                        </p>

                        {/* Tags */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {caract.cristales?.slice(0, 2).map((cristal, i) => (
                            <span key={i} style={{
                              padding: '3px 8px',
                              background: COLORS.bgHover,
                              borderRadius: 4,
                              fontSize: 10,
                              color: COLORS.textSecondary
                            }}>
                              💎 {cristal}
                            </span>
                          ))}
                          <span style={{
                            padding: '3px 8px',
                            background: COLORS.bgHover,
                            borderRadius: 4,
                            fontSize: 10,
                            color: COLORS.textSecondary
                          }}>
                            ✨ {caract.proposito}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PASO 2: MODO DE CONTENIDO */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {paso === 2 && guardianSeleccionado && (
          <div>
            {/* Guardian seleccionado */}
            <div style={{
              ...CARD_STYLE,
              padding: 20,
              marginBottom: 24,
              display: 'flex',
              gap: 20,
              alignItems: 'center',
              background: `linear-gradient(135deg, ${COLORS.bgCard}, ${COLORS.bgElevated})`
            }}>
              <div style={{
                width: 100,
                height: 100,
                borderRadius: 16,
                background: guardianSeleccionado.imagen
                  ? `url(${guardianSeleccionado.imagen}) center/cover`
                  : GRADIENTS.purple,
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ color: COLORS.gold, fontSize: 22, margin: '0 0 8px' }}>
                  {guardianSeleccionado.guardian || guardianSeleccionado.nombre}
                </h2>

                {/* Características detectadas */}
                {caracteristicasDetectadas && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ padding: '4px 10px', background: `${COLORS.cyan}22`, borderRadius: 6, fontSize: 12, color: COLORS.cyan }}>
                      {caracteristicasDetectadas.elemento}
                    </span>
                    <span style={{ padding: '4px 10px', background: `${COLORS.pink}22`, borderRadius: 6, fontSize: 12, color: COLORS.pink }}>
                      {caracteristicasDetectadas.genero}
                    </span>
                    <span style={{ padding: '4px 10px', background: `${COLORS.emerald}22`, borderRadius: 6, fontSize: 12, color: COLORS.emerald }}>
                      {caracteristicasDetectadas.proposito}
                    </span>
                    {caracteristicasDetectadas.personalidades?.slice(0, 2).map((p, i) => (
                      <span key={i} style={{ padding: '4px 10px', background: `${COLORS.purple}22`, borderRadius: 6, fontSize: 12, color: COLORS.purple }}>
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setPaso(1)} style={{ ...BUTTON_SECONDARY, fontSize: 12 }}>
                Cambiar ←
              </button>
            </div>

            {/* Explicación */}
            <div style={{
              ...CARD_STYLE,
              padding: 20,
              marginBottom: 24,
              background: `linear-gradient(135deg, ${COLORS.purple}08, ${COLORS.cyan}08)`,
              borderColor: `${COLORS.purple}33`
            }}>
              <h3 style={{ color: COLORS.text, margin: '0 0 8px', fontSize: 16 }}>
                🎯 ¿Qué querés crear?
              </h3>
              <p style={{ color: COLORS.textSecondary, margin: 0, fontSize: 14 }}>
                Elegí entre <strong style={{ color: COLORS.cyan }}>Material Escrito</strong> (artículos, guías, posts)
                o <strong style={{ color: COLORS.purple }}>Contenido con Audio</strong> (meditaciones, rituales, cuentos narrados).
              </p>
            </div>

            {/* Selector de modo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
              {Object.values(MODOS_CONTENIDO).map((modo) => (
                <button
                  key={modo.id}
                  onClick={() => seleccionarModo(modo.id)}
                  style={{
                    ...CARD_STYLE,
                    padding: 28,
                    cursor: 'pointer',
                    textAlign: 'left',
                    border: `2px solid ${COLORS.border}`,
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = modo.color;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.border;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: modo.gradient
                  }} />

                  <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{modo.icono}</span>
                  <h3 style={{ color: COLORS.text, fontSize: 20, margin: '0 0 8px' }}>{modo.nombre}</h3>
                  <p style={{ color: COLORS.textSecondary, margin: '0 0 20px', fontSize: 14 }}>{modo.descripcion}</p>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {modo.tipos.slice(0, 4).map((tipo) => (
                      <span key={tipo.id} style={{
                        padding: '6px 10px',
                        background: `${modo.color}15`,
                        borderRadius: 6,
                        fontSize: 12,
                        color: modo.color
                      }}>
                        {tipo.icono} {tipo.nombre}
                      </span>
                    ))}
                    {modo.tipos.length > 4 && (
                      <span style={{ padding: '6px 10px', fontSize: 12, color: COLORS.textMuted }}>
                        +{modo.tipos.length - 4} más
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Plantillas rápidas */}
            <div>
              <h3 style={{ color: COLORS.text, fontSize: 16, marginBottom: 16 }}>
                ⚡ Plantillas Rápidas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {PLANTILLAS.map((plantilla) => (
                  <button
                    key={plantilla.id}
                    onClick={() => usarPlantilla(plantilla)}
                    style={{
                      padding: '14px 16px',
                      background: COLORS.bgCard,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{plantilla.icono}</span>
                    <span style={{ color: COLORS.text, fontSize: 13 }}>{plantilla.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PASO 3: CONFIGURAR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {paso === 3 && modoContenido && (
          <div>
            {/* Header con info del guardián */}
            <div style={{
              ...CARD_STYLE,
              padding: 16,
              marginBottom: 24,
              display: 'flex',
              gap: 16,
              alignItems: 'center'
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                background: guardianSeleccionado?.imagen
                  ? `url(${guardianSeleccionado.imagen}) center/cover`
                  : GRADIENTS.purple
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.gold, fontWeight: 600 }}>
                  {guardianSeleccionado?.guardian || guardianSeleccionado?.nombre}
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
                  {MODOS_CONTENIDO[modoContenido]?.icono} {MODOS_CONTENIDO[modoContenido]?.nombre}
                </div>
              </div>
              <button onClick={() => setPaso(2)} style={{ ...BUTTON_SECONDARY, fontSize: 12 }}>
                ← Cambiar modo
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
              {/* Columna principal */}
              <div>
                {/* Tipo de contenido */}
                <div style={{ ...CARD_STYLE, padding: 24, marginBottom: 20 }}>
                  <h3 style={{ color: COLORS.text, margin: '0 0 16px', fontSize: 16 }}>
                    1️⃣ Tipo de contenido
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                    {MODOS_CONTENIDO[modoContenido]?.tipos.map((tipo) => (
                      <button
                        key={tipo.id}
                        onClick={() => setTipoContenido(tipo)}
                        style={{
                          padding: '14px',
                          background: tipoContenido?.id === tipo.id ? `${MODOS_CONTENIDO[modoContenido].color}22` : COLORS.bgHover,
                          border: `2px solid ${tipoContenido?.id === tipo.id ? MODOS_CONTENIDO[modoContenido].color : 'transparent'}`,
                          borderRadius: 10,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{tipo.icono}</span>
                        <span style={{ color: COLORS.text, fontSize: 13, display: 'block' }}>{tipo.nombre}</span>
                        <span style={{ color: COLORS.textMuted, fontSize: 11 }}>~{tipo.palabras} palabras</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tema */}
                <div style={{ ...CARD_STYLE, padding: 24, marginBottom: 20 }}>
                  <h3 style={{ color: COLORS.text, margin: '0 0 16px', fontSize: 16 }}>
                    2️⃣ ¿Sobre qué tema?
                  </h3>
                  <input
                    type="text"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    placeholder="Ej: Conectar con la abundancia durante luna llena"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: COLORS.bgHover,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 10,
                      color: COLORS.text,
                      fontSize: 15,
                      outline: 'none',
                      marginBottom: 12
                    }}
                  />
                  <textarea
                    value={instrucciones}
                    onChange={(e) => setInstrucciones(e.target.value)}
                    placeholder="Instrucciones adicionales (opcional): tono específico, puntos a incluir, etc."
                    style={{
                      width: '100%',
                      minHeight: 80,
                      padding: '14px 16px',
                      background: COLORS.bgHover,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 10,
                      color: COLORS.text,
                      fontSize: 14,
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Configuración de voz (solo para audio) */}
                {modoContenido === 'audio' && (
                  <div style={{
                    ...CARD_STYLE,
                    padding: 24,
                    marginBottom: 20,
                    background: `linear-gradient(135deg, ${COLORS.purple}10, ${COLORS.bgCard})`,
                    borderColor: `${COLORS.purple}33`
                  }}>
                    <h3 style={{ color: COLORS.text, margin: '0 0 16px', fontSize: 16 }}>
                      3️⃣ Configuración de Voz
                    </h3>

                    <button
                      onClick={() => setMostrarSelectorVoz(true)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: COLORS.bgHover,
                        border: `2px solid ${COLORS.purple}44`,
                        borderRadius: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        marginBottom: 12
                      }}
                    >
                      <span style={{ fontSize: 32 }}>{getVozInfo()?.icono || '🎭'}</span>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ color: COLORS.text, fontWeight: 600 }}>{getVozInfo()?.nombre}</div>
                        <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{getVozInfo()?.descripcion}</div>
                      </div>
                      <span style={{ color: COLORS.purple }}>Cambiar →</span>
                    </button>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      background: conIntro ? `${COLORS.gold}15` : COLORS.bgHover,
                      border: `1px solid ${conIntro ? COLORS.gold : COLORS.border}`,
                      borderRadius: 10,
                      cursor: 'pointer'
                    }}>
                      <input type="checkbox" checked={conIntro} onChange={(e) => setConIntro(e.target.checked)} style={{ display: 'none' }} />
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: `2px solid ${conIntro ? COLORS.gold : COLORS.border}`,
                        background: conIntro ? COLORS.gold : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        fontSize: 14,
                        fontWeight: 700
                      }}>
                        {conIntro && '✓'}
                      </span>
                      <div>
                        <div style={{ color: COLORS.text, fontSize: 14 }}>Incluir intro del personaje</div>
                        <div style={{ color: COLORS.textMuted, fontSize: 12 }}>El personaje se presenta antes del contenido</div>
                      </div>
                    </label>
                  </div>
                )}

                {/* Botón generar */}
                <button
                  onClick={generarContenido}
                  disabled={generando || !tipoContenido || !tema.trim()}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: (generando || !tipoContenido || !tema.trim()) ? COLORS.bgHover : GRADIENTS.gold,
                    border: 'none',
                    borderRadius: 14,
                    color: (generando || !tipoContenido || !tema.trim()) ? COLORS.textMuted : '#000',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: (generando || !tipoContenido || !tema.trim()) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10
                  }}
                >
                  {generando ? (
                    <>
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                      Canalizando con {guardianSeleccionado?.guardian}...
                    </>
                  ) : (
                    <>✨ Generar Contenido</>
                  )}
                </button>
              </div>

              {/* Sidebar - Info detectada */}
              <div>
                <div style={{ ...CARD_STYLE, padding: 20, position: 'sticky', top: 20 }}>
                  <h4 style={{ color: COLORS.gold, margin: '0 0 16px', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
                    🎯 Info Detectada
                  </h4>

                  {caracteristicasDetectadas && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ padding: '12px', background: COLORS.bgHover, borderRadius: 10 }}>
                        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>GÉNERO</div>
                        <div style={{ color: COLORS.pink, fontWeight: 600 }}>{caracteristicasDetectadas.genero}</div>
                      </div>
                      <div style={{ padding: '12px', background: COLORS.bgHover, borderRadius: 10 }}>
                        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>ELEMENTO</div>
                        <div style={{ color: COLORS.cyan, fontWeight: 600 }}>{caracteristicasDetectadas.elemento}</div>
                      </div>
                      <div style={{ padding: '12px', background: COLORS.bgHover, borderRadius: 10 }}>
                        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>PROPÓSITO</div>
                        <div style={{ color: COLORS.emerald, fontWeight: 600 }}>{caracteristicasDetectadas.proposito}</div>
                      </div>
                      <div style={{ padding: '12px', background: COLORS.bgHover, borderRadius: 10 }}>
                        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>CRISTALES</div>
                        <div style={{ color: COLORS.purple, fontWeight: 600 }}>{caracteristicasDetectadas.cristales?.join(', ')}</div>
                      </div>
                      <div style={{ padding: '12px', background: COLORS.bgHover, borderRadius: 10 }}>
                        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 4 }}>PERSONALIDAD</div>
                        <div style={{ color: COLORS.orange, fontWeight: 600 }}>{caracteristicasDetectadas.personalidades?.join(', ')}</div>
                      </div>

                      {/* Barra de confianza */}
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ color: COLORS.textMuted, fontSize: 11 }}>Confianza de detección</span>
                          <span style={{ color: caracteristicasDetectadas.confianza > 50 ? COLORS.success : COLORS.warning, fontSize: 11 }}>
                            {caracteristicasDetectadas.confianza}%
                          </span>
                        </div>
                        <div style={{ height: 6, background: COLORS.bgHover, borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${caracteristicasDetectadas.confianza}%`,
                            height: '100%',
                            background: caracteristicasDetectadas.confianza > 50 ? COLORS.success : COLORS.warning,
                            borderRadius: 3
                          }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PASO 4: RESULTADO */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {paso === 4 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
              {/* Contenido principal */}
              <div>
                <div style={{ ...CARD_STYLE, padding: 24, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2 style={{ color: COLORS.gold, fontSize: 20, margin: 0 }}>{tituloGenerado}</h2>
                    <span style={{ color: COLORS.textMuted, fontSize: 12 }}>
                      {contenidoGenerado.split(/\s+/).length} palabras
                    </span>
                  </div>

                  <textarea
                    value={contenidoGenerado}
                    onChange={(e) => setContenidoGenerado(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 400,
                      padding: 20,
                      background: COLORS.bgHover,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 12,
                      color: COLORS.text,
                      fontSize: 14,
                      lineHeight: 1.8,
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Audio y Media */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Audio */}
                  <div style={{ ...CARD_STYLE, padding: 20 }}>
                    <h4 style={{ color: COLORS.text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      🎙️ Audio {modoContenido === 'audio' && <span style={{ fontSize: 10, color: COLORS.success }}>(auto)</span>}
                    </h4>

                    {audioGenerado ? (
                      <div>
                        <audio controls src={`data:audio/mpeg;base64,${audioGenerado}`} style={{ width: '100%', marginBottom: 12 }} />
                        <p style={{ color: COLORS.success, fontSize: 12, textAlign: 'center' }}>✓ Audio listo</p>
                      </div>
                    ) : (
                      <button
                        onClick={generarAudio}
                        disabled={generandoAudio}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: generandoAudio ? COLORS.bgHover : GRADIENTS.purple,
                          border: 'none',
                          borderRadius: 10,
                          color: '#fff',
                          fontWeight: 600,
                          cursor: generandoAudio ? 'wait' : 'pointer'
                        }}
                      >
                        {generandoAudio ? '⏳ Generando...' : '🎙️ Generar Audio'}
                      </button>
                    )}
                  </div>

                  {/* Imagen */}
                  <div style={{ ...CARD_STYLE, padding: 20 }}>
                    <h4 style={{ color: COLORS.text, margin: '0 0 16px' }}>🖼️ Imagen</h4>

                    {imagenGenerada ? (
                      <div>
                        <img src={imagenGenerada} alt="Guardián" style={{ width: '100%', borderRadius: 10, marginBottom: 12 }} />
                        <p style={{ color: COLORS.success, fontSize: 12, textAlign: 'center' }}>✓ Imagen lista</p>
                      </div>
                    ) : (
                      <button
                        onClick={generarImagen}
                        disabled={generandoImagen}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: generandoImagen ? COLORS.bgHover : GRADIENTS.cyan,
                          border: 'none',
                          borderRadius: 10,
                          color: '#fff',
                          fontWeight: 600,
                          cursor: generandoImagen ? 'wait' : 'pointer'
                        }}
                      >
                        {generandoImagen ? '⏳ Generando...' : '🖼️ Generar Imagen'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div style={{ ...CARD_STYLE, padding: 20, position: 'sticky', top: 20 }}>
                  <div style={{
                    width: '100%',
                    height: 140,
                    borderRadius: 12,
                    background: guardianSeleccionado?.imagen
                      ? `url(${guardianSeleccionado.imagen}) center/cover`
                      : GRADIENTS.purple,
                    marginBottom: 16
                  }} />

                  <h3 style={{ color: COLORS.gold, fontSize: 18, margin: '0 0 4px' }}>
                    {guardianSeleccionado?.guardian}
                  </h3>
                  <p style={{ color: COLORS.textMuted, fontSize: 13, margin: '0 0 20px' }}>
                    {tipoContenido?.icono} {tipoContenido?.nombre}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button onClick={resetear} style={{ ...BUTTON_SECONDARY, width: '100%' }}>
                      🔄 Crear otro contenido
                    </button>
                    <button style={{
                      ...BUTTON_PRIMARY,
                      width: '100%',
                      background: GRADIENTS.emerald
                    }}>
                      📤 Publicar en el Círculo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL SELECTOR DE VOZ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {mostrarSelectorVoz && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }} onClick={() => setMostrarSelectorVoz(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...GLASS_STYLE,
              width: '100%',
              maxWidth: 1000,
              maxHeight: '90vh',
              borderRadius: 24,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: `linear-gradient(135deg, ${COLORS.purple}15, ${COLORS.bgCard})`
            }}>
              <div>
                <h3 style={{ color: COLORS.text, fontSize: 22, margin: 0 }}>🎙️ Voces Premium</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 14, margin: '4px 0 0' }}>
                  {catalogoVoces?.total || 0} voces ultra-realistas • <span style={{ color: COLORS.success }}>Suenan humanas, no a IA</span>
                </p>
              </div>
              <button
                onClick={() => setMostrarSelectorVoz(false)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: COLORS.bgHover,
                  border: 'none',
                  color: COLORS.text,
                  fontSize: 20,
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Info Premium */}
            <div style={{
              padding: '14px 28px',
              background: `linear-gradient(90deg, ${COLORS.gold}15, transparent)`,
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 20 }}>⭐</span>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, margin: 0 }}>
                <strong style={{ color: COLORS.gold }}>Todas las voces son premium</strong> -
                Seleccionamos solo las voces que suenan más naturales y humanas de ElevenLabs.
                Las marcadas con <span style={{ color: COLORS.success }}>✓ Recomendada</span> son las mejores para cada caso.
              </p>
            </div>

            {/* Filtros */}
            <div style={{
              padding: '14px 28px',
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              background: COLORS.bgCard
            }}>
              <button
                onClick={() => setCategoriaVozActiva('todas')}
                style={{
                  padding: '10px 18px',
                  background: categoriaVozActiva === 'todas' ? COLORS.gold : 'transparent',
                  border: `1px solid ${categoriaVozActiva === 'todas' ? COLORS.gold : COLORS.border}`,
                  borderRadius: 25,
                  color: categoriaVozActiva === 'todas' ? '#000' : COLORS.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Todas
              </button>
              {catalogoVoces && Object.entries(catalogoVoces.categorias || {}).map(([catId, cat]) => (
                <button
                  key={catId}
                  onClick={() => setCategoriaVozActiva(catId)}
                  style={{
                    padding: '10px 18px',
                    background: categoriaVozActiva === catId ? COLORS.gold : 'transparent',
                    border: `1px solid ${categoriaVozActiva === catId ? COLORS.gold : COLORS.border}`,
                    borderRadius: 25,
                    color: categoriaVozActiva === catId ? '#000' : COLORS.text,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <span>{cat.icono}</span>
                  {cat.nombre}
                </button>
              ))}
            </div>

            {/* Lista de voces */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16
              }}>
                {catalogoVoces?.todasLasVoces
                  ?.filter(v => categoriaVozActiva === 'todas' || v.categoria === categoriaVozActiva)
                  .map(voz => (
                    <div
                      key={voz.id}
                      style={{
                        padding: 18,
                        background: vozSeleccionada === voz.id ? `${COLORS.purple}20` : COLORS.bgCard,
                        border: `2px solid ${vozSeleccionada === voz.id ? COLORS.purple : COLORS.border}`,
                        borderRadius: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 36 }}>{voz.icono}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {voz.nombre}
                            {voz.recomendada && (
                              <span style={{
                                padding: '2px 6px',
                                background: `${COLORS.success}25`,
                                borderRadius: 4,
                                fontSize: 9,
                                color: COLORS.success,
                                fontWeight: 700
                              }}>
                                ✓ RECOMENDADA
                              </span>
                            )}
                          </div>
                          <div style={{ color: COLORS.textMuted, fontSize: 12 }}>
                            {voz.genero} • {voz.edad} • {voz.estilo}
                          </div>
                        </div>
                        {voz.tieneIntro && (
                          <span style={{
                            padding: '3px 8px',
                            background: `${COLORS.gold}25`,
                            borderRadius: 6,
                            fontSize: 10,
                            color: COLORS.gold
                          }}>
                            INTRO
                          </span>
                        )}
                      </div>

                      <p style={{ color: COLORS.textSecondary, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                        {voz.descripcion}
                      </p>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          onClick={() => previewVoz(voz.id)}
                          disabled={generandoPreview === voz.id}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: COLORS.bgHover,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 10,
                            color: COLORS.text,
                            cursor: generandoPreview === voz.id ? 'wait' : 'pointer',
                            fontSize: 13
                          }}
                        >
                          {generandoPreview === voz.id ? '⏳...' : previewAudio?.vozId === voz.id ? '🔊 Escuchar' : '▶️ Preview'}
                        </button>
                        <button
                          onClick={() => { setVozSeleccionada(voz.id); setMostrarSelectorVoz(false); }}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: vozSeleccionada === voz.id ? COLORS.purple : `${COLORS.purple}30`,
                            border: 'none',
                            borderRadius: 10,
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 13
                          }}
                        >
                          {vozSeleccionada === voz.id ? '✓ Elegida' : 'Elegir'}
                        </button>
                      </div>

                      {previewAudio?.vozId === voz.id && (
                        <audio controls autoPlay src={`data:audio/mpeg;base64,${previewAudio.audio}`} style={{ width: '100%', height: 36 }} />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:hover { opacity: 0.9; }
        input:focus, textarea:focus { border-color: ${COLORS.purple} !important; }
      `}</style>
    </div>
  );
}
