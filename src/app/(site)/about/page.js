'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, MapPin } from 'lucide-react';
import { timeline, leadership, values, facilityStats, brandStats } from '@/data/catalog';
import { colors, fonts, radii, transitions } from '@/lib/theme';
import { usePageSections } from '@/hooks/usePageSections';
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
  TwoCol,
} from '@/components/site/ui';
import { CmsPageFlow, CmsSection } from '@/components/site/CmsPageFlow';

const LeadImage = styled(ImageFrame)`
  aspect-ratio: 21 / 8;
  margin-top: 8px;

  @media (max-width: 760px) {
    aspect-ratio: 16 / 11;
  }
`;

const TimelineWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${colors.line};
`;

const TimelineRow = styled.div`
  display: grid;
  grid-template-columns: 90px minmax(0, 0.9fr) minmax(0, 1.6fr);
  gap: 28px;
  padding: 20px 0;
  border-bottom: 1px solid ${colors.lineSoft};
  align-items: baseline;
  transition: background ${transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.55);
  }

  strong {
    font-family: ${fonts.display};
    font-size: 26px;
    font-weight: 500;
    letter-spacing: -0.03em;
    color: ${colors.copperDeep};
  }

  h3 {
    font-family: ${fonts.sans};
    font-size: 13px;
    font-weight: 800;
    letter-spacing: -0.005em;
    color: ${colors.ink};
  }

  p {
    font-size: 12px;
    line-height: 1.65;
    color: ${colors.muted};
  }

  @media (max-width: 760px) {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 6px 16px;
    padding: 16px 0;

    p {
      grid-column: 2;
    }
  }
`;

const ValuesGrid = styled.div`
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

const TeamGrid = styled.div`
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

const Leader = styled.article`
  padding: 20px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: #fff;
  transition: border-color ${transitions.fast}, transform ${transitions.fast};

  &:hover {
    border-color: #C9CBE0;
    transform: translateY(-2px);
  }

  h3 {
    margin-top: 14px;
    font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
  }

  p {
    margin-top: 10px;
    font-size: 11px;
    line-height: 1.65;
    color: ${colors.muted};
  }
`;

const LeaderAvatar = styled.span`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${({ $tone }) => ($tone ? colors.copperWash : colors.forest)};
  color: ${({ $tone }) => ($tone ? colors.copperDeep : '#F6F6FF')};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.02em;
  border: 1px solid ${({ $tone }) => ($tone ? 'rgba(184,115,51,0.24)' : 'transparent')};
`;

const PlantRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: ${radii.pill};
    border: 1px solid ${colors.line};
    background: #fff;
    font-size: 10px;
    font-weight: 700;
    color: ${colors.inkSoft};
  }

  svg {
    color: ${colors.copper};
  }
`;

export default function AboutPage() {
  const { section } = usePageSections('/about');
  const hero = section('hero', {
    kicker: 'About Stark Packmate',
    title: "A workshop's eye. A factory's discipline.",
    body: 'We began in 2009 with one flexo press in Mumbai and a belief that packaging was being treated as an afterthought. Sixteen years later, three plants and 420 people later, the belief has not changed.',
  });
  const milestones = section('milestones', {
    kicker: 'Milestones',
    title: 'Sixteen years, one direction.',
    body: 'Each expansion was driven by a client problem we could no longer solve well through a supplier.',
  });
  const valuesSection = section('values', {
    kicker: 'What we believe',
    title: 'Four rules that show up in every decision.',
    body: 'Not values on a wall — operating rules that determine how we quote, build and dispatch.',
  });
  const leadershipSection = section('leadership', {
    kicker: 'Leadership',
    title: 'The people accountable for your programme.',
    body: 'Commercial, engineering and plant leadership working as one team.',
  });

  return (
    <CmsPageFlow slug="/about" knownKeys={['hero', 'story', 'milestones', 'values', 'leadership', 'footprint', 'cta']}>
      <CmsSection sectionKey="hero">
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            About
          </Breadcrumb>
          <Kicker>{hero.kicker}</Kicker>
          <IntroTitle>{hero.title}</IntroTitle>
          <IntroLede>{hero.body}</IntroLede>
          <PlantRow>
            <span>
              <MapPin size={11} /> Mumbai · Andheri East
            </span>
            <span>
              <MapPin size={11} /> Pune · Chakan
            </span>
            <span>
              <MapPin size={11} /> Chennai · Sriperumbudur
            </span>
          </PlantRow>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Cta href="/capabilities" variant="primary" size="md">
              Inside the plants <ArrowRight size={14} />
            </Cta>
            <Cta href="/contact" variant="outline" size="md">
              Meet the team
            </Cta>
          </div>
        </Container>
      </PageIntro>
      </CmsSection>

      <CmsSection sectionKey="story">
      <Section $tight>
        <Container>
          <LeadImage>
            <Image
              src="/images/factory.jpg"
              alt="Stark Packmate manufacturing floor with corrugating and converting lines"
              fill
              priority
              sizes="(max-width: 760px) 92vw, 92vw"
            />
          </LeadImage>
          <div style={{ marginTop: 32 }}>
            <StatGrid>
              {brandStats.map((stat) => (
                <Stat key={stat.label}>
                  <strong>
                    {stat.value}
                    <span style={{ display: 'inline', marginTop: 0, fontFamily: fonts.sans, fontSize: 14, fontWeight: 700, color: colors.copperDeep }}>
                      {stat.suffix}
                    </span>
                  </strong>
                  <span>{stat.label}</span>
                </Stat>
              ))}
            </StatGrid>
          </div>
        </Container>
      </Section>

      <Section $tone="white">
        <Container>
          <TwoCol $cols="minmax(0, 1.05fr) minmax(0, 0.95fr)" $gap="54px">
            <div>
              <Kicker>The story</Kicker>
              <h2 style={{ marginTop: 14, fontFamily: fonts.display, fontSize: 'clamp(28px, 3.3vw, 42px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                We kept the parts of manufacturing that most companies outsource.
              </h2>
              <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.75, color: colors.muted }}>
                Over the years the industry moved toward trading houses: design here, board there, print
                somewhere else. We went the other way — adding corrugating, prepress, die-cutting and rigid box
                capability in-house, because every hand-off is a place where tolerances and accountability get
                lost.
              </p>
              <p style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.75, color: colors.muted }}>
                Today a client can send one brief and receive a tested structure, a G7 colour-matched print, a
                batch-traceable production record and a dispatch plan. One team, one standard.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 20 }}>
                {[
                  'In-house structural design and 72-hour prototyping',
                  'Certified quality system across every plant',
                  'A single colour standard for multi-format programmes',
                ].map((item) => (
                  <span key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: colors.inkSoft, fontWeight: 600 }}>
                    <Check size={13} style={{ color: colors.success, marginTop: 2, flex: '0 0 auto' }} /> {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <ImageFrame $ratio="4 / 3.4">
                <Image
                  src="/images/design-studio.jpg"
                  alt="Structural packaging designers working at the Stark Packmate design studio"
                  fill
                  sizes="(max-width: 900px) 92vw, 44vw"
                />
              </ImageFrame>
            </div>
          </TwoCol>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="milestones">
      <Section $tone="paper">
        <Container>
          <SectionHead
            kicker={milestones.kicker}
            title={milestones.title}
            lede={milestones.body}
            flush
          />
          <div style={{ height: 30 }} />
          <TimelineWrap>
            {timeline.map((item) => (
              <TimelineRow key={item.year}>
                <strong>{item.year}</strong>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </TimelineRow>
            ))}
          </TimelineWrap>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="values">
      <Section>
        <Container>
          <SectionHead
            kicker={valuesSection.kicker}
            title={valuesSection.title}
            lede={valuesSection.body}
            flush
          />
          <div style={{ height: 30 }} />
          <ValuesGrid>
            {values.map((value) => (
              <FeatureCard key={value.title}>
                <IconBadge>
                  <SiteIcon name={value.icon} size={18} />
                </IconBadge>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </FeatureCard>
            ))}
          </ValuesGrid>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="leadership">
      <Section $tone="white" $tight>
        <Container>
          <SectionHead
            kicker={leadershipSection.kicker}
            title={leadershipSection.title}
            lede={leadershipSection.body}
          />
          <TeamGrid>
            {leadership.map((person, index) => (
              <Leader key={person.name}>
                <LeaderAvatar $tone={index % 2 === 1}>{person.initials}</LeaderAvatar>
                <h3>{person.name}</h3>
                <span>{person.role}</span>
                <p>{person.bio}</p>
              </Leader>
            ))}
          </TeamGrid>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="footprint">
      <Section $tone="forest" $tight>
        <Container>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
            <div>
              <Kicker $light>Our footprint</Kicker>
              <h2 style={{ marginTop: 12, fontFamily: fonts.display, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 500, letterSpacing: '-0.028em', color: '#F6F6FF', maxWidth: 620 }}>
                Three plants. One production standard.
              </h2>
            </div>
            <Cta href="/capabilities" variant="ghostLight" size="md">
              Plant capabilities <ArrowUpRight size={14} />
            </Cta>
          </div>
          <StatGrid $light style={{ marginTop: 28 }}>
            {facilityStats.map((stat) => (
              <Stat key={stat.label} $light>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </Stat>
            ))}
          </StatGrid>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="cta">
      <Section $tone="paper" $tight>
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>Plant visits welcome</Pill>
              <h2 style={{ marginTop: 14 }}>Come and see how your packaging is made.</h2>
              <p>
                We host client teams at our Mumbai and Pune plants. Walk the line, meet the quality team, review
                your dieline on press.
              </p>
            </div>
            <BandActions>
              <Cta href="/contact" variant="copper" size="lg">
                Arrange a visit <ArrowRight size={15} />
              </Cta>
              <Cta href="/request-a-quote" variant="ghostLight" size="lg">
                Request a quote
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
      </CmsSection>
    </CmsPageFlow>
  );
}
