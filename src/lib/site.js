export const site = {
  name: 'STARK PACKMATE',
  legalName: 'Stark Packmate Private Limited',
  shortName: 'Stark Packmate',
  tagline: 'Engineered packaging. Delivered with certainty.',
  description:
    'We design, engineer and manufacture packaging that protects products, elevates brands and scales with demand.',
  established: 2009,
  phone: '+91 98200 11223',
  phoneHref: '+919820011223',
  whatsapp: '919820011223',
  whatsappMessage:
    'Hi Stark Packmate, I would like to discuss a packaging requirement.',
  email: 'hello@starkpackmate.com',
  salesEmail: 'quotes@starkpackmate.com',
  address: 'Plot 42, MIDC Industrial Estate, Andheri East, Mumbai 400093, Maharashtra, India',
  plantAddress: 'Unit 7, Chakan Industrial Corridor, Pune 410501, Maharashtra, India',
  hours: 'Monday – Saturday · 9:00 to 18:30 IST',
  gstin: '27AABCS4821F1Z5',
  iec: '0312098745',
  social: {
    linkedin: 'https://www.linkedin.com',
    instagram: 'https://www.instagram.com',
    youtube: 'https://www.youtube.com',
  },
};

export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Quality', href: '/quality' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  company: [
    { label: 'About us', href: '/about' },
    { label: 'Manufacturing', href: '/capabilities' },
    { label: 'Quality & compliance', href: '/quality' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' },
  ],
  products: [
    { label: 'Corrugated boxes', href: '/products/corrugated-shipping-boxes' },
    { label: 'Premium mailers', href: '/products/premium-mailer-boxes' },
    { label: 'Folding cartons', href: '/products/printed-folding-cartons' },
    { label: 'Rigid gift boxes', href: '/products/rigid-gift-boxes' },
    { label: 'Kraft retail bags', href: '/products/kraft-retail-bags' },
  ],
  solutions: [
    { label: 'E-commerce fulfilment', href: '/solutions#ecommerce' },
    { label: 'Retail & brand', href: '/solutions#retail' },
    { label: 'Industrial & logistics', href: '/solutions#industrial' },
    { label: 'Food & beverage', href: '/solutions#food' },
    { label: 'Subscription & gifting', href: '/solutions#gifting' },
  ],
  resources: [
    { label: 'Request a quote', href: '/quote' },
    { label: 'Industries served', href: '/industries' },
    { label: 'Client portal', href: '/portal' },
    { label: 'Admin dashboard', href: '/admin' },
    { label: 'Careers', href: '/about#careers' },
  ],
};

export const whatsappLink = (number, message = site.whatsappMessage) =>
  `https://wa.me/${String(number || site.whatsapp).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
