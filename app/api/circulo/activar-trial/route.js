import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { calcularPerfil, guardarPerfil } from '@/lib/circulo/perfilado';
import { generarMensajeActivacionTrial, generarSincronicidad } from '@/lib/circulo/sincronicidad';
import { incrementarMiembros } from '@/lib/circulo/escasez';

// ═══════════════════════════════════════════════════════════════
// ACTIVAR TRIAL DE 15 DÍAS DEL CÍRCULO
// Integrado con sistema de conversion inteligente
// Solo se puede usar UNA vez por email
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { email, nombre, cumpleanos } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // Verificar si ya usó un trial antes
    const trialUsado = await kv.get(`trial:usado:${emailNormalizado}`);
    if (trialUsado) {
      return NextResponse.json({
        success: false,
        error: 'Ya usaste tu prueba gratuita anteriormente',
        yaUsado: true
      }, { status: 400 });
    }

    // Verificar si ya tiene membresía activa
    const elegido = await kv.get(`elegido:${emailNormalizado}`);
    if (elegido?.membresia?.activa) {
      const vencimiento = new Date(elegido.membresia.fechaVencimiento);
      if (new Date() < vencimiento) {
        return NextResponse.json({
          success: false,
          error: 'Ya tenés una membresía activa',
          yaMembresia: true
        }, { status: 400 });
      }
    }

    // Calcular fechas del trial
    const hoy = new Date();
    const finTrial = new Date(hoy);
    finTrial.setDate(finTrial.getDate() + 15);

    // Crear o actualizar el registro del elegido
    const nuevoElegido = {
      ...elegido,
      email: emailNormalizado,
      nombre: nombre || elegido?.nombre || '',
      membresia: {
        activa: true,
        plan: 'trial',
        fechaInicio: hoy.toISOString(),
        fechaVencimiento: finTrial.toISOString(),
        esTrial: true,
        trialConvertido: false,
        lecturasGratis: {
          tiradas: 1,
          susurros: 0,
          mesActual: `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
        }
      },
      // Dar 100 runas de regalo por activar el trial
      runas: (elegido?.runas || 0) + 100,
      treboles: elegido?.treboles || 0,
      ultimaActualizacion: hoy.toISOString()
    };

    // Guardar en KV
    await kv.set(`elegido:${emailNormalizado}`, nuevoElegido);

    // Marcar que este email ya usó su trial (para siempre)
    await kv.set(`trial:usado:${emailNormalizado}`, {
      fechaActivacion: hoy.toISOString(),
      fechaVencimiento: finTrial.toISOString()
    });

    // Generar token de acceso
    const token = generarToken();
    await kv.set(`token:${token}`, emailNormalizado, { ex: 60 * 60 * 24 * 16 }); // 16 días

    // ===== SISTEMA DE CONVERSION INTELIGENTE =====

    // Calcular y guardar perfil si hay datos del test
    let perfil = null;
    if (elegido?.testGuardianRaw) {
      perfil = calcularPerfil(elegido.testGuardianRaw);
      await guardarPerfil(emailNormalizado, perfil);
    }

    // Generar mensaje de sincronicidad personalizado
    const sincronicidad = generarMensajeActivacionTrial({
      nombre: nombre || elegido?.nombre || '',
      cumpleanos,
      fechaVisita: hoy
    });

    // Incrementar contador de miembros (para escasez real)
    await incrementarMiembros();

    // ===== FIN SISTEMA DE CONVERSION =====

    return NextResponse.json({
      success: true,
      mensaje: sincronicidad.mensaje || '¡Bienvenido/a al Círculo!',
      trial: {
        inicio: hoy.toISOString(),
        fin: finTrial.toISOString(),
        diasRestantes: 15
      },
      token,
      runas: nuevoElegido.runas,
      // Datos adicionales del sistema de conversion
      sincronicidad: {
        mensaje: sincronicidad.sincronicidad?.mensajePrincipal,
        momento: sincronicidad.sincronicidad?.momento
      },
      perfil: perfil ? {
        vulnerabilidad: perfil.vulnerabilidad?.nivel,
        dolor: perfil.dolor?.tipo,
        cierreRecomendado: perfil.conversion?.cierreRecomendado
      } : null
    });

  } catch (error) {
    console.error('[CIRCULO/ACTIVAR-TRIAL] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET: Verificar si un email puede usar trial
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const emailNormalizado = email.toLowerCase().trim();
    const trialUsado = await kv.get(`trial:usado:${emailNormalizado}`);

    return NextResponse.json({
      success: true,
      puedeUsarTrial: !trialUsado,
      trialUsado: trialUsado ? {
        fechaActivacion: trialUsado.fechaActivacion,
        fechaVencimiento: trialUsado.fechaVencimiento
      } : null
    });

  } catch (error) {
    console.error('[CIRCULO/ACTIVAR-TRIAL] Error GET:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

function generarToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
