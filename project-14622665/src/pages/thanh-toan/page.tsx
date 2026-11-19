import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/tracking';
import { validateVoucher, redeemVoucher, Voucher } from '@/lib/vouchers';

const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

interface OrderDraft {
  sizeLabel: string;
  stoneName: string;
  stoneColor: string;
  stonePrice: number;
  charms: { id: string; name: string; price: number; image: string }[];
  total: number;
}

interface Region {
  code: number;
  name: string;
}

type PaymentMethod = 'cod' | 'online';

const selectClass =
  'w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 focus:outline-none focus:border-mystic-purple-500/50 cursor-pointer';
const optionClass = 'bg-mystic-purple-900 text-mystic-purple-200';

export default function ThanhToan() {
  const { user } = useAuth();

  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);

  // Shipping form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [note, setNote] = useState('');

  // Address cascade
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [wards, setWards] = useState<Region[]>([]);
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [paidQr, setPaidQr] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [ordered, setOrdered] = useState(false);

  // Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [voucherBusy, setVoucherBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('mystic_bracelet_order');
      if (raw) setDraft(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoadingDraft(false);
  }, []);

  // Load provinces
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then((r) => r.json())
      .then((data: Region[]) => setProvinces(Array.isArray(data) ? data : []))
      .catch(() => setProvinces([]));
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setWards([]);
      setDistrict('');
      setWard('');
      return;
    }
    setAddressLoading(true);
    fetch(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
      .then((r) => r.json())
      .then((data) => {
        const p = Array.isArray(data) ? data[0] : data;
        setDistricts(p?.districts || []);
        setDistrict('');
        setWards([]);
        setWard('');
      })
      .catch(() => setDistricts([]))
      .finally(() => setAddressLoading(false));
  }, [province]);

  // Load wards when district changes
  useEffect(() => {
    if (!district) {
      setWards([]);
      setWard('');
      return;
    }
    setAddressLoading(true);
    fetch(`https://provinces.open-api.vn/api/d/${district}?depth=2`)
      .then((r) => r.json())
      .then((data) => {
        const d = Array.isArray(data) ? data[0] : data;
        setWards(d?.wards || []);
        setWard('');
      })
      .catch(() => setWards([]))
      .finally(() => setAddressLoading(false));
  }, [district]);

  const items = useMemo(() => {
    if (!draft) return [];
    const list: { label: string; price: number }[] = [];
    if (draft.stoneName) {
      list.push({ label: `Đá chính — ${draft.stoneName}`, price: draft.stonePrice });
    }
    draft.charms.forEach((c) => {
      list.push({ label: `Charm — ${c.name}`, price: c.price });
    });
    return list;
  }, [draft]);

  const payableTotal = Math.max(0, (draft?.total || 0) - voucherDiscount);

  const handleApplyVoucher = async () => {
    if (!draft) return;
    setVoucherBusy(true);
    setVoucherMsg(null);
    const res = await validateVoucher(voucherCode, draft.total, ['bracelet-custom']);
    setVoucherBusy(false);
    if (!res.ok || !res.voucher) {
      setAppliedVoucher(null);
      setVoucherDiscount(0);
      setVoucherMsg({ type: 'err', text: res.message });
      return;
    }
    setAppliedVoucher(res.voucher);
    setVoucherDiscount(res.discount);
    setVoucherMsg({ type: 'ok', text: res.message });
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherDiscount(0);
    setVoucherCode('');
    setVoucherMsg(null);
  };

  const provinceName = provinces.find((p) => String(p.code) === province)?.name || '';
  const districtName = districts.find((d) => String(d.code) === district)?.name || '';
  const wardName = wards.find((w) => String(w.code) === ward)?.name || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    if (!draft) {
      setFormError('Không tìm thấy thông tin đơn hàng. Vui lòng quay lại thiết kế sản phẩm.');
      return;
    }
    if (!name.trim() || !phone.trim() || !province || !district || !ward || !street.trim()) {
      setFormError('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }
    if (paymentMethod === 'online' && !paidQr) {
      setFormError('Vui lòng quét mã QR để chuyển khoản và nhấn "Đã thanh toán" trước khi đặt hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const fullAddress = [street.trim(), wardName, districtName, provinceName]
        .filter(Boolean)
        .join(', ');

      const recipient = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        city: provinceName,
        state: districtName,
        address: fullAddress,
      };

      const { data: header, error: headerErr } = await supabase
        .from('order_headers')
        .insert({
          customer_id: user?.id ?? null,
          status: paymentMethod === 'online' ? 'paid' : 'pending_payment',
          currency: 'VND',
          payment_provider: paymentMethod === 'cod' ? 'cod' : 'vietqr',
          subtotal_items: draft.total,
          discount_price: voucherDiscount || 0,
          customer_notes: note.trim() || null,
          recipient,
        })
        .select('id')
        .single();

      if (headerErr) throw headerErr;

      const orderItems = items.map((it) => ({
        order_id: header.id,
        product_id: 'bracelet-custom',
        product_name: it.label,
        quantity: 1,
        unit_price: it.price,
        final_price: it.price,
        subtotal: it.price,
      }));

      const { error: itemErr } = await supabase.from('order_items').insert(orderItems);
      if (itemErr) throw itemErr;

      if (appliedVoucher && voucherDiscount > 0) {
        await redeemVoucher(appliedVoucher.code, header.id, voucherDiscount);
      }

      if (user) {
        void trackEvent('purchase', { total: draft.total, orderId: header.id }, user.id);
      }

      sessionStorage.removeItem('mystic_bracelet_order');
      setOrdered(true);
    } catch {
      setFormError('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDraft) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-20 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-mystic-purple-300">
          <i className="ri-loader-4-line animate-spin" /> Đang tải...
        </div>
      </div>
    );
  }

  if (!draft && !ordered) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-20 flex items-center justify-center px-6">
        <div className="mystic-card rounded-2xl p-10 text-center max-w-md">
          <h1 className="mystic-heading text-xl font-bold text-mystic-gold-400 mb-3">
            Chưa Có Đơn Hàng
          </h1>
          <p className="mystic-text text-sm opacity-70 mb-6">
            Bạn chưa chọn sản phẩm nào. Hãy quay lại thiết kế vòng tay của bạn nhé.
          </p>
          <Link to="/thiet-ke-vong" className="mystic-btn-gold text-sm">
            <i className="ri-arrow-left-line" /> Thiết Kế Vòng Tay
          </Link>
        </div>
      </div>
    );
  }

  if (ordered) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-20 flex items-center justify-center px-6">
        <div className="mystic-card rounded-2xl p-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 flex items-center justify-center mx-auto mb-4 glow-purple">
            <i className="ri-check-line text-3xl text-mystic-gold-400" />
          </div>
          <h1 className="mystic-heading text-xl font-bold text-mystic-gold-400 mb-2">
            Đặt Hàng Thành Công!
          </h1>
          <p className="mystic-text text-sm opacity-70 mb-6">
            Cảm ơn bạn! Chúng tôi sẽ liên hệ để xác nhận đơn hàng trong thời gian sớm nhất.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/thiet-ke-vong" className="mystic-btn-outline text-sm justify-center">
              <i className="ri-arrow-left-line" /> Tiếp Tục Mua Sắm
            </Link>
            <Link to="/" className="mystic-btn-gold text-sm justify-center">
              <i className="ri-home-4-line" /> Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      {/* Header */}
      <section className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 star-bg">
        <div className="absolute inset-0 bg-mystic-radial" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4 text-mystic-purple-300">
            <Link to="/thiet-ke-vong" className="text-sm hover:text-white transition-colors">
              <i className="ri-arrow-left-line mr-1" /> Thiết Kế Vòng
            </Link>
            <span className="text-mystic-purple-600">/</span>
            <span className="text-sm text-mystic-gold-400">Thanh Toán</span>
          </div>
          <h1 className="mystic-heading text-2xl md:text-3xl font-bold text-glow-gold mb-3">
            Hoàn Tất Đơn Hàng
          </h1>
          <p className="mystic-text text-sm max-w-2xl opacity-70">
            Kiểm tra lại đơn hàng, điền thông tin giao hàng và chọn phương thức thanh toán để hoàn tất.
          </p>
        </div>
      </section>

      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto relative z-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Shipping + Payment */}
            <div className="lg:col-span-3 space-y-6">
              {/* Shipping */}
              <div className="mystic-card rounded-2xl p-6 md:p-8">
                <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-6">
                  Thông Tin Giao Hàng
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Họ Và Tên</label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập họ tên của bạn"
                      className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Số Điện Thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Email (tùy chọn)</label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50"
                      />
                    </div>
                  </div>

                  {/* Address cascade */}
                  <div>
                    <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Địa Chỉ Giao Hàng</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <select
                          name="province"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className={selectClass}
                        >
                          <option value="" className={optionClass}>Tỉnh / Thành phố</option>
                          {provinces.map((p) => (
                            <option key={p.code} value={p.code} className={optionClass}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          name="district"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          disabled={!province}
                          className={`${selectClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="" className={optionClass}>Quận / Huyện</option>
                          {districts.map((d) => (
                            <option key={d.code} value={d.code} className={optionClass}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          name="ward"
                          value={ward}
                          onChange={(e) => setWard(e.target.value)}
                          disabled={!district}
                          className={`${selectClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="" className={optionClass}>Phường / Xã</option>
                          {wards.map((w) => (
                            <option key={w.code} value={w.code} className={optionClass}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="street"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Tên đường, tòa nhà, số nhà"
                          className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50"
                        />
                      </div>
                    </div>
                    {addressLoading && (
                      <p className="text-xs text-mystic-purple-300/60 flex items-center gap-1.5">
                        <i className="ri-loader-4-line animate-spin" /> Đang tải dữ liệu địa chỉ...
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Ghi Chú (tùy chọn)</label>
                    <textarea
                      name="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                      maxLength={500}
                      className="w-full h-20 bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl p-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mystic-card rounded-2xl p-6 md:p-8">
                <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-6">
                  Phương Thức Thanh Toán
                </h2>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full flex items-center gap-4 rounded-xl p-4 text-left transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-mystic-gold-900/10 border border-mystic-gold-500/50'
                        : 'bg-mystic-purple-900/30 border border-mystic-purple-700/30 hover:border-mystic-purple-500/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'cod' ? 'border-mystic-gold-400' : 'border-mystic-purple-500/50'}`}>
                      {paymentMethod === 'cod' && <span className="w-2.5 h-2.5 rounded-full bg-mystic-gold-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Thanh Toán Khi Nhận Hàng (COD)</p>
                      <p className="text-xs text-mystic-purple-300/70 mt-0.5">Trả tiền mặt khi nhận được sản phẩm.</p>
                    </div>
                    <i className="ri-cash-line text-mystic-gold-400 text-lg" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`w-full flex items-center gap-4 rounded-xl p-4 text-left transition-all cursor-pointer ${
                      paymentMethod === 'online'
                        ? 'bg-mystic-gold-900/10 border border-mystic-gold-500/50'
                        : 'bg-mystic-purple-900/30 border border-mystic-purple-700/30 hover:border-mystic-purple-500/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'online' ? 'border-mystic-gold-400' : 'border-mystic-purple-500/50'}`}>
                      {paymentMethod === 'online' && <span className="w-2.5 h-2.5 rounded-full bg-mystic-gold-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Thanh Toán Ngay</p>
                      <p className="text-xs text-mystic-purple-300/70 mt-0.5">Quét mã QR để chuyển khoản thanh toán ngay.</p>
                    </div>
                    <i className="ri-qr-code-line text-mystic-gold-400 text-lg" />
                  </button>

                  {paymentMethod === 'online' && draft && (
                    <div className="mystic-card rounded-xl p-5 mt-4 border-mystic-gold-500/30">
                      <p className="text-center text-sm text-mystic-purple-200 mb-1">Quét mã để thanh toán</p>
                      <p className="text-center text-xs text-mystic-purple-300/70 mb-4">Mã QR minh họa (bản demo)</p>

                      <div className="flex justify-center mb-4">
                        <div className="bg-white rounded-2xl p-4 shadow-inner">
                          <img
                            src="https://readdy.ai/api/search-image?query=Clean%20minimal%20black%20and%20white%20QR%20code%20square%20pattern%20on%20plain%20white%20background%2C%20crisp%20flat%20vector%20style%20graphic%2C%20no%20text&width=300&height=300&seq=qr-demo-placeholder-2026-01&orientation=squarish"
                            alt="Mã QR thanh toán minh họa"
                            title="Mã QR thanh toán minh họa"
                            width={220}
                            height={220}
                            loading="lazy"
                            decoding="async"
                            className="w-44 h-44 rounded-lg"
                          />
                        </div>
                      </div>

                      <p className="text-center text-xs text-mystic-purple-300/60 mb-1">
                        Mã QR minh họa · <span className="text-mystic-gold-400">bản demo</span>
                      </p>

                      <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-xs text-mystic-purple-300/70">Số tiền:</span>
                        <span className="text-sm font-semibold text-mystic-gold-400">{formatVND(payableTotal)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPaidQr(!paidQr)}
                        className={`flex items-center justify-center gap-2 w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                          paidQr
                            ? 'bg-mystic-gold-500/15 border-mystic-gold-500/60 text-mystic-gold-400'
                            : 'bg-mystic-purple-900/30 border-mystic-purple-700/30 text-mystic-purple-200 hover:border-mystic-gold-500/40'
                        }`}
                      >
                        <i className={paidQr ? 'ri-checkbox-circle-line' : 'ri-checkbox-blank-circle-line'} />
                        {paidQr ? 'Đã thanh toán — đã xác nhận' : 'Đã thanh toán'}
                      </button>
                      <p className="text-[11px] text-mystic-purple-300/50 text-center mt-3">
                        Đây là mã QR minh họa. Thông tin thanh toán chính thức sẽ được gửi kèm khi xác nhận đơn hàng.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="mystic-card rounded-2xl p-6 md:p-8 sticky top-24">
                <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-6">
                  Chi Tiết Đơn Hàng
                </h2>

                {draft && (
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full border border-white/20 shrink-0"
                      style={{ background: draft.stoneColor, boxShadow: `0 0 12px ${draft.stoneColor}60` }}
                    />
                    <div>
                      <p className="text-sm text-white font-medium">Vòng Tay Năng Lượng</p>
                      <p className="text-xs text-mystic-purple-300/70">{draft.sizeLabel}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2.5 mb-5">
                  {items.map((it) => (
                    <div key={it.label} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-mystic-purple-200/80 flex-1">{it.label}</span>
                      <span className="text-white whitespace-nowrap">{formatVND(it.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="mystic-divider my-4" />

                {/* Voucher */}
                <div className="mb-4">
                  {appliedVoucher ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-mystic-gold-900/15 border border-mystic-gold-600/40 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm text-mystic-gold-300 font-medium flex items-center gap-2">
                          <i className="ri-coupon-3-line" /> {appliedVoucher.code}
                        </p>
                        <p className="text-xs text-accent-300 mt-0.5">Đã giảm {formatVND(voucherDiscount)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-mystic-purple-300 hover:text-red-300 hover:bg-mystic-purple-900/40 transition-colors cursor-pointer shrink-0"
                        title="Bỏ mã giảm giá"
                      >
                        <i className="ri-close-line" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                          placeholder="Nhập mã voucher"
                          className="flex-1 bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50 tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={handleApplyVoucher}
                          disabled={voucherBusy || !voucherCode.trim()}
                          className="mystic-btn-outline text-sm whitespace-nowrap disabled:opacity-50"
                        >
                          {voucherBusy ? <i className="ri-loader-4-line animate-spin" /> : 'Áp Dụng'}
                        </button>
                      </div>
                      {voucherMsg && (
                        <p className={`text-xs mt-2 flex items-center gap-1.5 ${voucherMsg.type === 'ok' ? 'text-accent-300' : 'text-red-300'}`}>
                          <i className={voucherMsg.type === 'ok' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} />
                          {voucherMsg.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mystic-divider my-4" />

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mystic-purple-300/80">Tạm tính</span>
                    <span className="text-white">{formatVND(draft?.total || 0)}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-mystic-purple-300/80">Giảm giá</span>
                      <span className="text-accent-300">-{formatVND(voucherDiscount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-mystic-purple-300">Tổng Cộng</span>
                  <span className="mystic-heading text-2xl font-bold text-mystic-gold-400 text-glow-gold">
                    {formatVND(payableTotal)}
                  </span>
                </div>

                {formError && (
                  <div className="mb-4 rounded-xl bg-red-900/20 border border-red-500/30 p-3 text-sm text-red-300">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mystic-btn-gold text-sm justify-center w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin" /> Đang Xử Lý...
                    </>
                  ) : (
                    <>
                      <i className="ri-secure-payment-line" /> Xác Nhận Đặt Hàng
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}