'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Catálogo completo de guardianes
import catalogoData from '../../../data/guardianes-catalogo-completo.json';

function GeneradorHistoriasContent() {
  const searchParams = useSearchParams();
  const productoIdUrl = searchParams.get('producto');
  const nombreUrl = searchParams.get('nombre');

  // Estados del flujo
  const [paso, setPaso] = useState(1);
  const [modo, setModo] = useState(null); // 'existente' o 'nuevo'
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Catálogo
  const [catalogo] = useState(catalogoData);

  // Datos
  const [escaneo, setEscaneo] = useState(null);
  const [guardianes, setGuardianes] = useState([]);
  const [guardianSeleccionado, setGuardianSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [analisisImagen, setAnalisisImagen] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [historiaGenerada, setHistoriaGenerada] = useState('');
  const [sincrodestinos, setSincrodestinos] = useState([]);

  // Datos del guardián (para existentes se cargan, para nuevos se llenan)
  const [datosGuardian, setDatosGuardian] = useState({
    nombre: '',
    genero: 'M',
    especie: 'duende',
    categoria: 'Protección',
    tamano: 'mediano_especial',
    tamanoCm: 18,
    accesorios: '',
    esUnico: true,
    precioUSD: 200,
    precioUYU: 8000
  });

  // Chat de encuesta para guardianes nuevos
  const [chatEncuesta, setChatEncuesta] = useState([]);
  const [inputChat, setInputChat] = useState('');
  const [encuestaCompleta, setEncuestaCompleta] = useState(false);

  // Modo batch/rápido (viejo)
  const [batchSeleccion, setBatchSeleccion] = useState([]);
  const [batchActual, setBatchActual] = useState(0);
  const [batchHistoria, setBatchHistoria] = useState('');
  const [filtroEspecie, setFiltroEspecie] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState(null);

  // === MODO BATCH INTELIGENTE (nuevo) ===
  const [batchModoGrupos, setBatchModoGrupos] = useState(false);
  const [batchSeleccionados, setBatchSeleccionados] = useState([]); // guardianes seleccionados
  const [batchGrupos, setBatchGrupos] = useState([]); // grupos con especialización
  const [batchGenerando, setBatchGenerando] = useState(false);
  const [batchProgreso, setBatchProgreso] = useState({ actual: 0, total: 0, guardian: '' });
  const [batchResultados, setBatchResultados] = useState([]); // historias generadas
  const [batchVistaPrevia, setBatchVistaPrevia] = useState(null); // historia seleccionada para ver

  // Mini-encuesta al regenerar
  const [showMiniEncuesta, setShowMiniEncuesta] = useState(false);
  const [miniEncuesta, setMiniEncuesta] = useState({
    problema: '',
    categoriaOverride: '',
    indicaciones: ''
  });

  // Datos del sistema experto de conversión
  const [datosConversion, setDatosConversion] = useState(null);
  const [datosConversionBatch, setDatosConversionBatch] = useState(null);

  // Todas las especies disponibles
  const especiesDisponibles = [
    { id: 'duende', nombre: 'Duende', genero: 'M' },
    { id: 'duenda', nombre: 'Duenda', genero: 'F' },
    { id: 'pixie', nombre: 'Pixie', genero: 'F', siempreUnico: true },
    { id: 'elfo', nombre: 'Elfo', genero: 'M' },
    { id: 'elfa', nombre: 'Elfa', genero: 'F' },
    { id: 'bruja', nombre: 'Bruja', genero: 'F' },
    { id: 'brujo', nombre: 'Brujo', genero: 'M' },
    { id: 'vikingo', nombre: 'Vikingo', genero: 'M' },
    { id: 'vikinga', nombre: 'Vikinga', genero: 'F' },
    { id: 'leprechaun', nombre: 'Leprechaun', genero: 'M' },
    { id: 'chaman', nombre: 'Chamán', genero: 'M' },
    { id: 'chamana', nombre: 'Chamana', genero: 'F' },
    { id: 'mago', nombre: 'Mago', genero: 'M' },
    { id: 'maga', nombre: 'Maga', genero: 'F' },
    { id: 'guerrero', nombre: 'Guerrero', genero: 'M' },
    { id: 'guerrera', nombre: 'Guerrera', genero: 'F' },
    { id: 'gaucho', nombre: 'Gaucho', genero: 'M' },
    { id: 'sanador', nombre: 'Sanador', genero: 'M' },
    { id: 'sanadora', nombre: 'Sanadora', genero: 'F' },
    { id: 'maestro', nombre: 'Maestro', genero: 'M' },
    { id: 'maestra', nombre: 'Maestra', genero: 'F' },
    { id: 'alma_maestra', nombre: 'Alma Maestra', genero: 'neutro' },
    { id: 'duende_medicina', nombre: 'Duende Medicina', genero: 'M' },
    { id: 'gnomo', nombre: 'Gnomo', genero: 'M' },
    { id: 'ninfa', nombre: 'Ninfa', genero: 'F' },
    { id: 'druida', nombre: 'Druida', genero: 'M' },
    { id: 'alquimista', nombre: 'Alquimista', genero: 'M' },
    { id: 'oraculo', nombre: 'Oráculo', genero: 'neutro' },
    { id: 'hada', nombre: 'Hada (futuro)', genero: 'F' }
  ];

  // Todos los tamaños con precios
  const tamanosDisponibles = [
    { id: 'mini', nombre: 'Mini', cm: '~10', precioUSD: 70, precioUYU: 2500, esUnico: false, desc: 'Recreable' },
    { id: 'mini_especial', nombre: 'Mini Especial', cm: '~10', precioUSD: 150, precioUYU: 5500, esUnico: false, desc: 'Recreable, con detalles' },
    { id: 'pixie', nombre: 'Pixie', cm: '10-13', precioUSD: 150, precioUYU: 5500, esUnico: true, desc: 'SIEMPRE único' },
    { id: 'mediano_especial', nombre: 'Mediano Especial', cm: '17-22', precioUSD: 200, precioUYU: 8000, esUnico: true, desc: 'Pieza única' },
    { id: 'mediano_maestro_mistico', nombre: 'Mediano Maestro Místico', cm: '22-25', precioUSD: 550, precioUYU: 18000, esUnico: true, desc: 'Alta gama, único' },
    { id: 'grande_especial', nombre: 'Grande Especial', cm: '25-28', precioUSD: 450, precioUYU: 16000, esUnico: true, desc: 'Pieza única grande' },
    { id: 'grande_maestro_mistico', nombre: 'Grande Maestro Místico', cm: '27-30', precioUSD: 800, precioUYU: 32000, esUnico: true, desc: 'Máximo poder' },
    { id: 'gigante_especial', nombre: 'Gigante Especial', cm: '30+', precioUSD: 1050, precioUYU: 40000, esUnico: true, desc: 'Pieza monumental' },
    { id: 'gigante_maestro_mistico', nombre: 'Gigante Maestro Místico', cm: '35+', precioUSD: 2000, precioUYU: 80000, esUnico: true, desc: 'Obra maestra' }
  ];

  // Categorías
  const categoriasDisponibles = catalogo.categorias;

  // === CORRECCIÓN ORTOGRÁFICA AUTOMÁTICA ===
  // Mismo diccionario que el backend, para corregir en frontend sin regenerar
  const corregirOrtografia = (texto) => {
    if (!texto) return texto;

    const correcciones = {
      // Palabras pegadas con "el"
      'bloqueal ': 'bloquea el ',
      'paral ': 'para el ',
      'fueral ': 'fuera el ',
      'seral ': 'será el ',
      'eral ': 'era el ',
      'hayal ': 'haya el ',
      'tengal ': 'tenga el ',
      'puedal ': 'pueda el ',
      'veal ': 'vea el ',
      'seal ': 'sea el ',
      'cargal ': 'carga el ',
      'ganal ': 'gana el ',
      'tomal ': 'toma el ',
      'tienel ': 'tiene el ',
      'vienel ': 'viene el ',
      'importal ': 'importa ',
      'nadal ': 'nada ',
      'todal ': 'toda ',
      'cadal ': 'cada ',
      // Errores de palabras
      'investáste': 'inventaste',
      'investaste': 'inventaste',
      'herramiestás': 'herramientas',
      'herramiestas': 'herramientas',
      // Conjugaciones incorrectas
      'llegastes': 'llegaste',
      'vistes': 'viste',
      'hicistes': 'hiciste',
      'dijistes': 'dijiste',
      'pudistes': 'pudiste',
      'quisistes': 'quisiste',
      'fuistes': 'fuiste',
      'tuvistes': 'tuviste',
      // Tildes
      'entás': 'estás',
      'entas': 'estás',
      'ví': 'vi',
      'tí': 'ti',
      'fué': 'fue',
      'dió': 'dio',
      'vió': 'vio',
      // Ortografía general
      'vim': 'vine',
      'conciente': 'consciente',
      'travez': 'través',
      'atravez': 'a través',
      'poque': 'porque',
      'porqe': 'porque',
      'aveces': 'a veces',
      'enserio': 'en serio',
      'envez': 'en vez',
      'talvez': 'tal vez',
      'osea': 'o sea',
      'ósea': 'o sea',
      'nose ': 'no sé ',
      'nosé ': 'no sé ',
      ' q ': ' que ',
      'a el ': 'al ',
      'de el ': 'del ',
      // Específicos del proyecto
      'guradián': 'guardián',
      'guaridan': 'guardián',
      'pixe ': 'pixie ',
      'duened': 'duende',
      'duenede': 'duende'
    };

    let resultado = texto;
    Object.entries(correcciones).forEach(([mal, bien]) => {
      resultado = resultado.replace(new RegExp(mal, 'gi'), bien);
    });
    return resultado;
  };

  // Corregir todas las historias del batch
  const corregirTodasLasHistorias = () => {
    setBatchResultados(prev => prev.map(r => ({
      ...r,
      historia: r.historia ? corregirOrtografia(r.historia) : r.historia
    })));
  };

  // Cargar datos del catálogo cuando se selecciona un guardián existente
  const cargarDatosExistente = (nombreGuardian) => {
    const guardian = catalogo.guardianes.find(g =>
      g.nombre.toLowerCase() === nombreGuardian.toLowerCase()
    );

    if (guardian) {
      // Determinar tamaño y si es único
      let tamanoId = 'mediano_especial';
      let esUnico = true;

      if (guardian.especie === 'pixie') {
        tamanoId = 'pixie';
        esUnico = true;
      } else if (guardian.tamano === 'mini') {
        tamanoId = guardian.cm <= 10 ? 'mini' : 'mini_especial';
        esUnico = false;
      } else if (guardian.tamano === 'especial') {
        tamanoId = guardian.cm >= 17 ? 'mediano_especial' : 'mini_especial';
      } else if (guardian.tamano === 'mediano') {
        tamanoId = guardian.cm >= 22 ? 'mediano_maestro_mistico' : 'mediano_especial';
        esUnico = true;
      } else if (guardian.tamano === 'grande') {
        tamanoId = guardian.cm >= 27 ? 'grande_maestro_mistico' : 'grande_especial';
        esUnico = true;
      }

      const tamanoInfo = tamanosDisponibles.find(t => t.id === tamanoId);

      setDatosGuardian({
        nombre: guardian.nombre,
        genero: guardian.genero || 'M',
        especie: guardian.especie || 'duende',
        categoria: guardian.categoria || 'Protección',
        tamano: tamanoId,
        tamanoCm: guardian.cm || 18,
        accesorios: guardian.accesorios || '',
        esUnico: esUnico,
        precioUSD: tamanoInfo?.precioUSD || 200,
        precioUYU: tamanoInfo?.precioUYU || 8000
      });

      return guardian;
    }
    return null;
  };

  // Seleccionar guardián existente
  const seleccionarGuardian = (guardian) => {
    setGuardianSeleccionado(guardian);
    cargarDatosExistente(guardian.nombre);
  };

  // Manejar cambio de tamaño (NUNCA sobreescribe cm - eso viene del catálogo)
  const handleTamanoChange = (tamanoId) => {
    const tamanoInfo = tamanosDisponibles.find(t => t.id === tamanoId);
    if (tamanoInfo) {
      const esPixie = datosGuardian.especie === 'pixie';

      setDatosGuardian(prev => ({
        ...prev,
        tamano: tamanoId,
        // El cm NO se toca - viene del catálogo o lo pone el usuario
        esUnico: esPixie ? true : tamanoInfo.esUnico,
        precioUSD: tamanoInfo.precioUSD,
        precioUYU: tamanoInfo.precioUYU
      }));
    }
  };

  // Manejar cambio de especie
  const handleEspecieChange = (especieId) => {
    const especie = especiesDisponibles.find(e => e.id === especieId);
    const esPixie = especieId === 'pixie';

    setDatosGuardian(prev => ({
      ...prev,
      especie: especieId,
      genero: especie?.genero || prev.genero,
      esUnico: esPixie ? true : prev.esUnico,
      tamano: esPixie ? 'pixie' : prev.tamano
    }));
  };

  // Paso 1: Escanear historias existentes
  const escanearHistorias = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/historias/escanear');
      const data = await res.json();
      if (data.success) {
        setEscaneo(data.analisis);
        setGuardianes(data.guardianes);
        setSincrodestinos(data.analisis?.patrones_detectados?.sincrodestinos?.map(s => s.sincrodestino) || []);
        setPaso(2);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // Iniciar encuesta para guardián nuevo
  const iniciarEncuestaNuevo = async () => {
    setCargando(true);
    setModo('nuevo');

    // Mensaje inicial del asistente
    const mensajeInicial = {
      rol: 'asistente',
      contenido: `¡Hola! Voy a ayudarte a registrar un nuevo guardián para el catálogo.

Necesito conocer algunos datos. Empecemos:

**¿Cómo se llama este guardián?**

(Escribí el nombre que canalizaron para este ser)`
    };

    setChatEncuesta([mensajeInicial]);
    setPaso(10); // Paso especial para encuesta
    setCargando(false);
  };

  // Enviar mensaje en encuesta
  const enviarMensajeEncuesta = async () => {
    if (!inputChat.trim()) return;

    const nuevoMensaje = { rol: 'usuario', contenido: inputChat };
    const chatActualizado = [...chatEncuesta, nuevoMensaje];
    setChatEncuesta(chatActualizado);
    setInputChat('');
    setCargando(true);

    try {
      const res = await fetch('/api/admin/historias/encuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historialChat: chatActualizado,
          datosActuales: datosGuardian,
          catalogo: {
            especies: especiesDisponibles.map(e => e.nombre),
            tamanos: tamanosDisponibles.map(t => `${t.nombre} (${t.cm}cm - $${t.precioUYU})`),
            categorias: categoriasDisponibles
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        setChatEncuesta([...chatActualizado, { rol: 'asistente', contenido: data.respuesta }]);

        if (data.datosExtraidos) {
          setDatosGuardian(prev => ({ ...prev, ...data.datosExtraidos }));
        }

        if (data.encuestaCompleta) {
          setEncuestaCompleta(true);
        }
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setCargando(false);
  };

  // Continuar después de encuesta
  const continuarDespuesEncuesta = () => {
    setGuardianSeleccionado({ nombre: datosGuardian.nombre, esNuevo: true });
    setPaso(3);
  };

  // Analizar imagen
  const analizarImagen = async () => {
    if (!guardianSeleccionado?.imagen) {
      setPaso(4);
      cargarPreguntas();
      return;
    }

    setCargando(true);
    try {
      const res = await fetch('/api/admin/historias/analizar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagenUrl: guardianSeleccionado.imagen,
          nombre: datosGuardian.nombre,
          categoria: datosGuardian.categoria
        })
      });
      const data = await res.json();
      if (data.success) {
        setAnalisisImagen(data.analisis);
      }
    } catch (e) {
      console.error('Error analizando imagen:', e);
    }
    setPaso(4);
    cargarPreguntas();
    setCargando(false);
  };

  // Cargar preguntas dinámicas
  const cargarPreguntas = async () => {
    try {
      const params = new URLSearchParams({
        nombre: datosGuardian.nombre,
        categoria: datosGuardian.categoria,
        especie: datosGuardian.especie,
        analisis: analisisImagen || ''
      });
      const res = await fetch(`/api/admin/historias?${params}`);
      const data = await res.json();
      if (data.success) {
        setPreguntas(data.preguntas);
      }
    } catch (e) {
      console.error('Error cargando preguntas:', e);
    }
  };

  // Generar historia
  const generarHistoria = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/historias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: guardianSeleccionado?.id,
          ...datosGuardian,
          analisisImagen,
          respuestasEncuesta: respuestas,
          sincrodestinos_usados: sincrodestinos
        })
      });
      const data = await res.json();
      if (data.success) {
        setHistoriaGenerada(data.historia);
        // Guardar datos del sistema experto
        setDatosConversion({
          score: data.score_conversion,
          arco: data.arco_emocional,
          cierres: data.cierres_por_perfil,
          hooks: data.hooks_alternativos,
          aprobada: data.aprobada,
          advertencias: data.advertencias,
          hookUsado: data.datos?.hookUsado,
          sincrodestinoUsado: data.datos?.sincrodestinoUsado
        });
        setPaso(6);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // Guardar en WooCommerce
  const guardarEnWoo = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/historias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: guardianSeleccionado?.id,
          historia: historiaGenerada,
          datosGuardian: datosGuardian
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Historia guardada exitosamente para ${datosGuardian.nombre}`);
        // Reset
        setPaso(1);
        setGuardianSeleccionado(null);
        setHistoriaGenerada('');
        setRespuestas({});
        setModo(null);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // === FUNCIONES MODO BATCH ===

  // Iniciar batch - genera la primera historia
  const iniciarBatch = async () => {
    setBatchActual(0);
    setPaso(11);
    await generarHistoriaBatch(0);
  };

  // Generar historia para un guardián del batch
  const generarHistoriaBatch = async (index, feedbackRegeneracion = null) => {
    const guardian = batchSeleccion[index];
    if (!guardian) return;

    setCargando(true);
    setBatchHistoria('');

    // Buscar datos completos en el catálogo (buscar por nombre parcial porque WooCommerce tiene nombres largos)
    const nombreBusqueda = guardian.nombre.split(' - ')[0].split(' ')[0].toLowerCase();
    const datosCatalogo = catalogo.guardianes.find(g =>
      g.nombre.toLowerCase() === nombreBusqueda ||
      g.nombre.toLowerCase().startsWith(nombreBusqueda) ||
      guardian.nombre.toLowerCase().includes(g.nombre.toLowerCase())
    );

    console.log('Buscando:', nombreBusqueda, 'Encontrado:', datosCatalogo?.nombre, 'CM:', datosCatalogo?.cm, 'Especie:', datosCatalogo?.especie);

    // Si hay feedback de regeneración, usar la categoría override si existe
    const categoriaFinal = feedbackRegeneracion?.categoriaOverride || datosCatalogo?.categoria || 'Protección';

    try {
      const res = await fetch('/api/admin/historias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: guardian.id,
          nombre: datosCatalogo?.nombre || guardian.nombre,
          genero: datosCatalogo?.genero || 'M',
          especie: datosCatalogo?.especie || 'duende',
          categoria: categoriaFinal,
          tamano: datosCatalogo?.tamano || 'mediano_especial',
          tamanoCm: datosCatalogo?.cm || 18,
          accesorios: datosCatalogo?.accesorios || '',
          // Recreables: tamaños pequeños (≤15cm) EXCEPTO pixies que siempre son únicas
          esUnico: datosCatalogo?.especie === 'pixie' || (datosCatalogo?.cm || 18) > 15,
          sincrodestinos_usados: sincrodestinos,
          modoBatch: true,
          // Feedback de regeneración para mejorar la historia
          feedbackRegeneracion: feedbackRegeneracion ? {
            problema: feedbackRegeneracion.problema,
            indicaciones: feedbackRegeneracion.indicaciones
          } : null
        })
      });
      const data = await res.json();
      if (data.success) {
        setBatchHistoria(data.historia);
        // Guardar datos del sistema experto para batch
        setDatosConversionBatch({
          score: data.score_conversion,
          arco: data.arco_emocional,
          cierres: data.cierres_por_perfil,
          hooks: data.hooks_alternativos,
          aprobada: data.aprobada,
          advertencias: data.advertencias,
          hookUsado: data.datos?.hookUsado,
          sincrodestinoUsado: data.datos?.sincrodestinoUsado
        });
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // Mostrar mini-encuesta antes de regenerar
  const regenerarBatch = () => {
    setShowMiniEncuesta(true);
    setMiniEncuesta({ problema: '', categoriaOverride: '', indicaciones: '' });
  };

  // Regenerar con las respuestas de la mini-encuesta
  const confirmarRegeneracion = async () => {
    setShowMiniEncuesta(false);
    await generarHistoriaBatch(batchActual, miniEncuesta);
  };

  // Rechazar y pasar al siguiente
  const rechazarBatch = async () => {
    if (batchActual < batchSeleccion.length - 1) {
      const next = batchActual + 1;
      setBatchActual(next);
      await generarHistoriaBatch(next);
    } else {
      // Terminamos
      alert('Batch completado');
      setPaso(1);
      setModo(null);
      setBatchSeleccion([]);
      setBatchActual(0);
    }
  };

  // Aprobar, guardar y pasar al siguiente
  const aprobarBatch = async () => {
    const guardian = batchSeleccion[batchActual];
    const datosCatalogo = catalogo.guardianes.find(g =>
      g.nombre.toLowerCase() === guardian.nombre.toLowerCase()
    );

    setCargando(true);
    try {
      const res = await fetch('/api/admin/historias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: guardian.id,
          historia: batchHistoria,
          datosGuardian: {
            nombre: datosCatalogo?.nombre || guardian.nombre,
            especie: datosCatalogo?.especie,
            categoria: datosCatalogo?.categoria,
            tamanoCm: datosCatalogo?.cm,
            accesorios: datosCatalogo?.accesorios
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        if (batchActual < batchSeleccion.length - 1) {
          const next = batchActual + 1;
          setBatchActual(next);
          await generarHistoriaBatch(next);
        } else {
          alert(`Batch completado. ${batchSeleccion.length} historias guardadas.`);
          setPaso(1);
          setModo(null);
          setBatchSeleccion([]);
          setBatchActual(0);
        }
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // === MODO DIRECTO ===
  const [directoHistoria, setDirectoHistoria] = useState('');
  const [directoGuardian, setDirectoGuardian] = useState(null);
  const [directoConversion, setDirectoConversion] = useState(null);
  const [busquedaDirecto, setBusquedaDirecto] = useState('');
  const [directoEspecializacion, setDirectoEspecializacion] = useState('');
  const [directoEspecializacionTexto, setDirectoEspecializacionTexto] = useState('');
  const [guardandoWC, setGuardandoWC] = useState(false);
  const [guardadoWC, setGuardadoWC] = useState(null); // null, 'success', 'error'

  // Especializaciones disponibles organizadas por grupo
  const especializacionesGrupos = {
    principales: {
      titulo: '⭐ Más Pedidos',
      chips: [
        { id: 'fortuna', label: 'Fortuna/Suerte', descripcion: 'Atrae buena suerte y oportunidades' },
        { id: 'proteccion', label: 'Protección', descripcion: 'Protege energía, hogar o persona' },
        { id: 'abundancia', label: 'Abundancia', descripcion: 'Prosperidad y flujo económico' },
        { id: 'sanacion', label: 'Sanación', descripcion: 'Sana heridas emocionales' },
        { id: 'abrecaminos', label: 'Abrecaminos', descripcion: 'Abrir puertas, nuevos rumbos' },
        { id: 'vigilante', label: 'Vigilante', descripcion: 'Vigila y protege 24/7' },
      ]
    },
    amor: {
      titulo: '💕 Amor y Vínculos',
      chips: [
        { id: 'amor_romantico', label: 'Amor Pareja', descripcion: 'Abre el corazón al amor romántico' },
        { id: 'amor_propio', label: 'Amor Propio', descripcion: 'Autoestima y valor personal' },
        { id: 'amor_hijos', label: 'Amor de Hijos', descripcion: 'Vínculo padres-hijos' },
        { id: 'maternidad', label: 'Maternidad', descripcion: 'Ser madre, criar, acompañar' },
        { id: 'fertilidad', label: 'Fertilidad', descripcion: 'Buscar embarazo, concepción' },
        { id: 'familia', label: 'Familia', descripcion: 'Armonía familiar, lazos' },
        { id: 'amistades', label: 'Amistades', descripcion: 'Vínculos de amistad' },
        { id: 'reconciliacion', label: 'Reconciliación', descripcion: 'Volver a conectar, perdonar' },
        { id: 'soledad', label: 'Soledad', descripcion: 'Superar el aislamiento' },
      ]
    },
    sanacion: {
      titulo: '🌿 Sanación',
      chips: [
        { id: 'sanacion_emocional', label: 'Emocional', descripcion: 'Heridas del corazón' },
        { id: 'sanacion_transgeneracional', label: 'Transgeneracional', descripcion: 'Lo heredado de familia' },
        { id: 'sanacion_fisica', label: 'Física', descripcion: 'Acompañar procesos del cuerpo' },
        { id: 'sanacion_psicosomatica', label: 'Psicosomática', descripcion: 'Cuerpo que habla lo que mente calla' },
        { id: 'duelos', label: 'Duelos', descripcion: 'Acompañar pérdidas y despedidas' },
        { id: 'patrones', label: 'Patrones', descripcion: 'Romper ciclos que se repiten' },
        { id: 'adicciones', label: 'Adicciones', descripcion: 'Superar dependencias' },
        { id: 'traumas', label: 'Traumas', descripcion: 'Sanar heridas profundas' },
      ]
    },
    proteccion: {
      titulo: '🛡️ Protección',
      chips: [
        { id: 'proteccion_energetica', label: 'Energética', descripcion: 'Absorbo todo, me dreno' },
        { id: 'proteccion_hogar', label: 'Del Hogar', descripcion: 'Casa, espacio, familia' },
        { id: 'proteccion_ninos', label: 'De Niños', descripcion: 'Cuidar y proteger hijos' },
        { id: 'proteccion_auto', label: 'Del Auto', descripcion: 'Protección de vehículos' },
        { id: 'proteccion_viajes', label: 'De Viajes', descripcion: 'Protección al viajar' },
        { id: 'proteccion_mascotas', label: 'De Mascotas', descripcion: 'Cuidar animales queridos' },
        { id: 'limites', label: 'Límites', descripcion: 'No saber decir que no' },
        { id: 'envidias', label: 'Envidias', descripcion: 'Proteger de malas energías ajenas' },
      ]
    },
    trabajo: {
      titulo: '💼 Trabajo y Dinero',
      chips: [
        { id: 'negocios', label: 'Negocios', descripcion: 'Emprendedores, comercio, ventas' },
        { id: 'emprendimiento', label: 'Emprendimiento', descripcion: 'Arrancar algo propio' },
        { id: 'buscar_trabajo', label: 'Buscar Trabajo', descripcion: 'Conseguir empleo' },
        { id: 'entrevistas', label: 'Entrevistas', descripcion: 'Éxito en entrevistas laborales' },
        { id: 'liderazgo', label: 'Liderazgo', descripcion: 'Liderar equipos, ser jefe' },
        { id: 'creatividad', label: 'Creatividad', descripcion: 'Artistas, creativos, ideas' },
        { id: 'deudas', label: 'Deudas', descripcion: 'Salir de deudas, ordenar finanzas' },
        { id: 'clientes', label: 'Atraer Clientes', descripcion: 'Más clientes, más ventas' },
      ]
    },
    estudio: {
      titulo: '📚 Estudio y Mente',
      chips: [
        { id: 'estudio', label: 'Estudio', descripcion: 'Concentración, aprendizaje' },
        { id: 'examenes', label: 'Exámenes', descripcion: 'Aprobar, rendir bien' },
        { id: 'memoria', label: 'Memoria', descripcion: 'Recordar, retener información' },
        { id: 'concentracion', label: 'Concentración', descripcion: 'Focus, no distraerse' },
        { id: 'sabiduria', label: 'Sabiduría', descripcion: 'Claridad y guía en decisiones' },
        { id: 'intuicion', label: 'Intuición', descripcion: 'Confiar en la voz interior' },
        { id: 'claridad', label: 'Claridad Mental', descripcion: 'Pensar claro, decidir' },
      ]
    },
    bienestar: {
      titulo: '🧘 Bienestar',
      chips: [
        { id: 'calma', label: 'Calma/Paz', descripcion: 'Trae serenidad y tranquilidad' },
        { id: 'ansiedad', label: 'Ansiedad', descripcion: 'Reducir la ansiedad' },
        { id: 'insomnio', label: 'Insomnio', descripcion: 'Dormir mejor, descansar' },
        { id: 'meditacion', label: 'Meditación/Zen', descripcion: 'Mindfulness, paz interior' },
        { id: 'alegria', label: 'Alegría', descripcion: 'Liviandad y felicidad' },
        { id: 'energia', label: 'Energía', descripcion: 'Vitalidad, fuerza, ganas' },
        { id: 'confianza', label: 'Confianza', descripcion: 'Seguridad en uno mismo' },
      ]
    },
    cambios: {
      titulo: '🦋 Cambios y Etapas',
      chips: [
        { id: 'transformacion', label: 'Transformación', descripcion: 'Cambio y renacimiento' },
        { id: 'nuevos_comienzos', label: 'Nuevos Comienzos', descripcion: 'Empezar de nuevo' },
        { id: 'mudanza', label: 'Mudanza', descripcion: 'Nuevo hogar, nuevo espacio' },
        { id: 'separacion', label: 'Separación', descripcion: 'Superar ruptura, divorcio' },
        { id: 'jubilacion', label: 'Jubilación', descripcion: 'Nueva etapa de vida' },
        { id: 'desapego', label: 'Desapego', descripcion: 'Soltar lo que ya no sirve' },
        { id: 'miedos', label: 'Miedos', descripcion: 'Superar miedos y fobias' },
      ]
    },
    espiritual: {
      titulo: '✨ Espiritual',
      chips: [
        { id: 'conexion_espiritual', label: 'Conexión', descripcion: 'Conectar con lo sagrado' },
        { id: 'deseos', label: 'Deseos', descripcion: 'Manifestar intenciones' },
        { id: 'suenos', label: 'Sueños', descripcion: 'Recordar, interpretar sueños' },
        { id: 'proposito', label: 'Propósito', descripcion: 'Encontrar sentido de vida' },
        { id: 'gratitud', label: 'Gratitud', descripcion: 'Cultivar agradecimiento' },
      ]
    }
  };

  // Para compatibilidad, también como array plano
  const especializacionesRapidas = Object.values(especializacionesGrupos).flatMap(g => g.chips);

  // Seleccionar guardián para modo directo (va al paso de especialización)
  const seleccionarParaDirecto = (guardian) => {
    setDirectoGuardian(guardian);
    setDirectoEspecializacion('');
    setDirectoEspecializacionTexto('');
    setPaso(14); // Paso de selección de especialización
  };

  // Generar historia directo desde catálogo local
  const generarDirecto = async (especializacionOverride = null) => {
    const guardian = directoGuardian;
    if (!guardian) return;

    // Determinar la especialización a usar
    const especializacion = especializacionOverride || directoEspecializacionTexto || directoEspecializacion;

    setDirectoHistoria('');
    setDirectoConversion(null);
    setCargando(true);
    setPaso(13); // Paso de preview directo

    try {
      const res = await fetch('/api/admin/historias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: guardian.nombre,
          especie: guardian.especie || 'duende',
          categoria: guardian.categoria || 'Protección',
          tamanoCm: guardian.cm || 18,
          accesorios: guardian.accesorios || '',
          // Recreables: tamaños pequeños (≤15cm) EXCEPTO pixies que siempre son únicas
          esUnico: guardian.especie === 'pixie' || (guardian.cm || 18) > 15,
          // NUEVO: especialización elegida por el usuario
          especializacion: especializacion
        })
      });
      const data = await res.json();
      if (data.success) {
        setDirectoHistoria(data.historia);
        setDirectoConversion({
          score: data.score_conversion,
          arco: data.arco_emocional,
          cierres: data.cierres_por_perfil,
          hooks: data.hooks_alternativos,
          aprobada: data.aprobada,
          advertencias: data.advertencias,
          hookUsado: data.datos?.hookUsado,
          sincrodestinoUsado: data.datos?.sincrodestinoUsado,
          especializacionUsada: especializacion
        });
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // Guardar historia en WooCommerce
  const guardarEnWooCommerce = async () => {
    if (!directoGuardian || !directoHistoria) return;

    setGuardandoWC(true);
    setGuardadoWC(null);

    try {
      // 1. Buscar producto en WooCommerce por nombre
      const searchRes = await fetch(`/api/woo/productos?search=${encodeURIComponent(directoGuardian.nombre)}`);
      const searchData = await searchRes.json();

      if (!searchData.success || !searchData.productos || searchData.productos.length === 0) {
        throw new Error(`No se encontró "${directoGuardian.nombre}" en WooCommerce`);
      }

      // Buscar el producto que coincida con el nombre
      const producto = searchData.productos.find(p =>
        p.nombre.toLowerCase().includes(directoGuardian.nombre.toLowerCase())
      );

      if (!producto) {
        throw new Error(`No se encontró producto que coincida con "${directoGuardian.nombre}"`);
      }

      // 2. Guardar historia en el producto
      const saveRes = await fetch('/api/admin/historias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: producto.id,
          historia: directoHistoria
        })
      });

      const saveData = await saveRes.json();

      if (!saveData.success) {
        throw new Error(saveData.error || 'Error guardando historia');
      }

      setGuardadoWC('success');
      alert(`✅ Historia guardada en WooCommerce para "${producto.nombre}"`);

    } catch (e) {
      setGuardadoWC('error');
      alert(`❌ Error: ${e.message}`);
    }

    setGuardandoWC(false);
  };

  // === FUNCIONES BATCH INTELIGENTE ===

  // Toggle selección de guardián
  const toggleSeleccionBatch = (guardian) => {
    setBatchSeleccionados(prev => {
      const existe = prev.find(g => g.nombre === guardian.nombre);
      if (existe) {
        return prev.filter(g => g.nombre !== guardian.nombre);
      } else {
        return [...prev, guardian];
      }
    });
  };

  // Agregar seleccionados a un grupo con especialización
  const agregarAGrupo = (especializacion) => {
    if (batchSeleccionados.length === 0) return;

    const nuevoGrupo = {
      id: `grupo-${Date.now()}`,
      especializacion,
      guardianes: [...batchSeleccionados],
      historias: [],
      hooksUsados: [],
      sincrodestUsados: []
    };

    setBatchGrupos(prev => [...prev, nuevoGrupo]);
    setBatchSeleccionados([]); // Limpiar selección
  };

  // Quitar guardián de un grupo
  const quitarDeGrupo = (grupoId, guardianNombre) => {
    setBatchGrupos(prev => prev.map(g => {
      if (g.id === grupoId) {
        return {
          ...g,
          guardianes: g.guardianes.filter(gn => gn.nombre !== guardianNombre)
        };
      }
      return g;
    }).filter(g => g.guardianes.length > 0)); // Eliminar grupos vacíos
  };

  // Eliminar grupo completo
  const eliminarGrupo = (grupoId) => {
    setBatchGrupos(prev => prev.filter(g => g.id !== grupoId));
  };

  // Generar todas las historias de todos los grupos
  const generarTodosBatch = async () => {
    if (batchGrupos.length === 0) return;

    setBatchGenerando(true);
    setBatchResultados([]);

    const totalGuardianes = batchGrupos.reduce((acc, g) => acc + g.guardianes.length, 0);
    let contador = 0;

    const resultados = [];

    // Procesar cada grupo
    for (const grupo of batchGrupos) {
      const hooksUsados = [];
      const sincrodestUsados = [];

      // Procesar cada guardián del grupo secuencialmente
      for (const guardian of grupo.guardianes) {
        contador++;
        setBatchProgreso({
          actual: contador,
          total: totalGuardianes,
          guardian: guardian.nombre,
          grupo: grupo.especializacion
        });

        try {
          const res = await fetch('/api/admin/historias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: guardian.nombre,
              especie: guardian.especie || 'duende',
              categoria: guardian.categoria || 'Protección',
              tamanoCm: guardian.cm || 18,
              accesorios: guardian.accesorios || '',
              esUnico: guardian.especie === 'pixie' || (guardian.cm || 18) > 15,
              especializacion: grupo.especializacion,
              // CLAVE: pasar lo que ya se usó para evitar repeticiones
              hooks_usados: hooksUsados,
              sincrodestinos_usados: sincrodestUsados
            })
          });

          const data = await res.json();

          if (data.success) {
            // Trackear lo usado
            if (data.datos?.hookUsado) hooksUsados.push(data.datos.hookUsado);
            if (data.datos?.sincrodestinoUsado) sincrodestUsados.push(data.datos.sincrodestinoUsado);

            resultados.push({
              guardian,
              grupo: grupo.especializacion,
              grupoId: grupo.id,
              historia: corregirOrtografia(data.historia), // Auto-corrección
              score: data.score_conversion,
              arco: data.arco_emocional,
              cierres: data.cierres_por_perfil,
              aprobada: data.aprobada,
              advertencias: data.advertencias,
              aprobado: false, // Para que el usuario apruebe
              guardadoWC: false
            });
          } else {
            resultados.push({
              guardian,
              grupo: grupo.especializacion,
              grupoId: grupo.id,
              error: data.error,
              aprobado: false
            });
          }
        } catch (e) {
          resultados.push({
            guardian,
            grupo: grupo.especializacion,
            grupoId: grupo.id,
            error: e.message,
            aprobado: false
          });
        }
      }
    }

    setBatchResultados(resultados);
    setBatchGenerando(false);
    setPaso(16); // Ir a paso de revisión
  };

  // Aprobar/desaprobar resultado
  const toggleAprobacion = (index) => {
    setBatchResultados(prev => prev.map((r, i) =>
      i === index ? { ...r, aprobado: !r.aprobado } : r
    ));
  };

  // Regenerar una historia específica
  const regenerarUno = async (index) => {
    const resultado = batchResultados[index];
    if (!resultado) return;

    // Obtener hooks y sincrodestinos ya usados en el mismo grupo
    const usadosEnGrupo = batchResultados
      .filter(r => r.grupoId === resultado.grupoId && r.historia)
      .map(r => ({
        hook: r.historia?.match(/^[^\n]+/)?.[0] || '',
      }));

    setBatchResultados(prev => prev.map((r, i) =>
      i === index ? { ...r, regenerando: true } : r
    ));

    try {
      const res = await fetch('/api/admin/historias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: resultado.guardian.nombre,
          especie: resultado.guardian.especie || 'duende',
          categoria: resultado.guardian.categoria || 'Protección',
          tamanoCm: resultado.guardian.cm || 18,
          accesorios: resultado.guardian.accesorios || '',
          esUnico: resultado.guardian.especie === 'pixie' || (resultado.guardian.cm || 18) > 15,
          especializacion: resultado.grupo
        })
      });

      const data = await res.json();

      setBatchResultados(prev => prev.map((r, i) =>
        i === index ? {
          ...r,
          historia: corregirOrtografia(data.historia), // Auto-corrección
          score: data.score_conversion,
          arco: data.arco_emocional,
          cierres: data.cierres_por_perfil,
          aprobada: data.aprobada,
          advertencias: data.advertencias,
          error: data.success ? null : data.error,
          regenerando: false
        } : r
      ));
    } catch (e) {
      setBatchResultados(prev => prev.map((r, i) =>
        i === index ? { ...r, error: e.message, regenerando: false } : r
      ));
    }
  };

  // Guardar todos los aprobados en WooCommerce
  const guardarTodosEnWC = async () => {
    const aprobados = batchResultados.filter(r => r.aprobado && r.historia && !r.guardadoWC);
    if (aprobados.length === 0) {
      alert('No hay historias aprobadas para guardar');
      return;
    }

    let guardados = 0;
    let errores = 0;

    for (const resultado of aprobados) {
      try {
        // Buscar producto en WC
        const searchRes = await fetch(`/api/woo/productos?search=${encodeURIComponent(resultado.guardian.nombre)}`);
        const searchData = await searchRes.json();

        const producto = searchData.productos?.find(p =>
          p.nombre.toLowerCase().includes(resultado.guardian.nombre.toLowerCase())
        );

        if (!producto) {
          errores++;
          continue;
        }

        // Guardar historia
        const saveRes = await fetch('/api/admin/historias', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productoId: producto.id,
            historia: resultado.historia
          })
        });

        const saveData = await saveRes.json();

        if (saveData.success) {
          guardados++;
          // Marcar como guardado
          setBatchResultados(prev => prev.map(r =>
            r.guardian.nombre === resultado.guardian.nombre ? { ...r, guardadoWC: true } : r
          ));
        } else {
          errores++;
        }
      } catch (e) {
        errores++;
      }
    }

    alert(`✅ ${guardados} historias guardadas en WooCommerce${errores > 0 ? `\n❌ ${errores} errores` : ''}`);
  };

  // Filtrar catálogo para modo directo
  const catalogoFiltrado = catalogo.guardianes.filter(g => {
    if (!g.nombre.toLowerCase().includes(busquedaDirecto.toLowerCase())) return false;
    if (filtroEspecie && g.especie !== filtroEspecie) return false;
    if (filtroCategoria && g.categoria !== filtroCategoria) return false;
    return true;
  });

  // Filtrar guardianes
  const guardianesFiltrados = guardianes.filter(g =>
    g.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Filtrar para batch (con filtros de especie y categoría)
  const guardianesFiltradosBatch = guardianes.filter(g => {
    // Filtro por nombre
    if (!g.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;

    // Filtro por especie (buscar en catálogo)
    if (filtroEspecie) {
      const datosCat = catalogo.guardianes.find(cg =>
        cg.nombre.toLowerCase() === g.nombre.toLowerCase()
      );
      if (!datosCat || !datosCat.especie?.toLowerCase().includes(filtroEspecie.toLowerCase())) {
        return false;
      }
    }

    // Filtro por categoría
    if (filtroCategoria) {
      const datosCat = catalogo.guardianes.find(cg =>
        cg.nombre.toLowerCase() === g.nombre.toLowerCase()
      );
      if (!datosCat || datosCat.categoria !== filtroCategoria) {
        // También verificar en categorías del WooCommerce
        if (!g.categorias?.includes(filtroCategoria)) {
          return false;
        }
      }
    }

    return true;
  });

  return (
    <div className="generador-container">
      <header className="generador-header">
        <h1>Generador de Historias</h1>
        <p className="subtitulo">Sistema inteligente de creación de contenido para guardianes</p>
        <div className="pasos">
          <span className={paso >= 1 ? 'activo' : ''}>1. Inicio</span>
          <span className={paso >= 2 ? 'activo' : ''}>2. Seleccionar</span>
          <span className={paso >= 3 ? 'activo' : ''}>3. Datos</span>
          <span className={paso >= 4 ? 'activo' : ''}>4. Encuesta</span>
          <span className={paso >= 6 ? 'activo' : ''}>5. Preview</span>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="generador-main">
        {/* PASO 1: Elegir modo */}
        {paso === 1 && (
          <div className="paso-content">
            <h2>¿Qué querés hacer?</h2>

            <div className="modos-grid">
              <div className="modo-card" onClick={() => { setModo('existente'); escanearHistorias(); }}>
                <div className="icono">📚</div>
                <h3>Guardián Existente</h3>
                <p>Generar o regenerar historia para un guardián que ya está en el catálogo</p>
                <span className="badge">Carga automática de datos</span>
              </div>

              <div className="modo-card" onClick={iniciarEncuestaNuevo}>
                <div className="icono">✨</div>
                <h3>Guardián Nuevo</h3>
                <p>Registrar un nuevo guardián con encuesta inteligente</p>
                <span className="badge">Claude te guía paso a paso</span>
              </div>

              <div className="modo-card rapido" onClick={() => { setModo('batch'); escanearHistorias(); }}>
                <div className="icono">⚡</div>
                <h3>Modo Rápido</h3>
                <p>Generar historias directo desde el catálogo, sin encuesta</p>
                <span className="badge">Solo aprobar/rechazar</span>
              </div>

              <div className="modo-card directo" onClick={() => { setModo('directo'); setPaso(12); }}>
                <div className="icono">🎯</div>
                <h3>Modo Directo</h3>
                <p>Click en guardián → historia generada. Sin vueltas.</p>
                <span className="badge">1 click = 1 historia</span>
              </div>

              <div className="modo-card batch-inteligente" onClick={() => { setModo('batch-inteligente'); setPaso(15); }}>
                <div className="icono">🚀</div>
                <h3>Batch Inteligente</h3>
                <p>Seleccioná varios, agrupalos por especialización, generá todos de una vez</p>
                <span className="badge destacado">Sin repetir hooks ni sincrodestinos</span>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: Seleccionar guardián existente */}
        {paso === 2 && modo === 'existente' && (
          <div className="paso-content">
            <h2>Seleccionar Guardián</h2>

            {escaneo && (
              <div className="resumen-escaneo">
                <div className="stats">
                  <div className="stat">
                    <span className="numero">{escaneo.total_guardianes}</span>
                    <span className="label">Total</span>
                  </div>
                  <div className="stat">
                    <span className="numero">{escaneo.con_historia}</span>
                    <span className="label">Con Historia</span>
                  </div>
                  <div className="stat">
                    <span className="numero">{escaneo.sin_historia}</span>
                    <span className="label">Sin Historia</span>
                  </div>
                </div>
              </div>
            )}

            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="guardianes-grid">
              {guardianesFiltrados.map(g => (
                <div
                  key={g.id}
                  className={`guardian-card ${guardianSeleccionado?.id === g.id ? 'seleccionado' : ''}`}
                  onClick={() => seleccionarGuardian(g)}
                >
                  {g.imagen && <img src={g.imagen} alt={g.nombre} />}
                  <div className="info">
                    <h4>{g.nombre}</h4>
                    <span className="categoria">{g.categorias?.[0] || 'Sin categoría'}</span>
                    <span className={`estado ${g.tiene_historia ? 'tiene' : 'no-tiene'}`}>
                      {g.tiene_historia ? '✓ Con historia' : '○ Sin historia'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {guardianSeleccionado && (
              <div className="acciones-fijas">
                <p>Seleccionado: <strong>{guardianSeleccionado.nombre}</strong></p>
                <button className="btn-primary" onClick={() => setPaso(3)}>
                  Continuar
                </button>
              </div>
            )}
          </div>
        )}

        {/* PASO 2 BATCH: Selección múltiple para modo rápido */}
        {paso === 2 && modo === 'batch' && (
          <div className="paso-content">
            <h2>Modo Rápido - Seleccioná guardianes</h2>
            <p className="instruccion-batch">Hacé click en los guardianes para seleccionarlos. Luego generamos las historias directo.</p>

            {escaneo && (
              <div className="resumen-escaneo">
                <div className="stats">
                  <div className="stat">
                    <span className="numero">{escaneo.sin_historia}</span>
                    <span className="label">Sin Historia</span>
                  </div>
                  <div className="stat seleccionados">
                    <span className="numero">{batchSeleccion.length}</span>
                    <span className="label">Seleccionados</span>
                  </div>
                </div>
              </div>
            )}

            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button
                className="btn-secondary"
                onClick={() => setBatchSeleccion(guardianesFiltradosBatch.filter(g => !g.tiene_historia))}
              >
                Seleccionar filtrados sin historia
              </button>
            </div>

            <div className="filtros-batch">
              <span style={{opacity: 0.7, marginRight: '0.5rem'}}>Especie:</span>
              <button
                className={`filtro-btn ${filtroEspecie === null ? 'activo' : ''}`}
                onClick={() => setFiltroEspecie(null)}
              >
                Todas
              </button>
              <button
                className={`filtro-btn ${filtroEspecie === 'pixie' ? 'activo' : ''}`}
                onClick={() => setFiltroEspecie('pixie')}
              >
                Pixies
              </button>
              <button
                className={`filtro-btn ${filtroEspecie === 'duende' ? 'activo' : ''}`}
                onClick={() => setFiltroEspecie('duende')}
              >
                Duendes
              </button>
              <button
                className={`filtro-btn ${filtroEspecie === 'bruja' ? 'activo' : ''}`}
                onClick={() => setFiltroEspecie('bruja')}
              >
                Brujas
              </button>
              <button
                className={`filtro-btn ${filtroEspecie === 'vikingo' ? 'activo' : ''}`}
                onClick={() => setFiltroEspecie('vikingo')}
              >
                Vikingos
              </button>
              <button
                className={`filtro-btn ${filtroEspecie === 'elfo' ? 'activo' : ''}`}
                onClick={() => setFiltroEspecie('elfo')}
              >
                Elfos
              </button>
            </div>

            <div className="filtros-batch">
              <span style={{opacity: 0.7, marginRight: '0.5rem'}}>Categoría:</span>
              <button
                className={`filtro-btn ${filtroCategoria === null ? 'activo' : ''}`}
                onClick={() => setFiltroCategoria(null)}
              >
                Todas
              </button>
              {catalogo.categorias?.map(cat => (
                <button
                  key={cat}
                  className={`filtro-btn ${filtroCategoria === cat ? 'activo' : ''}`}
                  onClick={() => setFiltroCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="guardianes-grid batch-grid">
              {guardianesFiltradosBatch.map(g => (
                <div
                  key={g.id}
                  className={`guardian-card ${batchSeleccion.some(s => s.id === g.id) ? 'seleccionado' : ''} ${g.tiene_historia ? 'tiene-historia' : ''}`}
                  onClick={() => {
                    if (batchSeleccion.some(s => s.id === g.id)) {
                      setBatchSeleccion(batchSeleccion.filter(s => s.id !== g.id));
                    } else {
                      setBatchSeleccion([...batchSeleccion, g]);
                    }
                  }}
                >
                  {g.imagen && <img src={g.imagen} alt={g.nombre} />}
                  <div className="info">
                    <h4>{g.nombre}</h4>
                    <span className="categoria">{g.categorias?.[0] || 'Sin categoría'}</span>
                    {batchSeleccion.some(s => s.id === g.id) && <span className="check">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            {batchSeleccion.length > 0 && (
              <div className="acciones-fijas">
                <p><strong>{batchSeleccion.length}</strong> guardián(es) seleccionado(s)</p>
                <div className="btns">
                  <button className="btn-secondary" onClick={() => setBatchSeleccion([])}>
                    Limpiar
                  </button>
                  <button className="btn-primary" onClick={iniciarBatch}>
                    Generar {batchSeleccion.length} historia(s)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PASO 11 BATCH: Generación y preview rápido */}
        {paso === 11 && modo === 'batch' && (
          <div className="paso-content paso-batch-preview">
            <h2>
              {batchActual + 1} de {batchSeleccion.length}: {batchSeleccion[batchActual]?.nombre}
            </h2>

            {(() => {
              const nombreGuardian = batchSeleccion[batchActual]?.nombre || '';
              const nombreBusqueda = nombreGuardian.split(' - ')[0].split(' ')[0].toLowerCase();
              const datosG = catalogo.guardianes.find(g =>
                g.nombre.toLowerCase() === nombreBusqueda ||
                g.nombre.toLowerCase().startsWith(nombreBusqueda) ||
                nombreGuardian.toLowerCase().includes(g.nombre.toLowerCase())
              );
              return (
                <div className="batch-info">
                  <span>{datosG?.especie || 'sin datos'}</span>
                  <span>{datosG?.categoria || '-'}</span>
                  <span>{datosG?.cm ? `${datosG.cm}cm` : '-'}</span>
                  <span className="accesorios-preview">{datosG?.accesorios || '-'}</span>
                </div>
              );
            })()}

            {cargando ? (
              <div className="generando">
                <div className="spinner"></div>
                <p>Generando historia para {batchSeleccion[batchActual]?.nombre}...</p>
              </div>
            ) : (
              <>
                {/* Score de conversión batch */}
                {datosConversionBatch && (
                  <div className={`conversion-score compact ${datosConversionBatch.aprobada ? 'aprobada' : 'rechazada'}`}>
                    <div className="score-header">
                      <span className="score-total">
                        {datosConversionBatch.aprobada ? '✅' : '⚠️'} Score: {datosConversionBatch.score?.total || 0}/50
                      </span>
                      <span className="arco-score">
                        Arco: {datosConversionBatch.arco?.score || 0}%
                      </span>
                      <div className="score-mini">
                        <span title="Identificación">I:{datosConversionBatch.score?.identificacion || 0}</span>
                        <span title="Dolor">D:{datosConversionBatch.score?.dolor || 0}</span>
                        <span title="Solución">S:{datosConversionBatch.score?.solucion || 0}</span>
                        <span title="Urgencia">U:{datosConversionBatch.score?.urgencia || 0}</span>
                        <span title="Confianza">C:{datosConversionBatch.score?.confianza || 0}</span>
                      </div>
                    </div>
                    {datosConversionBatch.advertencias && datosConversionBatch.advertencias.length > 0 && (
                      <div className="advertencias-mini">
                        {datosConversionBatch.advertencias.slice(0, 3).map((adv, i) => (
                          <span key={i} className="adv-tag">{adv}</span>
                        ))}
                        {datosConversionBatch.advertencias.length > 3 && (
                          <span className="adv-more">+{datosConversionBatch.advertencias.length - 3} más</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="preview-container">
                  <div className="preview-historia">
                    {batchHistoria.split('\n').map((linea, i) => {
                      if (linea.startsWith('**') && linea.endsWith('**')) {
                        return <h3 key={i}>{linea.replace(/\*\*/g, '')}</h3>;
                      }
                      if (linea.startsWith('*') && linea.endsWith('*')) {
                        return <p key={i} className="mensaje-guardian"><em>{linea.replace(/\*/g, '')}</em></p>;
                      }
                      if (linea.trim()) {
                        return <p key={i}>{linea}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="batch-acciones">
                  <button className="btn-secondary" onClick={regenerarBatch}>
                    Regenerar
                  </button>
                  <button className="btn-danger" onClick={rechazarBatch}>
                    Rechazar y siguiente
                  </button>
                  <button className="btn-primary" onClick={aprobarBatch}>
                    Aprobar y {batchActual < batchSeleccion.length - 1 ? 'siguiente' : 'terminar'}
                  </button>
                </div>

                {/* Mini-encuesta al regenerar */}
                {showMiniEncuesta && (
                  <div className="mini-encuesta-overlay">
                    <div className="mini-encuesta-dialog">
                      <h3>¿Qué querés cambiar?</h3>

                      <div className="mini-campo">
                        <label>¿Qué no te gustó?</label>
                        <select
                          value={miniEncuesta.problema}
                          onChange={(e) => setMiniEncuesta({...miniEncuesta, problema: e.target.value})}
                        >
                          <option value="">Seleccioná...</option>
                          <option value="muy_generico">Muy genérico / suena a IA</option>
                          <option value="suena_ia">Tiene frases de IA prohibidas</option>
                          <option value="falta_arco">Falta estructura emocional</option>
                          <option value="muy_largo">Muy largo</option>
                          <option value="muy_corto">Muy corto</option>
                          <option value="categoria_incorrecta">Categoría incorrecta</option>
                          <option value="no_refleja_personalidad">No refleja su personalidad</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>

                      <div className="mini-campo">
                        <label>Cambiar categoría a:</label>
                        <select
                          value={miniEncuesta.categoriaOverride}
                          onChange={(e) => setMiniEncuesta({...miniEncuesta, categoriaOverride: e.target.value})}
                        >
                          <option value="">Mantener actual</option>
                          {catalogo.categorias?.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mini-campo">
                        <label>Indicaciones específicas:</label>
                        <textarea
                          value={miniEncuesta.indicaciones}
                          onChange={(e) => setMiniEncuesta({...miniEncuesta, indicaciones: e.target.value})}
                          placeholder="Ej: que hable de su conexión con las plantas, que sea más corta, que no mencione Irlanda..."
                          rows={3}
                        />
                      </div>

                      <div className="mini-acciones">
                        <button className="btn-secondary" onClick={() => setShowMiniEncuesta(false)}>
                          Cancelar
                        </button>
                        <button className="btn-primary" onClick={confirmarRegeneracion}>
                          Regenerar con cambios
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="batch-progress">
              {batchSeleccion.map((g, i) => (
                <span key={g.id} className={`dot ${i === batchActual ? 'actual' : ''} ${i < batchActual ? 'done' : ''}`}></span>
              ))}
            </div>
          </div>
        )}

        {/* PASO 12: Modo Directo - Selección del catálogo */}
        {paso === 12 && modo === 'directo' && (
          <div className="paso-content">
            <h2>Modo Directo - Click para generar</h2>
            <p className="instruccion-batch">Hacé click en cualquier guardián y se genera la historia al instante.</p>

            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busquedaDirecto}
                onChange={(e) => setBusquedaDirecto(e.target.value)}
              />
            </div>

            <div className="filtros-batch">
              <span style={{opacity: 0.7, marginRight: '0.5rem'}}>Especie:</span>
              <button className={`filtro-btn ${filtroEspecie === null ? 'activo' : ''}`} onClick={() => setFiltroEspecie(null)}>Todas</button>
              <button className={`filtro-btn ${filtroEspecie === 'pixie' ? 'activo' : ''}`} onClick={() => setFiltroEspecie('pixie')}>Pixies</button>
              <button className={`filtro-btn ${filtroEspecie === 'duende' ? 'activo' : ''}`} onClick={() => setFiltroEspecie('duende')}>Duendes</button>
              <button className={`filtro-btn ${filtroEspecie === 'duenda' ? 'activo' : ''}`} onClick={() => setFiltroEspecie('duenda')}>Duendas</button>
              <button className={`filtro-btn ${filtroEspecie === 'bruja' ? 'activo' : ''}`} onClick={() => setFiltroEspecie('bruja')}>Brujas</button>
              <button className={`filtro-btn ${filtroEspecie === 'vikingo' ? 'activo' : ''}`} onClick={() => setFiltroEspecie('vikingo')}>Vikingos</button>
            </div>

            <div className="filtros-batch">
              <span style={{opacity: 0.7, marginRight: '0.5rem'}}>Categoría:</span>
              <button className={`filtro-btn ${filtroCategoria === null ? 'activo' : ''}`} onClick={() => setFiltroCategoria(null)}>Todas</button>
              {catalogo.categorias?.map(cat => (
                <button key={cat} className={`filtro-btn ${filtroCategoria === cat ? 'activo' : ''}`} onClick={() => setFiltroCategoria(cat)}>{cat}</button>
              ))}
            </div>

            <div className="catalogo-directo-grid">
              {catalogoFiltrado.map(g => (
                <div key={g.nombre} className="catalogo-card" onClick={() => seleccionarParaDirecto(g)}>
                  <div className="catalogo-nombre">{g.nombre}</div>
                  <div className="catalogo-meta">
                    <span className="especie">{g.especie}</span>
                    <span className="categoria">{g.categoria}</span>
                    <span className="cm">{g.cm}cm</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="acciones" style={{marginTop: '2rem'}}>
              <button className="btn-secondary" onClick={() => { setPaso(1); setModo(null); }}>Volver</button>
            </div>
          </div>
        )}

        {/* PASO 13: Modo Directo - Preview */}
        {paso === 13 && modo === 'directo' && (
          <div className="paso-content paso-preview">
            <h2>{directoGuardian?.nombre}</h2>

            <div className="preview-info">
              <span>{directoGuardian?.especie}</span>
              <span>{directoGuardian?.categoria}</span>
              <span>{directoGuardian?.cm}cm</span>
            </div>

            {cargando ? (
              <div className="generando">
                <div className="spinner"></div>
                <p>Generando historia...</p>
              </div>
            ) : (
              <>
                {/* Score de conversión */}
                {directoConversion && (
                  <div className={`conversion-score ${directoConversion.aprobada ? 'aprobada' : 'rechazada'}`}>
                    <div className="score-header">
                      <span className="score-total">
                        {directoConversion.aprobada ? '✅' : '⚠️'} Score: {directoConversion.score?.total || 0}/50
                      </span>
                      <span className="arco-score">
                        Arco: {directoConversion.arco?.score || 0}%
                      </span>
                    </div>

                    <div className="score-desglose">
                      <div className="score-item"><span className="label">Identificación</span><span className="valor">{directoConversion.score?.identificacion || 0}/10</span></div>
                      <div className="score-item"><span className="label">Dolor</span><span className="valor">{directoConversion.score?.dolor || 0}/10</span></div>
                      <div className="score-item"><span className="label">Solución</span><span className="valor">{directoConversion.score?.solucion || 0}/10</span></div>
                      <div className="score-item"><span className="label">Urgencia</span><span className="valor">{directoConversion.score?.urgencia || 0}/10</span></div>
                      <div className="score-item"><span className="label">Confianza</span><span className="valor">{directoConversion.score?.confianza || 0}/10</span></div>
                    </div>

                    {directoConversion.advertencias && directoConversion.advertencias.length > 0 && (
                      <div className="advertencias">
                        <strong>⚠️ Advertencias:</strong>
                        <ul>{directoConversion.advertencias.map((adv, i) => <li key={i}>{adv}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="preview-container">
                  <div className="preview-historia">
                    {directoHistoria.split('\n').map((linea, i) => {
                      if (linea.startsWith('**') && linea.endsWith('**')) return <h3 key={i}>{linea.replace(/\*\*/g, '')}</h3>;
                      if (linea.startsWith('*') && linea.endsWith('*')) return <p key={i} className="mensaje-guardian"><em>{linea.replace(/\*/g, '')}</em></p>;
                      if (linea.trim()) return <p key={i}>{linea}</p>;
                      return null;
                    })}
                  </div>
                </div>

                {/* Cierres alternativos */}
                {directoConversion?.cierres && (
                  <div className="cierres-alternativos">
                    <h4>Cierres por perfil</h4>
                    <div className="cierres-tabs">
                      {Object.entries(directoConversion.cierres).map(([perfil, cierre]) => (
                        <details key={perfil} className="cierre-detalle">
                          <summary>{perfil.charAt(0).toUpperCase() + perfil.slice(1)}</summary>
                          <p>{cierre}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                <div className="acciones">
                  <button className="btn-secondary" onClick={() => setPaso(12)}>Volver al catálogo</button>
                  <button className="btn-secondary" onClick={() => setPaso(14)}>Cambiar especialización</button>
                  <button className="btn-secondary" onClick={() => generarDirecto()}>Regenerar</button>
                  <button className="btn-primary" onClick={() => {
                    navigator.clipboard.writeText(directoHistoria);
                    alert('Historia copiada al portapapeles');
                  }}>Copiar historia</button>
                  <button
                    className={`btn-wc ${guardadoWC === 'success' ? 'guardado' : ''}`}
                    onClick={guardarEnWooCommerce}
                    disabled={guardandoWC}
                  >
                    {guardandoWC ? 'Guardando...' : guardadoWC === 'success' ? '✓ Guardado en WC' : '🛒 Guardar en WooCommerce'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* PASO 14: Modo Directo - Selección de Especialización */}
        {paso === 14 && modo === 'directo' && (
          <div className="paso-content paso-especializacion">
            <h2>¿De qué es {directoGuardian?.nombre}?</h2>
            <p className="instruccion-batch">Elegí qué hace este guardián o escribí algo específico.</p>

            <div className="especializacion-grupos">
              {Object.entries(especializacionesGrupos).map(([grupoId, grupo]) => (
                <div key={grupoId} className="especializacion-grupo">
                  <h4 className="grupo-titulo">{grupo.titulo}</h4>
                  <div className="especializacion-chips">
                    {grupo.chips.map(esp => (
                      <button
                        key={esp.id}
                        className={`chip-especializacion ${directoEspecializacion === esp.id ? 'activo' : ''}`}
                        onClick={() => {
                          setDirectoEspecializacion(esp.id);
                          setDirectoEspecializacionTexto('');
                        }}
                        title={esp.descripcion}
                      >
                        {esp.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="especializacion-custom">
              <label>O escribí específicamente qué hace:</label>
              <input
                type="text"
                placeholder="ej: trae suerte en el amor, protege el hogar de energías negativas..."
                value={directoEspecializacionTexto}
                onChange={(e) => {
                  setDirectoEspecializacionTexto(e.target.value);
                  if (e.target.value) setDirectoEspecializacion('');
                }}
              />
              <span className="hint">Si escribís algo acá, se usa esto en lugar del chip seleccionado.</span>
            </div>

            <div className="acciones">
              <button className="btn-secondary" onClick={() => setPaso(12)}>Volver al catálogo</button>
              <button
                className="btn-primary"
                onClick={() => generarDirecto()}
                disabled={!directoEspecializacion && !directoEspecializacionTexto}
              >
                Generar Historia
              </button>
            </div>
          </div>
        )}

        {/* PASO 15: Batch Inteligente - Selección y Agrupación */}
        {paso === 15 && (
          <div className="paso-content batch-inteligente">
            <h2>🚀 Generación Batch Inteligente</h2>
            <p className="subtitulo">Seleccioná guardianes, agrupalos por especialización y generá todas las historias de una vez.</p>

            <div className="batch-layout">
              {/* Panel izquierdo: Catálogo */}
              <div className="batch-catalogo">
                <h3>Catálogo ({catalogoFiltrado.length})</h3>
                <input
                  type="text"
                  placeholder="Buscar guardián..."
                  value={busquedaDirecto}
                  onChange={(e) => setBusquedaDirecto(e.target.value)}
                  className="busqueda-input"
                />
                <div className="batch-catalogo-grid">
                  {catalogoFiltrado.map((guardian, idx) => {
                    const seleccionado = batchSeleccionados.find(g => g.nombre === guardian.nombre);
                    const enGrupo = batchGrupos.some(g => g.guardianes.find(gn => gn.nombre === guardian.nombre));
                    return (
                      <div
                        key={idx}
                        className={`batch-guardian-card ${seleccionado ? 'seleccionado' : ''} ${enGrupo ? 'en-grupo' : ''}`}
                        onClick={() => !enGrupo && toggleSeleccionBatch(guardian)}
                      >
                        <span className="nombre">{guardian.nombre}</span>
                        <span className="info">{guardian.especie || 'duende'} · {guardian.cm}cm</span>
                        {seleccionado && <span className="check">✓</span>}
                        {enGrupo && <span className="en-grupo-badge">En grupo</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Panel derecho: Selección y Grupos */}
              <div className="batch-grupos-panel">
                {/* Selección actual */}
                {batchSeleccionados.length > 0 && (
                  <div className="seleccion-actual">
                    <h4>{batchSeleccionados.length} seleccionados</h4>
                    <div className="seleccionados-chips">
                      {batchSeleccionados.map((g, i) => (
                        <span key={i} className="chip-seleccionado">
                          {g.nombre}
                          <button onClick={() => toggleSeleccionBatch(g)}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="asignar-grupo">
                      <label>Asignar a especialización:</label>
                      <div className="especializacion-rapida">
                        {['fortuna', 'proteccion', 'abundancia', 'sanacion', 'amor_romantico', 'calma', 'sabiduria'].map(esp => (
                          <button
                            key={esp}
                            className="btn-esp"
                            onClick={() => agregarAGrupo(esp)}
                          >
                            {esp === 'fortuna' ? '🍀' : esp === 'proteccion' ? '🛡️' : esp === 'abundancia' ? '💰' : esp === 'sanacion' ? '💚' : esp === 'amor_romantico' ? '💕' : esp === 'calma' ? '🧘' : '📚'} {esp.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Grupos armados */}
                <div className="grupos-armados">
                  <h4>Grupos para generar ({batchGrupos.length})</h4>
                  {batchGrupos.length === 0 ? (
                    <p className="sin-grupos">Seleccioná guardianes y asignalos a una especialización</p>
                  ) : (
                    batchGrupos.map(grupo => (
                      <div key={grupo.id} className="grupo-card">
                        <div className="grupo-header">
                          <span className="grupo-esp">
                            {grupo.especializacion === 'fortuna' ? '🍀' : grupo.especializacion === 'proteccion' ? '🛡️' : grupo.especializacion === 'abundancia' ? '💰' : grupo.especializacion === 'sanacion' ? '💚' : grupo.especializacion === 'amor_romantico' ? '💕' : grupo.especializacion === 'calma' ? '🧘' : '📚'} {grupo.especializacion.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="grupo-count">{grupo.guardianes.length} guardianes</span>
                          <button className="btn-eliminar-grupo" onClick={() => eliminarGrupo(grupo.id)}>🗑️</button>
                        </div>
                        <div className="grupo-guardianes">
                          {grupo.guardianes.map((g, i) => (
                            <span key={i} className="guardian-en-grupo">
                              {g.nombre}
                              <button onClick={() => quitarDeGrupo(grupo.id, g.nombre)}>×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Botón generar */}
                {batchGrupos.length > 0 && (
                  <button
                    className="btn-generar-todos"
                    onClick={generarTodosBatch}
                    disabled={batchGenerando}
                  >
                    {batchGenerando
                      ? `Generando ${batchProgreso.actual}/${batchProgreso.total}: ${batchProgreso.guardian}...`
                      : `🚀 Generar ${batchGrupos.reduce((acc, g) => acc + g.guardianes.length, 0)} historias`
                    }
                  </button>
                )}
              </div>
            </div>

            <button className="btn-secondary volver" onClick={() => setPaso(1)}>
              ← Volver al inicio
            </button>
          </div>
        )}

        {/* PASO 16: Batch Inteligente - Revisión y Aprobación */}
        {paso === 16 && (
          <div className="paso-content batch-revision">
            <h2>📋 Revisar y Aprobar Historias</h2>
            <p className="subtitulo">
              {batchResultados.filter(r => r.aprobado).length} de {batchResultados.length} aprobadas
            </p>

            <div className="batch-resultados-grid">
              {batchResultados.map((resultado, idx) => (
                <div
                  key={idx}
                  className={`resultado-card ${resultado.aprobado ? 'aprobado' : ''} ${resultado.error ? 'error' : ''} ${resultado.guardadoWC ? 'guardado' : ''}`}
                >
                  <div className="resultado-header">
                    <span className="nombre">{resultado.guardian.nombre}</span>
                    <span className="grupo-badge">{resultado.grupo}</span>
                    {resultado.score && (
                      <span className={`score ${resultado.score.total >= 35 ? 'bueno' : 'bajo'}`}>
                        {resultado.score.total}/50
                      </span>
                    )}
                  </div>

                  {resultado.error ? (
                    <div className="resultado-error">❌ {resultado.error}</div>
                  ) : (
                    <>
                      <div className="resultado-preview">
                        {resultado.historia?.substring(0, 200)}...
                      </div>
                      <div className="resultado-acciones">
                        <button
                          className="btn-ver"
                          onClick={() => setBatchVistaPrevia(resultado)}
                        >
                          👁️ Ver
                        </button>
                        <button
                          className="btn-regenerar"
                          onClick={() => regenerarUno(idx)}
                          disabled={resultado.regenerando}
                        >
                          {resultado.regenerando ? '...' : '🔄'}
                        </button>
                        <button
                          className={`btn-aprobar ${resultado.aprobado ? 'activo' : ''}`}
                          onClick={() => toggleAprobacion(idx)}
                        >
                          {resultado.aprobado ? '✓ Aprobado' : 'Aprobar'}
                        </button>
                        {resultado.guardadoWC && <span className="guardado-badge">✓ WC</span>}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="batch-acciones-finales">
              <button className="btn-nuevo-batch" onClick={() => {
                setBatchResultados([]);
                setBatchSeleccionados([]);
                setBatchGrupos([]);
                setBatchVistaPrevia(null);
                setPaso(15);
              }}>
                🔄 Nuevo batch
              </button>
              <button
                className="btn-corregir"
                onClick={corregirTodasLasHistorias}
                title="Aplica correcciones ortográficas a todas las historias"
              >
                🔧 Corregir ortografía
              </button>
              <button
                className="btn-aprobar-todos"
                onClick={() => setBatchResultados(prev => prev.map(r => ({ ...r, aprobado: !r.error })))}
              >
                ✓ Aprobar todas
              </button>
              <button
                className="btn-guardar-wc"
                onClick={guardarTodosEnWC}
                disabled={batchResultados.filter(r => r.aprobado && !r.guardadoWC).length === 0}
              >
                🛒 Guardar {batchResultados.filter(r => r.aprobado && !r.guardadoWC).length} en WooCommerce
              </button>
            </div>

            {/* Modal vista previa */}
            {batchVistaPrevia && (
              <div className="modal-overlay" onClick={() => setBatchVistaPrevia(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{batchVistaPrevia.guardian.nombre}</h3>
                    <button onClick={() => setBatchVistaPrevia(null)}>×</button>
                  </div>
                  <div className="modal-body">
                    <div className="historia-completa">
                      {batchVistaPrevia.historia?.split('\n').map((linea, i) => {
                        if (linea.startsWith('**') && linea.endsWith('**')) return <h4 key={i}>{linea.replace(/\*\*/g, '')}</h4>;
                        if (linea.startsWith('*') && linea.endsWith('*')) return <p key={i} className="mensaje-guardian"><em>{linea.replace(/\*/g, '')}</em></p>;
                        if (linea.trim()) return <p key={i}>{linea}</p>;
                        return null;
                      })}
                    </div>
                    {batchVistaPrevia.cierres && (
                      <div className="cierres-modal">
                        <h4>Cierres alternativos</h4>
                        {Object.entries(batchVistaPrevia.cierres).map(([perfil, cierre]) => (
                          <details key={perfil}>
                            <summary>{perfil}</summary>
                            <p>{cierre}</p>
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => {
                      navigator.clipboard.writeText(batchVistaPrevia.historia);
                      alert('Copiado');
                    }}>📋 Copiar</button>
                    <button onClick={() => setBatchVistaPrevia(null)}>Cerrar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PASO 3: Datos del guardián */}
        {paso === 3 && (
          <div className="paso-content">
            <h2>Datos de {datosGuardian.nombre || 'Guardián'}</h2>

            {modo === 'existente' && datosGuardian.accesorios && (
              <div className="datos-cargados">
                ✓ Datos cargados automáticamente del catálogo
              </div>
            )}

            <div className="datos-form">
              <div className="campo-row">
                <div className="campo">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={datosGuardian.nombre}
                    onChange={(e) => setDatosGuardian({...datosGuardian, nombre: e.target.value})}
                    disabled={modo === 'existente'}
                  />
                </div>
                <div className="campo">
                  <label>Género</label>
                  <select
                    value={datosGuardian.genero}
                    onChange={(e) => setDatosGuardian({...datosGuardian, genero: e.target.value})}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="neutro">Neutro</option>
                  </select>
                </div>
              </div>

              <div className="campo-row">
                <div className="campo">
                  <label>Especie</label>
                  <select
                    value={datosGuardian.especie}
                    onChange={(e) => handleEspecieChange(e.target.value)}
                  >
                    {especiesDisponibles.map(esp => (
                      <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="campo">
                  <label>Categoría</label>
                  <select
                    value={datosGuardian.categoria}
                    onChange={(e) => setDatosGuardian({...datosGuardian, categoria: e.target.value})}
                  >
                    {categoriasDisponibles.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="campo">
                <label>Tamaño y Precio</label>
                <div className="tamanos-grid">
                  {tamanosDisponibles.map(tam => (
                    <div
                      key={tam.id}
                      className={`tamano-option ${datosGuardian.tamano === tam.id ? 'selected' : ''}`}
                      onClick={() => handleTamanoChange(tam.id)}
                    >
                      <span className="tamano-nombre">{tam.nombre}</span>
                      <span className="tamano-cm">{tam.cm}cm</span>
                      <span className="tamano-precio">${tam.precioUYU.toLocaleString()}</span>
                      <span className="tamano-desc">{tam.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="campo-row">
                <div className="campo">
                  <label>Medida exacta (cm)</label>
                  <input
                    type="number"
                    value={datosGuardian.tamanoCm}
                    onChange={(e) => setDatosGuardian({...datosGuardian, tamanoCm: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="campo">
                  <label>Tipo de pieza</label>
                  <div className={`tipo-pieza ${datosGuardian.esUnico ? 'unico' : 'recreable'}`}>
                    {datosGuardian.especie === 'pixie'
                      ? 'Pixie - SIEMPRE única'
                      : datosGuardian.esUnico
                        ? 'Pieza Única (desaparece al adoptarse)'
                        : 'Recreable (cada rostro es único)'}
                  </div>
                </div>
              </div>

              <div className="campo">
                <label>Accesorios y Cristales</label>
                <textarea
                  value={datosGuardian.accesorios}
                  onChange={(e) => setDatosGuardian({...datosGuardian, accesorios: e.target.value})}
                  placeholder="Descripción detallada de todos los accesorios, cristales, ropa..."
                  rows={4}
                />
              </div>

              <div className="info-sincrodestino">
                <span className="icon">✨</span>
                <p>El <strong>sincrodestino</strong> se genera automáticamente por la IA, eligiendo uno que no se haya usado antes.</p>
              </div>
            </div>

            <div className="acciones">
              <button className="btn-secondary" onClick={() => setPaso(modo === 'existente' ? 2 : 1)}>
                Volver
              </button>
              <button className="btn-primary" onClick={analizarImagen} disabled={cargando}>
                {cargando ? 'Procesando...' : 'Continuar'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: Encuesta dinámica */}
        {paso === 4 && (
          <div className="paso-content">
            <h2>Encuesta para {datosGuardian.nombre}</h2>

            {analisisImagen && (
              <div className="analisis-imagen">
                <h3>Análisis de la imagen</h3>
                <p>{analisisImagen}</p>
              </div>
            )}

            <div className="encuesta">
              {preguntas.map(p => (
                <div key={p.id} className="pregunta">
                  <label>{p.pregunta}</label>
                  {p.tipo === 'texto' ? (
                    <textarea
                      placeholder={p.opcional ? '(Opcional)' : 'Tu respuesta...'}
                      value={respuestas[p.pregunta] || ''}
                      onChange={(e) => setRespuestas({...respuestas, [p.pregunta]: e.target.value})}
                    />
                  ) : (
                    <div className="opciones">
                      {p.opciones?.map(op => (
                        <label key={op} className="opcion">
                          <input
                            type="radio"
                            name={p.id}
                            checked={respuestas[p.pregunta] === op}
                            onChange={() => setRespuestas({...respuestas, [p.pregunta]: op})}
                          />
                          {op}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="acciones">
              <button className="btn-secondary" onClick={() => setPaso(3)}>Volver</button>
              <button className="btn-primary" onClick={generarHistoria} disabled={cargando}>
                {cargando ? 'Generando...' : 'Generar Historia'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 6: Preview */}
        {paso === 6 && (
          <div className="paso-content paso-preview">
            <h2>Preview: {datosGuardian.nombre}</h2>

            <div className="preview-info">
              <span>{datosGuardian.especie}</span>
              <span>{datosGuardian.categoria}</span>
              <span>{datosGuardian.tamanoCm}cm</span>
              <span>${datosGuardian.precioUYU?.toLocaleString()}</span>
            </div>

            {/* Score de conversión */}
            {datosConversion && (
              <div className={`conversion-score ${datosConversion.aprobada ? 'aprobada' : 'rechazada'}`}>
                <div className="score-header">
                  <span className="score-total">
                    {datosConversion.aprobada ? '✅' : '⚠️'} Score: {datosConversion.score?.total || 0}/50
                  </span>
                  <span className="arco-score">
                    Arco: {datosConversion.arco?.score || 0}%
                  </span>
                </div>

                <div className="score-desglose">
                  <div className="score-item">
                    <span className="label">Identificación</span>
                    <span className="valor">{datosConversion.score?.identificacion || 0}/10</span>
                  </div>
                  <div className="score-item">
                    <span className="label">Dolor</span>
                    <span className="valor">{datosConversion.score?.dolor || 0}/10</span>
                  </div>
                  <div className="score-item">
                    <span className="label">Solución</span>
                    <span className="valor">{datosConversion.score?.solucion || 0}/10</span>
                  </div>
                  <div className="score-item">
                    <span className="label">Urgencia</span>
                    <span className="valor">{datosConversion.score?.urgencia || 0}/10</span>
                  </div>
                  <div className="score-item">
                    <span className="label">Confianza</span>
                    <span className="valor">{datosConversion.score?.confianza || 0}/10</span>
                  </div>
                </div>

                {datosConversion.advertencias && datosConversion.advertencias.length > 0 && (
                  <div className="advertencias">
                    <strong>⚠️ Advertencias:</strong>
                    <ul>
                      {datosConversion.advertencias.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="preview-container">
              <div className="preview-historia">
                {historiaGenerada.split('\n').map((linea, i) => {
                  if (linea.startsWith('**') && linea.endsWith('**')) {
                    return <h3 key={i}>{linea.replace(/\*\*/g, '')}</h3>;
                  }
                  if (linea.startsWith('*') && linea.endsWith('*')) {
                    return <p key={i} className="mensaje-guardian"><em>{linea.replace(/\*/g, '')}</em></p>;
                  }
                  if (linea.startsWith('- ')) {
                    return <li key={i}>{linea.substring(2)}</li>;
                  }
                  if (linea.trim()) {
                    return <p key={i}>{linea}</p>;
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Cierres alternativos */}
            {datosConversion?.cierres && (
              <div className="cierres-alternativos">
                <h4>Cierres por perfil (opcionales)</h4>
                <div className="cierres-tabs">
                  {Object.entries(datosConversion.cierres).map(([perfil, cierre]) => (
                    <details key={perfil} className="cierre-detalle">
                      <summary>{perfil.charAt(0).toUpperCase() + perfil.slice(1)}</summary>
                      <p>{cierre}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <div className="acciones">
              <button className="btn-secondary" onClick={() => setPaso(4)}>Regenerar</button>
              <button className="btn-primary" onClick={guardarEnWoo} disabled={cargando}>
                {cargando ? 'Guardando...' : 'Guardar en WooCommerce'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 10: Encuesta para guardián nuevo */}
        {paso === 10 && (
          <div className="paso-content paso-encuesta-chat">
            <h2>Registro de Nuevo Guardián</h2>

            <div className="chat-container">
              <div className="chat-mensajes">
                {chatEncuesta.map((msg, i) => (
                  <div key={i} className={`chat-mensaje ${msg.rol}`}>
                    <div className="contenido" dangerouslySetInnerHTML={{
                      __html: msg.contenido.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                    }} />
                  </div>
                ))}
                {cargando && (
                  <div className="chat-mensaje asistente">
                    <div className="typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
              </div>

              {!encuestaCompleta ? (
                <div className="chat-input">
                  <input
                    type="text"
                    value={inputChat}
                    onChange={(e) => setInputChat(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enviarMensajeEncuesta()}
                    placeholder="Escribí tu respuesta..."
                    disabled={cargando}
                  />
                  <button onClick={enviarMensajeEncuesta} disabled={cargando || !inputChat.trim()}>
                    Enviar
                  </button>
                </div>
              ) : (
                <div className="encuesta-completa">
                  <div className="resumen-datos">
                    <h4>Datos recopilados:</h4>
                    <p><strong>Nombre:</strong> {datosGuardian.nombre}</p>
                    <p><strong>Especie:</strong> {datosGuardian.especie}</p>
                    <p><strong>Categoría:</strong> {datosGuardian.categoria}</p>
                    <p><strong>Tamaño:</strong> {datosGuardian.tamanoCm}cm</p>
                    <p><strong>Accesorios:</strong> {datosGuardian.accesorios}</p>
                  </div>
                  <button className="btn-primary" onClick={continuarDespuesEncuesta}>
                    Continuar a generar historia
                  </button>
                </div>
              )}
            </div>

            <button className="btn-secondary volver-inicio" onClick={() => { setPaso(1); setModo(null); setChatEncuesta([]); }}>
              Cancelar y volver
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        .generador-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e0e0e0;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .generador-header {
          padding: 2rem;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }

        .generador-header h1 {
          margin: 0;
          color: #fff;
          font-size: 2rem;
        }

        .subtitulo {
          margin: 0.5rem 0 1.5rem;
          opacity: 0.7;
        }

        .pasos {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .pasos span {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          font-size: 0.85rem;
          opacity: 0.5;
        }

        .pasos span.activo {
          opacity: 1;
          background: rgba(139, 92, 246, 0.3);
          border: 1px solid rgba(139, 92, 246, 0.5);
        }

        .generador-main {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .paso-content {
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 2rem;
        }

        .paso-content h2 {
          margin-top: 0;
          color: #fff;
        }

        /* Modos */
        .modos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .modo-card {
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .modo-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          background: rgba(139, 92, 246, 0.1);
          transform: translateY(-4px);
        }

        .modo-card .icono {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .modo-card h3 {
          margin: 0 0 0.5rem;
          color: #fff;
        }

        .modo-card p {
          margin: 0 0 1rem;
          opacity: 0.7;
          font-size: 0.9rem;
        }

        .modo-card .badge {
          background: rgba(139, 92, 246, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        /* Botones */
        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-wc {
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-wc:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
        }

        .btn-wc:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .btn-wc.guardado {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        /* === BATCH INTELIGENTE STYLES === */
        .modo-card.batch-inteligente {
          border: 2px solid rgba(236, 72, 153, 0.3);
          background: rgba(236, 72, 153, 0.1);
        }
        .modo-card.batch-inteligente:hover {
          border-color: rgba(236, 72, 153, 0.6);
          box-shadow: 0 0 30px rgba(236, 72, 153, 0.2);
        }
        .badge.destacado {
          background: linear-gradient(135deg, #ec4899, #8b5cf6) !important;
        }

        .batch-inteligente {
          padding: 1rem;
        }
        .batch-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1.5rem;
        }
        .batch-catalogo, .batch-grupos-panel {
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          padding: 1.5rem;
          max-height: 70vh;
          overflow-y: auto;
        }
        .batch-catalogo h3, .batch-grupos-panel h4 {
          margin: 0 0 1rem 0;
          color: #fff;
        }
        .batch-catalogo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .batch-guardian-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .batch-guardian-card:hover:not(.en-grupo) {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
        }
        .batch-guardian-card.seleccionado {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }
        .batch-guardian-card.en-grupo {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .batch-guardian-card .nombre {
          display: block;
          font-weight: 600;
          color: #fff;
          font-size: 0.9rem;
        }
        .batch-guardian-card .info {
          display: block;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          margin-top: 0.25rem;
        }
        .batch-guardian-card .check {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          color: #8b5cf6;
          font-weight: bold;
        }
        .batch-guardian-card .en-grupo-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 0.65rem;
          background: rgba(255,255,255,0.2);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .seleccion-actual {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        .seleccion-actual h4 {
          margin: 0 0 0.75rem 0;
          color: #8b5cf6;
        }
        .seleccionados-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .chip-seleccionado {
          background: rgba(139, 92, 246, 0.3);
          padding: 0.3rem 0.6rem;
          border-radius: 20px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .chip-seleccionado button {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 0;
          font-size: 1rem;
          line-height: 1;
        }
        .asignar-grupo label {
          display: block;
          margin-bottom: 0.5rem;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
        }
        .especializacion-rapida {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .btn-esp {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
          text-transform: capitalize;
        }
        .btn-esp:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        .grupos-armados {
          margin-top: 1rem;
        }
        .sin-grupos {
          color: rgba(255,255,255,0.4);
          font-style: italic;
          text-align: center;
          padding: 2rem;
        }
        .grupo-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .grupo-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .grupo-esp {
          font-weight: 600;
          color: #fff;
        }
        .grupo-count {
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }
        .btn-eliminar-grupo {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .btn-eliminar-grupo:hover {
          opacity: 1;
        }
        .grupo-guardianes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .guardian-en-grupo {
          background: rgba(255,255,255,0.1);
          padding: 0.25rem 0.6rem;
          border-radius: 15px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .guardian-en-grupo button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          padding: 0;
          font-size: 0.9rem;
        }

        .btn-generar-todos {
          width: 100%;
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: all 0.2s;
        }
        .btn-generar-todos:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
        }
        .btn-generar-todos:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        /* Batch Revisión */
        .batch-revision {
          padding: 1rem;
        }
        .batch-resultados-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .resultado-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 1rem;
          transition: all 0.2s;
        }
        .resultado-card.aprobado {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }
        .resultado-card.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .resultado-card.guardado {
          opacity: 0.7;
        }
        .resultado-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .resultado-header .nombre {
          font-weight: 600;
          color: #fff;
        }
        .resultado-header .grupo-badge {
          background: rgba(139, 92, 246, 0.3);
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
          font-size: 0.7rem;
          text-transform: capitalize;
        }
        .resultado-header .score {
          margin-left: auto;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .resultado-header .score.bueno { color: #10b981; }
        .resultado-header .score.bajo { color: #f59e0b; }
        .resultado-preview {
          color: rgba(255,255,255,0.6);
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 0.75rem;
          max-height: 80px;
          overflow: hidden;
        }
        .resultado-error {
          color: #ef4444;
          font-size: 0.85rem;
        }
        .resultado-acciones {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .resultado-acciones button {
          background: rgba(255,255,255,0.1);
          border: none;
          color: #fff;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .resultado-acciones button:hover {
          background: rgba(255,255,255,0.2);
        }
        .resultado-acciones .btn-aprobar.activo {
          background: #10b981;
        }
        .guardado-badge {
          background: #10b981;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-size: 0.75rem;
        }

        .batch-acciones-finales {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }
        .btn-aprobar-todos, .btn-guardar-wc {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .btn-guardar-wc {
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
        }
        .btn-aprobar-todos:hover, .btn-guardar-wc:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .btn-guardar-wc:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        .modal-content {
          background: #1a1a2e;
          border-radius: 16px;
          max-width: 700px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .modal-header h3 {
          margin: 0;
          color: #fff;
        }
        .modal-header button {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .modal-body {
          padding: 1.5rem;
        }
        .historia-completa {
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
        }
        .historia-completa p {
          margin: 0.75rem 0;
        }
        .historia-completa h4 {
          color: #8b5cf6;
          margin: 1rem 0 0.5rem;
        }
        .mensaje-guardian {
          background: rgba(139, 92, 246, 0.1);
          padding: 1rem;
          border-radius: 8px;
          border-left: 3px solid #8b5cf6;
        }
        .cierres-modal {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .cierres-modal h4 {
          margin: 0 0 1rem 0;
          color: rgba(255,255,255,0.7);
        }
        .cierres-modal details {
          margin-bottom: 0.5rem;
        }
        .cierres-modal summary {
          cursor: pointer;
          color: #8b5cf6;
          padding: 0.5rem;
        }
        .cierres-modal p {
          padding: 0.5rem 1rem;
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
        }
        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .modal-footer button {
          background: rgba(255,255,255,0.1);
          border: none;
          color: #fff;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-secondary {
          background: transparent;
          color: #e0e0e0;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #fca5a5;
          padding: 1rem;
          margin: 1rem 2rem;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
        }

        .error-banner button {
          background: none;
          border: none;
          color: #fca5a5;
          font-size: 1.5rem;
          cursor: pointer;
        }

        /* Stats */
        .resumen-escaneo {
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
        }

        .stat {
          text-align: center;
        }

        .stat .numero {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #8b5cf6;
        }

        .stat .label {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        /* Búsqueda */
        .busqueda {
          margin-bottom: 1rem;
        }

        .busqueda input {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
        }

        /* Grid de guardianes */
        .guardianes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
          max-height: 450px;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .guardian-card {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .guardian-card:hover {
          background: rgba(255,255,255,0.1);
        }

        .guardian-card.seleccionado {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
        }

        .guardian-card img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .guardian-card h4 {
          margin: 0;
          font-size: 0.95rem;
        }

        .guardian-card .categoria {
          display: block;
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .guardian-card .estado {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          margin-top: 0.25rem;
        }

        .guardian-card .estado.tiene {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }

        .guardian-card .estado.no-tiene {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .acciones-fijas {
          position: sticky;
          bottom: 0;
          background: rgba(26, 26, 46, 0.95);
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem -2rem -2rem;
          border-radius: 0 0 16px 16px;
        }

        /* Formulario */
        .datos-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .campo-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .campo label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .campo input,
        .campo select,
        .campo textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
        }

        .campo input:disabled {
          opacity: 0.6;
        }

        .datos-cargados {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.5);
          color: #4ade80;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        /* Tamaños grid */
        .tamanos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .tamano-option {
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .tamano-option:hover {
          border-color: rgba(139, 92, 246, 0.3);
        }

        .tamano-option.selected {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
        }

        .tamano-nombre {
          display: block;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .tamano-cm {
          display: block;
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .tamano-precio {
          display: block;
          color: #8b5cf6;
          font-weight: 600;
          margin: 0.25rem 0;
        }

        .tamano-desc {
          display: block;
          font-size: 0.7rem;
          opacity: 0.6;
        }

        .tipo-pieza {
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
        }

        .tipo-pieza.unico {
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.5);
        }

        .tipo-pieza.recreable {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.5);
        }

        .info-sincrodestino {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .info-sincrodestino .icon {
          font-size: 1.5rem;
        }

        .info-sincrodestino p {
          margin: 0;
          font-size: 0.9rem;
        }

        /* Encuesta */
        .encuesta {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .pregunta label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .pregunta textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          min-height: 80px;
        }

        .opciones {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .opcion {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          cursor: pointer;
        }

        .analisis-imagen {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .acciones {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        /* Preview */
        .paso-preview {
          max-width: 800px;
          margin: 0 auto;
        }

        .preview-info {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .preview-info span {
          background: rgba(255,255,255,0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
        }

        .preview-container {
          background: #fff;
          color: #333;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .preview-historia h3 {
          color: #1a1a2e;
          margin-top: 1.5rem;
        }

        .preview-historia p {
          line-height: 1.7;
        }

        .preview-historia .mensaje-guardian {
          background: rgba(139, 92, 246, 0.1);
          padding: 1rem;
          border-left: 3px solid #8b5cf6;
          margin: 1rem 0;
        }

        .preview-historia li {
          margin-left: 1.5rem;
        }

        /* Chat encuesta */
        .paso-encuesta-chat {
          max-width: 700px;
          margin: 0 auto;
        }

        .chat-container {
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          overflow: hidden;
        }

        .chat-mensajes {
          max-height: 400px;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chat-mensaje {
          max-width: 85%;
        }

        .chat-mensaje.asistente {
          align-self: flex-start;
        }

        .chat-mensaje.usuario {
          align-self: flex-end;
        }

        .chat-mensaje .contenido {
          padding: 1rem;
          border-radius: 12px;
          line-height: 1.5;
        }

        .chat-mensaje.asistente .contenido {
          background: rgba(139, 92, 246, 0.2);
          border-bottom-left-radius: 4px;
        }

        .chat-mensaje.usuario .contenido {
          background: rgba(255,255,255,0.1);
          border-bottom-right-radius: 4px;
        }

        .typing {
          display: flex;
          gap: 4px;
          padding: 0.5rem;
        }

        .typing span {
          width: 8px;
          height: 8px;
          background: #8b5cf6;
          border-radius: 50%;
          animation: typing 1s infinite;
        }

        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .chat-input {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(0,0,0,0.2);
        }

        .chat-input input {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
        }

        .chat-input button {
          padding: 0.75rem 1.5rem;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .chat-input button:disabled {
          opacity: 0.5;
        }

        .encuesta-completa {
          padding: 1.5rem;
          background: rgba(34, 197, 94, 0.1);
          border-top: 1px solid rgba(34, 197, 94, 0.3);
        }

        .resumen-datos {
          margin-bottom: 1rem;
        }

        .resumen-datos h4 {
          margin: 0 0 0.5rem;
          color: #4ade80;
        }

        .resumen-datos p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .volver-inicio {
          margin-top: 1rem;
        }

        /* Batch mode styles */
        .modo-card.rapido {
          border-color: rgba(251, 191, 36, 0.3);
        }

        .modo-card.rapido:hover {
          border-color: rgba(251, 191, 36, 0.6);
          background: rgba(251, 191, 36, 0.1);
        }

        .instruccion-batch {
          opacity: 0.7;
          margin-bottom: 1.5rem;
        }

        .stat.seleccionados .numero {
          color: #fbbf24;
        }

        .busqueda {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filtros-batch {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin: 1rem 0;
        }

        .filtro-btn {
          padding: 0.4rem 0.8rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          color: #e0e0e0;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filtro-btn:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
        }

        .filtro-btn.activo {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        .batch-grid .guardian-card .check {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #8b5cf6;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .batch-grid .guardian-card {
          position: relative;
        }

        .batch-grid .guardian-card.tiene-historia {
          opacity: 0.5;
        }

        .acciones-fijas .btns {
          display: flex;
          gap: 0.5rem;
        }

        .paso-batch-preview {
          max-width: 800px;
          margin: 0 auto;
        }

        .batch-info {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .batch-info span {
          background: rgba(255,255,255,0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .generando {
          text-align: center;
          padding: 4rem 2rem;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(139, 92, 246, 0.2);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          margin: 0 auto 1rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .batch-acciones {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .btn-danger {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.5);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .batch-progress {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .batch-progress .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }

        .batch-progress .dot.actual {
          background: #8b5cf6;
          box-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
        }

        .batch-progress .dot.done {
          background: #4ade80;
        }

        /* Mini-encuesta regeneración */
        .mini-encuesta-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .mini-encuesta-dialog {
          background: #1a1a2e;
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
        }

        .mini-encuesta-dialog h3 {
          margin: 0 0 1.5rem;
          color: #fff;
        }

        .mini-campo {
          margin-bottom: 1rem;
        }

        .mini-campo label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .mini-campo select,
        .mini-campo textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
        }

        .mini-campo textarea {
          resize: vertical;
          min-height: 80px;
        }

        .mini-acciones {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        /* Score de conversión */
        .conversion-score {
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .conversion-score.aprobada {
          border-color: rgba(34, 197, 94, 0.5);
          background: rgba(34, 197, 94, 0.1);
        }

        .conversion-score.rechazada {
          border-color: rgba(251, 191, 36, 0.5);
          background: rgba(251, 191, 36, 0.1);
        }

        .score-header {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .score-total {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .arco-score {
          background: rgba(139, 92, 246, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
        }

        .score-desglose {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .score-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.05);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          min-width: 70px;
        }

        .score-item .label {
          font-size: 0.7rem;
          opacity: 0.7;
          text-transform: uppercase;
        }

        .score-item .valor {
          font-weight: 600;
          color: #8b5cf6;
        }

        .advertencias {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .advertencias ul {
          margin: 0.5rem 0 0;
          padding-left: 1.25rem;
        }

        .advertencias li {
          font-size: 0.85rem;
          opacity: 0.9;
          margin-bottom: 0.25rem;
          color: #fbbf24;
        }

        /* Cierres alternativos */
        .cierres-alternativos {
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .cierres-alternativos h4 {
          margin: 0 0 0.75rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .cierres-tabs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cierre-detalle {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          overflow: hidden;
        }

        .cierre-detalle summary {
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-weight: 500;
          color: #8b5cf6;
        }

        .cierre-detalle summary:hover {
          background: rgba(255,255,255,0.05);
        }

        .cierre-detalle p {
          padding: 0 1rem 1rem;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #e0e0e0;
        }

        /* Score compacto para batch */
        .conversion-score.compact {
          padding: 0.75rem;
        }

        .conversion-score.compact .score-header {
          margin-bottom: 0;
        }

        .score-mini {
          display: flex;
          gap: 0.5rem;
          margin-left: auto;
        }

        .score-mini span {
          background: rgba(255,255,255,0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-family: monospace;
        }

        .advertencias-mini {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .adv-tag {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .adv-more {
          color: #fbbf24;
          font-size: 0.7rem;
          opacity: 0.7;
        }

        /* Modo Directo */
        .modo-card.directo {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .modo-card.directo:hover {
          border-color: rgba(34, 197, 94, 0.6);
          background: rgba(34, 197, 94, 0.1);
        }

        .catalogo-directo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
          max-height: 500px;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .catalogo-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .catalogo-card:hover {
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.5);
          transform: translateY(-2px);
        }

        .catalogo-nombre {
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .catalogo-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .catalogo-meta span {
          font-size: 0.75rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          background: rgba(255,255,255,0.1);
        }

        .catalogo-meta .especie {
          background: rgba(139, 92, 246, 0.3);
          color: #c4b5fd;
        }

        .catalogo-meta .categoria {
          background: rgba(34, 197, 94, 0.3);
          color: #86efac;
        }

        /* Paso de especialización */
        .paso-especializacion {
          max-width: 900px;
          margin: 0 auto;
        }

        .especializacion-grupos {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: 1.5rem 0;
        }

        .especializacion-grupo {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 1rem;
        }

        .grupo-titulo {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          margin: 0 0 0.75rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .especializacion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .chip-especializacion {
          padding: 0.5rem 0.9rem;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.8rem;
        }

        .chip-especializacion:hover {
          border-color: rgba(34, 197, 94, 0.5);
          background: rgba(34, 197, 94, 0.1);
        }

        .chip-especializacion.activo {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.25);
          color: #86efac;
        }

        .especializacion-custom {
          margin-top: 2rem;
          text-align: center;
        }

        .especializacion-custom label {
          display: block;
          margin-bottom: 0.75rem;
          color: rgba(255,255,255,0.7);
        }

        .especializacion-custom input {
          width: 100%;
          max-width: 500px;
          padding: 1rem;
          border-radius: 8px;
          border: 2px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.3);
          color: #fff;
          font-size: 1rem;
        }

        .especializacion-custom input:focus {
          outline: none;
          border-color: #22c55e;
        }

        .especializacion-custom .hint {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }

        @media (max-width: 768px) {
          .campo-row {
            grid-template-columns: 1fr;
          }

          .tamanos-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .guardianes-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .score-desglose {
            justify-content: center;
          }

          .score-mini {
            margin-left: 0;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function GeneradorHistorias() {
  return (
    <Suspense fallback={<div style={{padding: '2rem', color: '#fff', background: '#1a1a2e', minHeight: '100vh'}}>Cargando generador...</div>}>
      <GeneradorHistoriasContent />
    </Suspense>
  );
}
