import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { saveResult, saveProfile } from '@/lib/mysticStore';
import { trackEvent } from '@/lib/tracking';
import ExploreDisclaimer from '@/components/feature/ExploreDisclaimer';
import ExploreNext from '@/components/feature/ExploreNext';
import { lifeDomainData } from '@/lib/numerologyLife';

const lifePathData: Record<string, { title: string; traits: string[]; strengths: string[]; challenges: string[]; reflection: string }> = {
  '1': {
    title: 'Người Lãnh Đạo',
    traits: ['Độc Lập', 'Tham Vọng', 'Đổi Mới', 'Quyết Đoán', 'Dũng Cảm'],
    strengths: ['Khả năng lãnh đạo bẩm sinh', 'Ý chí mạnh mẽ', 'Tư duy sáng tạo', 'Tự chủ'],
    challenges: ['Có thể bướng bỉnh', 'Đôi khi tỏ ra ích kỷ', 'Khó giao việc', 'Thiếu kiên nhẫn với người khác'],
    reflection: 'Bạn sinh ra để tiên phong và dẫn dắt. Hãy tin vào tầm nhìn và dũng cảm đi trên con đường của riêng mình.',
  },
  '2': {
    title: 'Người Hòa Giải',
    traits: ['Khéo Léo', 'Nhạy Cảm', 'Trực Giác', 'Hợp Tác', 'Hỗ Trợ'],
    strengths: ['Khả năng hòa giải tuyệt vời', 'Đồng cảm sâu sắc', 'Trực giác mạnh', 'Xây dựng đội nhóm'],
    challenges: ['Có thể quá nhạy cảm', 'Khó đối mặt xung đột', 'Có xu hướng làm hài lòng người khác', 'Thiếu quyết đoán'],
    reflection: 'Món quà của bạn là mang đến sự hài hòa. Hãy tin rằng sự nhạy cảm là điểm mạnh, không phải điểm yếu.',
  },
  '3': {
    title: 'Người Giao Tiếp',
    traits: ['Sáng Tạo', 'Biểu Cảm', 'Lạc Quan', 'Hòa Đồng', 'Nghệ Thuật'],
    strengths: ['Sức cuốn hút tự nhiên', 'Biểu đạt sáng tạo', 'Năng lượng vui tươi', 'Kỹ năng giao tiếp'],
    challenges: ['Năng lượng phân tán', 'Khó tập trung', 'Đôi khi hời hợt', 'Cảm xúc thăng trầm'],
    reflection: 'Tiếng nói của bạn rất quan trọng. Hãy thể hiện bản thân chân thực và mang vẻ đẹp đến với thế giới.',
  },
  '4': {
    title: 'Người Xây Dựng',
    traits: ['Thực Tế', 'Kỷ Luật', 'Đáng Tin Cậy', 'Chăm Chỉ', 'Ngăn Nắp'],
    strengths: ['Nền tảng vững chắc', 'Chú ý chi tiết', 'Trung thành', 'Phương pháp khoa học'],
    challenges: ['Cứng nhắc', 'Mất cân bằng công việc-cuộc sống', 'Có thể bướng bỉnh', 'Kháng cự thay đổi'],
    reflection: 'Bạn xây nên những cấu trúc bền vững. Hãy trân trọng nhu cầu ổn định nhưng vẫn chừa chỗ cho sự phát triển.',
  },
  '5': {
    title: 'Người Phiêu Lưu',
    traits: ['Yêu Tự Do', 'Đa Tài', 'Tò Mò', 'Linh Hoạt', 'Năng Động'],
    strengths: ['Linh hoạt', 'Nhiều tài lẻ', 'Ham học hỏi', 'Tinh thần phiêu lưu'],
    challenges: ['Bồn chồn', 'Khó cam kết', 'Đôi khi liều lĩnh', 'Mất tập trung'],
    reflection: 'Hãy đón nhận nhu cầu tự do của bạn. Đa dạng là gia vị của bạn, nhưng chiều sâu mới mang lại sự trọn vẹn.',
  },
  '6': {
    title: 'Người Nuôi Dưỡng',
    traits: ['Chu Đáo', 'Có Trách Nhiệm', 'Hài Hòa', 'Bảo Vệ', 'Chữa Lành'],
    strengths: ['Tình yêu sâu sắc với gia đình', 'Khả năng chữa lành', 'Cảm quan nghệ thuật', 'Xây dựng cộng đồng'],
    challenges: ['Có thể kiểm soát', 'Có xu hướng cho đi quá nhiều', 'Cầu toàn', 'Lo lắng cho người khác'],
    reflection: 'Tình yêu của bạn là một món quà. Hãy chăm sóc bản thân sâu sắc như cách bạn chăm sóc người khác.',
  },
  '7': {
    title: 'Người Tìm Kiếm',
    traits: ['Nội Tâm', 'Phân Tích', 'Tâm Linh', 'Chu Đáo', 'Khôn Ngoan'],
    strengths: ['Tư duy sâu sắc', 'Khả năng nghiên cứu', 'Nhận thức tâm linh', 'Chiều sâu trí tuệ'],
    challenges: ['Có xu hướng cô lập', 'Đôi khi quá khắt khe', 'Khó biểu đạt cảm xúc', 'Tê liệt bởi phân tích'],
    reflection: 'Hành trình tìm kiếm chân lý của bạn thật cao quý. Hãy chia sẻ trí tuệ với thế giới trong khi vẫn trân trọng sự tĩnh lặng.',
  },
  '8': {
    title: 'Người Quyền Lực',
    traits: ['Tham Vọng', 'Uy Quyền', 'Đầu Óc Kinh Doanh', 'Hào Phóng', 'Quyết Đoán'],
    strengths: ['Nhạy bén tài chính', 'Khả năng lãnh đạo', 'Hào phóng', 'Sức mạnh hiện thực hóa'],
    challenges: ['Nghiện công việc', 'Đôi khi thực dụng', 'Khó kiểm soát', 'Khó thể hiện sự dễ tổn thương'],
    reflection: 'Bạn có sức mạnh tạo ra sự dồi dào. Hãy dùng nó một cách khôn ngoan và chia sẻ thành công rộng lượng.',
  },
  '9': {
    title: 'Người Nhân Đạo',
    traits: ['Nhân Ái', 'Lý Tưởng', 'Hào Phóng', 'Khoan Dung', 'Sáng Tạo'],
    strengths: ['Tình yêu phổ quát', 'Tài năng nghệ thuật', 'Sự tha thứ', 'Tầm nhìn toàn cầu'],
    challenges: ['Đôi khi thất thường', 'Khó buông bỏ', 'Có xu hướng hy sinh', 'Bị choáng ngợp bởi nhu cầu của người khác'],
    reflection: 'Bạn sinh ra để phụng sự nhân loại. Lòng trắc ẩn là điểm mạnh lớn nhất của bạn.',
  },
  '11': {
    title: 'Người Trực Giác',
    traits: ['Tâm Linh', 'Truyền Cảm Hứng', 'Trực Giác', 'Có Tầm Nhìn', 'Nhạy Cảm'],
    strengths: ['Năng lực tâm linh', 'Nguồn cảm hứng', 'Sự thấu hiểu tâm linh', 'Năng lượng chữa lành'],
    challenges: ['Căng thẳng thần kinh', 'Đôi khi thiếu thực tế', 'Quá tải nhạy cảm', 'Khó giữ vững'],
    reflection: 'Bạn là sứ giả tâm linh. Hãy tin vào trực giác và chia sẻ ánh sáng của bạn với thế giới.',
  },
  '22': {
    title: 'Bậc Thầy Xây Dựng',
    traits: ['Có Tầm Nhìn', 'Thực Tế', 'Quyền Năng', 'Truyền Cảm Hứng', 'Tham Vọng'],
    strengths: ['Khả năng hiện thực hóa', 'Lãnh đạo', 'Tầm nhìn thực tế', 'Ảnh hưởng toàn cầu'],
    challenges: ['Trách nhiệm quá lớn', 'Cầu toàn', 'Căng thẳng thần kinh', 'Sợ thất bại'],
    reflection: 'Bạn có tầm nhìn để thay đổi thế giới. Hãy đặt giấc mơ vào hành động thực tế.',
  },
  '33': {
    title: 'Bậc Thầy Giảng Dạy',
    traits: ['Nhân Ái', 'Truyền Cảm Hứng', 'Vị Tha', 'Chữa Lành', 'Khôn Ngoan'],
    strengths: ['Tình yêu vô điều kiện', 'Khả năng giảng dạy', 'Sự hiện diện chữa lành', 'Sự dẫn dắt tâm linh'],
    challenges: ['Trách nhiệm quá lớn', 'Hy sinh bản thân', 'Gánh nặng cảm xúc', 'Cầu toàn'],
    reflection: 'Tình yêu của bạn có sức mạnh chữa lành thế giới. Hãy nhớ chăm sóc bản thân khi phụng sự người khác.',
  },
};

const numberCore: Record<string, { title: string; essence: string }> = {
  '1': { title: 'Người Tiên Phong', essence: 'Độc lập, quyết đoán và dẫn đầu. Năng lượng của số 1 là sự khởi đầu, ý chí và khả năng tự lập.' },
  '2': { title: 'Người Hòa Giải', essence: 'Nhạy cảm, khéo léo và hợp tác. Số 2 mang đến sự cân bằng, ngoại giao và trực giác tinh tế.' },
  '3': { title: 'Người Sáng Tạo', essence: 'Biểu cảm, lạc quan và nghệ thuật. Số 3 tràn đầy niềm vui, khả năng giao tiếp và sáng tạo.' },
  '4': { title: 'Người Xây Dựng', essence: 'Kỷ luật, thực tế và đáng tin. Số 4 xây nên nền tảng vững chắc bằng sự chăm chỉ và ngăn nắp.' },
  '5': { title: 'Người Tự Do', essence: 'Linh hoạt, tò mò và thích phiêu lưu. Số 5 khao khát tự do, đổi mới và trải nghiệm đa dạng.' },
  '6': { title: 'Người Nuôi Dưỡng', essence: 'Chu đáo, trách nhiệm và giàu tình cảm. Số 6 tỏa ra năng lượng chữa lành và bảo vệ.' },
  '7': { title: 'Người Tìm Kiếm', essence: 'Nội tâm, phân tích và tâm linh. Số 7 đi sâu vào tri thức, sự thật và những điều huyền bí.' },
  '8': { title: 'Người Quyền Lực', essence: 'Tham vọng, thực dụng và nhạy bén. Số 8 gắn liền với thành công, quyền lực và sự dồi dào vật chất.' },
  '9': { title: 'Người Nhân Đạo', essence: 'Vị tha, lý tưởng và khoan dung. Số 9 mang sứ mệnh phụng sự và tình yêu phổ quát.' },
  '11': { title: 'Người Trực Giác', essence: 'Tâm linh, truyền cảm hứng và có tầm nhìn. Số 11 là bậc thầy của trực giác và sự soi sáng.' },
  '22': { title: 'Bậc Thầy Xây Dựng', essence: 'Có tầm nhìn và năng lực hiện thực hóa vĩ đại. Số 22 biến giấc mơ thành những công trình bền vững.' },
};

function reduceToMaster(n: number): number {
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n).split('').reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

function calculateLifePath(date: string): string {
  if (!date) return '7';
  const digits = date.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return String(sum);
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z ]/g, '');
}

const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function nameNumbers(name: string) {
  const clean = normalizeName(name);
  let expression = 0;
  let soulUrge = 0;
  let personality = 0;
  for (const ch of clean) {
    if (ch === ' ') continue;
    const v = LETTER_VALUES[ch] || 0;
    expression += v;
    if (VOWELS.has(ch)) soulUrge += v;
    else personality += v;
  }
  return {
    expression: reduceToMaster(expression),
    soulUrge: reduceToMaster(soulUrge),
    personality: reduceToMaster(personality),
  };
}

const deepTeasersLeft = [
  'Điểm mù lớn nhất trong tính cách mà chính bạn cũng chưa nhận ra',
  'Vì sao bạn luôn cảm thấy mâu thuẫn giữa lý trí và cảm xúc?',
  'Lời khuyên cụ thể để bạn vượt qua giai đoạn bế tắc hiện tại',
];

const deepTeasersRight = [
  'Con số còn thiếu khiến các kế hoạch của bạn hay bị dở dang',
  'Năm nào trong 3 năm tới sẽ là bước ngoặt đổi đời của bạn?',
  'Mẫu người sinh ra để bù đắp những thiếu sót của bạn',
];

export default function Numerology() {
  const [birthDate, setBirthDate] = useState('');
  const [name, setName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payStep, setPayStep] = useState(1);
  const [payPlan, setPayPlan] = useState<'single' | 'combo'>('single');
  const [unlocked, setUnlocked] = useState(false);
  const deepRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (birthDate) {
      setShowResult(true);
      setSavedMsg(null);
      void trackEvent('numerology_viewed', { lifePath: calculateLifePath(birthDate) }, user?.id);
    }
  };

  const reset = () => {
    setBirthDate('');
    setName('');
    setShowResult(false);
    setPayOpen(false);
    setPayStep(1);
    setPayPlan('single');
    setSavedMsg(null);
    setSaved(false);
    setUnlocked(false);
  };

  const handlePaid = () => {
    setUnlocked(true);
    setPayOpen(false);
    setPayStep(1);
    void trackEvent('numerology_unlocked', { plan: payPlan, lifePath: calculateLifePath(birthDate) }, user?.id);
    window.setTimeout(() => deepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  };

  const handleSave = async (): Promise<boolean> => {
    if (!user) {
      navigate('/auth', { state: { redirect: '/explore/numerology' } });
      return false;
    }
    setSaving(true);
    setSavedMsg(null);
    const lp = calculateLifePath(birthDate);
    const day = birthDate ? Number(birthDate.split('-')[2]) : 0;
    const birthdayNumber = day ? String(reduceToMaster(day)) : null;
    const nameNums = name.trim() ? nameNumbers(name) : null;
    await saveResult(user.id, 'numerology', {
      lifePath: lp,
      birthdayNumber,
      expression: nameNums?.expression,
      soulUrge: nameNums?.soulUrge,
      personality: nameNums?.personality,
      name,
      birthDate,
    });
    await saveProfile(user.id, { life_path: lp });
    setSaving(false);
    setSaved(true);
    setSavedMsg('Đã lưu kết quả thần số học vào hồ sơ!');
    return true;
  };

  const lifePath = calculateLifePath(birthDate);
  const result = lifePathData[lifePath] || lifePathData['7'];

  const day = birthDate ? Number(birthDate.split('-')[2]) : 0;
  const birthdayNumber = day ? String(reduceToMaster(day)) : null;

  const nameNums = name.trim() ? nameNumbers(name) : null;

  const indicatorCards = [
    { key: 'birthday', label: 'Số Ngày Sinh', desc: 'Tài năng và năng lượng bẩm sinh', value: birthdayNumber },
    { key: 'expression', label: 'Số Sứ Mệnh', desc: 'Tiềm năng và mục tiêu cuộc đời', value: nameNums ? String(nameNums.expression) : null },
    { key: 'soul-urge', label: 'Số Linh Hồn', desc: 'Khát khao và động lực sâu thẳm', value: nameNums ? String(nameNums.soulUrge) : null },
    { key: 'personality', label: 'Số Nhân Cách', desc: 'Cách bạn thể hiện với thế giới', value: nameNums ? String(nameNums.personality) : null },
  ];

  const deepFullSections = [
    {
      title: 'Điểm Mù Lớn Nhất Trong Tính Cách',
      body: `Là Số Đường Đời ${lifePath} (${result.title}), bạn thường vô thức kìm nén cảm xúc thật để giữ hình ảnh mạnh mẽ trước người khác. Điểm mù lớn nhất là bạn đánh giá thấp nhu cầu được công nhận và được yêu thương của chính mình, khiến bạn dễ rơi vào trạng thái cố gắng quá mức rồi đột ngột kiệt sức.`,
    },
    {
      title: 'Vì Sao Bạn Mâu Thuẫn Giữa Lý Trí Và Cảm Xúc',
      body: `Bạn có xu hướng ${(result.challenges[0] || 'bướng bỉnh').toLowerCase()}, nên khi lý trí muốn bước tiếp nhưng cảm xúc vẫn chưa sẵn sàng, bạn tự tạo ra một cuộc giằng co nội tâm. Sự mâu thuẫn này không phải điểm yếu — đó là dấu hiệu bạn đang trưởng thành nhanh hơn tốc độ mà trái tim kịp thích nghi.`,
    },
    {
      title: 'Lời Khuyên Vượt Qua Giai Đoạn Bế Tắc Hiện Tại',
      body: `Hãy cho bản thân một khoảng lặng 15 phút mỗi ngày để viết ra điều đang khiến bạn nặng lòng, thay vì cố giải quyết mọi thứ ngay lập tức. Với năng lượng của số ${lifePath}, bạn tiến bộ nhanh nhất khi được hành động, nên hãy chọn đúng một việc nhỏ có thể hoàn thành trong ngày để lấy lại đà.`,
    },
    {
      title: 'Con Số Còn Thiếu Khiến Kế Hoạch Dang Dở',
      body: `Bạn sở hữu ${result.strengths.slice(0, 2).join(' và ').toLowerCase()}, nhưng chính vì quá nhiều ý tưởng nên các kế hoạch của bạn hay bị bỏ giữa chừng. Một người đồng hành biết nhắc nhở đúng lúc, hoặc việc chia mục tiêu lớn thành các cột mốc 7 ngày, sẽ giúp bạn đi đến cuối con đường.`,
    },
    {
      title: 'Năm Bước Ngoặt Đổi Đời Trong 3 Năm Tới',
      body: `Trong chu kỳ 9 năm, bạn đang bước vào giai đoạn mở rộng. Năm thứ nhất mang đến cơ hội mới về sự nghiệp, năm thứ hai là lúc các mối quan hệ quyết định bước tiến lớn, và năm thứ ba là điểm thu hoạch. Hãy chuẩn bị nền tảng ngay từ bây giờ để không bỏ lỡ cánh cửa đang mở.`,
    },
    {
      title: 'Mẫu Người Sinh Ra Để Bù Đắp Thiếu Sót Của Bạn',
      body: `Bạn hợp nhất với người có Số Đường Đời bổ trợ cho ${lifePath} — mẫu người điềm tĩnh, biết lắng nghe và không cạnh tranh với bạn. Ở cạnh họ, bạn được phép yếu mềm mà không bị phán xét, và đó chính là liều thuốc cân bằng cho tâm hồn bạn.`,
    },
  ];

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      <section className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 star-bg">
        <div className="absolute inset-0 bg-mystic-radial" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4 text-mystic-purple-300">
            <Link to={{ pathname: '/', state: { scrollTo: 'discovery' } }} className="text-sm hover:text-white transition-colors">
              Khám Phá
            </Link>
            <span className="text-mystic-purple-600">/</span>
            <span className="text-sm text-mystic-gold-400">Numerology</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="mystic-heading text-3xl md:text-5xl font-bold text-glow-gold">
                Numerology
              </h1>
              <p className="mystic-subheading text-base md:text-lg italic text-mystic-purple-300 mt-2">
                Bức tranh hoàn chỉnh về những con số của bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          {!showResult && <ExploreDisclaimer />}
          {!showResult ? (
            <div className="mystic-card rounded-2xl p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="mystic-heading text-xl font-bold text-mystic-gold-400 mb-2">
                  Giải Mã Những Con Số Của Bạn
                </h2>
                <p className="mystic-text text-sm opacity-60">
                  Nhập ngày sinh và tên đầy đủ để nhận phân tích thần số học toàn diện
                </p>
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
                  <label className="block text-xs text-mystic-purple-300/60 uppercase tracking-wider mb-2">
                    Tên Đầy Đủ (để tính Số Sứ Mệnh, Linh Hồn, Nhân Cách)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl px-4 py-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-purple-500/50"
                  />
                </div>
              </div>

              <button onClick={handleSubmit} className="mystic-btn-gold text-sm w-full justify-center mt-8">
                Hé Lộ Những Con Số Của Tôi
              </button>
            </div>
          ) : (
            <div>
              {/* Life Path hero */}
              <div className="mystic-card rounded-2xl overflow-hidden mb-6">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Glowing%20golden%20numbers%20and%20sacred%20geometry%20floating%20in%20dark%20cosmic%20space%20with%20purple%20nebula%20and%20stardust%2C%20mystical%20numerology%20symbols%20and%20runic%20patterns%20glowing%20ethereal%20light%2C%20artistic%20illustration&width=800&height=400&seq=numerology-result&orientation=landscape"
                    alt="Numerology Result"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] via-[#0a0618]/50 to-transparent" />
                  <div className="absolute bottom-4 left-6 md:left-10">
                    <span className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-1 block">
                      Số Đường Đời Của Bạn
                    </span>
                    <h2 className="mystic-heading text-5xl md:text-6xl font-bold text-glow-gold">
                      {lifePath}
                    </h2>
                  </div>
                </div>
                <div className="p-6 md:p-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/40 text-[10px] uppercase tracking-wider text-mystic-purple-200 mb-3">
                    Numerology Basic · Miễn phí
                  </span>
                  <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-2">
                    {result.title}
                  </h3>
                  <p className="mystic-text text-sm opacity-70 mb-6">
                    {result.reflection}
                  </p>

                  {/* Free — Góc nhìn dành cho bạn */}
                  {(() => {
                    const life = lifeDomainData[lifePath] || lifeDomainData['7'];
                    const lifeBlocks = [
                      { key: 'work', title: 'Bạn Trong Công Việc', body: life.work },
                      { key: 'study', title: 'Bạn Trong Học Tập', body: life.study },
                      { key: 'love', title: 'Bạn Trong Tình Cảm', body: life.love },
                      { key: 'friendship', title: 'Bạn Trong Các Mối Quan Hệ', body: life.friendship },
                    ];
                    return (
                      <>
                        <div className="mb-8">
                          <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                            Chân Dung Tổng Quan
                          </h4>
                          <p className="mystic-text text-sm leading-relaxed opacity-85">{life.portrait}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-8">
                          {lifeBlocks.map((b) => (
                            <div key={b.key} className="bg-gradient-to-br from-mystic-purple-900/15 to-transparent border border-mystic-purple-700/15 rounded-xl p-5">
                              <h4 className="text-sm font-semibold text-mystic-gold-300 mb-2">
                                {b.title}
                              </h4>
                              <p className="mystic-text text-sm leading-relaxed opacity-85">{b.body}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mb-6 bg-gradient-to-br from-mystic-gold-500/10 to-mystic-purple-900/10 border border-mystic-gold-500/20 rounded-xl p-5">
                          <h4 className="text-sm font-semibold text-mystic-gold-300 mb-2 flex items-center gap-2">
                            Gợi Ý Phản Chiếu Bản Thân
                          </h4>
                          <p className="mystic-text text-sm leading-relaxed opacity-85">{result.reflection}</p>
                        </div>
                      </>
                    );
                  })()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3">
                        Nét Tính Cách Cốt Lõi
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.traits.map((t) => (
                          <span key={t} className="px-3 py-1.5 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 text-xs text-mystic-purple-200">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3">
                        Điểm Mạnh
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.strengths.map((s) => (
                          <span key={s} className="px-3 py-1.5 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 text-xs text-mystic-purple-200">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h4 className="mystic-heading text-xs text-mystic-purple-300 tracking-[0.2em] uppercase mb-3">
                      Thử Thách
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.challenges.map((c) => (
                        <span key={c} className="px-3 py-1.5 rounded-full bg-mystic-purple-950/50 border border-mystic-purple-800/30 text-xs text-mystic-purple-300/70">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Other indicators */}
              <div className="mystic-card rounded-2xl overflow-hidden mb-6">
                <div className="p-6 md:p-10">
                  <h3 className="mystic-heading text-sm font-bold text-mystic-gold-400 mb-6 tracking-[0.15em]">
                    CÁC CHỈ SỐ QUAN TRỌNG KHÁC
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {indicatorCards.map((card) => {
                      const core = card.value ? numberCore[card.value] : null;
                      return (
                        <div key={card.key} className="mystic-card rounded-xl p-5">
                          <div className="mb-3">
                            <p className="text-sm text-white font-medium">{card.label}</p>
                            <p className="text-xs text-mystic-purple-300/60">{card.desc}</p>
                          </div>
                          {core ? (
                            <>
                              <div className="flex items-baseline gap-2 mb-2">
                                <span className="mystic-heading text-3xl font-bold text-mystic-gold-400">
                                  {card.value}
                                </span>
                                <span className="text-xs text-mystic-purple-300/70">{core.title}</span>
                              </div>
                              <p className="mystic-text text-xs opacity-70 leading-relaxed">{core.essence}</p>
                            </>
                          ) : (
                            <p className="text-xs text-mystic-purple-300/50 italic">
                              {card.key === 'birthday' ? 'Nhập ngày sinh để xem chỉ số này.' : 'Nhập tên đầy đủ để xem chỉ số này.'}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Numerology Deep Analysis (paid teaser) */}
              <div id="numerology-deep" ref={deepRef} className="mystic-card rounded-2xl overflow-hidden mb-6 relative scroll-mt-24">
                <div className="absolute inset-0 bg-gradient-to-br from-mystic-gold-500/5 via-transparent to-mystic-purple-900/10 pointer-events-none" />
                <div className="p-6 md:p-10 relative">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mystic-gold-500/10 border border-mystic-gold-500/30 text-[10px] uppercase tracking-wider text-mystic-gold-300 mb-4">
                      MẬT MÃ TỪ NGÀY SINH CỦA BẠN
                    </div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mystic-gold-500/20 to-mystic-purple-900/20 border border-mystic-gold-500/30 flex items-center justify-center mx-auto mb-4 glow-gold">
                      <i className={unlocked ? 'ri-lock-unlock-line text-xl text-mystic-gold-400' : 'ri-lock-2-line text-xl text-mystic-gold-400'} />
                    </div>
                    <h3 className="mystic-heading text-lg md:text-xl font-bold text-glow-gold mb-2">
                      NHỮNG CON SỐ ĐANG ÂM THẦM DẪN LỐI BẠN
                    </h3>
                    <p className="mystic-text text-sm opacity-70 max-w-xl mx-auto">
                      Những gì bạn vừa thấy mới là bề nổi của ngày sinh. Bản đồ số của bạn vẫn còn những con số định đoạt bước ngoặt sự nghiệp, điểm mù trong tình cảm và bài học lớn nhất đời bạn. Mở khóa phần còn lại để lật mở toàn bộ hướng đi phù hợp nhất với bạn.
                    </p>
                  </div>

                  {unlocked ? (
                    <div className="space-y-4 max-w-3xl mx-auto text-left">
                      {deepFullSections.map((s, i) => (
                        <div key={s.title} className="analysis-tile rounded-xl p-5">
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-6 h-6 rounded-full bg-mystic-gold-500/15 border border-mystic-gold-500/40 flex items-center justify-center text-[11px] text-mystic-gold-300 shrink-0">{i + 1}</span>
                              <h4 className="text-sm font-semibold text-mystic-gold-300">{s.title}</h4>
                            </div>
                            <p className="mystic-text text-sm leading-relaxed opacity-90">{s.body}</p>
                          </div>
                        </div>
                      ))}
                      <div className="bg-mystic-gold-500/10 border border-mystic-gold-500/30 rounded-xl px-5 py-4 text-center">
                        <i className="ri-lock-unlock-line text-mystic-gold-400 text-lg" />
                        <p className="mystic-text text-xs text-mystic-gold-300 mt-1">Bạn đã mở khóa toàn bộ hồ sơ Thần Số Học. Bấm "Lưu Vào Hồ Sơ" bên dưới để lưu kết quả này.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-w-2xl mx-auto">
                        <div className="space-y-2">
                          {deepTeasersLeft.map((item) => (
                            <div key={item} className="relative bg-mystic-purple-900/20 border border-mystic-purple-700/20 rounded-lg px-3 py-2.5 pr-8">
                              <span className="text-xs text-mystic-purple-200 leading-relaxed">{item}</span>
                              <i className="ri-lock-2-line text-mystic-gold-400/70 text-xs absolute top-1.5 right-2" />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          {deepTeasersRight.map((item) => (
                            <div key={item} className="relative bg-mystic-purple-900/20 border border-mystic-purple-700/20 rounded-lg px-3 py-2.5 pr-8">
                              <span className="text-xs text-mystic-purple-200 leading-relaxed">{item}</span>
                              <i className="ri-lock-2-line text-mystic-gold-400/70 text-xs absolute top-1.5 right-2" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => { setPayOpen(true); setPayStep(1); }}
                          className="mystic-btn-gold text-sm justify-center cursor-pointer"
                        >
                          <i className="ri-lock-unlock-line" />
                          Xem Tiếp Bản Phân Tích Đầy Đủ
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {savedMsg && (
                <div className="bg-mystic-gold-500/10 border border-mystic-gold-500/30 rounded-lg px-4 py-3 text-sm text-mystic-gold-300 mb-6">
                  {savedMsg}
                </div>
              )}

              <div className="mystic-divider mb-6" />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={reset} className="mystic-btn-outline text-xs py-2 px-4 justify-center">
                  Tính Lại
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
                  nextPath="/explore/tarot-table"
                  nextLabel="Tarot Table"
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
                  HỒ SƠ GIẢI MÃ TOÀN DIỆN THẦN SỐ HỌC
                </h3>

                <div className="space-y-3 text-left mb-6">
                  {[
                    'Lời giải trọn bộ cho 6 điểm mù tính cách, giai đoạn đổi đời và bài học số mệnh.',
                    'Biểu đồ năng lượng chi tiết cho từng năm trong chu kỳ 9 năm tới.',
                    'Tự động lưu và cập nhật vào hồ sơ cá nhân của bạn trên The Mystic Room.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <i className="ri-check-line text-mystic-gold-400 mt-0.5 shrink-0" />
                      <p className="mystic-text text-sm leading-relaxed opacity-85">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <span className="text-sm text-mystic-purple-300/60 line-through">249.000đ</span>
                    <span className="text-[11px] text-mystic-gold-400 uppercase tracking-wider">Phí mở khóa trọn đời</span>
                  </div>
                  <p className="mystic-heading text-3xl font-bold text-glow-gold">99.000đ</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => { setPayPlan('single'); setPayStep(2); }}
                    className="mystic-btn-gold text-sm justify-center w-full cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-lock-unlock-line" />
                    Mở Khóa Hồ Sơ Ngay · 99.000đ
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
                  Quét VietQR / MoMo nhận kết quả ngay sau 30 giây.
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-mystic-gold-500/10 border border-mystic-gold-500/30 flex items-center justify-center mx-auto mb-4 glow-gold">
                  <i className="ri-qr-code-line text-mystic-gold-400 text-2xl" />
                </div>

                <h3 className="mystic-heading text-lg font-bold text-glow-gold mb-2">
                  Quét Mã Để Thanh Toán
                </h3>
                <p className="mystic-text text-sm opacity-70 mb-5">
                  {payPlan === 'combo' ? 'Gói Khai Mở Trọn Vẹn (Bản Đồ Sao + Thần Số Học)' : 'Hồ Sơ Giải Mã Toàn Diện Thần Số Học'}
                </p>

                <div className="w-48 h-48 mx-auto mb-5 rounded-2xl border border-mystic-gold-500/30 bg-white/95 flex items-center justify-center">
                  <i className="ri-qr-code-line text-7xl text-mystic-purple-900" />
                </div>

                <p className="mystic-heading text-2xl font-bold text-glow-gold mb-4">
                  {payPlan === 'combo' ? '199.000đ' : '99.000đ'}
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