import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import {
  obtenerLecturaPorId,
  obtenerNivel,
  puedeAccederALectura,
  XP_ACCIONES
} from '@/lib/gamificacion/config';

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

// ═══════════════════════════════════════════════════════════════
// POST - Ejecutar una lectura del catálogo de gamificación
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      token,
      email,
      lecturaId,
      contexto = '',
      pregunta = '',
      fechaNacimiento,
      generarInmediato = true
    } = body;

    // ─────────────────────────────────────────────────────────────
    // 1. AUTENTICACIÓN
    // ─────────────────────────────────────────────────────────────
    if (!token && !email) {
      return Response.json({
        success: false,
        error: 'Se requiere token o email'
      }, { status: 400, headers: CORS_HEADERS });
    }

    let userEmail = email;
    if (token && !email) {
      userEmail = await kv.get(`token:${token}`);
      if (!userEmail) {
        return Response.json({
          success: false,
          error: 'Token inválido'
        }, { status: 401, headers: CORS_HEADERS });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. OBTENER DATOS DEL USUARIO
    // ─────────────────────────────────────────────────────────────
    const usuario = await kv.get(`elegido:${userEmail}`);
    let gamificacion = await kv.get(`gamificacion:${userEmail}`);

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404, headers: CORS_HEADERS });
    }

    // Inicializar gamificación si no existe
    if (!gamificacion) {
      gamificacion = {
        xp: 0,
        nivel: 'iniciada',
        racha: 0,
        rachaMax: 0,
        ultimoLogin: null,
        ultimoCofre: null,
        lecturasCompletadas: [],
        tiposLecturaUsados: [],
        misionesCompletadas: [],
        badges: [],
        referidos: [],
        codigoReferido: generarCodigoReferido(usuario.nombre || userEmail),
        creadoEn: new Date().toISOString()
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 3. VERIFICAR LECTURA
    // ─────────────────────────────────────────────────────────────
    const lectura = obtenerLecturaPorId(lecturaId);

    if (!lectura) {
      return Response.json({
        success: false,
        error: 'Lectura no encontrada',
        lecturaId
      }, { status: 404, headers: CORS_HEADERS });
    }

    // ─────────────────────────────────────────────────────────────
    // 4. VERIFICAR ACCESO POR NIVEL
    // ─────────────────────────────────────────────────────────────
    const nivelUsuario = obtenerNivel(gamificacion.xp);
    const tieneAcceso = puedeAccederALectura(nivelUsuario.id, lectura.nivel);

    if (!tieneAcceso) {
      return Response.json({
        success: false,
        error: 'No tenés acceso a esta lectura. Subí de nivel para desbloquearla.',
        nivelRequerido: lectura.nivel,
        nivelActual: nivelUsuario.id,
        xpActual: gamificacion.xp
      }, { status: 403, headers: CORS_HEADERS });
    }

    // ─────────────────────────────────────────────────────────────
    // 5. VERIFICAR REQUISITO DE GUARDIÁN
    // ─────────────────────────────────────────────────────────────
    const tieneGuardian = usuario.guardianes && usuario.guardianes.length > 0;

    if (lectura.requiereGuardian && !tieneGuardian) {
      return Response.json({
        success: false,
        error: 'Esta lectura requiere tener un guardián adoptado.',
        requiereGuardian: true
      }, { status: 403, headers: CORS_HEADERS });
    }

    // ─────────────────────────────────────────────────────────────
    // 6. CALCULAR PRECIO CON DESCUENTOS
    // ─────────────────────────────────────────────────────────────
    let precioFinal = lectura.runas;
    let descuentoAplicado = 0;

    // Descuento por membresía del Círculo
    const esCirculo = usuario.circulo?.activo || false;
    const tipoMembresia = usuario.circulo?.plan || null;

    if (esCirculo) {
      if (tipoMembresia === 'anual') {
        descuentoAplicado = 10;
        precioFinal = Math.round(lectura.runas * 0.9);
      } else if (tipoMembresia === 'semestral') {
        descuentoAplicado = 5;
        precioFinal = Math.round(lectura.runas * 0.95);
      }
    }

    // Descuento por nivel
    if (nivelUsuario.descuento > 0) {
      const descuentoNivel = nivelUsuario.descuento;
      const descuentoTotal = Math.min(descuentoAplicado + descuentoNivel, 20); // Máximo 20%
      precioFinal = Math.round(lectura.runas * (1 - descuentoTotal / 100));
      descuentoAplicado = descuentoTotal;
    }

    // ─────────────────────────────────────────────────────────────
    // 7. VERIFICAR RUNAS SUFICIENTES
    // ─────────────────────────────────────────────────────────────
    const runasActuales = usuario.runas || 0;

    if (runasActuales < precioFinal) {
      return Response.json({
        success: false,
        error: 'Runas insuficientes',
        runasNecesarias: precioFinal,
        runasActuales,
        faltan: precioFinal - runasActuales,
        precioOriginal: lectura.runas,
        descuentoAplicado
      }, { status: 400, headers: CORS_HEADERS });
    }

    // ─────────────────────────────────────────────────────────────
    // 8. DESCONTAR RUNAS
    // ─────────────────────────────────────────────────────────────
    usuario.runas = runasActuales - precioFinal;

    // ─────────────────────────────────────────────────────────────
    // 9. CREAR SOLICITUD
    // ─────────────────────────────────────────────────────────────
    const solicitudId = `lec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ahora = new Date();

    const solicitud = {
      id: solicitudId,
      lecturaId,
      lecturaNombre: lectura.nombre,
      email: userEmail,
      nombreUsuario: usuario.nombre || usuario.nombrePreferido || 'Alma luminosa',
      pronombre: usuario.pronombre || 'ella',
      elemento: usuario.elemento,
      guardianes: usuario.guardianes || [],
      contexto,
      pregunta,
      fechaNacimiento,
      runasGastadas: precioFinal,
      descuentoAplicado,
      palabrasMinimas: lectura.palabras,
      nivelLectura: lectura.nivel,
      fechaSolicitud: ahora.toISOString(),
      estado: 'procesando',
      resultado: null
    };

    // ─────────────────────────────────────────────────────────────
    // 10. GENERAR LECTURA CON IA (si es inmediato)
    // ─────────────────────────────────────────────────────────────
    let resultado = null;

    if (generarInmediato) {
      try {
        resultado = await generarLecturaIA(solicitud, lectura);
        solicitud.estado = 'completado';
        solicitud.resultado = resultado;
        solicitud.fechaCompletado = new Date().toISOString();
      } catch (iaError) {
        console.error('Error generando con IA:', iaError);
        solicitud.estado = 'error';
        solicitud.errorIA = iaError.message;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 11. ACTUALIZAR GAMIFICACIÓN
    // ─────────────────────────────────────────────────────────────

    // Registrar lectura completada
    if (!gamificacion.lecturasCompletadas.includes(lecturaId)) {
      gamificacion.lecturasCompletadas.push(lecturaId);
    }

    // Registrar tipo de lectura usado
    if (!gamificacion.tiposLecturaUsados.includes(lectura.categoria)) {
      gamificacion.tiposLecturaUsados.push(lectura.categoria);
    }

    // Calcular XP según nivel de lectura
    let xpGanado = 0;
    switch (lectura.nivel) {
      case 'iniciada':
        xpGanado = XP_ACCIONES.lecturaBasica;
        break;
      case 'aprendiz':
        xpGanado = XP_ACCIONES.lecturaEstandar;
        break;
      case 'guardiana':
        xpGanado = XP_ACCIONES.lecturaPremium;
        break;
      case 'maestra':
      case 'sabia':
        xpGanado = XP_ACCIONES.lecturaUltraPremium;
        break;
      default:
        xpGanado = XP_ACCIONES.lecturaBasica;
    }

    gamificacion.xp += xpGanado;

    // Verificar si subió de nivel
    const nuevoNivel = obtenerNivel(gamificacion.xp);
    const subioNivel = nuevoNivel.id !== gamificacion.nivel;
    gamificacion.nivel = nuevoNivel.id;

    // ─────────────────────────────────────────────────────────────
    // 12. GUARDAR TODO
    // ─────────────────────────────────────────────────────────────

    // Guardar usuario con runas actualizadas
    await kv.set(`elegido:${userEmail}`, usuario);

    // Guardar gamificación
    await kv.set(`gamificacion:${userEmail}`, gamificacion);

    // Guardar solicitud/lectura
    await kv.set(`lectura:${solicitudId}`, solicitud);

    // Agregar al historial de lecturas del usuario
    const historialLecturas = await kv.get(`lecturas:${userEmail}`) || [];
    historialLecturas.unshift({
      id: solicitudId,
      lecturaId,
      nombre: lectura.nombre,
      categoria: lectura.categoria,
      runas: precioFinal,
      xp: xpGanado,
      fecha: ahora.toISOString(),
      estado: solicitud.estado
    });
    await kv.set(`lecturas:${userEmail}`, historialLecturas);

    // ─────────────────────────────────────────────────────────────
    // 13. RESPUESTA
    // ─────────────────────────────────────────────────────────────
    return Response.json({
      success: true,
      mensaje: resultado
        ? 'Tu lectura está lista'
        : 'Tu lectura está siendo preparada',
      solicitud: {
        id: solicitudId,
        lectura: lectura.nombre,
        estado: solicitud.estado,
        runasGastadas: precioFinal,
        runasRestantes: usuario.runas,
        descuentoAplicado
      },
      resultado: resultado ? {
        titulo: resultado.titulo,
        contenido: resultado.contenido,
        palabras: resultado.palabras
      } : null,
      gamificacion: {
        xpGanado,
        xpTotal: gamificacion.xp,
        nivel: nuevoNivel,
        subioNivel,
        lecturasCompletadas: gamificacion.lecturasCompletadas.length
      }
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error ejecutando lectura:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE MEMORIA - Obtener lecturas anteriores
// ═══════════════════════════════════════════════════════════════

async function obtenerMemoriaLecturas(email, limiteLecturas = 10) {
  try {
    // Obtener historial de lecturas
    const historial = await kv.get(`lecturas:${email}`) || [];

    if (historial.length === 0) return null;

    // Obtener las últimas N lecturas completas
    const lecturasCompletas = [];
    for (const item of historial.slice(0, limiteLecturas)) {
      const lecturaCompleta = await kv.get(`lectura:${item.id}`);
      if (lecturaCompleta && lecturaCompleta.resultado) {
        lecturasCompletas.push({
          fecha: lecturaCompleta.fechaSolicitud,
          tipo: lecturaCompleta.lecturaNombre,
          pregunta: lecturaCompleta.pregunta || '',
          contexto: lecturaCompleta.contexto || '',
          // Resumen del resultado (primeros 500 caracteres)
          resumen: lecturaCompleta.resultado.contenido?.slice(0, 500) + '...'
        });
      }
    }

    if (lecturasCompletas.length === 0) return null;

    // Crear resumen para la IA
    const memoriaTexto = lecturasCompletas.map((l, i) =>
      `[Lectura ${i + 1} - ${new Date(l.fecha).toLocaleDateString('es-UY')}]
Tipo: ${l.tipo}
${l.pregunta ? `Pregunta: ${l.pregunta}` : ''}
${l.contexto ? `Contexto: ${l.contexto}` : ''}
Resumen: ${l.resumen}`
    ).join('\n\n');

    return {
      cantidad: lecturasCompletas.length,
      texto: memoriaTexto,
      lecturas: lecturasCompletas
    };
  } catch (error) {
    console.error('Error obteniendo memoria:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE LECTURAS CON IA + MEMORIA
// ═══════════════════════════════════════════════════════════════

async function generarLecturaIA(solicitud, lectura) {
  const {
    email,
    nombreUsuario,
    pronombre,
    elemento,
    guardianes,
    contexto,
    pregunta,
    fechaNacimiento
  } = solicitud;

  // MEMORIA: Obtener lecturas anteriores del usuario
  const memoria = await obtenerMemoriaLecturas(email);

  // Prompt base según categoría
  const promptsPorCategoria = {
    mensajes: {
      system: `Sos un canalizador de mensajes del Bosque de Duendes del Uruguay.
Transmitís mensajes breves pero profundamente significativos.
Usás español rioplatense (vos, tenés, podés).
Pronombre del usuario: ${pronombre}.`,
      instrucciones: 'Mensaje personal y directo, que toque el corazón.'
    },
    tiradas: {
      system: `Sos un maestro runista de Duendes del Uruguay.
Canalizás la sabiduría de las runas nórdicas con profundidad.
Usás español rioplatense.
Pronombre: ${pronombre}.`,
      instrucciones: 'Incluí el nombre de cada runa, su significado y la interpretación personal.'
    },
    lecturas: {
      system: `Sos un lector de energías de Duendes del Uruguay.
Percibís los campos sutiles con claridad y compasión.
Usás español rioplatense.
Pronombre: ${pronombre}.`,
      instrucciones: 'Lectura detallada con análisis energético y consejos prácticos.'
    },
    estudios: {
      system: `Sos un estudioso de las artes místicas de Duendes del Uruguay.
Combinás numerología, astrología y canalización profunda.
Usás español rioplatense.
Pronombre: ${pronombre}.`,
      instrucciones: 'Estudio completo y detallado con múltiples capas de análisis.'
    },
    rituales: {
      system: `Sos un creador de rituales de Duendes del Uruguay.
Diseñás ceremonias personalizadas con poder real.
Usás español rioplatense.
Pronombre: ${pronombre}.`,
      instrucciones: 'Ritual paso a paso, con materiales accesibles y palabras de poder.'
    },
    guias: {
      system: `Sos un guía espiritual de Duendes del Uruguay.
Acompañás con sabiduría práctica y cálida.
Usás español rioplatense.
Pronombre: ${pronombre}.`,
      instrucciones: 'Guía práctica y detallada con ejercicios aplicables.'
    },
    eventos: {
      system: `Sos un canalizador de energías cósmicas de Duendes del Uruguay.
Conectás con las fases lunares y los ciclos naturales.
Usás español rioplatense.
Pronombre: ${pronombre}.`,
      instrucciones: 'Lectura conectada con el evento cósmico actual.'
    },
    portales: {
      system: `Sos un guardián de los portales estacionales de Duendes del Uruguay.
Canalizás la energía de los solsticios y equinoccios.
Usás español rioplatense.
Pronombre: ${pronombre}.`,
      instrucciones: 'Conexión profunda con la energía del portal estacional.'
    }
  };

  const categoriaConfig = promptsPorCategoria[lectura.categoria] || promptsPorCategoria.lecturas;

  // Construir sección de memoria si existe
  let seccionMemoria = '';
  if (memoria && memoria.cantidad > 0) {
    seccionMemoria = `
═══════════════════════════════════════════════════════════════
MEMORIA - LECTURAS ANTERIORES DE ${nombreUsuario.toUpperCase()}
═══════════════════════════════════════════════════════════════
${nombreUsuario} ya ha recibido ${memoria.cantidad} lecturas anteriores.
USA ESTA INFORMACIÓN para:
- NO repetir consejos ya dados
- Hacer referencias a lo que ya trabajaron juntos
- Notar su evolución y crecimiento
- Profundizar en temas recurrentes
- Personalizar basándote en su historial

RESÚMENES DE LECTURAS ANTERIORES:
${memoria.texto}
═══════════════════════════════════════════════════════════════
`;
  }

  const systemPrompt = `${categoriaConfig.system}

LECTURA: ${lectura.nombre}
DESCRIPCIÓN: ${lectura.descripcion}
${seccionMemoria}
REGLAS CRÍTICAS:
- Mínimo ${lectura.palabras} palabras (OBLIGATORIO)
- Español rioplatense natural (vos, tenés, podés)
- Profundo, significativo y personalizado
- ${categoriaConfig.instrucciones}
${memoria ? `- IMPORTANTE: ${nombreUsuario} ya tiene ${memoria.cantidad} lecturas previas. Reconocé su camino y evolución. NO repitas consejos.` : `- Esta es posiblemente su primera lectura. Dale una bienvenida especial.`}
- Firmá como parte de la familia Duendes del Uruguay`;

  // Usar promptBase de la lectura si existe, sino prompt genérico
  let userPrompt;

  if (lectura.promptBase) {
    // Reemplazar variables en el promptBase
    userPrompt = lectura.promptBase
      .replace(/\{nombre\}/g, nombreUsuario)
      .replace(/\{pronombre\}/g, pronombre || 'ella')
      .replace(/\{elemento\}/g, elemento || 'no especificado')
      .replace(/\{momentoVida\}/g, solicitud.momentoVida || contexto || 'no especificado')
      .replace(/\{preguntaEspecifica\}/g, pregunta || 'guía general')
      .replace(/\{pregunta\}/g, pregunta || 'guía general')
      .replace(/\{contexto\}/g, contexto || '')
      .replace(/\{areaVida\}/g, solicitud.areaVida || 'general')
      .replace(/\{intencion\}/g, solicitud.intencion || '')
      .replace(/\{fechaNacimiento\}/g, fechaNacimiento || 'no proporcionada')
      .replace(/\{horaNacimiento\}/g, solicitud.horaNacimiento || 'no proporcionada')
      .replace(/\{lugarNacimiento\}/g, solicitud.lugarNacimiento || 'no proporcionado')
      .replace(/\{nombreGuardian\}/g, guardianes?.[0]?.nombre || guardianes?.[0] || 'Guardián del Bosque')
      .replace(/\{tipoGuardian\}/g, solicitud.tipoGuardian || guardianes?.[0]?.tipo || 'guardián')
      .replace(/\{descripcionHogar\}/g, solicitud.descripcionHogar || '')
      .replace(/\{preocupaciones\}/g, solicitud.preocupaciones || '')
      .replace(/\{elementoAfinidad\}/g, solicitud.elementoAfinidad || elemento || '')
      .replace(/\{cristalesTiene\}/g, solicitud.cristalesTiene || 'ninguno mencionado')
      .replace(/\{relacionPersona\}/g, solicitud.relacionPersona || '')
      .replace(/\{situacionRelacion\}/g, solicitud.situacionRelacion || '')
      .replace(/\{fecha\}/g, new Date().toLocaleDateString('es-UY'))
      .replace(/\{mes_actual\}/g, new Date().toLocaleDateString('es-UY', { month: 'long' }));

    // Agregar recordatorio de memoria si tiene lecturas previas
    if (memoria && memoria.cantidad > 0) {
      userPrompt += `\n\nRECORDÁ: ${nombreUsuario} ya tiene ${memoria.cantidad} lecturas previas contigo. Reconocé su camino, no repitas consejos y mostrá que la conocés.`;
    }
  } else {
    // Prompt genérico fallback
    userPrompt = `Generá "${lectura.nombre}" para ${nombreUsuario}.

${elemento ? `Elemento: ${elemento}` : ''}
${guardianes?.length > 0 ? `Guardián: ${guardianes[0]?.nombre || guardianes[0]}` : ''}
${pregunta ? `Pregunta: ${pregunta}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}
${fechaNacimiento ? `Fecha de nacimiento: ${fechaNacimiento}` : ''}

Mínimo ${lectura.palabras} palabras. Que sea profundo, personal y memorable.${memoria ? `\n\nIMPORTANTE: Ya tiene ${memoria.cantidad} lecturas previas. Reconocé su evolución.` : ''}`;
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  const contenido = response.content[0]?.text || '';
  const palabras = contenido.split(/\s+/).length;

  return {
    titulo: lectura.nombre,
    contenido,
    palabras,
    fechaGeneracion: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function generarCodigoReferido(nombre) {
  const base = (nombre || 'USER')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}${random}`;
}

// ═══════════════════════════════════════════════════════════════
// GET - Obtener una lectura completada
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const lecturaId = searchParams.get('id');

    if (!lecturaId) {
      return Response.json({
        success: false,
        error: 'Se requiere ID de lectura'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // Autenticar
    let userEmail = email;
    if (token && !email) {
      userEmail = await kv.get(`token:${token}`);
    }

    if (!userEmail) {
      return Response.json({
        success: false,
        error: 'Autenticación requerida'
      }, { status: 401, headers: CORS_HEADERS });
    }

    // Obtener lectura
    const lectura = await kv.get(`lectura:${lecturaId}`);

    if (!lectura) {
      return Response.json({
        success: false,
        error: 'Lectura no encontrada'
      }, { status: 404, headers: CORS_HEADERS });
    }

    // Verificar que pertenece al usuario
    if (lectura.email !== userEmail) {
      return Response.json({
        success: false,
        error: 'No tenés acceso a esta lectura'
      }, { status: 403, headers: CORS_HEADERS });
    }

    return Response.json({
      success: true,
      lectura
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error obteniendo lectura:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}
