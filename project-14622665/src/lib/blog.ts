import { supabase } from '@/lib/supabase';
import { contentToHtml } from '@/lib/lexical';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  slug: string;
  bio?: string | null;
  avatar_url?: string | null;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export type BlogStatus = 'draft' | 'published';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  category_id?: number | null;
  author_id?: number | null;
  status: BlogStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  /** Số phút đọc, được tính sẵn trong CSDL (tránh phải tải nội dung nặng ở trang danh sách) */
  reading_minutes?: number | null;
  category?: BlogCategory | null;
  author?: BlogAuthor | null;
  tags?: BlogTag[];
}

/** Cột nhẹ cho danh sách bài viết — KHÔNG kèm `content` để tránh tải nặng.
 * Không phụ thuộc cột mới nên an toàn cho mọi màn hình liệt kê. */
const LIST_COLUMNS_BASE =
  'id,title,slug,excerpt,featured_image,category_id,author_id,status,seo_title,seo_description,published_at,created_at,updated_at';

/** Cột nhẹ kèm số phút đọc (đã tính sẵn trong CSDL). */
const LIST_COLUMNS = `${LIST_COLUMNS_BASE},reading_minutes`;

/** Chuyển tiếng Việt sang slug thân thiện URL */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapRelations(
  posts: BlogPost[],
  categories: BlogCategory[],
  authors: BlogAuthor[]
): BlogPost[] {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const authorMap = new Map(authors.map((a) => [a.id, a]));
  return posts.map((p) => ({
    ...p,
    category: p.category_id ? catMap.get(p.category_id) ?? null : null,
    author: p.author_id ? authorMap.get(p.author_id) ?? null : null,
  }));
}

export async function fetchCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as BlogCategory[];
}

export async function fetchAuthors(): Promise<BlogAuthor[]> {
  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as BlogAuthor[];
}

export async function fetchTags(): Promise<BlogTag[]> {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as BlogTag[];
}

/** Lấy toàn bộ bài đã xuất bản (công khai), kèm category + author */
export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const [postsRes, cats, authors] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false }),
    fetchCategories(),
    fetchAuthors(),
  ]);
  if (postsRes.error) throw postsRes.error;
  const posts = (postsRes.data ?? []) as BlogPost[];
  return mapRelations(posts, cats, authors);
}

/**
 * Lấy danh sách bài đã xuất bản dạng RÚT GỌN (không có nội dung).
 * Dùng cho trang blog, bài liên quan và điều hướng trước/sau — nhanh hơn rất nhiều
 * vì không tải trường `content` (có thể nặng hàng trăm KB mỗi bài).
 */
export async function fetchPublishedPostSummaries(): Promise<BlogPost[]> {
  const [postsRes, cats, authors] = await Promise.all([
    supabase
      .from('blog_posts')
      .select(LIST_COLUMNS)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false }),
    fetchCategories(),
    fetchAuthors(),
  ]);
  if (postsRes.error) throw postsRes.error;
  const posts = (postsRes.data ?? []) as unknown as BlogPost[];
  return mapRelations(posts, cats, authors);
}

/** Lấy toàn bộ bài (kể cả draft) — dành cho admin đã đăng nhập.
 * Dùng danh sách cột RÚT GỌN (không kèm `content`) để bảng quản trị tải nhanh và nhẹ,
 * tránh kéo về hàng MB nội dung (ảnh base64) chỉ để hiển thị tiêu đề, ảnh, ngày. */
export async function fetchAllPosts(): Promise<BlogPost[]> {
  const [postsRes, cats, authors] = await Promise.all([
    supabase
      .from('blog_posts')
      .select(LIST_COLUMNS_BASE)
      .order('updated_at', { ascending: false }),
    fetchCategories(),
    fetchAuthors(),
  ]);
  if (postsRes.error) throw postsRes.error;
  const posts = (postsRes.data ?? []) as unknown as BlogPost[];
  return mapRelations(posts, cats, authors);
}

/** Lấy bài theo slug (chỉ bài đã xuất bản cho public) */
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const post = data as BlogPost;
  const [cats, authors, tags] = await Promise.all([
    fetchCategories(),
    fetchAuthors(),
    fetchPostTags(post.id),
  ]);
  const [mapped] = mapRelations([post], cats, authors);
  mapped.tags = tags;
  return mapped;
}

/** Lấy bài theo id (dành cho admin, kể cả draft) */
export async function fetchPostById(id: number): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const post = data as BlogPost;
  const [cats, authors, tags] = await Promise.all([
    fetchCategories(),
    fetchAuthors(),
    fetchPostTags(post.id),
  ]);
  const [mapped] = mapRelations([post], cats, authors);
  mapped.tags = tags;
  return mapped;
}

export async function fetchPostTags(postId: number): Promise<BlogTag[]> {
  const { data, error } = await supabase
    .from('blog_post_tags')
    .select('tag_id')
    .eq('post_id', postId);
  if (error) throw error;
  const tagIds = (data ?? []).map((r) => r.tag_id as number);
  if (tagIds.length === 0) return [];
  const { data: tags, error: tagErr } = await supabase
    .from('blog_tags')
    .select('*')
    .in('id', tagIds);
  if (tagErr) throw tagErr;
  return (tags ?? []) as BlogTag[];
}

/** Bài liên quan cùng chuyên mục (dạng rút gọn, không kèm nội dung) */
export async function fetchRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  if (!post.category_id) return [];
  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_COLUMNS)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .eq('category_id', post.category_id)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  const cats = await fetchCategories();
  const authors = await fetchAuthors();
  return mapRelations((data ?? []) as unknown as BlogPost[], cats, authors);
}

/** Đảm bảo tag tồn tại (tạo mới nếu chưa có), trả về id */
export async function ensureTag(name: string): Promise<number> {
  const trimmed = name.trim();
  if (!trimmed) return 0;
  const slug = slugify(trimmed);
  const { data: existing } = await supabase
    .from('blog_tags')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (existing) return existing.id as number;
  const { data: created, error } = await supabase
    .from('blog_tags')
    .insert({ name: trimmed, slug })
    .select('id')
    .single();
  if (error) throw error;
  return created.id as number;
}

/** Gỡ toàn bộ tag của bài rồi gắn lại danh sách mới */
export async function syncPostTags(postId: number, tagNames: string[]): Promise<void> {
  await supabase.from('blog_post_tags').delete().eq('post_id', postId);
  for (const name of tagNames) {
    const tagId = await ensureTag(name);
    if (tagId) {
      await supabase.from('blog_post_tags').insert({ post_id: postId, tag_id: tagId });
    }
  }
}

/** Định dạng ngày xuất bản thành dd/mm/yyyy */
export function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Ước lượng thời gian đọc dựa trên nội dung HTML (dùng cho trang chi tiết có tải nội dung) */
export function estimateReadTime(content?: string | null): string {
  if (!content) return '3 phút đọc';
  const text = contentToHtml(content).replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} phút đọc`;
}

/** Nhãn thời gian đọc cho danh sách (dùng số phút đã tính sẵn trong CSDL). */
export function readTimeLabel(post: Pick<BlogPost, 'reading_minutes'>): string {
  const mins = post.reading_minutes && post.reading_minutes > 0 ? post.reading_minutes : 3;
  return `${mins} phút đọc`;
}