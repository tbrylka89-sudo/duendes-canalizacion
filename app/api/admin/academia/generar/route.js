/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * API: GENERACIÓN INTELIGENTE DE CURSOS - ACADEMIA DE GUARDIANES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * POST /api/admin/academia/generar
 *
 * Genera cursos completos usando:
 * - Guardianes reales de WooCommerce como profesores
 * - Selección inteligente por múltiples atributos
 * - Contenido de alta calidad (Claude/Gemini)
 * - Imágenes con DALL-E
 * - Sistema de validación y resiliencia
 */

import { kv } from '@vercel/kv';
import academia from '@/lib/academia';
import { especializaciones, getInstruccionesEspecializacion } from '@/lib/conversion/especializaciones';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const OPENAI_MODEL = 'gpt-4o';
const DALLE_MODEL = 'dall-e-3';

// ═══════════════════════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const {
      // Configuración del curso
      tema,
      mes,
      year = 2026,
      eventoLunar = null,

      // Criterios de selección de guardianes
      categorias = [], // ['proteccion', 'sanacion']
      especies = [], // ['pixie', 'bruja']
      cristales = [], // ['amatista', 'turmalina']

      // Opciones de generación
      generarImagenes = true,
      generarContenido = true,
      soloValidar = false, // true = solo valida sin generar

      // Programación
      programarPara = null, // '2026-02-01'
      estado = 'borrador' // 'borrador' | 'programado' | 'publicado'
    } = body;

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. VALIDAR CONFIGURACIÓN
    // ═══════════════════════════════════════════════════════════════════════════

    const validacionConfig = academia.validaciones.validarConfiguracionCurso({
      tema,
      mes,
      year,
      eventoLunar
    });

    if (!validacionConfig.valid) {
      return Response.json({
        success: false,
        fase: 'validacion_config',
        errores: validacionConfig.errores,
        advertencias: validacionConfig.advertencias
      }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. OBTENER GUARDIANES DE WOOCOMMERCE
    // ═══════════════════════════════════════════════════════════════════════════

    const guardianes = await obtenerGuardianesWoo();

    if (!guardianes || guardianes.length === 0) {
      return Response.json({
        success: false,
        fase: 'obtener_guardianes',
        error: 'No se pudieron obtener guardianes de WooCommerce'
      }, { status: 500 });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. FILTRAR POR CRITERIOS
    // ═══════════════════════════════════════════════════════════════════════════

    let guardianesFiltrados = guardianes;

    // Filtrar por categorías
    if (categorias.length > 0) {
      guardianesFiltrados = guardianesFiltrados.filter(g =>
        categorias.some(cat =>
          academia.validaciones.normalizarTexto(g.categoria) === academia.validaciones.normalizarTexto(cat)
        )
      );
    }

    // Filtrar por especies
    if (especies.length > 0) {
      guardianesFiltrados = guardianesFiltrados.filter(g =>
        especies.some(esp =>
          (g.especie || g.tipo || '').toLowerCase().includes(esp.toLowerCase())
        )
      );
    }

    // Filtrar por cristales
    if (cristales.length > 0) {
      guardianesFiltrados = guardianesFiltrados.filter(g => {
        const cristalesGuardian = academia.validaciones.detectarCristales(
          `${g.accesorios || ''} ${g.descripcion || ''}`
        );
        return cristales.some(c =>
          cristalesGuardian.some(cg => cg.toLowerCase().includes(c.toLowerCase()))
        );
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. OBTENER HISTORIAL PARA EVITAR REPETIDOS
    // ═══════════════════════════════════════════════════════════════════════════

    const historialKey = `academia:historial:guardianes`;
    const historialReciente = await kv.get(historialKey) || [];

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. SELECCIONAR LOS 4 MEJORES GUARDIANES
    // ═══════════════════════════════════════════════════════════════════════════

    const seleccion = academia.seleccionarGuardianesParaTema(
      guardianesFiltrados,
      tema,
      {
        cantidad: 4,
        historialReciente,
        prioridadVariedad: true
      }
    );

    if (seleccion.error || seleccion.guardianes.length < 4) {
      return Response.json({
        success: false,
        fase: 'seleccion_guardianes',
        error: seleccion.error || `Solo hay ${seleccion.guardianes.length} guardianes disponibles (se necesitan 4)`,
        guardianesFiltrados: guardianesFiltrados.length,
        totalGuardianes: guardianes.length,
        advertencias: seleccion.advertencias,
        sugerencias: [
          'Intentar con menos filtros',
          'Ampliar categorías permitidas',
          'Esperar a que pasen guardianes del historial reciente'
        ]
      }, { status: 400 });
    }

    // Si solo validar, retornar aquí
    if (soloValidar) {
      return Response.json({
        success: true,
        fase: 'validacion_completa',
        mensaje: 'Configuración válida, listo para generar',
        guardianesSeleccionados: seleccion.guardianes.map(g => ({
          id: g.id,
          nombre: g.nombre,
          categoria: g.categoria,
          especie: g.especie,
          score: g._score
        })),
        totalDisponibles: seleccion.totalDisponibles,
        advertencias: [...validacionConfig.advertencias, ...seleccion.advertencias]
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. GENERAR ESTRUCTURA DEL CURSO
    // ═══════════════════════════════════════════════════════════════════════════

    const cursoId = `curso_${year}_${mes}_${Date.now()}`;
    const nombresMeses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const curso = {
      id: cursoId,
      titulo: tema,
      descripcion: `Curso de ${nombresMeses[mes]} ${year}: ${tema}`,
      mes,
      year,
      eventoLunar,
      estado,
      programarPara,
      fechaInicio: `${year}-${String(mes).padStart(2, '0')}-01`,
      fechaFin: `${year}-${String(mes).padStart(2, '0')}-28`,
      imagen: null,
      modulos: [],
      badge: academia.validaciones.FALLBACKS.badge(tema),
      metadata: {
        creadoEn: new Date().toISOString(),
        criteriosUsados: { categorias, especies, cristales },
        guardianesSeleccionados: seleccion.guardianes.map(g => g.id)
      }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. GENERAR CADA MÓDULO (1 por semana, 1 guardián por módulo)
    // ═══════════════════════════════════════════════════════════════════════════

    const erroresGeneracion = [];
    const advertenciasGeneracion = [];

    for (let semana = 0; semana < 4; semana++) {
      const guardian = seleccion.guardianes[semana];
      const moduloNum = semana + 1;

      console.log(`[ACADEMIA] Generando módulo ${moduloNum} con ${guardian.nombre}...`);

      // Validar guardián
      const validacionGuardian = academia.validaciones.validarGuardianParaAcademia(guardian);
      if (validacionGuardian.advertencias.length > 0) {
        advertenciasGeneracion.push(...validacionGuardian.advertencias.map(a => `Módulo ${moduloNum}: ${a}`));
      }

      // Determinar subtema del módulo basado en la semana
      const subtemas = generarSubtemas(tema, guardian);

      const modulo = {
        numero: moduloNum,
        titulo: subtemas[semana] || `Semana ${moduloNum}: ${tema}`,
        semana: `${moduloNum}-${moduloNum * 7} de ${nombresMeses[mes]}`,
        guardian: {
          id: guardian.id,
          nombre: guardian.nombre,
          imagen: guardian.imagen || guardian.images?.[0]?.src || academia.validaciones.FALLBACKS.imagenGuardian(guardian.nombre),
          categoria: guardian.categoria,
          especie: guardian.especie || guardian.tipo,
          cristales: academia.validaciones.detectarCristales(guardian.accesorios || ''),
          accesorios: guardian.accesorios,
          puedeEnsenar: validacionGuardian.puedeEnsenar
        },
        imagen: null,
        lecciones: []
      };

      // ═══════════════════════════════════════════════════════════════════════
      // 7.1 GENERAR 4 LECCIONES POR MÓDULO
      // ═══════════════════════════════════════════════════════════════════════

      const tiposLeccion = [
        { tipo: 'teoria', titulo: 'Entendiendo', descripcion: 'Teoría y conceptos' },
        { tipo: 'practica', titulo: 'Practicando', descripcion: 'Meditación o ejercicio guiado' },
        { tipo: 'diy', titulo: 'Creando', descripcion: 'DIY o ritual práctico' },
        { tipo: 'integracion', titulo: 'Integrando', descripcion: 'Reflexión y journaling' }
      ];

      for (let leccionNum = 0; leccionNum < 4; leccionNum++) {
        const tipoLeccion = tiposLeccion[leccionNum];

        try {
          let contenido = '';

          if (generarContenido) {
            contenido = await generarContenidoLeccion(
              guardian,
              tema,
              modulo.titulo,
              tipoLeccion,
              leccionNum + 1
            );

            // Validar contenido generado
            const validacionContenido = academia.validaciones.validarContenidoGenerado(contenido, guardian);
            if (!validacionContenido.valid) {
              advertenciasGeneracion.push(`Lección ${moduloNum}.${leccionNum + 1}: Score bajo (${validacionContenido.score}/100)`);

              // Intentar regenerar si score muy bajo
              if (validacionContenido.score < 50) {
                console.log(`[ACADEMIA] Regenerando lección por score bajo...`);
                contenido = await generarContenidoLeccion(guardian, tema, modulo.titulo, tipoLeccion, leccionNum + 1, true);
              }
            }
          }

          modulo.lecciones.push({
            numero: leccionNum + 1,
            tipo: tipoLeccion.tipo,
            titulo: `${tipoLeccion.titulo}: ${modulo.titulo}`,
            descripcion: tipoLeccion.descripcion,
            contenido,
            imagen: null,
            completada: false
          });

        } catch (error) {
          erroresGeneracion.push(`Error en lección ${moduloNum}.${leccionNum + 1}: ${error.message}`);
          academia.resiliencia.logError('generarLeccion', error, { moduloNum, leccionNum, guardian: guardian.nombre });

          // Usar contenido de fallback
          modulo.lecciones.push({
            numero: leccionNum + 1,
            tipo: tipoLeccion.tipo,
            titulo: `${tipoLeccion.titulo}: ${modulo.titulo}`,
            descripcion: tipoLeccion.descripcion,
            contenido: generarContenidoFallback(guardian, tema, tipoLeccion),
            imagen: null,
            completada: false,
            esFallback: true
          });
        }
      }

      curso.modulos.push(modulo);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. GENERAR IMÁGENES (si está habilitado)
    // ═══════════════════════════════════════════════════════════════════════════

    if (generarImagenes) {
      try {
        // Imagen principal del curso
        curso.imagen = await generarImagenCurso(tema, mes, year);

        // Imágenes de cada módulo
        for (const modulo of curso.modulos) {
          try {
            modulo.imagen = await generarImagenModulo(modulo.titulo, modulo.guardian);
          } catch (error) {
            advertenciasGeneracion.push(`Imagen módulo ${modulo.numero}: usando placeholder`);
            modulo.imagen = academia.validaciones.FALLBACKS.imagenCurso(modulo.titulo);
          }
        }
      } catch (error) {
        advertenciasGeneracion.push('Imagen del curso: usando placeholder');
        curso.imagen = academia.validaciones.FALLBACKS.imagenCurso(tema);
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 9. VALIDACIÓN FINAL
    // ═══════════════════════════════════════════════════════════════════════════

    const validacionFinal = academia.validaciones.validarCursoParaPublicar(curso);

    // ═══════════════════════════════════════════════════════════════════════════
    // 10. GUARDAR EN KV
    // ═══════════════════════════════════════════════════════════════════════════

    await kv.set(`academia:curso:${cursoId}`, curso);

    // Actualizar historial de guardianes usados
    const nuevoHistorial = [
      ...seleccion.guardianes.map(g => ({ id: g.id, nombre: g.nombre, fecha: new Date().toISOString() })),
      ...historialReciente
    ].slice(0, 20); // Mantener últimos 20
    await kv.set(historialKey, nuevoHistorial);

    // Agregar a lista de cursos
    const listaCursos = await kv.get('academia:cursos:lista') || [];
    listaCursos.push({
      id: cursoId,
      titulo: curso.titulo,
      mes,
      year,
      estado,
      creadoEn: curso.metadata.creadoEn
    });
    await kv.set('academia:cursos:lista', listaCursos);

    // ═══════════════════════════════════════════════════════════════════════════
    // 11. RESPUESTA
    // ═══════════════════════════════════════════════════════════════════════════

    const tiempoTotal = Date.now() - startTime;

    return Response.json({
      success: true,
      curso: {
        id: curso.id,
        titulo: curso.titulo,
        descripcion: curso.descripcion,
        estado: curso.estado,
        imagen: curso.imagen,
        modulos: curso.modulos.map(m => ({
          numero: m.numero,
          titulo: m.titulo,
          guardian: m.guardian.nombre,
          lecciones: m.lecciones.length,
          imagen: m.imagen
        })),
        badge: curso.badge
      },
      validacion: {
        aptoParaPublicar: validacionFinal.valid,
        checklist: validacionFinal.checklist,
        errores: validacionFinal.errores
      },
      estadisticas: {
        tiempoGeneracionMs: tiempoTotal,
        guardianesFiltrados: guardianesFiltrados.length,
        totalGuardianes: guardianes.length,
        leccionesGeneradas: curso.modulos.reduce((acc, m) => acc + m.lecciones.length, 0),
        imagenesGeneradas: generarImagenes ? 1 + curso.modulos.filter(m => m.imagen && !m.imagen.includes('placehold')).length : 0
      },
      errores: erroresGeneracion,
      advertencias: [...validacionConfig.advertencias, ...seleccion.advertencias, ...advertenciasGeneracion, ...validacionFinal.advertencias]
    });

  } catch (error) {
    console.error('[ACADEMIA] Error en generación:', error);
    academia.resiliencia.logError('generarCurso', error);

    return Response.json({
      success: false,
      error: error.message,
      fase: 'desconocida'
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtiene guardianes de WooCommerce con fallback
 */
async function obtenerGuardianesWoo() {
  return academia.resiliencia.conRetry(
    async () => {
      // Intentar cache primero
      const cached = academia.resiliencia.cacheGet('guardianes:woo');
      if (cached) return cached;

      const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
      const WOO_KEY = process.env.WC_CONSUMER_KEY;
      const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

      if (!WOO_KEY || !WOO_SECRET) {
        // Fallback a base de datos local
        const productosBase = await import('@/lib/productos-base-datos.json');
        return productosBase.default?.productos || productosBase.productos || [];
      }

      const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

      let productos = [];
      let page = 1;

      while (page <= 5) {
        const response = await fetch(
          `${WOO_URL}/wp-json/wc/v3/products?status=publish&per_page=100&page=${page}`,
          {
            headers: { 'Authorization': `Basic ${auth}` },
            signal: AbortSignal.timeout(30000)
          }
        );

        if (!response.ok) throw new Error(`WooCommerce: ${response.status}`);

        const data = await response.json();
        if (data.length === 0) break;

        productos = productos.concat(data.map(p => ({
          id: p.id,
          nombre: p.name,
          slug: p.slug,
          categoria: p.categories?.[0]?.name || 'Sin categoría',
          imagen: p.images?.[0]?.src,
          precio: parseFloat(p.price) || 0,
          descripcion: p.short_description || p.description,
          accesorios: extraerAccesorios(p.description),
          especie: detectarEspecie(p.name, p.description),
          stock: p.stock_quantity
        })));

        page++;
      }

      // Guardar en cache
      academia.resiliencia.cacheSet('guardianes:woo', productos, 5 * 60 * 1000);

      return productos;
    },
    {
      serviceName: 'woocommerce',
      maxRetries: 2,
      onRetry: (intento, delay, error) => {
        console.log(`[WOO] Retry ${intento}: ${error.message}`);
      }
    }
  );
}

function extraerAccesorios(descripcion) {
  if (!descripcion) return '';
  // Simplificar extracción - tomar texto después de "con" o "tiene"
  const match = descripcion.match(/(?:con|tiene|lleva|porta)\s+([^.]+)/i);
  return match ? match[1].trim() : '';
}

function detectarEspecie(nombre, descripcion) {
  const texto = `${nombre} ${descripcion}`.toLowerCase();
  const especies = ['pixie', 'bruja', 'brujo', 'vikingo', 'vikinga', 'elfo', 'elfa',
    'chaman', 'leprechaun', 'gnomo', 'hada', 'mago', 'guerrero', 'guerrera'];

  for (const especie of especies) {
    if (texto.includes(especie)) return especie;
  }
  return 'duende';
}

/**
 * Genera subtemas para las 4 semanas del curso
 */
function generarSubtemas(tema, guardian) {
  const temaLower = tema.toLowerCase();

  const subtemasPorTema = {
    'proteccion': [
      'Entendiendo tu Escudo Interior',
      'Limpieza de Espacios y Aura',
      'Creando tu Protección Física',
      'Límites Sanos y Energéticos'
    ],
    'protección': [
      'Entendiendo tu Escudo Interior',
      'Limpieza de Espacios y Aura',
      'Creando tu Protección Física',
      'Límites Sanos y Energéticos'
    ],
    'sanacion': [
      'Reconociendo las Heridas',
      'Trabajo con el Dolor Emocional',
      'Rituales de Liberación',
      'Perdón y Soltar'
    ],
    'sanación': [
      'Reconociendo las Heridas',
      'Trabajo con el Dolor Emocional',
      'Rituales de Liberación',
      'Perdón y Soltar'
    ],
    'abundancia': [
      'Creencias sobre el Dinero',
      'La Abundancia que Ya Tenés',
      'Altar de Prosperidad',
      'Manifestar sin Forzar'
    ],
    'amor': [
      'Abriendo el Corazón',
      'Sanando Heridas de Amor',
      'Amor Propio Primero',
      'Relaciones Conscientes'
    ],
    'sabiduria': [
      'Escuchando tu Intuición',
      'Claridad en la Confusión',
      'Decisiones desde el Centro',
      'Sabiduría en la Acción'
    ],
    'sabiduría': [
      'Escuchando tu Intuición',
      'Claridad en la Confusión',
      'Decisiones desde el Centro',
      'Sabiduría en la Acción'
    ]
  };

  return subtemasPorTema[temaLower] || [
    `Introducción a ${tema}`,
    `Profundizando en ${tema}`,
    `Práctica de ${tema}`,
    `Integración de ${tema}`
  ];
}

/**
 * Genera contenido de una lección con IA
 */
async function generarContenidoLeccion(guardian, tema, subtema, tipoLeccion, leccionNum, esReintento = false) {
  const especialidad = especializaciones[academia.validaciones.normalizarTexto(guardian.categoria)];
  const instruccionesEsp = getInstruccionesEspecializacion(academia.validaciones.normalizarTexto(guardian.categoria));

  const prompt = construirPromptLeccion(guardian, tema, subtema, tipoLeccion, leccionNum, instruccionesEsp, esReintento);

  // Intentar con Claude primero
  try {
    return await generarConClaude(prompt);
  } catch (error) {
    console.log('[ACADEMIA] Claude falló, intentando Gemini...');

    // Fallback a Gemini
    try {
      return await generarConGemini(prompt);
    } catch (error2) {
      console.log('[ACADEMIA] Gemini falló, usando contenido mínimo');
      throw error2;
    }
  }
}

function construirPromptLeccion(guardian, tema, subtema, tipoLeccion, leccionNum, instruccionesEsp, esReintento) {
  const cristales = academia.validaciones.detectarCristales(guardian.accesorios || '');

  let instruccionesTipo = '';
  switch (tipoLeccion.tipo) {
    case 'teoria':
      instruccionesTipo = `
Esta es una lección TEÓRICA. Debe:
- Explicar conceptos desde la experiencia vivida del guardián
- Usar ejemplos concretos y situaciones reconocibles
- Incluir "Los 3 tipos de..." o similar para estructurar
- Terminar con una pregunta para journaling`;
      break;
    case 'practica':
      instruccionesTipo = `
Esta es una lección PRÁCTICA (meditación/ejercicio). Debe:
- Incluir una meditación guiada de 10-15 minutos
- Pasos claros: preparación, desarrollo, cierre
- Instrucciones de respiración específicas
- Visualización detallada
- Terminar con "Anotá qué sentiste"`;
      break;
    case 'diy':
      instruccionesTipo = `
Esta es una lección DIY/RITUAL. Debe:
- Lista de MATERIALES específicos (con alternativas)
- Pasos NUMERADOS claros
- Explicar el PORQUÉ de cada elemento
- Incluir intención/palabras para decir
- Indicar dónde colocar el objeto creado`;
      break;
    case 'integracion':
      instruccionesTipo = `
Esta es una lección de INTEGRACIÓN. Debe:
- Reflexión sobre lo aprendido en la semana
- 3-5 preguntas profundas para journaling
- Una práctica pequeña para la semana siguiente
- Mensaje de cierre emotivo del guardián`;
      break;
  }

  return `
Sos ${guardian.nombre}, un/a ${guardian.especie || 'guardián'} de ${guardian.categoria}.
${guardian.accesorios ? `Portás: ${guardian.accesorios}.` : ''}
${cristales.length > 0 ? `Tus cristales son: ${cristales.join(', ')}.` : ''}

Estás dando la lección ${leccionNum} del módulo "${subtema}" en el curso "${tema}".

${instruccionesEsp || ''}

${instruccionesTipo}

REGLAS ABSOLUTAS:
1. Primera frase = impacto emocional, que la persona se sienta vista
2. Español rioplatense (vos, tenés, podés)
3. Tono adulto, profundo, cercano - NO cursi ni infantil
4. PROHIBIDO: "brumas ancestrales", "velo entre mundos", "desde tiempos inmemoriales", "susurro del viento"
5. TODO debe ser específico y aplicable HOY
6. Hablás desde TU experiencia como ${guardian.nombre}
7. ${esReintento ? 'IMPORTANTE: El contenido anterior fue rechazado por genérico. Sé MÁS específico y personal.' : ''}

Escribí la lección completa (600-1000 palabras).
NO uses formato markdown con # ni **. Escribí en prosa natural con párrafos.
`;
}

async function generarConClaude(prompt) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) throw new Error('Sin API key de Claude');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    }),
    signal: AbortSignal.timeout(60000)
  });

  if (!response.ok) {
    throw new Error(`Claude API: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function generarConGemini(prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error('Sin API key de Gemini');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
      }),
      signal: AbortSignal.timeout(60000)
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function generarContenidoFallback(guardian, tema, tipoLeccion) {
  return `
${guardian.nombre} te habla sobre ${tema}.

Hoy quiero compartir contigo algo importante sobre ${tipoLeccion.descripcion.toLowerCase()}.

En mis años acompañando a personas como vos, aprendí que el primer paso siempre es reconocer dónde estás parada/o.

No necesitás tener todas las respuestas. Solo necesitás estar dispuesta/o a escuchar.

Tomá un momento para respirar profundo. Sentí tus pies en el suelo. Estás acá, ahora, y eso ya es suficiente.

---
*Este contenido se regenerará pronto con información más personalizada.*
  `.trim();
}

/**
 * Genera imagen del curso con DALL-E
 */
async function generarImagenCurso(tema, mes, year) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return academia.validaciones.FALLBACKS.imagenCurso(tema);
  }

  const prompt = `Mystical fantasy scene representing "${tema}". Dark ethereal background with golden accents. Magical crystals, soft glowing light, enchanted forest elements. Style: digital art, mystical, elegant. No text. Horizontal composition 16:9.`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: DALLE_MODEL,
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard'
    }),
    signal: AbortSignal.timeout(120000)
  });

  if (!response.ok) {
    throw new Error(`DALL-E: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

/**
 * Genera imagen de módulo con DALL-E
 */
async function generarImagenModulo(titulo, guardian) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return academia.validaciones.FALLBACKS.imagenCurso(titulo);
  }

  const cristales = guardian.cristales?.join(', ') || 'crystals';

  const prompt = `Mystical scene: ${titulo}. Features ${cristales}, magical ${guardian.especie || 'guardian'} energy. Dark background with golden and purple accents. Soft magical lighting. Fantasy digital art style. No text, no faces. Square composition.`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: DALLE_MODEL,
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    }),
    signal: AbortSignal.timeout(120000)
  });

  if (!response.ok) {
    throw new Error(`DALL-E módulo: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Obtener curso existente o listar cursos
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursoId = searchParams.get('id');
    const listar = searchParams.get('listar');

    if (cursoId) {
      const curso = await kv.get(`academia:curso:${cursoId}`);
      if (!curso) {
        return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
      }
      return Response.json({ success: true, curso });
    }

    if (listar === 'true') {
      const lista = await kv.get('academia:cursos:lista') || [];
      return Response.json({ success: true, cursos: lista });
    }

    // Health check
    const salud = await academia.reporteSalud();
    return Response.json({ success: true, salud });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
