import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, experienciaId, datos } = req.body;

    if (!token || !experienciaId) {
      return res.status(400).json({ error: 'Token y experienciaId requeridos' });
    }

    // CORREGIDO: Primero buscar el email del token
    const email = await kv.get(`token:${token}`);
    
    if (!email) {
      return res.status(404).json({ error: 'Token inválido' });
    }

    const elegidoKey = `elegido:${email}`;
    const elegido = await kv.get(elegidoKey);

    if (!elegido) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Definir experiencias y costos (actualizados para coincidir con catálogo completo)
    const EXPERIENCIAS = {
      // Mensajes Canalizados
      'susurro_guardian': { runas: 20, nombre: 'Susurro de tu Guardián', entrega: '15min' },
      'mensaje_universo': { runas: 25, nombre: 'Lo que el Universo Quiere Decirte', entrega: '25min' },
      'carta_ancestros': { runas: 45, nombre: 'Carta de tus Ancestros', entrega: '45min' },
      // Guardianes
      'estado_guardian': { runas: 20, nombre: 'Estado Energético de tu Guardián', entrega: '20min' },
      'mision_guardian': { runas: 45, nombre: 'La Misión de tu Guardián', entrega: '50min' },
      'comunicacion_guardian': { runas: 30, nombre: 'Guía de Comunicación con tu Guardián', entrega: '35min' },
      'historia_guardian': { runas: 55, nombre: 'La Historia de tu Guardián', entrega: '60min' },
      // Elementales
      'elemento_dominante': { runas: 25, nombre: 'Tu Elemento Dominante Oculto', entrega: '25min' },
      'sanacion_elemental': { runas: 50, nombre: 'Sanación con los 4 Elementos', entrega: '45min' },
      'elemental_personal': { runas: 35, nombre: 'Tu Elemental Personal', entrega: '35min' },
      // Cristales
      'cristal_alma': { runas: 30, nombre: 'El Cristal de tu Alma', entrega: '30min' },
      'grid_cristales': { runas: 40, nombre: 'Tu Grid de Cristales', entrega: '40min' },
      'limpieza_cristales': { runas: 20, nombre: 'Protocolo de Limpieza de tus Cristales', entrega: '20min' },
      // Tarot
      'tarot_profundo': { runas: 50, nombre: 'Lectura de Tarot Profunda', entrega: '35min' },
      'oraculo_duendes': { runas: 25, nombre: 'Oráculo de los Duendes', entrega: '25min' },
      'carta_año': { runas: 40, nombre: 'Tu Carta del Año', entrega: '30min' },
      // Runas
      'tirada_runas_3': { runas: 25, nombre: 'Tirada de 3 Runas', entrega: '20min' },
      'tirada_runas_9': { runas: 65, nombre: 'Tirada de las 9 Runas', entrega: '45min' },
      'runa_personal': { runas: 30, nombre: 'Tu Runa de Nacimiento', entrega: '30min' },
      // Astrología
      'luna_personal': { runas: 40, nombre: 'Tu Luna Personal', entrega: '35min' },
      'ciclo_lunar_mes': { runas: 45, nombre: 'Tu Mes Lunar', entrega: '40min' },
      // Energía
      'lectura_aura': { runas: 40, nombre: 'Lectura de Aura', entrega: '35min' },
      'corte_cordones': { runas: 55, nombre: 'Análisis de Cordones Energéticos', entrega: '45min' },
      'chakras_estado': { runas: 50, nombre: 'Estado de tus Chakras', entrega: '40min' },
      // Alma
      'mision_alma': { runas: 200, nombre: 'La Misión de tu Alma', entrega: '60min' },
      'contratos_alma': { runas: 180, nombre: 'Contratos del Alma', entrega: '75min' },
      'vidas_pasadas': { runas: 300, nombre: 'Ecos de Vidas Pasadas', entrega: '90min' },
      // Protección
      'escudo_protector': { runas: 40, nombre: 'Tu Escudo Protector', entrega: '35min' },
      'limpieza_casa': { runas: 45, nombre: 'Limpieza Energética del Hogar', entrega: '40min' },
      'deteccion_influencias': { runas: 55, nombre: 'Detección de Influencias Negativas', entrega: '50min' },
      // Amor
      'lectura_amor_actual': { runas: 45, nombre: 'Tu Situación Amorosa Actual', entrega: '40min' },
      'compatibilidad_pareja': { runas: 55, nombre: 'Compatibilidad de Pareja', entrega: '50min' },
      'sanar_corazon_roto': { runas: 60, nombre: 'Sanar un Corazón Roto', entrega: '55min' },
      'atraer_amor': { runas: 50, nombre: 'Ritual para Atraer el Amor', entrega: '45min' },
      // Numerología
      'perfil_numerologico': { runas: 70, nombre: 'Tu Perfil Numerológico Completo', entrega: '55min' },
      'año_personal_num': { runas: 35, nombre: 'Tu Año Personal Numerológico', entrega: '30min' },
      'numerologia_nombre': { runas: 40, nombre: 'Análisis de tu Nombre', entrega: '35min' },
      // Sueños
      'interpretar_sueno': { runas: 30, nombre: 'Interpretación de un Sueño', entrega: '25min' },
      'diario_onirico': { runas: 55, nombre: 'Análisis de Sueños Recurrentes', entrega: '45min' },
      'suenos_profeticos': { runas: 45, nombre: '¿Tus Sueños son Proféticos?', entrega: '40min' },
      // Abundancia
      'bloqueos_abundancia': { runas: 55, nombre: 'Bloqueos de Abundancia', entrega: '50min' },
      'ritual_abundancia': { runas: 45, nombre: 'Ritual de Activación de Abundancia', entrega: '40min' },
      'lectura_prosperidad': { runas: 65, nombre: 'Tu Camino de Prosperidad', entrega: '55min' },
      // Akáshicos
      'lectura_akashicos': { runas: 250, nombre: 'Lectura de Registros Akáshicos', entrega: '90min' },
      'origen_alma': { runas: 180, nombre: 'Tu Origen de Alma', entrega: '75min' },
      'limpieza_akashica': { runas: 150, nombre: 'Limpieza de Registros Akáshicos', entrega: '65min' },
      // Sanación
      'nino_interior': { runas: 80, nombre: 'Sanación del Niño Interior', entrega: '60min' },
      'sombra_personal': { runas: 90, nombre: 'Trabajo con tu Sombra', entrega: '70min' },
      'sanacion_linaje': { runas: 100, nombre: 'Sanación del Linaje', entrega: '75min' },
      'perdon_profundo': { runas: 70, nombre: 'Proceso de Perdón Profundo', entrega: '55min' },
      // Legacy IDs (para compatibilidad con solicitudes antiguas)
      'tirada-runas': { runas: 25, nombre: 'Tirada de Runas', entrega: '20min' },
      'susurro': { runas: 20, nombre: 'Susurro del Guardián', entrega: '15min' },
      'oraculo': { runas: 25, nombre: 'El Oráculo', entrega: '25min' },
      'lectura-alma': { runas: 200, nombre: 'Lectura del Alma', entrega: '60min' },
      'espejo-sombra': { runas: 90, nombre: 'Espejo de Sombra', entrega: '70min' },
      'constelacion': { runas: 50, nombre: 'Constelación Elemental', entrega: '45min' },
      'mapa-proposito': { runas: 200, nombre: 'Mapa del Propósito', entrega: '60min' },
      'ritual-ancestros': { runas: 45, nombre: 'Ritual de los Ancestros', entrega: '45min' },
      'rueda-solar': { runas: 45, nombre: 'Rueda del Año Solar', entrega: '40min' },
    };

    const experiencia = EXPERIENCIAS[experienciaId];
    
    if (!experiencia) {
      return res.status(400).json({ error: 'Experiencia no válida' });
    }

    // Verificar runas suficientes
    const runasUsuario = elegido.runas || 0;
    
    if (runasUsuario < experiencia.runas) {
      return res.status(400).json({ 
        error: 'Runas insuficientes',
        runas: runasUsuario,
        requeridas: experiencia.runas
      });
    }

    // Descontar runas
    elegido.runas = runasUsuario - experiencia.runas;

    // Crear solicitud de experiencia
    const solicitud = {
      id: `exp-${Date.now()}`,
      tipo: experienciaId,
      nombre: experiencia.nombre,
      estado: 'pendiente',
      entregaEstimada: experiencia.entrega,
      datos: datos || {},
      fechaSolicitud: new Date().toISOString(),
      runasUsadas: experiencia.runas
    };

    // Guardar en solicitudes pendientes (por compatibilidad)
    if (!elegido.solicitudesPendientes) {
      elegido.solicitudesPendientes = [];
    }
    elegido.solicitudesPendientes.unshift(solicitud);

    elegido.updatedAt = new Date().toISOString();
    await kv.set(elegidoKey, elegido);

    // ═══════════════════════════════════════════════════════════════
    // GENERAR CONTENIDO CON IA INMEDIATAMENTE
    // ═══════════════════════════════════════════════════════════════
    let contenidoGenerado = null;
    try {
      contenidoGenerado = await generarContenidoExperiencia({
        tipo: experienciaId,
        nombre: experiencia.nombre,
        nombreUsuario: elegido.nombre || elegido.nombrePreferido || 'Alma luminosa',
        pronombre: elegido.pronombre || 'ella',
        datos: datos || {}
      });

      solicitud.estado = 'completado';
      solicitud.contenido = contenidoGenerado;
      solicitud.fechaCompletado = new Date().toISOString();

      // Actualizar la solicitud pendiente con el contenido
      elegido.solicitudesPendientes[0] = solicitud;
      await kv.set(elegidoKey, elegido);
    } catch (iaError) {
      console.error('Error generando con IA:', iaError);
      // Si falla la IA, la solicitud queda pendiente
    }

    // ═══════════════════════════════════════════════════════════════
    // GUARDAR EN HISTORIAL (para que aparezca en "Mis Lecturas")
    // ═══════════════════════════════════════════════════════════════
    const historial = await kv.get(`historial:${email}`) || [];
    historial.unshift({
      id: solicitud.id,
      lecturaId: experienciaId,
      nombre: experiencia.nombre,
      icono: obtenerIconoExperiencia(experienciaId),
      categoria: obtenerCategoriaExperiencia(experienciaId),
      runas: experiencia.runas,
      fecha: new Date().toISOString(),
      estado: solicitud.estado,
      contenido: contenidoGenerado
    });
    // Mantener solo las últimas 100
    await kv.set(`historial:${email}`, historial.slice(0, 100));

    // También guardar en lecturas:${email} por compatibilidad
    const lecturas = await kv.get(`lecturas:${email}`) || [];
    lecturas.unshift({
      id: solicitud.id,
      lecturaId: experienciaId,
      nombre: experiencia.nombre,
      categoria: obtenerCategoriaExperiencia(experienciaId),
      runas: experiencia.runas,
      fecha: new Date().toISOString(),
      estado: solicitud.estado
    });
    await kv.set(`lecturas:${email}`, lecturas.slice(0, 100));

    // Guardar lectura individual para poder recuperarla al hacer click
    // (compatible con formato de ejecutar-lectura y con el modal del historial)
    await kv.set(`lectura:${solicitud.id}`, {
      id: solicitud.id,
      lecturaId: experienciaId,
      lecturaNombre: experiencia.nombre,
      nombre: experiencia.nombre, // Para el modal del historial
      email: email,
      nombreUsuario: elegido.nombre || elegido.nombrePreferido || 'Alma luminosa',
      icono: obtenerIconoExperiencia(experienciaId),
      categoria: obtenerCategoriaExperiencia(experienciaId),
      runasGastadas: experiencia.runas,
      runas: experiencia.runas,
      fecha: solicitud.fechaSolicitud,
      fechaSolicitud: solicitud.fechaSolicitud,
      estado: solicitud.estado,
      contenido: contenidoGenerado, // Para el modal del historial
      resultado: contenidoGenerado ? {
        titulo: experiencia.nombre,
        contenido: contenidoGenerado,
        fechaGeneracion: new Date().toISOString()
      } : null
    });

    return res.status(200).json({
      success: true,
      solicitud,
      runasRestantes: elegido.runas,
      contenido: contenidoGenerado,
      mensaje: contenidoGenerado
        ? `Tu ${experiencia.nombre} está lista.`
        : `Tu ${experiencia.nombre} está siendo preparada. Recibirás una notificación cuando esté lista.`
    });

  } catch (error) {
    console.error('Error en solicitud de experiencia:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Generar contenido con IA
// ═══════════════════════════════════════════════════════════════
async function generarContenidoExperiencia({ tipo, nombre, nombreUsuario, pronombre, datos }) {
  const prompts = {
    'susurro_guardian': {
      system: `Sos un guardián mágico del Bosque de Duendes del Uruguay que tiene un mensaje personal para ${nombreUsuario}. Escribís en primera persona como el guardián. Español rioplatense (vos, tenés). Tono protector, amoroso.`,
      user: `Generá un susurro del guardián para ${nombreUsuario}. ${datos.pregunta ? `Pregunta: ${datos.pregunta}` : 'Mensaje general de guía.'}. Máximo 500 palabras. Empezá con impacto emocional.`
    },
    'mensaje_universo': {
      system: `Sos el Universo hablando directamente a ${nombreUsuario}. Tu voz es cósmica pero cercana. Español rioplatense.`,
      user: `Canalizá un mensaje del Universo para ${nombreUsuario}. ${datos.contexto ? `Contexto: ${datos.contexto}` : ''}. 600 palabras máximo.`
    },
    'carta_ancestros': {
      system: `Sos la voz colectiva de los ancestros de ${nombreUsuario}. Transmitís sabiduría de generaciones. Español rioplatense. Tono sabio y amoroso.`,
      user: `Escribí una carta de los ancestros para ${nombreUsuario}. ${datos.pregunta ? `Tema: ${datos.pregunta}` : 'Mensaje de guía y protección.'}. 800 palabras.`
    },
    'estado_guardian': {
      system: `Sos un canalizador que percibe la energía de los guardianes. Español rioplatense.`,
      user: `Describí el estado energético del guardián de ${nombreUsuario}. Cómo se siente, qué necesita, qué mensaje tiene. 500 palabras.`
    },
    'tirada_runas_3': {
      system: `Sos una maestra runista del Bosque de Duendes. Canalizás la sabiduría de las runas nórdicas. Español rioplatense.`,
      user: `Tirada de 3 runas para ${nombreUsuario}. ${datos.pregunta ? `Pregunta: ${datos.pregunta}` : 'Guía general.'}. Incluí nombre de cada runa, significado y consejo. 800 palabras.`
    },
    'tirada-runas': {
      system: `Sos una maestra runista. Canalizás la sabiduría de las runas nórdicas. Español rioplatense.`,
      user: `Tirada de runas para ${nombreUsuario}. ${datos.pregunta ? `Pregunta: ${datos.pregunta}` : 'Guía general.'}. 800 palabras.`
    },
    'lectura_aura': {
      system: `Sos una lectora de auras del Bosque de Duendes. Percibís los campos energéticos con claridad. Español rioplatense.`,
      user: `Lectura de aura para ${nombreUsuario}. ${datos.contexto ? `Contexto: ${datos.contexto}` : ''}. Describí colores, estado energético, consejos. 1000 palabras.`
    },
    'mision_alma': {
      system: `Sos una guía espiritual especializada en misión de alma. Español rioplatense. Profundo pero esperanzador.`,
      user: `Revelá la misión del alma de ${nombreUsuario}. ${datos.fechaNacimiento ? `Nacimiento: ${datos.fechaNacimiento}` : ''}. Incluí propósito, dones, desafíos, guía práctica. 2000 palabras.`
    }
  };

  // Prompt genérico si no hay específico
  const defaultPrompt = {
    system: `Sos una canalizadora de energía del Bosque de Duendes del Uruguay. Escribís en español rioplatense (vos, tenés). Tu tono es cálido, profundo y empoderador. Pronombre del usuario: ${pronombre}.`,
    user: `Generá "${nombre}" para ${nombreUsuario}. ${datos.pregunta ? `Pregunta: ${datos.pregunta}` : ''} ${datos.contexto ? `Contexto: ${datos.contexto}` : ''} ${datos.fechaNacimiento ? `Fecha nacimiento: ${datos.fechaNacimiento}` : ''}. Mínimo 600 palabras. Que sea profundo, personal y memorable.`
  };

  const prompt = prompts[tipo] || defaultPrompt;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: prompt.system,
    messages: [{ role: 'user', content: prompt.user }]
  });

  return response.content[0]?.text || '';
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Obtener icono de experiencia
// ═══════════════════════════════════════════════════════════════
function obtenerIconoExperiencia(tipo) {
  const iconos = {
    'susurro_guardian': '👂',
    'mensaje_universo': '🌌',
    'carta_ancestros': '📜',
    'estado_guardian': '✨',
    'mision_guardian': '🎯',
    'comunicacion_guardian': '💬',
    'historia_guardian': '📖',
    'elemento_dominante': '🌍',
    'sanacion_elemental': '💚',
    'elemental_personal': '🌀',
    'cristal_alma': '💎',
    'grid_cristales': '💠',
    'limpieza_cristales': '🧹',
    'tarot_profundo': '🎴',
    'oraculo_duendes': '🔮',
    'carta_año': '📅',
    'tirada_runas_3': 'ᚱ',
    'tirada_runas_9': 'ᚱᛏ',
    'tirada-runas': 'ᚱ',
    'runa_personal': 'ᚠ',
    'luna_personal': '🌙',
    'ciclo_lunar_mes': '🌕',
    'lectura_aura': '🌈',
    'corte_cordones': '✂️',
    'chakras_estado': '🔴',
    'mision_alma': '🎯',
    'contratos_alma': '📝',
    'vidas_pasadas': '🔄',
    'escudo_protector': '🛡️',
    'limpieza_casa': '🏠',
    'deteccion_influencias': '👁️',
    'lectura_amor_actual': '💕',
    'compatibilidad_pareja': '💑',
    'sanar_corazon_roto': '💔',
    'atraer_amor': '💘',
    'perfil_numerologico': '🔢',
    'año_personal_num': '📊',
    'numerologia_nombre': '#️⃣',
    'interpretar_sueno': '💭',
    'diario_onirico': '🌙',
    'suenos_profeticos': '🔮',
    'bloqueos_abundancia': '🚧',
    'ritual_abundancia': '💰',
    'lectura_prosperidad': '🌟',
    'lectura_akashicos': '📜',
    'origen_alma': '⭐',
    'limpieza_akashica': '✨',
    'nino_interior': '👶',
    'sombra_personal': '🌑',
    'sanacion_linaje': '🌳',
    'perdon_profundo': '🕊️'
  };
  return iconos[tipo] || '✨';
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Obtener categoría de experiencia
// ═══════════════════════════════════════════════════════════════
function obtenerCategoriaExperiencia(tipo) {
  const categorias = {
    'susurro_guardian': 'mensajes',
    'mensaje_universo': 'mensajes',
    'carta_ancestros': 'mensajes',
    'estado_guardian': 'guardianes',
    'mision_guardian': 'guardianes',
    'comunicacion_guardian': 'guardianes',
    'historia_guardian': 'guardianes',
    'elemento_dominante': 'elementales',
    'sanacion_elemental': 'elementales',
    'elemental_personal': 'elementales',
    'cristal_alma': 'cristales',
    'grid_cristales': 'cristales',
    'limpieza_cristales': 'cristales',
    'tarot_profundo': 'tiradas',
    'oraculo_duendes': 'tiradas',
    'carta_año': 'tiradas',
    'tirada_runas_3': 'tiradas',
    'tirada_runas_9': 'tiradas',
    'tirada-runas': 'tiradas',
    'runa_personal': 'tiradas',
    'luna_personal': 'astrologia',
    'ciclo_lunar_mes': 'astrologia',
    'lectura_aura': 'energia',
    'corte_cordones': 'energia',
    'chakras_estado': 'energia',
    'mision_alma': 'estudios',
    'contratos_alma': 'estudios',
    'vidas_pasadas': 'estudios',
    'escudo_protector': 'proteccion',
    'limpieza_casa': 'proteccion',
    'deteccion_influencias': 'proteccion',
    'lectura_amor_actual': 'amor',
    'compatibilidad_pareja': 'amor',
    'sanar_corazon_roto': 'amor',
    'atraer_amor': 'amor',
    'perfil_numerologico': 'numerologia',
    'año_personal_num': 'numerologia',
    'numerologia_nombre': 'numerologia',
    'interpretar_sueno': 'suenos',
    'diario_onirico': 'suenos',
    'suenos_profeticos': 'suenos',
    'bloqueos_abundancia': 'abundancia',
    'ritual_abundancia': 'abundancia',
    'lectura_prosperidad': 'abundancia',
    'lectura_akashicos': 'akashicos',
    'origen_alma': 'akashicos',
    'limpieza_akashica': 'akashicos',
    'nino_interior': 'sanacion',
    'sombra_personal': 'sanacion',
    'sanacion_linaje': 'sanacion',
    'perdon_profundo': 'sanacion'
  };
  return categorias[tipo] || 'otros';
}
