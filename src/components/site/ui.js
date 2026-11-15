'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';
import {
  Ruler,
  Printer,
  Layers,
  Leaf,
  ShieldCheck,
  Recycle,
  Sparkles,
  Palette,
  Truck,
  PenTool,
  Package,
  Handshake,
  ShoppingBag,
  Shirt,
  Cpu,
  Coffee,
  Pill as PillIcon,
  Home,
  ArrowRight,
} from 'lucide-react';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';

const iconMap = {
  ruler: Ruler,
  printer: Printer,
  layers: Layers,
  leaf: Leaf,
  shield: ShieldCheck,
  recycle: Recycle,
  sparkles: Sparkles,
  palette: Palette,
  truck: Truck,
  design: PenTool,
  box: Package,
  handshake: Handshake,
  shopping: ShoppingBag,
  shirt: Shirt,
  cpu: Cpu,
  coffee: Coffee,
  pill: PillIcon,
  home: Home,
};

export function SiteIcon({ name, size = 20, ...props }) {
  const Icon = iconMap[name] || Package;
  return <Icon size={size} {...props} />;
}

export const Container = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;

  @media (max-width: 700px) {
    padding: 0 20px;
  }
`;

const toneStyles = {
  cream: css`
    background: ${colors.cream};
  `,
  paper: css`
    background: ${colors.paper};
  `,
  white: css`
    background: ${colors.surface};
  `,
  forest: css`
    background: ${colors.sidebar};
    color: #F3EFE4;
  `,
  copper: css`
    background: ${colors.copperWash};
  `,
};

export const Section = styled.section`
  padding: ${({ $tight }) => ($tight ? '48px 0' : '86px 0')};
  ${({ $tone }) => toneStyles[$tone] || toneStyles.cream};

  @media (max-width: 760px) {
    padding: ${({ $tight }) => ($tight ? '38px 0' : '58px 0')};
  }
`;

export const Kicker = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${fonts.sans};
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ $light }) => ($light ? colors.copperSoft : colors.copperDeep)};

  &::before {
    content: '';
    width: 22px;
    height: 1px;
    background: ${({ $light }) => ($light ? colors.copperSoft : colors.copper)};
  }
`;

export const SectionTitle = styled.h2`
  margin-top: 14px;
  font-family: ${fonts.display};
  font-size: clamp(30px, 3.4vw, 46px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.028em;
  color: ${({ $light }) => ($light ? '#F9F6EE' : colors.ink)};
  max-width: 780px;
`;

export const Lede = styled.p`
  margin-top: 16px;
  font-size: 14.5px;
  line-height: 1.75;
  color: ${({ $light }) => ($light ? 'rgba(243, 239, 228, 0.7)' : colors.muted)};
  max-width: 620px;
`;

const HeadRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
  margin-bottom: ${({ $flush }) => ($flush ? '0' : '38px')};
`;

const HeadCopy = styled.div`
  min-width: 0;
  flex: 1;
`;

export function SectionHead({ kicker, title, lede, action, light = false, center = false, flush = false }) {
  return (
    <HeadRow $flush={flush} style={center ? { justifyContent: 'center', textAlign: 'center' } : undefined}>
      <HeadCopy style={center ? { flex: '0 1 760px' } : undefined}>
        {kicker ? <Kicker $light={light}>{kicker}</Kicker> : null}
        <SectionTitle $light={light} style={center ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}>
          {title}
        </SectionTitle>
        {lede ? (
          <Lede $light={light} style={center ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}>
            {lede}
          </Lede>
        ) : null}
      </HeadCopy>
      {action ? <div style={{ flex: '0 0 auto' }}>{action}</div> : null}
    </HeadRow>
  );
}

const ctaVariants = {
  primary: css`
    background: ${colors.forest};
    color: #F9F6EE;
    border: 1px solid ${colors.forest};

    &:hover {
      background: ${colors.forestDeep};
      border-color: ${colors.forestDeep};
      transform: translateY(-1px);
    }
  `,
  copper: css`
    background: ${colors.copper};
    color: #fff;
    border: 1px solid ${colors.copper};

    &:hover {
      background: ${colors.copperDeep};
      border-color: ${colors.copperDeep};
      transform: translateY(-1px);
    }
  `,
  outline: css`
    background: transparent;
    color: ${colors.ink};
    border: 1px solid #CFC8B9;

    &:hover {
      border-color: ${colors.forest};
      color: ${colors.forest};
      background: rgba(23, 73, 59, 0.03);
    }
  `,
  light: css`
    background: #F9F6EE;
    color: ${colors.ink};
    border: 1px solid #F9F6EE;

    &:hover {
      background: #fff;
      transform: translateY(-1px);
    }
  `,
  ghostLight: css`
    background: transparent;
    color: #F9F6EE;
    border: 1px solid rgba(249, 246, 238, 0.28);

    &:hover {
      border-color: rgba(249, 246, 238, 0.6);
      background: rgba(249, 246, 238, 0.06);
    }
  `,
};

const CtaBase = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${radii.sm};
  font-family: ${fonts.sans};
  font-weight: 700;
  font-size: ${({ $size }) => ($size === 'sm' ? '11.5px' : $size === 'lg' ? '14px' : '12.5px')};
  padding: ${({ $size }) => ($size === 'sm' ? '9px 14px' : $size === 'lg' ? '14px 22px' : '11px 18px')};
  white-space: nowrap;
  cursor: pointer;
  transition: all ${transitions.fast};
  ${({ $variant }) => ctaVariants[$variant] || ctaVariants.primary}

  svg {
    flex: 0 0 auto;
  }
`;

export function Cta({ href = '/', variant = 'primary', size = 'md', children, ...props }) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  return (
    <CtaBase href={href} as={external ? 'a' : undefined} $variant={variant} $size={size} {...props}>
      {children}
    </CtaBase>
  );
}

export const ArrowLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ $light }) => ($light ? colors.copperSoft : colors.forest)};
  border-bottom: 1px solid ${({ $light }) => ($light ? 'rgba(217, 160, 106, 0.4)' : 'rgba(23, 73, 59, 0.28)')};
  padding-bottom: 3px;
  transition: gap ${transitions.fast}, color ${transitions.fast};

  &:hover {
    gap: 11px;
    color: ${({ $light }) => ($light ? '#F1C9A0' : colors.copperDeep)};
  }
`;

export const PageIntro = styled.header`
  padding: 62px 0 48px;
  background: ${colors.cream};
  border-bottom: 1px solid ${colors.lineSoft};
  position: relative;
  overflow: hidden;

  @media (max-width: 760px) {
    padding: 42px 0 34px;
  }
`;

export const IntroTitle = styled.h1`
  margin-top: 16px;
  font-family: ${fonts.display};
  font-size: clamp(38px, 5.4vw, 68px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: ${colors.ink};
  max-width: 880px;
`;

export const IntroLede = styled.p`
  margin-top: 20px;
  font-size: 15px;
  line-height: 1.72;
  color: ${colors.muted};
  max-width: 620px;
`;

export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  font-size: 11px;
  font-weight: 600;
  color: ${colors.faint};
  margin-bottom: 4px;

  a:hover {
    color: ${colors.forest};
  }

  span {
    color: ${colors.line};
  }
`;

export const ImageFrame = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${radii.lg};
  background: ${colors.mist};
  box-shadow: ${shadows.card};
  aspect-ratio: ${({ $ratio }) => $ratio || '4 / 3'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover img {
    transform: scale(1.035);
  }
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: ${radii.pill};
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${({ $light }) => ($light ? 'rgba(255,255,255,0.1)' : colors.paper)};
  color: ${({ $light, $tone }) => ($light ? 'rgba(249,246,238,0.82)' : $tone === 'copper' ? colors.copperDeep : colors.muted)};
  border: 1px solid ${({ $light }) => ($light ? 'rgba(255,255,255,0.14)' : colors.lineSoft)};
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 4}, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid ${({ $light }) => ($light ? 'rgba(255,255,255,0.14)' : colors.line)};

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Stat = styled.div`
  padding: 22px 22px 0 0;
  border-right: 1px solid ${({ $light }) => ($light ? 'rgba(255,255,255,0.1)' : colors.lineSoft)};

  &:last-child {
    border-right: 0;
  }

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 500;
    letter-spacing: -0.03em;
    color: ${({ $light }) => ($light ? '#F9F6EE' : colors.ink)};
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 7px;
    font-size: 10.5px;
    font-weight: 600;
    color: ${({ $light }) => ($light ? 'rgba(249,246,238,0.6)' : colors.muted)};
    line-height: 1.5;
    max-width: 170px;
  }

  @media (max-width: 760px) {
    padding: 18px 16px 0 0;

    &:nth-child(2n) {
      border-right: 0;
    }

    &:nth-child(n + 3) {
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid ${({ $light }) => ($light ? 'rgba(255,255,255,0.1)' : colors.lineSoft)};
    }
  }
`;

export const CTABand = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${radii.xl};
  padding: 46px 44px;
  background: linear-gradient(135deg, #164236 0%, #0C231C 70%);
  color: #F9F6EE;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;

  &::after {
    content: '';
    position: absolute;
    right: -70px;
    top: -90px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.09);
  }

  h2 {
    font-size: clamp(26px, 3vw, 38px);
    color: #F9F6EE;
    max-width: 620px;
  }

  p {
    margin-top: 10px;
    font-size: 13px;
    color: rgba(249, 246, 238, 0.66);
    max-width: 520px;
    line-height: 1.65;
  }

  @media (max-width: 700px) {
    padding: 30px 24px;
  }
`;

export const BandActions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ProductCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  overflow: hidden;
  transition: transform ${transitions.base}, box-shadow ${transitions.base}, border-color ${transitions.base};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lift};
    border-color: #D6CFC0;
  }
`;

export const ProductMedia = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: ${colors.mist};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${ProductCard}:hover & img {
    transform: scale(1.04);
  }
`;

export const ProductTag = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 9px;
  border-radius: ${radii.pill};
  background: rgba(251, 248, 242, 0.92);
  backdrop-filter: blur(4px);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.forest};
`;

export const ProductBody = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  h3 {
    font-family: ${fonts.display};
    font-size: 21px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }

  p {
    font-size: 12px;
    line-height: 1.6;
    color: ${colors.muted};
    flex: 1;
  }
`;

export const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid ${colors.lineSoft};
  font-size: 10.5px;
  color: ${colors.muted};

  strong {
    font-size: 12.5px;
    color: ${colors.ink};
    font-weight: 700;
  }

  svg {
    color: ${colors.copper};
  }
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || 'repeat(2, minmax(0, 1fr))'};
  gap: ${({ $gap }) => $gap || '48px'};
  align-items: ${({ $align }) => $align || 'center'};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

export const IconBadge = styled.span`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: ${radii.sm};
  background: ${({ $tone }) => ($tone === 'copper' ? colors.copperWash : colors.paper)};
  color: ${({ $tone }) => ($tone === 'copper' ? colors.copperDeep : colors.forest)};
  border: 1px solid ${colors.lineSoft};
  flex: 0 0 auto;
`;

export const FeatureCard = styled.div`
  padding: 22px;
  border: 1px solid ${({ $light }) => ($light ? 'rgba(255,255,255,0.12)' : colors.line)};
  border-radius: ${radii.lg};
  background: ${({ $light }) => ($light ? 'rgba(255,255,255,0.04)' : '#fff')};
  transition: border-color ${transitions.fast}, transform ${transitions.fast};

  &:hover {
    border-color: ${({ $light }) => ($light ? 'rgba(217,160,106,0.4)' : '#D6CFC0')};
    transform: translateY(-2px);
  }

  h3 {
    margin-top: 14px;
    font-family: ${fonts.sans};
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: -0.005em;
    color: ${({ $light }) => ($light ? '#F9F6EE' : colors.ink)};
  }

  p {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.65;
    color: ${({ $light }) => ($light ? 'rgba(243,239,228,0.64)' : colors.muted)};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 3}, minmax(0, 1fr));
  gap: ${({ $gap }) => $gap || '18px'};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(${({ $colsLg }) => $colsLg || 2}, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const ArrowIcon = ArrowRight;
