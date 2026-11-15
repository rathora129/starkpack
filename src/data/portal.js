export const ABC_CUSTOMER_ID = 'CUS-011';
export const ABC_COMPANY = 'ABC Foods Pvt Ltd';
export const ABC_CAMPAIGN_ID = 'CMP-28';

export const PORTAL_SESSION_KEY = 'stark-packmate:portal-demo-session';

export const portalNotificationSeed = [
  {
    id: 'NT-902',
    title: 'Proof ready for approval',
    body: 'ART-1183 v2 for ABC Foods Pvt Ltd is waiting for your review in the portal.',
    time: '2026-11-15T15:30:00+05:30',
    type: 'artwork',
    read: false,
    href: '/portal',
  },
  {
    id: 'NT-903',
    title: 'Quotation QT-2026-119 issued',
    body: 'Food-grade printed cartons — ₹25.23L. Valid until 30 November 2026.',
    time: '2026-11-15T11:10:00+05:30',
    type: 'quote',
    read: false,
    href: '/portal',
  },
  {
    id: 'NT-904',
    title: 'Invoice INV-2026-0842 sent',
    body: '₹12,00,000 due 5 December 2026 against order SO-2026-1054.',
    time: '2026-11-14T17:05:00+05:30',
    type: 'finance',
    read: true,
    href: '/portal',
  },
];

export const portalDemoAccess = {
  email: 'ritu.bansal@abcfoods.in',
  password: 'ABCfoods#2026',
  label: 'Demo account · no real authentication',
  notice:
    'This is a fictional customer workspace for evaluating the Stark Packmate demo. Data lives in browser memory, is not encrypted and resets on a hard refresh. Do not enter real customer information.',
};

export const abcCustomer = {
  id: ABC_CUSTOMER_ID,
  company: ABC_COMPANY,
  contact: 'Ritu Bansal',
  email: 'ritu.bansal@abcfoods.in',
  phone: '+91 98204 33718',
  city: 'Mumbai',
  segment: 'Food & beverage',
  since: '2023-06-18',
  lifetimeValue: 12840000,
  openOrders: 1,
  status: 'Active',
  paymentTerms: 'Net 30',
  gstin: '27AABCA9472Q1Z3',
  owner: 'Neha Joshi',
  health: 'Excellent',
  ordersCount: 34,
};

export const abcContacts = [
  {
    id: 'CT-011',
    customerId: ABC_CUSTOMER_ID,
    name: 'Ritu Bansal',
    title: 'Head of Procurement',
    email: 'ritu.bansal@abcfoods.in',
    phone: '+91 98204 33718',
    city: 'Mumbai',
    primary: true,
  },
  {
    id: 'CT-012',
    customerId: ABC_CUSTOMER_ID,
    name: 'Vivek Menon',
    title: 'Packaging Development Lead',
    email: 'vivek.menon@abcfoods.in',
    phone: '+91 98922 41065',
    city: 'Navi Mumbai',
    primary: false,
  },
];

export const abcLead = {
  id: 'LD-1059',
  company: ABC_COMPANY,
  contact: 'Ritu Bansal',
  title: 'Head of Procurement',
  email: 'ritu.bansal@abcfoods.in',
  phone: '+91 98204 33718',
  city: 'Mumbai',
  source: 'Website · Request a quote',
  product: 'Food-grade printed cartons',
  quantity: '150,000 cartons + 8,000 shippers',
  value: 2522840,
  stage: 'Proposal',
  owner: 'Neha Joshi',
  score: 88,
  createdAt: '2026-11-12T10:20:00+05:30',
  nextAction: 'Confirm quotation QT-2026-119 with Ritu',
  notes:
    'Q4 muesli launch across 6 SKUs. Needs FSSAI-compliant food-safe inks, grease barrier and a six-week national rollout. Sample board approved; commercial review with Ritu on 18 November.',
  reference: 'RFQ-2026-1959',
  quoteId: 'QT-2026-119',
  campaignId: ABC_CAMPAIGN_ID,
};

export const abcLeadFollowUps = {
  'LD-1059': [
    {
      id: 'FU-05',
      date: '2026-11-12',
      note: 'Intro call with Ritu — confirmed 150k cartons and 8k shippers for the muesli relaunch.',
      owner: 'Neha Joshi',
      status: 'Done',
    },
    {
      id: 'FU-06',
      date: '2026-11-18',
      note: 'Walk Ritu through quotation QT-2026-119 and the grease-barrier board sample.',
      owner: 'Neha Joshi',
      status: 'Open',
    },
  ],
};

export const abcQuotations = [
  {
    id: 'QT-2026-119',
    customerId: ABC_CUSTOMER_ID,
    leadId: 'LD-1059',
    customer: ABC_COMPANY,
    contact: 'Ritu Bansal',
    date: '2026-11-14',
    validUntil: '2026-11-30',
    status: 'Sent',
    owner: 'Neha Joshi',
    probability: 82,
    items: [
      { description: 'Food-grade folding carton · 300 GSM SBS · grease barrier · 300 g', qty: 150000, rate: 11.8 },
      { description: 'Printed corrugated shipper · 5-ply · ABC brand', qty: 8000, rate: 46 },
    ],
    specs: {
      material: '300 GSM SBS with PE-free grease barrier and food-safe inks',
      print: '6-colour offset with food-contact compliant varnish',
      finish: 'Grease barrier · tamper-evident tuck · batch code panel',
      dimensions: '155 × 75 × 220 mm (300 g carton)',
      packing: '18 cartons per 5-ply shipper · 48 shippers per pallet',
    },
  },
  {
    id: 'QT-2026-108',
    customerId: ABC_CUSTOMER_ID,
    customer: ABC_COMPANY,
    contact: 'Ritu Bansal',
    date: '2026-10-22',
    validUntil: '2026-11-05',
    status: 'Accepted',
    owner: 'Neha Joshi',
    probability: 100,
    items: [
      { description: 'Food-grade folding carton · 300 GSM SBS · grease barrier', qty: 200000, rate: 10.6 },
      { description: 'Printed corrugated shipper · 5-ply · ABC brand', qty: 10000, rate: 46 },
    ],
  },
];

export const abcOrder = {
  id: 'SO-2026-1054',
  customerId: ABC_CUSTOMER_ID,
  customer: ABC_COMPANY,
  contact: 'Ritu Bansal',
  quoteId: 'QT-2026-108',
  campaignId: ABC_CAMPAIGN_ID,
  items: [
    { description: 'Food-grade folding carton · 300 GSM SBS · grease barrier', qty: 200000, rate: 10.6 },
    { description: 'Printed corrugated shipper · 5-ply · ABC brand', qty: 10000, rate: 46 },
  ],
  status: 'In production',
  dueDate: '2026-11-22',
  priority: 'High',
  progress: 45,
  owner: 'Neha Joshi',
  createdAt: '2026-11-04',
  shipTo: 'ABC Foods Plant 2, Plot 18, Taloja MIDC, Navi Mumbai 410208',
  poNumber: 'ABC/PO/2026/0714',
};

export const abcProductionJob = {
  id: 'JOB-2443',
  orderId: 'SO-2026-1054',
  customer: ABC_COMPANY,
  product: 'Food-Grade Carton',
  quantity: 200000,
  stage: 'Printing',
  machine: 'Heidelberg CX 104',
  operator: 'R. Patil',
  progress: 52,
  due: '2026-11-20',
  priority: 'High',
  shift: 'A',
  notes: 'Grease-barrier board from lot SBS-2411. First-off approved, running at 11,000 sheets/hour.',
};

export const abcArtwork = {
  id: 'ART-1183',
  orderId: 'SO-2026-1054',
  customer: ABC_COMPANY,
  product: 'ABC Muesli Carton · 300 g',
  version: 'v2',
  designer: 'Dev Malhotra',
  status: 'In review',
  submitted: '2026-11-14T15:20:00+05:30',
  due: '2026-11-18',
  fileType: 'PDF, AI',
  colours: 'CMYK + food-safe varnish',
  notes:
    'Revised nutrition panel, FSSAI licence block and new batch code placement. Print files locked pending customer approval.',
  preview: '/images/folding-cartons.jpg',
};

export const abcInvoices = [
  {
    id: 'INV-2026-0842',
    customer: ABC_COMPANY,
    customerId: ABC_CUSTOMER_ID,
    orderId: 'SO-2026-1054',
    quoteId: 'QT-2026-108',
    issued: '2026-11-05',
    due: '2026-12-05',
    amount: 1200000,
    paid: 0,
    status: 'Sent',
  },
  {
    id: 'INV-2026-0833',
    customer: ABC_COMPANY,
    customerId: ABC_CUSTOMER_ID,
    orderId: null,
    quoteId: null,
    issued: '2026-09-12',
    due: '2026-10-12',
    amount: 980000,
    paid: 980000,
    status: 'Paid',
  },
];

export const abcStockMovements = [
  {
    id: 'SM-1185',
    skuId: 'SKU-1005',
    sku: 'SBS Board 300 GSM',
    type: 'Consumption',
    qty: 4800,
    unit: 'sheets',
    date: '2026-11-07',
    reference: 'JOB-2443 material issue',
    jobId: 'JOB-2443',
    balance: 8000,
  },
  {
    id: 'SM-1186',
    skuId: 'SKU-1008',
    sku: 'Water-based Ink · Forest Green',
    type: 'Consumption',
    qty: 28,
    unit: 'litres',
    date: '2026-11-07',
    reference: 'JOB-2443 ink issue',
    jobId: 'JOB-2443',
    balance: 392,
  },
];

export const portalSupportSeed = [
  {
    id: 'SUP-2026-0039',
    customerId: ABC_CUSTOMER_ID,
    company: ABC_COMPANY,
    name: 'Ritu Bansal',
    email: 'ritu.bansal@abcfoods.in',
    category: 'Delivery',
    subject: 'Split delivery for PO ABC/PO/2026/0714',
    message:
      'Can the first 60,000 cartons reach Taloja on 20 November and the balance by 24 November? Our co-packer needs the earlier lot for the muesli line.',
    status: 'Open',
    priority: 'High',
    createdAt: '2026-11-15T17:05:00+05:30',
    replies: [
      {
        id: 'SUP-2026-0039-R1',
        author: 'Neha Joshi',
        role: 'Account manager',
        message: 'Checking the plan with logistics. We will confirm the split and dispatch notes by 17 November.',
        time: '2026-11-16T08:40:00+05:30',
      },
    ],
  },
  {
    id: 'SUP-2026-0038',
    customerId: ABC_CUSTOMER_ID,
    company: ABC_COMPANY,
    name: 'Vivek Menon',
    email: 'vivek.menon@abcfoods.in',
    category: 'Artwork',
    subject: 'Batch code placement on the 300 g carton',
    message: 'The new batch code window sits too close to the fold. Can prepress move it 4 mm left on the next proof?',
    status: 'Resolved',
    priority: 'Normal',
    createdAt: '2026-11-06T11:25:00+05:30',
    replies: [
      {
        id: 'SUP-2026-0038-R1',
        author: 'Dev Malhotra',
        role: 'Prepress',
        message: 'Moved the batch window 4 mm left and re-exported plate-ready art. Included in proof v2.',
        time: '2026-11-07T09:10:00+05:30',
      },
    ],
  },
];

export const abcPortalProfile = {
  legalName: 'ABC Foods Private Limited',
  tradingName: ABC_COMPANY,
  gstin: '27AABCA9472Q1Z3',
  fssai: '11522998000412',
  industry: 'Packaged foods · Breakfast cereal',
  website: 'abcfoods.in',
  paymentTerms: 'Net 30',
  accountManager: 'Neha Joshi',
  accountManagerEmail: 'neha@starkpackmate.com',
  accountManagerPhone: '+91 98200 11223',
  addresses: [
    {
      id: 'ADDR-1',
      label: 'Registered office',
      lines: ['704, Trade Centre', 'Bandra Kurla Complex', 'Mumbai 400051', 'Maharashtra, India'],
    },
    {
      id: 'ADDR-2',
      label: 'Billing address',
      lines: ['ABC Foods — Finance', '704, Trade Centre', 'Bandra Kurla Complex', 'Mumbai 400051'],
    },
    {
      id: 'ADDR-3',
      label: 'Delivery · Taloja plant',
      lines: ['ABC Foods Plant 2', 'Plot 18, Taloja MIDC', 'Navi Mumbai 410208'],
    },
  ],
  bank: {
    name: 'HDFC Bank · BKC branch',
    account: '50200041782314',
    ifsc: 'HDFC0000240',
    note: 'Quote the invoice number in the transfer narration.',
  },
  documents: [
    { id: 'DOC-1', name: 'GST registration certificate', type: 'PDF', updated: '2026-04-02', size: '184 KB' },
    { id: 'DOC-2', name: 'FSSAI licence · 2026 renewal', type: 'PDF', updated: '2026-05-19', size: '262 KB' },
    { id: 'DOC-3', name: 'Packaging supply agreement · signed', type: 'PDF', updated: '2025-07-01', size: '1.2 MB' },
    { id: 'DOC-4', name: 'Food-safe ink declaration', type: 'PDF', updated: '2026-10-27', size: '96 KB' },
  ],
};

export const ABC_PORTAL_HIGHLIGHTS = [
  { label: 'Account since', value: 'Jun 2023' },
  { label: 'Orders delivered', value: '34' },
  { label: 'On-time delivery', value: '98.4%' },
  { label: 'Quality acceptance', value: '99.1%' },
];
