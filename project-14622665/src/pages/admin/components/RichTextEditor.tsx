import { useEffect, useRef, useState, useCallback } from 'react';
import type { ChangeEvent, ClipboardEvent as ClipboardEvt, MouseEvent as ReactMouseEvent } from 'react';
import { compressImage } from '@/lib/imageCompress';
import { slugify } from '@/lib/blog';
import '@/styles/article.css';

/* Chỉ dùng các font hỗ trợ tiếng Việt đầy đủ và dễ đọc */
const FONT_FAMILIES = [
  { label: 'Be Vietnam Pro (khuyên dùng)', value: 'Be Vietnam Pro' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Lora (serif dễ đọc)', value: 'Lora' },
];

const FONT_SIZES = [
  { label: 'Nhỏ', value: '2' },
  { label: 'Thường', value: '3' },
  { label: 'Lớn', value: '4' },
  { label: 'Rất lớn', value: '6' },
];

const LINE_HEIGHTS = [
  { label: '1.0', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '1.75', value: '1.75' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
];

const LETTER_SPACINGS = [
  { label: '-0.5px', value: '-0.5px' },
  { label: '0', value: '0' },
  { label: '0.5px', value: '0.5px' },
  { label: '1px', value: '1px' },
  { label: '1.5px', value: '1.5px' },
  { label: '2px', value: '2px' },
];

/* Bảng màu chữ đầy đủ (Theme Colours + Standard Colours như trong Word) */
const THEME_COLORS: string[][] = [
  ['#ffffff', '#000000', '#e7e6e6', '#d0cece', '#aeaaaa', '#757171'],
  ['#1f3864', '#2f5496', '#8faadc', '#b4c7e7', '#d9e1f2', '#e9edf6'],
  ['#2e75b6', '#5b9bd5', '#9dc3e6', '#bdd7ee', '#deebf7', '#eef4fb'],
  ['#24506b', '#2e6b8f', '#6fa8c9', '#9cc4da', '#c9dfeb', '#e2eff5'],
  ['#c55a11', '#ed7d31', '#f4b183', '#f8cbad', '#fbe5d6', '#fdf2ea'],
  ['#375623', '#548235', '#a9d18e', '#c5e0b4', '#e2efda', '#f2f9ec'],
  ['#0070c0', '#00b0f0', '#5bc0f0', '#9bd9f5', '#cceafa', '#e6f5fd'],
  ['#701c5c', '#a61e7a', '#c97fb5', '#d9a6c9', '#e8cdde', '#f4ecf2'],
  ['#3b6d11', '#70ad47', '#a9d18e', '#c5e0b4', '#e2efda', '#f2f9ec'],
  ['#5b2c6f', '#7030a0', '#b185d0', '#c9a8dd', '#e0d2ec', '#f0eaf5'],
];

const STANDARD_COLORS = [
  '#c00000',
  '#ff0000',
  '#ffc000',
  '#ffff00',
  '#92d050',
  '#00b050',
  '#00b0f0',
  '#0070c0',
  '#002060',
  '#7030a0',
];

interface RichTextEditorProps {
  initialHtml?: string;
  onChange: (html: string) => void;
}

interface ToolBtnProps {
  label: string;
  icon: string;
  onClick: () => void;
  active?: boolean;
  title?: string;
}

const BLOCK_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, div';

const toolBtnBase =
  'w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0';
const toolBtnIdle =
  'text-mystic-purple-200 hover:bg-mystic-purple-900/40 hover:text-white border border-transparent';
const toolBtnActive =
  'bg-mystic-gold-900/30 text-mystic-gold-400 border border-mystic-gold-700/40';
const selectCls =
  'bg-mystic-purple-900/40 border border-mystic-purple-700/30 text-mystic-purple-100 text-sm rounded-md px-2 py-1.5 cursor-pointer outline-none shrink-0';

function ToolBtn({ label, icon, onClick, active, title }: ToolBtnProps) {
  return (
    <button
      type="button"
      title={title || label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`${toolBtnBase} ${active ? toolBtnActive : toolBtnIdle}`}
    >
      <i className={icon} />
    </button>
  );
}

/** Bảng chọn màu chữ (Theme + Standard + màu tuỳ chọn) */
function ColorPicker({ onPick }: { onPick: (color: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        title="Màu chữ"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className={`${toolBtnBase} ${open ? toolBtnActive : toolBtnIdle}`}
      >
        <i className="ri-font-color" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 z-40 w-[290px] p-3 rounded-xl bg-[#160f28] border border-mystic-purple-700/40 shadow-lg">
            <p className="text-[11px] text-mystic-purple-300 mb-2">Màu chủ đề</p>
            <div className="flex gap-1">
              {THEME_COLORS.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-1">
                  {col.map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onPick(c);
                        setOpen(false);
                      }}
                      className="w-5 h-5 rounded-[3px] border border-white/15 cursor-pointer"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-mystic-purple-300 mt-3 mb-2">Màu tiêu chuẩn</p>
            <div className="flex flex-wrap gap-1.5">
              {STANDARD_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onPick(c);
                    setOpen(false);
                  }}
                  className="w-6 h-6 rounded-[3px] border border-white/15 cursor-pointer"
                  style={{ background: c }}
                />
              ))}
            </div>

            <label className="flex items-center justify-between gap-2 mt-3 text-[11px] text-mystic-purple-200 cursor-pointer">
              Màu tuỳ chọn
              <input
                type="color"
                onMouseDown={(e) => e.preventDefault()}
                onChange={(e) => {
                  onPick(e.target.value);
                  setOpen(false);
                }}
                className="w-10 h-7 bg-transparent cursor-pointer"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}

function escapeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Làm sạch HTML khi dán từ nguồn ngoài (Word, Google Docs, web khác...) */
function sanitizePastedHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.body
    .querySelectorAll(
      'script, style, meta, link, iframe, object, embed, form, input, button, svg, canvas, video, audio, noscript'
    )
    .forEach((el) => el.remove());

  doc.body.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        return;
      }
      if (name === 'class' || name === 'id' || name === 'dir' || name === 'lang' || name.startsWith('data-')) {
        el.removeAttribute(attr.name);
        return;
      }
      if (
        name === 'style' &&
        !/text-align|font-weight|font-style|text-decoration|line-height|letter-spacing|color/i.test(attr.value)
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}

export default function RichTextEditor({ initialHtml, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [html, setHtml] = useState<string>(initialHtml || '');
  const [preview, setPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [tocNotice, setTocNotice] = useState<string | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml || '';
      setHtml(initialHtml || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRange = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreRange = useCallback(() => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(savedRange.current);
    editorRef.current?.focus();
  }, []);

  const emit = useCallback(() => {
    const next = editorRef.current?.innerHTML || '';
    setHtml(next);
    onChange(next);
  }, [onChange]);

  const exec = useCallback(
    (command: string, value?: string) => {
      restoreRange();
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand(command, false, value);
      emit();
    },
    [restoreRange, emit]
  );

  const execBlock = useCallback(
    (tag: string) => {
      restoreRange();
      document.execCommand('formatBlock', false, tag);
      emit();
    },
    [restoreRange, emit]
  );

  /** Áp dụng style (giãn dòng / khoảng cách chữ) cho (các) đoạn đang chọn */
  const applyBlockStyle = useCallback(
    (prop: 'lineHeight' | 'letterSpacing', value: string) => {
      restoreRange();
      const root = editorRef.current;
      const sel = window.getSelection();
      if (!root || !sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      const blocks = new Set<HTMLElement>();
      root.querySelectorAll(BLOCK_SELECTOR).forEach((el) => {
        if (el !== root && range.intersectsNode(el)) blocks.add(el as HTMLElement);
      });

      if (blocks.size === 0) {
        const node = sel.anchorNode;
        const el = node && node.nodeType === 3 ? node.parentElement : (node as Element | null);
        const block = el?.closest?.(BLOCK_SELECTOR) as HTMLElement | null;
        if (block && block !== root) blocks.add(block);
      }

      blocks.forEach((b) => {
        b.style[prop] = value;
      });
      emit();
    },
    [restoreRange, emit]
  );

  const insertHtml = useCallback(
    (fragment: string) => {
      restoreRange();
      document.execCommand('insertHTML', false, fragment);
      emit();
    },
    [restoreRange, emit]
  );

  /** Chèn ngay tại vị trí con trỏ (dùng cho dán nội dung) */
  const insertAtCaret = useCallback(
    (fragment: string) => {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, fragment);
      emit();
    },
    [emit]
  );

  const buildImageFigure = (dataUrl: string, mid: string) =>
    `<figure class="article-figure"><img src="${dataUrl}" alt="" data-mid="${mid}" />` +
    `<figcaption>Chú thích ảnh</figcaption></figure><p><br/></p>`;

  /** Chọn sẵn một thẻ ảnh để hiện thanh căn chỉnh (căn vị trí/kích thước) */
  const selectImageEl = useCallback((img: HTMLImageElement) => {
    const range = document.createRange();
    range.selectNode(img);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    savedRange.current = range.cloneRange();
    setSelectedImage(img);
  }, []);

  /** Chèn ảnh mới và tự động chọn ảnh để người dùng chỉnh vị trí ngay */
  const insertImageAtCaret = useCallback(
    (dataUrl: string) => {
      const root = editorRef.current;
      if (!root) return;
      const mid = `img-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      root.focus();
      document.execCommand('insertHTML', false, buildImageFigure(dataUrl, mid));
      const img = root.querySelector(`img[data-mid="${mid}"]`) as HTMLImageElement | null;
      if (img) selectImageEl(img);
      emit();
    },
    [emit, selectImageEl]
  );

  const addLink = useCallback(() => {
    const url = window.prompt('Nhập URL liên kết (https://...):');
    if (url) exec('createLink', url);
  }, [exec]);

  const onImageUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      for (const file of files) {
        try {
          const dataUrl = await compressImage(file, 1200, 0.78);
          insertImageAtCaret(dataUrl);
        } catch {
          // bỏ qua ảnh lỗi
        }
      }
      e.target.value = '';
    },
    [insertImageAtCaret]
  );

  /** Dán ảnh (screenshot / copy ảnh) và dán nội dung từ nguồn ngoài cho mượt */
  const onPaste = useCallback(
    (e: ClipboardEvt<HTMLDivElement>) => {
      const clipboard = e.clipboardData;
      if (!clipboard) return;

      const imageFiles = Array.from(clipboard.items || [])
        .filter((it) => it.kind === 'file' && it.type.startsWith('image/'))
        .map((it) => it.getAsFile())
        .filter((f): f is File => Boolean(f));

      if (imageFiles.length > 0) {
        e.preventDefault();
        (async () => {
          for (const file of imageFiles) {
            try {
              const dataUrl = await compressImage(file, 1200, 0.78);
              insertImageAtCaret(dataUrl);
            } catch {
              // bỏ qua ảnh lỗi
            }
          }
        })();
        return;
      }

      const pastedHtml = clipboard.getData('text/html');
      if (pastedHtml) {
        e.preventDefault();
        insertAtCaret(sanitizePastedHtml(pastedHtml));
      }
    },
    [insertAtCaret, insertImageAtCaret]
  );

  const addVideo = useCallback(() => {
    const url = window.prompt('Nhập URL YouTube:');
    const id = parseYouTubeId(url || '');
    if (!id) return;
    const fragment =
      `<div class="article-video" contenteditable="false">` +
      `<iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" ` +
      `frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` +
      `</div><p><br/></p>`;
    insertHtml(fragment);
  }, [insertHtml]);

  const addTable = useCallback(() => {
    const fragment =
      `<table class="article-table"><thead><tr><th>Tiêu đề</th><th>Tiêu đề</th><th>Tiêu đề</th></tr></thead>` +
      `<tbody><tr><td>Nội dung</td><td>Nội dung</td><td>Nội dung</td></tr>` +
      `<tr><td>Nội dung</td><td>Nội dung</td><td>Nội dung</td></tr></tbody></table><p><br/></p>`;
    insertHtml(fragment);
  }, [insertHtml]);

  /** Tạo mục lục từ các heading (giống Update Table of Contents trong Word) */
  const generateToc = useCallback(() => {
    const root = editorRef.current;
    if (!root) return;

    root.querySelectorAll('[data-toc]').forEach((n) => n.remove());

    const headings = Array.from(root.querySelectorAll('h1, h2, h3, h4')) as HTMLElement[];
    if (headings.length === 0) {
      setTocNotice('Chưa có tiêu đề nào. Hãy chọn "Tiêu đề 1–4" cho vài dòng rồi bấm "Mục lục" lại nhé.');
      return;
    }

    const used = new Set<string>();
    const items = headings.map((h, i) => {
      const level = Number(h.tagName.substring(1)) || 2;
      const text = (h.textContent || '').trim() || `Mục ${i + 1}`;
      const base = slugify(text) || `muc-${i + 1}`;
      let id = base;
      let n = 2;
      while (used.has(id)) {
        id = `${base}-${n}`;
        n += 1;
      }
      used.add(id);
      h.id = id;
      return { level, text, id };
    });

    const list = items
      .map((it) => `<li class="toc-l${it.level}"><a href="#${it.id}">${escapeText(it.text)}</a></li>`)
      .join('');

    const tocHtml =
      `<nav class="article-toc" data-toc="1" contenteditable="false">` +
      `<div class="article-toc-title"><i class="ri-list-check-2"></i> Mục lục</div>` +
      `<ol>${list}</ol></nav>`;

    root.insertAdjacentHTML('afterbegin', tocHtml);
    emit();
    setTocNotice(null);
  }, [emit]);

  const detectSelectedImage = useCallback(() => {
    const sel = window.getSelection();
    const node = sel?.anchorNode;
    if (!node) {
      setSelectedImage(null);
      return;
    }
    const el = node.nodeType === 3 ? node.parentElement : (node as Element);
    const img = el?.closest?.('img');
    setSelectedImage(img as HTMLImageElement | null);
  }, []);

  const alignImage = useCallback(
    (align: 'left' | 'center' | 'right') => {
      if (!selectedImage) return;
      const figure = selectedImage.closest('figure');
      const target = (figure as HTMLElement) || selectedImage;
      target.style.textAlign = align;
      selectedImage.style.display = 'block';
      if (align === 'center') {
        selectedImage.style.marginLeft = 'auto';
        selectedImage.style.marginRight = 'auto';
      } else if (align === 'right') {
        selectedImage.style.marginLeft = 'auto';
        selectedImage.style.marginRight = '0';
      } else {
        selectedImage.style.marginLeft = '0';
        selectedImage.style.marginRight = 'auto';
      }
      emit();
    },
    [selectedImage, emit]
  );

  const resizeImage = useCallback(
    (percent: number) => {
      if (!selectedImage) return;
      selectedImage.style.width = `${percent}%`;
      emit();
    },
    [selectedImage, emit]
  );

  const removeImage = useCallback(() => {
    if (!selectedImage) return;
    const figure = selectedImage.closest('figure');
    (figure || selectedImage).remove();
    setSelectedImage(null);
    emit();
  }, [selectedImage, emit]);

  const onEditorEvent = useCallback(() => {
    saveRange();
    detectSelectedImage();
  }, [saveRange, detectSelectedImage]);

  const onEditorClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const t = e.target as HTMLElement;
      if (t && t.tagName === 'IMG') {
        selectImageEl(t as HTMLImageElement);
      } else {
        detectSelectedImage();
      }
    },
    [detectSelectedImage, selectImageEl]
  );

  const onInput = useCallback(() => {
    emit();
    saveRange();
  }, [emit, saveRange]);

  const imgBtn =
    'px-2 py-1 text-xs rounded-md border border-mystic-gold-700/40 text-mystic-gold-400 hover:bg-mystic-gold-900/20 cursor-pointer whitespace-nowrap';

  return (
    <div className="rounded-xl border border-mystic-purple-700/30 bg-[#0d0820]/80">
      {/* Toolbar — cố định khi cuộn để luôn chọn được công cụ */}
      <div className="sticky top-16 md:top-20 z-20 flex flex-wrap items-center gap-1 px-2 py-2 rounded-t-xl border-b border-mystic-purple-800/40 bg-[#160f28]/95 backdrop-blur-md">
        {/* Headings */}
        <select
          className={`${selectCls} max-w-[150px]`}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) execBlock(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="" disabled>
            Văn bản thường
          </option>
          <option value="H1">Tiêu đề 1</option>
          <option value="H2">Tiêu đề 2</option>
          <option value="H3">Tiêu đề 3</option>
          <option value="H4">Tiêu đề 4</option>
          <option value="P">Đoạn văn</option>
        </select>

        {/* Font family */}
        <select
          className={`${selectCls} max-w-[180px]`}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) exec('fontName', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="" disabled>
            Phông chữ
          </option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Font size */}
        <select
          className={selectCls}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) exec('fontSize', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="" disabled>
            Cỡ chữ
          </option>
          {FONT_SIZES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <span className="w-px h-5 bg-mystic-purple-700/30 mx-1 shrink-0" />

        <ToolBtn label="Đậm" icon="ri-bold" onClick={() => exec('bold')} title="In đậm" />
        <ToolBtn label="Nghiêng" icon="ri-italic" onClick={() => exec('italic')} title="In nghiêng" />
        <ToolBtn label="Gạch chân" icon="ri-underline" onClick={() => exec('underline')} title="Gạch chân" />
        <ColorPicker onPick={(color) => exec('foreColor', color)} />

        <span className="w-px h-5 bg-mystic-purple-700/30 mx-1 shrink-0" />

        {/* Giãn dòng */}
        <select
          className={selectCls}
          defaultValue=""
          title="Khoảng cách dòng"
          onChange={(e) => {
            if (e.target.value) applyBlockStyle('lineHeight', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="" disabled>
            Giãn dòng
          </option>
          {LINE_HEIGHTS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        {/* Khoảng cách chữ */}
        <select
          className={selectCls}
          defaultValue=""
          title="Khoảng cách giữa các chữ"
          onChange={(e) => {
            if (e.target.value !== '') applyBlockStyle('letterSpacing', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="" disabled>
            K.cách chữ
          </option>
          {LETTER_SPACINGS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <span className="w-px h-5 bg-mystic-purple-700/30 mx-1 shrink-0" />

        <ToolBtn label="Căn trái" icon="ri-align-left" onClick={() => exec('justifyLeft')} title="Căn trái" />
        <ToolBtn label="Căn giữa" icon="ri-align-center" onClick={() => exec('justifyCenter')} title="Căn giữa" />
        <ToolBtn label="Căn phải" icon="ri-align-right" onClick={() => exec('justifyRight')} title="Căn phải" />
        <ToolBtn label="Căn đều" icon="ri-align-justify" onClick={() => exec('justifyFull')} title="Căn đều hai bên" />

        <span className="w-px h-5 bg-mystic-purple-700/30 mx-1 shrink-0" />

        <ToolBtn label="Danh sách" icon="ri-list-unordered" onClick={() => exec('insertUnorderedList')} title="Danh sách dấu chấm" />
        <ToolBtn label="Danh sách số" icon="ri-list-ordered" onClick={() => exec('insertOrderedList')} title="Danh sách đánh số" />
        <ToolBtn label="Liên kết" icon="ri-link" onClick={addLink} title="Chèn liên kết" />
        <ToolBtn label="Trích dẫn" icon="ri-double-quotes-l" onClick={() => execBlock('BLOCKQUOTE')} title="Trích dẫn" />
        <ToolBtn label="Đường kẻ" icon="ri-separator" onClick={() => exec('insertHorizontalRule')} title="Đường phân cách" />
        <ToolBtn
          label="Chèn ảnh"
          icon="ri-image-add-line"
          onClick={() => fileInputRef.current?.click()}
          title="Chèn ảnh từ thiết bị"
        />
        <ToolBtn label="Chèn video" icon="ri-youtube-line" onClick={addVideo} title="Chèn video YouTube" />
        <ToolBtn label="Bảng" icon="ri-table-line" onClick={addTable} title="Chèn bảng" />
        <ToolBtn label="Mục lục" icon="ri-list-check-2" onClick={generateToc} title="Tạo mục lục từ các tiêu đề (như Word)" />

        <span className="w-px h-5 bg-mystic-purple-700/30 mx-1 shrink-0" />

        <ToolBtn label="Hoàn tác" icon="ri-arrow-go-back-line" onClick={() => exec('undo')} title="Hoàn tác" />
        <ToolBtn label="Làm lại" icon="ri-arrow-go-forward-line" onClick={() => exec('redo')} title="Làm lại" />

        <span className="flex-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setPreview(!preview)}
          className={`px-3 py-1.5 rounded-md text-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            preview
              ? 'bg-mystic-gold-900/30 text-mystic-gold-400 border-mystic-gold-700/40'
              : 'text-mystic-purple-200 border-mystic-purple-700/30 hover:bg-mystic-purple-900/40'
          }`}
        >
          <i className="ri-eye-line mr-1" />
          {preview ? 'Thoát xem trước' : 'Xem trước'}
        </button>
      </div>

      {tocNotice && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-mystic-gold-300 bg-mystic-gold-900/15 border-b border-mystic-gold-700/30">
          <i className="ri-information-line" />
          {tocNotice}
          <button
            type="button"
            onClick={() => setTocNotice(null)}
            className="ml-auto text-mystic-gold-300 hover:text-white cursor-pointer"
          >
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      {/* Selected image toolbar */}
      {selectedImage && !preview && (
        <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-mystic-gold-700/30 bg-mystic-gold-900/10">
          <span className="text-xs text-mystic-gold-400 mr-1">Ảnh:</span>
          <button type="button" className={imgBtn} title="Căn trái" onClick={() => alignImage('left')}>
            <i className="ri-align-left" />
          </button>
          <button type="button" className={imgBtn} title="Căn giữa" onClick={() => alignImage('center')}>
            <i className="ri-align-center" />
          </button>
          <button type="button" className={imgBtn} title="Căn phải" onClick={() => alignImage('right')}>
            <i className="ri-align-right" />
          </button>
          <span className="w-px h-5 bg-mystic-gold-700/30 mx-1" />
          <button type="button" className={imgBtn} onClick={() => resizeImage(25)}>
            25%
          </button>
          <button type="button" className={imgBtn} onClick={() => resizeImage(50)}>
            50%
          </button>
          <button type="button" className={imgBtn} onClick={() => resizeImage(75)}>
            75%
          </button>
          <button type="button" className={imgBtn} onClick={() => resizeImage(100)}>
            100%
          </button>
          <span className="w-px h-5 bg-mystic-gold-700/30 mx-1" />
          <button
            type="button"
            className="px-2 py-1 text-xs rounded-md border border-red-700/40 text-red-300 hover:bg-red-500/10 cursor-pointer whitespace-nowrap"
            onClick={removeImage}
          >
            <i className="ri-delete-bin-line mr-1" /> Xóa ảnh
          </button>
        </div>
      )}

      {/* Editor / Preview on a floating "paper" surface */}
      <div className="p-3 md:p-4">
        <div className="article-surface">
          {preview ? (
            <div className="article-content min-h-[320px]" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              className="article-content min-h-[320px] outline-none focus:outline-none"
              onInput={onInput}
              onClick={onEditorClick}
              onKeyUp={onEditorEvent}
              onMouseUp={onEditorEvent}
              onSelect={onEditorEvent}
              onBlur={onEditorEvent}
              onPaste={onPaste}
              suppressContentEditableWarning
            />
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onImageUpload} />
    </div>
  );
}

function parseYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  return match ? match[1] : null;
}