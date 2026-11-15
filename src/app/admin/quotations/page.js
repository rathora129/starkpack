'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Download,
  Plus,
  Trash2,
  ArrowRight,
  FileText,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Send,
  Pencil,
  Printer,
  History,
  Layers,
  Percent,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import {
  formatCompactINR,
  formatDate,
  formatINR,
  statusTone,
  downloadCSV,
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
  Label,
  StatusChip,
  Divider,
  ProgressTrack,
  ProgressFill,
  EmptyState,
} from '@/components/ui/primitives';
import { FilterChips, SearchInput, Toolbar, Segmented } from '@/components/ui/Controls';
import { DataTable, CellPrimary, CellSecondary, CellStrong } from '@/components/ui/DataTable';
import {
  AppModal,
  Drawer,
  ConfirmDialog,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
} from '@/components/ui/Overlay';
import {
  TextField,
  TextAreaField,
  SelectField,
  FormGrid,
  FormSection,
  FormSectionTitle,
  FormActions,
} from '@/components/ui/FormFields';
import MiniStats from '@/components/dashboard/MiniStats';

const STATUSES = ['Draft', 'Sent', 'Negotiation', 'Accepted', 'Expired', 'Declined'];

const QuoteHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 20px;
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

const LineTable = styled.div`
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  overflow: hidden;
  margin-top: 10px;
`;

const LineHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px 90px 100px;
  gap: 10px;
  padding: 9px 12px;
  background: #FBFAF6;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${colors.faint};
`;

const Line = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px 90px 100px;
  gap: 10px;
  padding: 10px 12px;
  border-top: 1px solid ${colors.lineSoft};
  align-items: center;

  p {
    font-size: 11.5px;
    color: ${colors.inkSoft};
    line-height: 1.4;
  }

  span {
    font-size: 11px;
    color: ${colors.muted};
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  strong {
    font-size: 11.5px;
    color: ${colors.ink};
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

const Totals = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-left: auto;
  width: 240px;
  padding-top: 12px;

  div {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    color: ${colors.muted};
  }

  div:last-child {
    padding-top: 8px;
    border-top: 1px solid ${colors.lineSoft};
    font-size: 13px;
    font-weight: 700;
    color: ${colors.ink};
  }
`;

const ItemBox = styled.div`
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  padding: 13px;
  margin-bottom: 11px;
  background: #FCFBF8;
`;

const ItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;

  p {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.faint};
  }
`;

const PreviewTotals = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 11px 13px;
  background: ${colors.cream};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  font-size: 11.5px;
  color: ${colors.muted};
  margin-top: 4px;

  strong {
    color: ${colors.ink};
    font-size: 12.5px;
  }
`;

const SpecCard = styled.div`
  padding: 12px 14px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  background: ${colors.cream};

  & + & {
    margin-top: 8px;
  }

  p {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
    margin-bottom: 3px;
  }

  strong {
    font-size: 12px;
    font-weight: 600;
    color: ${colors.inkSoft};
    line-height: 1.5;
  }
`;

const RevisionRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  background: ${({ $current }) => ($current ? '#F7FBF8' : '#fff')};

  & + & {
    margin-top: 8px;
  }

  div.body {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    font-size: 12px;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
  }
`;

const VersionBadge = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: ${({ $current }) => ($current ? colors.forest : colors.mist)};
  color: ${({ $current }) => ($current ? '#F9F6EE' : colors.muted)};
  font-family: ${fonts.mono};
  font-size: 10px;
  font-weight: 700;
  flex: 0 0 auto;
`;

const Doc = styled.div`
  margin: -22px -24px;
  padding: 30px 34px 34px;
  background: #fff;

  @media (max-width: 640px) {
    margin: -18px;
    padding: 22px 18px;
  }
`;

const DocHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 18px;
  border-bottom: 2px solid ${colors.forest};

  h2 {
    font-family: ${fonts.display};
    font-size: 24px;
    font-weight: 500;
    color: ${colors.ink};
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 4px;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.6;
  }

  aside {
    text-align: right;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.7;
  }

  aside strong {
    display: block;
    font-family: ${fonts.mono};
    font-size: 13px;
    color: ${colors.ink};
  }
`;

const DocMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  padding: 18px 0;

  p {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${colors.faint};
    margin-bottom: 4px;
  }

  strong {
    display: block;
    font-size: 12px;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.6;
  }
`;

const DocTable = styled.div`
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  overflow: hidden;

  div.row {
    display: grid;
    grid-template-columns: 1fr 60px 80px 90px;
    gap: 8px;
    padding: 9px 12px;
    border-top: 1px solid ${colors.lineSoft};
    font-size: 10.5px;
    color: ${colors.inkSoft};
  }

  div.row:first-child {
    border-top: 0;
    background: #F7F5EF;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  div.row span:nth-child(n + 2) {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

const DocTerms = styled.div`
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid ${colors.lineSoft};
  font-size: 9.5px;
  line-height: 1.75;
  color: ${colors.muted};

  strong {
    color: ${colors.ink};
  }
`;

const validation = Yup.object({
  customer: Yup.string().trim().required('Customer is required'),
  validUntil: Yup.string().required('Validity date is required'),
  discountPercent: Yup.number().min(0, 'Discount cannot be negative').max(30, 'Cap discount at 30%'),
  items: Yup.array()
    .min(1, 'Add at least one line item')
    .of(
      Yup.object({
        description: Yup.string().trim().required('Description is required'),
        qty: Yup.number().positive('Qty > 0').required('Qty required'),
        rate: Yup.number().positive('Rate > 0').required('Rate required'),
      })
    ),
});

const computeTotals = (items = [], discountPercent = 0) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0),
    0
  );
  const discount = Math.round(subtotal * ((Number(discountPercent) || 0) / 100));
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.18);
  return { subtotal, discount, taxable, tax, total: taxable + tax };
};

const SPEC_FIELDS = [
  ['material', 'Material / board'],
  ['print', 'Print & colour'],
  ['finish', 'Finish & hardware'],
  ['dimensions', 'Dimensions'],
  ['packing', 'Packing & cartons'],
];

const emptySpecs = { material: '', print: '', finish: '', dimensions: '', packing: '' };

const quoteValues = (quote) => ({
  customer: quote.customer,
  validUntil: quote.validUntil,
  status: quote.status,
  probability: quote.probability,
  discountPercent: quote.discountPercent || 0,
  items: quote.items.map((item) => ({ description: item.description, qty: item.qty, rate: item.rate })),
  specs: { ...emptySpecs, ...(quote.specs || {}) },
});

const escapeHtml = (value) =>
  String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default function QuotationsPage() {
  const router = useRouter();
  const quotes = useDemoStore((state) => state.quotes);
  const customers = useDemoStore((state) => state.customers);
  const addQuote = useDemoStore((state) => state.addQuote);
  const updateQuote = useDemoStore((state) => state.updateQuote);
  const deleteQuote = useDemoStore((state) => state.deleteQuote);
  const addQuoteRevision = useDemoStore((state) => state.addQuoteRevision);
  const updateQuoteStatus = useDemoStore((state) => state.updateQuoteStatus);
  const addOrder = useDemoStore((state) => state.addOrder);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('quote');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [seedCustomer, setSeedCustomer] = useState('');

  const selected = quotes.find((quote) => quote.id === selectedId) || null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === '1') {
      setSeedCustomer(params.get('customer') || '');
      setFormOpen(true);
    }
    const focus = params.get('focus');
    if (focus) {
      const match = useDemoStore.getState().quotes.find((quote) => quote.id === focus);
      if (match) setSelectedId(match.id);
    }
  }, []);

  useEffect(() => {
    setTab('quote');
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quotes.filter((quote) => {
      if (status !== 'All' && quote.status !== status) return false;
      if (!q) return true;
      return (
        quote.id.toLowerCase().includes(q) ||
        quote.customer.toLowerCase().includes(q) ||
        quote.items.some((item) => item.description.toLowerCase().includes(q))
      );
    });
  }, [quotes, status, query]);

  const open = quotes.filter((quote) => ['Sent', 'Negotiation'].includes(quote.status));
  const openValue = open.reduce((sum, quote) => sum + quote.total, 0);
  const accepted = quotes.filter((quote) => quote.status === 'Accepted').length;
  const winRate = Math.round((accepted / Math.max(1, quotes.length)) * 100);
  const avgValue = quotes.reduce((sum, quote) => sum + quote.total, 0) / Math.max(1, quotes.length);

  const exportQuotes = () => {
    downloadCSV(
      'stark-packmate-quotations.csv',
      ['Quote', 'Revision', 'Customer', 'Date', 'Valid until', 'Status', 'Subtotal', 'Discount', 'GST', 'Total', 'Owner'],
      filtered.map((quote) => [
        quote.id,
        quote.revision || 1,
        quote.customer,
        quote.date,
        quote.validUntil,
        quote.status,
        quote.subtotal,
        quote.discount || 0,
        quote.tax,
        quote.total,
        quote.owner,
      ])
    );
    notify('Quotations exported', `${filtered.length} quotations downloaded as CSV.`, 'success');
  };

  const convertToOrder = (quote) => {
    const order = addOrder({
      customerId: quote.customerId,
      customer: quote.customer,
      contact: quote.contact,
      quoteId: quote.id,
      items: quote.items,
      dueDate: plusDaysISO(18),
      priority: 'High',
      shipTo: 'To be confirmed by customer',
      poNumber: 'Awaiting customer PO',
    });
    updateQuoteStatus(quote.id, 'Accepted');
    notify('Order created', `${quote.id} converted to ${order.id} for ${quote.customer}.`, 'success');
  };

  const printQuote = (quote) => {
    const totals = computeTotals(quote.items, quote.discountPercent);
    const win = window.open('', '_blank', 'width=920,height=760');
    if (!win) {
      notify('Pop-up blocked', 'Allow pop-ups to open the printable quotation.', 'warning');
      return;
    }
    const rows = quote.items
      .map(
        (item) => `<tr><td>${escapeHtml(item.description)}</td><td>${Number(item.qty).toLocaleString('en-IN')}</td><td>₹${Number(item.rate).toLocaleString('en-IN')}</td><td>₹${(item.qty * item.rate).toLocaleString('en-IN')}</td></tr>`
      )
      .join('');
    win.document.write(`<!doctype html><html><head><title>${escapeHtml(quote.id)} · Stark Packmate</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;color:#10231D;padding:40px;max-width:820px;margin:0 auto}
        h1{font-size:22px;margin:0} .muted{color:#6B7A73;font-size:11px;line-height:1.6}
        .top{display:flex;justify-content:space-between;border-bottom:2px solid #17493B;padding-bottom:16px}
        table{width:100%;border-collapse:collapse;margin-top:22px;font-size:12px}
        th,td{text-align:left;padding:9px 8px;border-bottom:1px solid #E5E0D5}
        th{background:#F7F5EF;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6B7A73}
        td:nth-child(n+2),th:nth-child(n+2){text-align:right}
        .totals{margin-top:18px;margin-left:auto;width:260px;font-size:12px}
        .totals div{display:flex;justify-content:space-between;padding:5px 0}
        .totals .grand{border-top:1px solid #E5E0D5;margin-top:6px;padding-top:10px;font-weight:700}
        .terms{margin-top:26px;border-top:1px solid #E5E0D5;padding-top:14px;font-size:10px;color:#6B7A73;line-height:1.7}
      </style></head><body>
      <div class="top"><div><h1>STARK PACKMATE</h1><div class="muted">Precision packaging · Plot 42, MIDC Industrial Estate, Andheri East, Mumbai 400093<br/>GSTIN 27AABCS4821F1Z5 · hello@starkpackmate.com</div></div>
      <div style="text-align:right"><strong>${escapeHtml(quote.id)}</strong><div class="muted">Revision ${quote.revision || 1}<br/>Date ${escapeHtml(formatDate(quote.date))}<br/>Valid until ${escapeHtml(formatDate(quote.validUntil))}</div></div></div>
      <p class="muted" style="margin-top:18px"><strong style="color:#10231D;font-size:12px">${escapeHtml(quote.customer)}</strong><br/>${escapeHtml(quote.contact)}</p>
      <table><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="totals"><div><span>Subtotal</span><span>₹${totals.subtotal.toLocaleString('en-IN')}</span></div>
      <div><span>Discount (${quote.discountPercent || 0}%)</span><span>- ₹${totals.discount.toLocaleString('en-IN')}</span></div>
      <div><span>GST @ 18%</span><span>₹${totals.tax.toLocaleString('en-IN')}</span></div>
      <div class="grand"><span>Total</span><span>₹${totals.total.toLocaleString('en-IN')}</span></div></div>
      <div class="terms"><strong>Specification</strong><br/>${SPEC_FIELDS.map(([key, label]) => `${escapeHtml(label)}: ${escapeHtml((quote.specs || {})[key] || '—')}`).join('<br/>')}<br/><br/>
      <strong>Terms</strong><br/>50% advance with PO, balance before dispatch. Prices valid until the date above. Freight and insurance extra unless stated. Production lead time confirmed at PO.</div>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const columns = [
    {
      key: 'id',
      label: 'Quotation',
      width: '18%',
      render: (quote) => (
        <>
          <CellPrimary>{quote.id}</CellPrimary>
          <CellSecondary>{formatDate(quote.date)} · Rev {quote.revision || 1}</CellSecondary>
        </>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (quote) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{quote.customer}</CellPrimary>
          <CellSecondary>{quote.contact}</CellSecondary>
        </>
      ),
    },
    {
      key: 'items',
      label: 'Line items',
      width: '24%',
      render: (quote) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{quote.items[0]?.description}</CellPrimary>
          <CellSecondary>
            {quote.items.length > 1 ? `+ ${quote.items.length - 1} more line items` : 'Single line item'}
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'total',
      label: 'Total (incl. GST)',
      align: 'right',
      render: (quote) => <CellStrong>{formatINR(quote.total)}</CellStrong>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (quote) => <StatusChip $tone={statusTone(quote.status)}>{quote.status}</StatusChip>,
    },
    {
      key: 'valid',
      label: 'Valid until',
      render: (quote) => <CellSecondary style={{ marginTop: 0 }}>{formatDate(quote.validUntil)}</CellSecondary>,
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (quote) => <CellSecondary style={{ marginTop: 0 }}>{quote.owner}</CellSecondary>,
    },
    {
      key: 'prob',
      label: 'Win likelihood',
      align: 'right',
      render: (quote) => (
        <span style={{ fontSize: 11, color: colors.muted, fontWeight: 600 }}>{quote.probability}%</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Quotations</PageHeading>
          <PageDescription>
            Priced proposals with packaging specifications, discounts, GST and revision history —
            created from CRM leads or the customer master.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="light" $size="sm" onClick={exportQuotes}>
            <Download size={14} /> Export
          </Button>
          <Button $variant="primary" $size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} /> New quotation
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Open pipeline', value: formatCompactINR(openValue), hint: `${open.length} quotes awaiting decision` },
          { label: 'Win rate', value: `${winRate}%`, hint: 'Last 90 days' },
          { label: 'Average quote', value: formatCompactINR(avgValue), hint: 'Incl. 18% GST' },
          {
            label: 'Expiring in 7 days',
            value: quotes.filter((quote) => quote.status === 'Sent').length,
            hint: 'Follow up this week',
            tone: 'warning',
          },
        ]}
      />

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Quotation register</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filtered.length} of {quotes.length} quotations
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search quote, customer…" />
          </Toolbar>
        </PanelHeader>
        <div style={{ padding: '12px 16px 0' }}>
          <FilterChips
            options={[
              { value: 'All', label: 'All', count: quotes.length },
              ...STATUSES.map((name) => ({
                value: name,
                label: name,
                count: quotes.filter((quote) => quote.status === name).length,
              })),
            ]}
            value={status}
            onChange={setStatus}
          />
        </div>
        <PanelBody $flush>
          <DataTable
            columns={columns}
            rows={filtered}
            onRowClick={(row) => setSelectedId(row.id)}
            minWidth="1000px"
            footer={<span>{filtered.length} quotations · open a row to review line items and revisions</span>}
          />
        </PanelBody>
      </Panel>

      <AppModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="New quotation"
        description="Line items are priced in INR with discounts and 18% GST applied automatically."
        size="xl"
      >
        <Formik
          initialValues={{
            customer: seedCustomer,
            validUntil: plusDaysISO(14),
            status: 'Draft',
            probability: 50,
            discountPercent: 0,
            items: [{ description: '', qty: '', rate: '' }],
            specs: emptySpecs,
          }}
          validationSchema={validation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            const totals = computeTotals(values.items, values.discountPercent);
            const customer = customers.find((entry) => entry.company === values.customer);
            const quote = addQuote({
              customer: values.customer,
              customerId: customer?.id || null,
              contact: customer?.contact,
              validUntil: values.validUntil,
              status: values.status,
              probability: Number(values.probability),
              discountPercent: Number(values.discountPercent) || 0,
              items: values.items.map((item) => ({
                description: item.description,
                qty: Number(item.qty),
                rate: Number(item.rate),
              })),
              specs: values.specs,
            });
            notify(
              'Quotation created',
              `${quote.id} for ${quote.customer} · ${formatINR(totals.total)} incl. GST.`,
              'success'
            );
            setFormOpen(false);
            setSelectedId(quote.id);
            helpers.resetForm();
          }}
        >
          {({ values, isSubmitting }) => {
            const totals = computeTotals(values.items, values.discountPercent);
            return (
              <Form>
                <FormGrid $cols={2}>
                  <SelectField
                    name="customer"
                    label="Customer"
                    placeholder="Select a customer"
                    required
                    options={customers.map((customer) => ({
                      value: customer.company,
                      label: `${customer.company} · ${customer.city}`,
                    }))}
                  />
                  <TextField name="validUntil" label="Valid until" type="date" required />
                  <SelectField name="status" label="Status" options={['Draft', 'Sent', 'Negotiation']} />
                  <TextField name="probability" label="Win likelihood (%)" type="number" min="0" max="100" />
                  <TextField
                    name="discountPercent"
                    label="Discount (%)"
                    type="number"
                    min="0"
                    max="30"
                    placeholder="0"
                  />
                  <div />
                </FormGrid>

                <div style={{ height: 18 }} />
                <Label style={{ marginBottom: 8 }}>Line items</Label>
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <>
                      {values.items.map((item, index) => (
                        <ItemBox key={`item-${index}`}>
                          <ItemTop>
                            <p>Item {index + 1}</p>
                            {values.items.length > 1 ? (
                              <Button
                                type="button"
                                $variant="ghost"
                                $size="xs"
                                onClick={() => remove(index)}
                                aria-label="Remove line item"
                              >
                                <Trash2 size={13} />
                              </Button>
                            ) : null}
                          </ItemTop>
                          <FormGrid $cols="1.6fr 0.7fr 0.8fr">
                            <TextField
                              name={`items[${index}].description`}
                              label="Description"
                              placeholder="Premium mailer · 300×220×100 mm · 4-colour"
                            />
                            <TextField name={`items[${index}].qty`} label="Qty" type="number" placeholder="10000" />
                            <TextField
                              name={`items[${index}].rate`}
                              label="Rate (₹)"
                              type="number"
                              placeholder="38"
                              prefix="₹"
                            />
                          </FormGrid>
                          <div style={{ marginTop: 8, fontSize: 10.5, color: colors.faint }}>
                            Line value{' '}
                            <strong style={{ color: colors.ink }}>
                              {formatINR((Number(item.qty) || 0) * (Number(item.rate) || 0))}
                            </strong>
                          </div>
                        </ItemBox>
                      ))}
                      <Button
                        type="button"
                        $variant="light"
                        $size="xs"
                        onClick={() => push({ description: '', qty: '', rate: '' })}
                      >
                        <Plus size={13} /> Add line item
                      </Button>
                    </>
                  )}
                </FieldArray>

                <div style={{ height: 18 }} />
                <FormSection>
                  <FormSectionTitle>Packaging specification</FormSectionTitle>
                  <FormGrid $cols={2}>
                    <TextField name="specs.material" label="Material / board" placeholder="300 GSM SBS board" />
                    <TextField name="specs.dimensions" label="Dimensions" placeholder="220 × 160 × 70 mm" />
                    <TextField name="specs.print" label="Print & colour" placeholder="4-colour offset" />
                    <TextField name="specs.finish" label="Finish & hardware" placeholder="Matte lamination, ribbon" />
                  </FormGrid>
                  <div style={{ height: 12 }} />
                  <TextField name="specs.packing" label="Packing & cartons" placeholder="25 boxes per 5-ply shipper" />
                </FormSection>

                <PreviewTotals>
                  <span>
                    Subtotal <strong>{formatINR(totals.subtotal)}</strong>
                  </span>
                  <span>
                    Discount <strong>- {formatINR(totals.discount)}</strong>
                  </span>
                  <span>
                    GST 18% <strong>{formatINR(totals.tax)}</strong>
                  </span>
                  <span style={{ marginLeft: 'auto' }}>
                    Quotation total <strong>{formatINR(totals.total)}</strong>
                  </span>
                </PreviewTotals>

                <FormActions>
                  <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" $variant="primary" $size="sm" disabled={isSubmitting}>
                    Create quotation <ArrowRight size={14} />
                  </Button>
                </FormActions>
              </Form>
            );
          }}
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.id : ''}
        description={selected ? `${selected.customer} · ${selected.owner}` : ''}
        width="640px"
        footer={
          selected ? (
            <>
              <Button $variant="light" $size="sm" onClick={() => setEditOpen(true)}>
                <Pencil size={13} /> Edit
              </Button>
              <Button $variant="secondary" $size="sm" onClick={() => setPreviewOpen(true)}>
                <Printer size={13} /> PDF preview
              </Button>
              {selected.status === 'Accepted' ? (
                <Button $variant="primary" $size="sm" onClick={() => convertToOrder(selected)}>
                  <ShoppingCart size={14} /> Convert to order
                </Button>
              ) : selected.status === 'Declined' ? (
                <StatusChip $tone="danger" style={{ alignSelf: 'center' }}>Declined</StatusChip>
              ) : (
                <Button $variant="primary" $size="sm" onClick={() => convertToOrder(selected)}>
                  <CheckCircle2 size={14} /> Accept &amp; convert
                </Button>
              )}
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <QuoteHead>
              <div>
                <strong>{formatINR(selected.total)}</strong>
                <span>
                  Incl. {formatINR(selected.tax)} GST · valid until {formatDate(selected.validUntil)}
                </span>
              </div>
              <StatusChip $tone={statusTone(selected.status)}>{selected.status}</StatusChip>
            </QuoteHead>

            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'quote', label: 'Quotation' },
                { value: 'specs', label: 'Specs', count: SPEC_FIELDS.length },
                { value: 'revisions', label: 'Revisions', count: selected.revisions?.length || 1 },
              ]}
            />

            <div style={{ height: 16 }} />

            {tab === 'quote' ? (
              <>
                <LineTable>
                  <LineHead>
                    <span>Description</span>
                    <span style={{ textAlign: 'right' }}>Qty</span>
                    <span style={{ textAlign: 'right' }}>Rate</span>
                    <span style={{ textAlign: 'right' }}>Amount</span>
                  </LineHead>
                  {selected.items.map((item, index) => (
                    <Line key={index}>
                      <p>{item.description}</p>
                      <span>{item.qty.toLocaleString('en-IN')}</span>
                      <span>₹{item.rate}</span>
                      <strong>{formatINR(item.qty * item.rate)}</strong>
                    </Line>
                  ))}
                </LineTable>

                <Totals>
                  <div>
                    <span>Subtotal</span>
                    <span>{formatINR(selected.subtotal)}</span>
                  </div>
                  <div>
                    <span>Discount ({selected.discountPercent || 0}%)</span>
                    <span>- {formatINR(selected.discount || 0)}</span>
                  </div>
                  <div>
                    <span>GST @ 18%</span>
                    <span>{formatINR(selected.tax)}</span>
                  </div>
                  <div>
                    <span>Total</span>
                    <span>{formatINR(selected.total)}</span>
                  </div>
                </Totals>

                <div style={{ marginTop: 16 }}>
                  <ProgressTrack>
                    <ProgressFill $value={selected.probability} />
                  </ProgressTrack>
                  <p style={{ fontSize: 10.5, color: colors.faint, marginTop: 5 }}>
                    {selected.probability}% win likelihood · revision {selected.revision || 1}
                  </p>
                </div>

                <Divider style={{ margin: '18px 0' }} />

                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Customer</DetailLabel>
                    <DetailValue>{selected.customer}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Contact</DetailLabel>
                    <DetailValue>{selected.contact}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Prepared</DetailLabel>
                    <DetailValue>{formatDate(selected.date)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Valid until</DetailLabel>
                    <DetailValue>{formatDate(selected.validUntil)}</DetailValue>
                  </DetailItem>
                </DetailGrid>

                {selected.status !== 'Accepted' && selected.status !== 'Declined' ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
                    <Button
                      $variant="light"
                      $size="xs"
                      onClick={() => {
                        updateQuoteStatus(selected.id, 'Sent');
                        notify('Quote sent', `${selected.id} marked as sent to ${selected.customer}.`, 'info');
                      }}
                    >
                      <Send size={13} /> Mark sent
                    </Button>
                    <Button
                      $variant="light"
                      $size="xs"
                      onClick={() => {
                        updateQuoteStatus(selected.id, 'Accepted');
                        notify('Quote accepted', `${selected.id} is now accepted.`, 'success');
                      }}
                    >
                      <CheckCircle2 size={13} /> Mark accepted
                    </Button>
                    <Button
                      $variant="ghost"
                      $size="xs"
                      onClick={() => {
                        updateQuoteStatus(selected.id, 'Declined');
                        notify('Quote declined', `${selected.id} marked declined.`, 'info');
                      }}
                    >
                      <XCircle size={13} /> Mark declined
                    </Button>
                    <Button
                      $variant="ghost"
                      $size="xs"
                      onClick={() => router.push(`/admin/customers?focus=${selected.customerId || ''}`)}
                    >
                      <FileText size={13} /> View customer
                    </Button>
                  </div>
                ) : null}
              </>
            ) : null}

            {tab === 'specs' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>
                  <Layers size={13} style={{ color: colors.copper }} /> Packaging specification
                </div>
                {SPEC_FIELDS.map(([key, label]) => (
                  <SpecCard key={key}>
                    <p>{label}</p>
                    <strong>{(selected.specs || {})[key] || 'To be confirmed'}</strong>
                  </SpecCard>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                  <Button $variant="secondary" $size="xs" onClick={() => setEditOpen(true)}>
                    <Pencil size={12} /> Edit specification
                  </Button>
                </div>
              </>
            ) : null}

            {tab === 'revisions' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: colors.ink }}>
                    <History size={13} style={{ color: colors.copper }} /> Revision history
                  </div>
                  <Button $variant="secondary" $size="xs" onClick={() => setRevisionOpen(true)}>
                    <Plus size={12} /> New revision
                  </Button>
                </div>
                <div style={{ height: 12 }} />
                {(selected.revisions || []).slice().reverse().map((revision) => (
                  <RevisionRow key={revision.id} $current={revision.version === selected.revision}>
                    <VersionBadge $current={revision.version === selected.revision}>R{revision.version}</VersionBadge>
                    <div className="body">
                      <strong>{formatINR(revision.total)} · {revision.status}</strong>
                      <span>
                        {revision.note} · {formatDate(revision.date)} · {revision.by}
                      </span>
                    </div>
                  </RevisionRow>
                ))}
                {!selected.revisions?.length ? (
                  <EmptyState>
                    <History size={22} />
                    <strong>No revision history</strong>
                    <p>Create a revision when commercial terms change.</p>
                  </EmptyState>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
      </Drawer>

      <AppModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={selected ? `Edit ${selected.id}` : 'Edit quotation'}
        description="Editing updates the current totals. Use revisions to keep a commercial history."
        size="xl"
      >
        {selected ? (
          <Formik
            key={selected.id}
            initialValues={quoteValues(selected)}
            validationSchema={validation}
            onSubmit={(values) => {
              updateQuote(selected.id, {
                customer: values.customer,
                validUntil: values.validUntil,
                status: values.status,
                probability: Number(values.probability),
                discountPercent: Number(values.discountPercent) || 0,
                items: values.items.map((item) => ({
                  description: item.description,
                  qty: Number(item.qty),
                  rate: Number(item.rate),
                })),
                specs: values.specs,
              });
              notify('Quotation updated', `${selected.id} saved with revised pricing.`, 'success');
              setEditOpen(false);
            }}
          >
            {({ values, isSubmitting }) => {
              const totals = computeTotals(values.items, values.discountPercent);
              return (
                <Form>
                  <FormGrid $cols={2}>
                    <SelectField
                      name="customer"
                      label="Customer"
                      required
                      options={customers.map((customer) => ({ value: customer.company, label: customer.company }))}
                    />
                    <TextField name="validUntil" label="Valid until" type="date" required />
                    <SelectField name="status" label="Status" options={STATUSES} />
                    <TextField name="probability" label="Win likelihood (%)" type="number" />
                    <TextField name="discountPercent" label="Discount (%)" type="number" min="0" max="30" />
                    <div />
                  </FormGrid>

                  <div style={{ height: 16 }} />
                  <Label style={{ marginBottom: 8 }}>Line items</Label>
                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                        {values.items.map((item, index) => (
                          <ItemBox key={`edit-item-${index}`}>
                            <ItemTop>
                              <p>Item {index + 1}</p>
                              {values.items.length > 1 ? (
                                <Button type="button" $variant="ghost" $size="xs" onClick={() => remove(index)}>
                                  <Trash2 size={13} />
                                </Button>
                              ) : null}
                            </ItemTop>
                            <FormGrid $cols="1.6fr 0.7fr 0.8fr">
                              <TextField name={`items[${index}].description`} label="Description" />
                              <TextField name={`items[${index}].qty`} label="Qty" type="number" />
                              <TextField name={`items[${index}].rate`} label="Rate (₹)" type="number" prefix="₹" />
                            </FormGrid>
                          </ItemBox>
                        ))}
                        <Button type="button" $variant="light" $size="xs" onClick={() => push({ description: '', qty: '', rate: '' })}>
                          <Plus size={13} /> Add line item
                        </Button>
                      </>
                    )}
                  </FieldArray>

                  <div style={{ height: 16 }} />
                  <FormSection>
                    <FormSectionTitle>Packaging specification</FormSectionTitle>
                    <FormGrid $cols={2}>
                      <TextField name="specs.material" label="Material / board" />
                      <TextField name="specs.dimensions" label="Dimensions" />
                      <TextField name="specs.print" label="Print & colour" />
                      <TextField name="specs.finish" label="Finish & hardware" />
                    </FormGrid>
                    <div style={{ height: 12 }} />
                    <TextField name="specs.packing" label="Packing & cartons" />
                  </FormSection>

                  <PreviewTotals>
                    <span>Subtotal <strong>{formatINR(totals.subtotal)}</strong></span>
                    <span>Discount <strong>- {formatINR(totals.discount)}</strong></span>
                    <span>GST 18% <strong>{formatINR(totals.tax)}</strong></span>
                    <span style={{ marginLeft: 'auto' }}>Total <strong>{formatINR(totals.total)}</strong></span>
                  </PreviewTotals>

                  <FormActions>
                    <Button
                      type="button"
                      $variant="danger"
                      $size="sm"
                      style={{ marginRight: 'auto' }}
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2 size={13} /> Delete quotation
                    </Button>
                    <Button type="button" $variant="secondary" $size="sm" onClick={() => setEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" $variant="primary" $size="sm" disabled={isSubmitting}>
                      Save quotation
                    </Button>
                  </FormActions>
                </Form>
              );
            }}
          </Formik>
        ) : null}
      </AppModal>

      <AppModal
        open={revisionOpen}
        onClose={() => setRevisionOpen(false)}
        title="Create revision"
        description="The current revision becomes superseded; pricing is recalculated with the new discount."
        size="md"
      >
        {selected ? (
          <Formik
            initialValues={{
              discountPercent: selected.discountPercent || 0,
              validUntil: plusDaysISO(14),
              note: '',
            }}
            validationSchema={Yup.object({
              discountPercent: Yup.number().min(0).max(30),
              validUntil: Yup.string().required('Validity date is required'),
              note: Yup.string().trim().required('Describe what changed'),
            })}
            onSubmit={(values) => {
              addQuoteRevision(selected.id, {
                discountPercent: Number(values.discountPercent) || 0,
                validUntil: values.validUntil,
                note: values.note,
              });
              notify('Revision created', `${selected.id} moved to revision ${(selected.revision || 1) + 1}.`, 'success');
              setRevisionOpen(false);
              setTab('revisions');
            }}
          >
            <Form>
              <FormGrid $cols={2}>
                <TextField name="discountPercent" label="New discount (%)" type="number" min="0" max="30" />
                <TextField name="validUntil" label="New validity" type="date" required />
              </FormGrid>
              <div style={{ height: 12 }} />
              <TextAreaField
                name="note"
                label="What changed?"
                rows={3}
                placeholder="Revised rates after plant review; board upgraded to 350 GSM."
                required
              />
              <FormActions>
                <Button type="button" $variant="secondary" $size="sm" onClick={() => setRevisionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" $variant="primary" $size="sm">
                  <History size={13} /> Create revision
                </Button>
              </FormActions>
            </Form>
          </Formik>
        ) : null}
      </AppModal>

      <AppModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={selected ? `Quotation preview · ${selected.id}` : 'Quotation preview'}
        description="Print-ready document. Use print to save as PDF."
        size="xl"
        footer={
          <Button $variant="primary" $size="sm" onClick={() => selected && printQuote(selected)}>
            <Printer size={13} /> Print / save as PDF
          </Button>
        }
      >
        {selected ? (
          <Doc>
            <DocHead>
              <div>
                <h2>Stark Packmate</h2>
                <p>
                  Precision packaging · Plot 42, MIDC Industrial Estate
                  <br />
                  Andheri East, Mumbai 400093 · GSTIN 27AABCS4821F1Z5
                </p>
              </div>
              <aside>
                <strong>{selected.id}</strong>
                Revision {selected.revision || 1}
                <br />
                {formatDate(selected.date)}
                <br />
                Valid until {formatDate(selected.validUntil)}
              </aside>
            </DocHead>

            <DocMeta>
              <div>
                <p>Quotation for</p>
                <strong>{selected.customer}</strong>
                <span>{selected.contact}</span>
              </div>
              <div>
                <p>Prepared by</p>
                <strong>{selected.owner}</strong>
                <span>Stark Packmate · Commercial team</span>
              </div>
            </DocMeta>

            <DocTable>
              <div className="row">
                <span>Description</span>
                <span>Qty</span>
                <span>Rate</span>
                <span>Amount</span>
              </div>
              {selected.items.map((item, index) => (
                <div className="row" key={index}>
                  <span>{item.description}</span>
                  <span>{item.qty.toLocaleString('en-IN')}</span>
                  <span>₹{item.rate.toLocaleString('en-IN')}</span>
                  <span>{formatINR(item.qty * item.rate)}</span>
                </div>
              ))}
            </DocTable>

            <Totals>
              <div>
                <span>Subtotal</span>
                <span>{formatINR(selected.subtotal)}</span>
              </div>
              <div>
                <span>Discount ({selected.discountPercent || 0}%)</span>
                <span>- {formatINR(selected.discount || 0)}</span>
              </div>
              <div>
                <span>GST @ 18%</span>
                <span>{formatINR(selected.tax)}</span>
              </div>
              <div>
                <span>Total payable</span>
                <span>{formatINR(selected.total)}</span>
              </div>
            </Totals>

            <DocTerms>
              <strong>Specification</strong>
              <br />
              {SPEC_FIELDS.map(([key, label]) => `${label}: ${(selected.specs || {})[key] || '—'}`).join(' · ')}
              <br />
              <br />
              <strong>Terms &amp; conditions</strong>
              <br />
              50% advance with PO, balance before dispatch. Prices valid until {formatDate(selected.validUntil)}.
              Freight and insurance extra unless stated. Production lead time confirmed at PO. All
              packaging is FSC-certified and recyclable as standard.
            </DocTerms>
          </Doc>
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete quotation?"
        message={selected ? `${selected.id} for ${selected.customer} will be removed. Converted orders are not affected.` : ''}
        confirmLabel="Delete quotation"
        onConfirm={() => {
          if (!selected) return;
          deleteQuote(selected.id);
          notify('Quotation deleted', `${selected.id} was removed from the register.`, 'info');
          setEditOpen(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
