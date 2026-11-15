'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Quote as QuoteIcon, Beaker, CheckCircle2 } from 'lucide-react';
import {
  qualityCertifications,
  qualityMetrics,
  qualityTests,
  qualitySteps,
  qualityQuote,
} from '@/data/catalog';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
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
  ImageFrame,
  Pill,
  StatGrid,
  Stat,
  CTABand,
  BandActions,
} from '@/components/site/ui';

const CertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const CertCard = styled.article`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: #fff;
  box-shadow: ${shadows.xs};
  transition: border-color ${transitions.fast}, transform ${transitions.fast};

  &:hover {
    border-color: #D6CFC0;
    transform: translateY(-2px);
  }

  small {
    display: inline-block;
    align-self: flex-start;
    padding: 3px 8px;
    border-radius: ${radii.pill};
    background: ${colors.paper};
    border: 1px solid ${colors.lineSoft};
    font-family: ${fonts.mono};
    font-size: 9px;
    font-weight: 600;
    color: ${colors.copperDeep};
  }

  h3 {
    margin-top: 14px;
    font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }

  p {
    margin-top: 6px;
    font-size: 11px;
    line-height: 1.6;
    color: ${colors.muted};
    flex: 1;
  }

  span {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid ${colors.lineSoft};
    font-size: 9.5px;
    font-weight: 700;
    color: ${colors.inkSoft};
  }
`;

const TestTable = styled.div`
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  overflow: hidden;
  background: #fff;
`;

const TestHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.8fr 1.6fr;
  gap: 16px;
  padding: 12px 18px;
  background: #FBFAF6;
  border-bottom: 1px solid ${colors.lineSoft};
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${colors.faint};

  @media (max-width: 760px) {
    display: none;
  }
`;

const TestRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.8fr 1.6fr;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid ${colors.lineSoft};
  align-items: center;

  &:last-child {
    border-bottom: 0;
  }

  strong {
    font-size: 12.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  em {
    font-style: normal;
    font-family: ${fonts.mono};
    font-size: 10px;
    color: ${colors.copperDeep};
  }

  p {
    font-size: 11.5px;
    color: ${colors.muted};
    line-height: 1.5;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 14px;
  }
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.div`
  position: relative;
  padding: 18px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  background: ${colors.paper};

  small {
    font-family: ${fonts.mono};
    font-size: 9.5px;
    font-weight: 700;
    color: ${colors.copperDeep};
    letter-spacing: 0.08em;
  }

  strong {
    display: block;
    margin-top: 10px;
    font-size: 12px;
    font-weight: 700;
    color: ${colors.ink};
  }

  p {
    margin-top: 5px;
    font-size: 10.5px;
    line-height: 1.55;
    color: ${colors.muted};
  }
`;

const QuoteSplit = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 40px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 26px;
  }
`;

const BigQuote = styled.blockquote`
  padding: 34px;
  border-radius: ${radii.xl};
  background: #fff;
  border: 1px solid ${colors.line};
  box-shadow: ${shadows.card};

  > svg {
    color: ${colors.copper};
  }

  p {
    margin-top: 16px;
    font-family: ${fonts.display};
    font-size: clamp(21px, 2.5vw, 30px);
    line-height: 1.35;
    letter-spacing: -0.025em;
    color: ${colors.ink};
  }

  @media (max-width: 640px) {
    padding: 22px;
  }
`;

const QuoteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid ${colors.lineSoft};

  div strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: ${colors.ink};
  }

  div span {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    color: ${colors.muted};
  }
`;

const QuoteAvatar = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${colors.copperWash};
  color: ${colors.copperDeep};
  font-size: 11px;
  font-weight: 800;
  border: 1px solid rgba(184, 115, 51, 0.24);
`;

const LabImage = styled(ImageFrame)`
  aspect-ratio: 4 / 4.2;

  @media (max-width: 900px) {
    aspect-ratio: 16 / 11;
  }
`;

export default function QualityPage() {
  return (
    <>
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Quality
          </Breadcrumb>
          <Kicker>Quality & compliance</Kicker>
          <IntroTitle>Quality is a system, not a promise.</IntroTitle>
          <IntroLede>
            Certified processes, calibrated equipment and a laboratory that treats every new structure as a
            hypothesis to be tested. This is how 120 million boxes leave without surprises.
          </IntroLede>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Cta href="/request-a-quote" variant="primary" size="md">
              Request a sample pack <ArrowRight size={14} />
            </Cta>
            <Cta href="/capabilities" variant="outline" size="md">
              Manufacturing capabilities
            </Cta>
          </div>
          <div style={{ marginTop: 34, maxWidth: 960 }}>
            <StatGrid>
              {qualityMetrics.map((metric) => (
                <Stat key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </Stat>
              ))}
            </StatGrid>
          </div>
        </Container>
      </PageIntro>

      <Section>
        <Container>
          <SectionHead
            kicker="Certifications"
            title="Audited by the bodies your customers trust."
            lede="Certificates are current and available on request with the relevant scope statements."
            action={
              <Pill>
                <ShieldCheck size={10} /> Bureau Veritas audited
              </Pill>
            }
          />
          <CertGrid>
            {qualityCertifications.map((cert) => (
              <CertCard key={cert.code}>
                <small>{cert.code}</small>
                <h3>{cert.name}</h3>
                <p>{cert.description}</p>
                <span>
                  <CheckCircle2 size={11} style={{ color: colors.success }} /> {cert.body}
                </span>
              </CertCard>
            ))}
          </CertGrid>
        </Container>
      </Section>

      <Section $tone="white">
        <Container>
          <SectionHead
            kicker="Laboratory"
            title="Six tests that decide whether a pack ships."
            lede="New structures and production samples are measured against the specification, not against a feeling."
            action={
              <Pill $tone="copper">
                <Beaker size={10} /> 48-hour lab turnaround
              </Pill>
            }
          />
          <TestTable>
            <TestHead>
              <span>Test</span>
              <span>Standard</span>
              <span>What it proves</span>
            </TestHead>
            {qualityTests.map((test) => (
              <TestRow key={test.name}>
                <strong>{test.name}</strong>
                <em>{test.standard}</em>
                <p>{test.detail}</p>
              </TestRow>
            ))}
          </TestTable>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <SectionHead
            kicker="Process control"
            title="Five gates between a reel and a dispatched pallet."
            lede="Each gate has an owner, a record and a release decision. Nothing moves forward on assumption."
            flush
          />
          <div style={{ height: 30 }} />
          <Steps>
            {qualitySteps.map((step) => (
              <Step key={step.step}>
                <small>{step.step}</small>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </Step>
            ))}
          </Steps>
        </Container>
      </Section>

      <Section>
        <Container>
          <QuoteSplit>
            <BigQuote>
              <QuoteIcon size={26} />
              <p>“{qualityQuote.quote}”</p>
              <QuoteMeta>
                <QuoteAvatar>{qualityQuote.initials}</QuoteAvatar>
                <div>
                  <strong>{qualityQuote.name}</strong>
                  <span>{qualityQuote.role}</span>
                </div>
              </QuoteMeta>
            </BigQuote>
            <LabImage>
              <Image
                src="/images/specialty-packaging.jpg"
                alt="Precision-finished specialty packaging inspected in the Stark Packmate lab"
                fill
                sizes="(max-width: 900px) 92vw, 42vw"
              />
            </LabImage>
          </QuoteSplit>
        </Container>
      </Section>

      <Section $tone="paper" $tight>
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>Documentation on request</Pill>
              <h2 style={{ marginTop: 14 }}>Ask for the test report before you place the order.</h2>
              <p>
                We share material certificates, test data and batch traceability for every programme. No
                surprises in an audit.
              </p>
            </div>
            <BandActions>
              <Cta href="/contact" variant="copper" size="lg">
                Request documentation <ArrowRight size={15} />
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
    </>
  );
}
