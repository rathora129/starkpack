'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
import { portfolio, portfolioCategories, testimonials } from '@/data/catalog';
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
  CTABand,
  BandActions,
  Pill,
  Grid,
} from '@/components/site/ui';
import { CmsPageFlow, CmsSection } from '@/components/site/CmsPageFlow';
import { AppModal } from '@/components/ui/Overlay';

const Tabs = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

const Tab = styled.button`
  padding: 8px 14px;
  border-radius: ${radii.pill};
  border: 1px solid ${({ $active }) => ($active ? colors.forest : colors.line)};
  background: ${({ $active }) => ($active ? colors.forest : 'transparent')};
  color: ${({ $active }) => ($active ? '#F6F6FF' : colors.muted)};
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: 700;
  transition: all ${transitions.fast};

  &:hover {
    border-color: ${colors.forest};
    color: ${({ $active }) => ($active ? '#F6F6FF' : colors.forest)};
  }
`;

const CaseCard = styled.button`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 0;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  overflow: hidden;
  background: #fff;
  font-family: inherit;
  transition: transform ${transitions.base}, box-shadow ${transitions.base};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lift};
  }
`;

const CaseMedia = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;

  img {
    object-fit: cover;
    transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${CaseCard}:hover & img {
    transform: scale(1.04);
  }
`;

const CaseTag = styled.span`
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 4px 9px;
  border-radius: ${radii.pill};
  background: rgba(251, 248, 242, 0.93);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${colors.forest};
`;

const CaseBody = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;

  small {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
  }

  h3 {
    margin-top: 6px;
    font-family: ${fonts.display};
    font-size: 21px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }
`;

const Metrics = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 14px;
  padding-top: 13px;
  border-top: 1px solid ${colors.lineSoft};

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 18px;
    font-weight: 500;
    color: ${colors.forest};
    letter-spacing: -0.01em;
  }

  span {
    display: block;
    margin-top: 1px;
    font-size: 9.5px;
    color: ${colors.faint};
  }
`;

const CaseFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid ${colors.lineSoft};
  font-size: 10.5px;
  font-weight: 700;
  color: ${colors.forest};

  svg {
    color: ${colors.copper};
  }
`;

const QuoteBand = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 30px 34px;
  border-radius: ${radii.xl};
  background: #fff;
  border: 1px solid ${colors.line};
  box-shadow: ${shadows.xs};
  margin-top: 48px;

  > svg {
    color: ${colors.copper};
    flex: 0 0 auto;
  }

  p {
    flex: 1;
    min-width: 260px;
    font-family: ${fonts.display};
    font-size: clamp(17px, 2vw, 22px);
    line-height: 1.45;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }

  div {
    flex: 0 0 auto;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
  }

  strong {
    display: block;
    font-size: 11.5px;
    color: ${colors.ink};
  }
`;

const ModalImage = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: ${radii.md};
  overflow: hidden;
  margin-bottom: 18px;
  background: ${colors.mist};
`;

const ModalMeta = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const ModalMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0;

  div {
    padding: 12px;
    border-radius: ${radii.sm};
    background: ${colors.paper};
    border: 1px solid ${colors.lineSoft};
  }

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 24px;
    font-weight: 500;
    color: ${colors.forest};
    letter-spacing: -0.02em;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 9.5px;
    font-weight: 700;
    color: ${colors.muted};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${colors.lineSoft};
`;

export default function PortfolioPage() {
  const { section } = usePageSections('/portfolio');
  const hero = section('hero', {
    kicker: 'Selected work',
    title: 'Packaging that moved a number.',
    body: 'Fewer damaged parcels, lower cost per order, faster shelf rollouts, stronger unboxing. Each project below started with a commercial problem and a blank dieline.',
  });
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(
    () => (category === 'All' ? portfolio : portfolio.filter((project) => project.category === category)),
    [category]
  );

  const selected = portfolio.find((project) => project.id === selectedId);

  return (
    <>
      <CmsPageFlow slug="/portfolio" knownKeys={['hero', 'cases', 'results']}>
      <CmsSection sectionKey="hero">
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Portfolio
          </Breadcrumb>
          <Kicker>{hero.kicker}</Kicker>
          <IntroTitle>{hero.title}</IntroTitle>
          <IntroLede>{hero.body}</IntroLede>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Cta href="/request-a-quote" variant="primary" size="md">
              Start a project <ArrowRight size={14} />
            </Cta>
            <Cta href="/products" variant="outline" size="md">
              Browse formats
            </Cta>
          </div>
        </Container>
      </PageIntro>
      </CmsSection>

      <CmsSection sectionKey="cases">
      <Section>
        <Container>
          <Tabs role="group" aria-label="Filter portfolio by category">
            {portfolioCategories.map((item) => (
              <Tab
                key={item}
                type="button"
                $active={category === item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </Tab>
            ))}
          </Tabs>

          <Grid $cols={3} $colsLg={2} $gap="18px">
            {filtered.map((project) => (
              <CaseCard key={project.id} type="button" onClick={() => setSelectedId(project.id)}>
                <CaseMedia>
                  <Image
                    src={project.image}
                    alt={`${project.brand} packaging programme`}
                    fill
                    sizes="(max-width: 680px) 92vw, (max-width: 1024px) 45vw, 31vw"
                  />
                  <CaseTag>{project.category}</CaseTag>
                </CaseMedia>
                <CaseBody>
                  <small>{project.brand}</small>
                  <h3>{project.title}</h3>
                  <Metrics>
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                      </div>
                    ))}
                  </Metrics>
                  <CaseFooter>
                    Read the case <ArrowUpRight size={13} />
                  </CaseFooter>
                </CaseBody>
              </CaseCard>
            ))}
          </Grid>

          <QuoteBand>
            <Quote size={26} />
            <p>“{testimonials[0].quote}”</p>
            <div>
              <strong>{testimonials[0].name}</strong>
              {testimonials[0].role} · {testimonials[0].company}
            </div>
          </QuoteBand>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="results">
      <Section $tone="paper" $tight>
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>Your category next</Pill>
              <h2 style={{ marginTop: 14 }}>Every case here began with a difficult brief.</h2>
              <p>Bring us the constraint — cost, damage, shelf impact, speed. That is the interesting part.</p>
            </div>
            <BandActions>
              <Cta href="/request-a-quote" variant="copper" size="lg">
                Start your brief <ArrowRight size={15} />
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
      </CmsSection>
      </CmsPageFlow>

      <AppModal
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.brand : ''}
        description={selected ? `${selected.category} · Packaging programme` : ''}
        size="md"
      >
        {selected ? (
          <>
            <ModalImage>
              <Image src={selected.image} alt={`${selected.brand} packaging`} fill sizes="520px" style={{ objectFit: 'cover' }} />
            </ModalImage>
            <ModalMeta>
              {selected.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </ModalMeta>
            <h3 style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 500, letterSpacing: '-0.025em', color: colors.ink }}>
              {selected.title}
            </h3>
            <p style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.7, color: colors.muted }}>
              {selected.description}
            </p>
            <ModalMetrics>
              {selected.metrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </ModalMetrics>
            <ModalActions>
              <Cta href={`/request-a-quote?product=${encodeURIComponent(selected.category)}`} variant="primary" size="sm">
                Request something similar <ArrowRight size={13} />
              </Cta>
              <Cta href="/contact" variant="outline" size="sm">
                Talk to the team
              </Cta>
            </ModalActions>
          </>
        ) : null}
      </AppModal>
    </>
  );
}
