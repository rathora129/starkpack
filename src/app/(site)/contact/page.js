'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { faqs } from '@/data/catalog';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import { usePageSections } from '@/hooks/usePageSections';
import { captureAttribution } from '@/lib/attribution';
import {
  Container,
  Section,
  PageIntro,
  IntroTitle,
  IntroLede,
  Kicker,
  Breadcrumb,
  SectionHead,
  Cta,
  Pill,
  CTABand,
  BandActions,
} from '@/components/site/ui';
import { CmsPageFlow, CmsSection } from '@/components/site/CmsPageFlow';
import { TextField, TextAreaField, SelectField, FormGrid } from '@/components/ui/FormFields';

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 44px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ContactCard = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 16px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.md};
  background: #fff;
  transition: border-color ${transitions.fast}, transform ${transitions.fast};

  & + & {
    margin-top: 10px;
  }

  &:hover {
    border-color: ${colors.forest};
    transform: translateY(-1px);
  }

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    color: ${colors.muted};
    line-height: 1.55;
  }

  em {
    display: block;
    margin-top: 5px;
    font-style: normal;
    font-size: 10px;
    font-weight: 700;
    color: ${colors.copperDeep};
  }
`;

const IconTile = styled.span`
  width: 38px;
  height: 38px;
  border-radius: ${radii.sm};
  display: grid;
  place-items: center;
  background: ${colors.paper};
  border: 1px solid ${colors.lineSoft};
  color: ${colors.forest};
  flex: 0 0 auto;
`;

const PlantList = styled.div`
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid ${colors.line};

  h3 {
    font-family: ${fonts.sans};
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${colors.faint};
    margin-bottom: 10px;
  }

  div {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 7px 0;
    font-size: 11px;
    color: ${colors.muted};
    line-height: 1.5;
  }

  svg {
    color: ${colors.copper};
    flex: 0 0 auto;
    margin-top: 2px;
  }

  strong {
    color: ${colors.inkSoft};
    font-weight: 700;
  }
`;

const FormPanel = styled.div`
  padding: 28px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.xl};
  background: #fff;
  box-shadow: ${shadows.card};

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const FormTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(25px, 2.8vw, 32px);
  font-weight: 500;
  letter-spacing: -0.028em;
  color: ${colors.ink};
`;

const FormSub = styled.p`
  margin-top: 7px;
  font-size: 11.5px;
  color: ${colors.muted};
  line-height: 1.6;
`;

const Submit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.forest};
  background: ${colors.forest};
  color: #F6F6FF;
  font-family: ${fonts.sans};
  font-size: 12.5px;
  font-weight: 700;
  margin-top: 18px;
  transition: background ${transitions.fast};

  &:hover {
    background: ${colors.forestDeep};
  }
`;

const FormNote = styled.p`
  margin-top: 12px;
  font-size: 10px;
  color: ${colors.faint};
  line-height: 1.55;
  text-align: center;
`;

const Success = styled.div`
  text-align: center;
  padding: 26px 10px 10px;

  svg {
    color: ${colors.success};
  }

  h2 {
    margin-top: 14px;
    font-family: ${fonts.display};
    font-size: 30px;
    font-weight: 500;
    letter-spacing: -0.03em;
    color: ${colors.ink};
  }

  p {
    margin: 10px auto 0;
    max-width: 380px;
    font-size: 12px;
    line-height: 1.7;
    color: ${colors.muted};
  }
`;

const Reference = styled.div`
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

const SuccessActions = styled.div`
  display: flex;
  gap: 9px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const FaqWrap = styled.div`
  max-width: 860px;
  margin: 0 auto;
  border-top: 1px solid ${colors.line};
`;

const FaqItem = styled.div`
  border-bottom: 1px solid ${colors.lineSoft};

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    padding: 18px 0;
    border: 0;
    background: transparent;
    text-align: left;
    font-family: ${fonts.sans};
    font-size: 13px;
    font-weight: 700;
    color: ${colors.ink};
  }

  svg {
    color: ${colors.copper};
    flex: 0 0 auto;
    transform: rotate(${({ $open }) => ($open ? '45deg' : '0deg')});
    transition: transform ${transitions.base};
  }

  p {
    padding: 0 0 18px;
    max-width: 720px;
    font-size: 12px;
    line-height: 1.75;
    color: ${colors.muted};
  }
`;

const IntroActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 26px;
`;

const validation = Yup.object({
  name: Yup.string().trim().required('Please share your name'),
  company: Yup.string().trim().required('Company name is required'),
  email: Yup.string().trim().email('Enter a valid work email').required('Work email is required'),
  phone: Yup.string().trim(),
  subject: Yup.string().required('Select what this is about'),
  message: Yup.string().trim().min(10, 'A little more detail helps us route this').required('Tell us how we can help'),
});

export default function ContactPage() {
  const { section } = usePageSections('/contact');
  const hero = section('hero', {
    kicker: 'Contact',
    title: "Let's talk packaging.",
    body: 'A packaging consultant — not a call centre — will respond within one business day. Share a product, a constraint or a deadline and we will come back with something useful.',
  });
  const faq = section('faq', { kicker: 'Before you ask', title: 'Frequently asked questions.' });
  const contact = useDemoStore((state) => state.cms.contact);
  const addLead = useDemoStore((state) => state.addLead);
  const [submitted, setSubmitted] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <CmsPageFlow slug="/contact" knownKeys={['hero', 'form', 'faq', 'cta']}>
      <CmsSection sectionKey="hero">
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Contact
          </Breadcrumb>
          <Kicker>{hero.kicker}</Kicker>
          <IntroTitle>{hero.title}</IntroTitle>
          <IntroLede>{hero.body}</IntroLede>
          <IntroActions>
            <Cta href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`} variant="primary" size="md">
              <Phone size={14} /> {contact.phone}
            </Cta>
            <Cta href={`https://wa.me/${contact.whatsapp}`} variant="outline" size="md" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14} /> WhatsApp us
            </Cta>
          </IntroActions>
        </Container>
      </PageIntro>
      </CmsSection>

      <CmsSection sectionKey="form">
      <Section>
        <Container>
          <Layout>
            <div>
              <Kicker>Direct lines</Kicker>
              <h2 style={{ marginTop: 12, fontFamily: fonts.display, fontSize: 'clamp(24px, 2.8vw, 32px)', fontWeight: 500, letterSpacing: '-0.028em', color: colors.ink }}>
                Reach the right team, first time.
              </h2>
              <div style={{ marginTop: 18 }}>
                <ContactCard href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>
                  <IconTile>
                    <Phone size={16} />
                  </IconTile>
                  <div>
                    <strong>Sales & new enquiries</strong>
                    <span>Speak to a packaging consultant about a new programme.</span>
                    <em>{contact.phone}</em>
                  </div>
                </ContactCard>
                <ContactCard href={`mailto:${contact.email}`}>
                  <IconTile>
                    <Mail size={16} />
                  </IconTile>
                  <div>
                    <strong>Email the team</strong>
                    <span>Send briefs, dielines or existing artwork for review.</span>
                    <em>{contact.email}</em>
                  </div>
                </ContactCard>
                <ContactCard href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <IconTile>
                    <MessageCircle size={16} />
                  </IconTile>
                  <div>
                    <strong>WhatsApp</strong>
                    <span>Quick questions, order updates and sample requests.</span>
                    <em>Chat with a consultant</em>
                  </div>
                </ContactCard>
              </div>

              <PlantList>
                <h3>Facilities</h3>
                <div>
                  <MapPin size={12} />
                  <span>
                    <strong>Mumbai — Head office &amp; plant</strong>
                    <br />
                    {contact.address}
                  </span>
                </div>
                <div>
                  <MapPin size={12} />
                  <span>
                    <strong>Pune — Chakan plant</strong>
                    <br />
                    Plot 118, MIDC Chakan Phase II, Pune 410501
                  </span>
                </div>
                <div>
                  <MapPin size={12} />
                  <span>
                    <strong>Chennai — Sriperumbudur plant</strong>
                    <br />
                    SIPCOT Industrial Park, Sriperumbudur 602105
                  </span>
                </div>
                <div>
                  <Clock size={12} />
                  <span>{contact.hours}</span>
                </div>
              </PlantList>
            </div>

            <FormPanel>
              {submitted ? (
                <Success>
                  <CheckCircle2 size={42} />
                  <h2>Message received.</h2>
                  <p>
                    Thank you, {submitted.name}. Your enquiry has been logged with our packaging team and added
                    to the CRM in this demo. Expect a reply within one business day.
                  </p>
                  <Reference>
                    Reference {submitted.reference} · {submitted.subject}
                  </Reference>
                  <SuccessActions>
                    <Cta href="/request-a-quote" variant="primary" size="sm">
                      Request a formal quote <ArrowRight size={13} />
                    </Cta>
                    <button
                      type="button"
                      onClick={() => setSubmitted(null)}
                      style={{
                        border: `1px solid ${colors.line}`,
                        background: '#fff',
                        borderRadius: radii.sm,
                        padding: '9px 14px',
                        fontFamily: fonts.sans,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: colors.ink,
                      }}
                    >
                      Send another message
                    </button>
                  </SuccessActions>
                </Success>
              ) : (
                <>
                  <FormTitle>Tell us what you are working on.</FormTitle>
                  <FormSub>
                    Every enquiry is read by a packaging consultant. If it is urgent, call or WhatsApp us and
                    mention this form.
                  </FormSub>
                  <div style={{ marginTop: 22 }}>
                    <Formik
                      initialValues={{ name: '', company: '', email: '', phone: '', subject: 'New packaging programme', message: '' }}
                      validationSchema={validation}
                      onSubmit={(values, helpers) => {
                        const lead = addLead({
                          ...captureAttribution(),
                          company: values.company,
                          contact: values.name,
                          title: 'Website enquiry',
                          email: values.email,
                          phone: values.phone,
                          city: '—',
                          source: 'Website contact',
                          product: values.subject,
                          quantity: 'To be confirmed',
                          notes: values.message,
                        });
                        notify('Message received', 'Your enquiry has been added to the CRM in this demo.', 'success');
                        setSubmitted({ name: values.name, reference: lead.reference || lead.id, subject: values.subject });
                        helpers.resetForm();
                      }}
                    >
                      <Form>
                        <FormGrid $cols={2}>
                          <TextField name="name" label="Your name" placeholder="Meera Raghavan" required />
                          <TextField name="company" label="Company" placeholder="Northline Apparel" required />
                          <TextField name="email" label="Work email" type="email" placeholder="meera@brand.com" required />
                          <TextField name="phone" label="Phone" placeholder="+91 98…" />
                        </FormGrid>
                        <div style={{ height: 14 }} />
                        <SelectField
                          name="subject"
                          label="What is this about?"
                          options={[
                            'New packaging programme',
                            'Request samples',
                            'Existing order support',
                            'Artwork & prepress',
                            'Quality or documentation',
                            'Partnership / agency',
                          ]}
                        />
                        <div style={{ height: 14 }} />
                        <TextAreaField
                          name="message"
                          label="How can we help?"
                          rows={5}
                          placeholder="We are launching a 6-SKU skincare range in January and need a mailer plus carton system…"
                          required
                        />
                        <Submit type="submit">
                          Send message <ArrowRight size={15} />
                        </Submit>
                        <FormNote>
                          Demo note: submitting writes a new lead into the admin CRM. No email is sent.
                        </FormNote>
                      </Form>
                    </Formik>
                  </div>
                </>
              )}
            </FormPanel>
          </Layout>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="faq">
      <Section $tone="paper" $tight>
        <Container>
          <SectionHead kicker={faq.kicker} title={faq.title} center flush />
        </Container>
        <Container style={{ marginTop: 30 }}>
          <FaqWrap>
            {faqs.map((faq, index) => (
              <FaqItem key={faq.q} $open={openFaq === index}>
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  {faq.q} <Plus size={16} />
                </button>
                {openFaq === index ? <p>{faq.a}</p> : null}
              </FaqItem>
            ))}
          </FaqWrap>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="cta">
      <Section $tight>
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>Faster than a form</Pill>
              <h2 style={{ marginTop: 14 }}>Need a number today?</h2>
              <p>Our sales desk is available Monday to Saturday, 9:00–18:30 IST.</p>
            </div>
            <BandActions>
              <Cta href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`} variant="copper" size="lg">
                <Phone size={15} /> Call the desk
              </Cta>
              <Cta href={`https://wa.me/${contact.whatsapp}`} variant="ghostLight" size="lg" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={15} /> WhatsApp
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
      </CmsSection>
    </CmsPageFlow>
  );
}
