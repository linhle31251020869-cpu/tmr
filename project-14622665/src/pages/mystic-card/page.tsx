import { Link } from 'react-router-dom';
import { useMysticProfile } from '@/hooks/useMysticProfile';
import { archetypes } from '@/mocks/mysticData';
import { signData } from '@/lib/astrologyData';
import { getElementCardTheme, lifePathThemes, mbtiNicknames } from '@/lib/mysticCards';

export default function MysticCard() {
  const { profile, loading } = useMysticProfile();

  const theme = getElementCardTheme(profile?.element);
  const sunInfo = profile?.sunSign ? signData.find((s) => s.name === profile.sunSign) : undefined;
  const archetypeInfo = profile?.archetype
    ? archetypes.find((a) => a.name === profile.archetype)
    : undefined;

  const fallback = (v?: string) => (v && v.trim() ? v : 'Chưa có');

  // Bộ thẻ thu thập — mỗi thẻ lấy trực tiếp dữ liệu từ Mystic Profile của người dùng.
  const collection = [
    {
      key: 'element',
      label: 'Nguyên Tố',
      icon: theme.icon,
      accent: theme.accent,
      value: fallback(profile?.element),
      note: theme.description,
    },
    {
      key: 'zodiac',
      label: 'Cung Hoàng Đạo',
      icon: 'ri-sun-line',
      accent: '#e0a63c',
      value: sunInfo ? `${sunInfo.symbol} ${sunInfo.name}` : fallback(profile?.sunSign),
      note: sunInfo
        ? `Từ khóa: ${sunInfo.keywords.join(' · ')}. ${sunInfo.description.split('.')[0]}.`
        : 'Hoàn thành Moon Window để mở khóa thẻ này.',
    },
    {
      key: 'archetype',
      label: 'Nguyên Mẫu',
      icon: 'ri-sparkling-line',
      accent: theme.accent,
      value: fallback(profile?.archetype),
      note: archetypeInfo?.description || 'Nguyên mẫu cá nhân của bạn sẽ hiện khi bạn hoàn thành các trải nghiệm.',
    },
    {
      key: 'lifepath',
      label: 'Đường Đời',
      icon: 'ri-road-map-line',
      accent: '#6aa86a',
      value: profile?.lifePath ? `Số ${profile.lifePath}` : 'Chưa có',
      note: (profile?.lifePath && lifePathThemes[profile.lifePath]) || 'Con số đường đời của bạn sẽ được giải mã ở phần Numerology.',
    },
    {
      key: 'mbti',
      label: 'Tính Cách MBTI',
      icon: 'ri-user-heart-line',
      accent: '#c88aa0',
      value: fallback(profile?.mbtiType),
      note:
        profile?.mbtiType && mbtiNicknames[profile.mbtiType]
          ? `${mbtiNicknames[profile.mbtiType]} — đại diện cho cách bạn nạp năng lượng và ra quyết định.`
          : 'Hoàn thành bài trắc nghiệm tính cách để mở khóa thẻ này.',
    },
    {
      key: 'tarot',
      label: 'Lá Bài Đồng Hành',
      icon: 'ri-stack-line',
      accent: '#d4af37',
      value: fallback(profile?.tarotCard),
      note: profile?.tarotTheme
        ? `Chủ đề: ${profile.tarotTheme}. Lá bài phản chiếu dòng chảy nội tâm hiện tại của bạn.`
        : 'Rút một lá bài ở Tarot Table để mở khóa thẻ này.',
    },
  ];

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      <section className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 star-bg">
        <div className="absolute inset-0 bg-mystic-radial" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4 text-mystic-purple-300">
            <Link to="/my-profile" className="text-sm hover:text-white transition-colors">
              <i className="ri-arrow-left-line mr-1" /> Hồ Sơ Của Tôi
            </Link>
            <span className="text-mystic-purple-600">/</span>
            <span className="text-sm text-mystic-gold-400">Mystic Card</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="mystic-heading text-2xl md:text-3xl font-bold text-glow-gold">
                Mystic Card
              </h1>
              <p className="mystic-subheading text-sm italic text-mystic-purple-300">
                Bộ thẻ cá nhân hóa của riêng bạn
              </p>
            </div>
          </div>
          <p className="mystic-text text-sm max-w-2xl opacity-70">
            Mỗi người sở hữu một bộ thẻ khác nhau, được kiến tạo từ chính Mystic Profile của bạn. Càng hoàn thành
            nhiều trải nghiệm khám phá, bộ sưu tập thẻ của bạn càng đầy đủ.
          </p>
        </div>
      </section>

      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto relative z-10">
          {loading ? (
            <div className="mystic-card rounded-xl p-10 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-mystic-purple-300 font-inter">
                <i className="ri-loader-4-line animate-spin" /> Đang tải Mystic Card...
              </div>
            </div>
          ) : profile ? (
            <div className="space-y-10">
              {/* ===== Thẻ chính — cá nhân hóa theo nguyên tố ===== */}
              <div className="max-w-md mx-auto">
                <div
                  className="mystic-card rounded-2xl overflow-hidden border-mystic-purple-500/30"
                  style={{ boxShadow: `0 0 46px ${theme.accent}26` }}
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, #0a0618 6%, rgba(10,6,24,0.5) 46%, transparent 100%)' }}
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-[10px] text-white/70 tracking-[0.3em] uppercase">THE MYSTIC ROOM</span>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(10,6,24,0.5)', border: `1px solid ${theme.accent}66` }}
                      >
                        <i className={`${theme.icon} text-sm`} style={{ color: theme.accent }} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="mystic-heading text-[10px] tracking-[0.3em] uppercase block mb-1" style={{ color: theme.accent }}>
                        {theme.name}
                      </span>
                      <p className="mystic-subheading text-sm italic text-white/80">{theme.tagline}</p>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <span className="mystic-heading text-[10px] text-mystic-purple-300/60 tracking-[0.3em] uppercase mb-1 block">
                      Mystic Archetype
                    </span>
                    <h2 className="mystic-heading text-xl font-bold mb-2" style={{ color: theme.accent }}>
                      {(profile.archetype || 'Nguyên Mẫu Của Bạn').toUpperCase()}
                    </h2>
                    <p className="mystic-subheading text-sm italic text-mystic-purple-300 mb-4">
                      {theme.tagline}
                    </p>
                    <div className="mystic-divider mb-4 max-w-xs mx-auto" />
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="mystic-card rounded-lg p-2">
                        <p className="text-[10px] text-mystic-purple-300/60 uppercase tracking-wider">Nguyên Tố</p>
                        <p className="text-sm text-white font-medium">{fallback(profile.element)}</p>
                      </div>
                      <div className="mystic-card rounded-lg p-2">
                        <p className="text-[10px] text-mystic-purple-300/60 uppercase tracking-wider">Biểu Tượng</p>
                        <p className="text-sm text-white font-medium">{fallback(profile.symbol)}</p>
                      </div>
                      <div className="mystic-card rounded-lg p-2">
                        <p className="text-[10px] text-mystic-purple-300/60 uppercase tracking-wider">Màu Sắc</p>
                        <p className="text-sm font-medium" style={{ color: theme.accent }}>{fallback(profile.color)}</p>
                      </div>
                      <div className="mystic-card rounded-lg p-2">
                        <p className="text-[10px] text-mystic-purple-300/60 uppercase tracking-wider">Đường Đời</p>
                        <p className="text-sm text-white font-medium">{fallback(profile.lifePath)}</p>
                      </div>
                    </div>
                    <p className="mystic-text text-xs italic opacity-70 mb-4">
                      "{profile.message || 'Hoàn thành các trải nghiệm để AI tạo nên thông điệp dành riêng cho bạn.'}"
                    </p>
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-mystic-gold-400/60" />
                      <div className="w-1 h-1 rounded-full bg-mystic-purple-400/60" />
                      <div className="w-1 h-1 rounded-full bg-mystic-gold-400/60" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Bộ thẻ thu thập ===== */}
              <div>
                <div className="text-center mb-5">
                  <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-1">
                    Bộ Sưu Tập Mystic Card
                  </h3>
                  <p className="mystic-text text-xs opacity-60">
                    {collection.length} thẻ cá nhân hóa · hoàn thành thêm trải nghiệm để mở khóa toàn bộ
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.map((card) => (
                    <div key={card.key} className="mystic-card rounded-xl p-4 relative overflow-hidden">
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(circle at 28% 0%, ${card.accent}24, transparent 72%)` }}
                      />
                      <div className="relative">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${card.accent}1f`, border: `1px solid ${card.accent}55` }}
                          >
                            <i className={`${card.icon} text-sm`} style={{ color: card.accent }} />
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-mystic-purple-300/60">
                            {card.label}
                          </span>
                        </div>
                        <p className="mystic-heading text-base font-bold mb-1.5" style={{ color: card.accent }}>
                          {card.value}
                        </p>
                        <p className="mystic-text text-xs leading-relaxed opacity-70">{card.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== CTA ===== */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/thiet-ke-vong" className="mystic-btn-gold text-sm justify-center">
                  <i className="ri-vip-diamond-line" /> Chế Tác Tín Vật Của Bạn
                </Link>
                <Link to="/my-profile" className="mystic-btn-outline text-sm justify-center">
                  <i className="ri-user-3-line" /> Về Hồ Sơ Mật
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto mystic-card rounded-2xl p-8 md:p-12 text-center">
              <h2 className="mystic-heading text-xl font-bold text-mystic-gold-400 mb-3">
                Chưa Có Mystic Card
              </h2>
              <p className="mystic-text text-sm opacity-70 max-w-sm mx-auto mb-6">
                Hoàn thành các trải nghiệm khám phá để tạo nên bộ Mystic Card cá nhân của riêng bạn.
              </p>
              <Link to={{ pathname: '/', state: { scrollTo: 'discovery' } }} className="mystic-btn-primary text-sm">
                Bắt Đầu Khám Phá
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}