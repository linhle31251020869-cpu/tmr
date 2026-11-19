import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { experiences } from '@/mocks/mysticData';

const discoveryOrder = ['mystic-mirror', 'moon-window', 'numerology', 'tarot-table'];

// Ảnh nhỏ hơn dành riêng cho mobile — giảm dung lượng tải xuống của ảnh trang đầu.
const experienceMobileImages: Record<string, string> = {
  'mystic-mirror': 'https://readdy.ai/api/search-image?query=Ornate%20antique%20golden%20mirror%20with%20purple%20mystical%20glow%20and%20crystal%20reflections%20on%20dark%20celestial%20background%20with%20stars%20and%20moonlight%2C%20ethereal%20magical%20atmosphere%2C%20artistic%20illustration&width=380&height=253&seq=mystic-mirror-card&orientation=landscape',
  'tarot-table': 'https://readdy.ai/api/search-image?query=Beautiful%20tarot%20cards%20spread%20on%20dark%20velvet%20table%20with%20golden%20candlelight%20and%20crystal%20ball%20glowing%20purple%2C%20mystical%20atmosphere%20with%20star%20patterns%20and%20moon%20phases%2C%20artistic%20illustration&width=380&height=253&seq=tarot-table-card&orientation=landscape',
  'moon-window': 'https://readdy.ai/api/search-image?query=Gothic%20arched%20window%20framing%20a%20large%20glowing%20full%20moon%20with%20zodiac%20constellations%20and%20planets%20visible%20in%20dark%20starry%20sky%2C%20purple%20and%20gold%20celestial%20light%20streaming%20through%2C%20mystical%20atmospheric%20illustration&width=380&height=253&seq=moon-window-card&orientation=landscape',
  numerology: 'https://readdy.ai/api/search-image?query=Glowing%20golden%20numbers%20and%20sacred%20geometry%20floating%20in%20dark%20cosmic%20space%20with%20purple%20nebula%20clouds%20and%20stardust%2C%20mystical%20numerology%20symbols%20and%20runic%20patterns%2C%20ethereal%20artistic%20illustration&width=380&height=253&seq=numerology-card&orientation=landscape',
};

function scrollToDiscovery() {
  const el = document.getElementById('discovery');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Home() {
  const location = useLocation();
  const orderedExperiences = discoveryOrder
    .map((id) => experiences.find((e) => e.id === id))
    .filter((e): e is (typeof experiences)[number] => Boolean(e));

  useEffect(() => {
    const st = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (st === 'discovery') {
      const t = setTimeout(scrollToDiscovery, 80);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-mystic-gradient">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden star-bg">
        <div className="absolute inset-0 bg-mystic-radial" />
        {/* Light cosmic scene for depth (kept subtle so content stays readable) */}
        <div className="absolute inset-0 overflow-hidden">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="https://readdy.ai/api/search-image?query=Enchanted%20mystical%20interior%20hall%20with%20tall%20arched%20windows%20revealing%20a%20giant%20glowing%20full%20moon%20above%20misty%20mountains%2C%20lit%20candles%20and%20golden%20lanterns%2C%20violet%20velvet%20drapes%2C%20glowing%20amethyst%20crystal%20clusters%2C%20antique%20wooden%20table%20with%20magical%20artifacts%2C%20warm%20golden%20candlelight%20blending%20with%20violet%20cosmic%20glow%2C%20ornate%20fantasy%20digital%20painting%2C%20rich%20detail%2C%20cinematic%2C%20deep%20violet%20and%20gold%20palette%2C%20no%20text%2C%20darker%20calm%20center%20for%20text%20overlay&width=900&height=506&seq=home-mystic-room-hall&orientation=landscape"
            />
          <img
            src="https://readdy.ai/api/search-image?query=Enchanted%20mystical%20interior%20hall%20with%20tall%20arched%20windows%20revealing%20a%20giant%20glowing%20full%20moon%20above%20misty%20mountains%2C%20lit%20candles%20and%20golden%20lanterns%2C%20violet%20velvet%20drapes%2C%20glowing%20amethyst%20crystal%20clusters%2C%20antique%20wooden%20table%20with%20magical%20artifacts%2C%20warm%20golden%20candlelight%20blending%20with%20violet%20cosmic%20glow%2C%20ornate%20fantasy%20digital%20painting%2C%20rich%20detail%2C%20cinematic%2C%20deep%20violet%20and%20gold%20palette%2C%20no%20text%2C%20darker%20calm%20center%20for%20text%20overlay&width=1600&height=900&seq=home-mystic-room-hall&orientation=landscape&nocache=true"
            alt="Căn phòng huyền bí của The Mystic Room với mặt trăng lớn qua ô cửa sổ"
            title="The Mystic Room — Nơi phép màu thuộc về bạn"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0618]/75 via-[#0a0618]/45 to-[#0a0618]/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0618]/70 via-transparent to-[#0a0618]/60" />
          <div className="absolute inset-0 bg-mystic-radial" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="mystic-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-glow-gold leading-tight">
            THE MYSTIC ROOM
          </h1>

          {/* Subtitle */}
          <p className="tagline-glow text-lg md:text-xl lg:text-2xl mb-4 italic font-medium">
            Nơi phép màu thuộc về bạn
          </p>

          {/* Description */}
          <p className="mystic-text text-sm md:text-base max-w-xl mx-auto mb-10 opacity-80">
            Nền tảng kết nối những mảnh ghép từ tính cách, Tarot, bản đồ sao và thần số học để mở ra một góc nhìn mới về chính bạn.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToDiscovery}
              className="mystic-btn-primary text-sm md:text-base cursor-pointer"
            >
              Khám phá ngay
            </button>
          </div>
        </div>
      </section>

      {/* Discovery Section - single-page journey */}
      <section
        id="discovery"
        className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 scroll-mt-24"
      >
        <div className="absolute inset-0 bg-gold-radial" />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="mystic-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-glow-gold">
              Điều Gì Đang Ẩn Giấu Trong Bạn?
            </h2>
            <div className="mystic-divider mt-6 max-w-md mx-auto" />
          </div>

          {/* Experience Cards - Large 2x2 */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-10">
            {orderedExperiences.map((exp) => (
              <Link
                key={exp.id}
                to={`/explore/${exp.id}`}
                className="mystic-card group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="relative h-36 md:h-72 overflow-hidden">
                  <picture className="block w-full h-full">
                    <source media="(max-width: 768px)" srcSet={experienceMobileImages[exp.id]} />
                    <img
                      src={exp.image}
                      alt={exp.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] via-[#0a0618]/50 to-transparent" />
                </div>

                <div className="p-4 md:p-8">
                  <h3 className="mystic-heading text-lg md:text-2xl font-bold text-mystic-gold-400 mb-1 md:mb-2 leading-tight">
                    {exp.title}
                  </h3>
                  <p className="hidden md:block mystic-subheading text-sm italic text-mystic-purple-300 mb-3">
                    {exp.subtitle}
                  </p>
                  <p className="hidden md:block mystic-text text-sm leading-relaxed opacity-75">
                    {exp.description}
                  </p>
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 80px ${exp.glow}` }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}