'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Gauge, Factory as FactoryIcon } from 'lucide-react';
import { capabilities, machinery, facilityStats, qualityMetrics } from '@/data/catalog';
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
  FeatureCard,
  IconBadge,
  SiteIcon,
} from '@/components/site/ui';

const CapGrid = styled.div`
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

const FactorySplit = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 48px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FactoryImage = styled(ImageFrame)`
  aspect-ratio: 4 / 3.4;

  @media (max-width: 900px) {
    aspect-ratio: 16 / 11;
  }
`;

const ImageBadge = styled.div`
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border-radius: ${radii.pill};
  background: rgba(251, 248, 242, 0.95);
  border: 1px solid rgba(229, 224, 213, 0.9);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${colors.inkSoft};
  box-shadow: ${shadows.xs};

  svg {
    color: ${colors.copper};
  }
`;

const CheckList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 22px;
  border-top: 1px solid ${colors.line};

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid ${colors.lineSoft};
    font-size: 12px;
    line-height: 1.6;
    color: ${colors.inkSoft};
  }

  svg {
    color: ${colors.success};
    flex: 0 0 auto;
    margin-top: 2px;
  }
`;

const MachineryTable = styled.div`
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  overflow: hidden;
  background: #fff;

  @media (max-width: 760px) {
    border: 0;
    background: transparent;
    overflow: visible;
  }
`;

const MachineHead = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.85fr;
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

const MachineRow = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.85fr;
  gap: 16px;
  padding: 16px 18px;
  border-bottom: 1px solid ${colors.lineSoft};
  transition: background ${transitions.fast};

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: #FBFAF6;
  }

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  p {
    margin-top: 3px;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 16px;
    border: 1px solid ${colors.line};
    border-radius: ${radii.md};
    margin-bottom: 8px;
    background: #fff;
  }
`;

const Cell = styled.div`
  min-width: 0;

  span {
    display: block;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
  }

  em {
    display: block;
    font-style: normal;
    font-family: ${fonts.mono};
    font-size: 10px;
    color: ${colors.copperDeep};
    margin-top: 4px;
  }
`;

const QualityStrip = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const QualityImage = styled(ImageFrame)`
  aspect-ratio: 4 / 3;
`;

const Quote = styled.blockquote`
  padding: 26px;
  border-radius: ${radii.lg};
  background: ${colors.paper};
  border: 1px solid ${colors.lineSoft};
  margin-top: 22px;

  p {
    font-family: ${fonts.display};
    font-size: 18px;
    line-height: 1.45;
    letter-spacing: -0.015em;
    color: ${colors.ink};
  }

  cite {
    display: block;
    margin-top: 12px;
    font-style: normal;
    font-size: 10.5px;
    font-weight: 700;
    color: ${colors.muted};
  }
`;

export default function CapabilitiesPage() {
  return (
    <>
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Capabilities
          </Breadcrumb>
          <Kicker>Manufacturing</Kicker>
          <IntroTitle>Manufacturing that stays inside your control.</IntroTitle>
          <IntroLede>
            Design, corrugating, offset print, die-cutting, gluing and dispatch across three plants — with one
            quality system and one standard for colour.
          </IntroLede>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Cta href="/request-a-quote" variant="primary" size="md">
              Discuss a production plan <ArrowRight size={14} />
            </Cta>
            <Cta href="/quality" variant="outline" size="md">
              Quality systems
            </Cta>
          </div>
          <div style={{ marginTop: 34, maxWidth: 880 }}>
            <StatGrid>
              {facilityStats.map((stat) => (
                <Stat key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </Stat>
              ))}
            </StatGrid>
          </div>
        </Container>
      </PageIntro>

      <Section>
        <Container>
          <FactorySplit>
            <FactoryImage>
              <Image
                src="/images/factory.jpg"
                alt="Corrugator and printing lines inside a Stark Packmate plant"
                fill
                priority
                sizes="(max-width: 900px) 92vw, 50vw"
              />
              <ImageBadge>
                <Gauge size={12} /> 180,000 sq ft across Mumbai, Pune and Chennai
              </ImageBadge>
            </FactoryImage>
            <div>
              <Kicker>One roof, fewer hand-offs</Kicker>
              <h2 style={{ marginTop: 14, fontFamily: fonts.display, fontSize: 'clamp(28px, 3.2vw, 40px)', fontWeight: 500, letterSpacing: '-0.028em', lineHeight: 1.1 }}>
                Board to box, without leaving the building.
              </h2>
              <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.75, color: colors.muted }}>
                In-house corrugating means board grade, flute and moisture are controlled before print. In-house
                converting means print register and die tolerance are owned by the same team. The result is a
                shorter, more predictable supply chain.
              </p>
              <CheckList>
                <li>
                  <Check size={13} /> BHS 2.5 m corrugator for B, C, E and BC flute board
                </li>
                <li>
                  <Check size={13} /> Heidelberg XL 106 seven-colour press with inline coating
                </li>
                <li>
                  <Check size={13} /> Bobst die-cutting and folder-gluing for retail and transit formats
                </li>
                <li>
                  <Check size={13} /> Dedicated rigid box line for beauty, gifting and limited editions
                </li>
              </CheckList>
              <div style={{ marginTop: 22 }}>
                <Cta href="/quality" variant="outline" size="sm">
                  See the testing lab <ArrowRight size={13} />
                </Cta>
              </div>
            </div>
          </FactorySplit>
        </Container>
      </Section>

      <Section $tone="white">
        <Container>
          <SectionHead
            kicker="Capabilities"
            title="Every step owned, measured and repeatable."
            lede="From the first structural concept to the pallet leaving the dock, each capability is staffed, calibrated and documented."
            flush
          />
          <div style={{ height: 32 }} />
          <CapGrid>
            {capabilities.map((capability) => (
              <FeatureCard key={capability.title}>
                <IconBadge>
                  <SiteIcon name={capability.icon} size={18} />
                </IconBadge>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </FeatureCard>
            ))}
          </CapGrid>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <SectionHead
            kicker="Plant floor"
            title="Machinery selected for tolerance, not brochure appeal."
            lede="Rated capacities below are production figures, not peak laboratory numbers."
            action={
              <Pill>
                <FactoryIcon size={10} /> 3 facilities · 420 people
              </Pill>
            }
          />
          <MachineryTable>
            <MachineHead>
              <span>Machine</span>
              <span>Type</span>
              <span>Rated capacity</span>
            </MachineHead>
            {machinery.map((machine) => (
              <MachineRow key={machine.name}>
                <div>
                  <strong>{machine.name}</strong>
                  <p>{machine.detail}</p>
                </div>
                <Cell>
                  <span>{machine.type}</span>
                </Cell>
                <Cell>
                  <em>{machine.capacity}</em>
                </Cell>
              </MachineRow>
            ))}
          </MachineryTable>
        </Container>
      </Section>

      <Section>
        <Container>
          <QualityStrip>
            <div>
              <Kicker>Testing & validation</Kicker>
              <h2 style={{ marginTop: 14, fontFamily: fonts.display, fontSize: 'clamp(27px, 3.2vw, 39px)', fontWeight: 500, letterSpacing: '-0.028em', lineHeight: 1.1 }}>
                We test the box before the courier does.
              </h2>
              <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.75, color: colors.muted }}>
                An in-house lab runs burst, edge crush, moisture and drop protocols on new structures and
                production samples. Every result is retained against the batch.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 22 }}>
                {qualityMetrics.slice(0, 4).map((metric) => (
                  <div key={metric.label} style={{ padding: '12px 14px', border: `1px solid ${colors.line}`, borderRadius: radii.md, background: '#fff' }}>
                    <strong style={{ display: 'block', fontFamily: fonts.display, fontSize: 22, fontWeight: 500, color: colors.forest, letterSpacing: '-0.02em' }}>
                      {metric.value}
                    </strong>
                    <span style={{ display: 'block', marginTop: 3, fontSize: 10.5, fontWeight: 700, color: colors.ink }}>
                      {metric.label}
                    </span>
                    <span style={{ display: 'block', marginTop: 2, fontSize: 9.5, color: colors.muted, lineHeight: 1.4 }}>
                      {metric.detail}
                    </span>
                  </div>
                ))}
              </div>
              <Quote>
                <p>“A structure is not approved until it has failed a test we designed to break it.”</p>
                <cite>Priya Nair · Head of Quality &amp; Compliance</cite>
              </Quote>
            </div>
            <QualityImage>
              <Image
                src="/images/print-press.jpg"
                alt="Close-up of a sheet-fed offset press running packaging board"
                fill
                sizes="(max-width: 900px) 92vw, 48vw"
              />
            </QualityImage>
          </QualityStrip>
        </Container>
      </Section>

      <Section $tone="paper" $tight>
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>Capacity available for Q1</Pill>
              <h2 style={{ marginTop: 14 }}>Plan your next production run with us.</h2>
              <p>Share your volumes and delivery window. We will confirm equipment, board and dispatch slots.</p>
            </div>
            <BandActions>
              <Cta href="/request-a-quote" variant="copper" size="lg">
                Check capacity <ArrowRight size={15} />
              </Cta>
              <Cta href="/contact" variant="ghostLight" size="lg">
                Visit a plant <ArrowUpRight size={15} />
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
    </>
  );
}
