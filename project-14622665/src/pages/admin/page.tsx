import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  fetchAllPosts,
  fetchCategories,
  BlogPost,
  BlogCategory,
  slugify,
  formatDate,
} from '@/lib/blog';
import { optimizeAllBlogImages, summarizeOptimize } from '@/lib/blogImageOptimizer';
import AdminTabs from '@/pages/admin/components/AdminTabs';

type StatusFilter = 'all' | 'published' | 'draft' | 'scheduled';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [busy, setBusy] = useState(false);

  const [newCategory, setNewCategory] = useState('');
  const [catBusy, setCatBusy] = useState(false);

  const [optimizing, setOptimizing] = useState(false);
  const [optimizeProgress, setOptimizeProgress] = useState(0);
  const [optimizeTotal, setOptimizeTotal] = useState(0);
  const [optimizeNote, setOptimizeNote] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([fetchAllPosts(), fetchCategories()]);
      setPosts(p);
      setCategories(c);
    } catch (e) {
      console.error('Lỗi tải dữ liệu quản trị blog:', e);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = posts;
    if (statusFilter === 'published') result = result.filter((p) => p.status === 'published');
    if (statusFilter === 'draft') result = result.filter((p) => p.status === 'draft');
    if (statusFilter === 'scheduled')
      result = result.filter(
        (p) => p.status === 'published' && p.published_at && new Date(p.published_at) > new Date()
      );
    const q = search.trim().toLowerCase();
    if (q) result = result.filter((p) => p.title.toLowerCase().includes(q));
    return result;
  }, [posts, statusFilter, search]);

  const togglePublish = async (post: BlogPost) => {
    setBusy(true);
    try {
      if (post.status === 'published') {
        await supabase.from('blog_posts').update({ status: 'draft' }).eq('id', post.id);
      } else {
        await supabase
          .from('blog_posts')
          .update({ status: 'published', published_at: new Date().toISOString() })
          .eq('id', post.id);
      }
      await load();
    } catch {
      setError('Không thể cập nhật trạng thái.');
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await supabase.from('blog_post_tags').delete().eq('post_id', deleteTarget.id);
      await supabase.from('blog_posts').delete().eq('id', deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch {
      setError('Không thể xóa bài viết.');
    } finally {
      setBusy(false);
    }
  };

  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    setCatBusy(true);
    try {
      const slug = slugify(name);
      const { data: existing } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (!existing) {
        await supabase.from('blog_categories').insert({ name, slug });
        setNewCategory('');
        await load();
      } else {
        setError('Chuyên mục này đã tồn tại.');
      }
    } catch {
      setError('Không thể thêm chuyên mục.');
    } finally {
      setCatBusy(false);
    }
  };

  const deleteCategory = async (cat: BlogCategory) => {
    setCatBusy(true);
    try {
      await supabase.from('blog_categories').delete().eq('id', cat.id);
      await load();
    } catch {
      setError('Không thể xóa chuyên mục (có thể đang có bài viết sử dụng).');
    } finally {
      setCatBusy(false);
    }
  };

  const runOptimize = async () => {
    setOptimizing(true);
    setOptimizeNote(null);
    setOptimizeProgress(0);
    setOptimizeTotal(0);
    try {
      const result = await optimizeAllBlogImages((done, total) => {
        setOptimizeProgress(done);
        setOptimizeTotal(total);
      });
      setOptimizeNote(summarizeOptimize(result));
      await load();
    } catch (e) {
      console.error('Lỗi tối ưu ảnh bài viết:', e);
      setOptimizeNote('Không thể tối ưu ảnh. Vui lòng thử lại.');
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto relative z-10">
        <AdminTabs />
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="mystic-heading text-3xl md:text-4xl font-bold text-mystic-gold-400">
              Quản Trị Blog
            </h1>
            <p className="mystic-text text-sm opacity-70 mt-2">
              Tạo, chỉnh sửa và quản lý bài viết trên The Mystic Room.
            </p>
          </div>
          <Link to="/admin/editor" className="mystic-btn-gold whitespace-nowrap">
            <i className="ri-add-line" /> Bài Viết Mới
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-sm text-red-200 flex items-center gap-3 flex-wrap">
            <i className="ri-error-warning-line" />
            <span className="flex-1 min-w-[180px]">{error}</span>
            <button
              onClick={load}
              disabled={loading}
              className="mystic-btn-outline !px-3 !py-1.5 text-xs whitespace-nowrap disabled:opacity-50"
            >
              <i className="ri-refresh-line" /> Thử Lại
            </button>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-white cursor-pointer"
              title="Đóng"
            >
              <i className="ri-close-line" />
            </button>
          </div>
        )}

        {/* Categories manager */}
        <div className="mystic-card rounded-2xl p-6 mb-8">
          <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-4">Chuyên Mục</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-sm text-mystic-purple-100"
              >
                {cat.name}
                <button
                  onClick={() => deleteCategory(cat)}
                  disabled={catBusy}
                  className="text-mystic-purple-300 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
                  title="Xóa chuyên mục"
                >
                  <i className="ri-close-line" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              placeholder="Tên chuyên mục mới..."
              className="flex-1 px-4 py-2.5 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-sm text-mystic-purple-100 placeholder:text-mystic-purple-300/50 outline-none focus:border-mystic-purple-500/50 transition-colors"
            />
            <button
              onClick={addCategory}
              disabled={catBusy || !newCategory.trim()}
              className="mystic-btn-outline whitespace-nowrap disabled:opacity-50"
            >
              <i className="ri-add-line" /> Thêm Chuyên Mục
            </button>
          </div>
        </div>

        {/* Image optimizer */}
        <div className="mystic-card rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-1 flex items-center gap-2">
              <i className="ri-image-2-line" /> Tối Ưu Ảnh Bài Viết
            </h2>
            <p className="mystic-text text-sm opacity-70">
              Nén toàn bộ ảnh đang nhúng trong bài viết về kích thước hợp lý. Hình ảnh giữ
              nguyên như hiện tại nhưng nhẹ hơn nhiều, giúp trang Blog tải nhanh hơn.
            </p>
            {optimizeNote && (
              <p className="text-xs text-mystic-gold-300 mt-2 flex items-center gap-2">
                <i className="ri-checkbox-circle-line" />
                {optimizeNote}
              </p>
            )}
          </div>
          <button
            onClick={runOptimize}
            disabled={optimizing}
            className="mystic-btn-gold whitespace-nowrap disabled:opacity-50"
          >
            <i className={optimizing ? 'ri-loader-4-line animate-spin' : 'ri-magic-line'} />
            {optimizing
              ? optimizeTotal > 0
                ? `Đang xử lý ${optimizeProgress}/${optimizeTotal}`
                : 'Đang chuẩn bị...'
              : 'Tối Ưu Ảnh'}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-mystic-purple-300/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-sm text-mystic-purple-100 placeholder:text-mystic-purple-300/50 outline-none focus:border-mystic-purple-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(
              [
                ['all', 'Tất Cả'],
                ['published', 'Đã Xuất Bản'],
                ['draft', 'Bản Nháp'],
                ['scheduled', 'Đã Lên Lịch'],
              ] as [StatusFilter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-2 rounded-full text-sm border transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === value
                    ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                    : 'border-mystic-purple-700/30 bg-mystic-purple-900/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts list */}
        {loading ? (
          <div className="py-16 text-center">
            <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin inline-block" />
            <p className="mystic-text text-sm mt-4">Đang tải bài viết...</p>
          </div>
        ) : error && posts.length === 0 ? (
          <div className="mystic-card rounded-2xl p-12 text-center">
            <i className="ri-cloud-off-line text-3xl text-red-300/80 inline-block mb-4" />
            <p className="mystic-text text-sm opacity-70 mb-5">
              Không thể tải danh sách bài viết.
            </p>
            <button onClick={load} className="mystic-btn-outline mx-auto">
              <i className="ri-refresh-line" /> Thử Lại
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mystic-card rounded-2xl p-12 text-center">
            <p className="mystic-text text-sm opacity-60">Chưa có bài viết nào phù hợp.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((post) => {
              const scheduled =
                post.status === 'published' && post.published_at && new Date(post.published_at) > new Date();
              return (
                <div
                  key={post.id}
                  className="mystic-card rounded-xl p-4 flex items-center gap-4 flex-wrap"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-mystic-purple-900/40 border border-mystic-purple-700/30 flex items-center justify-center">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <i className="ri-image-line text-mystic-purple-300/60 text-xl" />
                    )}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="mystic-heading text-base font-bold text-mystic-gold-400 leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      {scheduled ? (
                        <span className="px-2 py-0.5 rounded-full bg-secondary-100/70 text-secondary-900 text-[11px] border border-secondary-300/40">
                          Đã lên lịch · {formatDate(post.published_at)}
                        </span>
                      ) : post.status === 'published' ? (
                        <span className="px-2 py-0.5 rounded-full bg-accent-100/80 text-accent-900 text-[11px] border border-accent-300/40">
                          Đã xuất bản
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-background-200/70 text-foreground-700 text-[11px] border border-background-300/50">
                          Bản nháp
                        </span>
                      )}
                      {post.category && (
                        <span className="text-[11px] text-mystic-purple-300/60">{post.category.name}</span>
                      )}
                      <span className="text-[11px] text-mystic-purple-300/60">
                        Cập nhật {formatDate(post.updated_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePublish(post)}
                      disabled={busy}
                      className="mystic-btn-outline !px-4 !py-2 text-xs whitespace-nowrap disabled:opacity-50"
                    >
                      <i className={post.status === 'published' ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      {post.status === 'published' ? 'Gỡ Xuất Bản' : 'Xuất Bản'}
                    </button>
                    <Link
                      to={`/admin/editor/${post.id}`}
                      className="mystic-btn-primary !px-4 !py-2 text-xs whitespace-nowrap"
                    >
                      <i className="ri-edit-line" /> Chỉnh Sửa
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-red-700/30 text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Xóa bài viết"
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="modal-backdrop fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="modal-pop mystic-card rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-700/30 flex items-center justify-center mb-4">
              <i className="ri-delete-bin-6-line text-xl text-red-300" />
            </div>
            <h3 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-2">Xóa Bài Viết?</h3>
            <p className="mystic-text text-sm opacity-70 mb-6">
              Bạn sắp xóa vĩnh viễn bài viết <strong className="text-white">"{deleteTarget.title}"</strong>. Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="mystic-btn-outline flex-1 justify-center">
                Hủy
              </button>
              <button onClick={confirmDelete} disabled={busy} className="mystic-btn-gold flex-1 justify-center !bg-red-600 disabled:opacity-50">
                <i className="ri-delete-bin-line" /> Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}