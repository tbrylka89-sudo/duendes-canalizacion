import { kv } from '@vercel/kv';

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

    // Guardar en solicitudes pendientes
    if (!elegido.solicitudesPendientes) {
      elegido.solicitudesPendientes = [];
    }
    elegido.solicitudesPendientes.unshift(solicitud);

    elegido.updatedAt = new Date().toISOString();
    await kv.set(elegidoKey, elegido);

    return res.status(200).json({
      success: true,
      solicitud,
      runasRestantes: elegido.runas,
      mensaje: `Tu ${experiencia.nombre} está siendo preparada. Recibirás una notificación cuando esté lista.`
    });

  } catch (error) {
    console.error('Error en solicitud de experiencia:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
