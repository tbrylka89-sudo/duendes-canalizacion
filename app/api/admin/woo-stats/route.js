// ═══════════════════════════════════════════════════════════════════════════
// API - ESTADISTICAS WOOCOMMERCE
// Obtiene datos reales de ventas, pedidos y clientes desde WooCommerce
// ═══════════════════════════════════════════════════════════════════════════

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

function getWooAuth() {
  return Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
}

export async function GET() {
  try {
    // Fechas para filtros
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

    const formatDate = (d) => d.toISOString().split('T')[0];

    // Obtener pedidos del mes actual
    const pedidosMesRes = await fetch(
      `${WP_URL}/wp-json/wc/v3/orders?after=${formatDate(inicioMes)}T00:00:00&per_page=100&status=completed,processing,on-hold`,
      { headers: { 'Authorization': `Basic ${getWooAuth()}` } }
    );
    const pedidosMes = pedidosMesRes.ok ? await pedidosMesRes.json() : [];

    // Obtener pedidos del mes anterior para comparativa
    const pedidosMesAntRes = await fetch(
      `${WP_URL}/wp-json/wc/v3/orders?after=${formatDate(inicioMesAnterior)}T00:00:00&before=${formatDate(finMesAnterior)}T23:59:59&per_page=100&status=completed,processing`,
      { headers: { 'Authorization': `Basic ${getWooAuth()}` } }
    );
    const pedidosMesAnt = pedidosMesAntRes.ok ? await pedidosMesAntRes.json() : [];

    // Calcular ingresos
    const ingresosMes = pedidosMes
      .filter(p => p.status === 'completed' || p.status === 'processing')
      .reduce((sum, p) => sum + parseFloat(p.total || 0), 0);

    const ingresosMesAnterior = pedidosMesAnt
      .filter(p => p.status === 'completed' || p.status === 'processing')
      .reduce((sum, p) => sum + parseFloat(p.total || 0), 0);

    // Comparativa porcentual
    let comparativaMes = 0;
    if (ingresosMesAnterior > 0) {
      comparativaMes = Math.round(((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100);
    }

    // Ventas de hoy
    const ventasHoy = pedidosMes.filter(p => {
      const fechaPedido = new Date(p.date_created);
      return fechaPedido >= inicioHoy;
    }).length;

    // Pedidos pendientes (processing y on-hold)
    const pendientes = pedidosMes.filter(p =>
      p.status === 'processing' || p.status === 'on-hold'
    ).length;

    // Obtener total de clientes
    let clientesWoo = 0;
    try {
      const clientesRes = await fetch(
        `${WP_URL}/wp-json/wc/v3/customers?per_page=1`,
        { headers: { 'Authorization': `Basic ${getWooAuth()}` } }
      );
      // El total viene en el header X-WP-Total
      clientesWoo = parseInt(clientesRes.headers.get('X-WP-Total')) || 0;
    } catch (e) {}

    // Ultimos pedidos para mostrar
    const ultimosPedidos = pedidosMes.slice(0, 8).map(p => ({
      id: p.id,
      cliente: p.billing?.first_name
        ? `${p.billing.first_name} ${p.billing.last_name || ''}`.trim()
        : p.billing?.email?.split('@')[0] || 'Cliente',
      email: p.billing?.email,
      total: parseFloat(p.total || 0).toFixed(0),
      status: p.status,
      fecha: new Date(p.date_created).toLocaleDateString('es-UY', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: p.line_items?.length || 0
    }));

    // Productos mas vendidos del mes
    const productosVendidos = {};
    for (const pedido of pedidosMes.filter(p => p.status === 'completed' || p.status === 'processing')) {
      for (const item of (pedido.line_items || [])) {
        if (!productosVendidos[item.product_id]) {
          productosVendidos[item.product_id] = {
            id: item.product_id,
            nombre: item.name,
            cantidad: 0,
            total: 0
          };
        }
        productosVendidos[item.product_id].cantidad += item.quantity;
        productosVendidos[item.product_id].total += parseFloat(item.total || 0);
      }
    }

    const topProductos = Object.values(productosVendidos)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    return Response.json({
      success: true,
      ingresosMes: Math.round(ingresosMes),
      ingresosMesAnterior: Math.round(ingresosMesAnterior),
      comparativaMes,
      ventasMes: pedidosMes.filter(p => p.status === 'completed' || p.status === 'processing').length,
      ventasHoy,
      pendientes,
      clientesWoo,
      ultimosPedidos,
      topProductos
    });

  } catch (error) {
    console.error('Error obteniendo stats de WooCommerce:', error);
    return Response.json({
      success: false,
      error: error.message
    });
  }
}
