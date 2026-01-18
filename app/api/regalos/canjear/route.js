import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// API: CANJEAR REGALO DE LECTURA
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { codigo, emailDestinatario } = await request.json();

    if (!codigo || !emailDestinatario) {
      return Response.json({
        success: false,
        error: 'Código y email requeridos'
      }, { status: 400 });
    }

    // Buscar el regalo
    const regalo = await kv.get(`regalo:${codigo}`);

    if (!regalo) {
      return Response.json({
        success: false,
        error: 'Código de regalo no válido'
      }, { status: 404 });
    }

    // Verificar estado
    if (regalo.estado === 'canjeado') {
      return Response.json({
        success: false,
        error: 'Este regalo ya fue canjeado'
      }, { status: 400 });
    }

    if (regalo.estado === 'expirado' || new Date(regalo.expiraEn) < new Date()) {
      // Marcar como expirado si no lo estaba
      regalo.estado = 'expirado';
      await kv.set(`regalo:${codigo}`, regalo);

      return Response.json({
        success: false,
        error: 'Este regalo ha expirado'
      }, { status: 400 });
    }

    // Verificar que el email coincide (opcional, podría ser más flexible)
    const emailDestNorm = emailDestinatario.toLowerCase();
    if (regalo.destinatario.email !== emailDestNorm) {
      // Permitir canjear igual pero con advertencia
      console.log(`Regalo ${codigo} canjeado por ${emailDestNorm} (originalmente para ${regalo.destinatario.email})`);
    }

    // Marcar como canjeado
    regalo.estado = 'canjeado';
    regalo.canjeadoPor = emailDestNorm;
    regalo.canjeadoEn = new Date().toISOString();
    await kv.set(`regalo:${codigo}`, regalo);

    // Crear la solicitud de lectura para el destinatario
    const solicitudLectura = {
      id: `lectura-regalo-${codigo}`,
      tipo: 'regalo',
      lecturaId: regalo.lecturaId,
      lecturaNombre: regalo.lecturaNombre,
      codigoRegalo: codigo,
      remitente: regalo.remitente,
      mensaje: regalo.mensaje,
      estado: 'pendiente', // pendiente de que el destinatario complete sus datos
      creadoEn: new Date().toISOString()
    };

    // Guardar lectura pendiente para el destinatario
    const lecturasPendientes = await kv.get(`lecturas-pendientes:${emailDestNorm}`) || [];
    lecturasPendientes.push(solicitudLectura);
    await kv.set(`lecturas-pendientes:${emailDestNorm}`, lecturasPendientes);

    // Actualizar listas
    // Actualizar regalo en lista del remitente
    const regalosEnviados = await kv.get(`regalos-enviados:${regalo.remitente.email}`) || [];
    const idxEnviado = regalosEnviados.findIndex(r => r.codigo === codigo);
    if (idxEnviado !== -1) {
      regalosEnviados[idxEnviado].estado = 'canjeado';
      await kv.set(`regalos-enviados:${regalo.remitente.email}`, regalosEnviados);
    }

    // Remover de pendientes del destinatario
    const regalosPendientes = await kv.get(`regalos-pendientes:${emailDestNorm}`) || [];
    const filtrados = regalosPendientes.filter(r => r.codigo !== codigo);
    await kv.set(`regalos-pendientes:${emailDestNorm}`, filtrados);

    return Response.json({
      success: true,
      mensaje: '¡Regalo canjeado! Completá tus datos para recibir la lectura.',
      lectura: {
        id: regalo.lecturaId,
        nombre: regalo.lecturaNombre,
        remitente: regalo.remitente.nombre,
        mensaje: regalo.mensaje
      }
    });

  } catch (error) {
    console.error('Error canjeando regalo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Verificar estado de un regalo
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get('codigo');

    if (!codigo) {
      return Response.json({
        success: false,
        error: 'Código requerido'
      }, { status: 400 });
    }

    const regalo = await kv.get(`regalo:${codigo}`);

    if (!regalo) {
      return Response.json({
        success: false,
        error: 'Regalo no encontrado'
      }, { status: 404 });
    }

    // No revelar toda la info, solo lo necesario
    return Response.json({
      success: true,
      regalo: {
        lectura: regalo.lecturaNombre,
        remitente: regalo.remitente.nombre,
        mensaje: regalo.mensaje,
        estado: regalo.estado,
        expiraEn: regalo.expiraEn
      }
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
