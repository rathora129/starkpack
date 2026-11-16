export const LEAD_SOURCES = [
  'Website',
  'Google Ads',
  'Meta Ads',
  'WhatsApp',
  'Direct Call',
  'Email',
  'Referral',
  'Landing Page',
  'Exhibition',
  'Manual Entry',
  'Other',
];

const ALIASES = [
  [/google/i, 'Google Ads'],
  [/meta|facebook|instagram/i, 'Meta Ads'],
  [/whatsapp/i, 'WhatsApp'],
  [/call|phone|outbound/i, 'Direct Call'],
  [/email|newsletter/i, 'Email'],
  [/referral/i, 'Referral'],
  [/landing/i, 'Landing Page'],
  [/trade|expo|exhibition|event/i, 'Exhibition'],
  [/website|seo|microsite|organic|quote/i, 'Website'],
  [/manual|walk[- ]?in/i, 'Manual Entry'],
];

export function normalizeSource(value) {
  const text = String(value || '').trim();
  if (!text) return 'Other';
  const exact = LEAD_SOURCES.find((source) => source.toLowerCase() === text.toLowerCase());
  if (exact) return exact;
  for (const [pattern, source] of ALIASES) {
    if (pattern.test(text)) return source;
  }
  return 'Other';
}

const CAMPAIGN_UTM = {
  'Google Search': { source: 'google', medium: 'cpc' },
  Instagram: { source: 'instagram', medium: 'paid-social' },
  'Trade show': { source: 'packexpo', medium: 'event' },
  Email: { source: 'newsletter', medium: 'email' },
  'SEO & content': { source: 'google', medium: 'organic' },
  LinkedIn: { source: 'linkedin', medium: 'paid-social' },
  'Agency retainer': { source: 'agency', medium: 'referral' },
};

const CHANNEL_UTM = {
  Website: { source: 'website', medium: 'organic' },
  'Google Ads': { source: 'google', medium: 'cpc' },
  'Meta Ads': { source: 'meta', medium: 'paid-social' },
  WhatsApp: { source: 'whatsapp', medium: 'messaging' },
  'Direct Call': { source: 'phone', medium: 'direct' },
  Email: { source: 'newsletter', medium: 'email' },
  Referral: { source: 'referral', medium: 'referral' },
  'Landing Page': { source: 'landing-page', medium: 'campaign' },
  Exhibition: { source: 'exhibition', medium: 'event' },
  'Manual Entry': { source: 'manual', medium: 'none' },
  Other: { source: 'other', medium: 'none' },
};

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function buildLeadAttribution(lead = {}, campaign = null) {
  const sourceChannel = lead.sourceChannel || normalizeSource(lead.originalSource || lead.source);
  const campaignUtm = campaign ? CAMPAIGN_UTM[campaign.channel] || {} : {};
  const channelUtm = CHANNEL_UTM[sourceChannel] || CHANNEL_UTM.Other;
  const utmSource = lead.utmSource || lead.utm?.source || campaignUtm.source || channelUtm.source;
  const utmMedium = lead.utmMedium || lead.utm?.medium || campaignUtm.medium || channelUtm.medium;
  const utmCampaign =
    lead.utmCampaign || lead.utm?.campaign || (campaign ? slugify(campaign.name) : '—');
  const landingPage =
    lead.landingPage ||
    (campaign ? `/lp/${slugify(campaign.name)}` : sourceChannel === 'Website' ? '/request-a-quote' : '—');

  return {
    sourceChannel,
    originalSource: lead.originalSource || lead.source || sourceChannel,
    sourceDetail: lead.sourceDetail || lead.source || sourceChannel,
    campaignName: lead.campaignName || campaign?.name || '—',
    landingPage,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent: lead.utmContent || lead.utm?.content || '—',
    referrer: lead.referrer || (sourceChannel === 'Referral' ? 'Customer referral' : '—'),
  };
}

export function captureAttribution() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const read = (key) => params.get(key) || '';
  return {
    landingPage: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || '',
    utmSource: read('utm_source'),
    utmMedium: read('utm_medium'),
    utmCampaign: read('utm_campaign'),
    utmContent: read('utm_content'),
    utmTerm: read('utm_term'),
    campaignName: read('utm_campaign'),
  };
}

export const QUALIFIED_STAGES = ['Qualified', 'Proposal', 'Won'];

export function sourceSummary(leads = []) {
  const rows = new Map(
    LEAD_SOURCES.map((source) => [
      source,
      { source, leads: 0, qualified: 0, quotations: 0, wonOrders: 0, revenue: 0 },
    ])
  );
  leads.forEach((lead) => {
    const source = lead.sourceChannel || normalizeSource(lead.source);
    const row = rows.get(source) || rows.get('Other');
    row.leads += 1;
    if (QUALIFIED_STAGES.includes(lead.stage)) row.qualified += 1;
    if (lead.quoteId || Number(lead.quoteValue) > 0) row.quotations += 1;
    if (lead.stage === 'Won' || Number(lead.confirmedOrderValue) > 0) row.wonOrders += 1;
    row.revenue += Number(lead.confirmedOrderValue) || 0;
  });
  return Array.from(rows.values());
}
