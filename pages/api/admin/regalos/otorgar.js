// /pages/api/admin/regalos/otorgar.js
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generarToken() {
  const chars = 'abcdef0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { email, tipo, cantidad, duracionDias } = req.body;
    
    if (!email || !tipo) {
      return res.status(400).json({ error: 'Falta email o tipo' });
    }

    const emailLower = email.toLowerCase();
    
    // Obtener o crear usuario
    let usuario = await kv.get(`elegido:${emailLower}`);
    let esNuevo = false;
    
    if (!usuario) {
      esNuevo = true;
      const token = generarToken();
      usuario = {
        email: emailLower,
        nombre: email.split('@')[0],
        token,
        runas: 0,
        treboles: 0,
        nivel: 1,
        tituloNivel: '✨ Elegida',
        guardianes: [],
        fechaCreacion: new Date().toISOString(),
        creadoPorAdmin: true
      };
      // Guardar mapeo token -> email
      await kv.set(`token:${token}`, emailLower);
    } else if (!usuario.token) {
      // Usuario existe pero no tiene token - generarlo
      const token = generarToken();
      usuario.token = token;
      await kv.set(`token:${token}`, emailLower);
    }

    let mensaje = '';
    let asuntoEmail = '';
    let contenidoEmail = '';

    switch (tipo) {
      case 'prueba':
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + (duracionDias || 7));
        
        await kv.set(`membresia:${emailLower}`, {
          email: emailLower,
          plan: 'prueba-gratis',
          planNombre: 'Prueba Gratis',
          fechaInicio: new Date().toISOString(),
          fechaVencimiento: fechaVencimiento.toISOString(),
          tiradas: 1,
          susurros: 0,
          descuentoTienda: 0,
          descuentoAnticipado: 5,
          horasAnticipado: 24,
          titoVIP: false,
          esPrueba: true
        });
        mensaje = `Prueba gratis de ${duracionDias || 7} días activada`;
        asuntoEmail = '✦ Tu acceso al Círculo de Duendes está listo';
        contenidoEmail = `
          <p>¡Hola!</p>
          <p>Tu prueba gratis del <strong>Círculo de Duendes</strong> ya está activa.</p>
          <p>Tenés <strong>${duracionDias || 7} días</strong> para explorar todo el contenido exclusivo.</p>
        `;
        break;

      case 'runas':
        usuario.runas = (usuario.runas || 0) + (cantidad || 10);
        mensaje = `${cantidad || 10} runas agregadas (total: ${usuario.runas})`;
        asuntoEmail = '💎 Recibiste Runas de Poder';
        contenidoEmail = `
          <p>¡Hola!</p>
          <p>Te acreditamos <strong>${cantidad || 10} Runas de Poder</strong> en tu cuenta.</p>
          <p>Ahora tenés un total de <strong>${usuario.runas} runas</strong> para usar en experiencias mágicas.</p>
        `;
        break;

      case 'treboles':
        usuario.treboles = (usuario.treboles || 0) + (cantidad || 5);
        mensaje = `${cantidad || 5} tréboles agregados (total: ${usuario.treboles})`;
        asuntoEmail = '☘️ Recibiste Tréboles';
        contenidoEmail = `
          <p>¡Hola!</p>
          <p>Te acreditamos <strong>${cantidad || 5} Tréboles</strong> en tu cuenta.</p>
          <p>Ahora tenés un total de <strong>${usuario.treboles} tréboles</strong> para canjear por premios.</p>
        `;
        break;

      case 'tiradas':
        const membresiaT = await kv.get(`membresia:${emailLower}`);
        if (membresiaT) {
          membresiaT.tiradas = (membresiaT.tiradas || 0) + (cantidad || 1);
          await kv.set(`membresia:${emailLower}`, membresiaT);
        } else {
          usuario.tiradasGratis = (usuario.tiradasGratis || 0) + (cantidad || 1);
        }
        mensaje = `${cantidad || 1} tiradas gratis agregadas`;
        asuntoEmail = '🎴 Recibiste Tiradas Gratis';
        contenidoEmail = `
          <p>¡Hola!</p>
          <p>Te regalamos <strong>${cantidad || 1} tirada${(cantidad || 1) > 1 ? 's' : ''} de runas gratis</strong>.</p>
          <p>Entrá a tu portal para usarlas.</p>
        `;
        break;

      case 'susurros':
        const membresiaS = await kv.get(`membresia:${emailLower}`);
        if (membresiaS) {
          membresiaS.susurros = (membresiaS.susurros || 0) + (cantidad || 1);
          await kv.set(`membresia:${emailLower}`, membresiaS);
        } else {
          usuario.susurrosGratis = (usuario.susurrosGratis || 0) + (cantidad || 1);
        }
        mensaje = `${cantidad || 1} susurros gratis agregados`;
        asuntoEmail = '👂 Recibiste Susurros Gratis';
        contenidoEmail = `
          <p>¡Hola!</p>
          <p>Te regalamos <strong>${cantidad || 1} susurro${(cantidad || 1) > 1 ? 's' : ''} del guardián gratis</strong>.</p>
        `;
        break;

      case 'lectura-alma':
        usuario.lecturaAlmaDisponible = true;
        mensaje = 'Lectura del Alma activada';
        asuntoEmail = '📜 Recibiste una Lectura del Alma';
        contenidoEmail = `
          <p>¡Hola!</p>
          <p>Te regalamos una <strong>Lectura del Alma</strong> completamente gratis.</p>
          <p>Es una guía profunda y personalizada para tu momento de vida.</p>
        `;
        break;

      case 'extender':
        const membresiaE = await kv.get(`membresia:${emailLower}`);
        if (membresiaE && membresiaE.fechaVencimiento) {
          const fechaActual = new Date(membresiaE.fechaVencimiento);
          fechaActual.setDate(fechaActual.getDate() + (duracionDias || 7));
          membresiaE.fechaVencimiento = fechaActual.toISOString();
          await kv.set(`membresia:${emailLower}`, membresiaE);
          mensaje = `Membresía extendida ${duracionDias || 7} días`;
          asuntoEmail = '⏰ Tu membresía fue extendida';
          contenidoEmail = `
            <p>¡Hola!</p>
            <p>Extendimos tu membresía del Círculo por <strong>${duracionDias || 7} días</strong> más.</p>
            <p>Nueva fecha de vencimiento: <strong>${fechaActual.toLocaleDateString()}</strong></p>
          `;
        } else {
          return res.status(400).json({ error: 'Usuario no tiene membresía activa' });
        }
        break;

      default:
        return res.status(400).json({ error: 'Tipo de regalo no válido' });
    }

    // Guardar usuario actualizado
    await kv.set(`elegido:${emailLower}`, usuario);

    // Enviar email
    const portalUrl = `https://duendes-vercel.vercel.app/mi-magia?token=${usuario.token}`;
    
    try {
      await resend.emails.send({
        from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
        to: emailLower,
        subject: asuntoEmail,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="font-size: 48px; color: #d4af37;">✦</span>
            </div>
            
            <div style="font-size: 16px; line-height: 1.8;">
              ${contenidoEmail}
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${portalUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
                Acceder a Mi Magia ✦
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; text-align: center;">
              Guardá este email. Tu acceso es personal e intransferible.
            </p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #666; font-size: 12px;">
                Duendes del Uruguay - Piriápolis, Uruguay
              </p>
            </div>
          </div>
        `
      });
      mensaje += ' - Email enviado ✓';
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      mensaje += ' - Error enviando email';
    }

    // Log de actividad
    await kv.lpush('admin:logs', JSON.stringify({
      tipo: 'regalo',
      email: emailLower,
      regalo: tipo,
      cantidad,
      duracionDias,
      fecha: new Date().toISOString()
    }));

    return res.status(200).json({ 
      success: true, 
      mensaje,
      linkAcceso: portalUrl
    });
  } catch (error) {
    console.error('[REGALOS] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
