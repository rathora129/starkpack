'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Plus,
  Download,
  Truck,
  Star,
  ArrowRight,
  PackageCheck,
  Clock,
  Pencil,
  Trash2,
  Send,
  CircleDot,
  AlertTriangle,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import {
  formatCompactINR,
  formatDate,
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
  Divider,
} from '@/components/ui/primitives';
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
} from '@/components/ui/Overlay';
import { TextField, SelectField, FormGrid, FormActions } from '@/components/ui/FormFields';
import MiniStats from '@/components/dashboard/MiniStats';

const SupplierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const SupplierCard = styled.button`
  text-align: left;
  padding: 15px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.lg};
  background: #fff;
  box-shadow: ${shadows.xs};
  transition: border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;

  &:hover {
    border-color: #D6D0C2;
    transform: translateY(-2px);
    box-shadow: ${shadows.card};
  }

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.35;
  }

  p {
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.faint};
  }
`;

const SupplierFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid ${colors.lineSoft};

  span {
    font-size: 9.5px;
    color: ${colors.muted};
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  em {
    font-style: normal;
    font-size: 9.5px;
    color: ${colors.copperDeep};
    font-weight: 700;
  }
`;

const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: ${colors.copperDeep};
  font-size: 10px;
  font-weight: 700;
`;

const SupplierHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;

  strong {
    display: block;
    font-size: 15px;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 11.5px;
    color: ${colors.muted};
  }
`;

const Avatar = styled.span`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 11px;
  background: ${colors.forest};
  color: #F6F6FF;
  font-family: ${fonts.display};
  font-size: 17px;
  flex: 0 0 auto;
`;

const SectionLabel = styled.p`
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.faint};
  margin-bottom: 9px;
`;

const poValidation = Yup.object({
  supplier: Yup.string().required('Supplier is required'),
  items: Yup.string().trim().required('Describe the material being ordered'),
  value: Yup.number().positive('Enter the PO value').required('Value is required'),
  expected: Yup.string().required('Expected date is required'),
});

const supplierValidation = Yup.object({
  name: Yup.string().trim().required('Supplier name is required'),
  contact: Yup.string().trim().required('Contact person is required'),
  category: Yup.string().required(),
  leadTime: Yup.number().positive('Lead time is required').required('Lead time is required'),
});

const supplierCategories = [
  'Paper & board',
  'Inks & coatings',
  'Adhesives',
  'Foils & films',
  'Packing consumables',
  'Logistics',
];

const owners = ['Priya Nair', 'Rahul Menon', 'Neha Joshi', 'Aditya Rao'];

export default function PurchasingPage() {
  const suppliers = useDemoStore((state) => state.suppliers);
  const purchaseOrders = useDemoStore((state) => state.purchaseOrders);
  const savePurchaseOrder = useDemoStore((state) => state.savePurchaseOrder);
  const deletePurchaseOrder = useDemoStore((state) => state.deletePurchaseOrder);
  const receivePurchaseOrder = useDemoStore((state) => state.receivePurchaseOrder);
  const saveSupplier = useDemoStore((state) => state.saveSupplier);
  const deleteSupplier = useDemoStore((state) => state.deleteSupplier);

  const [view, setView] = useState('orders');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPoId, setEditingPoId] = useState(null);
  const [poSupplier, setPoSupplier] = useState('');
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [supplierFormOpen, setSupplierFormOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [deletePoOpen, setDeletePoOpen] = useState(false);
  const [deleteSupplierOpen, setDeleteSupplierOpen] = useState(false);

  const selectedPo = purchaseOrders.find((po) => po.id === selectedPoId) || null;
  const selectedSupplier = suppliers.find((supplier) => supplier.id === selectedSupplierId) || null;
  const editingPo = purchaseOrders.find((po) => po.id === editingPoId) || null;
  const editingSupplier = suppliers.find((supplier) => supplier.id === editingSupplierId) || null;

  const filteredPo = useMemo(() => {
    const q = query.trim().toLowerCase();
    return purchaseOrders.filter((po) => {
      if (status !== 'All' && po.status !== status) return false;
      if (!q) return true;
      return po.id.toLowerCase().includes(q) || po.supplier.toLowerCase().includes(q) || po.items.toLowerCase().includes(q);
    });
  }, [purchaseOrders, status, query]);

  const filteredSuppliers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(q) ||
        supplier.category.toLowerCase().includes(q) ||
        supplier.city.toLowerCase().includes(q)
    );
  }, [suppliers, query]);

  const openValue = purchaseOrders
    .filter((po) => po.status !== 'Received')
    .reduce((sum, po) => sum + po.value, 0);
  const delayed = purchaseOrders.filter((po) => po.status === 'Delayed').length;
  const avgRating = suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) / Math.max(1, suppliers.length);

  const poColumns = [
    {
      key: 'id',
      label: 'PO',
      width: '16%',
      render: (po) => (
        <>
          <CellPrimary>{po.id}</CellPrimary>
          <CellSecondary>{formatDate(po.issued)}</CellSecondary>
        </>
      ),
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (po) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{po.supplier}</CellPrimary>
          <CellSecondary>{po.owner}</CellSecondary>
        </>
      ),
    },
    {
      key: 'items',
      label: 'Material',
      width: '26%',
      render: (po) => <CellSecondary style={{ marginTop: 0 }}>{po.items}</CellSecondary>,
    },
    {
      key: 'value',
      label: 'Value',
      align: 'right',
      render: (po) => <CellStrong>{formatCompactINR(po.value)}</CellStrong>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (po) => <StatusChip $tone={statusTone(po.status)}>{po.status}</StatusChip>,
    },
    {
      key: 'expected',
      label: 'Expected',
      render: (po) => <CellSecondary style={{ marginTop: 0 }}>{formatDate(po.expected)}</CellSecondary>,
    },
  ];

  const exportPo = () => {
    downloadCSV(
      'stark-packmate-purchase-orders.csv',
      ['PO', 'Supplier', 'Items', 'Value', 'Issued', 'Expected', 'Status', 'Owner'],
      filteredPo.map((po) => [po.id, po.supplier, po.items, po.value, po.issued, po.expected, po.status, po.owner])
    );
    notify('Purchase orders exported', `${filteredPo.length} POs downloaded as CSV.`, 'success');
  };

  const openRaisePo = (supplierName) => {
    setEditingPoId(null);
    setPoSupplier(supplierName || suppliers[0]?.name || '');
    setFormOpen(true);
  };

  const openEditPo = (po) => {
    setEditingPoId(po.id);
    setFormOpen(true);
  };

  const setPoStatus = (po, next) => {
    if (next === 'Received') {
      receivePurchaseOrder(po.id);
      notify('Goods received', `${po.id} received and posted to stock.`, 'success');
      return;
    }
    savePurchaseOrder({ id: po.id, status: next });
    notify('PO updated', `${po.id} marked ${next.toLowerCase()}.`, 'success');
  };

  const poInitial = editingPo
    ? {
        supplier: editingPo.supplier,
        items: editingPo.items,
        value: editingPo.value,
        expected: editingPo.expected,
        status: editingPo.status,
        owner: editingPo.owner,
      }
    : {
        supplier: poSupplier,
        items: '',
        value: '',
        expected: plusDaysISO(10),
        status: 'Sent',
        owner: 'Priya Nair',
      };

  const supplierInitial = editingSupplier
    ? {
        name: editingSupplier.name,
        category: editingSupplier.category,
        contact: editingSupplier.contact,
        email: editingSupplier.email,
        phone: editingSupplier.phone,
        city: editingSupplier.city,
        rating: editingSupplier.rating,
        leadTime: editingSupplier.leadTime,
        paymentTerms: editingSupplier.paymentTerms,
        gstin: editingSupplier.gstin,
        status: editingSupplier.status,
      }
    : {
        name: '',
        category: 'Paper & board',
        contact: '',
        email: '',
        phone: '',
        city: '',
        rating: 4,
        leadTime: 7,
        paymentTerms: 'Net 30',
        gstin: '',
        status: 'Active',
      };

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Purchase &amp; suppliers</PageHeading>
          <PageDescription>
            Raw material procurement, open purchase orders and the supplier scorecard behind every
            production promise.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="light" $size="sm" onClick={exportPo}>
            <Download size={14} /> Export POs
          </Button>
          <Button
            $variant="light"
            $size="sm"
            onClick={() => {
              setEditingSupplierId(null);
              setSupplierFormOpen(true);
            }}
          >
            <Plus size={14} /> New supplier
          </Button>
          <Button $variant="primary" $size="sm" onClick={() => openRaisePo()}>
            <Plus size={14} /> Raise PO
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Open PO value', value: formatCompactINR(openValue), hint: `${purchaseOrders.filter((po) => po.status !== 'Received').length} POs in flight` },
          { label: 'Active suppliers', value: suppliers.length, hint: 'Across 6 categories' },
          { label: 'Delayed deliveries', value: delayed, hint: 'Follow up with suppliers', tone: delayed ? 'danger' : undefined },
          { label: 'Avg. supplier rating', value: `${avgRating.toFixed(1)}/5`, hint: 'Quality, delivery, service' },
        ]}
      />

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>{view === 'orders' ? 'Purchase orders' : 'Supplier directory'}</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {view === 'orders'
                ? `${filteredPo.length} of ${purchaseOrders.length} purchase orders`
                : `${filteredSuppliers.length} of ${suppliers.length} suppliers`}
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={view === 'orders' ? 'Search PO or supplier…' : 'Search supplier or category…'}
            />
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: 'orders', label: 'Purchase orders' },
                { value: 'suppliers', label: 'Suppliers' },
              ]}
            />
          </Toolbar>
        </PanelHeader>
        {view === 'orders' ? (
          <>
            <div style={{ padding: '12px 16px 0' }}>
              <FilterChips
                options={['All', 'Sent', 'In transit', 'Received', 'Delayed'].map((name) => ({
                  value: name,
                  label: name === 'All' ? 'All statuses' : name,
                  count: name === 'All' ? purchaseOrders.length : purchaseOrders.filter((po) => po.status === name).length,
                }))}
                value={status}
                onChange={setStatus}
              />
            </div>
            <PanelBody $flush>
              <DataTable
                columns={poColumns}
                rows={filteredPo}
                onRowClick={(po) => setSelectedPoId(po.id)}
                minWidth="900px"
                footer={<span>{filteredPo.length} purchase orders · click a row for actions</span>}
              />
            </PanelBody>
          </>
        ) : (
          <PanelBody>
            <SupplierGrid>
              {filteredSuppliers.map((supplier) => (
                <SupplierCard key={supplier.id} onClick={() => setSelectedSupplierId(supplier.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <strong>{supplier.name}</strong>
                      <p>
                        {supplier.category} · {supplier.city}
                      </p>
                    </div>
                    <StatusChip $tone={statusTone(supplier.status)}>{supplier.status}</StatusChip>
                  </div>
                  <SupplierFoot>
                    <span>
                      <Clock size={10} /> {supplier.leadTime} days
                    </span>
                    <Rating>
                      <Star size={10} fill="currentColor" /> {supplier.rating}
                    </Rating>
                    <em>{supplier.openPOs} open</em>
                  </SupplierFoot>
                </SupplierCard>
              ))}
            </SupplierGrid>
          </PanelBody>
        )}
      </Panel>

      <AppModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingPo ? `Edit ${editingPo.id}` : 'Raise purchase order'}
        description="Purchase orders feed the goods-receipt ledger in inventory."
        size="md"
      >
        <Formik
          initialValues={poInitial}
          validationSchema={poValidation}
          enableReinitialize
          onSubmit={(values) => {
            const saved = savePurchaseOrder({
              ...(editingPo ? { id: editingPo.id } : {}),
              ...values,
              value: Number(values.value),
            });
            notify(
              editingPo ? 'Purchase order updated' : 'Purchase order raised',
              `${saved.id} ${editingPo ? 'saved' : `sent to ${saved.supplier}`} for ${formatCompactINR(saved.value)}.`,
              'success'
            );
            setFormOpen(false);
            setSelectedPoId(saved.id);
          }}
        >
          <Form>
            <SelectField
              name="supplier"
              label="Supplier"
              options={suppliers.map((supplier) => ({ value: supplier.name, label: `${supplier.name} · ${supplier.category}` }))}
            />
            <div style={{ height: 14 }} />
            <TextField name="items" label="Material and quantity" placeholder="Kraft liner 120 GSM · 20 MT" />
            <div style={{ height: 14 }} />
            <FormGrid $cols={2}>
              <TextField name="value" label="PO value" type="number" prefix="₹" placeholder="1840000" />
              <TextField name="expected" label="Expected delivery" type="date" />
              <SelectField name="status" label="Status" options={['Sent', 'In transit', 'Received', 'Delayed']} />
              <SelectField name="owner" label="Buyer" options={owners} />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editingPo ? 'Save PO' : 'Raise PO'} <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={supplierFormOpen}
        onClose={() => setSupplierFormOpen(false)}
        title={editingSupplier ? `Edit ${editingSupplier.name}` : 'New supplier'}
        description="Supplier records are used by purchasing and inventory lead times."
        size="lg"
      >
        <Formik
          initialValues={supplierInitial}
          validationSchema={supplierValidation}
          enableReinitialize
          onSubmit={(values) => {
            const saved = saveSupplier({
              ...(editingSupplier ? { id: editingSupplier.id } : {}),
              ...values,
              rating: Number(values.rating) || 4,
              leadTime: Number(values.leadTime) || 7,
            });
            notify(
              editingSupplier ? 'Supplier updated' : 'Supplier created',
              `${saved.name} saved to the supplier directory.`,
              'success'
            );
            setSupplierFormOpen(false);
            setSelectedSupplierId(saved.id);
          }}
        >
          <Form>
            <FormGrid $cols={2}>
              <TextField name="name" label="Supplier name" placeholder="Gujarat Paper Mills" required />
              <SelectField name="category" label="Category" options={supplierCategories} />
              <TextField name="contact" label="Contact person" placeholder="Hitesh Patel" required />
              <TextField name="city" label="City" placeholder="Vapi" />
              <TextField name="email" label="Email" type="email" placeholder="hitesh@gpml.in" />
              <TextField name="phone" label="Phone" placeholder="+91 98250 11402" />
              <TextField name="gstin" label="GSTIN" placeholder="24AABCG1129K1Z3" />
              <TextField name="leadTime" label="Lead time (days)" type="number" placeholder="6" required />
              <TextField name="rating" label="Rating (1–5)" type="number" placeholder="4.6" />
              <SelectField name="paymentTerms" label="Payment terms" options={['Net 15', 'Net 30', 'Net 45', 'Advance']} />
              <SelectField name="status" label="Status" options={['Active', 'On hold', 'Inactive']} />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setSupplierFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editingSupplier ? 'Save supplier' : 'Add supplier'}
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selectedPo)}
        onClose={() => setSelectedPoId(null)}
        title={selectedPo ? selectedPo.id : ''}
        description={selectedPo ? `${selectedPo.supplier} · ${selectedPo.owner}` : ''}
        width="540px"
        footer={
          selectedPo ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setSelectedPoId(null)}>
                Close
              </Button>
              <Button $variant="light" $size="sm" onClick={() => openEditPo(selectedPo)}>
                <Pencil size={14} /> Edit
              </Button>
              <Button $variant="light" $size="sm" onClick={() => setDeletePoOpen(true)}>
                <Trash2 size={14} /> Delete
              </Button>
              {selectedPo.status !== 'Received' ? (
                <Button $variant="primary" $size="sm" onClick={() => setPoStatus(selectedPo, 'Received')}>
                  <PackageCheck size={14} /> Mark received
                </Button>
              ) : (
                <StatusChip $tone="success" style={{ alignSelf: 'center' }}>
                  Received
                </StatusChip>
              )}
            </>
          ) : null
        }
      >
        {selectedPo ? (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <StatusChip $tone={statusTone(selectedPo.status)}>{selectedPo.status}</StatusChip>
              <span style={{ marginLeft: 'auto', fontFamily: fonts.display, fontSize: 21, color: colors.ink }}>
                {formatCompactINR(selectedPo.value)}
              </span>
            </div>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Supplier</DetailLabel>
                <DetailValue>{selectedPo.supplier}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Material</DetailLabel>
                <DetailValue>{selectedPo.items}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Issued</DetailLabel>
                <DetailValue>{formatDate(selectedPo.issued)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Expected</DetailLabel>
                <DetailValue>{formatDate(selectedPo.expected)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Buyer</DetailLabel>
                <DetailValue>{selectedPo.owner}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Value</DetailLabel>
                <DetailValue>{formatCompactINR(selectedPo.value)}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <Divider style={{ margin: '18px 0 12px' }} />
            <SectionLabel>Update delivery status</SectionLabel>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              <Button
                $variant={selectedPo.status === 'Sent' ? 'primary' : 'light'}
                $size="xs"
                onClick={() => setPoStatus(selectedPo, 'Sent')}
              >
                <Send size={13} /> Sent
              </Button>
              <Button
                $variant={selectedPo.status === 'In transit' ? 'primary' : 'light'}
                $size="xs"
                onClick={() => setPoStatus(selectedPo, 'In transit')}
              >
                <Truck size={13} /> In transit
              </Button>
              <Button
                $variant={selectedPo.status === 'Delayed' ? 'primary' : 'light'}
                $size="xs"
                onClick={() => setPoStatus(selectedPo, 'Delayed')}
              >
                <AlertTriangle size={13} /> Delayed
              </Button>
              <Button
                $variant={selectedPo.status === 'Received' ? 'primary' : 'light'}
                $size="xs"
                onClick={() => setPoStatus(selectedPo, 'Received')}
              >
                <PackageCheck size={13} /> Received
              </Button>
            </div>

            <Divider style={{ margin: '18px 0' }} />
            <p style={{ fontSize: 11.5, lineHeight: 1.7, color: colors.muted }}>
              <CircleDot size={11} style={{ verticalAlign: -1, marginRight: 4 }} />
              Marking a PO received posts an inward stock movement against the supplier&apos;s
              matching SKU and updates on-hand inventory.
            </p>
          </>
        ) : null}
      </Drawer>

      <Drawer
        open={Boolean(selectedSupplier)}
        onClose={() => setSelectedSupplierId(null)}
        title={selectedSupplier ? selectedSupplier.name : ''}
        description={selectedSupplier ? `${selectedSupplier.id} · ${selectedSupplier.category}` : ''}
        width="520px"
        footer={
          selectedSupplier ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setSelectedSupplierId(null)}>
                Close
              </Button>
              <Button
                $variant="light"
                $size="sm"
                onClick={() => {
                  setEditingSupplierId(selectedSupplier.id);
                  setSupplierFormOpen(true);
                }}
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button $variant="light" $size="sm" onClick={() => setDeleteSupplierOpen(true)}>
                <Trash2 size={14} /> Delete
              </Button>
              <Button
                $variant="primary"
                $size="sm"
                onClick={() => {
                  openRaisePo(selectedSupplier.name);
                  setSelectedSupplierId(null);
                }}
              >
                <Truck size={14} /> Raise PO
              </Button>
            </>
          ) : null
        }
      >
        {selectedSupplier ? (
          <>
            <SupplierHead>
              <Avatar>{selectedSupplier.name.slice(0, 2).toUpperCase()}</Avatar>
              <div>
                <strong>{selectedSupplier.contact}</strong>
                <span>
                  {selectedSupplier.city} · {selectedSupplier.paymentTerms}
                </span>
              </div>
              <Rating style={{ marginLeft: 'auto' }}>
                <Star size={12} fill="currentColor" /> {selectedSupplier.rating}
              </Rating>
            </SupplierHead>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Category</DetailLabel>
                <DetailValue>{selectedSupplier.category}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>{selectedSupplier.status}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Lead time</DetailLabel>
                <DetailValue>{selectedSupplier.leadTime} days</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Open POs</DetailLabel>
                <DetailValue>{selectedSupplier.openPOs}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{selectedSupplier.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Phone</DetailLabel>
                <DetailValue>{selectedSupplier.phone}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>GSTIN</DetailLabel>
                <DetailValue>{selectedSupplier.gstin}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Payment terms</DetailLabel>
                <DetailValue>{selectedSupplier.paymentTerms}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <Divider style={{ margin: '18px 0 12px' }} />
            <SectionLabel>Supplier status</SectionLabel>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {['Active', 'On hold', 'Inactive'].map((next) => (
                <Button
                  key={next}
                  $variant={selectedSupplier.status === next ? 'primary' : 'light'}
                  $size="xs"
                  onClick={() => {
                    saveSupplier({ id: selectedSupplier.id, status: next });
                    notify('Supplier updated', `${selectedSupplier.name} marked ${next.toLowerCase()}.`, 'success');
                  }}
                >
                  {next}
                </Button>
              ))}
            </div>
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={deletePoOpen}
        onClose={() => setDeletePoOpen(false)}
        title="Delete purchase order"
        message={selectedPo ? `Delete ${selectedPo.id} raised against ${selectedPo.supplier}?` : ''}
        confirmLabel="Delete PO"
        tone="danger"
        onConfirm={() => {
          if (!selectedPo) return;
          deletePurchaseOrder(selectedPo.id);
          setSelectedPoId(null);
          setDeletePoOpen(false);
          notify('Purchase order deleted', `${selectedPo.id} removed.`, 'success');
        }}
      />

      <ConfirmDialog
        open={deleteSupplierOpen}
        onClose={() => setDeleteSupplierOpen(false)}
        title="Delete supplier"
        message={selectedSupplier ? `Remove ${selectedSupplier.name} from the supplier directory?` : ''}
        confirmLabel="Delete supplier"
        tone="danger"
        onConfirm={() => {
          if (!selectedSupplier) return;
          deleteSupplier(selectedSupplier.id);
          setSelectedSupplierId(null);
          setDeleteSupplierOpen(false);
          notify('Supplier deleted', `${selectedSupplier.name} removed.`, 'success');
        }}
      />
    </div>
  );
}
