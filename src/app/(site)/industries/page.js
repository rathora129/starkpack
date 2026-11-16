'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { industries, products, clientLogos } from '@/data/catalog';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import { usePageSections } from '@/hooks/usePageSections';
import {
  Container,
  Section,
  PageIntro,
  IntroTitle,
  IntroLede,
  Kicker,
  Breadcrumb,
  Cta,
  ArrowLink,
  CTABand,
  BandActions,
  Pill,
  SiteIcon,
} from '@/components/site/ui';
import { CmsPageFlow, CmsSection } from '@/components/site/CmsPageFlow';

const IndustryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  display: flex;
  flex-direction: column;
  padding: 22px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: #fff;
  box-shadow: ${shadows.xs};
  transition: border-color ${transitions.base}, transform ${transitions.base}, box-shadow ${transitions.base};

  &:hover {
    border-color: #C9CBE0;
    transform: translateY(-2px);
    box-shadow: ${shadows.card};
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

const IconTile = styled.span`
  width: 42px;
  height: 42px;
  border-radius: ${radii.sm};
  display: grid;
  place-items: center;
  background: ${colors.paper};
  border: 1px solid ${colors.lineSoft};
  color: ${colors.forest};
`;

const Index = styled.span`
  font-family: ${fonts.mono};
  font-size: 9.5px;
  color: ${colors.faint};
  letter-spacing: 0.1em;
`;

const Name = styled.h2`
  font-family: ${fonts.display};
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: ${colors.ink};
`;

const Summary = styled.p`
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.65;
  color: ${colors.muted};
  flex: 1;
`;

const StatRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 9px;
  margin-top: 18px;
  padding: 12px 0;
  border-top: 1px solid ${colors.lineSoft};
  border-bottom: 1px solid ${colors.lineSoft};

  strong {
    font-family: ${fonts.display};
    font-size: 25px;
    font-weight: 500;
    letter-spacing: -0.03em;
    color: ${colors.copperDeep};
    line-height: 1;
  }

  span {
    font-size: 9.5px;
    font-weight: 600;
    color: ${colors.muted};
    max-width: 120px;
    line-height: 1.35;
  }
`;

const ProductLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 14px;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 10.5px;
    font-weight: 600;
    color: ${colors.inkSoft};
    transition: color ${transitions.fast};

    svg {
      color: ${colors.faint};
    }

    &:hover {
      color: ${colors.forest};

      svg {
        color: ${colors.copper};
      }
    }
  }
`;

const ServiceBand = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  padding: 20px;
  border-radius: ${radii.lg};
  background: ${colors.paper};
  border: 1px solid ${colors.lineSoft};

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 500;
    color: ${colors.ink};
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 6px;
    font-size: 11.5px;
    line-height: 1.6;
    color: ${colors.muted};
  }

  small {
    display: inline-block;
    margin-top: 12px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
  }
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px 32px;
  flex-wrap: wrap;
  padding-top: 30px;
  margin-top: 34px;
  border-top: 1px solid ${colors.line};

  small {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${colors.faint};
    flex: 0 0 100%;
  }

  span {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.13em;
    color: #ABA597;
  }
`;

const services = [
  {
    title: 'Dedicated programmes',
    detail: 'Named account lead, quarterly reviews and a single colour standard across every format.',
    tag: 'Account management',
  },
  {
    title: 'Peak-season capacity',
    detail: 'Reserved press and corrugator slots so December or Diwali does not become a supply risk.',
    tag: 'Capacity planning',
  },
  {
    title: 'Vendor-managed stock',
    detail: 'Consignment inventory at your 3PL, replenished against actual consumption and lead time.',
    tag: 'Fulfilment',
  },
];

export default function IndustriesPage() {
  const { section } = usePageSections('/industries');
  const hero = section('hero', {
    kicker: 'Industries',
    title: 'Different products. The same obsession with arrival.',
    body: 'A serum bottle, a coffee pouch and a 1,200 kg machine part fail differently in transit. We bring category-specific structures, print and compliance to each.',
  });

  return (
    <CmsPageFlow slug="/industries" knownKeys={['hero', 'grid', 'approach', 'cta']}>
      <CmsSection sectionKey="hero">
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Industries
          </Breadcrumb>
          <Kicker>{hero.kicker}</Kicker>
          <IntroTitle>{hero.title}</IntroTitle>
          <IntroLede>{hero.body}</IntroLede>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Cta href="/request-a-quote" variant="primary" size="md">
              Request a quote <ArrowRight size={14} />
            </Cta>
            <Cta href="/portfolio" variant="outline" size="md">
              See category work
            </Cta>
          </div>
        </Container>
      </PageIntro>
      </CmsSection>

      <CmsSection sectionKey="grid">
      <Section>
        <Container>
          <IndustryGrid>
            {industries.map((industry, index) => {
              const linked = industry.products
                .map((slug) => products.find((product) => product.slug === slug))
                .filter(Boolean)
                .slice(0, 3);
              return (
                <Card key={industry.slug}>
                  <CardTop>
                    <IconTile>
                      <SiteIcon name={industry.icon} size={19} />
                    </IconTile>
                    <Index>{String(index + 1).padStart(2, '0')}</Index>
                  </CardTop>
                  <Name>{industry.name}</Name>
                  <Summary>{industry.summary}</Summary>
                  <StatRow>
                    <strong>{industry.stat}</strong>
                    <span>{industry.statLabel}</span>
                  </StatRow>
                  <ProductLinks>
                    {linked.map((product) => (
                      <Link key={product.slug} href={`/products/${product.slug}`}>
                        {product.name} <ArrowUpRight size={11} />
                      </Link>
                    ))}
                    <Link href="/request-a-quote">
                      Start a {industry.name.split(' ')[0].toLowerCase()} RFQ <ArrowRight size={11} />
                    </Link>
                  </ProductLinks>
                </Card>
              );
            })}
          </IndustryGrid>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="approach">
      <Section $tone="white" $tight>
        <Container>
          <div style={{ marginBottom: 24 }}>
            <Kicker>How we work with categories</Kicker>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginTop: 10 }}>
              <h2 style={{ fontFamily: fonts.display, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 500, letterSpacing: '-0.025em' }}>
                Built into the relationship, not billed as an extra.
              </h2>
              <ArrowLink href="/solutions">
                Solutions by channel <ArrowRight size={13} />
              </ArrowLink>
            </div>
          </div>
          <ServiceBand>
            {services.map((service) => (
              <ServiceCard key={service.title}>
                <small>{service.tag}</small>
                <strong style={{ marginTop: 8 }}>{service.title}</strong>
                <p>{service.detail}</p>
              </ServiceCard>
            ))}
          </ServiceBand>

          <LogoRow>
            <small>Categories we supply today</small>
            {clientLogos.map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </LogoRow>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="cta">
      <Section $tone="paper" $tight>
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>
                <Check size={10} /> Category specialists on call
              </Pill>
              <h2 style={{ marginTop: 14 }}>Tell us what you ship. We will tell you how it should be packed.</h2>
              <p>
                A 20-minute call with a packaging engineer usually surfaces more savings than a tender process.
              </p>
            </div>
            <BandActions>
              <Cta href="/contact" variant="copper" size="lg">
                Book a call <ArrowRight size={15} />
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
      </CmsSection>
    </CmsPageFlow>
  );
}
