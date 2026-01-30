import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WP_USER = process.env.WP_USER || 'admin';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

function getAuth() {
  if (WP_APP_PASSWORD) {
    return Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
  }
  const WOO_KEY = process.env.WC_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET;
  if (WOO_KEY && WOO_SECRET) {
    return Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
  }
  return null;
}

// POST - Subir foto desde formulario público (validado por token)
export async function POST(request) {
  try {
    const formData = await request.formData();
    const token = formData.get('token');
    const archivo = formData.get('archivo');

    if (!token) {
      return Response.json({ success: false, error: 'Token requerido' }, { status: 400 });
    }

    // Validar token
    const invite = await kv.get(`form_invite:${token}`);
    if (!invite || invite.status === 'completed') {
      return Response.json({ success: false, error: 'Token inválido' }, { status: 403 });
    }

    if (!archivo) {
      return Response.json({ success: false, error: 'No se recibió archivo' }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(archivo.type)) {
      return Response.json({ success: false, error: 'Solo se permiten imágenes (JPG, PNG, WebP)' }, { status: 400 });
    }

    // Validar tamaño (máx 10MB)
    if (archivo.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, error: 'La imagen no puede superar 10MB' }, { status: 400 });
    }

    const auth = getAuth();
    if (!auth) {
      return Response.json({ success: false, error: 'Configuración de servidor incompleta' }, { status: 500 });
    }

    // Subir a WordPress Media Library
    const wpFormData = new FormData();
    wpFormData.append('file', archivo);
    wpFormData.append('title', `Formulario - ${invite.customerName || 'Cliente'}`);
    wpFormData.append('alt_text', `Foto de formulario de canalización`);

    const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Disposition': `attachment; filename="${archivo.name}"`
      },
      body: wpFormData
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[FORM-UPLOAD] WP error:', errorText);
      throw new Error(`Error subiendo imagen: ${res.status}`);
    }

    const medio = await res.json();

    return Response.json({
      success: true,
      url: medio.source_url,
      id: medio.id
    });

  } catch (error) {
    console.error('[FORM-UPLOAD] Error:', error);
    return Response.json({ success: false, error: 'Error al subir imagen' }, { status: 500 });
  }
}
