import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import canon from '@/lib/canon.json';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// Catálogo completo de experiencias (sincronizado con catalogo/route.js)
const EXPERIENCIAS = {
  'mensaje_dia': {
    nombre: 'Mensaje del Día Personalizado',
    runas: 15,
    generaIA: true,
    palabras: 300,
    tiempoMs: 0 // Instantáneo
  },
  'tirada_basica': {
    nombre: 'Tirada de Runas (3 Runas)',
    runas: 25,
    generaIA: true,
    palabras: 800,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 40 * 60 * 1000
  },
  'lectura_energia': {
    nombre: 'Lectura de Energía Básica',
    runas: 40,
    generaIA: true,
    palabras: 1000,
    tiempoMinMs: 30 * 60 * 1000,
    tiempoMaxMs: 60 * 60 * 1000
  },
  'guia_cristal': {
    nombre: 'Guía de Cristal del Mes',
    runas: 60,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 60 * 60 * 1000,
    tiempoMaxMs: 2 * 60 * 60 * 1000
  },
  'tirada_completa': {
    nombre: 'Tirada de Runas Completa (7 Runas)',
    runas: 80,
    generaIA: true,
    palabras: 2000,
    tiempoMinMs: 2 * 60 * 60 * 1000,
    tiempoMaxMs: 4 * 60 * 60 * 1000
  },
  'lectura_profunda': {
    nombre: 'Lectura de Energía Profunda',
    runas: 100,
    generaIA: true,
    palabras: 2500,
    tiempoMinMs: 3 * 60 * 60 * 1000,
    tiempoMaxMs: 6 * 60 * 60 * 1000
  },
  'ritual_personalizado': {
    nombre: 'Ritual Personalizado',
    runas: 150,
    generaIA: true,
    palabras: 2000,
    tiempoMinMs: 12 * 60 * 60 * 1000,
    tiempoMaxMs: 24 * 60 * 60 * 1000
  },
  'estudio_numerologico': {
    nombre: 'Estudio Numerológico Completo',
    runas: 200,
    generaIA: true,
    palabras: 4000,
    tiempoMinMs: 24 * 60 * 60 * 1000,
    tiempoMaxMs: 48 * 60 * 60 * 1000
  },
  'carta_astral_basica': {
    nombre: 'Carta Astral Básica',
    runas: 300,
    generaIA: false, // Requiere revisión manual
    palabras: 5000,
    tiempoMinMs: 4 * 24 * 60 * 60 * 1000,
    tiempoMaxMs: 7 * 24 * 60 * 60 * 1000
  },
  'estudio_alma': {
    nombre: 'Estudio del Alma Completo',
    runas: 500,
    generaIA: false, // Premium - revisión manual
    palabras: 8000,
    tiempoMinMs: 10 * 24 * 60 * 60 * 1000,
    tiempoMaxMs: 14 * 24 * 60 * 60 * 1000
  }
};

// POST - Solicitar una experiencia
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      experienciaId,
      contexto = '',
      fechaNacimiento,
      preguntaEspecifica,
      generarInmediato = false
    } = body;

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    if (!experienciaId || !EXPERIENCIAS[experienciaId]) {
      return Response.json({
        success: false,
        error: 'Experiencia no válida',
        experiencias_disponibles: Object.keys(EXPERIENCIAS)
      }, { status: 400, headers: CORS_HEADERS });
    }

    const experiencia = EXPERIENCIAS[experienciaId];
    const emailNorm = email.toLowerCase().trim();

    // Buscar usuario en ambas keys
    let userKey = `user:${emailNorm}`;
    let usuario = await kv.get(userKey);
    if (!usuario) {
      userKey = `elegido:${emailNorm}`;
      usuario = await kv.get(userKey);
    }

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado. Debés estar registrado para solicitar experiencias.'
      }, { status: 404, headers: CORS_HEADERS });
    }

    // Verificar runas suficientes
    const runasActuales = usuario.runas || 0;
    if (runasActuales < experiencia.runas) {
      return Response.json({
        success: false,
        error: 'Runas insuficientes',
        runas_necesarias: experiencia.runas,
        runas_actuales: runasActuales,
        faltan: experiencia.runas - runasActuales,
        sugerencia: '¿Necesitás más runas? Podés conseguirlas en nuestra tienda.'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // Calcular fecha de entrega
    const ahora = new Date();
    let fechaEntrega = ahora;

    if (experiencia.tiempoMs === 0) {
      // Instantáneo
      fechaEntrega = ahora;
    } else {
      // Calcular tiempo aleatorio dentro del rango
      const tiempoAleatorio = experiencia.tiempoMinMs +
        Math.random() * (experiencia.tiempoMaxMs - experiencia.tiempoMinMs);
      fechaEntrega = new Date(Date.now() + tiempoAleatorio);

      // Ajustar si cae en horario nocturno Uruguay (22:00 - 06:00)
      fechaEntrega = ajustarHorarioEntrega(fechaEntrega);
    }

    // Crear solicitud
    const solicitudId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const solicitud = {
      id: solicitudId,
      experienciaId,
      experienciaNombre: experiencia.nombre,
      email: emailNorm,
      nombreUsuario: usuario.nombre || usuario.nombrePreferido || 'Alma luminosa',
      pronombre: usuario.pronombre || 'ella',
      elemento: usuario.elemento,
      guardianes: usuario.guardianes || [],
      contexto,
      preguntaEspecifica,
      fechaNacimiento,
      runasGastadas: experiencia.runas,
      palabrasMinimas: experiencia.palabras,
      fechaSolicitud: ahora.toISOString(),
      fechaEntregaEstimada: fechaEntrega.toISOString(),
      estado: 'procesando',
      resultado: null
    };

    // Descontar runas del usuario
    usuario.runas = runasActuales - experiencia.runas;

    // Registrar en historial del usuario
    if (!usuario.historialExperiencias) {
      usuario.historialExperiencias = [];
    }
    usuario.historialExperiencias.push({
      id: solicitudId,
      experienciaId,
      nombre: experiencia.nombre,
      runas: experiencia.runas,
      fecha: ahora.toISOString(),
      estado: 'procesando'
    });

    // Guardar usuario actualizado
    await kv.set(userKey, usuario);

    // Guardar solicitud
    await kv.set(`experiencia:${solicitudId}`, solicitud);

    // Agregar a cola de pendientes del usuario
    const pendientes = await kv.get(`lecturas-pendientes:${emailNorm}`) || [];
    pendientes.push({
      id: solicitudId,
      tipo: experienciaId,
      nombre: experiencia.nombre,
      fechaEntrega: fechaEntrega.toISOString(),
      estado: 'procesando'
    });
    await kv.set(`lecturas-pendientes:${emailNorm}`, pendientes);

    // Agregar a cola global de procesamiento
    const colaProcesamiento = await kv.get('cola:experiencias') || [];
    colaProcesamiento.push(solicitudId);
    await kv.set('cola:experiencias', colaProcesamiento);

    // Si es instantáneo o se pidió generación inmediata, generar ahora
    let resultado = null;
    if ((experiencia.tiempoMs === 0 || generarInmediato) && experiencia.generaIA) {
      try {
        resultado = await generarExperienciaIA(solicitud, experiencia);
        solicitud.estado = 'listo';
        solicitud.resultado = resultado;
        solicitud.fechaCompletado = new Date().toISOString();

        // Actualizar solicitud
        await kv.set(`experiencia:${solicitudId}`, solicitud);

        // Actualizar estado en historial del usuario
        const historialIndex = usuario.historialExperiencias.findIndex(h => h.id === solicitudId);
        if (historialIndex !== -1) {
          usuario.historialExperiencias[historialIndex].estado = 'listo';
          await kv.set(userKey, usuario);
        }

        // Actualizar pendientes
        const pendientesActualizados = pendientes.map(p =>
          p.id === solicitudId ? { ...p, estado: 'listo' } : p
        );
        await kv.set(`lecturas-pendientes:${emailNorm}`, pendientesActualizados);

      } catch (iaError) {
        console.error('Error generando con IA:', iaError);
        solicitud.estado = 'pendiente_revision';
        solicitud.errorIA = iaError.message;
        await kv.set(`experiencia:${solicitudId}`, solicitud);
      }
    }

    return Response.json({
      success: true,
      mensaje: resultado
        ? 'Tu experiencia mágica está lista'
        : `Tu ${experiencia.nombre} está siendo preparada. Te avisaremos cuando esté lista.`,
      solicitud: {
        id: solicitudId,
        experiencia: experiencia.nombre,
        estado: solicitud.estado,
        runasGastadas: experiencia.runas,
        runasRestantes: usuario.runas,
        fechaEntregaEstimada: fechaEntrega.toISOString()
      },
      resultado: resultado ? {
        titulo: resultado.titulo,
        contenido: resultado.contenido,
        palabras: resultado.palabras
      } : null
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error procesando solicitud:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// GET - Obtener mis experiencias solicitadas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    const emailNorm = email.toLowerCase().trim();

    // Si piden una experiencia específica
    if (id) {
      const solicitud = await kv.get(`experiencia:${id}`);
      if (!solicitud || solicitud.email !== emailNorm) {
        return Response.json({
          success: false,
          error: 'Experiencia no encontrada'
        }, { status: 404, headers: CORS_HEADERS });
      }

      return Response.json({
        success: true,
        experiencia: solicitud
      }, { headers: CORS_HEADERS });
    }

    // Buscar usuario para historial
    let userKey = `user:${emailNorm}`;
    let usuario = await kv.get(userKey);
    if (!usuario) {
      userKey = `elegido:${emailNorm}`;
      usuario = await kv.get(userKey);
    }

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404, headers: CORS_HEADERS });
    }

    const historial = usuario.historialExperiencias || [];

    // Obtener detalles completos de las últimas 10
    const experienciasDetalladas = [];
    for (const item of historial.slice(-10).reverse()) {
      const detalle = await kv.get(`experiencia:${item.id}`);
      if (detalle) {
        experienciasDetalladas.push({
          id: item.id,
          nombre: item.nombre,
          runas: item.runas,
          fecha: item.fecha,
          estado: detalle.estado,
          fechaEntregaEstimada: detalle.fechaEntregaEstimada,
          tieneResultado: !!detalle.resultado
        });
      }
    }

    return Response.json({
      success: true,
      total: historial.length,
      experiencias: experienciasDetalladas,
      runasActuales: usuario.runas || 0
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error obteniendo experiencias:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// Ajustar horario de entrega (evitar horario nocturno Uruguay)
function ajustarHorarioEntrega(fecha) {
  const horaUruguay = new Date(fecha.toLocaleString('en-US', { timeZone: 'America/Montevideo' }));
  const hora = horaUruguay.getHours();

  if (hora >= 22 || hora < 6) {
    // Mover a las 06:30 del día siguiente si es muy tarde
    const nuevaFecha = new Date(horaUruguay);
    if (hora >= 22) {
      nuevaFecha.setDate(nuevaFecha.getDate() + 1);
    }
    nuevaFecha.setHours(6, 30, 0, 0);
    return nuevaFecha;
  }

  return fecha;
}

// Generador de experiencias con IA
async function generarExperienciaIA(solicitud, experiencia) {
  const {
    experienciaId,
    nombreUsuario,
    elemento,
    guardianes,
    contexto,
    preguntaEspecifica,
    fechaNacimiento,
    pronombre
  } = solicitud;

  // Prompts específicos para cada tipo de experiencia
  const prompts = {
    'mensaje_dia': {
      system: `Sos Tito, el duende mensajero de Duendes del Uruguay.
Tu misión es entregar un mensaje del día profundamente personal y significativo.
Usás español rioplatense (vos, tenés, podés).
Tono: cálido, cercano, místico pero accesible.
Pronombre del usuario: ${pronombre || 'ella'}.`,
      user: `Generá un mensaje del día especial para ${nombreUsuario}.
${elemento ? `Su elemento es ${elemento}.` : ''}
${guardianes.length > 0 ? `Su guardián es ${guardianes[0]?.nombre || guardianes[0]}.` : ''}
${contexto ? `Contexto personal: ${contexto}` : ''}

El mensaje debe:
- Tener mínimo 300 palabras
- Sentirse como un abrazo del universo
- Incluir una pequeña profecía o guía para el día
- Terminar con una afirmación de poder`
    },

    'tirada_basica': {
      system: `Sos un maestro runista de Duendes del Uruguay.
Canalizás la sabiduría de las runas nórdicas con profundidad y claridad.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una tirada de 3 runas (Pasado-Presente-Futuro) para ${nombreUsuario}.
${preguntaEspecifica ? `Pregunta específica: ${preguntaEspecifica}` : 'Lectura general de su momento vital'}
${elemento ? `Elemento: ${elemento}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}

Estructura:
1. Introducción (preparando la energía)
2. Primera Runa (Pasado) - nombre, significado, interpretación personal
3. Segunda Runa (Presente) - nombre, significado, interpretación personal
4. Tercera Runa (Futuro) - nombre, significado, interpretación personal
5. Síntesis - cómo se conectan las tres runas
6. Consejo de acción
7. Mensaje de cierre

Mínimo 800 palabras. Sé específico y profundo.`
    },

    'lectura_energia': {
      system: `Sos un lector de energía y campos áuricos de Duendes del Uruguay.
Percibís con claridad los patrones energéticos de las personas.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una lectura energética básica para ${nombreUsuario}.
${elemento ? `Elemento principal: ${elemento}` : ''}
${guardianes.length > 0 ? `Guardián: ${guardianes[0]?.nombre || guardianes[0]}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}

Incluí:
1. Estado general del campo áurico
2. Colores predominantes en el aura
3. Estado de los chakras principales
4. Bloqueos detectados
5. Fortalezas energéticas
6. Recomendaciones de limpieza
7. Cristal recomendado
8. Afirmación de sanación

Mínimo 1000 palabras. Sé detallado y sanador.`
    },

    'guia_cristal': {
      system: `Sos un experto en cristales y minerales mágicos de Duendes del Uruguay.
Conocés profundamente cada piedra y su sabiduría.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Creá una guía del cristal del mes para ${nombreUsuario}.
${elemento ? `Elemento: ${elemento}` : ''}
${contexto ? `Situación actual: ${contexto}` : ''}

Estructura:
1. Presentación del cristal elegido y por qué es para ${pronombre === 'él' ? 'él' : 'ella'} ahora
2. Historia y origen del cristal
3. Propiedades energéticas detalladas
4. Cómo conectar con él
5. Ritual de activación personalizado
6. Usos diarios recomendados
7. Combinaciones potentes
8. Meditación guiada con el cristal
9. Mensaje del cristal para ${nombreUsuario}

Mínimo 1200 palabras.`
    },

    'tirada_completa': {
      system: `Sos un gran maestro runista de Duendes del Uruguay.
Canalizás la sabiduría ancestral con profundidad extraordinaria.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una tirada completa de 7 runas para ${nombreUsuario}.
${preguntaEspecifica ? `Pregunta: ${preguntaEspecifica}` : 'Lectura profunda de su camino de vida'}
${elemento ? `Elemento: ${elemento}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}

Las 7 posiciones:
1. Situación presente
2. Obstáculo principal
3. Raíz del asunto
4. Pasado que influye
5. Coronamiento (mejor resultado posible)
6. Futuro próximo
7. Resultado final

Para cada runa: nombre, significado tradicional, interpretación personal profunda.
Incluí síntesis completa y plan de acción.
Mínimo 2000 palabras.`
    },

    'lectura_profunda': {
      system: `Sos un sanador energético avanzado de Duendes del Uruguay.
Leés los campos sutiles con precisión y compasión.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una lectura energética profunda para ${nombreUsuario}.
${elemento ? `Elemento: ${elemento}` : ''}
${guardianes.length > 0 ? `Guardián: ${guardianes[0]?.nombre || guardianes[0]}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}

Incluí análisis de:
1. Campo áurico completo (7 capas)
2. Sistema de chakras detallado (los 7 principales + secundarios)
3. Patrones kármicos detectados
4. Bloqueos y traumas energéticos
5. Líneas de tiempo (pasado-presente-futuro)
6. Conexiones con otros (cuerdas etéricas)
7. Potenciales dormidos
8. Plan de sanación completo
9. Ritual de liberación
10. Meditación de integración

Mínimo 2500 palabras.`
    },

    'ritual_personalizado': {
      system: `Sos un creador de rituales de Duendes del Uruguay.
Diseñás ceremonias personalizadas con poder real.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Diseñá un ritual personalizado para ${nombreUsuario}.
${contexto ? `Intención/objetivo: ${contexto}` : 'Ritual de conexión con su poder personal'}
${elemento ? `Elemento: ${elemento}` : ''}
${guardianes.length > 0 ? `Guardián para invocar: ${guardianes[0]?.nombre || guardianes[0]}` : ''}

Incluí:
1. Nombre del ritual
2. Propósito y significado
3. Timing lunar recomendado
4. Materiales necesarios (accesibles)
5. Preparación del espacio
6. Apertura del ritual
7. Cuerpo del ritual (paso a paso detallado)
8. Invocaciones y palabras de poder
9. Cierre del ritual
10. Señales de que funcionó
11. Mantenimiento post-ritual

Mínimo 2000 palabras. Que sea realizable y poderoso.`
    },

    'estudio_numerologico': {
      system: `Sos un numerólogo experto de Duendes del Uruguay.
Calculás e interpretás los números con profundidad mística.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá un estudio numerológico completo para ${nombreUsuario}.
${fechaNacimiento ? `Fecha de nacimiento: ${fechaNacimiento}` : 'Usá tu intuición para los números que resuenan con esta persona'}

Incluí:
1. Número de Vida (calculado o intuido)
2. Número de Expresión
3. Número del Alma
4. Número de Personalidad
5. Número de Año Personal actual (2025/2026)
6. Desafíos numerológicos
7. Ciclos de vida
8. Pináculos
9. Números kármicos
10. Síntesis completa del mapa numerológico
11. Predicciones para los próximos meses
12. Números de poder personales
13. Días favorables del mes

Mínimo 4000 palabras. Detallado y revelador.`
    }
  };

  const promptConfig = prompts[experienciaId];
  if (!promptConfig) {
    throw new Error('Tipo de experiencia no soportado para generación automática');
  }

  // Añadir contexto del canon
  const systemEnhanced = `${promptConfig.system}

CONTEXTO DEL UNIVERSO DUENDES:
${JSON.stringify({
  tono: canon.tono_comunicacion,
  elementos: canon.elementos,
  cristales_principales: canon.cristales.principales.slice(0, 5)
}, null, 2)}

REGLAS CRÍTICAS:
- Mínimo ${experiencia.palabras} palabras (OBLIGATORIO)
- Español rioplatense natural (vos, tenés, podés)
- Profundo, significativo y personalizado
- Firmá siempre como parte de la familia Duendes del Uruguay`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemEnhanced,
    messages: [{ role: 'user', content: promptConfig.user }]
  });

  const contenido = response.content[0]?.text || '';
  const palabras = contenido.split(/\s+/).length;

  return {
    titulo: experiencia.nombre,
    contenido,
    palabras,
    fechaGeneracion: new Date().toISOString()
  };
}
