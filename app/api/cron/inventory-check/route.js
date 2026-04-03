export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/inventory-check
 *
 * Hourly cron that checks for inventory mismatches and fixes them.
 * Runs bidirectional sync using the minimum quantity (conservative).
 * Only syncs items that are actually different.
 */

import {
  getAllProducts,
  getInventoryLevel,
  LOCATION_IDS,
  setInventoryLevel,
  setLock,
} from '@/lib/shopify-sync';

export async function GET(request) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !request.headers.get('x-vercel-cron')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  console.log('[inventory-check] Starting hourly inventory check');

  try {
    const [usProducts, uyProducts] = await Promise.all([
      getAllProducts('us'),
      getAllProducts('uy'),
    ]);

    const usMap = new Map(usProducts.map(p => [p.handle, p]));
    const uyMap = new Map(uyProducts.map(p => [p.handle, p]));

    let checked = 0, fixed = 0, errors = 0;
    const fixes = [];

    for (const [handle, uyProduct] of uyMap) {
      const usProduct = usMap.get(handle);
      if (!usProduct) continue;

      const maxVariants = Math.min(usProduct.variants?.length || 0, uyProduct.variants?.length || 0);

      for (let i = 0; i < maxVariants; i++) {
        try {
          // Throttle
          await new Promise(r => setTimeout(r, 600));

          const [usLevels, uyLevels] = await Promise.all([
            getInventoryLevel('us', usProduct.variants[i].inventory_item_id),
            getInventoryLevel('uy', uyProduct.variants[i].inventory_item_id),
          ]);

          const usQty = usLevels[0]?.available;
          const uyQty = uyLevels[0]?.available;
          checked++;

          if (usQty !== uyQty && usQty !== null && uyQty !== null) {
            // Use the minimum (conservative - if one sold, both should reflect it)
            const syncQty = Math.min(usQty, uyQty);

            if (usQty !== syncQty) {
              setLock(`${usProduct.variants[i].inventory_item_id}:us`);
              await setInventoryLevel('us', LOCATION_IDS.us, usProduct.variants[i].inventory_item_id, syncQty);
            }
            if (uyQty !== syncQty) {
              setLock(`${uyProduct.variants[i].inventory_item_id}:uy`);
              await setInventoryLevel('uy', LOCATION_IDS.uy, uyProduct.variants[i].inventory_item_id, syncQty);
            }

            fixes.push({ handle, us: usQty, uy: uyQty, synced_to: syncQty });
            fixed++;
          }
        } catch (err) {
          // Skip rate limit errors silently, log others
          if (!err.message?.includes('429')) {
            console.error(`[inventory-check] Error on ${handle}:`, err.message);
          }
          errors++;
        }
      }
    }

    const elapsed = Date.now() - startTime;
    console.log(`[inventory-check] Done: checked=${checked} fixed=${fixed} errors=${errors} (${elapsed}ms)`);

    return Response.json({ ok: true, checked, fixed, errors, elapsed_ms: elapsed, fixes });
  } catch (err) {
    console.error('[inventory-check] Fatal:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
