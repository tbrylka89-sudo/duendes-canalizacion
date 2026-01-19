'use client';
import { useState, useEffect, useCallback } from 'react';
import './maestro.css';
import ReplicateExplorer from './ReplicateExplorer';
import CursosAdmin from './CursosAdmin';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN MAESTRO - PANEL DE CONTENIDO DEL CÍRCULO
// Diseño premium con estética de grimorio antiguo (fondo claro)
// ═══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { id: 'duende', nombre: 'Duende de la Semana', icon: '🧙' },
  { id: 'crear', nombre: 'Crear Contenido', icon: '✨' },
  { id: 'imagenes', nombre: 'Generador IA', icon: '🎨' },
  { id: 'masivo', nombre: 'Generador Masivo', icon: '📅' },
  { id: 'historial', nombre: 'Historial', icon: '📋' },
  { id: 'cursos', nombre: 'Cursos', icon: '📚' },
  { id: 'archivos', nombre: 'Subir Archivos', icon: '📤' },
  { id: 'regalos', nombre: 'Regalos al Círculo', icon: '🎁' },
  { id: 'calendario', nombre: 'Calendario', icon: '📆' },
  { id: 'conexiones', nombre: 'Conexiones', icon: '⚙️' }
];

const TIPOS_CONTENIDO = [
  { id: 'mensaje', nombre: 'Mensaje del Día', icon: '📜', desc: 'Reflexión inspiradora' },
  { id: 'meditacion', nombre: 'Meditación', icon: '🧘', desc: 'Viaje interior guiado' },
  { id: 'ritual', nombre: 'Ritual', icon: '🕯️', desc: 'Práctica paso a paso' },
  { id: 'conocimiento', nombre: 'Conocimiento', icon: '💎', desc: 'Cristales, hierbas, runas' },
  { id: 'historia', nombre: 'Leyenda', icon: '📖', desc: 'Historia con enseñanza' },
  { id: 'diy', nombre: 'DIY Mágico', icon: '🪄', desc: 'Proyecto práctico' }
];

export default function AdminMaestro() {
  const [tabActiva, setTabActiva] = useState('duende');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Estado global
  const [conexiones, setConexiones] = useState(null);
  const [duendes, setDuendes] = useState([]);
  const [duendeActual, setDuendeActual] = useState(null);

  // Estado crear contenido
  const [tipoContenido, setTipoContenido] = useState('mensaje');
  const [temaContenido, setTemaContenido] = useState('');
  const [generando, setGenerando] = useState(false);
  const [contenidoGenerado, setContenidoGenerado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState('');
  const [modeloTexto, setModeloTexto] = useState('claude'); // 'claude' | 'gemini'
  const [mostrarRefinamientoTexto, setMostrarRefinamientoTexto] = useState(false);
  const [instruccionRefinamientoTexto, setInstruccionRefinamientoTexto] = useState('');

  // Opciones rápidas de refinamiento para contenido
  const opcionesRefinamientoTexto = [
    { label: '📝 Más largo', instruccion: 'Extendé el contenido, agregá más párrafos y profundizá en los conceptos.' },
    { label: '✂️ Más corto', instruccion: 'Hacelo más conciso, mantené solo lo esencial.' },
    { label: '🔮 Más místico', instruccion: 'Agregá más elementos místicos, referencias espirituales y lenguaje evocador.' },
    { label: '💬 Más cercano', instruccion: 'Hacelo más personal y cercano, como hablándole a una amiga.' },
    { label: '📚 Más profundo', instruccion: 'Profundizá más en el tema, agregá capas de significado.' },
    { label: '✨ Más inspirador', instruccion: 'Hacelo más motivacional e inspirador, que deje ganas de actuar.' },
    { label: '🧘 Más calmado', instruccion: 'Tono más sereno y meditativo, ritmo más pausado.' },
    { label: '💪 Más directo', instruccion: 'Sé más directa y práctica, menos poético.' },
  ];
  const [imagenGenerada, setImagenGenerada] = useState(null);
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const [editandoImagenDuende, setEditandoImagenDuende] = useState(false);
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState('');

  // Estado generador de imágenes/videos
  const [modeloImagen, setModeloImagen] = useState('dalle3');
  const [promptImagen, setPromptImagen] = useState('');
  const [imagenReferencia, setImagenReferencia] = useState(null);
  const [mostrarOpcionesImagen, setMostrarOpcionesImagen] = useState(false);

  // Modelos disponibles
  const MODELOS_IMAGEN = {
    openai: [
      { id: 'dalle3', nombre: 'DALL-E 3', icon: '🎨', desc: 'OpenAI - Alta calidad, $0.04/img', tipo: 'imagen' },
    ],
    replicate_rapidos: [
      { id: 'flux-schnell', nombre: 'Flux Schnell', icon: '⚡', desc: 'Muy rápido, $0.003/img', tipo: 'imagen' },
      { id: 'sdxl-lightning', nombre: 'SDXL Lightning', icon: '🌩️', desc: 'Ultra rápido, $0.002/img', tipo: 'imagen' },
      { id: 'playground', nombre: 'Playground v2.5', icon: '🎮', desc: 'Rápido y bueno, $0.004/img', tipo: 'imagen' },
    ],
    replicate_calidad: [
      { id: 'flux-pro', nombre: 'Flux 1.1 Pro', icon: '✨', desc: 'Máxima calidad, $0.04/img', tipo: 'imagen' },
      { id: 'flux-dev', nombre: 'Flux Dev', icon: '🔬', desc: 'Balance calidad/precio, $0.025/img', tipo: 'imagen' },
      { id: 'sd35-large', nombre: 'SD 3.5 Large', icon: '🏔️', desc: 'Stable Diffusion 3.5, $0.035/img', tipo: 'imagen' },
      { id: 'ideogram', nombre: 'Ideogram v2', icon: '🔤', desc: 'Excelente con texto, $0.08/img', tipo: 'imagen' },
      { id: 'recraft', nombre: 'Recraft V3', icon: '🎭', desc: 'Estilo artístico, $0.04/img', tipo: 'imagen' },
    ],
    replicate_foto: [
      { id: 'realvis', nombre: 'RealVisXL', icon: '📷', desc: 'Fotorrealista, $0.002/img', tipo: 'imagen' },
      { id: 'juggernaut', nombre: 'Juggernaut XL', icon: '🦁', desc: 'Fotorrealismo extremo, $0.003/img', tipo: 'imagen' },
      { id: 'sdxl', nombre: 'SDXL', icon: '🖼️', desc: 'Clásico versátil, $0.002/img', tipo: 'imagen' },
    ],
    replicate_artistico: [
      { id: 'dreamshaper', nombre: 'DreamShaper XL', icon: '💫', desc: 'Fantasía y sueños, $0.003/img', tipo: 'imagen' },
      { id: 'animagine', nombre: 'Animagine XL', icon: '🎌', desc: 'Estilo anime, $0.002/img', tipo: 'imagen' },
      { id: 'openjourney', nombre: 'Openjourney', icon: '🎪', desc: 'Estilo Midjourney, $0.002/img', tipo: 'imagen' },
    ],
    video: [
      { id: 'minimax-video', nombre: 'Minimax', icon: '🎬', desc: 'Video texto, $0.25/5s', tipo: 'video' },
      { id: 'luma-dream', nombre: 'Luma Dream', icon: '🌙', desc: 'Cinematográfico, $0.30/5s', tipo: 'video' },
      { id: 'kling-video', nombre: 'Kling', icon: '🎥', desc: 'Realista, $0.10/5s', tipo: 'video' },
      { id: 'haiper', nombre: 'Haiper', icon: '🚀', desc: 'Rápido, $0.05/4s', tipo: 'video' },
    ],
    gemini: [
      { id: 'nano-banana', nombre: 'Nano Banana Pro', icon: '🍌', desc: 'Gemini 2.0 Flash (mejor imagen)', tipo: 'imagen' },
    ]
  };

  // Estado generador masivo
  const [modoMasivo, setModoMasivo] = useState('semana');
  const [previewMasivo, setPreviewMasivo] = useState(null);
  const [generandoMasivo, setGenerandoMasivo] = useState(false);
  const [fechaInicioMasivo, setFechaInicioMasivo] = useState('');
  const [estiloImagenMasivo, setEstiloImagenMasivo] = useState('fotorealista');
  const [generarImagenesMasivo, setGenerarImagenesMasivo] = useState(true);
  const [progresoMasivo, setProgresoMasivo] = useState({ actual: 0, total: 0, estado: '' });

  // Estado historial
  const [historialContenido, setHistorialContenido] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [filtroHistorial, setFiltroHistorial] = useState('todos');

  // Estilos de imagen disponibles para generación masiva
  const ESTILOS_IMAGEN = [
    { id: 'fotorealista', nombre: 'Fotorrealista', icon: '📷', prompt: 'photorealistic, national geographic style, natural lighting, 8K quality' },
    { id: 'acuarela', nombre: 'Acuarela', icon: '🎨', prompt: 'watercolor painting style, soft colors, artistic, dreamy atmosphere' },
    { id: 'tierno', nombre: 'Dibujo Tierno', icon: '🧸', prompt: 'cute illustration style, soft pastel colors, kawaii, children book illustration' },
    { id: 'fantasia', nombre: 'Fantasía Épica', icon: '✨', prompt: 'fantasy art, magical atmosphere, ethereal glow, mystical, enchanted' },
    { id: 'mistico', nombre: 'Místico Oscuro', icon: '🌙', prompt: 'dark mystical, moonlit, mysterious, gothic fantasy, atmospheric' },
    { id: 'naturaleza', nombre: 'Naturaleza Mágica', icon: '🌿', prompt: 'enchanted nature, magical forest, bioluminescent plants, fairy tale' },
  ];

  // Estado regalos
  const [tipoRegalo, setTipoRegalo] = useState('runas');
  const [cantidadRegalo, setCantidadRegalo] = useState(50);
  const [mensajeRegalo, setMensajeRegalo] = useState('');
  const [previewRegalo, setPreviewRegalo] = useState(null);

  // Estado archivos
  const [archivosSubiendo, setArchivosSubiendo] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState([]);

  // Estado calendario
  const [contenidoMes, setContenidoMes] = useState([]);
  const [mesActual, setMesActual] = useState(new Date().getMonth() + 1);
  const [añoActual, setAñoActual] = useState(new Date().getFullYear());

  // Cargar datos iniciales
  useEffect(() => {
    console.log('[AdminMaestro] Iniciando carga...');

    // Timeout de seguridad - mostrar UI después de 5s aunque falle
    const safetyTimeout = setTimeout(() => {
      console.log('[AdminMaestro] Safety timeout - mostrando UI');
      setCargando(false);
    }, 5000);

    cargarDatosIniciales().finally(() => {
      clearTimeout(safetyTimeout);
    });

    return () => clearTimeout(safetyTimeout);
  }, []);

  async function cargarDatosIniciales() {
    setCargando(true);
    console.log('[AdminMaestro] Fetching duendes...');

    try {
      const resDuendes = await fetch('/api/admin/circulo/duendes-reales');
      console.log('[AdminMaestro] Response status:', resDuendes.status);

      const dataDuendes = await resDuendes.json();
      console.log('[AdminMaestro] Duendes recibidos:', dataDuendes.duendes?.length || 0);

      if (dataDuendes.success) {
        setDuendes(dataDuendes.duendes || []);
        setDuendeActual(dataDuendes.duendeActual);
      } else {
        setError('Error: ' + (dataDuendes.error || 'Respuesta inválida'));
      }
    } catch (err) {
      console.error('[AdminMaestro] Error:', err);
      setError('Error cargando datos: ' + err.message);
    } finally {
      console.log('[AdminMaestro] Carga completada, ocultando loader');
      setCargando(false);
    }

    // Cargar conexiones en background (tarda ~10s por llamadas a APIs externas)
    fetch('/api/admin/verificar-conexiones')
      .then(res => res.json())
      .then(data => {
        if (data.success) setConexiones(data);
        console.log('[AdminMaestro] Conexiones cargadas');
      })
      .catch(err => console.error('[AdminMaestro] Error conexiones:', err));
  }

  // Sincronizar duendes desde WooCommerce
  async function sincronizarDuendes() {
    setGenerando(true);
    setError('');
    try {
      const res = await fetch('/api/admin/circulo/duendes-reales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'sincronizar-woo' })
      });
      const data = await res.json();
      if (data.success) {
        setExito(`${data.importados} duendes sincronizados desde WooCommerce (Total: ${data.total})`);
        cargarDatosIniciales();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  // Seleccionar duende de la semana
  async function seleccionarDuende(id) {
    try {
      const res = await fetch('/api/admin/circulo/duendes-reales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'seleccionar-actual', id })
      });
      const data = await res.json();
      if (data.success) {
        setDuendeActual(data.duendeActual);
        setExito(data.mensaje);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Actualizar imagen del duende
  async function actualizarImagenDuende() {
    if (!duendeActual || !nuevaImagenUrl.trim()) return;

    try {
      const res = await fetch('/api/admin/circulo/duendes-reales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'editar',
          duende: {
            id: duendeActual.id,
            imagen: nuevaImagenUrl.trim()
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setDuendeActual({ ...duendeActual, imagen: nuevaImagenUrl.trim() });
        setDuendes(duendes.map(d =>
          d.id === duendeActual.id ? { ...d, imagen: nuevaImagenUrl.trim() } : d
        ));
        setEditandoImagenDuende(false);
        setNuevaImagenUrl('');
        setExito('✅ Imagen del duende actualizada');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Generar contenido individual
  async function generarContenido(instruccionRefinamiento = '') {
    if (!duendeActual) {
      setError('Seleccioná un duende de la semana primero');
      return;
    }
    if (!temaContenido.trim()) {
      setError('Escribí un tema o intención para el contenido');
      return;
    }

    setGenerando(true);
    setError('');
    if (!instruccionRefinamiento) {
      setContenidoGenerado(null);
    }

    try {
      const temaFinal = instruccionRefinamiento
        ? `${temaContenido}\n\nINSTRUCCIONES DE REFINAMIENTO: ${instruccionRefinamiento}`
        : temaContenido;

      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoContenido,
          tipoNombre: TIPOS_CONTENIDO.find(t => t.id === tipoContenido)?.nombre,
          camposForm: { tema: temaFinal },
          palabras: 1500,
          usarDuendeSemana: true,
          integrarLuna: true,
          modelo: modeloTexto
        })
      });

      const data = await res.json();
      if (data.success) {
        setContenidoGenerado(data);
        setTextoEditado(data.contenido || '');
        setImagenGenerada(null); // Reset imagen al generar nuevo contenido
        setMostrarRefinamientoTexto(false);
        setInstruccionRefinamientoTexto('');
        if (instruccionRefinamiento) {
          setExito('✨ Contenido refinado');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  // Refinar contenido con instrucción
  function refinarContenido(instruccion) {
    generarContenido(instruccion);
  }

  // Construir prompt automático para escenas mágicas (siempre diferente)
  function construirPromptAutomatico() {
    const titulo = contenidoGenerado?.titulo?.replace(/[#*]/g, '') || '';
    const tipo = tipoContenido;

    const escenas = [
      'enchanted forest with sunbeams filtering through ancient trees',
      'magical mushroom grove with glowing fungi and tiny creatures',
      'cozy witch cottage in misty woods with smoke from chimney',
      'moonlit forest clearing with fireflies and crystals',
      'fairy house built into an old tree trunk covered in moss',
      'mystical stream with stepping stones and dragonflies',
      'autumn forest floor with colorful leaves and toadstools',
      'dawn in magical meadow with morning dew on spiderwebs',
      'hidden garden path with lanterns and butterflies',
      'mossy log with ladybugs and tiny woodland flowers',
      'secret garden with ancient stone fountain and ivy',
      'treehouse in giant oak with warm candlelight',
      'crystal cave with purple amethyst formations',
      'woodland path covered in autumn leaves and mushrooms',
      'misty lake shore with water lilies at sunrise',
      'ancient oak tree hollow with glowing mushrooms inside',
      'rain-soaked forest path with reflections in puddles',
      'frost-covered berry bushes in winter morning light',
      'wild herb garden with bees and morning glory flowers',
      'stone bridge over babbling brook surrounded by ferns'
    ];

    const detalles = [
      'butterflies and ladybugs everywhere',
      'tiny colorful mushrooms and soft green moss',
      'crystals and sparkling gemstones',
      'fireflies and magical golden sparkles',
      'ferns, wildflowers and four-leaf clovers',
      'dewdrops catching rainbow light',
      'small woodland creatures peeking',
      'delicate spiderwebs with morning dew',
      'tiny fairy lights floating in air',
      'acorns and pine cones scattered around',
      'wild berries and herbs growing',
      'dragonflies hovering near water'
    ];

    const iluminacion = [
      'golden hour warm sunlight streaming through leaves',
      'soft silver moonlight with gentle glow',
      'magical bioluminescent ethereal glow',
      'misty morning soft diffused light',
      'dappled sunlight through tree canopy',
      'warm amber sunset rays',
      'cool blue twilight hour',
      'rays of light breaking through storm clouds',
      'soft pink sunrise casting long shadows'
    ];

    // Selección aleatoria REAL - función que siempre da diferente
    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    let escenaBase = randomPick(escenas);
    if (tipo === 'meditacion') {
      escenaBase = randomPick(['peaceful moonlit forest clearing with soft mist', 'serene zen garden with koi pond', 'quiet mountain meadow at dawn', 'calm lake reflecting starry night sky']);
    } else if (tipo === 'ritual') {
      escenaBase = randomPick(['mystical altar in forest with candles and crystals', 'sacred stone circle at twilight', 'witch cottage interior with herbs and candles', 'moonlit clearing with ritual items arranged on moss']);
    } else if (tipo === 'conocimiento') {
      escenaBase = randomPick(['ancient tree library with magical books', 'wizard study with scrolls and potions', 'crystal archive with floating runes', 'herbalist workshop with dried plants and bottles']);
    }

    const detalle = randomPick(detalles);
    const luz = randomPick(iluminacion);

    // Seed único para forzar imagen diferente cada vez (el modelo lo usa como variación)
    const seed = Math.floor(Math.random() * 999999);

    return `Photorealistic ${escenaBase}. Theme: "${titulo}". Details: ${detalle}. Lighting: ${luz}. National Geographic nature photography, shallow depth of field, macro details, magical realism, cinematic composition, 8K quality. seed:${seed}`;
  }

  // Generar imagen/video con modelo seleccionado
  async function generarImagenContenido() {
    if (!contenidoGenerado) return;

    setGenerandoImagen(true);
    setError('');

    try {
      // Siempre generar nuevo prompt para que sea diferente
      const promptFinal = promptImagen.trim() || construirPromptAutomatico();
      console.log('[GENERAR] Prompt:', promptFinal.slice(0, 100) + '...');

      // Buscar info del modelo en todas las categorías
      const todosModelos = [
        ...MODELOS_IMAGEN.openai,
        ...MODELOS_IMAGEN.replicate_rapidos,
        ...MODELOS_IMAGEN.replicate_calidad,
        ...MODELOS_IMAGEN.replicate_foto,
        ...MODELOS_IMAGEN.replicate_artistico,
        ...MODELOS_IMAGEN.video,
        ...MODELOS_IMAGEN.gemini
      ];
      const modeloInfo = todosModelos.find(m => m.id === modeloImagen);

      setExito(`${modeloInfo?.icon || '🎨'} Generando con ${modeloInfo?.nombre || modeloImagen}...`);

      let resultado = null;
      let errorMsg = '';

      // OpenAI DALL-E 3
      if (modeloImagen === 'dalle3') {
        const res = await fetch('/api/admin/imagen/dalle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptFinal,
            tipo: 'escena',
            calidad: 'hd',
            tamaño: '1792x1024'
          })
        });
        const data = await res.json();
        if (data.success) {
          resultado = data.imagen.url;
        } else {
          errorMsg = data.error;
        }
      }
      // Gemini Nano Banana Pro
      else if (modeloImagen === 'nano-banana') {
        const res = await fetch('/api/admin/imagen/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptFinal,
            imagenBase64: imagenReferencia || null,
            modo: imagenReferencia ? 'imagen_a_imagen' : 'texto_a_imagen'
          })
        });
        const data = await res.json();
        if (data.success) {
          resultado = data.imagen.url;
        } else {
          errorMsg = data.error || 'Error generando con Gemini';
          // Fallback a DALL-E si Gemini falla
          if (errorMsg) {
            setExito('⚠️ Gemini falló, usando DALL-E...');
            const fallbackRes = await fetch('/api/admin/imagen/dalle', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: promptFinal,
                tipo: 'escena',
                calidad: 'hd',
                tamaño: '1792x1024'
              })
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success) {
              resultado = fallbackData.imagen.url;
              errorMsg = '';
            } else {
              errorMsg = `Gemini: ${errorMsg} | DALL-E: ${fallbackData.error}`;
            }
          }
        }
      }
      // Replicate (todos los demás)
      else {
        const res = await fetch('/api/admin/imagen/replicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modelo: modeloImagen,
            prompt: promptFinal,
            imagenReferencia: imagenReferencia,
            fuerza: 0.6
          })
        });
        const data = await res.json();
        if (data.success) {
          resultado = data.imagen.url;
        } else {
          errorMsg = data.error;

          // Si Replicate falla por rate limit o error, intentar con DALL-E
          if (errorMsg.includes('rate') || errorMsg.includes('422') || errorMsg.includes('500')) {
            setExito('⚠️ Replicate limitado, usando DALL-E...');
            const fallbackRes = await fetch('/api/admin/imagen/dalle', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: promptFinal,
                tipo: 'escena',
                calidad: 'hd',
                tamaño: '1792x1024'
              })
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success) {
              resultado = fallbackData.imagen.url;
              errorMsg = '';
            } else {
              errorMsg = `Replicate: ${errorMsg} | DALL-E: ${fallbackData.error}`;
            }
          }
        }
      }

      // Aplicar resultado
      if (resultado) {
        console.log('[GENERAR] Imagen generada:', resultado.slice(0, 50) + '...');
        setImagenGenerada(resultado);
        setContenidoGenerado(prev => ({ ...prev, imagen: resultado }));
        setExito(`✅ ¡Imagen generada! (${modeloInfo?.nombre || 'DALL-E'})`);
      } else {
        setError(`❌ Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error('[GENERAR] Error:', err);
      setError('❌ Error: ' + err.message);
    } finally {
      setGenerandoImagen(false);
    }
  }

  // Manejar subida de imagen de referencia
  function handleImagenReferencia(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagenReferencia(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Guardar edición
  function guardarEdicion() {
    if (contenidoGenerado) {
      setContenidoGenerado({
        ...contenidoGenerado,
        contenido: textoEditado
      });
      setEditando(false);
      setExito('Cambios guardados');
    }
  }

  // Publicar contenido
  async function publicarContenido() {
    if (!contenidoGenerado) return;

    setGenerando(true);
    try {
      const hoy = new Date();
      const res = await fetch('/api/admin/circulo/contenidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dia: hoy.getDate(),
          mes: hoy.getMonth() + 1,
          año: hoy.getFullYear(),
          contenido: {
            tipo: tipoContenido,
            titulo: contenidoGenerado.titulo,
            contenido: contenidoGenerado.contenido,
            imagen: imagenGenerada || contenidoGenerado.imagen || null,
            mensaje: contenidoGenerado.contenido?.split('\n\n')[1] || '',
            guardian: duendeActual,
            estado: 'publicado'
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setExito('Contenido publicado exitosamente');
        setContenidoGenerado(null);
        setImagenGenerada(null);
        setTemaContenido('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  // Preview generación masiva
  async function previewGeneracionMasiva() {
    setGenerandoMasivo(true);
    setError('');
    try {
      const res = await fetch('/api/admin/circulo/generar-masivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modo: modoMasivo,
          soloPreview: true
        })
      });

      const data = await res.json();
      if (data.success) {
        setPreviewMasivo(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerandoMasivo(false);
    }
  }

  // Ejecutar generación masiva
  async function ejecutarGeneracionMasiva() {
    const totalDias = modoMasivo === 'mes' ? 30 : 7;
    if (!confirm(`¿Generar ${totalDias} días de contenido${generarImagenesMasivo ? ' con imágenes' : ''}? Esto puede tardar varios minutos.`)) return;

    setGenerandoMasivo(true);
    setError('');
    setProgresoMasivo({ actual: 0, total: totalDias, estado: 'Iniciando generación...' });

    try {
      const res = await fetch('/api/admin/circulo/generar-masivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modo: modoMasivo,
          soloPreview: false,
          fechaInicio: fechaInicioMasivo || null,
          generarImagenes: generarImagenesMasivo,
          estiloImagen: estiloImagenMasivo,
          promptEstilo: ESTILOS_IMAGEN.find(e => e.id === estiloImagenMasivo)?.prompt || ''
        })
      });

      const data = await res.json();
      if (data.success) {
        setExito(`✅ Generados ${data.resumen.generados} contenidos${data.resumen.imagenes ? ` con ${data.resumen.imagenes} imágenes` : ''}. Errores: ${data.resumen.errores}`);
        setPreviewMasivo(null);
        setProgresoMasivo({ actual: 0, total: 0, estado: '' });
        // Recargar historial si está visible
        if (tabActiva === 'historial') cargarHistorial();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerandoMasivo(false);
    }
  }

  // Generar imagen individual para contenido existente
  async function generarImagenParaContenido(contenido, estiloId) {
    const estilo = ESTILOS_IMAGEN.find(e => e.id === estiloId) || ESTILOS_IMAGEN[0];

    setExito(`🎨 Generando imagen estilo ${estilo.nombre}...`);

    try {
      // Construir prompt basado en el contenido y estilo
      const promptBase = `Magical forest scene inspired by: "${contenido.titulo}". ${estilo.prompt}. Enchanted atmosphere with fantasy elements, duende guardian theme.`;

      const res = await fetch('/api/admin/imagen/dalle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptBase,
          tipo: 'escena',
          calidad: 'hd',
          tamaño: '1792x1024'
        })
      });

      const data = await res.json();
      if (data.success) {
        // Actualizar el contenido con la imagen
        const updateRes = await fetch('/api/admin/circulo/contenidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dia: contenido.fecha?.dia,
            mes: contenido.fecha?.mes,
            año: contenido.fecha?.año,
            contenido: {
              ...contenido,
              imagen: data.imagen.url
            }
          })
        });

        if (updateRes.ok) {
          setExito('✅ Imagen generada y guardada');
          cargarHistorial();
        }
      } else {
        setError('Error generando imagen: ' + data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Preview regalos
  async function previewRegalos() {
    setGenerando(true);
    try {
      const res = await fetch('/api/admin/circulo/regalo-todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoRegalo,
          cantidad: cantidadRegalo,
          mensaje: mensajeRegalo,
          soloPreview: true
        })
      });

      const data = await res.json();
      if (data.success) {
        setPreviewRegalo(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  // Ejecutar regalos
  async function ejecutarRegalos() {
    if (!previewRegalo) return;
    if (!confirm(`¿Enviar ${tipoRegalo} a ${previewRegalo.total} miembros?`)) return;

    setGenerando(true);
    try {
      const res = await fetch('/api/admin/circulo/regalo-todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoRegalo,
          cantidad: cantidadRegalo,
          mensaje: mensajeRegalo,
          soloPreview: false
        })
      });

      const data = await res.json();
      if (data.success) {
        setExito(data.mensaje);
        setPreviewRegalo(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  // Cargar calendario
  async function cargarCalendario() {
    try {
      const res = await fetch(`/api/circulo/contenido?tipo=mes&mes=${mesActual}&año=${añoActual}`);
      const data = await res.json();
      if (data.success) {
        setContenidoMes(data.contenidos || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Cargar historial de contenido generado
  async function cargarHistorial() {
    setCargandoHistorial(true);
    try {
      const res = await fetch('/api/admin/circulo/historial-contenido');
      const data = await res.json();
      if (data.success) {
        setHistorialContenido(data.contenidos || []);
      }
    } catch (err) {
      console.error('Error cargando historial:', err);
    } finally {
      setCargandoHistorial(false);
    }
  }

  // Republicar contenido del historial
  async function republicarContenido(contenido) {
    if (!confirm('¿Republicar este contenido para hoy?')) return;

    try {
      const hoy = new Date();
      const res = await fetch('/api/admin/circulo/contenidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dia: hoy.getDate(),
          mes: hoy.getMonth() + 1,
          año: hoy.getFullYear(),
          contenido: {
            ...contenido,
            republicado: true,
            fechaOriginal: contenido.fecha,
            estado: 'publicado'
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setExito('Contenido republicado para hoy');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Eliminar contenido del historial
  async function eliminarContenido(contenido) {
    if (!confirm('¿Eliminar este contenido permanentemente?')) return;

    try {
      const params = new URLSearchParams({
        dia: contenido.fecha?.dia,
        mes: contenido.fecha?.mes,
        año: contenido.fecha?.año
      });

      const res = await fetch(`/api/admin/circulo/contenidos?${params}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (data.success) {
        setExito('Contenido eliminado');
        cargarHistorial();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (tabActiva === 'calendario') {
      cargarCalendario();
    }
    if (tabActiva === 'historial') {
      cargarHistorial();
    }
  }, [tabActiva, mesActual, añoActual]);

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (exito) {
      const timer = setTimeout(() => setExito(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [exito]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Render tabs
  const renderTabDuende = () => (
    <div className="tab-content">
      <div className="section-header">
        <h2>Duende de la Semana</h2>
        <p>Seleccioná qué guardián será la voz del contenido esta semana</p>
      </div>

      {duendeActual && (
        <div className="duende-actual-card">
          <div className="duende-actual-badge">Activo ahora</div>
          <div className="duende-imagen-container">
            <img
              src={duendeActual.imagen}
              alt={duendeActual.nombre}
              className="duende-actual-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            {duendeActual.imagen?.includes('10web.cloud') && (
              <div className="imagen-warning">
                ⚠️ Imagen no disponible (10web migrado)
              </div>
            )}
            <button
              className="btn-editar-imagen"
              onClick={() => {
                setEditandoImagenDuende(true);
                setNuevaImagenUrl(duendeActual.imagen || '');
              }}
            >
              📷 Cambiar imagen
            </button>
          </div>
          <div className="duende-actual-info">
            <h3>{duendeActual.nombreCompleto || duendeActual.nombre}</h3>
            <p>{duendeActual.descripcion?.slice(0, 150)}...</p>
            {duendeActual.cristales?.length > 0 && (
              <div className="cristales-tags">
                {duendeActual.cristales.slice(0, 4).map((c, i) => (
                  <span key={i} className="cristal-tag">{c}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {editandoImagenDuende && (
        <div className="modal-overlay" onClick={() => setEditandoImagenDuende(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Actualizar imagen de {duendeActual?.nombre}</h3>
            <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
              Pegá la URL de una imagen del duende. Podés subirla a tu WordPress o usar un servicio como Imgur.
            </p>
            <input
              type="url"
              value={nuevaImagenUrl}
              onChange={e => setNuevaImagenUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="input-url"
            />
            {nuevaImagenUrl && (
              <div className="preview-nueva-imagen">
                <img src={nuevaImagenUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
            <div className="modal-actions">
              <button onClick={actualizarImagenDuende} className="btn-guardar">
                ✓ Guardar
              </button>
              <button onClick={() => setEditandoImagenDuende(false)} className="btn-cancelar">
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="actions-bar">
        <button className="btn-sync" onClick={sincronizarDuendes} disabled={generando}>
          {generando ? 'Sincronizando...' : '🔄 Sincronizar desde WooCommerce'}
        </button>
        <button className="btn-secondary" onClick={async () => {
          if (!confirm('¿Crear duende de ejemplo?')) return;
          try {
            const res = await fetch('/api/admin/circulo/duendes-reales', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accion: 'crear',
                duende: {
                  nombre: 'Florián',
                  nombreCompleto: 'Florián, Guardián de los Cristales',
                  descripcion: 'Un duende sabio que guarda los secretos de los cristales y sus propiedades curativas.',
                  proposito: 'Guiar en el camino del autoconocimiento a través de los cristales',
                  cristales: ['Amatista', 'Cuarzo Rosa', 'Citrino'],
                  elemento: 'Tierra',
                  personalidad: 'Sereno, sabio, paciente'
                }
              })
            });
            const data = await res.json();
            if (data.success) {
              setExito('✅ Duende de ejemplo creado');
              cargarDatosIniciales();
            } else {
              setError(data.error);
            }
          } catch (err) {
            setError(err.message);
          }
        }}>
          ➕ Crear duende de ejemplo
        </button>
      </div>

      <div className="duendes-grid">
        {duendes.length === 0 ? (
          <div className="empty-state">
            <p>No hay duendes cargados. Sincronizá desde WooCommerce o agregá manualmente.</p>
          </div>
        ) : (
          duendes.map(d => (
            <div
              key={d.id}
              className={`duende-card ${duendeActual?.id === d.id ? 'active' : ''}`}
              onClick={() => seleccionarDuende(d.id)}
            >
              <img src={d.imagen} alt={d.nombre} />
              <div className="duende-card-info">
                <h4>{d.nombre}</h4>
                <span className="duende-proposito">{d.proposito?.slice(0, 50)}</span>
              </div>
              {duendeActual?.id === d.id && <div className="check-badge">✓</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTabCrear = () => (
    <div className="tab-content">
      <div className="section-header">
        <h2>Crear Contenido</h2>
        <p>Generá contenido único con la voz de {duendeActual?.nombre || 'tu guardián'}</p>
      </div>

      <div className="crear-layout">
        <div className="crear-form">
          <div className="form-section">
            <label>Tipo de contenido</label>
            <div className="tipos-grid">
              {TIPOS_CONTENIDO.map(t => (
                <button
                  key={t.id}
                  className={`tipo-btn ${tipoContenido === t.id ? 'active' : ''}`}
                  onClick={() => setTipoContenido(t.id)}
                >
                  <span className="tipo-icon">{t.icon}</span>
                  <span className="tipo-nombre">{t.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Tema o intención</label>
            <textarea
              value={temaContenido}
              onChange={e => setTemaContenido(e.target.value)}
              placeholder="Ej: Soltar el miedo al cambio, Ritual de luna llena para abundancia, Conectar con la energía de los cristales..."
              rows={4}
            />
          </div>

          <div className="form-section">
            <label>Modelo de IA</label>
            <div className="modelo-selector">
              <button
                className={`modelo-option ${modeloTexto === 'claude' ? 'active' : ''}`}
                onClick={() => setModeloTexto('claude')}
              >
                <span>🤖</span>
                <span>Claude</span>
                <small>Sonnet 4</small>
              </button>
              <button
                className={`modelo-option ${modeloTexto === 'gemini' ? 'active' : ''}`}
                onClick={() => setModeloTexto('gemini')}
              >
                <span>🍌</span>
                <span>Gemini Pro</span>
                <small>1.5 Pro (mejor)</small>
              </button>
            </div>
          </div>

          <button
            className="btn-generar"
            onClick={generarContenido}
            disabled={generando || !duendeActual}
          >
            {generando ? '✨ Generando magia...' : `✨ Generar con ${modeloTexto === 'gemini' ? 'Gemini' : 'Claude'}`}
          </button>
        </div>

        <div className="preview-panel">
          {contenidoGenerado ? (
            <div className="contenido-preview">
              {/* Header con duende */}
              <div className="preview-header-card">
                {duendeActual && (
                  <div className="preview-duende">
                    <img src={duendeActual.imagen} alt={duendeActual.nombre} className="duende-mini" />
                    <div>
                      <span className="preview-tipo-badge">
                        {TIPOS_CONTENIDO.find(t => t.id === tipoContenido)?.icon} {TIPOS_CONTENIDO.find(t => t.id === tipoContenido)?.nombre}
                      </span>
                      <span className="preview-autor">con la voz de {duendeActual.nombre}</span>
                    </div>
                  </div>
                )}
                {contenidoGenerado.modeloUsado && (
                  <span className="modelo-usado-badge">
                    {contenidoGenerado.modeloUsado === 'gemini' ? '🍌 Gemini' : '🤖 Claude'}
                  </span>
                )}
              </div>

              {/* Panel de generación de imagen */}
              <div className="preview-imagen-area">
                {imagenGenerada ? (
                  <div className="imagen-generada-container">
                    <div className="imagen-incluida-badge">✓ Imagen incluida en el contenido</div>
                    <img src={imagenGenerada} alt="Imagen del contenido" className="imagen-generada" />
                  </div>
                ) : (
                  <div className="imagen-placeholder">
                    <span>🖼️</span>
                    <p>Sin imagen - Generá una para incluir con el contenido</p>
                  </div>
                )}

                {/* Opciones de imagen */}
                <div className="imagen-opciones">
                  <div className="imagen-opciones-header">
                    <button
                      className="btn-toggle-opciones"
                      onClick={() => setMostrarOpcionesImagen(!mostrarOpcionesImagen)}
                    >
                      ⚙️ {mostrarOpcionesImagen ? 'Ocultar opciones' : 'Opciones de imagen'}
                    </button>
                  </div>

                  {mostrarOpcionesImagen && (
                    <div className="imagen-opciones-panel">
                      {/* OpenAI */}
                      <div className="opcion-grupo">
                        <label>🟢 OpenAI</label>
                        <div className="modelo-btns">
                          {MODELOS_IMAGEN.openai.map(m => (
                            <button
                              key={m.id}
                              className={`modelo-btn ${modeloImagen === m.id ? 'active' : ''}`}
                              onClick={() => setModeloImagen(m.id)}
                              title={m.desc}
                            >
                              {m.icon} {m.nombre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Replicate Rápidos */}
                      <div className="opcion-grupo">
                        <label>⚡ Rápidos (baratos)</label>
                        <div className="modelo-btns">
                          {MODELOS_IMAGEN.replicate_rapidos.map(m => (
                            <button
                              key={m.id}
                              className={`modelo-btn ${modeloImagen === m.id ? 'active' : ''}`}
                              onClick={() => setModeloImagen(m.id)}
                              title={m.desc}
                            >
                              {m.icon} {m.nombre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Replicate Alta Calidad */}
                      <div className="opcion-grupo">
                        <label>✨ Alta calidad</label>
                        <div className="modelo-btns">
                          {MODELOS_IMAGEN.replicate_calidad.map(m => (
                            <button
                              key={m.id}
                              className={`modelo-btn ${modeloImagen === m.id ? 'active' : ''}`}
                              onClick={() => setModeloImagen(m.id)}
                              title={m.desc}
                            >
                              {m.icon} {m.nombre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Replicate Fotorrealistas */}
                      <div className="opcion-grupo">
                        <label>📷 Fotorrealistas</label>
                        <div className="modelo-btns">
                          {MODELOS_IMAGEN.replicate_foto.map(m => (
                            <button
                              key={m.id}
                              className={`modelo-btn ${modeloImagen === m.id ? 'active' : ''}`}
                              onClick={() => setModeloImagen(m.id)}
                              title={m.desc}
                            >
                              {m.icon} {m.nombre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Replicate Artísticos */}
                      <div className="opcion-grupo">
                        <label>🎨 Artísticos</label>
                        <div className="modelo-btns">
                          {MODELOS_IMAGEN.replicate_artistico.map(m => (
                            <button
                              key={m.id}
                              className={`modelo-btn ${modeloImagen === m.id ? 'active' : ''}`}
                              onClick={() => setModeloImagen(m.id)}
                              title={m.desc}
                            >
                              {m.icon} {m.nombre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Videos */}
                      <div className="opcion-grupo">
                        <label>🎬 Videos</label>
                        <div className="modelo-btns">
                          {MODELOS_IMAGEN.video.map(m => (
                            <button
                              key={m.id}
                              className={`modelo-btn ${modeloImagen === m.id ? 'active' : ''}`}
                              onClick={() => setModeloImagen(m.id)}
                              title={m.desc}
                            >
                              {m.icon} {m.nombre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gemini Nano Banana */}
                      <div className="opcion-grupo">
                        <label>🍌 Gemini AI</label>
                        <div className="modelo-btns">
                          {MODELOS_IMAGEN.gemini.map(m => (
                            <button
                              key={m.id}
                              className={`modelo-btn ${modeloImagen === m.id ? 'active' : ''}`}
                              onClick={() => setModeloImagen(m.id)}
                              title={m.desc}
                            >
                              {m.icon} {m.nombre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Prompt personalizado */}
                      <div className="opcion-grupo">
                        <label>✏️ Prompt personalizado</label>
                        <textarea
                          value={promptImagen}
                          onChange={e => setPromptImagen(e.target.value)}
                          placeholder="Ej: Bosque mágico con hongos brillantes y mariposas al atardecer, rayos de sol filtrándose entre los árboles..."
                          rows={3}
                          className="prompt-imagen-input"
                        />
                        <small>Dejalo vacío para usar prompt automático basado en el contenido</small>
                      </div>

                      {/* Imagen de referencia */}
                      <div className="opcion-grupo">
                        <label>📷 Imagen de referencia (opcional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImagenReferencia}
                          className="input-file"
                        />
                        {imagenReferencia && (
                          <div className="referencia-preview">
                            <img src={imagenReferencia} alt="Referencia" />
                            <button onClick={() => setImagenReferencia(null)} className="btn-quitar">✕</button>
                          </div>
                        )}
                        <small>Para img2img con SDXL o videos desde imagen</small>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="imagen-acciones">
                    <button
                      className="btn-generar-imagen"
                      onClick={generarImagenContenido}
                      disabled={generandoImagen}
                    >
                      {generandoImagen ? '🎨 Generando...' : imagenGenerada ? '🔄 Regenerar' : '🎨 Generar imagen'}
                    </button>
                    {imagenGenerada && (
                      <a href={imagenGenerada} target="_blank" rel="noopener noreferrer" className="btn-ver-imagen">
                        🔗 Abrir
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Título estilizado */}
              <h2 className="preview-titulo-final">
                {contenidoGenerado.titulo?.replace(/^#+ /, '').replace(/\*\*/g, '')}
              </h2>

              {/* Contenido - modo edición o visualización */}
              {editando ? (
                <div className="editor-area">
                  <textarea
                    value={textoEditado}
                    onChange={e => setTextoEditado(e.target.value)}
                    className="editor-textarea"
                    rows={15}
                  />
                  <div className="editor-actions">
                    <button className="btn-guardar" onClick={guardarEdicion}>
                      ✓ Guardar cambios
                    </button>
                    <button className="btn-cancelar" onClick={() => { setEditando(false); setTextoEditado(contenidoGenerado.contenido); }}>
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="preview-contenido-final">
                  {(contenidoGenerado.contenido || '')
                    .replace(/^#+ .+$/gm, '') // Quitar títulos markdown
                    .replace(/\*\*(.+?)\*\*/g, '$1') // Quitar negritas
                    .replace(/\*(.+?)\*/g, '$1') // Quitar cursivas
                    .split('\n')
                    .filter(p => p.trim())
                    .map((p, i) => (
                      <p key={i} className="contenido-parrafo">{p.trim()}</p>
                    ))}
                </div>
              )}

              {/* Firma del duende */}
              {duendeActual && !editando && (
                <div className="firma-duende">
                  <span className="firma-nombre">— {duendeActual.nombre}</span>
                  <span className="firma-icono">🌿</span>
                </div>
              )}

              {/* Acciones */}
              <div className="preview-actions">
                <button className="btn-publicar" onClick={publicarContenido} disabled={generando}>
                  📤 Publicar ahora
                </button>
                {!editando && (
                  <>
                    <button className="btn-secondary" onClick={() => { setEditando(true); setTextoEditado(contenidoGenerado.contenido); }}>
                      ✏️ Editar
                    </button>
                    <button className="btn-ghost" onClick={() => generarContenido()} disabled={generando}>
                      🔄 Regenerar
                    </button>
                    <button
                      className="btn-refinar-texto"
                      onClick={() => setMostrarRefinamientoTexto(!mostrarRefinamientoTexto)}
                    >
                      🔧 {mostrarRefinamientoTexto ? 'Ocultar' : 'Refinar'}
                    </button>
                  </>
                )}
              </div>

              {/* Panel de refinamiento de texto */}
              {mostrarRefinamientoTexto && !editando && (
                <div className="texto-refinamiento-panel">
                  <h4>🔧 Refinar el contenido</h4>
                  <p>Seleccioná una opción o escribí qué querés cambiar:</p>

                  <div className="refinamiento-opciones-texto">
                    {opcionesRefinamientoTexto.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => refinarContenido(opt.instruccion)}
                        disabled={generando}
                        className="opcion-refinamiento-texto"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="refinamiento-custom-texto">
                    <textarea
                      value={instruccionRefinamientoTexto}
                      onChange={e => setInstruccionRefinamientoTexto(e.target.value)}
                      placeholder="Ej: Hacelo más personal, mencioná algo sobre soltar el control. Que termine con una pregunta reflexiva..."
                      rows={3}
                    />
                    <button
                      onClick={() => refinarContenido(instruccionRefinamientoTexto)}
                      disabled={generando || !instruccionRefinamientoTexto.trim()}
                      className="btn-aplicar-refinamiento-texto"
                    >
                      {generando ? '⏳ Regenerando...' : '🔄 Aplicar cambios'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="preview-empty">
              <span>✨</span>
              <p>El contenido generado aparecerá aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabMasivo = () => (
    <div className="tab-content">
      <div className="section-header">
        <h2>Generador Masivo</h2>
        <p>Generá una semana o mes completo de contenido con imágenes automáticas</p>
      </div>

      {!duendeActual && (
        <div className="warning-box">
          ⚠️ Primero seleccioná un Duende de la Semana en la primera tab
        </div>
      )}

      <div className="masivo-config">
        {/* Período */}
        <div className="config-option">
          <label>Período a generar</label>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${modoMasivo === 'semana' ? 'active' : ''}`}
              onClick={() => setModoMasivo('semana')}
            >
              📅 7 días
            </button>
            <button
              className={`toggle-btn ${modoMasivo === 'mes' ? 'active' : ''}`}
              onClick={() => setModoMasivo('mes')}
            >
              📆 30 días
            </button>
          </div>
        </div>

        {/* Fecha de inicio */}
        <div className="config-option">
          <label>📅 Fecha de inicio (para contenido pasado/futuro)</label>
          <input
            type="date"
            value={fechaInicioMasivo}
            onChange={(e) => setFechaInicioMasivo(e.target.value)}
            className="fecha-input"
          />
          <small className="input-hint">
            {fechaInicioMasivo
              ? `Generará desde ${new Date(fechaInicioMasivo).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : 'Dejá vacío para generar desde hoy'}
          </small>
        </div>

        {/* Toggle imágenes */}
        <div className="config-option">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={generarImagenesMasivo}
              onChange={(e) => setGenerarImagenesMasivo(e.target.checked)}
            />
            <span>🎨 Generar imágenes automáticamente para cada contenido</span>
          </label>
        </div>

        {/* Estilo de imágenes */}
        {generarImagenesMasivo && (
          <div className="config-option">
            <label>Estilo de imágenes</label>
            <div className="estilos-grid">
              {ESTILOS_IMAGEN.map(est => (
                <button
                  key={est.id}
                  className={`estilo-btn ${estiloImagenMasivo === est.id ? 'active' : ''}`}
                  onClick={() => setEstiloImagenMasivo(est.id)}
                  title={est.prompt}
                >
                  <span className="estilo-icon">{est.icon}</span>
                  <span className="estilo-nombre">{est.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info del duende */}
        {duendeActual && (
          <div className="config-info">
            <img src={duendeActual.imagen} alt="" />
            <span>Todo el contenido será generado con la voz de <strong>{duendeActual.nombre}</strong></span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="masivo-acciones">
          <button
            className="btn-preview"
            onClick={previewGeneracionMasiva}
            disabled={generandoMasivo || !duendeActual}
          >
            👁️ Ver preview
          </button>

          <button
            className="btn-generar-masivo-directo"
            onClick={ejecutarGeneracionMasiva}
            disabled={generandoMasivo || !duendeActual}
          >
            {generandoMasivo ? '⏳ Generando...' : `⚡ Generar ${modoMasivo === 'mes' ? '30' : '7'} días ahora`}
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      {generandoMasivo && progresoMasivo.total > 0 && (
        <div className="progreso-masivo">
          <div className="progreso-bar">
            <div
              className="progreso-fill"
              style={{ width: `${(progresoMasivo.actual / progresoMasivo.total) * 100}%` }}
            />
          </div>
          <span className="progreso-texto">
            {progresoMasivo.estado} ({progresoMasivo.actual}/{progresoMasivo.total})
          </span>
        </div>
      )}

      {/* Preview */}
      {previewMasivo && (
        <div className="masivo-preview">
          <h3>Preview: {previewMasivo.totalDias} días de contenido</h3>
          <p className="preview-fecha-rango">
            Desde {previewMasivo.plan?.[0]?.fecha.diaSemana} {previewMasivo.plan?.[0]?.fecha.dia}/{previewMasivo.plan?.[0]?.fecha.mes}
            {' '}hasta {previewMasivo.plan?.[previewMasivo.plan.length - 1]?.fecha.diaSemana} {previewMasivo.plan?.[previewMasivo.plan.length - 1]?.fecha.dia}/{previewMasivo.plan?.[previewMasivo.plan.length - 1]?.fecha.mes}
          </p>

          <div className="dias-preview-grid">
            {previewMasivo.plan?.map((dia, i) => (
              <div key={i} className="dia-preview-card">
                <span className="dia-fecha">{dia.fecha.diaSemana} {dia.fecha.dia}/{dia.fecha.mes}</span>
                <span className="dia-tipo">{TIPOS_CONTENIDO.find(t => t.id === dia.tipo)?.icon}</span>
                <span className="dia-tipo-nombre">{dia.tipoNombre}</span>
                <span className="dia-luna">{dia.faseLunar.icono} {dia.faseLunar.nombre}</span>
                {generarImagenesMasivo && (
                  <span className="dia-imagen-badge">{ESTILOS_IMAGEN.find(e => e.id === estiloImagenMasivo)?.icon} + img</span>
                )}
              </div>
            ))}
          </div>

          <button
            className="btn-generar-masivo"
            onClick={ejecutarGeneracionMasiva}
            disabled={generandoMasivo}
          >
            {generandoMasivo ? '⏳ Generando... (esto puede tardar varios minutos)' : `⚡ Confirmar y generar ${modoMasivo === 'mes' ? '30' : '7'} días`}
          </button>
        </div>
      )}
    </div>
  );

  const renderTabHistorial = () => {
    const contenidosFiltrados = filtroHistorial === 'todos'
      ? historialContenido
      : historialContenido.filter(c => c.tipo === filtroHistorial);

    return (
      <div className="tab-content">
        <div className="section-header">
          <h2>📋 Historial de Contenido</h2>
          <p>Todo el contenido generado - republicá, editá o eliminá</p>
        </div>

        <div className="historial-filtros">
          <button
            className={`filtro-btn ${filtroHistorial === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltroHistorial('todos')}
          >
            Todos ({historialContenido.length})
          </button>
          {TIPOS_CONTENIDO.map(t => {
            const count = historialContenido.filter(c => c.tipo === t.id).length;
            return (
              <button
                key={t.id}
                className={`filtro-btn ${filtroHistorial === t.id ? 'active' : ''}`}
                onClick={() => setFiltroHistorial(t.id)}
              >
                {t.icon} {t.nombre} ({count})
              </button>
            );
          })}
          <button className="btn-refresh-historial" onClick={cargarHistorial}>
            🔄
          </button>
        </div>

        {cargandoHistorial ? (
          <div className="loading-historial">⏳ Cargando historial...</div>
        ) : contenidosFiltrados.length === 0 ? (
          <div className="empty-historial">
            <span>📭</span>
            <p>No hay contenido generado aún</p>
            <p>Generá contenido desde la tab "Crear Contenido" o "Generador Masivo"</p>
          </div>
        ) : (
          <div className="historial-grid">
            {contenidosFiltrados.map((contenido, i) => (
              <div key={i} className="historial-card">
                {/* Imagen */}
                {contenido.imagen ? (
                  <div className="historial-imagen">
                    <img src={contenido.imagen} alt="" />
                  </div>
                ) : (
                  <div className="historial-imagen-placeholder">
                    <span>🖼️</span>
                    <div className="generar-imagen-btns">
                      {ESTILOS_IMAGEN.slice(0, 3).map(est => (
                        <button
                          key={est.id}
                          onClick={() => generarImagenParaContenido(contenido, est.id)}
                          title={`Generar imagen estilo ${est.nombre}`}
                        >
                          {est.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="historial-info">
                  <div className="historial-meta">
                    <span className="historial-tipo">
                      {TIPOS_CONTENIDO.find(t => t.id === contenido.tipo)?.icon}
                      {TIPOS_CONTENIDO.find(t => t.id === contenido.tipo)?.nombre}
                    </span>
                    <span className="historial-fecha">
                      {contenido.fecha?.dia}/{contenido.fecha?.mes}/{contenido.fecha?.año}
                    </span>
                  </div>

                  <h4 className="historial-titulo">
                    {(typeof contenido.titulo === 'string' ? contenido.titulo : '').replace(/[#*]/g, '').slice(0, 60)}
                    {(contenido.titulo?.length || 0) > 60 ? '...' : ''}
                  </h4>

                  <p className="historial-preview">
                    {(typeof contenido.contenido === 'string' ? contenido.contenido : (contenido.mensaje || '')).replace(/[#*]/g, '').slice(0, 150)}...
                  </p>

                  {contenido.guardian && (
                    <div className="historial-guardian">
                      <img src={contenido.guardian.imagen} alt="" />
                      <span>{contenido.guardian.nombre}</span>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="historial-acciones">
                    <button
                      className="btn-republicar"
                      onClick={() => republicarContenido(contenido)}
                      title="Publicar para hoy"
                    >
                      📤 Republicar
                    </button>
                    <button
                      className="btn-ver-contenido"
                      onClick={() => {
                        setContenidoGenerado(contenido);
                        setTextoEditado(contenido.contenido || '');
                        setImagenGenerada(contenido.imagen || null);
                        setTabActiva('crear');
                      }}
                      title="Abrir en editor"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-eliminar-contenido"
                      onClick={() => eliminarContenido(contenido)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTabRegalos = () => (
    <div className="tab-content">
      <div className="section-header">
        <h2>Regalos al Círculo</h2>
        <p>Otorgá beneficios a todos los miembros activos del Círculo</p>
      </div>

      <div className="regalo-form">
        <div className="form-section">
          <label>Tipo de regalo</label>
          <div className="regalo-tipos">
            <button
              className={`regalo-tipo ${tipoRegalo === 'runas' ? 'active' : ''}`}
              onClick={() => setTipoRegalo('runas')}
            >
              <span>💎</span>
              <span>Runas</span>
            </button>
            <button
              className={`regalo-tipo ${tipoRegalo === 'lectura_gratis' ? 'active' : ''}`}
              onClick={() => setTipoRegalo('lectura_gratis')}
            >
              <span>🔮</span>
              <span>Lecturas gratis</span>
            </button>
            <button
              className={`regalo-tipo ${tipoRegalo === 'descuento' ? 'active' : ''}`}
              onClick={() => setTipoRegalo('descuento')}
            >
              <span>🏷️</span>
              <span>Descuento %</span>
            </button>
          </div>
        </div>

        <div className="form-section">
          <label>Cantidad</label>
          <input
            type="number"
            value={cantidadRegalo}
            onChange={e => setCantidadRegalo(parseInt(e.target.value) || 0)}
            min={1}
            max={tipoRegalo === 'descuento' ? 100 : 1000}
          />
          <span className="input-hint">
            {tipoRegalo === 'runas' && 'runas por persona'}
            {tipoRegalo === 'lectura_gratis' && 'lecturas por persona'}
            {tipoRegalo === 'descuento' && '% de descuento'}
          </span>
        </div>

        <div className="form-section">
          <label>Mensaje (opcional)</label>
          <input
            type="text"
            value={mensajeRegalo}
            onChange={e => setMensajeRegalo(e.target.value)}
            placeholder="Ej: Regalo de luna llena"
          />
        </div>

        <button className="btn-preview" onClick={previewRegalos} disabled={generando}>
          👁️ Ver a quiénes se enviará
        </button>

        {previewRegalo && (
          <div className="regalo-preview">
            <h4>Se enviará a {previewRegalo.total} miembros:</h4>
            <div className="miembros-list">
              {previewRegalo.miembros?.slice(0, 10).map((m, i) => (
                <span key={i} className="miembro-tag">{m.nombre}</span>
              ))}
              {previewRegalo.total > 10 && (
                <span className="miembro-tag more">+{previewRegalo.total - 10} más</span>
              )}
            </div>

            <button
              className="btn-enviar-regalo"
              onClick={ejecutarRegalos}
              disabled={generando}
            >
              {generando ? 'Enviando...' : `🎁 Enviar ${tipoRegalo} a todos`}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabCalendario = () => {
    const diasEnMes = new Date(añoActual, mesActual, 0).getDate();
    const primerDia = new Date(añoActual, mesActual - 1, 1).getDay();
    const nombreMes = new Date(añoActual, mesActual - 1).toLocaleDateString('es-ES', { month: 'long' });

    const contenidoPorDia = {};
    contenidoMes.forEach(c => {
      contenidoPorDia[c.fecha.dia] = c;
    });

    return (
      <div className="tab-content">
        <div className="section-header">
          <h2>Calendario de Contenido</h2>
          <p>Vista mensual del contenido programado y publicado</p>
        </div>

        <div className="calendario-nav">
          <button onClick={() => {
            if (mesActual === 1) {
              setMesActual(12);
              setAñoActual(añoActual - 1);
            } else {
              setMesActual(mesActual - 1);
            }
          }}>←</button>
          <h3>{nombreMes} {añoActual}</h3>
          <button onClick={() => {
            if (mesActual === 12) {
              setMesActual(1);
              setAñoActual(añoActual + 1);
            } else {
              setMesActual(mesActual + 1);
            }
          }}>→</button>
        </div>

        <div className="calendario-grid">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} className="calendario-header">{d}</div>
          ))}

          {Array(primerDia).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="calendario-dia empty"></div>
          ))}

          {Array(diasEnMes).fill(null).map((_, i) => {
            const dia = i + 1;
            const contenido = contenidoPorDia[dia];
            const esHoy = dia === new Date().getDate() &&
                          mesActual === new Date().getMonth() + 1 &&
                          añoActual === new Date().getFullYear();

            return (
              <div
                key={dia}
                className={`calendario-dia ${contenido ? 'con-contenido' : ''} ${esHoy ? 'hoy' : ''}`}
              >
                <span className="dia-numero">{dia}</span>
                {contenido && (
                  <div className="dia-contenido">
                    <span className="contenido-icon">
                      {TIPOS_CONTENIDO.find(t => t.id === contenido.tipo)?.icon || '📝'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendario-leyenda">
          <span className="leyenda-item"><span className="dot con-contenido"></span> Con contenido</span>
          <span className="leyenda-item"><span className="dot hoy"></span> Hoy</span>
        </div>
      </div>
    );
  };

  const renderTabConexiones = () => (
    <div className="tab-content">
      <div className="section-header">
        <h2>Estado de Conexiones</h2>
        <p>Verificá que todos los servicios estén funcionando correctamente</p>
      </div>

      <button className="btn-refresh" onClick={cargarDatosIniciales}>
        🔄 Actualizar estado
      </button>

      {conexiones && (
        <div className="conexiones-grid">
          {Object.entries(conexiones.conexiones || {}).map(([key, val]) => (
            <div key={key} className={`conexion-card ${val.estado}`}>
              <div className="conexion-header">
                <span className="conexion-nombre">
                  {key === 'vercelKV' && '🗄️ Vercel KV'}
                  {key === 'wordpress' && '📰 WordPress'}
                  {key === 'wordpressMedia' && '🖼️ Media Library'}
                  {key === 'anthropic' && '🤖 Claude (Anthropic)'}
                  {key === 'openai' && '🎨 DALL-E (OpenAI)'}
                  {key === 'replicate' && '🖼️ Replicate'}
                  {key === 'gemini' && '🍌 Gemini (Nano Banana)'}
                </span>
                <span className={`estado-badge ${val.estado}`}>
                  {val.estado === 'ok' && '✅ Activo'}
                  {val.estado === 'error' && '❌ Error'}
                  {val.estado === 'no_configurado' && '⚠️ No configurado'}
                </span>
              </div>
              <p className="conexion-mensaje">{val.mensaje}</p>
              {val.version && <span className="conexion-version">v{val.version}</span>}
              {val.url && <span className="conexion-url">{val.url}</span>}
            </div>
          ))}
        </div>
      )}

      {conexiones?.resumen && (
        <div className="conexiones-resumen">
          <span className="resumen-item ok">{conexiones.resumen.ok} activas</span>
          <span className="resumen-item error">{conexiones.resumen.errores} errores</span>
          <span className="resumen-item warning">{conexiones.resumen.noConfigurado} sin configurar</span>
        </div>
      )}
    </div>
  );

  const renderTabCursos = () => (
    <div className="tab-content">
      <div className="section-header">
        <h2>📚 Gestión de Cursos</h2>
        <p>Crea cursos con IA, duendes rotativos como profesores y badges de completación</p>
      </div>
      <CursosAdmin />
    </div>
  );

  const renderTabArchivos = () => (
    <div className="tab-content">
      <div className="section-header">
        <h2>Subir Archivos</h2>
        <p>Sube imágenes, PDFs, audios a la biblioteca de WordPress</p>
      </div>

      <div className="upload-zone">
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*,application/pdf,audio/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setArchivosSubiendo(true);
            for (const file of files) {
              const formData = new FormData();
              formData.append('archivo', file);
              formData.append('titulo', file.name);

              try {
                const res = await fetch('/api/admin/woocommerce/media', {
                  method: 'POST',
                  body: formData
                });
                const data = await res.json();
                if (data.success) {
                  setExito(`Archivo subido: ${file.name} - URL: ${data.url}`);
                } else {
                  setError(`Error: ${data.error}`);
                }
              } catch (err) {
                setError(`Error subiendo ${file.name}: ${err.message}`);
              }
            }
            setArchivosSubiendo(false);
          }}
        />
        <label htmlFor="file-upload" className="upload-label">
          <span className="upload-icon">📤</span>
          <span>Arrastrá archivos aquí o hacé click para subir</span>
          <span className="upload-hint">Imágenes, PDFs, audios (max 10MB)</span>
        </label>
        {archivosSubiendo && <div className="uploading">Subiendo...</div>}
      </div>

      <div className="archivos-info">
        <h4>¿Qué hace esta sección?</h4>
        <ul>
          <li><strong>Sube archivos a WordPress:</strong> Las imágenes, PDFs y audios se guardan en la biblioteca de medios de tu sitio WordPress/WooCommerce.</li>
          <li><strong>Obtené la URL:</strong> Una vez subido, podés copiar la URL para usar en contenido del Círculo, cursos, o donde necesites.</li>
          <li><strong>Imágenes de duendes:</strong> Subí aquí las imágenes de los duendes si las URLs originales de WooCommerce no funcionan.</li>
          <li><strong>Material de cursos:</strong> PDFs descargables, audios de meditaciones guiadas, etc.</li>
          <li><strong>Formatos aceptados:</strong> JPG, PNG, GIF, PDF, MP3, WAV (máximo 10MB por archivo).</li>
        </ul>
      </div>
    </div>
  );

  if (cargando) {
    return (
      <div className="admin-maestro loading">
        <div className="loader">
          <span>✨</span>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-maestro">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <a href="/admin" className="back-link">← Volver al Admin</a>
          <h1>✨ Panel Maestro del Círculo</h1>
        </div>
        {duendeActual && (
          <div className="header-duende">
            <img src={duendeActual.imagen} alt="" />
            <span>{duendeActual.nombre}</span>
          </div>
        )}
      </header>

      {/* Mensajes */}
      {error && <div className="mensaje error">{error}</div>}
      {exito && <div className="mensaje exito">{exito}</div>}

      {/* Tabs */}
      <nav className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${tabActiva === tab.id ? 'active' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.nombre}</span>
          </button>
        ))}
      </nav>

      {/* Contenido */}
      <main className="admin-main">
        {tabActiva === 'duende' && renderTabDuende()}
        {tabActiva === 'crear' && renderTabCrear()}
        {tabActiva === 'imagenes' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>🎨 Generador de Imágenes y Videos</h2>
              <p>Explorá todos los modelos de Replicate y OpenAI con todas sus opciones</p>
            </div>
            <ReplicateExplorer
              onImagenGenerada={(url) => {
                setImagenGenerada(url);
                setExito('✅ Imagen lista para usar');
              }}
            />
          </div>
        )}
        {tabActiva === 'masivo' && renderTabMasivo()}
        {tabActiva === 'historial' && renderTabHistorial()}
        {tabActiva === 'cursos' && renderTabCursos()}
        {tabActiva === 'archivos' && renderTabArchivos()}
        {tabActiva === 'regalos' && renderTabRegalos()}
        {tabActiva === 'calendario' && renderTabCalendario()}
        {tabActiva === 'conexiones' && renderTabConexiones()}
      </main>
    </div>
  );
}

