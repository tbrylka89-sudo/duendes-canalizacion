/**
 * Test endpoint para verificar consulta de pedidos WooCommerce
 */

export default async function handler(req, res) {
  const orderId = req.query.order || '5687';

  const wooUrl = process.env.WORDPRESS_URL || process.env.WOO_URL || 'https://duendesdeluruguay.com';
  const wooKey = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
  const wooSecret = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

  if (!wooKey || !wooSecret) {
    return res.json({
      error: 'Faltan credenciales',
      hasKey: !!wooKey,
      hasSecret: !!wooSecret,
      keyPrefix: wooKey ? wooKey.substring(0, 5) : null
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
      return res.json({
        error: true,
        status: response.status,
        url: url.replace(wooUrl, '[WOO]'),
        response: errorText.substring(0, 500)
      });
    }

    const data = await response.json();

    return res.json({
      success: true,
      order: {
        id: data.id,
        status: data.status,
        date: data.date_created,
        total: data.total,
        currency: data.currency,
        billing_email: data.billing?.email,
        billing_name: `${data.billing?.first_name} ${data.billing?.last_name}`,
        billing_country: data.billing?.country,
        shipping_country: data.shipping?.country,
        items: data.line_items?.map(i => i.name)
      }
    });

  } catch (error) {
    return res.json({
      error: true,
      message: error.message
    });
  }
}
