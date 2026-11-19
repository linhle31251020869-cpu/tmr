import { useEffect, useRef, useState } from 'react';

interface VerticalWheelProps {
  items: string[];
  selected: string;
  onChange: (value: string) => void;
  height?: number; // px per row
  visible?: number; // number of visible rows (odd recommended)
  accent?: string;
}

// Bộ chọn kiểu vòng cuộn dọc (giống app điện thoại) — chọn item nằm ở giữa
export default function VerticalWheel({
  items,
  selected,
  onChange,
  height = 52,
  visible = 5,
  accent = '#d4af37',
}: VerticalWheelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, items.indexOf(selected)),
  );
  const wheelH = height * visible;
  const half = (visible - 1) / 2;

  // Kéo về item được chọn khi giá trị thay đổi từ bên ngoài
  useEffect(() => {
    const idx = Math.max(0, items.indexOf(selected));
    setActiveIndex(idx);
  }, [selected, items]);

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / height);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    setActiveIndex(clamped);
    // Snap thẳng hàng về center
    requestAnimationFrame(() => {
      if (ref.current) ref.current.scrollTop = clamped * height;
    });
    const value = items[clamped];
    if (value !== selected) onChange(value);
  };

  return (
    <div className="relative select-none" style={{ height: wheelH, ['--wh' as string]: `${height}px` }}>
      {/* Vùng highlight trung tâm */}
      <div
        className="absolute inset-x-0 rounded-full pointer-events-none"
        style={{
          top: half * height + 2,
          bottom: half * height + 2,
          border: `1px solid ${accent}55`,
          background: 'rgba(212,175,55,0.06)',
          boxShadow: `inset 0 0 30px rgba(212,175,55,0.05)`,
        }}
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-auto no-scrollbar"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <div style={{ paddingTop: half * height, paddingBottom: half * height }}>
          {items.map((item) => {
            const idx = items.indexOf(item);
            const isActive = idx === activeIndex;
            return (
              <div
                key={item}
                onClick={() => {
                  if (ref.current) {
                    ref.current.scrollTop = idx * height;
                    ref.current.dispatchEvent(new Event('scroll'));
                  }
                  if (item !== selected) onChange(item);
                }}
                style={{
                  height,
                  scrollSnapAlign: 'center',
                  transition: 'transform 0.15s ease, color 0.2s ease, opacity 0.2s ease',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}
                className={`flex items-center justify-center cursor-pointer ${
                  isActive ? 'font-semibold' : ''
                }`}
              >
                <span
                  className="text-base tracking-wide"
                  style={{
                    color: isActive ? accent : 'rgba(196,168,255,0.55)',
                    fontFamily: 'var(--font-heading), serif',
                    opacity: isActive ? 1 : 0.85,
                    textShadow: isActive ? `0 0 14px ${accent}55` : 'none',
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}