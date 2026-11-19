import { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  fetchPostById,
  fetchCategories,
  fetchAuthors,
  BlogCategory,
  BlogAuthor,
  slugify,
  syncPostTags,
} from '@/lib/blog';
import { compressImage } from '@/lib/imageCompress';
import { contentToHtml } from '@/lib/lexical';
import RichTextEditor from '../components/RichTextEditor';

type PublishMode = 'draft' | 'now' | 'schedule';

const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  category_id: undefined as number | undefined,
  author_id: undefined as number | undefined,
  seo_title: '',
  seo_description: '',
};

export default function AdminEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ ...EMPTY_POST });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [publishMode, setPublishMode] = useState<PublishMode>('draft');
  const [scheduleAt, setScheduleAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  // Giữ ngày xuất bản gốc để việc chỉnh sửa không làm thay đổi ngày đăng bài.
  const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);
  const [wasPublished, setWasPublished] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cats, auths] = await Promise.all([fetchCategories(), fetchAuthors()]);
        setCategories(cats);
        setAuthors(auths);

        if (id) {
          const post = await fetchPostById(Number(id));
          if (post) {
            setForm({
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt || '',
              content: contentToHtml(post.content),
              featured_image: post.featured_image || '',
              category_id: post.category_id ?? undefined,
              author_id: post.author_id ?? undefined,
              seo_title: post.seo_title || '',
              seo_description: post.seo_description || '',
            });
            setTags((post.tags || []).map((t) => t.name));
            setPublishMode(post.status === 'published' ? 'now' : 'draft');
            setOriginalPublishedAt(post.published_at ?? null);
            setWasPublished(post.status === 'published');
            setSlugTouched(true);
          }
        } else {
          setForm((f) => ({ ...f, author_id: auths[0]?.id }));
        }
      } catch {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const onTitleChange = (value: string) => {
    set({ title: value });
    if (!slugTouched) {
      set({ slug: slugify(value) });
    }
  };

  const onFeaturedImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageBusy(true);
    try {
      const dataUrl = await compressImage(file, 1280, 0.8);
      set({ featured_image: dataUrl });
    } catch {
      setError('Không thể xử lý ảnh.');
    } finally {
      setImageBusy(false);
    }
    e.target.value = '';
  };

  const addTag = () => {
    const name = tagInput.trim();
    if (!name) return;
    if (!tags.includes(name)) setTags((t) => [...t, name]);
    setTagInput('');
  };

  const removeTag = (name: string) => setTags((t) => t.filter((x) => x !== name));

  const save = async () => {
    if (!form.title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết.');
      return;
    }
    const slug = form.slug.trim() || slugify(form.title);
    if (!slug) {
      setError('Slug không hợp lệ.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      let publishedAt: string | null = null;
      let status: 'draft' | 'published' = 'draft';

      if (publishMode === 'now') {
        status = 'published';
        // Nếu bài đã từng được xuất bản, giữ nguyên ngày đăng gốc;
        // chỉ lấy thời điểm hiện tại khi đăng bài mới hoặc bài nháp lần đầu.
        publishedAt =
          wasPublished && originalPublishedAt ? originalPublishedAt : new Date().toISOString();
      } else if (publishMode === 'schedule') {
        if (!scheduleAt) {
          setError('Vui lòng chọn thời gian xuất bản.');
          setSaving(false);
          return;
        }
        status = 'published';
        publishedAt = new Date(scheduleAt).toISOString();
      }

      const payload = {
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt || null,
        content: form.content,
        featured_image: form.featured_image || null,
        category_id: form.category_id ?? null,
        author_id: form.author_id ?? null,
        status,
        published_at: publishedAt,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
      };

      let postId: number;
      if (isEdit) {
        const { error: upErr } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', Number(id));
        if (upErr) throw upErr;
        postId = Number(id);
      } else {
        const { data, error: insErr } = await supabase
          .from('blog_posts')
          .insert(payload)
          .select('id')
          .single();
        if (insErr) throw insErr;
        postId = data.id as number;
      }

      await syncPostTags(postId, tags);
      navigate('/admin');
    } catch (e) {
      setError('Không thể lưu bài viết. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 rounded-lg bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-sm text-mystic-purple-100 placeholder:text-mystic-purple-300/50 outline-none focus:border-mystic-purple-500/50 transition-colors';
  const labelCls = 'block text-xs font-semibold text-mystic-purple-300 mb-1.5 uppercase tracking-wide';

  if (loading) {
    return (
      <div className="min-h-screen bg-mystic-gradient pt-28 px-6 flex items-center justify-center">
        <i className="ri-loader-4-line text-3xl text-mystic-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mystic-gradient pt-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <Link to="/admin" className="text-xs text-mystic-purple-300/70 hover:text-mystic-gold-400 transition-colors inline-flex items-center gap-1 mb-2">
              <i className="ri-arrow-left-line" /> Quản trị Blog
            </Link>
            <h1 className="mystic-heading text-3xl font-bold text-mystic-gold-400">
              {isEdit ? 'Chỉnh Sửa Bài Viết' : 'Bài Viết Mới'}
            </h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin')} className="mystic-btn-outline whitespace-nowrap">
              Hủy
            </button>
            <button onClick={save} disabled={saving} className="mystic-btn-gold whitespace-nowrap disabled:opacity-50">
              <i className="ri-save-line" /> Lưu Bài Viết
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-sm text-red-200 flex items-center gap-3">
            <i className="ri-error-warning-line" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-white cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Title */}
            <div className="mystic-card rounded-2xl p-6">
              <label className={labelCls}>Tiêu đề</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className={inputCls}
              />
            </div>

            {/* Content */}
            <div className="mystic-card rounded-2xl p-6">
              <label className={labelCls}>Nội dung bài viết</label>
              <RichTextEditor
                key={id ?? 'new'}
                initialHtml={form.content}
                onChange={(html) => set({ content: html })}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Publish */}
            <div className="mystic-card rounded-2xl p-6">
              <h3 className="mystic-heading text-base font-bold text-mystic-gold-400 mb-4">Xuất Bản</h3>
              <div className="flex flex-col gap-2">
                {(
                  [
                    ['draft', 'Bản nháp', 'ri-file-list-3-line'],
                    ['now', 'Xuất bản ngay', 'ri-send-plane-line'],
                    ['schedule', 'Lên lịch', 'ri-calendar-line'],
                  ] as [PublishMode, string, string][]
                ).map(([value, label, icon]) => (
                  <button
                    key={value}
                    onClick={() => setPublishMode(value)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm border transition-all cursor-pointer ${
                      publishMode === value
                        ? 'border-mystic-gold-500/50 bg-mystic-gold-900/10 text-mystic-gold-400'
                        : 'border-mystic-purple-700/30 text-mystic-purple-200 hover:border-mystic-purple-500/40'
                    }`}
                  >
                    <i className={icon} />
                    {label}
                  </button>
                ))}
              </div>
              {publishMode === 'schedule' && (
                <div className="mt-3">
                  <label className={labelCls}>Thời gian xuất bản</label>
                  <input
                    type="datetime-local"
                    value={scheduleAt}
                    onChange={(e) => setScheduleAt(e.target.value)}
                    className={inputCls}
                  />
                </div>
              )}
            </div>

            {/* Featured image */}
            <div className="mystic-card rounded-2xl p-6">
              <h3 className="mystic-heading text-base font-bold text-mystic-gold-400 mb-4">Ảnh Đại Diện</h3>
              {form.featured_image ? (
                <div className="relative rounded-xl overflow-hidden border border-mystic-purple-700/30 mb-3">
                  <img src={form.featured_image} alt="Ảnh đại diện" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => set({ featured_image: '' })}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer"
                    title="Gỡ ảnh"
                  >
                    <i className="ri-close-line" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-40 rounded-xl border-2 border-dashed border-mystic-purple-700/30 flex items-center justify-center text-mystic-purple-300/60 mb-3">
                  <i className="ri-image-add-line text-2xl" />
                </div>
              )}
              <label className="mystic-btn-outline w-full justify-center cursor-pointer">
                <i className="ri-upload-2-line" />
                {imageBusy ? 'Đang xử lý...' : form.featured_image ? 'Đổi Ảnh' : 'Tải Ảnh Lên'}
                <input type="file" accept="image/*" className="hidden" onChange={onFeaturedImage} disabled={imageBusy} />
              </label>
            </div>

            {/* Category & author */}
            <div className="mystic-card rounded-2xl p-6">
              <h3 className="mystic-heading text-base font-bold text-mystic-gold-400 mb-4">Phân Loại</h3>
              <label className={labelCls}>Chuyên mục</label>
              <select
                value={form.category_id ?? ''}
                onChange={(e) => set({ category_id: e.target.value ? Number(e.target.value) : undefined })}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">— Chọn chuyên mục —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label className={`${labelCls} mt-4`}>Tác giả</label>
              <select
                value={form.author_id ?? ''}
                onChange={(e) => set({ author_id: e.target.value ? Number(e.target.value) : undefined })}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">— Chọn tác giả —</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mystic-card rounded-2xl p-6">
              <h3 className="mystic-heading text-base font-bold text-mystic-gold-400 mb-4">Thẻ (Tags)</h3>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-xs text-mystic-purple-100"
                    >
                      {t}
                      <button onClick={() => removeTag(t)} className="text-mystic-purple-300 hover:text-red-300 cursor-pointer">
                        <i className="ri-close-line" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Thêm thẻ..."
                  className={inputCls}
                />
                <button onClick={addTag} className="mystic-btn-outline !px-4 whitespace-nowrap">
                  <i className="ri-add-line" />
                </button>
              </div>
            </div>

            {/* SEO */}
            <div className="mystic-card rounded-2xl p-6">
              <h3 className="mystic-heading text-base font-bold text-mystic-gold-400 mb-4">SEO</h3>
              <label className={labelCls}>Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set({ slug: slugify(e.target.value) });
                }}
                placeholder="duong-dan-bai-viet"
                className={inputCls}
              />
              <label className={`${labelCls} mt-4`}>Tiêu đề SEO</label>
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => set({ seo_title: e.target.value })}
                placeholder="Tiêu đề hiển thị trên Google..."
                className={inputCls}
              />
              <label className={`${labelCls} mt-4`}>Mô tả SEO</label>
              <textarea
                value={form.seo_description}
                onChange={(e) => set({ seo_description: e.target.value })}
                placeholder="Mô tả ngắn cho công cụ tìm kiếm..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Excerpt */}
            <div className="mystic-card rounded-2xl p-6">
              <label className={labelCls}>Mô tả ngắn (Excerpt)</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set({ excerpt: e.target.value })}
                placeholder="Tóm tắt ngắn hiển thị trên thẻ bài viết..."
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}