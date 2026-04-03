#!/usr/bin/env node
/**
 * Register inventory_levels/update webhooks on both Shopify stores.
 *
 * Usage:
 *   SHOPIFY_US_TOKEN=xxx SHOPIFY_UY_TOKEN=yyy node scripts/register-inventory-webhooks.js
 *
 * Environment:
 *   SHOPIFY_US_TOKEN, SHOPIFY_UY_TOKEN – Admin API access tokens
 *   WEBHOOK_URL – Base URL, default: https://magia.duendesdeluruguay.com
 */

const API_VERSION = '2024-01';

const stores = {
  us: {
    domain: process.env.SHOPIFY_US_STORE || 'duendes-del-uruguay-2.myshopify.com',
    token: process.env.SHOPIFY_US_TOKEN,
  },
  uy: {
    domain: process.env.SHOPIFY_UY_STORE || 'duendes-del-uruguay-3.myshopify.com',
    token: process.env.SHOPIFY_UY_TOKEN,
  },
};

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://magia.duendesdeluruguay.com';

async function registerWebhook(storeName) {
  const store = stores[storeName];
  if (!store.token) {
    console.error(`[${storeName}] No token set — skipping`);
    return;
  }

  const url = `https://${store.domain}/admin/api/${API_VERSION}/webhooks.json`;

  // First, list existing webhooks
  const listRes = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': store.token,
    },
  });
  const listData = await listRes.json();
  const existing = (listData.webhooks || []).filter(
    (w) => w.topic === 'inventory_levels/update'
  );

  if (existing.length > 0) {
    console.log(`[${storeName}] Already has ${existing.length} inventory_levels/update webhook(s):`);
    existing.forEach((w) => console.log(`  - id=${w.id} address=${w.address}`));
    console.log(`[${storeName}] Deleting existing webhooks first...`);
    for (const w of existing) {
      await fetch(
        `https://${store.domain}/admin/api/${API_VERSION}/webhooks/${w.id}.json`,
        {
          method: 'DELETE',
          headers: { 'X-Shopify-Access-Token': store.token },
        }
      );
    }
  }

  // Register new webhook
  const createRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': store.token,
    },
    body: JSON.stringify({
      webhook: {
        topic: 'inventory_levels/update',
        address: `${WEBHOOK_URL}/api/webhooks/inventory-sync`,
        format: 'json',
      },
    }),
  });

  const createData = await createRes.json();
  if (createRes.ok) {
    console.log(`[${storeName}] Webhook registered: id=${createData.webhook.id}`);
    console.log(`  topic: ${createData.webhook.topic}`);
    console.log(`  address: ${createData.webhook.address}`);
  } else {
    console.error(`[${storeName}] Failed to register webhook:`, JSON.stringify(createData, null, 2));
  }
}

async function main() {
  console.log('=== Registering inventory sync webhooks ===\n');
  await registerWebhook('us');
  console.log('');
  await registerWebhook('uy');
  console.log('\nDone.');
}

main().catch(console.error);
