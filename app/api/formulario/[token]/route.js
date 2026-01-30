import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// GET - Obtener configuración del formulario (público, sin auth)
export async function GET(request, { params }) {
  try {
    const { token } = await params;

    if (!token) {
      return Response.json({ success: false, error: 'Token requerido' }, { status: 400 });
    }

    const invite = await kv.get(`form_invite:${token}`);

    if (!invite) {
      return Response.json({ success: false, error: 'Formulario no encontrado o expirado' }, { status: 404 });
    }

    if (invite.status === 'completed') {
      return Response.json({
        success: true,
        completed: true,
        message: 'Este formulario ya fue completado'
      });
    }

    // Devolver config pública (sin datos sensibles)
    return Response.json({
      success: true,
      completed: false,
      formType: invite.formType,
      customerName: invite.customerName,
      productName: invite.productName || null,
      personalMessage: invite.personalMessage || null,
      notaAdmin: invite.notaAdmin || null
    });

  } catch (error) {
    console.error('[FORMULARIO GET] Error:', error);
    return Response.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

// POST - Enviar respuestas del formulario (público, validado por token)
export async function POST(request, { params }) {
  try {
    const { token } = await params;
    const body = await request.json();

    if (!token) {
      return Response.json({ success: false, error: 'Token requerido' }, { status: 400 });
    }

    // Validar que la invitación existe y no está completada
    const invite = await kv.get(`form_invite:${token}`);

    if (!invite) {
      return Response.json({ success: false, error: 'Formulario no encontrado o expirado' }, { status: 404 });
    }

    if (invite.status === 'completed') {
      return Response.json({ success: false, error: 'Este formulario ya fue completado' }, { status: 400 });
    }

    // Guardar respuestas
    const formData = {
      token,
      email: invite.customerEmail,
      nombre: invite.customerName,
      formType: invite.formType,
      completedAt: new Date().toISOString(),
      respuestas: {
        // Campos del producto/guardián (todos los tipos)
        tipo_producto: body.tipo_producto || null,
        nombre_producto: body.nombre_producto || null,
        foto_producto_url: body.foto_producto_url || null,
        // Campos personales
        nombre_preferido: body.nombre_preferido || '',
        momento_vida: body.momento_vida || '',
        necesidades: body.necesidades || [],
        mensaje_guardian: body.mensaje_guardian || '',
        foto_url: body.foto_url || null,
        es_mayor_18: body.es_mayor_18 || false,
        // Campos de regalo
        relacion: body.relacion || null,
        que_necesita_escuchar: body.que_necesita_escuchar || null,
        personalidad: body.personalidad || [],
        que_le_hace_brillar: body.que_le_hace_brillar || null,
        mensaje_personal: body.mensaje_personal || null,
        es_anonimo: body.es_anonimo || false,
        // Campos de niño
        edad_nino: body.edad_nino || null,
        relacion_nino: body.relacion_nino || null,
        gustos_nino: body.gustos_nino || null,
        personalidad_nino: body.personalidad_nino || [],
        necesidades_nino: body.necesidades_nino || [],
        info_extra_nino: body.info_extra_nino || null,
      }
    };

    // Guardar datos del formulario
    await kv.set(`form_data:${token}`, formData, { ex: 365 * 24 * 60 * 60 }); // 1 año

    // Actualizar invitación como completada
    invite.status = 'completed';
    invite.completedAt = new Date().toISOString();
    await kv.set(`form_invite:${token}`, invite, { ex: 30 * 24 * 60 * 60 }); // mantener 30 días

    // Indexar por email para búsqueda
    const submissions = await kv.get(`form_submissions:${invite.customerEmail}`) || [];
    submissions.unshift(token);
    await kv.set(`form_submissions:${invite.customerEmail}`, submissions.slice(0, 50));

    // Si hay una canalización vinculada, adjuntar los datos y auto-generar
    if (invite.canalizacionId) {
      const canal = await kv.get(`canalizacion:${invite.canalizacionId}`);
      if (canal) {
        canal.formToken = token;
        canal.formData = formData.respuestas;
        canal.formCompletado = true;
        await kv.set(`canalizacion:${invite.canalizacionId}`, canal);

        // Auto-generar canalización si está en borrador y tiene datos completos
        if (canal.estado === 'borrador') {
          try {
            const baseUrl = process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : 'https://duendes-vercel.vercel.app';
            await fetch(`${baseUrl}/api/admin/canalizaciones`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: invite.canalizacionId,
                accion: 'generar'
              })
            });
            console.log(`[FORMULARIO] Auto-generación disparada para canalización ${invite.canalizacionId}`);
          } catch (e) {
            console.error('[FORMULARIO] Error en auto-generación (admin puede generar manual):', e.message);
          }
        }
      }
    }

    console.log(`[FORMULARIO] Completado: ${invite.customerEmail} (${invite.formType})`);

    return Response.json({
      success: true,
      message: 'Formulario completado con éxito'
    });

  } catch (error) {
    console.error('[FORMULARIO POST] Error:', error);
    return Response.json({ success: false, error: 'Error al guardar' }, { status: 500 });
  }
}
