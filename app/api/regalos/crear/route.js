import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// API: CREAR REGALO DE LECTURA
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const {
      emailRemitente,
      nombreRemitente,
      emailDestinatario,
      nombreDestinatario,
      mensaje,
      lecturaId,
      lecturaNombre,
      runasUsadas
    } = await request.json();

    // Validaciones
    if (!emailRemitente || !emailDestinatario || !lecturaId || !runasUsadas) {
      return Response.json({
        success: false,
        error: 'Faltan datos requeridos'
      }, { status: 400 });
    }

    // Verificar que el remitente tiene suficientes runas
    const emailRemitenteNorm = emailRemitente.toLowerCase();
    const remitente = await kv.get(`elegido:${emailRemitenteNorm}`);

    if (!remitente) {
      return Response.json({
        success: false,
        error: 'Usuario remitente no encontrado'
      }, { status: 404 });
    }

    if ((remitente.runas || 0) < runasUsadas) {
      return Response.json({
        success: false,
        error: 'Runas insuficientes'
      }, { status: 400 });
    }

    // Generar código único
    const codigo = generarCodigoRegalo();

    // Crear el registro del regalo
    const regalo = {
      codigo,
      tipo: 'lectura',
      lecturaId,
      lecturaNombre,
      runasUsadas,
      remitente: {
        email: emailRemitenteNorm,
        nombre: nombreRemitente
      },
      destinatario: {
        email: emailDestinatario.toLowerCase(),
        nombre: nombreDestinatario || ''
      },
      mensaje: mensaje || '',
      estado: 'pendiente', // pendiente, canjeado, expirado
      creadoEn: new Date().toISOString(),
      expiraEn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 días
    };

    // Guardar el regalo
    await kv.set(`regalo:${codigo}`, regalo);

    // Agregar a la lista de regalos del remitente
    const regalosEnviados = await kv.get(`regalos-enviados:${emailRemitenteNorm}`) || [];
    regalosEnviados.push({
      codigo,
      destinatario: emailDestinatario,
      lectura: lecturaNombre,
      fecha: regalo.creadoEn,
      estado: 'pendiente'
    });
    await kv.set(`regalos-enviados:${emailRemitenteNorm}`, regalosEnviados);

    // Agregar a la lista de regalos pendientes del destinatario
    const emailDestNorm = emailDestinatario.toLowerCase();
    const regalosPendientes = await kv.get(`regalos-pendientes:${emailDestNorm}`) || [];
    regalosPendientes.push({
      codigo,
      remitente: nombreRemitente || emailRemitenteNorm,
      lectura: lecturaNombre,
      mensaje: mensaje || '',
      fecha: regalo.creadoEn
    });
    await kv.set(`regalos-pendientes:${emailDestNorm}`, regalosPendientes);

    // Descontar runas del remitente
    remitente.runas = (remitente.runas || 0) - runasUsadas;
    await kv.set(`elegido:${emailRemitenteNorm}`, remitente);

    // TODO: Enviar email al destinatario (implementar con Resend/SendGrid)
    // Por ahora, el regalo se canjea cuando el destinatario inicia sesión

    return Response.json({
      success: true,
      codigo,
      mensaje: 'Regalo creado correctamente',
      runasRestantes: remitente.runas
    });

  } catch (error) {
    console.error('Error creando regalo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Generar código único de 8 caracteres
function generarCodigoRegalo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin I, O, 0, 1 para evitar confusión
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `REGALO-${codigo}`;
}
