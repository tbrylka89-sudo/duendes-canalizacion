export const dynamic = 'force-dynamic';

import {
  getAllProducts,
  getInventoryLevel,
  LOCATION_IDS,
  setInventoryLevel,
  setLock,
} from '@/lib/shopify-sync';

export async function POST(request) {
  // Simple auth
  const authHeader = request.headers.get('authorization') || '';
  const secret = process.env.INVENTORY_SYNC_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const direction = searchParams.get('direction') || 'uy_to_us';
  const dryRun = searchParams.get('dry_run') === 'true';
  const startTime = Date.now();

  console.log(`[full-sync] Starting direction=${direction} dry_run=${dryRun}`);

  try {
    const [usProducts, uyProducts] = await Promise.all([
      getAllProducts('us'),
      getAllProducts('uy'),
    ]);

    const usMap = new Map(usProducts.map(p => [p.handle, p]));
    const uyMap = new Map(uyProducts.map(p => [p.handle, p]));

    const usLocationId = LOCATION_IDS.us;
    const uyLocationId = LOCATION_IDS.uy;

    const allHandles = new Set([...usMap.keys(), ...uyMap.keys()]);
    const results = [];
    let synced = 0, skipped = 0, errors = 0;

    for (const handle of allHandles) {
      const usProduct = usMap.get(handle);
      const uyProduct = uyMap.get(handle);

      if (!usProduct || !uyProduct) {
        results.push({ handle, status: 'no_match', in_us: !!usProduct, in_uy: !!uyProduct });
        skipped++;
        continue;
      }

      const maxVariants = Math.min(usProduct.variants?.length || 0, uyProduct.variants?.length || 0);

      for (let i = 0; i < maxVariants; i++) {
        const usVariant = usProduct.variants[i];
        const uyVariant = uyProduct.variants[i];

        try {
          // Throttle to stay under 2 req/sec per store
          await new Promise(r => setTimeout(r, 600));
          const [usLevels, uyLevels] = await Promise.all([
            getInventoryLevel('us', usVariant.inventory_item_id),
            getInventoryLevel('uy', uyVariant.inventory_item_id),
          ]);

          const usQty = usLevels[0]?.available ?? null;
          const uyQty = uyLevels[0]?.available ?? null;

          let sourceQty, targetStore, targetLocationId, targetInventoryItemId;

          if (direction === 'uy_to_us') {
            sourceQty = uyQty;
            targetStore = 'us';
            targetLocationId = usLocationId;
            targetInventoryItemId = usVariant.inventory_item_id;
          } else if (direction === 'us_to_uy') {
            sourceQty = usQty;
            targetStore = 'uy';
            targetLocationId = uyLocationId;
            targetInventoryItemId = uyVariant.inventory_item_id;
          } else {
            sourceQty = (uyQty !== null && usQty !== null) ? Math.min(uyQty, usQty) : (uyQty ?? usQty);
            targetStore = 'both';
          }

          if (sourceQty === null) { skipped++; continue; }

          if (!dryRun) {
            if (direction === 'bidirectional') {
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

          results.push({ handle, variant_index: i, status: dryRun ? 'dry_run' : 'synced', us_qty: usQty, uy_qty: uyQty, new_qty: sourceQty });
          synced++;
        } catch (err) {
          results.push({ handle, variant_index: i, status: 'error', error: err.message });
          errors++;
        }
      }
    }

    return Response.json({
      ok: true, direction, dry_run: dryRun,
      total_us: usProducts.length, total_uy: uyProducts.length,
      matched_handles: [...allHandles].filter(h => usMap.has(h) && uyMap.has(h)).length,
      synced, skipped, errors, elapsed_ms: Date.now() - startTime, results,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
