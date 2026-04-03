import { kv } from '@vercel/kv';
import { TRIGGER_MAP, getSequenceEmails } from '../../../../lib/email-automations';

export const dynamic = 'force-dynamic';

// Extract customer info from different webhook payloads
function extractCustomerInfo(topic, payload) {
  let email, firstName, trackingUrl;

  if (topic === 'orders/create') {
    email = payload.email || payload.contact_email || payload.customer?.email;
    firstName = payload.customer?.first_name || payload.billing_address?.first_name || '';
    trackingUrl = null;
  } else if (topic === 'customers/create') {
    email = payload.email;
    firstName = payload.first_name || '';
    trackingUrl = null;
  } else if (topic === 'fulfillments/create') {
    email = payload.email || payload.destination?.email;
    firstName = payload.destination?.first_name || '';
    trackingUrl = payload.tracking_url || payload.tracking_urls?.[0] || '#';
  } else if (topic === 'orders/fulfilled') {
    // orders/fulfilled sends an order payload with fulfillment_status = 'fulfilled'
    email = payload.email || payload.contact_email || payload.customer?.email;
    firstName = payload.customer?.first_name || payload.shipping_address?.first_name || '';
    const fulfillment = payload.fulfillments?.[0];
    trackingUrl = fulfillment?.tracking_url || fulfillment?.tracking_urls?.[0] || '#';
  }

  return { email, firstName, trackingUrl };
}

export async function POST(request) {
  try {
    const shopDomain = request.headers.get('x-shopify-shop-domain') || '';
    const topic = request.headers.get('x-shopify-topic') || '';

    console.log(`[email-automation] Webhook received: topic=${topic}, shop=${shopDomain}`);

    // Determine sequence from topic
    const sequenceName = TRIGGER_MAP[topic];
    if (!sequenceName) {
      console.log(`[email-automation] Unknown topic: ${topic}`);
      return Response.json({ ok: false, error: 'Unknown topic' }, { status: 200 });
    }

    const payload = await request.json();
    const { email, firstName, trackingUrl } = extractCustomerInfo(topic, payload);

    if (!email) {
      console.log(`[email-automation] No email found in payload`);
      return Response.json({ ok: false, error: 'No email in payload' }, { status: 200 });
    }

    // Check for duplicate: has this customer already been scheduled for this sequence?
    const customerKey = `email:customer:${email}:${sequenceName}`;
    const existing = await kv.get(customerKey);
    if (existing) {
      console.log(`[email-automation] Duplicate: ${email} already has ${sequenceName} scheduled`);
      return Response.json({ ok: true, message: 'Already scheduled', skipped: true });
    }

    // Get all emails in the sequence
    const emails = getSequenceEmails(sequenceName);
    if (!emails.length) {
      return Response.json({ ok: false, error: 'Empty sequence' }, { status: 200 });
    }

    const now = Date.now();
    const scheduled = [];

    // Schedule each email
    for (const emailDef of emails) {
      const sendAt = now + (emailDef.delay_hours * 60 * 60 * 1000);
      const scheduleKey = `email:scheduled:${sendAt}:${emailDef.id}:${email}`;

      const entry = {
        to: email,
        name: firstName,
        sequence: sequenceName,
        email_index: emailDef.index,
        email_id: emailDef.id,
        subject: emailDef.subject,
        store: shopDomain,
        tracking_url: trackingUrl || null,
        scheduled_at: sendAt,
        created_at: now,
      };

      await kv.set(scheduleKey, JSON.stringify(entry));
      scheduled.push({ id: emailDef.id, send_at: new Date(sendAt).toISOString() });
    }

    // Mark customer as having this sequence scheduled
    await kv.set(customerKey, JSON.stringify({
      scheduled_at: now,
      email_count: emails.length,
      store: shopDomain,
    }));

    console.log(`[email-automation] Scheduled ${scheduled.length} emails for ${email} in ${sequenceName}`);

    return Response.json({
      ok: true,
      customer: email,
      sequence: sequenceName,
      emails_scheduled: scheduled.length,
      schedule: scheduled,
    });
  } catch (error) {
    console.error('[email-automation] Error:', error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return Response.json({
    ok: true,
    service: 'email-automation-webhook',
    sequences: Object.keys(TRIGGER_MAP),
    timestamp: new Date().toISOString(),
  });
}
