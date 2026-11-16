'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { colors, fonts, radii, shadows } from '@/lib/theme';
import { Container, Section, Kicker, Cta } from './ui';

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  background: radial-gradient(120% 140% at 85% 0%, #1B1464 0%, #120D45 42%, #0D0A33 100%);
  color: #F6F6FF;
  padding: 96px 0 88px;

  &::after {
    content: '';
    position: absolute;
    right: -140px;
    top: -180px;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    border: 1px solid rgba(217, 160, 106, 0.22);
    pointer-events: none;
  }

  @media (max-width: 760px) {
    padding: 64px 0 58px;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 760px;
`;

const HeroKicker = styled.p`
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.copperSoft};
`;

const HeroTitle = styled.h1`
  font-family: ${fonts.display};
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 18px 0 20px;
  color: #F6F6FF;
`;

const HeroBody = styled.p`
  font-size: 15px;
  line-height: 1.75;
  color: rgba(249, 246, 238, 0.78);
  max-width: 620px;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 34px;
  padding-top: 22px;
  border-top: 1px solid rgba(249, 246, 238, 0.14);
  font-size: 11px;
  color: rgba(249, 246, 238, 0.62);

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

const Split = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 44px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
`;

const BlockTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(26px, 3.4vw, 38px);
  font-weight: 500;
  line-height: 1.14;
  letter-spacing: -0.025em;
  color: ${colors.ink};
`;

const BlockBody = styled.p`
  font-size: 13.5px;
  line-height: 1.8;
  color: ${colors.muted};
  margin-top: 16px;
`;

const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 22px;
`;

const PillItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border-radius: ${radii.pill};
  background: #fff;
  border: 1px solid ${colors.lineSoft};
  font-size: 11.5px;
  font-weight: 600;
  color: ${colors.inkSoft};
  box-shadow: ${shadows.xs};

  svg {
    color: ${colors.copper};
  }
`;

const ProofBand = styled(Section)`
  background: ${colors.copperWash};
`;

const ProofValue = styled.p`
  font-family: ${fonts.display};
  font-size: clamp(24px, 3.4vw, 36px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #6B3A14;
  max-width: 900px;
`;

const ProofLabel = styled.p`
  margin-top: 16px;
  font-size: 12px;
  line-height: 1.75;
  color: #7C491F;
  max-width: 760px;
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 32px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.div`
  padding: 20px;
  border-radius: ${radii.lg};
  border: 1px solid ${colors.lineSoft};
  background: #fff;
  box-shadow: ${shadows.xs};

  span {
    display: inline-grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: ${colors.forest};
    color: #F6F6FF;
    font-family: ${fonts.mono};
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  p {
    font-size: 12px;
    line-height: 1.7;
    color: ${colors.muted};
  }
`;

const Quote = styled.blockquote`
  max-width: 860px;
  margin: 0 auto;
  text-align: center;

  p.quote {
    font-family: ${fonts.display};
    font-size: clamp(22px, 3.2vw, 34px);
    font-weight: 400;
    line-height: 1.32;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }

  footer {
    margin-top: 20px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
  }
`;

const FormShell = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 36px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FormCard = styled.form`
  padding: 26px;
  border-radius: ${radii.lg};
  background: #fff;
  border: 1px solid ${colors.lineSoft};
  box-shadow: ${shadows.card};
  display: grid;
  gap: 13px;
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${colors.inkSoft};

  input,
  textarea,
  select {
    width: 100%;
    font-family: ${fonts.sans};
    font-size: 12.5px;
    color: ${colors.ink};
    background: #FAFAFD;
    border: 1px solid ${colors.line};
    border-radius: ${radii.sm};
    padding: 10px 12px;
    outline: none;
    transition: border-color 140ms ease, box-shadow 140ms ease;

    &:focus {
      border-color: ${colors.forest};
      box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.1);
    }
  }

  textarea {
    min-height: 86px;
    resize: vertical;
  }

  em {
    font-style: normal;
    font-weight: 600;
    color: ${colors.danger};
  }
`;

const FormError = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${colors.danger};
`;

const SuccessCard = styled.div`
  padding: 30px 26px;
  border-radius: ${radii.lg};
  border: 1px solid #D9D6F4;
  background: #F3F3FB;
  box-shadow: ${shadows.card};

  span {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: ${colors.forest};
    color: #F6F6FF;
    margin-bottom: 14px;
  }

  h3 {
    font-family: ${fonts.display};
    font-size: 22px;
    font-weight: 500;
    color: ${colors.ink};
    margin-bottom: 8px;
  }

  p {
    font-size: 12.5px;
    line-height: 1.7;
    color: ${colors.muted};
  }
`;

const FooterNote = styled.div`
  margin-top: 44px;
  padding-top: 18px;
  border-top: 1px solid ${colors.lineSoft};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 10.5px;
  color: ${colors.faint};
`;

function splitList(text) {
  return String(text || '')
    .split(/\s*[·•]\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitSteps(text) {
  return String(text || '')
    .split(/\s*→\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function EnquiryForm({ page, onSubmit, source }) {
  const fields = page.form?.fields || [];
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: null }));
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    fields.forEach((field) => {
      const value = String(values[field.key] || '').trim();
      if (field.required && !value) next[field.key] = `${field.label} is required`;
      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        next[field.key] = 'Enter a valid email address';
      }
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit?.({ ...values, utmSource: source });
    setDone(true);
  };

  if (done) {
    return (
      <SuccessCard>
        <span>
          <Check size={16} strokeWidth={3} />
        </span>
        <h3>{page.form?.title || 'Thank you'}</h3>
        <p>{page.form?.successMessage || 'Your enquiry has been received. Our team will contact you shortly.'}</p>
      </SuccessCard>
    );
  }

  return (
    <FormCard onSubmit={submit} noValidate>
      {fields.map((field) => (
        <Field key={field.key}>
          <span>
            {field.label}
            {field.required ? <em> *</em> : null}
          </span>
          {field.type === 'textarea' ? (
            <textarea
              value={values[field.key] || ''}
              onChange={(event) => update(field.key, event.target.value)}
              placeholder={field.placeholder || ''}
            />
          ) : (
            <input
              type={field.type || 'text'}
              value={values[field.key] || ''}
              onChange={(event) => update(field.key, event.target.value)}
            />
          )}
          {errors[field.key] ? <FormError>{errors[field.key]}</FormError> : null}
        </Field>
      ))}
      <button
        type="submit"
        style={{
          marginTop: 4,
          border: 0,
          cursor: 'pointer',
          borderRadius: radii.sm,
          padding: '12px 18px',
          background: colors.copper,
          color: '#fff',
          fontFamily: fonts.sans,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.02em',
        }}
      >
        {page.form?.submitLabel || 'Submit enquiry'}
      </button>
      <span style={{ fontSize: 10, color: colors.faint, lineHeight: 1.5 }}>
        Submitted enquiries route into the Stark Packmate CRM in this demo.
      </span>
    </FormCard>
  );
}

export default function LandingPageView({ page, onSubmit }) {
  const sections = (page.sections || []).filter((section) => section.enabled !== false);
  const hero = sections.find((section) => section.type === 'Hero');
  const rest = sections.filter((section) => section.type !== 'Hero');

  return (
    <div style={{ background: colors.cream }}>
      <Hero>
        <Container>
          <HeroInner>
            <HeroKicker>{page.template} campaign · {page.campaign}</HeroKicker>
            <HeroTitle>{hero?.title || page.headline || page.title}</HeroTitle>
            {hero?.body ? <HeroBody>{hero.body}</HeroBody> : null}
            <HeroActions>
              <Cta href="#enquiry" variant="copper" size="lg">
                {page.form?.submitLabel || 'Send an enquiry'} <ArrowRight size={15} />
              </Cta>
              <Cta href="/products" variant="ghostLight" size="lg">
                Browse the range
              </Cta>
            </HeroActions>
            <HeroMeta>
              <span>
                <ShieldCheck size={13} /> FSC-certified board
              </span>
              <span>
                <Check size={13} /> 72-hour prototypes
              </span>
              <span>
                <Check size={13} /> One quality standard
              </span>
            </HeroMeta>
          </HeroInner>
        </Container>
      </Hero>

      {rest.map((section, index) => {
        if (section.type === 'Enquiry form') {
          return (
            <Section key={section.id} id="enquiry" $tone="paper">
              <Container>
                <FormShell>
                  <div>
                    <Kicker>Enquire</Kicker>
                    <BlockTitle style={{ marginTop: 14 }}>{section.title || page.form?.title}</BlockTitle>
                    <BlockBody>{section.body}</BlockBody>
                  </div>
                  <EnquiryForm page={page} onSubmit={onSubmit} source={page.utm?.source} />
                </FormShell>
              </Container>
            </Section>
          );
        }

        if (section.type === 'Proof') {
          const pills = splitList(section.body);
          return (
            <ProofBand key={section.id} $tight>
              <Container>
                <ProofValue>{section.title}</ProofValue>
                {pills.length > 1 ? (
                  <PillRow>
                    {pills.map((item) => (
                      <PillItem key={item}>
                        <Check size={11} /> {item}
                      </PillItem>
                    ))}
                  </PillRow>
                ) : (
                  <ProofLabel>{section.body}</ProofLabel>
                )}
              </Container>
            </ProofBand>
          );
        }

        if (section.type === 'Testimonial') {
          return (
            <Section key={section.id} $tone="white">
              <Container>
                <Quote>
                  <p className="quote">“{section.title}”</p>
                  {section.body ? <footer>{section.body}</footer> : null}
                </Quote>
              </Container>
            </Section>
          );
        }

        const steps = section.type === 'Process' ? splitSteps(section.body) : splitList(section.body);
        return (
          <Section key={section.id} $tone={index % 2 === 0 ? 'cream' : 'white'}>
            <Container>
              <BlockTitle>{section.title}</BlockTitle>
              {steps.length > 1 ? (
                <StepGrid>
                  {steps.map((item, stepIndex) => (
                    <StepCard key={item}>
                      <span>{String(stepIndex + 1).padStart(2, '0')}</span>
                      <p>{item}</p>
                    </StepCard>
                  ))}
                </StepGrid>
              ) : (
                <BlockBody>{section.body}</BlockBody>
              )}
            </Container>
          </Section>
        );
      })}

      <Section $tone="cream" $tight>
        <Container>
          <FooterNote>
            <span>Stark Packmate · Packaging engineered around your supply chain.</span>
            <Link href="/" style={{ color: colors.forest, fontWeight: 700 }}>
              starkpackmate.com
            </Link>
          </FooterNote>
        </Container>
      </Section>
    </div>
  );
}
