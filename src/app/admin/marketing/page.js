'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Plus,
  Megaphone,
  ArrowRight,
  Pause,
  Play,
  Download,
  Target,
  Pencil,
  Trash2,
  Wallet,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import {
  formatCompactINR,
  formatDate,
  formatNumber,
  statusTone,
  downloadCSV,
  plusDaysISO,
  todayISO,
} from '@/lib/format';
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
  PanelFooter,
  StatusChip,
  ProgressTrack,
  ProgressFill,
  Divider,
  Grid,
} from '@/components/ui/primitives';
import { FilterChips, SearchInput, Toolbar } from '@/components/ui/Controls';
import { DataTable, CellPrimary, CellSecondary, CellStrong } from '@/components/ui/DataTable';
import { AppModal, Drawer, ConfirmDialog, DetailGrid, DetailItem, DetailLabel, DetailValue } from '@/components/ui/Overlay';
import { TextField, TextAreaField, SelectField, FormGrid, FormActions } from '@/components/ui/FormFields';
import { DonutChart } from '@/components/ui/charts';
import MiniStats from '@/components/dashboard/MiniStats';

const QUALIFIED_STAGES = ['Qualified', 'Proposal', 'Won'];
const CHANNELS = ['Google Ads', 'Meta Ads', 'Other'];

const BudgetRow = styled.div`
  padding: 11px 0;

  & + & {
    border-top: 1px solid ${colors.lineSoft};
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

const BudgetTop = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;

  strong {
    font-size: 12px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    font-size: 10.5px;
    color: ${colors.muted};
  }

  em {
    font-style: normal;
    font-weight: 700;
    color: ${colors.copperDeep};
    font-variant-numeric: tabular-nums;
  }
`;

const FunnelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1px;
  background: ${colors.lineSoft};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  overflow: hidden;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const FunnelCell = styled.div`
  padding: 14px 16px;
  background: #fff;

  span {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 6px;
    font-family: ${fonts.display};
    font-size: 22px;
    font-weight: 500;
    color: ${colors.ink};
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  em {
    display: block;
    margin-top: 3px;
    font-style: normal;
    font-size: 10px;
    color: ${colors.muted};
  }
`;

const AgencyCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  background: #FCFBF8;

  strong {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    color: ${colors.muted};
  }
`;

const AgencyMark = styled.span`
  width: 42px;
  height: 42px;
  border-radius: ${radii.sm};
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: ${colors.forest};
  color: #fff;
  font-family: ${fonts.display};
  font-size: 16px;
`;

const FeeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;

  & + & {
    border-top: 1px solid ${colors.lineSoft};
  }

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 1px;
    font-size: 10px;
    color: ${colors.muted};
  }

  em {
    font-style: normal;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
    font-variant-numeric: tabular-nums;
  }
`;

const BriefRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid ${colors.lineSoft};

  strong {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.4;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.faint};
  }
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 16px 0 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.faint};
`;

const Note = styled.div`
  display: flex;
  gap: 9px;
  align-items: flex-start;
  margin-top: 14px;
  padding: 10px 12px;
  border: 1px dashed ${colors.line};
  border-radius: ${radii.sm};
  background: ${colors.cream};

  p {
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.55;
  }
`;

const campaignValidation = Yup.object({
  name: Yup.string().trim().required('Campaign name is required'),
  channel: Yup.string().required(),
  budget: Yup.number().positive('Enter a budget').required('Budget is required'),
  start: Yup.string().required('Start date is required'),
  end: Yup.string().required('End date is required'),
});

const spendValidation = Yup.object({
  campaignId: Yup.string().required('Select a campaign'),
  channel: Yup.string().required(),
  month: Yup.string().required('Pick the spend month'),
  amount: Yup.number().positive('Enter an amount').required('Amount is required'),
});

const feeValidation = Yup.object({
  month: Yup.string().required('Pick the fee month'),
  fee: Yup.number().positive('Enter the retainer fee').required('Fee is required'),
});

const profileValidation = Yup.object({
  name: Yup.string().trim().required('Agency name is required'),
  contact: Yup.string().trim().required('Contact name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

const briefValidation = Yup.object({
  title: Yup.string().trim().required('Describe the brief'),
  due: Yup.string().required('Due date is required'),
  budget: Yup.number().min(0).required('Budget is required'),
});

const monthLabel = (key) => formatDate(`${key}-01`, { day: undefined, month: 'long', year: 'numeric' });

const agencyInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function MarketingPage() {
  const campaigns = useDemoStore((state) => state.campaigns);
  const campaignExpenses = useDemoStore((state) => state.campaignExpenses);
  const agencyProfile = useDemoStore((state) => state.agencyProfile);
  const agencyFees = useDemoStore((state) => state.agencyFees);
  const agencyBriefs = useDemoStore((state) => state.agencyBriefs);
  const leads = useDemoStore((state) => state.leads);
  const quotes = useDemoStore((state) => state.quotes);
  const orders = useDemoStore((state) => state.orders);

  const updateCampaignStatus = useDemoStore((state) => state.updateCampaignStatus);
  const addCampaign = useDemoStore((state) => state.addCampaign);
  const updateCampaign = useDemoStore((state) => state.updateCampaign);
  const deleteCampaign = useDemoStore((state) => state.deleteCampaign);
  const addCampaignExpense = useDemoStore((state) => state.addCampaignExpense);
  const deleteCampaignExpense = useDemoStore((state) => state.deleteCampaignExpense);
  const saveAgencyProfile = useDemoStore((state) => state.saveAgencyProfile);
  const addAgencyFee = useDemoStore((state) => state.addAgencyFee);
  const markAgencyFeePaid = useDemoStore((state) => state.markAgencyFeePaid);
  const saveAgencyBrief = useDemoStore((state) => state.saveAgencyBrief);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [channel, setChannel] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [spendOpen, setSpendOpen] = useState(false);
  const [spendCampaignId, setSpendCampaignId] = useState(null);
  const [spendDeleteId, setSpendDeleteId] = useState(null);
  const [feeOpen, setFeeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  const selected = campaigns.find((campaign) => campaign.id === selectedId) || null;
  const editing = campaigns.find((campaign) => campaign.id === editId) || null;
  const deleting = campaigns.find((campaign) => campaign.id === deleteId) || null;
  const deletingSpend = campaignExpenses.find((expense) => expense.id === spendDeleteId) || null;

  const spendFor = (campaignId) =>
    campaignExpenses.filter((expense) => expense.campaignId === campaignId).reduce((sum, expense) => sum + expense.amount, 0);
  const leadsFor = (campaignId) => leads.filter((lead) => lead.campaignId === campaignId);
  const quotesFor = (campaignId) => quotes.filter((quote) => quote.campaignId === campaignId && quote.status !== 'Draft');
  const ordersFor = (campaignId) => orders.filter((order) => order.campaignId === campaignId);

  const rows = useMemo(
    () =>
      campaigns.map((campaign) => {
        const spend = campaignExpenses
          .filter((expense) => expense.campaignId === campaign.id)
          .reduce((sum, expense) => sum + expense.amount, 0);
        const campLeads = leads.filter((lead) => lead.campaignId === campaign.id);
        const qualified = campLeads.filter((lead) => QUALIFIED_STAGES.includes(lead.stage)).length;
        const campQuotes = quotes.filter((quote) => quote.campaignId === campaign.id && quote.status !== 'Draft');
        const campOrders = orders.filter((order) => order.campaignId === campaign.id);
        const revenue = campOrders.reduce((sum, order) => sum + order.value, 0);
        return {
          ...campaign,
          loggedSpend: spend,
          utilisation: campaign.budget ? (spend / campaign.budget) * 100 : 0,
          attributedLeads: campLeads.length,
          qualified,
          quoteCount: campQuotes.length,
          quoteValue: campQuotes.reduce((sum, quote) => sum + quote.total, 0),
          orderCount: campOrders.length,
          revenue,
          returnMultiple: spend ? revenue / spend : 0,
        };
      }),
    [campaigns, campaignExpenses, leads, quotes, orders]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((campaign) => {
      if (status !== 'All' && campaign.status !== status) return false;
      if (!q) return true;
      return (
        campaign.name.toLowerCase().includes(q) ||
        campaign.channel.toLowerCase().includes(q) ||
        campaign.id.toLowerCase().includes(q)
      );
    });
  }, [rows, status, query]);

  const totalBudget = rows.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpend = rows.reduce((sum, campaign) => sum + campaign.loggedSpend, 0);
  const attributedLeads = rows.reduce((sum, campaign) => sum + campaign.attributedLeads, 0);
  const qualifiedLeads = rows.reduce((sum, campaign) => sum + campaign.qualified, 0);
  const quoteValue = rows.reduce((sum, campaign) => sum + campaign.quoteValue, 0);
  const quoteCount = rows.reduce((sum, campaign) => sum + campaign.quoteCount, 0);
  const attributedOrders = rows.reduce((sum, campaign) => sum + campaign.orderCount, 0);
  const confirmedRevenue = rows.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const blendedRoi = totalSpend ? confirmedRevenue / totalSpend : 0;
  const active = rows.filter((campaign) => campaign.status === 'Active').length;

  const channelMix = useMemo(() => {
    const map = new Map();
    campaignExpenses.forEach((expense) => {
      map.set(expense.channel, (map.get(expense.channel) || 0) + expense.amount);
    });
    const palette = { 'Google Ads': colors.forest, 'Meta Ads': colors.copper, Other: colors.info };
    return CHANNELS.filter((name) => (map.get(name) || 0) > 0).map((name) => ({
      name,
      value: map.get(name) || 0,
      color: palette[name],
    }));
  }, [campaignExpenses]);

  const spendLog = useMemo(() => {
    const log = channel === 'All' ? campaignExpenses : campaignExpenses.filter((expense) => expense.channel === channel);
    return [...log].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [campaignExpenses, channel]);

  const campaignName = (id) => campaigns.find((campaign) => campaign.id === id)?.name || id;

  const columns = [
    {
      key: 'name',
      label: 'Campaign',
      width: '24%',
      render: (campaign) => (
        <>
          <CellPrimary>{campaign.name}</CellPrimary>
          <CellSecondary>
            {campaign.id} · {campaign.channel}
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (campaign) => <StatusChip $tone={statusTone(campaign.status)}>{campaign.status}</StatusChip>,
    },
    {
      key: 'budget',
      label: 'Budget used',
      width: '13%',
      render: (campaign) => (
        <div style={{ minWidth: 86 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>
            {formatCompactINR(campaign.loggedSpend)}
            <span style={{ color: colors.faint, fontWeight: 500 }}> / {formatCompactINR(campaign.budget)}</span>
          </div>
          <ProgressTrack style={{ height: 4, marginTop: 5 }}>
            <ProgressFill $value={Math.min(100, campaign.utilisation)} />
          </ProgressTrack>
        </div>
      ),
    },
    {
      key: 'leads',
      label: 'Leads',
      align: 'right',
      render: (campaign) => <CellStrong>{campaign.attributedLeads}</CellStrong>,
    },
    {
      key: 'qualified',
      label: 'Qualified',
      align: 'right',
      render: (campaign) => <CellStrong>{campaign.qualified}</CellStrong>,
    },
    {
      key: 'quotes',
      label: 'Quotes',
      align: 'right',
      render: (campaign) => (
        <>
          <CellStrong>{campaign.quoteCount}</CellStrong>
          <CellSecondary style={{ marginTop: 1 }}>{formatCompactINR(campaign.quoteValue)}</CellSecondary>
        </>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      align: 'right',
      render: (campaign) => <CellStrong>{campaign.orderCount}</CellStrong>,
    },
    {
      key: 'revenue',
      label: 'Confirmed revenue',
      align: 'right',
      render: (campaign) => (
        <span style={{ fontWeight: 700, color: colors.success, fontVariantNumeric: 'tabular-nums' }}>
          {formatCompactINR(campaign.revenue)}
        </span>
      ),
    },
    {
      key: 'roi',
      label: 'Return',
      align: 'right',
      render: (campaign) => (
        <span
          style={{
            fontWeight: 700,
            color: campaign.returnMultiple >= 3 ? colors.success : campaign.returnMultiple > 0 ? colors.muted : colors.faint,
          }}
        >
          {campaign.returnMultiple ? `${campaign.returnMultiple.toFixed(1)}x` : '—'}
        </span>
      ),
    },
  ];

  const spendColumns = [
    {
      key: 'expense',
      label: 'Spend entry',
      width: '36%',
      render: (expense) => (
        <>
          <CellPrimary>{expense.note}</CellPrimary>
          <CellSecondary>
            {expense.id} · {formatDate(expense.date)}
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'campaign',
      label: 'Campaign',
      render: (expense) => (
        <>
          <CellPrimary style={{ fontWeight: 600, fontSize: 11.5 }}>{campaignName(expense.campaignId)}</CellPrimary>
          <CellSecondary>{expense.campaignId}</CellSecondary>
        </>
      ),
    },
    {
      key: 'channel',
      label: 'Channel',
      render: (expense) => <StatusChip $tone="neutral">{expense.channel}</StatusChip>,
    },
    {
      key: 'month',
      label: 'Month',
      render: (expense) => <CellSecondary style={{ marginTop: 0 }}>{monthLabel(expense.month)}</CellSecondary>,
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (expense) => <CellStrong>{formatCompactINR(expense.amount)}</CellStrong>,
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (expense) => (
        <Button
          $variant="ghost"
          $size="xs"
          aria-label={`Delete spend ${expense.id}`}
          onClick={() => setSpendDeleteId(expense.id)}
        >
          <Trash2 size={12} />
        </Button>
      ),
    },
  ];

  const campaignInitial = editing
    ? {
        name: editing.name,
        channel: editing.channel,
        status: editing.status,
        budget: editing.budget,
        start: editing.start,
        end: editing.end,
        objective: editing.objective || 'Qualified packaging enquiries',
      }
    : {
        name: '',
        channel: 'Google Search',
        status: 'Draft',
        budget: '',
        start: plusDaysISO(1),
        end: plusDaysISO(60),
        objective: 'Qualified packaging enquiries',
      };

  const exportPerformance = () => {
    downloadCSV(
      'stark-packmate-marketing-performance.csv',
      [
        'Campaign',
        'Channel',
        'Status',
        'Budget',
        'Logged spend',
        'Leads',
        'Qualified leads',
        'Quotations',
        'Quote value',
        'Orders',
        'Confirmed revenue',
        'Return multiple',
      ],
      filtered.map((campaign) => [
        campaign.name,
        campaign.channel,
        campaign.status,
        campaign.budget,
        campaign.loggedSpend,
        campaign.attributedLeads,
        campaign.qualified,
        campaign.quoteCount,
        campaign.quoteValue,
        campaign.orderCount,
        campaign.revenue,
        campaign.returnMultiple.toFixed(1),
      ])
    );
    notify('Performance exported', `${filtered.length} campaigns downloaded as CSV.`, 'success');
  };

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Marketing &amp; agency</PageHeading>
          <PageDescription>
            Campaigns, manual ad spend and the Pine &amp; Pixel retainer — linked to the demo CRM,
            quotation and order records for honest attribution.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="light" $size="sm" onClick={exportPerformance}>
            <Download size={14} /> Export
          </Button>
          <Button
            $variant="light"
            $size="sm"
            onClick={() => {
              setSpendCampaignId(selected?.id || campaigns[0]?.id || '');
              setSpendOpen(true);
            }}
          >
            <Wallet size={14} /> Log spend
          </Button>
          <Button $variant="primary" $size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} /> New campaign
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Marketing spend', value: formatCompactINR(totalSpend), hint: `${active} active campaigns` },
          {
            label: 'Budget committed',
            value: formatCompactINR(totalBudget),
            hint: totalBudget ? `${Math.round((totalSpend / totalBudget) * 100)}% used` : 'No budget set',
          },
          {
            label: 'Attributed leads',
            value: formatNumber(attributedLeads),
            hint: `${qualifiedLeads} qualified in CRM`,
          },
          {
            label: 'Quotation value',
            value: formatCompactINR(quoteValue),
            hint: `${quoteCount} quotations · pipeline, not revenue`,
          },
          {
            label: 'Converted orders',
            value: formatNumber(attributedOrders),
            hint: 'Attributed demo orders',
          },
          {
            label: 'Confirmed revenue',
            value: formatCompactINR(confirmedRevenue),
            hint: 'Booked order value only',
          },
        ]}
      />

      <div style={{ height: 18 }} />

      <Grid $cols="minmax(0, 1.35fr) minmax(0, 1fr)" $colsMd="1fr" $gap="18px">
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Campaign budgets vs actual</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Logged spend against the approved budget
              </div>
            </div>
            <StatusChip $tone={totalSpend <= totalBudget ? 'success' : 'danger'}>
              {totalBudget ? `${Math.round((totalSpend / totalBudget) * 100)}% consumed` : 'No budget'}
            </StatusChip>
          </PanelHeader>
          <PanelBody>
            {rows.map((campaign) => (
              <BudgetRow key={campaign.id}>
                <BudgetTop>
                  <div>
                    <strong>{campaign.name}</strong>
                    <span> · {campaign.channel}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <em>{formatCompactINR(campaign.loggedSpend)}</em>
                    <span> / {formatCompactINR(campaign.budget)}</span>
                  </div>
                </BudgetTop>
                <ProgressTrack style={{ height: 6 }}>
                  <ProgressFill $value={Math.min(100, campaign.utilisation)} />
                </ProgressTrack>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: colors.faint }}>
                  <span>{Math.round(campaign.utilisation)}% of budget</span>
                  <span>{campaign.returnMultiple ? `${campaign.returnMultiple.toFixed(1)}x return` : 'No revenue yet'}</span>
                </div>
              </BudgetRow>
            ))}
          </PanelBody>
          <PanelFooter>
            <span style={{ fontSize: 10.5, color: colors.faint }}>
              Spend is entered manually below; budgets are set on each campaign.
            </span>
          </PanelFooter>
        </Panel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Spend by channel</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Google Ads, Meta Ads and other manual entries
              </div>
            </div>
            <Megaphone size={16} style={{ color: colors.copper }} />
          </PanelHeader>
          <PanelBody>
            <DonutChart
              data={channelMix}
              height={196}
              centerValue={formatCompactINR(totalSpend)}
              centerLabel="Logged spend"
              formatter={formatCompactINR}
            />
          </PanelBody>
          <PanelFooter>
            <span style={{ fontSize: 10.5, color: colors.faint }}>
              Sample entries only — no ad platform is connected to this workspace.
            </span>
          </PanelFooter>
        </Panel>
      </Grid>

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Attribution funnel</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              Campaign-linked demo records from CRM through to booked orders
            </div>
          </div>
          <StatusChip $tone="info">
            <TrendingUp size={10} /> {blendedRoi.toFixed(1)}x blended return
          </StatusChip>
        </PanelHeader>
        <PanelBody>
          <FunnelGrid>
            <FunnelCell>
              <span>Attributed leads</span>
              <strong>{formatNumber(attributedLeads)}</strong>
              <em>CRM leads with a campaign</em>
            </FunnelCell>
            <FunnelCell>
              <span>Qualified</span>
              <strong>{formatNumber(qualifiedLeads)}</strong>
              <em>Qualified, proposal or won</em>
            </FunnelCell>
            <FunnelCell>
              <span>Quotations</span>
              <strong>{formatNumber(quoteCount)}</strong>
              <em>{formatCompactINR(quoteValue)} pipeline</em>
            </FunnelCell>
            <FunnelCell>
              <span>Converted orders</span>
              <strong>{formatNumber(attributedOrders)}</strong>
              <em>Accepted quotations booked</em>
            </FunnelCell>
            <FunnelCell>
              <span>Confirmed revenue</span>
              <strong>{formatCompactINR(confirmedRevenue)}</strong>
              <em>{formatCompactINR(totalSpend)} spend · {blendedRoi.toFixed(1)}x return</em>
            </FunnelCell>
          </FunnelGrid>
          <Note>
            <Target size={14} style={{ color: colors.copper, marginTop: 1, flex: '0 0 auto' }} />
            <p>
              Quotation value is pipeline and is not counted as revenue. Only booked order value counts
              as confirmed revenue, and returns use manually logged spend — this workspace does not
              connect to live ad accounts.
            </p>
          </Note>
        </PanelBody>
      </Panel>

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Campaign register</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filtered.length} of {campaigns.length} campaigns
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search campaign or channel…" />
          </Toolbar>
        </PanelHeader>
        <div style={{ padding: '12px 16px 0' }}>
          <FilterChips
            options={['All', 'Active', 'Paused', 'Completed', 'Draft'].map((name) => ({
              value: name,
              label: name === 'All' ? 'All campaigns' : name,
              count: name === 'All' ? campaigns.length : campaigns.filter((campaign) => campaign.status === name).length,
            }))}
            value={status}
            onChange={setStatus}
          />
        </div>
        <PanelBody $flush>
          <DataTable
            columns={columns}
            rows={filtered}
            onRowClick={(campaign) => setSelectedId(campaign.id)}
            minWidth="1120px"
            footer={<span>{filtered.length} campaigns · select a row for the attributed pipeline</span>}
          />
        </PanelBody>
      </Panel>

      <div style={{ height: 18 }} />

      <Grid $cols="minmax(0, 1.35fr) minmax(0, 1fr)" $colsMd="1fr" $gap="18px">
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Ad spend log</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                {spendLog.length} manual entries · {formatCompactINR(spendLog.reduce((sum, expense) => sum + expense.amount, 0))}
              </div>
            </div>
            <Button
              $variant="light"
              $size="xs"
              onClick={() => {
                setSpendCampaignId(selected?.id || campaigns[0]?.id || '');
                setSpendOpen(true);
              }}
            >
              <Plus size={13} /> Log spend
            </Button>
          </PanelHeader>
          <div style={{ padding: '12px 16px 0' }}>
            <FilterChips
              options={['All', ...CHANNELS].map((name) => ({
                value: name,
                label: name,
                count:
                  name === 'All'
                    ? campaignExpenses.length
                    : campaignExpenses.filter((expense) => expense.channel === name).length,
              }))}
              value={channel}
              onChange={setChannel}
            />
          </div>
          <PanelBody $flush>
            <DataTable
              columns={spendColumns}
              rows={spendLog}
              minWidth="720px"
              footer={<span>{spendLog.length} entries · delete any entry to correct the campaign spend</span>}
            />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Agency &amp; retainer</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Performance marketing partner
              </div>
            </div>
            <Button $variant="light" $size="xs" onClick={() => setProfileOpen(true)}>
              <Pencil size={12} /> Profile
            </Button>
          </PanelHeader>
          <PanelBody>
            <AgencyCard>
              <AgencyMark>{agencyInitials(agencyProfile.name)}</AgencyMark>
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong>{agencyProfile.name}</strong>
                <span>
                  {agencyProfile.contact} · {agencyProfile.role}
                </span>
                <span>
                  {agencyProfile.email} · {agencyProfile.phone}
                </span>
              </div>
              <StatusChip $tone={statusTone(agencyProfile.status)}>{agencyProfile.status}</StatusChip>
            </AgencyCard>

            <DetailGrid style={{ marginTop: 14 }}>
              <DetailItem>
                <DetailLabel>Contract</DetailLabel>
                <DetailValue>
                  {formatDate(agencyProfile.contractStart, { year: undefined })} –{' '}
                  {formatDate(agencyProfile.contractEnd)}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Monthly retainer</DetailLabel>
                <DetailValue>{formatCompactINR(agencyProfile.retainer)}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <SectionHead>
              <span>Retainer fees</span>
              <Button $variant="ghost" $size="xs" onClick={() => setFeeOpen(true)}>
                <Plus size={12} /> Add fee
              </Button>
            </SectionHead>
            {agencyFees.map((fee) => (
              <FeeRow key={fee.id}>
                <div>
                  <strong>
                    {fee.label} · {monthLabel(fee.month)}
                  </strong>
                  <span>
                    {fee.invoice === '—' ? 'Invoice pending' : fee.invoice}
                    {fee.paidOn ? ` · paid ${formatDate(fee.paidOn)}` : ''}
                  </span>
                </div>
                <em>{formatCompactINR(fee.fee)}</em>
                {fee.status === 'Paid' ? (
                  <StatusChip $tone="success">Paid</StatusChip>
                ) : (
                  <Button
                    $variant="light"
                    $size="xs"
                    onClick={() => {
                      markAgencyFeePaid(fee.id);
                      notify('Fee marked paid', `${fee.label} settled.`, 'success');
                    }}
                  >
                    Mark paid
                  </Button>
                )}
              </FeeRow>
            ))}

            <SectionHead>
              <span>Creative briefs</span>
              <Button $variant="ghost" $size="xs" onClick={() => setBriefOpen(true)}>
                <Plus size={12} /> New brief
              </Button>
            </SectionHead>
            {agencyBriefs.slice(0, 3).map((brief) => (
              <BriefRow key={brief.id}>
                <div>
                  <strong>{brief.title}</strong>
                  <span>
                    {brief.agency} · due {formatDate(brief.due, { year: undefined })} ·{' '}
                    {formatCompactINR(brief.budget)}
                  </span>
                </div>
                <StatusChip $tone={statusTone(brief.status)}>{brief.status}</StatusChip>
              </BriefRow>
            ))}
          </PanelBody>
          <PanelFooter>
            <span style={{ fontSize: 10.5, color: colors.faint }}>
              {agencyProfile.scope}
            </span>
          </PanelFooter>
        </Panel>
      </Grid>

      <AppModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditId(null);
        }}
        title={editing ? `Edit ${editing.name}` : 'New campaign'}
        description="Campaigns carry the budget, channel and attribution used across marketing reporting."
        size="md"
      >
        <Formik
          initialValues={campaignInitial}
          validationSchema={campaignValidation}
          enableReinitialize
          onSubmit={(values) => {
            const payload = { ...values, budget: Number(values.budget) };
            const campaign = editing ? updateCampaign(editing.id, payload) || { ...editing, ...payload } : addCampaign(payload);
            notify(
              editing ? 'Campaign updated' : 'Campaign created',
              `${campaign.name} saved as ${campaign.id}.`,
              'success'
            );
            setFormOpen(false);
            setEditId(null);
            setSelectedId(campaign.id);
          }}
        >
          <Form>
            <TextField name="name" label="Campaign name" placeholder="Q1 2027 mailer launch" />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <SelectField
                name="channel"
                label="Primary channel"
                options={['Google Search', 'LinkedIn', 'Instagram', 'Email', 'Trade show', 'SEO & content', 'Referral']}
              />
              <SelectField name="status" label="Status" options={['Draft', 'Active', 'Paused', 'Completed']} />
              <TextField name="budget" label="Budget" type="number" prefix="₹" placeholder="250000" />
              <TextField name="start" label="Start date" type="date" />
              <TextField name="end" label="End date" type="date" />
            </FormGrid>
            <div style={{ height: 14 }} />
            <TextField name="objective" label="Objective" placeholder="Qualified packaging enquiries" />
            <FormActions>
              <Button
                type="button"
                $variant="secondary"
                $size="sm"
                onClick={() => {
                  setFormOpen(false);
                  setEditId(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editing ? 'Save campaign' : 'Create campaign'} <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={spendOpen}
        onClose={() => setSpendOpen(false)}
        title="Log ad spend"
        description="Manual entries feed campaign spend, channel mix and return calculations."
        size="md"
      >
        <Formik
          initialValues={{
            campaignId: spendCampaignId || campaigns[0]?.id || '',
            channel: 'Google Ads',
            month: todayISO().slice(0, 7),
            amount: '',
            note: '',
            date: todayISO(),
          }}
          validationSchema={spendValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            const expense = addCampaignExpense({ ...values, amount: Number(values.amount) });
            notify(
              'Spend logged',
              `${formatCompactINR(expense.amount)} on ${campaignName(expense.campaignId)} · ${expense.channel}.`,
              'success'
            );
            setSpendOpen(false);
            helpers.resetForm();
          }}
        >
          <Form>
            <SelectField
              name="campaignId"
              label="Campaign"
              options={campaigns.map((campaign) => ({ value: campaign.id, label: `${campaign.name} · ${campaign.id}` }))}
            />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <SelectField name="channel" label="Channel" options={CHANNELS} />
              <TextField name="month" label="Spend month" type="month" />
              <TextField name="amount" label="Amount" type="number" prefix="₹" placeholder="118000" />
              <TextField name="date" label="Entry date" type="date" />
            </FormGrid>
            <div style={{ height: 14 }} />
            <TextField name="note" label="Note" placeholder="Search · gifting intent keywords" />
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setSpendOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                Log spend <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={feeOpen}
        onClose={() => setFeeOpen(false)}
        title="Add retainer fee"
        description="Agency fees are tracked separately from campaign ad spend."
        size="sm"
      >
        <Formik
          initialValues={{
            month: todayISO().slice(0, 7),
            label: 'Monthly retainer',
            fee: agencyProfile.retainer,
            status: 'Pending',
            invoice: '',
          }}
          validationSchema={feeValidation}
          onSubmit={(values, helpers) => {
            const fee = addAgencyFee({ ...values, fee: Number(values.fee) });
            notify('Fee added', `${fee.label} · ${formatCompactINR(fee.fee)}.`, 'success');
            setFeeOpen(false);
            helpers.resetForm();
          }}
        >
          <Form>
            <TextField name="month" label="Fee month" type="month" />
            <div style={{ height: 14 }} />
            <TextField name="label" label="Description" placeholder="Monthly retainer" />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <TextField name="fee" label="Fee" type="number" prefix="₹" />
              <SelectField name="status" label="Status" options={['Pending', 'Paid']} />
            </FormGrid>
            <div style={{ height: 14 }} />
            <TextField name="invoice" label="Invoice reference" placeholder="PP/INV/2612" />
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setFeeOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                Add fee <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Agency profile"
        description="Contact and contract details for the performance marketing partner."
        size="md"
      >
        <Formik
          initialValues={{
            name: agencyProfile.name,
            contact: agencyProfile.contact,
            role: agencyProfile.role,
            email: agencyProfile.email,
            phone: agencyProfile.phone,
            city: agencyProfile.city,
            website: agencyProfile.website,
            contractStart: agencyProfile.contractStart,
            contractEnd: agencyProfile.contractEnd,
            retainer: agencyProfile.retainer,
            scope: agencyProfile.scope,
            status: agencyProfile.status,
          }}
          validationSchema={profileValidation}
          enableReinitialize
          onSubmit={(values) => {
            saveAgencyProfile(values);
            notify('Agency updated', `${values.name} profile saved.`, 'success');
            setProfileOpen(false);
          }}
        >
          <Form>
            <FormGrid $cols={2}>
              <TextField name="name" label="Agency" />
              <TextField name="contact" label="Primary contact" />
              <TextField name="role" label="Role" />
              <TextField name="email" label="Email" type="email" />
              <TextField name="phone" label="Phone" />
              <TextField name="city" label="City" />
              <TextField name="website" label="Website" />
              <SelectField name="status" label="Status" options={['Active', 'Paused', 'Ended']} />
              <TextField name="contractStart" label="Contract start" type="date" />
              <TextField name="contractEnd" label="Contract end" type="date" />
              <TextField name="retainer" label="Monthly retainer" type="number" prefix="₹" />
            </FormGrid>
            <div style={{ height: 14 }} />
            <TextAreaField name="scope" label="Scope" rows={3} />
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                Save profile <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={briefOpen}
        onClose={() => setBriefOpen(false)}
        title="New creative brief"
        description="Briefs track agency creative work in flight."
        size="md"
      >
        <Formik
          initialValues={{
            title: '',
            agency: agencyProfile.name,
            due: plusDaysISO(21),
            budget: '',
            status: 'Brief approved',
          }}
          validationSchema={briefValidation}
          onSubmit={(values, helpers) => {
            const brief = saveAgencyBrief({ ...values, budget: Number(values.budget) });
            notify('Brief created', `${brief.title} assigned to ${brief.agency}.`, 'success');
            setBriefOpen(false);
            helpers.resetForm();
          }}
        >
          <Form>
            <TextField name="title" label="Brief title" placeholder="Q1 2027 brand film" />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <TextField name="agency" label="Agency" />
              <SelectField
                name="status"
                label="Status"
                options={['Brief approved', 'In production', 'Awaiting feedback', 'Delivered']}
              />
              <TextField name="due" label="Due date" type="date" />
              <TextField name="budget" label="Budget" type="number" prefix="₹" />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setBriefOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                Create brief <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.name : ''}
        description={selected ? `${selected.id} · ${selected.channel}` : ''}
        width="540px"
        footer={
          selected ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setSelectedId(null)}>
                Close
              </Button>
              <Button
                $variant="light"
                $size="sm"
                onClick={() => {
                  setEditId(selected.id);
                  setFormOpen(true);
                }}
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button $variant="light" $size="sm" onClick={() => setDeleteId(selected.id)}>
                <Trash2 size={14} /> Delete
              </Button>
              <Button
                $variant="primary"
                $size="sm"
                onClick={() => {
                  const next = selected.status === 'Active' ? 'Paused' : 'Active';
                  updateCampaignStatus(selected.id, next);
                  notify('Campaign updated', `${selected.name} is now ${next.toLowerCase()}.`, 'success');
                }}
              >
                {selected.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                {selected.status === 'Active' ? 'Pause' : 'Activate'}
              </Button>
            </>
          ) : null
        }
      >
        {selected ? (
          (() => {
            const campaignSpend = spendFor(selected.id);
            const campaignLeads = leadsFor(selected.id);
            const campaignQuotes = quotesFor(selected.id);
            const campaignOrders = ordersFor(selected.id);
            const revenue = campaignOrders.reduce((sum, order) => sum + order.value, 0);
            const quoteTotal = campaignQuotes.reduce((sum, quote) => sum + quote.total, 0);
            return (
              <>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                  <StatusChip $tone={statusTone(selected.status)}>{selected.status}</StatusChip>
                  <span style={{ marginLeft: 'auto', fontFamily: fonts.display, fontSize: 23, color: colors.ink }}>
                    {campaignSpend ? `${(revenue / campaignSpend).toFixed(1)}x return` : 'No spend yet'}
                  </span>
                </div>

                <ProgressTrack style={{ height: 8 }}>
                  <ProgressFill $value={Math.min(100, selected.budget ? (campaignSpend / selected.budget) * 100 : 0)} />
                </ProgressTrack>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: colors.muted }}>
                  <span>{formatCompactINR(campaignSpend)} logged spend</span>
                  <span>{formatCompactINR(selected.budget)} budget</span>
                </div>

                <Divider style={{ margin: '18px 0' }} />

                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Channel</DetailLabel>
                    <DetailValue>{selected.channel}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Window</DetailLabel>
                    <DetailValue>
                      {formatDate(selected.start, { year: undefined })} – {formatDate(selected.end)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Objective</DetailLabel>
                    <DetailValue>{selected.objective}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Owner</DetailLabel>
                    <DetailValue>{selected.owner}</DetailValue>
                  </DetailItem>
                </DetailGrid>

                <Divider style={{ margin: '18px 0' }} />
                <SectionHead style={{ marginTop: 0 }}>
                  <span>Attributed pipeline</span>
                </SectionHead>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Leads</DetailLabel>
                    <DetailValue>{campaignLeads.length}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Qualified</DetailLabel>
                    <DetailValue>
                      {campaignLeads.filter((lead) => QUALIFIED_STAGES.includes(lead.stage)).length}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Quotations</DetailLabel>
                    <DetailValue>
                      {campaignQuotes.length} · {formatCompactINR(quoteTotal)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Orders</DetailLabel>
                    <DetailValue>{campaignOrders.length}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Confirmed revenue</DetailLabel>
                    <DetailValue>{formatCompactINR(revenue)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Quotation value</DetailLabel>
                    <DetailValue>{formatCompactINR(quoteTotal)}</DetailValue>
                  </DetailItem>
                </DetailGrid>

                <Divider style={{ margin: '18px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <SectionHead style={{ margin: 0 }}>
                    <span>Spend entries</span>
                  </SectionHead>
                  <Button
                    $variant="ghost"
                    $size="xs"
                    onClick={() => {
                      setSpendCampaignId(selected.id);
                      setSpendOpen(true);
                    }}
                  >
                    <Plus size={12} /> Log
                  </Button>
                </div>
                {campaignExpenses.filter((expense) => expense.campaignId === selected.id).length ? (
                  campaignExpenses
                    .filter((expense) => expense.campaignId === selected.id)
                    .map((expense) => (
                      <FeeRow key={expense.id}>
                        <div>
                          <strong>{expense.note}</strong>
                          <span>
                            {expense.channel} · {formatDate(expense.date)} · {expense.id}
                          </span>
                        </div>
                        <em>{formatCompactINR(expense.amount)}</em>
                        <Button
                          $variant="ghost"
                          $size="xs"
                          aria-label={`Delete spend ${expense.id}`}
                          onClick={() => setSpendDeleteId(expense.id)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </FeeRow>
                    ))
                ) : (
                  <p style={{ fontSize: 11, color: colors.faint, padding: '8px 0' }}>
                    No spend logged against this campaign yet.
                  </p>
                )}

                <Divider style={{ margin: '18px 0' }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: colors.inkSoft, marginBottom: 6 }}>
                  <Sparkles size={12} style={{ verticalAlign: -2, marginRight: 5 }} />
                  Recommended next action
                </p>
                <p style={{ fontSize: 11.5, color: colors.muted, lineHeight: 1.65 }}>
                  {!campaignSpend
                    ? 'No spend logged yet. Post the first media invoice to start measuring return.'
                    : revenue / campaignSpend >= 3
                    ? 'Return is above the 3x blended benchmark. Protect budget and test a second creative variant.'
                    : campaignQuotes.length
                    ? 'Pipeline exists but returns are below benchmark — review quote follow-up and landing page conversion.'
                    : 'Spend is live without attributed pipeline. Check UTM tagging on the landing pages for this campaign.'}
                </p>
              </>
            );
          })()
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleteId(null)}
        title="Delete campaign"
        message={
          deleting
            ? `Remove ${deleting.name} (${deleting.id})? Its spend entries are removed and linked leads, quotes and orders lose the campaign tag.`
            : ''
        }
        confirmLabel="Delete campaign"
        tone="danger"
        onConfirm={() => {
          if (!deleting) return;
          deleteCampaign(deleting.id);
          notify('Campaign deleted', `${deleting.name} removed from the register.`, 'success');
          setDeleteId(null);
          setSelectedId(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingSpend)}
        onClose={() => setSpendDeleteId(null)}
        title="Delete spend entry"
        message={
          deletingSpend
            ? `Remove ${formatCompactINR(deletingSpend.amount)} from ${campaignName(deletingSpend.campaignId)}? Campaign spend and channel mix will be recalculated.`
            : ''
        }
        confirmLabel="Delete spend"
        tone="danger"
        onConfirm={() => {
          if (!deletingSpend) return;
          deleteCampaignExpense(deletingSpend.id);
          notify('Spend deleted', `${deletingSpend.id} removed from campaign spend.`, 'success');
          setSpendDeleteId(null);
        }}
      />
    </div>
  );
}
