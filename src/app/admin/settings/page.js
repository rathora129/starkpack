'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Switch } from '@heroui/react';
import {
  Building2,
  MessageCircle,
  BellRing,
  Plug,
  Users,
  Download,
  Save,
  ShieldCheck,
  CreditCard,
  BookOpen,
  ShoppingBag,
  Hash,
  BarChart3,
  UserPlus,
  Mail,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
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
  PanelFooter,
  StatusChip,
  Avatar,
  Tag,
  Divider,
  Hint,
} from '@/components/ui/primitives';
import { DataTable, CellPrimary, CellSecondary } from '@/components/ui/DataTable';
import { AppModal, ConfirmDialog } from '@/components/ui/Overlay';
import { TextField, TextAreaField, SelectField, SwitchField, FormGrid, FormActions, FormSection, FormSectionTitle, FormSectionHint } from '@/components/ui/FormFields';

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: ${radii.md};
  background: #EFECE4;
  margin-bottom: 18px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border: 0;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(16,35,29,0.12)' : 'none')};
  color: ${({ $active }) => ($active ? colors.ink : colors.muted)};
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  transition: all ${transitions.fast};

  svg {
    color: ${({ $active }) => ($active ? colors.copper : 'currentColor')};
  }

  &:hover {
    color: ${colors.ink};
  }
`;

const CompanyMark = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: ${radii.md};
  background: linear-gradient(140deg, #164236 0%, #0C231C 100%);
  color: #F9F6EE;
  margin-bottom: 20px;

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 17px;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 10.5px;
    color: rgba(249, 246, 238, 0.68);
  }
`;

const MarkTile = styled.span`
  width: 44px;
  height: 44px;
  border-radius: ${radii.sm};
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: ${colors.copperSoft};
  flex: 0 0 auto;
`;

const IntegrationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const IntegrationCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid ${({ $on }) => ($on ? '#CFE3D8' : colors.line)};
  border-radius: ${radii.md};
  background: ${({ $on }) => ($on ? '#FBFDFC' : '#fff')};
  transition: border-color ${transitions.fast}, background ${transitions.fast};
`;

const IntegrationBody = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
  }
`;

const IntegrationIcon = styled.span`
  width: 34px;
  height: 34px;
  border-radius: ${radii.sm};
  display: grid;
  place-items: center;
  background: ${colors.paper};
  border: 1px solid ${colors.lineSoft};
  color: ${colors.copperDeep};
  flex: 0 0 auto;
`;

const ChatPreview = styled.div`
  border-radius: ${radii.lg};
  overflow: hidden;
  border: 1px solid ${colors.line};
  background: #E7E2D6;
  box-shadow: ${shadows.xs};
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #0F3B2E;
  color: #F9F6EE;

  strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
  }

  span {
    display: block;
    font-size: 10px;
    color: rgba(249, 246, 238, 0.62);
    margin-top: 1px;
  }
`;

const ChatBody = styled.div`
  padding: 16px 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 138px;
  background: repeating-linear-gradient(135deg, #ECE8DD, #ECE8DD 12px, #E9E4D8 12px, #E9E4D8 24px);
`;

const Bubble = styled.div`
  align-self: flex-end;
  max-width: 88%;
  padding: 8px 11px;
  border-radius: 10px 10px 3px 10px;
  background: #DCF3E4;
  box-shadow: 0 1px 1px rgba(16, 35, 29, 0.08);
  font-size: 11.5px;
  color: #16352A;
  line-height: 1.5;

  small {
    display: block;
    text-align: right;
    font-size: 9px;
    color: #6E8A7A;
    margin-top: 3px;
  }
`;

const ChatCta = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px;
  background: #1F7A54;
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  transition: background ${transitions.fast};

  &:hover {
    background: #17613F;
  }
`;

const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const DangerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const metadata = [
  { key: 'razorpay', name: 'Razorpay', description: 'Collect customer payments and reconcile settlements.', icon: CreditCard },
  { key: 'tally', name: 'Tally Prime', description: 'Push invoices and vouchers to your accounting ledger.', icon: BookOpen },
  { key: 'shopify', name: 'Shopify', description: 'Pull storefront orders and sync fulfilment status.', icon: ShoppingBag },
  { key: 'slack', name: 'Slack', description: 'Send production and sales alerts to team channels.', icon: Hash },
  { key: 'googleAnalytics', name: 'Google Analytics', description: 'Track website traffic and campaign attribution.', icon: BarChart3 },
];

const companyValidation = Yup.object({
  name: Yup.string().trim().required('Company name is required'),
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().trim().required('Phone number is required'),
  gstin: Yup.string().trim().required('GSTIN is required'),
});

const whatsappValidation = Yup.object({
  number: Yup.string()
    .trim()
    .matches(/^[0-9]{10,15}$/, 'Use country code and digits only')
    .required('WhatsApp number is required'),
  message: Yup.string().trim().max(300, 'Keep the greeting under 300 characters'),
});

const inviteValidation = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  role: Yup.string().required('Pick a role'),
});

const tabs = [
  { value: 'company', label: 'Company profile', icon: Building2 },
  { value: 'whatsapp', label: 'WhatsApp & contact', icon: MessageCircle },
  { value: 'notifications', label: 'Notifications', icon: BellRing },
  { value: 'integrations', label: 'Integrations', icon: Plug },
  { value: 'team', label: 'Team & access', icon: Users },
];

export default function SettingsPage() {
  const settings = useDemoStore((state) => state.settings);
  const saveSettings = useDemoStore((state) => state.saveSettings);
  const resetDemo = useDemoStore((state) => state.resetDemo);

  const [tab, setTab] = useState('company');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [users, setUsers] = useState(settings.users);
  const [resetOpen, setResetOpen] = useState(false);

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stark-packmate-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify('Configuration exported', 'Workspace settings downloaded as JSON.', 'success');
  };

  const whatsappHref = `https://wa.me/${String(settings.whatsapp.number).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsapp.message)}`;

  const userColumns = [
    {
      key: 'name',
      label: 'Team member',
      width: '34%',
      render: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Avatar $size="sm">{user.initials}</Avatar>
          <div>
            <CellPrimary>{user.name}</CellPrimary>
            <CellSecondary>{user.email}</CellSecondary>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => <Tag>{user.role}</Tag>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => <StatusChip $tone={user.status === 'Active' ? 'success' : 'warning'}>{user.status}</StatusChip>,
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (user) =>
        user.status === 'Active' ? (
          <Button $variant="ghost" $size="xs" onClick={() => notify('Permissions', `${user.name} has ${user.role.toLowerCase()} access in this demo.`, 'info')}>
            <KeyRound size={12} /> Access
          </Button>
        ) : (
          <Button
            $variant="secondary"
            $size="xs"
            onClick={() => notify('Invite resent', `A fresh invite was queued for ${user.email}.`, 'success')}
          >
            <Mail size={12} /> Resend
          </Button>
        ),
    },
  ];

  return (
    <>
      <PageHeaderBar>
        <div>
          <PageHeading>Settings</PageHeading>
          <PageDescription>
            Company identity, customer contact channels, notifications, integrations and team access for this
            workspace.
          </PageDescription>
        </div>
        <PageActions>
          <StatusChip $tone="success">
            <ShieldCheck size={11} style={{ marginRight: 4 }} /> Demo workspace
          </StatusChip>
          <Button $variant="secondary" $size="sm" onClick={exportConfig}>
            <Download size={14} /> Export config
          </Button>
        </PageActions>
      </PageHeaderBar>

      <Tabs role="tablist" aria-label="Settings sections">
        {tabs.map((item) => (
          <Tab
            key={item.value}
            role="tab"
            aria-selected={tab === item.value}
            $active={tab === item.value}
            onClick={() => setTab(item.value)}
          >
            <item.icon size={13} /> {item.label}
          </Tab>
        ))}
      </Tabs>

      {tab === 'company' ? (
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Company profile</PanelTitle>
              <PanelSubtitle>Appears on quotations, invoices, the public site and customer portal.</PanelSubtitle>
            </div>
            <StatusChip $tone="neutral">Legal entity</StatusChip>
          </PanelHeader>
          <PanelBody>
            <CompanyMark>
              <MarkTile>
                <Building2 size={20} />
              </MarkTile>
              <div>
                <strong>{settings.company.name}</strong>
                <span>
                  GSTIN {settings.company.gstin} · {settings.company.timezone}
                </span>
              </div>
            </CompanyMark>

            <Formik
              initialValues={settings.company}
              validationSchema={companyValidation}
              onSubmit={(values) => {
                saveSettings('company', values);
                notify('Company profile saved', 'Legal and contact details are updated across the demo.', 'success');
              }}
            >
              <Form>
                <FormSection $first>
                  <FormSectionTitle>Identity</FormSectionTitle>
                  <FormSectionHint>Registered business name and tax identifiers used on documents.</FormSectionHint>
                  <FormGrid $cols={2}>
                    <TextField name="name" label="Legal company name" required />
                    <TextField name="gstin" label="GSTIN" required />
                    <TextField name="phone" label="Primary phone" required />
                    <TextField name="email" label="Billing email" type="email" required />
                    <TextField name="website" label="Website" />
                    <SelectField
                      name="timezone"
                      label="Operating timezone"
                      options={['Asia/Kolkata (IST)', 'Asia/Dubai (GST)', 'Asia/Singapore (SGT)', 'Europe/London (GMT)']}
                    />
                  </FormGrid>
                </FormSection>

                <FormSection>
                  <FormSectionTitle>Registered address</FormSectionTitle>
                  <FormSectionHint>Printed on invoices, purchase orders and delivery notes.</FormSectionHint>
                  <TextAreaField name="address" label="Address" rows={3} />
                  <div style={{ height: 14 }} />
                  <SelectField
                    name="fyStart"
                    label="Financial year starts"
                    options={['April', 'January', 'July', 'October']}
                  />
                </FormSection>

                <FormActions>
                  <Button type="submit" $variant="primary" $size="sm">
                    <Save size={14} /> Save company profile
                  </Button>
                </FormActions>
              </Form>
            </Formik>
          </PanelBody>
        </Panel>
      ) : null}

      {tab === 'whatsapp' ? (
        <SplitGrid>
          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>WhatsApp contact</PanelTitle>
                <PanelSubtitle>Powers the floating WhatsApp CTA on the website and customer portal.</PanelSubtitle>
              </div>
              <MessageCircle size={16} style={{ color: colors.success }} />
            </PanelHeader>
            <PanelBody>
              <Formik
                initialValues={settings.whatsapp}
                validationSchema={whatsappValidation}
                onSubmit={(values) => {
                  saveSettings('whatsapp', values);
                  notify('WhatsApp settings saved', 'The contact CTA is updated across the demo.', 'success');
                }}
              >
                {(formik) => (
                  <Form>
                    <SwitchField
                      name="enabled"
                      label="Enable WhatsApp contact"
                      description="Master switch for every WhatsApp entry point in the demo."
                    />
                    <Divider style={{ margin: '4px 0 16px' }} />
                    <TextField
                      name="number"
                      label="WhatsApp business number"
                      prefix="+"
                      hint="Include the country code, digits only. Example: 919820011223."
                      required
                    />
                    <div style={{ height: 14 }} />
                    <TextAreaField
                      name="message"
                      label="Pre-filled greeting"
                      rows={3}
                      hint={`${formik.values.message.length}/300 characters`}
                    />
                    <div style={{ height: 6 }} />
                    <SwitchField
                      name="showOnWebsite"
                      label="Show on public website"
                      description="Floating button and contact page CTA."
                    />
                    <SwitchField
                      name="showOnPortal"
                      label="Show in customer portal"
                      description="Account team quick-chat button for signed-in customers."
                    />
                    <FormActions>
                      <Button type="submit" $variant="primary" $size="sm">
                        <Save size={14} /> Save WhatsApp settings
                      </Button>
                    </FormActions>
                  </Form>
                )}
              </Formik>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Live preview</PanelTitle>
                <PanelSubtitle>How customers experience the CTA.</PanelSubtitle>
              </div>
            </PanelHeader>
            <PanelBody>
              <ChatPreview>
                <ChatHeader>
                  <Avatar $size="sm" $bg={colors.copper} $color="#fff">
                    SP
                  </Avatar>
                  <div>
                    <strong>Stark Packmate</strong>
                    <span>Business account</span>
                  </div>
                </ChatHeader>
                <ChatBody>
                  <Bubble>
                    {settings.whatsapp.message || 'Hi Stark Packmate, I would like to discuss a packaging requirement.'}
                    <small>Just now</small>
                  </Bubble>
                </ChatBody>
                {settings.whatsapp.enabled ? (
                  <ChatCta href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={14} /> Start WhatsApp chat
                  </ChatCta>
                ) : (
                  <ChatCta
                    as="button"
                    type="button"
                    onClick={() => notify('WhatsApp is disabled', 'Turn on the master switch to activate the CTA.', 'warning')}
                    style={{ border: 0, width: '100%', cursor: 'pointer', background: '#9A9F9B' }}
                  >
                    <MessageCircle size={14} /> CTA currently disabled
                  </ChatCta>
                )}
              </ChatPreview>
              <Hint style={{ display: 'block', marginTop: 12 }}>
                Demo note: messages open WhatsApp Web or the desktop app with the greeting pre-filled.
              </Hint>
            </PanelBody>
          </Panel>
        </SplitGrid>
      ) : null}

      {tab === 'notifications' ? (
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Notification preferences</PanelTitle>
              <PanelSubtitle>Choose which workspace events reach your inbox and phone.</PanelSubtitle>
            </div>
            <BellRing size={16} style={{ color: colors.copper }} />
          </PanelHeader>
          <PanelBody>
            <Formik
              initialValues={settings.notifications}
              onSubmit={(values) => {
                saveSettings('notifications', values);
                notify('Notification preferences saved', 'Your alert routing has been updated in the demo.', 'success');
              }}
            >
              <Form>
                <FormSection $first>
                  <FormSectionTitle>Sales and customers</FormSectionTitle>
                  <FormSectionHint>Lead, quotation and customer activity.</FormSectionHint>
                  <SwitchField
                    name="newLeads"
                    label="New leads and RFQs"
                    description="Alert me the moment a website enquiry or quote request lands."
                  />
                  <SwitchField
                    name="invoiceReminders"
                    label="Invoice due reminders"
                    description="Morning summary of invoices falling due in the next 7 days."
                  />
                </FormSection>

                <FormSection>
                  <FormSectionTitle>Operations</FormSectionTitle>
                  <FormSectionHint>Production, stock and procurement signals.</FormSectionHint>
                  <SwitchField
                    name="productionAlerts"
                    label="Production exceptions"
                    description="Job delays, machine downtime and quality holds."
                  />
                  <SwitchField
                    name="stockAlerts"
                    label="Stock below reorder"
                    description="Notify purchasing when any SKU crosses its reorder level."
                  />
                </FormSection>

                <FormSection>
                  <FormSectionTitle>Digests</FormSectionTitle>
                  <FormSectionHint>Scheduled summaries for the leadership team.</FormSectionHint>
                  <SwitchField
                    name="dailyDigest"
                    label="Daily operations digest"
                    description="A 07:00 roll-up of orders, output and cash position."
                  />
                  <SwitchField
                    name="weeklyReport"
                    label="Weekly performance report"
                    description="Monday morning sales and margin review."
                  />
                </FormSection>

                <FormActions>
                  <Button type="submit" $variant="primary" $size="sm">
                    <Save size={14} /> Save preferences
                  </Button>
                </FormActions>
              </Form>
            </Formik>
          </PanelBody>
          <PanelFooter>
            <span style={{ fontSize: 10.5, color: colors.faint }}>
              Alerts are simulated in this presentation workspace and never sent externally.
            </span>
          </PanelFooter>
        </Panel>
      ) : null}

      {tab === 'integrations' ? (
        <Panel>
          <PanelHeader>
            <div>
              <PanelTitle>Integrations</PanelTitle>
              <PanelSubtitle>Connect payments, accounting, commerce and team tooling.</PanelSubtitle>
            </div>
            <StatusChip $tone="info">
              {Object.values(settings.integrations).filter(Boolean).length} connected
            </StatusChip>
          </PanelHeader>
          <PanelBody>
            <IntegrationGrid>
              {metadata.map((item) => {
                const on = Boolean(settings.integrations[item.key]);
                return (
                  <IntegrationCard key={item.key} $on={on}>
                    <IntegrationIcon>
                      <item.icon size={16} />
                    </IntegrationIcon>
                    <IntegrationBody>
                      <strong id={`integration-${item.key}`}>{item.name}</strong>
                      <span>{item.description}</span>
                    </IntegrationBody>
                    <Switch
                      isSelected={on}
                      onValueChange={(value) => {
                        saveSettings('integrations', { [item.key]: value });
                        notify(
                          value ? `${item.name} connected` : `${item.name} disconnected`,
                          value
                            ? `${item.name} is now linked to the demo workspace.`
                            : `${item.name} will stop syncing demo data.`,
                          value ? 'success' : 'info'
                        );
                      }}
                      size="sm"
                      color="primary"
                      aria-labelledby={`integration-${item.key}`}
                    >
                      <span />
                    </Switch>
                  </IntegrationCard>
                );
              })}
            </IntegrationGrid>
            <div
              style={{
                marginTop: 16,
                padding: '12px 14px',
                borderRadius: radii.md,
                background: colors.cream,
                border: `1px dashed ${colors.line}`,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <Plug size={14} style={{ color: colors.copper, marginTop: 1, flex: '0 0 auto' }} />
              <p style={{ fontSize: 10.5, color: colors.muted, lineHeight: 1.6 }}>
                In production these connectors use OAuth or API keys stored in an encrypted vault. This demo
                only records the on/off state.
              </p>
            </div>
          </PanelBody>
        </Panel>
      ) : null}

      {tab === 'team' ? (
        <>
          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Team & access</PanelTitle>
                <PanelSubtitle>People with access to the Stark Packmate workspace.</PanelSubtitle>
              </div>
              <Button $variant="primary" $size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus size={14} /> Invite user
              </Button>
            </PanelHeader>
            <PanelBody $flush>
              <DataTable
                columns={userColumns}
                rows={users}
                minWidth="640px"
                footer={<span>{users.length} members · {users.filter((user) => user.status === 'Invited').length} pending invite</span>}
              />
            </PanelBody>
          </Panel>

          <div style={{ height: 18 }} />

          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Danger zone</PanelTitle>
                <PanelSubtitle>Restore every module to its original presentation data.</PanelSubtitle>
              </div>
            </PanelHeader>
            <PanelBody>
              <DangerRow>
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: colors.ink }}>Reset demo data</p>
                  <p style={{ fontSize: 11, color: colors.muted, marginTop: 3, maxWidth: 520, lineHeight: 1.55 }}>
                    Removes leads, orders and portal changes made during this session and restores the seeded
                    workspace. Settings, including team invites, are reset too.
                  </p>
                </div>
                <Button $variant="danger" $size="sm" onClick={() => setResetOpen(true)}>
                  <RotateCcw size={13} /> Reset demo
                </Button>
              </DangerRow>
            </PanelBody>
          </Panel>
        </>
      ) : null}

      <AppModal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite a team member" size="sm">
        <Formik
          initialValues={{ name: '', email: '', role: 'Sales' }}
          validationSchema={inviteValidation}
          onSubmit={(values, helpers) => {
            const initials = values.name
              .split(' ')
              .filter(Boolean)
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            setUsers((current) => [
              ...current,
              { name: values.name, email: values.email, role: values.role, status: 'Invited', initials },
            ]);
            notify('Invitation sent', `${values.name} was invited as ${values.role.toLowerCase()} in the demo.`, 'success');
            setInviteOpen(false);
            helpers.resetForm();
          }}
        >
          <Form>
            <TextField name="name" label="Full name" placeholder="Priya Nair" required />
            <div style={{ height: 14 }} />
            <TextField name="email" label="Work email" type="email" placeholder="priya@starkpackmate.com" required />
            <div style={{ height: 14 }} />
            <SelectField
              name="role"
              label="Role"
              options={['Admin', 'Sales', 'Sales Manager', 'Production', 'Finance', 'Read only']}
            />
            <Hint style={{ display: 'block', marginTop: 8 }}>
              Invited users can sign in once they accept the demo invitation email.
            </Hint>
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                <UserPlus size={13} /> Send invite
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetDemo();
          setUsers(settings.users);
          notify('Demo reset', 'All modules have been restored to their original sample data.', 'success');
        }}
        title="Reset all demo data?"
        message="Every change made in this session — new leads, orders, artwork approvals and settings — will be replaced with the seeded presentation data."
        confirmLabel="Reset demo data"
      />
    </>
  );
}
