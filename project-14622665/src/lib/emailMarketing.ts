import { supabase } from '@/lib/supabase';
import { UserProfileRow } from '@/lib/tracking';
import { exploredFeatureCount, inactiveDays } from '@/lib/adminUsers';

const DAY_MS = 86400000;

export type EmailSegmentKey =
  | 'new_signup'
  | 'unexplored'
  | 'bracelet_no_purchase'
  | 'cart_no_purchase'
  | 'inactive';

export interface EmailSegment {
  key: EmailSegmentKey;
  label: string;
  subject: string;
  description: string;
  icon: string;
}

/**
 * Các chiến dịch email theo hành vi.
 * Chỉ áp dụng cho user đã đồng ý nhận email marketing.
 */
export const EMAIL_SEGMENTS: EmailSegment[] = [
  {
    key: 'new_signup',
    label: 'User mới đăng ký',
    subject: 'Welcome Email',
    description: 'Gửi ngay cho người vừa tạo tài khoản trong 7 ngày gần đây.',
    icon: 'ri-user-add-line',
  },
  {
    key: 'unexplored',
    label: 'Chưa khám phá tính năng',
    subject: 'Email giới thiệu tính năng',
    description: 'Đã đăng ký nhưng chưa thử bất kỳ trải nghiệm nào.',
    icon: 'ri-compass-3-line',
  },
  {
    key: 'bracelet_no_purchase',
    label: 'Xem vòng tay chưa mua',
    subject: 'Email giới thiệu sản phẩm / ưu đãi',
    description: 'Đã xem sản phẩm vòng tay nhưng chưa hoàn tất mua hàng.',
    icon: 'ri-hand-heart-line',
  },
  {
    key: 'cart_no_purchase',
    label: 'Giỏ hàng chưa thanh toán',
    subject: 'Abandoned Cart Email',
    description: 'Đã thêm vào giỏ nhưng chưa đặt hàng.',
    icon: 'ri-shopping-bag-3-line',
  },
  {
    key: 'inactive',
    label: 'Lâu ngày không truy cập',
    subject: 'Re-engagement Email',
    description: 'Không quay lại website từ 30 ngày trở lên.',
    icon: 'ri-timer-flash-line',
  },
];

/** Lọc danh sách user thuộc 1 nhóm chiến dịch (đã đồng ý nhận email). */
export function segmentUsers(
  profiles: UserProfileRow[],
  key: EmailSegmentKey
): UserProfileRow[] {
  const consented = profiles.filter((p) => p.marketing_consent && p.email);
  return consented.filter((p) => {
    switch (key) {
      case 'new_signup':
        return !!p.created_at && (Date.now() - new Date(p.created_at).getTime()) / DAY_MS <= 7;
      case 'unexplored':
        return exploredFeatureCount(p) === 0;
      case 'bracelet_no_purchase':
        return !!p.bracelet_viewed && !p.purchased;
      case 'cart_no_purchase':
        return !!p.cart_added && !p.purchased;
      case 'inactive': {
        const days = inactiveDays(p);
        return days !== null && days >= 30;
      }
      default:
        return false;
    }
  });
}

/**
 * Gửi email welcome cho user vừa đăng ký thành công.
 * Chỉ được gọi ngay sau khi tạo tài khoản mới (không gọi khi đăng nhập).
 * Backend (edge function) tự kiểm tra: chỉ gửi cho tài khoản mới, không gửi trùng,
 * và bỏ qua an toàn nếu dịch vụ email chưa được cấu hình.
 * Lỗi gửi email KHÔNG bao giờ làm hỏng việc đăng ký.
 */
export async function sendWelcomeEmail(): Promise<void> {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;

    const { error } = await supabase.functions.invoke('send-welcome-email', {
      body: { source: 'signup' },
    });

    // Chỉ thử lại một lần khi bản thân lời gọi gặp lỗi tạm thời (mạng / function),
    // không thử lại khi backend đã phản hồi rõ ràng (đã gửi / đã gửi trước đó / chưa cấu hình).
    if (error) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      await supabase.functions.invoke('send-welcome-email', { body: { source: 'signup' } });
    }
  } catch (err) {
    console.warn('[email] Không gửi được email welcome:', err);
  }
}