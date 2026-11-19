import { supabase } from '@/lib/supabase';

export type DiscountType = 'percent' | 'fixed';

/** Danh sách sản phẩm có thể gắn điều kiện áp dụng cho voucher. */
export const VOUCHER_PRODUCTS: { id: string; label: string }[] = [
  { id: 'bracelet-custom', label: 'Vòng Tay Cá Nhân Hóa' },
];

export function productLabel(id: string): string {
  return VOUCHER_PRODUCTS.find((p) => p.id === id)?.label || id;
}

export interface Voucher {
  id: number;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order: number | null;
  starts_at: string | null;
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  conditions: string | null;
  applicable_products: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface VoucherInput {
  code: string;
  description?: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order?: number | null;
  starts_at?: string | null;
  expires_at?: string | null;
  max_uses?: number | null;
  active?: boolean;
  conditions?: string | null;
  applicable_products?: string[];
}

/** Lấy toàn bộ voucher (dành cho admin). */
export async function fetchAllVouchers(): Promise<Voucher[]> {
  const { data, error } = await supabase
    .from('vouchers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Voucher[];
}

export async function createVoucher(input: VoucherInput): Promise<{ error: Error | null }> {
  const { error } = await supabase.from('vouchers').insert({
    code: input.code.trim().toUpperCase(),
    description: input.description?.trim() || null,
    discount_type: input.discount_type,
    discount_value: input.discount_value,
    min_order: input.min_order ?? 0,
    starts_at: input.starts_at || null,
    expires_at: input.expires_at || null,
    max_uses: input.max_uses ?? null,
    active: input.active ?? true,
    conditions: input.conditions?.trim() || null,
    applicable_products: input.applicable_products ?? [],
  });
  return { error: error ?? null };
}

export async function updateVoucher(
  id: number,
  input: VoucherInput
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('vouchers')
    .update({
      code: input.code.trim().toUpperCase(),
      description: input.description?.trim() || null,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      min_order: input.min_order ?? 0,
      starts_at: input.starts_at || null,
      expires_at: input.expires_at || null,
      max_uses: input.max_uses ?? null,
      conditions: input.conditions?.trim() || null,
      applicable_products: input.applicable_products ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  return { error: error ?? null };
}

export async function setVoucherActive(
  id: number,
  active: boolean
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('vouchers')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error ?? null };
}

export async function deleteVoucher(id: number): Promise<{ error: Error | null }> {
  const { error } = await supabase.from('vouchers').delete().eq('id', id);
  return { error: error ?? null };
}

export interface VoucherValidation {
  ok: boolean;
  voucher: Voucher | null;
  discount: number;
  message: string;
}

/** Tính số tiền được giảm từ 1 voucher. */
export function computeDiscount(voucher: Voucher, subtotal: number): number {
  const raw =
    voucher.discount_type === 'percent'
      ? (subtotal * Number(voucher.discount_value)) / 100
      : Number(voucher.discount_value);
  return Math.max(0, Math.min(Math.round(raw), subtotal));
}

/**
 * Kiểm tra voucher có hợp lệ với đơn hàng hiện tại không.
 * Kiểm tra đồng thời: tồn tại + đang bật + còn trong thời gian + còn lượt
 * + đạt đơn tối thiểu + có áp dụng cho sản phẩm trong đơn hay không.
 */
export async function validateVoucher(
  code: string,
  subtotal: number,
  productIds: string[] = []
): Promise<VoucherValidation> {
  const clean = code.trim().toUpperCase();
  if (!clean) {
    return { ok: false, voucher: null, discount: 0, message: 'Vui lòng nhập mã voucher.' };
  }

  const { data, error } = await supabase
    .from('vouchers')
    .select('*')
    .eq('code', clean)
    .eq('active', true)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, voucher: null, discount: 0, message: 'Mã voucher không hợp lệ hoặc đã bị tắt.' };
  }

  const voucher = data as Voucher;
  const now = Date.now();

  if (voucher.starts_at && now < new Date(voucher.starts_at).getTime()) {
    return { ok: false, voucher: null, discount: 0, message: 'Mã voucher chưa đến thời gian sử dụng.' };
  }
  if (voucher.expires_at && now > new Date(voucher.expires_at).getTime()) {
    return { ok: false, voucher: null, discount: 0, message: 'Mã voucher đã hết hạn.' };
  }
  if (voucher.max_uses !== null && voucher.used_count >= voucher.max_uses) {
    return { ok: false, voucher: null, discount: 0, message: 'Mã voucher đã hết lượt sử dụng.' };
  }
  if (voucher.min_order && subtotal < Number(voucher.min_order)) {
    return {
      ok: false,
      voucher: null,
      discount: 0,
      message: `Đơn hàng tối thiểu ${Number(voucher.min_order).toLocaleString('vi-VN')} ₫ để dùng mã này.`,
    };
  }

  // Voucher giới hạn theo sản phẩm: nếu có danh sách sản phẩm áp dụng thì đơn phải chứa ít nhất 1 sản phẩm đó.
  const allowed = voucher.applicable_products || [];
  if (allowed.length > 0) {
    const hit = productIds.some((id) => allowed.includes(id));
    if (!hit) {
      return {
        ok: false,
        voucher: null,
        discount: 0,
        message: `Mã voucher chỉ áp dụng cho: ${allowed.map(productLabel).join(', ')}.`,
      };
    }
  }

  return {
    ok: true,
    voucher,
    discount: computeDiscount(voucher, subtotal),
    message: 'Áp dụng mã thành công!',
  };
}

/** Ghi nhận đã dùng voucher (tăng lượt + log redemption). */
export async function redeemVoucher(
  code: string,
  orderId: number,
  discount: number
): Promise<{ error: Error | null }> {
  const { error } = await supabase.rpc('redeem_voucher', {
    p_code: code.trim().toUpperCase(),
    p_order_id: orderId,
    p_discount: discount,
  });
  return { error: error ?? null };
}