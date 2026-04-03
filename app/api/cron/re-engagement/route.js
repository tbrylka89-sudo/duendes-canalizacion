import { kv } from '@vercel/kv';
import { getSequenceEmails } from '../../../../lib/email-automations';

export const dynamic = 'force-dynamic';

const SHOPIFY_STORES = [
  {
    domain: 'duendes-del-uruguay-2.myshopify.com',
    token: process.env.SHOPIFY_US_TOKEN,
    label: 'US',
  },
  {
    domain: 'duendes-del-uruguay-3.myshopify.com',
    token: process.env.SHOPIFY_UY_TOKEN,
    label: 'UY',
  },
];

const INACTIVE_DAYS = 60;
const API_VERSION = '2024-01';

async function shopifyGraphQL(store, query, variables = {}) {
  const res = await fetch(`https://${store.domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': store.token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API error ${res.status}: ${text}`);
  }

  return res.json();
}

async function getInactiveCustomers(store) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - INACTIVE_DAYS);
  const cutoffISO = cutoffDate.toISOString();

  // Use REST API to find customers with orders, last order before cutoff
  const res = await fetch(
    `https://${store.domain}/admin/api/${API_VERSION}/customers.json?` +
    new URLSearchParams({
      limit: '250',
      fields: 'id,email,first_name,last_name,orders_count,last_order_id',
      orders_count_min: '1',
      updated_at_max: cutoffISO,
    }),
    {
      headers: {
        'X-Shopify-Access-Token': store.token,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    // Fallback: use search query approach
    const searchRes = await fetch(
      `https://${store.domain}/admin/api/${API_VERSION}/customers/search.json?` +
      new URLSearchParams({
        query: `orders_count:>0`,
        limit: '250',
        fields: 'id,email,first_name,last_name,orders_count',
      }),
      {
        headers: {
          'X-Shopify-Access-Token': store.token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!searchRes.ok) {
      const text = await searchRes.text();
      throw new Error(`Shopify customers search failed: ${searchRes.status} ${text}`);
    }

    const data = await searchRes.json();
    return data.customers || [];
  }

  const data = await res.json();
  return data.customers || [];
}

async function getCustomerLastOrderDate(store, customerId) {
  const res = await fetch(
    `https://${store.domain}/admin/api/${API_VERSION}/customers/${customerId}/orders.json?` +
    new URLSearchParams({
      limit: '1',
      status: 'any',
      fields: 'id,created_at',
      order: 'created_at desc',
    }),
    {
      headers: {
        'X-Shopify-Access-Token': store.token,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (data.orders && data.orders.length > 0) {
    return new Date(data.orders[0].created_at);
  }
  return null;
}

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  const cutoffDate = new Date(now - INACTIVE_DAYS * 24 * 60 * 60 * 1000);
  let totalScheduled = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  const details = [];

  for (const store of SHOPIFY_STORES) {
    try {
      console.log(`[re-engagement] Checking store: ${store.label} (${store.domain})`);

      const customers = await getInactiveCustomers(store);
      console.log(`[re-engagement] Found ${customers.length} customers with orders in ${store.label}`);

      for (const customer of customers) {
        if (!customer.email) continue;

        try {
          // Check if already has re-engagement sequence
          const customerKey = `email:customer:${customer.email}:re-engagement`;
          const existing = await kv.get(customerKey);
          if (existing) {
            totalSkipped++;
            continue;
          }

          // Verify last order date is actually 60+ days ago
          const lastOrderDate = await getCustomerLastOrderDate(store, customer.id);
          if (!lastOrderDate || lastOrderDate > cutoffDate) {
            totalSkipped++;
            continue;
          }

          // Schedule re-engagement sequence
          const emails = getSequenceEmails('re-engagement');
          const firstName = customer.first_name || '';

          for (const emailDef of emails) {
            const sendAt = now + (emailDef.delay_hours * 60 * 60 * 1000);
            const scheduleKey = `email:scheduled:${sendAt}:${emailDef.id}:${customer.email}`;

            const entry = {
              to: customer.email,
              name: firstName,
              sequence: 're-engagement',
              email_index: emailDef.index,
              email_id: emailDef.id,
              subject: emailDef.subject,
              store: store.domain,
              tracking_url: null,
              scheduled_at: sendAt,
              created_at: now,
            };

            await kv.set(scheduleKey, JSON.stringify(entry));
          }

          // Mark customer as having this sequence
          await kv.set(customerKey, JSON.stringify({
            scheduled_at: now,
            email_count: emails.length,
            store: store.domain,
          }));

          totalScheduled++;
          details.push({
            email: customer.email,
            store: store.label,
            last_order: lastOrderDate.toISOString(),
          });

          console.log(`[re-engagement] Scheduled for ${customer.email} (last order: ${lastOrderDate.toISOString()})`);
        } catch (customerError) {
          totalErrors++;
          console.error(`[re-engagement] Error processing customer ${customer.email}:`, customerError.message);
        }
      }
    } catch (storeError) {
      totalErrors++;
      console.error(`[re-engagement] Error with store ${store.label}:`, storeError.message);
      details.push({ store: store.label, error: storeError.message });
    }
  }

  return Response.json({
    ok: true,
    timestamp: new Date().toISOString(),
    inactive_threshold_days: INACTIVE_DAYS,
    customers_scheduled: totalScheduled,
    customers_skipped: totalSkipped,
    errors: totalErrors,
    details,
  });
}
