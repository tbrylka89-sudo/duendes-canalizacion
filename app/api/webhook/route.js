// ═══════════════════════════════════════════════════════════════════════════════
// WEBHOOK DEPRECATED - Redirige al webhook unificado
// Este endpoint se mantiene por compatibilidad pero el principal es:
// /api/webhooks/woocommerce
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log('[WEBHOOK-GENERAL-DEPRECATED] Redirigiendo a webhook unificado...');

  try {
    // Clonar el request para reenviarlo
    const rawBody = await request.text();

    // Reenviar al webhook unificado
    const response = await fetch('https://duendes-vercel.vercel.app/api/webhooks/woocommerce', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-wc-webhook-signature': request.headers.get('x-wc-webhook-signature') || ''
      },
      body: rawBody
    });

    const result = await response.json();

    console.log('[WEBHOOK-GENERAL-DEPRECATED] Respuesta del webhook unificado:', result.success);

    return Response.json({
      ...result,
      _nota: 'Este endpoint está deprecated. Usar /api/webhooks/woocommerce'
    });

  } catch (error) {
    console.error('[WEBHOOK-GENERAL-DEPRECATED] Error:', error);
    return Response.json({
      success: false,
      error: error.message,
      _nota: 'Este endpoint está deprecated. Usar /api/webhooks/woocommerce'
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    status: 'deprecated',
    mensaje: 'Este endpoint está DEPRECATED',
    usar: '/api/webhooks/woocommerce',
    razon: 'Webhook unificado con todas las funcionalidades'
  });
}
