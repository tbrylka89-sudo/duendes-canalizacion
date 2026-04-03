/**
 * POST /api/webhooks/inventory-sync
 *
 * Receives Shopify inventory_levels/update webhooks from either store.
 * Looks up the product by inventory_item_id → handle, then updates
 * the matching product in the other store.
 *
 * Headers used:
 *   X-Shopify-Hmac-Sha256  – HMAC for verification
 *   X-Shopify-Shop-Domain  – which store sent it
 *   X-Shopify-Topic        – should be "inventory_levels/update"
 */

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
} from '../../../lib/shopify-sync';

export const config = {
  api: {
    bodyParser: false, // Need raw body for HMAC verification
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  const shopDomain = req.headers['x-shopify-shop-domain'];
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const topic = req.headers['x-shopify-topic'];

  // Identify source store
  const source = identifySourceStore(shopDomain);
  if (!source) {
    console.error(`[inventory-sync] Unknown shop domain: ${shopDomain}`);
    return res.status(400).json({ error: 'Unknown shop domain' });
  }

  const target = getTargetStore(source);

  // Read raw body
  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error('[inventory-sync] Failed to read body:', err);
    return res.status(400).json({ error: 'Bad request body' });
  }

  // Verify HMAC
  const secret = STORES[source].webhookSecret();
  if (secret && hmacHeader) {
    const valid = verifyWebhookHmac(rawBody, hmacHeader, secret);
    if (!valid) {
      console.error(`[inventory-sync] HMAC verification failed for ${source}`);
      return res.status(401).json({ error: 'HMAC verification failed' });
    }
  } else if (secret) {
    // Secret configured but no HMAC sent — reject
    console.error(`[inventory-sync] Missing HMAC header from ${source}`);
    return res.status(401).json({ error: 'Missing HMAC header' });
  }
  // If no secret configured, skip verification (development mode)

  // Parse payload
  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch (err) {
    console.error('[inventory-sync] Invalid JSON:', err);
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { inventory_item_id, available, location_id } = payload;

  if (!inventory_item_id) {
    return res.status(400).json({ error: 'Missing inventory_item_id' });
  }

  console.log(
    `[inventory-sync] ${source} → ${target} | item=${inventory_item_id} qty=${available} location=${location_id}`
  );

  // Check sync lock to prevent infinite loops
  const lockKey = `${inventory_item_id}:${source}`;
  if (isLocked(lockKey)) {
    console.log(`[inventory-sync] Skipping — sync lock active for ${lockKey}`);
    return res.status(200).json({ ok: true, skipped: true, reason: 'sync_lock' });
  }

  try {
    // 1. Find the product in the source store by inventory_item_id
    const sourceProduct = await getProductByInventoryItemId(source, inventory_item_id);
    if (!sourceProduct) {
      console.log(`[inventory-sync] No product found for inventory_item_id=${inventory_item_id} in ${source}`);
      return res.status(200).json({ ok: true, skipped: true, reason: 'product_not_found' });
    }

    const handle = sourceProduct.handle;
    console.log(`[inventory-sync] Product handle: ${handle}`);

    // Find the matching variant index in source product
    let sourceVariantIndex = 0;
    for (let i = 0; i < (sourceProduct.variants || []).length; i++) {
      if (sourceProduct.variants[i].inventory_item_id === inventory_item_id) {
        sourceVariantIndex = i;
        break;
      }
    }

    // 2. Find the matching product in the target store by handle
    const targetProduct = await getProductByHandle(target, handle);
    if (!targetProduct) {
      console.log(`[inventory-sync] No matching product with handle="${handle}" in ${target}`);
      return res.status(200).json({ ok: true, skipped: true, reason: 'no_match_in_target' });
    }

    // Match by variant index (since no SKUs, products should have same variant order)
    const targetVariant = targetProduct.variants?.[sourceVariantIndex];
    if (!targetVariant) {
      console.log(`[inventory-sync] No matching variant at index ${sourceVariantIndex} in target`);
      return res.status(200).json({ ok: true, skipped: true, reason: 'variant_not_found' });
    }

    const targetInventoryItemId = targetVariant.inventory_item_id;

    // 3. Get target store's location (hardcoded to avoid scope issues)
    const targetLocationId = LOCATION_IDS[target];
    if (!targetLocationId) {
      console.error(`[inventory-sync] No location ID for ${target}`);
      return res.status(500).json({ error: 'No location ID for target store' });
    }

    // 4. Set lock BEFORE writing to prevent echo
    const targetLockKey = `${targetInventoryItemId}:${target}`;
    setLock(targetLockKey);

    // 5. Update inventory in the target store
    if (available !== null && available !== undefined) {
      await setInventoryLevel(target, targetLocationId, targetInventoryItemId, available);
      console.log(
        `[inventory-sync] Updated ${target} | handle=${handle} variant_idx=${sourceVariantIndex} qty=${available} (${Date.now() - startTime}ms)`
      );
    }

    return res.status(200).json({
      ok: true,
      source,
      target,
      handle,
      available,
      ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error('[inventory-sync] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
