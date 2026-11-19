import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublishedPostSummaries, fetchCategories, BlogPost, BlogCategory } from '@/lib/blog';
import { formatDate, readTimeLabel } from '@/lib/blog';
import PageHero from '@/components/feature/PageHero';

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tất Cả');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([fetchPublishedPostSummaries(), fetchCategories()]);
      setPosts(p);
      setCategories(c);
    } catch (e) {
      setError('Không thể tải bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory !== 'Tất Cả') {
      result = result.filter((p) => p.category?.name === activeCategory);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeCategory, search]);

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);
  const visibleRest = rest.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      {/* Header */}
      <PageHero
        image="https://readdy.ai/api/search-image?query=Mystical%20open%20ancient%20book%20with%20glowing%20golden%20pages%20and%20drifting%20stardust%2C%20quill%20and%20ink%2C%20lit%20candles%20and%20violet%20crystals%20nearby%2C%20secret%20knowledge%20atmosphere%2C%20fantasy%20digital%20painting%2C%20deep%20purple%20and%20gold%20palette%2C%20no%20text%2C%20calm%20center%20for%20text%20overlay&width=1600&height=600&seq=blog-hero-grimoire&orientation=landscape"
        imageAlt="Cuốn sách huyền bí của The Mystic Room"
        icons={['ri-book-2-line', 'ri-quill-pen-line', 'ri-sparkling-line', 'ri-moon-clear-line', 'ri-magic-line', 'ri-star-line']}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mystic-heading text-4xl md:text-6xl font-bold mb-4 text-glow-gold">
            Blog
          </h1>
          <p className="mystic-subheading text-base md:text-lg italic mb-4">
            Những câu chuyện và kiến thức về hành trình khám phá bản thân
          </p>
          <p className="mystic-text text-sm max-w-2xl mx-auto opacity-80">
            Khám phá những bài viết về thần số học, chiêm tinh, Tarot, MBTI và nghệ thuật tự nhận thức.
            Kiến thức giúp bạn soi sáng hành trình nội tâm của riêng mình.
          </p>
          <div className="mystic-divider mt-8 max-w-md mx-auto" />
        </div>
      </PageHero>

      {/* Search + Categories */}
      <section className="relative pt-8 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-mystic-purple-300/60" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-sm text-mystic-purple-100 placeholder:text-mystic-purple-300/50 outline-none focus:border-mystic-purple-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory('Tất Cả')}
              className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'Tất Cả'
                  ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                  : 'border-mystic-purple-700/30 bg-mystic-purple-900/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
              }`}
            >
              Tất Cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.name
                    ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                    : 'border-mystic-purple-700/30 bg-mystic-purple-900/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-20 text-center">
          <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
          <p className="mystic-text text-sm mt-4">Đang tải bài viết...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="mystic-text text-sm opacity-70 mb-4">{error}</p>
          <button onClick={load} className="mystic-btn-outline">
            <i className="ri-refresh-line" /> Thử Lại
          </button>
        </div>
      ) : (
        <>
          {/* Featured Post */}
          {featured && (
            <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
              <div className="max-w-6xl mx-auto relative z-10">
                <Link to={`/blog/${featured.slug}`} className="mystic-card rounded-2xl overflow-hidden group block">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative h-56 sm:h-64 md:h-auto overflow-hidden">
                      {featured.featured_image && (
                        <img
                          src={featured.featured_image}
                          alt={featured.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0618]/80 hidden md:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] to-transparent md:hidden" />
                    </div>
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {featured.category && (
                          <span className="px-3 py-1 rounded-full bg-mystic-gold-900/20 border border-mystic-gold-700/30 text-xs text-mystic-gold-400">
                            {featured.category.name}
                          </span>
                        )}
                        <span className="text-xs text-mystic-purple-300/60">{formatDate(featured.published_at)}</span>
                        <span className="text-xs text-mystic-purple-300/60">{readTimeLabel(featured)}</span>
                      </div>
                      <h2 className="mystic-heading text-xl md:text-2xl font-bold text-mystic-gold-400 mb-3">
                        {featured.title}
                      </h2>
                      <p className="mystic-text text-sm opacity-70 mb-6">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="mystic-btn-primary text-sm">
                          <i className="ri-arrow-right-line" /> Đọc Tiếp
                        </span>
                        {featured.author && (
                          <span className="text-xs text-mystic-purple-300/60">
                            Bởi {featured.author.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* Posts Grid */}
          <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
            <div className="max-w-6xl mx-auto relative z-10">
              {visibleRest.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleRest.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="mystic-card rounded-2xl overflow-hidden group flex flex-col"
                      >
                        <div className="relative h-40 sm:h-44 overflow-hidden">
                          {post.featured_image && (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] via-transparent to-transparent" />
                          {post.category && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 rounded-full bg-mystic-purple-900/70 backdrop-blur-sm border border-mystic-purple-700/30 text-[10px] text-mystic-gold-400">
                                {post.category.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="text-[11px] text-mystic-purple-300/60">{formatDate(post.published_at)}</span>
                            <span className="text-[11px] text-mystic-purple-300/60">{readTimeLabel(post)}</span>
                          </div>
                          <h3 className="mystic-heading text-base font-bold text-mystic-gold-400 mb-2 leading-snug">
                            {post.title}
                          </h3>
                          <p className="mystic-text text-xs opacity-60 leading-relaxed flex-1">
                            {post.excerpt}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            {post.author && (
                              <span className="text-[11px] text-mystic-purple-300/60">
                                {post.author.name}
                              </span>
                            )}
                            <span className="text-xs text-mystic-purple-200 group-hover:text-mystic-gold-400 transition-colors inline-flex items-center gap-1">
                              Đọc Tiếp <i className="ri-arrow-right-line" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {rest.length > visibleCount && (
                    <div className="text-center mt-10">
                      <button
                        onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
                        className="mystic-btn-outline"
                      >
                        <i className="ri-arrow-down-line" /> Xem Thêm Bài Viết
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="mystic-text text-sm opacity-60">Chưa có bài viết nào trong chủ đề này.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}