import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auraProducts } from '@/mocks/mysticData';
import { useMysticProfile } from '@/hooks/useMysticProfile';

export default function CustomizeAura() {
  const [selectedType, setSelectedType] = useState('bracelet');
  const [selectedColor, setSelectedColor] = useState('Tím Oải Hương');
  const [selectedStone, setSelectedStone] = useState('Thạch Anh Tím');
  const [selectedCharm, setSelectedCharm] = useState('Mặt Trăng');
  const [addedToCart, setAddedToCart] = useState(false);
  const { profile } = useMysticProfile();

  const colors = ['Tím Oải Hương', 'Nửa Đêm', 'Vàng Hồng', 'Lục Bảo', 'Xanh Sapphire', 'Hổ Phách'];
  const stones = ['Thạch Anh Tím', 'Đá Mặt Trăng', 'Thạch Anh Hồng', 'Đá Vỏ Chai', 'Thạch Anh Vàng', 'Lapis Lazuli'];
  const charms = ['Mặt Trăng', 'Ngôi Sao', 'Mặt Trời', 'Con Mắt', 'Lông Vũ', 'Chìa Khóa'];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const product = auraProducts.find((p) => p.category === selectedType) || auraProducts[0];

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
            <span className="text-sm text-mystic-gold-400">Customize Your Aura</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 flex items-center justify-center glow-purple">
              <i className="ri-brush-line text-mystic-gold-400 text-lg" />
            </div>
            <div>
              <h1 className="mystic-heading text-2xl md:text-3xl font-bold text-glow-gold">
                Customize Your Aura
              </h1>
              <p className="mystic-subheading text-sm italic text-mystic-purple-300">
                Tạo nên sản phẩm phản chiếu năng lượng độc đáo của bạn
              </p>
            </div>
          </div>
          <p className="mystic-text text-sm max-w-2xl opacity-70">
            Dựa trên Mystic Profile của bạn, AI đề xuất màu sắc, biểu tượng và charm phù hợp với bản chất của bạn. 
            Tùy chỉnh sản phẩm aura cá nhân để nó thực sự thuộc về bạn.
          </p>
        </div>
      </section>

      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Product Preview */}
            <div>
              <div className="mystic-card rounded-2xl overflow-hidden mb-6">
                <div className="relative h-80 md:h-96 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-1">Xem Trước</p>
                    <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400">{product.name}</h3>
                  </div>
                </div>
              </div>

              {/* Mystic Profile Match */}
              <div className="mystic-card rounded-xl p-5">
                <h4 className="mystic-heading text-xs text-mystic-gold-400 tracking-[0.15em] uppercase mb-4">
                  Dựa Trên Mystic Profile Của Bạn
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-mystic-purple-300/60">Màu Sắc Gợi Ý</span>
                    <span className="text-sm text-mystic-gold-400">{profile?.color || 'Hoàn thành trải nghiệm để nhận gợi ý'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-mystic-purple-300/60">Đá Gợi Ý</span>
                    <span className="text-sm text-mystic-gold-400">{profile?.stone || 'Hoàn thành trải nghiệm để nhận gợi ý'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-mystic-purple-300/60">Charm Gợi Ý</span>
                    <span className="text-sm text-mystic-gold-400">{profile?.charm || 'Hoàn thành trải nghiệm để nhận gợi ý'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-mystic-purple-300/60">Nguyên Tố Của Bạn</span>
                    <span className="text-sm text-mystic-gold-400">{profile?.element || 'Hoàn thành trải nghiệm để nhận gợi ý'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Customization Options */}
            <div>
              <div className="mystic-card rounded-2xl p-6 md:p-8">
                <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-6">
                  Tùy Chỉnh Phong Cách
                </h2>

                {/* Product Type */}
                <div className="mb-6">
                  <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-3">
                    Loại Sản Phẩm
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['bracelet', 'necklace', 'ring', 'print'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`mystic-card rounded-lg py-2 px-3 text-sm transition-all cursor-pointer ${
                          selectedType === type
                            ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                            : 'text-mystic-purple-200'
                        }`}
                      >
                        {type === 'bracelet' ? 'Vòng Tay' : type === 'necklace' ? 'Dây Chuyền' : type === 'ring' ? 'Nhẫn' : 'Bản In'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="mb-6">
                  <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-3">
                    Màu Sắc <span className="text-mystic-gold-400">({selectedColor})</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                          selectedColor === color
                            ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                            : 'border-mystic-purple-700/30 bg-mystic-purple-900/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stone */}
                <div className="mb-6">
                  <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-3">
                    Đá <span className="text-mystic-gold-400">({selectedStone})</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {stones.map((stone) => (
                      <button
                        key={stone}
                        onClick={() => setSelectedStone(stone)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                          selectedStone === stone
                            ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                            : 'border-mystic-purple-700/30 bg-mystic-purple-900/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
                        }`}
                      >
                        {stone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Charm */}
                <div className="mb-8">
                  <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-3">
                    Charm <span className="text-mystic-gold-400">({selectedCharm})</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {charms.map((charm) => (
                      <button
                        key={charm}
                        onClick={() => setSelectedCharm(charm)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                          selectedCharm === charm
                            ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                            : 'border-mystic-purple-700/30 bg-mystic-purple-900/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
                        }`}
                      >
                        {charm}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mystic-divider mb-6" />

                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-mystic-purple-300">Tổng Giá</span>
                  <span className="mystic-heading text-2xl font-bold text-mystic-gold-400">${product.price}</span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="mystic-btn-gold text-sm justify-center w-full py-3"
                  >
                    <i className={addedToCart ? 'ri-check-line' : 'ri-shopping-bag-3-line'} />
                    {addedToCart ? 'Đã Thêm Vào Giỏ!' : 'Thêm Vào Giỏ Hàng'}
                  </button>
                  <button className="mystic-btn-outline text-sm justify-center w-full py-3">
                    <i className="ri-heart-3-line" /> Lưu Thiết Kế
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