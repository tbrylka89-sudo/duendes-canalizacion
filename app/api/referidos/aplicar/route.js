import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: APLICAR CÓDIGO DE REFERIDO
// Un nuevo usuario usa el código de otro para obtener bonus
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// Configuración de bonificaciones
const BONUS_REFERIDOR = 50;      // Runas para quien refiere
const BONUS_REFERIDO = 25;       // Runas para quien es referido
const XP_REFERIDOR = 30;         // XP para quien refiere
const BONUS_CIRCULO_EXTRA = 100; // Bonus extra si el referido se une al Círculo

export async function POST(request) {
  try {
    const { emailNuevo, codigoReferido } = await request.json();

    if (!emailNuevo || !codigoReferido) {
      return Response.json({
        success: false,
        error: 'Se requiere email y código de referido'
      }, { status: 400 });
    }

    // Normalizar código
    const codigo = codigoReferido.toUpperCase().trim();

    // Buscar quién es el dueño del código
    const datosReferido = await kv.get(`referido:${codigo}`);

    if (!datosReferido) {
      return Response.json({
        success: false,
        error: 'Código de referido no válido'
      }, { status: 400 });
    }

    const emailReferidor = datosReferido.email;

    // No puede referirse a sí mismo
    if (emailNuevo.toLowerCase() === emailReferidor.toLowerCase()) {
      return Response.json({
        success: false,
        error: 'No podés usar tu propio código de referido'
      }, { status: 400 });
    }

    // Verificar que el nuevo usuario existe
    const usuarioNuevo = await kv.get(`user:${emailNuevo}`);
    if (!usuarioNuevo) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    // Verificar que no haya usado ya un código
    if (usuarioNuevo.referidoPor) {
      return Response.json({
        success: false,
        error: 'Ya usaste un código de referido anteriormente'
      }, { status: 400 });
    }

    // Obtener referidor
    const referidor = await kv.get(`user:${emailReferidor}`);
    if (!referidor) {
      return Response.json({
        success: false,
        error: 'El dueño del código ya no existe'
      }, { status: 400 });
    }

    // Aplicar bonus al nuevo usuario
    await kv.set(`user:${emailNuevo}`, {
      ...usuarioNuevo,
      runas: (usuarioNuevo.runas || 0) + BONUS_REFERIDO,
      referidoPor: emailReferidor,
      fechaReferido: new Date().toISOString()
    });

    // Aplicar bonus al referidor
    const referidosActuales = referidor.referidos || [];
    referidosActuales.push({
      email: emailNuevo,
      fecha: new Date().toISOString(),
      bonusOtorgado: BONUS_REFERIDOR
    });

    await kv.set(`user:${emailReferidor}`, {
      ...referidor,
      runas: (referidor.runas || 0) + BONUS_REFERIDOR,
      xp: (referidor.xp || 0) + XP_REFERIDOR,
      referidos: referidosActuales
    });

    // Registrar transacciones
    const fechaHoy = new Date().toISOString();

    // Transacción del referido
    const historialNuevo = await kv.get(`user:${emailNuevo}:transacciones`) || [];
    historialNuevo.unshift({
      tipo: 'bonus_referido',
      cantidad: BONUS_REFERIDO,
      motivo: `Bienvenida con código de ${emailReferidor.split('@')[0]}`,
      fecha: fechaHoy
    });
    await kv.set(`user:${emailNuevo}:transacciones`, historialNuevo.slice(0, 100));

    // Transacción del referidor
    const historialReferidor = await kv.get(`user:${emailReferidor}:transacciones`) || [];
    historialReferidor.unshift({
      tipo: 'bonus_referidor',
      cantidad: BONUS_REFERIDOR,
      motivo: `Referiste a ${emailNuevo.split('@')[0]}`,
      fecha: fechaHoy
    });
    await kv.set(`user:${emailReferidor}:transacciones`, historialReferidor.slice(0, 100));

    console.log(`[REFERIDOS] ${emailNuevo} usó código de ${emailReferidor}. Bonus: ${BONUS_REFERIDO}/${BONUS_REFERIDOR}`);

    return Response.json({
      success: true,
      mensaje: `¡Código aplicado! Recibiste ${BONUS_REFERIDO} runas de bienvenida`,
      bonusRecibido: BONUS_REFERIDO,
      referidoPor: emailReferidor.split('@')[0]
    });

  } catch (error) {
    console.error('[REFERIDOS] Error aplicando código:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Función auxiliar para dar bonus extra cuando referido se une al Círculo
export async function darBonusCirculo(emailReferido) {
  try {
    const usuario = await kv.get(`user:${emailReferido}`);
    if (!usuario?.referidoPor) return;

    const referidor = await kv.get(`user:${usuario.referidoPor}`);
    if (!referidor) return;

    // Dar bonus extra al referidor
    await kv.set(`user:${usuario.referidoPor}`, {
      ...referidor,
      runas: (referidor.runas || 0) + BONUS_CIRCULO_EXTRA
    });

    // Registrar transacción
    const historial = await kv.get(`user:${usuario.referidoPor}:transacciones`) || [];
    historial.unshift({
      tipo: 'bonus_referido_circulo',
      cantidad: BONUS_CIRCULO_EXTRA,
      motivo: `${emailReferido.split('@')[0]} se unió al Círculo`,
      fecha: new Date().toISOString()
    });
    await kv.set(`user:${usuario.referidoPor}:transacciones`, historial.slice(0, 100));

    console.log(`[REFERIDOS] Bonus Círculo: ${BONUS_CIRCULO_EXTRA} runas a ${usuario.referidoPor}`);

  } catch (error) {
    console.error('[REFERIDOS] Error dando bonus Círculo:', error);
  }
}
