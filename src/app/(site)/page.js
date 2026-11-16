'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Factory,
  ShieldCheck,
  Clock3,
} from 'lucide-react';
import {
  brandStats,
  valueProps,
  products as catalogProducts,
  solutions,
  portfolio,
  testimonials as catalogTestimonials,
  clientLogos,
  qualityCertifications,
  facilityStats,
  capabilities,
} from '@/data/catalog';
import { useDemoStore } from '@/store/useDemoStore';
import { publishedProducts } from '@/lib/products';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import {
  Container,
  Section,
  SectionHead,
  Kicker,
  SectionTitle,
  Lede,
  Cta,
  ArrowLink,
  ImageFrame,
  Pill,
  StatGrid,
  Stat,
  CTABand,
  BandActions,
  ProductCard,
  ProductMedia,
  ProductTag,
  ProductBody,
  ProductMeta,
  TwoCol,
  IconBadge,
  FeatureCard,
  Grid,
  SiteIcon,
} from '@/components/site/ui';
import { CmsPageFlow, CmsSection } from '@/components/site/CmsPageFlow';

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: 58px 0 42px;
  background:
    radial-gradient(900px 460px at 88% 0%, rgba(184, 115, 51, 0.1), transparent 62%),
    radial-gradient(700px 420px at 6% 20%, rgba(23, 73, 59, 0.05), transparent 60%),
    ${colors.cream};

  @media (max-width: 900px) {
    padding: 36px 0 30px;
  }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 54px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 34px;
  }
`;

const HeroCopy = styled.div`
  min-width: 0;
`;

const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 6px 12px 6px 8px;
  border-radius: ${radii.pill};
  border: 1px solid ${colors.line};
  background: rgba(255, 255, 255, 0.55);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${colors.copperDeep};

  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${colors.copper};
    box-shadow: 0 0 0 3px rgba(184, 115, 51, 0.14);
  }
`;

const HeroTitle = styled.h1`
  margin-top: 22px;
  font-family: ${fonts.display};
  font-size: clamp(43px, 5.6vw, 72px);
  font-weight: 500;
  line-height: 0.99;
  letter-spacing: -0.04em;
  color: ${colors.ink};

  em {
    font-style: italic;
    color: ${colors.forest};
  }
`;

const HeroLead = styled.p`
  margin-top: 22px;
  font-size: 15px;
  line-height: 1.72;
  color: ${colors.muted};
  max-width: 520px;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 30px;
`;

const HeroProof = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${colors.line};

  p {
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
    max-width: 200px;
  }

  strong {
    color: ${colors.ink};
  }
`;

const AvatarStack = styled.div`
  display: flex;

  span {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${colors.forest};
    color: #F6F6FF;
    font-size: 9px;
    font-weight: 700;
    border: 2px solid ${colors.cream};
    margin-left: -7px;

    &:first-child {
      margin-left: 0;
    }

    &:nth-child(2) {
      background: ${colors.copper};
    }

    &:nth-child(3) {
      background: ${colors.forestSoft};
    }

    &:nth-child(4) {
      background: ${colors.copperDeep};
    }
  }
`;

const HeroVisual = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -16px;
    bottom: -16px;
    width: 58%;
    height: 64%;
    border: 1px solid rgba(184, 115, 51, 0.34);
    border-radius: ${radii.lg};
    z-index: 0;

    @media (max-width: 980px) {
      display: none;
    }
  }
`;

const HeroFrame = styled(ImageFrame)`
  aspect-ratio: 5 / 5.4;
  z-index: 1;
  box-shadow: 0 40px 80px -40px rgba(16, 35, 29, 0.45);

  @media (max-width: 980px) {
    aspect-ratio: 16 / 11;
  }
`;

const HeroBadge = styled.div`
  position: absolute;
  z-index: 2;
  left: 16px;
  top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border-radius: ${radii.pill};
  background: rgba(12, 35, 28, 0.72);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(249, 246, 238, 0.9);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  svg {
    color: ${colors.copperSoft};
  }
`;

const HeroCard = styled.div`
  position: absolute;
  z-index: 2;
  right: 16px;
  bottom: 18px;
  padding: 14px 16px;
  border-radius: ${radii.md};
  background: rgba(251, 248, 242, 0.96);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(229, 224, 213, 0.8);
  box-shadow: ${shadows.lift};
  min-width: 196px;

  p {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 4px;
    font-family: ${fonts.display};
    font-size: 28px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${colors.ink};
    line-height: 1;
  }

  span {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
    font-size: 10px;
    color: ${colors.success};
    font-weight: 600;
  }
`;

const StatsWrap = styled.div`
  margin-top: 46px;

  @media (max-width: 900px) {
    margin-top: 32px;
  }
`;

const LogoStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 14px 38px;
  flex-wrap: wrap;

  small {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${colors.faint};
    flex: 0 0 100%;
    margin-bottom: 2px;
  }

  span {
    font-family: ${fonts.sans};
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: #A8A296;
    transition: color ${transitions.fast};

    &:hover {
      color: ${colors.ink};
    }
  }

  @media (max-width: 700px) {
    gap: 10px 24px;

    span {
      font-size: 11px;
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

const SolutionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  overflow: hidden;
  background: #fff;
  transition: transform ${transitions.base}, box-shadow ${transitions.base};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lift};
  }
`;

const SolutionMedia = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;

  img {
    object-fit: cover;
    transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${SolutionCard}:hover & img {
    transform: scale(1.04);
  }
`;

const SolutionNum = styled.span`
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 4px 8px;
  border-radius: ${radii.xs};
  background: rgba(12, 35, 28, 0.74);
  backdrop-filter: blur(4px);
  color: ${colors.copperSoft};
  font-family: ${fonts.mono};
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

const SolutionBody = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;

  h3 {
    font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }

  p {
    font-size: 11.5px;
    line-height: 1.6;
    color: ${colors.muted};
    flex: 1;
  }
`;

const SolutionFoot = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid ${colors.lineSoft};

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 22px;
    font-weight: 500;
    color: ${colors.forest};
    letter-spacing: -0.02em;
    line-height: 1;
  }

  small {
    display: block;
    margin-top: 3px;
    font-size: 9px;
    color: ${colors.faint};
    max-width: 140px;
    line-height: 1.35;
  }

  svg {
    color: ${colors.copper};
  }
`;

const FactoryFrame = styled(ImageFrame)`
  aspect-ratio: 4 / 4.4;

  @media (max-width: 900px) {
    aspect-ratio: 16 / 11;
  }
`;

const FactoryOverlay = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const OverlayStat = styled.div`
  flex: 1;
  min-width: 90px;
  padding: 10px 12px;
  border-radius: ${radii.sm};
  background: rgba(251, 248, 242, 0.94);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.5);

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 19px;
    font-weight: 500;
    color: ${colors.ink};
    letter-spacing: -0.02em;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${colors.muted};
  }
`;

const CapList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 24px;
  border-top: 1px solid ${colors.line};

  li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 13px 0;
    border-bottom: 1px solid ${colors.lineSoft};
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
    font-size: 11.5px;
    color: ${colors.muted};
    line-height: 1.55;
  }

  svg {
    color: ${colors.success};
    flex: 0 0 auto;
    margin-top: 2px;
  }
`;

const PortfolioCard = styled(Link)`
  display: block;
  border-radius: ${radii.lg};
  overflow: hidden;
  border: 1px solid ${colors.line};
  background: #fff;
  transition: transform ${transitions.base}, box-shadow ${transitions.base};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lift};
  }
`;

const PortfolioMedia = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;

  img {
    object-fit: cover;
    transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${PortfolioCard}:hover & img {
    transform: scale(1.04);
  }
`;

const PortfolioTag = styled.span`
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

const PortfolioBody = styled.div`
  padding: 18px;

  p {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
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

const MetricRow = styled.div`
  display: flex;
  gap: 20px;
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
    font-size: 9.5px;
    color: ${colors.faint};
    margin-top: 1px;
  }
`;

const QualityGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 54px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const QuoteCard = styled.blockquote`
  position: relative;
  padding: 32px;
  border-radius: ${radii.xl};
  background: #fff;
  border: 1px solid ${colors.line};
  box-shadow: ${shadows.card};

  > svg {
    color: ${colors.copper};
    opacity: 0.7;
  }

  p {
    margin-top: 14px;
    font-family: ${fonts.display};
    font-size: clamp(20px, 2.2vw, 27px);
    font-weight: 400;
    line-height: 1.35;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }
`;

const QuoteAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid ${colors.lineSoft};

  strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 10.5px;
    color: ${colors.muted};
    margin-top: 2px;
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

const CertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid ${colors.line};

  div {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 15px 0;
    border-bottom: 1px solid ${colors.lineSoft};
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
    max-width: 360px;
    line-height: 1.5;
  }

  small {
    flex: 0 0 auto;
    font-family: ${fonts.mono};
    font-size: 9.5px;
    font-weight: 600;
    color: ${colors.copperDeep};
    background: ${colors.copperWash};
    padding: 4px 8px;
    border-radius: ${radii.pill};
    white-space: nowrap;
  }
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.9fr);
  gap: 36px;
  align-items: stretch;
  margin-top: 36px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
`;

const TestimonialMain = styled.div`
  padding: 34px;
  border-radius: ${radii.xl};
  background: #fff;
  border: 1px solid ${colors.line};
  box-shadow: ${shadows.card};
  display: flex;
  flex-direction: column;

  > svg {
    color: ${colors.copper};
  }

  p {
    margin-top: 16px;
    font-family: ${fonts.display};
    font-size: clamp(20px, 2.4vw, 28px);
    line-height: 1.4;
    letter-spacing: -0.02em;
    color: ${colors.ink};
    flex: 1;
  }

  @media (max-width: 640px) {
    padding: 24px;
  }
`;

const TestimonialNav = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid ${colors.lineSoft};
  justify-content: space-between;
  align-items: center;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 6px;

  button {
    width: 34px;
    height: 34px;
    border-radius: ${radii.sm};
    border: 1px solid ${colors.line};
    background: #fff;
    color: ${colors.ink};
    display: grid;
    place-items: center;
    transition: all ${transitions.fast};

    &:hover {
      border-color: ${colors.forest};
      color: ${colors.forest};
    }
  }
`;

const TestimonialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  button {
    text-align: left;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 12px;
    border-radius: ${radii.md};
    border: 1px solid ${({ $active }) => ($active ? colors.line : 'transparent')};
    background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
    box-shadow: ${({ $active }) => ($active ? shadows.xs : 'none')};
    transition: all ${transitions.fast};

    &:hover {
      background: #fff;
    }
  }

  strong {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 10px;
    color: ${colors.muted};
    margin-top: 1px;
  }
`;

const ListAvatar = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  font-size: 9.5px;
  font-weight: 800;
  background: ${({ $active }) => ($active ? colors.forest : colors.paper)};
  color: ${({ $active }) => ($active ? '#F6F6FF' : colors.muted)};
  border: 1px solid ${colors.lineSoft};
`;

export default function HomePage() {
  const home = useDemoStore((state) => state.cms.home);
  const cmsTestimonials = useDemoStore((state) => state.cmsTestimonials);
  const cmsProducts = useDemoStore((state) => state.cmsProducts);
  const cmsBanners = useDemoStore((state) => state.cmsBanners);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const publishedTestimonials = cmsTestimonials.filter((item) => item.published);
  const testimonialList = publishedTestimonials.length ? publishedTestimonials : catalogTestimonials;

  const visibleProducts = publishedProducts(cmsProducts, catalogProducts);
  const featuredSource = visibleProducts.some((item) => item.featured)
    ? visibleProducts.filter((item) => item.featured)
    : visibleProducts;
  const homeProducts = featuredSource.slice(0, 4);

  const banner = cmsBanners.find((item) => item.placement === 'Homepage' && item.status === 'Published');
  const featuredSolutions = [solutions[0], solutions[1], solutions[4]].filter(Boolean);
  const featuredPortfolio = portfolio.slice(0, 3);
  const testimonial = testimonialList[activeTestimonial % testimonialList.length];

  const cycleTestimonial = (direction) => {
    setActiveTestimonial((current) => (current + direction + testimonialList.length) % testimonialList.length);
  };

  return (
    <CmsPageFlow slug="/" knownKeys={['hero', 'clients', 'why', 'products', 'solutions', 'manufacturing', 'quality', 'portfolio', 'testimonials', 'cta']}>
      <CmsSection sectionKey="hero">
      <Hero>
        <Container>
          <HeroGrid>
            <HeroCopy>
              <Eyebrow>
                <i /> {home.eyebrow}
              </Eyebrow>
              <HeroTitle>{home.headline}</HeroTitle>
              <HeroLead>{home.subcopy}</HeroLead>
              <HeroActions>
                <Cta href="/request-a-quote" variant="primary" size="lg">
                  {home.primaryCta} <ArrowRight size={15} />
                </Cta>
                <Cta href="/products" variant="outline" size="lg">
                  {home.secondaryCta} <ArrowUpRight size={15} />
                </Cta>
              </HeroActions>
              <HeroProof>
                <AvatarStack>
                  {testimonialList.slice(0, 4).map((item) => (
                    <span key={item.name}>{item.initials}</span>
                  ))}
                </AvatarStack>
                <p>
                  Trusted by <strong>480+ brands</strong> across e-commerce, food, beauty and industrial
                  categories.
                </p>
              </HeroProof>
            </HeroCopy>

            <HeroVisual>
              <HeroFrame>
                <Image
                  src="/images/hero.jpg"
                  alt="Premium kraft corrugated packaging stacked in a Stark Packmate facility"
                  fill
                  priority
                  sizes="(max-width: 980px) 92vw, 46vw"
                />
                <HeroBadge>
                  <Factory size={11} /> Made in Mumbai · Since 2009
                </HeroBadge>
                <HeroCard>
                  <p>Annual capacity</p>
                  <strong>120M boxes</strong>
                  <span>
                    <ShieldCheck size={11} /> 99.2% on-time dispatch
                  </span>
                </HeroCard>
              </HeroFrame>
            </HeroVisual>
          </HeroGrid>

          {home.showStats ? (
            <StatsWrap>
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
            </StatsWrap>
          ) : null}
        </Container>
      </Hero>

      {banner ? (
        <section style={{ background: banner.theme === 'Forest' ? colors.forest : banner.theme === 'Cream' ? colors.paper : colors.copperWash }}>
          <Container>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 18,
                flexWrap: 'wrap',
                padding: '16px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <Pill $light={banner.theme === 'Forest'}>
                  <Sparkles size={10} /> {banner.theme === 'Forest' ? 'New' : 'Featured'}
                </Pill>
                <div>
                  <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 800, color: banner.theme === 'Forest' ? '#F6F6FF' : colors.ink, letterSpacing: 0 }}>
                    {banner.title}
                  </p>
                  <p style={{ marginTop: 2, fontSize: 11.5, color: banner.theme === 'Forest' ? 'rgba(249,246,238,0.72)' : colors.muted, letterSpacing: 0 }}>
                    {banner.subtitle}
                  </p>
                </div>
              </div>
              <Cta href={banner.ctaHref || '/request-a-quote'} variant={banner.theme === 'Forest' ? 'ghostLight' : 'copper'} size="md">
                {banner.ctaLabel || 'Learn more'} <ArrowRight size={13} />
              </Cta>
            </div>
          </Container>
        </section>
      ) : null}
      </CmsSection>

      <CmsSection sectionKey="clients">
      <Section $tone="paper" $tight>
        <Container>
          <LogoStrip>
            <small>Trusted by brands that ship with care</small>
            {clientLogos.map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </LogoStrip>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="why">
      <Section>
        <Container>
          <SectionHead
            kicker="Why Stark Packmate"
            title="Packaging is an operating system, not a purchase order."
            lede="Design, tooling, print, converting and dispatch under one roof — so quality, cost and lead time stay inside your control."
            action={
              <ArrowLink href="/capabilities">
                Inside our plants <ArrowRight size={13} />
              </ArrowLink>
            }
          />
          <ValuesGrid>
            {valueProps.map((value) => (
              <FeatureCard key={value.title}>
                <IconBadge>
                  <SiteIcon name={value.icon} size={19} />
                </IconBadge>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </FeatureCard>
            ))}
          </ValuesGrid>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="products">
      <Section $tone="white">
        <Container>
          <SectionHead
            kicker="Product range"
            title="Structures for every job in the supply chain."
            lede="From the case that survives the courier network to the box that earns the photograph — engineered to your product, not picked from a catalogue."
            action={
              <ArrowLink href="/products">
                All products <ArrowRight size={13} />
              </ArrowLink>
            }
          />
          <Grid $cols={4} $colsLg={2} $gap="16px">
            {homeProducts.map((product) => (
              <ProductCard key={product.slug} href={`/products/${product.slug}`}>
                <ProductMedia>
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 680px) 92vw, (max-width: 1024px) 45vw, 24vw"
                  />
                  <ProductTag>{product.badge || product.category}</ProductTag>
                </ProductMedia>
                <ProductBody>
                  <h3>{product.shortName}</h3>
                  <p>{product.tagline}</p>
                  <ProductMeta>
                    <span>
                      {product.startingAt ? (
                        <>
                          From <strong>₹{product.startingAt}</strong> / {product.unit}
                        </>
                      ) : (
                        'Priced per brief'
                      )}
                    </span>
                    <ArrowUpRight size={14} />
                  </ProductMeta>
                </ProductBody>
              </ProductCard>
            ))}
          </Grid>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="solutions">
      <Section $tone="forest">
        <Container>
          <SectionHead
            light
            kicker="Solutions"
            title="Built around the way your product actually moves."
            lede="A packaging programme is more than a box. We design systems — structures, print, kits and replenishment — around your channel, your 3PL and your peak season."
            action={
              <Cta href="/solutions" variant="ghostLight" size="md">
                Explore solutions <ArrowRight size={14} />
              </Cta>
            }
          />
          <Grid $cols={3} $colsLg={2} $gap="16px">
            {featuredSolutions.map((solution) => (
              <SolutionCard key={solution.id} href="/solutions">
                <SolutionMedia>
                  <Image
                    src={solution.image}
                    alt={`${solution.title} packaging solution`}
                    fill
                    sizes="(max-width: 680px) 92vw, 30vw"
                  />
                  <SolutionNum>{solution.number}</SolutionNum>
                </SolutionMedia>
                <SolutionBody>
                  <h3>{solution.title}</h3>
                  <p>{solution.subtitle}</p>
                  <SolutionFoot>
                    <div>
                      <strong>{solution.metric}</strong>
                      <small>{solution.metricLabel}</small>
                    </div>
                    <ArrowUpRight size={16} />
                  </SolutionFoot>
                </SolutionBody>
              </SolutionCard>
            ))}
          </Grid>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="manufacturing">
      <Section>
        <Container>
          <TwoCol $cols="minmax(0, 0.92fr) minmax(0, 1.08fr)" $gap="54px">
            <div style={{ position: 'relative' }}>
              <FactoryFrame>
                <Image
                  src="/images/factory.jpg"
                  alt="Stark Packmate corrugating and printing floor"
                  fill
                  sizes="(max-width: 900px) 92vw, 42vw"
                />
                <FactoryOverlay>
                  {facilityStats.slice(0, 3).map((stat) => (
                    <OverlayStat key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </OverlayStat>
                  ))}
                </FactoryOverlay>
              </FactoryFrame>
            </div>
            <div>
              <Kicker>Manufacturing</Kicker>
              <SectionTitle>Precision you can audit, at a scale you can plan around.</SectionTitle>
              <Lede>
                Three facilities, a BHS corrugator, Heidelberg XL 106 and Bobst converting lines — all under
                the same quality system. Every batch traceable from reel to dispatched pallet.
              </Lede>
              <CapList>
                {capabilities.slice(0, 4).map((item) => (
                  <li key={item.title}>
                    <Check size={14} />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                  </li>
                ))}
              </CapList>
              <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Cta href="/capabilities" variant="primary" size="md">
                  Tour the capabilities <ArrowRight size={14} />
                </Cta>
                <Cta href="/quality" variant="outline" size="md">
                  Quality systems
                </Cta>
              </div>
            </div>
          </TwoCol>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="quality">
      <Section $tone="paper">
        <Container>
          <SectionHead
            kicker="Quality & compliance"
            title="The detail you do not see is the reason it arrives intact."
            lede="Certified systems, calibrated equipment and a lab that tests the structure before your customer tests your promise."
            action={
              <ArrowLink href="/quality">
                Our quality standard <ArrowRight size={13} />
              </ArrowLink>
            }
          />
          <QualityGrid>
            <QuoteCard>
              <Quote size={26} />
              <p>
                “Quality is not a final inspection. It is the sum of decisions made at the reel, the press and
                the die — long before a box reaches the customer.”
              </p>
              <QuoteAuthor>
                <QuoteAvatar>PN</QuoteAvatar>
                <div>
                  <strong>Priya Nair</strong>
                  <span>Head of Quality &amp; Compliance</span>
                </div>
              </QuoteAuthor>
            </QuoteCard>
            <div>
              <StatGrid style={{ marginBottom: 24 }}>
                {[
                  { value: '99.2%', label: 'On-time dispatch across 4,100 dispatches' },
                  { value: '0.28%', label: 'Defect rate at final audit' },
                  { value: '100%', label: 'Batch traceability, reel to pallet' },
                ].map((item) => (
                  <Stat key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </Stat>
                ))}
              </StatGrid>
              <CertList>
                {qualityCertifications.slice(0, 3).map((cert) => (
                  <div key={cert.code}>
                    <div>
                      <strong>{cert.name}</strong>
                      <span>{cert.description}</span>
                    </div>
                    <small>{cert.code}</small>
                  </div>
                ))}
              </CertList>
            </div>
          </QualityGrid>
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="portfolio">
      {home.showPortfolio ? (
        <Section $tone="white">
          <Container>
            <SectionHead
              kicker="Selected work"
              title="Programmes that moved a number, not just a box."
              lede="Each engagement starts with a commercial problem — damage, cost, shelf appeal or speed to market — and ends with packaging that performs."
              action={
                <ArrowLink href="/portfolio">
                  View portfolio <ArrowRight size={13} />
                </ArrowLink>
              }
            />
            <Grid $cols={3} $colsLg={2} $gap="16px">
              {featuredPortfolio.map((project) => (
                <PortfolioCard key={project.id} href="/portfolio">
                  <PortfolioMedia>
                    <Image
                      src={project.image}
                      alt={`${project.brand} packaging programme`}
                      fill
                      sizes="(max-width: 680px) 92vw, 30vw"
                    />
                    <PortfolioTag>{project.category}</PortfolioTag>
                  </PortfolioMedia>
                  <PortfolioBody>
                    <p>{project.brand}</p>
                    <h3>{project.title}</h3>
                    <MetricRow>
                      {project.metrics.map((metric) => (
                        <div key={metric.label}>
                          <strong>{metric.value}</strong>
                          <span>{metric.label}</span>
                        </div>
                      ))}
                    </MetricRow>
                  </PortfolioBody>
                </PortfolioCard>
              ))}
            </Grid>
          </Container>
        </Section>
      ) : null}
      </CmsSection>

      <CmsSection sectionKey="testimonials">
      {home.showTestimonials ? (
        <Section>
          <Container>
            <SectionHead
              kicker="Client voices"
              title="The relationship is the product."
              lede="Long-running partnerships across supply chain, quality and founder teams — measured in dispatch dates kept and problems solved."
              flush
            />
            <TestimonialGrid>
              <TestimonialMain>
                <Quote size={24} />
                <p>“{testimonial.quote}”</p>
                <TestimonialNav>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <QuoteAvatar>{testimonial.initials}</QuoteAvatar>
                    <div>
                      <p style={{ fontFamily: fonts.sans, fontSize: 12, fontWeight: 700, color: colors.ink, letterSpacing: 0 }}>
                        {testimonial.name}
                      </p>
                      <p style={{ marginTop: 1, fontFamily: fonts.sans, fontSize: 10.5, color: colors.muted, letterSpacing: 0 }}>
                        {testimonial.role} · {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <NavButtons>
                    <button type="button" aria-label="Previous testimonial" onClick={() => cycleTestimonial(-1)}>
                      <ChevronLeft size={15} />
                    </button>
                    <button type="button" aria-label="Next testimonial" onClick={() => cycleTestimonial(1)}>
                      <ChevronRight size={15} />
                    </button>
                  </NavButtons>
                </TestimonialNav>
              </TestimonialMain>
              <TestimonialList>
                {testimonialList.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setActiveTestimonial(index)}
                  >
                    <ListAvatar $active={index === activeTestimonial}>{item.initials}</ListAvatar>
                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        {item.role} · {item.company}
                      </span>
                    </div>
                  </button>
                ))}
              </TestimonialList>
            </TestimonialGrid>
          </Container>
        </Section>
      ) : null}
      </CmsSection>

      <CmsSection sectionKey="cta">
      <Section $tone="paper" style={{ paddingTop: 0 }}>
        <Container style={{ paddingTop: 0 }}>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>
                <Clock3 size={10} /> One business day response
              </Pill>
              <h2 style={{ marginTop: 14 }}>Your next pack starts with a conversation.</h2>
              <p>
                Send us a product, a volume and a date. We will come back with a structure, a price and a
                production plan — not a brochure.
              </p>
            </div>
            <BandActions>
              <Cta href="/request-a-quote" variant="copper" size="lg">
                Request a quote <ArrowRight size={15} />
              </Cta>
              <Cta href="/contact" variant="ghostLight" size="lg">
                <Sparkles size={15} /> Talk to the team
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
      </CmsSection>
    </CmsPageFlow>
  );
}
