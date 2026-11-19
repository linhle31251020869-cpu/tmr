import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  OrderRow,
  fetchOrders,
  orderStatusMeta,
  orderTotal,
  paymentLabel,
  ORDER_STATUS_OPTIONS,
} from '@/lib/adminOrders';
import AdminTabs from '@/pages/admin/components/AdminTabs';

const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const inputClass =
  'w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-2.5 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50';
const labelClass = 'block text-[11px] text-mystic-purple-300/60 uppercase tracking-wider mb-1.5';

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await fetchOrders());
    } catch (e) {
      console.error('Lỗi tải đơn hàng:', e);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const paymentOptions = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.payment_provider) set.add(o.payment_provider);
    });
    return Array.from(set);
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const pq = productFilter.trim().toLowerCase();
    const fromTs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const toTs = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;

    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (paymentFilter && o.payment_provider !== paymentFilter) return false;

      if (q) {
        const haystack = [
          o.customer_name || '',
          o.customer_email || '',
          String(o.id),
          o.customer_id || '',
          o.recipient?.phone || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (pq) {
        const hit = (o.order_items || []).some((it) =>
          (it.product_name || '').toLowerCase().includes(pq)
        );
        if (!hit) return false;
      }

      if (fromTs !== null || toTs !== null) {
        const t = new Date(o.created_at).getTime();
        if (fromTs !== null && t < fromTs) return false;
        if (toTs !== null && t > toTs) return false;
      }

      return true;
    });
  }, [orders, search, statusFilter, paymentFilter, productFilter, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status || ''))
      .reduce((s, o) => s + orderTotal(o), 0);
    const pending = orders.filter((o) => o.status === 'pending_payment').length;
    return { total: orders.length, revenue, pending };
  }, [orders]);

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPaymentFilter('');
    setProductFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto relative z-10">
        <AdminTabs />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="mystic-heading text-3xl md:text-4xl font-bold text-mystic-gold-400">
              Đơn Hàng
            </h1>
            <p className="mystic-text text-sm opacity-70 mt-2">
              Lịch sử mua hàng của toàn bộ khách, gắn với đúng tài khoản người dùng.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="mystic-card rounded-xl px-5 py-4">
            <p className="text-2xl font-bold text-mystic-gold-400">{stats.total}</p>
            <p className="text-[11px] text-mystic-purple-200/70 uppercase tracking-wide">Tổng đơn hàng</p>
          </div>
          <div className="mystic-card rounded-xl px-5 py-4">
            <p className="text-2xl font-bold text-accent-900 dark:text-accent-300">{formatVND(stats.revenue)}</p>
            <p className="text-[11px] text-mystic-purple-200/70 uppercase tracking-wide">Doanh thu đã ghi nhận</p>
          </div>
          <div className="mystic-card rounded-xl px-5 py-4">
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-300">{stats.pending}</p>
            <p className="text-[11px] text-mystic-purple-200/70 uppercase tracking-wide">Chờ thanh toán</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-sm text-red-200 flex items-center gap-3 flex-wrap">
            <i className="ri-error-warning-line" />
            <span className="flex-1 min-w-[180px]">{error}</span>
            <button onClick={load} className="mystic-btn-outline !px-3 !py-1.5 text-xs whitespace-nowrap">
              <i className="ri-refresh-line" /> Thử Lại
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mystic-card rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <label className={labelClass}>Tìm khách hàng / mã đơn</label>
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-mystic-purple-300/60" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tên, email, SĐT hoặc mã đơn..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Trạng thái đơn</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} cursor-pointer`}>
                <option value="" className="bg-mystic-purple-900">Tất cả trạng thái</option>
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-mystic-purple-900">{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Phương thức thanh toán</label>
              <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={`${inputClass} cursor-pointer`}>
                <option value="" className="bg-mystic-purple-900">Tất cả phương thức</option>
                {paymentOptions.map((p) => (
                  <option key={p} value={p} className="bg-mystic-purple-900">{paymentLabel(p)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Sản phẩm</label>
              <input
                type="text"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                placeholder="Tên sản phẩm..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Từ ngày</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`${inputClass} cursor-pointer`} />
            </div>

            <div>
              <label className={labelClass}>Đến ngày</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`${inputClass} cursor-pointer`} />
            </div>

            <div className="flex items-end">
              <button onClick={resetFilters} className="mystic-btn-outline text-sm whitespace-nowrap w-full justify-center">
                <i className="ri-refresh-line" /> Xóa Bộ Lọc
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-mystic-purple-300/60 mb-4">
          Hiển thị <span className="text-mystic-gold-400 font-medium">{filtered.length}</span> / {orders.length} đơn hàng
        </p>

        {loading ? (
          <div className="py-16 text-center">
            <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
            <p className="mystic-text text-sm mt-4">Đang tải đơn hàng...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mystic-card rounded-2xl p-12 text-center">
            <i className="ri-shopping-bag-3-line text-3xl text-mystic-purple-300/60 inline-block mb-4" />
            <p className="mystic-text text-sm opacity-60">Chưa có đơn hàng nào phù hợp bộ lọc.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-10">
            {filtered.map((o) => {
              const st = orderStatusMeta(o.status);
              const rec = o.recipient || {};
              return (
                <div key={o.id} className="mystic-card rounded-xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="mystic-heading text-base font-bold text-mystic-gold-400">#{o.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] border ${st.tone}`}>
                          <i className={`${st.icon} mr-1`} />{st.label}
                        </span>
                      </div>
                      <p className="text-sm text-white mt-1.5">
                        {o.customer_name || 'Khách vãng lai'}
                        {o.customer_email ? <span className="text-mystic-purple-300/70"> · {o.customer_email}</span> : null}
                      </p>
                      <p className="text-[11px] text-mystic-purple-300/60 mt-0.5 flex flex-wrap gap-x-3">
                        {rec.phone ? <span><i className="ri-phone-line mr-1" />{rec.phone}</span> : null}
                        <span title="User ID"><i className="ri-fingerprint-line mr-1" />{o.customer_id || 'khách vãng lai'}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-mystic-gold-400 text-glow-gold">{formatVND(orderTotal(o))}</p>
                      <p className="text-[11px] text-mystic-purple-300/60">{formatDateTime(o.created_at)}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="rounded-lg bg-mystic-purple-900/25 border border-mystic-purple-700/20 p-3 mb-3">
                    <ul className="flex flex-col gap-1.5">
                      {(o.order_items || []).map((it) => (
                        <li key={it.id} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-mystic-purple-200 min-w-0 truncate">
                            {it.product_name}
                            <span className="text-mystic-purple-300/60"> ×{it.quantity}</span>
                          </span>
                          <span className="text-white whitespace-nowrap">
                            {formatVND((Number(it.final_price ?? it.unit_price) || 0) * it.quantity)}
                          </span>
                        </li>
                      ))}
                      {(o.order_items || []).length === 0 && (
                        <li className="text-xs text-mystic-purple-300/50">Không có sản phẩm.</li>
                      )}
                    </ul>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-mystic-purple-200/90">
                    <span><i className="ri-wallet-3-line mr-1 text-mystic-gold-400/80" />{paymentLabel(o.payment_provider)}</span>
                    {o.voucher_code ? (
                      <span className="text-mystic-gold-300">
                        <i className="ri-coupon-3-line mr-1" />{o.voucher_code}
                        {o.voucher_discount ? ` (−${formatVND(Number(o.voucher_discount))})` : ''}
                      </span>
                    ) : (
                      <span className="text-mystic-purple-300/50"><i className="ri-coupon-3-line mr-1" />Không dùng voucher</span>
                    )}
                    {Number(o.discount_price) > 0 && (
                      <span className="text-accent-300">Giảm: −{formatVND(Number(o.discount_price))}</span>
                    )}
                  </div>

                  {o.customer_id && (
                    <div className="mt-3 pt-3 border-t border-mystic-purple-800/30">
                      <Link
                        to={`/admin/users/${o.customer_id}`}
                        className="text-xs text-mystic-gold-400 hover:text-mystic-gold-300 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <i className="ri-user-line" /> Xem hồ sơ khách hàng <i className="ri-arrow-right-s-line" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}