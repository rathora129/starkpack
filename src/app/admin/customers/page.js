'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Download, Plus, Mail, Phone, MapPin, ArrowRight, ShoppingCart, FileText, Pencil, Trash2, Users } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import {
  formatCompactINR,
  formatDate,
  formatINR,
  formatNumber,
  statusTone,
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
  Divider,
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
import { TextField, SwitchField, SelectField, FormGrid, FormActions } from '@/components/ui/FormFields';
import MiniStats from '@/components/dashboard/MiniStats';

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding-bottom: 18px;

  strong {
    display: block;
    font-size: 15px;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 11.5px;
    color: ${colors.muted};
    margin-top: 2px;
  }
`;

const Tile = styled.span`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: ${colors.forest};
  color: #F6F6FF;
  font-family: ${fonts.display};
  font-size: 18px;
  flex: 0 0 auto;
`;

const LtvBand = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 14px;
  background: ${colors.cream};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  margin-bottom: 18px;

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
    margin-top: 4px;
    font-family: ${fonts.display};
    font-size: 21px;
    font-weight: 500;
    color: ${colors.ink};
  }
`;

const Contact = styled.a`
  display: flex;
  align-items: center;
  gap: 9px;
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

const OrderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
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
    font-size: 10px;
    color: ${colors.faint};
    margin-top: 1px;
  }
`;

const ContactCard = styled.div`
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

  strong {
    display: block;
    font-size: 12px;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    color: ${colors.faint};
  }

  small {
    display: inline-block;
    margin-left: 6px;
    padding: 1px 6px;
    border-radius: ${radii.pill};
    background: ${colors.successBg};
    color: ${colors.success};
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;

const Avatar = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${colors.mist};
  color: ${colors.forest};
  font-size: 11px;
  font-weight: 800;
  flex: 0 0 auto;
`;

const validation = Yup.object({
  company: Yup.string().trim().required('Company is required'),
  contact: Yup.string().trim().required('Contact person is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().trim().min(8, 'Enter a valid phone number').required('Phone is required'),
  city: Yup.string().trim().required('City is required'),
  segment: Yup.string().required('Select a segment'),
});

const contactValidation = Yup.object({
  name: Yup.string().trim().required('Contact name is required'),
  title: Yup.string().trim().required('Role is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().trim().required('Phone is required'),
});

export default function CustomersPage() {
  const router = useRouter();
  const customers = useDemoStore((state) => state.customers);
  const contacts = useDemoStore((state) => state.contacts);
  const orders = useDemoStore((state) => state.orders);
  const addCustomer = useDemoStore((state) => state.addCustomer);
  const saveCustomer = useDemoStore((state) => state.saveCustomer);
  const deleteCustomer = useDemoStore((state) => state.deleteCustomer);
  const saveContact = useDemoStore((state) => state.saveContact);
  const deleteContact = useDemoStore((state) => state.deleteContact);

  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState(null);
  const [contactDelete, setContactDelete] = useState(null);

  const selected = customers.find((customer) => customer.id === selectedId) || null;
  const customerContacts = selected ? contacts.filter((contact) => contact.customerId === selected.id) : [];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focus = params.get('focus');
    if (focus) {
      const match = useDemoStore.getState().customers.find((customer) => customer.id === focus);
      if (match) setSelectedId(match.id);
    }
  }, []);

  useEffect(() => {
    setTab('overview');
  }, [selectedId]);

  const segments = ['All', ...Array.from(new Set(customers.map((customer) => customer.segment)))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((customer) => {
      if (segment !== 'All' && customer.segment !== segment) return false;
      if (!q) return true;
      return (
        customer.company.toLowerCase().includes(q) ||
        customer.contact.toLowerCase().includes(q) ||
        customer.city.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q)
      );
    });
  }, [customers, segment, query]);

  const totalLtv = customers.reduce((sum, customer) => sum + customer.lifetimeValue, 0);
  const openOrders = customers.reduce((sum, customer) => sum + customer.openOrders, 0);

  const customerOrders = selected
    ? orders.filter((order) => order.customer === selected.company)
    : [];

  const exportCustomers = () => {
    downloadCSV(
      'stark-packmate-customers.csv',
      ['ID', 'Company', 'Contact', 'Email', 'Phone', 'City', 'Segment', 'Lifetime value', 'Open orders', 'Terms', 'Health'],
      filtered.map((customer) => [
        customer.id,
        customer.company,
        customer.contact,
        customer.email,
        customer.phone,
        customer.city,
        customer.segment,
        customer.lifetimeValue,
        customer.openOrders,
        customer.paymentTerms,
        customer.health,
      ])
    );
    notify('Customers exported', `${filtered.length} accounts downloaded as CSV.`, 'success');
  };

  const columns = [
    {
      key: 'company',
      label: 'Account',
      width: '24%',
      render: (customer) => (
        <>
          <CellPrimary>{customer.company}</CellPrimary>
          <CellSecondary>
            {customer.id} · {customer.city}
          </CellSecondary>
        </>
      ),
    },
    {
      key: 'contact',
      label: 'Primary contact',
      render: (customer) => (
        <>
          <CellPrimary style={{ fontWeight: 600 }}>{customer.contact}</CellPrimary>
          <CellSecondary>{customer.email}</CellSecondary>
        </>
      ),
    },
    {
      key: 'segment',
      label: 'Segment',
      render: (customer) => <StatusChip $tone="neutral">{customer.segment}</StatusChip>,
    },
    {
      key: 'ltv',
      label: 'Lifetime value',
      align: 'right',
      render: (customer) => <CellStrong>{formatCompactINR(customer.lifetimeValue)}</CellStrong>,
    },
    {
      key: 'orders',
      label: 'Open orders',
      align: 'center',
      render: (customer) => <CellStrong>{customer.openOrders}</CellStrong>,
    },
    {
      key: 'terms',
      label: 'Terms',
      render: (customer) => <CellSecondary style={{ marginTop: 0 }}>{customer.paymentTerms}</CellSecondary>,
    },
    {
      key: 'health',
      label: 'Health',
      render: (customer) => (
        <StatusChip $tone={statusTone(customer.health)}>{customer.health}</StatusChip>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (customer) => <CellSecondary style={{ marginTop: 0 }}>{customer.owner}</CellSecondary>,
    },
  ];

  return (
    <div>
      <PageHeaderBar>
        <div>
          <PageHeading>Customers</PageHeading>
          <PageDescription>
            Key accounts, commercial terms and service health across apparel, beauty, food,
            electronics and industrial segments.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="light" $size="sm" onClick={exportCustomers}>
            <Download size={14} /> Export
          </Button>
          <Button $variant="primary" $size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} /> New customer
          </Button>
        </PageActions>
      </PageHeaderBar>

      <MiniStats
        items={[
          { label: 'Active accounts', value: formatNumber(customers.length), hint: 'Across 8 industries' },
          { label: 'Lifetime value', value: formatCompactINR(totalLtv), hint: 'Since 2009' },
          { label: 'Open orders', value: formatNumber(openOrders), hint: 'Across all accounts' },
          { label: 'Avg. payment terms', value: '32 days', hint: 'Net 15 to Net 45' },
        ]}
      />

      <div style={{ height: 18 }} />

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Account register</PanelTitle>
            <div style={{ marginTop: 4, fontSize: 12, color: colors.muted }}>
              {filtered.length} of {customers.length} accounts
            </div>
          </div>
          <Toolbar style={{ padding: 0, border: 0, background: 'transparent' }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search account, contact, city…" />
          </Toolbar>
        </PanelHeader>
        <div style={{ padding: '12px 16px 0' }}>
          <FilterChips
            options={segments.map((name) => ({
              value: name,
              label: name === 'All' ? 'All segments' : name,
              count: name === 'All' ? customers.length : customers.filter((c) => c.segment === name).length,
            }))}
            value={segment}
            onChange={setSegment}
          />
        </div>
        <PanelBody $flush>
          <DataTable
            columns={columns}
            rows={filtered}
            onRowClick={(row) => setSelectedId(row.id)}
            minWidth="980px"
            footer={<span>{filtered.length} accounts · click a row for the full profile</span>}
          />
        </PanelBody>
      </Panel>

      <AppModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="New customer"
        description="Accounts created here are available immediately in quotations and orders."
        size="lg"
      >
        <Formik
          initialValues={{
            company: '',
            contact: '',
            email: '',
            phone: '',
            city: '',
            segment: 'Apparel',
            paymentTerms: 'Net 30',
            gstin: '',
          }}
          validationSchema={validation}
          onSubmit={(values, helpers) => {
            const customer = addCustomer(values);
            notify('Customer created', `${customer.company} added as ${customer.id}.`, 'success');
            setFormOpen(false);
            setSelectedId(customer.id);
            helpers.resetForm();
          }}
        >
          <Form>
            <FormGrid $cols={2}>
              <TextField name="company" label="Company" placeholder="e.g. Northline Apparel" required />
              <TextField name="contact" label="Contact person" placeholder="e.g. Meera Raghavan" required />
              <TextField name="email" label="Email" type="email" placeholder="name@company.in" required />
              <TextField name="phone" label="Phone" placeholder="+91 98…" required />
              <TextField name="city" label="City" placeholder="Bengaluru" required />
              <SelectField
                name="segment"
                label="Segment"
                options={['Apparel', 'Beauty', 'Food & beverage', 'Electronics', 'Home & décor', 'Industrial', 'Retail']}
              />
              <SelectField name="paymentTerms" label="Payment terms" options={['Net 15', 'Net 30', 'Net 45', 'Advance 50%']} />
              <TextField name="gstin" label="GSTIN" placeholder="27AABCS4821F1Z5" />
            </FormGrid>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                Create customer <ArrowRight size={14} />
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.company : ''}
        description={selected ? `${selected.id} · customer since ${formatDate(selected.since)}` : ''}
        width="580px"
        footer={
          selected ? (
            <>
              <Button $variant="secondary" $size="sm" onClick={() => setEditOpen(true)}>
                <Pencil size={13} /> Edit account
              </Button>
              <Button
                $variant="light"
                $size="sm"
                onClick={() => router.push(`/admin/quotations?new=1&customer=${encodeURIComponent(selected.company)}`)}
              >
                <FileText size={14} /> New quotation
              </Button>
              <Button
                $variant="primary"
                $size="sm"
                onClick={() => router.push(`/admin/orders?new=1&customer=${encodeURIComponent(selected.company)}`)}
              >
                <ShoppingCart size={14} /> New order
              </Button>
            </>
          ) : null
        }
      >
        {selected ? (
          <>
            <Profile>
              <Tile>{selected.company.slice(0, 2).toUpperCase()}</Tile>
              <div>
                <strong>{selected.contact}</strong>
                <span>
                  {selected.segment} · {selected.owner}
                </span>
              </div>
              <StatusChip $tone={statusTone(selected.health)} style={{ marginLeft: 'auto' }}>
                {selected.health}
              </StatusChip>
            </Profile>

            <LtvBand>
              <div>
                <span>Lifetime value</span>
                <strong>{formatCompactINR(selected.lifetimeValue)}</strong>
              </div>
              <div>
                <span>Orders placed</span>
                <strong>{selected.ordersCount}</strong>
              </div>
            </LtvBand>

            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'overview', label: 'Overview' },
                { value: 'contacts', label: 'Contacts', count: customerContacts.length },
              ]}
            />

            <div style={{ height: 16 }} />

            {tab === 'overview' ? (
              <>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Payment terms</DetailLabel>
                    <DetailValue>{selected.paymentTerms}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Open orders</DetailLabel>
                    <DetailValue>{selected.openOrders}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>GSTIN</DetailLabel>
                    <DetailValue>{selected.gstin}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Account owner</DetailLabel>
                    <DetailValue>{selected.owner}</DetailValue>
                  </DetailItem>
                </DetailGrid>

                <Divider style={{ margin: '18px 0' }} />

                <Contact href={`mailto:${selected.email}`}>
                  <Mail size={13} /> {selected.email}
                </Contact>
                <Contact href={`tel:${selected.phone}`}>
                  <Phone size={13} /> {selected.phone}
                </Contact>
                <Contact as="span">
                  <MapPin size={13} /> {selected.city}
                </Contact>

                <Divider style={{ margin: '18px 0' }} />

                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.faint, marginBottom: 6 }}>
                  Recent orders
                </p>
                {customerOrders.length ? (
                  customerOrders.slice(0, 4).map((order) => (
                    <OrderRow key={order.id}>
                      <div>
                        <strong>
                          {order.id} · {order.items[0]?.description}
                        </strong>
                        <span>
                          Due {formatDate(order.dueDate)} · {formatINR(order.value)}
                        </span>
                      </div>
                      <StatusChip $tone={statusTone(order.status)}>{order.status}</StatusChip>
                    </OrderRow>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: colors.faint, padding: '8px 0' }}>
                    No orders in the current demo window.
                  </p>
                )}
              </>
            ) : null}

            {tab === 'contacts' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.faint }}>
                    Buying committee
                  </p>
                  <Button
                    $variant="secondary"
                    $size="xs"
                    onClick={() => {
                      setContactTarget(null);
                      setContactOpen(true);
                    }}
                  >
                    <Plus size={12} /> Add contact
                  </Button>
                </div>
                <div style={{ height: 12 }} />
                {customerContacts.length === 0 ? (
                  <EmptyState>
                    <Users size={22} />
                    <strong>No contacts on file</strong>
                    <p>Add the people who sign off on packaging decisions.</p>
                  </EmptyState>
                ) : (
                  customerContacts.map((contact) => (
                    <ContactCard key={contact.id}>
                      <Avatar>{contact.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</Avatar>
                      <div className="body">
                        <strong>
                          {contact.name}
                          {contact.primary ? <small>Primary</small> : null}
                        </strong>
                        <span>{contact.title} · {contact.city || selected.city}</span>
                        <span>{contact.email} · {contact.phone}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        <Button
                          $variant="ghost"
                          $size="xs"
                          onClick={() => {
                            setContactTarget(contact);
                            setContactOpen(true);
                          }}
                        >
                          <Pencil size={12} />
                        </Button>
                        <Button $variant="ghost" $size="xs" onClick={() => setContactDelete(contact)}>
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </ContactCard>
                  ))
                )}
                <p style={{ fontSize: 10.5, color: colors.faint, marginTop: 14, lineHeight: 1.6 }}>
                  The primary contact is used on quotations, order confirmations and dispatch documents.
                </p>
              </>
            ) : null}
          </>
        ) : null}
      </Drawer>

      <AppModal open={editOpen} onClose={() => setEditOpen(false)} title={selected ? `Edit ${selected.company}` : 'Edit account'} size="lg">
        {selected ? (
          <Formik
            key={selected.id}
            initialValues={{
              company: selected.company,
              contact: selected.contact,
              email: selected.email,
              phone: selected.phone,
              city: selected.city,
              segment: selected.segment,
              paymentTerms: selected.paymentTerms,
              gstin: selected.gstin,
              owner: selected.owner,
              health: selected.health,
              status: selected.status || 'Active',
            }}
            validationSchema={validation}
            onSubmit={(values) => {
              saveCustomer({ id: selected.id, ...values });
              notify('Account updated', `${values.company} saved.`, 'success');
              setEditOpen(false);
            }}
          >
            <Form>
              <FormGrid $cols={2}>
                <TextField name="company" label="Company" required />
                <TextField name="contact" label="Primary contact" required />
                <TextField name="email" label="Email" type="email" required />
                <TextField name="phone" label="Phone" required />
                <TextField name="city" label="City" required />
                <SelectField
                  name="segment"
                  label="Segment"
                  options={['Apparel', 'Beauty', 'Food & beverage', 'Electronics', 'Home & décor', 'Industrial', 'Retail']}
                />
                <SelectField name="paymentTerms" label="Payment terms" options={['Net 15', 'Net 30', 'Net 45', 'Advance 50%']} />
                <TextField name="gstin" label="GSTIN" />
                <SelectField name="owner" label="Account owner" options={['Neha Joshi', 'Rahul Menon', 'Sana Kulkarni']} />
                <SelectField name="health" label="Account health" options={['Excellent', 'Good', 'At risk']} />
                <SelectField name="status" label="Status" options={['Active', 'On hold', 'Inactive']} />
              </FormGrid>
              <FormActions>
                <Button type="button" $variant="danger" $size="sm" style={{ marginRight: 'auto' }} onClick={() => setDeleteOpen(true)}>
                  <Trash2 size={13} /> Delete account
                </Button>
                <Button type="button" $variant="secondary" $size="sm" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" $variant="primary" $size="sm">
                  Save account
                </Button>
              </FormActions>
            </Form>
          </Formik>
        ) : null}
      </AppModal>

      <AppModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title={contactTarget ? `Edit ${contactTarget.name}` : 'Add contact'}
        description={selected ? `${selected.company} · buying committee` : ''}
        size="md"
      >
        {selected ? (
          <Formik
            key={contactTarget?.id || `new-${selected.id}`}
            initialValues={{
              name: contactTarget?.name || '',
              title: contactTarget?.title || '',
              email: contactTarget?.email || '',
              phone: contactTarget?.phone || '',
              city: contactTarget?.city || selected.city,
              primary: contactTarget?.primary || false,
            }}
            validationSchema={contactValidation}
            onSubmit={(values) => {
              saveContact({
                ...(contactTarget ? { id: contactTarget.id } : {}),
                ...values,
                customerId: selected.id,
              });
              notify(contactTarget ? 'Contact updated' : 'Contact added', `${values.name} on ${selected.company}.`, 'success');
              setContactOpen(false);
            }}
          >
            <Form>
              <FormGrid $cols={2}>
                <TextField name="name" label="Full name" required />
                <TextField name="title" label="Role" placeholder="Head of Supply Chain" required />
                <TextField name="email" label="Email" type="email" required />
                <TextField name="phone" label="Phone" required />
                <TextField name="city" label="City" />
                <div />
              </FormGrid>
              <div style={{ height: 6 }} />
              <SwitchField name="primary" label="Primary contact" description="Used on quotations and order documents." />
              <FormActions>
                <Button type="button" $variant="secondary" $size="sm" onClick={() => setContactOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" $variant="primary" $size="sm">
                  {contactTarget ? 'Save contact' : 'Add contact'}
                </Button>
              </FormActions>
            </Form>
          </Formik>
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete customer account?"
        message={selected ? `${selected.company} and its contacts will be removed. Quotations and orders already issued stay in history.` : ''}
        confirmLabel="Delete account"
        onConfirm={() => {
          if (!selected) return;
          deleteCustomer(selected.id);
          notify('Account deleted', `${selected.company} was removed from the customer master.`, 'info');
          setEditOpen(false);
          setSelectedId(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(contactDelete)}
        onClose={() => setContactDelete(null)}
        title="Delete contact?"
        message={contactDelete ? `${contactDelete.name} will be removed from this buying committee.` : ''}
        confirmLabel="Delete contact"
        onConfirm={() => {
          if (!contactDelete) return;
          deleteContact(contactDelete.id);
          notify('Contact removed', `${contactDelete.name} was deleted.`, 'info');
        }}
      />
    </div>
  );
}
