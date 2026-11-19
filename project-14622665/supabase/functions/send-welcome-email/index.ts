// ============================================================================
// TRANSACTIONAL EMAIL — Brevo (https://www.brevo.com)
// Welcome email triggered after a genuinely successful new user registration.
// ----------------------------------------------------------------------------
// HOW IT WORKS
//   - Sends using a Brevo TRANSACTIONAL TEMPLATE (templateId) so the email
//     design lives 100% inside Brevo — there is NO email HTML in this code.
//   - The template uses {{contact.FIRSTNAME}} for "Xin chào {{contact.FIRSTNAME}},".
//     Brevo resolves {{contact.*}} from the recipient's CONTACT RECORD, so we
//     upsert the user as a Brevo contact (with FIRSTNAME) BEFORE sending. That
//     makes {{contact.FIRSTNAME}} print the user's real name.
//   - As a safety net we ALSO pass the name as personalization params
//     ({{params.FIRSTNAME}}), so if the template uses either syntax it works.
//   - The CTA URL (with UTM params) is passed as the CTA_URL param so the
//     existing GA4 attribution keeps working unchanged.
// ----------------------------------------------------------------------------
// SECURITY
//   - The Brevo API key and template id are read ONLY from server-side Backend
//     secrets (never sent to the frontend, never hard-coded):
//       BREVO_API_KEY      (required) — Brevo API v3 key
//       BREVO_SENDER_EMAIL (required) — verified Brevo sender email
//       BREVO_TEMPLATE_ID  (required) — Brevo TRANSACTIONAL template id
//   - Sender display name is fixed to "The Mystic Room".
//   - No Resend code exists in this function.
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';
const BREVO_CONTACTS_ENDPOINT = 'https://api.brevo.com/v3/contacts';

// Tên hiển thị người gửi của email tự động.
const SENDER_NAME = 'The Mystic Room';

const SITE_BASE_URL = (Deno.env.get('SITE_BASE_URL') || 'https://themysticrooms.com').replace(
  /\/+$/,
  ''
);

const WELCOME_EMAIL_CTA_PATH = '/';

const UTM_PARAMS: Record<string, string> = {
  utm_source: 'brevo',
  utm_medium: 'email',
  utm_campaign: 'welcome_email',
};

function buildCtaUrl(path: string, utm: Record<string, string>): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const [pathname, existingQuery = ''] = `${SITE_BASE_URL}${normalized}`.split('?');
  const params = new URLSearchParams(existingQuery);
  Object.entries(utm).forEach(([key, value]) => params.set(key, value));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

const REGISTRATION_WINDOW_MS = 24 * 60 * 60 * 1000;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Create or update the recipient as a Brevo CONTACT so that the transactional
 * template's {{contact.FIRSTNAME}} tag resolves to the user's real name.
 * Non-fatal: if this fails we still try to send (params fallback covers us).
 */
async function syncBrevoContact(
  apiKey: string,
  email: string,
  firstName: string
): Promise<{ ok: boolean; status: number; detail?: string }> {
  try {
    const resp = await fetch(BREVO_CONTACTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName },
        updateEnabled: true,
      }),
    });

    if (!resp.ok) {
      let detail = '';
      try {
        detail = await resp.text();
      } catch {
        detail = '<no response body>';
      }
      return { ok: false, status: resp.status, detail };
    }
    return { ok: true, status: resp.status };
  } catch (err) {
    return { ok: false, status: 0, detail: String(err) };
  }
}

interface BrevoSendParams {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  toEmail: string;
  toName?: string;
  templateId: number;
  params: Record<string, string>;
}

async function sendBrevoTemplate(
  params: BrevoSendParams
): Promise<{ ok: boolean; status: number; detail?: string }> {
  const resp = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': params.apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: params.senderEmail, name: params.senderName },
      to: [{ email: params.toEmail, name: params.toName || undefined }],
      templateId: params.templateId,
      params: params.params,
    }),
  });

  if (!resp.ok) {
    let detail = '';
    try {
      detail = await resp.text();
    } catch {
      detail = '<no response body>';
    }
    return { ok: false, status: resp.status, detail };
  }

  return { ok: true, status: resp.status };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return json({ sent: false, error: 'missing_token' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error('[welcome-email] Backend not configured (missing SUPABASE_* env).');
      return json({ sent: false, error: 'server_not_configured' }, 500);
    }

    const authClient = createClient(supabaseUrl, anonKey);
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData?.user) {
      return json({ sent: false, error: 'unauthorized' }, 401);
    }
    const user = authData.user;

    const createdAt = user.created_at ? new Date(user.created_at).getTime() : null;
    if (createdAt && Date.now() - createdAt > REGISTRATION_WINDOW_MS) {
      return json({ sent: false, reason: 'not_new_registration' });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: profile } = await admin
      .from('user_profiles')
      .select('full_name, email, welcome_email_sent_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile?.welcome_email_sent_at) {
      return json({ sent: false, reason: 'already_sent' });
    }

    const to = user.email || profile?.email;
    if (!to) return json({ sent: false, reason: 'no_recipient' });

    const apiKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL');
    const templateIdRaw = Deno.env.get('BREVO_TEMPLATE_ID');
    if (!apiKey || !senderEmail) {
      console.warn('[welcome-email] Brevo not configured (missing BREVO_API_KEY / BREVO_SENDER_EMAIL).');
      return json({ sent: false, reason: 'email_not_configured' });
    }
    const templateId = templateIdRaw ? Number(templateIdRaw) : NaN;
    if (!Number.isFinite(templateId) || templateId <= 0) {
      console.warn('[welcome-email] Brevo template id not configured (missing BREVO_TEMPLATE_ID).');
      return json({ sent: false, reason: 'template_not_configured' });
    }

    const metaName =
      typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '';
    const displayName = (profile?.full_name || metaName || to.split('@')[0] || 'ban').trim();

    const ctaUrl = buildCtaUrl(WELCOME_EMAIL_CTA_PATH, UTM_PARAMS);

    const contactResult = await syncBrevoContact(apiKey, to, displayName);
    if (!contactResult.ok) {
      console.warn('[welcome-email] Brevo contact sync failed (continuing)', {
        status: contactResult.status,
        detail: contactResult.detail,
      });
    }

    const result = await sendBrevoTemplate({
      apiKey,
      senderEmail,
      senderName: SENDER_NAME,
      toEmail: to,
      toName: displayName,
      templateId,
      params: {
        FIRSTNAME: displayName,
        NAME: displayName,
        name: displayName,
        CTA_URL: ctaUrl,
        SITE_URL: SITE_BASE_URL,
      },
    });

    if (!result.ok) {
      console.error('[welcome-email] Brevo send failed', {
        status: result.status,
        detail: result.detail,
        userId: user.id,
      });
      return json({ sent: false, reason: 'brevo_error' });
    }

    await admin
      .from('user_profiles')
      .update({ welcome_email_sent_at: new Date().toISOString() })
      .eq('user_id', user.id);

    return json({ sent: true });
  } catch (err) {
    console.error('[welcome-email] Unexpected error', err);
    return json({ sent: false, reason: 'unexpected_error' });
  }
});
