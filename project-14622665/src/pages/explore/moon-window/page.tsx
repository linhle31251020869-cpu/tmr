import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  computeChart,
  houseOf,
  signFromLongitude,
  type ChartResult,
  type GeoPosition,
} from '@/lib/astrology';
import {
  signData,
  cityList,
  sunSignDescriptions,
  moonSignDescriptions,
  risingSignDescriptions,
} from '@/lib/astrologyData';
import ChartWheel from './components/ChartWheel';
import { buildPortraitNarrative, type PortraitNarrative } from '@/lib/birthChartNarrative';
import { useAuth } from '@/context/AuthContext';
import { saveResult, saveProfile } from '@/lib/mysticStore';
import { trackEvent } from '@/lib/tracking';
import ExploreDisclaimer from '@/components/feature/ExploreDisclaimer';
import ExploreNext from '@/components/feature/ExploreNext';

interface PeriodInfo {
  period: string;
  sub: string;
  icon: string;
}

function periodOfHour(h: number): PeriodInfo {
  if (h < 6) return { period: 'Ban Đêm', sub: 'Khuya', icon: 'ri-moon-clear-line' };
  if (h < 11) return { period: 'Ban Ngày', sub: 'Sáng sớm', icon: 'ri-sun-line' };
  if (h < 14) return { period: 'Ban Ngày', sub: 'Giữa trưa', icon: 'ri-sun-line' };
  if (h < 18) return { period: 'Ban Ngày', sub: 'Buổi chiều', icon: 'ri-sun-line' };
  if (h < 21) return { period: 'Ban Đêm', sub: 'Chập tối', icon: 'ri-moon-line' };
  return { period: 'Ban Đêm', sub: 'Khuya', icon: 'ri-moon-clear-line' };
}

// Danh sách giờ (00-23) và phút (00-59) để người dùng chọn giờ sinh chi tiết theo thang 24h
const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// Chuẩn hóa chuỗi để tìm kiếm không phân biệt dấu tiếng Việt và chữ hoa/thường.
// Ví dụ: "ha noi" -> "ha noi", "Hà Nội" -> "ha noi", "da nang" -> "da nang".
function normalizeText(input: string): string {
  return (input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export default function MoonWindow() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [birthHour, setBirthHour] = useState('12');
  const [birthMinute, setBirthMinute] = useState('00');
  const [rememberTime, setRememberTime] = useState(true);
  const [timeApprox, setTimeApprox] = useState(false);
  const [cityIndex, setCityIndex] = useState(-1);
  // Bắt đầu để trống: buộc người dùng chủ động chọn nơi sinh (không mặc định về Hà Nội).
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeOpen, setPlaceOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [customTz, setCustomTz] = useState('7');
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [payStep, setPayStep] = useState(1);
  const [payPlan, setPayPlan] = useState<'single' | 'combo'>('single');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  // Nơi sinh đã được dùng thực tế để tính bản đồ sao (để hiển thị rõ trên màn kết quả)
  const [activePlace, setActivePlace] = useState<{ label: string; lat: number; lon: number; tz: number } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const deepRef = useRef<HTMLDivElement | null>(null);
  const placeRef = useRef<HTMLDivElement | null>(null);

  // Đóng danh sách gợi ý nơi sinh khi bấm ra ngoài ô này (thay cho cơ chế blur dễ bị lỗi).
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (placeRef.current && !placeRef.current.contains(e.target as Node)) {
        setPlaceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const handleTimeChange = (hour: string, minute: string) => {
    setBirthHour(hour);
    setBirthMinute(minute);
    setBirthTime(`${hour}:${minute}`);
  };

  const handleSubmit = () => {
    setError('');
    if (!birthDate) {
      setError('Vui lòng nhập ngày sinh.');
      return;
    }
    setTimeApprox(!rememberTime);
    const calcTime = rememberTime ? birthTime : '12:00';

    // Xác định nơi sinh thực tế dùng để tính bản đồ sao.
    // - Chế độ tọa độ thủ công: dùng đúng lat/lon/tz người dùng nhập.
    // - Chế độ chọn tỉnh/thành: khớp chính xác với danh sách. Nếu gõ tên không có
    //   trong danh sách thì báo lỗi rõ ràng, KHÔNG âm thầm lấy Hà Nội.
    let geo: GeoPosition;
    let placeLabel: string;
    if (customMode) {
      const lat = parseFloat(customLat);
      const lon = parseFloat(customLon);
      const tz = parseFloat(customTz);
      if (isNaN(lat) || isNaN(lon) || isNaN(tz)) {
        setError('Vui lòng nhập tọa độ và múi giờ hợp lệ.');
        return;
      }
      geo = { lat, lon, tz };
      placeLabel = `Tọa độ thủ công (${lat}, ${lon})`;
    } else {
      const trimmed = placeQuery.trim();
      const norm = normalizeText(placeQuery);
      let resolvedIndex = cityIndex;
      if (norm) {
        const exact = cityList.findIndex((c) => normalizeText(c.name) === norm);
        const partial = exact >= 0 ? exact : cityList.findIndex((c) => normalizeText(c.name).includes(norm));
        if (partial >= 0) resolvedIndex = partial;
        else {
          setError('Không tìm thấy tỉnh/thành phố này. Hãy chọn từ danh sách gợi ý, hoặc bật "Nhập tọa độ thủ công" để nhập chính xác.');
          return;
        }
      } else if (cityIndex < 0) {
        setError('Vui lòng chọn nơi sinh của bạn.');
        return;
      }
      const city = cityList[resolvedIndex];
      if (!city) {
        setError('Vui lòng chọn nơi sinh của bạn.');
        return;
      }
      geo = { lat: city.lat, lon: city.lon, tz: city.tz };
      placeLabel = city.name;
    }
    const result = computeChart(birthDate, calcTime, geo);
    if (!result) {
      setError('Không thể tính toán. Vui lòng kiểm tra lại thông tin.');
      return;
    }
    // Lưu chính xác nơi sinh đã dùng để tính (không bị mặc định về Hà Nội)
    setActivePlace({ label: placeLabel, lat: geo.lat, lon: geo.lon, tz: geo.tz });
    setChart(result);
    void trackEvent('birthchart_viewed', { sunSign: result.bodies.find((b) => b.key === 'sun')?.sign }, user?.id);
    setPayOpen(false);
    setPayStep(1);
    setSavedMsg(null);
  };

  const reset = () => {
    setBirthDate('');
    setBirthHour('12');
    setBirthMinute('00');
    setBirthTime('12:00');
    setRememberTime(true);
    setTimeApprox(false);
    setCityIndex(0);
    setPlaceQuery('');
    setPlaceOpen(false);
    setCustomMode(false);
    setCustomLat('');
    setCustomLon('');
    setCustomTz('7');
    setChart(null);
    setPayOpen(false);
    setPayStep(1);
    setPayPlan('single');
    setError('');
    setSavedMsg(null);
    setSaved(false);
    setUnlocked(false);
    setActivePlace(null);
  };

  const handlePaid = () => {
    setUnlocked(true);
    setPayOpen(false);
    setPayStep(1);
    void trackEvent('birthchart_unlocked', { plan: payPlan, sunSign: chart?.bodies.find((b) => b.key === 'sun')?.sign }, user?.id);
    window.setTimeout(() => deepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  };

  const handleSave = async (): Promise<boolean> => {
    if (!user) {
      navigate('/auth', { state: { redirect: '/explore/moon-window' } });
      return false;
    }
    if (!chart) return false;
    setSaving(true);
    setSavedMsg(null);
    const sunBody = chart.bodies.find((b) => b.key === 'sun');
    const moonBody = chart.bodies.find((b) => b.key === 'moon');
    const ascSign = signFromLongitude(chart.ascendant);
    const planetKeys = ['sun', 'moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    await saveResult(user.id, 'moon-window', {
      sunSign: sunBody?.sign,
      moonSign: moonBody?.sign,
      risingSign: ascSign?.name,
      planets: chart.bodies
        .filter((b) => planetKeys.includes(b.key))
        .map((b) => ({ name: b.name, sign: b.sign, house: houseOf(b.longitude, chart.ascendant) })),
      birthDate,
      birthTime: rememberTime ? birthTime : 'Không rõ',
      city: customMode ? 'Tùy chỉnh' : (placeQuery.trim() || cityList[cityIndex]?.name || ''),
    });
    await saveProfile(user.id, {
      sun_sign: sunBody?.sign || '',
      moon_sign: moonBody?.sign || '',
      rising_sign: ascSign?.name || '',
    });
    setSaving(false);
    setSaved(true);
    setSavedMsg('Đã lưu kết quả bản đồ sao vào hồ sơ!');
    return true;
  };

  const sunBody = chart?.bodies.find((b) => b.key === 'sun');
  const moonBody = chart?.bodies.find((b) => b.key === 'moon');
  const ascSign = chart ? signFromLongitude(chart.ascendant) : null;

  const planetKeys = ['sun', 'moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

  const periodInfo = periodOfHour(Number(birthHour || 12));
  const isDay = periodInfo.period === 'Ban Ngày';

  const hourNum = Number(birthHour || 12);
  const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
  const ampm = hourNum < 12 ? 'AM' : 'PM';
  const displayTime = `${hour12}:${birthMinute} ${ampm}`;

  // Nếu ô tìm kiếm vẫn còn giữ tên tỉnh/thành đang chọn (chưa gõ từ mới) thì hiện toàn bộ danh sách 63 tỉnh/thành.
  const selectedCityName = cityIndex >= 0 ? cityList[cityIndex]?.name || '' : '';
  const queryNorm = normalizeText(placeQuery);
  const isFiltering = queryNorm !== '' && queryNorm !== normalizeText(selectedCityName);
  const filteredCities = isFiltering
    ? cityList.filter((c) => normalizeText(c.name).includes(queryNorm))
    : cityList;

  // Bức tranh Free
  const portrait = useMemo<PortraitNarrative | null>(() => {
    if (!chart || !sunBody || !moonBody || !ascSign) return null;
    const sunSignInfo = signData[sunBody.signIndex];
    return buildPortraitNarrative({
      sunSign: sunBody.sign,
      sunElement: sunSignInfo.element,
      sunKeywords: sunSignInfo.keywords,
      sunText: sunSignDescriptions[sunBody.sign] || sunSignInfo.description,
      moonSign: moonBody.sign,
      moonText: moonSignDescriptions[moonBody.sign] || 'Cảm xúc của bạn mang màu sắc của cung này.',
      risingSign: ascSign.name,
      risingText: risingSignDescriptions[ascSign.name] || 'Ấn tượng đầu tiên của bạn mang màu sắc của cung này.',
    });
  }, [chart, sunBody, moonBody, ascSign]);

  const lifeBlocks = portrait
    ? [
        { key: 'work', title: 'Bạn Trong Công Việc', body: portrait.work },
        { key: 'study', title: 'Bạn Trong Học Tập', body: portrait.study },
        { key: 'love', title: 'Bạn Trong Tình Cảm', body: portrait.love },
        { key: 'friendship', title: 'Bạn Trong Tình Bạn & Quan Hệ', body: portrait.friendship },
      ]
    : [];

  const deepFullCards = [
    {
      key: 'love',
      title: 'Chuyện Tình Cảm',
      body: `Với Mặt Trời ${sunBody?.sign || ''} kết hợp Mặt Trăng ${moonBody?.sign || ''}, bạn vô thức tìm kiếm một người khiến mình cảm thấy an toàn cả về lý trí lẫn cảm xúc. Bạn dễ bị thu hút bởi mẫu người mạnh mẽ, bí ẩn, nhưng điều bạn thực sự cần lại là sự hiện diện ổn định và biết lắng nghe. Điểm mù lớn nhất là bạn hay im lặng chịu đựng thay vì nói ra nhu cầu — rồi tổn thương âm ỉ khi đối phương không tự hiểu được.`,
    },
    {
      key: 'psyche',
      title: 'Nút Thắt Tâm Lý',
      body: `Cảm giác trống trải khi ở một mình của bạn xuất phát từ khoảng thời gian đầu đời khi bạn học cách tự lo cho bản thân trước khi được phép dựa vào ai. Cung Mọc ${ascSign?.name || ''} khiến bạn khoác lên vẻ ngoài điềm tĩnh, nhưng bên trong luôn có một tiếng nói sợ bị bỏ lại. Khi bạn cho phép mình được yếu đuối và nhờ giúp đỡ, nút thắt này sẽ dần được gỡ.`,
    },
    {
      key: 'career',
      title: 'Con Đường Sự Nghiệp',
      body: `Năng lượng của bạn phát triển tự nhiên nhất ở môi trường cho phép sáng tạo, được tự quyết định và nhìn thấy kết quả rõ ràng. Bạn bào mòn chính mình trong môi trường quá cứng nhắc, nhiều quy tắc mà không có ý nghĩa, hoặc nơi công sức của bạn không được ghi nhận. Trong 3 năm tới, lĩnh vực kết hợp chuyên môn với giao tiếp và sáng tạo sẽ là hướng đi mang lại cho bạn cả thu nhập lẫn sự thỏa mãn.`,
    },
  ];

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="nebula-bg">
          <div className="nebula-1" />
          <div className="nebula-2" />
          <div className="nebula-3" />
        </div>
      </div>

      {/* Header */}
      <section className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 starfield-bg">
        <div className="absolute inset-0 bg-mystic-radial" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4 text-mystic-purple-300">
            <Link to={{ pathname: '/', state: { scrollTo: 'discovery' } }} className="text-sm hover:text-white transition-colors">
              Khám Phá
            </Link>
            <span className="text-mystic-purple-600">/</span>
            <span className="text-sm text-mystic-gold-400">Moon Window</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="mystic-heading text-3xl md:text-5xl font-bold text-glow-gold">
                Moon Window
              </h1>
              <p className="mystic-subheading text-base md:text-lg italic text-mystic-purple-300 mt-2">
                Bản đồ sao mở ra một góc nhìn khác về bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          {!chart && <ExploreDisclaimer />}
          {!chart ? (
            <div className="mystic-card rounded-2xl p-6 md:p-10 relative">
              {/* Subtle aurora in card */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-mystic-purple-900/20 via-transparent to-mystic-gold-500/5 pointer-events-none" />
              <div className="relative">
                <div className="text-center mb-8">
                  <h2 className="mystic-heading text-xl font-bold text-mystic-gold-400 mb-2">
                    Tạo Bản Đồ Sao Của Bạn
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">
                      Ngày Sinh
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 focus:outline-none focus:border-mystic-purple-500/50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-mystic-purple-300/60 uppercase tracking-wider">
                        Giờ Sinh
                      </label>
                      <button
                        type="button"
                        onClick={() => setRememberTime(!rememberTime)}
                        className="flex items-center gap-2 cursor-pointer select-none group"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            rememberTime ? 'border-mystic-purple-500/50' : 'bg-mystic-gold-500 border-mystic-gold-400'
                          }`}
                        >
                          {!rememberTime && <i className="ri-check-line text-[10px] font-bold" style={{ color: '#0a0618' }} />}
                        </span>
                        <span className={`text-sm ${rememberTime ? 'text-mystic-purple-200' : 'text-mystic-gold-300'}`}>
                          Tôi không nhớ giờ sinh
                        </span>
                      </button>
                    </div>

                    {rememberTime ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-mystic-purple-700/30 bg-mystic-purple-900/20">
                            <span className="text-sm text-mystic-purple-200">{displayTime}</span>
                            <span className="text-xs text-mystic-gold-400/90">
                              {periodInfo.period} · {periodInfo.sub}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] text-mystic-purple-300/60 uppercase tracking-wider mb-2">Giờ (00 - 23)</label>
                            <div className="flex items-center bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl focus-within:border-mystic-purple-500/50 transition-colors">
                              <select
                                value={birthHour}
                                onChange={(e) => handleTimeChange(e.target.value, birthMinute)}
                                aria-label="Chọn giờ sinh"
                                className="flex-1 bg-transparent pl-4 pr-2 py-3 text-sm text-mystic-purple-200 focus:outline-none cursor-pointer"
                              >
                                {hourOptions.map((h) => (
                                  <option key={h} value={h} className="bg-mystic-purple-900 text-mystic-purple-200">{h}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] text-mystic-purple-300/60 uppercase tracking-wider mb-2">Phút (00 - 59)</label>
                            <div className="flex items-center bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl focus-within:border-mystic-purple-500/50 transition-colors">
                              <select
                                value={birthMinute}
                                onChange={(e) => handleTimeChange(birthHour, e.target.value)}
                                aria-label="Chọn phút sinh"
                                className="flex-1 bg-transparent pl-4 pr-2 py-3 text-sm text-mystic-purple-200 focus:outline-none cursor-pointer"
                              >
                                {minuteOptions.map((m) => (
                                  <option key={m} value={m} className="bg-mystic-purple-900 text-mystic-purple-200">{m}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-mystic-purple-300/50 mt-1">
                          Chọn chính xác giờ và phút sinh theo thang 24 giờ (từ 00:00 đến 23:59).
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3">
                        <p className="text-sm text-mystic-purple-200">Giờ sinh chưa được cung cấp — hệ thống sẽ dùng giờ giữa trưa làm mặc định.</p>
                      </div>
                    )}

                    <p className="text-xs text-mystic-purple-300/50 italic mt-3">
                      Lưu ý: Không có giờ sinh chính xác có thể làm giảm độ chính xác của Cung Mọc và các Nhà.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">
                      Nơi Sinh
                    </label>
                    <div className="relative" ref={placeRef}>
                      <div className="flex items-center bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl transition-colors focus-within:border-mystic-purple-500/50">
                        <input
                          type="text"
                          value={placeQuery}
                          disabled={customMode}
                          onChange={(e) => {
                            setPlaceQuery(e.target.value);
                            setPlaceOpen(true);
                          }}
                          onFocus={() => setPlaceOpen(true)}
                          placeholder="Tìm tỉnh / thành phố…"
                          className="flex-1 bg-transparent pl-4 pr-2 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setPlaceOpen(!placeOpen)}
                          className="px-3 text-mystic-purple-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <i className={`ri-arrow-down-s-line transition-transform ${placeOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      {placeOpen && !customMode && (
                        <div className="absolute z-20 mt-2 w-full bg-[#140f23] border border-mystic-purple-700/40 rounded-xl overflow-hidden shadow-xl max-h-56 overflow-y-auto">
                          {filteredCities.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-mystic-purple-300/60">Không tìm thấy tỉnh/thành phố nào.</div>
                          ) : (
                            filteredCities.map((c) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => {
                                  const idx = cityList.findIndex((x) => x.name === c.name);
                                  setCityIndex(idx);
                                  setPlaceQuery(c.name);
                                  setPlaceOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-mystic-purple-200 hover:bg-mystic-purple-900/40 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                              >
                                <span className="truncate">{c.name}</span>
                                {c.name === selectedCityName && (
                                  <i className="ri-check-line text-mystic-gold-400 text-xs shrink-0" />
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomMode(!customMode)}
                    className="text-xs text-mystic-gold-400 hover:text-mystic-gold-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <i className={customMode ? 'ri-checkbox-circle-line' : 'ri-checkbox-blank-circle-line'} />
                    {customMode ? 'Đang nhập tọa độ thủ công' : 'Nhập tọa độ thủ công (để chính xác hơn)'}
                  </button>

                  {customMode && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Vĩ độ (Lat)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={customLat}
                          onChange={(e) => setCustomLat(e.target.value)}
                          placeholder="21.0278"
                          className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-3 py-3 text-sm text-mystic-purple-200 focus:outline-none focus:border-mystic-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Kinh độ (Lon)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={customLon}
                          onChange={(e) => setCustomLon(e.target.value)}
                          placeholder="105.8342"
                          className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-3 py-3 text-sm text-mystic-purple-200 focus:outline-none focus:border-mystic-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">Múi giờ</label>
                        <input
                          type="number"
                          step="0.5"
                          value={customTz}
                          onChange={(e) => setCustomTz(e.target.value)}
                          placeholder="7"
                          className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-3 py-3 text-sm text-mystic-purple-200 focus:outline-none focus:border-mystic-purple-500/50"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="mt-8">
                  <button onClick={handleSubmit} className="mystic-btn-gold text-sm w-full justify-center">
                    Tạo Bản Đồ Sao Của Tôi
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activePlace && (
                <div className="mystic-card rounded-xl p-4 md:p-5 flex gap-3 items-start border-mystic-gold-700/30 relative overflow-hidden">
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium mb-1">Bản đồ sao của bạn được tính theo đúng nơi sinh đã chọn</p>
                    <p className="text-xs text-mystic-purple-200/80 leading-relaxed">
                      <span className="text-mystic-gold-400 font-medium">Nơi sinh:</span> {activePlace.label}{' '}
                      <span className="text-mystic-purple-300/50">· Vĩ độ {activePlace.lat.toFixed(2)}, Kinh độ {activePlace.lon.toFixed(2)}, Múi giờ +{activePlace.tz}</span>
                    </p>
                  </div>
                </div>
              )}
              {timeApprox && (
                <div className="mystic-card rounded-xl p-4 md:p-5 flex gap-3 items-start border-mystic-gold-500/30 relative overflow-hidden">
                  <div>
                    <p className="text-sm text-white font-medium mb-1">Bản đồ sao tính ở giờ giữa trưa</p>
                    <p className="text-xs text-mystic-purple-200/80 leading-relaxed">
                      Vì bạn không nhớ giờ sinh chính xác, Cung Mọc (Rising Sign) chỉ mang tính tương đối.
                      Các tầng năng lượng Mặt Trời, Mặt Trăng và hành tinh vẫn được giữ ổn định để bạn khám phá tiếp.
                    </p>
                  </div>
                </div>
              )}

              {/* ===== FREE — Bức tranh về bạn ===== */}
              {portrait && (
                <div className="mystic-card analysis-panel rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple-900/15 via-transparent to-mystic-gold-500/5 pointer-events-none" />
                  <div className="p-6 md:p-10 relative">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/40 text-[10px] uppercase tracking-wider text-mystic-purple-200 mb-4">
                      Bức Tranh Về Bạn · Miễn phí
                    </span>
                    <h2 className="mystic-heading text-2xl md:text-3xl font-bold text-glow-gold mb-1">
                      Bức Tranh Về Bạn
                    </h2>
                    <p className="mystic-text text-sm opacity-70 mb-8">
                      Một góc nhìn tổng thể về chính mình — trước khi đi sâu vào các lớp chiêm tinh phía sau.
                    </p>

                    {/* Chân dung */}
                    <div className="mb-7">
                      <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                        Chân Dung Tổng Quan
                      </h4>
                      <p className="mystic-text text-sm leading-relaxed opacity-85">{portrait.overview}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
                      <div className="analysis-tile rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-mystic-gold-300 mb-2 flex items-center gap-2">
                          Thế Giới Cảm Xúc
                        </h4>
                        <p className="mystic-text text-sm leading-relaxed opacity-85">{portrait.emotion}</p>
                      </div>
                      <div className="analysis-tile rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-mystic-gold-300 mb-2 flex items-center gap-2">
                          Cách Bạn Thể Hiện Bản Thân
                        </h4>
                        <p className="mystic-text text-sm leading-relaxed opacity-85">{portrait.expression}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-7">
                      {lifeBlocks.map((b) => (
                        <div key={b.key} className="analysis-tile rounded-xl p-5">
                          <h4 className="text-sm font-semibold text-mystic-gold-300 mb-2">
                            {b.title}
                          </h4>
                          <p className="mystic-text text-sm leading-relaxed opacity-85">{b.body}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
                      <div>
                        <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                          Điểm Mạnh
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {portrait.strengths.map((s) => (
                            <span key={s} className="px-3 py-1.5 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 text-xs text-mystic-purple-200">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                          Điều Cần Cân Bằng / Phát Triển
                        </h4>
                        <ul className="space-y-2.5">
                          {portrait.balance.map((b) => (
                            <li key={b} className="text-sm text-mystic-purple-200/90 leading-relaxed">
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== FREE — bản đồ sao & bộ ba cốt lõi (nguồn gốc) ===== */}
              <div className="mystic-card analysis-panel rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple-900/10 via-transparent to-mystic-gold-500/5 pointer-events-none" />
                <div className="p-6 md:p-10 relative">
                  <div className="text-center mb-6">
                    <h2 className="mystic-heading text-xl md:text-2xl font-bold text-mystic-gold-400 mb-1">
                      BA MẢNH GHÉP TẠO NÊN BẠN
                    </h2>
                    <p className="mystic-text text-sm opacity-60 max-w-xl mx-auto">
                      Tính cách của bạn được ghép lại từ 3 điểm tựa chính lúc bạn sinh ra: Con người thật bên trong (Mặt Trời), cảm xúc thật khi ở một mình (Mặt Trăng), và cách người khác nhìn nhận bạn lần đầu gặp gỡ (Cung Mọc).
                    </p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <ChartWheel bodies={chart.bodies} ascendant={chart.ascendant} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {sunBody && (
                      <div className="analysis-tile rounded-xl p-5 text-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-mystic-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <p className="text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-1">Mặt Trời · {sunBody.sign}</p>
                          <p className="mystic-text text-xs opacity-75 leading-relaxed mt-2">
                            {sunSignDescriptions[sunBody.sign]?.split('.')[0]}.
                          </p>
                        </div>
                      </div>
                    )}
                    {moonBody && (
                      <div className="analysis-tile rounded-xl p-5 text-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <p className="text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-1">Mặt Trăng · {moonBody.sign}</p>
                          <p className="mystic-text text-xs opacity-75 leading-relaxed mt-2">
                            {moonSignDescriptions[moonBody.sign]?.split('.')[0]}.
                          </p>
                        </div>
                      </div>
                    )}
                    {ascSign && (
                      <div className="analysis-tile rounded-xl p-5 text-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-mystic-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <p className="text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-1">
                            Cung Mọc {timeApprox ? '(tương đối)' : ''} · {ascSign.name}
                          </p>
                          {timeApprox ? (
                            <p className="mystic-text text-xs opacity-60 italic mt-2 leading-relaxed">
                              Cần giờ sinh chính xác để xác định rõ lớp năng lượng này.
                            </p>
                          ) : (
                            <p className="mystic-text text-xs opacity-75 leading-relaxed mt-2">
                              {risingSignDescriptions[ascSign.name]?.split('.')[0]}.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA xuống phần khám phá sâu */}
                  <div className="text-center mt-8">
                    <button
                      onClick={() => deepRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      className="mystic-btn-outline text-sm justify-center cursor-pointer"
                    >
                      <i className="ri-arrow-down-line" />
                      Xem Thêm Những Điều Chưa Kể Về Bạn
                    </button>
                    <p className="text-[11px] text-mystic-purple-300/40 mt-3">
                      Bạn có từng thắc mắc tại sao đôi lúc mình mâu thuẫn đến mức khó hiểu không? Ba điểm trên chưa giải thích hết được đâu, phía sau còn nhiều điều bất ngờ về bạn lắm.
                    </p>
                  </div>
                </div>
              </div>

              {/* ===== Khám phá sâu — teaser + thanh toán ===== */}
              <div ref={deepRef} className="mystic-card analysis-panel rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-mystic-gold-500/5 via-transparent to-mystic-purple-900/10 pointer-events-none" />
                <div className="p-6 md:p-10 relative">
                  <div className="text-center mb-8">
                    <h3 className="mystic-heading text-xl md:text-2xl font-bold text-glow-gold mb-3">
                      NHỮNG GÓC KHUẤT CHƯA KỂ TRONG BẢN ĐỒ SAO
                    </h3>
                    <p className="mystic-text text-sm opacity-80 max-w-2xl mx-auto leading-relaxed">
                      Những gì bạn vừa xem mới chỉ là 30% bề nổi. Bản thiết kế của bạn vẫn còn những hành tinh chi phối cách bạn yêu, những nút thắt cảm xúc khó giãi bày, và định hướng phát triển thực sự phù hợp với bạn. Tất cả đã được giải mã chi tiết ở phần bên dưới.
                    </p>
                  </div>

                  {unlocked ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {deepFullCards.map((card) => (
                          <div key={card.key} className="analysis-tile rounded-xl p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-mystic-gold-500/5 to-transparent pointer-events-none" />
                            <div className="relative">
                              <h4 className="mystic-heading text-sm font-semibold text-mystic-gold-300 mb-3">{card.title}</h4>
                              <p className="mystic-text text-xs leading-relaxed opacity-90 mb-3">{card.body}</p>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mystic-gold-500/10 border border-mystic-gold-500/30 text-[10px] uppercase tracking-wider text-mystic-gold-300">
                                <i className="ri-lock-unlock-line text-xs" /> Đã mở khóa
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-mystic-gold-500/10 border border-mystic-gold-500/30 rounded-xl px-5 py-4 text-center">
                        <i className="ri-lock-unlock-line text-mystic-gold-400 text-lg" />
                        <p className="mystic-text text-xs text-mystic-gold-300 mt-1">Bạn đã mở khóa toàn bộ hồ sơ Bản Đồ Sao. Bấm "Lưu Vào Hồ Sơ" bên dưới để lưu kết quả này.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                          {
                            key: 'love',
                            title: 'Chuyện Tình Cảm',
                            lines: [
                              'Vì sao bạn luôn bị thu hút bởi cùng một kiểu người?',
                              'Điểm mù khiến bạn dễ tổn thương trong mối quan hệ là gì?',
                            ],
                          },
                          {
                            key: 'psyche',
                            title: 'Nút Thắt Tâm Lý',
                            lines: [
                              'Cảm giác trống trải khi ở một mình thực chất đến từ đâu?',
                              'Nút thắt tiềm thức nào đang âm thầm cản trở bạn bước tiếp?',
                            ],
                          },
                          {
                            key: 'career',
                            title: 'Con Đường Sự Nghiệp',
                            lines: [
                              'Lĩnh vực nào giúp bạn kiếm tiền và phát triển tự nhiên nhất?',
                              'Môi trường làm việc nào đang bào mòn năng lượng của bạn?',
                            ],
                          },
                        ].map((card) => (
                          <div key={card.key} className="analysis-tile rounded-xl p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple-900/10 to-transparent pointer-events-none" />
                            <div className="relative">
                              <h4 className="mystic-heading text-sm font-semibold text-white mb-3">{card.title}</h4>
                              <p className="mystic-text text-xs leading-relaxed opacity-85 mb-2">{card.lines[0]}</p>
                              <p className="mystic-text text-xs leading-relaxed opacity-60 blur-[3px] select-none mb-3">{card.lines[1]}</p>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/40 text-[10px] uppercase tracking-wider text-mystic-purple-200">
                                <i className="ri-lock-2-line text-mystic-gold-400 text-xs" /> Chờ mở khóa
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => { setPayOpen(true); setPayStep(1); }}
                          className="mystic-btn-gold text-sm justify-center cursor-pointer"
                        >
                          <i className="ri-lock-unlock-line" />
                          Mở Khóa Toàn Bộ Hồ Sơ
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {savedMsg && (
                <div className="bg-mystic-gold-500/10 border border-mystic-gold-500/30 rounded-lg px-4 py-3 text-sm text-mystic-gold-300">
                  {savedMsg}
                </div>
              )}

              <div className="mystic-divider" />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={reset} className="mystic-btn-outline text-xs py-2 px-4 justify-center">
                  Tạo Bản Đồ Mới
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mystic-btn-primary text-xs py-2 px-4 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <i className="ri-loader-4-line animate-spin" /> Đang Lưu...
                    </>
                  ) : (
                    <>
                      {user ? 'Lưu Vào Hồ Sơ' : 'Đăng Nhập Để Lưu'}
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-center pt-2">
                <ExploreNext
                  nextPath="/explore/numerology"
                  nextLabel="Numerology"
                  buttonLabel="Mảnh Ghép Tiếp Theo: Những Con Số"
                  saved={saved}
                  saving={saving}
                  onSave={handleSave}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {payOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 modal-backdrop">
          <div className="relative mystic-card rounded-2xl w-full max-w-lg p-6 md:p-8 text-center modal-pop border-mystic-gold-500/30 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setPayOpen(false); setPayStep(1); }}
              className="absolute top-4 right-4 text-mystic-purple-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <i className="ri-close-line text-xl" />
            </button>

            {payStep === 1 ? (
              <>
                <h3 className="mystic-heading text-lg md:text-xl font-bold text-glow-gold mb-5 px-4">
                  BẢN PHÂN TÍCH TOÀN DIỆN BẢN ĐỒ SAO CỦA BẠN
                </h3>

                <div className="space-y-3 text-left mb-6">
                  {[
                    'Lời giải cho toàn bộ các câu hỏi về tình yêu, công việc và nút thắt tâm lý.',
                    'Phân tích chi tiết 10 hành tinh và hệ thống 12 nhà (Houses).',
                    'Lưu trữ vĩnh viễn trong hồ sơ cá nhân của bạn trên The Mystic Room.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <i className="ri-check-line text-mystic-gold-400 mt-0.5 shrink-0" />
                      <p className="mystic-text text-sm leading-relaxed opacity-85">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <span className="text-sm text-mystic-purple-300/60 line-through">279.000đ</span>
                    <span className="text-[11px] text-mystic-gold-400 uppercase tracking-wider">Phí mở khóa lần đầu</span>
                  </div>
                  <p className="mystic-heading text-3xl font-bold text-glow-gold">149.000đ</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => { setPayPlan('single'); setPayStep(2); }}
                    className="mystic-btn-gold text-sm justify-center w-full cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-lock-unlock-line" />
                    Mở Khóa Ngay · 149.000đ
                  </button>
                  <button
                    onClick={() => { setPayPlan('combo'); setPayStep(2); }}
                    className="mystic-btn-outline text-sm justify-center w-full cursor-pointer whitespace-nowrap"
                  >
                    Gói Khai Mở Trọn Vẹn · 199.000đ
                  </button>
                  <p className="text-[11px] text-mystic-gold-400/90">
                    Gói Combo gồm cả báo cáo Bản Đồ Sao + Thần Số Học · Tiết kiệm ngay 49k
                  </p>
                </div>

                <p className="text-[11px] text-mystic-purple-300/50 mt-4">
                  Thanh toán quét mã VietQR / MoMo nhanh trong 30 giây · Xem kết quả ngay lập tức.
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-mystic-gold-500/10 border border-mystic-gold-500/30 flex items-center justify-center mx-auto mb-4 glow-gold">
                  <i className="ri-qr-code-line text-mystic-gold-400 text-2xl" />
                </div>

                <h3 className="mystic-heading text-lg font-bold text-glow-gold mb-2">Quét Mã Để Thanh Toán</h3>
                <p className="mystic-text text-sm opacity-70 mb-5">
                  Dùng VietQR hoặc MoMo để quét mã dưới đây.
                </p>

                <div className="w-48 h-48 mx-auto mb-5 rounded-2xl border border-mystic-gold-500/30 bg-white/95 flex items-center justify-center">
                  <i className="ri-qr-code-line text-7xl text-mystic-purple-900" />
                </div>

                <p className="mystic-heading text-2xl font-bold text-glow-gold mb-4">
                  {payPlan === 'combo' ? '199.000đ' : '149.000đ'}
                </p>

                <button
                  onClick={handlePaid}
                  className="mystic-btn-primary text-sm justify-center w-full cursor-pointer whitespace-nowrap mb-4"
                >
                  <i className="ri-check-double-line" />
                  Tôi Đã Thanh Toán · Xem Nội Dung Đầy Đủ
                </button>

                <p className="text-[11px] text-mystic-purple-300/50">
                  Đây là bản trình diễn — chức năng thanh toán thật sẽ sớm được bổ sung.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}