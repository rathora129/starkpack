const section = (id, key, type, title, body, extra = {}) => ({
  id,
  key,
  type,
  title,
  body,
  kicker: extra.kicker || '',
  ctaLabel: extra.ctaLabel || '',
  ctaHref: extra.ctaHref || '',
  image: extra.image || '',
  layout: extra.layout || 'default',
  background: extra.background || 'default',
  enabled: extra.enabled !== false,
  order: extra.order || 1,
});

const list = (prefix, items) =>
  items.map((item, index) => ({
    ...item,
    id: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    order: index + 1,
  }));

export const pageSectionsSeed = {
  '/': list('SEC-HOME', [
    section('', 'hero', 'Hero', 'Packaging that carries your brand with certainty.', 'From corrugated transit to luxury rigid boxes, we design, engineer and manufacture packaging that protects what matters and elevates how it arrives.', {
      kicker: 'Packaging manufacturer · Since 2009',
      ctaLabel: 'Request a quote',
      ctaHref: '/request-a-quote',
      layout: 'split',
      background: 'cream',
    }),
    section('', 'clients', 'Logo strip', 'Trusted by brands that ship with care', 'Client logo strip shown directly below the hero.', { layout: 'strip' }),
    section('', 'why', 'Feature grid', 'Packaging is an operating system, not a purchase order.', 'Design, tooling, print, converting and dispatch under one roof — so quality, cost and lead time stay inside your control.', { kicker: 'Why Stark Packmate', ctaLabel: 'Inside our plants', ctaHref: '/capabilities' }),
    section('', 'products', 'Product grid', 'Structures for every job in the supply chain.', 'From the case that survives the courier network to the box that earns the photograph — engineered to your product, not picked from a catalogue.', { kicker: 'Product range', ctaLabel: 'All products', ctaHref: '/products' }),
    section('', 'solutions', 'Solution grid', 'Built around the way your product actually moves.', 'A packaging programme is more than a box. We design systems — structures, print, kits and replenishment — around your channel, your 3PL and your peak season.', { kicker: 'Solutions', ctaLabel: 'Explore solutions', ctaHref: '/solutions' }),
    section('', 'manufacturing', 'Split feature', 'Precision you can audit, at a scale you can plan around.', 'Three facilities, a BHS corrugator, Heidelberg XL 106 and Bobst converting lines — all under the same quality system. Every batch traceable from reel to dispatched pallet.', { kicker: 'Manufacturing', ctaLabel: 'Tour the capabilities', ctaHref: '/capabilities', image: '/images/factory.jpg' }),
    section('', 'quality', 'Editorial', 'The detail you do not see is the reason it arrives intact.', 'Certified systems, calibrated equipment and a lab that tests the structure before your customer tests your promise.', { kicker: 'Quality & compliance', ctaLabel: 'Our quality standard', ctaHref: '/quality' }),
    section('', 'portfolio', 'Portfolio grid', 'Programmes that moved a number, not just a box.', 'Each engagement starts with a commercial problem — damage, cost, shelf appeal or speed to market — and ends with packaging that performs.', { kicker: 'Selected work', ctaLabel: 'View portfolio', ctaHref: '/portfolio' }),
    section('', 'testimonials', 'Testimonials', 'The relationship is the product.', 'Long-running partnerships across supply chain, quality and founder teams — measured in dispatch dates kept and problems solved.', { kicker: 'Client voices' }),
    section('', 'cta', 'CTA band', 'Your next pack starts with a conversation.', 'Send us a product, a volume and a date. We will come back with a structure, a price and a production plan — not a brochure.', { kicker: 'One business day response', ctaLabel: 'Request a quote', ctaHref: '/request-a-quote', background: 'paper' }),
  ]),
  '/about': list('SEC-ABOUT', [
    section('', 'hero', 'Hero', "A workshop's eye. A factory's discipline.", 'We began in 2009 with one flexo press in Mumbai and a belief that packaging was being treated as an afterthought. Sixteen years later, three plants and 420 people later, the belief has not changed.', { kicker: 'About Stark Packmate', ctaLabel: 'Inside the plants', ctaHref: '/capabilities' }),
    section('', 'story', 'Split feature', 'Built by operators, not intermediaries.', 'Every plant is run by people who have stood on the floor, and every account is supported by the engineers who designed the pack.', { kicker: 'The story', image: '/images/factory.jpg' }),
    section('', 'milestones', 'Timeline', 'Sixteen years, one direction.', 'From a single press to three plants and 120 million boxes a year.', { kicker: 'Milestones' }),
    section('', 'values', 'Feature grid', 'Four rules that show up in every decision.', 'Protect the product. Respect the deadline. Remove waste. Own the outcome.', { kicker: 'What we believe' }),
    section('', 'leadership', 'People grid', 'The people accountable for your programme.', 'Commercial, engineering and plant leadership working as one team.', { kicker: 'Leadership' }),
    section('', 'footprint', 'Locations', 'Three plants inside the country’s busiest supply corridors.', 'Mumbai, Pune and Chennai, positioned for fast dispatch across India.', { kicker: 'Our footprint' }),
    section('', 'cta', 'CTA band', 'Come and see how the work is made.', 'Book a plant visit or talk to the engineering team about your next programme.', { ctaLabel: 'Book a plant visit', ctaHref: '/contact' }),
  ]),
  '/products': list('SEC-PRODUCTS', [
    section('', 'hero', 'Hero', 'The right structure for the job.', 'Eight core packaging families, each engineered to your dimensions, print and distribution realities. Mix formats across a single programme and keep one quality standard.', { kicker: 'Product range', ctaLabel: 'Request a quote', ctaHref: '/request-a-quote' }),
    section('', 'catalogue', 'Product grid', 'Every format, one quality standard.', 'Filter the catalogue by family, then open any product for specifications and applications.', { kicker: 'Catalogue' }),
    section('', 'custom', 'Split feature', 'Nothing here fits? We engineer from the product out.', 'Send us the product, the journey and the shelf — we will design the structure.', { kicker: 'Custom engineering', ctaLabel: 'Start a custom brief', ctaHref: '/request-a-quote' }),
  ]),
  '/solutions': list('SEC-SOLUTIONS', [
    section('', 'hero', 'Hero', 'Packaging systems, not just boxes.', 'Fulfilment, retail, industrial, food and gifting programmes designed around your operation.', { kicker: 'Solutions', ctaLabel: 'Request a quote', ctaHref: '/request-a-quote' }),
    section('', 'outcomes', 'Solution grid', 'Start from the outcome you need.', 'Lower damage, faster packing, stronger shelf presence or a better unboxing moment.', { kicker: 'By outcome' }),
    section('', 'services', 'Service grid', 'The work that sits around the box.', 'Structural design, prototyping, print production and managed replenishment.', { kicker: 'Managed services' }),
    section('', 'cta', 'CTA band', 'One programme. Several formats. One quality standard.', 'Most clients start with a single SKU and expand. We keep structures, colour and lead times consistent as your range grows.', { kicker: 'Design-led engineering', ctaLabel: 'Talk to a consultant', ctaHref: '/contact' }),
  ]),
  '/industries': list('SEC-INDUSTRIES', [
    section('', 'hero', 'Hero', 'Different products. The same obsession with arrival.', 'Category-specific structures, compliance and print finishes for the industries we serve.', { kicker: 'Industries', ctaLabel: 'Talk to an engineer', ctaHref: '/contact' }),
    section('', 'grid', 'Industry grid', 'Built around the realities of each category.', 'E-commerce, FMCG, food, beauty, apparel, industrial and gifting.', { kicker: 'Categories' }),
    section('', 'approach', 'Split feature', 'How we work with categories.', 'We start with the journey the pack has to survive, then engineer backwards.', { kicker: 'How we work with categories' }),
    section('', 'cta', 'CTA band', 'Your category has a packaging problem worth solving.', 'Bring us the brief and the constraints.', { ctaLabel: 'Start a conversation', ctaHref: '/contact' }),
  ]),
  '/capabilities': list('SEC-CAPABILITIES', [
    section('', 'hero', 'Hero', 'Manufacturing that stays inside your control.', 'Design, tooling, print, converting and dispatch under one roof, with every step measured.', { kicker: 'Manufacturing', ctaLabel: 'Book a plant visit', ctaHref: '/contact' }),
    section('', 'roof', 'Split feature', 'One roof, fewer hand-offs.', 'A single quality system across three plants, from reel to dispatched pallet.', { kicker: 'One roof, fewer hand-offs', image: '/images/factory.jpg' }),
    section('', 'steps', 'Capability grid', 'Every step owned, measured and repeatable.', 'Structural design, prepress, corrugating, offset, flexo, die-cutting and finishing.', { kicker: 'Capabilities' }),
    section('', 'machinery', 'Specification', 'Machinery selected for tolerance, not brochure appeal.', 'BHS corrugator, Heidelberg XL 106, Bobst die-cutters and automated folder-gluers.', { kicker: 'Plant floor' }),
    section('', 'testing', 'Process', 'Testing and validation before the first production run.', 'Drop, compression, vibration and climate testing aligned to ISTA methods.', { kicker: 'Testing & validation' }),
    section('', 'capacity', 'CTA band', 'Plan your next production run with us.', 'Share your volumes and delivery window. We will confirm equipment, board and dispatch slots.', { kicker: 'Capacity available for Q1', ctaLabel: 'Check capacity', ctaHref: '/request-a-quote' }),
  ]),
  '/quality': list('SEC-QUALITY', [
    section('', 'hero', 'Hero', 'Quality is a system, not a promise.', 'Certified processes, calibrated equipment and documented checks at every gate.', { kicker: 'Quality & compliance', ctaLabel: 'Download quality pack', ctaHref: '/contact' }),
    section('', 'certifications', 'Certifications', 'Audited by the bodies your customers trust.', 'ISO 9001, FSC, BRCGS and ISTA-aligned testing.', { kicker: 'Certifications' }),
    section('', 'laboratory', 'Process', 'Six tests that decide whether a pack ships.', 'Compression, drop, vibration, climate, ink adhesion and migration screening.', { kicker: 'Laboratory' }),
    section('', 'gates', 'Process', 'Five gates between a reel and a dispatched pallet.', 'Incoming board, print approval, die-cut dimensional check, glue strength and final dispatch audit.', { kicker: 'Process control' }),
    section('', 'documents', 'Documents', 'Compliance documentation on request.', 'Migration declarations, FSC chain-of-custody and batch traceability records.', { kicker: 'Compliance' }),
  ]),
  '/portfolio': list('SEC-PORTFOLIO', [
    section('', 'hero', 'Hero', 'Packaging that moved a number.', 'Selected programmes across apparel, food, beauty and industrial categories.', { kicker: 'Selected work', ctaLabel: 'Start your programme', ctaHref: '/request-a-quote' }),
    section('', 'cases', 'Case grid', 'Brief, constraint, intervention and result.', 'Open any programme for the structural and commercial detail.', { kicker: 'Case studies' }),
    section('', 'results', 'CTA band', 'Every case here began with a difficult brief.', 'Bring us the constraint — cost, damage, shelf impact, speed. That is the interesting part.', { kicker: 'Your category next', ctaLabel: 'Start your brief', ctaHref: '/request-a-quote' }),
  ]),
  '/blog': list('SEC-BLOG', [
    section('', 'hero', 'Hero', 'Notes from the plant floor.', 'Cost engineering, compliance, design and production lessons from real programmes.', { kicker: 'Journal' }),
    section('', 'grid', 'Article grid', 'Browse the journal.', 'Filter by category and read the full article.', { kicker: 'All articles' }),
    section('', 'cta', 'CTA band', 'Talk to an engineer.', 'Bring a real packaging problem to the conversation.', { kicker: 'Talk to an engineer', ctaLabel: 'Contact the team', ctaHref: '/contact' }),
  ]),
  '/contact': list('SEC-CONTACT', [
    section('', 'hero', 'Hero', "Let's talk packaging.", 'Samples, pricing, capacity or a structural review — the team responds within one business day.', { kicker: 'Contact', ctaLabel: 'Request a quote', ctaHref: '/request-a-quote' }),
    section('', 'form', 'Contact form', 'Tell us what you are packing.', 'Share the product, volume and timeline and we will route it to the right engineer.', { kicker: 'Direct lines' }),
    section('', 'faq', 'FAQ', 'Frequently asked questions.', 'MOQ, lead times, sampling and documentation.', { kicker: 'Before you ask' }),
    section('', 'cta', 'CTA band', 'Need a number today?', 'Our sales desk is available Monday to Saturday, 9:00–18:30 IST.', { kicker: 'Faster than a form', ctaLabel: 'Call the desk' }),
  ]),
  '/request-a-quote': list('SEC-RFQ', [
    section('', 'hero', 'Hero', 'Tell us what you need to pack.', 'Share the product, quantity, print and delivery reality. We will respond with a structure, price and production plan.', { kicker: 'Request a quote', ctaLabel: 'Submit the brief', ctaHref: '#quote-form' }),
    section('', 'form', 'Enquiry form', 'Request for quotation.', 'Product family, quantity, specifications and contact details.', { kicker: 'Your brief' }),
  ]),
  '/p/sustainability': list('SEC-SUSTAIN', [
    section('', 'hero', 'Hero', 'Less material. Same protection. A measurable roadmap.', 'FSC board, water-based inks, right-sized structures and a 2027 roadmap to cut material intensity.', { kicker: 'Sustainability' }),
    section('', 'body', 'Rich text', 'Sustainability as an engineering constraint.', 'Every structural review includes a material-reduction target, and every substrate is checked against the customer’s end-of-life pathway.', { kicker: 'Our approach' }),
    section('', 'cta', 'CTA band', 'Ask for a material-reduction review.', 'Bring your top SKUs and we will map the savings.', { ctaLabel: 'Contact the team', ctaHref: '/contact' }),
  ]),
  '/p/packaging-audit': list('SEC-AUDIT', [
    section('', 'hero', 'Hero', 'Find the cost hiding inside your packaging.', 'A structured review of cost, protection and material efficiency across your top packaging SKUs.', { kicker: 'Packaging audit' }),
    section('', 'body', 'Rich text', 'Ten SKUs. Ten working days. A prioritised report.', 'We review board weight, cube utilisation, damage claims and print configuration, then deliver estimated annual savings and sample recommendations.', { kicker: 'What you receive' }),
    section('', 'cta', 'CTA band', 'Book a packaging audit.', 'Send the SKU list and current pack spec to get started.', { ctaLabel: 'Request the audit', ctaHref: '/contact' }),
  ]),
};
