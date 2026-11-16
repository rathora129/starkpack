'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  TrendingUp,
  Link2,
  Copy,
  CheckCircle2,
  FileText,
  Megaphone,
  LayoutTemplate,
  Search as SearchIcon,
  ArrowUp,
  ArrowDown,
  PauseCircle,
  PlayCircle,
  Layers,
  X,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { formatNumber, formatDate, statusTone } from '@/lib/format';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import {
  PageHeaderBar,
  PageHeading,
  PageDescription,
  PageActions,
  Button,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelBody,
  PanelFooter,
  StatusChip,
  EmptyState,
  ProgressTrack,
  ProgressFill,
  Divider,
} from '@/components/ui/primitives';
import { SearchInput, FilterChips, Segmented } from '@/components/ui/Controls';
import { AppModal, Drawer, ConfirmDialog, DetailGrid, DetailItem, DetailLabel, DetailValue } from '@/components/ui/Overlay';
import MiniStats from '@/components/dashboard/MiniStats';
import { TextField, TextAreaField, SelectField, SwitchField, FormGrid, FormActions } from '@/components/ui/FormFields';
import LandingPageView from '@/components/site/LandingPageView';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const PageCard = styled.article`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  overflow: hidden;
  box-shadow: ${shadows.xs};
  transition: transform ${transitions.base}, box-shadow ${transitions.base}, border-color ${transitions.base};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.card};
    border-color: #C9CBE0;
  }
`;

const CardHero = styled.div`
  position: relative;
  padding: 18px 16px 16px;
  min-height: 128px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(145deg, #1B1464 0%, #0D0A33 100%);
  color: #F6F6FF;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: -32px;
    bottom: -48px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  h3 {
    position: relative;
    z-index: 1;
    font-family: ${fonts.display};
    font-size: 19px;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.01em;
    max-width: 90%;
  }

  @media (max-width: 700px) {
    min-height: 112px;
  }
`;

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;

  small {
    font-family: ${fonts.mono};
    font-size: 9.5px;
    letter-spacing: 0.06em;
    color: rgba(249, 246, 238, 0.65);
  }
`;

const HeroTemplates = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  span {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 3px 7px;
    border-radius: ${radii.pill};
    background: rgba(255, 255, 255, 0.1);
    color: rgba(249, 246, 238, 0.86);
  }
`;

const CardBody = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;

  strong {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.35;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 3px;
    font-family: ${fonts.mono};
    font-size: 10px;
    color: ${colors.faint};
  }
`;

const MetricRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 0;
  border-top: 1px solid ${colors.lineSoft};
  border-bottom: 1px solid ${colors.lineSoft};
`;

const Metric = styled.div`
  min-width: 0;

  p {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${colors.faint};
    margin-bottom: 2px;
  }

  strong {
    font-size: 13px;
    font-weight: 700;
    color: ${colors.inkSoft};
    letter-spacing: -0.01em;
  }
`;

const CardFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;

  small {
    font-size: 10.5px;
    color: ${colors.faint};
  }
`;

const FootActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

const IconAction = styled.button`
  display: inline-grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: ${radii.xs};
  border: 1px solid ${colors.line};
  background: #fff;
  color: ${colors.muted};
  transition: all ${transitions.fast};

  &:hover {
    border-color: ${colors.forest};
    color: ${colors.forest};
    background: ${colors.mist};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid ${colors.line};
  background: #fff;
  border-radius: ${radii.xs};
  padding: 5px 8px;
  font-family: ${fonts.sans};
  font-size: 10.5px;
  font-weight: 700;
  color: ${colors.muted};
  transition: all ${transitions.fast};

  &:hover {
    border-color: ${colors.forest};
    color: ${colors.forest};
  }
`;

const PerfBar = styled.div`
  margin-top: 16px;
`;

const PerfLabel = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 11px;
  font-weight: 600;
  color: ${colors.muted};
  margin-bottom: 6px;

  strong {
    color: ${colors.ink};
  }
`;

const UtmStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 12px;
  border-radius: ${radii.sm};
  background: ${colors.cream};
  border: 1px solid ${colors.lineSoft};
  margin-bottom: 18px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  div {
    min-width: 0;
  }

  p {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
    margin-bottom: 2px;
  }

  strong {
    display: block;
    font-family: ${fonts.mono};
    font-size: 11px;
    font-weight: 600;
    color: ${colors.inkSoft};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SectionRow = styled.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
  padding: 12px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  background: ${({ $disabled }) => ($disabled ? '#FAF8F3' : '#fff')};
  opacity: ${({ $disabled }) => ($disabled ? 0.72 : 1)};

  & + & {
    margin-top: 8px;
  }
`;

const SectionIndex = styled.span`
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${colors.mist};
  font-family: ${fonts.mono};
  font-size: 9px;
  font-weight: 700;
  color: ${colors.muted};
  margin-top: 1px;
`;

const SectionBody = styled.div`
  min-width: 0;

  h4 {
    font-size: 12px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    font-size: 10.5px;
    line-height: 1.55;
    color: ${colors.muted};
    margin-top: 3px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  span.type {
    display: inline-block;
    margin-top: 6px;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
    background: ${colors.copperWash};
    padding: 2px 6px;
    border-radius: ${radii.pill};
  }
`;

const SectionTools = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const MiniIcon = styled.button`
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: ${radii.xs};
  background: transparent;
  color: ${colors.muted};
  transition: all ${transitions.fast};

  &:hover {
    background: ${colors.mist};
    color: ${colors.ink};
  }

  &:disabled {
    opacity: 0.28;
    cursor: not-allowed;
  }
`;

const FieldChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  background: #fff;

  & + & {
    margin-top: 6px;
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
    font-size: 9.5px;
    color: ${colors.faint};
    font-family: ${fonts.mono};
  }
`;

const RequiredToggle = styled.button`
  border: 1px solid ${({ $active }) => ($active ? colors.forest : colors.line)};
  background: ${({ $active }) => ($active ? colors.mist : '#fff')};
  color: ${({ $active }) => ($active ? colors.forest : colors.faint)};
  border-radius: ${radii.pill};
  font-family: ${fonts.sans};
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 8px;

  &:hover {
    border-color: ${colors.forest};
  }
`;

const AddFieldRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 110px auto;
  gap: 8px;
  align-items: center;
  margin-top: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }

  input,
  select {
    width: 100%;
    font-family: ${fonts.sans};
    font-size: 11.5px;
    color: ${colors.ink};
    background: #FAFAFD;
    border: 1px solid ${colors.line};
    border-radius: ${radii.xs};
    padding: 8px 10px;
    outline: none;

    &:focus {
      border-color: ${colors.forest};
    }
  }
`;

const PlainGroup = styled.label`
  display: grid;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${colors.inkSoft};

  input,
  textarea {
    width: 100%;
    font-family: ${fonts.sans};
    font-size: 12px;
    color: ${colors.ink};
    background: #FAFAFD;
    border: 1px solid ${colors.line};
    border-radius: ${radii.sm};
    padding: 9px 11px;
    outline: none;
    resize: vertical;

    &:focus {
      border-color: ${colors.forest};
      box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.08);
    }
  }
`;

const PlainRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const DangerZone = styled.div`
  margin-top: 24px;
  padding: 14px 16px;
  border: 1px solid #EED6D2;
  border-radius: ${radii.sm};
  background: #FDF7F6;

  strong {
    display: block;
    font-size: 12px;
    color: ${colors.ink};
  }

  p {
    font-size: 10.5px;
    line-height: 1.6;
    color: ${colors.muted};
    margin: 4px 0 12px;
  }
`;

const PreviewFrame = styled.div`
  margin: -22px -24px;
  background: ${colors.cream};
  overflow: hidden;

  @media (max-width: 640px) {
    margin: -18px;
  }
`;

const validation = Yup.object({
  title: Yup.string().trim().required('Give the landing page a name'),
  slug: Yup.string()
    .trim()
    .required('A public path is required')
    .matches(/^([/]?lp[/])?[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only'),
  headline: Yup.string().trim().required('A hero headline is required'),
  campaign: Yup.string(),
  template: Yup.string().required('Pick a template'),
});

const settingsValidation = Yup.object({
  title: Yup.string().trim().required('A page name is required'),
  slug: Yup.string()
    .trim()
    .required('A public path is required')
    .matches(/^([/]?lp[/])?[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only'),
  headline: Yup.string().trim().required('A hero headline is required'),
  template: Yup.string().required('Pick a template'),
  campaign: Yup.string(),
  utmSource: Yup.string().trim().required('UTM source is required'),
  utmMedium: Yup.string().trim().required('UTM medium is required'),
  utmCampaign: Yup.string().trim().required('UTM campaign is required'),
});

const TEMPLATES = ['Conversion', 'Product-led', 'Compliance', 'Industrial', 'Lead magnet'];
const SECTION_TYPES = ['Hero', 'Proof', 'Features', 'Process', 'Testimonial', 'Enquiry form', 'Custom'];
const FIELD_TYPES = ['text', 'email', 'tel', 'textarea'];

function cvr(page) {
  return page.views ? (page.conversions / page.views) * 100 : 0;
}

function normalizeSlug(value) {
  const cleaned = String(value || '').trim().replace(/^\/+/, '');
  if (cleaned.startsWith('lp/')) return `/${cleaned}`;
  return `/lp/${cleaned}`;
}

function slugForInput(slug) {
  return String(slug || '').replace(/^\/?lp\//, '');
}

export default function LandingPagesPage() {
  const landingPages = useDemoStore((state) => state.landingPages);
  const addLandingPage = useDemoStore((state) => state.addLandingPage);
  const updateLandingPage = useDemoStore((state) => state.updateLandingPage);
  const deleteLandingPage = useDemoStore((state) => state.deleteLandingPage);
  const setLandingPageStatus = useDemoStore((state) => state.setLandingPageStatus);
  const addLandingSection = useDemoStore((state) => state.addLandingSection);
  const updateLandingSection = useDemoStore((state) => state.updateLandingSection);
  const removeLandingSection = useDemoStore((state) => state.removeLandingSection);
  const moveLandingSection = useDemoStore((state) => state.moveLandingSection);
  const saveLandingForm = useDemoStore((state) => state.saveLandingForm);

  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('layout');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sectionModal, setSectionModal] = useState(null);
  const [formDraft, setFormDraft] = useState(null);
  const [newField, setNewField] = useState({ label: '', type: 'text', required: false });

  const selected = landingPages.find((page) => page.id === selectedId) || null;

  useEffect(() => {
    if (!selected) {
      setFormDraft(null);
      return;
    }
    setFormDraft({
      ...selected.form,
      fields: (selected.form?.fields || []).map((field) => ({ ...field })),
    });
    setNewField({ label: '', type: 'text', required: false });
  }, [selected, selectedId]);

  const counts = useMemo(() => {
    const map = { All: landingPages.length, Published: 0, Draft: 0, Paused: 0, Archived: 0 };
    landingPages.forEach((page) => {
      map[page.status] = (map[page.status] || 0) + 1;
    });
    return map;
  }, [landingPages]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return landingPages.filter((page) => {
      const matchesStatus = status === 'All' || page.status === status;
      const matchesTerm =
        !term ||
        page.title.toLowerCase().includes(term) ||
        page.slug.toLowerCase().includes(term) ||
        page.campaign.toLowerCase().includes(term) ||
        page.headline.toLowerCase().includes(term) ||
        String(page.utm?.source || '').toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [landingPages, status, query]);

  const totals = useMemo(() => {
    const published = landingPages.filter((page) => page.status === 'Published').length;
    const views = landingPages.reduce((sum, page) => sum + page.views, 0);
    const conversions = landingPages.reduce((sum, page) => sum + page.conversions, 0);
    return { published, views, conversions, cvr: views ? (conversions / views) * 100 : 0 };
  }, [landingPages]);

  const copyLink = async (page) => {
    try {
      await navigator.clipboard.writeText(`https://starkpackmate.com${page.slug}`);
      notify('Link copied', `${page.slug} copied to the clipboard.`, 'success');
    } catch {
      notify('Copy unavailable', `Share this path instead: ${page.slug}`, 'warning');
    }
  };

  const openEditor = (page, nextTab = 'layout') => {
    setSelectedId(page.id);
    setTab(nextTab);
  };

  const setPageStatus = (page, nextStatus, message) => {
    setLandingPageStatus(page.id, nextStatus);
    notify(
      nextStatus === 'Published' ? 'Campaign live' : nextStatus === 'Paused' ? 'Campaign paused' : 'Status updated',
      message || `${page.title} is now ${nextStatus.toLowerCase()}.`,
      nextStatus === 'Published' ? 'success' : 'info'
    );
  };

  const openPreview = (page) => {
    setPreviewPage(page);
    setPreviewOpen(true);
    setSelectedId(null);
  };

  const saveSection = (values) => {
    if (!selected) return;
    if (!values.title.trim()) {
      notify('Title required', 'Give the section a headline before saving.', 'warning');
      return;
    }
    if (sectionModal.mode === 'create') {
      addLandingSection(selected.id, values);
      notify('Section added', `${values.type} section added to the campaign page.`, 'success');
    } else {
      updateLandingSection(selected.id, sectionModal.id, values);
      notify('Section updated', `${values.title} saved.`, 'success');
    }
    setSectionModal(null);
  };

  const applyFormDraft = () => {
    if (!selected || !formDraft) return;
    saveLandingForm(selected.id, {
      title: formDraft.title,
      submitLabel: formDraft.submitLabel,
      successMessage: formDraft.successMessage,
      fields: formDraft.fields,
    });
    notify('Enquiry form saved', `The form on ${selected.title} is updated.`, 'success');
  };

  const toggleRequired = (key) => {
    setFormDraft((current) => ({
      ...current,
      fields: current.fields.map((field) => (field.key === key ? { ...field, required: !field.required } : field)),
    }));
  };

  const removeField = (key) => {
    setFormDraft((current) => ({ ...current, fields: current.fields.filter((field) => field.key !== key) }));
  };

  const addFieldToDraft = () => {
    if (!formDraft) return;
    const label = newField.label.trim();
    if (!label) {
      notify('Field label required', 'Enter a label such as “City” before adding the field.', 'warning');
      return;
    }
    const baseKey = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || `field_${Date.now()}`;
    let key = baseKey;
    let suffix = 2;
    while (formDraft.fields.some((field) => field.key === key)) {
      key = `${baseKey}_${suffix}`;
      suffix += 1;
    }
    setFormDraft((current) => ({
      ...current,
      fields: [...current.fields, { key, label, type: newField.type, required: newField.required }],
    }));
    setNewField({ label: '', type: 'text', required: false });
  };

  return (
    <>
      <PageHeaderBar>
        <div>
          <PageHeading>Landing pages</PageHeading>
          <PageDescription>
            Campaign microsites and lead-capture pages. Build sections, configure the enquiry form and
            track UTM attribution against real demo conversions.
          </PageDescription>
        </div>
        <PageActions>
          <Button
            $variant="secondary"
            $size="sm"
            onClick={() => notify('Preview link', 'Open a published page from the cards below to review it live.', 'info')}
          >
            <Eye size={14} /> Preview pages
          </Button>
          <Button $variant="primary" $size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} /> New landing page
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Live campaigns', value: formatNumber(totals.published), hint: `${landingPages.length} pages in workspace` },
          { label: 'Total views', value: formatNumber(totals.views), hint: 'Tracked across all campaign pages' },
          { label: 'Form conversions', value: formatNumber(totals.conversions), hint: 'Route into CRM & Leads' },
          { label: 'Blended conversion', value: `${totals.cvr.toFixed(2)}%`, hint: 'Industry benchmark 2.4%', tone: 'success' },
        ]}
      />

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Campaign pages</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              Edit sections, forms and tracking. Preview any page before publishing.
            </div>
          </div>
          <StatusChip $tone="info">{filtered.length} shown</StatusChip>
        </PanelHeader>
        <PanelBody>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 16,
            }}
          >
            <FilterChips
              options={[
                { value: 'All', label: 'All pages', count: counts.All },
                { value: 'Published', label: 'Published', count: counts.Published || 0 },
                { value: 'Draft', label: 'Draft', count: counts.Draft || 0 },
                { value: 'Paused', label: 'Paused', count: counts.Paused || 0 },
                { value: 'Archived', label: 'Archived', count: counts.Archived || 0 },
              ]}
              value={status}
              onChange={setStatus}
            />
            <SearchInput value={query} onChange={setQuery} placeholder="Search pages, campaigns or UTM…" width="270px" />
          </div>

          {filtered.length === 0 ? (
            <EmptyState>
              <SearchIcon size={26} />
              <strong>No landing pages match</strong>
              <p>Try a different status filter or clear the search to see all campaign pages.</p>
              <div style={{ marginTop: 14 }}>
                <Button
                  $variant="secondary"
                  $size="sm"
                  onClick={() => {
                    setQuery('');
                    setStatus('All');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </EmptyState>
          ) : (
            <CardGrid>
              {filtered.map((page) => (
                <PageCard
                  key={page.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => openEditor(page)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openEditor(page);
                    }
                  }}
                >
                  <CardHero>
                    <HeroTop>
                      <small>{page.id}</small>
                      <StatusChip $tone={statusTone(page.status)}>{page.status}</StatusChip>
                    </HeroTop>
                    <h3>{page.headline}</h3>
                    <HeroTemplates>
                      <span>{page.template}</span>
                      <span>{page.campaign}</span>
                      <span>{(page.sections || []).filter((section) => section.enabled !== false).length} sections</span>
                    </HeroTemplates>
                  </CardHero>
                  <CardBody>
                    <CardTitleRow>
                      <div>
                        <strong>{page.title}</strong>
                        <span>
                          <Link2 size={10} /> {page.slug}
                        </span>
                      </div>
                      <CopyButton
                        type="button"
                        title="Copy public link"
                        onClick={(event) => {
                          event.stopPropagation();
                          copyLink(page);
                        }}
                      >
                        <Copy size={11} /> Link
                      </CopyButton>
                    </CardTitleRow>
                    <MetricRow>
                      <Metric>
                        <p>Views</p>
                        <strong>{page.views ? formatNumber(page.views) : '—'}</strong>
                      </Metric>
                      <Metric>
                        <p>Leads</p>
                        <strong>{page.conversions ? formatNumber(page.conversions) : '—'}</strong>
                      </Metric>
                      <Metric>
                        <p>CVR</p>
                        <strong>{page.views ? `${cvr(page).toFixed(1)}%` : '—'}</strong>
                      </Metric>
                    </MetricRow>
                    <CardFoot>
                      <small>UTM {page.utm?.source || 'direct'} · {page.utm?.medium || 'organic'}</small>
                      <FootActions>
                        <IconAction
                          type="button"
                          title="Preview page"
                          onClick={(event) => {
                            event.stopPropagation();
                            openPreview(page);
                          }}
                        >
                          <Eye size={13} />
                        </IconAction>
                        <IconAction
                          type="button"
                          title="Edit page"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditor(page, 'settings');
                          }}
                        >
                          <Pencil size={13} />
                        </IconAction>
                        {page.status === 'Published' ? (
                          <IconAction
                            type="button"
                            title="Pause campaign"
                            onClick={(event) => {
                              event.stopPropagation();
                              setPageStatus(page, 'Paused');
                            }}
                          >
                            <PauseCircle size={13} />
                          </IconAction>
                        ) : (
                          <IconAction
                            type="button"
                            title="Publish page"
                            onClick={(event) => {
                              event.stopPropagation();
                              setPageStatus(page, 'Published');
                            }}
                          >
                            <PlayCircle size={13} />
                          </IconAction>
                        )}
                      </FootActions>
                    </CardFoot>
                  </CardBody>
                </PageCard>
              ))}
            </CardGrid>
          )}
        </PanelBody>
        <PanelFooter>
          <span style={{ fontSize: 10.5, color: colors.faint }}>
            Views and conversions are simulated. Published pages on the public site submit real demo leads into CRM.
          </span>
        </PanelFooter>
      </Panel>

      {/* ------------------------------- Create ------------------------------- */}
      <AppModal open={formOpen} onClose={() => setFormOpen(false)} title="New landing page" description="Start with a draft, then build the sections and form." size="md">
        <Formik
          initialValues={{
            title: '',
            slug: '',
            campaign: '',
            template: 'Conversion',
            headline: '',
            utmSource: 'google',
            utmMedium: 'cpc',
            utmCampaign: '',
          }}
          validationSchema={validation}
          onSubmit={(values, helpers) => {
            const nextSlug = normalizeSlug(values.slug);
            if (landingPages.some((entry) => entry.slug === nextSlug)) {
              notify('Path already in use', `${nextSlug} belongs to another landing page.`, 'warning');
              return;
            }
            const page = addLandingPage({
              ...values,
              slug: slugForInput(values.slug),
              utmCampaign: values.utmCampaign || slugForInput(values.slug),
            });
            notify('Landing page created', `${page.title} was added as a draft in the demo.`, 'success');
            setFormOpen(false);
            setStatus('Draft');
            setQuery('');
            helpers.resetForm();
            openEditor(page, 'layout');
          }}
        >
          <Form>
            <TextField name="title" label="Page name" placeholder="Diwali corporate gifting" required />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <TextField
                name="slug"
                label="Public path"
                placeholder="diwali-gifting"
                prefix="/lp/"
                hint="Lowercase letters, numbers and hyphens."
                required
              />
              <TextField name="campaign" label="Campaign code" placeholder="CMP-31" hint="Links the page to a marketing campaign." />
            </FormGrid>
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <SelectField name="template" label="Template" options={TEMPLATES} required />
              <div />
            </FormGrid>
            <div style={{ height: 14 }} />
            <TextAreaField
              name="headline"
              label="Hero headline"
              placeholder="Make the gift worth keeping."
              rows={3}
              hint="Shown in the hero of the published page."
              required
            />
            <Divider style={{ margin: '18px 0' }} />
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.faint, marginBottom: 12 }}>
              UTM tracking defaults
            </p>
            <FormGrid $cols={3}>
              <TextField name="utmSource" label="Source" placeholder="google" />
              <TextField name="utmMedium" label="Medium" placeholder="cpc" />
              <TextField name="utmCampaign" label="Campaign" placeholder="diwali-gifting" />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                <Plus size={14} /> Create draft
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      {/* ------------------------------- Editor ------------------------------- */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.title : ''}
        description={selected ? `${selected.id} · ${selected.slug}` : ''}
        width="680px"
        footer={
          selected ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => openPreview(selected)}>
                <Eye size={13} /> Preview
              </Button>
              {selected.status === 'Published' ? (
                <Button $variant="secondary" $size="sm" onClick={() => setPageStatus(selected, 'Paused')}>
                  <PauseCircle size={13} /> Pause campaign
                </Button>
              ) : (
                <Button $variant="primary" $size="sm" onClick={() => setPageStatus(selected, 'Published')}>
                  <PlayCircle size={13} /> {selected.status === 'Paused' ? 'Resume campaign' : 'Publish page'}
                </Button>
              )}
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <Segmented
                value={tab}
                onChange={setTab}
                options={[
                  { value: 'layout', label: 'Layout', count: (selected.sections || []).length },
                  { value: 'form', label: 'Form', count: (selected.form?.fields || []).length },
                  { value: 'settings', label: 'Settings' },
                ]}
              />
              <StatusChip $tone={statusTone(selected.status)}>{selected.status}</StatusChip>
            </div>

            {tab === 'layout' ? (
              <>
                <UtmStrip>
                  <div>
                    <p>UTM source</p>
                    <strong>{selected.utm?.source || 'direct'}</strong>
                  </div>
                  <div>
                    <p>UTM medium</p>
                    <strong>{selected.utm?.medium || 'organic'}</strong>
                  </div>
                  <div>
                    <p>UTM campaign</p>
                    <strong>{selected.utm?.campaign || selected.campaign}</strong>
                  </div>
                </UtmStrip>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: colors.ink }}>
                    Page sections
                  </h4>
                  <Button
                    $variant="secondary"
                    $size="xs"
                    onClick={() =>
                      setSectionModal({ mode: 'create', values: { type: 'Features', title: '', body: '', enabled: true } })
                    }
                  >
                    <Plus size={12} /> Add section
                  </Button>
                </div>
                <p style={{ fontSize: 10.5, color: colors.faint, margin: '4px 0 12px' }}>
                  Reorder with the arrows. Disabled sections stay saved but do not render publicly.
                </p>

                {(selected.sections || []).length === 0 ? (
                  <EmptyState>
                    <Layers size={22} />
                    <strong>No sections yet</strong>
                    <p>Add a hero, proof point and enquiry form to build the page.</p>
                  </EmptyState>
                ) : (
                  selected.sections.map((section, index) => (
                    <SectionRow key={section.id} $disabled={section.enabled === false}>
                      <SectionIndex>{String(index + 1).padStart(2, '0')}</SectionIndex>
                      <SectionBody>
                        <h4>{section.title || 'Untitled section'}</h4>
                        <p>{section.body || 'No supporting copy yet.'}</p>
                        <span className="type">{section.type}</span>
                      </SectionBody>
                      <SectionTools>
                        <MiniIcon
                          type="button"
                          title="Move up"
                          disabled={index === 0}
                          onClick={() => moveLandingSection(selected.id, section.id, -1)}
                        >
                          <ArrowUp size={13} />
                        </MiniIcon>
                        <MiniIcon
                          type="button"
                          title="Move down"
                          disabled={index === selected.sections.length - 1}
                          onClick={() => moveLandingSection(selected.id, section.id, 1)}
                        >
                          <ArrowDown size={13} />
                        </MiniIcon>
                        <MiniIcon
                          type="button"
                          title={section.enabled === false ? 'Enable section' : 'Disable section'}
                          onClick={() =>
                            updateLandingSection(selected.id, section.id, { enabled: section.enabled === false })
                          }
                        >
                          {section.enabled === false ? <EyeOff size={13} /> : <Eye size={13} />}
                        </MiniIcon>
                        <MiniIcon
                          type="button"
                          title="Edit section"
                          onClick={() =>
                            setSectionModal({
                              mode: 'edit',
                              id: section.id,
                              values: {
                                type: section.type,
                                title: section.title,
                                body: section.body,
                                enabled: section.enabled !== false,
                              },
                            })
                          }
                        >
                          <Pencil size={13} />
                        </MiniIcon>
                        <MiniIcon
                          type="button"
                          title="Delete section"
                          onClick={() => {
                            removeLandingSection(selected.id, section.id);
                            notify('Section removed', `${section.title} was removed from the page.`, 'info');
                          }}
                        >
                          <Trash2 size={13} />
                        </MiniIcon>
                      </SectionTools>
                    </SectionRow>
                  ))
                )}
              </>
            ) : null}

            {tab === 'form' && formDraft ? (
              <>
                <div style={{ display: 'grid', gap: 12 }}>
                  <PlainGroup>
                    Form heading
                    <input
                      value={formDraft.title || ''}
                      onChange={(event) => setFormDraft({ ...formDraft, title: event.target.value })}
                    />
                  </PlainGroup>
                  <PlainRow>
                    <PlainGroup>
                      Submit button label
                      <input
                        value={formDraft.submitLabel || ''}
                        onChange={(event) => setFormDraft({ ...formDraft, submitLabel: event.target.value })}
                      />
                    </PlainGroup>
                    <div />
                  </PlainRow>
                  <PlainGroup>
                    Success message
                    <textarea
                      rows={2}
                      value={formDraft.successMessage || ''}
                      onChange={(event) => setFormDraft({ ...formDraft, successMessage: event.target.value })}
                    />
                  </PlainGroup>
                </div>

                <Divider style={{ margin: '20px 0' }} />

                <h4 style={{ fontSize: 12, fontWeight: 700, color: colors.ink }}>Form fields</h4>
                <p style={{ fontSize: 10.5, color: colors.faint, margin: '4px 0 12px' }}>
                  Toggle required validation per field. Submissions create a lead in CRM with the page and UTM source attached.
                </p>

                {formDraft.fields.map((field) => (
                  <FieldChip key={field.key}>
                    <div>
                      <strong>{field.label}</strong>
                      <span>{field.type} · {field.key}</span>
                    </div>
                    <RequiredToggle type="button" $active={field.required} onClick={() => toggleRequired(field.key)}>
                      {field.required ? 'Required' : 'Optional'}
                    </RequiredToggle>
                    <MiniIcon type="button" title="Remove field" onClick={() => removeField(field.key)}>
                      <X size={13} />
                    </MiniIcon>
                  </FieldChip>
                ))}

                <AddFieldRow>
                  <input
                    value={newField.label}
                    placeholder="New field label"
                    onChange={(event) => setNewField({ ...newField, label: event.target.value })}
                  />
                  <select value={newField.type} onChange={(event) => setNewField({ ...newField, type: event.target.value })}>
                    {FIELD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <Button $variant="secondary" $size="xs" onClick={addFieldToDraft}>
                    <Plus size={12} /> Add
                  </Button>
                </AddFieldRow>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  <Button $variant="primary" $size="sm" onClick={applyFormDraft}>
                    Save form
                  </Button>
                </div>
              </>
            ) : null}

            {tab === 'settings' ? (
              <Formik
                key={selected.id}
                enableReinitialize
                initialValues={{
                  title: selected.title,
                  slug: slugForInput(selected.slug),
                  campaign: selected.campaign,
                  template: selected.template,
                  headline: selected.headline,
                  status: selected.status,
                  utmSource: selected.utm?.source || 'direct',
                  utmMedium: selected.utm?.medium || 'organic',
                  utmCampaign: selected.utm?.campaign || slugForInput(selected.slug),
                }}
                validationSchema={settingsValidation}
                onSubmit={(values) => {
                  const nextSlug = normalizeSlug(values.slug);
                  const conflict = landingPages.some((page) => page.id !== selected.id && page.slug === nextSlug);
                  if (conflict) {
                    notify('Path already in use', `${nextSlug} belongs to another landing page.`, 'warning');
                    return;
                  }
                  updateLandingPage(selected.id, {
                    title: values.title,
                    slug: nextSlug,
                    campaign: values.campaign,
                    template: values.template,
                    headline: values.headline,
                    status: values.status,
                    publishedAt:
                      values.status === 'Published' ? selected.publishedAt || new Date().toISOString().slice(0, 10) : selected.publishedAt,
                    utm: { source: values.utmSource, medium: values.utmMedium, campaign: values.utmCampaign },
                  });
                  notify('Page settings saved', `${values.title} is updated.`, 'success');
                }}
              >
                {() => (
                  <Form>
                    <TextField name="title" label="Page name" required />
                    <div style={{ height: 12 }} />
                    <FormGrid $cols={2}>
                      <TextField name="slug" label="Public path" prefix="/lp/" required />
                      <TextField name="campaign" label="Campaign code" />
                    </FormGrid>
                    <div style={{ height: 12 }} />
                    <FormGrid $cols={2}>
                      <SelectField name="template" label="Template" options={TEMPLATES} required />
                      <SelectField
                        name="status"
                        label="Status"
                        options={['Published', 'Draft', 'Paused', 'Archived']}
                        required
                      />
                    </FormGrid>
                    <div style={{ height: 12 }} />
                    <TextAreaField name="headline" label="Hero headline" rows={2} required />
                    <Divider style={{ margin: '20px 0' }} />
                    <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.faint, marginBottom: 12 }}>
                      UTM tracking defaults
                    </p>
                    <FormGrid $cols={3}>
                      <TextField name="utmSource" label="Source" required />
                      <TextField name="utmMedium" label="Medium" required />
                      <TextField name="utmCampaign" label="Campaign" required />
                    </FormGrid>
                    <FormActions>
                      <Button type="submit" $variant="primary" $size="sm">
                        Save settings
                      </Button>
                    </FormActions>

                    <DangerZone>
                      <strong>Delete this landing page</strong>
                      <p>The public path stops resolving immediately. Demo leads already captured stay in CRM.</p>
                      <Button $variant="danger" $size="xs" type="button" onClick={() => setDeleteTarget(selected)}>
                        <Trash2 size={12} /> Delete page
                      </Button>
                    </DangerZone>
                  </Form>
                )}
              </Formik>
            ) : null}

            <Divider style={{ margin: '22px 0 16px' }} />

            <PerfBar>
              <PerfLabel>
                <span>Funnel completion</span>
                <strong>{selected.views ? `${cvr(selected).toFixed(1)}% of visitors converted` : 'Awaiting traffic'}</strong>
              </PerfLabel>
              <ProgressTrack>
                <ProgressFill
                  $value={Math.min(100, Math.max(0, cvr(selected) * 12))}
                  $tone={selected.views ? 'success' : 'info'}
                />
              </ProgressTrack>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 10,
                  fontSize: 10.5,
                  color: colors.faint,
                }}
              >
                <TrendingUp size={12} />
                {selected.views
                  ? `${formatNumber(selected.views - selected.conversions)} visitors did not convert.`
                  : 'Publish and share the page to start collecting leads.'}
              </div>
            </PerfBar>

            <div style={{ height: 16 }} />

            <DetailGrid>
              <DetailItem>
                <DetailLabel>Views</DetailLabel>
                <DetailValue>{formatNumber(selected.views)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Conversions</DetailLabel>
                <DetailValue>{formatNumber(selected.conversions)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Form submissions</DetailLabel>
                <DetailValue>{formatNumber(selected.formSubmissions || 0)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Last updated</DetailLabel>
                <DetailValue>{formatDate(selected.updated)}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              {[
                { icon: FileText, label: 'Lead capture form', value: `${(selected.form?.fields || []).length} fields · routed to CRM` },
                { icon: Megaphone, label: 'Attribution', value: `${selected.utm?.source || 'direct'} / ${selected.utm?.medium || 'organic'} · ${selected.utm?.campaign || selected.campaign}` },
                { icon: LayoutTemplate, label: 'Layout', value: `${(selected.sections || []).filter((section) => section.enabled !== false).length} live sections · ${selected.template} template` },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 12px',
                    border: `1px solid ${colors.lineSoft}`,
                    borderRadius: radii.sm,
                    background: colors.cream,
                  }}
                >
                  <item.icon size={14} style={{ color: colors.copper, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: colors.ink }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14, fontSize: 10.5, color: colors.faint }}>
              <CheckCircle2 size={12} style={{ color: colors.success }} />
              All submissions route into CRM &amp; Leads with the campaign attached.
            </div>
          </>
        ) : null}
      </Drawer>

      {/* ------------------------------ Section modal ------------------------------ */}
      <AppModal
        open={Boolean(sectionModal)}
        onClose={() => setSectionModal(null)}
        title={sectionModal?.mode === 'edit' ? 'Edit section' : 'Add section'}
        description="Sections render in order on the published page."
        size="md"
      >
        {sectionModal ? (
          <Formik
            key={`${sectionModal.mode}-${sectionModal.id || 'new'}`}
            initialValues={sectionModal.values}
            onSubmit={(values, helpers) => {
              saveSection(values);
              helpers.resetForm({ values });
            }}
          >
            {({ values }) => (
              <Form>
                <SelectField name="type" label="Section type" options={SECTION_TYPES} />
                <div style={{ height: 12 }} />
                <TextField
                  name="title"
                  label={values.type === 'Testimonial' ? 'Quote' : 'Headline'}
                  required
                  placeholder={values.type === 'Proof' ? '1,800 gifting programmes delivered' : 'Section headline'}
                />
                <div style={{ height: 12 }} />
                <TextAreaField
                  name="body"
                  label={values.type === 'Testimonial' ? 'Attribution' : 'Supporting copy'}
                  rows={4}
                  hint={
                    values.type === 'Proof'
                      ? 'Separate proof points with · to render them as pills.'
                      : values.type === 'Process'
                        ? 'Separate steps with → to render a numbered flow.'
                        : 'Keep it short — one clear idea per section.'
                  }
                />
                <div style={{ height: 8 }} />
                <SwitchField name="enabled" label="Visible on the published page" description="Disabled sections stay saved in the builder." />
                <FormActions>
                  <Button type="button" $variant="secondary" $size="sm" onClick={() => setSectionModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" $variant="primary" $size="sm">
                    {sectionModal.mode === 'edit' ? 'Save section' : 'Add section'}
                  </Button>
                </FormActions>
              </Form>
            )}
          </Formik>
        ) : null}
      </AppModal>

      {/* -------------------------------- Preview -------------------------------- */}
      <AppModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={previewPage ? `Preview · ${previewPage.title}` : 'Preview'}
        description="Public rendering using the saved sections and form. Views are not counted."
        size="xl"
        footer={
          previewPage ? (
            <>
              <span style={{ fontSize: 10.5, color: colors.faint, marginRight: 'auto' }}>
                {previewPage.slug} · {previewPage.status}
              </span>
              <Button $variant="secondary" $size="sm" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
              <Button $variant="primary" $size="sm" onClick={() => { setPreviewOpen(false); openEditor(previewPage, 'settings'); }}>
                <Pencil size={13} /> Edit settings
              </Button>
            </>
          ) : null
        }
      >
        {previewPage ? (
          <PreviewFrame>
            <LandingPageView page={previewPage} onSubmit={() => notify('Preview only', 'Publish the page to capture live demo leads.', 'info')} />
          </PreviewFrame>
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete landing page?"
        message={deleteTarget ? `${deleteTarget.title} will be removed from the workspace. This cannot be undone.` : ''}
        confirmLabel="Delete page"
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteLandingPage(deleteTarget.id);
          notify('Landing page deleted', `${deleteTarget.title} was removed from the demo.`, 'info');
          setSelectedId(null);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
