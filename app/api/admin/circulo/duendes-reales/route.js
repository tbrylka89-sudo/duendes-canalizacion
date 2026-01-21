import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GESTIÓN DE DUENDES REALES
// CRUD de duendes para usar en el contenido del Círculo
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// GET - Listar duendes y obtener el actual
export async function GET() {
  try {
    const duendes = await kv.get('circulo:duendes-reales') || [];
    const duendeActual = await kv.get('duende-semana-actual');

    return Response.json({
      success: true,
      duendes,
      duendeActual,
      total: duendes.length
    });

  } catch (error) {
    console.error('[DUENDES-REALES] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Crear, editar, eliminar, sincronizar
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    switch (accion) {
      case 'crear': {
        const { duende } = body;
        if (!duende.nombre) {
          return Response.json({ success: false, error: 'Nombre requerido' }, { status: 400 });
        }

        const duendes = await kv.get('circulo:duendes-reales') || [];

        const nuevoDuende = {
          id: duende.id || `duende_${Date.now()}`,
          nombre: duende.nombre,
          nombreCompleto: duende.nombreCompleto || duende.nombre,
          descripcion: duende.descripcion || '',
          proposito: duende.proposito || '',
          cristales: duende.cristales || [],
          elemento: duende.elemento || '',
          imagen: duende.imagen || null,
          personalidad: duende.personalidad || '',
          creadoEn: new Date().toISOString()
        };

        duendes.push(nuevoDuende);
        await kv.set('circulo:duendes-reales', duendes);

        return Response.json({ success: true, duende: nuevoDuende });
      }

      case 'editar': {
        const { duende } = body;
        if (!duende.id) {
          return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }

        const duendes = await kv.get('circulo:duendes-reales') || [];
        const idx = duendes.findIndex(d => d.id === duende.id);

        if (idx === -1) {
          return Response.json({ success: false, error: 'Duende no encontrado' }, { status: 404 });
        }

        duendes[idx] = {
          ...duendes[idx],
          ...duende,
          actualizadoEn: new Date().toISOString()
        };

        await kv.set('circulo:duendes-reales', duendes);

        // Si es el duende actual, actualizar también
        const actual = await kv.get('duende-semana-actual');
        if (actual?.id === duende.id) {
          await kv.set('duende-semana-actual', duendes[idx]);
        }

        return Response.json({ success: true, duende: duendes[idx] });
      }

      case 'eliminar': {
        const { id } = body;
        if (!id) {
          return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }

        const duendes = await kv.get('circulo:duendes-reales') || [];
        const filtrados = duendes.filter(d => d.id !== id);
        await kv.set('circulo:duendes-reales', filtrados);

        return Response.json({ success: true, mensaje: 'Duende eliminado' });
      }

      case 'seleccionar-actual': {
        const { id } = body;
        const duendes = await kv.get('circulo:duendes-reales') || [];
        const duende = duendes.find(d => d.id === id);

        if (!duende) {
          return Response.json({ success: false, error: 'Duende no encontrado' }, { status: 404 });
        }

        // Guardar en historial el anterior
        const anterior = await kv.get('duende-semana-actual');
        if (anterior) {
          const historial = await kv.get('duende-semana-historial') || [];
          historial.unshift({
            ...anterior,
            fechaFin: new Date().toISOString()
          });
          await kv.set('duende-semana-historial', historial.slice(0, 50));
        }

        // Calcular fechas de la semana
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        const duendeActual = {
          ...duende,
          fechaInicio: inicioSemana.toISOString(),
          fechaFin: finSemana.toISOString(),
          seleccionadoEn: new Date().toISOString()
        };

        await kv.set('duende-semana-actual', duendeActual);

        return Response.json({
          success: true,
          duendeActual,
          mensaje: `${duende.nombre} es ahora el Duende de la Semana`
        });
      }

      case 'sincronizar-woo': {
        // Intentar obtener productos de WooCommerce
        const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
        const WOO_KEY = process.env.WC_CONSUMER_KEY;
        const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

        if (!WOO_KEY || !WOO_SECRET) {
          return Response.json({
            success: false,
            error: 'Credenciales de WooCommerce no configuradas (WC_CONSUMER_KEY, WC_CONSUMER_SECRET). Agrega los duendes manualmente.'
          }, { status: 400 });
        }

        try {
          const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
          const res = await fetch(`${WOO_URL}/wp-json/wc/v3/products?per_page=100&category=guardianes`, {
            headers: { 'Authorization': `Basic ${auth}` }
          });

          if (!res.ok) {
            throw new Error(`WooCommerce respondió ${res.status}`);
          }

          const productos = await res.json();
          const duendesExistentes = await kv.get('circulo:duendes-reales') || [];
          const idsExistentes = new Set(duendesExistentes.map(d => d.wooId));

          let importados = 0;

          for (const prod of productos) {
            // Saltar si ya existe
            if (idsExistentes.has(prod.id)) continue;

            // Extraer cristales de atributos o meta
            let cristales = [];
            const attrCristales = prod.attributes?.find(a => a.name.toLowerCase().includes('cristal'));
            if (attrCristales) {
              cristales = attrCristales.options || [];
            }

            // Extraer propósito
            let proposito = '';
            const attrProposito = prod.attributes?.find(a =>
              a.name.toLowerCase().includes('propósito') || a.name.toLowerCase().includes('proposito')
            );
            if (attrProposito) {
              proposito = attrProposito.options?.join(', ') || '';
            }

            const nuevoDuende = {
              id: `woo_${prod.id}`,
              wooId: prod.id,
              nombre: prod.name.split(' ')[0], // Primer palabra como nombre corto
              nombreCompleto: prod.name,
              descripcion: prod.description?.replace(/<[^>]*>/g, '') || prod.short_description?.replace(/<[^>]*>/g, '') || '',
              proposito,
              cristales,
              imagen: prod.images?.[0]?.src || null,
              precio: prod.price,
              url: prod.permalink,
              importadoDeWoo: true,
              importadoEn: new Date().toISOString()
            };

            duendesExistentes.push(nuevoDuende);
            importados++;
          }

          await kv.set('circulo:duendes-reales', duendesExistentes);

          return Response.json({
            success: true,
            importados,
            total: duendesExistentes.length,
            mensaje: `Importados ${importados} duendes de WooCommerce`
          });

        } catch (wooError) {
          console.error('[DUENDES-REALES] Error WooCommerce:', wooError);
          return Response.json({
            success: false,
            error: `Error conectando con WooCommerce: ${wooError.message}. Agrega los duendes manualmente.`
          }, { status: 500 });
        }
      }

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[DUENDES-REALES] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
