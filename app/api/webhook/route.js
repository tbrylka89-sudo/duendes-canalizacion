import { kv } from '@vercel/kv';
import { registrarEvento, TIPOS_EVENTO } from '@/lib/guardian-intelligence/daily-report';

export async function POST(request) {
  try {
    const body = await request.json();
    const orderId = body.id?.toString();
    
    if (!orderId) {
      return Response.json({ error: 'No order ID' }, { status: 400 });
    }

    // Detectar si es Lectura Ancestral
    let esLectura = false;
    let tieneGuardianes = false;
    
    if (body.line_items) {
      for (const item of body.line_items) {
        const nombre = item.name?.toLowerCase() || '';
        const sku = item.sku?.toLowerCase() || '';
        
        if (nombre.includes('lectura ancestral') || sku.includes('lectura-ancestral')) {
          esLectura = true;
        } else {
          tieneGuardianes = true;
        }
      }
    }

    // Calcular cuándo generar según horario
    // 06:01 - 21:59 = horario activo
    // 22:00 - 06:00 = horario nocturno (esperar hasta las 10:00)
    const ahora = new Date();
    const hora = ahora.getHours();
    let generateAt;
    
    if (esLectura) {
      // Lectura ancestral: 20 minutos siempre
      generateAt = Date.now() + (20 * 60 * 1000);
    } else {
      // Guía del portal
      if (hora >= 6 && hora < 18) {
        // 06:00 - 17:59: esperar 4 horas
        generateAt = Date.now() + (4 * 60 * 60 * 1000);
      } else if (hora >= 18 && hora < 22) {
        // 18:00 - 21:59: esperar hasta las 08:00 del día siguiente
        const manana = new Date(ahora);
        manana.setDate(manana.getDate() + 1);
        manana.setHours(8, 0, 0, 0);
        generateAt = manana.getTime();
      } else {
        // 22:00 - 05:59: esperar hasta las 10:00 del mismo día o siguiente
        const objetivo = new Date(ahora);
        if (hora >= 22) {
          objetivo.setDate(objetivo.getDate() + 1);
        }
        objetivo.setHours(10, 0, 0, 0);
        generateAt = objetivo.getTime();
      }
    }

    // Determinar tipo
    let tipo = 'portal';
    if (esLectura && !tieneGuardianes) {
      tipo = 'lectura';
    } else if (esLectura && tieneGuardianes) {
      tipo = 'ambos';
    }

    // Guardar en KV
    await kv.set('pending:' + orderId, {
      orderId,
      orderData: body,
      createdAt: Date.now(),
      generateAt,
      status: 'pending',
      tipo,
      esLectura,
      tieneGuardianes
    });

    // Agregar a lista de pendientes
    const pendingOrders = await kv.get('pending_orders') || [];
    if (!pendingOrders.includes(orderId)) {
      pendingOrders.push(orderId);
      await kv.set('pending_orders', pendingOrders);
    }

    console.log('Pedido guardado:', orderId, '| Tipo:', tipo, '| Generar en:', new Date(generateAt).toISOString());

    // Registrar venta para reporte diario
    registrarEvento(TIPOS_EVENTO.VENTA, {
      orderId,
      total: body.total,
      moneda: body.currency,
      productos: body.line_items?.map(i => i.name).join(', '),
      cantidadItems: body.line_items?.length || 0,
      pais: body.billing?.country,
      tipo,
      esLectura,
      tieneGuardianes
    });

    // Si tiene guardianes, crear/actualizar elegido inmediatamente (para email de agradecimiento)
    if (tieneGuardianes) {
      try {
        await fetch('https://duendes-vercel.vercel.app/api/elegido/crear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, orderData: body })
        });
      } catch (e) {
        console.error('Error creando elegido:', e);
      }
    }

    return Response.json({ 
      success: true, 
      orderId, 
      tipo,
      generateAt: new Date(generateAt).toISOString()
    });
    
  } catch (error) {
    console.error('Webhook error:', error);

    registrarEvento(TIPOS_EVENTO.ERROR_API, {
      endpoint: '/api/webhook',
      error: error.message
    });

    return Response.json({ error: error.message }, { status: 500 });
  }
}
