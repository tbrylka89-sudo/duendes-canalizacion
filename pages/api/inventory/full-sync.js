/**
 * POST /api/inventory/full-sync
 *
 * Manual full inventory sync between US and UY stores.
 * Matches products by handle, syncs inventory quantities.
 *
 * Query params:
 *   direction = "uy_to_us" | "us_to_uy" | "bidirectional" (default: "uy_to_us")
 *   dry_run   = "true" to preview without writing (default: false)
 *
 * Authorization: Bearer token via INVENTORY_SYNC_SECRET env var
 */

import {
  getAllProducts,
  getInventoryLevel,
  LOCATION_IDS,
  setInventoryLevel,
  setLock,
} from '../../../lib/shopify-sync';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth
  const authHeader = req.headers.authorization || '';
  const secret = process.env.INVENTORY_SYNC_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const direction = req.query.direction || 'uy_to_us';
  const dryRun = req.query.dry_run === 'true';
  const startTime = Date.now();

  console.log(`[full-sync] Starting direction=${direction} dry_run=${dryRun}`);

  try {
    // 1. Fetch all products from both stores
    const [usProducts, uyProducts] = await Promise.all([
      getAllProducts('us'),
      getAllProducts('uy'),
    ]);

    console.log(`[full-sync] US: ${usProducts.length} products, UY: ${uyProducts.length} products`);

    // Build handle maps
    const usMap = new Map();
    for (const p of usProducts) {
      usMap.set(p.handle, p);
    }
    const uyMap = new Map();
    for (const p of uyProducts) {
      uyMap.set(p.handle, p);
    }

    // 2. Get locations (hardcoded)
    const usLocationId = LOCATION_IDS.us;
    const uyLocationId = LOCATION_IDS.uy;

    // 3. Find matching handles
    const allHandles = new Set([...usMap.keys(), ...uyMap.keys()]);
    const results = [];
    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const handle of allHandles) {
      const usProduct = usMap.get(handle);
      const uyProduct = uyMap.get(handle);

      if (!usProduct || !uyProduct) {
        results.push({
          handle,
          status: 'no_match',
          in_us: !!usProduct,
          in_uy: !!uyProduct,
        });
        skipped++;
        continue;
      }

      // Sync each variant by index
      const maxVariants = Math.min(
        usProduct.variants?.length || 0,
        uyProduct.variants?.length || 0
      );

      for (let i = 0; i < maxVariants; i++) {
        const usVariant = usProduct.variants[i];
        const uyVariant = uyProduct.variants[i];

        try {
          // Get current inventory levels
          const [usLevels, uyLevels] = await Promise.all([
            getInventoryLevel('us', usVariant.inventory_item_id),
            getInventoryLevel('uy', uyVariant.inventory_item_id),
          ]);

          const usQty = usLevels[0]?.available ?? null;
          const uyQty = uyLevels[0]?.available ?? null;

          let sourceQty, sourceStore, targetStore, targetLocationId, targetInventoryItemId;

          if (direction === 'uy_to_us') {
            sourceQty = uyQty;
            sourceStore = 'uy';
            targetStore = 'us';
            targetLocationId = usLocationId;
            targetInventoryItemId = usVariant.inventory_item_id;
          } else if (direction === 'us_to_uy') {
            sourceQty = usQty;
            sourceStore = 'us';
            targetStore = 'uy';
            targetLocationId = uyLocationId;
            targetInventoryItemId = uyVariant.inventory_item_id;
          } else {
            // bidirectional: use the maximum of the two (or whichever is not null)
            if (uyQty !== null && usQty !== null) {
              sourceQty = Math.max(uyQty, usQty);
            } else {
              sourceQty = uyQty ?? usQty;
            }
            // Update both sides if needed
            sourceStore = 'both';
            targetStore = 'both';
          }

          if (sourceQty === null) {
            results.push({
              handle,
              variant_index: i,
              status: 'skipped',
              reason: 'source_qty_null',
              us_qty: usQty,
              uy_qty: uyQty,
            });
            skipped++;
            continue;
          }

          if (!dryRun) {
            if (direction === 'bidirectional') {
              // Update both stores to the max value
              if (usQty !== sourceQty) {
                setLock(`${usVariant.inventory_item_id}:us`);
                await setInventoryLevel('us', usLocationId, usVariant.inventory_item_id, sourceQty);
              }
              if (uyQty !== sourceQty) {
                setLock(`${uyVariant.inventory_item_id}:uy`);
                await setInventoryLevel('uy', uyLocationId, uyVariant.inventory_item_id, sourceQty);
              }
            } else {
              setLock(`${targetInventoryItemId}:${targetStore}`);
              await setInventoryLevel(targetStore, targetLocationId, targetInventoryItemId, sourceQty);
            }
          }

          results.push({
            handle,
            variant_index: i,
            status: dryRun ? 'dry_run' : 'synced',
            direction,
            us_qty: usQty,
            uy_qty: uyQty,
            new_qty: sourceQty,
          });
          synced++;
        } catch (err) {
          results.push({
            handle,
            variant_index: i,
            status: 'error',
            error: err.message,
          });
          errors++;
        }
      }
    }

    const elapsed = Date.now() - startTime;
    console.log(`[full-sync] Done in ${elapsed}ms: synced=${synced} skipped=${skipped} errors=${errors}`);

    return res.status(200).json({
      ok: true,
      direction,
      dry_run: dryRun,
      total_us: usProducts.length,
      total_uy: uyProducts.length,
      matched_handles: [...allHandles].filter((h) => usMap.has(h) && uyMap.has(h)).length,
      synced,
      skipped,
      errors,
      elapsed_ms: elapsed,
      results,
    });
  } catch (err) {
    console.error('[full-sync] Fatal error:', err);
    return res.status(500).json({ error: err.message });
  }
}
