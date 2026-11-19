import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as { redirect?: string } | null)?.redirect || '/my-profile';

  // Cho phép màn hình khóa đăng nhập chỉ định sẵn chế độ Đăng nhập / Đăng ký.
  useEffect(() => {
    const m = (location.state as { mode?: 'signin' | 'signup' } | null)?.mode;
    if (m === 'signup' || m === 'signin') setMode(m);
  }, [location.state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
          setSubmitting(false);
          return;
        }
        navigate(redirectPath, { replace: true });
      } else {
        const { error: err, needsConfirmation } = await signUp(email, password, {
          full_name: fullName.trim(),
          birth_date: birthDate || undefined,
          gender: gender || undefined,
          marketing_consent: marketingConsent,
        });
        if (err) {
          setError(err.message.includes('already registered')
            ? 'Email này đã được đăng ký. Hãy đăng nhập.'
            : 'Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
          setSubmitting(false);
          return;
        }
        if (needsConfirmation) {
          setSuccessMsg('Đăng ký thành công! Hãy kiểm tra email để xác nhận tài khoản, sau đó đăng nhập.');
          setMode('signin');
          setPassword('');
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch {
      setError('Đã có lỗi không mong muốn. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen star-bg flex items-center justify-center px-4 py-16 pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-900 border border-mystic-purple-500/40 flex items-center justify-center glow-purple">
            <i className="ri-moon-clear-line text-2xl text-mystic-gold-300" />
          </div>
          <h1 className="mystic-heading text-3xl md:text-4xl font-semibold">
            {mode === 'signin' ? 'Bước Vào Căn Phòng' : 'Bắt Đầu Hành Trình'}
          </h1>
          <p className="mystic-text text-sm mt-3">
            {mode === 'signin'
              ? 'Đăng nhập để khám phá hồ sơ và lưu lại hành trình của bạn.'
              : 'Tạo tài khoản để lưu kết quả trắc nghiệm và Mystic Profile của riêng bạn.'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-mystic-purple-900/30 rounded-full p-1 mb-8 border border-mystic-purple-700/30">
          <button
            onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 rounded-full text-sm font-inter font-medium transition-all cursor-pointer whitespace-nowrap ${
              mode === 'signin'
                ? 'bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 text-white'
                : 'text-mystic-purple-200 hover:text-white'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 rounded-full text-sm font-inter font-medium transition-all cursor-pointer whitespace-nowrap ${
              mode === 'signup'
                ? 'bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 text-white'
                : 'text-mystic-purple-200 hover:text-white'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mystic-card p-8 space-y-6">
          {successMsg && (
            <div className="bg-mystic-gold-500/10 border border-mystic-gold-500/30 rounded-lg px-4 py-3 text-sm text-mystic-gold-300">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300 flex items-start gap-2">
              <i className="ri-error-warning-line mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm text-mystic-purple-200 mb-2 font-inter">Email</label>
            <div className="relative">
              <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-mystic-purple-400 text-sm" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ban@example.com"
                className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500 focus:ring-1 focus:ring-mystic-purple-500/50 transition-all font-inter"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-mystic-purple-200 mb-2 font-inter">Mật khẩu</label>
            <div className="relative">
              <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-mystic-purple-400 text-sm" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500 focus:ring-1 focus:ring-mystic-purple-500/50 transition-all font-inter"
              />
            </div>
            {mode === 'signup' && (
              <p className="text-xs text-mystic-purple-400 mt-2 font-inter">Mật khẩu tối thiểu 6 ký tự.</p>
            )}
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm text-mystic-purple-200 mb-2 font-inter">Họ và tên</label>
                <div className="relative">
                  <i className="ri-user-3-line absolute left-4 top-1/2 -translate-y-1/2 text-mystic-purple-400 text-sm" />
                  <input
                    type="text"
                    name="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Nguyễn Văn An"
                    className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500 focus:ring-1 focus:ring-mystic-purple-500/50 transition-all font-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-mystic-purple-200 mb-2 font-inter">Ngày sinh</label>
                  <input
                    type="date"
                    name="birth_date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-mystic-purple-500 focus:ring-1 focus:ring-mystic-purple-500/50 transition-all font-inter"
                  />
                </div>
                <div>
                  <label className="block text-sm text-mystic-purple-200 mb-2 font-inter">Giới tính (tùy chọn)</label>
                  <select
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-mystic-purple-500 focus:ring-1 focus:ring-mystic-purple-500/50 transition-all font-inter cursor-pointer"
                  >
                    <option value="" className="bg-mystic-purple-900 text-white">Không tiết lộ</option>
                    <option value="female" className="bg-mystic-purple-900 text-white">Nữ</option>
                    <option value="male" className="bg-mystic-purple-900 text-white">Nam</option>
                    <option value="other" className="bg-mystic-purple-900 text-white">Khác</option>
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <span
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    marketingConsent
                      ? 'bg-mystic-gold-500 border-mystic-gold-400'
                      : 'border-mystic-purple-600/60'
                  }`}
                >
                  {marketingConsent && <i className="ri-check-line text-[11px] font-bold" style={{ color: '#0a0618' }} />}
                </span>
                <input
                  type="checkbox"
                  name="marketing_consent"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs text-mystic-purple-300 leading-relaxed font-inter">
                  Tôi đồng ý nhận email về hành trình, sản phẩm và ưu đãi dành riêng cho mình từ The Mystic Room.
                </span>
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mystic-btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <i className="ri-loader-4-line animate-spin" />
                Đang xử lý...
              </>
            ) : mode === 'signin' ? (
              <>
                <i className="ri-door-open-line" />
                Đăng Nhập
              </>
            ) : (
              <>
                <i className="ri-sparkling-2-line" />
                Đăng Ký
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-mystic-purple-300 mt-6 font-inter">
          {mode === 'signin' ? (
            <>
              Chưa có tài khoản?{' '}
              <button
                onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
                className="text-mystic-gold-400 hover:text-mystic-gold-300 font-medium cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{' '}
              <button
                onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
                className="text-mystic-gold-400 hover:text-mystic-gold-300 font-medium cursor-pointer"
              >
                Đăng nhập
              </button>
            </>
          )}
        </p>

        <p className="text-center text-xs text-mystic-purple-500 mt-4 font-inter">
          <Link to="/" className="hover:text-mystic-purple-300 transition-colors">
            ← Quay về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}