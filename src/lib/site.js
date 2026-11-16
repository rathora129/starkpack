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

export const whatsappLink = (number, message = site.whatsappMessage) =>
  `https://wa.me/${String(number || site.whatsapp).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
