// ============================================================================
// DELETE ACCOUNT — Readdy Backend Edge Function
// ----------------------------------------------------------------------------
// Two supported flows:
//   1) A signed-in user deletes THEIR OWN account (no body, or userId === self).
//   2) An ADMIN deletes another user's account by passing { userId }.
//
// SECURITY
//   - The caller JWT is verified with an ANON-key client (auth.getUser(token)).
//   - Privileged database + auth-admin work uses a SERVICE-ROLE client.
//   - Deleting someone else requires the caller to be an admin (is_admin()).
//   - Public tables (user_profiles, user_events, mystic_profiles, mystic_results)
//     have NO FK cascade to auth.users, so we clean them up explicitly.
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Bảng dữ liệu ứng dụng cần dọn theo user_id (không có cascade sẵn).
const USER_DATA_TABLES = ['mystic_results', 'mystic_profiles', 'user_events', 'user_profiles'];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return json({ deleted: false, error: 'missing_token' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error('[delete-account] Backend not configured (missing SUPABASE_* env).');
      return json({ deleted: false, error: 'server_not_configured' }, 500);
    }

    // ANON-key client that carries the caller's JWT — used ONLY for auth check
    // and to evaluate is_admin() as the caller.
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData?.user) {
      return json({ deleted: false, error: 'unauthorized' }, 401);
    }
    const callerId = authData.user.id;

    let body: { userId?: string } = {};
    try {
      body = (await req.json()) as { userId?: string };
    } catch {
      body = {};
    }

    let targetId = callerId;
    if (body?.userId && body.userId !== callerId) {
      const { data: isAdmin, error: adminError } = await authClient.rpc('is_admin');
      if (adminError || isAdmin !== true) {
        return json({ deleted: false, error: 'forbidden' }, 403);
      }
      targetId = body.userId;
    }

    // SERVICE-ROLE client for privileged cleanup + auth user deletion.
    const admin = createClient(supabaseUrl, serviceKey);

    for (const table of USER_DATA_TABLES) {
      const { error } = await admin.from(table).delete().eq('user_id', targetId);
      if (error) {
        console.warn(`[delete-account] cleanup failed for ${table}:`, error.message);
      }
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(targetId);
    if (deleteError) {
      console.error('[delete-account] auth delete failed:', deleteError.message);
      return json({ deleted: false, error: 'delete_failed' }, 400);
    }

    return json({ deleted: true, userId: targetId });
  } catch (err) {
    console.error('[delete-account] Unexpected error', err);
    return json({ deleted: false, error: 'unexpected_error' }, 500);
  }
});
