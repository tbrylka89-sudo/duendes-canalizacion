/**
 * Shopify Inventory Sync - Shared utilities
 * Matches products between US and UY stores by handle.
 */

const API_VERSION = '2024-01';

const STORES = {
  us: {
    domain: process.env.SHOPIFY_US_STORE || 'duendes-del-uruguay-2.myshopify.com',
    token: () => process.env.SHOPIFY_US_TOKEN,
    webhookSecret: () => process.env.SHOPIFY_US_WEBHOOK_SECRET,
  },
  uy: {
    domain: process.env.SHOPIFY_UY_STORE || 'duendes-del-uruguay-3.myshopify.com',
    token: () => process.env.SHOPIFY_UY_TOKEN,
    webhookSecret: () => process.env.SHOPIFY_UY_WEBHOOK_SECRET,
  },
};

// In-memory sync lock to prevent infinite webhook loops.
// Key: "handle:location_id", Value: timestamp of last sync write.
// If we wrote within LOCK_TTL_MS, skip the incoming webhook.
const syncLocks = new Map();
const LOCK_TTL_MS = 30_000; // 30 seconds

function isLocked(key) {
  const ts = syncLocks.get(key);
  if (!ts) return false;
  if (Date.now() - ts > LOCK_TTL_MS) {
    syncLocks.delete(key);
    return false;
  }
  return true;
}

function setLock(key) {
  syncLocks.set(key, Date.now());
}

// --- Shopify REST helpers ---

async function shopifyFetch(store, path, options = {}) {
  const config = STORES[store];
  if (!config) throw new Error(`Unknown store: ${store}`);
  const token = config.token();
  if (!token) throw new Error(`No token configured for store ${store}`);

  const url = `https://${config.domain}/admin/api/${API_VERSION}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify ${store} ${options.method || 'GET'} ${path} → ${res.status}: ${text}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

async function shopifyGet(store, path) {
  return shopifyFetch(store, path);
}

async function shopifyPost(store, path, body) {
  return shopifyFetch(store, path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// --- Product / inventory helpers ---

/**
 * Fetch all products from a store (paginated).
 * Returns array of products with variants.
 */
async function getAllProducts(store) {
  const products = [];
  let url = '/products.json?limit=250&fields=id,handle,title,variants';

  while (url) {
    const data = await shopifyGet(store, url);
    products.push(...(data.products || []));

    // Check for pagination via Link header — but since we use shopifyGet
    // which returns parsed JSON, we handle it by checking count
    if (!data.products || data.products.length < 250) {
      url = null;
    } else {
      const lastId = data.products[data.products.length - 1].id;
      url = `/products.json?limit=250&fields=id,handle,title,variants&since_id=${lastId}`;
    }
  }
  return products;
}

/**
 * Get inventory item ID from variant ID
 */
async function getVariant(store, variantId) {
  const data = await shopifyGet(store, `/variants/${variantId}.json`);
  return data.variant;
}

/**
 * Get inventory levels for an inventory item
 */
async function getInventoryLevel(store, inventoryItemId) {
  const data = await shopifyGet(
    store,
    `/inventory_levels.json?inventory_item_ids=${inventoryItemId}`
  );
  return data.inventory_levels || [];
}

// Hardcoded location IDs (avoids needing read_locations scope)
const LOCATION_IDS = {
  us: 70414401633,
  uy: 79943827618,
};

/**
 * Get primary location ID for a store
 */
function getLocationId(store) {
  return LOCATION_IDS[store] || null;
}

/**
 * Get all locations for a store (fallback to hardcoded)
 */
async function getLocations(store) {
  try {
    const data = await shopifyGet(store, '/locations.json');
    return data.locations || [];
  } catch {
    const id = LOCATION_IDS[store];
    return id ? [{ id }] : [];
  }
}

/**
 * Set inventory level (absolute quantity)
 */
async function setInventoryLevel(store, locationId, inventoryItemId, available) {
  return shopifyPost(store, '/inventory_levels/set.json', {
    location_id: locationId,
    inventory_item_id: inventoryItemId,
    available,
  });
}

/**
 * Find a product by handle in a store
 */
async function getProductByHandle(store, handle) {
  const data = await shopifyGet(store, `/products.json?handle=${encodeURIComponent(handle)}&limit=1`);
  return data.products?.[0] || null;
}

/**
 * Find inventory item ID by going: inventory_item_id → inventory_item → sku/product
 * Then find the product handle.
 */
async function getProductByInventoryItemId(store, inventoryItemId) {
  // Get the inventory item to find the variant
  const itemData = await shopifyGet(store, `/inventory_items/${inventoryItemId}.json`);
  const item = itemData.inventory_item;
  if (!item) return null;

  // The inventory item doesn't directly tell us the product,
  // but we can search variants. Let's get all products and find the match.
  // For efficiency, we check the variant that owns this inventory item.
  // inventory_item.variant_id doesn't exist in the API, so we need to search.
  const products = await getAllProducts(store);
  for (const product of products) {
    for (const variant of (product.variants || [])) {
      if (variant.inventory_item_id === inventoryItemId) {
        return product;
      }
    }
  }
  return null;
}

/**
 * Verify Shopify webhook HMAC
 */
function verifyWebhookHmac(body, hmacHeader, secret) {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hmacHeader)
  );
}

/**
 * Determine which store sent the webhook based on the shop domain header
 */
function identifySourceStore(shopDomain) {
  if (!shopDomain) return null;
  const domain = shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (domain.includes('duendes-del-uruguay-2')) return 'us';
  if (domain.includes('duendes-del-uruguay-3')) return 'uy';
  return null;
}

function getTargetStore(source) {
  return source === 'us' ? 'uy' : 'us';
}

module.exports = {
  STORES,
  LOCATION_IDS,
  API_VERSION,
  syncLocks,
  LOCK_TTL_MS,
  isLocked,
  setLock,
  shopifyGet,
  shopifyPost,
  shopifyFetch,
  getAllProducts,
  getVariant,
  getInventoryLevel,
  getLocations,
  getLocationId,
  setInventoryLevel,
  getProductByHandle,
  getProductByInventoryItemId,
  verifyWebhookHmac,
  identifySourceStore,
  getTargetStore,
};
