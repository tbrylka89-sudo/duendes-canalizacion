import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE EXPERIENCIAS
// ═══════════════════════════════════════════════════════════════

const EXPERIENCIAS = {
  'tirada-runas': {
    nombre: 'Tirada de Runas',
    runas: 5,
    tiempoMinMs: 20 * 60 * 1000,  // 20 minutos
    tiempoMaxMs: 30 * 60 * 1000,  // 30 minutos
    palabrasMinimas: 800
  },
  'susurro-guardian': {
    nombre: 'Susurro del Guardián',
    runas: 10,
    tiempoMinMs: 40 * 60 * 1000,  // 40 minutos
    tiempoMaxMs: 60 * 60 * 1000,  // 60 minutos
    palabrasMinimas: 500
  },
  'oraculo': {
    nombre: 'El Oráculo',
    runas: 20,
    tiempoMinMs: 2 * 60 * 60 * 1000,  // 2 horas
    tiempoMaxMs: 3 * 60 * 60 * 1000,  // 3 horas
    palabrasMinimas: 1200
  },
  'lectura-alma': {
    nombre: 'Lectura del Alma',
    runas: 25,
    tiempoMinMs: 4 * 60 * 60 * 1000,  // 4 horas
    tiempoMaxMs: 6 * 60 * 60 * 1000,  // 6 horas
    palabrasMinimas: 2000
  }
};

// ═══════════════════════════════════════════════════════════════
// SOLICITAR EXPERIENCIA
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { email, tipo, formulario, runasRequeridas } = await request.json();
    
    if (!email || !tipo) {
      return Response.json({ 
        success: false, 
        error: 'Email y tipo requeridos' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    const experiencia = EXPERIENCIAS[tipo];
    if (!experiencia) {
      return Response.json({ 
        success: false, 
        error: 'Tipo de experiencia no válido' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    const emailLower = email.toLowerCase();
    
    // Verificar runas del usuario
    const elegido = await kv.get(`elegido:${emailLower}`);
    if (!elegido || (elegido.runas || 0) < experiencia.runas) {
      return Response.json({ 
        success: false, 
        error: 'Runas de Poder insuficientes' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    // Descontar runas
    elegido.runas = (elegido.runas || 0) - experiencia.runas;
    await kv.set(`elegido:${emailLower}`, elegido);
    
    // Calcular tiempo de entrega aleatorio
    const tiempoAleatorio = experiencia.tiempoMinMs + 
      Math.random() * (experiencia.tiempoMaxMs - experiencia.tiempoMinMs);
    
    // Verificar si es horario nocturno (22:00 - 06:00 Uruguay)
    const ahora = new Date();
    const horaUruguay = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Montevideo' }));
    const hora = horaUruguay.getHours();
    
    let fechaEntrega = new Date(Date.now() + tiempoAleatorio);
    
    // Si la entrega cae en horario nocturno, programar para 06:30
    const horaEntregaUruguay = new Date(fechaEntrega.toLocaleString('en-US', { timeZone: 'America/Montevideo' }));
    const horaEntrega = horaEntregaUruguay.getHours();
    
    if (horaEntrega >= 22 || horaEntrega < 6) {
      // Mover a las 06:30 del día siguiente
      fechaEntrega = new Date(horaEntregaUruguay);
      if (horaEntrega >= 22) {
        fechaEntrega.setDate(fechaEntrega.getDate() + 1);
      }
      fechaEntrega.setHours(6, 30, 0, 0);
    }
    
    // Crear solicitud pendiente
    const solicitudId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const solicitud = {
      id: solicitudId,
      tipo,
      nombre: experiencia.nombre,
      email: emailLower,
      formulario,
      runasUsadas: experiencia.runas,
      palabrasMinimas: experiencia.palabrasMinimas,
      creada: new Date().toISOString(),
      fechaEntrega: fechaEntrega.toISOString(),
      estado: 'pendiente',
      pronombre: elegido.pronombre || 'ella',
      nombreUsuario: elegido.nombrePreferido || elegido.nombre
    };
    
    // Guardar solicitud
    await kv.set(`solicitud:${solicitudId}`, solicitud);
    
    // Agregar a cola de lecturas pendientes
    const pendientes = await kv.get(`lecturas-pendientes:${emailLower}`) || [];
    pendientes.push({
      id: solicitudId,
      tipo,
      nombre: experiencia.nombre,
      fechaEntrega: fechaEntrega.toISOString(),
      estado: 'pendiente'
    });
    await kv.set(`lecturas-pendientes:${emailLower}`, pendientes);
    
    // Programar generación (en producción esto sería un cron job o queue)
    // Por ahora dejamos la solicitud para procesamiento manual o cron
    
    // Agregar a cola global de procesamiento
    const colaProcesamiento = await kv.get('cola:experiencias') || [];
    colaProcesamiento.push(solicitudId);
    await kv.set('cola:experiencias', colaProcesamiento);
    
    return Response.json({ 
      success: true, 
      solicitudId,
      fechaEntrega: fechaEntrega.toISOString(),
      mensaje: `Tu ${experiencia.nombre} está siendo preparada. Te avisaremos cuando esté lista.`
    }, { headers: CORS_HEADERS });
    
  } catch (error) {
    console.error('Error solicitando experiencia:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500, headers: CORS_HEADERS });
  }
}
