import type { ReactNode } from 'react';

interface PageHeroProps {
  image: string;
  imageAlt?: string;
  icons?: string[];
  children: ReactNode;
}

// Vị trí & kiểu dáng cho các biểu tượng hoạt họa nổi quanh banner (mang vibe mystic)
const ICON_SPOTS = [
  { top: '18%', left: '5%', size: 30, cls: 'text-mystic-gold-400/45', delay: '0s' },
  { top: '66%', left: '9%', size: 22, cls: 'text-mystic-purple-200/45', delay: '1.4s' },
  { top: '22%', left: '91%', size: 28, cls: 'text-mystic-gold-400/40', delay: '0.7s' },
  { top: '70%', left: '93%', size: 30, cls: 'text-mystic-purple-200/40', delay: '2.1s' },
  { top: '10%', left: '72%', size: 22, cls: 'text-mystic-gold-300/35', delay: '1s' },
  { top: '84%', left: '58%', size: 22, cls: 'text-mystic-purple-200/35', delay: '1.8s' },
];

const DEFAULT_ICONS = [
  'ri-moon-clear-line',
  'ri-star-line',
  'ri-sparkling-line',
  'ri-planet-line',
  'ri-magic-line',
  'ri-leaf-line',
];

export default function PageHero({ image, imageAlt = '', icons = DEFAULT_ICONS, children }: PageHeroProps) {
  const glyphs = icons.length > 0 ? icons : DEFAULT_ICONS;

  return (
    <section className="relative min-h-[320px] md:min-h-[400px] flex items-center overflow-hidden starfield-bg">
      {/* Ảnh nền chủ đề */}
      <img
        src={image}
        alt={imageAlt}
        title={imageAlt || 'The Mystic Room'}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Lớp phủ tím cosmic + tối để nội dung rõ ràng */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#160b30]/75 via-[#1c1040]/60 to-[#0a0618]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0618]/75 via-transparent to-[#2a1550]/55" />
      <div className="absolute inset-0 bg-mystic-radial" />

      {/* Biểu tượng hoạt họa nổi theo chủ đề */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {glyphs.slice(0, ICON_SPOTS.length).map((icon, i) => {
          const spot = ICON_SPOTS[i];
          return (
            <i
              key={icon + i}
              className={`${icon} ${spot.cls} hero-float`}
              style={{ top: spot.top, left: spot.left, fontSize: spot.size, animationDelay: spot.delay }}
            />
          );
        })}
      </div>

      {/* Nội dung */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-14 md:py-20">
        {children}
      </div>
    </section>
  );
}