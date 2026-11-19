import { memo, useMemo } from 'react';
import type { CSSProperties } from 'react';

const RUNES = ['ᛟ', 'ᚱ', 'ᚷ', 'ᚹ', 'ᛞ', 'ᚦ', '✦', '✧', '☽', '☾', '❖', '◈'];

function createRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Nền huyền bí tối giản: giữ đúng chất "phòng mystic" nhưng giảm mạnh số lớp
 * hoạt họa (ít particle/nebula hơn, bỏ lớp tia sáng blur) để nhẹ GPU.
 */
function MysticBackground() {
  const { particles, runes, crystals, trails } = useMemo(() => {
    const rnd = createRng(20260829);
    const particles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: rnd() * 100,
      top: rnd() * 100,
      size: 1 + rnd() * 2.6,
      duration: 3 + rnd() * 6,
      delay: rnd() * 5,
      color: rnd() > 0.55 ? 'rgba(212,175,55,0.9)' : rnd() > 0.3 ? 'rgba(196,168,255,0.9)' : 'rgba(255,255,255,0.8)',
    }));
    const runes = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      glyph: RUNES[i % RUNES.length],
      left: rnd() * 100,
      top: rnd() * 100,
      size: 14 + rnd() * 24,
      duration: 11 + rnd() * 12,
      delay: rnd() * 8,
    }));
    const crystals = Array.from({ length: 2 }, (_, i) => ({
      id: i,
      left: rnd() * 100,
      top: rnd() * 100,
      size: 8 + rnd() * 16,
      duration: 7 + rnd() * 9,
      delay: rnd() * 6,
    }));
    const trails = Array.from({ length: 1 }, (_, i) => ({
      id: i,
      top: 10 + rnd() * 80,
      left: -10 + rnd() * 30,
      width: 120 + rnd() * 180,
      angle: -18 + rnd() * 36,
      duration: 8 + rnd() * 8,
      delay: rnd() * 6,
    }));
    return { particles, runes, crystals, trails };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none mystic-canvas" aria-hidden="true">
      {/* Nebula clouds */}
      <div className="mystic-nebula" style={{ width: 720, height: 720, top: '-18%', left: '-12%', background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)', animationDuration: '24s' }} />
      <div className="mystic-nebula" style={{ width: 620, height: 620, bottom: '-14%', right: '-8%', background: 'radial-gradient(circle, rgba(150,60,190,0.24) 0%, rgba(150,60,190,0.07) 40%, transparent 70%)', animationDuration: '30s', animationDelay: '-12s' }} />
      <div className="mystic-nebula" style={{ width: 460, height: 460, top: '38%', left: '48%', background: 'radial-gradient(circle, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.05) 40%, transparent 70%)', animationDuration: '22s', animationDelay: '-9s' }} />

      {/* Drifting fog */}
      <div className="mystic-fog" style={{ width: 900, height: 420, top: '30%', left: '-20%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)', animationDuration: '26s' }} />

      {/* Energy trails */}
      {trails.map((t) => (
        <span
          key={t.id}
          className="mystic-trail"
          style={{
            top: `${t.top}%`,
            left: `${t.left}%`,
            width: t.width,
            animationDuration: `${t.duration}s`,
            animationDelay: `${t.delay}s`,
            '--angle': `${t.angle}deg`,
          } as CSSProperties}
        />
      ))}

      {/* Crystals */}
      {crystals.map((c) => (
        <span
          key={c.id}
          className="mystic-crystal"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            width: c.size,
            height: c.size,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {/* Runes / ancient glyphs */}
      {runes.map((r) => (
        <span
          key={r.id}
          className="mystic-rune"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            fontSize: r.size,
            animationDuration: `${r.duration}s`,
            animationDelay: `${r.delay}s`,
          }}
        >
          {r.glyph}
        </span>
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="mystic-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default memo(MysticBackground);