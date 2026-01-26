/**
 * Script para configurar webhooks de WooCommerce automáticamente
 *
 * Uso:
 *   node scripts/configure-webhooks.js
 *
 * Requiere variables de entorno:
 *   - WORDPRESS_URL
 *   - WC_CONSUMER_KEY
 *   - WC_CONSUMER_SECRET
 *   - WOOCOMMERCE_WEBHOOK_SECRET (se genera si no existe)
 */

const https = require('https');
const crypto = require('crypto');

// Configuración
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

// URL del endpoint de webhooks
const WEBHOOK_DELIVERY_URL = 'https://duendes-vercel.vercel.app/api/webhooks/woocommerce';

// Generar secret aleatorio si no existe
const WEBHOOK_SECRET = process.env.WOOCOMMERCE_WEBHOOK_SECRET || crypto.randomBytes(32).toString('hex');

// Webhooks a crear
const WEBHOOKS_CONFIG = [
  {
    name: 'Vercel - Orden Creada',
    topic: 'order.created',
    status: 'active'
  },
  {
    name: 'Vercel - Producto Actualizado',
    topic: 'product.updated',
    status: 'active'
  },
  {
    name: 'Vercel - Producto Creado',
    topic: 'product.created',
    status: 'active'
  },
  {
    name: 'Vercel - Producto Eliminado',
    topic: 'product.deleted',
    status: 'active'
  }
];

async function makeRequest(method, endpoint, data = null) {
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
  const url = new URL(`${WORDPRESS_URL}/wp-json/wc/v3${endpoint}`);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${json.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Error parsing response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function listExistingWebhooks() {
  console.log('\n📋 Listando webhooks existentes...');
  try {
    const webhooks = await makeRequest('GET', '/webhooks');
    return webhooks;
  } catch (error) {
    console.error('Error listando webhooks:', error.message);
    return [];
  }
}

async function deleteWebhook(id) {
  try {
    await makeRequest('DELETE', `/webhooks/${id}?force=true`);
    console.log(`  ❌ Webhook ${id} eliminado`);
    return true;
  } catch (error) {
    console.error(`  Error eliminando webhook ${id}:`, error.message);
    return false;
  }
}

async function createWebhook(config) {
  try {
    const webhook = await makeRequest('POST', '/webhooks', {
      name: config.name,
      topic: config.topic,
      delivery_url: WEBHOOK_DELIVERY_URL,
      secret: WEBHOOK_SECRET,
      status: config.status
    });
    console.log(`  ✅ Creado: ${config.name} (ID: ${webhook.id})`);
    return webhook;
  } catch (error) {
    console.error(`  ❌ Error creando ${config.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CONFIGURADOR DE WEBHOOKS WOOCOMMERCE');
  console.log('═══════════════════════════════════════════════════════════');

  if (!WC_KEY || !WC_SECRET) {
    console.error('\n❌ Error: Faltan credenciales de WooCommerce');
    console.log('   Configurar WC_CONSUMER_KEY y WC_CONSUMER_SECRET');
    process.exit(1);
  }

  console.log(`\n🌐 WordPress: ${WORDPRESS_URL}`);
  console.log(`📡 Delivery URL: ${WEBHOOK_DELIVERY_URL}`);
  console.log(`🔐 Secret: ${WEBHOOK_SECRET.substring(0, 8)}...`);

  // 1. Listar webhooks existentes
  const existing = await listExistingWebhooks();
  console.log(`\n   Encontrados: ${existing.length} webhooks`);

  // 2. Eliminar webhooks antiguos de Vercel (opcional)
  const vercelWebhooks = existing.filter(w =>
    w.delivery_url?.includes('vercel') ||
    w.name?.toLowerCase().includes('vercel')
  );

  if (vercelWebhooks.length > 0) {
    console.log(`\n🗑️  Eliminando ${vercelWebhooks.length} webhooks de Vercel antiguos...`);
    for (const wh of vercelWebhooks) {
      await deleteWebhook(wh.id);
    }
  }

  // 3. Crear nuevos webhooks
  console.log('\n🔧 Creando webhooks nuevos...');
  for (const config of WEBHOOKS_CONFIG) {
    await createWebhook(config);
  }

  // 4. Mostrar resumen
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  CONFIGURACIÓN COMPLETADA');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n⚠️  IMPORTANTE: Agregar esta variable de entorno en Vercel:');
  console.log(`\n   WOOCOMMERCE_WEBHOOK_SECRET=${WEBHOOK_SECRET}`);
  console.log('\n   Ir a: https://vercel.com/[tu-proyecto]/settings/environment-variables');
  console.log('\n═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
