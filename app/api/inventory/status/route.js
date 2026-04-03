export const dynamic = 'force-dynamic';

import {
  getAllProducts,
  getInventoryLevel,
  syncLocks,
  LOCK_TTL_MS,
} from '@/lib/shopify-sync';

export async function GET(request) {
  const authHeader = request.headers.get('authorization') || '';
  const secret = process.env.INVENTORY_SYNC_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const detail = searchParams.get('detail') === 'true';
  const startTime = Date.now();

  try {
    const [usProducts, uyProducts] = await Promise.all([
      getAllProducts('us'),
      getAllProducts('uy'),
    ]);

    const usHandles = new Set(usProducts.map(p => p.handle));
    const uyHandles = new Set(uyProducts.map(p => p.handle));
    const matchedHandles = [...usHandles].filter(h => uyHandles.has(h));
    const usOnly = [...usHandles].filter(h => !uyHandles.has(h));
    const uyOnly = [...uyHandles].filter(h => !usHandles.has(h));

    const now = Date.now();
    const activeLocks = [];
    for (const [key, ts] of syncLocks.entries()) {
      if (now - ts < LOCK_TTL_MS) activeLocks.push({ key, age_ms: now - ts });
    }

    let details = null;
    let mismatches = 0;

    if (detail) {
      const usMap = new Map(usProducts.map(p => [p.handle, p]));
      const uyMap = new Map(uyProducts.map(p => [p.handle, p]));
      details = [];

      for (const handle of matchedHandles.slice(0, 50)) {
        const usProduct = usMap.get(handle);
        const uyProduct = uyMap.get(handle);
        const maxV = Math.min(usProduct.variants?.length || 0, uyProduct.variants?.length || 0);

        for (let i = 0; i < maxV; i++) {
          try {
            const [usLevels, uyLevels] = await Promise.all([
              getInventoryLevel('us', usProduct.variants[i].inventory_item_id),
              getInventoryLevel('uy', uyProduct.variants[i].inventory_item_id),
            ]);
            const usQty = usLevels[0]?.available ?? null;
            const uyQty = uyLevels[0]?.available ?? null;
            if (usQty !== uyQty) mismatches++;
            details.push({ handle, title: usProduct.title, us_qty: usQty, uy_qty: uyQty, in_sync: usQty === uyQty });
          } catch (err) {
            details.push({ handle, error: err.message });
          }
        }
      }
    }

    return Response.json({
      ok: true,
      stores: {
        us: { domain: 'duendes-del-uruguay-2.myshopify.com', product_count: usProducts.length },
        uy: { domain: 'duendes-del-uruguay-3.myshopify.com', product_count: uyProducts.length },
      },
      sync: { matched_handles: matchedHandles.length, us_only: usOnly.length, uy_only: uyOnly.length, mismatches: detail ? mismatches : 'run with ?detail=true' },
      us_only_handles: usOnly, uy_only_handles: uyOnly,
      details, elapsed_ms: Date.now() - startTime,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
