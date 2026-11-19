import { isRouteIndexable } from '@/lib/routeManifest';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  ogType?: 'website' | 'article';
  image?: string;
  noindex?: boolean;
}

export const ORG_NAME = 'The Mystic Room';

export const SITE_ORIGIN: string = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '');

export const ORG_IMAGE =
  'https://readdy.ai/api/search-image?query=Enchanted%20mystical%20interior%20hall%20with%20tall%20arched%20windows%20revealing%20a%20giant%20glowing%20full%20moon%20above%20misty%20mountains%2C%20lit%20candles%20and%20golden%20lanterns%2C%20violet%20velvet%20drapes%2C%20glowing%20amethyst%20crystal%20clusters%2C%20antique%20wooden%20table%20with%20magical%20artifacts%2C%20warm%20golden%20candlelight%20blending%20with%20violet%20cosmic%20glow%2C%20ornate%20fantasy%20digital%20painting%2C%20rich%20detail%2C%20cinematic%2C%20deep%20violet%20and%20gold%20palette%2C%20no%20text%2C%20darker%20calm%20center%20for%20text%20overlay&width=1600&height=900&seq=home-mystic-room-hall&orientation=landscape&nocache=true';

/** Favicon chính thức do người dùng cung cấp — dùng được cho cả link icon lẫn JSON-LD logo. */
export const FAVICON_URL =
  'https://static.readdy.ai/image/3e731e6b483a5d82fbc59de99c6f86f1/12ec933280f71d454ab9cc170083c4f2.png';

const ROUTE_SEO: Record<string, SeoData> = {
  '/': {
    title: 'The Mystic Room - MBTI, Bản Đồ Sao & Thần Số Học',
    description:
      'Khám phá bản thân và giải mã bí ẩn nội tâm cùng The Mystic Room. Hệ thống AI kết hợp Bản đồ sao, Thần số học và trắc nghiệm tính cách tạo nên hồ sơ phân tích cá nhân hóa dành riêng cho bạn từ đó tạo ra sản phẩm cá nhân hóa.',
    keywords:
      'khám phá bản thân, MBTI, thần số học, bản đồ sao, huyền học, tarot, vòng tay cá nhân hóa',
    path: '/',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/explore/mystic-mirror': {
    title: 'Mystic Mirror - Khám Phá Tính Cách | The Mystic Room',
    description:
      'Trắc nghiệm tính cách MBTI giúp bạn vén màn bí mật về con người thật, giải mã cảm xúc và chạm vào tần số năng lượng quyền năng của riêng bạn.',
    keywords: 'trắc nghiệm tính cách, MBTI, khám phá bản thân, giải mã cảm xúc',
    path: '/explore/mystic-mirror',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/explore/tarot-table': {
    title: 'Tarot Table - Hành Trình Phản Tư | The Mystic Room',
    description:
      'Lắng nghe thông điệp từ những lá bài Tarot dưới lăng kính độc bản của bạn để soi tỏ thêm các góc nhìn mới cho mỗi câu hỏi bạn mang theo.',
    keywords: 'tarot, bói bài, phản tư nội tâm, khám phá bản thân',
    path: '/explore/tarot-table',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/explore/moon-window': {
    title: 'Moon Window - Khám Phá Bản Đồ Sao | The Mystic Room',
    description:
      'Mở khóa bản đồ sao cá nhân để lắng nghe lời thì thầm từ vũ trụ, soi tỏ con đường dẫn lối tâm hồn và hiểu ba lớp năng lượng cốt lõi của bạn.',
    keywords: 'bản đồ sao, chiêm tinh, birth chart, cung hoàng đạo, khám phá bản thân',
    path: '/explore/moon-window',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/explore/numerology': {
    title: 'Numerology - Khám Phá Thần Số Học | The Mystic Room',
    description:
      'Giải mã thần số học từ ngày sinh và tên của bạn: Số Đường Đời, Sứ Mệnh, Linh Hồn và Nhân Cách để thấu tỏ con đường của riêng bạn.',
    keywords: 'thần số học, numerology, số đường đời, con số chủ đạo, khám phá bản thân',
    path: '/explore/numerology',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/mystic-card': {
    title: 'Mystic Card - Thẻ Cá Nhân Hóa | The Mystic Room',
    description:
      'Tạo Mystic Card cá nhân hóa từ Mystic Profile của bạn — một bức chân dung nghệ thuật phản chiếu đúng con người bạn.',
    keywords: 'mystic card, thẻ cá nhân hóa, khám phá bản thân',
    path: '/mystic-card',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/customize-aura': {
    title: 'Tùy Chỉnh Aura - Trang Sức Năng Lượng | The Mystic Room',
    description:
      'Tùy chỉnh trang sức năng lượng theo Mystic Profile của bạn — vòng tay, dây chuyền và nhẫn đá phong thủy mang dấu ấn riêng.',
    keywords: 'trang sức năng lượng, vòng tay đá phong thủy, customize aura, đá năng lượng',
    path: '/customize-aura',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/thiet-ke-vong': {
    title: 'Thiết Kế Vòng Tay Năng Lượng | The Mystic Room',
    description:
      'Thiết kế vòng tay đá phong thủy chế tác riêng từ những mảnh ghép thuộc về bạn — một điểm tựa nhỏ trên cổ tay.',
    keywords: 'vòng tay đá phong thủy, thiết kế vòng, trang sức năng lượng, đá phong thủy',
    path: '/thiet-ke-vong',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/blog': {
    title: 'Blog - Kiến Thức Khám Phá Bản Thân | The Mystic Room',
    description:
      'Khám phá những bài viết về thần số học, chiêm tinh, Tarot, MBTI và nghệ thuật tự nhận thức để soi sáng hành trình nội tâm.',
    keywords: 'blog thần số học, chiêm tinh, tarot, MBTI, khám phá bản thân',
    path: '/blog',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/chinh-sach-bao-mat': {
    title: 'Chính Sách Bảo Mật | The Mystic Room',
    description:
      'Chính sách bảo mật của The Mystic Room: cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn trong hành trình khám phá bản thân.',
    keywords: 'chính sách bảo mật, quyền riêng tư, dữ liệu cá nhân, the mystic room',
    path: '/chinh-sach-bao-mat',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/dieu-khoan-dich-vu': {
    title: 'Điều Khoản Dịch Vụ | The Mystic Room',
    description:
      'Điều khoản dịch vụ của The Mystic Room: phạm vi dịch vụ, tài khoản, thanh toán, quyền sở hữu trí tuệ và trách nhiệm của người dùng khi sử dụng nền tảng.',
    keywords: 'điều khoản dịch vụ, điều khoản sử dụng, the mystic room',
    path: '/dieu-khoan-dich-vu',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/chinh-sach-hoan-tien': {
    title: 'Chính Sách Hoàn Tiền | The Mystic Room',
    description:
      'Chính sách hoàn tiền của The Mystic Room cho nội dung kỹ thuật số trả phí và sản phẩm cá nhân hóa: điều kiện, quy trình xử lý và phương thức hoàn tiền.',
    keywords: 'chính sách hoàn tiền, hoàn tiền, đổi trả, the mystic room',
    path: '/chinh-sach-hoan-tien',
    ogType: 'website',
    image: ORG_IMAGE,
  },
  '/about': {
    title: 'Về The Mystic Room - Hành Trình Khám Phá Bản Thân',
    description:
      'The Mystic Room là nơi kết hợp Tarot, MBTI, Birth Chart, Numerology và AI để tạo nên một căn phòng hiện đại giúp bạn lắng nghe chính mình.',
    keywords: 'về chúng tôi, the mystic room, khám phá bản thân, huyền học',
    path: '/about',
    ogType: 'website',
    image: ORG_IMAGE,
  },
};

const PRIVATE_PATTERNS: RegExp[] = [
  /^\/auth/,
  /^\/admin/,
  /^\/thanh-toan/,
  /^\/my-profile/,
];

function normalizePath(pathname: string): string {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

export function resolveRouteSeo(pathname: string): SeoData {
  const path = normalizePath(pathname);
  const base = resolveBaseSeo(path);
  // Route không được phép index (yêu cầu đăng nhập, admin, xác thực...) luôn bị đặt noindex,
  // bất kể trước đó có dữ liệu SEO hay không.
  if (!isRouteIndexable(path)) {
    return { ...base, noindex: true, image: undefined };
  }
  return base;
}

function resolveBaseSeo(path: string): SeoData {
  if (ROUTE_SEO[path]) {
    return ROUTE_SEO[path];
  }

  if (/^\/blog\/.+/.test(path)) {
    return {
      title: 'Bài Viết - The Mystic Room',
      description:
        'Bài viết khám phá bản thân về thần số học, chiêm tinh, Tarot và MBTI.',
      path,
      ogType: 'article',
    };
  }

  if (PRIVATE_PATTERNS.some((p) => p.test(path))) {
    return {
      title: 'The Mystic Room',
      description: '',
      path,
      noindex: true,
    };
  }

  return {
    title: 'Không Tìm Thấy Trang - The Mystic Room',
    description: '',
    path,
    noindex: true,
  };
}

function upsertMeta(attr: 'name' | 'property', key: string, content?: string): void {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    if (!content) return;
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (content) {
    el.setAttribute('content', content);
  } else {
    el.remove();
  }
}

function upsertLink(rel: string, href?: string): void {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    if (!href) return;
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  if (href) {
    el.setAttribute('href', href);
  } else {
    el.remove();
  }
}

export function applySeo(seo: SeoData): void {
  document.title = seo.title;
  const canonical = SITE_ORIGIN ? `${SITE_ORIGIN}${seo.path}` : seo.path;

  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'keywords', seo.keywords);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:type', seo.ogType || 'website');
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:site_name', ORG_NAME);
  upsertMeta('property', 'og:image', seo.image);
  upsertMeta('name', 'twitter:card', seo.image ? 'summary_large_image' : 'summary');
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertMeta('name', 'twitter:image', seo.image);
  upsertMeta('name', 'robots', seo.noindex ? 'noindex, nofollow' : 'index, follow');

  upsertLink('canonical', canonical);
}