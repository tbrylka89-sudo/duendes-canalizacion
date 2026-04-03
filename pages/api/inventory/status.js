/**
 * GET /api/inventory/status
 *
 * Shows current inventory sync status:
 *   - Product counts per store
 *   - Matched handles
 *   - Inventory mismatches
 *   - Active sync locks
 *
 * Query params:
 *   detail = "true" to include per-product inventory comparison
 *
 * Authorization: Bearer token via INVENTORY_SYNC_SECRET env var
 */

import {
  getAllProducts,
  getInventoryLevel,
  LOCATION_IDS,
  syncLocks,
  LOCK_TTL_MS,
} from '../../../lib/shopify-sync';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth
  const authHeader = req.headers.authorization || '';
  const secret = process.env.INVENTORY_SYNC_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const detail = req.query.detail === 'true';
  const startTime = Date.now();

  try {
    // 1. Fetch products from both stores
    const [usProducts, uyProducts] = await Promise.all([
      getAllProducts('us'),
      getAllProducts('uy'),
    ]);

    const usHandles = new Set(usProducts.map((p) => p.handle));
    const uyHandles = new Set(uyProducts.map((p) => p.handle));

    const matchedHandles = [...usHandles].filter((h) => uyHandles.has(h));
    const usOnly = [...usHandles].filter((h) => !uyHandles.has(h));
    const uyOnly = [...uyHandles].filter((h) => !usHandles.has(h));

    // 2. Active sync locks
    const now = Date.now();
    const activeLocks = [];
    for (const [key, ts] of syncLocks.entries()) {
      if (now - ts < LOCK_TTL_MS) {
        activeLocks.push({ key, age_ms: now - ts });
      }
    }

    // 3. Optional: detailed inventory comparison
    let details = null;
    let mismatches = 0;

    if (detail && matchedHandles.length > 0) {
      const usMap = new Map(usProducts.map((p) => [p.handle, p]));
      const uyMap = new Map(uyProducts.map((p) => [p.handle, p]));

      // Locations are hardcoded
      const _ = LOCATION_IDS; // used indirectly via getInventoryLevel

      details = [];

      // Limit detail to first 50 products to avoid timeout
      const handlesToCheck = matchedHandles.slice(0, 50);

      for (const handle of handlesToCheck) {
        const usProduct = usMap.get(handle);
        const uyProduct = uyMap.get(handle);
        const maxVariants = Math.min(
          usProduct.variants?.length || 0,
          uyProduct.variants?.length || 0
        );

        for (let i = 0; i < maxVariants; i++) {
          try {
            const [usLevels, uyLevels] = await Promise.all([
              getInventoryLevel('us', usProduct.variants[i].inventory_item_id),
              getInventoryLevel('uy', uyProduct.variants[i].inventory_item_id),
            ]);

            const usQty = usLevels[0]?.available ?? null;
            const uyQty = uyLevels[0]?.available ?? null;
            const match = usQty === uyQty;
            if (!match) mismatches++;

            details.push({
              handle,
              title: usProduct.title,
              variant_index: i,
              us_qty: usQty,
              uy_qty: uyQty,
              in_sync: match,
            });
          } catch (err) {
            details.push({
              handle,
              variant_index: i,
              error: err.message,
            });
          }
        }
      }
    }

    return res.status(200).json({
      ok: true,
      stores: {
        us: {
          domain: process.env.SHOPIFY_US_STORE || 'duendes-del-uruguay-2.myshopify.com',
          product_count: usProducts.length,
        },
        uy: {
          domain: process.env.SHOPIFY_UY_STORE || 'duendes-del-uruguay-3.myshopify.com',
          product_count: uyProducts.length,
        },
      },
      sync: {
        matched_handles: matchedHandles.length,
        us_only: usOnly.length,
        uy_only: uyOnly.length,
        active_locks: activeLocks.length,
        mismatches: detail ? mismatches : 'run with ?detail=true',
      },
      active_locks: activeLocks,
      us_only_handles: usOnly.slice(0, 20),
      uy_only_handles: uyOnly.slice(0, 20),
      details,
      elapsed_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error('[inventory-status] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
