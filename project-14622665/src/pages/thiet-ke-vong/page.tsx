import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  braceletSizes,
  braceletMainStones,
  braceletCharms,
} from '@/mocks/mysticData';
import { useMysticProfile } from '@/hooks/useMysticProfile';
import { getBraceletSuggestion } from '@/lib/braceletSuggestion';
import { useAuth } from '@/context/AuthContext';
import { trackEvent } from '@/lib/tracking';
import BraceletPreview from './components/BraceletPreview';
import PageHero from '@/components/feature/PageHero';

const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

type AccId = 'size' | 'stone' | 'charm';

export default function ThietKeVong() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState('m');
  const [selectedStone, setSelectedStone] = useState('amethyst');
  const [selectedCharms, setSelectedCharms] = useState<string[]>(['moon']);
  const [openAcc, setOpenAcc] = useState<AccId | null>(null);
  const craftStartedRef = useRef(false);

  // Đánh dấu đã bắt đầu chế tác (chỉ ghi nhận 1 lần mỗi phiên trang).
  const markCraftStart = () => {
    if (craftStartedRef.current || !user) return;
    craftStartedRef.current = true;
    void trackEvent('bracelet_craft_start', {}, user.id);
  };

  useEffect(() => {
    if (!user) return;
    void trackEvent('bracelet_view', {}, user.id);
    void trackEvent('bracelet_craft_click', {}, user.id);
  }, [user?.id]);

  const { profile } = useMysticProfile();
  const suggestion = getBraceletSuggestion(profile?.element, profile?.sunSign);

  const toggleCharm = (id: string) => {
    markCraftStart();
    setSelectedCharms((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const clearCharms = () => {
    markCraftStart();
    setSelectedCharms([]);
  };

  const toggleAcc = (id: AccId) => {
    markCraftStart();
    setOpenAcc((prev) => (prev === id ? null : id));
  };

  const mainStone = braceletMainStones.find((s) => s.id === selectedStone);
  const sizeData = braceletSizes.find((s) => s.id === selectedSize);

  const charmItems = selectedCharms
    .map((id) => braceletCharms.find((c) => c.id === id))
    .filter((c): c is (typeof braceletCharms)[number] => Boolean(c));

  const charmLabel =
    charmItems.length > 0 ? charmItems.map((c) => c.name).join(', ') : 'Không chọn';

  const total =
    (mainStone ? mainStone.price * 10000 : 0) +
    charmItems.reduce((sum, c) => sum + c.price * 10000, 0);

  const handlePlaceOrder = () => {
    if (user) {
      void trackEvent('bracelet_craft_complete', { total }, user.id);
      void trackEvent('cart_add', { total }, user.id);
    }
    const draft = {
      sizeLabel: sizeData?.cm || '',
      stoneName: mainStone?.name || '',
      stoneColor: mainStone?.color || '',
      stonePrice: mainStone ? mainStone.price * 10000 : 0,
      charms: charmItems.map((c) => ({
        id: c.id,
        name: c.name,
        price: c.price * 10000,
        image: c.image,
      })),
      total,
    };
    sessionStorage.setItem('mystic_bracelet_order', JSON.stringify(draft));
    navigate('/thanh-toan');
  };

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      {/* Header */}
      <PageHero
        image="https://readdy.ai/api/search-image?query=Luxurious%20mystical%20still%20life%20of%20glowing%20amethyst%20crystals%2C%20delicate%20golden%20jewelry%20and%20sparkling%20charms%20on%20deep%20purple%20velvet%20cloth%20with%20lit%20candles%20and%20soft%20violet%20bokeh%20lights%2C%20ornate%20fantasy%20product%20illustration%2C%20deep%20violet%20and%20gold%20palette%2C%20no%20text%2C%20calm%20center%20for%20text%20overlay&width=1600&height=600&seq=product-hero-crystal&orientation=landscape"
        imageAlt="Tinh thể và trang sức huyền bí của The Mystic Room"
        icons={['ri-vip-diamond-line', 'ri-sparkling-line', 'ri-moon-clear-line', 'ri-goblet-line', 'ri-magic-line', 'ri-star-line']}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mystic-heading text-4xl md:text-6xl font-bold mb-4 text-glow-gold">
            Nơi Câu Chuyện Của Bạn Hóa Thành Hình
          </h1>
          <p className="mystic-subheading text-base md:text-lg italic mb-4">
            Đi qua từng hành trình giải mã bản thân, bạn đã nhìn thấy rõ con người thật của mình. Nhưng cuộc sống ngoài kia rất dễ làm ta quên mất mình là ai.
          </p>
          <p className="mystic-text text-sm max-w-2xl mx-auto opacity-80">
            Một chiếc vòng được chế tác riêng từ những mảnh ghép thuộc về bạn — không phải món trang sức thông thường, mà là một điểm tựa nhỏ trên cổ tay. Để mỗi lần chạm vào, bạn nhớ rằng mình đã đi qua những gì, cần dịu dàng với bản thân hơn, và không bao giờ lạc lối nữa.
          </p>
          <div className="mystic-divider mt-8 max-w-md mx-auto" />
        </div>
      </PageHero>

      {/* Profile Recommendation Banner */}
      {profile && (
        <section className="relative pt-8 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="mystic-card rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 flex items-center justify-center shrink-0 glow-purple">
                <i className="ri-sparkling-line text-mystic-gold-400" />
              </div>
              <div className="flex-1">
                <p className="mystic-heading text-xs text-mystic-gold-400 tracking-[0.15em] uppercase mb-1">
                  Gợi ý từ Mystic Profile của bạn
                </p>
                <p className="mystic-text text-sm opacity-70">
                  Đá gợi ý: <span className="text-mystic-gold-400">{suggestion.stoneName}</span> · Charm gợi ý: <span className="text-mystic-gold-400">{suggestion.charmName}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-8 gap-8">
            {/* Left: Customization Options (mobile: after preview) */}
            <div className="lg:col-span-3 lg:row-start-1 lg:col-start-1 order-3">
              <div className="mystic-card rounded-2xl p-6 md:p-8">
                <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-6">
                  Tùy Chỉnh Vòng Tay
                </h2>

                {/* Kích Cỡ */}
                <div className="mb-8">
                  <button
                    onClick={() => toggleAcc('size')}
                    className="lg:hidden w-full flex items-center justify-between py-2 cursor-pointer"
                  >
                    <span className="mystic-heading text-base font-bold text-white">Kích Cỡ</span>
                    <i className={`ri-arrow-down-s-line text-mystic-gold-400 text-lg transition-transform ${openAcc === 'size' ? 'rotate-180' : ''}`} />
                  </button>
                  <h3 className="hidden lg:block mystic-heading text-base font-bold text-white mb-4">
                    Kích Cỡ
                  </h3>
                  <div className={`${openAcc === 'size' ? 'block' : 'hidden'} lg:block pt-2 lg:pt-0`}>
                    <div className="flex flex-wrap gap-2">
                      {braceletSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size.id)}
                          className={`flex items-center justify-between gap-4 min-w-[130px] mystic-card rounded-lg px-4 py-3 text-xs font-medium transition-all cursor-pointer ${
                            selectedSize === size.id
                              ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                              : 'hover:border-mystic-purple-500/40 text-white'
                          }`}
                        >
                          <span>{size.cm}</span>
                          {selectedSize === size.id && <i className="ri-check-line text-mystic-gold-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Loại Đá */}
                <div className="mb-8">
                  <button
                    onClick={() => toggleAcc('stone')}
                    className="lg:hidden w-full flex items-center justify-between py-2 cursor-pointer"
                  >
                    <span className="mystic-heading text-base font-bold text-white">
                      Loại Đá <span className="text-mystic-gold-400 text-sm font-normal">({mainStone?.name})</span>
                    </span>
                    <i className={`ri-arrow-down-s-line text-mystic-gold-400 text-lg transition-transform ${openAcc === 'stone' ? 'rotate-180' : ''}`} />
                  </button>
                  <h3 className="hidden lg:block mystic-heading text-base font-bold text-white mb-4">
                    Loại Đá <span className="text-mystic-gold-400 text-sm font-normal">({mainStone?.name})</span>
                  </h3>
                  <div className={`${openAcc === 'stone' ? 'block' : 'hidden'} lg:block pt-2 lg:pt-0`}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {braceletMainStones.map((stone) => {
                        const active = selectedStone === stone.id;
                        return (
                          <button
                            key={stone.id}
                            onClick={() => setSelectedStone(stone.id)}
                            className={`relative flex flex-col gap-3 mystic-card rounded-xl p-4 text-left transition-all cursor-pointer ${active ? 'border-mystic-gold-500/60 bg-mystic-gold-900/10' : 'hover:border-mystic-purple-500/40'}`}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div
                                className="w-16 h-16 shrink-0 rounded-full overflow-hidden flex items-center justify-center"
                                style={{ filter: `drop-shadow(0 0 12px ${stone.color}66)` }}
                              >
                                <img
                                  src={stone.image}
                                  alt={stone.name}
                                  title={stone.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover scale-[1.3]"
                                />
                              </div>
                              {active && <i className="ri-check-line text-mystic-gold-400 text-xl" />}
                            </div>
                            <div className="min-w-0">
                              <p className={`font-semibold text-base truncate ${active ? 'text-mystic-gold-400' : 'text-white'}`}>{stone.name}</p>
                              <p className="text-sm text-mystic-purple-200/70 mt-1">{formatVND(stone.price * 10000)}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Charm */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleAcc('charm')}
                    className="lg:hidden w-full flex items-center justify-between py-2 cursor-pointer"
                  >
                    <span className="mystic-heading text-base font-bold text-white">
                      Charm <span className="text-mystic-gold-400 text-sm font-normal">({charmLabel})</span>
                    </span>
                    <i className={`ri-arrow-down-s-line text-mystic-gold-400 text-lg transition-transform ${openAcc === 'charm' ? 'rotate-180' : ''}`} />
                  </button>
                  <h3 className="hidden lg:block mystic-heading text-base font-bold text-white mb-4">
                    Charm <span className="text-mystic-gold-400 text-sm font-normal">(chọn nhiều mẫu — có thể để trống)</span>
                  </h3>
                  <div className={`${openAcc === 'charm' ? 'block' : 'hidden'} lg:block pt-2 lg:pt-0`}>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        onClick={clearCharms}
                        className={`relative flex flex-col items-center gap-2 mystic-card rounded-lg px-3 py-3 text-center transition-all cursor-pointer ${selectedCharms.length === 0 ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10' : 'hover:border-mystic-purple-500/40'}`}
                      >
                        {selectedCharms.length === 0 && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-mystic-gold-500 flex items-center justify-center">
                            <i className="ri-check-line text-[#130e26] text-xs" />
                          </span>
                        )}
                        <span className="w-12 h-12 rounded-full border border-dashed border-mystic-purple-500/50 flex items-center justify-center shrink-0 text-mystic-purple-300">
                          <i className="ri-close-line text-lg" />
                        </span>
                        <div className="min-w-0">
                          <p className={`font-medium text-sm truncate ${selectedCharms.length === 0 ? 'text-mystic-gold-400' : 'text-white'}`}>Không Charm</p>
                          <p className="text-[10px] text-mystic-purple-200/70 mt-0.5">Bỏ chọn tất cả</p>
                        </div>
                      </button>
                      {braceletCharms.map((charm) => {
                        const active = selectedCharms.includes(charm.id);
                        return (
                          <button
                            key={charm.id}
                            onClick={() => toggleCharm(charm.id)}
                            className={`relative flex flex-col items-center gap-2 mystic-card rounded-lg px-3 py-3 text-center transition-all cursor-pointer ${active ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10' : 'hover:border-mystic-purple-500/40'}`}
                          >
                            {active && (
                              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-mystic-gold-500 flex items-center justify-center">
                                <i className="ri-check-line text-[#130e26] text-xs" />
                              </span>
                            )}
                            <span className="w-12 h-12 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-mystic-purple-700/40 flex items-center justify-center shrink-0 overflow-hidden">
                              <img
                                src={charm.image}
                                alt={charm.name}
                                title={`Charm ${charm.name}`}
                                loading="lazy"
                                decoding="async"
                                className="w-10 h-10 object-contain"
                                style={{ transform: `scale(${charm.scale ?? 1})` }}
                              />
                            </span>
                            <div className="min-w-0">
                              <p className={`font-medium text-sm truncate ${active ? 'text-mystic-gold-400' : 'text-white'}`}>{charm.name}</p>
                              <p className="text-[10px] text-mystic-purple-200/70 mt-0.5">{formatVND(charm.price * 10000)}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview + Total (mobile: first) */}
            <div className="lg:col-span-2 lg:row-start-1 lg:col-start-4 order-1">
              <div className="mystic-card rounded-2xl overflow-hidden">
                <div className="relative h-[340px] sm:h-[460px] bg-gradient-to-br from-mystic-purple-950/60 to-mystic-deeper overflow-hidden rounded-xl">
                  <BraceletPreview
                    stoneColor={mainStone?.color || '#a279d4'}
                    stoneId={mainStone?.id || 'amethyst'}
                    stoneImage={mainStone?.image}
                    charms={charmItems.map((c) => ({ id: c.id, image: c.image, scale: c.scale }))}
                  />
                  <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                    <span className="text-[10px] text-mystic-purple-300/50 uppercase tracking-wider">Xem Trước Trực Tiếp</span>
                  </div>
                </div>
                <div className="p-6 border-t border-mystic-purple-700/25">
                  <div className="flex items-center justify-between mb-5">
                    <span className="mystic-heading text-base font-bold text-mystic-gold-400">Tổng Giá</span>
                    <span className="mystic-heading text-3xl font-bold text-mystic-gold-400 text-glow-gold">
                      {formatVND(total)}
                    </span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="mystic-btn-gold text-sm justify-center w-full py-4"
                  >
                    <i className="ri-shopping-bag-3-line" /> Đặt Hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}