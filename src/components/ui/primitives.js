'use client';

import styled, { css, keyframes } from 'styled-components';
import Link from 'next/link';
import { colors, fonts, layout, radii, shadows, transitions } from '@/lib/theme';

export const Container = styled.div`
  width: 100%;
  max-width: ${layout.max};
  margin: 0 auto;
  padding: 0 30px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const Section = styled.section`
  padding: clamp(64px, 8vw, 112px) 0;
`;

export const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: ${colors.copperDeep};
  font-family: ${fonts.sans};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  &::before {
    content: '';
    width: 22px;
    height: 1px;
    background: ${colors.copper};
  }
`;

export const Title = styled.h2`
  margin-top: 18px;
  font-size: clamp(34px, 4.2vw, 54px);
  line-height: 1.04;
  color: ${colors.ink};
  font-weight: 500;
`;

export const Intro = styled.p`
  margin-top: 18px;
  max-width: 620px;
  color: ${colors.muted};
  font-size: 15.5px;
  line-height: 1.75;
`;

export const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid transparent;
  border-radius: ${radii.sm};
  padding: 12px 22px;
  font-family: ${fonts.sans};
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.005em;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background ${transitions.fast}, border-color ${transitions.fast}, color ${transitions.fast}, transform ${transitions.fast}, box-shadow ${transitions.fast};

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    flex: 0 0 auto;
  }
`;

const variants = {
  primary: css`
    background: ${colors.forest};
    color: #fff;
    border-color: ${colors.forest};

    &:hover:not(:disabled) {
      background: ${colors.forestDeep};
      border-color: ${colors.forestDeep};
      box-shadow: 0 10px 24px -14px rgba(11, 42, 34, 0.8);
    }
  `,
  copper: css`
    background: ${colors.copper};
    color: #fff;
    border-color: ${colors.copper};

    &:hover:not(:disabled) {
      background: ${colors.copperDeep};
      border-color: ${colors.copperDeep};
      box-shadow: 0 10px 24px -14px rgba(156, 94, 39, 0.9);
    }
  `,
  dark: css`
    background: ${colors.ink};
    color: #fff;
    border-color: ${colors.ink};

    &:hover:not(:disabled) {
      background: ${colors.forestDeep};
      border-color: ${colors.forestDeep};
    }
  `,
  secondary: css`
    background: transparent;
    color: ${colors.ink};
    border-color: #D3CEC1;

    &:hover:not(:disabled) {
      background: rgba(16, 35, 29, 0.045);
      border-color: ${colors.inkSoft};
    }
  `,
  light: css`
    background: #fff;
    color: ${colors.ink};
    border-color: ${colors.line};
    box-shadow: ${shadows.xs};

    &:hover:not(:disabled) {
      border-color: #CFC9BB;
      background: ${colors.cream};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${colors.inkSoft};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: rgba(16, 35, 29, 0.06);
    }
  `,
  danger: css`
    background: ${colors.danger};
    color: #fff;
    border-color: ${colors.danger};

    &:hover:not(:disabled) {
      background: #973B27;
      border-color: #973B27;
    }
  `,
  white: css`
    background: #fff;
    color: ${colors.forest};
    border-color: #fff;

    &:hover:not(:disabled) {
      background: ${colors.cream};
      border-color: ${colors.cream};
    }
  `,
};

const sizes = {
  xs: css`
    padding: 7px 12px;
    font-size: 12px;
    border-radius: 7px;
  `,
  sm: css`
    padding: 9px 15px;
    font-size: 12.5px;
    border-radius: 8px;
  `,
  md: css`
    padding: 12px 22px;
    font-size: 13.5px;
  `,
  lg: css`
    padding: 15px 28px;
    font-size: 14.5px;
    border-radius: ${radii.md};
  `,
};

const buttonStyles = css`
  ${buttonBase};
  ${({ $variant }) => variants[$variant] || variants.primary};
  ${({ $size }) => sizes[$size] || sizes.md};
  ${({ $full }) => ($full ? 'width: 100%;' : '')};
`;

export const Button = styled.button`
  ${buttonStyles};
`;

export const ButtonLink = styled(Link)`
  ${buttonStyles};
`;

export const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${colors.forest};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.01em;
  padding-bottom: 3px;
  border-bottom: 1px solid ${colors.line};
  transition: border-color ${transitions.fast}, color ${transitions.fast}, gap ${transitions.fast};

  &:hover {
    color: ${colors.copperDeep};
    border-color: ${colors.copper};
    gap: 11px;
  }
`;

export const IconButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: ${({ $size }) => ($size === 'sm' ? '30px' : '38px')};
  height: ${({ $size }) => ($size === 'sm' ? '30px' : '38px')};
  border-radius: ${radii.sm};
  border: 1px solid ${({ $bordered }) => ($bordered ? colors.line : 'transparent')};
  background: ${({ $bordered }) => ($bordered ? colors.surface : 'transparent')};
  color: ${colors.inkSoft};
  transition: background ${transitions.fast}, color ${transitions.fast}, border-color ${transitions.fast};

  &:hover:not(:disabled) {
    background: ${colors.mist};
    color: ${colors.ink};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const Panel = styled.section`
  background: ${colors.surface};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.lg};
  box-shadow: ${shadows.xs};
  min-width: 0;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid ${colors.lineSoft};
  flex-wrap: wrap;
`;

export const PanelTitle = styled.h3`
  font-family: ${fonts.sans};
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${colors.ink};
  line-height: 1.3;
`;

export const PanelSubtitle = styled.p`
  margin-top: 4px;
  font-size: 12px;
  color: ${colors.muted};
  line-height: 1.4;
`;

export const PanelBody = styled.div`
  padding: ${({ $flush }) => ($flush ? '0' : '20px 22px')};
`;

export const PanelFooter = styled.div`
  padding: 14px 22px;
  border-top: 1px solid ${colors.lineSoft};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const PageHeaderBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 26px;
`;

export const PageHeading = styled.h1`
  font-size: clamp(26px, 2.4vw, 32px);
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: ${colors.ink};
  font-weight: 500;
`;

export const PageDescription = styled.p`
  margin-top: 7px;
  max-width: 640px;
  color: ${colors.muted};
  font-size: 13px;
  line-height: 1.6;
`;

export const PageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
`;

const toneColors = {
  success: { bg: colors.successBg, fg: '#1F6347', border: '#CDE6D9' },
  warning: { bg: colors.warningBg, fg: '#85601A', border: '#F0E0B8' },
  danger: { bg: colors.dangerBg, fg: '#943B25', border: '#F1D2C7' },
  info: { bg: colors.infoBg, fg: '#2B5D77', border: '#CFE1EA' },
  copper: { bg: colors.copperWash, fg: '#8A5524', border: '#EED8BC' },
  neutral: { bg: '#F1F0EA', fg: '#5C655F', border: '#E2DFD5' },
  dark: { bg: colors.ink, fg: '#F9F6EE', border: colors.ink },
};

export const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 999px;
  background: ${({ $tone }) => (toneColors[$tone] || toneColors.neutral).bg};
  color: ${({ $tone }) => (toneColors[$tone] || toneColors.neutral).fg};
  border: 1px solid ${({ $tone }) => (toneColors[$tone] || toneColors.neutral).border};
  font-family: ${fonts.sans};
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.8;
  }
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 9px;
  border-radius: ${radii.xs};
  border: 1px solid ${colors.line};
  background: ${colors.cream};
  color: ${colors.muted};
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: ${colors.mist};
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $value }) => `${Math.min(100, Math.max(0, Number($value) || 0))}%`};
  border-radius: 999px;
  background: ${({ $tone }) =>
    $tone === 'danger' ? colors.danger : $tone === 'warning' ? colors.warning : colors.forest};
  transition: width 320ms ease;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 52px 24px;
  color: ${colors.muted};

  svg {
    color: ${colors.faint};
    margin-bottom: 12px;
  }

  strong {
    color: ${colors.ink};
    font-size: 14px;
    font-weight: 700;
  }

  p {
    margin-top: 6px;
    font-size: 12.5px;
    max-width: 340px;
    line-height: 1.5;
  }
`;

export const Avatar = styled.span`
  display: inline-grid;
  place-items: center;
  width: ${({ $size }) => ($size === 'sm' ? '28px' : $size === 'lg' ? '52px' : '36px')};
  height: ${({ $size }) => ($size === 'sm' ? '28px' : $size === 'lg' ? '52px' : '36px')};
  border-radius: 50%;
  background: ${({ $bg }) => $bg || colors.forest};
  color: ${({ $color }) => $color || '#F9F6EE'};
  font-size: ${({ $size }) => ($size === 'sm' ? '10px' : $size === 'lg' ? '16px' : '12px')};
  font-weight: 700;
  letter-spacing: 0.02em;
  flex: 0 0 auto;
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${colors.lineSoft};
  margin: 0;
`;

export const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: ${colors.inkSoft};
  margin-bottom: 6px;
`;

export const Hint = styled.p`
  margin-top: 5px;
  font-size: 11.5px;
  color: ${colors.muted};
`;

export const Grid = styled.div`
  display: grid;
  gap: ${({ $gap }) => $gap || '18px'};
  grid-template-columns: ${({ $cols }) => $cols || 'repeat(4, minmax(0, 1fr))'};

  @media (max-width: 1180px) {
    grid-template-columns: ${({ $colsMd }) => $colsMd || 'repeat(2, minmax(0, 1fr))'};
  }

  @media (max-width: 640px) {
    grid-template-columns: ${({ $colsSm }) => $colsSm || '1fr'};
  }
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || '14px'};
`;

export const Row = styled.div`
  display: flex;
  align-items: ${({ $align }) => $align || 'center'};
  gap: ${({ $gap }) => $gap || '10px'};
  flex-wrap: ${({ $wrap }) => ($wrap === false ? 'nowrap' : 'wrap')};
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

export const Skeleton = styled.span`
  display: block;
  height: ${({ $h }) => $h || '14px'};
  width: ${({ $w }) => $w || '100%'};
  border-radius: 6px;
  background: linear-gradient(90deg, #EFECE4 0px, #F7F4EE 40px, #EFECE4 80px);
  background-size: 200px 100%;
  animation: ${shimmer} 1.3s ease-in-out infinite;
`;

export const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid ${colors.line};
  background: ${colors.cream};
  color: ${colors.muted};
  font-family: ${fonts.sans};
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
`;

export const ScrollX = styled.div`
  overflow-x: auto;
  scrollbar-width: thin;
`;
