'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Download,
  Receipt,
  ArrowRight,
  Send,
  CircleDollarSign,
  TriangleAlert,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Scale,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { customers } from '@/data/admin';
import {
  formatCompactINR,
  formatDate,
  formatINR,
  formatNumber,
  statusTone,
  downloadCSV,
  todayISO,
  plusDaysISO,
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
import { TextField, SelectField, FormGrid, FormActions } from '@/components/ui/FormFields';
import { ComboChart, DonutChart } from '@/components/ui/charts';
import MiniStats from '@/components/dashboard/MiniStats';

const AgeBar = styled.div`
  display: flex;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  margin: 10px 0 8px;
  background: ${colors.lineSoft};

  span {
    height: 100%;
  }
`;

const AgeLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: ${colors.muted};
  }

  i {
    width: 7px;
    height: 7px;
    border-radius: 2px;
    display: inline-block;
  }

  em {
    font-style: normal;
    font-weight: 700;
    color: ${colors.ink};
  }
`;

const InvoiceHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 24px;
    font-weight: 500;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 11.5px;
    color: ${colors.muted};
  }
`;

const entryCategories = [
  'Customer receipt',
  'Order revenue',
  'Raw material',
  'Payroll',
  'Marketing',
  'Logistics',
  'Utilities',
  'Maintenance',
  'Packaging',
  'Other',
];

const invoiceValidation = Yup.object({
  customerId: Yup.string().required('Select a customer'),
  issued: Yup.string().required('Issue date is required'),
  due: Yup.string().required('Due date is required'),
  amount: Yup.number().positive('Enter an invoice value').required('Amount is required'),
});

const entryValidation = Yup.object({
  date: Yup.string().required('Date is required'),
  type: Yup.string().required(),
  category: Yup.string().required(),
  description: Yup.string().trim().required('Add a description'),
  amount: Yup.number().positive('Enter an amount greater than zero').required('Amount is required'),
});

const paymentValidation = Yup.object({
  invoiceId: Yup.string().required(),
  amount: Yup.number().positive('Enter an amount greater than zero').required('Amount is required'),
  method: Yup.string().required(),
});

const monthLabel = (key) => formatDate(`${key}-01`, { day: undefined, month: 'long', year: 'numeric' });
const chartLabel = (key) => formatDate(`${key}-01`, { day: undefined, month: 'short', year: '2-digit' });
const signedAmount = (transaction) =>
  `${transaction.type === 'Income' ? '+' : '−'} ${formatINR(transaction.amount)}`;

export default function FinancePage() {
  const invoices = useDemoStore((state) => state.invoices);
  const transactions = useDemoStore((state) => state.financeTransactions);
  const orders = useDemoStore((state) => state.orders);
  const recordPayment = useDemoStore((state) => state.recordPayment);
  const saveInvoice = useDemoStore((state) => state.saveInvoice);
  const deleteInvoice = useDemoStore((state) => state.deleteInvoice);
  const addTransaction = useDemoStore((state) => state.addTransaction);
  const updateTransaction = useDemoStore((state) => state.updateTransaction);
  const deleteTransaction = useDemoStore((state) => state.deleteTransaction);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [entryQuery, setEntryQuery] = useState('');
  const [entryType, setEntryType] = useState('All');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payInvoice, setPayInvoice] = useState(null);
  const [invoiceSelectedId, setInvoiceSelectedId] = useState(null);
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  const [invoiceEditId, setInvoiceEditId] = useState(null);
  const [invoiceDeleteId, setInvoiceDeleteId] = useState(null);
  const [entrySelectedId, setEntrySelectedId] = useState(null);
  const [entryFormOpen, setEntryFormOpen] = useState(false);
  const [entryEditId, setEntryEditId] = useState(null);
  const [entryDeleteId, setEntryDeleteId] = useState(null);

  const selectedInvoice = invoices.find((invoice) => invoice.id === invoiceSelectedId) || null;
  const editingInvoice = invoices.find((invoice) => invoice.id === invoiceEditId) || null;
  const deletingInvoice = invoices.find((invoice) => invoice.id === invoiceDeleteId) || null;
  const selectedEntry = transactions.find((entry) => entry.id === entrySelectedId) || null;
  const editingEntry = transactions.find((entry) => entry.id === entryEditId) || null;
  const deletingEntry = transactions.find((entry) => entry.id === entryDeleteId) || null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((invoice) => {
      if (status !== 'All' && invoice.status !== status) return false;
      if (!q) return true;
      return invoice.id.toLowerCase().includes(q) || invoice.customer.toLowerCase().includes(q);
    });
  }, [invoices, status, query]);

  const filteredEntries = useMemo(() => {
    const q = entryQuery.trim().toLowerCase();
    return transactions.filter((entry) => {
      if (entryType !== 'All' && entry.type !== entryType) return false;
      if (!q) return true;
      return (
        entry.description.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.reference.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q)
      );
    });
  }, [transactions, entryType, entryQuery]);

  const billed = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const collected = invoices.reduce((sum, invoice) => sum + invoice.paid, 0);
  const receivables = billed - collected;
  const overdueInvoices = invoices.filter((invoice) => invoice.status === 'Overdue');
  const overdue = overdueInvoices.reduce((sum, invoice) => sum + (invoice.amount - invoice.paid), 0);
  const orderRevenue = orders.reduce((sum, order) => sum + order.value, 0);

  const cleared = transactions.filter((entry) => entry.status === 'Cleared');
  const receipts = cleared.filter((entry) => entry.type === 'Income').reduce((sum, entry) => sum + entry.amount, 0);
  const costs = cleared.filter((entry) => entry.type === 'Expense').reduce((sum, entry) => sum + entry.amount, 0);
  const netCash = receipts - costs;
  const pendingEntries = transactions.filter((entry) => entry.status === 'Pending').length;

  const monthly = useMemo(() => {
    const map = new Map();
    cleared.forEach((entry) => {
      const key = (entry.date || '').slice(0, 7);
      if (key.length !== 7) return;
      const row = map.get(key) || { key, income: 0, expense: 0, count: 0 };
      row[entry.type === 'Income' ? 'income' : 'expense'] += entry.amount;
      row.count += 1;
      map.set(key, row);
    });
    return [...map.values()]
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6)
      .map((row) => ({
        ...row,
        month: chartLabel(row.key),
        incomeL: Math.round((row.income / 100000) * 10) / 10,
        expenseL: Math.round((row.expense / 100000) * 10) / 10,
        net: row.income - row.expense,
      }));
  }, [cleared]);

  const reportRows = useMemo(
    () =>
      monthly
        .slice()
        .reverse()
        .map((row) => ({
          key: row.key,
          month: monthLabel(row.key),
          receipts: row.income,
          costs: row.expense,
          net: row.net,
          count: row.count,
        })),
    [monthly]
  );

  const expenseMix = useMemo(() => {
    const map = new Map();
    cleared
      .filter((entry) => entry.type === 'Expense')
      .forEach((entry) => {
        map.set(entry.category, (map.get(entry.category) || 0) + entry.amount);
      });
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [cleared]);

  const ageing = useMemo(() => {
    const buckets = [
      { label: 'Current', value: 0, color: colors.forest },
      { label: '1–30 days', value: 0, color: colors.forestSoft },
      { label: '31–60 days', value: 0, color: colors.copperSoft },
      { label: '61–90 days', value: 0, color: colors.warning },
      { label: '90+ days', value: 0, color: colors.danger },
    ];
    const today = new Date(`${todayISO()}T00:00:00`);
    const byCustomer = new Map();
    invoices.forEach((invoice) => {
      const balance = invoice.amount - invoice.paid;
      if (balance <= 0) return;
      const due = new Date(`${invoice.due}T00:00:00`);
      const days = Math.floor((today - due) / 86400000);
      const index = days <= 0 ? 0 : days <= 30 ? 1 : days <= 60 ? 2 : days <= 90 ? 3 : 4;
      buckets[index].value += balance;
      byCustomer.set(invoice.customer, (byCustomer.get(invoice.customer) || 0) + balance);
    });
    const top = [...byCustomer.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    const share = receivables ? Math.round((top.reduce((sum, [, value]) => sum + value, 0) / receivables) * 100) : 0;
    return { buckets, total: buckets.reduce((sum, bucket) => sum + bucket.value, 0), top, share };
  }, [invoices, receivables]);

  const invoiceColumns = [
    {
      key: 'id',
      label: 'Invoice',
      width: '19%',
      render: (invoice) => (
        <>
          <CellPrimary>{invoice.id}</CellPrimary>
          <CellSecondary>Issued {formatDate(invoice.issued)}</CellSecondary>
        </>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (invoice) => <CellPrimary style={{ fontWeight: 600 }}>{invoice.customer}</CellPrimary>,
    },
    {
      key: 'amount',
      label: 'Invoice value',
      align: 'right',
      render: (invoice) => <CellStrong>{formatINR(invoice.amount)}</CellStrong>,
    },
    {
      key: 'paid',
      label: 'Received',
      align: 'right',
      render: (invoice) => (
        <span style={{ color: invoice.paid ? colors.success : colors.faint, fontVariantNumeric: 'tabular-nums' }}>
          {formatINR(invoice.paid)}
        </span>
      ),
    },
    {
      key: 'balance',
      label: 'Balance',
      align: 'right',
      render: (invoice) => <CellStrong>{formatINR(invoice.amount - invoice.paid)}</CellStrong>,
    },
    {
      key: 'due',
      label: 'Due date',
      render: (invoice) => <CellSecondary style={{ marginTop: 0 }}>{formatDate(invoice.due)}</CellSecondary>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (invoice) => <StatusChip $tone={statusTone(invoice.status)}>{invoice.status}</StatusChip>,
    },
  ];

  const entryColumns = [
    {
      key: 'description',
      label: 'Ledger entry',
      width: '34%',
      render: (entry) => (
        <>
          <CellPrimary>{entry.description}</CellPrimary>
          <CellSecondary>
            {entry.id} · {entry.category}
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (entry) => <CellSecondary style={{ marginTop: 0 }}>{formatDate(entry.date)}</CellSecondary>,
    },
    {
      key: 'reference',
      label: 'Reference',
      render: (entry) => <CellSecondary style={{ marginTop: 0, fontFamily: 'monospace' }}>{entry.reference}</CellSecondary>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (entry) => (
        <StatusChip $tone={entry.type === 'Income' ? 'success' : 'neutral'}>{entry.type}</StatusChip>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (entry) => (
        <span
          style={{
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: entry.type === 'Income' ? colors.success : colors.ink,
          }}
        >
          {signedAmount(entry)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (entry) => <StatusChip $tone={statusTone(entry.status)}>{entry.status}</StatusChip>,
    },
  ];

  const reportColumns = [
    {
      key: 'month',
      label: 'Month',
      render: (row) => <CellPrimary style={{ fontWeight: 600 }}>{row.month}</CellPrimary>,
    },
    {
      key: 'receipts',
      label: 'Receipts',
      align: 'right',
      render: (row) => <CellStrong>{formatCompactINR(row.receipts)}</CellStrong>,
    },
    {
      key: 'costs',
      label: 'Costs',
      align: 'right',
      render: (row) => <CellStrong>{formatCompactINR(row.costs)}</CellStrong>,
    },
    {
      key: 'net',
      label: 'Net cash',
      align: 'right',
      render: (row) => (
        <span style={{ fontWeight: 700, color: row.net >= 0 ? colors.success : colors.danger, fontVariantNumeric: 'tabular-nums' }}>
          {row.net >= 0 ? '+' : '−'} {formatINR(Math.abs(row.net))}
        </span>
      ),
    },
    {
      key: 'count',
      label: 'Entries',
      align: 'right',
      render: (row) => <CellSecondary style={{ marginTop: 0 }}>{formatNumber(row.count)}</CellSecondary>,
    },
  ];

  const exportInvoices = () => {
    downloadCSV(
      'stark-packmate-invoices.csv',
      ['Invoice', 'Customer', 'Issued', 'Due', 'Amount', 'Paid', 'Balance', 'Status'],
      filtered.map((invoice) => [
        invoice.id,
        invoice.customer,
        invoice.issued,
        invoice.due,
        invoice.amount,
        invoice.paid,
        invoice.amount - invoice.paid,
        invoice.status,
      ])
    );
    notify('Invoices exported', `${filtered.length} invoices downloaded as CSV.`, 'success');
  };

  const exportLedger = () => {
    downloadCSV(
      'stark-packmate-ledger.csv',
      ['Entry', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Reference', 'Status'],
      filteredEntries.map((entry) => [
        entry.id,
        entry.date,
        entry.type,
        entry.category,
        entry.description,
        entry.amount,
        entry.reference,
        entry.status,
      ])
    );
    notify('Ledger exported', `${filteredEntries.length} entries downloaded as CSV.`, 'success');
  };

  const openPayment = (invoice) => {
    setPayInvoice(invoice);
    setPaymentOpen(true);
    setInvoiceSelectedId(null);
  };

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Finance</PageHeading>
          <PageDescription>
            Invoiced revenue, collections, receivables ageing and the recorded cash ledger — the
            money picture behind the plant.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="light" $size="sm" onClick={exportLedger}>
            <Download size={14} /> Export ledger
          </Button>
          <Button
            $variant="light"
            $size="sm"
            onClick={() => {
              setPayInvoice(invoices.find((invoice) => invoice.status !== 'Paid') || invoices[0]);
              setPaymentOpen(true);
            }}
          >
            <CircleDollarSign size={14} /> Record payment
          </Button>
          <Button $variant="primary" $size="sm" onClick={() => setEntryFormOpen(true)}>
            <Plus size={14} /> New entry
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Invoiced', value: formatCompactINR(billed), hint: `${invoices.length} invoices raised` },
          {
            label: 'Collected',
            value: formatCompactINR(collected),
            hint: billed ? `${Math.round((collected / billed) * 100)}% of billings` : 'No invoices yet',
          },
          {
            label: 'Outstanding',
            value: formatCompactINR(receivables),
            hint: `${overdueInvoices.length} invoices overdue`,
            tone: overdueInvoices.length ? 'warning' : undefined,
          },
          { label: 'Order revenue', value: formatCompactINR(orderRevenue), hint: `${orders.length} orders booked` },
          { label: 'Recorded costs', value: formatCompactINR(costs), hint: 'Cleared ledger expenses' },
          {
            label: 'Net cash',
            value: formatCompactINR(netCash),
            hint: 'Receipts less cleared costs',
            tone: netCash >= 0 ? undefined : 'danger',
          },
        ]}
      />

      <div style={{ height: 18 }} />

      <Grid $cols="minmax(0, 1.5fr) minmax(0, 1fr)" $colsMd="1fr" $gap="18px">
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Cash in against recorded costs</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                ₹ lakh per month · cleared ledger entries
              </div>
            </div>
            <StatusChip $tone={netCash >= 0 ? 'success' : 'warning'}>
              <TrendingUp size={10} /> {netCash >= 0 ? 'Net positive' : 'Net outflow'}
            </StatusChip>
          </PanelHeader>
          <PanelBody>
            <ComboChart
              data={monthly}
              bars={[{ key: 'incomeL', label: 'Receipts', color: colors.forest }]}
              lines={[{ key: 'expenseL', label: 'Costs', color: colors.copper }]}
              height={254}
              formatter={(value) => `₹${value}L`}
            />
          </PanelBody>
          <PanelFooter>
            <span style={{ fontSize: 10.5, color: colors.faint }}>
              {pendingEntries
                ? `${pendingEntries} pending ${pendingEntries === 1 ? 'entry is' : 'entries are'} excluded from these totals until cleared.`
                : 'Receipts are customer payments; costs are cleared expense entries.'}
            </span>
          </PanelFooter>
        </Panel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Expense mix</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Cleared costs by category
              </div>
            </div>
          </PanelHeader>
          <PanelBody>
            <DonutChart
              data={expenseMix}
              height={190}
              centerValue={formatCompactINR(costs)}
              centerLabel="Cleared costs"
              formatter={formatCompactINR}
            />
          </PanelBody>
        </Panel>
      </Grid>

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Invoices &amp; collections</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filtered.length} of {invoices.length} invoices
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search invoice or customer…" />
            <Button $variant="light" $size="xs" onClick={exportInvoices}>
              <Download size={13} /> CSV
            </Button>
            <Button $variant="primary" $size="xs" onClick={() => setInvoiceFormOpen(true)}>
              <Plus size={13} /> New invoice
            </Button>
          </Toolbar>
        </PanelHeader>
        <div style={{ padding: '12px 16px 0' }}>
          <FilterChips
            options={['All', 'Sent', 'Part paid', 'Paid', 'Overdue'].map((name) => ({
              value: name,
              label: name === 'All' ? 'All invoices' : name,
              count: name === 'All' ? invoices.length : invoices.filter((invoice) => invoice.status === name).length,
            }))}
            value={status}
            onChange={setStatus}
          />
        </div>
        <PanelBody $flush>
          <DataTable
            columns={invoiceColumns}
            rows={filtered}
            onRowClick={(invoice) => setInvoiceSelectedId(invoice.id)}
            minWidth="920px"
            footer={<span>{filtered.length} invoices · open a row to record a payment or edit the invoice</span>}
          />
        </PanelBody>
      </Panel>

      <div style={{ height: 18 }} />

      <Grid $cols="minmax(0, 1.05fr) minmax(0, 1fr)" $colsMd="1fr" $gap="18px">
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Receivables ageing</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Outstanding balance of {formatCompactINR(ageing.total)}
              </div>
            </div>
            <Button
              $variant="light"
              $size="xs"
              onClick={() =>
                notify(
                  'Reminders sent',
                  `Payment reminders emailed to ${overdueInvoices.length} overdue accounts.`,
                  'success'
                )
              }
            >
              <Send size={13} /> Remind overdue
            </Button>
          </PanelHeader>
          <PanelBody>
            <AgeBar>
              {ageing.buckets.map((bucket) => (
                <span
                  key={bucket.label}
                  style={{ width: `${ageing.total ? (bucket.value / ageing.total) * 100 : 0}%`, background: bucket.color }}
                  title={`${bucket.label} · ${formatCompactINR(bucket.value)}`}
                />
              ))}
            </AgeBar>
            <AgeLegend>
              {ageing.buckets.map((bucket) => (
                <span key={bucket.label}>
                  <i style={{ background: bucket.color }} />
                  {bucket.label} <em>{formatCompactINR(bucket.value)}</em>
                </span>
              ))}
            </AgeLegend>
            <Divider style={{ margin: '16px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, flexWrap: 'wrap' }}>
              <TriangleAlert size={16} style={{ color: colors.warning }} />
              <p style={{ fontSize: 11.5, color: colors.muted, flex: 1, minWidth: 200 }}>
                {ageing.top.length
                  ? `${ageing.top
                      .slice(0, 2)
                      .map(([name]) => name)
                      .join(' and ')} hold ${ageing.share}% of the outstanding balance. Finance follows up weekly on anything past 60 days.`
                  : 'All invoices are settled — nothing outstanding.'}
              </p>
            </div>
            {ageing.top.length ? (
              <div style={{ marginTop: 12 }}>
                {ageing.top.map(([name, value]) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '8px 0',
                      borderTop: `1px solid ${colors.lineSoft}`,
                      fontSize: 11,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: colors.ink }}>{name}</span>
                    <strong style={{ fontVariantNumeric: 'tabular-nums', color: colors.muted }}>
                      {formatINR(value)}
                    </strong>
                  </div>
                ))}
              </div>
            ) : null}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Monthly report</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Receipts, cleared costs and net cash
              </div>
            </div>
            <Scale size={16} style={{ color: colors.copper }} />
          </PanelHeader>
          <PanelBody $flush>
            <DataTable
              columns={reportColumns}
              rows={reportRows}
              minWidth="520px"
              footer={<span>Booked order revenue of {formatCompactINR(orderRevenue)} is tracked separately from cash receipts.</span>}
            />
          </PanelBody>
        </Panel>
      </Grid>

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Cash ledger</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filteredEntries.length} of {transactions.length} entries
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput value={entryQuery} onChange={setEntryQuery} placeholder="Search description, category or reference…" />
          </Toolbar>
        </PanelHeader>
        <div style={{ padding: '12px 16px 0' }}>
          <FilterChips
            options={['All', 'Income', 'Expense'].map((name) => ({
              value: name,
              label: name === 'All' ? 'All entries' : name,
              count: name === 'All' ? transactions.length : transactions.filter((entry) => entry.type === name).length,
            }))}
            value={entryType}
            onChange={setEntryType}
          />
        </div>
        <PanelBody $flush>
          <DataTable
            columns={entryColumns}
            rows={filteredEntries}
            onRowClick={(entry) => setEntrySelectedId(entry.id)}
            minWidth="900px"
            footer={<span>{filteredEntries.length} entries · select a row to edit or delete the record</span>}
          />
        </PanelBody>
      </Panel>

      <AppModal open={paymentOpen} onClose={() => setPaymentOpen(false)} title="Record payment" size="sm">
        <Formik
          initialValues={{
            invoiceId: payInvoice?.id || invoices[0].id,
            amount: payInvoice ? payInvoice.amount - payInvoice.paid : '',
            method: 'NEFT',
          }}
          validationSchema={paymentValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            recordPayment(values.invoiceId, Number(values.amount));
            const invoice = invoices.find((entry) => entry.id === values.invoiceId);
            notify(
              'Payment recorded',
              `${formatINR(values.amount)} received from ${invoice?.customer} against ${values.invoiceId}.`,
              'success'
            );
            setPaymentOpen(false);
            helpers.resetForm();
          }}
        >
          {({ values }) => {
            const invoice = invoices.find((entry) => entry.id === values.invoiceId);
            return (
              <Form>
                <SelectField
                  name="invoiceId"
                  label="Invoice"
                  options={invoices
                    .filter((entry) => entry.status !== 'Paid')
                    .map((entry) => ({
                      value: entry.id,
                      label: `${entry.id} · ${entry.customer} · ${formatINR(entry.amount - entry.paid)} due`,
                    }))}
                />
                <div style={{ height: 14 }} />
                <TextField name="amount" label="Amount received" type="number" prefix="₹" />
                <div style={{ height: 14 }} />
                <SelectField name="method" label="Payment method" options={['NEFT', 'RTGS', 'UPI', 'Cheque', 'Cash']} />
                {invoice ? (
                  <p style={{ marginTop: 12, fontSize: 11, color: colors.muted }}>
                    Balance after this payment:{' '}
                    <strong>{formatINR(Math.max(0, invoice.amount - invoice.paid - (Number(values.amount) || 0)))}</strong>
                  </p>
                ) : null}
                <FormActions>
                  <Button type="button" $variant="secondary" $size="sm" onClick={() => setPaymentOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" $variant="primary" $size="sm">
                    Post payment <ArrowRight size={14} />
                  </Button>
                </FormActions>
              </Form>
            );
          }}
        </Formik>
      </AppModal>

      <AppModal
        open={invoiceFormOpen}
        onClose={() => {
          setInvoiceFormOpen(false);
          setInvoiceEditId(null);
        }}
        title={editingInvoice ? `Edit ${editingInvoice.id}` : 'New invoice'}
        description={editingInvoice ? 'Update the billing details for this invoice.' : 'Raise an invoice against a customer; payments post to the ledger.'}
        size="md"
      >
        <Formik
          initialValues={{
            customerId:
              editingInvoice?.customerId ||
              customers.find((customer) => customer.company === editingInvoice?.customer)?.id ||
              customers[0].id,
            issued: editingInvoice?.issued || todayISO(),
            due: editingInvoice?.due || plusDaysISO(30),
            amount: editingInvoice?.amount ?? '',
          }}
          validationSchema={invoiceValidation}
          enableReinitialize
          onSubmit={(values) => {
            const customer = customers.find((entry) => entry.id === values.customerId);
            const invoice = saveInvoice({
              ...(editingInvoice ? { id: editingInvoice.id } : {}),
              customerId: values.customerId,
              customer: customer?.company || values.customerId,
              issued: values.issued,
              due: values.due,
              amount: Number(values.amount),
            });
            notify(
              editingInvoice ? 'Invoice updated' : 'Invoice raised',
              `${invoice.id} · ${invoice.customer} · ${formatINR(invoice.amount)}.`,
              'success'
            );
            setInvoiceFormOpen(false);
            setInvoiceEditId(null);
            setInvoiceSelectedId(invoice.id);
          }}
        >
          <Form>
            <SelectField
              name="customerId"
              label="Customer"
              options={customers.map((customer) => ({ value: customer.id, label: `${customer.company} · ${customer.city}` }))}
            />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <TextField name="issued" label="Issue date" type="date" />
              <TextField name="due" label="Due date" type="date" />
            </FormGrid>
            <div style={{ height: 14 }} />
            <TextField name="amount" label="Invoice value" type="number" prefix="₹" placeholder="450000" />
            <FormActions>
              <Button
                type="button"
                $variant="secondary"
                $size="sm"
                onClick={() => {
                  setInvoiceFormOpen(false);
                  setInvoiceEditId(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editingInvoice ? 'Save invoice' : 'Raise invoice'} <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={entryFormOpen}
        onClose={() => {
          setEntryFormOpen(false);
          setEntryEditId(null);
        }}
        title={editingEntry ? `Edit ${editingEntry.id}` : 'New ledger entry'}
        description="Income and expenses recorded here drive the finance totals and monthly report."
        size="md"
      >
        <Formik
          initialValues={{
            date: editingEntry?.date || todayISO(),
            type: editingEntry?.type || 'Expense',
            category: editingEntry?.category || 'Raw material',
            description: editingEntry?.description || '',
            amount: editingEntry?.amount ?? '',
            reference: editingEntry?.reference === '—' ? '' : editingEntry?.reference || '',
            status: editingEntry?.status || 'Cleared',
          }}
          validationSchema={entryValidation}
          enableReinitialize
          onSubmit={(values) => {
            const payload = {
              ...values,
              amount: Number(values.amount),
              reference: values.reference.trim() || '—',
            };
            const entry = editingEntry
              ? updateTransaction(editingEntry.id, payload) || { ...editingEntry, ...payload }
              : addTransaction(payload);
            notify(
              editingEntry ? 'Entry updated' : 'Entry recorded',
              `${entry.id} · ${entry.category} · ${formatINR(entry.amount)}.`,
              'success'
            );
            setEntryFormOpen(false);
            setEntryEditId(null);
            if (!editingEntry) setEntrySelectedId(entry.id);
          }}
        >
          <Form>
            <FormGrid $cols={2}>
              <SelectField name="type" label="Type" options={['Income', 'Expense']} />
              <TextField name="date" label="Date" type="date" />
              <SelectField name="category" label="Category" options={entryCategories} />
              <SelectField name="status" label="Status" options={['Cleared', 'Pending']} />
            </FormGrid>
            <div style={{ height: 14 }} />
            <TextField name="description" label="Description" placeholder="Gujarat Paper Mills · kraft liner" />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <TextField name="amount" label="Amount" type="number" prefix="₹" placeholder="920000" />
              <TextField name="reference" label="Reference" placeholder="PO-2026-311" />
            </FormGrid>
            <FormActions>
              <Button
                type="button"
                $variant="secondary"
                $size="sm"
                onClick={() => {
                  setEntryFormOpen(false);
                  setEntryEditId(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editingEntry ? 'Save entry' : 'Add entry'} <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selectedInvoice)}
        onClose={() => setInvoiceSelectedId(null)}
        title={selectedInvoice ? selectedInvoice.id : ''}
        description={selectedInvoice ? selectedInvoice.customer : ''}
        width="500px"
        footer={
          selectedInvoice ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setInvoiceSelectedId(null)}>
                Close
              </Button>
              <Button
                $variant="light"
                $size="sm"
                onClick={() => {
                  setInvoiceEditId(selectedInvoice.id);
                  setInvoiceFormOpen(true);
                }}
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button
                $variant="light"
                $size="sm"
                onClick={() => setInvoiceDeleteId(selectedInvoice.id)}
              >
                <Trash2 size={14} /> Delete
              </Button>
              {selectedInvoice.status !== 'Paid' ? (
                <Button $variant="primary" $size="sm" onClick={() => openPayment(selectedInvoice)}>
                  <Receipt size={14} /> Payment
                </Button>
              ) : (
                <StatusChip $tone="success" style={{ alignSelf: 'center' }}>
                  Fully paid
                </StatusChip>
              )}
            </>
          ) : null
        }
      >
        {selectedInvoice ? (
          <>
            <InvoiceHead>
              <div>
                <strong>{formatINR(selectedInvoice.amount)}</strong>
                <span>
                  Issued {formatDate(selectedInvoice.issued)} · due {formatDate(selectedInvoice.due)}
                </span>
              </div>
              <StatusChip $tone={statusTone(selectedInvoice.status)}>{selectedInvoice.status}</StatusChip>
            </InvoiceHead>

            <ProgressTrack style={{ height: 8 }}>
              <ProgressFill $value={(selectedInvoice.paid / selectedInvoice.amount) * 100} />
            </ProgressTrack>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: colors.muted }}>
              <span>{formatINR(selectedInvoice.paid)} received</span>
              <span>{formatINR(selectedInvoice.amount - selectedInvoice.paid)} outstanding</span>
            </div>

            <Divider style={{ margin: '18px 0' }} />

            <DetailGrid>
              <DetailItem>
                <DetailLabel>Customer</DetailLabel>
                <DetailValue>{selectedInvoice.customer}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Invoice value</DetailLabel>
                <DetailValue>{formatINR(selectedInvoice.amount)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Received</DetailLabel>
                <DetailValue>{formatINR(selectedInvoice.paid)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Balance</DetailLabel>
                <DetailValue>{formatINR(selectedInvoice.amount - selectedInvoice.paid)}</DetailValue>
              </DetailItem>
            </DetailGrid>
          </>
        ) : null}
      </Drawer>

      <Drawer
        open={Boolean(selectedEntry)}
        onClose={() => setEntrySelectedId(null)}
        title={selectedEntry ? selectedEntry.description : ''}
        description={selectedEntry ? `${selectedEntry.id} · ${selectedEntry.category}` : ''}
        width="500px"
        footer={
          selectedEntry ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setEntrySelectedId(null)}>
                Close
              </Button>
              <Button
                $variant="light"
                $size="sm"
                onClick={() => {
                  setEntryEditId(selectedEntry.id);
                  setEntryFormOpen(true);
                }}
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button $variant="light" $size="sm" onClick={() => setEntryDeleteId(selectedEntry.id)}>
                <Trash2 size={14} /> Delete
              </Button>
            </>
          ) : null
        }
      >
        {selectedEntry ? (
          <>
            <InvoiceHead>
              <div>
                <strong style={{ color: selectedEntry.type === 'Income' ? colors.success : colors.ink }}>
                  {signedAmount(selectedEntry)}
                </strong>
                <span>
                  {formatDate(selectedEntry.date)} · {selectedEntry.reference}
                </span>
              </div>
              <StatusChip $tone={statusTone(selectedEntry.status)}>{selectedEntry.status}</StatusChip>
            </InvoiceHead>

            <Divider style={{ margin: '0 0 18px' }} />

            <DetailGrid>
              <DetailItem>
                <DetailLabel>Type</DetailLabel>
                <DetailValue>{selectedEntry.type}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Category</DetailLabel>
                <DetailValue>{selectedEntry.category}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Reference</DetailLabel>
                <DetailValue>{selectedEntry.reference}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Amount</DetailLabel>
                <DetailValue>{formatINR(selectedEntry.amount)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>{selectedEntry.status}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Recorded</DetailLabel>
                <DetailValue>{formatDate(selectedEntry.date)}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <Divider style={{ margin: '18px 0' }} />
            <p style={{ fontSize: 11.5, color: colors.muted, lineHeight: 1.65 }}>
              {selectedEntry.type === 'Income'
                ? 'Receipts credit the ledger immediately and lift the net cash position for the month.'
                : selectedEntry.status === 'Pending'
                ? 'Pending costs appear in the ledger but are excluded from monthly totals until cleared.'
                : 'Cleared costs reduce net cash and feed the expense mix for the month.'}
            </p>
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={Boolean(deletingInvoice)}
        onClose={() => setInvoiceDeleteId(null)}
        title="Delete invoice"
        message={deletingInvoice ? `Remove ${deletingInvoice.id} for ${deletingInvoice.customer}? Payments already posted stay in the ledger.` : ''}
        confirmLabel="Delete invoice"
        tone="danger"
        onConfirm={() => {
          if (!deletingInvoice) return;
          deleteInvoice(deletingInvoice.id);
          notify('Invoice deleted', `${deletingInvoice.id} removed from receivables.`, 'success');
          setInvoiceDeleteId(null);
          setInvoiceSelectedId(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingEntry)}
        onClose={() => setEntryDeleteId(null)}
        title="Delete ledger entry"
        message={deletingEntry ? `Remove ${deletingEntry.id} · ${deletingEntry.description}? Monthly totals will be recalculated.` : ''}
        confirmLabel="Delete entry"
        tone="danger"
        onConfirm={() => {
          if (!deletingEntry) return;
          deleteTransaction(deletingEntry.id);
          notify('Entry deleted', `${deletingEntry.id} removed from the ledger.`, 'success');
          setEntryDeleteId(null);
          setEntrySelectedId(null);
        }}
      />
    </div>
  );
}
