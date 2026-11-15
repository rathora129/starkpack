'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Plus,
  ArrowRight,
  CalendarDays,
  Cog,
  Timer,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  ClipboardCheck,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { productionStages } from '@/data/admin';
import { formatDate, formatNumber, statusTone, plusDaysISO } from '@/lib/format';
import { colors, radii, shadows } from '@/lib/theme';
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
} from '@/components/ui/primitives';
import { FilterChips, SearchInput, Toolbar } from '@/components/ui/Controls';
import {
  AppModal,
  Drawer,
  ConfirmDialog,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
} from '@/components/ui/Overlay';
import { TextField, TextAreaField, SelectField, FormGrid, FormActions } from '@/components/ui/FormFields';
import { RadialGauge, BarsChart } from '@/components/ui/charts';
import MiniStats from '@/components/dashboard/MiniStats';

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(158px, 1fr));
  gap: 11px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(7, 188px);
  }
`;

const Column = styled.div`
  background: ${colors.mist};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  padding: 9px;
  min-height: 280px;
`;

const ColumnHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px 9px;
  gap: 5px;

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
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

const JobCard = styled.button`
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.sm};
  padding: 10px;
  margin-bottom: 7px;
  box-shadow: ${shadows.xs};
  transition: border-color 140ms ease, transform 140ms ease;

  &:hover {
    border-color: #CFC9BB;
    transform: translateY(-1px);
  }

  strong {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: ${colors.ink};
  }

  p {
    margin-top: 1px;
    font-size: 10px;
    color: ${colors.muted};
    line-height: 1.4;
  }
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 7px;
  font-size: 9px;
  color: ${colors.faint};

  em {
    font-style: normal;
    font-weight: 700;
    color: ${colors.copperDeep};
  }
`;

const CheckRow = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  text-align: left;
  padding: 9px 10px;
  margin-bottom: 6px;
  border-radius: ${radii.sm};
  border: 1px solid ${({ $done }) => ($done ? '#CFE6DA' : colors.lineSoft)};
  background: ${({ $done }) => ($done ? colors.successBg : '#fff')};
  color: ${({ $done }) => ($done ? colors.inkSoft : colors.muted)};
  font-size: 11.5px;
  transition: background 120ms ease, border-color 120ms ease;

  svg {
    flex-shrink: 0;
    color: ${({ $done }) => ($done ? colors.success : colors.faint)};
  }

  span {
    line-height: 1.4;
    text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
  }

  &:hover {
    border-color: ${({ $done }) => ($done ? '#B7D8C7' : '#CFC9BB')};
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

const MachineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:last-child {
    border-bottom: 0;
  }

  div:first-child {
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
    font-size: 9.5px;
    color: ${colors.faint};
  }

  em {
    font-style: normal;
    font-size: 11px;
    font-weight: 700;
    color: ${colors.ink};
    width: 36px;
    text-align: right;
  }
`;

const validation = Yup.object({
  customer: Yup.string().trim().required('Customer is required'),
  product: Yup.string().trim().required('Product is required'),
  quantity: Yup.number().positive('Quantity required').required('Quantity required'),
  machine: Yup.string().required('Select a machine'),
  due: Yup.string().required('Due date is required'),
  deadline: Yup.string().required('Deadline is required'),
});

const machines = [
  'Heidelberg XL 106',
  'Heidelberg CX 104',
  'Bobst Novacut 106',
  'Folder Gluer 1',
  'Folder Gluer 2',
  'Rigid Box Line 1',
  'Esko Prepress',
  'QC Lab 1',
  'Dispatch Bay 1',
];

const operators = ['R. Patil', 'S. Gaikwad', 'A. Shaikh', 'M. Fernandes', 'D. Malhotra', 'P. Nair'];

export default function ProductionPage() {
  const jobs = useDemoStore((state) => state.production);
  const orders = useDemoStore((state) => state.orders);
  const moveJob = useDemoStore((state) => state.moveJob);
  const addProductionJob = useDemoStore((state) => state.addProductionJob);
  const updateProductionJob = useDemoStore((state) => state.updateProductionJob);
  const deleteProductionJob = useDemoStore((state) => state.deleteProductionJob);
  const toggleJobChecklist = useDemoStore((state) => state.toggleJobChecklist);

  const [query, setQuery] = useState('');
  const [shift, setShift] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const selected = jobs.find((job) => job.id === selectedId) || null;
  const editing = jobs.find((job) => job.id === editingId) || null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (shift !== 'All' && job.shift !== shift) return false;
      if (!q) return true;
      return (
        job.id.toLowerCase().includes(q) ||
        job.customer.toLowerCase().includes(q) ||
        job.product.toLowerCase().includes(q) ||
        job.machine.toLowerCase().includes(q) ||
        (job.operator || '').toLowerCase().includes(q)
      );
    });
  }, [jobs, shift, query]);

  const wip = jobs.filter((job) => job.stage !== 'Dispatch').length;
  const dispatch = jobs.filter((job) => job.stage === 'Dispatch').length;
  const avgProgress = Math.round(jobs.reduce((sum, job) => sum + job.progress, 0) / Math.max(1, jobs.length));
  const urgent = jobs.filter((job) => job.priority === 'Urgent').length;

  const machineUse = useMemo(() => {
    const map = new Map();
    jobs.forEach((job) => {
      const current = map.get(job.machine) || { machine: job.machine, jobs: 0, qty: 0 };
      current.jobs += 1;
      current.qty += job.quantity;
      map.set(job.machine, current);
    });
    return Array.from(map.values())
      .map((entry) => ({
        ...entry,
        use: Math.min(98, 46 + entry.jobs * 11),
      }))
      .sort((a, b) => b.use - a.use)
      .slice(0, 5);
  }, [jobs]);

  const columns = productionStages.map((stage) => ({
    ...stage,
    jobs: filtered.filter((job) => job.stage === stage.id),
  }));

  const checklist = selected?.checklist || [];
  const checklistDone = checklist.filter((item) => item.done).length;

  const openCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (job) => {
    setEditingId(job.id);
    setFormOpen(true);
  };

  const shiftJob = (job, stage, label = stage) => {
    moveJob(job.id, stage);
    notify('Job moved', `${job.id} moved to ${label}.`, 'success');
  };

  const advance = () => {
    if (!selected) return;
    const index = productionStages.findIndex((stage) => stage.id === selected.stage);
    if (index < productionStages.length - 1) {
      shiftJob(selected, productionStages[index + 1].id, productionStages[index + 1].label);
    } else {
      notify('Job complete', `${selected.id} is already at dispatch.`, 'info');
    }
  };

  const initialValues = editing
    ? {
        customer: editing.customer,
        product: editing.product,
        quantity: editing.quantity,
        stage: editing.stage,
        machine: editing.machine,
        operator: editing.operator,
        shift: editing.shift,
        due: editing.due,
        deadline: editing.deadline || editing.due,
        priority: editing.priority || 'Medium',
        notes: editing.notes || '',
      }
    : {
        customer: '',
        product: '',
        quantity: '',
        stage: 'Pending',
        machine: 'Esko Prepress',
        operator: 'D. Malhotra',
        shift: 'A',
        due: plusDaysISO(14),
        deadline: plusDaysISO(12),
        priority: 'Medium',
        notes: '',
      };

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Production</PageHeading>
          <PageDescription>
            Live plant floor across Mumbai, Pune and Chakan — press schedules, die-cutting,
            gluing, quality and dispatch in one board.
          </PageDescription>
        </div>
        <PageActions>
          <Button
            $variant="light"
            $size="sm"
            onClick={() => notify('Shift report', 'Plant shift handover report is ready in Reports.', 'info')}
          >
            <Timer size={14} /> Shift handover
          </Button>
          <Button $variant="primary" $size="sm" onClick={openCreate}>
            <Plus size={14} /> Release job
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Jobs in WIP', value: wip, hint: 'Across 7 production stages' },
          { label: 'Average progress', value: `${avgProgress}%`, hint: 'Weighted by quantity' },
          { label: 'Ready to dispatch', value: dispatch, hint: 'Cleared by QC' },
          { label: 'Urgent jobs', value: urgent, hint: 'Expedite with plant heads', tone: urgent ? 'danger' : undefined },
        ]}
      />

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Plant floor board</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filtered.length} jobs scheduled · click a job for the job card, checklist and stage moves
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search job, customer, machine…" />
          </Toolbar>
        </PanelHeader>
        <div style={{ padding: '12px 16px 16px' }}>
          <FilterChips
            options={['All', 'A', 'B', 'C', 'General'].map((name) => ({
              value: name,
              label: name === 'All' ? 'All shifts' : name === 'General' ? 'General shift' : `Shift ${name}`,
              count: name === 'All' ? jobs.length : jobs.filter((job) => job.shift === name).length,
            }))}
            value={shift}
            onChange={setShift}
          />
        </div>
        <PanelBody>
          <Board>
            {columns.map((column) => (
              <Column key={column.id}>
                <ColumnHead>
                  <span>{column.label}</span>
                  <em>{column.jobs.length}</em>
                </ColumnHead>
                {column.jobs.map((job) => (
                  <JobCard key={job.id} onClick={() => setSelectedId(job.id)}>
                    <strong>{job.id}</strong>
                    <p>{job.customer}</p>
                    <p style={{ color: colors.faint }}>
                      {job.product} · {formatNumber(job.quantity)}
                    </p>
                    <ProgressTrack>
                      <ProgressFill $value={job.progress} />
                    </ProgressTrack>
                    <JobMeta>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <CalendarDays size={8} /> {formatDate(job.due, { year: undefined })}
                      </span>
                      <em>Shift {job.shift}</em>
                    </JobMeta>
                  </JobCard>
                ))}
                {column.jobs.length === 0 ? (
                  <p style={{ fontSize: 10, color: colors.faint, textAlign: 'center', padding: '18px 4px' }}>
                    Idle
                  </p>
                ) : null}
              </Column>
            ))}
          </Board>
        </PanelBody>
      </Panel>

      <div style={{ height: 18 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 18 }}>
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Machine utilisation</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Scheduled load against available shifts this week
              </div>
            </div>
          </PanelHeader>
          <PanelBody>
            {machineUse.map((machine) => (
              <MachineRow key={machine.machine}>
                <div>
                  <strong>{machine.machine}</strong>
                  <span>
                    {machine.jobs} jobs · {formatNumber(machine.qty)} units
                  </span>
                  <ProgressTrack style={{ marginTop: 5 }}>
                    <ProgressFill
                      $value={machine.use}
                      $tone={machine.use > 90 ? 'danger' : machine.use > 80 ? 'warning' : undefined}
                    />
                  </ProgressTrack>
                </div>
                <em>{machine.use}%</em>
              </MachineRow>
            ))}
          </PanelBody>
          <PanelFooter>
            <span style={{ fontSize: 10.5, color: colors.faint }}>
              <Cog size={11} style={{ verticalAlign: -1, marginRight: 4 }} />
              Planned maintenance Sunday 06:00–10:00
            </span>
            <StatusChip $tone="success">6 lines running</StatusChip>
          </PanelFooter>
        </Panel>

        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>On-time outlook</PanelTitle>
              <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
                Dispatch confidence for the next 7 days
              </div>
            </div>
          </PanelHeader>
          <PanelBody>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <RadialGauge value={96} label="On time" size={118} />
              <div>
                <p style={{ fontSize: 12, color: colors.inkSoft, lineHeight: 1.6 }}>
                  <strong>96.8%</strong> of orders are tracking to promise date.
                </p>
                <p style={{ fontSize: 11, color: colors.muted, marginTop: 6, lineHeight: 1.6 }}>
                  Watch the quality holds and labour reallocations flagged on the board.
                </p>
              </div>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <BarsChart
              data={[
                { day: 'Mon', jobs: 4 },
                { day: 'Tue', jobs: 6 },
                { day: 'Wed', jobs: 3 },
                { day: 'Thu', jobs: 7 },
                { day: 'Fri', jobs: 5 },
                { day: 'Sat', jobs: 2 },
              ]}
              xKey="day"
              height={150}
              series={[{ key: 'jobs', label: 'Dispatches', color: colors.copper }]}
              formatter={(value) => `${value} dispatches`}
            />
          </PanelBody>
        </Panel>
      </div>

      <AppModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.id}` : 'Release production job'}
        description={
          editing
            ? 'Update the job card, ownership, machine and deadlines.'
            : 'Released jobs appear on the plant floor board immediately.'
        }
        size="lg"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            if (editing) {
              updateProductionJob(editing.id, {
                customer: values.customer,
                product: values.product,
                quantity: Number(values.quantity),
                machine: values.machine,
                operator: values.operator,
                assignedTo: values.operator,
                shift: values.shift,
                due: values.due,
                deadline: values.deadline,
                priority: values.priority,
                notes: values.notes,
              });
              if (values.stage !== editing.stage) {
                moveJob(editing.id, values.stage);
              }
              notify('Job updated', `${editing.id} saved to the plant floor.`, 'success');
            } else {
              const job = addProductionJob(values);
              notify('Job released', `${job.id} for ${job.customer} added to the plant floor.`, 'success');
              setSelectedId(job.id);
            }
            setFormOpen(false);
          }}
        >
          <Form>
            <FormGrid $cols={2}>
              <SelectField
                name="customer"
                label="Customer"
                placeholder="Select or type a customer"
                required
                options={orders.map((order) => ({ value: order.customer, label: order.customer }))}
              />
              <TextField name="product" label="Product" placeholder="Premium mailer box" required />
              <TextField name="quantity" label="Quantity" type="number" placeholder="12000" required />
              <SelectField name="stage" label="Stage" options={productionStages.map((stage) => stage.id)} />
              <SelectField name="machine" label="Machine" options={machines} required />
              <SelectField name="operator" label="Assign to" options={operators} />
              <SelectField name="shift" label="Shift" options={['A', 'B', 'C', 'General']} />
              <SelectField name="priority" label="Priority" options={['Urgent', 'High', 'Medium', 'Low']} />
              <TextField name="due" label="Due date" type="date" required />
              <TextField name="deadline" label="Internal deadline" type="date" required />
              <div style={{ gridColumn: '1 / -1' }}>
                <TextAreaField
                  name="notes"
                  label="Job notes"
                  rows={2}
                  placeholder="Special finishing, ink match, delivery constraints…"
                />
              </div>
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editing ? 'Save job' : 'Release job'} <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.id : ''}
        description={selected ? `${selected.customer} · ${selected.product}` : ''}
        width="540px"
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
              <Button $variant="primary" $size="sm" onClick={advance}>
                <ArrowRight size={14} /> Advance stage
              </Button>
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              <StatusChip $tone={statusTone(selected.stage)}>{selected.stage}</StatusChip>
              <StatusChip $tone={statusTone(selected.priority)}>{selected.priority}</StatusChip>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: colors.muted }}>
                {selected.progress}% complete
              </span>
            </div>
            <ProgressTrack>
              <ProgressFill $value={selected.progress} />
            </ProgressTrack>

            <DetailGrid style={{ marginTop: 20 }}>
              <DetailItem>
                <DetailLabel>Order</DetailLabel>
                <DetailValue>{selected.orderId || '—'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Quantity</DetailLabel>
                <DetailValue>{formatNumber(selected.quantity)} units</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Machine</DetailLabel>
                <DetailValue>{selected.machine}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Assigned to</DetailLabel>
                <DetailValue>{selected.assignedTo || selected.operator}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Shift</DetailLabel>
                <DetailValue>{selected.shift}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Due date</DetailLabel>
                <DetailValue>{formatDate(selected.due)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Internal deadline</DetailLabel>
                <DetailValue>{formatDate(selected.deadline || selected.due)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Last updated</DetailLabel>
                <DetailValue>{formatDate(selected.updated)}</DetailValue>
              </DetailItem>
            </DetailGrid>

            {selected.notes ? (
              <div
                style={{
                  marginTop: 14,
                  padding: '10px 12px',
                  background: colors.cream,
                  border: `1px solid ${colors.lineSoft}`,
                  borderRadius: radii.sm,
                  fontSize: 11.5,
                  color: colors.inkSoft,
                  lineHeight: 1.55,
                }}
              >
                {selected.notes}
              </div>
            ) : null}

            <Divider style={{ margin: '18px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionLabel style={{ marginBottom: 0 }}>
                <ClipboardCheck size={12} style={{ verticalAlign: -2, marginRight: 5 }} />
                Quality checklist
              </SectionLabel>
              <span style={{ fontSize: 10.5, color: colors.muted, fontWeight: 700 }}>
                {checklistDone}/{checklist.length || 0} verified
              </span>
            </div>
            <ProgressTrack style={{ margin: '8px 0 14px' }}>
              <ProgressFill $value={checklist.length ? (checklistDone / checklist.length) * 100 : 0} />
            </ProgressTrack>
            {checklist.map((item) => (
              <CheckRow
                key={item.id}
                type="button"
                $done={item.done}
                onClick={() => toggleJobChecklist(selected.id, item.id)}
              >
                {item.done ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                <span>{item.label}</span>
              </CheckRow>
            ))}

            <Divider style={{ margin: '18px 0' }} />
            <SectionLabel>Move to stage</SectionLabel>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {productionStages.map((stage) => (
                <Button
                  key={stage.id}
                  $variant={stage.id === selected.stage ? 'primary' : 'light'}
                  $size="xs"
                  onClick={() => {
                    if (stage.id !== selected.stage) shiftJob(selected, stage.id, stage.label);
                  }}
                >
                  {stage.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete job card"
        message={
          selected
            ? `Remove ${selected.id} from the plant floor? The order stays on the order book, but the job card and its checklist are removed.`
            : ''
        }
        confirmLabel="Delete job"
        tone="danger"
        onConfirm={() => {
          if (!selected) return;
          deleteProductionJob(selected.id);
          setSelectedId(null);
          setDeleteOpen(false);
          notify('Job deleted', `${selected.id} removed from production.`, 'success');
        }}
      />
    </div>
  );
}
