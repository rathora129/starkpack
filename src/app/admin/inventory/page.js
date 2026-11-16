'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Download,
  Plus,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  Pencil,
  Trash2,
  History,
  PackageMinus,
  ClipboardList,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import {
  formatCompactINR,
  formatDate,
  formatINR,
  formatNumber,
  stockHealth,
  downloadCSV,
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
  StatusChip,
  ProgressTrack,
  ProgressFill,
  Divider,
  Grid,
} from '@/components/ui/primitives';
import { FilterChips, SearchInput, QuickSelect, Toolbar } from '@/components/ui/Controls';
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
import { DonutChart } from '@/components/ui/charts';

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding-bottom: 16px;

  div {
    min-width: 0;
  }

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

const IconBox = styled.span`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: ${colors.mist};
  color: ${colors.inkSoft};
  flex: 0 0 auto;
`;

const StockBand = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 13px;
  background: ${colors.cream};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  margin-bottom: 16px;

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
    margin-top: 3px;
    font-family: ${fonts.display};
    font-size: 19px;
    font-weight: 500;
    color: ${colors.ink};
  }
`;

const MoveRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 0;
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
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.faint};
    line-height: 1.4;
  }

  em {
    font-style: normal;
    font-size: 11px;
    font-weight: 700;
    color: ${colors.ink};
    white-space: nowrap;
  }
`;

const SectionLabel = styled.p`
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.faint};
  margin-bottom: 9px;
`;

const itemValidation = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  itemType: Yup.string().required(),
  unit: Yup.string().trim().required('Unit is required'),
  onHand: Yup.number().min(0, 'Cannot be negative').required('On hand is required'),
  reorder: Yup.number().min(0, 'Cannot be negative').required('Reorder level is required'),
  unitCost: Yup.number().min(0, 'Cannot be negative').required('Unit cost is required'),
});

const adjustValidation = Yup.object({
  type: Yup.string().required(),
  qty: Yup.number().typeError('Enter a quantity').required('Quantity is required'),
  note: Yup.string().trim().required('Add a reference for the audit trail'),
});

const consumeValidation = Yup.object({
  jobId: Yup.string().required('Select a production job'),
  skuId: Yup.string().required('Select a material'),
  qty: Yup.number().positive('Enter a quantity greater than zero').required('Quantity is required'),
});

const moveTone = (type) => (type === 'Inward' ? 'success' : type === 'Consumption' ? 'info' : 'warning');

const itemCategories = [
  'Paper & board',
  'Inks & coatings',
  'Adhesives',
  'Foils & films',
  'Finished goods',
  'Packing consumables',
];

export default function InventoryPage() {
  const inventory = useDemoStore((state) => state.inventory);
  const stockMovements = useDemoStore((state) => state.stockMovements);
  const production = useDemoStore((state) => state.production);
  const adjustStock = useDemoStore((state) => state.adjustStock);
  const saveInventoryItem = useDemoStore((state) => state.saveInventoryItem);
  const deleteInventoryItem = useDemoStore((state) => state.deleteInventoryItem);
  const consumeForJob = useDemoStore((state) => state.consumeForJob);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [warehouse, setWarehouse] = useState('All');
  const [moveType, setMoveType] = useState('All');
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState(null);
  const [itemOpen, setItemOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [consumeOpen, setConsumeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const selected = inventory.find((item) => item.id === selectedId) || null;
  const editing = inventory.find((item) => item.id === editingId) || null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('adjust') === '1') setAdjustOpen(true);
    const focus = params.get('focus');
    if (focus) {
      const match = useDemoStore.getState().inventory.find((item) => item.id === focus);
      if (match) setSelectedId(match.id);
    }
  }, []);

  const categories = ['All', ...Array.from(new Set(inventory.map((item) => item.category)))];
  const warehouses = ['All', ...Array.from(new Set(inventory.map((item) => item.warehouse)))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (warehouse !== 'All' && item.warehouse !== warehouse) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q)
      );
    });
  }, [inventory, category, warehouse, query]);

  const filteredMovements = useMemo(
    () => stockMovements.filter((move) => moveType === 'All' || move.type === moveType),
    [stockMovements, moveType]
  );

  const value = inventory.reduce((sum, item) => sum + item.onHand * item.unitCost, 0);
  const low = inventory.filter((item) => stockHealth(item).tone !== 'success').length;
  const stockouts = inventory.filter((item) => stockHealth(item).available <= 0).length;

  const byCategory = useMemo(() => {
    const map = new Map();
    inventory.forEach((item) => {
      map.set(item.category, (map.get(item.category) || 0) + item.onHand * item.unitCost);
    });
    const total = Array.from(map.values()).reduce((sum, amount) => sum + amount, 0);
    return Array.from(map.entries()).map(([name, amount]) => ({
      name,
      value: Math.round((amount / total) * 100),
    }));
  }, [inventory]);

  const openAdjust = (item) => {
    setAdjustItem(item);
    setAdjustOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setItemOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setItemOpen(true);
  };

  const itemInitial = editing
    ? {
        itemType: editing.itemType || 'Raw material',
        name: editing.name,
        category: editing.category,
        unit: editing.unit,
        onHand: editing.onHand,
        allocated: editing.allocated,
        reorder: editing.reorder,
        unitCost: editing.unitCost,
        supplier: editing.supplier,
        warehouse: editing.warehouse,
        leadTime: editing.leadTime,
      }
    : {
        itemType: 'Raw material',
        name: '',
        category: 'Paper & board',
        unit: 'kg',
        onHand: '',
        allocated: '',
        reorder: '',
        unitCost: '',
        supplier: '',
        warehouse: 'Mumbai Plant 1',
        leadTime: 7,
      };

  const columns = [
    {
      key: 'sku',
      label: 'SKU',
      width: '24%',
      render: (item) => (
        <>
          <CellPrimary>{item.name}</CellPrimary>
          <CellSecondary>
            {item.id} · {item.category}
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'onHand',
      label: 'On hand',
      align: 'right',
      render: (item) => <CellStrong>{formatNumber(item.onHand)}</CellStrong>,
    },
    {
      key: 'allocated',
      label: 'Allocated',
      align: 'right',
      render: (item) => (
        <span style={{ color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>{formatNumber(item.allocated)}</span>
      ),
    },
    {
      key: 'available',
      label: 'Available',
      align: 'right',
      render: (item) => {
        const health = stockHealth(item);
        return (
          <CellStrong style={{ color: health.tone === 'danger' ? colors.danger : colors.ink }}>
            {formatNumber(health.available)}
          </CellStrong>
        );
      },
    },
    {
      key: 'health',
      label: 'Health',
      render: (item) => {
        const health = stockHealth(item);
        return <StatusChip $tone={health.tone}>{health.label}</StatusChip>;
      },
    },
    {
      key: 'cost',
      label: 'Stock value',
      align: 'right',
      render: (item) => <CellStrong>{formatCompactINR(item.onHand * item.unitCost)}</CellStrong>,
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (item) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{item.supplier}</CellPrimary>
          <CellSecondary>{item.leadTime} day lead time</CellSecondary>
        </>
      ),
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      render: (item) => <CellSecondary style={{ marginTop: 0 }}>{item.warehouse}</CellSecondary>,
    },
  ];

  const movementColumns = [
    {
      key: 'id',
      label: 'Movement',
      render: (move) => (
        <>
          <CellPrimary>{move.id}</CellPrimary>
          <CellSecondary>{formatDate(move.date)}</CellSecondary>
        </>
      ),
    },
    {
      key: 'sku',
      label: 'SKU',
      render: (move) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{move.sku}</CellPrimary>
          <CellSecondary>{move.skuId}</CellSecondary>
        </>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (move) => <StatusChip $tone={moveTone(move.type)}>{move.type}</StatusChip>,
    },
    {
      key: 'qty',
      label: 'Quantity',
      align: 'right',
      render: (move) => (
        <CellStrong>
          {move.type === 'Inward' ? '+' : '−'}
          {formatNumber(move.qty)} {move.unit}
        </CellStrong>
      ),
    },
    {
      key: 'reference',
      label: 'Reference',
      render: (move) => <CellSecondary style={{ marginTop: 0 }}>{move.reference}</CellSecondary>,
    },
    {
      key: 'balance',
      label: 'Balance',
      align: 'right',
      render: (move) => <CellStrong>{formatNumber(move.balance)}</CellStrong>,
    },
  ];

  const exportStock = () => {
    downloadCSV(
      'stark-packmate-inventory.csv',
      ['SKU', 'Name', 'Category', 'Unit', 'On hand', 'Allocated', 'Reorder level', 'Unit cost', 'Supplier', 'Warehouse'],
      filtered.map((item) => [
        item.id,
        item.name,
        item.category,
        item.unit,
        item.onHand,
        item.allocated,
        item.reorder,
        item.unitCost,
        item.supplier,
        item.warehouse,
      ])
    );
    notify('Inventory exported', `${filtered.length} SKUs downloaded as CSV.`, 'success');
  };

  const selectedMoves = selected ? stockMovements.filter((move) => move.skuId === selected.id).slice(0, 6) : [];

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Inventory</PageHeading>
          <PageDescription>
            Raw material and finished goods across three warehouses — stock in/out, job
            consumption, reorder exposure and supplier lead times.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="light" $size="sm" onClick={exportStock}>
            <Download size={14} /> Export
          </Button>
          <Button $variant="light" $size="sm" onClick={() => setConsumeOpen(true)}>
            <PackageMinus size={14} /> Issue to job
          </Button>
          <Button $variant="primary" $size="sm" onClick={openCreate}>
            <Plus size={14} /> New SKU
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Inventory value', value: formatCompactINR(value), hint: 'At standard unit cost' },
          { label: 'SKUs tracked', value: inventory.length, hint: 'Paper, board, inks, foils' },
          { label: 'Below reorder', value: low, hint: 'Raise purchase orders', tone: low > 3 ? 'warning' : undefined },
          { label: 'Stockouts', value: stockouts, hint: 'No available quantity', tone: stockouts ? 'danger' : undefined },
        ]}
      />

      <div style={{ height: 18 }} />

      <Grid $cols="minmax(0, 1fr) 320px" $colsMd="minmax(0, 1fr)" $colsSm="minmax(0, 1fr)">
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Stock register</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                {filtered.length} of {inventory.length} SKUs
              </div>
            </div>
            <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
              <SearchInput value={query} onChange={setQuery} placeholder="Search SKU or supplier…" />
              <QuickSelect
                label="Warehouse"
                value={warehouse}
                onChange={setWarehouse}
                options={warehouses.map((name) => ({ value: name, label: name === 'All' ? 'All warehouses' : name }))}
              />
            </Toolbar>
          </PanelHeader>
          <div style={{ padding: '12px 16px 0' }}>
            <FilterChips
              options={categories.map((name) => ({
                value: name,
                label: name === 'All' ? 'All categories' : name,
                count: name === 'All' ? inventory.length : inventory.filter((item) => item.category === name).length,
              }))}
              value={category}
              onChange={setCategory}
            />
          </div>
          <PanelBody $flush>
            <DataTable
              columns={columns}
              rows={filtered}
              onRowClick={(item) => setSelectedId(item.id)}
              minWidth="980px"
              footer={<span>{filtered.length} SKUs · click a row for stock detail and movement history</span>}
            />
          </PanelBody>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Value by category</PanelTitle>
                <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>Share of stock value</div>
              </div>
            </PanelHeader>
            <PanelBody>
              <DonutChart data={byCategory} height={176} centerValue={formatCompactINR(value)} centerLabel="On-hand value" />
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Reorder watchlist</PanelTitle>
                <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                  {low} SKUs need attention
                </div>
              </div>
            </PanelHeader>
            <PanelBody>
              {inventory
                .filter((item) => stockHealth(item).tone !== 'success')
                .slice(0, 5)
                .map((item) => {
                  const health = stockHealth(item);
                  return (
                    <div key={item.id} style={{ padding: '9px 0', borderBottom: `1px solid ${colors.lineSoft}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: colors.ink }}>{item.name}</span>
                        <StatusChip $tone={health.tone}>{health.label}</StatusChip>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <ProgressTrack>
                          <ProgressFill
                            $value={Math.min(100, (health.available / item.reorder) * 100)}
                            $tone={health.tone === 'danger' ? 'danger' : 'warning'}
                          />
                        </ProgressTrack>
                        <span style={{ fontSize: 9.5, color: colors.faint, whiteSpace: 'nowrap' }}>
                          {formatNumber(health.available)}/{formatNumber(item.reorder)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              <Button
                $variant="light"
                $size="xs"
                style={{ marginTop: 12 }}
                $full
                onClick={() => openAdjust(inventory.find((item) => stockHealth(item).tone !== 'success') || inventory[0])}
              >
                <ArrowDownToLine size={13} /> Record receipt
              </Button>
            </PanelBody>
          </Panel>
        </div>
      </Grid>

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Stock movements</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filteredMovements.length} movements · inward, outward and job consumption
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <FilterChips
              options={['All', 'Inward', 'Outward', 'Consumption'].map((name) => ({
                value: name,
                label: name,
                count: name === 'All' ? stockMovements.length : stockMovements.filter((move) => move.type === name).length,
              }))}
              value={moveType}
              onChange={setMoveType}
            />
          </Toolbar>
        </PanelHeader>
        <PanelBody $flush>
          <DataTable
            columns={movementColumns}
            rows={filteredMovements}
            minWidth="860px"
            footer={<span>{filteredMovements.length} movements in the audit trail</span>}
          />
        </PanelBody>
      </Panel>

      <AppModal
        open={itemOpen}
        onClose={() => setItemOpen(false)}
        title={editing ? `Edit ${editing.id}` : 'New inventory SKU'}
        description="Raw materials and finished goods share the same stock register."
        size="lg"
      >
        <Formik
          initialValues={itemInitial}
          validationSchema={itemValidation}
          enableReinitialize
          onSubmit={(values) => {
            const saved = saveInventoryItem({
              ...(editing ? { id: editing.id } : {}),
              itemType: values.itemType,
              name: values.name,
              category: values.category,
              unit: values.unit,
              onHand: Number(values.onHand),
              allocated: Number(values.allocated) || 0,
              reorder: Number(values.reorder),
              unitCost: Number(values.unitCost),
              supplier: values.supplier,
              warehouse: values.warehouse,
              leadTime: Number(values.leadTime) || 0,
            });
            notify(
              editing ? 'SKU updated' : 'SKU created',
              `${saved.id} · ${saved.name} saved to inventory.`,
              'success'
            );
            setItemOpen(false);
            setSelectedId(saved.id);
          }}
        >
          <Form>
            <FormGrid $cols={2}>
              <SelectField name="itemType" label="Item type" options={['Raw material', 'Finished goods']} />
              <TextField name="name" label="Name" placeholder="Kraft Liner 120 GSM" required />
              <SelectField name="category" label="Category" options={itemCategories} />
              <TextField name="unit" label="Unit" placeholder="kg / sheets / rolls / pcs" required />
              <TextField name="onHand" label="On hand" type="number" placeholder="12000" required />
              <TextField name="allocated" label="Allocated" type="number" placeholder="2400" />
              <TextField name="reorder" label="Reorder level" type="number" placeholder="6000" required />
              <TextField name="unitCost" label="Unit cost" type="number" prefix="₹" placeholder="52" required />
              <TextField name="supplier" label="Supplier" placeholder="Gujarat Paper Mills" />
              <SelectField
                name="warehouse"
                label="Warehouse"
                options={['Mumbai Plant 1', 'Pune Plant 2', 'Chakan Warehouse']}
              />
              <TextField name="leadTime" label="Lead time (days)" type="number" placeholder="7" />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setItemOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editing ? 'Save SKU' : 'Create SKU'}
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        title="Stock adjustment"
        description="Adjustments are auditable and reflected in inventory value instantly."
      >
        <Formik
          initialValues={{ itemId: adjustItem?.id || inventory[0].id, type: 'Receipt', qty: '', note: '' }}
          validationSchema={adjustValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            const qty = Number(values.qty);
            const delta =
              values.type === 'Reconciliation' ? qty : values.type === 'Receipt' ? Math.abs(qty) : -Math.abs(qty);
            adjustStock(values.itemId, delta, values.note);
            const item = inventory.find((entry) => entry.id === values.itemId);
            notify(
              'Stock adjusted',
              `${values.type} posted for ${item?.name}: ${delta > 0 ? '+' : ''}${formatNumber(delta)} ${item?.unit}.`,
              'success'
            );
            setAdjustOpen(false);
            helpers.resetForm();
          }}
        >
          {({ values }) => {
            const item = inventory.find((entry) => entry.id === values.itemId);
            return (
              <Form>
                <SelectField
                  name="itemId"
                  label="SKU"
                  options={inventory.map((entry) => ({ value: entry.id, label: `${entry.name} (${entry.id})` }))}
                />
                <div style={{ height: 14 }} />
                <FormGrid $cols={2}>
                  <SelectField name="type" label="Adjustment" options={['Receipt', 'Issue', 'Reconciliation']} />
                  <TextField
                    name="qty"
                    label={
                      values.type === 'Reconciliation'
                        ? `Signed quantity (${item?.unit || 'units'})`
                        : `Quantity (${item?.unit || 'units'})`
                    }
                    type="number"
                    placeholder="500"
                  />
                </FormGrid>
                <div style={{ height: 14 }} />
                <TextField name="note" label="Reference / reason" placeholder="GRN-1182 · Gujarat Paper Mills" />
                {item ? (
                  <p style={{ marginTop: 12, fontSize: 11, color: colors.muted }}>
                    Current on hand: <strong>{formatNumber(item.onHand)} {item.unit}</strong> · available{' '}
                    <strong>{formatNumber(item.onHand - item.allocated)} {item.unit}</strong>
                  </p>
                ) : null}
                <FormActions>
                  <Button type="button" $variant="secondary" $size="sm" onClick={() => setAdjustOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" $variant="primary" $size="sm">
                    Post adjustment
                  </Button>
                </FormActions>
              </Form>
            );
          }}
        </Formik>
      </AppModal>

      <AppModal
        open={consumeOpen}
        onClose={() => setConsumeOpen(false)}
        title="Issue material to job"
        description="Consumption reduces on-hand and allocated quantity and posts to the movement ledger."
      >
        <Formik
          initialValues={{
            jobId: production[0]?.id || '',
            skuId: inventory.find((item) => item.itemType !== 'Finished goods')?.id || inventory[0]?.id || '',
            qty: '',
          }}
          validationSchema={consumeValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            const movement = consumeForJob(values.jobId, values.skuId, Number(values.qty));
            if (movement) {
              notify(
                'Material issued',
                `${formatNumber(movement.qty)} ${movement.unit} of ${movement.sku} issued to ${values.jobId}.`,
                'success'
              );
            }
            setConsumeOpen(false);
            helpers.resetForm();
          }}
        >
          {({ values }) => {
            const item = inventory.find((entry) => entry.id === values.skuId);
            return (
              <Form>
                <SelectField
                  name="jobId"
                  label="Production job"
                  options={production.map((job) => ({
                    value: job.id,
                    label: `${job.id} · ${job.customer} · ${job.product}`,
                  }))}
                />
                <div style={{ height: 14 }} />
                <SelectField
                  name="skuId"
                  label="Material"
                  options={inventory
                    .filter((entry) => entry.itemType !== 'Finished goods')
                    .map((entry) => ({ value: entry.id, label: `${entry.name} (${entry.id})` }))}
                />
                <div style={{ height: 14 }} />
                <TextField
                  name="qty"
                  label={`Quantity (${item?.unit || 'units'})`}
                  type="number"
                  placeholder="250"
                />
                {item ? (
                  <p style={{ marginTop: 12, fontSize: 11, color: colors.muted }}>
                    Available to issue: <strong>{formatNumber(item.onHand - item.allocated)} {item.unit}</strong>
                  </p>
                ) : null}
                <FormActions>
                  <Button type="button" $variant="secondary" $size="sm" onClick={() => setConsumeOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" $variant="primary" $size="sm">
                    <PackageMinus size={14} /> Issue material
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
        title={selected ? selected.name : ''}
        description={selected ? `${selected.id} · ${selected.category}` : ''}
        width="560px"
        footer={
          selected ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setSelectedId(null)}>
                Close
              </Button>
              <Button $variant="light" $size="sm" onClick={() => openEdit(selected)}>
                <Pencil size={14} /> Edit
              </Button>
              <Button $variant="light" $size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 size={14} /> Delete
              </Button>
              <Button
                $variant="primary"
                $size="sm"
                onClick={() => {
                  openAdjust(selected);
                  setSelectedId(null);
                }}
              >
                <Plus size={14} /> Adjust stock
              </Button>
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <Head>
              <IconBox>
                <Boxes size={20} />
              </IconBox>
              <div>
                <strong>{selected.supplier}</strong>
                <span>
                  {selected.warehouse} · {selected.leadTime} day lead time
                </span>
              </div>
              <StatusChip $tone={stockHealth(selected).tone} style={{ marginLeft: 'auto' }}>
                {stockHealth(selected).label}
              </StatusChip>
            </Head>

            <StockBand>
              <div>
                <span>On hand</span>
                <strong>{formatNumber(selected.onHand)}</strong>
              </div>
              <div>
                <span>Allocated</span>
                <strong>{formatNumber(selected.allocated)}</strong>
              </div>
              <div>
                <span>Available</span>
                <strong>{formatNumber(selected.onHand - selected.allocated)}</strong>
              </div>
            </StockBand>

            <ProgressTrack>
              <ProgressFill
                $value={Math.min(100, ((selected.onHand - selected.allocated) / Math.max(1, selected.reorder)) * 100)}
                $tone={stockHealth(selected).tone === 'danger' ? 'danger' : stockHealth(selected).tone === 'warning' ? 'warning' : undefined}
              />
            </ProgressTrack>
            <p style={{ fontSize: 10.5, color: colors.faint, marginTop: 5 }}>
              Reorder level {formatNumber(selected.reorder)} {selected.unit} · {selected.itemType}
            </p>

            <Divider style={{ margin: '18px 0' }} />

            <DetailGrid>
              <DetailItem>
                <DetailLabel>Unit cost</DetailLabel>
                <DetailValue>{formatINR(selected.unitCost)} / {selected.unit}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Stock value</DetailLabel>
                <DetailValue>{formatCompactINR(selected.onHand * selected.unitCost)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Warehouse</DetailLabel>
                <DetailValue>{selected.warehouse}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Supplier</DetailLabel>
                <DetailValue>{selected.supplier}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Category</DetailLabel>
                <DetailValue>{selected.category}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Lead time</DetailLabel>
                <DetailValue>{selected.leadTime} days</DetailValue>
              </DetailItem>
            </DetailGrid>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button
                $variant="light"
                $size="xs"
                onClick={() => {
                  adjustStock(selected.id, selected.reorder, 'Demo replenishment receipt');
                  notify('Receipt posted', `Replenished ${selected.name}.`, 'success');
                }}
              >
                <ArrowDownToLine size={13} /> Receive reorder qty
              </Button>
              <Button
                $variant="ghost"
                $size="xs"
                onClick={() => {
                  adjustStock(selected.id, -100, 'Demo production issue');
                  notify('Issue posted', `Issued 100 ${selected.unit} to production.`, 'info');
                }}
              >
                <ArrowUpFromLine size={13} /> Issue 100
              </Button>
            </div>

            <Divider style={{ margin: '18px 0 12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionLabel style={{ marginBottom: 0 }}>
                <History size={12} style={{ verticalAlign: -2, marginRight: 5 }} />
                Recent movements
              </SectionLabel>
              <span style={{ fontSize: 10.5, color: colors.faint }}>
                {stockMovements.filter((move) => move.skuId === selected.id).length} total
              </span>
            </div>
            <div style={{ marginTop: 4 }}>
              {selectedMoves.map((move) => (
                <MoveRow key={move.id}>
                  <div>
                    <strong>{move.reference}</strong>
                    <span>
                      {formatDate(move.date)} · balance {formatNumber(move.balance)} {move.unit}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <em>
                      {move.type === 'Inward' ? '+' : '−'}
                      {formatNumber(move.qty)}
                    </em>
                    <StatusChip $tone={moveTone(move.type)} style={{ marginTop: 4 }}>
                      {move.type}
                    </StatusChip>
                  </div>
                </MoveRow>
              ))}
              {selectedMoves.length === 0 ? (
                <p style={{ fontSize: 11, color: colors.faint, padding: '10px 0' }}>
                  <ClipboardList size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
                  No movements recorded for this SKU yet.
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete SKU"
        message={
          selected
            ? `Remove ${selected.id} · ${selected.name} from inventory? Historical stock movements stay in the ledger.`
            : ''
        }
        confirmLabel="Delete SKU"
        tone="danger"
        onConfirm={() => {
          if (!selected) return;
          deleteInventoryItem(selected.id);
          setSelectedId(null);
          setDeleteOpen(false);
          notify('SKU deleted', `${selected.name} removed from inventory.`, 'success');
        }}
      />
    </div>
  );
}
