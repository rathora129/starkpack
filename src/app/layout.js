import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers/Providers';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'STARK PACKMATE — Packaging engineered for modern brands',
    template: '%s · STARK PACKMATE',
  },
  description:
    'Stark Packmate designs and manufactures corrugated, folding carton, rigid and sustainable packaging for ambitious brands. 16 years. 3 plants. 99.2% on-time.',
  keywords: [
    'packaging manufacturer',
    'corrugated boxes',
    'folding cartons',
    'rigid boxes',
    'custom packaging India',
    'sustainable packaging',
  ],
  applicationName: 'Stark Packmate',
  authors: [{ name: 'Stark Packmate' }],
  openGraph: {
    title: 'STARK PACKMATE — Packaging engineered for modern brands',
    description:
      'Precision packaging manufacturing for e-commerce, FMCG, food, beauty and industrial brands.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Stark Packmate',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B1464',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
