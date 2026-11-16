const toLines = (value) =>
  String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export function parseSpecs(value) {
  return toLines(value)
    .map((line) => {
      const separator = line.indexOf(':');
      if (separator === -1) return { label: 'Detail', value: line };
      return { label: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() };
    })
    .filter((spec) => spec.value);
}

export function parseList(value) {
  return String(value || '')
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function mergeProducts(cmsProducts = [], catalogProducts = []) {
  return cmsProducts
    .map((cms, index) => {
      const base = catalogProducts.find((product) => product.slug === cms.slug) || null;
      const specs = parseSpecs(cms.specsText);
      const applications = parseList(cms.applicationsText);
      const gallery = parseList(cms.galleryText);
      const badge = cms.badge?.trim() || null;
      return {
        ...(base || {}),
        slug: cms.slug || base?.slug || '',
        name: cms.name || base?.name || 'Untitled product',
        shortName: base?.shortName || cms.name || 'Product',
        category: base?.category || cms.category || 'Packaging',
        eyebrow: cms.eyebrow || base?.eyebrow || cms.category || 'Packaging',
        tagline: cms.tagline || base?.tagline || cms.summary || '',
        description: cms.description || base?.description || cms.summary || '',
        summary: cms.summary || base?.description || '',
        image: cms.image || base?.image || '/images/hero.jpg',
        imageAlt: cms.imageAlt || base?.imageAlt || cms.name || 'Packaging product',
        gallery,
        startingAt: cms.startingAt || base?.startingAt || null,
        unit: cms.unit || base?.unit || 'unit',
        moq: cms.moq || base?.moq || 'On brief',
        turnaround: cms.turnaround || base?.turnaround || 'On brief',
        features: base?.features || [],
        specs: specs.length ? specs : base?.specs || [],
        applications: applications.length ? applications : base?.applications || [],
        related: base?.related || [],
        seoTitle: cms.seoTitle || '',
        seoDescription: cms.seoDescription || '',
        badge,
        badges: base?.badges?.length ? base.badges : [badge].filter(Boolean),
        featured: Boolean(cms.featured),
        published: Boolean(cms.published),
        order: Number.isFinite(cms.order) ? Number(cms.order) : index + 1,
      };
    })
    .filter((product) => product.slug)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function publishedProducts(cmsProducts = [], catalogProducts = []) {
  return mergeProducts(cmsProducts, catalogProducts).filter((product) => product.published);
}

export function getProduct(cmsProducts = [], catalogProducts = [], slug) {
  return mergeProducts(cmsProducts, catalogProducts).find((product) => product.slug === slug) || null;
}
