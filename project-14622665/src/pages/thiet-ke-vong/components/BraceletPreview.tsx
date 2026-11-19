// Vòng tay được dựng từ TỪNG HẠT ĐÁ riêng biệt, dùng CHÍNH ẢNH VIÊN ĐÁ THẬT
// (ảnh đã tách nền) làm hạt nên chiếc vòng nhìn giống vòng thật 100%.
// Các hạt xếp SÁT NHAU thành một chuỗi vòng liền mạch, không còn nền tròn hay dây nối.
// Charm gắn vào KHE GIỮA hai viên đá.
import { useMemo } from 'react';

export interface PreviewCharm {
  id: string;
  image: string;
  scale?: number;
}

interface BraceletPreviewProps {
  stoneColor: string;
  stoneId: string;
  stoneImage?: string;
  charms: PreviewCharm[];
}

const CX = 180;
const CY = 178;
const R = 104;
const BEAD_COUNT = 22;
const STEP = (Math.PI * 2) / BEAD_COUNT;
// Bán kính hạt hơi lớn hơn nửa khoảng cách để các hạt chạm/khớp nhẹ vào nhau như vòng thật.
const BEAD_R = ((Math.PI * R) / BEAD_COUNT) * 1.08;
const TOP_ANGLE = -Math.PI / 2;

function hexToRgb(hex: string) {
  let h = (hex || '#888888').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) h = '888888';
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('')}`;
}

function mixHex(hex: string, target: { r: number; g: number; b: number }, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return toHex(r + (target.r - r) * amount, g + (target.g - g) * amount, b + (target.b - b) * amount);
}

const lighten = (hex: string, amount: number) => mixHex(hex, { r: 255, g: 255, b: 255 }, amount);
const darken = (hex: string, amount: number) => mixHex(hex, { r: 0, g: 0, b: 0 }, amount);

/** Ép một góc bất kỳ về đúng khe giữa hai hạt đá gần nhất. */
function snapToGap(angle: number) {
  const raw = (angle - TOP_ANGLE) / STEP - 0.5;
  const idx = Math.round(raw);
  return TOP_ANGLE + (idx + 0.5) * STEP;
}

export default function BraceletPreview({ stoneColor, stoneId, stoneImage, charms }: BraceletPreviewProps) {
  const { r, g, b } = hexToRgb(stoneColor);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  const isDark = lum < 0.24;
  const isMilky = stoneId === 'moonstone' || stoneId === 'clear-quartz';
  const isGlassy = stoneId === 'aquamarine' || stoneId === 'clear-quartz' || stoneId === 'rose-quartz';

  const core = lighten(stoneColor, isDark ? 0.16 : 0.04);
  const highlight = lighten(stoneColor, isDark ? 0.5 : 0.68);
  const base = lighten(stoneColor, isMilky ? 0.06 : 0.01);
  const shadow = darken(stoneColor, isDark ? 0.3 : 0.5);
  const rim = darken(stoneColor, isDark ? 0.12 : 0.58);

  const beads = useMemo(() => {
    return Array.from({ length: BEAD_COUNT }, (_, i) => {
      const angle = TOP_ANGLE + i * STEP;
      return { id: i, x: CX + Math.cos(angle) * R, y: CY + Math.sin(angle) * R };
    });
  }, []);

  // Phân bố charm đều quanh cung dưới, mỗi charm nằm đúng khe giữa 2 hạt đá.
  const charmLayout = useMemo(() => {
    const n = charms.length;
    if (n === 0) return [];
    const arcDeg = n === 1 ? 0 : Math.min(132, 42 * (n - 1));
    const arc = (arcDeg * Math.PI) / 180;
    const center = Math.PI / 2;
    const baseSize = n <= 1 ? 82 : n <= 2 ? 72 : n <= 4 ? 60 : n <= 6 ? 50 : 44;
    return charms.map((charm, k) => {
      const t = n === 1 ? 0.5 : k / (n - 1);
      const desired = center - arc / 2 + t * arc;
      const angle = snapToGap(desired);
      const size = baseSize * (charm.scale ?? 1);
      return {
        id: charm.id,
        image: charm.image,
        x: CX + Math.cos(angle) * R,
        y: CY + Math.sin(angle) * R,
        size,
        delay: (k * 0.4).toFixed(2),
      };
    });
  }, [charms]);

  return (
    <svg
      viewBox="0 0 360 430"
      className="w-full h-full"
      role="img"
      aria-label="Xem trước vòng tay huyền bí"
    >
      <defs>
        <radialGradient id="braceletGlow" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.18" />
          <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="beadBody" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={highlight} style={{ transition: 'stop-color 0.45s ease' }} />
          <stop offset="42%" stopColor={core} style={{ transition: 'stop-color 0.45s ease' }} />
          <stop offset="78%" stopColor={base} style={{ transition: 'stop-color 0.45s ease' }} />
          <stop offset="100%" stopColor={shadow} style={{ transition: 'stop-color 0.45s ease' }} />
        </radialGradient>

        <radialGradient id="beadSheen" cx="62%" cy="64%" r="52%">
          <stop offset="0%" stopColor="#bfe0ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#bfe0ff" stopOpacity="0" />
        </radialGradient>

        <clipPath id="beadClip">
          <circle r={BEAD_R} />
        </clipPath>

        <filter id="beadSoft" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="2.2" stdDeviation="2" floodColor="#0a0618" floodOpacity="0.45" />
        </filter>

        <filter id="charmSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0a0618" floodOpacity="0.55" />
        </filter>
      </defs>

      <ellipse cx={CX} cy={CY} rx={162} ry={162} fill="url(#braceletGlow)" />

      <g filter="url(#beadSoft)">
        {beads.map((bead) => (
          <g key={bead.id} transform={`translate(${bead.x}, ${bead.y})`}>
            {stoneImage ? (
              <>
                {/* Bóng nền phía sau để hạt nổi khối */}
                <circle r={BEAD_R * 0.99} fill={shadow} opacity={isDark ? 0.85 : 0.7} />
                {/* Hạt đá thật — cắt tròn để xếp khít như chuỗi thật */}
                <image
                  href={stoneImage}
                  x={-BEAD_R * 1.35}
                  y={-BEAD_R * 1.35}
                  width={BEAD_R * 2 * 1.35}
                  height={BEAD_R * 2 * 1.35}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#beadClip)"
                  style={{ transition: 'opacity 0.35s ease' }}
                />
                {/* Viền mờ giúp phân tách các hạt khi chồng mép */}
                <circle r={BEAD_R} fill="none" stroke={rim} strokeWidth={0.6} opacity={0.55} />
                {/* Điểm sáng nhẹ phía trên để hạt bóng như thật */}
                <ellipse
                  cx={-BEAD_R * 0.3}
                  cy={-BEAD_R * 0.36}
                  rx={BEAD_R * 0.22}
                  ry={BEAD_R * 0.13}
                  fill="#ffffff"
                  opacity={isDark ? 0.35 : 0.28}
                  transform="rotate(-24)"
                />
              </>
            ) : (
              <>
                <circle
                  r={BEAD_R}
                  fill="url(#beadBody)"
                  stroke={rim}
                  strokeWidth={0.7}
                  style={{ transition: 'stroke 0.45s ease' }}
                />
                {isMilky && <circle r={BEAD_R} fill="url(#beadSheen)" opacity={0.75} />}
                {isGlassy && <circle r={BEAD_R} fill="#ffffff" opacity={0.08} />}
                <ellipse
                  cx={BEAD_R * 0.26}
                  cy={BEAD_R * 0.32}
                  rx={BEAD_R * 0.62}
                  ry={BEAD_R * 0.4}
                  fill={shadow}
                  opacity={isDark ? 0.35 : 0.22}
                />
                <ellipse
                  cx={-BEAD_R * 0.34}
                  cy={-BEAD_R * 0.36}
                  rx={BEAD_R * 0.26}
                  ry={BEAD_R * 0.18}
                  fill="#ffffff"
                  opacity={isDark ? 0.85 : 0.7}
                  transform="rotate(-24)"
                />
                <circle
                  cx={-BEAD_R * 0.12}
                  cy={-BEAD_R * 0.52}
                  r={BEAD_R * 0.1}
                  fill="#ffffff"
                  opacity={isDark ? 0.6 : 0.5}
                />
              </>
            )}
          </g>
        ))}
      </g>

      {/* Nhiều charm gắn vào khe giữa các hạt đá.
          Riêng charm Trái Tim được nối thêm một sợi dây treo dài phía trên
          để buông xuống đều và dài bằng các charm khác. */}
      {charmLayout.map((charm) => {
        const isHeart = charm.id === 'heart';
        const cord = isHeart ? charm.size * 0.78 : 0;
        const imgX = charm.x - charm.size / 2;
        const imgY = charm.y - charm.size * 0.06 + cord;
        return (
          <g
            key={charm.id}
            className="charm-sway"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 0%', animationDelay: `${charm.delay}s` }}
          >
            {isHeart && (
              <>
                <line
                  x1={charm.x}
                  y1={charm.y}
                  x2={charm.x}
                  y2={imgY + 1}
                  stroke="#d4af37"
                  strokeWidth={1.1}
                  strokeLinecap="round"
                />
                <circle cx={charm.x} cy={charm.y} r={2.4} fill="none" stroke="#d4af37" strokeWidth={1.1} />
              </>
            )}
            <image
              href={charm.image}
              x={imgX}
              y={imgY}
              width={charm.size}
              height={charm.size}
              preserveAspectRatio="xMidYMid meet"
              filter="url(#charmSoft)"
            />
          </g>
        );
      })}
    </svg>
  );
}