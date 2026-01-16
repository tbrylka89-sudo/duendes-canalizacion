import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// Generar token para acceso a Mi Magia (desarrollo/pruebas)
export async function POST(request) {
  try {
    const { email, nombre } = await request.json();
    
    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    
    // Generar token simple (base64 del email + timestamp)
    const token = Buffer.from(emailLower + ':' + Date.now()).toString('base64').replace(/[+/=]/g, '');
    
    // Guardar token
    await kv.set('token:' + token, {
      email: emailLower,
      nombre: nombre || emailLower.split('@')[0],
      creado: new Date().toISOString()
    }, { ex: 365 * 24 * 60 * 60 }); // 1 año
    
    // También crear/actualizar elegido
    const elegidoExistente = await kv.get('elegido:' + emailLower) || {};
    await kv.set('elegido:' + emailLower, {
      ...elegidoExistente,
      email: emailLower,
      nombre: nombre || elegidoExistente.nombre || emailLower.split('@')[0],
      token: token
    });

    return Response.json({
      success: true,
      token,
      url: 'https://duendes-vercel.vercel.app/mi-magia?token=' + token
    });

  } catch (error) {
    console.error('Error generando token:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
