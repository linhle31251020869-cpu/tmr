import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostBySlug, fetchPublishedPostSummaries, BlogPost, BlogTag, formatDate, estimateReadTime } from '@/lib/blog';
import { contentToHtml } from '@/lib/lexical';
import { applySeo, ORG_NAME } from '@/lib/seo';
import { injectJsonLd, buildBlogPostingJsonLd } from '@/lib/jsonLd';
import '@/styles/article.css';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [prev, setPrev] = useState<BlogPost | null>(null);
  const [next, setNext] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      // Chỉ tải đúng bài viết hiện tại (kèm nội dung) thay vì tải toàn bộ bài viết.
      const current = await fetchPostBySlug(slug);
      if (!current) {
        setNotFound(true);
        return;
      }

      setPost(current);
      setTags(current.tags || []);

      // Danh sách rút gọn (không kèm nội dung) dùng cho điều hướng trước/sau và bài liên quan.
      const summaries = await fetchPublishedPostSummaries();
      const idx = summaries.findIndex((p) => p.id === current.id);
      setPrev(idx >= 0 && idx < summaries.length - 1 ? summaries[idx + 1] : null);
      setNext(idx > 0 ? summaries[idx - 1] : null);
      setRelated(
        summaries
          .filter((p) => p.id !== current.id && p.category_id && p.category_id === current.category_id)
          .slice(0, 3)
      );

      // SEO
      const title = current.seo_title || current.title;
      const desc = current.seo_description || current.excerpt || '';
      applySeo({
        title,
        description: desc,
        path: `/blog/${current.slug}`,
        ogType: 'article',
        image: current.featured_image || undefined,
      });
      injectJsonLd(
        buildBlogPostingJsonLd({
          title,
          description: desc,
          image: current.featured_image || undefined,
          slug: current.slug,
          datePublished: current.published_at || current.created_at,
          authorName: current.author?.name || ORG_NAME,
        })
      );
    } catch (e) {
      setError('Không thể tải bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-32 px-6 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
          <p className="mystic-text text-sm mt-4">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-32 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="mystic-text text-sm opacity-70 mb-4">{error}</p>
          <button onClick={load} className="mystic-btn-outline">
            <i className="ri-refresh-line" /> Thử Lại
          </button>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-32 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-mystic-purple-900/40 border border-mystic-purple-600/30 flex items-center justify-center mb-5">
            <i className="ri-emotion-sad-line text-3xl text-mystic-gold-400" />
          </div>
          <h1 className="mystic-heading text-2xl font-bold text-mystic-gold-400 mb-3">Bài Viết Không Tồn Tại</h1>
          <p className="mystic-text text-sm opacity-70 mb-6">Bài viết bạn tìm có thể đã bị gỡ hoặc chưa được xuất bản.</p>
          <Link to="/blog" className="mystic-btn-primary">
            <i className="ri-arrow-left-line" /> Về Trang Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mystic-gradient pt-24">
      <article className="px-6 md:px-12 lg:px-20 py-8 md:py-12">
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-mystic-purple-300/60 mb-6 flex-wrap">
            <Link to="/blog" className="hover:text-mystic-gold-400 transition-colors">Blog</Link>
            <i className="ri-arrow-right-s-line" />
            {post.category && (
              <span className="text-mystic-purple-200">{post.category.name}</span>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            {post.category && (
              <span className="inline-block px-3 py-1 rounded-full bg-mystic-gold-900/20 border border-mystic-gold-700/30 text-xs text-mystic-gold-400 mb-4">
                {post.category.name}
              </span>
            )}
            <h1 className="mystic-heading text-3xl md:text-4xl font-bold text-mystic-gold-400 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-mystic-purple-300/70">
              {post.author && (
                <span className="inline-flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-mystic-purple-600 to-mystic-purple-800 border border-mystic-purple-500/30 flex items-center justify-center">
                    <i className="ri-user-3-line text-xs text-white" />
                  </span>
                  {post.author.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <i className="ri-calendar-line" /> {formatDate(post.published_at)}
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="ri-time-line" /> {estimateReadTime(post.content)}
              </span>
            </div>
          </div>

          {/* Featured image */}
          {post.featured_image && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-mystic-purple-700/30">
              <img
                src={post.featured_image}
                alt={post.title}
                fetchPriority="high"
                decoding="async"
                className="w-full object-cover max-h-[280px] sm:max-h-[380px] md:max-h-[520px]"
              />
            </div>
          )}

          {/* Content — đặt trên khung "trang giấy" để chữ không bị chìm */}
          {post.content ? (
            <div className="article-surface">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: contentToHtml(post.content) }}
              />
            </div>
          ) : (
            <p className="mystic-text text-sm opacity-60">Bài viết này chưa có nội dung chi tiết.</p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-xs text-mystic-purple-200"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Prev / Next */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            {prev ? (
              <Link to={`/blog/${prev.slug}`} className="mystic-card rounded-xl p-5 group block">
                <span className="text-xs text-mystic-purple-300/60 flex items-center gap-1 mb-2">
                  <i className="ri-arrow-left-line" /> Bài trước
                </span>
                <span className="mystic-heading text-sm font-bold text-mystic-gold-400 group-hover:text-white transition-colors line-clamp-2">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link to={`/blog/${next.slug}`} className="mystic-card rounded-xl p-5 group block sm:text-right">
                <span className="text-xs text-mystic-purple-300/60 flex items-center gap-1 mb-2 sm:justify-end">
                  Bài tiếp theo <i className="ri-arrow-right-line" />
                </span>
                <span className="mystic-heading text-sm font-bold text-mystic-gold-400 group-hover:text-white transition-colors line-clamp-2">
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 py-8 md:py-12">
          <div className="max-w-6xl mx-auto relative z-10">
            <h4 className="mystic-heading text-lg md:text-xl font-bold text-mystic-gold-400 mb-6">
              Bài Viết Liên Quan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="mystic-card rounded-2xl overflow-hidden group block">
                  <div className="relative h-40 overflow-hidden">
                    {r.featured_image && (
                      <img src={r.featured_image} alt={r.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] text-mystic-purple-300/60">{formatDate(r.published_at)}</span>
                    <h3 className="mystic-heading text-sm font-bold text-mystic-gold-400 mt-1 leading-snug group-hover:text-white transition-colors">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}