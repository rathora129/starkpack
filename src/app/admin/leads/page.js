'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Download,
  Plus,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  UserRoundPlus,
  FileText,
  Star,
  Pencil,
  Trash2,
  CalendarPlus,
  Check,
  Clock3,
  History,
  StickyNote,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { products } from '@/data/catalog';
import {
  formatCompactINR,
  formatDate,
  formatNumber,
  statusTone,
  downloadCSV,
} from '@/lib/format';
import RelativeTime from '@/components/ui/RelativeTime';
import { colors, fonts, radii } from '@/lib/theme';
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
  StatusChip,
  Divider,
  EmptyState,
} from '@/components/ui/primitives';
import { FilterChips, SearchInput, QuickSelect, Toolbar, Segmented } from '@/components/ui/Controls';
import { LoadingButton } from '@/components/ui/Feedback';
import { DataTable, CellPrimary, CellSecondary, CellStrong } from '@/components/ui/DataTable';
import {
  AppModal,
  Drawer,
  ConfirmDialog,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineMeta,
} from '@/components/ui/Overlay';
import { TextField, TextAreaField, SelectField, FormGrid, FormActions } from '@/components/ui/FormFields';
import MiniStats from '@/components/dashboard/MiniStats';
import { LEAD_SOURCES, sourceSummary } from '@/lib/attribution';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const OWNERS = ['Neha Joshi', 'Rahul Menon', 'Sana Kulkarni', 'Priya Nair'];
const SOURCES = LEAD_SOURCES;

const LeadHead = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding-bottom: 16px;
`;

const Monogram = styled.span`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: ${colors.forest};
  color: #F6F6FF;
  font-family: ${fonts.display};
  font-size: 19px;
  font-weight: 500;
  flex: 0 0 auto;
`;

const HeadText = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 15px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 11.5px;
    color: ${colors.muted};
  }
`;

const ValueBand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 13px 15px;
  background: ${colors.cream};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  margin: 4px 0 16px;

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 2px;
    font-family: ${fonts.display};
    font-size: 22px;
    font-weight: 500;
    color: ${colors.ink};
  }
`;

const Notes = styled.p`
  margin-top: 16px;
  padding: 13px 15px;
  border-left: 2px solid ${colors.copper};
  background: #FCFAF4;
  font-size: 12px;
  line-height: 1.6;
  color: ${colors.muted};
  border-radius: 0 ${radii.xs} ${radii.xs} 0;
`;

const ContactRow = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${colors.inkSoft};
  padding: 5px 0;

  svg {
    color: ${colors.faint};
  }

  &:hover {
    color: ${colors.forest};
  }
`;

const StageActions = styled.div`
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $hot }) => ($hot ? colors.copperDeep : colors.muted)};
`;

const ViewRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;

  p {
    font-size: 10.5px;
    color: ${colors.muted};
    max-width: 560px;
    line-height: 1.5;
  }
`;

const AttributionNote = styled.p`
  padding: 9px 11px;
  border-radius: ${radii.sm};
  border: 1px dashed ${colors.line};
  background: ${colors.cream};
  font-size: 10px;
  line-height: 1.55;
  color: ${colors.muted};
  margin-bottom: 14px;
`;

const OwnerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0 2px;

  span {
    font-size: 11px;
    font-weight: 700;
    color: ${colors.inkSoft};
  }
`;

const FollowCard = styled.div`
  padding: 12px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  background: ${colors.cream};
`;

const FollowRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  background: #fff;

  & + & {
    margin-top: 8px;
  }

  div.body {
    flex: 1;
    min-width: 0;
  }

  p {
    font-size: 12px;
    line-height: 1.55;
    color: ${colors.ink};
  }

  small {
    display: block;
    margin-top: 4px;
    font-size: 10px;
    color: ${colors.faint};
  }

  &.done p {
    color: ${colors.faint};
    text-decoration: line-through;
  }
`;

const ToggleDot = styled.button`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 50%;
  border: 1px solid ${({ $done }) => ($done ? colors.success : colors.line)};
  background: ${({ $done }) => ($done ? colors.successBg : '#fff')};
  color: ${({ $done }) => ($done ? colors.success : colors.faint)};
`;

const NoteComposer = styled.div`
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid ${colors.lineSoft};

  textarea {
    width: 100%;
    min-height: 62px;
    resize: vertical;
    font-family: ${fonts.sans};
    font-size: 12px;
    line-height: 1.55;
    color: ${colors.ink};
    background: #FAFAFD;
    border: 1px solid ${colors.line};
    border-radius: ${radii.sm};
    padding: 10px 12px;
    outline: none;

    &:focus {
      border-color: ${colors.forest};
      box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.08);
    }
  }
`;

const FollowInputs = styled.div`
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 8px;
  margin-top: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }

  input {
    width: 100%;
    font-family: ${fonts.sans};
    font-size: 11.5px;
    color: ${colors.ink};
    background: #fff;
    border: 1px solid ${colors.line};
    border-radius: ${radii.xs};
    padding: 8px 10px;
    outline: none;

    &:focus {
      border-color: ${colors.forest};
    }
  }
`;

const validation = Yup.object({
  company: Yup.string().trim().required('Company name is required'),
  contact: Yup.string().trim().required('Contact name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().trim().min(8, 'Enter a valid phone number').required('Phone is required'),
  city: Yup.string().trim().required('City is required'),
  product: Yup.string().required('Select a product family'),
  quantity: Yup.string().trim().required('Approximate quantity is required'),
  value: Yup.number().min(0, 'Value cannot be negative'),
});

const initialValues = {
  company: '',
  contact: '',
  email: '',
  phone: '',
  city: '',
  sourceChannel: 'Website',
  sourceDetail: '',
  campaignName: '',
  landingPage: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmContent: '',
  referrer: '',
  product: products[0].name,
  quantity: '',
  value: '',
  notes: '',
  owner: 'Neha Joshi',
  stage: 'New',
};

function editValues(lead) {
  return {
    company: lead.company,
    contact: lead.contact,
    title: lead.title || '',
    email: lead.email,
    phone: lead.phone,
    city: lead.city,
    product: lead.product,
    quantity: lead.quantity,
    value: lead.value || '',
    notes: lead.notes || '',
    owner: lead.owner,
    stage: lead.stage,
    nextAction: lead.nextAction || '',
  };
}

export default function LeadsPage() {
  const router = useRouter();
  const leads = useDemoStore((state) => state.leads);
  const addLead = useDemoStore((state) => state.addLead);
  const updateLead = useDemoStore((state) => state.updateLead);
  const deleteLead = useDemoStore((state) => state.deleteLead);
  const updateLeadStage = useDemoStore((state) => state.updateLeadStage);
  const assignLead = useDemoStore((state) => state.assignLead);
  const addLeadNote = useDemoStore((state) => state.addLeadNote);
  const addFollowUp = useDemoStore((state) => state.addFollowUp);
  const toggleFollowUp = useDemoStore((state) => state.toggleFollowUp);
  const deleteFollowUp = useDemoStore((state) => state.deleteFollowUp);
  const addCustomer = useDemoStore((state) => state.addCustomer);

  const [stage, setStage] = useState('All');
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [view, setView] = useState('pipeline');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [followDraft, setFollowDraft] = useState({ date: new Date().toISOString().slice(0, 10), note: '' });

  const selected = leads.find((lead) => lead.id === selectedId) || null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === '1') setFormOpen(true);
    const focus = params.get('focus');
    if (focus) {
      const match = useDemoStore.getState().leads.find((lead) => lead.id === focus);
      if (match) setSelectedId(match.id);
    }
  }, []);

  useEffect(() => {
    setTab('overview');
    setNoteDraft('');
    setFollowDraft({ date: new Date().toISOString().slice(0, 10), note: '' });
  }, [selectedId]);

  const owners = ['All', ...Array.from(new Set([...leads.map((lead) => lead.owner), ...OWNERS]))];

  const stageOptions = [
    { value: 'All', label: 'All leads', count: leads.length },
    ...STAGES.map((name) => ({
      value: name,
      label: name,
      count: leads.filter((lead) => lead.stage === name).length,
    })),
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (stage !== 'All' && lead.stage !== stage) return false;
      if (owner !== 'All' && lead.owner !== owner) return false;
      if (sourceFilter !== 'All' && lead.sourceChannel !== sourceFilter) return false;
      if (!q) return true;
      return (
        lead.company.toLowerCase().includes(q) ||
        lead.contact.toLowerCase().includes(q) ||
        lead.product.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.source.toLowerCase().includes(q) ||
        String(lead.sourceDetail || '').toLowerCase().includes(q) ||
        String(lead.campaignName || '').toLowerCase().includes(q)
      );
    });
  }, [leads, stage, owner, sourceFilter, query]);

  const sourceRows = useMemo(() => sourceSummary(leads), [leads]);

  const sourceColumns = [
    {
      key: 'source',
      label: 'Source',
      render: (row) => (
        <>
          <CellPrimary>{row.source}</CellPrimary>
          <CellSecondary>{Math.round((row.leads / Math.max(leads.length, 1)) * 100)}% of all leads</CellSecondary>
        </>
      ),
    },
    { key: 'leads', label: 'Leads', align: 'right', render: (row) => <CellStrong>{formatNumber(row.leads)}</CellStrong> },
    { key: 'qualified', label: 'Qualified', align: 'right', render: (row) => formatNumber(row.qualified) },
    { key: 'quotations', label: 'Quotations', align: 'right', render: (row) => formatNumber(row.quotations) },
    { key: 'wonOrders', label: 'Won orders', align: 'right', render: (row) => formatNumber(row.wonOrders) },
    {
      key: 'revenue',
      label: 'Confirmed revenue',
      align: 'right',
      render: (row) => <CellStrong>{formatCompactINR(row.revenue)}</CellStrong>,
    },
  ];
  const sourceTotals = sourceRows.reduce(
    (total, row) => ({
      leads: total.leads + row.leads,
      qualified: total.qualified + row.qualified,
      quotations: total.quotations + row.quotations,
      wonOrders: total.wonOrders + row.wonOrders,
      revenue: total.revenue + row.revenue,
    }),
    { leads: 0, qualified: 0, quotations: 0, wonOrders: 0, revenue: 0 }
  );

  const openValue = leads
    .filter((lead) => !['Won', 'Lost'].includes(lead.stage))
    .reduce((sum, lead) => sum + lead.value, 0);
  const won = leads.filter((lead) => lead.stage === 'Won').length;
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;
  const openFollowUps = leads.reduce(
    (sum, lead) => sum + (lead.followUps || []).filter((follow) => follow.status === 'Open').length,
    0
  );

  const exportLeads = () => {
    downloadCSV(
      'stark-packmate-leads.csv',
      [
        'Reference',
        'Company',
        'Contact',
        'Email',
        'Phone',
        'City',
        'Source channel',
        'Source detail',
        'Campaign',
        'Landing page',
        'UTM source',
        'UTM medium',
        'UTM campaign',
        'UTM content',
        'Referrer',
        'Product',
        'Quantity',
        'Estimated value',
        'Quotation value',
        'Confirmed order value',
        'Stage',
        'Owner',
      ],
      filtered.map((lead) => [
        lead.id,
        lead.company,
        lead.contact,
        lead.email,
        lead.phone,
        lead.city,
        lead.sourceChannel,
        lead.sourceDetail,
        lead.campaignName,
        lead.landingPage,
        lead.utmSource,
        lead.utmMedium,
        lead.utmCampaign,
        lead.utmContent,
        lead.referrer,
        lead.product,
        lead.quantity,
        lead.value,
        lead.quoteValue,
        lead.confirmedOrderValue,
        lead.stage,
        lead.owner,
      ])
    );
    notify('Leads exported', `${filtered.length} leads with attribution downloaded as CSV.`, 'success');
  };

  const exportSources = () => {
    downloadCSV(
      'stark-packmate-lead-sources.csv',
      ['Source', 'Leads', 'Qualified leads', 'Quotations', 'Won orders', 'Confirmed revenue'],
      sourceRows.map((row) => [row.source, row.leads, row.qualified, row.quotations, row.wonOrders, row.revenue])
    );
    notify('Source report exported', 'Lead-source performance downloaded as CSV.', 'success');
  };

  const convert = (lead) => {
    addCustomer({
      company: lead.company,
      contact: lead.contact,
      email: lead.email,
      phone: lead.phone,
      city: lead.city,
      segment: 'New account',
    });
    updateLeadStage(lead.id, 'Won');
    notify('Converted to customer', `${lead.company} is now in the customer master.`, 'success');
  };

  const saveNote = () => {
    if (!selected || !noteDraft.trim()) return;
    addLeadNote(selected.id, noteDraft.trim());
    setNoteDraft('');
    notify('Note added', `Timestamped note saved against ${selected.company}.`, 'success');
  };

  const saveFollowUp = () => {
    if (!selected) return;
    if (!followDraft.note.trim()) {
      notify('Follow-up needs a note', 'Describe the call, meeting or next step.', 'warning');
      return;
    }
    addFollowUp(selected.id, { date: followDraft.date, note: followDraft.note.trim(), owner: selected.owner });
    setFollowDraft({ date: new Date().toISOString().slice(0, 10), note: '' });
    notify('Follow-up scheduled', `${selected.company} has a new follow-up on ${formatDate(followDraft.date)}.`, 'success');
  };

  const columns = [
    {
      key: 'company',
      label: 'Company',
      width: '24%',
      render: (lead) => (
        <>
          <CellPrimary>{lead.company}</CellPrimary>
          <CellSecondary>
            {lead.contact} · {lead.city}
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      render: (lead) => (
        <>
          <StatusChip $tone={lead.sourceChannel === 'Google Ads' ? 'warning' : lead.sourceChannel === 'Meta Ads' ? 'danger' : lead.sourceChannel === 'Referral' ? 'success' : 'info'}>
            {lead.sourceChannel || 'Other'}
          </StatusChip>
          <CellSecondary>{lead.campaignName && lead.campaignName !== '—' ? lead.campaignName : lead.sourceDetail}</CellSecondary>
        </>
      ),
    },
    {
      key: 'product',
      label: 'Requirement',
      render: (lead) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{lead.product}</CellPrimary>
          <CellSecondary>{lead.quantity}</CellSecondary>
        </>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      align: 'right',
      render: (lead) => <CellStrong>{formatCompactINR(lead.value)}</CellStrong>,
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (lead) => <StatusChip $tone={statusTone(lead.stage)}>{lead.stage}</StatusChip>,
    },
    {
      key: 'score',
      label: 'Score',
      align: 'center',
      render: (lead) => (
        <ScoreBadge $hot={lead.score >= 80}>
          <Star size={10} /> {lead.score}
        </ScoreBadge>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (lead) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{lead.owner}</CellPrimary>
          <CellSecondary>{lead.email}</CellSecondary>
        </>
      ),
    },
    {
      key: 'next',
      label: 'Next action',
      render: (lead) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{lead.nextAction}</CellPrimary>
          <CellSecondary>
            <RelativeTime value={lead.createdAt} />
          </CellSecondary>
        </>
      ),
    },
  ];

  const history = useMemo(() => {
    if (!selected) return [];
    return [...(selected.history || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [selected]);

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>CRM &amp; leads</PageHeading>
          <PageDescription>
            Website RFQs, referrals and outbound enquiries in one pipeline — {leads.length} records,
            assigned and tracked with follow-ups.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="light" $size="sm" onClick={exportLeads}>
            <Download size={14} /> Export
          </Button>
          <Button $variant="primary" $size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} /> New lead
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Open pipeline', value: formatCompactINR(openValue), hint: `${leads.length - won} live opportunities` },
          { label: 'New this week', value: formatNumber(leads.filter((l) => l.stage === 'New').length), hint: 'Respond within 24 hours' },
          { label: 'Open follow-ups', value: formatNumber(openFollowUps), hint: 'Across all owners', tone: openFollowUps > 3 ? 'warning' : 'default' },
          { label: 'Win conversion', value: `${conversion}%`, hint: `${won} won this quarter`, tone: 'success' },
        ]}
      />

      <div style={{ height: 18 }} />

      <ViewRow>
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: 'pipeline', label: 'Pipeline' },
            { value: 'sources', label: 'Source performance' },
          ]}
        />
        <p>
          Attribution is captured once and frozen — editing a lead never rewrites its original source,
          campaign or UTM values.
        </p>
      </ViewRow>

      {view === 'pipeline' ? (
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Lead register</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                {filtered.length} of {leads.length} leads
              </div>
            </div>
            <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
              <SearchInput value={query} onChange={setQuery} placeholder="Search company, contact, source…" />
              <QuickSelect
                label="Filter source"
                value={sourceFilter}
                onChange={setSourceFilter}
                options={[
                  { value: 'All', label: 'All sources' },
                  ...LEAD_SOURCES.map((source) => ({
                    value: source,
                    label: `${source} (${leads.filter((lead) => lead.sourceChannel === source).length})`,
                  })),
                ]}
              />
              <QuickSelect
                label="Filter owner"
                value={owner}
                onChange={setOwner}
                options={owners.map((name) => ({ value: name, label: name === 'All' ? 'All owners' : name }))}
              />
            </Toolbar>
          </PanelHeader>
          <div style={{ padding: '12px 16px 0' }}>
            <FilterChips options={stageOptions} value={stage} onChange={setStage} />
          </div>
          <PanelBody $flush>
            <DataTable
              columns={columns}
              rows={filtered}
              onRowClick={(row) => setSelectedId(row.id)}
              minWidth="960px"
              footer={
                <span>
                  Showing <strong>{filtered.length}</strong> records · click any row to open the lead
                </span>
              }
            />
          </PanelBody>
        </Panel>
      ) : (
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Source performance</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Leads, qualified leads, quotations, won orders and confirmed revenue by source channel
              </div>
            </div>
            <Button $variant="light" $size="sm" onClick={exportSources}>
              <Download size={14} /> Export source report
            </Button>
          </PanelHeader>
          <PanelBody $flush>
            <DataTable
              columns={sourceColumns}
              rows={sourceRows}
              minWidth="760px"
              emptyTitle="No source activity yet"
              emptyHint="Captured campaigns and organic enquiries will be summarised here."
              footer={
                <span>
                  <strong>{formatNumber(sourceTotals.leads)}</strong> leads ·{' '}
                  <strong>{formatNumber(sourceTotals.qualified)}</strong> qualified ·{' '}
                  <strong>{formatNumber(sourceTotals.quotations)}</strong> quotations ·{' '}
                  <strong>{formatNumber(sourceTotals.wonOrders)}</strong> won ·{' '}
                  <strong>{formatCompactINR(sourceTotals.revenue)}</strong> confirmed revenue
                </span>
              }
            />
          </PanelBody>
        </Panel>
      )}

      <AppModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="New lead"
        description="Website RFQs create the same records automatically in this demo."
        size="lg"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values, helpers) => {
            const lead = addLead({ ...values, value: Number(values.value) || 0 });
            notify('Lead created', `${lead.company} added as ${lead.id} and assigned to ${lead.owner}.`, 'success');
            setFormOpen(false);
            setSelectedId(lead.id);
            helpers.resetForm();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGrid $cols={2}>
                <TextField name="company" label="Company" placeholder="e.g. Zenfold" required />
                <TextField name="contact" label="Contact person" placeholder="e.g. Ishita Bansal" required />
                <TextField name="email" label="Email" type="email" placeholder="name@company.in" required />
                <TextField name="phone" label="Phone" placeholder="+91 98…" required />
                <TextField name="city" label="City" placeholder="Mumbai" required />
                <SelectField name="sourceChannel" label="Lead source" options={SOURCES} />
                <SelectField
                  name="product"
                  label="Product family"
                  options={products.map((product) => ({ value: product.name, label: product.name }))}
                  required
                />
                <TextField name="quantity" label="Approximate quantity" placeholder="e.g. 10,000 units" required />
                <TextField name="value" label="Estimated value" type="number" prefix="₹" placeholder="500000" />
                <SelectField name="owner" label="Salesperson" options={OWNERS} />
              </FormGrid>
              <div style={{ height: 14 }} />
              <AttributionNote>
                <strong>Attribution</strong> — captured once from the enquiry and locked for reporting.
                Website and landing-page forms fill this automatically from the URL; use the fields below
                only for calls, exhibitions or manual entries.
              </AttributionNote>
              <FormGrid $cols={2}>
                <TextField name="sourceDetail" label="Source detail" placeholder="e.g. Google Ads — brand search" />
                <TextField name="campaignName" label="Campaign name" placeholder="e.g. Google Search — Q4" />
                <TextField name="landingPage" label="Landing page URL" placeholder="/request-a-quote?utm_source=…" />
                <TextField name="referrer" label="Referrer" placeholder="e.g. packexpo.com" />
                <TextField name="utmSource" label="UTM source" placeholder="google" />
                <TextField name="utmMedium" label="UTM medium" placeholder="cpc" />
                <TextField name="utmCampaign" label="UTM campaign" placeholder="brand-search" />
                <TextField name="utmContent" label="UTM content" placeholder="ad-variant-a" />
              </FormGrid>
              <div style={{ height: 14 }} />
              <TextAreaField
                name="notes"
                label="Requirement notes"
                rows={4}
                placeholder="SKUs, dimensions, print finish, timelines…"
              />
              <FormActions>
                <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" $variant="primary" $size="sm" loading={isSubmitting} loadingLabel="Creating lead…">
                  Create lead <ArrowRight size={14} />
                </LoadingButton>
              </FormActions>
            </Form>
          )}
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.company : ''}
        description={selected ? `${selected.id} · ${selected.source} enquiry` : ''}
        width="600px"
        footer={
          selected ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setEditOpen(true)}>
                <Pencil size={13} /> Edit
              </Button>
              <Button
                $variant="light"
                $size="sm"
                onClick={() =>
                  router.push(`/admin/quotations?new=1&customer=${encodeURIComponent(selected.company)}`)
                }
              >
                <FileText size={14} /> Create quotation
              </Button>
              {selected.stage !== 'Won' ? (
                <Button $variant="primary" $size="sm" onClick={() => convert(selected)}>
                  <UserRoundPlus size={14} /> Convert
                </Button>
              ) : (
                <StatusChip $tone="success" style={{ alignSelf: 'center' }}>
                  Converted
                </StatusChip>
              )}
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <LeadHead>
              <Monogram>{selected.company.slice(0, 2).toUpperCase()}</Monogram>
              <HeadText>
                <strong>{selected.contact}</strong>
                <span>
                  {selected.title} · {selected.city}
                </span>
              </HeadText>
              <StatusChip $tone={statusTone(selected.stage)} style={{ marginLeft: 'auto' }}>
                {selected.stage}
              </StatusChip>
            </LeadHead>

            <ValueBand>
              <div>
                <span>Estimated value</span>
                <strong>{formatCompactINR(selected.value)}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span>Fit score</span>
                <strong style={{ color: selected.score >= 80 ? colors.copperDeep : colors.ink }}>
                  {selected.score}/100
                </strong>
              </div>
            </ValueBand>

            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'overview', label: 'Overview' },
                { value: 'followups', label: 'Follow-ups', count: (selected.followUps || []).length },
                { value: 'activity', label: 'Activity', count: (selected.history || []).length },
              ]}
            />

            <div style={{ height: 16 }} />

            {tab === 'overview' ? (
              <>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Product family</DetailLabel>
                    <DetailValue>{selected.product}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Quantity</DetailLabel>
                    <DetailValue>{selected.quantity}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Campaign</DetailLabel>
                    <DetailValue>
                      {selected.campaignName && selected.campaignName !== '—'
                        ? selected.campaignName
                        : 'Organic / direct'}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Created</DetailLabel>
                    <DetailValue>{formatDate(selected.createdAt)}</DetailValue>
                  </DetailItem>
                </DetailGrid>

                <AttributionNote>
                  <strong>Original attribution</strong> —{' '}
                  {selected.originalSource || selected.sourceChannel || selected.source}, captured{' '}
                  {formatDate(selected.createdAt)} and locked for reporting. Editing this lead cannot
                  rewrite its source, campaign or UTM values.
                </AttributionNote>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Source channel</DetailLabel>
                    <DetailValue>{selected.sourceChannel || selected.source}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Source detail</DetailLabel>
                    <DetailValue>{selected.sourceDetail || '—'}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>UTM source / medium</DetailLabel>
                    <DetailValue>
                      {selected.utmSource || '—'} / {selected.utmMedium || '—'}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>UTM campaign / content</DetailLabel>
                    <DetailValue>
                      {selected.utmCampaign || '—'} / {selected.utmContent || '—'}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Landing page</DetailLabel>
                    <DetailValue>{selected.landingPage || '—'}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Referrer</DetailLabel>
                    <DetailValue>{selected.referrer || 'Direct'}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Quotation value</DetailLabel>
                    <DetailValue>{formatCompactINR(selected.quoteValue || 0)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Confirmed order value</DetailLabel>
                    <DetailValue>{formatCompactINR(selected.confirmedOrderValue || 0)}</DetailValue>
                  </DetailItem>
                </DetailGrid>

                <OwnerRow>
                  <span>Salesperson</span>
                  <QuickSelect
                    label="Assign salesperson"
                    value={selected.owner}
                    onChange={(nextOwner) => {
                      assignLead(selected.id, nextOwner);
                      notify('Lead reassigned', `${selected.company} is now owned by ${nextOwner}.`, 'success');
                    }}
                    options={owners.filter((name) => name !== 'All').map((name) => ({ value: name, label: name }))}
                  />
                </OwnerRow>

                <Divider style={{ margin: '14px 0' }} />

                <ContactRow href={`tel:${selected.phone}`}>
                  <Phone size={13} /> {selected.phone}
                </ContactRow>
                <ContactRow href={`mailto:${selected.email}`}>
                  <Mail size={13} /> {selected.email}
                </ContactRow>
                <ContactRow as="span">
                  <MapPin size={13} /> {selected.city}
                </ContactRow>

                <Notes>{selected.notes}</Notes>

                <StageActions>
                  {STAGES.filter((name) => name !== selected.stage).map((name) => (
                    <Button
                      key={name}
                      $variant={name === 'Won' ? 'primary' : 'light'}
                      $size="xs"
                      onClick={() => {
                        updateLeadStage(selected.id, name);
                        notify('Lead updated', `${selected.company} moved to ${name}.`, 'success');
                      }}
                    >
                      Move to {name}
                    </Button>
                  ))}
                </StageActions>

                <NoteComposer>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.faint, marginBottom: 7 }}>
                    <StickyNote size={11} /> Add a note
                  </label>
                  <textarea
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    placeholder="What was discussed? Sample sent, pricing concern, decision date…"
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Button $variant="primary" $size="xs" onClick={saveNote} disabled={!noteDraft.trim()}>
                      <Plus size={12} /> Add note
                    </Button>
                  </div>
                </NoteComposer>
              </>
            ) : null}

            {tab === 'followups' ? (
              <>
                <FollowCard>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: colors.ink }}>
                    <CalendarPlus size={13} style={{ color: colors.copper }} /> Schedule a follow-up
                  </div>
                  <FollowInputs>
                    <input
                      type="date"
                      value={followDraft.date}
                      onChange={(event) => setFollowDraft({ ...followDraft, date: event.target.value })}
                    />
                    <input
                      value={followDraft.note}
                      placeholder="Call to confirm sample approval…"
                      onChange={(event) => setFollowDraft({ ...followDraft, note: event.target.value })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          saveFollowUp();
                        }
                      }}
                    />
                  </FollowInputs>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Button $variant="primary" $size="xs" onClick={saveFollowUp}>
                      <Plus size={12} /> Add follow-up
                    </Button>
                  </div>
                </FollowCard>

                <div style={{ height: 14 }} />

                {(selected.followUps || []).length === 0 ? (
                  <EmptyState>
                    <Clock3 size={22} />
                    <strong>No follow-ups yet</strong>
                    <p>Schedule the next call or meeting to keep this lead moving.</p>
                  </EmptyState>
                ) : (
                  selected.followUps.map((follow) => (
                    <FollowRow key={follow.id} className={follow.status === 'Done' ? 'done' : ''}>
                      <ToggleDot
                        type="button"
                        title={follow.status === 'Done' ? 'Reopen follow-up' : 'Mark complete'}
                        $done={follow.status === 'Done'}
                        onClick={() => toggleFollowUp(selected.id, follow.id)}
                      >
                        {follow.status === 'Done' ? <Check size={11} strokeWidth={3} /> : null}
                      </ToggleDot>
                      <div className="body">
                        <p>{follow.note}</p>
                        <small>
                          {formatDate(follow.date)} · {follow.owner} · {follow.status}
                        </small>
                      </div>
                      <Button
                        $variant="ghost"
                        $size="xs"
                        onClick={() => {
                          deleteFollowUp(selected.id, follow.id);
                          notify('Follow-up removed', 'The follow-up was deleted from this lead.', 'info');
                        }}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </FollowRow>
                  ))
                )}
              </>
            ) : null}

            {tab === 'activity' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: colors.ink, marginBottom: 14 }}>
                  <History size={13} style={{ color: colors.copper }} /> Full activity timeline
                </div>
                {history.length === 0 ? (
                  <EmptyState>
                    <History size={22} />
                    <strong>No activity yet</strong>
                    <p>Stage changes, notes and follow-ups will appear here.</p>
                  </EmptyState>
                ) : (
                  <Timeline>
                    {history.map((event, index) => (
                      <TimelineItem key={event.id || index} $active={index === 0}>
                        <TimelineTitle>{event.text}</TimelineTitle>
                        <TimelineMeta>
                          {event.type} · {formatDate(event.date)} · {event.by}
                        </TimelineMeta>
                      </TimelineItem>
                    ))}
                  </Timeline>
                )}
              </>
            ) : null}
          </>
        ) : null}
      </Drawer>

      <AppModal open={editOpen} onClose={() => setEditOpen(false)} title={selected ? `Edit ${selected.company}` : 'Edit lead'} size="lg">
        {selected ? (
          <Formik
            key={selected.id}
            initialValues={editValues(selected)}
            validationSchema={validation}
            onSubmit={(values) => {
              updateLead(selected.id, {
                ...values,
                value: Number(values.value) || 0,
                history: [
                  {
                    id: `${selected.id}-H${(selected.history || []).length + 1}`,
                    type: 'Edited',
                    text: 'Lead details updated',
                    date: new Date().toISOString().slice(0, 10),
                    by: values.owner,
                  },
                  ...(selected.history || []),
                ],
              });
              notify('Lead updated', `${values.company} saved.`, 'success');
              setEditOpen(false);
            }}
          >
            <Form>
              <AttributionNote>
                <strong>Original attribution (locked)</strong> — {selected.sourceChannel || selected.source}
                {selected.originalSource && selected.originalSource !== selected.sourceChannel
                  ? ` · original: ${selected.originalSource}`
                  : ''}
                {selected.campaignName && selected.campaignName !== '—' ? ` · ${selected.campaignName}` : ''}
                {' · '}captured {formatDate(selected.createdAt)}. Source, campaign and UTM data never
                change when you edit a lead.
              </AttributionNote>
              <FormGrid $cols={2}>
                <TextField name="company" label="Company" required />
                <TextField name="contact" label="Contact person" required />
                <TextField name="title" label="Job title" />
                <TextField name="email" label="Email" type="email" required />
                <TextField name="phone" label="Phone" required />
                <TextField name="city" label="City" required />
                <SelectField name="owner" label="Salesperson" options={OWNERS} />
                <SelectField name="product" label="Product family" options={products.map((product) => product.name)} required />
                <TextField name="quantity" label="Quantity" required />
                <TextField name="value" label="Estimated value" type="number" prefix="₹" />
                <SelectField name="stage" label="Pipeline stage" options={STAGES} />
              </FormGrid>
              <div style={{ height: 12 }} />
              <TextField name="nextAction" label="Next action" />
              <div style={{ height: 12 }} />
              <TextAreaField name="notes" label="Requirement notes" rows={4} />
              <FormActions>
                <Button
                  type="button"
                  $variant="danger"
                  $size="sm"
                  style={{ marginRight: 'auto' }}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 size={13} /> Delete lead
                </Button>
                <Button type="button" $variant="secondary" $size="sm" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" $variant="primary" $size="sm">
                  Save lead
                </Button>
              </FormActions>
            </Form>
          </Formik>
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete lead?"
        message={selected ? `${selected.id} · ${selected.company} will be removed from the CRM. This cannot be undone.` : ''}
        confirmLabel="Delete lead"
        onConfirm={() => {
          if (!selected) return;
          deleteLead(selected.id);
          notify('Lead deleted', `${selected.company} was removed from the demo CRM.`, 'info');
          setEditOpen(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
