/**
 * Chuyển nội dung bài viết về HTML để hiển thị và chỉnh sửa.
 * Các bài viết cũ được lưu ở định dạng Lexical JSON; bài mới lưu HTML.
 * Hàm này phát hiện và chuyển đổi cả hai định dạng về HTML thống nhất.
 */

interface LexicalNode {
  type: string;
  tag?: string;
  listType?: 'bullet' | 'number' | 'check';
  children?: LexicalNode[];
  text?: string;
  format?: number;
  style?: string;
  url?: string;
  src?: string;
  altText?: string;
}

// Lexical format bitmask
const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;
const IS_HIGHLIGHT = 128;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderText(node: LexicalNode): string {
  let text = escapeHtml(node.text || '');
  const format = node.format || 0;

  if (format & IS_CODE) text = `<code>${text}</code>`;
  if (format & IS_BOLD) text = `<strong>${text}</strong>`;
  if (format & IS_ITALIC) text = `<em>${text}</em>`;
  if (format & IS_UNDERLINE) text = `<u>${text}</u>`;
  if (format & IS_STRIKETHROUGH) text = `<s>${text}</s>`;
  if (format & IS_SUBSCRIPT) text = `<sub>${text}</sub>`;
  if (format & IS_SUPERSCRIPT) text = `<sup>${text}</sup>`;
  if (format & IS_HIGHLIGHT) text = `<mark>${text}</mark>`;

  if (node.style) {
    text = `<span style="${node.style}">${text}</span>`;
  }
  return text;
}

function renderChildren(children?: LexicalNode[]): string {
  if (!children) return '';
  return children.map(renderNode).join('');
}

function renderNode(node: LexicalNode): string {
  switch (node.type) {
    case 'text':
      return renderText(node);
    case 'paragraph':
      return `<p>${renderChildren(node.children)}</p>`;
    case 'heading': {
      const tag = node.tag || 'h2';
      return `<${tag}>${renderChildren(node.children)}</${tag}>`;
    }
    case 'quote':
      return `<blockquote>${renderChildren(node.children)}</blockquote>`;
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      return `<${tag}>${renderChildren(node.children)}</${tag}>`;
    }
    case 'listitem':
      return `<li>${renderChildren(node.children)}</li>`;
    case 'link': {
      const url = node.url ? escapeHtml(node.url) : '#';
      return `<a href="${url}">${renderChildren(node.children)}</a>`;
    }
    case 'linebreak':
      return '<br/>';
    case 'image': {
      const src = node.src || '';
      const alt = node.altText ? escapeHtml(node.altText) : '';
      return `<img src="${src}" alt="${alt}" />`;
    }
    default:
      return renderChildren(node.children);
  }
}

export function lexicalJsonToHtml(json: unknown): string {
  const root = (json as { root?: LexicalNode })?.root;
  if (!root) return '';
  return renderChildren(root.children);
}

/** Phát hiện định dạng và trả về HTML chuẩn */
export function contentToHtml(content?: string | null): string {
  if (!content) return '';
  const trimmed = content.trim();
  if (trimmed.startsWith('{"root":')) {
    try {
      return lexicalJsonToHtml(JSON.parse(trimmed));
    } catch {
      return content;
    }
  }
  return content;
}