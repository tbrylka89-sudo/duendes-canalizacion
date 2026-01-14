import { NextResponse } from 'next/server';

/**
 * API pública para obtener productos/guardianes para el Test del Guardián
 * Devuelve productos de WooCommerce con imágenes y URLs
 */
export async function GET() {
    try {
        const WOO_URL = process.env.WOO_URL || 'https://duendesuy.10web.cloud';
        const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
        const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

        if (!WOO_KEY || !WOO_SECRET) {
            // Productos de fallback si no hay WooCommerce configurado
            return NextResponse.json({
                success: true,
                products: getFallbackProducts()
            });
        }

        const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

        // Obtener productos de la categoría "Guardianes" o todos si no existe
        const response = await fetch(
            `${WOO_URL}/wp-json/wc/v3/products?per_page=50&status=publish&stock_status=instock`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                next: { revalidate: 300 } // Cache por 5 minutos
            }
        );

        if (!response.ok) {
            console.error('WooCommerce error:', response.status);
            return NextResponse.json({
                success: true,
                products: getFallbackProducts()
            });
        }

        const wooProducts = await response.json();

        // Transformar a formato simple para el test
        const products = wooProducts
            .filter(p => p.images && p.images.length > 0)
            .map(p => ({
                id: p.id,
                nombre: extractGuardianName(p.name),
                nombreCompleto: p.name,
                imagen: p.images[0]?.src || null,
                url: p.permalink || `${WOO_URL}/product/${p.slug}`,
                precio: parseFloat(p.price) || 0,
                slug: p.slug
            }))
            .filter(p => p.imagen); // Solo productos con imagen

        return NextResponse.json({
            success: true,
            products: products.length > 0 ? products : getFallbackProducts(),
            total: products.length
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            success: true,
            products: getFallbackProducts()
        });
    }
}

function extractGuardianName(fullName) {
    // Extraer nombre del guardián del nombre del producto
    // Ej: "Finnegan - Guardián de la Abundancia" -> "Finnegan"
    const match = fullName?.match(/^([A-Za-zÀ-ÿ]+)/);
    return match ? match[1] : fullName?.split(' ')[0] || 'Guardián';
}

function getFallbackProducts() {
    // Productos de fallback con gradientes (sin imágenes reales)
    return [
        { id: 1, nombre: 'Finnegan', imagen: null, url: 'https://duendesdeluruguay.com/shop/', color1: '#00d4ff', color2: '#0066aa' },
        { id: 2, nombre: 'Willow', imagen: null, url: 'https://duendesdeluruguay.com/shop/', color1: '#00ffcc', color2: '#008866' },
        { id: 3, nombre: 'Bramble', imagen: null, url: 'https://duendesdeluruguay.com/shop/', color1: '#aa66ff', color2: '#6622aa' },
        { id: 4, nombre: 'Ember', imagen: null, url: 'https://duendesdeluruguay.com/shop/', color1: '#ff6644', color2: '#aa2200' },
        { id: 5, nombre: 'Moss', imagen: null, url: 'https://duendesdeluruguay.com/shop/', color1: '#66dd66', color2: '#228822' },
        { id: 6, nombre: 'Luna', imagen: null, url: 'https://duendesdeluruguay.com/shop/', color1: '#ccccff', color2: '#6666aa' }
    ];
}
