import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveRouteSeo, applySeo } from '@/lib/seo';
import { buildRouteJsonLd, injectJsonLd, clearJsonLd } from '@/lib/jsonLd';

export default function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const seo = resolveRouteSeo(location.pathname);
    applySeo(seo);
    const jsonLd = buildRouteJsonLd(seo);
    if (jsonLd) {
      injectJsonLd(jsonLd);
    } else {
      clearJsonLd();
    }
  }, [location.pathname]);

  return null;
}