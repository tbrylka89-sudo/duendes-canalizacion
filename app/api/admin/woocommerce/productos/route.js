import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: CONEXIÓN COMPLETA CON WOOCOMMERCE
// Obtiene TODOS los productos (duendes) con TODA su información
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WOO_KEY = process.env.WC_CONSUMER_KEY;
const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

function getAuth() {
  return Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
}

// GET - Obtener productos de WooCommerce
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const accion = searchParams.get('accion') || 'listar';
  const id = searchParams.get('id');
  const categoria = searchParams.get('categoria');
  const buscar = searchParams.get('buscar');
  const porPagina = parseInt(searchParams.get('por_pagina')) || 100;
  const pagina = parseInt(searchParams.get('pagina')) || 1;

  // Verificar credenciales
  if (!WOO_KEY || !WOO_SECRET) {
    return Response.json({
      success: false,
      error: 'Credenciales de WooCommerce no configuradas',
      configuracion: {
        WC_CONSUMER_KEY: !!WOO_KEY,
        WC_CONSUMER_SECRET: !!WOO_SECRET,
        WORDPRESS_URL: WOO_URL
      }
    }, { status: 400 });
  }

  try {
    const headers = { 'Authorization': `Basic ${getAuth()}` };

    switch (accion) {
      case 'verificar': {
        // Verificar conexión con WooCommerce
        const res = await fetch(`${WOO_URL}/wp-json/wc/v3/system_status`, { headers });
        if (!res.ok) {
          throw new Error(`WooCommerce respondió ${res.status}`);
        }
        const status = await res.json();
        return Response.json({
          success: true,
          conexion: 'activa',
          wordpress: {
            version: status.environment?.wp_version,
            woocommerce: status.environment?.version,
            url: WOO_URL
          }
        });
      }

      case 'producto': {
        // Obtener un producto específico con toda su info
        if (!id) {
          return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }
        const res = await fetch(`${WOO_URL}/wp-json/wc/v3/products/${id}`, { headers });
        if (!res.ok) {
          throw new Error(`Producto no encontrado: ${res.status}`);
        }
        const producto = await res.json();
        return Response.json({
          success: true,
          producto: transformarProducto(producto)
        });
      }

      case 'categorias': {
        // Obtener todas las categorías
        const res = await fetch(`${WOO_URL}/wp-json/wc/v3/products/categories?per_page=100`, { headers });
        const categorias = await res.json();
        return Response.json({
          success: true,
          categorias: categorias.map(c => ({
            id: c.id,
            nombre: c.name,
            slug: c.slug,
            descripcion: c.description,
            imagen: c.image?.src,
            cantidad: c.count
          }))
        });
      }

      case 'listar':
      default: {
        // Listar productos con filtros
        let url = `${WOO_URL}/wp-json/wc/v3/products?per_page=${porPagina}&page=${pagina}&status=publish`;

        if (categoria) url += `&category=${categoria}`;
        if (buscar) url += `&search=${encodeURIComponent(buscar)}`;

        const res = await fetch(url, { headers });
        if (!res.ok) {
          throw new Error(`Error obteniendo productos: ${res.status}`);
        }

        const productos = await res.json();
        const total = res.headers.get('X-WP-Total');
        const totalPaginas = res.headers.get('X-WP-TotalPages');

        // Transformar cada producto
        const productosTransformados = productos.map(transformarProducto);

        // Guardar en cache de KV para uso rápido
        await kv.set('woo:productos:cache', {
          productos: productosTransformados,
          actualizadoEn: new Date().toISOString()
        }, { ex: 3600 }); // Cache 1 hora

        return Response.json({
          success: true,
          productos: productosTransformados,
          paginacion: {
            total: parseInt(total) || productos.length,
            totalPaginas: parseInt(totalPaginas) || 1,
            paginaActual: pagina,
            porPagina
          }
        });
      }
    }

  } catch (error) {
    console.error('[WOO-PRODUCTOS] Error:', error);
    return Response.json({
      success: false,
      error: error.message,
      ayuda: 'Verificá las credenciales WC_CONSUMER_KEY y WC_CONSUMER_SECRET en Vercel'
    }, { status: 500 });
  }
}

// Transformar producto de WooCommerce a formato interno
function transformarProducto(prod) {
  // Extraer atributos importantes
  const atributos = {};
  if (prod.attributes) {
    for (const attr of prod.attributes) {
      const key = attr.name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');
      atributos[key] = attr.options || [];
    }
  }

  // Limpiar HTML de descripciones
  const limpiarHTML = (html) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  };

  // Extraer nombre corto (primer palabra) y nombre completo
  const nombreParts = prod.name.split(' ');
  const nombreCorto = nombreParts[0];

  return {
    // Identificación
    id: prod.id,
    slug: prod.slug,
    sku: prod.sku,

    // Nombres
    nombre: nombreCorto,
    nombreCompleto: prod.name,

    // Descripciones
    descripcion: limpiarHTML(prod.description),
    descripcionCorta: limpiarHTML(prod.short_description),

    // Imágenes (TODAS)
    imagenPrincipal: prod.images?.[0]?.src || null,
    imagenes: prod.images?.map(img => ({
      id: img.id,
      src: img.src,
      alt: img.alt || prod.name
    })) || [],

    // Precios
    precio: prod.price,
    precioRegular: prod.regular_price,
    precioOferta: prod.sale_price,
    enOferta: prod.on_sale,

    // Categorías
    categorias: prod.categories?.map(c => ({
      id: c.id,
      nombre: c.name,
      slug: c.slug
    })) || [],

    // Atributos extraídos
    cristales: atributos.cristal || atributos.cristales || [],
    proposito: atributos.proposito || atributos.propósito || [],
    elemento: atributos.elemento?.[0] || null,
    poder: atributos.poder || [],

    // Meta adicional
    stock: prod.stock_status === 'instock',
    url: prod.permalink,
    fechaCreacion: prod.date_created,
    fechaModificacion: prod.date_modified,

    // Todo el objeto original por si se necesita
    _raw: {
      attributes: prod.attributes,
      meta_data: prod.meta_data
    }
  };
}

// POST - Crear o editar productos en WooCommerce
export async function POST(request) {
  if (!WOO_KEY || !WOO_SECRET) {
    return Response.json({
      success: false,
      error: 'Credenciales de WooCommerce no configuradas'
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { accion, producto, id } = body;
    const headers = {
      'Authorization': `Basic ${getAuth()}`,
      'Content-Type': 'application/json'
    };

    switch (accion) {
      case 'crear': {
        const res = await fetch(`${WOO_URL}/wp-json/wc/v3/products`, {
          method: 'POST',
          headers,
          body: JSON.stringify(producto)
        });
        const nuevo = await res.json();

        // Verificar si WooCommerce devolvió un error
        if (!res.ok || nuevo.code) {
          return Response.json({
            success: false,
            error: nuevo.message || nuevo.code || `Error de WooCommerce: ${res.status}`,
            detalles: nuevo
          }, { status: res.status });
        }

        return Response.json({
          success: true,
          producto: transformarProducto(nuevo)
        });
      }

      case 'actualizar': {
        if (!id) {
          return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }
        const res = await fetch(`${WOO_URL}/wp-json/wc/v3/products/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(producto)
        });
        const actualizado = await res.json();

        // Verificar si WooCommerce devolvió un error
        if (!res.ok || actualizado.code) {
          return Response.json({
            success: false,
            error: actualizado.message || actualizado.code || `Error de WooCommerce: ${res.status}`,
            detalles: actualizado
          }, { status: res.status });
        }

        return Response.json({
          success: true,
          producto: transformarProducto(actualizado)
        });
      }

      case 'sincronizar-guardianes': {
        // Categorías que contienen duendes/guardianes reales
        const categoriasGuardianes = [16, 35, 36, 49, 103]; // proteccion, amor, salud, dinero, sabiduria

        // Obtener productos de todas las páginas
        let todosLosProductos = [];
        let pagina = 1;
        let hayMas = true;

        while (hayMas && pagina <= 5) {
          const res = await fetch(
            `${WOO_URL}/wp-json/wc/v3/products?per_page=100&page=${pagina}&status=publish`,
            { headers: { 'Authorization': `Basic ${getAuth()}` } }
          );
          const productos = await res.json();
          if (productos.length === 0) {
            hayMas = false;
          } else {
            todosLosProductos = todosLosProductos.concat(productos);
            pagina++;
          }
        }

        // Filtrar solo los que son duendes reales (tienen imagen Y están en categorías de guardianes)
        const guardianes = todosLosProductos
          .filter(prod => {
            // Debe tener imagen
            if (!prod.images || prod.images.length === 0) return false;
            // Debe estar en una categoría de guardianes
            const catIds = prod.categories?.map(c => c.id) || [];
            return catIds.some(id => categoriasGuardianes.includes(id));
          })
          .map(prod => {
            const transformado = transformarProducto(prod);
            // Extraer categoría principal para propósito
            const catPrincipal = prod.categories?.find(c => categoriasGuardianes.includes(c.id));
            return {
              id: `woo_${prod.id}`,
              wooId: prod.id,
              nombre: transformado.nombre,
              nombreCompleto: transformado.nombreCompleto,
              descripcion: transformado.descripcion || transformado.descripcionCorta || '',
              proposito: catPrincipal?.name || transformado.proposito?.join(', ') || '',
              cristales: transformado.cristales,
              elemento: transformado.elemento,
              categoria: catPrincipal?.slug || '',
              imagen: transformado.imagenPrincipal,
              imagenes: transformado.imagenes,
              precio: transformado.precio,
              url: transformado.url,
              importadoDeWoo: true,
              sincronizadoEn: new Date().toISOString()
            };
          });

        // Guardar en KV
        await kv.set('circulo:duendes-reales', guardianes);
        await kv.set('woo:guardianes:sync', {
          total: guardianes.length,
          fecha: new Date().toISOString()
        });

        return Response.json({
          success: true,
          sincronizados: guardianes.length,
          mensaje: `Sincronizados ${guardianes.length} guardianes de WooCommerce`,
          guardianes: guardianes.map(g => ({ id: g.id, nombre: g.nombre, imagen: g.imagen, categoria: g.categoria }))
        });
      }

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[WOO-PRODUCTOS] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
