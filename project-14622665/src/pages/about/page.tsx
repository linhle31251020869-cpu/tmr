import { Link } from 'react-router-dom';
import { experiences } from '@/mocks/mysticData';
import PageHero from '@/components/feature/PageHero';

// Lý do nên chọn The Mystic Room
const reasons = [
  { title: 'Cá nhân hóa bằng AI', desc: 'Mỗi người là một tổ hợp riêng. AI kết nối Tarot, chiêm tinh, MBTI và thần số học để tạo nên chân dung chỉ dành cho bạn.' },
  { title: 'Không phán xét, chỉ gợi mở', desc: 'Chúng tôi không nói bạn là ai hay phải sống thế nào. Mỗi trải nghiệm chỉ là một chiếc gương để bạn tự chiêm nghiệm.' },
  { title: 'Kết nối với huyền học', desc: 'Tinh hoa của Tarot, bản đồ sao và thần số học được diễn giải bằng ngôn ngữ gần gũi, dễ hiểu với thế hệ trẻ.' },
  { title: 'Mang dấu ấn riêng', desc: 'Từ Mystic Card đến vòng tay năng lượng — bạn có thể biến những điều khám phá về mình thành món quà thật sự thuộc về bạn.' },
];

// Thứ tự hiển thị các trải nghiệm: Mystic Mirror -> Moon Window -> Numerology -> Tarot Table
const discoveryOrder = ['mystic-mirror', 'moon-window', 'numerology', 'tarot-table'];

const orderedExperiences = discoveryOrder
  .map((id) => experiences.find((e) => e.id === id))
  .filter((e): e is (typeof experiences)[number] => Boolean(e));

// Các bước chính của hành trình sử dụng web
const introSteps = [
  { step: '1', title: 'Khám Phá', desc: 'Trải nghiệm các tính năng (Mystic Mirror, Moon Window, Numerology, Tarot Table) để thu thập nhiều góc nhìn về chính bạn.' },
  { step: '2', title: 'Tổng Hợp', desc: 'AI tập hợp dữ liệu từ từng trải nghiệm bạn đã làm, tìm ra điểm giao thoa giữa các lớp năng lượng.' },
  { step: '3', title: 'Mystic Profile', desc: 'Nhận một bức tranh tổng thể, cá nhân hóa về tính cách, cảm xúc, tình yêu và định hướng của bạn.' },
  { step: '4', title: 'Cá Nhân Hóa', desc: 'Tạo sản phẩm và Mystic Card theo năng lượng riêng để món quà phản chiếu đúng con người bạn.' },
];

// Hướng dẫn sử dụng cho từng tính năng
const featureHowTo: Record<string, string[]> = {
  'mystic-mirror': ['Trả lời từng câu hỏi tình huống theo cảm nhận thật của bạn', 'Xem loại tính cách, điểm mạnh và góc nhìn trong các lĩnh vực cuộc sống', 'Lưu kết quả để làm nền tảng cho Mystic Profile'],
  'moon-window': ['Nhập ngày, giờ và nơi sinh để tạo bản đồ sao', 'Xem bức tranh về bạn và ba lớp năng lượng cốt lõi', 'Mở khóa phân tích sâu để hiểu từng hành tinh, nhà và góc chiếu'],
  'numerology': ['Nhập ngày sinh và tên đầy đủ để tính các chỉ số', 'Xem Số Đường Đời, Sứ Mệnh, Linh Hồn và Nhân Cách', 'Khám phá phân tích chuyên sâu về con số và giai đoạn phát triển'],
  'tarot-table': ['Chọn một chủ đề bạn đang băn khoăn', 'Trả lời vài điều để kết nối năng lượng với lá bài', 'Xào bài, rút một lá và đọc diễn giải cùng lời khuyên riêng'],
};

export default function About() {
  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      {/* Header */}
      <PageHero
        image="https://readdy.ai/api/search-image?query=Ethereal%20fantasy%20scene%20of%20a%20majestic%20cosmic%20observatory%20sanctum%20with%20a%20giant%20glowing%20celestial%20orb%20and%20suspended%20golden%20constellation%20lines%2C%20ornate%20arched%20pillars%20wrapped%20in%20violet%20nebula%20mist%2C%20soft%20radiant%20glow%2C%20abstract%20mystical%20digital%20art%2C%20deep%20violet%20and%20warm%20gold%20palette%2C%20dreamy%20starry%20atmosphere%2C%20darker%20calm%20center%20for%20text%20overlay%2C%20no%20text&width=1600&height=600&seq=about-hero-observatory-v2&orientation=landscape&nocache=true"
        imageAlt="Thư viện huyền bí của The Mystic Room"
        icons={['ri-book-open-line', 'ri-moon-clear-line', 'ri-sparkling-line', 'ri-planet-line', 'ri-magic-line', 'ri-leaf-line']}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mystic-heading text-4xl md:text-6xl font-bold text-glow-gold mb-6">
            Về The Mystic Room
          </h1>
          <div className="mystic-divider max-w-xs mx-auto" />
        </div>
      </PageHero>

      {/* Câu Chuyện Của Chúng Tôi — text + visual */}
      <section className="relative py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mystic-card rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple-900/15 via-transparent to-mystic-gold-500/5 pointer-events-none" />
            <div className="relative grid grid-cols-1 lg:grid-cols-[55fr_45fr] items-center gap-8 p-6 md:p-10 lg:p-0">
              {/* Nội dung */}
              <div className="lg:py-12 lg:pl-10 lg:pr-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/40 text-[10px] uppercase tracking-wider text-mystic-purple-200 mb-5">
                  <i className="ri-door-open-line text-mystic-gold-400 text-xs" /> Câu Chuyện Của Chúng Tôi
                </span>
                <h2 className="mystic-heading text-2xl md:text-3xl font-bold text-glow-gold mb-5 leading-snug">
                  Một căn phòng để bạn lắng nghe chính mình
                </h2>

                <p className="mystic-text text-sm leading-relaxed mb-4 opacity-85">
                  Giữa những deadline, áp lực và sự ồn ào của cuộc sống, đôi khi chúng ta có rất nhiều
                  câu hỏi nhưng lại không có một nơi để ngồi xuống và lắng nghe chính mình. The Mystic Room
                  được sinh ra từ những câu hỏi rất đỗi quen thuộc của người trẻ: “Mình thật sự là ai?”,
                  “Vì sao mình luôn suy nghĩ như vậy?”, “Mình đang đi đúng hướng không?”
                </p>

                <p className="mystic-text text-sm leading-relaxed mb-4 opacity-85">
                  Qua sự kết hợp giữa Tarot, MBTI, Birth Chart, Numerology và AI, Mystic Room tạo nên một
                  “căn phòng” hiện đại, gần gũi và không phán xét — nơi mỗi người có thể tạm dừng, khám phá
                  bản thân và nhìn thấy những mảnh ghép của chính mình từ nhiều góc khác nhau.
                </p>

                <blockquote className="mystic-text text-sm leading-relaxed italic text-mystic-gold-300 border-l-2 border-mystic-gold-500/40 pl-4 mb-4">
                  Chúng tôi không đưa ra câu trả lời cố định hay quyết định bạn là ai. Mỗi trải nghiệm chỉ là
                  một chiếc gương — giúp bạn đặt câu hỏi, suy ngẫm và kết nối những mảnh ghép về chính mình.
                </blockquote>

                <p className="mystic-text text-sm leading-relaxed opacity-80">
                  Mục tiêu của chúng tôi là biến mysticism thành một ngôn ngữ khám phá bản thân phù hợp với
                  thế hệ trẻ — khiến hành trình hiểu mình trở nên dễ tiếp cận, cá nhân hóa và thú vị hơn,
                  để mỗi người có thể trưởng thành theo cách của riêng mình.
                </p>
              </div>

              {/* Hình minh họa */}
              <div className="lg:h-full relative">
                <div className="relative w-full h-72 sm:h-96 lg:h-[520px] overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=A%20lone%20young%20person%20seen%20from%20behind%20standing%20in%20front%20of%20a%20grand%20softly%20glowing%20mystical%20doorway%20inside%20a%20dim%20elegant%20cosmic%20purple%20room%2C%20radiant%20warm%20golden%20light%20and%20a%20swirling%20starry%20night%20sky%20with%20a%20faint%20nebula%20visible%20beyond%20the%20open%20door%20inviting%20them%20to%20step%20through%2C%20modern%20refined%20abstract%203D%20digital%20art%2C%20deep%20violet%20and%20warm%20gold%20cosmic%20color%20palette%2C%20cinematic%20soft%20glow%2C%20subtle%20floating%20light%20particles%2C%20serene%20self-discovery%20introspective%20atmosphere%2C%20elegant%20premium%20minimalist%20mood%20without%20heavy%20fortune-telling%20clich%C3%A9s&width=800&height=1000&seq=about-mystic-door-v2&orientation=portrait"
                    alt="Người bước vào cánh cửa phát sáng với bầu trời sao bên trong căn phòng huyền bí"
                    title="The Mystic Room — hành trình khám phá bản thân"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mystic-purple-950/60 via-mystic-purple-950/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tại Sao Chọn The Mystic Room */}
      <section className="relative py-12 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-mystic-purple-300/80 mb-5">
              <span className="w-6 h-px bg-mystic-gold-500/50" />
              Vì Sao Chúng Tôi Ở Đây
              <span className="w-6 h-px bg-mystic-gold-500/50" />
            </span>
            <h2 className="mystic-heading text-3xl md:text-5xl font-bold mb-4">
              <span className="text-[#f3e7cf]">Tại Sao Chọn </span>
              <span className="text-glow-gold">The Mystic Room</span>
            </h2>
            <p className="mystic-subheading text-base md:text-lg italic">
              Không phải để phán xét bạn là ai, mà để bạn tự nhìn thấy mình rõ hơn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="relative overflow-hidden rounded-2xl border border-mystic-purple-600/30 bg-gradient-to-b from-[#28144c]/85 via-[#1b0f3a]/85 to-[#140b2c]/90 p-6 transition-all duration-300 hover:border-mystic-gold-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple-600/15 via-transparent to-mystic-gold-500/5 pointer-events-none" />
                <h3 className="relative mystic-heading text-lg md:text-xl font-bold leading-snug text-[#f3e7cf] mb-4">
                  {r.title}
                </h3>
                <p className="relative mystic-text text-sm leading-relaxed opacity-80">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cách Hoạt Động & Hướng Dẫn Sử Dụng */}
      <section className="relative py-12 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Tiêu đề */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="mystic-heading text-2xl md:text-3xl font-bold text-glow-gold mb-3">
              Cách The Mystic Room Hoạt Động
            </h2>
            <p className="mystic-subheading text-base md:text-lg italic mb-4">
              Bốn bước để biến sự tò mò về bản thân thành một góc nhìn trọn vẹn
            </p>
            <p className="mystic-text text-sm max-w-2xl mx-auto opacity-70">
              Mỗi tính năng đóng vai trò riêng trong hành trình. Dưới đây là cách web vận hành, từng trải nghiệm
              dùng để làm gì và bạn sử dụng chúng ra sao.
            </p>
            <div className="mystic-divider mt-6 max-w-md mx-auto" />
          </div>

          {/* 4 bước hành trình */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14 md:mb-20">
            {introSteps.map((st) => (
              <div key={st.step} className="mystic-card rounded-xl p-6 text-center transition-all duration-300 hover:border-mystic-purple-500/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple-900/10 to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="mystic-heading text-5xl font-bold text-mystic-gold-400 mb-4 text-glow-gold">
                    {st.step}
                  </div>
                  <h3 className="mystic-heading text-base font-bold text-white mb-2">{st.title}</h3>
                  <p className="mystic-text text-xs opacity-70 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Từng tính năng */}
          <div className="text-center mb-10">
            <h3 className="mystic-heading text-xl md:text-2xl font-bold text-mystic-gold-400 mb-2">
              Các Trải Nghiệm & Cách Sử Dụng
            </h3>
            <p className="mystic-text text-sm opacity-70 max-w-xl mx-auto">
              Mỗi công cụ soi một mảnh ghép của bạn — dùng chúng theo thứ tự gợi ý để có bức tranh rõ nhất.
            </p>
          </div>

          <div className="space-y-8">
            {orderedExperiences.map((exp) => (
              <div key={exp.id} className="mystic-card rounded-2xl overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Hình minh họa */}
                  <div className="relative h-48 sm:h-56 md:h-auto overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      title={`${exp.title} — ${exp.subtitle}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0618]/80 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] to-transparent md:hidden" />
                  </div>

                  {/* Nội dung */}
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-mystic-purple-300/60 uppercase tracking-wider">{exp.subtitle}</span>
                    </div>
                    <h4 className="mystic-heading text-xl md:text-2xl font-bold text-mystic-gold-400 mb-3">
                      {exp.title}
                    </h4>
                    <p className="mystic-text text-sm opacity-80 leading-relaxed mb-5">
                      {exp.description}
                    </p>

                    <div className="mb-5">
                      <p className="text-xs text-mystic-gold-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i className="ri-play-circle-line" /> Cách sử dụng
                      </p>
                      <ul className="space-y-2">
                        {(featureHowTo[exp.id] || []).map((use) => (
                          <li key={use} className="flex items-start gap-2.5 text-sm text-mystic-purple-200/90">
                            <i className="ri-arrow-right-s-line text-mystic-gold-400 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Link to={`/explore/${exp.id}`} className="mystic-btn-outline text-sm justify-center">
                        <i className="ri-arrow-right-line" /> Thử Ngay {exp.title}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nút dẫn về trang trải nghiệm */}
          <div className="text-center mt-14 md:mt-16">
            <p className="mystic-text text-sm opacity-70 mb-5">
              Sẵn sàng bước vào hành trình? Bắt đầu từ trải nghiệm phù hợp với bạn nhất.
            </p>
            <Link to={{ pathname: '/', state: { scrollTo: 'discovery' } }} className="mystic-btn-gold text-sm justify-center">
              <i className="ri-magic-line" /> Khám Phá Ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}