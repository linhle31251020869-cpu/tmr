import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { deleteAccount } from '@/lib/account';
import { useMysticProfile } from '@/hooks/useMysticProfile';
import { getResults } from '@/lib/mysticStore';
import { getMyProfile, saveMyProfile } from '@/lib/tracking';
import { buildOverview } from '@/lib/overviewNarrative';
import { getBraceletSuggestion } from '@/lib/braceletSuggestion';
import PageHero from '@/components/feature/PageHero';

export default function MysticProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: loadingProfile } = useMysticProfile();
  const [savedResults, setSavedResults] = useState<{ id: number; experience_type: string; created_at: string; result_data?: Record<string, unknown> }[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [historyType, setHistoryType] = useState<string | null>(null);

  const [infoLoading, setInfoLoading] = useState(false);
  const [infoSaving, setInfoSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    const { error } = await deleteAccount();
    if (error) {
      setDeleting(false);
      setDeleteError('Không thể xóa tài khoản. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
      return;
    }
    await signOut();
    navigate('/');
  };
  const [infoSavedMsg, setInfoSavedMsg] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoForm, setInfoForm] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    marketingConsent: false,
  });

  const overview = useMemo(() => {
    if (!profile) return null;
    return buildOverview({
      mbtiType: profile.mbtiType,
      traits: profile.traits,
      lifePath: profile.lifePath,
      sunSign: profile.sunSign,
      moonSign: profile.moonSign,
      risingSign: profile.risingSign,
    });
  }, [profile]);

  const suggestion = getBraceletSuggestion(profile?.element, profile?.sunSign);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setInfoLoading(true);
    getMyProfile(user.id)
      .then((data) => {
        if (cancelled || !data) return;
        setInfoForm({
          fullName: data.full_name || '',
          birthDate: data.birth_date || '',
          gender: data.gender || '',
          marketingConsent: Boolean(data.marketing_consent),
        });
      })
      .finally(() => {
        if (!cancelled) setInfoLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSaveInfo = async () => {
    setInfoSaving(true);
    setInfoSavedMsg(null);
    const { error } = await saveMyProfile({
      fullName: infoForm.fullName.trim(),
      birthDate: infoForm.birthDate,
      gender: infoForm.gender,
      marketingConsent: infoForm.marketingConsent,
    });
    setInfoSaving(false);
    setInfoSavedMsg(error ? 'Không thể lưu. Vui lòng thử lại.' : 'Đã lưu thông tin cá nhân của bạn!');
  };

  useEffect(() => {
    if (!user) {
      setSavedResults([]);
      return;
    }
    setLoadingResults(true);
    getResults(user.id)
      .then(({ data }) => {
        setSavedResults((data ?? []) as { id: number; experience_type: string; created_at: string; result_data?: Record<string, unknown> }[]);
      })
      .finally(() => setLoadingResults(false));
  }, [user]);

  const experienceLabels: Record<string, string> = {
    'mystic-mirror': 'Mystic Mirror',
    'tarot': 'Tarot Table',
    'moon-window': 'Moon Window',
    'numerology': 'Numerology',
  };

  const fallback = (v?: string) => (v && v.trim() ? v : 'Chưa có');

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      <PageHero
        image="https://readdy.ai/api/search-image?query=Celestial%20zodiac%20constellation%20chart%20glowing%20with%20golden%20star%20lines%20across%20a%20deep%20violet%20nebula%20sky%2C%20ornate%20golden%20astrolabe%20and%20compass%20rose%2C%20mystical%20cosmic%20atmosphere%2C%20elegant%20fantasy%20digital%20painting%2C%20violet%20and%20gold%20palette%2C%20no%20text%2C%20calm%20center%20for%20text%20overlay&width=1600&height=600&seq=profile-hero-zodiac&orientation=landscape"
        imageAlt="Bản đồ sao huyền bí cho Mystic Profile"
        icons={['ri-planet-line', 'ri-moon-clear-line', 'ri-star-line', 'ri-sparkling-line', 'ri-magic-line', 'ri-compass-3-line']}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mystic-heading text-4xl md:text-6xl font-bold mb-4 text-glow-gold">
            AI Mystic Profile
          </h1>
          <p className="mystic-subheading text-base md:text-lg italic mb-4">
            Bản chân dung tổng hợp cho hành trình độc đáo của bạn
          </p>
          <p className="mystic-text text-sm max-w-2xl mx-auto opacity-80">
            Không chỉ lưu kết quả — mọi trải nghiệm của bạn được kết nối thành một chân dung cá nhân sống động.
            Nơi website thật sự hiểu bạn là ai.
          </p>
          <div className="mystic-divider mt-8 max-w-md mx-auto" />
        </div>
      </PageHero>

      {/* Auth status banner */}
      <section className="relative px-6 md:px-12 lg:px-20 pt-8 md:pt-10">
        <div className="max-w-5xl mx-auto relative z-10">
          {user ? (
            <div className="mystic-card rounded-xl p-4 md:p-5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-mystic-gold-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 border border-mystic-purple-500/30 flex items-center justify-center text-white">
                  <i className="ri-user-3-line" />
                </div>
                <div>
                  <p className="text-sm text-white font-inter font-medium">{user.email}</p>
                  <p className="text-xs text-mystic-purple-300/70 font-inter">
                    Kết quả trải nghiệm của bạn được lưu tự động vào tài khoản này.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-mystic-gold-500/10 border border-mystic-gold-500/30 text-xs text-mystic-gold-400 font-inter whitespace-nowrap">
                <i className="ri-shield-check-line mr-1" /> Đã lưu dữ liệu
              </span>
            </div>
          ) : (
            <div className="mystic-card rounded-xl p-4 md:p-5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 flex items-center justify-center text-mystic-purple-200">
                  <i className="ri-lock-line" />
                </div>
                <p className="text-sm text-mystic-purple-200 font-inter">
                  Đăng nhập để lưu kết quả trắc nghiệm và Mystic Profile của riêng bạn.
                </p>
              </div>
              <Link to="/auth" state={{ redirect: '/my-profile' }} className="mystic-btn-primary !py-2 !px-5 text-sm">
                <i className="ri-user-3-line text-sm" /> Đăng Nhập
              </Link>
            </div>
          )}

          {user && (
            <div className="mystic-card rounded-xl p-5 md:p-6 mb-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 flex items-center justify-center text-mystic-gold-400">
                    <i className="ri-id-card-line" />
                  </div>
                  <div>
                    <h3 className="mystic-heading text-base font-bold text-mystic-gold-400">Thông Tin Cá Nhân</h3>
                    <p className="text-xs text-mystic-purple-300/70 font-inter">
                      Họ tên, ngày sinh, giới tính và tùy chọn nhận email.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setInfoOpen(!infoOpen); setInfoSavedMsg(null); }}
                  className="mystic-btn-outline !py-2 !px-4 text-xs whitespace-nowrap"
                >
                  <i className={infoOpen ? 'ri-arrow-up-s-line' : 'ri-edit-line'} />
                  {infoOpen ? 'Thu Gọn' : 'Chỉnh Sửa'}
                </button>
              </div>

              {!infoOpen && (
                <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 pt-4 border-t border-mystic-purple-800/25">
                  <div>
                    <p className="text-[11px] text-mystic-purple-300/50 uppercase tracking-wider">Họ và tên</p>
                    <p className="text-sm text-mystic-purple-100 font-inter">{infoLoading ? '...' : (infoForm.fullName || 'Chưa cập nhật')}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-mystic-purple-300/50 uppercase tracking-wider">Ngày sinh</p>
                    <p className="text-sm text-mystic-purple-100 font-inter">{infoLoading ? '...' : (infoForm.birthDate || 'Chưa cập nhật')}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-mystic-purple-300/50 uppercase tracking-wider">Giới tính</p>
                    <p className="text-sm text-mystic-purple-100 font-inter">
                      {infoLoading ? '...' : (infoForm.gender === 'female' ? 'Nữ' : infoForm.gender === 'male' ? 'Nam' : infoForm.gender === 'other' ? 'Khác' : 'Chưa cập nhật')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-mystic-purple-300/50 uppercase tracking-wider">Nhận email</p>
                    <p className={`text-sm font-inter ${infoForm.marketingConsent ? 'text-mystic-gold-300' : 'text-mystic-purple-300/60'}`}>
                      {infoForm.marketingConsent ? 'Đã đồng ý' : 'Chưa đồng ý'}
                    </p>
                  </div>
                </div>
              )}

              {infoOpen && (
                <div className="mt-5 pt-5 border-t border-mystic-purple-800/25 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Họ và tên</label>
                      <input
                        type="text"
                        value={infoForm.fullName}
                        onChange={(e) => setInfoForm({ ...infoForm, fullName: e.target.value })}
                        placeholder="Nhập họ tên của bạn"
                        className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Ngày sinh</label>
                      <input
                        type="date"
                        value={infoForm.birthDate}
                        onChange={(e) => setInfoForm({ ...infoForm, birthDate: e.target.value })}
                        className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 focus:outline-none focus:border-mystic-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Giới tính (tùy chọn)</label>
                      <select
                        value={infoForm.gender}
                        onChange={(e) => setInfoForm({ ...infoForm, gender: e.target.value })}
                        className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 focus:outline-none focus:border-mystic-purple-500/50 cursor-pointer"
                      >
                        <option value="" className="bg-mystic-purple-900 text-mystic-purple-200">Không tiết lộ</option>
                        <option value="female" className="bg-mystic-purple-900 text-mystic-purple-200">Nữ</option>
                        <option value="male" className="bg-mystic-purple-900 text-mystic-purple-200">Nam</option>
                        <option value="other" className="bg-mystic-purple-900 text-mystic-purple-200">Khác</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <span
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${infoForm.marketingConsent ? 'bg-mystic-gold-500 border-mystic-gold-400' : 'border-mystic-purple-600/60'}`}
                    >
                      {infoForm.marketingConsent && <i className="ri-check-line text-[11px] font-bold" style={{ color: '#0a0618' }} />}
                    </span>
                    <input
                      type="checkbox"
                      checked={infoForm.marketingConsent}
                      onChange={(e) => setInfoForm({ ...infoForm, marketingConsent: e.target.checked })}
                      className="sr-only"
                    />
                    <span className="text-xs text-mystic-purple-300 leading-relaxed font-inter">
                      Tôi đồng ý nhận email về hành trình, sản phẩm và ưu đãi dành riêng cho mình.
                    </span>
                  </label>

                  {infoSavedMsg && (
                    <p className="text-xs text-mystic-gold-300 flex items-center gap-2">
                      <i className="ri-checkbox-circle-line" /> {infoSavedMsg}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveInfo}
                      disabled={infoSaving}
                      className="mystic-btn-gold text-sm whitespace-nowrap disabled:opacity-50"
                    >
                      <i className={infoSaving ? 'ri-loader-4-line animate-spin' : 'ri-save-line'} />
                      {infoSaving ? 'Đang lưu...' : 'Lưu Thông Tin'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto relative z-10">
          {loadingProfile ? (
            <div className="mystic-card rounded-xl p-10 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-mystic-purple-300 font-inter">
                <i className="ri-loader-4-line animate-spin" /> Đang tải Mystic Profile...
              </div>
            </div>
          ) : profile ? (
            <>
              {/* Archetype Banner */}
              <div className="mystic-card rounded-2xl overflow-hidden mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src="https://readdy.ai/api/search-image?query=Mystical%20cloaked%20figure%20standing%20on%20mountain%20peak%20under%20starry%20night%20sky%20with%20crescent%20moon%20and%20aurora%20borealis%20purple%20glow%2C%20holding%20lantern%20with%20golden%20light%2C%20dark%20ethereal%20atmosphere%2C%20artistic%20illustration&width=600&height=500&seq=seeker-archetype&orientation=portrait"
                      alt="Mystic Archetype"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0618]/80 hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] to-transparent lg:hidden" />
                  </div>
                  <div className="p-6 md:p-10">
                    <span className="mystic-heading text-sm text-mystic-purple-300 tracking-[0.2em] uppercase mb-3 block">
                      Mystic Archetype
                    </span>
                    <h2 className="mystic-heading text-3xl md:text-4xl font-bold text-glow-gold mb-4 whitespace-nowrap leading-tight">
                      {(profile.archetype || 'Archetype của bạn').toUpperCase()}
                    </h2>
                    <p className="mystic-subheading text-lg md:text-xl italic text-mystic-purple-300 mb-4">
                      Một tâm hồn cảm nhận sâu sắc, dám mơ và không ngừng trưởng thành.
                    </p>
                    <p className="mystic-text text-base md:text-lg opacity-90 mb-7">
                      {profile.message || 'Hoàn thành các trải nghiệm để AI tạo nên thông điệp cá nhân hóa dành riêng cho bạn.'}
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      <span className="px-4 py-2 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 text-base text-mystic-purple-200">{fallback(profile.element)} - Nguyên Tố</span>
                      <span className="px-4 py-2 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 text-base text-mystic-purple-200">{fallback(profile.symbol)} - Biểu Tượng</span>
                      <span className="px-4 py-2 rounded-full bg-mystic-gold-900/20 border border-mystic-gold-700/30 text-base text-mystic-gold-400">{fallback(profile.color)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three core results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Personality */}
                <button onClick={() => setHistoryType('mystic-mirror')} className="mystic-card rounded-xl p-6 md:p-7 text-left cursor-pointer transition-all duration-300 hover:border-mystic-gold-500/40">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="mystic-heading text-xl font-bold text-mystic-gold-400">Tính Cách Của Bạn</h3>
                    <i className="ri-history-line text-mystic-gold-400/60" />
                  </div>
                  <p className="text-sm text-mystic-purple-300/70 uppercase tracking-wider mb-2">Loại MBTI</p>
                  <p className="gold-value text-5xl font-bold mb-5 leading-none">{fallback(profile.mbtiType).toUpperCase()}</p>
                  <p className="text-sm text-mystic-purple-300/70 uppercase tracking-wider mb-2">Nét Nổi Bật</p>
                  {profile.traits.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.traits.map((t) => (
                        <span key={t} className="px-3 py-1.5 rounded-full bg-mystic-purple-900/30 border border-mystic-purple-700/20 text-base text-mystic-purple-200 font-medium">{t}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-mystic-purple-300/50 italic">Hoàn thành Mystic Mirror để khám phá.</p>
                  )}
                </button>

                {/* Birth Chart */}
                <button onClick={() => setHistoryType('moon-window')} className="mystic-card rounded-xl p-6 md:p-7 text-left cursor-pointer transition-all duration-300 hover:border-mystic-gold-500/40">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="mystic-heading text-xl font-bold text-mystic-gold-400">Bản Đồ Sao</h3>
                    <i className="ri-history-line text-mystic-gold-400/60" />
                  </div>

                  <div>
                    {/* Mặt Trời */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-mystic-gold-500/10 border border-mystic-gold-500/30 flex items-center justify-center text-mystic-gold-400">
                        <i className="ri-sun-line text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-mystic-purple-300/70 uppercase tracking-wider mb-0.5">Mặt Trời</p>
                        <p className="gold-value italic text-2xl font-semibold leading-tight">{fallback(profile.sunSign)}</p>
                      </div>
                    </div>

                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-mystic-purple-700/30 to-transparent" />

                    {/* Mặt Trăng */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 flex items-center justify-center text-mystic-purple-300">
                        <i className="ri-moon-line text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-mystic-purple-300/70 uppercase tracking-wider mb-0.5">Mặt Trăng</p>
                        <p className="gold-value italic text-2xl font-semibold leading-tight">{fallback(profile.moonSign)}</p>
                      </div>
                    </div>

                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-mystic-purple-700/30 to-transparent" />

                    {/* Cung Mọc */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-mystic-gold-500/10 border border-mystic-gold-500/30 flex items-center justify-center text-mystic-gold-400">
                        <i className="ri-arrow-up-line text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-mystic-purple-300/70 uppercase tracking-wider mb-0.5">Cung Mọc</p>
                        <p className="gold-value italic text-2xl font-semibold leading-tight">{fallback(profile.risingSign)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-mystic-purple-700/20 space-y-2">
                    <p className="text-xs text-mystic-purple-200/80 leading-relaxed">
                      <span className="text-mystic-gold-300 font-medium">Mặt Trời:</span> Bản chất và cái tôi.
                    </p>
                    <p className="text-xs text-mystic-purple-200/80 leading-relaxed">
                      <span className="text-mystic-gold-300 font-medium">Mặt Trăng:</span> Cảm xúc và thế giới nội tâm.
                    </p>
                    <p className="text-xs text-mystic-purple-200/80 leading-relaxed">
                      <span className="text-mystic-gold-300 font-medium">Cung Mọc:</span> Hình ảnh bên ngoài và cách người khác nhìn nhận.
                    </p>
                  </div>
                </button>

                {/* Life Path */}
                <button onClick={() => setHistoryType('numerology')} className="mystic-card rounded-xl p-6 md:p-7 text-left cursor-pointer transition-all duration-300 hover:border-mystic-gold-500/40">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="mystic-heading text-xl font-bold text-mystic-gold-400">Đường Đời</h3>
                    <i className="ri-history-line text-mystic-gold-400/60" />
                  </div>
                  <p className="text-sm text-mystic-purple-300/70 uppercase tracking-wider mb-2">Con Số</p>
                  <p className="gold-value text-6xl font-bold mb-5 leading-none">{fallback(profile.lifePath)}</p>
                  <p className="text-sm text-mystic-purple-300/70 uppercase tracking-wider mb-2">Ý Nghĩa</p>
                  <p className="text-base text-mystic-purple-200/80 leading-relaxed">Khám phá con đường đời qua thần số học để thấu hiểu sứ mệnh của bạn.</p>
                </button>
              </div>

              {/* Tổng quan về bạn */}
              {overview && (
                <div className="mystic-card rounded-2xl overflow-hidden relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-mystic-gold-500/5 via-transparent to-mystic-purple-900/15 pointer-events-none" />
                  <div className="relative p-6 md:p-10">
                    <div className="text-center mb-8">
                      <span className="mystic-heading text-xs text-mystic-gold-400 tracking-[0.25em] uppercase mb-3 inline-flex items-center gap-2">
                        <i className="ri-sparkling-2-line" /> Bản Chân Dung Cá Nhân
                      </span>
                      <h2 className="mystic-heading text-2xl md:text-3xl font-bold text-glow-gold mb-3">
                        Tổng Quan Về Bạn
                      </h2>
                      <p className="mystic-text text-sm opacity-70 max-w-2xl mx-auto leading-relaxed">{overview.intro}</p>
                      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                        {overview.layers.map((l) => (
                          <span key={l} className="px-3 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/25 text-[11px] text-mystic-purple-200 whitespace-nowrap">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {overview.sections.map((sec, i) => (
                        <div key={sec.key} className="rounded-2xl bg-gradient-to-br from-mystic-purple-900/20 to-transparent border border-mystic-purple-700/15 p-5 md:p-7">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-mystic-purple-900/60 border border-mystic-gold-500/25 flex items-center justify-center shrink-0">
                              <span className="mystic-heading text-mystic-gold-400 font-bold text-sm">0{i + 1}</span>
                            </div>
                            <div>
                              <h4 className="mystic-heading text-base md:text-lg font-bold text-mystic-gold-300">
                                {sec.title}
                              </h4>
                            </div>
                            <i className={`${sec.icon} text-mystic-gold-400/50 text-lg ml-auto mt-1`} />
                          </div>
                          <div className="pl-0 md:pl-14 space-y-4">
                            {sec.paragraphs.map((p, pi) => (
                              <p key={pi} className="mystic-text text-sm leading-relaxed opacity-85">{p}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 rounded-2xl bg-mystic-gold-500/5 border border-mystic-gold-500/15 p-6">
                      <p className="mystic-text text-sm italic leading-relaxed opacity-80 text-center max-w-3xl mx-auto">
                        {overview.closing}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Energy Bracelet Suggestion */}
              <div className="relative overflow-hidden rounded-2xl p-6 md:p-9 mb-8 border border-mystic-gold-500/40 bg-gradient-to-br from-mystic-gold-500/20 via-mystic-gold-400/10 to-mystic-gold-900/10">
                {/* Sparkle overlay */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  <span className="twinkle-star" style={{ top: '15%', left: '8%' }} />
                  <span className="twinkle-star" style={{ top: '70%', left: '16%', animationDelay: '0.6s' }} />
                  <span className="twinkle-star" style={{ top: '22%', left: '78%', animationDelay: '1.2s' }} />
                  <span className="twinkle-star" style={{ top: '64%', left: '86%', animationDelay: '0.3s' }} />
                  <span className="twinkle-star" style={{ top: '85%', left: '48%', animationDelay: '0.9s' }} />
                  <span className="twinkle-star" style={{ top: '10%', left: '52%', animationDelay: '1.5s' }} />
                  <span className="absolute inset-0 bg-gold-radial" />
                </div>

                <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <span className="mystic-heading text-xs text-mystic-gold-400 tracking-[0.2em] uppercase mb-2 block">
                      Gợi Ý Dành Riêng Cho Bạn
                    </span>
                    <h3 className="mystic-heading text-2xl font-bold text-glow-gold mb-3">
                      Vòng Tay Năng Lượng Phù Hợp
                    </h3>
                    <p className="mystic-text text-sm opacity-80 mb-4 max-w-xl">
                      Dựa trên năng lượng và bản đồ sao của bạn, chúng tôi gợi ý những loại đá và charm hài hòa nhất với bạn. Hãy tự tay lựa chọn để tạo nên chiếc vòng mang đúng dấu ấn của riêng mình.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="px-4 py-2 rounded-full bg-mystic-gold-500/15 border border-mystic-gold-500/40 text-sm text-mystic-gold-200">
                        <i className="ri-vip-diamond-line mr-1.5 text-mystic-gold-400" /> Đá: {suggestion.stoneName}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-mystic-gold-500/15 border border-mystic-gold-500/40 text-sm text-mystic-gold-200">
                        <i className="ri-sparkling-line mr-1.5 text-mystic-gold-400" /> Charm: {suggestion.charmName}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Link to="/thiet-ke-vong" className="mystic-btn-gold text-base !px-9 !py-4 whitespace-nowrap">
                      Thiết Kế Vòng Tay
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mystic-card rounded-2xl p-8 md:p-12 text-center mb-8">
              <h2 className="mystic-heading text-xl md:text-2xl font-bold text-mystic-gold-400 mb-3">
                Hồ Sơ Của Bạn Đang Chờ Được Viết Nên
              </h2>
              <p className="mystic-text text-sm opacity-70 max-w-lg mx-auto mb-6">
                Hoàn thành các trải nghiệm Mystic Mirror, Tarot, Bản Đồ Sao và Thần Số Học
                để AI tổng hợp nên Mystic Profile cá nhân hóa dành riêng cho bạn.
              </p>
              <Link to={{ pathname: '/', state: { scrollTo: 'discovery' } }} className="mystic-btn-primary text-sm">
                Bắt Đầu Khám Phá
              </Link>
            </div>
          )}

          {/* Saved Results History */}
          {user && (
            <div className="mystic-card rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h3 className="mystic-heading text-sm font-bold text-mystic-gold-400">Hành Trình Của Tôi</h3>
                  <p className="text-[11px] text-mystic-purple-300/60 font-inter">My Journey — những lá bài và trải nghiệm bạn đã lưu</p>
                </div>
              </div>
              {loadingResults ? (
                <div className="flex items-center gap-2 text-sm text-mystic-purple-300 font-inter">
                  <i className="ri-loader-4-line animate-spin" /> Đang tải...
                </div>
              ) : savedResults.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {savedResults.map((r) => {
                    const rd = r.result_data || {};
                    let detail = '';
                    if (r.experience_type === 'moon-window') {
                      detail = `${rd.sunSign || ''} · ${rd.moonSign || ''} · ${rd.risingSign || ''}`;
                    } else if (r.experience_type === 'numerology') {
                      detail = `Số Đường Đời: ${rd.lifePath || ''}`;
                    } else if (r.experience_type === 'mystic-mirror') {
                      detail = `${rd.type || ''} — ${rd.name || ''}`;
                    } else if (r.experience_type === 'tarot') {
                      detail = `${rd.cardName || ''} · Chủ đề ${rd.theme || ''}`;
                    }
                    return (
                      <div key={r.id} className="flex items-center justify-between rounded-lg bg-mystic-purple-900/30 border border-mystic-purple-700/20 px-4 py-3">
                        <div className="min-w-0">
                          <span className="text-sm text-mystic-purple-200 font-inter block">
                            {experienceLabels[r.experience_type] || r.experience_type}
                          </span>
                          {detail && (
                            <span className="text-[11px] text-mystic-purple-400 font-inter">{detail}</span>
                          )}
                        </div>
                        <span className="text-xs text-mystic-purple-400 font-inter shrink-0">
                          {new Date(r.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-mystic-purple-300/70 font-inter">
                    Bạn chưa có kết quả nào được lưu. Hãy bắt đầu một trải nghiệm nhé!
                  </p>
                  <Link to={{ pathname: '/', state: { scrollTo: 'discovery' } }} className="mystic-btn-outline !py-2 !px-4 text-xs">
                    Khám Phá Ngay
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Vùng nguy hiểm — xóa tài khoản */}
          {user && (
            <div className="mystic-card rounded-xl p-5 md:p-6 mb-6 border-red-500/25">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-300">
                  <i className="ri-delete-bin-6-line" />
                </div>
                <div>
                  <h3 className="mystic-heading text-base font-bold text-red-300">Vùng Nguy Hiểm</h3>
                  <p className="text-xs text-mystic-purple-300/70 font-inter">
                    Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setDeleteOpen(true); setDeleteError(null); }}
                className="w-full sm:w-auto justify-center rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10 px-5 py-2.5 text-sm transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
              >
                <i className="ri-delete-bin-6-line" /> Xóa Tài Khoản
              </button>
            </div>
          )}

        </div>
      </section>

      {/* History Modal */}
      {historyType && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 modal-backdrop"
          style={{ background: 'rgba(6, 4, 15, 0.85)' }}
          onClick={() => setHistoryType(null)}
        >
          <div
            className="w-full max-w-lg mystic-card rounded-2xl p-6 md:p-8 modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <i className="ri-history-line text-mystic-gold-400 text-xl" />
                <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400">
                  {historyType === 'mystic-mirror' ? 'Tính Cách Của Bạn' : historyType === 'moon-window' ? 'Bản Đồ Sao' : 'Đường Đời'}
                </h3>
              </div>
              <button
                onClick={() => setHistoryType(null)}
                className="w-8 h-8 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 flex items-center justify-center text-mystic-purple-200 hover:text-white cursor-pointer"
                aria-label="Đóng"
              >
                <i className="ri-close-line" />
              </button>
            </div>
            <p className="text-[11px] text-mystic-purple-300/60 font-inter mb-5">
              Lịch sử luận giải của bạn về {historyType === 'mystic-mirror' ? 'tính cách' : historyType === 'moon-window' ? 'bản đồ sao' : 'đường đời'}
            </p>

            {loadingResults ? (
              <div className="flex items-center justify-center gap-2 text-sm text-mystic-purple-300 font-inter py-8">
                <i className="ri-loader-4-line animate-spin" /> Đang tải...
              </div>
            ) : savedResults.filter((r) => r.experience_type === historyType).length > 0 ? (
              <div className="max-h-[420px] overflow-y-auto no-scrollbar flex flex-col gap-2 pr-1">
                {savedResults
                  .filter((r) => r.experience_type === historyType)
                  .map((r) => {
                    const rd = r.result_data || {};
                    let detail = '';
                    if (historyType === 'moon-window') {
                      detail = `Mặt Trời ${rd.sunSign || ''} · Mặt Trăng ${rd.moonSign || ''} · Cung Mọc ${rd.risingSign || ''}`;
                    } else if (historyType === 'numerology') {
                      detail = `Số Đường Đời: ${rd.lifePath || ''}`;
                    } else if (historyType === 'mystic-mirror') {
                      detail = `${rd.type || ''} — ${rd.name || ''}`;
                    }
                    return (
                      <div key={r.id} className="rounded-lg bg-mystic-purple-900/30 border border-mystic-purple-700/20 px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-mystic-purple-300/60 font-inter">
                            <i className="ri-time-line mr-1" />
                            {new Date(r.created_at).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        {detail && (
                          <p className="text-sm text-mystic-purple-100 font-medium font-inter leading-relaxed">{detail}</p>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-10">
                <i className="ri-file-search-line text-4xl text-mystic-purple-400/50 mb-3 block" />
                <p className="text-sm text-mystic-purple-300/70 font-inter mb-2">
                  Bạn chưa có luận giải nào được lưu cho mục này.
                </p>
                <p className="text-xs text-mystic-purple-400/60 font-inter">
                  Hoàn thành trải nghiệm tương ứng rồi lưu kết quả để xem lịch sử nhé.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete account confirmation modal */}
      {deleteOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center px-4 modal-backdrop"
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
            <h3 className="mystic-heading text-lg font-bold text-red-300 text-center mb-2">Xóa Tài Khoản?</h3>
            <p className="text-sm text-mystic-purple-200 text-center leading-relaxed mb-5 font-inter">
              Hành động này không thể hoàn tác. Toàn bộ hồ sơ, kết quả trải nghiệm và lịch sử của bạn sẽ bị xóa vĩnh viễn.
            </p>
            {deleteError && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">{deleteError}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                className="mystic-btn-outline text-sm justify-center flex-1 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteAccount}
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