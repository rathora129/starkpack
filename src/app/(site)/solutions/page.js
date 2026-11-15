'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { solutions } from '@/data/catalog';
import { useDemoStore } from '@/store/useDemoStore';
import { colors, fonts, radii, transitions } from '@/lib/theme';
import {
  Container,
  Section,
  SectionHead,
  PageIntro,
  IntroTitle,
  IntroLede,
  Kicker,
  Breadcrumb,
  Cta,
  ImageFrame,
  Pill,
  CTABand,
  BandActions,
  SiteIcon,
} from '@/components/site/ui';

const AnchorRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 26px;

  a {
    padding: 7px 12px;
    border-radius: ${radii.pill};
    border: 1px solid ${colors.line};
    background: rgba(255, 255, 255, 0.5);
    font-size: 10.5px;
    font-weight: 700;
    color: ${colors.muted};
    transition: all ${transitions.fast};

    &:hover {
      border-color: ${colors.forest};
      color: ${colors.forest};
      background: #fff;
    }
  }
`;

const SolutionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;

  @media (max-width: 760px) {
    gap: 40px;
  }
`;

const SolutionRow = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 52px;
  align-items: center;
  scroll-margin-top: 120px;

  ${({ $flip }) =>
    $flip
      ? `
        & > div:first-child { order: 2; }
      `
      : ''}

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 26px;

    & > div:first-child {
      order: 0 !important;
    }
  }
`;

const Media = styled(ImageFrame)`
  aspect-ratio: 4 / 3.3;

  @media (max-width: 900px) {
    aspect-ratio: 16 / 10;
  }
`;

const Num = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: ${colors.copperDeep};
`;

const Title = styled.h2`
  margin-top: 10px;
  font-family: ${fonts.display};
  font-size: clamp(28px, 3.4vw, 42px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: ${colors.ink};
`;

const Subtitle = styled.p`
  margin-top: 8px;
  font-family: ${fonts.display};
  font-size: 16px;
  font-style: italic;
  color: ${colors.copperDeep};
`;

const Body = styled.p`
  margin-top: 14px;
  font-size: 13.5px;
  line-height: 1.75;
  color: ${colors.muted};
  max-width: 520px;
`;

const BulletList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 20px;
  margin-top: 20px;
  max-width: 540px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    font-size: 11.5px;
    color: ${colors.inkSoft};
    font-weight: 600;
    line-height: 1.5;
  }

  svg {
    color: ${colors.success};
    flex: 0 0 auto;
    margin-top: 2px;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${colors.line};
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 24px;
  border-right: 1px solid ${colors.lineSoft};

  strong {
    font-family: ${fonts.display};
    font-size: 30px;
    font-weight: 500;
    color: ${colors.forest};
    letter-spacing: -0.03em;
    line-height: 1;
  }

  span {
    font-size: 9.5px;
    font-weight: 600;
    color: ${colors.muted};
    max-width: 130px;
    line-height: 1.4;
  }

  @media (max-width: 520px) {
    border-right: 0;
    padding-right: 0;
  }
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  padding: 22px;
  border-radius: ${radii.md};
  border: 1px solid ${colors.lineSoft};
  background: #fff;
  transition: transform ${transitions.fast}, box-shadow ${transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px -30px rgba(16, 35, 29, 0.35);
  }

  span.icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: ${colors.forest};
    color: #F9F6EE;
    margin-bottom: 14px;
  }

  h3 {
    font-family: ${fonts.sans};
    font-size: 14px;
    font-weight: 800;
    color: ${colors.ink};
    letter-spacing: -0.01em;
  }

  p {
    margin-top: 7px;
    font-size: 12px;
    line-height: 1.65;
    color: ${colors.muted};
  }
`;

export default function SolutionsPage() {
  const cmsServices = useDemoStore((state) => state.cmsServices);
  const publishedServices = cmsServices
    .filter((service) => service.published)
    .slice()
    .sort((a, b) => Number(a.order) - Number(b.order));

  return (
    <>
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Solutions
          </Breadcrumb>
          <Kicker>Solutions</Kicker>
          <IntroTitle>Packaging systems, not just boxes.</IntroTitle>
          <IntroLede>
            A packaging programme connects structure, print, packing line, courier network and returns. We
            engineer the whole system — so one decision does not create a problem somewhere else.
          </IntroLede>
          <div style={{ marginTop: 26 }}>
            <Cta href="/request-a-quote" variant="primary" size="md">
              Design your programme <ArrowRight size={14} />
            </Cta>
          </div>
          <AnchorRow>
            {solutions.map((solution) => (
              <a key={solution.id} href={`#${solution.id}`}>
                {solution.title}
              </a>
            ))}
          </AnchorRow>
        </Container>
      </PageIntro>

      <Section>
        <Container>
          <SolutionList>
            {solutions.map((solution, index) => (
              <SolutionRow key={solution.id} id={solution.id} $flip={index % 2 === 1}>
                <div>
                  <Media>
                    <Image
                      src={solution.image}
                      alt={`${solution.title} packaging by Stark Packmate`}
                      fill
                      sizes="(max-width: 900px) 92vw, 46vw"
                    />
                  </Media>
                </div>
                <div>
                  <Num>SOLUTION {solution.number}</Num>
                  <Title>{solution.title}</Title>
                  <Subtitle>{solution.subtitle}</Subtitle>
                  <Body>{solution.description}</Body>
                  <BulletList>
                    {solution.bullets.map((bullet) => (
                      <li key={bullet}>
                        <Check size={12} /> {bullet}
                      </li>
                    ))}
                  </BulletList>
                  <FooterRow>
                    <Metric>
                      <strong>{solution.metric}</strong>
                      <span>{solution.metricLabel}</span>
                    </Metric>
                    <Link
                      href={`/request-a-quote?product=${encodeURIComponent(solution.title)}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: colors.forest,
                        borderBottom: `1px solid rgba(23, 73, 59, 0.28)`,
                        paddingBottom: 3,
                      }}
                    >
                      Scope this programme <ArrowUpRight size={13} />
                    </Link>
                  </FooterRow>
                </div>
              </SolutionRow>
            ))}
          </SolutionList>
        </Container>
      </Section>

      {publishedServices.length ? (
        <Section $tone="cream" $tight>
          <Container>
            <SectionHead
              kicker="Managed services"
              title="The work that sits around the box."
              lede="Structural engineering, print production, compliance and replenishment — delivered by one team with one quality standard."
              flush
            />
            <ServiceGrid style={{ marginTop: 28 }}>
              {publishedServices.map((service) => (
                <ServiceCard key={service.id}>
                  <span className="icon">
                    <SiteIcon name={service.icon} size={17} />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                </ServiceCard>
              ))}
            </ServiceGrid>
          </Container>
        </Section>
      ) : null}

      <Section $tone="paper">
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>
                <Sparkles size={10} /> Design-led engineering
              </Pill>
              <h2 style={{ marginTop: 14 }}>One programme. Several formats. One quality standard.</h2>
              <p>
                Most clients start with a single SKU and expand. We keep structures, colour and lead times
                consistent as your range grows.
              </p>
            </div>
            <BandActions>
              <Cta href="/contact" variant="copper" size="lg">
                Talk to a consultant <ArrowRight size={15} />
              </Cta>
              <Cta href="/portfolio" variant="ghostLight" size="lg">
                See the work
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
    </>
  );
}
