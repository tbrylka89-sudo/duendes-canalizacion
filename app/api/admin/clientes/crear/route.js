import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ═══════════════════════════════════════════════════════════════════════════════
// API: SISTEMA INTELIGENTE DE CREACIÓN DE CLIENTES
// Anti-duplicados, magic links, regalo de runas, activación de círculo
// ═══════════════════════════════════════════════════════════════════════════════

// Generar token seguro
function generarToken(longitud = 24) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < longitud; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Generar magic link con expiración
async function crearMagicLink(email) {
  const magicToken = generarToken(32);
  const expiraEn = Date.now() + (24 * 60 * 60 * 1000); // 24 horas

  await kv.set(`magic:${magicToken}`, {
    email: email.toLowerCase().trim(),
    creadoEn: new Date().toISOString(),
    expiraEn
  }, { ex: 86400 }); // Expira en 24h

  return magicToken;
}

// Email de bienvenida para usuarios nuevos
async function enviarEmailBienvenida(email, token, nombre, runasRegaladas = 0) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://duendes-vercel.vercel.app';

  let mensajeRunas = '';
  if (runasRegaladas > 0) {
    mensajeRunas = `<p style="background:#2d2d2d;padding:15px;border-radius:10px;margin:20px 0;">🎁 <strong>¡Regalo especial!</strong> Te dimos ${runasRegaladas} runas de bienvenida para que explores.</p>`;
  }

  await resend.emails.send({
    from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
    to: email,
    subject: '✨ Tu portal a Mi Magia está listo',
    html: `
      <div style="font-family:Georgia,serif;padding:30px;background:#1a1a1a;color:#f5f5dc;">
        <h1 style="color:#d4af37;margin-bottom:20px;">¡Bienvenida${nombre ? `, ${nombre}` : ''}!</h1>
        <p>Tu espacio personal en Mi Magia te está esperando.</p>
        ${mensajeRunas}
        <p style="margin:30px 0;">
          <a href="${baseUrl}/mi-magia?token=${token}"
             style="background:linear-gradient(135deg,#d4af37,#f4d03f);color:#1a1a1a;padding:15px 30px;border-radius:50px;text-decoration:none;display:inline-block;font-weight:bold;">
            Entrar a Mi Magia ✨
          </a>
        </p>
        <p style="font-size:14px;color:#888;">Este enlace es permanente. Guardalo en tus favoritos.</p>
      </div>
    `
  });
}

// Email de magic link para usuarios existentes
async function enviarMagicLink(email, magicToken, nombre) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://duendes-vercel.vercel.app';

  await resend.emails.send({
    from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
    to: email,
    subject: '🔮 Tu enlace mágico para entrar',
    html: `
      <div style="font-family:Georgia,serif;padding:30px;background:#1a1a1a;color:#f5f5dc;">
        <h1 style="color:#d4af37;margin-bottom:20px;">Hola${nombre ? `, ${nombre}` : ''}</h1>
        <p>Pediste acceso a Mi Magia. Acá está tu enlace mágico:</p>
        <p style="margin:30px 0;">
          <a href="${baseUrl}/auth/magic?token=${magicToken}"
             style="background:linear-gradient(135deg,#d4af37,#f4d03f);color:#1a1a1a;padding:15px 30px;border-radius:50px;text-decoration:none;display:inline-block;font-weight:bold;">
            Entrar ahora ✨
          </a>
        </p>
        <p style="font-size:14px;color:#888;">Este enlace expira en 24 horas.</p>
      </div>
    `
  });
}

// POST - Crear cliente o enviar magic link si existe
export async function POST(request) {
  try {
    const {
      email,
      nombre,
      regalarRunas = 0,           // Cantidad de runas a regalar
      activarCirculo = false,     // Activar membresía del círculo
      forzarNuevo = false,        // Crear aunque exista (para admin)
      enviarEmail = true,         // Enviar email de bienvenida
      datosExtra = {}             // Fecha nacimiento, género, etc.
    } = await request.json();

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // Buscar si ya existe
    const existente = await kv.get(`user:${emailNorm}`) || await kv.get(`elegido:${emailNorm}`);

    if (existente && !forzarNuevo) {
      // Usuario existe - enviar magic link en vez de error
      const magicToken = await crearMagicLink(emailNorm);

      if (enviarEmail) {
        await enviarMagicLink(emailNorm, magicToken, existente.nombre);
      }

      // Si pidieron regalar runas, agregarlas al existente
      if (regalarRunas > 0) {
        const actualizado = {
          ...existente,
          runas: (existente.runas || 0) + regalarRunas,
          ultimoRegalo: new Date().toISOString()
        };

        if (await kv.get(`user:${emailNorm}`)) {
          await kv.set(`user:${emailNorm}`, actualizado);
        }
        if (await kv.get(`elegido:${emailNorm}`)) {
          await kv.set(`elegido:${emailNorm}`, actualizado);
        }
      }

      return Response.json({
        success: true,
        yaExistia: true,
        magicLinkEnviado: enviarEmail,
        mensaje: enviarEmail ? 'Usuario existente. Magic link enviado.' : 'Usuario encontrado.',
        cliente: {
          email: emailNorm,
          nombre: existente.nombre,
          runas: existente.runas + (regalarRunas || 0)
        }
      });
    }

    // Crear nuevo cliente
    const token = generarToken(16);
    const ahora = new Date().toISOString();

    const nuevoCliente = {
      email: emailNorm,
      nombre: nombre || '',
      token,
      runas: 50 + (regalarRunas || 0), // 50 de bienvenida + regalo
      treboles: 0,
      guardianes: [],
      lecturas: [],
      // Datos opcionales
      fechaNacimiento: datosExtra.fechaNacimiento || null,
      genero: datosExtra.genero || null, // 'ella', 'el', 'neutro'
      // Círculo
      esDelCirculo: activarCirculo,
      circuloDesde: activarCirculo ? ahora : null,
      // Metadata
      creado: ahora,
      origen: datosExtra.origen || 'admin',
      perfilCompletado: false
    };

    // Guardar en user: y elegido: si es del círculo
    await kv.set(`user:${emailNorm}`, nuevoCliente);
    if (activarCirculo) {
      await kv.set(`elegido:${emailNorm}`, nuevoCliente);
    }

    // Enviar email de bienvenida
    if (enviarEmail) {
      await enviarEmailBienvenida(emailNorm, token, nombre, regalarRunas);
    }

    return Response.json({
      success: true,
      yaExistia: false,
      mensaje: 'Cliente creado exitosamente',
      cliente: {
        email: emailNorm,
        nombre: nombre || '',
        token,
        runas: nuevoCliente.runas,
        esDelCirculo: activarCirculo
      }
    });

  } catch (error) {
    console.error('[CREAR CLIENTE] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Buscar cliente por email
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
  }

  const emailNorm = email.toLowerCase().trim();
  const cliente = await kv.get(`user:${emailNorm}`) || await kv.get(`elegido:${emailNorm}`);

  if (!cliente) {
    return Response.json({ success: false, existe: false });
  }

  return Response.json({
    success: true,
    existe: true,
    cliente: {
      email: cliente.email,
      nombre: cliente.nombre,
      runas: cliente.runas,
      treboles: cliente.treboles,
      esDelCirculo: cliente.esDelCirculo || false,
      perfilCompletado: cliente.perfilCompletado || false,
      creado: cliente.creado
    }
  });
}
