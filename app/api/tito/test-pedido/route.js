/**
 * Test endpoint para verificar consulta de pedidos WooCommerce
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order') || '5687';

  const wooUrl = process.env.WORDPRESS_URL || process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const wooKey = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const wooSecret = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!wooKey || !wooSecret) {
    return Response.json({
      error: 'Faltan credenciales',
      hasKey: !!wooKey,
      hasSecret: !!wooSecret
    });
  }

  const url = `${wooUrl}/wp-json/wc/v3/orders/${orderId}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${wooKey}:${wooSecret}`).toString('base64')
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({
        error: true,
        status: response.status,
        url: url.replace(wooUrl, '[WOO]'),
        response: errorText.substring(0, 500)
      });
    }

    const data = await response.json();

    return Response.json({
      success: true,
      order: {
        id: data.id,
        status: data.status,
        date: data.date_created,
        total: data.total,
        currency: data.currency,
        billing_email: data.billing?.email,
        billing_name: `${data.billing?.first_name} ${data.billing?.last_name}`,
        items: data.line_items?.map(i => i.name)
      }
    });

  } catch (error) {
    return Response.json({
      error: true,
      message: error.message
    });
  }
}
