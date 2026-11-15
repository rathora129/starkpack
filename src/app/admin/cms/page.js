'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Save,
  Globe2,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Search,
  Mail,
  Phone,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Image as ImageIcon,
  Package,
  Sparkles,
  Quote,
  Newspaper,
  Boxes,
  Layers,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { formatDate, formatDateTime } from '@/lib/format';
import { colors, fonts, radii, shadows } from '@/lib/theme';
import {
  PageHeaderBar,
  PageHeading,
  PageDescription,
  PageActions,
  Button,
  ButtonLink,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelSubtitle,
  PanelBody,
  PanelFooter,
  StatusChip,
  Divider,
  Grid,
  EmptyState,
} from '@/components/ui/primitives';
import { Segmented, SearchInput } from '@/components/ui/Controls';
import { AppModal, ConfirmDialog } from '@/components/ui/Overlay';
import { TextField, TextAreaField, SelectField, SwitchField, FormGrid, FormActions } from '@/components/ui/FormFields';

const Preview = styled.div`
  border-radius: ${radii.lg};
  overflow: hidden;
  border: 1px solid ${colors.lineSoft};
  box-shadow: ${shadows.card};
`;

const PreviewBar = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: #EFECE4;

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #C9C2B3;
  }

  span {
    margin-left: 8px;
    font-family: ${fonts.mono};
    font-size: 9px;
    color: ${colors.faint};
  }
`;

const PreviewHero = styled.div`
  padding: 20px 18px 22px;
  background: linear-gradient(150deg, #143D31 0%, #0C231C 100%);
  color: #F9F6EE;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: 1px solid rgba(217, 160, 106, 0.2);
    right: -50px;
    top: -60px;
  }

  p:first-child {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${colors.copperSoft};
  }

  h3 {
    font-family: ${fonts.display};
    font-size: 22px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 8px 0 8px;
    max-width: 95%;
    color: #F9F6EE;
  }

  p.copy {
    font-size: 10px;
    line-height: 1.6;
    color: rgba(249, 246, 238, 0.72);
    max-width: 95%;
  }

  div.ctas {
    display: flex;
    gap: 7px;
    margin-top: 14px;
  }

  span.cta {
    font-size: 9px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 5px;
    background: ${colors.copper};
    color: #fff;
  }

  span.ghost {
    background: transparent;
    border: 1px solid rgba(249, 246, 238, 0.28);
    color: rgba(249, 246, 238, 0.8);
  }
`;

const Announcement = styled.div`
  padding: 8px 12px;
  background: ${colors.copperWash};
  border-bottom: 1px solid #E9D6BB;
  color: #7C491F;
  font-size: 9px;
  font-weight: 600;
  text-align: center;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:last-child {
    border-bottom: 0;
  }

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    font-size: 11.5px;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 10px;
    color: ${colors.faint};
    margin-top: 1px;
  }
`;

const IconBadge = styled.span`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${colors.mist};
  color: ${colors.inkSoft};
  flex: 0 0 auto;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid ${colors.lineSoft};
  transition: background 140ms ease;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: #FCFBF8;
  }

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

const RowIcon = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: ${colors.mist};
  color: ${colors.forest};
  flex: 0 0 auto;
`;

const RowMain = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.4;
  }

  p {
    margin-top: 3px;
    font-size: 11px;
    color: ${colors.muted};
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  small {
    display: block;
    margin-top: 4px;
    font-size: 10px;
    color: ${colors.faint};
  }
`;

const RowSide = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  margin-left: auto;

  @media (max-width: 640px) {
    width: 100%;
    margin-left: 46px;
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 16px 14px;
`;

const CountText = styled.span`
  font-size: 10.5px;
  color: ${colors.faint};
`;

const TabPanel = styled.div`
  padding: 16px 16px 0;
  border-bottom: 1px solid ${colors.lineSoft};
`;

const homeValidation = Yup.object({
  headline: Yup.string().trim().min(12, 'Headline is too short').required('Headline is required'),
  subcopy: Yup.string().trim().min(20, 'Add a little more detail').required('Subcopy is required'),
  announcement: Yup.string(),
});

const seoValidation = Yup.object({
  title: Yup.string().trim().min(10, 'Title is too short').max(70, 'Keep titles under 70 characters').required(),
  description: Yup.string().trim().min(50, 'Descriptions should be 50–160 characters').max(170, 'Keep under 170 characters').required(),
});

const contactValidation = Yup.object({
  phone: Yup.string().trim().required('Phone is required'),
  whatsapp: Yup.string().trim().required('WhatsApp number is required'),
  email: Yup.string().email('Enter a valid email').required(),
  address: Yup.string().trim().required(),
});

const COLLECTIONS = {
  pages: {
    label: 'Pages',
    singular: 'page',
    icon: FileText,
    publishable: true,
    fields: [
      { name: 'title', label: 'Page title', type: 'text', required: true },
      { name: 'slug', label: 'URL path', type: 'text', required: true, hint: 'Core pages use their existing route. Custom pages use /p/…' },
      { name: 'type', label: 'Page type', type: 'select', options: ['Core', 'Custom'] },
      { name: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft', 'Archived'] },
      { name: 'seoTitle', label: 'SEO title', type: 'text', required: true },
      { name: 'seoDescription', label: 'SEO description', type: 'textarea', required: true, rows: 2 },
      { name: 'intro', label: 'Intro headline', type: 'text' },
      { name: 'body', label: 'Page body', type: 'textarea', rows: 7, hint: 'Use blank lines to create paragraphs.' },
    ],
    defaults: { title: '', slug: '/p/', type: 'Custom', status: 'Draft', seoTitle: '', seoDescription: '', intro: '', body: '' },
    titleOf: (item) => item.title,
    metaOf: (item) => `${item.slug} · ${item.type}`,
    excerptOf: (item) => item.seoDescription,
    statusOf: (item) => item.status,
    hrefOf: (item) => (item.status === 'Published' && item.slug.startsWith('/') ? item.slug : null),
  },
  banners: {
    label: 'Banners',
    singular: 'banner',
    icon: Layers,
    publishable: true,
    fields: [
      { name: 'title', label: 'Banner headline', type: 'text', required: true },
      { name: 'subtitle', label: 'Supporting line', type: 'textarea', rows: 2 },
      { name: 'ctaLabel', label: 'CTA label', type: 'text' },
      { name: 'ctaHref', label: 'CTA link', type: 'text', hint: 'Internal path, e.g. /request-a-quote' },
      { name: 'placement', label: 'Placement', type: 'select', options: ['Homepage', 'Solutions', 'Products'] },
      { name: 'theme', label: 'Theme', type: 'select', options: ['Copper', 'Forest', 'Cream'] },
      { name: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'] },
      { name: 'start', label: 'Start date', type: 'date' },
      { name: 'end', label: 'End date', type: 'date' },
    ],
    defaults: { title: '', subtitle: '', ctaLabel: 'Learn more', ctaHref: '/request-a-quote', placement: 'Homepage', theme: 'Copper', status: 'Draft', start: '', end: '' },
    titleOf: (item) => item.title,
    metaOf: (item) => `${item.placement} · ${item.theme} theme`,
    excerptOf: (item) => `${item.subtitle}${item.start ? ` · ${formatDate(item.start)} to ${formatDate(item.end)}` : ''}`,
    statusOf: (item) => item.status,
    hrefOf: (item) => item.ctaHref,
  },
  products: {
    label: 'Products',
    singular: 'product',
    icon: Package,
    publishable: true,
    fields: [
      { name: 'name', label: 'Product name', type: 'text', required: true },
      { name: 'slug', label: 'Catalogue slug', type: 'text', required: true, hint: 'Links to the public product detail page.' },
      { name: 'category', label: 'Category', type: 'select', options: ['Corrugated', 'Cartons', 'Rigid', 'Retail', 'Food', 'Industrial'] },
      { name: 'summary', label: 'Card summary', type: 'textarea', required: true, rows: 3 },
      { name: 'badge', label: 'Badge', type: 'text' },
      { name: 'featured', label: 'Feature on homepage', type: 'switch', description: 'Shows the product in the homepage range.' },
      { name: 'published', label: 'Published on website', type: 'switch', description: 'Unpublished products are hidden from the public catalogue.' },
    ],
    defaults: { name: '', slug: '', category: 'Corrugated', summary: '', badge: '', featured: false, published: false },
    titleOf: (item) => item.name,
    metaOf: (item) => `${item.category} · /products/${item.slug}`,
    excerptOf: (item) => item.summary,
    statusOf: (item) => (item.published ? 'Published' : 'Draft'),
    hrefOf: (item) => (item.published ? `/products/${item.slug}` : null),
  },
  services: {
    label: 'Services',
    singular: 'service',
    icon: Sparkles,
    publishable: true,
    fields: [
      { name: 'title', label: 'Service name', type: 'text', required: true },
      { name: 'icon', label: 'Icon key', type: 'select', options: ['ruler', 'printer', 'shield', 'sparkles', 'boxes', 'leaf', 'package'] },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true, rows: 3 },
      { name: 'order', label: 'Display order', type: 'number' },
      { name: 'published', label: 'Published on website', type: 'switch', description: 'Shows in the services grid on the public solutions page.' },
    ],
    defaults: { title: '', icon: 'package', summary: '', order: 8, published: false },
    titleOf: (item) => item.title,
    metaOf: (item) => `Icon ${item.icon} · position ${item.order}`,
    excerptOf: (item) => item.summary,
    statusOf: (item) => (item.published ? 'Published' : 'Draft'),
    hrefOf: () => null,
  },
  testimonials: {
    label: 'Testimonials',
    singular: 'testimonial',
    icon: Quote,
    publishable: true,
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea', required: true, rows: 4 },
      { name: 'name', label: 'Customer name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'initials', label: 'Initials', type: 'text' },
      { name: 'published', label: 'Published on website', type: 'switch', description: 'Shows in the homepage testimonial carousel.' },
    ],
    defaults: { quote: '', name: '', role: '', company: '', initials: '', published: false },
    titleOf: (item) => item.name,
    metaOf: (item) => `${item.role} · ${item.company}`,
    excerptOf: (item) => item.quote,
    statusOf: (item) => (item.published ? 'Published' : 'Draft'),
    hrefOf: () => null,
  },
  blogs: {
    label: 'Blog',
    singular: 'article',
    icon: Newspaper,
    publishable: true,
    fields: [
      { name: 'title', label: 'Article title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, hint: 'Public URL: /blog/…' },
      { name: 'category', label: 'Category', type: 'select', options: ['Cost engineering', 'Compliance', 'Behind the plant', 'Market', 'Design'] },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true, rows: 2 },
      { name: 'body', label: 'Article body', type: 'textarea', required: true, rows: 8 },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'date', label: 'Publish date', type: 'date' },
      { name: 'readTime', label: 'Read time', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'] },
    ],
    defaults: { title: '', slug: '', category: 'Cost engineering', excerpt: '', body: '', author: 'Stark Packmate', date: new Date().toISOString().slice(0, 10), readTime: '4 min', status: 'Draft' },
    titleOf: (item) => item.title,
    metaOf: (item) => `${item.category} · ${item.author}`,
    excerptOf: (item) => item.excerpt,
    statusOf: (item) => item.status,
    hrefOf: (item) => (item.status === 'Published' ? `/blog/${item.slug}` : null),
  },
  media: {
    label: 'Media',
    singular: 'asset',
    icon: ImageIcon,
    publishable: false,
    fields: [
      { name: 'name', label: 'File name', type: 'text', required: true },
      { name: 'url', label: 'Asset URL', type: 'text', required: true, hint: 'Use a path from /public/images or an external URL.' },
      { name: 'type', label: 'Type', type: 'select', options: ['Photography', 'Banner', 'Video', 'Document'] },
      { name: 'size', label: 'File size', type: 'text' },
      { name: 'dimensions', label: 'Dimensions', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'text', hint: 'Comma separated.' },
    ],
    defaults: { name: '', url: '/images/hero.jpg', type: 'Photography', size: '—', dimensions: '—', tags: '' },
    titleOf: (item) => item.name,
    metaOf: (item) => `${item.type} · ${item.dimensions} · ${item.size}`,
    excerptOf: (item) => item.url,
    statusOf: () => 'Available',
    hrefOf: (item) => item.url,
  },
};

const TABS = [
  { value: 'home', label: 'Homepage' },
  { value: 'pages', label: 'Pages' },
  { value: 'banners', label: 'Banners' },
  { value: 'products', label: 'Products' },
  { value: 'services', label: 'Services' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'blogs', label: 'Blog' },
  { value: 'media', label: 'Media' },
  { value: 'seo', label: 'SEO' },
  { value: 'contact', label: 'Contact' },
];

const buildSchema = (config) => {
  const shape = {};
  config.fields
    .filter((field) => field.required)
    .forEach((field) => {
      shape[field.name] = Yup.string().trim().required(`${field.label} is required`);
    });
  return Yup.object(shape);
};

export default function CmsPage() {
  const cms = useDemoStore((state) => state.cms);
  const saveCms = useDemoStore((state) => state.saveCms);
  const saveCmsItem = useDemoStore((state) => state.saveCmsItem);
  const deleteCmsItem = useDemoStore((state) => state.deleteCmsItem);
  const toggleCmsPublish = useDemoStore((state) => state.toggleCmsPublish);

  const pages = useDemoStore((state) => state.cmsPages);
  const banners = useDemoStore((state) => state.cmsBanners);
  const products = useDemoStore((state) => state.cmsProducts);
  const services = useDemoStore((state) => state.cmsServices);
  const testimonials = useDemoStore((state) => state.cmsTestimonials);
  const blogs = useDemoStore((state) => state.cmsBlogs);
  const media = useDemoStore((state) => state.cmsMedia);

  const collections = useMemo(
    () => ({ pages, banners, products, services, testimonials, blogs, media }),
    [pages, banners, products, services, testimonials, blogs, media]
  );

  const [tab, setTab] = useState('home');
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const activeCollection = COLLECTIONS[tab] || null;
  const items = activeCollection ? collections[tab] || [] : [];

  const filtered = useMemo(() => {
    if (!activeCollection) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      `${activeCollection.titleOf(item)} ${activeCollection.metaOf(item)} ${activeCollection.excerptOf(item) || ''}`
        .toLowerCase()
        .includes(q)
    );
  }, [activeCollection, items, query]);

  const counts = useMemo(() => {
    const published = (list, isPublished) => list.filter(isPublished).length;
    return {
      pages: collections.pages.length,
      publishedPages: published(collections.pages, (item) => item.status === 'Published'),
      products: collections.products.length,
      publishedProducts: published(collections.products, (item) => item.published),
      blogs: collections.blogs.length,
      publishedBlogs: published(collections.blogs, (item) => item.status === 'Published'),
      media: collections.media.length,
    };
  }, [collections]);

  const submit = async (section, values, resetForm) => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 280));
    saveCms(section, values);
    setSaving(false);
    resetForm({ values });
    notify('Website updated', `${section === 'home' ? 'Homepage' : section === 'seo' ? 'SEO metadata' : 'Contact details'} published to the public site.`, 'success');
  };

  const openNew = () => {
    if (!activeCollection) return;
    setEditor({ mode: 'create', values: { ...activeCollection.defaults } });
  };

  const openEdit = (item) => {
    setEditor({ mode: 'edit', values: { ...activeCollection.defaults, ...item } });
  };

  const submitEditor = (values, helpers) => {
    const cleaned = { ...values };
    activeCollection.fields.forEach((field) => {
      if (field.type === 'number') cleaned[field.name] = Number(cleaned[field.name]) || 0;
      if (field.type === 'switch') cleaned[field.name] = Boolean(cleaned[field.name]);
    });
    const saved = saveCmsItem(tab, cleaned);
    notify(
      editor.mode === 'create' ? `${activeCollection.singular} created` : `${activeCollection.singular} updated`,
      `${activeCollection.titleOf(saved)} saved. Published content is live on the public website.`,
      'success'
    );
    setEditor(null);
    helpers.resetForm();
  };

  const togglePublish = (item) => {
    toggleCmsPublish(tab, item.id);
    const nextLabel = 'published' in item ? (item.published ? 'unpublished' : 'published') : item.status === 'Published' ? 'unpublished' : 'published';
    notify('Publish status updated', `${activeCollection.titleOf(item)} ${nextLabel} in the demo website.`, 'success');
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteCmsItem(tab, deleting.id);
    notify(`${activeCollection.singular} deleted`, `${activeCollection.titleOf(deleting)} removed from the demo content library.`, 'info');
    setDeleting(null);
  };

  const showCollection = Boolean(activeCollection);

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Website CMS</PageHeading>
          <PageDescription>
            Manage every published surface of the Stark Packmate website — pages, banners, products,
            services, testimonials, journal articles and media, with SEO metadata attached.
          </PageDescription>
        </div>
        <PageActions>
          <ButtonLink href="/" target="_blank" rel="noopener noreferrer" $variant="light" $size="sm">
            <ExternalLink size={14} /> View website
          </ButtonLink>
          {showCollection ? (
            <Button $variant="primary" $size="sm" onClick={openNew}>
              <Plus size={14} /> New {activeCollection.singular}
            </Button>
          ) : (
            <StatusChip $tone="success" style={{ alignSelf: 'center' }}>
              <CheckCircle2 size={10} /> {counts.publishedPages} core pages live
            </StatusChip>
          )}
        </PageActions>
      </PageHeaderBar>

      <Panel>
        <TabPanel>
          <Segmented
            value={tab}
            onChange={(value) => {
              setTab(value);
              setQuery('');
            }}
            label="Website content section"
            options={TABS.map((entry) => ({
              ...entry,
              count: COLLECTIONS[entry.value] ? collections[entry.value]?.length : undefined,
            }))}
          />
        </TabPanel>

        {tab === 'home' ? (
          <Grid $cols="minmax(0, 1.35fr) minmax(0, 1fr)" $colsMd="1fr" $gap="0">
            <div style={{ borderRight: `1px solid ${colors.lineSoft}` }}>
              <Formik
                initialValues={cms.home}
                validationSchema={homeValidation}
                onSubmit={(values, helpers) => submit('home', values, helpers.resetForm)}
              >
                {() => (
                  <Form>
                    <PanelBody>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.faint, marginBottom: 12 }}>
                        Homepage hero
                      </p>
                      <TextAreaField name="headline" label="Headline" rows={2} required />
                      <div style={{ height: 12 }} />
                      <TextAreaField name="subcopy" label="Subcopy" rows={3} required />
                      <div style={{ height: 12 }} />
                      <FormGrid $cols={2}>
                        <TextField name="eyebrow" label="Eyebrow" />
                        <TextField name="primaryCta" label="Primary CTA label" />
                        <TextField name="secondaryCta" label="Secondary CTA label" />
                      </FormGrid>
                      <Divider style={{ margin: '18px 0' }} />
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.faint, marginBottom: 8 }}>
                        Announcement bar
                      </p>
                      <TextField name="announcement" label="Message" />
                      <SwitchField name="announcementEnabled" label="Show announcement bar" description="Displays above the header on every public page." />
                      <Divider style={{ margin: '18px 0' }} />
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.faint, marginBottom: 4 }}>
                        Homepage sections
                      </p>
                      <SwitchField name="showStats" label="Credentials strip" description="Years, plants, output and certifications." />
                      <SwitchField name="showTestimonials" label="Customer testimonials" description="Published testimonial records from the CMS." />
                      <SwitchField name="showPortfolio" label="Portfolio highlights" description="Three recent packaging programmes." />
                    </PanelBody>
                    <PanelFooter>
                      <span style={{ fontSize: 10.5, color: colors.faint }}>
                        Last updated {formatDateTime(cms.updatedAt)} by {cms.updatedBy}
                      </span>
                      <Button type="submit" $variant="primary" $size="sm" disabled={saving}>
                        {saving ? <RefreshCw size={14} /> : <Save size={14} />} {saving ? 'Publishing…' : 'Publish changes'}
                      </Button>
                    </PanelFooter>
                  </Form>
                )}
              </Formik>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.faint, marginBottom: 10 }}>
                Live preview
              </p>
              <Preview>
                <PreviewBar>
                  <i />
                  <i />
                  <i />
                  <span>starkpackmate.com</span>
                </PreviewBar>
                {cms.home.announcementEnabled ? <Announcement>{cms.home.announcement}</Announcement> : null}
                <PreviewHero>
                  <p>{cms.home.eyebrow}</p>
                  <h3>{cms.home.headline}</h3>
                  <p className="copy">{cms.home.subcopy}</p>
                  <div className="ctas">
                    <span className="cta">{cms.home.primaryCta}</span>
                    <span className="cta ghost">{cms.home.secondaryCta}</span>
                  </div>
                </PreviewHero>
              </Preview>
              <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
                <StatusRow>
                  <IconBadge>
                    <Globe2 size={14} />
                  </IconBadge>
                  <div>
                    <strong>{counts.pages} managed pages</strong>
                    <span>{counts.publishedPages} published · custom pages included</span>
                  </div>
                  <StatusChip $tone="success">Live</StatusChip>
                </StatusRow>
                <StatusRow>
                  <IconBadge>
                    <Package size={14} />
                  </IconBadge>
                  <div>
                    <strong>{counts.publishedProducts} published products</strong>
                    <span>{counts.products} in the catalogue</span>
                  </div>
                  <StatusChip $tone="info">Catalogue</StatusChip>
                </StatusRow>
                <StatusRow>
                  <IconBadge>
                    <Newspaper size={14} />
                  </IconBadge>
                  <div>
                    <strong>{counts.publishedBlogs} journal articles</strong>
                    <span>{counts.blogs} articles in the library</span>
                  </div>
                  <StatusChip $tone="neutral">Journal</StatusChip>
                </StatusRow>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', paddingTop: 10 }}>
                  <AlertTriangle size={14} style={{ color: colors.warning, flex: '0 0 auto', marginTop: 1 }} />
                  <p style={{ fontSize: 10.5, color: colors.muted, lineHeight: 1.55 }}>
                    Demo content is held in memory. Refreshing the browser restores the original
                    presentation copy.
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        ) : null}

        {tab === 'seo' ? (
          <Formik
            initialValues={cms.seo}
            validationSchema={seoValidation}
            onSubmit={(values, helpers) => submit('seo', values, helpers.resetForm)}
          >
            {() => (
              <Form>
                <PanelBody>
                  <TextAreaField name="title" label="Meta title" rows={2} required hint="Shown in search results and browser tabs." />
                  <div style={{ height: 14 }} />
                  <TextAreaField name="description" label="Meta description" rows={3} required />
                  <div style={{ height: 14 }} />
                  <TextField name="keywords" label="Keywords" hint="Comma separated." />
                  <Divider style={{ margin: '20px 0' }} />
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 13, background: colors.cream, borderRadius: radii.sm, border: `1px solid ${colors.lineSoft}` }}>
                    <Search size={16} style={{ color: colors.copper, flex: '0 0 auto', marginTop: 1 }} />
                    <div style={{ fontSize: 11, color: colors.muted, lineHeight: 1.6 }}>
                      <strong style={{ color: colors.ink }}>Search preview</strong>
                      <br />
                      starkpackmate.com › packaging
                      <br />
                      <span style={{ color: '#376C8A', fontSize: 12 }}>{cms.seo.title.slice(0, 60)}</span>
                      <br />
                      {cms.seo.description.slice(0, 150)}…
                    </div>
                  </div>
                </PanelBody>
                <PanelFooter>
                  <span style={{ fontSize: 10.5, color: colors.faint }}>Metadata applies site-wide via Next.js metadata.</span>
                  <Button type="submit" $variant="primary" $size="sm" disabled={saving}>
                    <Save size={14} /> Save SEO
                  </Button>
                </PanelFooter>
              </Form>
            )}
          </Formik>
        ) : null}

        {tab === 'contact' ? (
          <Formik
            initialValues={cms.contact}
            validationSchema={contactValidation}
            onSubmit={(values, helpers) => submit('contact', values, helpers.resetForm)}
          >
            {() => (
              <Form>
                <PanelBody>
                  <FormGrid $cols={2}>
                    <TextField name="phone" label="Phone" />
                    <TextField name="whatsapp" label="WhatsApp number" hint="Digits with country code, e.g. 919820011223." />
                    <TextField name="email" label="Email" />
                    <TextField name="hours" label="Business hours" />
                  </FormGrid>
                  <div style={{ height: 14 }} />
                  <TextAreaField name="address" label="Registered address" rows={2} />
                  <SwitchField name="whatsappEnabled" label="WhatsApp CTA" description="Floating WhatsApp button on the public website and customer portal." />
                  <Divider style={{ margin: '18px 0 0' }} />
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 12 }}>
                    <Phone size={14} style={{ color: colors.forest }} />
                    <span style={{ fontSize: 11, color: colors.muted }}>{cms.contact.phone} · {cms.contact.hours}</span>
                    <Mail size={14} style={{ color: colors.forest, marginLeft: 8 }} />
                    <span style={{ fontSize: 11, color: colors.muted }}>{cms.contact.email}</span>
                  </div>
                </PanelBody>
                <PanelFooter>
                  <span style={{ fontSize: 10.5, color: colors.faint }}>Used by the contact page and RFQ confirmations.</span>
                  <Button type="submit" $variant="primary" $size="sm" disabled={saving}>
                    <Save size={14} /> Save contact
                  </Button>
                </PanelFooter>
              </Form>
            )}
          </Formik>
        ) : null}

        {showCollection ? (
          <>
            <ToolbarRow>
              <SearchInput value={query} onChange={setQuery} placeholder={`Search ${activeCollection.label.toLowerCase()}…`} />
              <CountText>
                {filtered.length} of {items.length} {activeCollection.label.toLowerCase()} ·{' '}
                {items.filter((item) => activeCollection.statusOf(item) === 'Published').length} published
              </CountText>
            </ToolbarRow>
            <List>
              {filtered.map((item) => {
                const Icon = activeCollection.icon;
                const status = activeCollection.statusOf(item);
                const href = activeCollection.hrefOf(item);
                return (
                  <Row key={item.id}>
                    <RowIcon>
                      <Icon size={16} />
                    </RowIcon>
                    <RowMain>
                      <strong>{activeCollection.titleOf(item)}</strong>
                      <p>{activeCollection.excerptOf(item)}</p>
                      <small>{activeCollection.metaOf(item)}</small>
                    </RowMain>
                    <RowSide>
                      <StatusChip $tone={status === 'Published' ? 'success' : status === 'Available' ? 'info' : 'neutral'}>{status}</StatusChip>
                      {href ? (
                        <Button $variant="ghost" $size="xs" onClick={() => window.open(href, '_blank', 'noopener')} aria-label={`Open ${activeCollection.titleOf(item)} on the website`}>
                          <ExternalLink size={12} />
                        </Button>
                      ) : null}
                      {activeCollection.publishable ? (
                        <Button $variant="ghost" $size="xs" onClick={() => togglePublish(item)} aria-label={status === 'Published' ? 'Unpublish' : 'Publish'}>
                          {status === 'Published' ? <EyeOff size={12} /> : <Eye size={12} />}
                        </Button>
                      ) : null}
                      <Button $variant="ghost" $size="xs" onClick={() => openEdit(item)} aria-label={`Edit ${activeCollection.titleOf(item)}`}>
                        <Pencil size={12} />
                      </Button>
                      <Button $variant="ghost" $size="xs" onClick={() => setDeleting(item)} aria-label={`Delete ${activeCollection.titleOf(item)}`}>
                        <Trash2 size={12} style={{ color: colors.danger }} />
                      </Button>
                    </RowSide>
                  </Row>
                );
              })}
              {!filtered.length ? (
                <div style={{ padding: 18 }}>
                  <EmptyState
                    title={`No ${activeCollection.label.toLowerCase()} match`}
                    description="Adjust the search or create a new record."
                    action={
                      <Button $variant="primary" $size="sm" onClick={openNew}>
                        <Plus size={14} /> New {activeCollection.singular}
                      </Button>
                    }
                  />
                </div>
              ) : null}
            </List>
            <PanelFooter>
              <span style={{ fontSize: 10.5, color: colors.faint }}>
                {activeCollection.publishable
                  ? 'Publishing updates the public website instantly in this demo.'
                  : 'Media assets are referenced by pages, banners and articles.'}
              </span>
              <span style={{ fontSize: 10.5, color: colors.faint }}>Updated {formatDate(new Date().toISOString())}</span>
            </PanelFooter>
          </>
        ) : null}
      </Panel>

      <AppModal
        open={Boolean(editor)}
        onClose={() => setEditor(null)}
        title={editor ? `${editor.mode === 'create' ? 'New' : 'Edit'} ${activeCollection?.singular}` : ''}
        description="Changes are stored in the shared demo CMS layer."
        size="md"
      >
        {editor ? (
          <Formik initialValues={editor.values} validationSchema={buildSchema(activeCollection)} onSubmit={submitEditor} enableReinitialize>
            <Form>
              <FormGrid $cols={2}>
                {activeCollection.fields.map((field) => {
                  if (field.type === 'textarea') {
                    return (
                      <div key={field.name} style={{ gridColumn: '1 / -1' }}>
                        <TextAreaField name={field.name} label={field.label} rows={field.rows || 3} required={field.required} hint={field.hint} />
                      </div>
                    );
                  }
                  if (field.type === 'select') {
                    return <SelectField key={field.name} name={field.name} label={field.label} options={field.options} />;
                  }
                  if (field.type === 'switch') {
                    return (
                      <div key={field.name} style={{ gridColumn: '1 / -1' }}>
                        <SwitchField name={field.name} label={field.label} description={field.description} />
                      </div>
                    );
                  }
                  return (
                    <TextField
                      key={field.name}
                      name={field.name}
                      label={field.label}
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      required={field.required}
                      hint={field.hint}
                    />
                  );
                })}
              </FormGrid>
              <FormActions>
                <Button type="button" $variant="secondary" $size="sm" onClick={() => setEditor(null)}>
                  Cancel
                </Button>
                <Button type="submit" $variant="primary" $size="sm">
                  <Save size={14} /> Save {activeCollection.singular}
                </Button>
              </FormActions>
            </Form>
          </Formik>
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={`Delete ${activeCollection?.singular}?`}
        message={deleting ? `“${activeCollection.titleOf(deleting)}” will be removed from the demo content library.` : ''}
        confirmLabel="Delete"
      />
    </div>
  );
}
