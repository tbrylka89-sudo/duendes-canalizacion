export const dynamic = 'force-dynamic';

import {
  verifyWebhookHmac,
  identifySourceStore,
  getTargetStore,
  STORES,
  LOCATION_IDS,
  isLocked,
  setLock,
  getProductByInventoryItemId,
  getProductByHandle,
  setInventoryLevel,
} from '@/lib/shopify-sync';

export async function POST(request) {
  const startTime = Date.now();
  const shopDomain = request.headers.get('x-shopify-shop-domain');
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');

  const source = identifySourceStore(shopDomain);
  if (!source) {
    console.error(`[inventory-sync] Unknown shop domain: ${shopDomain}`);
    return Response.json({ error: 'Unknown shop domain' }, { status: 400 });
  }

  const target = getTargetStore(source);

  // Read raw body
  const rawBody = await request.text();

  // Verify HMAC if secret configured
  const secret = STORES[source].webhookSecret();
  if (secret && hmacHeader) {
    const valid = verifyWebhookHmac(rawBody, hmacHeader, secret);
    if (!valid) {
      return Response.json({ error: 'HMAC verification failed' }, { status: 401 });
    }
  }

  // Parse payload
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { inventory_item_id, available } = payload;
  if (!inventory_item_id) {
    return Response.json({ error: 'Missing inventory_item_id' }, { status: 400 });
  }

  console.log(`[inventory-sync] ${source} → ${target} | item=${inventory_item_id} qty=${available}`);

  // Check sync lock
  const lockKey = `${inventory_item_id}:${source}`;
  if (isLocked(lockKey)) {
    console.log(`[inventory-sync] Skipping — sync lock active for ${lockKey}`);
    return Response.json({ ok: true, skipped: true, reason: 'sync_lock' });
  }

  try {
    // 1. Find product in source store
    const sourceProduct = await getProductByInventoryItemId(source, inventory_item_id);
    if (!sourceProduct) {
      return Response.json({ ok: true, skipped: true, reason: 'product_not_found' });
    }

    const handle = sourceProduct.handle;

    // Find variant index
    let sourceVariantIndex = 0;
    for (let i = 0; i < (sourceProduct.variants || []).length; i++) {
      if (sourceProduct.variants[i].inventory_item_id === inventory_item_id) {
        sourceVariantIndex = i;
        break;
      }
    }

    // 2. Find matching product in target
    const targetProduct = await getProductByHandle(target, handle);
    if (!targetProduct) {
      return Response.json({ ok: true, skipped: true, reason: 'no_match_in_target' });
    }

    const targetVariant = targetProduct.variants?.[sourceVariantIndex];
    if (!targetVariant) {
      return Response.json({ ok: true, skipped: true, reason: 'variant_not_found' });
    }

    const targetInventoryItemId = targetVariant.inventory_item_id;
    const targetLocationId = LOCATION_IDS[target];

    // 3. Set lock and update
    setLock(`${targetInventoryItemId}:${target}`);

    if (available !== null && available !== undefined) {
      await setInventoryLevel(target, targetLocationId, targetInventoryItemId, available);
      console.log(`[inventory-sync] Updated ${target} | handle=${handle} qty=${available} (${Date.now() - startTime}ms)`);
    }

    return Response.json({ ok: true, source, target, handle, available, ms: Date.now() - startTime });
  } catch (err) {
    console.error('[inventory-sync] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
