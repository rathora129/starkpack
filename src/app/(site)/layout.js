import SiteChrome from '@/components/site/SiteChrome';

export const metadata = {
  title: { absolute: 'STARK PACKMATE — Packaging engineered for modern brands' },
  description:
    'Custom corrugated, folding carton, rigid and sustainable packaging for ambitious brands. Structural design, in-house manufacturing and 99.2% on-time dispatch.',
};

export default function SiteLayout({ children }) {
  return <SiteChrome>{children}</SiteChrome>;
}
