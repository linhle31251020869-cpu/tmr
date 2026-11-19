import { supabase } from '@/lib/supabase';
import { recompressDataUrl } from '@/lib/imageCompress';

export interface OptimizeResult {
  posts: number;
  images: number;
  beforeBytes: number;
  afterBytes: number;
}

/** Bắt mọi ảnh nhúng dạng base64 (data URL) trong nội dung bài viết. */
const DATA_URL_RE = /data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+/g;

const toKb = (bytes: number) => Math.round(bytes / 1024);

/**
 * Quét toàn bộ bài viết, mã hoá lại mọi ảnh base64 (trong nội dung và ảnh đại diện)
 * sang bản nhẹ hơn nhưng giữ nguyên định dạng gốc — hình ảnh nhìn như cũ,
 * dung lượng giảm đáng kể giúp trang Blog tải nhanh hơn.
 */
export async function optimizeAllBlogImages(
  onProgress?: (done: number, total: number) => void
): Promise<OptimizeResult> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, content, featured_image');
  if (error) throw error;

  const posts = (data || []) as Array<{
    id: number;
    content: string | null;
    featured_image: string | null;
  }>;

  let images = 0;
  let beforeBytes = 0;
  let afterBytes = 0;

  for (let i = 0; i < posts.length; i += 1) {
    const post = posts[i];
    const originalContent = post.content || '';
    const originalFeatured = post.featured_image || '';
    let content = originalContent;
    let featured = originalFeatured;

    const matches = originalContent.match(DATA_URL_RE);
    if (matches) {
      for (const url of matches) {
        // eslint-disable-next-line no-await-in-loop
        const next = await recompressDataUrl(url, 1000, 0.7);
        if (next !== url) {
          content = content.split(url).join(next);
          beforeBytes += url.length;
          afterBytes += next.length;
          images += 1;
        }
      }
    }

    if (originalFeatured.startsWith('data:image')) {
      // eslint-disable-next-line no-await-in-loop
      const nextFeatured = await recompressDataUrl(originalFeatured, 1100, 0.72);
      if (nextFeatured !== originalFeatured) {
        beforeBytes += originalFeatured.length;
        afterBytes += nextFeatured.length;
        images += 1;
        featured = nextFeatured;
      }
    }

    const payload: Record<string, unknown> = {};
    if (content !== originalContent) payload.content = content;
    if (featured !== originalFeatured) payload.featured_image = featured;

    if (Object.keys(payload).length > 0) {
      // eslint-disable-next-line no-await-in-loop
      await supabase.from('blog_posts').update(payload).eq('id', post.id);
    }

    onProgress?.(i + 1, posts.length);
  }

  return { posts: posts.length, images, beforeBytes, afterBytes };
}

export function summarizeOptimize(result: OptimizeResult): string {
  if (result.images === 0) {
    return 'Toàn bộ ảnh bài viết đã ở mức tối ưu, không cần xử lý thêm.';
  }
  const saved = Math.max(0, result.beforeBytes - result.afterBytes);
  return `Đã tối ưu ${result.images} ảnh trong ${result.posts} bài viết, tiết kiệm khoảng ${toKb(
    saved
  )} KB.`;
}