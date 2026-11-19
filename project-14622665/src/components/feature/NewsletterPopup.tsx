import { useEffect, useState, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const DISMISS_KEY = 'mystic_newsletter_dismissed_until';
const MIN_DELAY_MS = 12000;
const DISMISS_DAYS = 14;

type PopupStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Popup đăng ký nhận tin cho khách CHƯA có tài khoản.
 * Lưu email vào bảng newsletter_subscribers để dùng cho email marketing.
 */
export default function NewsletterPopup() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<PopupStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loading || user) return;
    if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return;
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (until && Date.now() < until) return;
    const timer = setTimeout(() => setOpen(true), MIN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [loading, user, pathname]);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 86400000));
    } catch {
      // bỏ qua nếu trình duyệt chặn localStorage
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const hp = (form.elements.namedItem('website_alt') as HTMLInputElement | null)?.value?.trim();
    // Honeypot: bot điền vào thì coi như thành công nhưng KHÔNG ghi dữ liệu.
    if (hp) {
      setStatus('success');
      setMessage('Cảm ơn bạn đã đăng ký nhận tin!');
      return;
    }

    const fd = new FormData(form);
    const emailValue = String(fd.get('email') || '').trim().toLowerCase();
    const nameValue = String(fd.get('name') || '').trim();
    const consentValue = consent;
    if (!emailValue) return;

    setStatus('submitting');
    setMessage(null);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        name: nameValue || null,
        email: emailValue,
        marketing_consent: consentValue,
        source: 'popup',
      });
      // 23505 = đã tồn tại → coi như đăng ký thành công.
      if (error && error.code !== '23505') throw error;
      setStatus('success');
      setMessage('Cảm ơn bạn! Những điều kỳ diệu sẽ sớm ghé vào hộp thư của bạn.');
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 86400000));
      } catch {
        // bỏ qua
      }
    } catch (err) {
      console.error('Lỗi đăng ký nhận tin:', err);
      setStatus('error');
      setMessage('Không thể đăng ký lúc này. Vui lòng thử lại sau.');
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8 overflow-y-auto"
      onClick={dismiss}
    >
      <div
        className="modal-pop mystic-card rounded-2xl max-w-md w-full p-7 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Đóng"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-mystic-purple-300 hover:text-white hover:bg-mystic-purple-900/40 transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-lg" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-900 border border-mystic-purple-500/40 flex items-center justify-center glow-purple">
              <i className="ri-mail-check-line text-2xl text-mystic-gold-300" />
            </div>
            <h3 className="mystic-heading text-xl font-bold text-mystic-gold-400 mb-2">
              Đã Ghi Nhận!
            </h3>
            <p className="mystic-text text-sm opacity-80">{message}</p>
            <button onClick={dismiss} className="mystic-btn-primary mt-6 justify-center w-full">
              <i className="ri-check-line" /> Tuyệt Vời
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-900 border border-mystic-purple-500/40 flex items-center justify-center glow-purple">
                <i className="ri-moon-clear-line text-2xl text-mystic-gold-300" />
              </div>
              <h3 className="mystic-heading text-xl md:text-2xl font-bold text-mystic-gold-400 mb-2">
                Nhận Tin Từ Căn Phòng
              </h3>
              <p className="mystic-text text-sm opacity-80">
                Đăng ký để nhận những câu chuyện, nghi thức và ưu đãi dành riêng cho bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && message && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300 flex items-start gap-2">
                  <i className="ri-error-warning-line mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

              <div>
                <label className="block text-sm text-mystic-purple-200 mb-2 font-inter">Tên của bạn</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nguyễn Văn An"
                  className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-lg px-4 py-3 text-sm text-white placeholder-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500 focus:ring-1 focus:ring-mystic-purple-500/50 transition-all font-inter"
                />
              </div>

              <div>
                <label className="block text-sm text-mystic-purple-200 mb-2 font-inter">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ban@example.com"
                  className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-lg px-4 py-3 text-sm text-white placeholder-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500 focus:ring-1 focus:ring-mystic-purple-500/50 transition-all font-inter"
                />
              </div>

              {/* Honeypot chống bot */}
              <div className="newsletter-hp-field" aria-hidden="true">
                <label htmlFor="nl-website-alt">Website</label>
                <input
                  id="nl-website-alt"
                  type="text"
                  name="website_alt"
                  tabIndex={-1}
                  autoComplete="off"
                  readOnly
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <span
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    consent ? 'bg-mystic-gold-500 border-mystic-gold-400' : 'border-mystic-purple-600/60'
                  }`}
                >
                  {consent && <i className="ri-check-line text-[11px] font-bold" style={{ color: '#0a0618' }} />}
                </span>
                <input
                  type="checkbox"
                  name="marketing_consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs text-mystic-purple-300 leading-relaxed font-inter">
                  Tôi đồng ý nhận email về hành trình, sản phẩm và ưu đãi từ The Mystic Room.
                </span>
              </label>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mystic-btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" /> Đang gửi...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line" /> Đăng Ký Nhận Tin
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}