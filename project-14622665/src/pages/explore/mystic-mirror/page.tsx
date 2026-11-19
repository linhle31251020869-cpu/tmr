import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mbtiQuestions } from '@/mocks/mysticData';
import { useAuth } from '@/context/AuthContext';
import { saveResult, saveProfile } from '@/lib/mysticStore';
import { trackEvent } from '@/lib/tracking';
import { mbtiInsights } from '@/lib/mbtiInsights';
import ExploreDisclaimer from '@/components/feature/ExploreDisclaimer';
import ExploreNext from '@/components/feature/ExploreNext';

const mbtiTypes: Record<string, { name: string; desc: string; traits: string[] }> = {
  ENFP: { name: 'Người Vận Động', desc: 'Tâm hồn tự do nhiệt huyết, sáng tạo và hòa đồng, luôn tìm được lý do để mỉm cười.', traits: ['Giàu Trí Tưởng Tượng', 'Tò Mò', 'Tràn Đầy Sức Sống', 'Tinh Thần Tự Do', 'Kết Nối Chân Thành'] },
  INFP: { name: 'Người Hòa Giải', desc: 'Người thơ mộng, tốt bụng và vị tha, luôn sẵn lòng giúp đỡ một mục đích tốt đẹp.', traits: ['Đồng Cảm', 'Sáng Tạo', 'Lý Tưởng', 'Suy Nghĩ Sâu Sắc', 'Sống Theo Giá Trị'] },
  ENFJ: { name: 'Người Truyền Cảm Hứng', desc: 'Nhà lãnh đạo cuốn hút và truyền cảm hứng, có thể khiến người nghe mê hoặc.', traits: ['Cuốn Hút', 'Đồng Cảm', 'Lãnh Đạo Bẩm Sinh', 'Vị Tha', 'Giao Tiếp Tốt'] },
  INFJ: { name: 'Người Cố Vấn', desc: 'Điềm tĩnh và huyền bí, nhưng vô cùng truyền cảm hứng và là người lý tưởng không biết mệt mỏi.', traits: ['Sâu Sắc', 'Quyết Đoán', 'Sáng Tạo', 'Có Nguyên Tắc', 'Đam Mê'] },
  ENTJ: { name: 'Người Chỉ Huy', desc: 'Nhà lãnh đạo táo bạo, giàu trí tưởng tượng và mạnh mẽ, luôn tìm ra con đường.', traits: ['Chiến Lược', 'Hiệu Quả', 'Cuốn Hút', 'Quyết Đoán', 'Tham Vọng'] },
  INTJ: { name: 'Người Kiến Trúc', desc: 'Người tư duy giàu trí tưởng tượng và chiến lược, có kế hoạch cho mọi thứ.', traits: ['Phân Tích', 'Chiến Lược', 'Độc Lập', 'Quyết Đoán', 'Tò Mò'] },
  ENTP: { name: 'Người Tranh Luận', desc: 'Người thông minh và tò mò, không thể cưỡng lại một thử thách trí tuệ.', traits: ['Đổi Mới', 'Tò Mò', 'Chiến Lược', 'Năng Động', 'Cuốn Hút'] },
  INTP: { name: 'Người Logic', desc: 'Nhà phát minh đổi mới với khát khao tri thức không bao giờ cạn.', traits: ['Phân Tích', 'Độc Đáo', 'Cởi Mở', 'Tò Mò', 'Khách Quan'] },
  ESFJ: { name: 'Người Quan Tâm', desc: 'Người vô cùng chu đáo, hòa đồng và được yêu mến, luôn sẵn lòng giúp đỡ.', traits: ['Ấm Áp', 'Chu Đáo', 'Hòa Đồng', 'Ngăn Nắp', 'Trung Thành'] },
  ISFJ: { name: 'Người Bảo Vệ', desc: 'Người bảo vệ tận tụy và ấm áp, luôn sẵn sàng bảo vệ người thân yêu.', traits: ['Hỗ Trợ', 'Đáng Tin Cậy', 'Kiên Nhẫn', 'Giàu Trí Tưởng Tượng', 'Tinh Tế'] },
  ESTJ: { name: 'Người Điều Hành', desc: 'Nhà quản lý xuất sắc, vượt trội trong việc quản lý công việc hay con người.', traits: ['Ngăn Nắp', 'Tận Tụy', 'Thẳng Thắn', 'Trung Thực', 'Trung Thành'] },
  ISTJ: { name: 'Người Hậu Cần', desc: 'Người thực tế và lý trí, sự đáng tin cậy không thể nghi ngờ.', traits: ['Trung Thực', 'Thẳng Thắn', 'Ý Chí Mạnh', 'Có Trách Nhiệm', 'Tận Tâm'] },
  ESFP: { name: 'Người Trình Diễn', desc: 'Người tự phát, tràn đầy năng lượng và nhiệt huyết, yêu cuộc sống và tận hưởng từng khoảnh khắc.', traits: ['Táo Bạo', 'Độc Đáo', 'Thực Tế', 'Tinh Tế', 'Kỹ Năng Giao Tiếp Tốt'] },
  ISFP: { name: 'Người Phiêu Lưu', desc: 'Nghệ sĩ linh hoạt và quyến rũ, luôn sẵn sàng khám phá và trải nghiệm điều mới.', traits: ['Quyến Rũ', 'Nhạy Cảm', 'Giàu Trí Tưởng Tượng', 'Đam Mê', 'Tò Mò'] },
  ESTP: { name: 'Người Khởi Nghiệp', desc: 'Người thông minh, năng động và rất nhạy bén, thực sự thích sống trên lằn ranh.', traits: ['Táo Bạo', 'Lý Trí', 'Thực Tế', 'Độc Đáo', 'Nhạy Bén'] },
  ISTP: { name: 'Người Thợ Thủ Công', desc: 'Người thử nghiệm táo bạo và thực tế, bậc thầy của mọi loại công cụ.', traits: ['Lạc Quan', 'Năng Động', 'Sáng Tạo', 'Thực Tế', 'Tự Phát'] },
};

export default function MysticMirror() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    if (currentQ === 0 && Object.keys(answers).length === 0) {
      void trackEvent('mirror_started', {}, user?.id);
    }
    const next = { ...answers, [currentQ]: value };
    setAnswers(next);
    if (currentQ < mbtiQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateType = () => {
    let e = 0, i = 0, s = 0, n = 0, t = 0, f = 0, j = 0, p = 0;
    Object.values(answers).forEach((v) => {
      if (v === 'E') e++;
      if (v === 'I') i++;
      if (v === 'S') s++;
      if (v === 'N') n++;
      if (v === 'T') t++;
      if (v === 'F') f++;
      if (v === 'J') j++;
      if (v === 'P') p++;
    });
    return `${e > i ? 'E' : 'I'}${n > s ? 'N' : 'S'}${f > t ? 'F' : 'T'}${p > j ? 'P' : 'J'}`;
  };

  const reset = () => {
    setAnswers({});
    setCurrentQ(0);
    setShowResult(false);
    setSavedMsg(null);
    setSaved(false);
  };

  const handleSave = async (): Promise<boolean> => {
    if (!user) {
      navigate('/auth', { state: { redirect: '/explore/mystic-mirror' } });
      return false;
    }
    setSaving(true);
    setSavedMsg(null);
    const finalType = calculateType();
    const info = mbtiTypes[finalType];
    await saveResult(user.id, 'mystic-mirror', {
      type: finalType,
      name: info.name,
      description: info.desc,
      traits: info.traits,
    });
    await saveProfile(user.id, {
      archetype: info.name,
      traits: info.traits,
      symbolic_identity: { element: 'Nước', symbol: 'Gương', color: 'Tím Huyền' },
      message: info.desc,
      recommendations: info.traits,
      mbti_type: finalType,
    });
    setSaving(false);
    setSaved(true);
    setSavedMsg('Đã lưu kết quả vào hồ sơ của bạn!');
    return true;
  };

  const progress = ((currentQ + 1) / mbtiQuestions.length) * 100;
  const type = showResult ? calculateType() : '';
  const result = type ? mbtiTypes[type] : null;
  const insight = type ? mbtiInsights[type] : null;

  useEffect(() => {
    if (showResult && type) {
      void trackEvent('mirror_completed', { mbti: type }, user?.id);
    }
  }, [showResult]);

  const sections = insight
    ? [
        { key: 'work', title: 'Bạn Trong Công Việc', body: insight.work },
        { key: 'study', title: 'Bạn Trong Môi Trường Học Tập', body: insight.study },
        { key: 'love', title: 'Bạn Trong Tình Cảm', body: insight.love },
        { key: 'friendship', title: 'Bạn Trong Tình Bạn & Mối Quan Hệ', body: insight.friendship },
      ]
    : [];

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      {/* Header */}
      <section className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 star-bg">
        <div className="absolute inset-0 bg-mystic-radial" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4 text-mystic-purple-300">
            <Link to="/" state={{ scrollTo: 'discovery' }} className="text-sm hover:text-white transition-colors">
              Khám Phá
            </Link>
            <span className="text-mystic-purple-600">/</span>
            <span className="text-sm text-mystic-gold-400">Mystic Mirror</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="mystic-heading text-3xl md:text-5xl font-bold text-glow-gold">
                Mystic Mirror
              </h1>
              <p className="mystic-subheading text-base md:text-lg italic text-mystic-purple-300 mt-2">
                Nhìn lại mình, giữa những bước vội.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Area */}
      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto relative z-10 space-y-6">
          {!showResult && <ExploreDisclaimer />}
          {!showResult ? (
            <div className="mystic-card rounded-2xl p-6 md:p-10">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-mystic-purple-300/60 uppercase tracking-wider">
                    Câu hỏi {currentQ + 1} / {mbtiQuestions.length}
                  </span>
                  <span className="text-xs text-mystic-gold-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1 bg-mystic-purple-900/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-mystic-purple-500 to-mystic-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="mystic-heading text-lg md:text-xl font-bold text-white mb-2">
                  {mbtiQuestions[currentQ].question}
                </h3>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {mbtiQuestions[currentQ].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="mystic-card rounded-xl p-4 md:p-5 text-left group hover:border-mystic-purple-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <span className="text-sm text-mystic-purple-200 group-hover:text-white transition-colors">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>

              {/* Back button */}
              {currentQ > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentQ(currentQ - 1)}
                    className="mystic-btn-outline text-xs py-2 px-4"
                  >
                    <i className="ri-arrow-left-line" /> Câu Trước
                  </button>
                  <span className="text-xs text-mystic-purple-300/50">
                    Đã trả lời {Object.keys(answers).length}/{mbtiQuestions.length}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Result Card */}
              <div className="mystic-card rounded-2xl overflow-hidden">
                {/* Result Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Ornate%20antique%20golden%20mirror%20reflecting%20mystical%20purple%20celestial%20light%20with%20stars%20and%20constellations%2C%20dark%20ethereal%20atmosphere%20with%20crystal%20glow%20and%20magical%20aura%2C%20artistic%20illustration&width=800&height=400&seq=mystic-mirror-result&orientation=landscape"
                    alt="Mystic Mirror Result"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] via-[#0a0618]/50 to-transparent" />
                  <div className="absolute bottom-4 left-6 md:left-10">
                    <span className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-1 block">
                      Loại Tính Cách Của Bạn
                    </span>
                    <h2 className="mystic-heading text-3xl md:text-4xl font-bold text-glow-gold">
                      {type}
                    </h2>
                  </div>
                </div>

                {/* Result Content */}
                <div className="p-6 md:p-10">
                  {result && (
                    <>
                      <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-2">
                        {result.name}
                      </h3>
                      <p className="mystic-text text-sm mb-6 opacity-80">
                        {result.desc}
                      </p>

                      <div className="mystic-divider mb-6" />

                      {savedMsg && (
                        <div className="bg-mystic-gold-500/10 border border-mystic-gold-500/30 rounded-lg px-4 py-3 text-sm text-mystic-gold-300 mb-4">
                          {savedMsg}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={reset}
                          className="mystic-btn-outline text-sm justify-center"
                        >
                          Làm Lại Bài Test
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="mystic-btn-primary text-sm justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <>
                              <i className="ri-loader-4-line animate-spin" />
                              Đang Lưu...
                            </>
                          ) : (
                            <>
                              {user ? 'Lưu Vào Hồ Sơ' : 'Đăng Nhập Để Lưu'}
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Self-reflection section (Free) */}
              {insight && (
                <div className="mystic-card rounded-2xl overflow-hidden">
                  <div className="p-6 md:p-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400">
                        Góc Nhìn Dành Cho Bạn
                      </h3>
                    </div>
                    <p className="mystic-text text-sm opacity-60 mb-8">
                      Những phản chiếu dưới đây đến từ cách bạn trả lời các tình huống — không phải để gán nhãn,
                      mà là một tấm gương để bạn nhìn rõ hơn về chính mình.
                    </p>

                    {/* Chân dung tổng quan */}
                    <div className="mb-8">
                      <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                        Chân Dung Tổng Quan
                      </h4>
                      <p className="mystic-text text-sm leading-relaxed opacity-85">
                        {insight.portrait}
                      </p>
                    </div>

                    {/* Điểm mạnh */}
                    <div className="mb-8">
                      <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                        Điểm Mạnh Nổi Bật
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.strengths.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1.5 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 text-xs text-mystic-purple-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Điều phát triển */}
                    <div className="mb-8">
                      <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                        Điều Bạn Có Thể Phát Triển
                      </h4>
                      <ul className="space-y-2.5">
                        {insight.develop.map((d) => (
                          <li key={d} className="text-sm text-mystic-purple-200/90 leading-relaxed">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Các lăng kính cuộc sống */}
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      {sections.map((s) => (
                        <div
                          key={s.key}
                          className="bg-gradient-to-br from-mystic-purple-900/20 to-transparent border border-mystic-purple-700/20 rounded-xl p-5"
                        >
                          <h4 className="text-sm font-semibold text-mystic-gold-300 mb-2">
                            {s.title}
                          </h4>
                          <p className="mystic-text text-sm leading-relaxed opacity-85">{s.body}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bức tranh chưa trọn vẹn */}
                    <div className="bg-gradient-to-br from-mystic-gold-500/10 to-mystic-purple-900/10 border border-mystic-gold-500/20 rounded-xl p-5">
                      <h4 className="text-sm font-semibold text-mystic-gold-300 mb-2 flex items-center gap-2">
                        Bức Tranh Chưa Trọn Vẹn
                      </h4>
                      <p className="mystic-text text-sm leading-relaxed opacity-85">
                        Bạn vừa giải mã được cách mình tương tác với thế giới. Mảnh ghép định mệnh còn lại đang ẩn giấu nơi bầu trời đêm. Hãy để ánh trăng dẫn lối bạn bước vào chặng tiếp theo.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <ExploreNext
                  nextPath="/explore/moon-window"
                  nextLabel="Moon Window"
                  buttonLabel="Đi Tiếp Để Hoàn Tất"
                  saved={saved}
                  saving={saving}
                  onSave={handleSave}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}