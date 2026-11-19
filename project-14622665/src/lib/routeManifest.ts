/**
 * Authoritative route manifest.
 *
 * Đây là nguồn dữ liệu chuẩn (source of truth) mô tả trạng thái của từng route:
 * công khai hay yêu cầu đăng nhập, có được index hay không, và có nằm trong sitemap không.
 * Quy tắc này KHÔNG suy đoán từ tên đường dẫn hay tiêu đề trang mà phải khớp với
 * cổng bảo vệ thực tế trong `src/router/config.tsx` (RequireAuth / AdminGuard).
 */
export interface RouteMeta {
  /** Đường dẫn tĩnh, hoặc dạng mẫu có tham số (vd: '/blog/:slug'). */
  path: string;
  /** Truy cập được mà không cần đăng nhập. */
  public: boolean;
  /** Bắt buộc đăng nhập (RequireAuth / AdminGuard). */
  authRequired: boolean;
  /** Được phép xuất hiện trên công cụ tìm kiếm. */
  indexable: boolean;
  /** Được đưa vào sitemap.xml. */
  sitemapInclude: boolean;
}

export const ROUTE_MANIFEST: RouteMeta[] = [
  // ---- Trang công khai, được index, có trong sitemap ----
  { path: '/', public: true, authRequired: false, indexable: true, sitemapInclude: true },
  { path: '/about', public: true, authRequired: false, indexable: true, sitemapInclude: true },
  { path: '/blog', public: true, authRequired: false, indexable: true, sitemapInclude: true },
  { path: '/blog/:slug', public: true, authRequired: false, indexable: true, sitemapInclude: true },
  { path: '/mystic-card', public: true, authRequired: false, indexable: true, sitemapInclude: true },
  { path: '/customize-aura', public: true, authRequired: false, indexable: true, sitemapInclude: true },
  { path: '/chinh-sach-bao-mat', public: true, authRequired: false, indexable: true, sitemapInclude: true },
  { path: '/dieu-khoan-dich-vu', public: true, authRequired: false, indexable: true, sitemapInclude: true },
  { path: '/chinh-sach-hoan-tien', public: true, authRequired: false, indexable: true, sitemapInclude: true },

  // ---- Trang yêu cầu đăng nhập: KHÔNG index, KHÔNG vào sitemap ----
  { path: '/explore/mystic-mirror', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/explore/tarot-table', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/explore/moon-window', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/explore/numerology', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/my-profile', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/thiet-ke-vong', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/thanh-toan', public: false, authRequired: true, indexable: false, sitemapInclude: false },

  // ---- Trang hệ thống / xác thực: KHÔNG index ----
  { path: '/auth', public: true, authRequired: false, indexable: false, sitemapInclude: false },
  { path: '/admin', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/admin/editor', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/admin/editor/:id', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/admin/users', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/admin/users/:id', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/admin/vouchers', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/admin/orders', public: false, authRequired: true, indexable: false, sitemapInclude: false },
  { path: '/admin/email', public: false, authRequired: true, indexable: false, sitemapInclude: false },
];

const ROUTE_MAP: Record<string, RouteMeta> = ROUTE_MANIFEST.reduce(
  (acc, meta) => {
    acc[meta.path] = meta;
    return acc;
  },
  {} as Record<string, RouteMeta>
);

/** Tìm metadata chính xác, có hỗ trợ route động dạng /blog/<slug>. */
export function findRouteMeta(path: string): RouteMeta | undefined {
  if (ROUTE_MAP[path]) return ROUTE_MAP[path];
  if (/^\/blog\/[^/]+$/.test(path)) return ROUTE_MAP['/blog/:slug'];
  return undefined;
}

/** Route không có trong manifest được coi là KHÔNG index (an toàn mặc định). */
export function isRouteIndexable(path: string): boolean {
  const meta = findRouteMeta(path);
  return meta ? meta.indexable : false;
}

/** Route không có trong manifest được coi là yêu cầu đăng nhập (an toàn mặc định). */
export function isRouteAuthRequired(path: string): boolean {
  const meta = findRouteMeta(path);
  return meta ? meta.authRequired : true;
}