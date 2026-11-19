import { supabase } from '@/lib/supabase';

export interface OrderItemRow {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  sku_label?: string | null;
  quantity: number;
  unit_price: number;
  final_price: number | null;
  subtotal: number | null;
}

export interface OrderRecipient {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  address?: string;
  zip?: string;
}

export interface OrderRow {
  id: number;
  customer_id: string | null;
  status: string | null;
  currency: string | null;
  subtotal_items: number | null;
  discount_price: number | null;
  shipping_total?: number | null;
  tax_total?: number | null;
  payment_provider: string | null;
  recipient: OrderRecipient | null;
  created_at: string;
  order_items: OrderItemRow[];
  // Các trường được ghép thêm ở tầng client
  voucher_code?: string | null;
  voucher_discount?: number | null;
  customer_name?: string | null;
  customer_email?: string | null;
}

/** Nhãn + tông màu cho từng trạng thái đơn hàng. */
export const ORDER_STATUS_META: Record<string, { label: string; tone: string; icon: string }> = {
  pending_payment: { label: 'Chờ thanh toán', tone: 'bg-secondary-100/80 text-secondary-900 border-secondary-300/50', icon: 'ri-time-line' },
  paid: { label: 'Đã thanh toán', tone: 'bg-accent-100/80 text-accent-900 border-accent-300/50', icon: 'ri-secure-payment-line' },
  processing: { label: 'Đang xử lý', tone: 'bg-primary-100/80 text-primary-900 border-primary-300/50', icon: 'ri-loader-4-line' },
  shipped: { label: 'Đang giao', tone: 'bg-primary-100/80 text-primary-900 border-primary-300/50', icon: 'ri-truck-line' },
  delivered: { label: 'Hoàn thành', tone: 'bg-accent-100/80 text-accent-900 border-accent-300/50', icon: 'ri-checkbox-circle-line' },
  cancelled: { label: 'Hủy', tone: 'bg-red-900/25 text-red-200 border-red-700/30', icon: 'ri-close-circle-line' },
  refunded: { label: 'Đã hoàn tiền', tone: 'bg-background-200/70 text-foreground-700 border-background-300/50', icon: 'ri-refund-2-line' },
};

export function orderStatusMeta(status: string | null): { label: string; tone: string; icon: string } {
  if (!status) return { label: 'Không rõ', tone: 'bg-background-200/70 text-foreground-700 border-background-300/50', icon: 'ri-question-line' };
  return ORDER_STATUS_META[status] || { label: status, tone: 'bg-background-200/70 text-foreground-700 border-background-300/50', icon: 'ri-record-circle-line' };
}

/** Các trạng thái dùng cho bộ lọc. */
export const ORDER_STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Chờ thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipped', label: 'Đang giao' },
  { value: 'delivered', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Hủy' },
  { value: 'refunded', label: 'Đã hoàn tiền' },
];

export function paymentLabel(provider: string | null): string {
  if (!provider) return '—';
  if (provider === 'cod') return 'Thanh toán khi nhận hàng (COD)';
  if (provider === 'vietqr') return 'Chuyển khoản VietQR';
  return provider;
}

/** Tổng tiền thanh toán của đơn (đã trừ giảm giá). */
export function orderTotal(order: OrderRow): number {
  const subtotal = Number(order.subtotal_items) || 0;
  const discount = Number(order.discount_price) || 0;
  const shipping = Number(order.shipping_total) || 0;
  const tax = Number(order.tax_total) || 0;
  return Math.max(0, subtotal + shipping + tax - discount);
}

/** Mô tả ngắn các sản phẩm trong đơn. */
export function orderProductsSummary(order: OrderRow): string {
  const items = order.order_items || [];
  if (items.length === 0) return '—';
  return items.map((it) => `${it.product_name} ×${it.quantity}`).join(', ');
}

/**
 * Lấy danh sách đơn hàng kèm sản phẩm, voucher đã dùng và thông tin khách.
 * @param userId nếu truyền vào thì chỉ lấy đơn của user đó.
 */
export async function fetchOrders(userId?: string): Promise<OrderRow[]> {
  let query = supabase
    .from('order_headers')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (userId) query = query.eq('customer_id', userId);

  const { data, error } = await query;
  if (error) throw error;
  const orders = (data || []) as OrderRow[];
  if (orders.length === 0) return orders;

  const orderIds = orders.map((o) => o.id);
  const customerIds = Array.from(
    new Set(orders.map((o) => o.customer_id).filter((x): x is string => !!x))
  );

  // Voucher đã dùng theo từng đơn
  const redemptionMap: Record<number, { code: string; amount: number }> = {};
  const { data: reds } = await supabase
    .from('voucher_redemptions')
    .select('order_id, code, discount_amount')
    .in('order_id', orderIds);
  (reds || []).forEach((r: { order_id: number | null; code: string | null; discount_amount: number | null }) => {
    if (r.order_id != null) {
      redemptionMap[r.order_id] = { code: r.code || '', amount: Number(r.discount_amount) || 0 };
    }
  });

  // Thông tin khách hàng (để có tên/email chính xác)
  const profileMap: Record<string, { full_name: string | null; email: string | null }> = {};
  if (customerIds.length > 0) {
    const { data: profs } = await supabase
      .from('user_profiles')
      .select('user_id, full_name, email')
      .in('user_id', customerIds);
    (profs || []).forEach((p: { user_id: string; full_name: string | null; email: string | null }) => {
      profileMap[p.user_id] = { full_name: p.full_name, email: p.email };
    });
  }

  return orders.map((o) => {
    const rec = o.recipient || {};
    const prof = o.customer_id ? profileMap[o.customer_id] : undefined;
    const red = redemptionMap[o.id];
    return {
      ...o,
      voucher_code: red ? red.code : null,
      voucher_discount: red ? red.amount : null,
      customer_name: prof?.full_name || rec.name || null,
      customer_email: rec.email || prof?.email || null,
    };
  });
}