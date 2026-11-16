'use client';

import { useMemo } from 'react';
import { useDemoStore } from '@/store/useDemoStore';

export function usePageSections(slug) {
  const pages = useDemoStore((state) => state.cmsPages);

  return useMemo(() => {
    const page = pages.find((item) => item.slug === slug) || null;
    const sections = [...(page?.sections || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const section = (key, fallback = {}) => {
      const match = sections.find((item) => item.key === key);
      if (!match || match.enabled === false) return fallback;
      return { ...fallback, ...match };
    };
    return { page, sections, section };
  }, [pages, slug]);
}
