// Bộ dữ liệu cá nhân hóa cho Mystic Card.
// Thẻ chính (hero) có 5 biến thể hình nền theo nguyên tố của người dùng,
// và bộ thẻ thu thập (collector) lấy trực tiếp dữ liệu từ Mystic Profile.

export interface ElementCardTheme {
  key: string;
  name: string;
  image: string;
  accent: string;
  icon: string;
  tagline: string;
  description: string;
}

export const elementCardThemes: ElementCardTheme[] = [
  {
    key: 'Lửa',
    name: 'Nguyên Tố Lửa',
    image: 'https://readdy.ai/api/search-image?query=Abstract%20cosmic%20fire%20elemental%20art%20with%20flowing%20golden%20orange%20flames%20and%20embers%20swirling%20around%20a%20radiant%20sun%20core%2C%20deep%20dark%20background%20with%20warm%20glow%2C%20mystical%20celestial%20energy%2C%20painterly%20illustration%2C%20no%20text&width=560&height=320&seq=ele-fire-card-2026&orientation=landscape',
    accent: '#e8873c',
    icon: 'ri-fire-line',
    tagline: 'Ngọn lửa bên trong',
    description: 'Bạn hành động bằng đam mê, tiên phong và lan tỏa sức sống. Lửa thúc bạn dấn bước và truyền cảm hứng cho người khác.',
  },
  {
    key: 'Đất',
    name: 'Nguyên Tố Đất',
    image: 'https://readdy.ai/api/search-image?query=Abstract%20cosmic%20earth%20elemental%20art%20with%20emerald%20green%20crystal%20mountains%2C%20moss%20stones%20and%20golden%20roots%20in%20dark%20rich%20soil%20under%20soft%20aurora%20light%2C%20mystical%20celestial%20energy%2C%20painterly%20illustration%2C%20no%20text&width=560&height=320&seq=ele-earth-card-2026&orientation=landscape',
    accent: '#6aa86a',
    icon: 'ri-plant-line',
    tagline: 'Nền tảng vững chắc',
    description: 'Bạn xây dựng bằng sự kiên nhẫn, bền bỉ và đáng tin. Đất cho bạn khả năng biến điều nhỏ bé thành giá trị lâu dài.',
  },
  {
    key: 'Khí',
    name: 'Nguyên Tố Khí',
    image: 'https://readdy.ai/api/search-image?query=Abstract%20cosmic%20air%20elemental%20art%20with%20swirling%20silver%20white%20clouds%2C%20feather%20like%20light%20streams%20and%20pale%20wind%20spirals%20in%20dark%20starry%20sky%2C%20mystical%20celestial%20energy%2C%20painterly%20illustration%2C%20no%20text&width=560&height=320&seq=ele-air-card-2026&orientation=landscape',
    accent: '#9fb8d8',
    icon: 'ri-windy-line',
    tagline: 'Tự do và kết nối',
    description: 'Bạn tư duy linh hoạt, cởi mở và giao tiếp giỏi. Khí giúp bạn kết nối ý tưởng, con người và những chân trời mới.',
  },
  {
    key: 'Thủy',
    name: 'Nguyên Tố Thủy',
    image: 'https://readdy.ai/api/search-image?query=Abstract%20cosmic%20water%20elemental%20art%20with%20deep%20ocean%20waves%2C%20moonlit%20ripples%20and%20luminous%20blue%20violet%20water%20droplets%20in%20dark%20starry%20sky%2C%20mystical%20celestial%20energy%2C%20painterly%20illustration%2C%20no%20text&width=560&height=320&seq=ele-water-card-2026&orientation=landscape',
    accent: '#7aa8c8',
    icon: 'ri-water-flash-line',
    tagline: 'Chiều sâu cảm xúc',
    description: 'Bạn cảm nhận thế giới bằng trực giác và sự đồng cảm. Thủy cho bạn chiều sâu tâm hồn và khả năng chữa lành.',
  },
];

const FALLBACK_THEME: ElementCardTheme = {
  key: 'Huyền Không',
  name: 'Nguyên Tố Huyền Không',
  image: 'https://readdy.ai/api/search-image?query=Abstract%20cosmic%20mystical%20art%20with%20amethyst%20crystals%2C%20crescent%20moon%20and%20golden%20nebula%20clouds%20in%20deep%20purple%20starry%20sky%2C%20mystical%20celestial%20energy%2C%20painterly%20illustration%2C%20no%20text&width=560&height=320&seq=ele-default-card-2026&orientation=landscape',
  accent: '#a78bfa',
  icon: 'ri-moon-clear-line',
  tagline: 'Vũ trụ dẫn lối',
  description: 'Bạn thuộc về vùng giao thoa giữa các nguyên tố — linh hoạt, sâu sắc và đầy tiềm năng chưa được đặt tên.',
};

function normalizeElement(element?: string): string {
  const e = (element || '').trim().toLowerCase();
  if (e.includes('lửa') || e.includes('hỏa')) return 'Lửa';
  if (e.includes('đất') || e.includes('thổ')) return 'Đất';
  if (e.includes('khí') || e.includes('gió')) return 'Khí';
  if (e.includes('thủy') || e.includes('nước')) return 'Thủy';
  return '';
}

export function getElementCardTheme(element?: string): ElementCardTheme {
  const key = normalizeElement(element);
  return elementCardThemes.find((t) => t.key === key) || FALLBACK_THEME;
}

// Nhãn ngắn cho từng Số Đường Đời
export const lifePathThemes: Record<string, string> = {
  '1': 'Nhà tiên phong — bạn sinh ra để dẫn đầu và mở đường.',
  '2': 'Người kết nối — bạn giỏi hòa giải và tạo sự cân bằng.',
  '3': 'Nguồn sáng tạo — bạn tỏa niềm vui và khả năng biểu đạt.',
  '4': 'Người xây dựng — bạn kiến tạo nền tảng vững bền.',
  '5': 'Kẻ tự do — bạn khao khát khám phá và thay đổi.',
  '6': 'Người chăm sóc — bạn được định hướng bởi yêu thương và trách nhiệm.',
  '7': 'Nhà tìm kiếm — bạn đi tìm sự thật và chiều sâu tâm hồn.',
  '8': 'Nhà thành tựu — bạn có tố chất dẫn dắt và tạo dựng.',
  '9': 'Trái tim nhân hậu — bạn sống vì điều lớn lao hơn chính mình.',
  '11': 'Bậc thầy trực giác — bạn nhạy bén với năng lượng tinh thần.',
  '22': 'Kiến trúc sư vĩ đại — bạn biến ước mơ lớn thành hiện thực.',
  '33': 'Bậc thầy chữa lành — bạn dẫn dắt bằng tình thương vô điều kiện.',
};

// Biệt danh ngắn cho từng nhóm tính cách MBTI
export const mbtiNicknames: Record<string, string> = {
  INTJ: 'Nhà Chiến Lược',
  INTP: 'Nhà Tư Tưởng',
  ENTJ: 'Nhà Chỉ Huy',
  ENTP: 'Người Tranh Luận',
  INFJ: 'Người Biện Hộ',
  INFP: 'Người Hòa Giải',
  ENFJ: 'Người Chỉ Dẫn',
  ENFP: 'Người Vận Động',
  ISTJ: 'Nhà Logic',
  ISFJ: 'Người Bảo Vệ',
  ESTJ: 'Nhà Điều Hành',
  ESFJ: 'Người Lãnh Sự',
  ISTP: 'Nghệ Nhân',
  ISFP: 'Nhà Thám Hiểm',
  ESTP: 'Doanh Nhân',
  ESFP: 'Người Trình Diễn',
};