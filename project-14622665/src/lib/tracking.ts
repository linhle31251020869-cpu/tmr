import { supabase } from '@/lib/supabase';

/**
 * Các loại sự kiện hành vi được ghi nhận cho từng user.
 */
export type TrackingEvent =
  | 'visit'
  | 'login'
  | 'mirror_started'
  | 'mirror_completed'
  | 'birthchart_entered'
  | 'birthchart_viewed'
  | 'numerology_entered'
  | 'numerology_viewed'
  | 'tarot_drawn'
  | 'tarot_viewed'
  | 'bracelet_view'
  | 'bracelet_craft_click'
  | 'bracelet_craft_start'
  | 'bracelet_craft_complete'
  | 'cart_add'
  | 'purchase';

const VISIT_SESSION_PREFIX = 'mystic_visit_tracked';

/**
 * Ghi nhận một sự kiện hành vi của user vào database.
 * Mọi thao tác đều gắn với user đang đăng nhập (nếu chưa đăng nhập thì bỏ qua).
 */
export async function trackEvent(
  eventType: TrackingEvent,
  metadata: Record<string, unknown> = {},
  explicitUserId?: string
): Promise<void> {
  try {
    let uid = explicitUserId;
    if (!uid) {
      const { data } = await supabase.auth.getSession();
      uid = data.session?.user?.id;
    }
    if (!uid) return;
    await supabase.rpc('track_event', { p_event_type: eventType, p_metadata: metadata });
  } catch (err) {
    // Tracking không được phép làm hỏng trải nghiệm người dùng.
    console.warn('[tracking] Không ghi nhận được sự kiện:', eventType, err);
  }
}

/**
 * Ghi nhận lượt truy cập website — mỗi user chỉ tính 1 lần cho mỗi phiên trình duyệt.
 */
export async function recordVisitOnce(): Promise<void> {
  try {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user?.id;
    if (!uid) return;
    const key = `${VISIT_SESSION_PREFIX}:${uid}`;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key)) return;
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, '1');
    await supabase.rpc('track_event', { p_event_type: 'visit', p_metadata: {} });
  } catch (err) {
    console.warn('[tracking] Không ghi nhận được lượt truy cập:', err);
  }
}

/**
 * Lưu / cập nhật thông tin cá nhân của user đang đăng nhập.
 */
export async function saveMyProfile(input: {
  fullName?: string;
  birthDate?: string;
  gender?: string;
  marketingConsent?: boolean;
}): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.rpc('upsert_my_profile', {
      p_full_name: input.fullName ?? null,
      p_birth_date: input.birthDate || null,
      p_gender: input.gender || null,
      p_marketing_consent: input.marketingConsent ?? null,
    });
    return { error: error ?? null };
  } catch (err) {
    return { error: err as Error };
  }
}

export interface UserProfileRow {
  id: number;
  user_id: string;
  full_name: string | null;
  email: string | null;
  birth_date: string | null;
  gender: string | null;
  marketing_consent: boolean | null;
  created_at: string | null;
  last_login_at: string | null;
  last_visit_at: string | null;
  total_visits: number | null;
  mirror_started: boolean | null;
  mirror_completed: boolean | null;
  mirror_mbti: string | null;
  mirror_completed_at: string | null;
  birthchart_entered: boolean | null;
  birthchart_viewed: boolean | null;
  birthchart_viewed_at: string | null;
  numerology_entered: boolean | null;
  numerology_viewed: boolean | null;
  numerology_viewed_at: string | null;
  tarot_drawn: boolean | null;
  tarot_viewed: boolean | null;
  tarot_viewed_at: string | null;
  bracelet_viewed: boolean | null;
  bracelet_view_count: number | null;
  bracelet_craft_clicked: boolean | null;
  bracelet_craft_started: boolean | null;
  bracelet_craft_completed: boolean | null;
  bracelet_craft_at: string | null;
  cart_added: boolean | null;
  cart_added_at: string | null;
  purchased: boolean | null;
  purchased_at: string | null;
}

/**
 * Lấy hồ sơ (thông tin cá nhân) của user đang đăng nhập.
 */
export async function getMyProfile(userId: string): Promise<UserProfileRow | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as UserProfileRow;
}