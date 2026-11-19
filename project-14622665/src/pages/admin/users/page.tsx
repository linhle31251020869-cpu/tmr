import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfileRow } from '@/lib/tracking';
import {
  fetchAllUserProfiles,
  classifyUser,
  inactiveDays,
  relativeFromNow,
  exploredProgress,
  USER_GROUPS,
  UserGroupKey,
} from '@/lib/adminUsers';
import AdminTabs from '@/pages/admin/components/AdminTabs';
import { deleteAccount } from '@/lib/account';

function formatDateShort(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function BoolDot({ value, title }: { value: boolean | null; title: string }) {
  return value ? (
    <span title={`${title}: Có`} className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-accent-100/80 text-accent-900">
      <i className="ri-check-line text-xs" />
    </span>
  ) : (
    <span title={`${title}: Chưa`} className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-background-200/70 text-foreground-500">
      <i className="ri-subtract-line text-xs" />
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-1.5 rounded-full bg-background-200/60 overflow-hidden">
        <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-mystic-purple-200 w-9 text-right tabular-nums">{value}%</span>
    </div>
  );
}

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<UserProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<UserGroupKey | 'all'>('all');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<UserProfileRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllUserProfiles();
      setProfiles(data);
    } catch (e) {
      console.error('Lỗi tải danh sách người dùng:', e);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    const { error } = await deleteAccount(deleteTarget.user_id);
    if (error) {
      setDeleting(false);
      setDeleteError('Không thể xóa người dùng này. Vui lòng thử lại.');
      return;
    }
    setDeleting(false);
    setDeleteTarget(null);
    await load();
  };

  const filtered = useMemo(() => {
    let result = profiles;
    if (activeGroup !== 'all') {
      result = result.filter((p) => classifyUser(p).includes(activeGroup));
    }
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          (p.full_name || '').toLowerCase().includes(q) ||
          (p.email || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [profiles, activeGroup, search]);

  const groupCount = (key: UserGroupKey) =>
    profiles.filter((p) => classifyUser(p).includes(key)).length;

  return (
    <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto relative z-10">
        <AdminTabs />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="mystic-heading text-3xl md:text-4xl font-bold text-mystic-gold-400">
              Người Dùng
            </h1>
            <p className="mystic-text text-sm opacity-70 mt-2">
              Theo dõi hành trình từng người dùng và mức độ tương tác với website.
            </p>
          </div>
          <div className="mystic-card rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-bold text-mystic-gold-400">{profiles.length}</p>
            <p className="text-[11px] text-mystic-purple-200/70 uppercase tracking-wide">Tổng người dùng</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-sm text-red-200 flex items-center gap-3 flex-wrap">
            <i className="ri-error-warning-line" />
            <span className="flex-1 min-w-[180px]">{error}</span>
            <button onClick={load} disabled={loading} className="mystic-btn-outline !px-3 !py-1.5 text-xs whitespace-nowrap disabled:opacity-50">
              <i className="ri-refresh-line" /> Thử Lại
            </button>
          </div>
        )}

        {/* Group filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setActiveGroup('all')}
            className={`px-3.5 py-2 rounded-full text-sm border transition-all cursor-pointer whitespace-nowrap ${
              activeGroup === 'all'
                ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                : 'border-mystic-purple-700/30 bg-mystic-purple-900/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
            }`}
          >
            <i className="ri-group-line mr-1.5" /> Tất cả ({profiles.length})
          </button>
          {USER_GROUPS.map((g) => {
            const count = groupCount(g.key);
            const active = activeGroup === g.key;
            return (
              <button
                key={g.key}
                onClick={() => setActiveGroup(g.key)}
                title={g.hint}
                className={`px-3.5 py-2 rounded-full text-sm border transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                    : 'border-mystic-purple-700/30 bg-mystic-purple-900/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
                }`}
              >
                <i className={`${g.icon} mr-1.5`} /> {g.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-mystic-purple-300/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-sm text-mystic-purple-100 placeholder:text-mystic-purple-300/50 outline-none focus:border-mystic-purple-500/50 transition-colors"
          />
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
            <p className="mystic-text text-sm mt-4">Đang tải người dùng...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mystic-card rounded-2xl p-12 text-center">
            <i className="ri-user-search-line text-3xl text-mystic-purple-300/60 inline-block mb-4" />
            <p className="mystic-text text-sm opacity-60">Chưa có người dùng nào phù hợp bộ lọc.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block mystic-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-mystic-purple-700/30 text-left text-[11px] uppercase tracking-wide text-mystic-purple-300/70">
                      <th className="px-4 py-3 font-medium">Người dùng</th>
                      <th className="px-3 py-3 font-medium">MBTI</th>
                      <th className="px-3 py-3 font-medium" title="Tiến độ khám phá website">Tiến độ</th>
                      <th className="px-3 py-3 font-medium">Đăng ký</th>
                      <th className="px-3 py-3 font-medium">Đăng nhập cuối</th>
                      <th className="px-3 py-3 font-medium">Truy cập cuối</th>
                      <th className="px-3 py-3 font-medium" title="Số ngày không hoạt động">Không HĐ</th>
                      <th className="px-2 py-3 font-medium text-center" title="Mystic Mirror">Mirror</th>
                      <th className="px-2 py-3 font-medium text-center" title="Birth Chart">Chart</th>
                      <th className="px-2 py-3 font-medium text-center" title="Numerology">Num</th>
                      <th className="px-2 py-3 font-medium text-center" title="Tarot">Tarot</th>
                      <th className="px-2 py-3 font-medium text-center" title="Đã xem vòng tay">Vòng</th>
                      <th className="px-2 py-3 font-medium text-center" title="Đã chế tác">Chế</th>
                      <th className="px-2 py-3 font-medium text-center" title="Đã thêm giỏ hàng">Giỏ</th>
                      <th className="px-2 py-3 font-medium text-center" title="Đã mua hàng">Mua</th>
                      <th className="px-3 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const inactive = inactiveDays(p);
                      const progress = exploredProgress(p);
                      return (
                        <tr key={p.id} className="border-b border-mystic-purple-800/20 last:border-0 hover:bg-mystic-purple-900/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white truncate max-w-[180px]">{p.full_name || 'Chưa đặt tên'}</div>
                            <div className="text-xs text-mystic-purple-300/70 truncate max-w-[180px]">{p.email || '—'}</div>
                          </td>
                          <td className="px-3 py-3">
                            {p.mirror_completed && p.mirror_mbti ? (
                              <span className="px-2 py-0.5 rounded-full bg-primary-100/80 text-primary-900 text-[11px] font-medium whitespace-nowrap">
                                {p.mirror_mbti}
                              </span>
                            ) : (
                              <span className="text-mystic-purple-300/40">—</span>
                            )}
                          </td>
                          <td className="px-3 py-3"><ProgressBar value={progress} /></td>
                          <td className="px-3 py-3 text-mystic-purple-200 whitespace-nowrap">{formatDateShort(p.created_at)}</td>
                          <td className="px-3 py-3 text-mystic-purple-200 whitespace-nowrap">{relativeFromNow(p.last_login_at)}</td>
                          <td className="px-3 py-3 text-mystic-purple-200 whitespace-nowrap">{relativeFromNow(p.last_visit_at)}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {inactive === null ? (
                              <span className="text-mystic-purple-300/50">—</span>
                            ) : (
                              <span className={inactive >= 30 ? 'text-red-300' : 'text-mystic-purple-200'}>{inactive} ngày</span>
                            )}
                          </td>
                          <td className="px-2 py-3 text-center"><BoolDot value={p.mirror_completed || p.mirror_started} title="Mystic Mirror" /></td>
                          <td className="px-2 py-3 text-center"><BoolDot value={p.birthchart_viewed} title="Birth Chart" /></td>
                          <td className="px-2 py-3 text-center"><BoolDot value={p.numerology_viewed} title="Numerology" /></td>
                          <td className="px-2 py-3 text-center"><BoolDot value={p.tarot_viewed} title="Tarot" /></td>
                          <td className="px-2 py-3 text-center"><BoolDot value={p.bracelet_viewed} title="Vòng tay" /></td>
                          <td className="px-2 py-3 text-center"><BoolDot value={p.bracelet_craft_completed || p.bracelet_craft_started} title="Chế tác" /></td>
                          <td className="px-2 py-3 text-center"><BoolDot value={p.cart_added} title="Giỏ hàng" /></td>
                          <td className="px-2 py-3 text-center"><BoolDot value={p.purchased} title="Mua hàng" /></td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <Link to={`/admin/users/${p.user_id}`} className="mystic-btn-outline !px-3 !py-1.5 text-xs whitespace-nowrap">
                                Chi Tiết <i className="ri-arrow-right-s-line" />
                              </Link>
                              <button
                                onClick={() => { setDeleteTarget(p); setDeleteError(null); }}
                                title="Xóa người dùng"
                                className="w-8 h-8 rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <i className="ri-delete-bin-6-line text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden flex flex-col gap-3">
              {filtered.map((p) => {
                const inactive = inactiveDays(p);
                const progress = exploredProgress(p);
                return (
                  <div key={p.id} className="mystic-card rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{p.full_name || 'Chưa đặt tên'}</p>
                        <p className="text-xs text-mystic-purple-300/70 truncate">{p.email || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/admin/users/${p.user_id}`} className="mystic-btn-outline !px-3 !py-1.5 text-xs whitespace-nowrap">
                          Chi Tiết
                        </Link>
                        <button
                          onClick={() => { setDeleteTarget(p); setDeleteError(null); }}
                          title="Xóa người dùng"
                          className="w-8 h-8 rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <i className="ri-delete-bin-6-line text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      {p.mirror_completed && p.mirror_mbti && (
                        <span className="px-2 py-0.5 rounded-full bg-primary-100/80 text-primary-900 text-[11px] font-medium">{p.mirror_mbti}</span>
                      )}
                      <div className="flex-1"><ProgressBar value={progress} /></div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-mystic-purple-200">
                      <span>Đăng ký: {formatDateShort(p.created_at)}</span>
                      <span>Đăng nhập: {relativeFromNow(p.last_login_at)}</span>
                      <span>Truy cập: {relativeFromNow(p.last_visit_at)}</span>
                      <span className={inactive !== null && inactive >= 30 ? 'text-red-300' : ''}>
                        {inactive === null ? 'Chưa hoạt động' : `${inactive} ngày không HĐ`}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.purchased && <span className="px-2 py-0.5 rounded-full bg-accent-100/80 text-accent-900 text-[11px]">Đã mua</span>}
                      {p.cart_added && !p.purchased && <span className="px-2 py-0.5 rounded-full bg-secondary-100/80 text-secondary-900 text-[11px]">Có giỏ</span>}
                      {p.bracelet_viewed && <span className="px-2 py-0.5 rounded-full bg-mystic-purple-900/40 text-mystic-purple-100 text-[11px]">Xem vòng</span>}
                      {p.mirror_completed && <span className="px-2 py-0.5 rounded-full bg-mystic-purple-900/40 text-mystic-purple-100 text-[11px]">Mirror</span>}
                      {p.tarot_viewed && <span className="px-2 py-0.5 rounded-full bg-mystic-purple-900/40 text-mystic-purple-100 text-[11px]">Tarot</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete user confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center px-4 modal-backdrop"
          style={{ background: 'rgba(6, 4, 15, 0.85)' }}
          onClick={() => { if (!deleting) setDeleteTarget(null); }}
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
              {deleteTarget.full_name || 'Chưa đặt tên'}<br />
              <span className="text-xs text-mystic-purple-300/70">{deleteTarget.email || '—'}</span>
            </p>
            {deleteError && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">{deleteError}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
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