import { memo, useMemo } from 'react';
import { SIGN_SYMBOLS, type CelestialBody } from '@/lib/astrology';
import { signData, planetColors, signColors } from '@/lib/astrologyData';

interface ChartWheelProps {
  bodies: CelestialBody[];
  ascendant: number;
}

const W = 400;
const H = 400;
const CX = W / 2;
const CY = H / 2;
const R_OUTER = 180;
const R_INNER = 145;
const R_SIGN = 162;
const R_BODY = 118;
const R_HOUSE_NUM = 128;
const R_CENTER = 40;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function lineCoords(cx: number, cy: number, r1: number, r2: number, angleDeg: number) {
  const p1 = polar(cx, cy, r1, angleDeg);
  const p2 = polar(cx, cy, r2, angleDeg);
  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
}

// Chòm sao đơn giản (đường nối giữa các điểm sáng)
const constellations: Array<{ points: [number, number][] }> = [
  { points: [[50, 60], [70, 55], [90, 65], [80, 80]] }, // mẫu
  { points: [[300, 70], [320, 65], [340, 75], [330, 90]] },
  { points: [[60, 300], [80, 290], [100, 310], [90, 330]] },
  { points: [[310, 310], [330, 300], [350, 320], [340, 340]] },
  { points: [[180, 20], [200, 15], [220, 25]] },
  { points: [[20, 200], [35, 190], [50, 205]] },
  { points: [[350, 200], [365, 190], [380, 210]] },
  { points: [[200, 350], [215, 340], [230, 355]] },
];

function ChartWheel({ bodies, ascendant }: ChartWheelProps) {
  const activeSigns = useMemo(() => {
    const set = new Set<number>();
    bodies.forEach((b) => set.add(b.signIndex));
    set.add(Math.floor(ascendant / 30) % 12);
    return set;
  }, [bodies, ascendant]);

  const sunBody = bodies.find((b) => b.key === 'sun');
  const moonBody = bodies.find((b) => b.key === 'moon');
  const ascSignIndex = Math.floor(ascendant / 30) % 12;

  // Các hành tinh để vẽ (không vẽ asc/mc dưới dạng body icon, chỉ vẽ marker đặc biệt)
  const visibleBodies = bodies.filter((b) => b.key !== 'asc' && b.key !== 'mc');

  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.15))' }}>
        <defs>
          {/* Glow filters */}
          <filter id="glow-sun">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-moon">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-asc">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-center">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Gradient cho các vùng cung */}
          {signData.map((_, i) => (
            <linearGradient key={`grad-${i}`} id={`signGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={signColors[i]} stopOpacity="0.06" />
              <stop offset="100%" stopColor={signColors[i]} stopOpacity="0.15" />
            </linearGradient>
          ))}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Background constellation lines */}
        {constellations.map((c, ci) => (
          <g key={`const-${ci}`} className="constellation-line">
            {c.points.map((p, pi) => {
              if (pi === 0) return null;
              const prev = c.points[pi - 1];
              return (
                <line
                  key={`const-line-${ci}-${pi}`}
                  x1={prev[0]} y1={prev[1]}
                  x2={p[0]} y2={p[1]}
                  className="constellation-line"
                />
              );
            })}
            {c.points.map((p, pi) => (
              <circle key={`const-dot-${ci}-${pi}`} cx={p[0]} cy={p[1]} r="1.2" fill="rgba(196,168,255,0.3)" />
            ))}
          </g>
        ))}

        {/* Outer glow rings */}
        <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R_OUTER + 3} fill="none" stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(196,168,255,0.25)" strokeWidth="1.5" />

        {/* Zodiac sign sectors (wedge shapes) */}
        {signData.map((_, i) => {
          const startAngle = (i * 30 - ascendant + 360) % 360;
          const endAngle = startAngle + 30;
          const start = polar(CX, CY, R_OUTER, startAngle);
          const end = polar(CX, CY, R_OUTER, endAngle);
          const innerStart = polar(CX, CY, R_INNER, startAngle);
          const innerEnd = polar(CX, CY, R_INNER, endAngle);
          const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
          const d = [
            `M ${innerStart.x} ${innerStart.y}`,
            `L ${start.x} ${start.y}`,
            `A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${end.x} ${end.y}`,
            `L ${innerEnd.x} ${innerEnd.y}`,
            `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
            'Z',
          ].join(' ');
          const isActive = activeSigns.has(i);
          return (
            <path
              key={`sector-${i}`}
              d={d}
              fill={`url(#signGrad-${i})`}
              stroke={isActive ? `${signColors[i]}40` : 'rgba(196,168,255,0.06)'}
              strokeWidth={isActive ? 1 : 0.5}
              style={{ transition: 'all 0.5s ease' }}
            />
          );
        })}

        {/* Inner circle border */}
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="rgba(196,168,255,0.2)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R_CENTER} fill="url(#centerGlow)" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />

        {/* House dividing lines (12 lines from center to inner) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = ((i * 30 - ascendant + 360) % 360);
          const { x1, y1, x2, y2 } = lineCoords(CX, CY, R_CENTER, R_OUTER, angle);
          return (
            <line
              key={`house-line-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i === 0 ? 'rgba(212,175,55,0.4)' : 'rgba(196,168,255,0.12)'}
              strokeWidth={i === 0 ? 1.5 : 0.8}
              strokeDasharray={i === 0 ? 'none' : '3 3'}
            />
          );
        })}

        {/* House numbers I-XII */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = ((i * 30 - ascendant + 360) % 360);
          const p = polar(CX, CY, R_HOUSE_NUM, angle + 15);
          const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][i];
          const isAscendantHouse = i === 0;
          return (
            <text
              key={`house-num-${i}`}
              x={p.x} y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isAscendantHouse ? '#d4af37' : 'rgba(196,168,255,0.25)'}
              fontSize={isAscendantHouse ? 10 : 8}
              fontFamily="Cinzel, serif"
              fontWeight={isAscendantHouse ? 600 : 400}
              style={{ transition: 'all 0.5s ease' }}
            >
              {roman}
            </text>
          );
        })}

        {/* Zodiac sign symbols and names */}
        {signData.map((sign, i) => {
          const angle = ((i * 30 - ascendant + 360) % 360) + 15;
          const p = polar(CX, CY, R_SIGN, angle);
          const isActive = activeSigns.has(i);
          const isAsc = i === ascSignIndex;
          const isSun = i === sunBody?.signIndex;
          const isMoon = i === moonBody?.signIndex;
          return (
            <g key={`sign-${i}`}>
              <text
                x={p.x} y={p.y - 6}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSun || isMoon || isAsc ? signColors[i] : 'rgba(196,168,255,0.5)'}
                fontSize={isActive ? 13 : 11}
                fontFamily="Cinzel, serif"
                fontWeight={isActive ? 600 : 400}
                filter={isSun || isMoon || isAsc ? 'url(#glow-asc)' : undefined}
                style={{ transition: 'all 0.5s ease' }}
              >
                {SIGN_SYMBOLS[i]}
              </text>
              <text
                x={p.x} y={p.y + 7}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isActive ? 'rgba(212,175,55,0.6)' : 'rgba(196,168,255,0.25)'}
                fontSize={5.5}
                fontFamily="Be Vietnam Pro, Inter, sans-serif"
              >
                {sign.name}
              </text>
            </g>
          );
        })}

        {/* Planet bodies */}
        {visibleBodies.map((b) => {
          const angle = ((b.longitude - ascendant + 360) % 360);
          const p = polar(CX, CY, R_BODY, angle);
          const isSun = b.key === 'sun';
          const isMoon = b.key === 'moon';
          const color = planetColors[b.key] || '#c4a8ff';
          const size = isSun ? 9 : isMoon ? 8 : 6.5;
          const glowFilter = isSun ? 'url(#glow-sun)' : isMoon ? 'url(#glow-moon)' : undefined;

          return (
            <g key={`body-${b.key}`}>
              {/* Glow circle */}
              <circle
                cx={p.x} cy={p.y}
                r={size + 3}
                fill={color}
                opacity={0.15}
                filter={glowFilter}
              />
              {/* Planet circle */}
              <circle
                cx={p.x} cy={p.y}
                r={size}
                fill={color}
                opacity={0.9}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={isSun ? 1.5 : 0.8}
                filter={glowFilter}
              />
              {/* Planet name */}
              <text
                x={p.x} y={p.y + size + 10}
                textAnchor="middle"
                dominantBaseline="central"
                fill={color}
                fontSize={6}
                fontFamily="Be Vietnam Pro, Inter, sans-serif"
                fontWeight={500}
                opacity={0.9}
              >
                {b.name}
              </text>
              {/* Sign symbol next to planet */}
              <text
                x={p.x} y={p.y + size + 16}
                textAnchor="middle"
                dominantBaseline="central"
                fill={color}
                fontSize={5}
                fontFamily="Cinzel, serif"
                opacity={0.7}
              >
                {SIGN_SYMBOLS[b.signIndex]}
              </text>
            </g>
          );
        })}

        {/* Ascendant marker (AC) */}
        {(() => {
          const p = polar(CX, CY, R_OUTER + 2, 0);
          return (
            <g>
              <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(212,175,55,0.6)" strokeWidth={1.5} />
              <text x={p.x + 10} y={p.y} textAnchor="middle" dominantBaseline="central" fill="#d4af37" fontSize={9} fontFamily="Cinzel, serif" fontWeight={600} filter="url(#glow-asc)">AC</text>
            </g>
          );
        })()}

        {/* DC marker (Descendant - opposite AC) */}
        {(() => {
          const p = polar(CX, CY, R_OUTER + 2, 180);
          return (
            <g>
              <text x={p.x - 10} y={p.y} textAnchor="middle" dominantBaseline="central" fill="rgba(212,175,55,0.4)" fontSize={7} fontFamily="Cinzel, serif">DC</text>
            </g>
          );
        })()}

        {/* MC marker (top) */}
        {(() => {
          const mcAngle = 270;
          const p = polar(CX, CY, R_OUTER + 2, mcAngle);
          return (
            <g>
              <text x={p.x} y={p.y - 8} textAnchor="middle" dominantBaseline="central" fill="rgba(212,175,55,0.4)" fontSize={7} fontFamily="Cinzel, serif">MC</text>
            </g>
          );
        })()}

        {/* IC marker (bottom) */}
        {(() => {
          const p = polar(CX, CY, R_OUTER + 2, 90);
          return (
            <g>
              <text x={p.x} y={p.y + 8} textAnchor="middle" dominantBaseline="central" fill="rgba(212,175,55,0.4)" fontSize={7} fontFamily="Cinzel, serif">IC</text>
            </g>
          );
        })()}

        {/* Center star */}
        <circle cx={CX} cy={CY} r="3" fill="#d4af37" filter="url(#glow-center)">
          <animate attributeName="r" values="2.5;4;2.5" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Floating star decorations around the wheel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 twinkle-star" style={{ animationDelay: '0.2s' }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 twinkle-star" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2 twinkle-star" style={{ animationDelay: '0.8s' }} />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 twinkle-star" style={{ animationDelay: '2.1s' }} />
      <div className="absolute top-[15%] left-[15%] twinkle-star" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[20%] right-[18%] twinkle-star" style={{ animationDelay: '1.2s' }} />
      <div className="absolute bottom-[18%] left-[20%] twinkle-star" style={{ animationDelay: '2.5s' }} />
      <div className="absolute bottom-[15%] right-[15%] twinkle-star" style={{ animationDelay: '0.3s' }} />
    </div>
  );
}

export default memo(ChartWheel);