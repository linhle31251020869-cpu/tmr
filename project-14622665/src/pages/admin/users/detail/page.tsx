import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { UserProfileRow } from '@/lib/tracking';
import {
  fetchUserProfileById,
  fetchUserEvents,
  UserEventRow,
  classifyUser,
  inactiveDays,
  eventMeta,
  USER_GROUPS,
} from '@/lib/adminUsers';
import { fetchOrders, OrderRow, orderStatusMeta, orderTotal, paymentLabel } from '@/lib/adminOrders';
import AdminTabs from '@/pages/admin/components/AdminTabs';
import { deleteAccount } from '@/lib/account';

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

const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

interface BehaviorItem {
  key: string;
  label: string;
  icon: string;
  done: boolean;
  at: string | null;
  extra?: string;
}

function buildBehaviors(p: UserProfileRow): BehaviorItem[] {
  return [
    {
      key: 'mirror',
      label: 'Mystic Mirror',
      icon: 'ri-magic-line',
      done: !!(p.mirror_completed || p.mirror_started),
      at: p.mirror_completed_at,
      extra: p.mirror_mbti ? `MBTI: ${p.mirror_mbti}` : undefined,
    },
    {
      key: 'birthchart',
      label: 'Birth Chart (Moon Window)',
      icon: 'ri-moon-clear-line',
      done: !!p.birthchart_viewed,
      at: p.birthchart_viewed_at,
      extra: p.birthchart_entered ? 'Đã nhập ngày sinh' : undefined,
    },
    {
      key: 'numerology',
      label: 'Numerology',
      icon: 'ri-numbers-line',
      done: !!p.numerology_viewed,
      at: p.numerology_viewed_at,
      extra: p.numerology_entered ? 'Đã nhập thông tin' : undefined,
    },
    {
      key: 'tarot',
      label: 'Tarot Reflection',
      icon: 'ri-layout-grid-line',
      done: !!p.tarot_viewed,
      at: p.tarot_viewed_at,
      extra: p.tarot_drawn ? 'Đã rút bài' : undefined,
    },
    {
      key: 'bracelet',
      label: 'Xem Vòng Tay',
      icon: 'ri-hand-heart-line',
      done: !!p.bracelet_viewed,
      at: null,
      extra: `Số lần xem: ${p.bracelet_view_count ?? 0}`,
    },
    {
      key: 'craft',
      label: 'Chế Tác Vòng Tay',
      icon: 'ri-hammer-line',
      done: !!(p.bracelet_craft_completed || p.bracelet_craft_started),
      at: p.bracelet_craft_at,
      extra: p.bracelet_craft_completed ? 'Đã hoàn thành' : p.bracelet_craft_started ? 'Đang thực hiện' : undefined,
    },
    {
      key: 'cart',
      label: 'Thêm Vào Giỏ Hàng',
      icon: 'ri-shopping-bag-3-line',
      done: !!p.cart_added,
      at: p.cart_added_at,
    },
    {
      key: 'purchase',
      label: 'Mua Hàng',
      icon: 'ri-vip-crown-line',
      done: !!p.purchased,
      at: p.purchased_at,
    },
  ];
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [events, setEvents] = useState<UserEventRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [p, e, ord] = await Promise.all([
        fetchUserProfileById(id),
        fetchUserEvents(id),
        fetchOrders(id),
      ]);
      setProfile(p);
      setEvents(e);
      setOrders(ord);
    } catch (err) {
      console.error('Lỗi tải chi tiết người dùng:', err);
      setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const confirmDelete = async () => {
    if (!profile) return;
    setDeleting(true);
    setDeleteError(null);
    const { error: delErr } = await deleteAccount(profile.user_id);
    if (delErr) {
      setDeleting(false);
      setDeleteError('Không thể xóa người dùng này. Vui lòng thử lại.');
      return;
    }
    navigate('/admin/users');
  };

  const goBack = (
    <Link to="/admin/users" className="mystic-btn-outline !px-4 !py-2 text-sm whitespace-nowrap">
      <i className="ri-arrow-left-line" /> Danh Sách
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto relative z-10">
          <AdminTabs />
          <div className="py-16 text-center">
            <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
            <p className="mystic-text text-sm mt-4">Đang tải hồ sơ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto relative z-10">
          <AdminTabs />
          <div className="mystic-card rounded-2xl p-12 text-center">
            <i className="ri-user-unfollow-line text-3xl text-mystic-purple-300/60 inline-block mb-4" />
            <p className="mystic-text text-sm opacity-70 mb-5">
              {error || 'Không tìm thấy người dùng này.'}
            </p>
            <button onClick={load} className="mystic-btn-outline mx-auto">
              <i className="ri-refresh-line" /> Thử Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const behaviors = buildBehaviors(profile);
  const groups = classifyUser(profile);
  const inactive = inactiveDays(profile);
  const initial = (profile.full_name || profile.email || '?').trim().charAt(0).toUpperCase();

  const infoRows: { label: string; value: string }[] = [
    { label: 'Ngày đăng ký', value: formatDateTime(profile.created_at) },
    { label: 'Lần đăng nhập gần nhất', value: formatDateTime(profile.last_login_at) },
    { label: 'Lần truy cập gần nhất', value: formatDateTime(profile.last_visit_at) },
    { label: 'Tổng số lần truy cập', value: String(profile.total_visits ?? 0) },
    { label: 'Số ngày không hoạt động', value: inactive === null ? '—' : `${inactive} ngày` },
    { label: 'Ngày sinh', value: profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('vi-VN') : '—' },
    { label: 'Giới tính', value: profile.gender === 'female' ? 'Nữ' : profile.gender === 'male' ? 'Nam' : profile.gender === 'other' ? 'Khác' : '—' },
    { label: 'Đồng ý email marketing', value: profile.marketing_consent ? 'Có' : 'Không' },
    { label: 'Đã gửi email welcome', value: formatDateTime(profile.welcome_email_sent_at) },
  ];

  return (
    <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto relative z-10">
        <AdminTabs />

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {goBack}
          <button
            onClick={() => { setDeleteOpen(true); setDeleteError(null); }}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10 px-4 py-2 text-sm whitespace-nowrap transition-colors cursor-pointer"
          >
            <i className="ri-delete-bin-6-line" /> Xóa Tài Khoản
          </button>
        </div>

        {/* Header card */}
        <div className="mystic-card rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-900 border border-mystic-purple-500/40 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-mystic-gold-300">{initial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="mystic-heading text-2xl font-bold text-mystic-gold-400 truncate">
                {profile.full_name || 'Chưa đặt tên'}
              </h1>
              <p className="text-sm text-mystic-purple-200 truncate">{profile.email || '—'}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {groups.map((g) => {
                  const def = USER_GROUPS.find((x) => x.key === g);
                  if (!def) return null;
                  return (
                    <span key={g} className="px-2.5 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-[11px] text-mystic-purple-100 whitespace-nowrap">
                      <i className={`${def.icon} mr-1`} />
                      {def.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal info */}
          <div className="mystic-card rounded-2xl p-6">
            <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-4">
              <i className="ri-id-card-line mr-2" />Thông Tin
            </h2>
            <dl className="flex flex-col gap-3">
              {infoRows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 text-sm border-b border-mystic-purple-800/20 last:border-0 pb-2.5 last:pb-0">
                  <dt className="text-mystic-purple-300/80">{row.label}</dt>
                  <dd className="text-white text-right break-words">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Behavior checklist */}
          <div className="mystic-card rounded-2xl p-6">
            <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-4">
              <i className="ri-route-line mr-2" />Hành Trình
            </h2>
            <ul className="flex flex-col gap-3">
              {behaviors.map((b) => (
                <li key={b.key} className="flex items-start gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      b.done
                        ? 'bg-accent-100/80 border-accent-300/50 text-accent-900'
                        : 'bg-background-200/60 border-background-300/50 text-foreground-500'
                    }`}
                  >
                    <i className={`${b.icon} text-sm`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${b.done ? 'text-white' : 'text-mystic-purple-300/70'}`}>{b.label}</p>
                    <p className="text-xs text-mystic-purple-300/70">
                      {b.done ? (
                        <>
                          {b.at ? formatDateTime(b.at) : 'Đã thực hiện'}
                          {b.extra ? ` · ${b.extra}` : ''}
                        </>
                      ) : (
                        'Chưa thực hiện'
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lịch sử mua hàng */}
        <div className="mystic-card rounded-2xl p-6 mb-6">
          <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-4">
            <i className="ri-shopping-bag-3-line mr-2" />Lịch Sử Mua Hàng
            {orders.length > 0 && (
              <span className="ml-2 text-xs font-normal text-mystic-purple-300/70">({orders.length} đơn)</span>
            )}
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-mystic-purple-300/70 py-6 text-center">
              Người dùng này chưa có đơn hàng nào.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o) => {
                const st = orderStatusMeta(o.status);
                return (
                  <div key={o.id} className="rounded-xl bg-mystic-purple-900/25 border border-mystic-purple-700/25 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-mystic-gold-400">#{o.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] border ${st.tone}`}>
                            <i className={`${st.icon} mr-1`} />{st.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-mystic-purple-300/60 mt-1">{formatDateTime(o.created_at)}</p>
                      </div>
                      <span className="text-sm font-bold text-mystic-gold-400 whitespace-nowrap">{formatVND(orderTotal(o))}</span>
                    </div>
                    <ul className="flex flex-col gap-1 mb-2">
                      {(o.order_items || []).map((it) => (
                        <li key={it.id} className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-mystic-purple-200 min-w-0 truncate">
                            {it.product_name} <span className="text-mystic-purple-300/60">×{it.quantity}</span>
                          </span>
                          <span className="text-white whitespace-nowrap">
                            {formatVND((Number(it.final_price ?? it.unit_price) || 0) * it.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-mystic-purple-200/90">
                      <span><i className="ri-wallet-3-line mr-1 text-mystic-gold-400/80" />{paymentLabel(o.payment_provider)}</span>
                      {o.voucher_code ? (
                        <span className="text-mystic-gold-300">
                          <i className="ri-coupon-3-line mr-1" />{o.voucher_code}
                          {o.voucher_discount ? ` (−${formatVND(Number(o.voucher_discount))})` : ''}
                        </span>
                      ) : (
                        <span className="text-mystic-purple-300/50"><i className="ri-coupon-3-line mr-1" />Không dùng voucher</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="mystic-card rounded-2xl p-6 mb-10">
          <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-4">
            <i className="ri-history-line mr-2" />Timeline Hành Động
          </h2>
          {events.length === 0 ? (
            <p className="text-sm text-mystic-purple-300/70 py-6 text-center">
              Chưa có hành động nào được ghi nhận.
            </p>
          ) : (
            <ol className="relative border-l border-mystic-purple-700/30 ml-3">
              {events.map((ev) => {
                const meta = eventMeta(ev.event_type);
                const mbti = ev.metadata && typeof ev.metadata === 'object' ? (ev.metadata as Record<string, unknown>).mbti : undefined;
                return (
                  <li key={ev.id} className="ml-6 pb-5 last:pb-0">
                    <span className="absolute -left-[13px] w-6 h-6 rounded-full bg-mystic-purple-900/60 border border-mystic-purple-600/40 flex items-center justify-center">
                      <i className={`${meta.icon} text-xs text-mystic-gold-400`} />
                    </span>
                    <p className="text-sm text-white">{meta.label}</p>
                    <p className="text-xs text-mystic-purple-300/70">
                      {formatDateTime(ev.created_at)}
                      {mbti ? ` · MBTI: ${String(mbti)}` : ''}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>

      {deleteOpen && profile && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center px-4 modal-backdrop"
          style={{ background: 'rgba(6, 4, 15, 0.85)' }}
          onClick={() => { if (!deleting) setDeleteOpen(false); }}
        >
          <div
            className="w-full max-w-md mystic-card rounded-2xl p-6 md:p-8 modal-pop border-red-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-line text-red-300 text-2xl" />
            </div>
            <h3 className="mystic-heading text-lg font-bold text-red-300 text-center mb-2">Xóa Người Dùng?</h3>
            <p className="text-sm text-mystic-purple-200 text-center leading-relaxed mb-2 font-inter">
              Bạn sắp xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của:
            </p>
            <p className="text-sm text-white text-center font-medium mb-5">
              {profile.full_name || 'Chưa đặt tên'}<br />
              <span className="text-xs text-mystic-purple-300/70">{profile.email || '—'}</span>
            </p>
            {deleteError && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">{deleteError}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                className="mystic-btn-outline text-sm justify-center flex-1 disabled:opacity-50 whitespace-nowrap"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="text-sm justify-center flex-1 inline-flex items-center gap-2 rounded-full bg-red-500/90 hover:bg-red-500 text-white px-5 py-2.5 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                {deleting ? (
                  <><i className="ri-loader-4-line animate-spin" /> Đang xóa...</>
                ) : (
                  <><i className="ri-delete-bin-6-line" /> Xóa Vĩnh Viễn</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}