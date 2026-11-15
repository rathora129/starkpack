export const brandStats = [
  { value: '16', suffix: 'yrs', label: 'Manufacturing since 2009' },
  { value: '480', suffix: '+', label: 'Brands supplied' },
  { value: '120', suffix: 'M', label: 'Boxes produced each year' },
  { value: '99.2', suffix: '%', label: 'On-time dispatch' },
];

export const valueProps = [
  {
    icon: 'ruler',
    title: 'Engineered protection',
    description:
      'Every structure is drop-tested and burst-tested in our lab before it reaches your line — not after it reaches your customer.',
  },
  {
    icon: 'printer',
    title: 'Print that earns attention',
    description:
      'Seven-colour offset, HD flexo, spot UV, foiling and embossing under one roof, colour-managed to G7 standards.',
  },
  {
    icon: 'layers',
    title: 'Built for scale',
    description:
      'Three plants, 180,000 sq ft and 120 million boxes a year. Capacity that flexes with your peak season, not against it.',
  },
  {
    icon: 'leaf',
    title: 'Responsible by design',
    description:
      'FSC-certified board, water-based inks and right-sized structures that cut material without cutting protection.',
  },
];

export const products = [
  {
    slug: 'corrugated-shipping-boxes',
    name: 'Corrugated Shipping Boxes',
    shortName: 'Corrugated',
    category: 'Corrugated',
    eyebrow: 'Transit packaging',
    tagline: 'Engineered strength for every mile.',
    description:
      'High-performance 3-ply and 5-ply shipping cases built around your product, your pallet and your courier network. Right-sized to reduce void fill, board weight and damaged-goods claims.',
    image: '/images/hero.jpg',
    imageAlt: 'Premium kraft corrugated shipping boxes stacked on a wooden pallet',
    startingAt: 16,
    unit: 'box',
    moq: '500 units',
    turnaround: '7–10 working days',
    badges: ['ECT 32–48', '100% recyclable'],
    features: [
      {
        icon: 'shield',
        title: 'Drop-tested structures',
        description: 'ISTA-aligned drop and compression testing on every new die-line.',
      },
      {
        icon: 'ruler',
        title: 'Right-sized by design',
        description: 'Reduce board consumption and void fill by up to 22% with custom sizing.',
      },
      {
        icon: 'printer',
        title: 'Flexo or litho print',
        description: 'One to three colour flexo for transit, or litho-laminated for retail impact.',
      },
      {
        icon: 'recycle',
        title: 'Circular by default',
        description: 'FSC-certified kraft board with water-based inks and starch adhesives.',
      },
    ],
    specs: [
      { label: 'Board', value: '3-ply & 5-ply kraft (120–200 GSM liners)' },
      { label: 'Fluting', value: 'B, C and BC flute combinations' },
      { label: 'Print', value: 'Flexo 1–3 colour or litho-laminated' },
      { label: 'Minimum order', value: '500 units per SKU' },
      { label: 'Lead time', value: '7–10 working days' },
      { label: 'Sustainability', value: 'FSC certified, 100% recyclable' },
    ],
    applications: ['E-commerce dispatch', 'FMCG distribution', 'Electronics', 'Industrial parts'],
    related: ['premium-mailer-boxes', 'industrial-heavy-duty', 'ecommerce-unboxing-kit'],
  },
  {
    slug: 'premium-mailer-boxes',
    name: 'Premium Mailer Boxes',
    shortName: 'Mailers',
    category: 'Corrugated',
    eyebrow: 'D2C unboxing',
    tagline: 'The unboxing your customers remember.',
    description:
      'A rigid-feel corrugated mailer with a tuck-front lid, precision-printed inside and out. Designed for direct-to-consumer brands that treat the first five seconds of unboxing as media.',
    image: '/images/mailer-boxes.jpg',
    imageAlt: 'Kraft corrugated mailer boxes arranged in a flat lay',
    startingAt: 34,
    unit: 'box',
    moq: '500 units',
    turnaround: '8–12 working days',
    badges: ['Full-colour litho', 'Double-sided print'],
    features: [
      {
        icon: 'sparkles',
        title: 'Built for the reveal',
        description: 'Full-colour interior print turns the lid into a branded moment.',
      },
      {
        icon: 'shield',
        title: 'Rigid-feel construction',
        description: 'E-flute walls with a tuck-front closure that holds its shape in transit.',
      },
      {
        icon: 'palette',
        title: 'Finish options',
        description: 'Matte lamination, spot UV, soft-touch and copper foil accents.',
      },
      {
        icon: 'truck',
        title: 'Courier-ready',
        description: 'Sized to common last-mile tiers to avoid dimensional weight penalties.',
      },
    ],
    specs: [
      { label: 'Board', value: 'E-flute with 250 GSM art paper wrap' },
      { label: 'Print', value: '4-colour litho, inside + outside' },
      { label: 'Finishes', value: 'Matte lamination, spot UV, foil' },
      { label: 'Minimum order', value: '500 units per SKU' },
      { label: 'Lead time', value: '8–12 working days' },
      { label: 'Sustainability', value: 'FSC certified, plastic-free' },
    ],
    applications: ['Apparel & lifestyle', 'Beauty & skincare', 'Subscription boxes', 'Gifting'],
    related: ['ecommerce-unboxing-kit', 'printed-folding-cartons', 'rigid-gift-boxes'],
  },
  {
    slug: 'printed-folding-cartons',
    name: 'Printed Folding Cartons',
    shortName: 'Folding cartons',
    category: 'Folding cartons',
    eyebrow: 'Retail packaging',
    tagline: 'Shelf presence, precisely printed.',
    description:
      'Premium folding cartons in SBS and FBB board, printed on seven-colour offset and finished with the details that make a product feel considered before it is touched.',
    image: '/images/folding-cartons.jpg',
    imageAlt: 'Premium printed folding cartons in green, sand and white',
    startingAt: 8,
    unit: 'carton',
    moq: '1,000 units',
    turnaround: '9–12 working days',
    badges: ['7-colour offset', 'G7 colour'],
    features: [
      {
        icon: 'printer',
        title: 'Seven-colour offset',
        description: 'Heidelberg XL 106 with inline coating for consistent, vivid colour.',
      },
      {
        icon: 'sparkles',
        title: 'Premium finishing',
        description: 'Hot foil, blind emboss, spot UV and soft-touch lamination.',
      },
      {
        icon: 'ruler',
        title: 'Structural prototyping',
        description: 'White-sample and printed prototypes in 72 hours.',
      },
      {
        icon: 'leaf',
        title: 'FSC board options',
        description: 'SBS and FBB stocks from certified, responsibly managed forests.',
      },
    ],
    specs: [
      { label: 'Board', value: '280–450 GSM SBS / FBB' },
      { label: 'Print', value: '7-colour offset + inline coating' },
      { label: 'Finishes', value: 'Foil, emboss, spot UV, soft-touch' },
      { label: 'Minimum order', value: '1,000 units per SKU' },
      { label: 'Lead time', value: '9–12 working days' },
      { label: 'Sustainability', value: 'FSC certified, recyclable' },
    ],
    applications: ['Beauty & personal care', 'Nutraceuticals', 'Electronics', 'Confectionery'],
    related: ['rigid-gift-boxes', 'food-grade-packaging', 'premium-mailer-boxes'],
  },
  {
    slug: 'rigid-gift-boxes',
    name: 'Rigid Gift Boxes',
    shortName: 'Rigid boxes',
    category: 'Rigid',
    eyebrow: 'Luxury packaging',
    tagline: 'Luxury that feels inevitable.',
    description:
      'Hand-wrapped rigid boxes with magnetic closures, ribbon pulls and foam inserts. Built on automatic rigid box lines for precision at a scale usually reserved for hand assembly.',
    image: '/images/rigid-boxes.jpg',
    imageAlt: 'Deep green and sand luxury rigid gift boxes with copper foil edges',
    startingAt: 92,
    unit: 'box',
    moq: '250 units',
    turnaround: '12–16 working days',
    badges: ['Magnetic close', 'Hand-finished'],
    features: [
      {
        icon: 'sparkles',
        title: 'Magnetic closures',
        description: 'Concealed magnets for a controlled, premium opening experience.',
      },
      {
        icon: 'palette',
        title: 'Wrap & foil library',
        description: 'Over 120 textured papers, specialty stocks and foil colours.',
      },
      {
        icon: 'box',
        title: 'Custom inserts',
        description: 'EVA foam, molded pulp and thermoformed inserts cut to your product.',
      },
      {
        icon: 'shield',
        title: 'Protective core',
        description: '1,200–1,500 micron greyboard keeps its form through transit.',
      },
    ],
    specs: [
      { label: 'Core', value: '1,200–1,500 micron greyboard' },
      { label: 'Wrap', value: 'Textured art paper, specialty stock' },
      { label: 'Finishes', value: 'Foil, emboss, deboss, spot UV' },
      { label: 'Minimum order', value: '250 units per SKU' },
      { label: 'Lead time', value: '12–16 working days' },
      { label: 'Inserts', value: 'EVA, molded pulp, thermoformed PET-free' },
    ],
    applications: ['Luxury gifting', 'Beauty sets', 'Watches & jewellery', 'Corporate hampers'],
    related: ['printed-folding-cartons', 'kraft-retail-bags', 'premium-mailer-boxes'],
  },
  {
    slug: 'kraft-retail-bags',
    name: 'Kraft Retail Bags',
    shortName: 'Retail bags',
    category: 'Retail',
    eyebrow: 'Retail carry',
    tagline: 'Carry the brand out the door.',
    description:
      'Premium kraft shopping bags with twisted paper or cotton handles, reinforced tops and clean print reproduction. The last touchpoint between your brand and the street.',
    image: '/images/kraft-bags.jpg',
    imageAlt: 'Premium kraft paper shopping bags with rope handles',
    startingAt: 22,
    unit: 'bag',
    moq: '1,000 units',
    turnaround: '8–10 working days',
    badges: ['FSC kraft', 'Reinforced top'],
    features: [
      {
        icon: 'leaf',
        title: 'FSC-certified kraft',
        description: '120–200 GSM kraft in natural, white and custom-matched shades.',
      },
      {
        icon: 'sparkles',
        title: 'Handle options',
        description: 'Twisted paper, flat paper, cotton and die-cut handles.',
      },
      {
        icon: 'printer',
        title: 'Crisp brand print',
        description: 'Flexo or offset print with spot-colour matching.',
      },
      {
        icon: 'shield',
        title: 'Load-bearing build',
        description: 'Reinforced top fold and base card for up to 12 kg loads.',
      },
    ],
    specs: [
      { label: 'Paper', value: '120–200 GSM FSC kraft' },
      { label: 'Handles', value: 'Twisted paper, cotton, die-cut' },
      { label: 'Print', value: 'Flexo or offset, 1–4 colour' },
      { label: 'Minimum order', value: '1,000 units per SKU' },
      { label: 'Lead time', value: '8–10 working days' },
      { label: 'Load rating', value: 'Up to 12 kg' },
    ],
    applications: ['Retail stores', 'Pop-ups', 'Events', 'Hospitality'],
    related: ['printed-folding-cartons', 'rigid-gift-boxes', 'food-grade-packaging'],
  },
  {
    slug: 'food-grade-packaging',
    name: 'Food-Grade Packaging',
    shortName: 'Food-grade',
    category: 'Food',
    eyebrow: 'Food & beverage',
    tagline: 'Safe, compliant, appetising.',
    description:
      'Food-contact cartons, sleeves and trays produced in a dedicated hygienic zone with food-grade inks and board. Compliant documentation with every batch.',
    image: '/images/specialty-packaging.jpg',
    imageAlt: 'Food and beverage packaging including a coffee pouch, tube and cartons',
    startingAt: 11,
    unit: 'unit',
    moq: '1,000 units',
    turnaround: '10–14 working days',
    badges: ['Food-contact safe', 'BRCGS site'],
    features: [
      {
        icon: 'shield',
        title: 'Food-contact compliance',
        description: 'Food-grade inks, coatings and board with migration testing.',
      },
      {
        icon: 'leaf',
        title: 'Grease & moisture barriers',
        description: 'Dispersion and PE-free barrier coatings for shelf life.',
      },
      {
        icon: 'printer',
        title: 'Appetite appeal',
        description: 'High-fidelity print with brand colour control across runs.',
      },
      {
        icon: 'clock',
        title: 'Batch traceability',
        description: 'Full material and production traceability on every carton.',
      },
    ],
    specs: [
      { label: 'Board', value: 'Food-grade SBS / kraft, 250–400 GSM' },
      { label: 'Barriers', value: 'Grease-resistant, moisture-resistant' },
      { label: 'Print', value: 'Food-safe offset inks' },
      { label: 'Minimum order', value: '1,000 units per SKU' },
      { label: 'Lead time', value: '10–14 working days' },
      { label: 'Compliance', value: 'BRCGS, FSSAI-aligned documentation' },
    ],
    applications: ['QSR & cloud kitchens', 'Coffee & tea', 'Bakery', 'Ready-to-eat'],
    related: ['printed-folding-cartons', 'kraft-retail-bags', 'corrugated-shipping-boxes'],
  },
  {
    slug: 'ecommerce-unboxing-kit',
    name: 'E-commerce Unboxing Kit',
    shortName: 'Unboxing kits',
    category: 'E-commerce',
    eyebrow: 'Fulfilment systems',
    tagline: 'One system for every order.',
    description:
      'A coordinated set of mailer, tissue, tape, insert card and return sleeve — designed together, produced together and stocked together, so your fulfilment line never improvises.',
    image: '/images/sustainability.jpg',
    imageAlt: 'Sustainable e-commerce packaging kit with kraft box and molded pulp insert',
    startingAt: 48,
    unit: 'kit',
    moq: '500 kits',
    turnaround: '10–14 working days',
    badges: ['Plastic-free', '5-piece kit'],
    features: [
      {
        icon: 'box',
        title: 'Designed as a system',
        description: 'Mailer, tissue, tape, card and return sleeve in one visual language.',
      },
      {
        icon: 'clock',
        title: 'Kitting & warehousing',
        description: 'Pre-assembled kits delivered to your 3PL, ready to pack.',
      },
      {
        icon: 'leaf',
        title: 'Plastic-free',
        description: 'Paper tape, recycled tissue and soy-based inks throughout.',
      },
      {
        icon: 'layers',
        title: 'Reorder automation',
        description: 'Consumption-based replenishment against agreed par levels.',
      },
    ],
    specs: [
      { label: 'Kit contents', value: 'Mailer, tissue, tape, insert card, return sleeve' },
      { label: 'Board', value: 'FSC E-flute + 17 GSM recycled tissue' },
      { label: 'Print', value: '4-colour litho, soy-based inks' },
      { label: 'Minimum order', value: '500 kits' },
      { label: 'Lead time', value: '10–14 working days' },
      { label: 'Kitting', value: 'Available at Plant 3, Pune' },
    ],
    applications: ['D2C brands', 'Marketplaces', 'Subscription commerce', 'Gifting'],
    related: ['premium-mailer-boxes', 'kraft-retail-bags', 'corrugated-shipping-boxes'],
  },
  {
    slug: 'industrial-heavy-duty',
    name: 'Industrial Heavy-Duty Cases',
    shortName: 'Industrial',
    category: 'Industrial',
    eyebrow: 'Industrial transit',
    tagline: 'Built for the weight of industry.',
    description:
      'Heavy-duty 5-ply and 7-ply cases, pallet boxes and fitments engineered for machinery parts, automotive components and export consignments. Tested to your supply chain, not a catalogue.',
    image: '/images/warehouse.jpg',
    imageAlt: 'Palletised heavy-duty packaging in a high-bay warehouse',
    startingAt: 140,
    unit: 'case',
    moq: '100 units',
    turnaround: '10–15 working days',
    badges: ['ECT 48+', 'Export-grade'],
    features: [
      {
        icon: 'shield',
        title: 'High-load construction',
        description: '5-ply and 7-ply board rated for stacked static loads up to 1,200 kg.',
      },
      {
        icon: 'ruler',
        title: 'Engineered fitments',
        description: 'Die-cut cradles and partitions that eliminate movement in transit.',
      },
      {
        icon: 'truck',
        title: 'Export-ready',
        description: 'ISPM-15 compliant dunnage options and seaworthy treatments.',
      },
      {
        icon: 'layers',
        title: 'Pallet integration',
        description: 'Pallet-box systems designed around your existing racking.',
      },
    ],
    specs: [
      { label: 'Board', value: '5-ply & 7-ply kraft, up to 250 GSM liners' },
      { label: 'Load rating', value: 'Up to 1,200 kg static' },
      { label: 'Print', value: 'Flexo 1–2 colour' },
      { label: 'Minimum order', value: '100 units per SKU' },
      { label: 'Lead time', value: '10–15 working days' },
      { label: 'Testing', value: 'Compression, drop, vibration' },
    ],
    applications: ['Automotive', 'Engineering', 'Chemicals', 'Export logistics'],
    related: ['corrugated-shipping-boxes', 'food-grade-packaging', 'ecommerce-unboxing-kit'],
  },
];

export const productCategories = [
  'All',
  'Corrugated',
  'Folding cartons',
  'Rigid',
  'Retail',
  'Food',
  'E-commerce',
  'Industrial',
];

export const solutions = [
  {
    id: 'ecommerce',
    number: '01',
    title: 'E-commerce fulfilment',
    subtitle: 'Ship faster, damage less, unbox better.',
    description:
      'Right-sized packaging systems, pre-kitted for your 3PL and designed for dimensional-weight efficiency. One partner for mailers, tissue, tape and returns.',
    bullets: [
      'Dimensional-weight optimisation',
      'Kitting and 3PL replenishment',
      'Custom unboxing systems',
      'Peak-season capacity reservation',
    ],
    metric: '22%',
    metricLabel: 'Average reduction in packaging cost',
    image: '/images/mailer-boxes.jpg',
  },
  {
    id: 'retail',
    number: '02',
    title: 'Retail & brand',
    subtitle: 'Packaging that performs on a crowded shelf.',
    description:
      'Folding cartons, rigid boxes and retail bags produced to a single colour standard, with structural prototyping that gets you to market in weeks, not quarters.',
    bullets: [
      'G7 colour-managed print',
      '72-hour structural prototypes',
      'Foil, emboss and specialty finishes',
      'Shelf-ready and counter displays',
    ],
    metric: '480+',
    metricLabel: 'Brands supplied',
    image: '/images/kraft-bags.jpg',
  },
  {
    id: 'industrial',
    number: '03',
    title: 'Industrial & logistics',
    subtitle: 'Engineered to protect what cannot fail.',
    description:
      'Heavy-duty cases, pallet boxes and custom fitments validated against your real distribution hazards — from monsoon humidity to multi-leg export handling.',
    bullets: [
      'Load and compression engineering',
      'ISTA-aligned transit testing',
      'Seaworthy export treatments',
      'Vendor-managed inventory',
    ],
    metric: '99.65%',
    metricLabel: 'Damage-free delivery rate',
    image: '/images/warehouse.jpg',
  },
  {
    id: 'food',
    number: '04',
    title: 'Food & beverage',
    subtitle: 'Compliant packaging that looks delicious.',
    description:
      'Food-contact cartons, sleeves and trays produced in a dedicated hygienic zone with full traceability, barrier options and appetite-appeal print.',
    bullets: [
      'Food-contact certified materials',
      'Grease and moisture barriers',
      'BRCGS-aligned production',
      'Batch-level documentation',
    ],
    metric: '100%',
    metricLabel: 'Batch traceability',
    image: '/images/specialty-packaging.jpg',
  },
  {
    id: 'gifting',
    number: '05',
    title: 'Subscription & gifting',
    subtitle: 'Make every box worth photographing.',
    description:
      'Rigid boxes, magnetic closures and custom inserts for limited editions, corporate hampers and subscription moments — assembled and dispatched on your schedule.',
    bullets: [
      'Magnetic rigid box construction',
      'Custom foam and pulp inserts',
      'Ribbon, foil and speciality wraps',
      'Seasonal design refresh',
    ],
    metric: '3.4×',
    metricLabel: 'Average unboxing share rate',
    image: '/images/rigid-boxes.jpg',
  },
];

export const industries = [
  {
    slug: 'ecommerce',
    name: 'E-commerce & D2C',
    icon: 'shopping',
    summary: 'High-volume mailers, kits and returns packaging engineered for last-mile realities.',
    stat: '60M+',
    statLabel: 'mailers a year',
    products: ['premium-mailer-boxes', 'ecommerce-unboxing-kit', 'corrugated-shipping-boxes'],
  },
  {
    slug: 'fmcg',
    name: 'FMCG',
    icon: 'layers',
    summary: 'Shelf-ready cartons and shipper cases with colour consistency across every run.',
    stat: '14',
    statLabel: 'FMCG brands supplied',
    products: ['printed-folding-cartons', 'corrugated-shipping-boxes'],
  },
  {
    slug: 'apparel',
    name: 'Apparel & lifestyle',
    icon: 'shirt',
    summary: 'Unboxing-led mailers and premium retail bags that extend the brand experience.',
    stat: '3.4×',
    statLabel: 'unboxing share rate',
    products: ['premium-mailer-boxes', 'kraft-retail-bags', 'ecommerce-unboxing-kit'],
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    icon: 'cpu',
    summary: 'Precision fitments, ESD-safe options and drop-tested protection for high-value goods.',
    stat: '0.28%',
    statLabel: 'defect rate',
    products: ['printed-folding-cartons', 'industrial-heavy-duty', 'premium-mailer-boxes'],
  },
  {
    slug: 'food',
    name: 'Food & beverage',
    icon: 'coffee',
    summary: 'Food-contact certified cartons and sleeves produced in a dedicated hygienic zone.',
    stat: '24',
    statLabel: 'food brands supplied',
    products: ['food-grade-packaging', 'kraft-retail-bags'],
  },
  {
    slug: 'beauty',
    name: 'Beauty & personal care',
    icon: 'sparkles',
    summary: 'Luxury rigid boxes and folding cartons finished with foil, emboss and soft-touch.',
    stat: '42',
    statLabel: 'beauty brands supplied',
    products: ['rigid-gift-boxes', 'printed-folding-cartons', 'premium-mailer-boxes'],
  },
  {
    slug: 'pharma',
    name: 'Pharma & healthcare',
    icon: 'pill',
    summary: 'Traceable, compliant cartons with serialisation-ready print and rigorous batch control.',
    stat: '100%',
    statLabel: 'batch traceability',
    products: ['printed-folding-cartons', 'food-grade-packaging'],
  },
  {
    slug: 'home',
    name: 'Home & décor',
    icon: 'home',
    summary: 'Protective heavy-duty cases and premium retail packaging for fragile, bulky goods.',
    stat: '99.65%',
    statLabel: 'damage-free delivery',
    products: ['industrial-heavy-duty', 'rigid-gift-boxes', 'kraft-retail-bags'],
  },
];

export const capabilities = [
  {
    icon: 'design',
    title: 'Structural design & prototyping',
    description: 'In-house dielines, CAD cutting table and white samples in 72 hours.',
  },
  {
    icon: 'printer',
    title: 'Offset printing',
    description: 'Heidelberg XL 106, seven colours plus inline coating, 18,000 sheets/hour.',
  },
  {
    icon: 'palette',
    title: 'Prepress & colour management',
    description: 'G7 master qualification, Esko workflows and closed-loop colour control.',
  },
  {
    icon: 'layers',
    title: 'Corrugating',
    description: 'BHS 2.5 m corrugator producing B, C, E and BC flute board in-house.',
  },
  {
    icon: 'ruler',
    title: 'Die-cutting & creasing',
    description: 'Bobst Novacut 106 with 7,700 sheets/hour and ±0.1 mm register.',
  },
  {
    icon: 'box',
    title: 'Gluing & rigid box making',
    description: 'Automatic folder-gluers and a dedicated rigid box line for luxury formats.',
  },
  {
    icon: 'truck',
    title: 'Fulfilment & warehousing',
    description: 'Kitting, vendor-managed inventory and dispatch from three locations.',
  },
  {
    icon: 'shield',
    title: 'Testing & validation',
    description: 'In-house burst, compression, drop and climate testing to ISTA protocols.',
  },
];

export const machinery = [
  {
    name: 'Heidelberg Speedmaster XL 106',
    type: '7-colour offset press + coater',
    capacity: '18,000 sheets / hour',
    detail: 'Full-colour retail cartons with inline aqueous and UV coating.',
  },
  {
    name: 'BHS Corrugator 2.5 m',
    type: 'Corrugated board line',
    capacity: '120 m / minute',
    detail: 'B, C, E and BC flute production with automatic warp control.',
  },
  {
    name: 'Bobst Novacut 106',
    type: 'Automatic die-cutter',
    capacity: '7,700 sheets / hour',
    detail: 'Precision cutting and creasing with inline stripping.',
  },
  {
    name: 'Bobst Ambition 106',
    type: 'Folder-gluer',
    capacity: '450 m / minute',
    detail: 'Straight-line, crash-lock and four-corner box styles.',
  },
  {
    name: 'TCY Flexo Folder Gluer',
    type: 'Corrugated case maker',
    capacity: '300 boxes / minute',
    detail: 'In-line printing, slotting, folding and gluing for shipping cases.',
  },
  {
    name: 'Rigid Box Line',
    type: 'Automatic rigid box maker',
    capacity: '2,400 boxes / shift',
    detail: 'Magnetic closures, wrap precision and hand-finishing stations.',
  },
];

export const facilityStats = [
  { value: '180,000', label: 'sq ft manufacturing' },
  { value: '3', label: 'production facilities' },
  { value: '420', label: 'team members' },
  { value: '120M', label: 'boxes per year' },
];

export const qualityCertifications = [
  {
    code: 'ISO 9001:2015',
    name: 'Quality management',
    body: 'Bureau Veritas',
    description: 'Documented quality management across design, production and dispatch.',
  },
  {
    code: 'ISO 14001:2015',
    name: 'Environmental management',
    body: 'Bureau Veritas',
    description: 'Measured environmental impact, waste reduction and energy management.',
  },
  {
    code: 'FSC® CoC',
    name: 'Forest stewardship',
    body: 'FSC Licence FSC-C148921',
    description: 'Chain-of-custody certification across certified board sourcing and production.',
  },
  {
    code: 'BRCGS',
    name: 'Packaging materials',
    body: 'AA Grade',
    description: 'Hygiene and product-safety systems for food-contact packaging.',
  },
];

export const qualityMetrics = [
  { value: '99.2%', label: 'On-time dispatch', detail: 'Across 4,100 dispatches last quarter' },
  { value: '0.28%', label: 'Defect rate', detail: 'Measured at final pre-dispatch audit' },
  { value: '48 hr', label: 'Lab turnaround', detail: 'Standard physical testing cycle' },
  { value: '100%', label: 'Batch traceability', detail: 'From reel to dispatched pallet' },
];

export const qualityTests = [
  { name: 'Burst strength', standard: 'TAPPI T403', detail: 'Board and finished-case resistance to rupture.' },
  { name: 'Edge crush (ECT)', standard: 'TAPPI T811', detail: 'Stacking strength for warehouse and transit loads.' },
  { name: 'Cobb sizing', standard: 'TAPPI T441', detail: 'Water absorption for humidity-exposed supply chains.' },
  { name: 'Drop & vibration', standard: 'ISTA 3A / 3E', detail: 'Simulated last-mile and parcel-network hazards.' },
  { name: 'Climate chamber', standard: '38°C / 90% RH', detail: 'Tropical-condition conditioning before compression.' },
  { name: 'Colour Delta E', standard: 'ISO 12647', detail: 'Spectral colour verification against approved master.' },
];

export const qualitySteps = [
  { step: '01', title: 'Incoming material', detail: 'Every reel and sheet batch is quarantined and tested for GSM, moisture and strength.' },
  { step: '02', title: 'In-process checks', detail: 'Print, die-cut and glue checks at defined intervals with digital capture.' },
  { step: '03', title: 'Lab validation', detail: 'Physical and environmental testing against the approved specification.' },
  { step: '04', title: 'Pre-dispatch audit', detail: 'AQL sampling, count verification and photographic batch records.' },
  { step: '05', title: 'Batch release', detail: 'Traceable release certificate with retained samples for twelve months.' },
];

export const portfolio = [
  {
    id: 'aurea',
    brand: 'Aurea Beauty',
    category: 'Beauty',
    title: 'A refillable luxury ritual',
    description:
      'A magnetic rigid box with molded pulp insert and foil crest, engineered for a refillable serum launch across 1,200 retail doors.',
    image: '/images/rigid-boxes.jpg',
    metrics: [
      { value: '38%', label: 'gift-set uplift' },
      { value: '12 wks', label: 'concept to shelf' },
    ],
    tags: ['Rigid', 'Foil', 'Retail'],
  },
  {
    id: 'northline',
    brand: 'Northline Apparel',
    category: 'E-commerce',
    title: 'Unboxing as a growth channel',
    description:
      'A two-piece mailer system with interior print, paper tape and a return sleeve that cut packaging cost per order while lifting review mentions.',
    image: '/images/mailer-boxes.jpg',
    metrics: [
      { value: '22%', label: 'packaging cost saved' },
      { value: '4.8/5', label: 'unboxing rating' },
    ],
    tags: ['Mailer', 'D2C', 'Sustainable'],
  },
  {
    id: 'terra',
    brand: 'Terra Coffee Co.',
    category: 'Food',
    title: 'Shelf-ready coffee, monsoon-proof',
    description:
      'A folding carton and corrugated shipper combination with moisture barrier, designed for humid retail environments and export transit.',
    image: '/images/specialty-packaging.jpg',
    metrics: [
      { value: '0.2%', label: 'damage rate' },
      { value: '3', label: 'export markets' },
    ],
    tags: ['Food-grade', 'Export', 'Barrier'],
  },
  {
    id: 'pulse',
    brand: 'Pulse Electronics',
    category: 'Industrial',
    title: 'Protecting precision at scale',
    description:
      'A die-cut cradle and 5-ply case system for high-value electronics, validated through ISTA 3E testing and multi-leg export handling.',
    image: '/images/warehouse.jpg',
    metrics: [
      { value: '99.7%', label: 'damage-free' },
      { value: '18%', label: 'board weight saved' },
    ],
    tags: ['Industrial', 'Testing', 'Fitment'],
  },
  {
    id: 'verdant',
    brand: 'Verdant Foods',
    category: 'Food',
    title: 'A plastic-free pantry',
    description:
      'Grease-resistant cartons with molded pulp inserts for a ready-to-eat range, replacing laminated trays without compromising shelf life.',
    image: '/images/sustainability.jpg',
    metrics: [
      { value: '100%', label: 'plastic removed' },
      { value: '9 mo', label: 'shelf life' },
    ],
    tags: ['Sustainable', 'Food-grade', 'Pulp'],
  },
  {
    id: 'bloom',
    brand: 'Bloom & Co.',
    category: 'Retail',
    title: 'Retail theatre in kraft',
    description:
      'A modular retail bag and carton programme with a single colour standard, rolled out across 64 stores in eleven weeks.',
    image: '/images/kraft-bags.jpg',
    metrics: [
      { value: '64', label: 'stores rolled out' },
      { value: '11 wks', label: 'programme time' },
    ],
    tags: ['Retail', 'Kraft', 'Programme'],
  },
  {
    id: 'atlas',
    brand: 'Atlas Industrial',
    category: 'Industrial',
    title: 'A pallet system engineered to stack',
    description:
      'A 7-ply pallet box and partition system that replaced wooden crates, cutting freight weight and assembly time for export consignments.',
    image: '/images/factory.jpg',
    metrics: [
      { value: '26%', label: 'freight weight cut' },
      { value: '1,200 kg', label: 'load rating' },
    ],
    tags: ['Heavy-duty', 'Export', 'Pallet'],
  },
  {
    id: 'goodpantry',
    brand: 'The Good Pantry',
    category: 'E-commerce',
    title: 'A subscription worth keeping',
    description:
      'A seasonal rigid box with six insert configurations, allowing a monthly subscription to refresh its look without changing its pack line.',
    image: '/images/hero.jpg',
    metrics: [
      { value: '41%', label: 'retention lift' },
      { value: '6', label: 'insert formats' },
    ],
    tags: ['Subscription', 'Rigid', 'Gifting'],
  },
];

export const portfolioCategories = ['All', 'Beauty', 'E-commerce', 'Food', 'Industrial', 'Retail'];

export const testimonials = [
  {
    quote:
      'We moved four packaging SKUs to Stark in a peak season and did not miss a single dispatch date. The colour consistency across plants is the best we have seen in India.',
    name: 'Meera Raghavan',
    role: 'Head of Supply Chain',
    company: 'Northline Apparel',
    initials: 'MR',
  },
  {
    quote:
      'They engineered a fitment that removed 18% of our board weight and eliminated transit damage on a fragile electronics line. That is not a vendor, that is a partner.',
    name: 'Rohan Desai',
    role: 'Director, Operations',
    company: 'Pulse Electronics',
    initials: 'RD',
  },
  {
    quote:
      'Our rigid boxes are hand-finished but produced with the discipline of an automotive line. The samples arrived in 72 hours and matched the approved drawdown exactly.',
    name: 'Ananya Kapoor',
    role: 'Founder',
    company: 'Aurea Beauty',
    initials: 'AK',
  },
  {
    quote:
      'The audit and traceability documentation made our BRCGS review straightforward. For food packaging, that confidence is worth as much as the carton itself.',
    name: 'Vikram Iyer',
    role: 'Quality Lead',
    company: 'Verdant Foods',
    initials: 'VI',
  },
];

export const timeline = [
  { year: '2009', title: 'Founded in Mumbai', detail: 'Started with a single flexo press and a focus on corrugated transit packaging.' },
  { year: '2012', title: 'First corrugator', detail: 'Commissioned an in-house 2.5 m corrugator, bringing board production under our control.' },
  { year: '2016', title: 'Pune plant opens', detail: 'Added 90,000 sq ft in Chakan to serve western India’s automotive and FMCG belts.' },
  { year: '2019', title: 'FSC certification', detail: 'Achieved chain-of-custody certification and moved all water-based ink lines to low-VOC formulations.' },
  { year: '2022', title: 'Rigid box line', detail: 'Launched automatic rigid box production for luxury beauty and gifting programmes.' },
  { year: '2025', title: '120M capacity', detail: 'Expanded to three facilities and crossed 120 million boxes of annual capacity.' },
];

export const leadership = [
  { name: 'Aarav Mehta', role: 'Managing Director', initials: 'AM', bio: 'Third-generation packaging manufacturer focused on precision and long-term client partnerships.' },
  { name: 'Sana Kulkarni', role: 'Chief Operating Officer', initials: 'SK', bio: 'Leads manufacturing across three plants with 18 years in print and converting operations.' },
  { name: 'Dev Malhotra', role: 'Head of Design & Innovation', initials: 'DM', bio: 'Structural packaging engineer behind award-winning e-commerce and luxury formats.' },
  { name: 'Priya Nair', role: 'Head of Quality & Compliance', initials: 'PN', bio: 'Owns the lab, certifications and the batch-level traceability system across all sites.' },
];

export const values = [
  {
    icon: 'ruler',
    title: 'Precision is a habit',
    description: 'Tolerances, colour and counts are measured, not estimated. Every run has a record.',
  },
  {
    icon: 'leaf',
    title: 'Leave less behind',
    description: 'Right-sized structures, certified fibre and low-VOC inks as the default, not an upsell.',
  },
  {
    icon: 'handshake',
    title: 'Own the outcome',
    description: 'We measure success in your dispatch performance, not the invoice we raise.',
  },
  {
    icon: 'sparkles',
    title: 'Make it worth keeping',
    description: 'Packaging should earn a second life or a photograph. Ideally both.',
  },
];

export const clientLogos = [
  'AUREA',
  'NORTHLINE',
  'TERRA',
  'PULSE',
  'VERDANT',
  'BLOOM & CO.',
  'ATLAS',
  'GOOD PANTRY',
];

export const faqs = [
  {
    q: 'What is the minimum order quantity?',
    a: 'Standard MOQs start at 500 units for corrugated mailers and shipping boxes, 1,000 for folding cartons, 250 for rigid boxes and 100 for heavy-duty industrial cases. Prototypes can be produced in smaller quantities.',
  },
  {
    q: 'Can you produce a printed prototype before I commit?',
    a: 'Yes. We produce white samples in 72 hours and fully printed prototypes in 5–7 working days for most formats, including foil and specialty finishes.',
  },
  {
    q: 'Do you supply nationally and for export?',
    a: 'We dispatch nationwide from three plants and support export documentation, ISPM-15 compliant dunnage and seaworthy packaging for sea and air freight.',
  },
  {
    q: 'How do you handle brand colour consistency?',
    a: 'Our prepress is G7-qualified. We retain approved drawdowns, measure Delta E on every run and use closed-loop colour control on press.',
  },
  {
    q: 'Are your materials recyclable?',
    a: 'Our standard corrugated, folding carton and kraft bag ranges are FSC-certified and fully recyclable. We also offer plastic-free kits with paper tape and recycled tissue.',
  },
];

export const qualityQuote = {
  quote:
    'Quality is not a final inspection. It is the sum of decisions made at the reel, the press and the die — long before a box reaches the customer.',
  name: 'Priya Nair',
  role: 'Head of Quality & Compliance',
  initials: 'PN',
};
