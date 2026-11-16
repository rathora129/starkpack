'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Switch } from '@heroui/react';
import {
  TrendingUp,
  Users,
  Factory,
  Boxes,
  UserRound,
  Wallet,
  Megaphone,
  Download,
  Pencil,
  Play,
  Plus,
  Trash2,
  CalendarClock,
  Send,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import {
  formatCompactINR,
  formatDate,
  formatNumber,
  formatINR,
  statusTone,
  stockHealth,
  downloadCSV,
  todayISO,
} from '@/lib/format';
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
  PanelSubtitle,
  PanelBody,
  StatusChip,
  Tag,
  ProgressTrack,
  ProgressFill,
  Grid,
} from '@/components/ui/primitives';
import { Segmented, SearchInput } from '@/components/ui/Controls';
import { DataTable, CellPrimary, CellSecondary, CellStrong } from '@/components/ui/DataTable';
import { AppModal, ConfirmDialog } from '@/components/ui/Overlay';
import { TextField, SelectField, SwitchField, FormGrid, FormActions } from '@/components/ui/FormFields';
import MiniStats from '@/components/dashboard/MiniStats';

const QUALIFIED_STAGES = ['Qualified', 'Proposal', 'Won'];
const OPEN_EXCLUDED = ['Won', 'Lost'];

const RANGES = [
  { value: '30d', label: '30 days', days: 30 },
  { value: '90d', label: '90 days', days: 90 },
  { value: '6m', label: '6 months', days: 183 },
];

const ICONS = {
  sales: TrendingUp,
  leads: Users,
  production: Factory,
  inventory: Boxes,
  employees: UserRound,
  finance: Wallet,
  marketing: Megaphone,
};

const inRange = (value, from, to) => {
  const key = String(value || '').slice(0, 10);
  return Boolean(key) && key >= from && key <= to;
};

const isoMinusDays = (dateISO, days) => {
  const date = new Date(`${String(dateISO).slice(0, 10)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
};

const isoPlusDays = (dateISO, days) => {
  const date = new Date(`${String(dateISO).slice(0, 10)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const sum = (items, pick) => items.reduce((total, item) => total + Number(pick(item) || 0), 0);
const monthLabel = (month) => formatDate(`${month}-01`, { day: undefined, month: 'short', year: 'numeric' });

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const ReportCard = styled.article`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ $active }) => ($active ? colors.copper : colors.line)};
  border-radius: ${radii.lg};
  background: #fff;
  box-shadow: ${({ $active }) => ($active ? shadows.card : shadows.xs)};
  overflow: hidden;
  transition: border-color ${transitions.fast}, box-shadow ${transitions.fast}, transform ${transitions.fast};

  &:hover {
    border-color: ${({ $active }) => ($active ? colors.copper : '#C9CBE0')};
    box-shadow: ${shadows.card};
    transform: translateY(-1px);
  }
`;

const CardMain = styled.button`
  display: block;
  width: 100%;
  flex: 1;
  padding: 16px;
  border: 0;
  background: transparent;
  text-align: left;
  font-family: ${fonts.sans};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.copper};
    outline-offset: -2px;
  }
`;

const ReportTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
`;

const IconTile = styled.span`
  width: 34px;
  height: 34px;
  border-radius: ${radii.sm};
  display: grid;
  place-items: center;
  background: ${colors.paper};
  color: ${colors.copperDeep};
  border: 1px solid ${colors.lineSoft};
  flex: 0 0 auto;
`;

const ReportTitle = styled.h3`
  font-family: ${fonts.sans};
  font-size: 13px;
  font-weight: 700;
  color: ${colors.ink};
  margin-bottom: 8px;
`;

const CardMetric = styled.p`
  font-family: ${fonts.sans};
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${colors.ink};
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
`;

const CardHint = styled.p`
  font-size: 10.5px;
  color: ${colors.muted};
  margin-top: 4px;
  line-height: 1.45;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px 8px 16px;
  border-top: 1px solid ${colors.lineSoft};
  background: #FAFAFD;

  > span {
    font-size: 10px;
    color: ${colors.faint};
  }
`;

const StatStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(122px, 1fr));
  gap: 1px;
  background: ${colors.lineSoft};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  overflow: hidden;
  margin-bottom: 14px;
`;

const StatCell = styled.div`
  padding: 11px 13px;
  background: #fff;

  span {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 4px;
    font-size: 14px;
    font-weight: 700;
    color: ${colors.ink};
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
  }
`;

const Note = styled.p`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 10px 12px;
  margin-bottom: 14px;
  border-radius: ${radii.sm};
  background: ${colors.cream};
  border: 1px dashed ${colors.line};
  font-size: 10.5px;
  line-height: 1.55;
  color: ${colors.muted};

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
    color: ${colors.copper};
  }
`;

const TableToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;

  > span {
    font-size: 10.5px;
    color: ${colors.faint};
  }
`;

const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;

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

const ScheduleBody = styled.div`
  min-width: 0;
  flex: 1;

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 10.5px;
    color: ${colors.muted};
    margin-top: 2px;
  }
`;

const ScheduleActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
`;

const CoverageRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:last-of-type {
    border-bottom: 0;
  }

  div {
    min-width: 0;
  }

  strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: ${colors.ink};
  }

  small {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.faint};
  }

  em {
    font-style: normal;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.forest};
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
`;

const ProgressCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
    color: ${colors.muted};
    white-space: nowrap;
  }

  > div {
    width: 64px;
  }
`;

const salesColumns = [
  { key: 'customer', label: 'Customer', render: (row) => <CellPrimary>{row.customer}</CellPrimary> },
  { key: 'orders', label: 'Orders', align: 'right', render: (row) => <CellStrong>{formatNumber(row.orders)}</CellStrong> },
  { key: 'orderValue', label: 'Order value', align: 'right', render: (row) => formatCompactINR(row.orderValue) },
  {
    key: 'invoiced',
    label: 'Invoiced',
    align: 'right',
    render: (row) =>
      row.invoiced ? (
        formatCompactINR(row.invoiced)
      ) : (
        <CellSecondary>Not invoiced</CellSecondary>
      ),
  },
  { key: 'collected', label: 'Collected', align: 'right', render: (row) => formatCompactINR(row.collected) },
  {
    key: 'outstanding',
    label: 'Outstanding',
    align: 'right',
    render: (row) =>
      row.outstanding ? (
        <span style={{ color: colors.danger, fontWeight: 600 }}>{formatCompactINR(row.outstanding)}</span>
      ) : (
        <CellSecondary>—</CellSecondary>
      ),
  },
  {
    key: 'realisation',
    label: 'Realisation',
    align: 'right',
    render: (row) =>
      row.realisation === null ? (
        <CellSecondary>—</CellSecondary>
      ) : (
        <StatusChip $tone={row.realisation >= 80 ? 'success' : row.realisation >= 40 ? 'warning' : 'danger'}>
          {row.realisation.toFixed(0)}%
        </StatusChip>
      ),
  },
];

const leadColumns = [
  {
    key: 'source',
    label: 'Lead source',
    render: (row) => (
      <div>
        <CellPrimary>{row.source}</CellPrimary>
        <CellSecondary>{row.lost ? `${row.lost} lost` : 'No losses'}</CellSecondary>
      </div>
    ),
  },
  { key: 'leads', label: 'Leads', align: 'right', render: (row) => <CellStrong>{formatNumber(row.leads)}</CellStrong> },
  { key: 'qualified', label: 'Qualified', align: 'right', render: (row) => formatNumber(row.qualified) },
  { key: 'won', label: 'Won', align: 'right', render: (row) => formatNumber(row.won) },
  {
    key: 'winRate',
    label: 'Win rate',
    align: 'right',
    render: (row) => (
      <StatusChip $tone={row.winRate >= 25 ? 'success' : row.winRate > 0 ? 'warning' : 'neutral'}>
        {row.winRate.toFixed(0)}%
      </StatusChip>
    ),
  },
  { key: 'pipeline', label: 'Open pipeline', align: 'right', render: (row) => formatCompactINR(row.pipeline) },
  { key: 'wonValue', label: 'Won value', align: 'right', render: (row) => formatCompactINR(row.wonValue) },
];

const productionColumns = [
  {
    key: 'id',
    label: 'Job',
    render: (row) => (
      <div>
        <CellPrimary>{row.id}</CellPrimary>
        <CellSecondary>{row.orderId}</CellSecondary>
      </div>
    ),
  },
  {
    key: 'product',
    label: 'Product',
    render: (row) => (
      <div>
        <CellPrimary>{row.product}</CellPrimary>
        <CellSecondary>{row.customer}</CellSecondary>
      </div>
    ),
  },
  {
    key: 'stage',
    label: 'Stage',
    render: (row) => <StatusChip $tone={statusTone(row.stage)}>{row.stage}</StatusChip>,
  },
  { key: 'quantity', label: 'Qty', align: 'right', render: (row) => formatNumber(row.quantity) },
  {
    key: 'due',
    label: 'Deadline',
    align: 'right',
    render: (row) => (
      <div>
        <span>{formatDate(row.due, { year: undefined })}</span>
        <CellSecondary>
          {row.overdue ? 'Overdue' : row.dueSoon ? 'Due soon' : 'Scheduled'}
        </CellSecondary>
      </div>
    ),
  },
  {
    key: 'progress',
    label: 'Progress',
    render: (row) => (
      <ProgressCell>
        <ProgressTrack>
          <ProgressFill $value={row.progress} $tone={row.overdue ? 'danger' : row.dueSoon ? 'warning' : undefined} />
        </ProgressTrack>
        <span>{row.progress}%</span>
      </ProgressCell>
    ),
  },
  {
    key: 'checklist',
    label: 'Checklist',
    align: 'right',
    render: (row) => `${row.checklistDone}/${row.checklistTotal}`,
  },
];

const inventoryColumns = [
  {
    key: 'id',
    label: 'SKU',
    render: (row) => (
      <div>
        <CellPrimary>{row.id}</CellPrimary>
        <CellSecondary>{row.name}</CellSecondary>
      </div>
    ),
  },
  { key: 'itemType', label: 'Type', render: (row) => <Tag>{row.itemType}</Tag> },
  { key: 'onHand', label: 'On hand', align: 'right', render: (row) => formatNumber(row.onHand) },
  {
    key: 'available',
    label: 'Available',
    align: 'right',
    render: (row) => <CellStrong>{formatNumber(row.available)}</CellStrong>,
  },
  { key: 'reorder', label: 'Reorder', align: 'right', render: (row) => formatNumber(row.reorder) },
  { key: 'unitCost', label: 'Unit cost', align: 'right', render: (row) => formatINR(row.unitCost) },
  { key: 'value', label: 'Stock value', align: 'right', render: (row) => formatCompactINR(row.value) },
  {
    key: 'health',
    label: 'Health',
    align: 'right',
    render: (row) => <StatusChip $tone={row.health.tone}>{row.health.label}</StatusChip>,
  },
  { key: 'moves', label: 'Moves', align: 'right', render: (row) => formatNumber(row.moves) },
];

const employeeColumns = [
  {
    key: 'name',
    label: 'Employee',
    render: (row) => (
      <div>
        <CellPrimary>{row.name}</CellPrimary>
        <CellSecondary>{row.role}</CellSecondary>
      </div>
    ),
  },
  { key: 'department', label: 'Department', render: (row) => row.department },
  { key: 'shift', label: 'Shift', render: (row) => <Tag>Shift {row.shift}</Tag> },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusChip $tone={statusTone(row.status)}>{row.status}</StatusChip>,
  },
  { key: 'tenure', label: 'Tenure', align: 'right', render: (row) => `${row.tenure.toFixed(1)} yrs` },
  { key: 'openTasks', label: 'Open tasks', align: 'right', render: (row) => formatNumber(row.openTasks) },
  { key: 'leaveDays', label: 'Approved leave', align: 'right', render: (row) => `${row.leaveDays} d` },
  { key: 'salaryLabel', label: 'Latest salary', align: 'right', render: (row) => row.salaryLabel },
];

const financeColumns = [
  { key: 'monthLabel', label: 'Month', render: (row) => <CellStrong>{row.monthLabel}</CellStrong> },
  { key: 'receipts', label: 'Receipts', align: 'right', render: (row) => formatCompactINR(row.receipts) },
  { key: 'costs', label: 'Costs', align: 'right', render: (row) => formatCompactINR(row.costs) },
  {
    key: 'net',
    label: 'Net cash',
    align: 'right',
    render: (row) => (
      <span style={{ color: row.net >= 0 ? colors.success : colors.danger, fontWeight: 700 }}>
        {formatCompactINR(row.net)}
      </span>
    ),
  },
  { key: 'invoiced', label: 'Invoiced', align: 'right', render: (row) => formatCompactINR(row.invoiced) },
  { key: 'collected', label: 'Collected', align: 'right', render: (row) => formatCompactINR(row.collected) },
  {
    key: 'pending',
    label: 'Pending entries',
    align: 'right',
    render: (row) =>
      row.pending ? (
        <StatusChip $tone="warning">{formatCompactINR(row.pending)}</StatusChip>
      ) : (
        <CellSecondary>None</CellSecondary>
      ),
  },
];

const marketingColumns = [
  {
    key: 'name',
    label: 'Campaign',
    render: (row) => (
      <div>
        <CellPrimary>{row.name}</CellPrimary>
        <CellSecondary>
          {row.id} · {row.channel}
        </CellSecondary>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusChip $tone={statusTone(row.status)}>{row.status}</StatusChip>,
  },
  { key: 'spend', label: 'Spend', align: 'right', render: (row) => formatCompactINR(row.spend) },
  {
    key: 'utilisation',
    label: 'Budget used',
    align: 'right',
    render: (row) => `${row.utilisation.toFixed(0)}%`,
  },
  { key: 'leads', label: 'Leads', align: 'right', render: (row) => formatNumber(row.leads) },
  { key: 'qualified', label: 'Qualified', align: 'right', render: (row) => formatNumber(row.qualified) },
  {
    key: 'quoteValue',
    label: 'Quote value',
    align: 'right',
    render: (row) => (
      <div>
        <span>{formatCompactINR(row.quoteValue)}</span>
        <CellSecondary>
          {row.quoteCount} quotation{row.quoteCount === 1 ? '' : 's'}
        </CellSecondary>
      </div>
    ),
  },
  { key: 'orderCount', label: 'Orders', align: 'right', render: (row) => formatNumber(row.orderCount) },
  {
    key: 'revenue',
    label: 'Confirmed revenue',
    align: 'right',
    render: (row) => <CellStrong>{formatCompactINR(row.revenue)}</CellStrong>,
  },
  {
    key: 'returnMultiple',
    label: 'Return',
    align: 'right',
    render: (row) =>
      row.spend ? (
        <StatusChip $tone={row.returnMultiple >= 5 ? 'success' : row.returnMultiple > 0 ? 'info' : 'neutral'}>
          {row.returnMultiple.toFixed(1)}x
        </StatusChip>
      ) : (
        <CellSecondary>No spend</CellSecondary>
      ),
  },
];

const COLUMNS = {
  sales: salesColumns,
  leads: leadColumns,
  production: productionColumns,
  inventory: inventoryColumns,
  employees: employeeColumns,
  finance: financeColumns,
  marketing: marketingColumns,
};

const scheduleValidation = Yup.object({
  name: Yup.string().trim().required('Name the report schedule'),
  recipients: Yup.string().trim().required('Add at least one recipient'),
  cadence: Yup.string().required(),
  format: Yup.string().required(),
});

export default function ReportsPage() {
  const leads = useDemoStore((state) => state.leads);
  const quotes = useDemoStore((state) => state.quotes);
  const orders = useDemoStore((state) => state.orders);
  const production = useDemoStore((state) => state.production);
  const artwork = useDemoStore((state) => state.artwork);
  const inventory = useDemoStore((state) => state.inventory);
  const stockMovements = useDemoStore((state) => state.stockMovements);
  const suppliers = useDemoStore((state) => state.suppliers);
  const purchaseOrders = useDemoStore((state) => state.purchaseOrders);
  const employees = useDemoStore((state) => state.employees);
  const leaves = useDemoStore((state) => state.leaves);
  const employeeTasks = useDemoStore((state) => state.employeeTasks);
  const salaryRecords = useDemoStore((state) => state.salaryRecords);
  const invoices = useDemoStore((state) => state.invoices);
  const financeTransactions = useDemoStore((state) => state.financeTransactions);
  const campaigns = useDemoStore((state) => state.campaigns);
  const campaignExpenses = useDemoStore((state) => state.campaignExpenses);
  const reportSchedules = useDemoStore((state) => state.reportSchedules);
  const toggleReportSchedule = useDemoStore((state) => state.toggleReportSchedule);
  const saveReportSchedule = useDemoStore((state) => state.saveReportSchedule);
  const deleteReportSchedule = useDemoStore((state) => state.deleteReportSchedule);

  const [rangeValue, setRangeValue] = useState('90d');
  const [activeId, setActiveId] = useState('sales');
  const [query, setQuery] = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleEditId, setScheduleEditId] = useState(null);
  const [scheduleDeleteId, setScheduleDeleteId] = useState(null);

  const rangeMeta = RANGES.find((item) => item.value === rangeValue) || RANGES[1];
  const editingSchedule = reportSchedules.find((item) => item.id === scheduleEditId) || null;
  const deletingSchedule = reportSchedules.find((item) => item.id === scheduleDeleteId) || null;

  const asOf = useMemo(() => {
    const dates = [
      ...financeTransactions.map((item) => item.date),
      ...orders.map((item) => item.createdAt),
      ...invoices.map((item) => item.issued),
      ...leads.map((item) => item.createdAt),
    ]
      .filter(Boolean)
      .map((value) => String(value).slice(0, 10))
      .sort();
    return dates[dates.length - 1] || todayISO();
  }, [financeTransactions, orders, invoices, leads]);

  const cutoff = isoMinusDays(asOf, rangeMeta.days);
  const windowScope = `Window · ${rangeMeta.label}`;
  const snapshotScope = 'Snapshot · all records';
  const dueSoonLimit = isoPlusDays(asOf, 7);

  const reports = useMemo(() => {
    /* ------------------------------- Sales ------------------------------- */
    const windowOrders = orders.filter((order) => inRange(order.createdAt, cutoff, asOf));
    const windowInvoices = invoices.filter((invoice) => inRange(invoice.issued, cutoff, asOf));
    const customerNames = [
      ...new Set([...windowOrders.map((order) => order.customer), ...windowInvoices.map((invoice) => invoice.customer)]),
    ];
    const salesRows = customerNames
      .map((customer) => {
        const customerOrders = windowOrders.filter((order) => order.customer === customer);
        const customerInvoices = windowInvoices.filter((invoice) => invoice.customer === customer);
        const orderValue = sum(customerOrders, (order) => order.value);
        const invoiced = sum(customerInvoices, (invoice) => invoice.amount);
        const collected = sum(customerInvoices, (invoice) => invoice.paid);
        return {
          id: customer,
          customer,
          orders: customerOrders.length,
          orderValue,
          invoiced,
          collected,
          outstanding: invoiced - collected,
          realisation: invoiced ? (collected / invoiced) * 100 : null,
        };
      })
      .sort((a, b) => b.orderValue - a.orderValue);
    const salesTotals = {
      orders: windowOrders.length,
      orderValue: sum(windowOrders, (order) => order.value),
      invoiced: sum(windowInvoices, (invoice) => invoice.amount),
      collected: sum(windowInvoices, (invoice) => invoice.paid),
    };
    salesTotals.outstanding = salesTotals.invoiced - salesTotals.collected;

    /* ------------------------------- Leads ------------------------------- */
    const windowLeads = leads.filter((lead) => inRange(lead.createdAt, cutoff, asOf));
    const leadRows = [...new Set(windowLeads.map((lead) => lead.source))]
      .map((source) => {
        const group = windowLeads.filter((lead) => lead.source === source);
        const qualified = group.filter((lead) => QUALIFIED_STAGES.includes(lead.stage)).length;
        const won = group.filter((lead) => lead.stage === 'Won').length;
        const lost = group.filter((lead) => lead.stage === 'Lost').length;
        return {
          id: source,
          source,
          leads: group.length,
          qualified,
          won,
          lost,
          winRate: group.length ? (won / group.length) * 100 : 0,
          pipeline: sum(
            group.filter((lead) => !OPEN_EXCLUDED.includes(lead.stage)),
            (lead) => lead.value
          ),
          wonValue: sum(
            group.filter((lead) => lead.stage === 'Won'),
            (lead) => lead.value
          ),
        };
      })
      .sort((a, b) => b.leads - a.leads);
    const leadTotals = {
      leads: windowLeads.length,
      qualified: windowLeads.filter((lead) => QUALIFIED_STAGES.includes(lead.stage)).length,
      won: windowLeads.filter((lead) => lead.stage === 'Won').length,
      pipeline: sum(
        windowLeads.filter((lead) => !OPEN_EXCLUDED.includes(lead.stage)),
        (lead) => lead.value
      ),
      wonValue: sum(
        windowLeads.filter((lead) => lead.stage === 'Won'),
        (lead) => lead.value
      ),
    };

    /* ----------------------------- Production ---------------------------- */
    const productionRows = production
      .map((job) => {
        const checklist = job.checklist || [];
        return {
          ...job,
          overdue: job.stage !== 'Dispatch' && String(job.due) < asOf,
          dueSoon: job.stage !== 'Dispatch' && String(job.due) >= asOf && String(job.due) <= dueSoonLimit,
          checklistDone: checklist.filter((item) => item.done).length,
          checklistTotal: checklist.length,
        };
      })
      .sort(
        (a, b) =>
          Number(b.overdue) - Number(a.overdue) || String(a.due).localeCompare(String(b.due))
      );
    const productionTotals = {
      jobs: productionRows.length,
      overdue: productionRows.filter((job) => job.overdue).length,
      dueSoon: productionRows.filter((job) => job.dueSoon).length,
      quantity: sum(productionRows, (job) => job.quantity),
      checklistDone: sum(productionRows, (job) => job.checklistDone),
      checklistTotal: sum(productionRows, (job) => job.checklistTotal),
    };

    /* ------------------------------ Inventory ---------------------------- */
    const windowMovements = stockMovements.filter((move) => inRange(move.date, cutoff, asOf));
    const inventoryRows = inventory
      .map((item) => {
        const health = stockHealth(item);
        return {
          ...item,
          health,
          available: health.available,
          value: item.onHand * item.unitCost,
          moves: windowMovements.filter((move) => move.skuId === item.id).length,
        };
      })
      .sort((a, b) => {
        const rank = { 'Out of stock': 0, 'Low stock': 1, Watch: 2, Healthy: 3 };
        return rank[a.health.label] - rank[b.health.label] || a.name.localeCompare(b.name);
      });
    const inventoryTotals = {
      skus: inventoryRows.length,
      stockValue: sum(inventoryRows, (item) => item.value),
      lowCount: inventoryRows.filter((item) => ['Low stock', 'Out of stock'].includes(item.health.label)).length,
      movements: windowMovements.length,
      allocated: sum(inventoryRows, (item) => item.allocated),
    };

    /* ----------------------------- Employees ----------------------------- */
    const employeeRows = employees
      .map((employee) => {
        const salary = salaryRecords
          .filter((record) => record.employeeId === employee.id)
          .sort((a, b) => String(b.month).localeCompare(String(a.month)))[0];
        const joined = new Date(`${employee.joined}T00:00:00Z`);
        const tenure = (new Date(`${asOf}T00:00:00Z`) - joined) / 31557600000;
        return {
          ...employee,
          tenure: Number.isFinite(tenure) ? tenure : 0,
          openTasks: employeeTasks.filter(
            (task) => (task.employeeId === employee.id || task.employee === employee.name) && task.status !== 'Done'
          ).length,
          leaveDays: sum(
            leaves.filter((leave) => leave.employee === employee.name && leave.status === 'Approved'),
            (leave) => leave.days
          ),
          salaryLabel: salary ? `${monthLabel(salary.month)} · ${formatCompactINR(salary.net)}` : '—',
          salaryMonth: salary ? salary.month : '',
          netSalary: salary ? salary.net : 0,
        };
      })
      .sort((a, b) => a.department.localeCompare(b.department) || a.name.localeCompare(b.name));
    const employeeTotals = {
      headcount: employeeRows.length,
      present: employeeRows.filter((employee) => employee.status === 'Present').length,
      away: employeeRows.filter((employee) => employee.status !== 'Present').length,
      openTasks: sum(employeeRows, (employee) => employee.openTasks),
      payroll: sum(employeeRows, (employee) => employee.netSalary),
    };

    /* ------------------------------ Finance ------------------------------ */
    const windowTransactions = financeTransactions.filter((entry) => inRange(entry.date, cutoff, asOf));
    const monthKeys = [...new Set(windowTransactions.map((entry) => String(entry.date).slice(0, 7)))].sort();
    const financeRows = monthKeys.map((month) => {
      const entries = windowTransactions.filter((entry) => String(entry.date).startsWith(month));
      const cleared = entries.filter((entry) => entry.status === 'Cleared');
      const monthInvoices = invoices.filter((invoice) => String(invoice.issued).startsWith(month));
      const receipts = sum(
        cleared.filter((entry) => entry.type === 'Income'),
        (entry) => entry.amount
      );
      const costs = sum(
        cleared.filter((entry) => entry.type === 'Expense'),
        (entry) => entry.amount
      );
      return {
        id: month,
        month,
        monthLabel: monthLabel(month),
        receipts,
        costs,
        net: receipts - costs,
        invoiced: sum(monthInvoices, (invoice) => invoice.amount),
        collected: sum(monthInvoices, (invoice) => invoice.paid),
        pending: sum(
          entries.filter((entry) => entry.status !== 'Cleared'),
          (entry) => entry.amount
        ),
      };
    });
    const receivables = sum(
      invoices.filter((invoice) => invoice.status !== 'Paid'),
      (invoice) => invoice.amount - invoice.paid
    );
    const financeTotals = {
      receipts: sum(financeRows, (row) => row.receipts),
      costs: sum(financeRows, (row) => row.costs),
      invoiced: sum(financeRows, (row) => row.invoiced),
      collected: sum(financeRows, (row) => row.collected),
      net: sum(financeRows, (row) => row.receipts) - sum(financeRows, (row) => row.costs),
      receivables,
    };

    /* ----------------------------- Marketing ----------------------------- */
    const marketingRows = campaigns
      .map((campaign) => {
        const campaignSpend = sum(
          campaignExpenses.filter((expense) => expense.campaignId === campaign.id),
          (expense) => expense.amount
        );
        const campaignLeads = leads.filter((lead) => lead.campaignId === campaign.id);
        const campaignQuotes = quotes.filter(
          (quote) => quote.campaignId === campaign.id && quote.status !== 'Draft'
        );
        const campaignOrders = orders.filter((order) => order.campaignId === campaign.id);
        const revenue = sum(campaignOrders, (order) => order.value);
        return {
          ...campaign,
          spend: campaignSpend,
          utilisation: campaign.budget ? (campaignSpend / campaign.budget) * 100 : 0,
          leads: campaignLeads.length,
          qualified: campaignLeads.filter((lead) => QUALIFIED_STAGES.includes(lead.stage)).length,
          quoteCount: campaignQuotes.length,
          quoteValue: sum(campaignQuotes, (quote) => quote.total),
          orderCount: campaignOrders.length,
          revenue,
          returnMultiple: campaignSpend ? revenue / campaignSpend : 0,
        };
      })
      .sort((a, b) => b.spend - a.spend);
    const marketingTotals = {
      spend: sum(marketingRows, (campaign) => campaign.spend),
      budget: sum(marketingRows, (campaign) => campaign.budget),
      leads: sum(marketingRows, (campaign) => campaign.leads),
      qualified: sum(marketingRows, (campaign) => campaign.qualified),
      quoteValue: sum(marketingRows, (campaign) => campaign.quoteValue),
      orders: sum(marketingRows, (campaign) => campaign.orderCount),
      revenue: sum(marketingRows, (campaign) => campaign.revenue),
    };
    marketingTotals.returnMultiple = marketingTotals.spend
      ? marketingTotals.revenue / marketingTotals.spend
      : 0;

    const list = [];

    list.push({
      id: 'sales',
      category: 'Sales',
      title: 'Sales & order book',
      description: 'Bookings, invoicing and collections reconciled by customer.',
      scope: windowScope,
      filename: `stark-packmate-sales-report-${rangeMeta.value}.csv`,
      headers: [
        'Customer',
        'Orders',
        'Order value (INR)',
        'Invoiced (INR)',
        'Collected (INR)',
        'Outstanding (INR)',
        'Realisation %',
      ],
      csvRows: salesRows.map((row) => [
        row.customer,
        row.orders,
        row.orderValue,
        row.invoiced,
        row.collected,
        row.outstanding,
        row.realisation === null ? '' : row.realisation.toFixed(1),
      ]),
      rows: salesRows,
      metrics: salesTotals,
      headline: formatCompactINR(salesTotals.orderValue),
      headlineHint: `${formatNumber(salesTotals.orders)} orders booked · ${formatCompactINR(
        salesTotals.outstanding
      )} outstanding`,
      stats: [
        { label: 'Orders booked', value: formatNumber(salesTotals.orders) },
        { label: 'Order value', value: formatCompactINR(salesTotals.orderValue) },
        { label: 'Invoiced', value: formatCompactINR(salesTotals.invoiced) },
        { label: 'Collected', value: formatCompactINR(salesTotals.collected) },
        { label: 'Outstanding', value: formatCompactINR(salesTotals.outstanding) },
      ],
      note:
        'Order value is the confirmed order book in the selected window. Invoiced, collected and outstanding amounts come from the finance ledger and are reconciled by customer, not by order line.',
    });

    list.push({
      id: 'leads',
      category: 'Leads',
      title: 'Lead source performance',
      description: 'Enquiries, qualification and win rates grouped by acquisition source.',
      scope: windowScope,
      filename: `stark-packmate-lead-report-${rangeMeta.value}.csv`,
      headers: ['Source', 'Leads', 'Qualified', 'Won', 'Lost', 'Win rate %', 'Open pipeline (INR)', 'Won value (INR)'],
      csvRows: leadRows.map((row) => [
        row.source,
        row.leads,
        row.qualified,
        row.won,
        row.lost,
        row.winRate.toFixed(1),
        row.pipeline,
        row.wonValue,
      ]),
      rows: leadRows,
      metrics: leadTotals,
      headline: formatNumber(leadTotals.leads),
      headlineHint: `${formatNumber(leadTotals.qualified)} qualified · ${formatNumber(
        leadTotals.won
      )} won · ${formatCompactINR(leadTotals.pipeline)} open`,
      stats: [
        { label: 'Leads', value: formatNumber(leadTotals.leads) },
        { label: 'Qualified', value: formatNumber(leadTotals.qualified) },
        { label: 'Won', value: formatNumber(leadTotals.won) },
        { label: 'Open pipeline', value: formatCompactINR(leadTotals.pipeline) },
        { label: 'Won value', value: formatCompactINR(leadTotals.wonValue) },
      ],
      note:
        'Win rate is won leads divided by all leads captured in the window. Open pipeline excludes Won and Lost opportunities. Pipeline value is an opportunity estimate, not booked revenue.',
    });

    list.push({
      id: 'production',
      category: 'Production',
      title: 'Production & prepress',
      description: 'Live job cards, stage progress, deadlines and checklist completion.',
      scope: snapshotScope,
      filename: 'stark-packmate-production-report.csv',
      headers: [
        'Job',
        'Order',
        'Customer',
        'Product',
        'Stage',
        'Priority',
        'Quantity',
        'Deadline',
        'Progress %',
        'Checklist done',
        'Checklist total',
        'Deadline state',
      ],
      csvRows: productionRows.map((row) => [
        row.id,
        row.orderId,
        row.customer,
        row.product,
        row.stage,
        row.priority,
        row.quantity,
        row.due,
        row.progress,
        row.checklistDone,
        row.checklistTotal,
        row.overdue ? 'Overdue' : row.dueSoon ? 'Due soon' : 'Scheduled',
      ]),
      rows: productionRows,
      metrics: productionTotals,
      headline: `${formatNumber(productionTotals.jobs)} jobs`,
      headlineHint: `${formatNumber(productionTotals.overdue)} overdue · ${formatNumber(
        productionTotals.dueSoon
      )} due within 7 days`,
      stats: [
        { label: 'Jobs on floor', value: formatNumber(productionTotals.jobs) },
        { label: 'Overdue', value: formatNumber(productionTotals.overdue) },
        { label: 'Due next 7 days', value: formatNumber(productionTotals.dueSoon) },
        { label: 'Units scheduled', value: formatNumber(productionTotals.quantity) },
        {
          label: 'Checklist verified',
          value: `${formatNumber(productionTotals.checklistDone)}/${formatNumber(productionTotals.checklistTotal)}`,
        },
      ],
      note:
        'A snapshot of the plant floor as of the report date. A job is overdue when its deadline has passed and it has not reached Dispatch. Checklist counts are taken from each live job card.',
    });

    list.push({
      id: 'inventory',
      category: 'Inventory',
      title: 'Inventory valuation',
      description: 'Stock on hand, availability, reorder exposure and movement activity.',
      scope: snapshotScope,
      filename: `stark-packmate-inventory-report-${rangeMeta.value}.csv`,
      headers: [
        'SKU',
        'Item',
        'Type',
        'Category',
        'On hand',
        'Allocated',
        'Available',
        'Reorder',
        'Unit cost (INR)',
        'Stock value (INR)',
        'Health',
        'Movements in window',
      ],
      csvRows: inventoryRows.map((row) => [
        row.id,
        row.name,
        row.itemType,
        row.category,
        row.onHand,
        row.allocated,
        row.available,
        row.reorder,
        row.unitCost,
        row.value,
        row.health.label,
        row.moves,
      ]),
      rows: inventoryRows,
      metrics: inventoryTotals,
      headline: formatCompactINR(inventoryTotals.stockValue),
      headlineHint: `${formatNumber(inventoryTotals.skus)} SKUs · ${formatNumber(
        inventoryTotals.lowCount
      )} low or out of stock`,
      stats: [
        { label: 'SKUs tracked', value: formatNumber(inventoryTotals.skus) },
        { label: 'Stock value', value: formatCompactINR(inventoryTotals.stockValue) },
        { label: 'Low or out', value: formatNumber(inventoryTotals.lowCount) },
        { label: 'Units allocated', value: formatNumber(inventoryTotals.allocated) },
        { label: 'Movements in window', value: formatNumber(inventoryTotals.movements) },
      ],
      note:
        'Valuation is on-hand quantity multiplied by unit cost. Available stock is on hand minus allocated. Low stock follows the reorder level on each SKU; movement counts use stock-in and consumption entries in the selected window.',
    });

    list.push({
      id: 'employees',
      category: 'Employees',
      title: 'Employee & payroll',
      description: 'Headcount, attendance position, workload, leave and latest salary.',
      scope: snapshotScope,
      filename: 'stark-packmate-employee-report.csv',
      headers: [
        'Employee',
        'Department',
        'Role',
        'Shift',
        'Status',
        'Joined',
        'Tenure (years)',
        'Open tasks',
        'Approved leave days',
        'Latest salary month',
        'Latest net pay (INR)',
      ],
      csvRows: employeeRows.map((row) => [
        row.name,
        row.department,
        row.role,
        row.shift,
        row.status,
        row.joined,
        row.tenure.toFixed(1),
        row.openTasks,
        row.leaveDays,
        row.salaryMonth,
        row.netSalary,
      ]),
      rows: employeeRows,
      metrics: employeeTotals,
      headline: `${formatNumber(employeeTotals.headcount)} people`,
      headlineHint: `${formatNumber(employeeTotals.present)} present · ${formatNumber(
        employeeTotals.openTasks
      )} open tasks · ${formatCompactINR(employeeTotals.payroll)} payroll`,
      stats: [
        { label: 'Headcount', value: formatNumber(employeeTotals.headcount) },
        { label: 'Present', value: formatNumber(employeeTotals.present) },
        { label: 'Leave / remote', value: formatNumber(employeeTotals.away) },
        { label: 'Open tasks', value: formatNumber(employeeTotals.openTasks) },
        { label: 'Latest net payroll', value: formatCompactINR(employeeTotals.payroll) },
      ],
      note:
        'Headcount and attendance status come from employee records. Approved leave totals use approved requests on file, and salary shows the most recent pay record per employee, whether processed or pending.',
    });

    list.push({
      id: 'finance',
      category: 'Finance',
      title: 'Cash & receivables',
      description: 'Monthly receipts, costs, net cash and invoicing performance.',
      scope: windowScope,
      filename: `stark-packmate-finance-report-${rangeMeta.value}.csv`,
      headers: [
        'Month',
        'Receipts (INR)',
        'Costs (INR)',
        'Net cash (INR)',
        'Invoiced (INR)',
        'Collected (INR)',
        'Pending entries (INR)',
      ],
      csvRows: financeRows.map((row) => [
        row.monthLabel,
        row.receipts,
        row.costs,
        row.net,
        row.invoiced,
        row.collected,
        row.pending,
      ]),
      rows: financeRows,
      metrics: financeTotals,
      headline: formatCompactINR(financeTotals.net),
      headlineHint: `${formatCompactINR(financeTotals.receipts)} in · ${formatCompactINR(
        financeTotals.costs
      )} out · ${formatCompactINR(financeTotals.receivables)} receivable`,
      stats: [
        { label: 'Receipts', value: formatCompactINR(financeTotals.receipts) },
        { label: 'Costs', value: formatCompactINR(financeTotals.costs) },
        { label: 'Net cash', value: formatCompactINR(financeTotals.net) },
        { label: 'Invoiced', value: formatCompactINR(financeTotals.invoiced) },
        { label: 'Receivables', value: formatCompactINR(financeTotals.receivables) },
      ],
      note:
        'Cash figures count cleared transactions only; pending entries are listed separately and excluded from net cash. Receivables are unpaid invoice balances as of the report date.',
    });

    list.push({
      id: 'marketing',
      category: 'Marketing',
      title: 'Marketing & agency ROI',
      description: 'Campaign spend against qualified pipeline and confirmed order revenue.',
      scope: 'To date · attributed records',
      filename: 'stark-packmate-marketing-report.csv',
      headers: [
        'Campaign',
        'Channel',
        'Status',
        'Spend (INR)',
        'Budget (INR)',
        'Budget used %',
        'Leads',
        'Qualified',
        'Quotations',
        'Quotation value (INR)',
        'Orders',
        'Confirmed revenue (INR)',
        'Return multiple',
      ],
      csvRows: marketingRows.map((row) => [
        row.name,
        row.channel,
        row.status,
        row.spend,
        row.budget,
        row.utilisation.toFixed(1),
        row.leads,
        row.qualified,
        row.quoteCount,
        row.quoteValue,
        row.orderCount,
        row.revenue,
        row.returnMultiple.toFixed(2),
      ]),
      rows: marketingRows,
      metrics: marketingTotals,
      headline: `${marketingTotals.returnMultiple.toFixed(1)}x`,
      headlineHint: `${formatCompactINR(marketingTotals.spend)} spend · ${formatCompactINR(
        marketingTotals.revenue
      )} confirmed revenue`,
      stats: [
        { label: 'Logged spend', value: formatCompactINR(marketingTotals.spend) },
        { label: 'Budget', value: formatCompactINR(marketingTotals.budget) },
        { label: 'Leads', value: formatNumber(marketingTotals.leads) },
        { label: 'Qualified', value: formatNumber(marketingTotals.qualified) },
        { label: 'Quotation value', value: formatCompactINR(marketingTotals.quoteValue) },
        { label: 'Confirmed revenue', value: formatCompactINR(marketingTotals.revenue) },
      ],
      note:
        'Return uses confirmed order revenue only. Quotation value is pipeline and is never counted as revenue. Attribution follows the campaign links stored on leads, quotations and orders; this workspace does not connect to live ad accounts.',
    });

    return list;
  }, [
    orders,
    invoices,
    leads,
    production,
    stockMovements,
    inventory,
    employees,
    salaryRecords,
    employeeTasks,
    leaves,
    financeTransactions,
    campaigns,
    campaignExpenses,
    quotes,
    cutoff,
    asOf,
    dueSoonLimit,
    rangeMeta.value,
    windowScope,
  ]);

  const active = reports.find((report) => report.id === activeId) || reports[0];

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return active.rows;
    return active.rows.filter((row) =>
      Object.values(row).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(needle)
      )
    );
  }, [active, query]);

  const salesMetrics = reports.find((report) => report.id === 'sales').metrics;
  const financeMetrics = reports.find((report) => report.id === 'finance').metrics;
  const productionMetrics = reports.find((report) => report.id === 'production').metrics;
  const inventoryMetrics = reports.find((report) => report.id === 'inventory').metrics;

  const exportReport = (report) => {
    downloadCSV(report.filename, report.headers, report.csvRows);
    notify(
      'Report exported',
      `${report.title} · ${formatNumber(report.csvRows.length)} rows downloaded as CSV.`,
      'success'
    );
  };

  const exportBoardPack = () => {
    const rows = [
      ['Reporting window', rangeMeta.label],
      ['Report date', asOf],
      ['Confirmed orders', salesMetrics.orders],
      ['Confirmed order value (INR)', salesMetrics.orderValue],
      ['Invoiced in window (INR)', salesMetrics.invoiced],
      ['Collected in window (INR)', salesMetrics.collected],
      ['Outstanding on window invoices (INR)', salesMetrics.outstanding],
      ['Cash receipts (INR)', financeMetrics.receipts],
      ['Cash costs (INR)', financeMetrics.costs],
      ['Net cash (INR)', financeMetrics.net],
      ['Receivables (INR)', financeMetrics.receivables],
      ['Production jobs on floor', productionMetrics.jobs],
      ['Overdue production jobs', productionMetrics.overdue],
      ['Inventory value (INR)', inventoryMetrics.stockValue],
      ['Low or out-of-stock SKUs', inventoryMetrics.lowCount],
      ['Headcount', reports.find((report) => report.id === 'employees').metrics.headcount],
      [
        'Marketing spend to date (INR)',
        reports.find((report) => report.id === 'marketing').metrics.spend,
      ],
      [
        'Marketing confirmed revenue (INR)',
        reports.find((report) => report.id === 'marketing').metrics.revenue,
      ],
    ];
    downloadCSV('stark-packmate-board-pack.csv', ['Metric', 'Value'], rows);
    notify('Board pack exported', `Summary across all seven reports for the ${rangeMeta.label} view.`, 'success');
  };

  const scheduleInitial = editingSchedule
    ? {
        name: editingSchedule.name,
        recipients: editingSchedule.recipients,
        cadence: editingSchedule.cadence,
        format: editingSchedule.format,
        active: Boolean(editingSchedule.active),
      }
    : {
        name: '',
        recipients: '',
        cadence: 'Weekly · 08:00',
        format: 'Email + CSV',
        active: true,
      };

  const activeSchedules = reportSchedules.filter((item) => item.active).length;

  return (
    <>
      <PageHeaderBar>
        <div>
          <PageHeading>Reports</PageHeading>
          <PageDescription>
            Seven connected reports across sales, leads, production, inventory, people, finance and marketing.
            Choose a window, open a report and export any table as CSV.
          </PageDescription>
        </div>
        <PageActions>
          <Segmented options={RANGES.map(({ value, label }) => ({ value, label }))} value={rangeValue} onChange={setRangeValue} label="Reporting window" />
          <Button $variant="primary" $size="sm" onClick={exportBoardPack}>
            <Download size={14} /> Export board pack
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          {
            label: 'Net cash in window',
            value: formatCompactINR(financeMetrics.net),
            hint: `${formatCompactINR(financeMetrics.receipts)} receipts · cleared entries`,
            tone: financeMetrics.net >= 0 ? 'success' : 'danger',
          },
          {
            label: 'Confirmed order value',
            value: formatCompactINR(salesMetrics.orderValue),
            hint: `${formatNumber(salesMetrics.orders)} orders booked · ${rangeMeta.label}`,
          },
          {
            label: 'Production on time',
            value: `${
              productionMetrics.jobs
                ? (
                    ((productionMetrics.jobs - productionMetrics.overdue) / productionMetrics.jobs) *
                    100
                  ).toFixed(0)
                : 0
            }%`,
            hint: `${formatNumber(productionMetrics.overdue)} of ${formatNumber(
              productionMetrics.jobs
            )} jobs overdue`,
            tone: productionMetrics.overdue ? 'warning' : 'success',
          },
          {
            label: 'Low stock alerts',
            value: formatNumber(inventoryMetrics.lowCount),
            hint: `${formatCompactINR(inventoryMetrics.stockValue)} stock on hand`,
            tone: inventoryMetrics.lowCount ? 'warning' : 'success',
          },
        ]}
      />

      <div style={{ height: 18 }} />

      <CardGrid>
        {reports.map((report) => {
          const Icon = ICONS[report.id];
          const isActive = report.id === active.id;
          return (
            <ReportCard key={report.id} $active={isActive}>
              <CardMain
                type="button"
                onClick={() => {
                  setActiveId(report.id);
                  setQuery('');
                }}
                aria-pressed={isActive}
              >
                <ReportTop>
                  <IconTile>
                    <Icon size={16} />
                  </IconTile>
                  <Tag>{report.category}</Tag>
                </ReportTop>
                <ReportTitle>{report.title}</ReportTitle>
                <CardMetric>{report.headline}</CardMetric>
                <CardHint>{report.headlineHint}</CardHint>
              </CardMain>
              <CardFooter>
                <span>{report.scope}</span>
                <Button
                  $variant="ghost"
                  $size="xs"
                  onClick={() => exportReport(report)}
                  aria-label={`Export ${report.title} CSV`}
                >
                  <Download size={12} /> CSV
                </Button>
              </CardFooter>
            </ReportCard>
          );
        })}
      </CardGrid>

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>{active.title}</PanelTitle>
            <PanelSubtitle>{active.description}</PanelSubtitle>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <StatusChip $tone="neutral">{active.scope}</StatusChip>
            <Button $variant="secondary" $size="sm" onClick={() => exportReport(active)}>
              <Download size={13} /> Export CSV
            </Button>
          </div>
        </PanelHeader>
        <PanelBody>
          <StatStrip>
            {active.stats.map((stat) => (
              <StatCell key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </StatCell>
            ))}
          </StatStrip>
          <Note>
            <Database size={12} />
            <span>{active.note}</span>
          </Note>
          <TableToolbar>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={`Search ${active.category.toLowerCase()} records…`}
              width="260px"
            />
            <span>
              {formatNumber(visibleRows.length)} of {formatNumber(active.rows.length)} rows · report date{' '}
              {formatDate(asOf)}
            </span>
          </TableToolbar>
        </PanelBody>
        <DataTable
          columns={COLUMNS[active.id]}
          rows={visibleRows}
          minWidth={active.id === 'marketing' || active.id === 'inventory' ? '1120px' : '820px'}
          dense
          footer={<span>{active.scope} · generated from the shared demo store</span>}
        />
      </Panel>

      <div style={{ height: 18 }} />

      <Grid $cols="minmax(0, 1.45fr) minmax(0, 1fr)" $colsMd="1fr" $gap="18px">
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Scheduled delivery</PanelTitle>
              <PanelSubtitle>Recurring packs configured for stakeholders</PanelSubtitle>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StatusChip $tone="neutral">{activeSchedules} active</StatusChip>
              <Button
                $variant="secondary"
                $size="xs"
                onClick={() => {
                  setScheduleEditId(null);
                  setScheduleOpen(true);
                }}
              >
                <Plus size={12} /> New schedule
              </Button>
            </div>
          </PanelHeader>
          <PanelBody>
            {reportSchedules.map((schedule) => (
              <ScheduleRow key={schedule.id}>
                <Switch
                  isSelected={schedule.active}
                  onValueChange={(value) => {
                    toggleReportSchedule(schedule.id);
                    notify(
                      value ? 'Schedule activated' : 'Schedule paused',
                      `${schedule.name} is now ${value ? 'active' : 'paused'} in the demo.`,
                      value ? 'success' : 'info'
                    );
                  }}
                  size="sm"
                  color="primary"
                  aria-labelledby={`sched-${schedule.id}`}
                >
                  <span />
                </Switch>
                <ScheduleBody>
                  <strong id={`sched-${schedule.id}`}>{schedule.name}</strong>
                  <span>
                    {schedule.recipients} · {schedule.cadence}
                  </span>
                  <span>
                    <Send size={9} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {schedule.format}
                  </span>
                </ScheduleBody>
                <ScheduleActions>
                  <Button
                    $variant="ghost"
                    $size="xs"
                    title="Send this report now"
                    aria-label={`Run ${schedule.name}`}
                    onClick={() =>
                      notify('Report sent', `${schedule.name} queued for ${schedule.recipients}.`, 'success')
                    }
                  >
                    <Play size={11} />
                  </Button>
                  <Button
                    $variant="ghost"
                    $size="xs"
                    title="Edit schedule"
                    aria-label={`Edit ${schedule.name}`}
                    onClick={() => {
                      setScheduleEditId(schedule.id);
                      setScheduleOpen(true);
                    }}
                  >
                    <Pencil size={11} />
                  </Button>
                  <Button
                    $variant="ghost"
                    $size="xs"
                    title="Delete schedule"
                    aria-label={`Delete schedule ${schedule.id}`}
                    onClick={() => setScheduleDeleteId(schedule.id)}
                  >
                    <Trash2 size={11} />
                  </Button>
                </ScheduleActions>
              </ScheduleRow>
            ))}
            <Note style={{ marginTop: 16, marginBottom: 0 }}>
              <CalendarClock size={12} />
              <span>
                Delivery times follow the company timezone in Settings. Automated sends are simulated in this
                presentation workspace; the schedule records are real store data.
              </span>
            </Note>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Connected data sources</PanelTitle>
              <PanelSubtitle>Every report reads the same demo store</PanelSubtitle>
            </div>
            <Database size={16} style={{ color: colors.muted }} />
          </PanelHeader>
          <PanelBody>
            <CoverageRow>
              <div>
                <strong>CRM &amp; leads</strong>
                <small>Enquiries, follow-ups and attribution</small>
              </div>
              <em>{formatNumber(leads.length)} leads</em>
            </CoverageRow>
            <CoverageRow>
              <div>
                <strong>Quotations &amp; orders</strong>
                <small>Accepted quotes convert into the order book</small>
              </div>
              <em>
                {formatNumber(quotes.length)} / {formatNumber(orders.length)}
              </em>
            </CoverageRow>
            <CoverageRow>
              <div>
                <strong>Production &amp; prepress</strong>
                <small>Job cards, artwork proofs and stage moves</small>
              </div>
              <em>
                {formatNumber(production.length)} jobs · {formatNumber(artwork.length)} artwork
              </em>
            </CoverageRow>
            <CoverageRow>
              <div>
                <strong>Inventory &amp; purchase</strong>
                <small>SKUs, movements, suppliers and purchase orders</small>
              </div>
              <em>
                {formatNumber(inventory.length)} SKUs · {formatNumber(purchaseOrders.length)} POs
              </em>
            </CoverageRow>
            <CoverageRow>
              <div>
                <strong>HR &amp; payroll</strong>
                <small>People, leave, tasks and salary records</small>
              </div>
              <em>
                {formatNumber(employees.length)} people · {formatNumber(salaryRecords.length)} salary lines
              </em>
            </CoverageRow>
            <CoverageRow>
              <div>
                <strong>Finance</strong>
                <small>Ledger entries and customer invoices</small>
              </div>
              <em>
                {formatNumber(financeTransactions.length)} entries · {formatNumber(invoices.length)} invoices
              </em>
            </CoverageRow>
            <CoverageRow>
              <div>
                <strong>Marketing &amp; agency</strong>
                <small>Budgets, spend entries and campaign attribution</small>
              </div>
              <em>
                {formatNumber(campaigns.length)} campaigns · {formatNumber(campaignExpenses.length)} spend rows
              </em>
            </CoverageRow>
            <Note style={{ marginTop: 14, marginBottom: 0 }}>
              <Database size={12} />
              <span>
                {formatNumber(suppliers.length)} active suppliers also feed the inventory report. Figures update
                as soon as records change elsewhere in the workspace — nothing here is a static export.
              </span>
            </Note>
          </PanelBody>
        </Panel>
      </Grid>

      <AppModal
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
          setScheduleEditId(null);
        }}
        title={editingSchedule ? `Edit ${editingSchedule.name}` : 'New report schedule'}
        description="Schedules reference the same live reports shown above and are stored in the shared demo data."
        size="md"
      >
        <Formik
          initialValues={scheduleInitial}
          validationSchema={scheduleValidation}
          enableReinitialize
          onSubmit={(values) => {
            const saved = saveReportSchedule({
              ...values,
              id: editingSchedule ? editingSchedule.id : undefined,
            });
            notify(
              editingSchedule ? 'Schedule updated' : 'Schedule created',
              `${saved.name} · ${saved.cadence} to ${saved.recipients}.`,
              'success'
            );
            setScheduleOpen(false);
            setScheduleEditId(null);
          }}
        >
          <Form>
            <TextField name="name" label="Schedule name" placeholder="Monthly marketing ROI" />
            <div style={{ height: 14 }} />
            <TextField name="recipients" label="Recipients" placeholder="Marketing + agency" />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <SelectField
                name="cadence"
                label="Cadence"
                options={['Daily · 07:00', 'Weekly · 08:00', 'Monthly · 09:00', 'Monthly · 10:00']}
              />
              <SelectField
                name="format"
                label="Format"
                options={['Email + CSV', 'Email + PDF', 'Email + XLSX', 'CSV only']}
              />
            </FormGrid>
            <div style={{ height: 6 }} />
            <SwitchField
              name="active"
              label="Active"
              description="Paused schedules stay on file but do not send."
            />
            <FormActions>
              <Button
                type="button"
                $variant="secondary"
                $size="sm"
                onClick={() => {
                  setScheduleOpen(false);
                  setScheduleEditId(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editingSchedule ? 'Save schedule' : 'Create schedule'} <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <ConfirmDialog
        open={Boolean(deletingSchedule)}
        onClose={() => setScheduleDeleteId(null)}
        onConfirm={() => {
          if (!deletingSchedule) return;
          deleteReportSchedule(deletingSchedule.id);
          notify('Schedule deleted', `${deletingSchedule.name} was removed from report delivery.`, 'success');
        }}
        title="Delete report schedule?"
        message={
          deletingSchedule
            ? `${deletingSchedule.name} will stop sending to ${deletingSchedule.recipients}. Reports themselves are unaffected.`
            : ''
        }
        confirmLabel="Delete schedule"
      />
    </>
  );
}
