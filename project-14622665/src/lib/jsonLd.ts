import { SITE_ORIGIN, ORG_NAME, ORG_IMAGE, FAVICON_URL } from '@/lib/seo';
import type { SeoData } from '@/lib/seo';

const JSONLD_ID = 'readdy-seo-jsonld';

export function injectJsonLd(schema: object | object[]): void {
  let el = document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = JSONLD_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

export function clearJsonLd(): void {
  const el = document.getElementById(JSONLD_ID);
  if (el) el.remove();
}

export function buildRouteJsonLd(seo: SeoData): object[] | null {
  if (seo.noindex) return null;
  const url = `${SITE_ORIGIN}${seo.path}`;
  const path = seo.path;

  if (path === '/') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: ORG_NAME,
        url,
        description: seo.description,
        inLanguage: 'vi',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: ORG_NAME,
        url,
        logo: FAVICON_URL,
        image: ORG_IMAGE,
        description: seo.description,
      },
    ];
  }

  if (path === '/about') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: seo.title,
        url,
        description: seo.description,
        inLanguage: 'vi',
      },
    ];
  }

  if (path === '/blog') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: seo.title,
        url,
        description: seo.description,
        inLanguage: 'vi',
      },
    ];
  }

  if (/^\/blog\/.+/.test(path)) {
    return null;
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      url,
      description: seo.description,
      inLanguage: 'vi',
    },
  ];
}

export function buildBlogPostingJsonLd(data: {
  title: string;
  description?: string;
  image?: string;
  slug: string;
  datePublished?: string;
  authorName?: string;
}): object {
  const url = `${SITE_ORIGIN}/blog/${data.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description || data.title,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'vi',
    ...(data.image ? { image: data.image } : {}),
    ...(data.datePublished ? { datePublished: data.datePublished } : {}),
    ...(data.authorName
      ? { author: { '@type': 'Person', name: data.authorName } }
      : {}),
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      logo: {
        '@type': 'ImageObject',
        url: FAVICON_URL,
      },
    },
  };
}