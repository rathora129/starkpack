'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Upload,
  CheckCircle2,
  MessageSquareWarning,
  FileUp,
  Palette,
  Layers,
  Clock,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Send,
  XCircle,
  History,
  UserRound,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { formatDate, formatDateTime, statusTone, timeAgo, plusDaysISO } from '@/lib/format';
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
import MiniStats from '@/components/dashboard/MiniStats';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const ArtCard = styled.button`
  text-align: left;
  background: #fff;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.lg};
  overflow: hidden;
  box-shadow: ${shadows.xs};
  transition: box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease;

  &:hover {
    box-shadow: ${shadows.card};
    transform: translateY(-2px);
    border-color: #D6D0C2;
  }
`;

const Preview = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  background: ${colors.mist};
  overflow: hidden;

  img {
    object-fit: cover;
    transition: transform 320ms ease;
  }

  ${ArtCard}:hover & img {
    transform: scale(1.04);
  }
`;

const PreviewTag = styled.span`
  position: absolute;
  top: 9px;
  left: 9px;
  z-index: 1;
  background: rgba(12, 35, 28, 0.78);
  color: #F9F6EE;
  backdrop-filter: blur(4px);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
`;

const ArtBody = styled.div`
  padding: 12px 13px 13px;

  strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.35;
  }

  p {
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.faint};
    line-height: 1.4;
  }
`;

const ArtMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 9px;
  font-size: 9.5px;
  color: ${colors.faint};

  em {
    font-style: normal;
    font-weight: 700;
    color: ${colors.copperDeep};
  }
`;

const DrawerPreview = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: ${radii.md};
  overflow: hidden;
  background: ${colors.mist};
  margin-bottom: 16px;

  img {
    object-fit: cover;
  }
`;

const NoteBox = styled.div`
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: ${radii.sm};
  background: #FCFAF4;
  border-left: 2px solid ${colors.copper};
  font-size: 11.5px;
  line-height: 1.6;
  color: ${colors.muted};
`;

const CheckList = styled.ul`
  list-style: none;
  margin-top: 8px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    font-size: 11.5px;
    color: ${colors.inkSoft};
    padding: 5px 0;
    line-height: 1.45;
  }

  svg {
    color: ${colors.success};
    flex: 0 0 auto;
    margin-top: 2px;
  }
`;

const VersionRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:last-child {
    border-bottom: 0;
  }

  strong {
    font-size: 11.5px;
    color: ${colors.ink};
    flex: 0 0 34px;
  }

  div {
    flex: 1;
    min-width: 0;
  }

  p {
    font-size: 11px;
    color: ${colors.inkSoft};
    line-height: 1.45;
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 10px;
    color: ${colors.faint};
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

const previews = [
  { value: '/images/mailer-boxes.jpg', label: 'Mailer boxes' },
  { value: '/images/rigid-boxes.jpg', label: 'Rigid boxes' },
  { value: '/images/folding-cartons.jpg', label: 'Folding cartons' },
  { value: '/images/specialty-packaging.jpg', label: 'Specialty packaging' },
];

const designers = ['Dev Malhotra', 'Riya Sen', 'Aakash Iyer', 'Meera Kulkarni'];

const artworkValidation = Yup.object({
  customer: Yup.string().trim().required('Customer is required'),
  product: Yup.string().trim().required('Product is required'),
  designer: Yup.string().required('Select a designer'),
  due: Yup.string().required('Due date is required'),
});

const versionValidation = Yup.object({
  note: Yup.string().trim().required('Describe what changed in this version'),
  by: Yup.string().required('Select who uploaded it'),
});

export default function PrepressPage() {
  const artwork = useDemoStore((state) => state.artwork);
  const orders = useDemoStore((state) => state.orders);
  const updateArtworkStatus = useDemoStore((state) => state.updateArtworkStatus);
  const setProofStatus = useDemoStore((state) => state.setProofStatus);
  const updateArtwork = useDemoStore((state) => state.updateArtwork);
  const uploadArtworkVersion = useDemoStore((state) => state.uploadArtworkVersion);
  const addArtwork = useDemoStore((state) => state.addArtwork);
  const deleteArtwork = useDemoStore((state) => state.deleteArtwork);

  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [versionOpen, setVersionOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const selected = artwork.find((job) => job.id === selectedId) || null;
  const editing = artwork.find((job) => job.id === editingId) || null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return artwork.filter((job) => {
      if (status !== 'All' && job.status !== status) return false;
      if (!q) return true;
      return (
        job.id.toLowerCase().includes(q) ||
        job.customer.toLowerCase().includes(q) ||
        job.product.toLowerCase().includes(q) ||
        (job.orderId || '').toLowerCase().includes(q)
      );
    });
  }, [artwork, status, query]);

  const statuses = Array.from(new Set(artwork.map((job) => job.status)));

  const applyStatus = (job, nextStatus, note) => {
    updateArtworkStatus(job.id, nextStatus, note);
    notify(
      nextStatus === 'Approved' ? 'Artwork approved' : nextStatus === 'Changes requested' ? 'Changes requested' : 'Artwork updated',
      `${job.id} marked ${nextStatus.toLowerCase()}.`,
      nextStatus === 'Changes requested' ? 'info' : 'success'
    );
  };

  const applyProof = (job, proofStatus) => {
    setProofStatus(job.id, proofStatus);
    notify(
      `Proof ${proofStatus.toLowerCase()}`,
      `${job.id} proof marked ${proofStatus.toLowerCase()} for ${job.customer}.`,
      proofStatus === 'Rejected' ? 'info' : 'success'
    );
  };

  const artworkInitial = editing
    ? {
        customer: editing.customer,
        product: editing.product,
        orderId: editing.orderId || '',
        designer: editing.designer,
        fileType: editing.fileType || 'PDF, AI',
        colours: editing.colours || 'CMYK',
        due: editing.due,
        preview: editing.preview,
        notes: editing.notes || '',
      }
    : {
        customer: '',
        product: '',
        orderId: '',
        designer: 'Dev Malhotra',
        fileType: 'PDF, AI',
        colours: 'CMYK',
        due: plusDaysISO(7),
        preview: previews[0].value,
        notes: '',
      };

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Prepress &amp; artwork</PageHeading>
          <PageDescription>
            Structural and print artwork approvals with version history — from designer upload to
            client sign-off, proof approval and plate release.
          </PageDescription>
        </div>
        <PageActions>
          <Button
            $variant="light"
            $size="sm"
            onClick={() => notify('Preflight queue', 'All active files passed preflight in this demo dataset.', 'info')}
          >
            <Layers size={14} /> Run preflight
          </Button>
          <Button
            $variant="primary"
            $size="sm"
            onClick={() => {
              setEditingId(null);
              setFormOpen(true);
            }}
          >
            <Plus size={14} /> New artwork
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'In review', value: artwork.filter((job) => job.status === 'In review').length, hint: 'Awaiting client feedback' },
          { label: 'Changes requested', value: artwork.filter((job) => job.status === 'Changes requested').length, hint: 'Design action needed', tone: 'danger' },
          { label: 'Awaiting file', value: artwork.filter((job) => job.status === 'Awaiting file').length, hint: 'Blocked on customer', tone: 'warning' },
          { label: 'Approved this month', value: artwork.filter((job) => job.status === 'Approved').length, hint: 'Released to prepress' },
        ]}
      />

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Artwork library</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filtered.length} of {artwork.length} artwork jobs
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search artwork, customer…" />
          </Toolbar>
        </PanelHeader>
        <div style={{ padding: '12px 16px 16px' }}>
          <FilterChips
            options={[
              { value: 'All', label: 'All', count: artwork.length },
              ...statuses.map((name) => ({
                value: name,
                label: name,
                count: artwork.filter((job) => job.status === name).length,
              })),
            ]}
            value={status}
            onChange={setStatus}
          />
        </div>
        <PanelBody>
          <Grid>
            {filtered.map((job) => (
              <ArtCard key={job.id} onClick={() => setSelectedId(job.id)}>
                <Preview>
                  <Image
                    src={job.preview}
                    alt={`${job.customer} ${job.product} artwork preview`}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 1180px) 50vw, 25vw"
                  />
                  <PreviewTag>{job.version}</PreviewTag>
                </Preview>
                <ArtBody>
                  <strong>{job.customer}</strong>
                  <p>
                    {job.product} · {job.orderId}
                  </p>
                  <ArtMeta>
                    <StatusChip $tone={statusTone(job.status)}>{job.status}</StatusChip>
                    <em>{formatDate(job.due, { year: undefined })}</em>
                  </ArtMeta>
                </ArtBody>
              </ArtCard>
            ))}
            {filtered.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '38px 12px',
                  textAlign: 'center',
                  fontSize: 12,
                  color: colors.faint,
                }}
              >
                No artwork matches this search.
              </div>
            ) : null}
          </Grid>
        </PanelBody>
      </Panel>

      <AppModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.id}` : 'New artwork request'}
        description={
          editing
            ? 'Update the artwork job details and preview.'
            : 'Log a new artwork request and start the version trail.'
        }
        size="lg"
      >
        <Formik
          initialValues={artworkInitial}
          validationSchema={artworkValidation}
          enableReinitialize
          onSubmit={(values) => {
            if (editing) {
              updateArtwork(editing.id, {
                customer: values.customer,
                product: values.product,
                orderId: values.orderId || '—',
                designer: values.designer,
                fileType: values.fileType,
                colours: values.colours,
                due: values.due,
                preview: values.preview,
                notes: values.notes,
              });
              notify('Artwork updated', `${editing.id} saved.`, 'success');
            } else {
              const job = addArtwork(values);
              notify('Artwork created', `${job.id} logged for ${job.customer}.`, 'success');
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
                placeholder="Select or enter a customer"
                required
                options={orders.map((order) => ({ value: order.customer, label: order.customer }))}
              />
              <TextField name="product" label="Product" placeholder="Premium mailer box" required />
              <SelectField
                name="orderId"
                label="Related order"
                placeholder="No linked order"
                options={orders.map((order) => ({ value: order.id, label: order.id }))}
              />
              <SelectField name="designer" label="Designer" options={designers} required />
              <TextField name="fileType" label="File types" placeholder="PDF, AI" />
              <TextField name="colours" label="Colour setup" placeholder="CMYK + 2 spot" />
              <TextField name="due" label="Due for approval" type="date" required />
              <SelectField name="preview" label="Preview image" options={previews} />
              <div style={{ gridColumn: '1 / -1' }}>
                <TextAreaField
                  name="notes"
                  label="Artwork notes"
                  rows={2}
                  placeholder="Bleed, colour targets, finishing notes…"
                />
              </div>
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                {editing ? 'Save artwork' : 'Create request'} <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <AppModal
        open={versionOpen}
        onClose={() => setVersionOpen(false)}
        title={selected ? `Upload new version · ${selected.id}` : 'Upload version'}
        description="Version history is retained for every artwork file."
        size="md"
      >
        <Formik
          initialValues={{ note: '', by: 'Dev Malhotra' }}
          validationSchema={versionValidation}
          enableReinitialize
          onSubmit={(values, helpers) => {
            if (!selected) return;
            uploadArtworkVersion(selected.id, { note: values.note, by: values.by });
            notify('New version uploaded', `${selected.id} sent back for client review.`, 'success');
            setVersionOpen(false);
            helpers.resetForm();
          }}
        >
          <Form>
            <FormGrid $cols={1}>
              <TextAreaField
                name="note"
                label="What changed"
                rows={3}
                placeholder="Foil line weight increased to 0.5 mm…"
                required
              />
              <SelectField name="by" label="Uploaded by" options={designers} required />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setVersionOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                <FileUp size={14} /> Upload version
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? `${selected.id} · ${selected.version}` : ''}
        description={selected ? `${selected.customer} · ${selected.product}` : ''}
        width="600px"
        footer={
          selected ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setSelectedId(null)}>
                Close
              </Button>
              <Button $variant="light" $size="sm" onClick={() => setVersionOpen(true)}>
                <FileUp size={14} /> Upload version
              </Button>
              <Button
                $variant="light"
                $size="sm"
                onClick={() => {
                  setEditingId(selected.id);
                  setFormOpen(true);
                }}
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button $variant="light" $size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 size={14} /> Delete
              </Button>
              {selected.status !== 'Approved' ? (
                <Button
                  $variant="primary"
                  $size="sm"
                  onClick={() => applyStatus(selected, 'Approved', 'Approved in demo review.')}
                >
                  <CheckCircle2 size={14} /> Approve
                </Button>
              ) : (
                <StatusChip $tone="success" style={{ alignSelf: 'center' }}>
                  Approved
                </StatusChip>
              )}
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <DrawerPreview>
              <Image src={selected.preview} alt="" fill sizes="600px" />
            </DrawerPreview>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <StatusChip $tone={statusTone(selected.status)}>{selected.status}</StatusChip>
              <StatusChip $tone={statusTone(selected.proofStatus || 'Pending')}>
                Proof {String(selected.proofStatus || 'Not sent').toLowerCase()}
              </StatusChip>
              <span style={{ fontSize: 11, color: colors.faint }}>
                Submitted {timeAgo(selected.submitted)}
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: fonts.display, fontSize: 18, color: colors.ink }}>
                {selected.version}
              </span>
            </div>

            <DetailGrid style={{ marginTop: 18 }}>
              <DetailItem>
                <DetailLabel>Order</DetailLabel>
                <DetailValue>{selected.orderId}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Designer</DetailLabel>
                <DetailValue>{selected.designer}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Files</DetailLabel>
                <DetailValue>{selected.fileType}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Colour setup</DetailLabel>
                <DetailValue>{selected.colours}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Submitted</DetailLabel>
                <DetailValue>{formatDateTime(selected.submitted)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Due for approval</DetailLabel>
                <DetailValue>{formatDate(selected.due)}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <NoteBox>{selected.notes}</NoteBox>

            <Divider style={{ margin: '18px 0 12px' }} />
            <SectionLabel>Client proof</SectionLabel>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
              <Button
                $variant="light"
                $size="xs"
                onClick={() => applyProof(selected, 'Sent')}
                disabled={selected.proofStatus === 'Sent'}
              >
                <Send size={13} /> Send proof
              </Button>
              <Button $variant="light" $size="xs" onClick={() => applyProof(selected, 'Approved')}>
                <CheckCircle2 size={13} /> Proof approved
              </Button>
              <Button $variant="ghost" $size="xs" onClick={() => applyProof(selected, 'Rejected')}>
                <XCircle size={13} /> Proof rejected
              </Button>
            </div>

            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              <Button
                $variant="light"
                $size="xs"
                onClick={() => applyStatus(selected, 'Changes requested', 'Client comments logged in demo.')}
              >
                <MessageSquareWarning size={13} /> Request changes
              </Button>
              {selected.status === 'Awaiting file' ? (
                <Button
                  $variant="ghost"
                  $size="xs"
                  onClick={() => {
                    updateArtworkStatus(selected.id, 'In review', 'Files received from customer.');
                    notify('Artwork received', `${selected.id} moved to review.`, 'success');
                  }}
                >
                  <Upload size={13} /> Mark file received
                </Button>
              ) : null}
            </div>

            <Divider style={{ margin: '18px 0 12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionLabel style={{ marginBottom: 0 }}>
                <History size={12} style={{ verticalAlign: -2, marginRight: 5 }} />
                Version history
              </SectionLabel>
              <span style={{ fontSize: 10.5, color: colors.faint }}>
                {(selected.versions || []).length} versions
              </span>
            </div>
            <div style={{ marginTop: 4 }}>
              {(selected.versions || []).slice().reverse().map((version) => (
                <VersionRow key={`${selected.id}-${version.version}`}>
                  <strong>{version.version}</strong>
                  <div>
                    <p>{version.note}</p>
                    <span>
                      <UserRound size={9} style={{ verticalAlign: -1, marginRight: 4 }} />
                      {version.by} · {formatDate(version.date)}
                    </span>
                  </div>
                  <StatusChip $tone={statusTone(version.status)}>{version.status}</StatusChip>
                </VersionRow>
              ))}
            </div>

            <Divider style={{ margin: '18px 0 12px' }} />
            <SectionLabel>Prepress checklist</SectionLabel>
            <CheckList>
              <li>
                <CheckCircle2 size={12} /> Bleed and safe margins verified at 3 mm
              </li>
              <li>
                <CheckCircle2 size={12} /> Colour profile converted to CMYK for offset
              </li>
              <li>
                <CheckCircle2 size={12} /> Barcode scan verified at 100% and 80%
              </li>
              <li>
                <Palette size={12} style={{ color: colors.copper }} /> Spot colour {selected.colours} mapped to plant ink library
              </li>
              <li>
                <Clock size={12} style={{ color: colors.faint }} /> Plate release pending final approval
              </li>
            </CheckList>
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete artwork job"
        message={selected ? `Remove ${selected.id} and its version history? This cannot be undone in the demo.` : ''}
        confirmLabel="Delete artwork"
        tone="danger"
        onConfirm={() => {
          if (!selected) return;
          deleteArtwork(selected.id);
          setSelectedId(null);
          setDeleteOpen(false);
          notify('Artwork deleted', `${selected.id} removed from the library.`, 'success');
        }}
      />
    </div>
  );
}
