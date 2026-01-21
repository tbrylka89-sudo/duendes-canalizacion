// ═══════════════════════════════════════════════════════════════
// SISTEMA DE FICHA DE CLIENTE - DUENDES DEL URUGUAY
// Perfil completo con análisis psicológico e inteligencia
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════
// SIGNOS ZODIACALES
// ═══════════════════════════════════════════════════════════════

const SIGNOS_ZODIACALES = [
  { signo: 'Capricornio', emoji: '♑', elemento: 'Tierra', inicio: [12, 22], fin: [1, 19] },
  { signo: 'Acuario', emoji: '♒', elemento: 'Aire', inicio: [1, 20], fin: [2, 18] },
  { signo: 'Piscis', emoji: '♓', elemento: 'Agua', inicio: [2, 19], fin: [3, 20] },
  { signo: 'Aries', emoji: '♈', elemento: 'Fuego', inicio: [3, 21], fin: [4, 19] },
  { signo: 'Tauro', emoji: '♉', elemento: 'Tierra', inicio: [4, 20], fin: [5, 20] },
  { signo: 'Géminis', emoji: '♊', elemento: 'Aire', inicio: [5, 21], fin: [6, 20] },
  { signo: 'Cáncer', emoji: '♋', elemento: 'Agua', inicio: [6, 21], fin: [7, 22] },
  { signo: 'Leo', emoji: '♌', elemento: 'Fuego', inicio: [7, 23], fin: [8, 22] },
  { signo: 'Virgo', emoji: '♍', elemento: 'Tierra', inicio: [8, 23], fin: [9, 22] },
  { signo: 'Libra', emoji: '♎', elemento: 'Aire', inicio: [9, 23], fin: [10, 22] },
  { signo: 'Escorpio', emoji: '♏', elemento: 'Agua', inicio: [10, 23], fin: [11, 21] },
  { signo: 'Sagitario', emoji: '♐', elemento: 'Fuego', inicio: [11, 22], fin: [12, 21] }
];

export function calcularSignoZodiacal(fechaNacimiento) {
  if (!fechaNacimiento) return null;

  const fecha = new Date(fechaNacimiento);
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();

  for (const s of SIGNOS_ZODIACALES) {
    const [mesInicio, diaInicio] = s.inicio;
    const [mesFin, diaFin] = s.fin;

    // Caso especial para Capricornio (cruza año)
    if (s.signo === 'Capricornio') {
      if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) {
        return s;
      }
    } else {
      if ((mes === mesInicio && dia >= diaInicio) || (mes === mesFin && dia <= diaFin)) {
        return s;
      }
    }
  }
  return null;
}

export function calcularProximoCumple(fechaNacimiento) {
  if (!fechaNacimiento) return null;

  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  const cumpleEsteAno = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());

  if (cumpleEsteAno < hoy) {
    cumpleEsteAno.setFullYear(hoy.getFullYear() + 1);
  }

  const diasFaltan = Math.ceil((cumpleEsteAno - hoy) / (1000 * 60 * 60 * 24));

  return {
    fecha: cumpleEsteAno.toISOString().split('T')[0],
    diasFaltan,
    esCumpleHoy: diasFaltan === 0,
    esCumplePronto: diasFaltan <= 7
  };
}

// ═══════════════════════════════════════════════════════════════
// CREAR/ACTUALIZAR FICHA DE CLIENTE
// ═══════════════════════════════════════════════════════════════

export async function obtenerFichaCliente(email) {
  const ficha = await kv.get(`ficha:${email}`);
  if (ficha) return ficha;

  // Si no existe, crearla desde los datos existentes
  return await crearFichaDesdeElegido(email);
}

export async function crearFichaDesdeElegido(email) {
  const elegido = await kv.get(`elegido:${email}`);
  if (!elegido) return null;

  const gamificacion = await kv.get(`gamificacion:${email}`);
  const circulo = await kv.get(`circulo:${email}`);
  const historialLecturas = await kv.get(`lecturas:${email}`) || [];
  const historialChat = await kv.get(`chat:${email}`) || [];

  // Obtener canalizaciones de guardianes
  const canalizaciones = [];
  if (elegido.guardianes) {
    for (const guardian of elegido.guardianes) {
      const canalKey = `canalizacion:${email}:${guardian.id}`;
      const canal = await kv.get(canalKey);
      if (canal) canalizaciones.push(canal);
    }
  }

  // Calcular signo zodiacal
  const signoInfo = calcularSignoZodiacal(elegido.fechaNacimiento);
  const cumpleInfo = calcularProximoCumple(elegido.fechaNacimiento);

  const ficha = {
    // Datos personales
    email: elegido.email || email,
    nombre: elegido.nombre || '',
    nombreCompleto: elegido.nombreCompleto || elegido.nombre || '',
    apellido: elegido.apellido || '',
    telefono: elegido.telefono || '',
    pais: elegido.pais || '',
    ciudad: elegido.ciudad || '',
    direccion: elegido.direccion || '',

    // Fecha de nacimiento y astrología
    fechaNacimiento: elegido.fechaNacimiento || null,
    signoZodiacal: signoInfo?.signo || null,
    signoEmoji: signoInfo?.emoji || null,
    elementoZodiacal: signoInfo?.elemento || null,
    proximoCumple: cumpleInfo,

    // Pronombre y elemento preferido
    pronombre: elegido.pronombre || 'ella',
    elementoAfinidad: elegido.elemento || null,

    // Guardianes/Duendes
    guardianes: elegido.guardianes || [],
    cantidadGuardianes: elegido.guardianes?.length || 0,
    canalizaciones: canalizaciones,

    // Membresía
    circulo: circulo || { activo: false },
    esCirculo: circulo?.activo || false,
    tipoMembresia: circulo?.plan || null,

    // Gamificación
    runas: elegido.runas || 0,
    treboles: elegido.treboles || 0,
    xp: gamificacion?.xp || 0,
    nivel: gamificacion?.nivel || 'iniciada',
    racha: gamificacion?.racha || 0,
    rachaMax: gamificacion?.rachaMax || 0,
    badges: gamificacion?.badges || [],

    // Historial de compras
    totalCompras: elegido.totalCompras || 0,
    primeraCompra: elegido.primeraCompra || null,
    ultimaCompra: elegido.ultimaCompra || null,
    ordenes: elegido.ordenes || [],

    // Historial de lecturas
    lecturasRealizadas: historialLecturas.length,
    lecturasRecientes: historialLecturas.slice(0, 10),
    tiposLecturaUsados: gamificacion?.tiposLecturaUsados || [],

    // Historial de chat
    conversacionesChat: historialChat.length,
    ultimoChat: historialChat[0] || null,

    // Análisis (se llena con IA)
    analisis: null,
    perfilPsicologico: null,
    intereses: [],
    necesidades: [],
    recomendaciones: [],
    alertas: [],
    notasImportantes: [],

    // Metadata
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    ultimoAnalisis: null
  };

  await kv.set(`ficha:${email}`, ficha);
  return ficha;
}

// ═══════════════════════════════════════════════════════════════
// ANÁLISIS PSICOLÓGICO CON IA
// ═══════════════════════════════════════════════════════════════

export async function analizarCliente(email) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const ficha = await obtenerFichaCliente(email);
  if (!ficha) return null;

  // Obtener lecturas completas para análisis
  const lecturasCompletas = [];
  for (const lecResumen of ficha.lecturasRecientes || []) {
    const lecCompleta = await kv.get(`lectura:${lecResumen.id}`);
    if (lecCompleta) {
      lecturasCompletas.push({
        tipo: lecCompleta.lecturaNombre,
        fecha: lecCompleta.fechaSolicitud,
        pregunta: lecCompleta.pregunta,
        contexto: lecCompleta.contexto,
        resultado: lecCompleta.resultado?.contenido?.slice(0, 1000)
      });
    }
  }

  // Obtener historial de chat
  const historialChat = await kv.get(`chat:${email}`) || [];
  const chatResumen = historialChat.slice(0, 20).map(c => ({
    fecha: c.fecha,
    mensaje: c.mensaje?.slice(0, 300),
    respuesta: c.respuesta?.slice(0, 300)
  }));

  const datosParaAnalisis = {
    nombre: ficha.nombreCompleto || ficha.nombre,
    signo: ficha.signoZodiacal,
    elemento: ficha.elementoZodiacal,
    elementoAfinidad: ficha.elementoAfinidad,
    guardianes: ficha.guardianes?.map(g => g.nombre || g),
    esCirculo: ficha.esCirculo,
    totalCompras: ficha.totalCompras,
    racha: ficha.rachaMax,
    lecturas: lecturasCompletas,
    conversaciones: chatResumen,
    canalizaciones: ficha.canalizaciones?.map(c => ({
      guardian: c.guardian?.nombre,
      mensaje: c.mensaje?.slice(0, 500)
    }))
  };

  const prompt = `Sos un analista experto en psicología, comportamiento y espiritualidad de Duendes del Uruguay.

Analizá a esta clienta y generá un perfil completo en JSON:

DATOS DE LA CLIENTA:
${JSON.stringify(datosParaAnalisis, null, 2)}

Generá un JSON con esta estructura EXACTA:
{
  "perfilPsicologico": {
    "personalidad": "Descripción breve de su personalidad (2-3 oraciones)",
    "fortalezas": ["lista de 3-5 fortalezas"],
    "desafios": ["lista de 2-3 desafíos emocionales que enfrenta"],
    "necesidadesEmocionales": ["lista de 2-3 necesidades que busca satisfacer"],
    "patronesComportamiento": "Descripción de patrones observados"
  },
  "intereses": ["lista de 3-5 temas/áreas que le interesan basado en sus lecturas"],
  "etapaVida": "En qué etapa de vida parece estar (transición, estabilidad, búsqueda, etc.)",
  "nivelEspiritual": "Principiante/Intermedio/Avanzado - con breve explicación",
  "recomendaciones": [
    {
      "tipo": "lectura/guardian/membresia/ritual",
      "producto": "nombre específico del producto",
      "razon": "por qué le serviría"
    }
  ],
  "alertas": [
    {
      "tipo": "cumpleaños/inactividad/oportunidad/atencion",
      "mensaje": "descripción de la alerta",
      "prioridad": "alta/media/baja"
    }
  ],
  "notasImportantes": ["datos clave para recordar sobre esta persona"],
  "proximoPaso": "Qué acción sugerir para profundizar la relación",
  "resumenEjecutivo": "Resumen de 2-3 oraciones sobre quién es esta persona y qué necesita"
}

IMPORTANTE:
- Basate SOLO en los datos proporcionados
- Sé empático pero objetivo
- Las recomendaciones deben ser productos reales (guardianes de abundancia/protección/amor, lecturas del catálogo, membresía del Círculo)
- Las alertas son para el admin (cumpleaños próximo, cliente inactivo, oportunidad de venta, necesita atención)
- Respondé SOLO con el JSON válido, sin texto adicional`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const texto = response.content[0]?.text || '';
    const jsonMatch = texto.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const analisis = JSON.parse(jsonMatch[0]);

      // Actualizar ficha con análisis
      ficha.analisis = analisis;
      ficha.perfilPsicologico = analisis.perfilPsicologico;
      ficha.intereses = analisis.intereses;
      ficha.necesidades = analisis.perfilPsicologico?.necesidadesEmocionales || [];
      ficha.recomendaciones = analisis.recomendaciones;
      ficha.alertas = analisis.alertas || [];
      ficha.notasImportantes = analisis.notasImportantes || [];
      ficha.ultimoAnalisis = new Date().toISOString();
      ficha.actualizadoEn = new Date().toISOString();

      await kv.set(`ficha:${email}`, ficha);

      return analisis;
    }
  } catch (error) {
    console.error('Error analizando cliente:', error);
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// ACTUALIZAR FICHA DESPUÉS DE EVENTOS
// ═══════════════════════════════════════════════════════════════

export async function actualizarFichaPostCompra(email, orden) {
  let ficha = await obtenerFichaCliente(email);
  if (!ficha) ficha = await crearFichaDesdeElegido(email);
  if (!ficha) return;

  ficha.ultimaCompra = new Date().toISOString();
  ficha.ordenes = [...(ficha.ordenes || []), orden.id];
  ficha.totalCompras = (ficha.totalCompras || 0) + parseFloat(orden.total || 0);
  ficha.actualizadoEn = new Date().toISOString();

  // Agregar guardianes si los hay
  if (orden.guardianes) {
    ficha.guardianes = [...(ficha.guardianes || []), ...orden.guardianes];
    ficha.cantidadGuardianes = ficha.guardianes.length;
  }

  await kv.set(`ficha:${email}`, ficha);
}

export async function actualizarFichaPostLectura(email, lectura) {
  let ficha = await obtenerFichaCliente(email);
  if (!ficha) return;

  ficha.lecturasRealizadas = (ficha.lecturasRealizadas || 0) + 1;
  ficha.lecturasRecientes = [
    { id: lectura.id, tipo: lectura.nombre, fecha: lectura.fecha },
    ...(ficha.lecturasRecientes || []).slice(0, 9)
  ];
  ficha.actualizadoEn = new Date().toISOString();

  await kv.set(`ficha:${email}`, ficha);
}

export async function actualizarFichaPostChat(email, mensaje, respuesta) {
  let ficha = await obtenerFichaCliente(email);
  if (!ficha) return;

  ficha.conversacionesChat = (ficha.conversacionesChat || 0) + 1;
  ficha.ultimoChat = {
    fecha: new Date().toISOString(),
    mensaje: mensaje?.slice(0, 200),
    respuesta: respuesta?.slice(0, 200)
  };
  ficha.actualizadoEn = new Date().toISOString();

  // Guardar conversación en historial
  const historialChat = await kv.get(`chat:${email}`) || [];
  historialChat.unshift({
    fecha: new Date().toISOString(),
    mensaje,
    respuesta
  });
  await kv.set(`chat:${email}`, historialChat.slice(0, 100));

  await kv.set(`ficha:${email}`, ficha);
}

// ═══════════════════════════════════════════════════════════════
// OBTENER ALERTAS DE TODOS LOS CLIENTES
// ═══════════════════════════════════════════════════════════════

export async function obtenerAlertasGlobales() {
  const alertas = [];

  // Obtener todos los emails de elegidos
  const keys = await kv.keys('ficha:*');

  for (const key of keys) {
    const ficha = await kv.get(key);
    if (!ficha) continue;

    // Verificar cumpleaños próximo
    if (ficha.proximoCumple?.esCumplePronto) {
      alertas.push({
        tipo: 'cumpleaños',
        email: ficha.email,
        nombre: ficha.nombre,
        mensaje: ficha.proximoCumple.esCumpleHoy
          ? `¡Hoy es el cumpleaños de ${ficha.nombre}!`
          : `Cumpleaños de ${ficha.nombre} en ${ficha.proximoCumple.diasFaltan} días`,
        prioridad: ficha.proximoCumple.esCumpleHoy ? 'alta' : 'media',
        fecha: ficha.proximoCumple.fecha
      });
    }

    // Verificar inactividad (más de 30 días sin actividad)
    if (ficha.ultimaCompra || ficha.lecturasRecientes?.[0]) {
      const ultimaActividad = new Date(
        ficha.lecturasRecientes?.[0]?.fecha || ficha.ultimaCompra
      );
      const diasInactivo = Math.floor((new Date() - ultimaActividad) / (1000 * 60 * 60 * 24));

      if (diasInactivo > 30) {
        alertas.push({
          tipo: 'inactividad',
          email: ficha.email,
          nombre: ficha.nombre,
          mensaje: `${ficha.nombre} lleva ${diasInactivo} días sin actividad`,
          prioridad: diasInactivo > 60 ? 'alta' : 'media',
          diasInactivo
        });
      }
    }

    // Agregar alertas del análisis
    if (ficha.alertas) {
      for (const alerta of ficha.alertas) {
        alertas.push({
          ...alerta,
          email: ficha.email,
          nombre: ficha.nombre
        });
      }
    }
  }

  // Ordenar por prioridad
  const prioridadOrden = { alta: 0, media: 1, baja: 2 };
  alertas.sort((a, b) => prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad]);

  return alertas;
}

// ═══════════════════════════════════════════════════════════════
// OBTENER MEMORIA COMPLETA PARA LECTURAS
// ═══════════════════════════════════════════════════════════════

export async function obtenerMemoriaCompleta(email) {
  const ficha = await obtenerFichaCliente(email);
  if (!ficha) return null;

  // Obtener lecturas completas
  const lecturasCompletas = [];
  for (const lecResumen of ficha.lecturasRecientes || []) {
    const lecCompleta = await kv.get(`lectura:${lecResumen.id}`);
    if (lecCompleta?.resultado) {
      lecturasCompletas.push({
        tipo: lecCompleta.lecturaNombre,
        fecha: new Date(lecCompleta.fechaSolicitud).toLocaleDateString('es-UY'),
        pregunta: lecCompleta.pregunta,
        contexto: lecCompleta.contexto,
        resumen: lecCompleta.resultado.contenido?.slice(0, 800)
      });
    }
  }

  // Construir memoria para el prompt
  let memoria = `
═══════════════════════════════════════════════════════════════
FICHA DE ${(ficha.nombreCompleto || ficha.nombre || 'CLIENTE').toUpperCase()}
═══════════════════════════════════════════════════════════════

DATOS PERSONALES:
- Nombre: ${ficha.nombreCompleto || ficha.nombre || 'No especificado'}
- Signo: ${ficha.signoZodiacal || 'No especificado'} ${ficha.signoEmoji || ''} (${ficha.elementoZodiacal || ''})
- Elemento de afinidad: ${ficha.elementoAfinidad || 'No especificado'}
- Pronombre: ${ficha.pronombre || 'ella'}

GUARDIANES/DUENDES QUE TIENE:
${ficha.guardianes?.length > 0
  ? ficha.guardianes.map(g => `- ${g.nombre || g} (${g.categoria || 'guardián'})`).join('\n')
  : '- Aún no tiene guardianes adoptados'}

MEMBRESÍA:
- ${ficha.esCirculo ? `Miembro del Círculo (${ficha.tipoMembresia})` : 'No es miembro del Círculo'}

NIVEL Y ACTIVIDAD:
- Nivel: ${ficha.nivel}
- XP: ${ficha.xp}
- Racha máxima: ${ficha.rachaMax} días
- Lecturas realizadas: ${ficha.lecturasRealizadas}
- Total compras: $${ficha.totalCompras}

`;

  // Agregar perfil psicológico si existe
  if (ficha.perfilPsicologico) {
    memoria += `
PERFIL PSICOLÓGICO:
- Personalidad: ${ficha.perfilPsicologico.personalidad}
- Fortalezas: ${ficha.perfilPsicologico.fortalezas?.join(', ')}
- Desafíos: ${ficha.perfilPsicologico.desafios?.join(', ')}
- Necesidades: ${ficha.perfilPsicologico.necesidadesEmocionales?.join(', ')}

`;
  }

  // Agregar notas importantes
  if (ficha.notasImportantes?.length > 0) {
    memoria += `
NOTAS IMPORTANTES:
${ficha.notasImportantes.map(n => `- ${n}`).join('\n')}

`;
  }

  // Agregar resumen de canalizaciones
  if (ficha.canalizaciones?.length > 0) {
    memoria += `
CANALIZACIONES DE SUS GUARDIANES:
${ficha.canalizaciones.map(c => `
[${c.guardian?.nombre || 'Guardián'}]
${c.mensaje?.slice(0, 400)}...
`).join('\n')}
`;
  }

  // Agregar lecturas anteriores
  if (lecturasCompletas.length > 0) {
    memoria += `
LECTURAS ANTERIORES:
${lecturasCompletas.map((l, i) => `
[${i + 1}. ${l.tipo} - ${l.fecha}]
${l.pregunta ? `Pregunta: ${l.pregunta}` : ''}
${l.contexto ? `Contexto: ${l.contexto}` : ''}
Resumen: ${l.resumen}...
`).join('\n')}
`;
  }

  memoria += `
═══════════════════════════════════════════════════════════════

INSTRUCCIONES PARA ESTA LECTURA:
- USA toda esta información para personalizar la lectura
- NO menciones "según tu ficha" ni "como dijimos antes" - simplemente SABÉ estas cosas
- Reconocé su camino sin ser explícito sobre cómo lo sabés
- Las lecturas deben sentirse como una conversación continua
- NO repitas consejos que ya se dieron en lecturas anteriores
`;

  return {
    ficha,
    memoriaTexto: memoria,
    lecturasAnteriores: lecturasCompletas.length
  };
}
