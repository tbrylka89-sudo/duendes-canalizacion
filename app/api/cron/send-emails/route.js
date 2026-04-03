import { kv } from '@vercel/kv';
import { getEmailById, renderEmail, BRAND } from '../../../../lib/email-automations';

export const dynamic = 'force-dynamic';

const RESEND_API_URL = 'https://api.resend.com/emails';
const BATCH_SIZE = 50; // Max emails per cron run

async function sendEmail({ to, subject, html }) {
  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${BRAND.senderName} <${BRAND.senderEmail}>`,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Resend API error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

export async function GET(request) {
  // Verify cron secret if available (Vercel cron sends this header)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  let sent = 0;
  let errors = 0;
  const results = [];

  try {
    // Scan for all scheduled email keys
    // Pattern: email:scheduled:{timestamp}:{email_id}:{customer_email}
    const allKeys = [];
    let cursor = 0;

    do {
      const [nextCursor, keys] = await kv.scan(cursor, {
        match: 'email:scheduled:*',
        count: 100,
      });
      cursor = nextCursor;
      allKeys.push(...keys);
    } while (cursor !== 0 && allKeys.length < 1000);

    // Filter for emails that are due (timestamp <= now)
    const dueKeys = allKeys.filter(key => {
      const parts = key.split(':');
      const timestamp = parseInt(parts[2], 10);
      return timestamp <= now;
    });

    console.log(`[send-emails] Found ${allKeys.length} scheduled, ${dueKeys.length} due`);

    // Process up to BATCH_SIZE
    const toProcess = dueKeys.slice(0, BATCH_SIZE);

    for (const key of toProcess) {
      try {
        const raw = await kv.get(key);
        if (!raw) {
          await kv.del(key);
          continue;
        }

        const entry = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const emailDef = getEmailById(entry.email_id);

        if (!emailDef) {
          console.error(`[send-emails] Email definition not found: ${entry.email_id}`);
          await kv.del(key);
          continue;
        }

        // Render the email with customer data
        const rendered = renderEmail(emailDef, {
          name: entry.name,
          email: entry.to,
          store: entry.store,
          tracking_url: entry.tracking_url,
        });

        // Send via Resend
        const sendResult = await sendEmail({
          to: entry.to,
          subject: rendered.subject,
          html: rendered.html,
        });

        // Delete the scheduled entry after successful send
        await kv.del(key);
        sent++;

        results.push({
          email_id: entry.email_id,
          to: entry.to,
          resend_id: sendResult.id,
          status: 'sent',
        });

        console.log(`[send-emails] Sent ${entry.email_id} to ${entry.to} (resend: ${sendResult.id})`);
      } catch (emailError) {
        errors++;
        results.push({
          key,
          error: emailError.message,
          status: 'error',
        });
        console.error(`[send-emails] Error processing ${key}:`, emailError.message);
        // Don't delete the key - will retry on next cron run
      }
    }

    return Response.json({
      ok: true,
      timestamp: new Date().toISOString(),
      total_scheduled: allKeys.length,
      total_due: dueKeys.length,
      processed: toProcess.length,
      sent,
      errors,
      results,
    });
  } catch (error) {
    console.error('[send-emails] Cron error:', error);
    return Response.json({
      ok: false,
      error: error.message,
      sent,
      errors,
    }, { status: 500 });
  }
}
