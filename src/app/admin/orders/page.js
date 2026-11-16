'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Download,
  Plus,
  ArrowRight,
  Truck,
  CalendarDays,
  ChevronRight,
  PackageCheck,
  Pencil,
  Trash2,
  Repeat,
  Banknote,
  History,
  MapPin,
  Check,
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
import { colors, fonts, radii, shadows } from '@/lib/theme';
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
  ProgressTrack,
  ProgressFill,
  EmptyState,
} from '@/components/ui/primitives';
import { LoadingButton } from '@/components/ui/Feedback';
import { FilterChips, SearchInput, Segmented, Toolbar } from '@/components/ui/Controls';
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
import { TextField, SelectField, FormGrid, FormActions } from '@/components/ui/FormFields';
import MiniStats from '@/components/dashboard/MiniStats';

const STAGES = ['Confirmed', 'Prepress', 'In production', 'QC', 'Dispatched', 'Delivered'];
const PAYMENT_METHODS = ['NEFT', 'RTGS', 'UPI', 'Cheque', 'Cash'];
const PRIORITIES = ['Urgent', 'High', 'Medium', 'Low'];

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(178px, 1fr));
  gap: 11px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(6, 190px);
  }
`;

const Column = styled.div`
  background: ${colors.mist};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  padding: 9px;
  min-height: 260px;
`;

const ColumnHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 2px 4px 9px;

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${colors.inkSoft};
  }

  em {
    font-style: normal;
    font-size: 9.5px;
    font-weight: 700;
    background: #fff;
    border: 1px solid ${colors.line};
    border-radius: 999px;
    padding: 1px 6px;
    color: ${colors.muted};
  }
`;

const Card = styled.button`
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  padding: 10px;
  margin-bottom: 7px;
  box-shadow: ${shadows.xs};
  transition: border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;

  &:hover {
    border-color: #CFC9BB;
    box-shadow: ${shadows.sm};
    transform: translateY(-1px);
  }

  strong {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  p {
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.muted};
    line-height: 1.4;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const CardFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 8px;

  span {
    font-size: 9px;
    color: ${colors.faint};
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  em {
    font-style: normal;
    font-size: 9px;
    font-weight: 700;
    color: ${colors.copperDeep};
  }
`;

const PriorityDot = styled.span`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $p }) =>
    $p === 'Urgent' ? colors.danger : $p === 'High' ? colors.copper : $p === 'Low' ? colors.faint : colors.info};
  margin-right: 5px;
`;

const TimelineRow = styled.div`
  display: flex;
  gap: 0;
  margin: 16px 0 6px;
  overflow-x: auto;
  padding-bottom: 6px;
`;

const TimelineStep = styled.div`
  flex: 1;
  min-width: 72px;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0;
    right: 0;
    height: 1.5px;
    background: ${({ $done }) => ($done ? colors.forest : colors.line)};
  }

  &:first-child::before {
    left: 50%;
  }

  &:last-child::before {
    right: 50%;
  }

  i {
    position: relative;
    z-index: 1;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin: 0 auto;
    background: ${({ $done }) => ($done ? colors.forest : '#fff')};
    border: 1.5px solid ${({ $done }) => ($done ? colors.forest : colors.line)};
  }

  span {
    display: block;
    margin-top: 6px;
    font-size: 9px;
    font-weight: ${({ $current }) => ($current ? '700' : '500')};
    color: ${({ $done }) => ($done ? colors.inkSoft : colors.faint)};
    line-height: 1.3;
  }
`;

const ItemLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid ${colors.lineSoft};
  font-size: 11.5px;

  p {
    color: ${colors.inkSoft};
    flex: 1;
  }

  span {
    color: ${colors.muted};
    white-space: nowrap;
  }

  strong {
    color: ${colors.ink};
    white-space: nowrap;
  }
`;

const MoneyBand = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 14px;
  background: ${colors.cream};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  margin-bottom: 16px;

  span {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 3px;
    font-family: ${fonts.display};
    font-size: 17px;
    font-weight: 500;
    color: ${colors.ink};
  }
`;

const PayRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  p {
    font-size: 11.5px;
    color: ${colors.inkSoft};
    font-weight: 600;
  }

  span {
    display: block;
    margin-top: 1px;
    font-size: 10.5px;
    color: ${colors.faint};
  }

  strong {
    font-size: 12px;
    color: ${colors.ink};
    font-variant-numeric: tabular-nums;
  }
`;

const DeliveryCard = styled.div`
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  padding: 13px 15px;
  background: #FCFBF8;
  margin-bottom: 12px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 5px 0;
    font-size: 11.5px;
    color: ${colors.muted};
  }

  div strong {
    color: ${colors.ink};
    text-align: right;
  }
`;

const ItemBox = styled.div`
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  padding: 12px 13px;
  margin-bottom: 10px;
  background: #FCFBF8;
`;

const ItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  p {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.faint};
  }
`;

const orderValidation = Yup.object({
  customer: Yup.string().required('Customer is required'),
  dueDate: Yup.string().required('Due date is required'),
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

const itemsValue = (items = []) =>
  items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);

export default function OrdersPage() {
  const orders = useDemoStore((state) => state.orders);
  const customers = useDemoStore((state) => state.customers);
  const addOrder = useDemoStore((state) => state.addOrder);
  const updateOrder = useDemoStore((state) => state.updateOrder);
  const updateOrderStatus = useDemoStore((state) => state.updateOrderStatus);
  const deleteOrder = useDemoStore((state) => state.deleteOrder);
  const recordOrderPayment = useDemoStore((state) => state.recordOrderPayment);
  const repeatOrder = useDemoStore((state) => state.repeatOrder);

  const [view, setView] = useState('board');
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('All');
  const [tab, setTab] = useState('overview');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [seedCustomer, setSeedCustomer] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const selected = orders.find((order) => order.id === selectedId) || null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === '1') {
      setSeedCustomer(params.get('customer') || '');
      setFormOpen(true);
    }
    const focus = params.get('focus');
    if (focus) {
      const match = useDemoStore.getState().orders.find((order) => order.id === focus);
      if (match) setSelectedId(match.id);
    }
  }, []);

  useEffect(() => {
    setTab('overview');
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (priority !== 'All' && order.priority !== priority) return false;
      if (!q) return true;
      return (
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.poNumber.toLowerCase().includes(q) ||
        order.items.some((item) => item.description.toLowerCase().includes(q))
      );
    });
  }, [orders, priority, query]);

  const boardGroups = STAGES.map((stage) => ({
    stage,
    orders: filtered.filter((order) => order.status === stage),
  }));
  const unassigned = filtered.filter((order) => order.status === 'On hold');

  const active = orders.filter((order) => !['Delivered'].includes(order.status));
  const activeValue = active.reduce((sum, order) => sum + order.value, 0);
  const dueThisWeek = orders.filter(
    (order) => new Date(order.dueDate) <= new Date(plusDaysISO(7)) && order.status !== 'Delivered'
  ).length;
  const outstanding = orders.reduce(
    (sum, order) => sum + Math.max(0, order.value - (order.payment?.paid || 0)),
    0
  );

  const exportOrders = () => {
    downloadCSV(
      'stark-packmate-orders.csv',
      [
        'Order',
        'Customer',
        'Item',
        'Qty',
        'Value',
        'Paid',
        'Payment status',
        'Status',
        'Priority',
        'Due date',
        'PO number',
        'Carrier',
        'Tracking',
      ],
      filtered.map((order) => [
        order.id,
        order.customer,
        order.items[0]?.description,
        order.items.reduce((sum, item) => sum + item.qty, 0),
        order.value,
        order.payment?.paid || 0,
        order.payment?.paymentStatus || 'Unpaid',
        order.status,
        order.priority,
        order.dueDate,
        order.poNumber,
        order.delivery?.carrier || '—',
        order.delivery?.tracking || '—',
      ])
    );
    notify('Orders exported', `${filtered.length} orders downloaded as CSV.`, 'success');
  };

  const advance = (order) => {
    const index = STAGES.indexOf(order.status);
    if (index < 0 || index >= STAGES.length - 1) {
      notify('Order complete', `${order.id} has already been delivered.`, 'info');
      return;
    }
    const next = STAGES[index + 1];
    updateOrderStatus(order.id, next);
    notify('Order advanced', `${order.id} moved to ${next}.`, 'success');
  };

  const handleRepeat = (order) => {
    const copy = repeatOrder(order.id);
    if (!copy) return;
    notify('Repeat order created', `${copy.id} cloned from ${order.id} for ${order.customer}.`, 'success');
    setSelectedId(copy.id);
  };

  const openNew = () => {
    setEditing(false);
    setSeedCustomer('');
    setFormOpen(true);
  };

  const openEdit = () => {
    setEditing(true);
    setFormOpen(true);
  };

  const columns = [
    {
      key: 'id',
      label: 'Order',
      width: '17%',
      render: (order) => (
        <>
          <CellPrimary>{order.id}</CellPrimary>
          <CellSecondary>
            <PriorityDot $p={order.priority} /> {order.priority} priority
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (order) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{order.customer}</CellPrimary>
          <CellSecondary>{order.items[0]?.description}</CellSecondary>
        </>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      align: 'right',
      render: (order) => <CellStrong>{formatCompactINR(order.value)}</CellStrong>,
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (order) => (
        <>
          <StatusChip $tone={statusTone(order.payment?.paymentStatus || 'Unpaid')}>
            {order.payment?.paymentStatus || 'Unpaid'}
          </StatusChip>
          <CellSecondary style={{ marginTop: 4 }}>
            {formatCompactINR(order.payment?.paid || 0)} received
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (order) => <StatusChip $tone={statusTone(order.status)}>{order.status}</StatusChip>,
    },
    {
      key: 'progress',
      label: 'Progress',
      width: '11%',
      render: (order) => (
        <div>
          <ProgressTrack>
            <ProgressFill $value={order.progress} />
          </ProgressTrack>
          <CellSecondary style={{ marginTop: 3 }}>{order.progress}%</CellSecondary>
        </div>
      ),
    },
    {
      key: 'due',
      label: 'Due',
      render: (order) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{formatDate(order.dueDate)}</CellPrimary>
          <CellSecondary>{order.delivery?.status || 'Pending dispatch'}</CellSecondary>
        </>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (order) => <CellSecondary style={{ marginTop: 0 }}>{order.owner}</CellSecondary>,
    },
  ];

  const allGroups = unassigned.length
    ? [...boardGroups, { stage: 'On hold', orders: unassigned }]
    : boardGroups;

  const orderInitial = selected
    ? {
        customer: selected.customer,
        priority: selected.priority,
        dueDate: selected.dueDate,
        poNumber: selected.poNumber,
        shipTo: selected.shipTo,
        status: selected.status,
        items: selected.items.map((item) => ({
          description: item.description,
          qty: item.qty,
          rate: item.rate,
        })),
      }
    : null;

  const newInitial = {
    customer: seedCustomer,
    priority: 'Medium',
    dueDate: plusDaysISO(21),
    poNumber: '',
    shipTo: '',
    status: 'Confirmed',
    items: [{ description: '', qty: '', rate: '' }],
  };

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Orders</PageHeading>
          <PageDescription>
            Confirmed production orders across all customers — payment status, dispatch tracking and
            the full order timeline in one operating board.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="light" $size="sm" onClick={exportOrders}>
            <Download size={14} /> Export
          </Button>
          <Button $variant="primary" $size="sm" onClick={openNew}>
            <Plus size={14} /> New order
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          {
            label: 'Active orders',
            value: active.length,
            hint: `${formatCompactINR(activeValue)} in production value`,
          },
          {
            label: 'Due this week',
            value: dueThisWeek,
            hint: 'Dispatch commitments',
            tone: dueThisWeek > 5 ? 'warning' : undefined,
          },
          {
            label: 'Outstanding',
            value: formatCompactINR(outstanding),
            hint: 'Receivable against orders',
            tone: outstanding > 0 ? 'warning' : undefined,
          },
          {
            label: 'Delivered',
            value: orders.filter((order) => order.status === 'Delivered').length,
            hint: 'This demo window',
          },
        ]}
      />

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Order book</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filtered.length} of {orders.length} orders
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search order, customer, PO…" />
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: 'board', label: 'Board' },
                { value: 'table', label: 'Table' },
              ]}
            />
          </Toolbar>
        </PanelHeader>
        <div style={{ padding: '12px 16px 16px' }}>
          <FilterChips
            options={['All', ...PRIORITIES].map((name) => ({
              value: name,
              label: name === 'All' ? 'All priorities' : name,
              count: name === 'All' ? orders.length : orders.filter((order) => order.priority === name).length,
            }))}
            value={priority}
            onChange={setPriority}
          />
        </div>
        <PanelBody $flush={view === 'table'}>
          {view === 'board' ? (
            <div style={{ padding: '0 16px 16px' }}>
              <Board>
                {allGroups.map((group) => (
                  <Column key={group.stage}>
                    <ColumnHead>
                      <span>{group.stage}</span>
                      <em>{group.orders.length}</em>
                    </ColumnHead>
                    {group.orders.map((order) => (
                      <Card key={order.id} onClick={() => setSelectedId(order.id)}>
                        <strong>{order.id}</strong>
                        <p>{order.customer}</p>
                        <p style={{ color: colors.faint }}>{order.items[0]?.description}</p>
                        <CardFoot>
                          <span>
                            <CalendarDays size={9} /> {formatDate(order.dueDate, { year: undefined })}
                          </span>
                          <em>{formatCompactINR(order.value)}</em>
                        </CardFoot>
                      </Card>
                    ))}
                    {group.orders.length === 0 ? (
                      <p style={{ fontSize: 10, color: colors.faint, textAlign: 'center', padding: '18px 4px' }}>
                        No orders
                      </p>
                    ) : null}
                  </Column>
                ))}
              </Board>
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={filtered}
              onRowClick={(row) => setSelectedId(row.id)}
              minWidth="1080px"
              footer={<span>{filtered.length} orders · select a row for payment, delivery and timeline</span>}
            />
          )}
        </PanelBody>
      </Panel>

      <AppModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${selected?.id || 'order'}` : 'New order'}
        description="Orders created here appear on the production board immediately."
        size="xl"
      >
        <Formik
          initialValues={editing && orderInitial ? orderInitial : newInitial}
          validationSchema={orderValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            const customer = customers.find((entry) => entry.company === values.customer);
            const items = values.items.map((item) => ({
              description: item.description,
              qty: Number(item.qty),
              rate: Number(item.rate),
            }));
            if (editing && selected) {
              if (values.status !== selected.status) updateOrderStatus(selected.id, values.status);
              updateOrder(selected.id, {
                customerId: customer?.id || selected.customerId,
                customer: values.customer,
                contact: customer?.contact || selected.contact,
                priority: values.priority,
                dueDate: values.dueDate,
                poNumber: values.poNumber,
                shipTo: values.shipTo,
                status: values.status,
                items,
                value: itemsValue(items),
              });
              notify(
                'Order updated',
                `${selected.id} saved with ${items.length} line item${items.length > 1 ? 's' : ''}.`,
                'success'
              );
            } else {
              const order = addOrder({
                customerId: customer?.id || null,
                customer: values.customer,
                contact: customer?.contact,
                items,
                dueDate: values.dueDate,
                priority: values.priority,
                shipTo: values.shipTo || 'To be confirmed by customer',
                poNumber: values.poNumber || 'Awaiting customer PO',
              });
              notify('Order created', `${order.id} for ${order.customer} added to the board.`, 'success');
              setSelectedId(order.id);
            }
            setFormOpen(false);
            helpers.resetForm();
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <FormGrid $cols={2}>
                <SelectField
                  name="customer"
                  label="Customer"
                  placeholder="Select a customer"
                  required
                  options={customers.map((customer) => ({ value: customer.company, label: customer.company }))}
                />
                <SelectField name="priority" label="Priority" options={PRIORITIES} />
                <SelectField name="status" label="Order status" options={STAGES} />
                <TextField name="dueDate" label="Due date" type="date" required />
                <TextField name="poNumber" label="Customer PO number" placeholder="NL/PO/26/0918" />
                <TextField name="shipTo" label="Ship to" placeholder="Warehouse / 3PL address" />
              </FormGrid>

              <div style={{ height: 16 }} />
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: colors.faint,
                  marginBottom: 8,
                }}
              >
                Line items
              </p>
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
                          <TextField name={`items[${index}].qty`} label="Qty" type="number" placeholder="12000" />
                          <TextField
                            name={`items[${index}].rate`}
                            label="Rate per unit"
                            type="number"
                            prefix="₹"
                            placeholder="38"
                          />
                        </FormGrid>
                        <div style={{ marginTop: 7, fontSize: 10.5, color: colors.faint }}>
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

              <div
                style={{
                  marginTop: 14,
                  padding: '11px 13px',
                  background: colors.cream,
                  border: `1px solid ${colors.lineSoft}`,
                  borderRadius: radii.sm,
                  fontSize: 11.5,
                  color: colors.muted,
                }}
              >
                Order value before tax{' '}
                <strong style={{ color: colors.ink }}>{formatINR(itemsValue(values.items))}</strong>
              </div>

              <FormActions>
                {editing ? (
                  <Button
                    type="button"
                    $variant="danger"
                    $size="sm"
                    style={{ marginRight: 'auto' }}
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 size={13} /> Delete order
                  </Button>
                ) : null}
                <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" $variant="primary" $size="sm" loading={isSubmitting} loadingLabel="Saving…">
                  {editing ? 'Save order' : 'Create order'} <ArrowRight size={14} />
                </LoadingButton>
              </FormActions>
            </Form>
          )}
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.id : ''}
        description={selected ? `${selected.customer} · due ${formatDate(selected.dueDate)}` : ''}
        width="640px"
        footer={
          selected ? (
            <>
              <Button $variant="light" $size="sm" onClick={openEdit}>
                <Pencil size={13} /> Edit
              </Button>
              <Button $variant="secondary" $size="sm" onClick={() => handleRepeat(selected)}>
                <Repeat size={13} /> Repeat
              </Button>
              {selected.status !== 'Delivered' ? (
                <Button $variant="primary" $size="sm" onClick={() => advance(selected)}>
                  <PackageCheck size={14} /> Advance stage
                </Button>
              ) : (
                <StatusChip $tone="success" style={{ alignSelf: 'center' }}>
                  Delivered
                </StatusChip>
              )}
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusChip $tone={statusTone(selected.status)}>{selected.status}</StatusChip>
              <StatusChip $tone={statusTone(selected.priority)}>{selected.priority} priority</StatusChip>
              <StatusChip $tone={statusTone(selected.payment?.paymentStatus || 'Unpaid')}>
                {selected.payment?.paymentStatus || 'Unpaid'}
              </StatusChip>
              <span style={{ marginLeft: 'auto', fontFamily: fonts.display, fontSize: 22, color: colors.ink }}>
                {formatINR(selected.value)}
              </span>
            </div>

            <TimelineRow>
              {STAGES.map((stage) => {
                const currentIndex = STAGES.indexOf(selected.status);
                const stepIndex = STAGES.indexOf(stage);
                return (
                  <TimelineStep key={stage} $done={stepIndex <= currentIndex} $current={stepIndex === currentIndex}>
                    <i />
                    <span>{stage}</span>
                  </TimelineStep>
                );
              })}
            </TimelineRow>

            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'overview', label: 'Overview' },
                { value: 'payment', label: 'Payment', count: selected.payment?.payments?.length || 0 },
                { value: 'delivery', label: 'Delivery' },
                { value: 'timeline', label: 'Timeline', count: selected.timeline?.length || 0 },
              ]}
            />

            <div style={{ height: 16 }} />

            {tab === 'overview' ? (
              <>
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: colors.faint,
                    marginBottom: 4,
                  }}
                >
                  Order items
                </p>
                {selected.items.map((item, index) => (
                  <ItemLine key={index}>
                    <p>{item.description}</p>
                    <span>
                      {item.qty.toLocaleString('en-IN')} × ₹{item.rate}
                    </span>
                    <strong>{formatINR(item.qty * item.rate)}</strong>
                  </ItemLine>
                ))}

                <DetailGrid style={{ marginTop: 18 }}>
                  <DetailItem>
                    <DetailLabel>Purchase order</DetailLabel>
                    <DetailValue>{selected.poNumber}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Contact</DetailLabel>
                    <DetailValue>{selected.contact}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Quotation</DetailLabel>
                    <DetailValue>{selected.quoteId || 'Direct order'}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Owner</DetailLabel>
                    <DetailValue>{selected.owner}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Ship to</DetailLabel>
                    <DetailValue>{selected.shipTo}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Created</DetailLabel>
                    <DetailValue>{formatDate(selected.createdAt)}</DetailValue>
                  </DetailItem>
                </DetailGrid>

                <div style={{ marginTop: 16 }}>
                  <ProgressTrack>
                    <ProgressFill $value={selected.progress} />
                  </ProgressTrack>
                  <p style={{ fontSize: 10.5, color: colors.faint, marginTop: 5 }}>
                    {selected.progress}% complete · {selected.delivery?.status || 'Pending dispatch'}
                  </p>
                </div>

                {selected.status !== 'Delivered' ? (
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 18 }}>
                    {STAGES.filter((stage) => STAGES.indexOf(stage) > STAGES.indexOf(selected.status)).map(
                      (stage) => (
                        <Button
                          key={stage}
                          $variant="light"
                          $size="xs"
                          onClick={() => {
                            updateOrderStatus(selected.id, stage);
                            notify('Order updated', `${selected.id} moved to ${stage}.`, 'success');
                          }}
                        >
                          <ChevronRight size={12} /> {stage}
                        </Button>
                      )
                    )}
                  </div>
                ) : null}
              </>
            ) : null}

            {tab === 'payment' ? (
              <>
                <MoneyBand>
                  <div>
                    <span>Order value</span>
                    <strong>{formatINR(selected.value)}</strong>
                  </div>
                  <div>
                    <span>Received</span>
                    <strong style={{ color: colors.success }}>{formatINR(selected.payment?.paid || 0)}</strong>
                  </div>
                  <div>
                    <span>Outstanding</span>
                    <strong>{formatINR(Math.max(0, selected.value - (selected.payment?.paid || 0)))}</strong>
                  </div>
                </MoneyBand>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: colors.ink }}>
                    <Banknote size={13} style={{ color: colors.copper }} /> Payment history
                  </div>
                  <Button $variant="secondary" $size="xs" onClick={() => setPaymentOpen(true)}>
                    <Plus size={12} /> Record payment
                  </Button>
                </div>

                <div style={{ height: 6 }} />
                {(selected.payment?.payments || []).length ? (
                  selected.payment.payments.map((payment) => (
                    <PayRow key={payment.id}>
                      <div>
                        <p>
                          {formatINR(payment.amount)} · {payment.method}
                        </p>
                        <span>
                          {formatDate(payment.date)} · {payment.reference}
                        </span>
                      </div>
                      <StatusChip $tone="success">Received</StatusChip>
                    </PayRow>
                  ))
                ) : (
                  <EmptyState>
                    <Banknote size={22} />
                    <strong>No payments recorded</strong>
                    <p>Record the advance once the customer releases the PO.</p>
                  </EmptyState>
                )}

                <p style={{ fontSize: 10.5, color: colors.faint, marginTop: 14, lineHeight: 1.6 }}>
                  Receipts post to Finance as customer income against {selected.id}. Payment status updates
                  automatically when the order is marked delivered.
                </p>
              </>
            ) : null}

            {tab === 'delivery' ? (
              <>
                <DeliveryCard>
                  <div>
                    <span>Delivery status</span>
                    <strong>{selected.delivery?.status || 'Pending dispatch'}</strong>
                  </div>
                  <div>
                    <span>Carrier</span>
                    <strong>{selected.delivery?.carrier || 'Not assigned'}</strong>
                  </div>
                  <div>
                    <span>Tracking</span>
                    <strong>{selected.delivery?.tracking || '—'}</strong>
                  </div>
                  <div>
                    <span>Dispatched on</span>
                    <strong>
                      {selected.delivery?.dispatchedOn ? formatDate(selected.delivery.dispatchedOn) : '—'}
                    </strong>
                  </div>
                  <div>
                    <span>Delivered on</span>
                    <strong>
                      {selected.delivery?.deliveredOn ? formatDate(selected.delivery.deliveredOn) : '—'}
                    </strong>
                  </div>
                </DeliveryCard>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: 11.5,
                    color: colors.muted,
                    lineHeight: 1.6,
                  }}
                >
                  <MapPin size={13} style={{ marginTop: 2, color: colors.faint, flex: '0 0 auto' }} />
                  <span>{selected.delivery?.address || selected.shipTo}</span>
                </div>

                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 18 }}>
                  {selected.delivery?.status !== 'Delivered' ? (
                    <>
                      <Button $variant="secondary" $size="xs" onClick={() => setDispatchOpen(true)}>
                        <Truck size={12} /> {selected.delivery?.dispatchedOn ? 'Update dispatch' : 'Log dispatch'}
                      </Button>
                      <Button
                        $variant="primary"
                        $size="xs"
                        onClick={() => {
                          updateOrderStatus(selected.id, 'Delivered');
                          notify('Order delivered', `${selected.id} marked delivered to ${selected.customer}.`, 'success');
                        }}
                      >
                        <Check size={12} /> Mark delivered
                      </Button>
                    </>
                  ) : (
                    <StatusChip $tone="success">Delivered {formatDate(selected.delivery.deliveredOn)}</StatusChip>
                  )}
                </div>
              </>
            ) : null}

            {tab === 'timeline' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: colors.ink, marginBottom: 14 }}>
                  <History size={13} style={{ color: colors.copper }} /> Order timeline
                </div>
                <Timeline>
                  {(selected.timeline || []).slice().reverse().map((event) => (
                    <TimelineItem key={event.id} $active={event.done}>
                      <TimelineTitle>{event.label}</TimelineTitle>
                      <TimelineMeta>
                        {event.note} · {formatDate(event.date)}
                      </TimelineMeta>
                    </TimelineItem>
                  ))}
                </Timeline>
                {!(selected.timeline || []).length ? (
                  <EmptyState>
                    <History size={22} />
                    <strong>No timeline yet</strong>
                    <p>Stage changes and payments appear here.</p>
                  </EmptyState>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
      </Drawer>

      <AppModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Record payment"
        description="Receipts are posted to finance and update the order payment status."
        size="sm"
      >
        {selected ? (
          <Formik
            initialValues={{
              amount: Math.max(0, selected.value - (selected.payment?.paid || 0)),
              method: 'NEFT',
            }}
            validationSchema={Yup.object({
              amount: Yup.number()
                .positive('Enter an amount')
                .max(
                  Math.max(0, selected.value - (selected.payment?.paid || 0)),
                  'Amount exceeds the outstanding balance'
                )
                .required('Amount is required'),
              method: Yup.string().required(),
            })}
            onSubmit={(values, helpers) => {
              recordOrderPayment(selected.id, Number(values.amount), values.method);
              notify(
                'Payment recorded',
                `${formatINR(Number(values.amount))} against ${selected.id} via ${values.method}.`,
                'success'
              );
              setPaymentOpen(false);
              helpers.resetForm();
            }}
          >
            {() => (
              <Form>
                <FormGrid $cols={1}>
                  <TextField
                    name="amount"
                    label="Amount received"
                    type="number"
                    prefix="₹"
                    required
                    placeholder={String(Math.max(0, selected.value - (selected.payment?.paid || 0)))}
                  />
                  <SelectField name="method" label="Payment method" options={PAYMENT_METHODS} />
                </FormGrid>
                <div style={{ marginTop: 12, fontSize: 11, color: colors.muted }}>
                  Outstanding balance{' '}
                  <strong style={{ color: colors.ink }}>
                    {formatINR(Math.max(0, selected.value - (selected.payment?.paid || 0)))}
                  </strong>
                </div>
                <FormActions>
                  <Button type="button" $variant="secondary" $size="sm" onClick={() => setPaymentOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" $variant="primary" $size="sm">
                    Record payment
                  </Button>
                </FormActions>
              </Form>
            )}
          </Formik>
        ) : null}
      </AppModal>

      <AppModal
        open={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
        title="Log dispatch"
        description="Dispatch details appear on the order, customer timeline and delivery tab."
        size="md"
      >
        {selected ? (
          <Formik
            initialValues={{
              carrier:
                selected.delivery?.carrier && selected.delivery.carrier !== '—'
                  ? selected.delivery.carrier
                  : 'VRL Logistics',
              tracking:
                selected.delivery?.tracking && selected.delivery.tracking !== '—'
                  ? selected.delivery.tracking
                  : '',
              dispatchedOn: selected.delivery?.dispatchedOn || plusDaysISO(0),
            }}
            validationSchema={Yup.object({
              carrier: Yup.string().trim().required('Carrier is required'),
              tracking: Yup.string().trim().required('Tracking number is required'),
              dispatchedOn: Yup.string().required('Dispatch date is required'),
            })}
            onSubmit={(values, helpers) => {
              updateOrderStatus(selected.id, 'Dispatched');
              updateOrder(selected.id, {
                delivery: {
                  ...selected.delivery,
                  status: 'In transit',
                  carrier: values.carrier,
                  tracking: values.tracking,
                  dispatchedOn: values.dispatchedOn,
                  address: selected.shipTo,
                },
              });
              notify('Dispatch logged', `${selected.id} handed to ${values.carrier}.`, 'success');
              setDispatchOpen(false);
              setTab('delivery');
              helpers.resetForm();
            }}
          >
            {() => (
              <Form>
                <FormGrid $cols={2}>
                  <TextField name="carrier" label="Carrier" placeholder="VRL Logistics" required />
                  <TextField name="tracking" label="Tracking number" placeholder="VRL-1042-26" required />
                  <TextField name="dispatchedOn" label="Dispatched on" type="date" required />
                </FormGrid>
                <FormActions>
                  <Button type="button" $variant="secondary" $size="sm" onClick={() => setDispatchOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" $variant="primary" $size="sm">
                    <Truck size={13} /> Save dispatch
                  </Button>
                </FormActions>
              </Form>
            )}
          </Formik>
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete order?"
        message={
          selected
            ? `${selected.id} · ${selected.customer} will be removed from the order book. Payments already posted to finance are retained.`
            : ''
        }
        confirmLabel="Delete order"
        onConfirm={() => {
          if (!selected) return;
          deleteOrder(selected.id);
          notify('Order deleted', `${selected.id} was removed from the demo order book.`, 'info');
          setFormOpen(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
