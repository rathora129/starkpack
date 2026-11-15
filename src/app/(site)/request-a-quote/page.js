'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Clock3,
  Layers,
  Sparkles,
  FileCheck2,
  Boxes,
} from 'lucide-react';
import { products } from '@/data/catalog';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { todayISO, plusDaysISO } from '@/lib/format';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import {
  Container,
  Section,
  PageIntro,
  Kicker,
  Breadcrumb,
  Cta,
  Pill,
  ImageFrame,
} from '@/components/site/ui';
import {
  TextField,
  TextAreaField,
  SelectField,
  SwitchField,
  FormGrid,
  FormActions,
  FormSection,
  FormSectionTitle,
  FormSectionHint,
} from '@/components/ui/FormFields';

const PageWrap = styled.div`
  padding: 34px 0 0;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 0.75fr);
  gap: 34px;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const FormPanel = styled.div`
  padding: 30px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.xl};
  background: #fff;
  box-shadow: ${shadows.card};

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const PanelHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
`;

const FormTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(24px, 2.6vw, 31px);
  font-weight: 500;
  letter-spacing: -0.028em;
  color: ${colors.ink};
`;

const FormSub = styled.p`
  margin-top: 6px;
  font-size: 11.5px;
  color: ${colors.muted};
  line-height: 1.6;
`;

const Submit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 22px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.forest};
  background: ${colors.forest};
  color: #F9F6EE;
  font-family: ${fonts.sans};
  font-size: 12.5px;
  font-weight: 700;
  transition: background ${transitions.fast};

  &:hover {
    background: ${colors.forestDeep};
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 1000px) {
    position: static;
  }
`;

const SideCard = styled.div`
  padding: 22px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: ${colors.paper};

  h3 {
    font-family: ${fonts.sans};
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: ${colors.faint};
    margin-bottom: 14px;
  }
`;

const Step = styled.div`
  display: flex;
  gap: 11px;
  padding: 11px 0;
  border-top: 1px solid ${colors.lineSoft};

  &:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  &:last-of-type {
    padding-bottom: 0;
  }

  small {
    font-family: ${fonts.mono};
    font-size: 9.5px;
    font-weight: 700;
    color: ${colors.copperDeep};
    padding-top: 1px;
  }

  strong {
    display: block;
    font-size: 11.5px;
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

const ContactMini = styled.div`
  padding: 20px;
  border-radius: ${radii.lg};
  background: ${colors.sidebar};
  color: rgba(243, 239, 228, 0.68);

  h3 {
    font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 500;
    color: #F9F6EE;
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 7px;
    font-size: 10.5px;
    line-height: 1.6;
  }

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(249, 246, 238, 0.86);
    transition: color ${transitions.fast};

    svg {
      color: ${colors.copperSoft};
    }

    &:hover {
      color: ${colors.copperSoft};
    }
  }

  div {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const TrustList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 9px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
    font-weight: 600;
  }

  svg {
    color: ${colors.success};
    flex: 0 0 auto;
    margin-top: 1px;
  }
`;

const SuccessPanel = styled.div`
  padding: 34px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.xl};
  background: #fff;
  box-shadow: ${shadows.card};
  text-align: center;

  > svg {
    color: ${colors.success};
  }

  h2 {
    margin-top: 14px;
    font-family: ${fonts.display};
    font-size: clamp(27px, 3vw, 34px);
    font-weight: 500;
    letter-spacing: -0.03em;
    color: ${colors.ink};
  }

  p {
    margin: 10px auto 0;
    max-width: 460px;
    font-size: 12px;
    line-height: 1.75;
    color: ${colors.muted};
  }

  @media (max-width: 640px) {
    padding: 24px 18px;
  }
`;

const Ref = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 9px 14px;
  border-radius: ${radii.pill};
  background: ${colors.paper};
  border: 1px dashed ${colors.line};
  font-family: ${fonts.mono};
  font-size: 10.5px;
  color: ${colors.inkSoft};
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 24px 0;
  text-align: left;

  div {
    padding: 12px;
    border-radius: ${radii.sm};
    background: ${colors.paper};
    border: 1px solid ${colors.lineSoft};
  }

  small {
    display: block;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 4px;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.4;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 9px;
  justify-content: center;
  flex-wrap: wrap;
`;

const SecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.sm};
  background: #fff;
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: 700;
  color: ${colors.ink};
  transition: all ${transitions.fast};

  &:hover {
    border-color: ${colors.forest};
    color: ${colors.forest};
  }
`;

const validation = Yup.object({
  company: Yup.string().trim().required('Company name is required'),
  name: Yup.string().trim().required('Your name is required'),
  email: Yup.string().trim().email('Enter a valid work email').required('Work email is required'),
  phone: Yup.string()
    .trim()
    .min(8, 'Enter a reachable phone number')
    .required('Phone number is required'),
  city: Yup.string().trim().required('City is required'),
  product: Yup.string().required('Select the packaging you need'),
  quantity: Yup.number()
    .typeError('Enter a number')
    .positive('Enter the expected quantity')
    .required('Expected quantity is required'),
});

const productOptions = [
  ...products.map((product) => `${product.name} · from ₹${product.startingAt}/${product.unit}`),
  'Custom structure / not sure yet',
];

export default function RequestQuotePage() {
  const contact = useDemoStore((state) => state.cms.contact);
  const addLead = useDemoStore((state) => state.addLead);
  const [productPrefill, setProductPrefill] = useState('');
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('product');
    if (!raw) return;
    const match = products.find(
      (product) => product.slug === raw || product.name.toLowerCase() === raw.toLowerCase()
    );
    const label = match ? `${match.name} · from ₹${match.startingAt}/${match.unit}` : raw;
    setProductPrefill(label);
  }, []);

  const initialValues = {
    company: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    website: '',
    product: productPrefill,
    quantity: '',
    unit: 'units',
    targetDate: plusDaysISO(30),
    artwork: 'Print-ready artwork',
    budget: 'Not sure yet',
    sampleKit: false,
    notes: '',
  };

  return (
    <>
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Request a quote
          </Breadcrumb>
          <Kicker>Request a quote</Kicker>
          <h1
            style={{
              marginTop: 16,
              fontFamily: fonts.display,
              fontSize: 'clamp(38px, 5vw, 62px)',
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: '-0.038em',
              color: colors.ink,
              maxWidth: 820,
            }}
          >
            Tell us what you need. We&apos;ll engineer the rest.
          </h1>
          <p style={{ marginTop: 18, fontSize: 14.5, lineHeight: 1.72, color: colors.muted, maxWidth: 600 }}>
            Share your product, volume and date. A packaging consultant will respond within one business day
            with a structure recommendation and indicative pricing.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 22 }}>
            <Pill>
              <Clock3 size={10} /> 1 business day response
            </Pill>
            <Pill>
              <ShieldCheck size={10} /> NDA on request
            </Pill>
            <Pill>
              <Layers size={10} /> Free prototype for qualified projects
            </Pill>
          </div>
        </Container>
      </PageIntro>

      <PageWrap>
        <Container>
          <Layout>
            {submitted ? (
              <SuccessPanel>
                <CheckCircle2 size={44} />
                <h2>Your brief is in.</h2>
                <p>
                  Thank you, {submitted.name}. Your request has been assigned to a packaging consultant and
                  logged in the demo CRM. We will respond to <strong>{submitted.email}</strong> within one
                  business day.
                </p>
                <Ref>
                  <FileCheck2 size={13} /> Reference {submitted.reference}
                </Ref>
                <Summary>
                  <div>
                    <small>Company</small>
                    <strong>{submitted.company}</strong>
                  </div>
                  <div>
                    <small>Packaging</small>
                    <strong>{submitted.product.split(' · ')[0]}</strong>
                  </div>
                  <div>
                    <small>Quantity</small>
                    <strong>{submitted.quantity}</strong>
                  </div>
                </Summary>
                <Actions>
                  <Cta href="/products" variant="primary" size="md">
                    Explore formats <ArrowRight size={14} />
                  </Cta>
                  <SecondaryBtn type="button" onClick={() => setSubmitted(null)}>
                    Submit another RFQ
                  </SecondaryBtn>
                </Actions>
                <p style={{ marginTop: 16, fontSize: 10, color: colors.faint }}>
                  Demo workspace: this RFQ is visible under CRM &amp; Leads in the{' '}
                  <Link href="/admin/leads" style={{ color: colors.copperDeep, fontWeight: 700 }}>
                    admin dashboard
                  </Link>
                  .
                </p>
              </SuccessPanel>
            ) : (
              <FormPanel>
                <PanelHead>
                  <div>
                    <FormTitle>Your packaging brief</FormTitle>
                    <FormSub>Fields marked * are required. It takes about two minutes.</FormSub>
                  </div>
                  <Pill $tone="copper">
                    <Sparkles size={10} /> No obligation
                  </Pill>
                </PanelHead>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validation}
                  enableReinitialize
                  onSubmit={(values, helpers) => {
                    const quantity = `${Number(values.quantity).toLocaleString('en-IN')} ${values.unit}`;
                    const productName = values.product.split(' · ')[0];
                    const matchedProduct = products.find((product) => product.name === productName);
                    const brief = [
                      `Target delivery: ${values.targetDate}`,
                      `Artwork: ${values.artwork}`,
                      `Budget: ${values.budget}`,
                      values.sampleKit ? 'Sample kit requested' : null,
                      values.website ? `Website: ${values.website}` : null,
                      values.notes ? `Notes: ${values.notes}` : null,
                    ]
                      .filter(Boolean)
                      .join('\n');

                    const lead = addLead({
                      company: values.company,
                      contact: values.name,
                      title: 'Procurement lead',
                      email: values.email,
                      phone: values.phone,
                      city: values.city,
                      source: 'Website RFQ',
                      product: productName,
                      quantity,
                      value: matchedProduct ? matchedProduct.startingAt * Number(values.quantity) : 0,
                      notes: brief,
                    });
                    notify('Quote request received', `${values.company} · ${quantity} logged in CRM.`, 'success');
                    setSubmitted({
                      name: values.name,
                      company: values.company,
                      email: values.email,
                      product: values.product,
                      quantity,
                      reference: lead.reference || lead.id,
                    });
                    helpers.resetForm({ values: { ...initialValues, product: '' } });
                    setProductPrefill('');
                  }}
                >
                  <Form>
                    <FormSection $first>
                      <FormSectionTitle>1 · About you</FormSectionTitle>
                      <FormSectionHint>We use these details only to respond to this request.</FormSectionHint>
                      <FormGrid $cols={2}>
                        <TextField name="company" label="Company" placeholder="Northline Apparel" required />
                        <TextField name="name" label="Your name" placeholder="Meera Raghavan" required />
                        <TextField name="email" label="Work email" type="email" placeholder="meera@brand.com" required />
                        <TextField name="phone" label="Phone" placeholder="+91 98200 11223" required />
                        <TextField name="city" label="City" placeholder="Mumbai" required />
                        <TextField name="website" label="Website" placeholder="brand.com" hint="Optional" />
                      </FormGrid>
                    </FormSection>

                    <FormSection>
                      <FormSectionTitle>2 · The packaging</FormSectionTitle>
                      <FormSectionHint>
                        Approximate is fine. We will refine dimensions and board grade with you.
                      </FormSectionHint>
                      <SelectField
                        name="product"
                        label="Packaging type"
                        options={productOptions}
                        placeholder="Select a format"
                        required
                      />
                      <div style={{ height: 14 }} />
                      <FormGrid $cols={3}>
                        <TextField name="quantity" label="Expected quantity" type="number" placeholder="5000" required />
                        <SelectField
                          name="unit"
                          label="Unit"
                          options={['units', 'kits', 'sets', 'pallets', 'monthly units']}
                        />
                        <TextField name="targetDate" label="Needed by" type="date" min={todayISO()} />
                      </FormGrid>
                      <div style={{ height: 14 }} />
                      <FormGrid $cols={2}>
                        <SelectField
                          name="artwork"
                          label="Artwork status"
                          options={[
                            'Print-ready artwork',
                            'Final artwork in progress',
                            'Need design support',
                            'Existing dieline to match',
                            'White / unprinted',
                          ]}
                        />
                        <SelectField
                          name="budget"
                          label="Indicative budget"
                          options={['Not sure yet', 'Under ₹1 lakh', '₹1–5 lakh', '₹5–15 lakh', '₹15 lakh+']}
                        />
                      </FormGrid>
                      <div style={{ marginTop: 8 }}>
                        <SwitchField
                          name="sampleKit"
                          label="Send a physical sample kit"
                          description="Paper swatches, board grades and finish samples before the quote call."
                        />
                      </div>
                    </FormSection>

                    <FormSection>
                      <FormSectionTitle>3 · The brief</FormSectionTitle>
                      <FormSectionHint>
                        Product dimensions, channel, damage issues, shelf constraints — anything that shapes
                        the solution.
                      </FormSectionHint>
                      <TextAreaField
                        name="notes"
                        label="Project notes"
                        rows={5}
                        placeholder="We ship 6,000 orders a month through 3PLs, with high damage on glass bottles. Looking for a right-sized mailer with an insert…"
                      />
                    </FormSection>

                    <FormActions>
                      <div style={{ flex: 1, minWidth: 200, fontSize: 10, color: colors.faint, lineHeight: 1.5 }}>
                        Submitting writes this RFQ into the demo CRM. No email is sent and no data leaves your
                        browser.
                      </div>
                      <Submit type="submit">
                        Submit RFQ <ArrowRight size={15} />
                      </Submit>
                    </FormActions>
                  </Form>
                </Formik>
              </FormPanel>
            )}

            <Sidebar>
              <SideCard>
                <h3>What happens next</h3>
                <Step>
                  <small>01</small>
                  <div>
                    <strong>Discovery call</strong>
                    <span>Within one business day, a consultant confirms scope and constraints.</span>
                  </div>
                </Step>
                <Step>
                  <small>02</small>
                  <div>
                    <strong>Structure & prototype</strong>
                    <span>White samples in 72 hours; printed prototypes in 5–7 days.</span>
                  </div>
                </Step>
                <Step>
                  <small>03</small>
                  <div>
                    <strong>Quote & production plan</strong>
                    <span>Costed structure, tooling and a confirmed dispatch window.</span>
                  </div>
                </Step>
              </SideCard>

              <ContactMini>
                <h3>Prefer to talk?</h3>
                <p>Our sales desk is available Monday to Saturday, 9:00–18:30 IST.</p>
                <a href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>
                  <Phone size={12} /> {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`}>
                  <Mail size={12} /> {contact.email}
                </a>
                <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={12} /> WhatsApp the team
                </a>
              </ContactMini>

              <SideCard>
                <h3>Why teams shortlist us</h3>
                <TrustList>
                  <li>
                    <CheckCircle2 size={12} /> In-house design, board, print and converting
                  </li>
                  <li>
                    <CheckCircle2 size={12} /> 500-unit MOQs on standard formats
                  </li>
                  <li>
                    <CheckCircle2 size={12} /> FSC-certified, recyclable materials
                  </li>
                  <li>
                    <CheckCircle2 size={12} /> 99.2% on-time dispatch across 4,100 dispatches
                  </li>
                </TrustList>
              </SideCard>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  padding: '13px 16px',
                  borderRadius: radii.md,
                  border: `1px solid ${colors.lineSoft}`,
                  background: '#fff',
                  fontSize: 10.5,
                  color: colors.muted,
                  lineHeight: 1.5,
                }}
              >
                <Boxes size={15} style={{ color: colors.copper, flex: '0 0 auto' }} />
                Need a formal tender pack? Email {contact.email} with your RFP documents.
              </div>
            </Sidebar>
          </Layout>
        </Container>
      </PageWrap>

      <div style={{ height: 64 }} />
    </>
  );
}
