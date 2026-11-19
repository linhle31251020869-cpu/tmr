// Module tính toán thiên văn cho bản đồ sao (Birth Chart)
// Dựa trên các thuật toán công bố công khai của Jean Meeus (Astronomical Algorithms)
// và bộ phần tử quỹ đạo xấp xỉ của JPL (Standish) — độ chính xác đủ cho xác định cung hoàng đạo.

export interface GeoPosition {
  lat: number;
  lon: number;
  tz: number; // timezone offset in hours (e.g. +7 for Vietnam)
}

export interface CelestialBody {
  key: string;
  name: string;
  icon: string;
  longitude: number; // ecliptic longitude 0-360
  signIndex: number; // 0=Aries .. 11=Pisces
  sign: string;
}

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

function normalize360(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function sin(d: number): number {
  return Math.sin(d * RAD);
}
function cos(d: number): number {
  return Math.cos(d * RAD);
}

// Julian Day (UTC) từ ngày giờ địa phương
function jdAtMidnight(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5
  );
}

export function julianDay(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  tzHours: number,
): number {
  // Tổng số phút UTC = giờ địa phương - độ lệch múi giờ (xử lý đúng khi lệch qua ngày)
  const totalUtcMinutes = hour * 60 + minute - Math.round(tzHours * 60);
  return jdAtMidnight(year, month, day) + totalUtcMinutes / 1440;
}

// Độ nghiêng hoàng đạo (obliquity)
function obliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.43929111 - 0.013004167 * T - 0.000000164 * T * T + 0.0000005036 * T * T * T;
}

// Kinh độ hoàng đạo của Mặt Trời (Meeus ch.25, low precision) — độ chính xác ~0.01°
export function solarLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
    (0.019993 - 0.000101 * T) * sin(2 * M) +
    0.000289 * sin(3 * M);
  return normalize360(L0 + C);
}

// Kinh độ hoàng đạo của Mặt Trăng (Meeus ch.47, low precision) — độ chính xác ~0.3°
export function lunarLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T;
  const lon =
    Lp +
    6.288774 * sin(Mp) +
    1.274027 * sin(2 * D - Mp) +
    0.658314 * sin(2 * D) +
    0.213618 * sin(2 * Mp) -
    0.185116 * sin(M) -
    0.114332 * sin(2 * F) +
    0.058793 * sin(2 * D - 2 * Mp) +
    0.057066 * sin(2 * D - M - Mp) +
    0.053322 * sin(2 * D + Mp) +
    0.045774 * sin(2 * D - M) +
    0.04103 * sin(Mp - M) -
    0.034718 * sin(D) -
    0.030465 * sin(M + Mp) +
    0.015326 * sin(2 * (D - F)) -
    0.012528 * sin(2 * F + Mp) -
    0.01098 * sin(2 * F - Mp) +
    0.010674 * sin(4 * D - Mp) +
    0.010034 * sin(3 * Mp) +
    0.008548 * sin(4 * D - 2 * Mp) -
    0.00791 * sin(M - Mp + 2 * D) -
    0.006783 * sin(2 * D + M) +
    0.005162 * sin(Mp - D);
  return normalize360(lon);
}

// Giờ sao địa phương (Local Sidereal Time, độ)
function localSiderealTime(jd: number, longitude: number): number {
  const T = (jd - 2451545.0) / 36525;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  gmst = normalize360(gmst);
  return normalize360(gmst + longitude);
}

// Cung Mọc (Ascendant) — độ
export function ascendantLongitude(jd: number, lat: number, lon: number): number {
  const lst = localSiderealTime(jd, lon) * RAD;
  const latitude = lat * RAD;
  const eps = obliquity(jd) * RAD;
  const asc = Math.atan2(
    Math.cos(lst),
    -(Math.sin(lst) * Math.cos(eps) + Math.tan(latitude) * Math.sin(eps)),
  );
  return normalize360(asc * DEG);
}

// --- Vị trí các hành tinh (JPL approximate orbital elements / Standish) ---
interface OrbitalElements {
  a: number;
  e: number;
  i: number;
  N: number; // longitude of ascending node
  w: number; // longitude of perihelion
  M0: number; // mean anomaly at J2000
  n: number; // mean motion (deg/day)
}

const ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: { a: 0.38709927, e: 0.20563593, i: 7.00497902, N: 48.33076593, w: 77.45779628, M0: 174.79252722, n: 4.09233445 },
  Venus: { a: 0.72333566, e: 0.00677672, i: 3.39467605, N: 76.67984255, w: 131.60246718, M0: 50.37663232, n: 1.6021302244 },
  Earth: { a: 1.00000261, e: 0.01671123, i: -0.00001531, N: 0.0, w: 102.93768193, M0: 357.52688973, n: 0.98564736628 },
  Mars: { a: 1.52371034, e: 0.0933941, i: 1.84969142, N: 49.55953891, w: -23.94362959, M0: 19.39019754, n: 0.5240207766 },
  Jupiter: { a: 5.202887, e: 0.04838624, i: 1.30439695, N: 100.47390909, w: 14.72847983, M0: 19.66796518, n: 0.0830853001 },
  Saturn: { a: 9.53667594, e: 0.05386179, i: 2.48599187, N: 113.66242448, w: 92.59887831, M0: 317.35536592, n: 0.0334442282 },
};

function heliocentric(elem: OrbitalElements, jd: number): { x: number; y: number; z: number } {
  const d = jd - 2451545.0;
  const M = normalize360(elem.M0 + elem.n * d);
  const Mr = M * RAD;
  // Giải phương trình Kepler: E - e*sin(E) = M
  let E = Mr + elem.e * Math.sin(Mr);
  for (let k = 0; k < 6; k++) {
    E = E - (E - elem.e * Math.sin(E) - Mr) / (1 - elem.e * Math.cos(E));
  }
  const xp = elem.a * (Math.cos(E) - elem.e);
  const yp = elem.a * Math.sqrt(1 - elem.e * elem.e) * Math.sin(E);
  const r = Math.sqrt(xp * xp + yp * yp);
  const v = Math.atan2(yp, xp); // true anomaly
  // argument of perihelion
  const omega = (elem.w - elem.N) * RAD;
  const ang = omega + v;
  const N = elem.N * RAD;
  const inc = elem.i * RAD;
  const x = r * (Math.cos(N) * Math.cos(ang) - Math.sin(N) * Math.sin(ang) * Math.cos(inc));
  const y = r * (Math.sin(N) * Math.cos(ang) + Math.cos(N) * Math.sin(ang) * Math.cos(inc));
  const z = r * Math.sin(ang) * Math.sin(inc);
  return { x, y, z };
}

// Kinh độ hoàng đạo địa tâm của một hành tinh
function planetLongitude(key: string, jd: number): number {
  const earth = heliocentric(ELEMENTS.Earth, jd);
  const planet = heliocentric(ELEMENTS[key], jd);
  const xg = planet.x - earth.x;
  const yg = planet.y - earth.y;
  return normalize360(Math.atan2(yg, xg) * DEG);
}

const SIGNS = [
  'Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ',
  'Thiên Bình', 'Bọ Cạp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư',
];

export const SIGN_SYMBOLS = [
  '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓',
];

export function signFromLongitude(lon: number): { index: number; name: string; symbol: string } {
  const index = Math.floor(normalize360(lon) / 30) % 12;
  return { index, name: SIGNS[index], symbol: SIGN_SYMBOLS[index] };
}

export interface ChartResult {
  jd: number;
  ascendant: number;
  bodies: CelestialBody[];
}

// Tính toàn bộ bản đồ sao
export function computeChart(
  dateStr: string,
  timeStr: string,
  geo: GeoPosition,
): ChartResult | null {
  if (!dateStr || !timeStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  if (!year || !month || !day || isNaN(hour) || isNaN(minute)) return null;

  const jd = julianDay(year, month, day, hour, minute, geo.tz);

  const sunLon = solarLongitude(jd);
  const moonLon = lunarLongitude(jd);
  const asc = ascendantLongitude(jd, geo.lat, geo.lon);

  const sunSign = signFromLongitude(sunLon);
  const moonSign = signFromLongitude(moonLon);
  const ascSign = signFromLongitude(asc);

  const bodies: CelestialBody[] = [
    { key: 'sun', name: 'Mặt Trời', icon: 'ri-sun-line', longitude: sunLon, signIndex: sunSign.index, sign: sunSign.name },
    { key: 'moon', name: 'Mặt Trăng', icon: 'ri-moon-clear-line', longitude: moonLon, signIndex: moonSign.index, sign: moonSign.name },
  ];

  const planets: Array<{ key: string; name: string; icon: string }> = [
    { key: 'Mercury', name: 'Thủy Tinh', icon: 'ri-planet-line' },
    { key: 'Venus', name: 'Kim Tinh', icon: 'ri-planet-line' },
    { key: 'Mars', name: 'Hỏa Tinh', icon: 'ri-planet-line' },
    { key: 'Jupiter', name: 'Mộc Tinh', icon: 'ri-planet-line' },
    { key: 'Saturn', name: 'Thổ Tinh', icon: 'ri-planet-line' },
  ];

  for (const p of planets) {
    const lon = planetLongitude(p.key, jd);
    const s = signFromLongitude(lon);
    bodies.push({ key: p.key, name: p.name, icon: p.icon, longitude: lon, signIndex: s.index, sign: s.name });
  }

  // Ascendant & Midheaven
  bodies.push({ key: 'asc', name: 'Cung Mọc', icon: 'ri-arrow-right-up-line', longitude: asc, signIndex: ascSign.index, sign: ascSign.name });
  bodies.push({ key: 'mc', name: 'Thiên Đỉnh', icon: 'ri-arrow-up-line', longitude: normalize360(asc + 270), signIndex: signFromLongitude(normalize360(asc + 270)).index, sign: signFromLongitude(normalize360(asc + 270)).name });

  return { jd, ascendant: asc, bodies };
}

// Số nhà (Equal House) cho một kinh độ hoàng đạo
export function houseOf(longitude: number, ascendant: number): number {
  const rel = normalize360(longitude - ascendant);
  return Math.floor(rel / 30) + 1;
}

// Vị trí (độ) của một cơ thể trên vòng bản đồ (để render trực quan)
export function wheelAngle(longitude: number, ascendant: number): number {
  return normalize360(longitude - ascendant);
}