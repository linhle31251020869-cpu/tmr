import { supabase } from '@/lib/supabase';
import { UserProfileRow } from '@/lib/tracking';

const DAY_MS = 86400000;

/** Các nhóm hành vi dùng cho bộ lọc ở Admin Dashboard. */
export type UserGroupKey =
  | 'new'
  | 'inactive'
  | 'unexplored'
  | 'partial'
  | 'mirror_not_completed'
  | 'no_product_view'
  | 'tarot_interested'
  | 'bracelet_no_purchase'
  | 'cart_no_purchase'
  | 'purchased';

export interface UserGroupDef {
  key: UserGroupKey;
  label: string;
  icon: string;
  hint: string;
}

export const USER_GROUPS: UserGroupDef[] = [
  { key: 'new', label: 'Mới đăng ký', icon: 'ri-user-add-line', hint: 'Tạo tài khoản trong 7 ngày gần đây' },
  { key: 'inactive', label: 'Lâu không truy cập', icon: 'ri-timer-flash-line', hint: 'Không truy cập từ 30 ngày trở lên' },
  { key: 'unexplored', label: 'Chưa khám phá tính năng', icon: 'ri-compass-3-line', hint: 'Chưa dùng tính năng chính nào' },
  { key: 'partial', label: 'Đã khám phá một phần', icon: 'ri-footprint-line', hint: 'Đã dùng ít nhất 1 tính năng' },
  { key: 'mirror_not_completed', label: 'Chưa hoàn thành Mystic Mirror', icon: 'ri-magic-line', hint: 'Chưa hoàn thành bài trắc nghiệm Mystic Mirror' },
  { key: 'no_product_view', label: 'Chưa xem sản phẩm', icon: 'ri-eye-off-line', hint: 'Chưa từng xem trang sản phẩm (Vòng tay)' },
  { key: 'tarot_interested', label: 'Đã dùng/quan tâm Tarot', icon: 'ri-layout-grid-line', hint: 'Đã rút hoặc xem kết quả Tarot' },
  { key: 'bracelet_no_purchase', label: 'Xem vòng tay chưa mua', icon: 'ri-hand-heart-line', hint: 'Đã xem vòng tay nhưng chưa mua' },
  { key: 'cart_no_purchase', label: 'Giỏ hàng chưa thanh toán', icon: 'ri-shopping-bag-3-line', hint: 'Đã thêm giỏ nhưng chưa mua' },
  { key: 'purchased', label: 'Đã mua hàng', icon: 'ri-vip-crown-line', hint: 'Đã hoàn tất mua hàng' },
];

/** Số tính năng chính dùng để tính tiến độ khám phá. */
export const TOTAL_FEATURES = 6;

/** Số ngày kể từ lần truy cập cuối (null nếu chưa từng truy cập). */
export function inactiveDays(profile: UserProfileRow): number | null {
  const ref = profile.last_visit_at || profile.last_login_at || profile.created_at;
  if (!ref) return null;
  return Math.max(0, Math.floor((Date.now() - new Date(ref).getTime()) / DAY_MS));
}

/** Chuỗi mô tả thời gian tương đối: "5 ngày trước", "3 giờ trước"... */
export function relativeFromNow(value: string | null): string {
  if (!value) return '—';
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 0) return 'vừa xong';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 ngày trước';
  if (days < 30) return `${days} ngày trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;
  return `${Math.floor(months / 12)} năm trước`;
}

export function isNewUser(profile: UserProfileRow): boolean {
  if (!profile.created_at) return false;
  return (Date.now() - new Date(profile.created_at).getTime()) / DAY_MS <= 7;
}

/** Số tính năng mà user đã chạm tới. */
export function exploredFeatureCount(profile: UserProfileRow): number {
  return [
    profile.mirror_started,
    profile.birthchart_entered || profile.birthchart_viewed,
    profile.numerology_entered || profile.numerology_viewed,
    profile.tarot_drawn || profile.tarot_viewed,
    profile.bracelet_viewed,
    profile.bracelet_craft_started || profile.bracelet_craft_completed,
  ].filter(Boolean).length;
}

/** Tiến độ khám phá website (%) dựa trên các tính năng chính. */
export function exploredProgress(profile: UserProfileRow): number {
  return Math.round((exploredFeatureCount(profile) / TOTAL_FEATURES) * 100);
}

/** Phân loại 1 user vào các nhóm hành vi. */
export function classifyUser(profile: UserProfileRow): UserGroupKey[] {
  const groups: UserGroupKey[] = [];
  if (isNewUser(profile)) groups.push('new');

  const inactive = inactiveDays(profile);
  if (inactive !== null && inactive >= 30) groups.push('inactive');

  if (exploredFeatureCount(profile) === 0) groups.push('unexplored');
  else groups.push('partial');

  if (!profile.mirror_completed) groups.push('mirror_not_completed');
  if (!profile.bracelet_viewed) groups.push('no_product_view');
  if (profile.tarot_drawn || profile.tarot_viewed) groups.push('tarot_interested');
  if (profile.bracelet_viewed && !profile.purchased) groups.push('bracelet_no_purchase');
  if (profile.cart_added && !profile.purchased) groups.push('cart_no_purchase');
  if (profile.purchased) groups.push('purchased');

  return groups;
}

/** Lấy toàn bộ hồ sơ user (dành cho admin). */
export async function fetchAllUserProfiles(): Promise<UserProfileRow[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as UserProfileRow[];
}

/** Lấy 1 hồ sơ theo user_id. */
export async function fetchUserProfileById(userId: string): Promise<UserProfileRow | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return null;
  return (data as UserProfileRow) || null;
}

export interface UserEventRow {
  id: number;
  user_id: string;
  event_type: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/** Lấy toàn bộ sự kiện hành vi của 1 user, mới nhất trước. */
export async function fetchUserEvents(userId: string): Promise<UserEventRow[]> {
  const { data, error } = await supabase
    .from('user_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(300);
  if (error) throw error;
  return (data || []) as UserEventRow[];
}

/** Nhãn + icon cho từng loại sự kiện timeline. */
export const EVENT_META: Record<string, { label: string; icon: string }> = {
  visit: { label: 'Truy cập website', icon: 'ri-earth-line' },
  login: { label: 'Đăng nhập', icon: 'ri-login-box-line' },
  mirror_started: { label: 'Bắt đầu Mystic Mirror', icon: 'ri-magic-line' },
  mirror_completed: { label: 'Hoàn thành Mystic Mirror', icon: 'ri-sparkling-2-line' },
  birthchart_entered: { label: 'Nhập ngày sinh (Moon Window)', icon: 'ri-calendar-event-line' },
  birthchart_viewed: { label: 'Xem Birth Chart', icon: 'ri-moon-clear-line' },
  numerology_entered: { label: 'Nhập thông tin Numerology', icon: 'ri-numbers-line' },
  numerology_viewed: { label: 'Xem kết quả Numerology', icon: 'ri-hashtag' },
  tarot_drawn: { label: 'Rút bài Tarot', icon: 'ri-layout-grid-line' },
  tarot_viewed: { label: 'Xem kết quả Tarot', icon: 'ri-eye-line' },
  bracelet_view: { label: 'Xem trang Vòng tay', icon: 'ri-hand-heart-line' },
  bracelet_craft_click: { label: 'Bấm "Chế tác"', icon: 'ri-cursor-line' },
  bracelet_craft_start: { label: 'Bắt đầu chế tác', icon: 'ri-hammer-line' },
  bracelet_craft_complete: { label: 'Hoàn thành chế tác', icon: 'ri-checkbox-circle-line' },
  cart_add: { label: 'Thêm vào giỏ hàng', icon: 'ri-shopping-bag-3-line' },
  purchase: { label: 'Mua hàng', icon: 'ri-vip-crown-line' },
};

export function eventMeta(type: string): { label: string; icon: string } {
  return EVENT_META[type] || { label: type, icon: 'ri-record-circle-line' };
}