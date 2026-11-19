import { useEffect, useMemo, useState } from 'react';
import {
  Voucher,
  VoucherInput,
  DiscountType,
  VOUCHER_PRODUCTS,
  productLabel,
  fetchAllVouchers,
  createVoucher,
  updateVoucher,
  setVoucherActive,
  deleteVoucher,
} from '@/lib/vouchers';
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

/** Chuyển ISO string -> giá trị cho input datetime-local. */
function toLocalInput(value: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type FormState = {
  code: string;
  description: string;
  conditions: string;
  applicable_product: string;
  discount_type: DiscountType;
  discount_value: string;
  min_order: string;
  starts_at: string;
  expires_at: string;
  max_uses: string;
  active: boolean;
};

const emptyForm: FormState = {
  code: '',
  description: '',
  conditions: '',
  applicable_product: '',
  discount_type: 'percent',
  discount_value: '',
  min_order: '',
  starts_at: '',
  expires_at: '',
  max_uses: '',
  active: true,
};

function voucherStatus(v: Voucher): { label: string; tone: string } {
  if (!v.active) return { label: 'Đã tắt', tone: 'bg-background-200/70 text-foreground-700 border-background-300/50' };
  const now = Date.now();
  if (v.starts_at && now < new Date(v.starts_at).getTime())
    return { label: 'Sắp diễn ra', tone: 'bg-secondary-100/80 text-secondary-900 border-secondary-300/50' };
  if (v.expires_at && now > new Date(v.expires_at).getTime())
    return { label: 'Hết hạn', tone: 'bg-red-900/25 text-red-200 border-red-700/30' };
  if (v.max_uses !== null && v.used_count >= v.max_uses)
    return { label: 'Hết lượt', tone: 'bg-red-900/25 text-red-200 border-red-700/30' };
  return { label: 'Đang hoạt động', tone: 'bg-accent-100/80 text-accent-900 border-accent-300/50' };
}

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Voucher | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setVouchers(await fetchAllVouchers());
    } catch (e) {
      console.error('Lỗi tải voucher:', e);
      setError('Không thể tải danh sách voucher. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const active = vouchers.filter((v) => voucherStatus(v).label === 'Đang hoạt động').length;
    const totalUsed = vouchers.reduce((s, v) => s + (v.used_count || 0), 0);
    return { total: vouchers.length, active, totalUsed };
  }, [vouchers]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (v: Voucher) => {
    setEditing(v);
    setForm({
      code: v.code,
      description: v.description || '',
      conditions: v.conditions || '',
      applicable_product: (v.applicable_products && v.applicable_products[0]) || '',
      discount_type: v.discount_type,
      discount_value: String(v.discount_value ?? ''),
      min_order: v.min_order ? String(v.min_order) : '',
      starts_at: toLocalInput(v.starts_at),
      expires_at: toLocalInput(v.expires_at),
      max_uses: v.max_uses !== null ? String(v.max_uses) : '',
      active: v.active,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    const value = Number(form.discount_value);
    if (!form.code.trim()) {
      setFormError('Vui lòng nhập mã voucher.');
      return;
    }
    if (!value || value <= 0) {
      setFormError('Giá trị giảm phải lớn hơn 0.');
      return;
    }
    if (form.discount_type === 'percent' && value > 100) {
      setFormError('Giảm theo % không được vượt quá 100.');
      return;
    }
    if (form.starts_at && form.expires_at && new Date(form.starts_at) >= new Date(form.expires_at)) {
      setFormError('Thời gian hết hạn phải sau thời gian bắt đầu.');
      return;
    }

    const payload: VoucherInput = {
      code: form.code,
      description: form.description,
      conditions: form.conditions,
      applicable_products: form.applicable_product ? [form.applicable_product] : [],
      discount_type: form.discount_type,
      discount_value: value,
      min_order: form.min_order ? Number(form.min_order) : 0,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      active: form.active,
    };

    setBusy(true);
    setFormError('');
    try {
      const { error: err } = editing
        ? await updateVoucher(editing.id, payload)
        : await createVoucher(payload);
      if (err) {
        setFormError(
          err.message.includes('duplicate')
            ? 'Mã voucher này đã tồn tại.'
            : 'Không thể lưu voucher. Vui lòng thử lại.'
        );
        return;
      }
      setModalOpen(false);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (v: Voucher) => {
    setBusy(true);
    try {
      await setVoucherActive(v.id, !v.active);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await deleteVoucher(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    'w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50';
  const labelClass = 'block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2';

  return (
    <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto relative z-10">
        <AdminTabs />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="mystic-heading text-3xl md:text-4xl font-bold text-mystic-gold-400">
              Voucher
            </h1>
            <p className="mystic-text text-sm opacity-70 mt-2">
              Tạo mã giảm giá, đặt thời hạn và theo dõi số lượt sử dụng.
            </p>
          </div>
          <button onClick={openCreate} className="mystic-btn-gold whitespace-nowrap">
            <i className="ri-add-line" /> Voucher Mới
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="mystic-card rounded-xl px-5 py-4">
            <p className="text-2xl font-bold text-mystic-gold-400">{stats.total}</p>
            <p className="text-[11px] text-mystic-purple-200/70 uppercase tracking-wide">Tổng voucher</p>
          </div>
          <div className="mystic-card rounded-xl px-5 py-4">
            <p className="text-2xl font-bold text-accent-900 dark:text-accent-300">{stats.active}</p>
            <p className="text-[11px] text-mystic-purple-200/70 uppercase tracking-wide">Đang hoạt động</p>
          </div>
          <div className="mystic-card rounded-xl px-5 py-4">
            <p className="text-2xl font-bold text-mystic-gold-400">{stats.totalUsed}</p>
            <p className="text-[11px] text-mystic-purple-200/70 uppercase tracking-wide">Lượt đã dùng</p>
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

        {loading ? (
          <div className="py-16 text-center">
            <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
            <p className="mystic-text text-sm mt-4">Đang tải voucher...</p>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="mystic-card rounded-2xl p-12 text-center">
            <i className="ri-coupon-3-line text-3xl text-mystic-purple-300/60 inline-block mb-4" />
            <p className="mystic-text text-sm opacity-60 mb-5">Chưa có voucher nào. Hãy tạo mã đầu tiên.</p>
            <button onClick={openCreate} className="mystic-btn-gold mx-auto">
              <i className="ri-add-line" /> Voucher Mới
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {vouchers.map((v) => {
              const st = voucherStatus(v);
              const usage = v.max_uses !== null ? `${v.used_count}/${v.max_uses}` : `${v.used_count} (không giới hạn)`;
              return (
                <div key={v.id} className="mystic-card rounded-xl p-4 flex items-center gap-4 flex-wrap">
                  <div className="w-14 h-14 rounded-lg bg-mystic-gold-900/15 border border-mystic-gold-700/30 flex items-center justify-center shrink-0 text-mystic-gold-400">
                    <i className="ri-coupon-3-line text-2xl" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="mystic-heading text-lg font-bold text-mystic-gold-400 tracking-wide">
                        {v.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] border ${st.tone}`}>{st.label}</span>
                    </div>
                    <p className="text-sm text-mystic-purple-200 mt-1">
                      Giảm{' '}
                      <span className="text-white font-medium">
                        {v.discount_type === 'percent' ? `${v.discount_value}%` : formatVND(Number(v.discount_value))}
                      </span>
                      {v.min_order ? ` · Đơn tối thiểu ${formatVND(Number(v.min_order))}` : ''}
                    </p>
                    <p className="text-[11px] text-mystic-purple-300/60 mt-1">
                      {formatDateTime(v.starts_at)} → {formatDateTime(v.expires_at)} · Đã dùng {usage}
                    </p>
                    {(v.conditions || (v.applicable_products && v.applicable_products.length > 0)) && (
                      <p className="text-[11px] text-mystic-purple-300/60 mt-1 flex flex-wrap gap-x-3">
                        {v.applicable_products && v.applicable_products.length > 0 && (
                          <span><i className="ri-price-tag-3-line mr-1" />{v.applicable_products.map(productLabel).join(', ')}</span>
                        )}
                        {v.conditions && <span><i className="ri-information-line mr-1" />{v.conditions}</span>}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(v)}
                      disabled={busy}
                      className="mystic-btn-outline !px-4 !py-2 text-xs whitespace-nowrap disabled:opacity-50"
                    >
                      <i className={v.active ? 'ri-toggle-fill' : 'ri-toggle-line'} />
                      {v.active ? 'Đang Bật' : 'Đang Tắt'}
                    </button>
                    <button
                      onClick={() => openEdit(v)}
                      className="mystic-btn-primary !px-4 !py-2 text-xs whitespace-nowrap"
                    >
                      <i className="ri-edit-line" /> Sửa
                    </button>
                    <button
                      onClick={() => setDeleteTarget(v)}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-red-700/30 text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Xóa voucher"
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 py-8 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-pop mystic-card rounded-2xl p-7 md:p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-6">
              {editing ? 'Chỉnh Sửa Voucher' : 'Tạo Voucher Mới'}
            </h3>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Mã voucher</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="MYSTIC10"
                  className={`${inputClass} tracking-widest`}
                />
              </div>

              <div>
                <label className={labelClass}>Mô tả (tùy chọn)</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Giảm 10% cho đơn hàng đầu tiên"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Điều kiện áp dụng (tùy chọn)</label>
                <input
                  type="text"
                  value={form.conditions}
                  onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                  placeholder="Chỉ dùng cho vòng tay cá nhân hóa, mỗi khách 1 lần..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Sản phẩm / dịch vụ được áp dụng</label>
                <select
                  value={form.applicable_product}
                  onChange={(e) => setForm({ ...form, applicable_product: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" className="bg-mystic-purple-900 text-mystic-purple-200">Tất cả sản phẩm</option>
                  {VOUCHER_PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.id} className="bg-mystic-purple-900 text-mystic-purple-200">
                      {prod.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Loại giảm</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as DiscountType })}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="percent" className="bg-mystic-purple-900 text-mystic-purple-200">Giảm theo %</option>
                    <option value="fixed" className="bg-mystic-purple-900 text-mystic-purple-200">Giảm số tiền</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    {form.discount_type === 'percent' ? 'Giá trị giảm (%)' : 'Giá trị giảm (₫)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    placeholder={form.discount_type === 'percent' ? '10' : '50000'}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Đơn tối thiểu (₫)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.min_order}
                    onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Số lượt tối đa</label>
                  <input
                    type="number"
                    min={0}
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                    placeholder="Để trống = không giới hạn"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                    className={`${inputClass} cursor-pointer`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hết hạn</label>
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className={`${inputClass} cursor-pointer`}
                  />
                </div>
              </div>

              {!editing && (
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      form.active ? 'bg-mystic-gold-500 border-mystic-gold-400' : 'border-mystic-purple-600/60'
                    }`}
                  >
                    {form.active && <i className="ri-check-line text-[11px] font-bold" style={{ color: '#0a0618' }} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="sr-only"
                  />
                  <span className="text-xs text-mystic-purple-300 font-inter">Bật voucher này ngay sau khi tạo</span>
                </label>
              )}

              {formError && (
                <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-3 text-sm text-red-300 flex items-start gap-2">
                  <i className="ri-error-warning-line mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={() => setModalOpen(false)} className="mystic-btn-outline flex-1 justify-center">
                Hủy
              </button>
              <button onClick={handleSave} disabled={busy} className="mystic-btn-gold flex-1 justify-center disabled:opacity-50">
                {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
                {editing ? 'Lưu Thay Đổi' : 'Tạo Voucher'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div
          className="modal-backdrop fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
          onClick={() => setDeleteTarget(null)}
        >
          <div className="modal-pop mystic-card rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-700/30 flex items-center justify-center mb-4">
              <i className="ri-delete-bin-6-line text-xl text-red-300" />
            </div>
            <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-2">Xóa Voucher?</h3>
            <p className="mystic-text text-sm opacity-70 mb-6">
              Bạn sắp xóa vĩnh viễn voucher <strong className="text-white">{deleteTarget.code}</strong>. Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="mystic-btn-outline flex-1 justify-center">
                Hủy
              </button>
              <button onClick={confirmDelete} disabled={busy} className="mystic-btn-gold flex-1 justify-center !bg-red-600 disabled:opacity-50">
                <i className="ri-delete-bin-line" /> Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}