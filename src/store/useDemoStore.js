'use client';

import { create } from 'zustand';
import { PRODUCTION_FLOW } from '@/lib/services';
import { buildLeadAttribution, normalizeSource } from '@/lib/attribution';
import {
  leads as seedLeads,
  customers as seedCustomers,
  quotations as seedQuotations,
  orders as seedOrders,
  productionJobs as seedProductionJobs,
  artworkJobs as seedArtworkJobs,
  inventory as seedInventory,
  suppliers as seedSuppliers,
  purchaseOrders as seedPurchaseOrders,
  employees as seedEmployees,
  leaveRequests as seedLeaveRequests,
  attendance as seedAttendance,
  invoices as seedInvoices,
  campaigns as seedCampaigns,
  agencyBriefs as seedAgencyBriefs,
  cmsSeed,
  landingPages as seedLandingPages,
  notificationsSeed,
  activityFeed,
  tasksSeed,
  settingsSeed,
  currentUser,
} from '@/data/admin';
import {
  cmsPagesSeed,
  cmsBannersSeed,
  cmsServicesSeed,
  cmsTestimonialsSeed,
  cmsBlogsSeed,
  cmsMediaSeed,
  cmsProductsSeed,
  landingPageExtrasSeed,
  jobChecklistSeed,
  finishedGoodsSeed,
  stockMovementsSeed,
  salaryRecordsSeed,
  employeeTasksSeed,
  financeTransactionsSeed,
  agencyProfileSeed,
  agencyFeesSeed,
  campaignExpensesSeed,
  reportSchedulesSeed,
  leadFollowUpSeed,
} from '@/data/business';
import { pageSectionsSeed } from '@/data/pageSections';
import {
  ABC_CUSTOMER_ID,
  ABC_CAMPAIGN_ID,
  abcCustomer,
  abcContacts,
  abcLead,
  abcLeadFollowUps,
  abcQuotations,
  abcOrder,
  abcProductionJob,
  abcArtwork,
  abcInvoices,
  abcStockMovements,
  portalSupportSeed,
  portalNotificationSeed,
} from '@/data/portal';

const clone = (value) => JSON.parse(JSON.stringify(value));

const nowISO = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const addDaysISO = (date, days) => {
  const base = new Date(`${String(date).slice(0, 10)}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
};

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const quotationTotals = (items, discountPercent = 0) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0);
  const discount = Math.round(subtotal * (Number(discountPercent) || 0) / 100);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.18);
  return { subtotal, discount, discountPercent: Number(discountPercent) || 0, taxable, tax, total: taxable + tax, value: taxable + tax };
};

const orderValue = (items) =>
  items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0);

/* ------------------------------------------------------------------ */
/* Attribution                                                         */
/* ------------------------------------------------------------------ */

const CAMPAIGN_BY_LEAD = {
  'LD-1058': 'CMP-31',
  'LD-1057': 'CMP-29',
  'LD-1056': 'CMP-29',
  'LD-1055': 'CMP-31',
  'LD-1054': 'CMP-30',
  'LD-1053': 'CMP-31',
  'LD-1052': 'CMP-31',
  'LD-1051': 'CMP-28',
  'LD-1050': 'CMP-29',
  'LD-1049': 'CMP-29',
  'LD-1048': 'CMP-30',
  'LD-1047': null,
  'LD-1059': ABC_CAMPAIGN_ID,
};

const CAMPAIGN_BY_CUSTOMER = {
  'CUS-001': 'CMP-30',
  'CUS-002': 'CMP-31',
  'CUS-003': 'CMP-28',
  'CUS-004': 'CMP-29',
  'CUS-005': 'CMP-28',
  'CUS-006': 'CMP-27',
  'CUS-007': 'CMP-29',
  'CUS-008': 'CMP-27',
  'CUS-009': 'CMP-31',
  'CUS-010': null,
  [ABC_CUSTOMER_ID]: ABC_CAMPAIGN_ID,
};

const CAMPAIGN_BY_QUOTE = {
  'QT-2026-118': 'CMP-31',
  'QT-2026-117': 'CMP-28',
  'QT-2026-116': 'CMP-30',
  'QT-2026-115': 'CMP-28',
  'QT-2026-114': 'CMP-29',
  'QT-2026-113': null,
  'QT-2026-112': 'CMP-27',
  'QT-2026-111': 'CMP-29',
  'QT-2026-110': 'CMP-30',
  'QT-2026-109': 'CMP-27',
  'QT-2026-119': ABC_CAMPAIGN_ID,
  'QT-2026-108': ABC_CAMPAIGN_ID,
};

const CAMPAIGN_BY_ORDER = {
  'SO-2026-1052': 'CMP-30',
  'SO-2026-1053': 'CMP-29',
  'SO-2026-1054': ABC_CAMPAIGN_ID,
};

const QUOTE_DISCOUNTS = {
  'QT-2026-118': 4,
  'QT-2026-116': 2,
  'QT-2026-109': 3,
};

const QUOTE_SPECS = {
  'QT-2026-119': {
    material: '300 GSM SBS with PE-free grease barrier and food-safe inks',
    print: '6-colour offset with food-contact compliant varnish',
    finish: 'Grease barrier · tamper-evident tuck · batch code panel',
    dimensions: '155 × 75 × 220 mm (300 g carton)',
    packing: '18 cartons per 5-ply shipper · 48 shippers per pallet',
  },
  'QT-2026-108': {
    material: '300 GSM SBS with PE-free grease barrier',
    print: '4-colour offset, food-safe inks',
    finish: 'Grease-resistant coating · tuck-in base',
    dimensions: '160 × 110 × 45 mm',
    packing: '24 cartons per 5-ply shipper · 48 shippers per pallet',
  },
  'QT-2026-118': {
    material: '1200 micron greyboard with 157 GSM art paper wrap',
    print: 'CMYK offset with copper hot foil',
    finish: 'Matte lamination · magnetic closure · ribbon pull',
    dimensions: '220 × 160 × 70 mm',
    packing: 'Tissue wrap, 25 boxes per 5-ply shipper',
  },
  'QT-2026-117': {
    material: '250 GSM FBB, PE-free grease barrier',
    print: '4-colour offset, food-safe inks',
    finish: 'Water-based varnish',
    dimensions: '180 × 120 × 60 mm',
    packing: 'Flat-packed, 500 cartons per bundle',
  },
  'QT-2026-116': {
    material: 'E-flute corrugated, 157 GSM litho liner',
    print: '4-colour litho, inside and outside',
    finish: 'Matte lamination on outer face',
    dimensions: '300 × 220 × 100 mm',
    packing: 'Self-lock mailers, 40 per shipper',
  },
  'QT-2026-115': {
    material: '300 GSM SBS board with dispersion barrier',
    print: '4-colour offset, FSSAI-compliant inks',
    finish: 'Grease-resistant coating',
    dimensions: '160 × 110 × 45 mm',
    packing: '400 cartons per 5-ply shipper',
  },
  'QT-2026-114': {
    material: '5-ply corrugated with molded pulp insert',
    print: '1 spot flexo, export markings',
    finish: 'Die-cut cradle, corner reinforcement',
    dimensions: '600 × 400 × 350 mm',
    packing: 'Flat-packed, 10 cases per bundle',
  },
};

const quoteSpecFallback = (quote) => ({
  material: 'Specification confirmed against approved structural drawing',
  print: quote.items?.[0]?.description?.includes('spot') ? 'Offset print with spot UV' : '4-colour offset',
  finish: 'As per approved print proof',
  dimensions: 'Per approved die-line',
  packing: 'Standard export packing',
});

const buildRevisions = (quote) => {
  const current = Number(quote.total) || 0;
  const count = Number(quote.id.slice(-1)) % 2 === 0 ? 1 : 2;
  const revisions = Array.from({ length: count }, (_, index) => ({
    id: `${quote.id}-R${index + 1}`,
    version: index + 1,
    date: addDaysISO(quote.date, -6 + index * 3),
    total: Math.round(current * (index + 1 === count ? 0.995 : 0.94 + index * 0.03)),
    status: 'Superseded',
    note: index === 0 ? 'Initial commercial draft' : 'Revised rates after plant review',
    by: quote.owner,
  }));
  revisions.push({
    id: `${quote.id}-R${revisions.length + 1}`,
    version: revisions.length + 1,
    date: quote.date,
    total: current,
    status: quote.status === 'Draft' ? 'Draft' : 'Current',
    note: quote.status === 'Draft' ? 'Working draft' : 'Shared with customer',
    by: quote.owner,
  });
  return { revision: revisions.length, revisions };
};

/* ------------------------------------------------------------------ */
/* Production + order normalisation                                    */
/* ------------------------------------------------------------------ */

export { PRODUCTION_FLOW };

const STAGE_PROGRESS = {
  Pending: 5,
  Prepress: 18,
  Approval: 32,
  Printing: 52,
  Finishing: 74,
  'Quality Check': 90,
  Dispatch: 100,
};

const JOB_STAGE_OVERRIDE = {
  'JOB-2431': 'Printing',
  'JOB-2438': 'Prepress',
  'JOB-2441': 'Pending',
  'JOB-2432': 'Approval',
  'JOB-2439': 'Printing',
  'JOB-2433': 'Quality Check',
  'JOB-2435': 'Finishing',
  'JOB-2442': 'Finishing',
  'JOB-2434': 'Dispatch',
  'JOB-2437': 'Finishing',
  'JOB-2440': 'Finishing',
  'JOB-2436': 'Dispatch',
  'JOB-2443': 'Printing',
};

const buildChecklist = (stage) => {
  const index = PRODUCTION_FLOW.indexOf(stage);
  const thresholds = [1, 2, 4, 6];
  return jobChecklistSeed.map((label, i) => ({ id: i + 1, label, done: index >= thresholds[i] }));
};

const ORDER_RANK = {
  Confirmed: 1,
  Prepress: 2,
  'In production': 3,
  QC: 4,
  Dispatched: 5,
  Delivered: 6,
  'On hold': 2,
};

const ORDER_EVENTS = [
  { rank: 0, label: 'Order created', note: 'Order drafted from approved quotation' },
  { rank: 1, label: 'Confirmed', note: 'Purchase order received from customer' },
  { rank: 2, label: 'Prepress', note: 'Artwork and die-line checked' },
  { rank: 3, label: 'Production', note: 'Job card released to the plant' },
  { rank: 4, label: 'Quality check', note: 'First-off and batch inspection' },
  { rank: 5, label: 'Dispatched', note: 'Handed to logistics partner' },
  { rank: 6, label: 'Delivered', note: 'Proof of delivery received' },
];

const PAYMENT_RATIO = {
  Confirmed: 0,
  Prepress: 0.25,
  'In production': 0.4,
  QC: 0.4,
  Dispatched: 0.6,
  Delivered: 1,
  'On hold': 0,
};

const ORDER_CARRIERS = ['VRL Logistics', 'Safexpress', 'TCI Freight', 'Delhivery B2B'];

const buildOrderTimeline = (order) => {
  const rank = ORDER_RANK[order.status] ?? 0;
  return ORDER_EVENTS.map((event, index) => ({
    id: `${order.id}-TL${index}`,
    label: event.label,
    note: event.note,
    date: event.rank === 0 ? order.createdAt : addDaysISO(order.createdAt, event.rank * 2),
    done: event.rank <= rank,
  }));
};

const buildDelivery = (order) => {
  if (order.status === 'Delivered') {
    return {
      status: 'Delivered',
      carrier: ORDER_CARRIERS[0],
      tracking: `VRL-${order.id.slice(-4)}-26`,
      dispatchedOn: addDaysISO(order.dueDate, -3),
      deliveredOn: addDaysISO(order.dueDate, -1),
      address: order.shipTo,
    };
  }
  if (order.status === 'Dispatched') {
    return {
      status: 'In transit',
      carrier: ORDER_CARRIERS[1],
      tracking: `SF-${order.id.slice(-4)}-26`,
      dispatchedOn: addDaysISO(order.dueDate, -1),
      deliveredOn: null,
      address: order.shipTo,
    };
  }
  return { status: 'Pending dispatch', carrier: '—', tracking: '—', dispatchedOn: null, deliveredOn: null, address: order.shipTo };
};

const buildOrderPayment = (order) => {
  const ratio = PAYMENT_RATIO[order.status] ?? 0;
  const paid = Math.round(order.value * ratio);
  const paymentStatus = paid >= order.value && order.value > 0 ? 'Paid' : paid > 0 ? 'Part paid' : 'Unpaid';
  return { paid, paymentStatus, paymentMethod: paid ? 'NEFT' : '—', payments: paid ? [{ id: `${order.id}-P1`, amount: paid, date: addDaysISO(order.createdAt, 4), method: 'NEFT', reference: `RCPT-${order.id.slice(-4)}` }] : [] };
};

/* ------------------------------------------------------------------ */
/* Initial data                                                        */
/* ------------------------------------------------------------------ */

const CMS_COLLECTIONS = {
  pages: { key: 'cmsPages', prefix: 'PG' },
  banners: { key: 'cmsBanners', prefix: 'BN' },
  services: { key: 'cmsServices', prefix: 'SV' },
  testimonials: { key: 'cmsTestimonials', prefix: 'TS' },
  blogs: { key: 'cmsBlogs', prefix: 'BL' },
  media: { key: 'cmsMedia', prefix: 'MD' },
  products: { key: 'cmsProducts', prefix: 'CP' },
};

const seqs = {
  lead: 1059,
  customer: 11,
  contact: 12,
  quote: 119,
  order: 1054,
  job: 2443,
  artwork: 1183,
  sku: 1012,
  fg: 2004,
  supplier: 28,
  po: 316,
  employee: 42,
  leave: 24,
  salary: 36,
  employeeTask: 5,
  invoice: 842,
  transaction: 2016,
  campaign: 31,
  campaignExpense: 3103,
  brief: 9,
  fee: 0,
  landing: 5,
  section: 600,
  movement: 1186,
  followUp: 6,
  schedule: 4,
  support: 39,
  media: 8,
  product: 8,
  pages: 8,
  banners: 3,
  services: 7,
  testimonials: 5,
  blogs: 4,
};

const BASE_SEQS = { ...seqs };

const buildInitialData = () => {
  const leads = [abcLead, ...seedLeads].map((lead) => {
    const campaignId = CAMPAIGN_BY_LEAD[lead.id] ?? lead.campaignId ?? null;
    const campaign = seedCampaigns.find((entry) => entry.id === campaignId) || null;
    return {
      ...lead,
      ...buildLeadAttribution(lead, campaign),
      campaignId,
      assignedTo: lead.assignedTo || lead.owner,
      followUps: clone(leadFollowUpSeed[lead.id] || abcLeadFollowUps[lead.id] || []),
      notesLog: [
        {
          id: `${lead.id}-N1`,
          note: lead.notes,
          date: String(lead.createdAt).slice(0, 10),
          by: lead.owner,
        },
      ],
      history: [
        {
          id: `${lead.id}-H1`,
          type: 'Created',
          text: `Enquiry captured from ${lead.source.toLowerCase()}`,
          date: String(lead.createdAt).slice(0, 10),
          by: lead.owner,
        },
      ],
    };
  });

  const customers = clone([...seedCustomers, abcCustomer]).map((customer) => ({ ...customer, status: customer.status || 'Active' }));

  const contacts = [
    ...customers
      .filter((customer) => customer.id !== ABC_CUSTOMER_ID)
      .map((customer, index) => ({
        id: `CT-${String(index + 1).padStart(3, '0')}`,
        customerId: customer.id,
        name: customer.contact,
        title: 'Primary contact',
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        primary: true,
      })),
    ...clone(abcContacts),
  ];

  const quotes = [...abcQuotations, ...seedQuotations].map((quote) => {
    const discountPercent = QUOTE_DISCOUNTS[quote.id] || 0;
    const totals = quotationTotals(quote.items, discountPercent);
    const enriched = { ...quote, ...totals };
    return {
      ...enriched,
      campaignId: CAMPAIGN_BY_QUOTE[quote.id] ?? quote.campaignId ?? null,
      specs: QUOTE_SPECS[quote.id] || quoteSpecFallback(quote),
      ...buildRevisions(enriched),
    };
  });

  const orders = [abcOrder, ...seedOrders].map((order) => {
    const payment = buildOrderPayment(order);
    return {
      ...order,
      value: Number(order.value) || orderValue(order.items || []),
      campaignId: CAMPAIGN_BY_ORDER[order.id] ?? CAMPAIGN_BY_CUSTOMER[order.customerId] ?? null,
      quoteId: order.quoteId || null,
      payment:
        order.customerId === ABC_CUSTOMER_ID
          ? { paid: 0, paymentStatus: 'Unpaid', paymentMethod: '—', payments: [] }
          : payment,
      delivery: buildDelivery(order),
      timeline: buildOrderTimeline(order),
    };
  });

  const confirmedStatuses = ['Confirmed', 'Prepress', 'In production', 'QC', 'Dispatched', 'Delivered', 'Completed'];
  const leadsWithValues = leads.map((lead) => {
    const quote = lead.quoteId ? quotes.find((entry) => entry.id === lead.quoteId) : null;
    const order =
      orders.find((entry) => entry.quoteId && entry.quoteId === lead.quoteId) ||
      orders.find((entry) => entry.customer === lead.company);
    const confirmed = order && confirmedStatuses.includes(order.status) ? order.value : 0;
    return {
      ...lead,
      quoteValue: quote ? quote.total : 0,
      confirmedOrderValue: confirmed,
      sourceChannel: lead.sourceChannel || normalizeSource(lead.source),
    };
  });

  const production = [abcProductionJob, ...seedProductionJobs].map((job) => {
    const stage = JOB_STAGE_OVERRIDE[job.id] || 'Pending';
    return {
      ...job,
      stage,
      progress: STAGE_PROGRESS[stage],
      deadline: job.due,
      assignedTo: job.operator,
      checklist: buildChecklist(stage),
      updated: today(),
    };
  });

  const artwork = [abcArtwork, ...seedArtworkJobs].map((job) => {
    const versionNumber = Number(String(job.version).replace('v', '')) || 1;
    const versions = Array.from({ length: versionNumber }, (_, index) => ({
      version: `v${index + 1}`,
      date: addDaysISO(String(job.submitted).slice(0, 10), -7 * (versionNumber - index - 1)),
      status: index === versionNumber - 1 ? job.status : 'Superseded',
      note:
        index === versionNumber - 1
          ? job.notes
          : `Version v${index + 1} reviewed and superseded`,
      by: job.designer,
    }));
    const proofStatus =
      job.status === 'Approved' ? 'Approved' : job.status === 'In review' ? 'Sent' : job.status === 'Changes requested' ? 'Rejected' : 'Not sent';
    return { ...job, versions, proofStatus };
  });

  const inventory = [
    ...clone(seedInventory).map((item) => ({ ...item, itemType: 'Raw material' })),
    ...clone(finishedGoodsSeed),
  ];

  const landingPages = seedLandingPages.map((page) => {
    const extras = clone(landingPageExtrasSeed[page.id] || {});
    return {
      ...page,
      sections: extras.sections || [],
      form: extras.form || { title: page.title, submitLabel: 'Submit enquiry', successMessage: 'Thanks — our team will contact you within one business day.', fields: [] },
      utm: extras.utm || { source: 'direct', medium: 'organic', campaign: page.slug.replace('/lp/', '') },
      formSubmissions: extras.formSubmissions || 0,
      publishedAt: page.status === 'Published' ? page.updated : null,
    };
  });

  return {
    leads: leadsWithValues,
    contacts,
    customers,
    quotes,
    orders,
    production,
    artwork,
    inventory,
    stockMovements: clone([...abcStockMovements, ...stockMovementsSeed]),
    suppliers: clone(seedSuppliers),
    purchaseOrders: clone(seedPurchaseOrders),
    employees: clone(seedEmployees),
    leaves: clone(seedLeaveRequests),
    attendance: clone(seedAttendance),
    employeeTasks: clone(employeeTasksSeed),
    salaryRecords: clone(salaryRecordsSeed),
    invoices: clone([...abcInvoices, ...seedInvoices]),
    financeTransactions: clone(financeTransactionsSeed),
    campaigns: clone(seedCampaigns).map((campaign) => ({
      ...campaign,
      objective: campaign.objective || 'Qualified packaging enquiries',
      owner: 'Pine & Pixel',
      agencyManaged: true,
    })),
    agencyProfile: clone(agencyProfileSeed),
    agencyFees: clone(agencyFeesSeed),
    agencyBriefs: clone(seedAgencyBriefs),
    campaignExpenses: clone(campaignExpensesSeed),
    cms: clone(cmsSeed),
    cmsPages: clone(cmsPagesSeed).map((page) => ({
      ...page,
      sections: clone(pageSectionsSeed[page.slug] || []),
    })),
    cmsBanners: clone(cmsBannersSeed),
    cmsServices: clone(cmsServicesSeed),
    cmsTestimonials: clone(cmsTestimonialsSeed),
    cmsBlogs: clone(cmsBlogsSeed),
    cmsMedia: clone(cmsMediaSeed),
    cmsProducts: clone(cmsProductsSeed),
    landingPages,
    reportSchedules: clone(reportSchedulesSeed),
    supportEnquiries: clone(portalSupportSeed),
    notifications: clone([...portalNotificationSeed, ...notificationsSeed]),
    activity: clone(activityFeed),
    tasks: clone(tasksSeed),
    settings: clone(settingsSeed),
  };
};

const initialData = buildInitialData();

const activityEntry = (action, tone = 'system') => ({
  id: uid('AC'),
  initials: currentUser.initials,
  name: currentUser.name,
  action,
  time: nowISO(),
  tone,
});

const notificationEntry = (title, body, type = 'system', href) => ({
  id: uid('NT'),
  title,
  body,
  time: nowISO(),
  type,
  read: false,
  href,
});

const campaignSpendFor = (state, campaignId) =>
  state.campaignExpenses.filter((expense) => expense.campaignId === campaignId).reduce((sum, expense) => sum + expense.amount, 0);

const appendOrderEvent = (get, orderId, label, note) => {
  const order = get().orders.find((entry) => entry.id === orderId);
  if (!order) return;
  get().updateOrder(orderId, {
    timeline: [
      ...(order.timeline || []),
      { id: uid(`${orderId}-TL`), label, note, date: today(), done: true },
    ],
  });
};

export const useDemoStore = create((set, get) => ({
  ...clone(initialData),
  hydrated: true,

  /* ---------------------------- CRM ---------------------------- */

  addLead: (payload) => {
    seqs.lead += 1;
    const id = `LD-${seqs.lead}`;
    const attribution = buildLeadAttribution(
      {
        ...payload,
        source: payload.source || payload.sourceChannel || 'Website',
        sourceDetail: payload.sourceDetail || payload.sourceChannel || payload.source || 'Website',
        originalSource: payload.originalSource || payload.source || payload.sourceChannel || 'Website',
      },
      null
    );
    const lead = {
      id,
      company: payload.company || 'New enquiry',
      contact: payload.contact || payload.name || 'Website visitor',
      title: payload.title || 'Enquiry',
      email: payload.email || '',
      phone: payload.phone || '',
      city: payload.city || '—',
      source: payload.source || 'Website',
      ...attribution,
      product: payload.product || 'Custom packaging',
      quantity: payload.quantity || 'To be confirmed',
      value: Number(payload.value) || 0,
      quoteValue: Number(payload.quoteValue) || 0,
      confirmedOrderValue: 0,
      stage: payload.stage || 'New',
      owner: payload.owner || 'Neha Joshi',
      assignedTo: payload.assignedTo || payload.owner || 'Neha Joshi',
      score: Number(payload.score) || 72,
      campaignId: payload.campaignId || null,
      createdAt: nowISO(),
      nextAction: payload.nextAction || 'Qualify · within 24 hours',
      notes: payload.notes || payload.message || 'New enquiry submitted through the website.',
      reference: payload.reference || `RFQ-2026-${String(seqs.lead + 900).padStart(4, '0')}`,
      followUps: [],
      notesLog: [
        {
          id: `${id}-N1`,
          note: payload.notes || payload.message || 'New enquiry submitted through the website.',
          date: today(),
          by: payload.owner || 'Neha Joshi',
        },
      ],
      history: [
        { id: `${id}-H1`, type: 'Created', text: `Enquiry captured from ${payload.source || 'Website'}`, date: today(), by: payload.owner || 'Neha Joshi' },
      ],
    };
    set((state) => ({
      leads: [lead, ...state.leads],
      notifications: [
        notificationEntry(`New RFQ from ${lead.company}`, `${lead.quantity} · ${lead.product}`, 'lead', '/admin/leads'),
        ...state.notifications,
      ],
      activity: [activityEntry(`received a new RFQ from ${lead.company}`, 'lead'), ...state.activity],
    }));
    return lead;
  },

  updateLead: (id, patch) =>
    set((state) => ({
      leads: state.leads.map((lead) => {
        if (lead.id !== id) return lead;
        return {
          ...lead,
          ...patch,
          assignedTo: patch.owner || lead.assignedTo,
          source: lead.source,
          sourceChannel: lead.sourceChannel,
          originalSource: lead.originalSource,
          sourceDetail: lead.sourceDetail,
          campaignName: lead.campaignName,
          utmSource: lead.utmSource,
          utmMedium: lead.utmMedium,
          utmCampaign: lead.utmCampaign,
          utmContent: lead.utmContent,
          landingPage: lead.landingPage,
          referrer: lead.referrer,
        };
      }),
    })),

  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id),
      activity: [activityEntry(`deleted lead ${id}`, 'lead'), ...state.activity],
    })),

  updateLeadStage: (id, stage) =>
    set((state) => ({
      leads: state.leads.map((lead) => {
        if (lead.id !== id) return lead;
        return {
          ...lead,
          stage,
          nextAction: stage === 'Won' ? 'Handover to key accounts' : lead.nextAction,
          history: [
            { id: uid(`${id}-H`), type: 'Stage', text: `Stage moved to ${stage}`, date: today(), by: currentUser.name },
            ...(lead.history || []),
          ],
        };
      }),
      activity: [activityEntry(`moved a lead to ${stage}`, 'lead'), ...state.activity],
    })),

  assignLead: (id, owner) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              owner,
              history: [
                { id: uid(`${id}-H`), type: 'Assignment', text: `Owner reassigned to ${owner}`, date: today(), by: currentUser.name },
                ...(lead.history || []),
              ],
            }
          : lead
      ),
      activity: [activityEntry(`reassigned a lead to ${owner}`, 'lead'), ...state.activity],
    })),

  addLeadNote: (id, note) =>
    set((state) => ({
      leads: state.leads.map((lead) => {
        if (lead.id !== id) return lead;
        return {
          ...lead,
          notesLog: [{ id: uid(`${id}-N`), note, date: today(), by: currentUser.name }, ...(lead.notesLog || [])],
          history: [{ id: uid(`${id}-H`), type: 'Note', text: note, date: today(), by: currentUser.name }, ...(lead.history || [])],
        };
      }),
    })),

  addFollowUp: (id, payload) =>
    set((state) => ({
      leads: state.leads.map((lead) => {
        if (lead.id !== id) return lead;
        seqs.followUp += 1;
        const followUp = {
          id: `FU-${String(seqs.followUp).padStart(2, '0')}`,
          date: payload.date || today(),
          note: payload.note,
          owner: payload.owner || currentUser.name,
          status: 'Open',
        };
        return {
          ...lead,
          followUps: [followUp, ...(lead.followUps || [])],
          history: [{ id: uid(`${id}-H`), type: 'Follow-up', text: `Follow-up scheduled for ${followUp.date}`, date: today(), by: currentUser.name }, ...(lead.history || [])],
        };
      }),
    })),

  toggleFollowUp: (leadId, followId) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === leadId
          ? { ...lead, followUps: (lead.followUps || []).map((f) => (f.id === followId ? { ...f, status: f.status === 'Open' ? 'Done' : 'Open' } : f)) }
          : lead
      ),
    })),

  deleteFollowUp: (leadId, followId) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === leadId ? { ...lead, followUps: (lead.followUps || []).filter((f) => f.id !== followId) } : lead
      ),
    })),

  addCustomer: (payload) => get().saveCustomer(payload),

  saveCustomer: (payload) => {
    if (payload.id) {
      let saved = null;
      set((state) => ({
        customers: state.customers.map((customer) => {
          if (customer.id !== payload.id) return customer;
          saved = { ...customer, ...payload };
          return saved;
        }),
      }));
      return saved;
    }
    seqs.customer += 1;
    const customer = {
      id: `CUS-${String(seqs.customer).padStart(3, '0')}`,
      company: payload.company,
      contact: payload.contact,
      email: payload.email,
      phone: payload.phone,
      city: payload.city || 'Mumbai',
      segment: payload.segment || 'Retail',
      since: today(),
      lifetimeValue: Number(payload.lifetimeValue) || 0,
      openOrders: 0,
      status: payload.status || 'Active',
      paymentTerms: payload.paymentTerms || 'Net 30',
      gstin: payload.gstin || '—',
      owner: payload.owner || 'Neha Joshi',
      health: payload.health || 'Good',
      ordersCount: 0,
    };
    set((state) => ({ customers: [customer, ...state.customers] }));
    return customer;
  },

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
      contacts: state.contacts.filter((contact) => contact.customerId !== id),
    })),

  saveContact: (payload) => {
    if (payload.id) {
      set((state) => ({
        contacts: state.contacts.map((contact) => (contact.id === payload.id ? { ...contact, ...payload } : contact)),
      }));
      return payload;
    }
    seqs.contact += 1;
    const contact = {
      id: `CT-${String(seqs.contact).padStart(3, '0')}`,
      customerId: payload.customerId,
      name: payload.name,
      title: payload.title || 'Contact',
      email: payload.email || '',
      phone: payload.phone || '',
      city: payload.city || '',
      primary: Boolean(payload.primary),
    };
    set((state) => ({ contacts: [contact, ...state.contacts] }));
    return contact;
  },

  deleteContact: (id) =>
    set((state) => ({ contacts: state.contacts.filter((contact) => contact.id !== id) })),

  /* -------------------------- Quotations ------------------------ */

  addQuote: (payload) => {
    seqs.quote += 1;
    const items = (payload.items || []).map((item) => ({
      description: item.description || 'Packaging item',
      qty: Number(item.qty) || 0,
      rate: Number(item.rate) || 0,
    }));
    const totals = quotationTotals(items, payload.discountPercent);
    const quote = {
      id: `QT-2026-${seqs.quote}`,
      customerId: payload.customerId || null,
      customer: payload.customer,
      contact: payload.contact || '—',
      date: today(),
      validUntil: payload.validUntil || addDaysISO(today(), 14),
      status: payload.status || 'Draft',
      owner: payload.owner || currentUser.name,
      probability: Number(payload.probability) || 50,
      campaignId: payload.campaignId || CAMPAIGN_BY_CUSTOMER[payload.customerId] || null,
      items,
      specs: payload.specs || quoteSpecFallback({ items }),
      ...totals,
      revision: 1,
      revisions: [
        { id: `QT-2026-${seqs.quote}-R1`, version: 1, date: today(), total: totals.total, status: 'Draft', note: 'Initial draft', by: payload.owner || currentUser.name },
      ],
    };
    set((state) => ({
      quotes: [quote, ...state.quotes],
      activity: [activityEntry(`created quotation ${quote.id} for ${quote.customer}`, 'commercial'), ...state.activity],
    }));
    return quote;
  },

  updateQuote: (id, patch) =>
    set((state) => ({
      quotes: state.quotes.map((quote) => {
        if (quote.id !== id) return quote;
        const next = { ...quote, ...patch };
        if (patch.items || patch.discountPercent !== undefined) {
          const totals = quotationTotals(next.items, next.discountPercent);
          return { ...next, ...totals };
        }
        return next;
      }),
    })),

  addQuoteRevision: (id, payload) =>
    set((state) => ({
      quotes: state.quotes.map((quote) => {
        if (quote.id !== id) return quote;
        const items = payload.items || quote.items;
        const totals = quotationTotals(items, payload.discountPercent ?? quote.discountPercent);
        const nextRevision = (quote.revision || 1) + 1;
        const history = (quote.revisions || []).map((revision) =>
          revision.status === 'Current' || revision.status === 'Draft' ? { ...revision, status: 'Superseded' } : revision
        );
        return {
          ...quote,
          items,
          discountPercent: payload.discountPercent ?? quote.discountPercent,
          validUntil: payload.validUntil || quote.validUntil,
          ...totals,
          revision: nextRevision,
          status: 'Draft',
          revisions: [
            ...history,
            {
              id: `${quote.id}-R${nextRevision}`,
              version: nextRevision,
              date: today(),
              total: totals.total,
              status: 'Draft',
              note: payload.note || 'Commercial revision',
              by: currentUser.name,
            },
          ],
        };
      }),
    })),

  deleteQuote: (id) =>
    set((state) => ({ quotes: state.quotes.filter((quote) => quote.id !== id) })),

  updateQuoteStatus: (id, status) =>
    set((state) => ({
      quotes: state.quotes.map((quote) => (quote.id === id ? { ...quote, status } : quote)),
      activity: [activityEntry(`marked a quotation as ${status.toLowerCase()}`, 'commercial'), ...state.activity],
    })),

  /* ---------------------------- Orders -------------------------- */

  addOrder: (payload) => {
    const items = payload.items || [];
    seqs.order += 1;
    const order = {
      id: payload.id || `SO-2026-${seqs.order}`,
      customerId: payload.customerId || null,
      customer: payload.customer,
      contact: payload.contact || '—',
      items,
      status: payload.status || 'Confirmed',
      dueDate: payload.dueDate || addDaysISO(today(), 21),
      priority: payload.priority || 'Medium',
      progress: payload.progress ?? 8,
      owner: payload.owner || currentUser.name,
      createdAt: today(),
      shipTo: payload.shipTo || '—',
      poNumber: payload.poNumber || `PO/26/${String(seqs.order).padStart(4, '0')}`,
      value: orderValue(items),
      quoteId: payload.quoteId || null,
      campaignId: payload.campaignId || CAMPAIGN_BY_CUSTOMER[payload.customerId] || null,
      payment: { paid: 0, paymentStatus: 'Unpaid', paymentMethod: '—', payments: [] },
      delivery: { status: 'Pending dispatch', carrier: '—', tracking: '—', dispatchedOn: null, deliveredOn: null, address: payload.shipTo || '—' },
      timeline: [],
    };
    order.timeline = buildOrderTimeline(order);
    set((state) => ({
      orders: [order, ...state.orders],
      activity: [activityEntry(`created order ${order.id} for ${order.customer}`, 'commercial'), ...state.activity],
    }));
    return order;
  },

  convertQuoteToOrder: (quoteId, extra = {}) => {
    const state = get();
    const quote = state.quotes.find((entry) => entry.id === quoteId);
    if (!quote) return null;
    const existing = state.orders.find((order) => order.quoteId === quoteId);
    if (existing) return existing;
    const order = get().addOrder({
      customerId: quote.customerId,
      customer: quote.customer,
      contact: quote.contact,
      items: quote.items,
      status: 'Confirmed',
      dueDate: addDaysISO(today(), 21),
      priority: extra.priority || 'High',
      owner: quote.owner,
      shipTo: extra.shipTo || 'To be confirmed by customer',
      poNumber: extra.poNumber,
      quoteId: quote.id,
      campaignId: quote.campaignId,
    });
    set((current) => ({
      quotes: current.quotes.map((entry) => (entry.id === quoteId ? { ...entry, status: 'Accepted' } : entry)),
      notifications: [
        notificationEntry('Quotation accepted', `${quote.id} converted to ${order.id}`, 'order', '/admin/orders'),
        ...current.notifications,
      ],
    }));
    return order;
  },

  updateOrder: (id, patch) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === id ? { ...order, ...patch } : order)),
    })),

  deleteOrder: (id) =>
    set((state) => ({ orders: state.orders.filter((order) => order.id !== id) })),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== id) return order;
        const progressByStatus = {
          Confirmed: 8,
          Prepress: 20,
          'In production': 55,
          QC: 88,
          Dispatched: 100,
          Delivered: 100,
          'On hold': order.progress,
        };
        const updated = { ...order, status, progress: progressByStatus[status] ?? order.progress };
        if (status === 'Dispatched' || status === 'Delivered') {
          updated.delivery = buildDelivery({ ...updated, status });
        }
        if (status === 'Delivered') {
          updated.payment = { ...order.payment, paid: order.value, paymentStatus: 'Paid' };
        }
        const eventLabel = {
          Confirmed: 'Confirmed',
          Prepress: 'Prepress',
          'In production': 'Production',
          QC: 'Quality check',
          Dispatched: 'Dispatched',
          Delivered: 'Delivered',
          'On hold': 'On hold',
        }[status];
        updated.timeline = [
          ...(order.timeline || []),
          { id: uid(`${id}-TL`), label: eventLabel, note: `Status updated to ${status}`, date: today(), done: true },
        ];
        return updated;
      }),
      activity: [activityEntry(`updated an order to ${status}`, 'order'), ...state.activity],
    })),

  recordOrderPayment: (id, amount, method = 'NEFT') => {
    const order = get().orders.find((entry) => entry.id === id);
    if (!order) return null;
    const applied = Math.min(Math.max(0, Number(amount) || 0), Math.max(0, order.value - order.payment.paid));
    if (!applied) return null;
    const paid = order.payment.paid + applied;
    const paymentStatus = paid >= order.value ? 'Paid' : 'Part paid';
    seqs.transaction += 1;
    const transaction = {
      id: `TX-${seqs.transaction}`,
      date: today(),
      type: 'Income',
      category: 'Customer receipt',
      description: `${order.customer} · payment against ${order.id}`,
      amount: applied,
      reference: order.id,
      status: 'Cleared',
    };
    set((state) => ({
      orders: state.orders.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              payment: {
                ...entry.payment,
                paid,
                paymentStatus,
                paymentMethod: method,
                payments: [
                  ...(entry.payment.payments || []),
                  { id: uid(`${id}-P`), amount: applied, date: today(), method, reference: `RCPT-${seqs.transaction}` },
                ],
              },
              timeline: [...entry.timeline, { id: uid(`${id}-TL`), label: 'Payment received', note: `${method} · ₹${applied.toLocaleString('en-IN')}`, date: today(), done: true }],
            }
          : entry
      ),
      financeTransactions: [transaction, ...state.financeTransactions],
    }));
    return transaction;
  },

  repeatOrder: (id) => {
    const order = get().orders.find((entry) => entry.id === id);
    if (!order) return null;
    return get().addOrder({
      customerId: order.customerId,
      customer: order.customer,
      contact: order.contact,
      items: clone(order.items),
      status: 'Confirmed',
      dueDate: addDaysISO(today(), 21),
      priority: order.priority,
      owner: order.owner,
      shipTo: order.shipTo,
      poNumber: `PO/26/REPEAT-${String(order.id).slice(-4)}`,
      campaignId: order.campaignId,
    });
  },

  /* -------------------------- Production ------------------------ */

  addProductionJob: (payload) => {
    seqs.job += 1;
    const stage = payload.stage || 'Pending';
    const job = {
      id: `JOB-${seqs.job}`,
      orderId: payload.orderId || '—',
      customer: payload.customer,
      product: payload.product,
      quantity: Number(payload.quantity) || 0,
      stage,
      machine: payload.machine || 'Unassigned',
      operator: payload.operator || 'Unassigned',
      assignedTo: payload.assignedTo || payload.operator || 'Unassigned',
      progress: STAGE_PROGRESS[stage] || 5,
      due: payload.due || addDaysISO(today(), 14),
      deadline: payload.deadline || payload.due || addDaysISO(today(), 14),
      priority: payload.priority || 'Medium',
      shift: payload.shift || 'A',
      checklist: buildChecklist(stage),
      updated: today(),
      notes: payload.notes || '',
    };
    set((state) => ({ production: [job, ...state.production] }));
    return job;
  },

  updateProductionJob: (id, patch) =>
    set((state) => ({
      production: state.production.map((job) => (job.id === id ? { ...job, ...patch, updated: today() } : job)),
    })),

  deleteProductionJob: (id) =>
    set((state) => ({ production: state.production.filter((job) => job.id !== id) })),

  moveJob: (id, stage) =>
    set((state) => ({
      production: state.production.map((job) => {
        if (job.id !== id) return job;
        return {
          ...job,
          stage,
          progress: STAGE_PROGRESS[stage] ?? job.progress,
          checklist: buildChecklist(stage),
          updated: today(),
        };
      }),
      activity: [activityEntry(`moved a job to ${stage}`, 'production'), ...state.activity],
    })),

  toggleJobChecklist: (id, itemId) =>
    set((state) => ({
      production: state.production.map((job) =>
        job.id === id
          ? { ...job, checklist: job.checklist.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)) }
          : job
      ),
    })),

  /* --------------------------- Artwork -------------------------- */

  updateArtworkStatus: (id, status, note) =>
    set((state) => ({
      artwork: state.artwork.map((job) =>
        job.id === id
          ? {
              ...job,
              status,
              proofStatus: status === 'Approved' ? 'Approved' : status === 'Changes requested' ? 'Rejected' : job.proofStatus,
              notes: note ? `${job.notes} · ${note}` : job.notes,
            }
          : job
      ),
    })),

  setProofStatus: (id, proofStatus) =>
    set((state) => ({
      artwork: state.artwork.map((job) => (job.id === id ? { ...job, proofStatus } : job)),
    })),

  updateArtwork: (id, patch) =>
    set((state) => ({
      artwork: state.artwork.map((job) => (job.id === id ? { ...job, ...patch } : job)),
    })),

  uploadArtworkVersion: (id, payload = {}) =>
    set((state) => ({
      artwork: state.artwork.map((job) => {
        if (job.id !== id) return job;
        const nextNumber = (Number(String(job.version).replace('v', '')) || 1) + 1;
        const nextVersion = `v${nextNumber}`;
        const versions = (job.versions || []).map((version) =>
          version.version === job.version ? { ...version, status: 'Superseded' } : version
        );
        return {
          ...job,
          version: nextVersion,
          status: 'In review',
          proofStatus: 'Not sent',
          submitted: nowISO(),
          notes: payload.note || `Version ${nextVersion} uploaded for review.`,
          versions: [
            ...versions,
            { version: nextVersion, date: today(), status: 'In review', note: payload.note || `Version ${nextVersion} uploaded`, by: payload.by || job.designer },
          ],
        };
      }),
    })),

  addArtwork: (payload) => {
    seqs.artwork += 1;
    const job = {
      id: `ART-${seqs.artwork}`,
      orderId: payload.orderId || '—',
      customer: payload.customer,
      product: payload.product,
      version: 'v1',
      designer: payload.designer || currentUser.name,
      status: 'Awaiting file',
      proofStatus: 'Not sent',
      submitted: nowISO(),
      due: payload.due || addDaysISO(today(), 7),
      fileType: payload.fileType || 'Awaiting',
      colours: payload.colours || 'CMYK',
      notes: payload.notes || 'New artwork request created.',
      preview: payload.preview || '/images/folding-cartons.jpg',
      versions: [{ version: 'v1', date: today(), status: 'Awaiting file', note: payload.notes || 'Artwork requested', by: payload.designer || currentUser.name }],
    };
    set((state) => ({ artwork: [job, ...state.artwork] }));
    return job;
  },

  deleteArtwork: (id) =>
    set((state) => ({ artwork: state.artwork.filter((job) => job.id !== id) })),

  /* --------------------------- Inventory ------------------------ */

  saveInventoryItem: (payload) => {
    if (payload.id) {
      let saved = null;
      set((state) => ({
        inventory: state.inventory.map((item) => {
          if (item.id !== payload.id) return item;
          saved = { ...item, ...payload };
          return saved;
        }),
      }));
      return saved;
    }
    const finished = payload.itemType === 'Finished goods';
    if (finished) seqs.fg += 1;
    else seqs.sku += 1;
    const item = {
      id: finished ? `FG-${seqs.fg}` : `SKU-${seqs.sku}`,
      name: payload.name,
      category: payload.category || (finished ? 'Finished goods' : 'Paper & board'),
      itemType: finished ? 'Finished goods' : 'Raw material',
      unit: payload.unit || 'pcs',
      onHand: Number(payload.onHand) || 0,
      allocated: Number(payload.allocated) || 0,
      reorder: Number(payload.reorder) || 0,
      unitCost: Number(payload.unitCost) || 0,
      supplier: payload.supplier || (finished ? 'In-house production' : '—'),
      warehouse: payload.warehouse || 'Mumbai Plant 1',
      leadTime: Number(payload.leadTime) || 0,
    };
    set((state) => ({ inventory: [item, ...state.inventory] }));
    return item;
  },

  deleteInventoryItem: (id) =>
    set((state) => ({ inventory: state.inventory.filter((item) => item.id !== id) })),

  adjustStock: (id, delta, note) => {
    const item = get().inventory.find((entry) => entry.id === id);
    if (!item) return;
    const qty = Number(delta) || 0;
    seqs.movement += 1;
    const movement = {
      id: `SM-${seqs.movement}`,
      skuId: item.id,
      sku: item.name,
      type: qty >= 0 ? 'Inward' : 'Outward',
      qty: Math.abs(qty),
      unit: item.unit,
      date: today(),
      reference: note || 'Manual stock adjustment',
      jobId: null,
      balance: Math.max(0, item.onHand + qty),
    };
    set((state) => ({
      inventory: state.inventory.map((entry) =>
        entry.id === id ? { ...entry, onHand: Math.max(0, entry.onHand + qty), lastNote: note } : entry
      ),
      stockMovements: [movement, ...state.stockMovements],
    }));
    return movement;
  },

  consumeForJob: (jobId, skuId, qty) => {
    const item = get().inventory.find((entry) => entry.id === skuId);
    if (!item) return null;
    const job = get().production.find((entry) => entry.id === jobId);
    seqs.movement += 1;
    const movement = {
      id: `SM-${seqs.movement}`,
      skuId: item.id,
      sku: item.name,
      type: 'Consumption',
      qty: Number(qty) || 0,
      unit: item.unit,
      date: today(),
      reference: `${jobId} material issue`,
      jobId,
      balance: Math.max(0, item.onHand - Number(qty)),
    };
    set((state) => ({
      inventory: state.inventory.map((entry) =>
        entry.id === skuId ? { ...entry, onHand: Math.max(0, entry.onHand - Number(qty)), allocated: Math.max(0, entry.allocated - Number(qty)) } : entry
      ),
      stockMovements: [movement, ...state.stockMovements],
      activity: [activityEntry(`issued material to ${jobId}${job ? ` for ${job.customer}` : ''}`, 'inventory'), ...state.activity],
    }));
    return movement;
  },

  /* -------------------------- Purchasing ------------------------ */

  receivePurchaseOrder: (id) =>
    set((state) => {
      const po = state.purchaseOrders.find((entry) => entry.id === id);
      if (!po || po.status === 'Received') return {};
      const supplierItem = state.inventory.find((item) => item.supplier === po.supplier);
      const numericGroups = String(po.items).match(/[\d,]+/g) || [];
      const parsedQty = Number((numericGroups[numericGroups.length - 1] || '0').replace(/,/g, '')) || 0;
      const movements = supplierItem && parsedQty
        ? [
            {
              id: `SM-${seqs.movement + 1}`,
              skuId: supplierItem.id,
              sku: supplierItem.name,
              type: 'Inward',
              qty: Math.min(parsedQty, 100000),
              unit: supplierItem.unit,
              date: today(),
              reference: `${po.id} goods receipt · ${po.supplier}`,
              jobId: null,
              balance: supplierItem.onHand + Math.min(parsedQty, 100000),
            },
          ]
        : [];
      if (movements.length) seqs.movement += 1;
      return {
        purchaseOrders: state.purchaseOrders.map((entry) => (entry.id === id ? { ...entry, status: 'Received' } : entry)),
        inventory: supplierItem && movements.length
          ? state.inventory.map((item) => (item.id === supplierItem.id ? { ...item, onHand: item.onHand + movements[0].qty } : item))
          : state.inventory,
        stockMovements: [...movements, ...state.stockMovements],
      };
    }),

  savePurchaseOrder: (payload) => {
    if (payload.id) {
      let saved = null;
      set((state) => ({
        purchaseOrders: state.purchaseOrders.map((po) => {
          if (po.id !== payload.id) return po;
          saved = { ...po, ...payload };
          return saved;
        }),
      }));
      return saved;
    }
    seqs.po += 1;
    const po = {
      id: `PO-2026-${seqs.po}`,
      supplier: payload.supplier,
      items: payload.items,
      value: Number(payload.value) || 0,
      issued: today(),
      expected: payload.expected || addDaysISO(today(), 10),
      status: payload.status || 'Sent',
      owner: payload.owner || currentUser.name,
    };
    set((state) => ({ purchaseOrders: [po, ...state.purchaseOrders] }));
    return po;
  },

  deletePurchaseOrder: (id) =>
    set((state) => ({ purchaseOrders: state.purchaseOrders.filter((po) => po.id !== id) })),

  saveSupplier: (payload) => {
    if (payload.id) {
      let saved = null;
      set((state) => ({
        suppliers: state.suppliers.map((supplier) => {
          if (supplier.id !== payload.id) return supplier;
          saved = { ...supplier, ...payload };
          return saved;
        }),
      }));
      return saved;
    }
    seqs.supplier += 1;
    const supplier = {
      id: `SUP-${String(seqs.supplier).padStart(3, '0')}`,
      name: payload.name,
      category: payload.category || 'Paper & board',
      contact: payload.contact || '—',
      email: payload.email || '',
      phone: payload.phone || '',
      city: payload.city || '',
      rating: Number(payload.rating) || 4,
      leadTime: Number(payload.leadTime) || 7,
      paymentTerms: payload.paymentTerms || 'Net 30',
      openPOs: 0,
      status: 'Active',
      gstin: payload.gstin || '—',
    };
    set((state) => ({ suppliers: [supplier, ...state.suppliers] }));
    return supplier;
  },

  deleteSupplier: (id) =>
    set((state) => ({ suppliers: state.suppliers.filter((supplier) => supplier.id !== id) })),

  /* ----------------------------- HR ----------------------------- */

  addEmployee: (payload) => get().saveEmployee(payload),

  saveEmployee: (payload) => {
    if (payload.id) {
      let saved = null;
      set((state) => ({
        employees: state.employees.map((employee) => {
          if (employee.id !== payload.id) return employee;
          saved = { ...employee, ...payload };
          return saved;
        }),
      }));
      return saved;
    }
    seqs.employee += 1;
    const initials = (payload.name || 'New Employee')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const employee = {
      id: `EMP-${String(seqs.employee).padStart(3, '0')}`,
      name: payload.name,
      role: payload.role,
      department: payload.department || 'Production',
      shift: payload.shift || 'General',
      status: payload.status || 'Present',
      joined: payload.joined || today(),
      phone: payload.phone || '—',
      email: payload.email || '—',
      initials,
    };
    set((state) => ({ employees: [employee, ...state.employees] }));
    return employee;
  },

  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((employee) => employee.id !== id),
      employeeTasks: state.employeeTasks.filter((task) => task.employeeId !== id),
      salaryRecords: state.salaryRecords.filter((record) => record.employeeId !== id),
    })),

  decideLeave: (id, status) =>
    set((state) => ({
      leaves: state.leaves.map((leave) => (leave.id === id ? { ...leave, status } : leave)),
    })),

  addLeaveRequest: (payload) => {
    seqs.leave += 1;
    const leave = {
      id: `LR-${String(seqs.leave).padStart(3, '0')}`,
      employee: payload.employee,
      initials: payload.initials || payload.employee.split(' ').map((p) => p[0]).join('').slice(0, 2),
      type: payload.type || 'Casual leave',
      dates: payload.dates,
      days: Number(payload.days) || 1,
      reason: payload.reason || '—',
      status: payload.status || 'Pending',
    };
    set((state) => ({ leaves: [leave, ...state.leaves] }));
    return leave;
  },

  markAttendance: (id, status) =>
    set((state) => {
      const employee = state.employees.find((entry) => entry.id === id);
      if (!employee) return {};
      const attendance = { ...state.attendance };
      const adjust = (value, delta) => Math.max(0, value + delta);
      if (employee.status === 'Present') attendance.present = adjust(attendance.present, -1);
      if (employee.status === 'On leave') attendance.onLeave = adjust(attendance.onLeave, -1);
      if (employee.status === 'Remote') attendance.remote = adjust(attendance.remote, -1);
      if (status === 'Present') attendance.present = adjust(attendance.present, 1);
      if (status === 'On leave') attendance.onLeave = adjust(attendance.onLeave, 1);
      if (status === 'Remote') attendance.remote = adjust(attendance.remote, 1);
      return {
        employees: state.employees.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
        attendance,
      };
    }),

  addEmployeeTask: (payload) => {
    seqs.employeeTask += 1;
    const task = {
      id: `ET-${String(seqs.employeeTask).padStart(2, '0')}`,
      employee: payload.employee,
      employeeId: payload.employeeId,
      title: payload.title,
      due: payload.due || today(),
      priority: payload.priority || 'Medium',
      status: payload.status || 'Open',
    };
    set((state) => ({ employeeTasks: [task, ...state.employeeTasks] }));
    return task;
  },

  toggleEmployeeTask: (id) =>
    set((state) => ({
      employeeTasks: state.employeeTasks.map((task) =>
        task.id === id ? { ...task, status: task.status === 'Done' ? 'Open' : 'Done' } : task
      ),
    })),

  deleteEmployeeTask: (id) =>
    set((state) => ({ employeeTasks: state.employeeTasks.filter((task) => task.id !== id) })),

  processSalary: (id) =>
    set((state) => ({
      salaryRecords: state.salaryRecords.map((record) => (record.id === id ? { ...record, status: 'Processed' } : record)),
    })),

  addSalaryRecord: (payload) => {
    seqs.salary += 1;
    const record = {
      id: `SAL-${String(seqs.salary).padStart(2, '0')}`,
      employeeId: payload.employeeId,
      employee: payload.employee,
      role: payload.role,
      month: payload.month || today().slice(0, 7),
      basic: Number(payload.basic) || 0,
      hra: Number(payload.hra) || 0,
      allowances: Number(payload.allowances) || 0,
      deductions: Number(payload.deductions) || 0,
      net:
        Number(payload.basic) +
        Number(payload.hra) +
        Number(payload.allowances) -
        Number(payload.deductions),
      status: payload.status || 'Pending',
    };
    set((state) => ({ salaryRecords: [record, ...state.salaryRecords] }));
    return record;
  },

  /* --------------------------- Finance -------------------------- */

  addTransaction: (payload) => {
    seqs.transaction += 1;
    const transaction = {
      id: `TX-${seqs.transaction}`,
      date: payload.date || today(),
      type: payload.type || 'Expense',
      category: payload.category || 'Operations',
      description: payload.description,
      amount: Number(payload.amount) || 0,
      reference: payload.reference || '—',
      status: payload.status || 'Cleared',
    };
    set((state) => ({ financeTransactions: [transaction, ...state.financeTransactions] }));
    return transaction;
  },

  updateTransaction: (id, patch) =>
    set((state) => ({
      financeTransactions: state.financeTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...patch, amount: patch.amount !== undefined ? Number(patch.amount) : transaction.amount } : transaction
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({ financeTransactions: state.financeTransactions.filter((transaction) => transaction.id !== id) })),

  recordPayment: (id, amount, method = 'NEFT') =>
    set((state) => {
      const invoice = state.invoices.find((entry) => entry.id === id);
      if (!invoice) return {};
      const applied = Math.min(Math.max(0, Number(amount) || 0), Math.max(0, invoice.amount - invoice.paid));
      if (!applied) return {};
      const paid = invoice.paid + applied;
      seqs.transaction += 1;
      const transaction = {
        id: `TX-${seqs.transaction}`,
        date: today(),
        type: 'Income',
        category: 'Customer receipt',
        description: `${invoice.customer} · payment against ${invoice.id}`,
        amount: applied,
        reference: invoice.id,
        status: 'Cleared',
      };
      return {
        invoices: state.invoices.map((entry) =>
          entry.id === id
            ? { ...entry, paid, status: paid >= entry.amount ? 'Paid' : 'Part paid' }
            : entry
        ),
        financeTransactions: [transaction, ...state.financeTransactions],
      };
    }),

  saveInvoice: (payload) => {
    if (payload.id) {
      let saved = null;
      set((state) => ({
        invoices: state.invoices.map((invoice) => {
          if (invoice.id !== payload.id) return invoice;
          saved = { ...invoice, ...payload, amount: Number(payload.amount) || invoice.amount };
          return saved;
        }),
      }));
      return saved;
    }
    seqs.invoice += 1;
    const invoice = {
      id: `INV-2026-${String(seqs.invoice).padStart(4, '0')}`,
      customer: payload.customer,
      customerId: payload.customerId || null,
      orderId: payload.orderId || null,
      quoteId: payload.quoteId || null,
      issued: payload.issued || today(),
      due: payload.due || addDaysISO(today(), 30),
      amount: Number(payload.amount) || 0,
      paid: 0,
      status: 'Sent',
    };
    set((state) => ({ invoices: [invoice, ...state.invoices] }));
    return invoice;
  },

  deleteInvoice: (id) =>
    set((state) => ({ invoices: state.invoices.filter((invoice) => invoice.id !== id) })),

  /* -------------------------- Marketing ------------------------- */

  updateCampaignStatus: (id, status) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) => (campaign.id === id ? { ...campaign, status } : campaign)),
    })),

  addCampaign: (payload) => {
    seqs.campaign += 1;
    const campaign = {
      id: `CMP-${seqs.campaign}`,
      name: payload.name,
      channel: payload.channel,
      status: payload.status || 'Draft',
      budget: Number(payload.budget) || 0,
      spend: 0,
      leads: 0,
      conversions: 0,
      start: payload.start || today(),
      end: payload.end || addDaysISO(today(), 60),
      roi: 0,
      objective: payload.objective || 'Qualified packaging enquiries',
      owner: payload.owner || 'Pine & Pixel',
      agencyManaged: true,
    };
    set((state) => ({ campaigns: [campaign, ...state.campaigns] }));
    return campaign;
  },

  updateCampaign: (id, patch) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === id
          ? { ...campaign, ...patch, budget: patch.budget !== undefined ? Number(patch.budget) : campaign.budget }
          : campaign
      ),
    })),

  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
      campaignExpenses: state.campaignExpenses.filter((expense) => expense.campaignId !== id),
      landingPages: state.landingPages.map((page) =>
        page.campaign === id ? { ...page, campaign: '—' } : page
      ),
      leads: state.leads.map((lead) => (lead.campaignId === id ? { ...lead, campaignId: null } : lead)),
      quotes: state.quotes.map((quote) => (quote.campaignId === id ? { ...quote, campaignId: null } : quote)),
      orders: state.orders.map((order) => (order.campaignId === id ? { ...order, campaignId: null } : order)),
    })),

  addCampaignExpense: (payload) => {
    seqs.campaignExpense += 1;
    const expense = {
      id: `AD-${seqs.campaignExpense}`,
      campaignId: payload.campaignId,
      channel: payload.channel || 'Google Ads',
      month: payload.month || today().slice(0, 7),
      amount: Number(payload.amount) || 0,
      note: payload.note || 'Campaign spend',
      date: payload.date || today(),
    };
    set((state) => ({
      campaignExpenses: [expense, ...state.campaignExpenses],
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === expense.campaignId
          ? { ...campaign, spend: campaign.spend + expense.amount }
          : campaign
      ),
    }));
    return expense;
  },

  deleteCampaignExpense: (id) =>
    set((state) => {
      const expense = state.campaignExpenses.find((entry) => entry.id === id);
      return {
        campaignExpenses: state.campaignExpenses.filter((entry) => entry.id !== id),
        campaigns: expense
          ? state.campaigns.map((campaign) =>
              campaign.id === expense.campaignId
                ? { ...campaign, spend: Math.max(0, campaign.spend - expense.amount) }
                : campaign
            )
          : state.campaigns,
      };
    }),

  saveAgencyProfile: (values) =>
    set((state) => ({
      agencyProfile: { ...state.agencyProfile, ...values, retainer: Number(values.retainer) || state.agencyProfile.retainer },
    })),

  addAgencyFee: (payload) => {
    seqs.fee += 1;
    const fee = {
      id: `AF-2026-${payload.month || '13'}-${seqs.fee}`,
      month: payload.month,
      label: payload.label || 'Monthly retainer',
      fee: Number(payload.fee) || 0,
      status: payload.status || 'Pending',
      paidOn: payload.status === 'Paid' ? today() : null,
      invoice: payload.invoice || '—',
    };
    set((state) => ({ agencyFees: [fee, ...state.agencyFees] }));
    return fee;
  },

  markAgencyFeePaid: (id) =>
    set((state) => ({
      agencyFees: state.agencyFees.map((fee) =>
        fee.id === id ? { ...fee, status: 'Paid', paidOn: fee.paidOn || today() } : fee
      ),
    })),

  saveAgencyBrief: (payload) => {
    if (payload.id) {
      let saved = null;
      set((state) => ({
        agencyBriefs: state.agencyBriefs.map((brief) => {
          if (brief.id !== payload.id) return brief;
          saved = { ...brief, ...payload };
          return saved;
        }),
      }));
      return saved;
    }
    seqs.brief += 1;
    const brief = {
      id: `BR-${String(seqs.brief).padStart(2, '0')}`,
      title: payload.title,
      agency: payload.agency || 'Pine & Pixel',
      status: payload.status || 'Brief approved',
      due: payload.due || addDaysISO(today(), 21),
      budget: Number(payload.budget) || 0,
    };
    set((state) => ({ agencyBriefs: [brief, ...state.agencyBriefs] }));
    return brief;
  },

  /* ----------------------------- CMS ---------------------------- */

  saveCms: (section, values) =>
    set((state) => ({
      cms: {
        ...state.cms,
        [section]: { ...state.cms[section], ...values },
        updatedAt: nowISO(),
        updatedBy: currentUser.name,
      },
    })),

  saveCmsItem: (collection, payload) => {
    const meta = CMS_COLLECTIONS[collection];
    if (!meta) return null;
    let saved = null;
    set((state) => {
      const items = state[meta.key];
      if (payload.id) {
        saved = { ...items.find((item) => item.id === payload.id), ...payload, updated: today() };
        return { [meta.key]: items.map((item) => (item.id === payload.id ? saved : item)) };
      }
      seqs[collection] += 1;
      saved = {
        ...payload,
        id: `${meta.prefix}-${String(seqs[collection]).padStart(2, '0')}`,
        updated: today(),
      };
      if (collection === 'services' || collection === 'testimonials') {
        saved.published = payload.published ?? false;
        if (saved.order === undefined) saved.order = items.length + 1;
      }
      if (!('status' in saved) && collection !== 'services' && collection !== 'testimonials' && collection !== 'media') {
        saved.status = 'Draft';
      }
      return { [meta.key]: [saved, ...items] };
    });
    set((state) => ({
      cms: { ...state.cms, updatedAt: nowISO(), updatedBy: currentUser.name },
    }));
    return saved;
  },

  deleteCmsItem: (collection, id) => {
    const meta = CMS_COLLECTIONS[collection];
    if (!meta) return;
    set((state) => ({ [meta.key]: state[meta.key].filter((item) => item.id !== id) }));
  },

  toggleCmsPublish: (collection, id) => {
    const meta = CMS_COLLECTIONS[collection];
    if (!meta) return;
    set((state) => ({
      [meta.key]: state[meta.key].map((item) => {
        if (item.id !== id) return item;
        if ('published' in item) return { ...item, published: !item.published };
        return { ...item, status: item.status === 'Published' ? 'Draft' : 'Published', updated: today() };
      }),
    }));
  },

  /* ----------------------- Page section editor ----------------------- */

  savePageSection: (pageId, payload) => {
    let saved = null;
    set((state) => ({
      cmsPages: state.cmsPages.map((page) => {
        if (page.id !== pageId) return page;
        const sections = [...(page.sections || [])];
        if (payload.id) {
          const index = sections.findIndex((item) => item.id === payload.id);
          if (index >= 0) {
            saved = { ...sections[index], ...payload };
            sections[index] = saved;
          }
        } else {
          saved = {
            ...payload,
            id: uid('PS'),
            order: sections.length + 1,
            enabled: payload.enabled !== false,
          };
          sections.push(saved);
        }
        return { ...page, sections, updated: today() };
      }),
    }));

    if (saved) {
      const page = get().cmsPages.find((item) => item.id === pageId);
      if (page?.slug === '/') {
        const sections = page.sections || [];
        const hero = sections.find((item) => item.key === 'hero');
        if (hero) {
          get().saveCms('home', {
            headline: hero.title || '',
            subcopy: hero.body || '',
            eyebrow: hero.kicker || '',
            primaryCta: hero.ctaLabel || 'Request a quote',
          });
        }
        const byKey = Object.fromEntries(sections.map((item) => [item.key, item]));
        get().saveCms('home', {
          showStats: byKey.clients ? byKey.clients.enabled !== false : true,
          showPortfolio: byKey.portfolio ? byKey.portfolio.enabled !== false : true,
          showTestimonials: byKey.testimonials ? byKey.testimonials.enabled !== false : true,
        });
      }
    }
    return saved;
  },

  deletePageSection: (pageId, sectionId) =>
    set((state) => ({
      cmsPages: state.cmsPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: (page.sections || [])
                .filter((section) => section.id !== sectionId)
                .map((section, index) => ({ ...section, order: index + 1 })),
              updated: today(),
            }
          : page
      ),
    })),

  duplicatePageSection: (pageId, sectionId) => {
    let copy = null;
    set((state) => ({
      cmsPages: state.cmsPages.map((page) => {
        if (page.id !== pageId) return page;
        const index = (page.sections || []).findIndex((section) => section.id === sectionId);
        if (index < 0) return page;
        const source = page.sections[index];
        const baseKey = `${source.key || 'section'}-copy`;
        let key = baseKey;
        let suffix = 2;
        while ((page.sections || []).some((section) => section.key === key)) {
          key = `${baseKey}-${suffix}`;
          suffix += 1;
        }
        copy = { ...source, id: uid('PS'), key, title: `${source.title} (copy)` };
        const sections = [...page.sections];
        sections.splice(index + 1, 0, copy);
        return {
          ...page,
          sections: sections.map((section, position) => ({ ...section, order: position + 1 })),
          updated: today(),
        };
      }),
    }));
    return copy;
  },

  togglePageSection: (pageId, sectionId) =>
    set((state) => ({
      cmsPages: state.cmsPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: (page.sections || []).map((section) =>
                section.id === sectionId ? { ...section, enabled: section.enabled === false } : section
              ),
              updated: today(),
            }
          : page
      ),
    })),

  movePageSection: (pageId, sectionId, direction) =>
    set((state) => ({
      cmsPages: state.cmsPages.map((page) => {
        if (page.id !== pageId) return page;
        const sections = [...(page.sections || [])];
        const index = sections.findIndex((section) => section.id === sectionId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= sections.length) return page;
        [sections[index], sections[target]] = [sections[target], sections[index]];
        return {
          ...page,
          sections: sections.map((section, position) => ({ ...section, order: position + 1 })),
          updated: today(),
        };
      }),
    })),

  reorderPageSections: (pageId, sectionId, targetIndex) =>
    set((state) => ({
      cmsPages: state.cmsPages.map((page) => {
        if (page.id !== pageId) return page;
        const sections = [...(page.sections || [])];
        const index = sections.findIndex((section) => section.id === sectionId);
        if (index < 0 || targetIndex < 0 || targetIndex >= sections.length || index === targetIndex) return page;
        const [moved] = sections.splice(index, 1);
        sections.splice(targetIndex, 0, moved);
        return {
          ...page,
          sections: sections.map((section, position) => ({ ...section, order: position + 1 })),
          updated: today(),
        };
      }),
    })),

  duplicateCmsPage: (pageId) => {
    let copy = null;
    set((state) => {
      const page = state.cmsPages.find((item) => item.id === pageId);
      if (!page) return {};
      copy = {
        ...page,
        id: uid('PG'),
        title: `${page.title} copy`,
        slug: page.slug === '/' ? '/p/home-copy' : `${page.slug}-copy`,
        type: 'Custom',
        status: 'Draft',
        sections: (page.sections || []).map((section) => ({ ...section, id: uid('PS') })),
        updated: today(),
      };
      return { cmsPages: [copy, ...state.cmsPages] };
    });
    return copy;
  },

  /* ------------------------ Landing pages ----------------------- */

  addLandingPage: (payload) => {
    seqs.landing += 1;
    seqs.section += 4;
    const page = {
      id: `LP-${String(seqs.landing).padStart(2, '0')}`,
      title: payload.title,
      slug: payload.slug?.startsWith('/') ? payload.slug : `/lp/${payload.slug}`,
      campaign: payload.campaign || '—',
      template: payload.template || 'Conversion',
      status: 'Draft',
      views: 0,
      conversions: 0,
      formSubmissions: 0,
      updated: today(),
      headline: payload.headline || payload.title,
      publishedAt: null,
      sections: [
        { id: `LS-${seqs.section - 3}`, type: 'Hero', title: payload.headline || payload.title, body: payload.subhead || 'Add your campaign proposition here.', enabled: true },
        { id: `LS-${seqs.section - 2}`, type: 'Proof', title: 'Proof point', body: 'Add a metric, client or certification that earns trust.', enabled: true },
        { id: `LS-${seqs.section - 1}`, type: 'Features', title: 'Why this offer', body: 'Explain the three reasons a buyer should act now.', enabled: true },
        { id: `LS-${seqs.section}`, type: 'Enquiry form', title: 'Request a callback', body: 'Capture the enquiry into the CRM.', enabled: true },
      ],
      form: {
        title: 'Request a callback',
        submitLabel: 'Submit enquiry',
        successMessage: 'Thanks — our team will contact you within one business day.',
        fields: [
          { key: 'name', label: 'Full name', type: 'text', required: true },
          { key: 'company', label: 'Company', type: 'text', required: true },
          { key: 'email', label: 'Work email', type: 'email', required: true },
          { key: 'phone', label: 'Phone', type: 'tel', required: true },
          { key: 'message', label: 'What are you packaging?', type: 'textarea', required: false },
        ],
      },
      utm: { source: payload.utmSource || 'direct', medium: payload.utmMedium || 'organic', campaign: payload.utmCampaign || payload.slug },
    };
    set((state) => ({ landingPages: [page, ...state.landingPages] }));
    return page;
  },

  updateLandingPage: (id, patch) =>
    set((state) => ({
      landingPages: state.landingPages.map((page) =>
        page.id === id ? { ...page, ...patch, updated: today() } : page
      ),
    })),

  deleteLandingPage: (id) =>
    set((state) => ({ landingPages: state.landingPages.filter((page) => page.id !== id) })),

  toggleLandingPage: (id) =>
    set((state) => ({
      landingPages: state.landingPages.map((page) =>
        page.id === id
          ? {
              ...page,
              status: page.status === 'Published' ? 'Draft' : 'Published',
              publishedAt: page.status === 'Published' ? page.publishedAt : today(),
              updated: today(),
            }
          : page
      ),
    })),

  setLandingPageStatus: (id, status) =>
    set((state) => ({
      landingPages: state.landingPages.map((page) =>
        page.id === id
          ? {
              ...page,
              status,
              publishedAt: status === 'Published' ? page.publishedAt || today() : page.publishedAt,
              updated: today(),
            }
          : page
      ),
    })),

  addLandingSection: (id, payload) => {
    seqs.section += 1;
    const section = {
      id: `LS-${seqs.section}`,
      type: payload.type || 'Features',
      title: payload.title || 'New section',
      body: payload.body || '',
      enabled: true,
    };
    set((state) => ({
      landingPages: state.landingPages.map((page) =>
        page.id === id ? { ...page, sections: [...page.sections, section], updated: today() } : page
      ),
    }));
    return section;
  },

  updateLandingSection: (pageId, sectionId, patch) =>
    set((state) => ({
      landingPages: state.landingPages.map((page) =>
        page.id === pageId
          ? { ...page, sections: page.sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)), updated: today() }
          : page
      ),
    })),

  removeLandingSection: (pageId, sectionId) =>
    set((state) => ({
      landingPages: state.landingPages.map((page) =>
        page.id === pageId ? { ...page, sections: page.sections.filter((section) => section.id !== sectionId), updated: today() } : page
      ),
    })),

  moveLandingSection: (pageId, sectionId, direction) =>
    set((state) => ({
      landingPages: state.landingPages.map((page) => {
        if (page.id !== pageId) return page;
        const index = page.sections.findIndex((section) => section.id === sectionId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= page.sections.length) return page;
        const sections = [...page.sections];
        [sections[index], sections[target]] = [sections[target], sections[index]];
        return { ...page, sections, updated: today() };
      }),
    })),

  saveLandingForm: (id, form) =>
    set((state) => ({
      landingPages: state.landingPages.map((page) =>
        page.id === id ? { ...page, form: { ...page.form, ...form }, updated: today() } : page
      ),
    })),

  trackLandingView: (id) =>
    set((state) => ({
      landingPages: state.landingPages.map((page) => (page.id === id ? { ...page, views: page.views + 1 } : page)),
    })),

  submitLandingForm: (id, values) => {
    const page = get().landingPages.find((entry) => entry.id === id);
    if (!page) return null;
    const utmSource = values.utmSource || values.utm_source || page.utm?.source || 'direct';
    const lead = get().addLead({
      company: values.company || page.title,
      contact: values.name || 'Landing page visitor',
      email: values.email,
      phone: values.phone,
      city: values.city || '—',
      source: `Landing page · ${utmSource}`,
      sourceChannel: 'Landing Page',
      sourceDetail: `Landing page ${page.slug || page.title} · ${utmSource}`,
      landingPage: page.slug || page.title,
      utmSource,
      utmMedium: values.utmMedium || values.utm_medium || page.utm?.medium || 'campaign',
      utmCampaign: values.utmCampaign || values.utm_campaign || page.utm?.campaign || page.campaign || '—',
      utmContent: values.utmContent || values.utm_content || '—',
      referrer: values.referrer || '—',
      campaignName: page.title,
      product: page.title,
      quantity: values.quantity || 'To be confirmed',
      value: Number(values.value) || 0,
      notes: values.message || `Enquiry submitted on ${page.title}.`,
      campaignId: page.campaign !== '—' ? page.campaign : null,
    });
    set((state) => ({
      landingPages: state.landingPages.map((entry) =>
        entry.id === id
          ? { ...entry, conversions: entry.conversions + 1, formSubmissions: (entry.formSubmissions || 0) + 1 }
          : entry
      ),
    }));
    return lead;
  },

  /* -------------------------- Reports --------------------------- */

  toggleReportSchedule: (id) =>
    set((state) => ({
      reportSchedules: state.reportSchedules.map((schedule) =>
        schedule.id === id ? { ...schedule, active: !schedule.active } : schedule
      ),
    })),

  saveReportSchedule: (payload) => {
    if (payload.id) {
      let saved = null;
      set((state) => ({
        reportSchedules: state.reportSchedules.map((schedule) => {
          if (schedule.id !== payload.id) return schedule;
          saved = { ...schedule, ...payload };
          return saved;
        }),
      }));
      return saved;
    }
    seqs.schedule += 1;
    const schedule = {
      id: `SR-${String(seqs.schedule).padStart(2, '0')}`,
      name: payload.name,
      recipients: payload.recipients || '—',
      cadence: payload.cadence || 'Weekly · 08:00',
      format: payload.format || 'Email + CSV',
      active: payload.active ?? true,
    };
    set((state) => ({ reportSchedules: [schedule, ...state.reportSchedules] }));
    return schedule;
  },

  deleteReportSchedule: (id) =>
    set((state) => ({ reportSchedules: state.reportSchedules.filter((schedule) => schedule.id !== id) })),

  /* ------------------------ Customer portal --------------------- */

  submitPortalRfq: (payload) => {
    const lead = get().addLead({
      company: abcCustomer.company,
      contact: payload.contact || abcCustomer.contact,
      title: payload.title || 'Head of Procurement',
      email: payload.email || abcCustomer.email,
      phone: payload.phone || abcCustomer.phone,
      city: payload.deliveryCity || abcCustomer.city,
      source: 'Customer portal · RFQ',
      product: payload.product,
      quantity: payload.quantity,
      value: Number(payload.budget) || 0,
      stage: 'New',
      owner: 'Neha Joshi',
      score: 76,
      campaignId: ABC_CAMPAIGN_ID,
      nextAction: 'Qualify portal RFQ · within 24 hours',
      notes: payload.message,
    });
    get().addFollowUp(lead.id, {
      date: addDaysISO(today(), 1),
      note: 'Qualify the portal RFQ, confirm the pack specification and share a sample board.',
      owner: 'Neha Joshi',
    });
    set((state) => ({
      notifications: [
        notificationEntry(
          `Portal RFQ assigned to Neha`,
          `${lead.reference} · ${lead.company} · follow-up scheduled for tomorrow`,
          'lead',
          '/admin/leads'
        ),
        ...state.notifications,
      ],
      activity: [
        activityEntry(`scheduled a qualification follow-up for portal RFQ ${lead.reference}`, 'lead'),
        ...state.activity,
      ],
    }));
    return lead;
  },

  acceptPortalQuote: (quoteId, note = '') => {
    const state = get();
    const quote = state.quotes.find((entry) => entry.id === quoteId);
    if (!quote || quote.status === 'Declined') return null;
    const existingOrder = state.orders.find((order) => order.quoteId === quoteId);
    const order =
      existingOrder ||
      get().convertQuoteToOrder(quoteId, {
        priority: 'High',
        shipTo: 'ABC Foods Plant 2, Plot 18, Taloja MIDC, Navi Mumbai 410208',
      });
    const primaryItem = order.items[0] || { description: 'Packaging order', qty: 0 };

    let job = get().production.find((entry) => entry.orderId === order.id);
    if (!job) {
      job = get().addProductionJob({
        orderId: order.id,
        customer: order.customer,
        product: primaryItem.description.split(' · ')[0] || 'Food-grade carton',
        quantity: primaryItem.qty,
        stage: 'Prepress',
        machine: 'Esko Prepress',
        operator: 'D. Malhotra',
        due: order.dueDate,
        priority: 'High',
        notes: `Generated automatically after ${quote.customer} accepted ${quote.id} in the customer portal.`,
      });
    }

    let artwork = get().artwork.find((entry) => entry.orderId === order.id);
    if (!artwork) {
      artwork = get().addArtwork({
        orderId: order.id,
        customer: order.customer,
        product: primaryItem.description.split(' · ')[0] || 'Food-grade carton',
        due: addDaysISO(today(), 4),
        preview: '/images/folding-cartons.jpg',
        notes: `Proof prepared for ${quote.id}. Awaiting customer approval.`,
      });
      get().updateArtwork(artwork.id, {
        status: 'In review',
        proofStatus: 'Sent',
        version: 'v1',
        fileType: 'PDF proof',
        colours: quote.specs?.print || 'CMYK + food-safe varnish',
        submitted: nowISO(),
        notes: `Proof v1 for ${quote.id} sent to ${quote.contact}. Awaiting approval or corrections.`,
      });
      artwork = get().artwork.find((entry) => entry.id === artwork.id);
    }

    let invoice = get().invoices.find((entry) => entry.orderId === order.id);
    if (!invoice) {
      invoice = get().saveInvoice({
        customer: order.customer,
        customerId: order.customerId,
        orderId: order.id,
        quoteId: quote.id,
        amount: quote.total || Math.round(order.value * 1.18),
        due: addDaysISO(today(), 30),
      });
    }

    const acceptedLead =
      state.leads.find((lead) => lead.id === quote.leadId) ||
      state.leads.find((lead) => lead.quoteId === quote.id) ||
      state.leads
        .filter((lead) => lead.company === quote.customer && !['Won', 'Lost'].includes(lead.stage))
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))[0];

    set((current) => ({
      leads: current.leads.map((lead) =>
        lead.id === acceptedLead?.id
          ? {
              ...lead,
              stage: 'Won',
              nextAction: 'Production handover',
              history: [
                {
                  id: uid(`${lead.id}-H`),
                  type: 'Stage',
                  text: `Quotation ${quote.id} accepted in the customer portal`,
                  date: today(),
                  by: quote.contact,
                },
                ...(lead.history || []),
              ],
            }
          : lead
      ),
    }));

    const customer = get().customers.find((entry) => entry.id === order.customerId);
    if (customer) {
      const openOrders = get().orders.filter(
        (entry) => entry.customerId === customer.id && !['Delivered', 'On hold'].includes(entry.status)
      ).length;
      get().saveCustomer({
        id: customer.id,
        openOrders,
        ordersCount: existingOrder ? customer.ordersCount : customer.ordersCount + 1,
        lifetimeValue: existingOrder ? customer.lifetimeValue : customer.lifetimeValue + order.value,
      });
    }

    appendOrderEvent(
      get,
      order.id,
      'Portal acceptance',
      `${quote.contact} accepted ${quote.id}${note ? ` · ${note}` : ''}`
    );

    set((current) => ({
      notifications: [
        notificationEntry(
          'Quotation accepted in portal',
          `${quote.customer} accepted ${quote.id}. ${order.id}, job card ${job.id} and invoice ${invoice.id} created.`,
          'order',
          '/admin/orders'
        ),
        notificationEntry(
          'Proof waiting for customer',
          `${artwork.id} proof sent to ${quote.customer}`,
          'artwork',
          '/admin/prepress'
        ),
        notificationEntry('Invoice issued', `${invoice.id} · ${order.customer}`, 'finance', '/admin/finance'),
        ...current.notifications,
      ],
      activity: [
        activityEntry(`${quote.customer} accepted ${quote.id} in the customer portal`, 'commercial'),
        activityEntry(
          `generated ${order.id}, job card ${job.id}, proof ${artwork.id} and invoice ${invoice.id}`,
          'commercial'
        ),
        ...current.activity,
      ],
    }));

    return { order, job, artwork, invoice };
  },

  declinePortalQuote: (quoteId, note = '') => {
    const quote = get().quotes.find((entry) => entry.id === quoteId);
    if (!quote) return null;
    const lead = get().leads.find((entry) => entry.company === quote.customer);
    get().updateQuote(quoteId, {
      status: 'Declined',
      responseNote: note || 'Declined by the customer in the portal.',
      respondedAt: nowISO(),
    });
    if (lead) {
      get().updateLead(lead.id, { stage: 'Lost', nextAction: 'Win-back conversation in 30 days' });
      get().addFollowUp(lead.id, {
        date: addDaysISO(today(), 30),
        note: `Win-back call after ${quote.customer} declined ${quote.id}. ${note || ''}`.trim(),
        owner: quote.owner,
      });
    }
    set((current) => ({
      notifications: [
        notificationEntry(
          'Quotation declined in portal',
          `${quote.customer} declined ${quote.id}${note ? ` · "${note}"` : ''}`,
          'commercial',
          '/admin/quotations'
        ),
        ...current.notifications,
      ],
      activity: [
        activityEntry(`${quote.customer} declined ${quote.id} in the customer portal`, 'commercial'),
        ...current.activity,
      ],
    }));
    return quote;
  },

  reviewPortalProof: (artworkId, decision, note = '') => {
    const state = get();
    const artwork = state.artwork.find((entry) => entry.id === artworkId);
    if (!artwork) return null;
    const order = state.orders.find((entry) => entry.id === artwork.orderId);
    const job = state.production.find((entry) => entry.orderId === artwork.orderId);

    if (decision !== 'Approved') {
      get().updateArtworkStatus(artworkId, 'Changes requested', note || 'Customer requested corrections in the portal.');
      get().setProofStatus(artworkId, 'Rejected');
      if (order) {
        appendOrderEvent(get, order.id, 'Proof changes requested', note || 'Customer requested corrections');
      }
      set((current) => ({
        notifications: [
          notificationEntry(
            'Proof changes requested',
            `${artwork.customer} requested corrections on ${artwork.id}${note ? ` · "${note}"` : ''}`,
            'artwork',
            '/admin/prepress'
          ),
          ...current.notifications,
        ],
        activity: [
          activityEntry(`${artwork.customer} requested corrections on ${artwork.id}`, 'artwork'),
          ...current.activity,
        ],
      }));
      return { artwork: get().artwork.find((entry) => entry.id === artworkId), order, job };
    }

    get().updateArtworkStatus(artworkId, 'Approved', 'Approved by ABC Foods in the customer portal.');
    get().setProofStatus(artworkId, 'Approved');

    let boardQty = 0;
    let inkQty = 0;
    if (job) {
      if (PRODUCTION_FLOW.indexOf(job.stage) < PRODUCTION_FLOW.indexOf('Printing')) {
        get().moveJob(job.id, 'Printing');
        get().updateProductionJob(job.id, { machine: 'Heidelberg CX 104', operator: 'R. Patil' });
      }
      const alreadyIssued = get().stockMovements.some(
        (movement) => movement.jobId === job.id && movement.type === 'Consumption'
      );
      if (!alreadyIssued) {
        const orderedQty = Number(order?.items?.[0]?.qty) || Number(job.quantity) || 0;
        boardQty = Math.min(6000, Math.max(200, Math.round(orderedQty / 40)));
        inkQty = Math.max(5, Math.round(orderedQty / 8000));
        get().consumeForJob(job.id, 'SKU-1005', boardQty);
        get().consumeForJob(job.id, 'SKU-1008', inkQty);
      }
    }

    if (order) {
      if (['Confirmed', 'Prepress', 'On hold'].includes(order.status)) {
        get().updateOrderStatus(order.id, 'In production');
      } else {
        appendOrderEvent(get, order.id, 'Proof approved', `${artwork.id} approved by ${artwork.customer}`);
      }
    }

    set((current) => ({
      notifications: [
        notificationEntry(
          'Proof approved by customer',
          `${artwork.customer} approved ${artwork.id}. ${job ? `${job.id} moved to printing` : 'Production released'}.`,
          'artwork',
          '/admin/prepress'
        ),
        ...(boardQty || inkQty
          ? [
              notificationEntry(
                'Material issued from stock',
                `${boardQty} sheets SBS Board + ${inkQty} L ink issued to ${job.id}`,
                'inventory',
                '/admin/inventory'
              ),
            ]
          : []),
        ...current.notifications,
      ],
      activity: [
        activityEntry(`${artwork.customer} approved proof ${artwork.id} in the portal`, 'artwork'),
        ...(boardQty || inkQty
          ? [activityEntry(`recorded material consumption for ${job.id} from the portal approval`, 'inventory')]
          : []),
        ...current.activity,
      ],
    }));

    return { artwork: get().artwork.find((entry) => entry.id === artworkId), order, job };
  },

  requestRepeatOrder: (orderId) => {
    const source = get().orders.find((entry) => entry.id === orderId);
    if (!source) return null;
    const repeated = get().repeatOrder(orderId);
    if (!repeated) return null;
    const primaryItem = repeated.items[0] || { description: 'Packaging order', qty: 0 };
    const job = get().addProductionJob({
      orderId: repeated.id,
      customer: repeated.customer,
      product: primaryItem.description.split(' · ')[0] || 'Food-grade carton',
      quantity: primaryItem.qty,
      stage: 'Pending',
      priority: repeated.priority,
      due: repeated.dueDate,
      notes: `Repeat request raised from the customer portal against ${source.id}.`,
    });
    const artwork = get().addArtwork({
      orderId: repeated.id,
      customer: repeated.customer,
      product: primaryItem.description.split(' · ')[0] || 'Food-grade carton',
      due: addDaysISO(today(), 7),
      preview: '/images/folding-cartons.jpg',
      notes: `Repeat-order artwork request linked to ${source.id}.`,
    });
    get().updateOrder(repeated.id, {
      status: 'Confirmed',
      timeline: [
        ...(repeated.timeline || []),
        {
          id: uid(`${repeated.id}-TL`),
          label: 'Repeat request',
          note: `Requested by ${repeated.customer} in the customer portal against ${source.id}`,
          date: today(),
          done: true,
        },
      ],
    });
    const customer = get().customers.find((entry) => entry.id === repeated.customerId);
    if (customer) {
      const openOrders = get().orders.filter(
        (entry) => entry.customerId === customer.id && !['Delivered', 'On hold'].includes(entry.status)
      ).length;
      get().saveCustomer({ id: customer.id, openOrders, ordersCount: customer.ordersCount + 1 });
    }
    set((current) => ({
      notifications: [
        notificationEntry(
          'Repeat order requested',
          `${repeated.customer} raised ${repeated.id} from the portal against ${source.id}`,
          'order',
          '/admin/orders'
        ),
        ...current.notifications,
      ],
      activity: [
        activityEntry(`${repeated.customer} requested a repeat order from the portal`, 'order'),
        activityEntry(`created ${repeated.id}, job card ${job.id} and artwork request ${artwork.id}`, 'production'),
        ...current.activity,
      ],
    }));
    return { order: repeated, job, artwork };
  },

  recordPortalPayment: (invoiceId, amount, method = 'NEFT') => {
    const invoice = get().invoices.find((entry) => entry.id === invoiceId);
    if (!invoice || invoice.status === 'Paid') return null;
    const outstanding = Math.max(0, invoice.amount - invoice.paid);
    const payment = Math.min(outstanding, Number(amount) || outstanding);
    if (!payment) return null;

    get().recordPayment(invoiceId, payment, method);
    const updatedInvoice = get().invoices.find((entry) => entry.id === invoiceId);
    const order = invoice.orderId ? get().orders.find((entry) => entry.id === invoice.orderId) : null;
    if (order) {
      const paid = Math.min(order.value, order.payment.paid + payment);
      get().updateOrder(order.id, {
        payment: {
          ...order.payment,
          paid,
          paymentStatus: paid >= order.value ? 'Paid' : 'Part paid',
          paymentMethod: method,
          payments: [
            ...(order.payment.payments || []),
            {
              id: uid(`${order.id}-P`),
              amount: payment,
              date: today(),
              method,
              reference: `PORTAL-${invoice.id}`,
            },
          ],
        },
        timeline: [
          ...(order.timeline || []),
          {
            id: uid(`${order.id}-TL`),
            label: 'Payment reported',
            note: `${method} · ${invoice.id} · customer reported the transfer`,
            date: today(),
            done: true,
          },
        ],
      });
    }
    set((current) => ({
      notifications: [
        notificationEntry(
          'Payment reported in portal',
          `${invoice.customer} reported ${method} payment against ${invoice.id}`,
          'finance',
          '/admin/finance'
        ),
        ...current.notifications,
      ],
      activity: [
        activityEntry(`${invoice.customer} reported a ${method} payment against ${invoice.id}`, 'finance'),
        ...current.activity,
      ],
    }));
    return { invoice: updatedInvoice, order, payment, method };
  },

  submitSupportEnquiry: (payload) => {
    seqs.support += 1;
    const ticket = {
      id: `SUP-2026-${String(seqs.support).padStart(4, '0')}`,
      customerId: ABC_CUSTOMER_ID,
      company: abcCustomer.company,
      name: payload.name || abcCustomer.contact,
      email: payload.email || abcCustomer.email,
      category: payload.category || 'General',
      subject: payload.subject,
      message: payload.message,
      status: 'Open',
      priority: payload.priority || 'Normal',
      createdAt: nowISO(),
      replies: [
        {
          id: uid('SUP-R'),
          author: 'Neha Joshi',
          role: 'Account manager',
          message: 'Thanks for the details. Your account team has received this and will reply within two business hours.',
          time: nowISO(),
        },
      ],
    };
    set((state) => ({
      supportEnquiries: [ticket, ...state.supportEnquiries],
      notifications: [
        notificationEntry(
          `Support enquiry · ${ticket.subject}`,
          `${ticket.company} · ${ticket.category} · ${ticket.priority} priority`,
          'support',
          '/admin/portal?tab=support'
        ),
        ...state.notifications,
      ],
      activity: [
        activityEntry(`${ticket.company} submitted support enquiry ${ticket.id}`, 'support'),
        ...state.activity,
      ],
    }));
    return ticket;
  },

  savePortalProfile: (payload) => {
    const customer = get().customers.find((entry) => entry.id === ABC_CUSTOMER_ID);
    if (!customer) return null;
    get().saveCustomer({
      id: customer.id,
      company: payload.company || customer.company,
      gstin: payload.gstin || customer.gstin,
      phone: payload.phone || customer.phone,
      email: payload.email || customer.email,
      city: payload.city || customer.city,
      paymentTerms: payload.paymentTerms || customer.paymentTerms,
    });
    const contact = get().contacts.find((entry) => entry.customerId === customer.id && entry.primary);
    if (contact) {
      get().saveContact({
        id: contact.id,
        name: payload.contactName || contact.name,
        email: payload.email || contact.email,
        phone: payload.phone || contact.phone,
      });
    }
    set((state) => ({
      activity: [activityEntry(`${abcCustomer.company} updated their portal company profile`, 'system'), ...state.activity],
    }));
    return get().customers.find((entry) => entry.id === ABC_CUSTOMER_ID);
  },

  /* --------------------------- System --------------------------- */

  saveSettings: (section, values) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [section]: { ...state.settings[section], ...values },
      },
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    })),

  addTask: (title) =>
    set((state) => ({
      tasks: [
        { id: `TK-${Date.now()}`, title, due: 'Today', priority: 'Medium', done: false },
        ...state.tasks,
      ],
    })),

  resetDemo: () =>
    set(() => {
      Object.assign(seqs, BASE_SEQS);
      return { ...buildInitialData() };
    }),
}));

export const selectCampaignSpend = (state, campaignId) => campaignSpendFor(state, campaignId);
