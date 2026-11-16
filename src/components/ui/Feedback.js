'use client';

import styled, { keyframes } from 'styled-components';
import { colors } from '@/lib/theme';
import { Button } from './primitives';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: 120% 0; }
  100% { background-position: -120% 0; }
`;

const Ring = styled.span`
  display: inline-block;
  flex: 0 0 auto;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;
  border: ${({ $size }) => Math.max(2, Math.round($size / 7))}px solid
    ${({ $tone }) => ($tone === 'light' ? 'rgba(255, 255, 255, 0.35)' : colors.line)};
  border-top-color: ${({ $tone }) => ($tone === 'light' ? '#fff' : colors.copper)};
  animation: ${spin} 700ms linear infinite;
`;

export function InlineSpinner({ size = 14, tone = 'default', label = 'Loading' }) {
  return <Ring role="status" aria-label={label} $size={size} $tone={tone} />;
}

export function LoadingButton({ loading = false, loadingLabel, children, disabled, ...props }) {
  const light = props.$variant === 'primary' || props.$variant === 'copper' || props.$variant === 'dark';
  return (
    <Button {...props} disabled={loading || disabled} aria-busy={loading || undefined}>
      {loading ? <InlineSpinner size={13} tone={light ? 'light' : 'default'} /> : null}
      {loading ? loadingLabel || children : children}
    </Button>
  );
}

export const SkeletonBar = styled.span`
  display: block;
  height: 10px;
  width: ${({ $w }) => $w || '70%'};
  border-radius: 999px;
  background: linear-gradient(90deg, ${colors.mist} 25%, ${colors.paper} 50%, ${colors.mist} 75%);
  background-size: 220% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;
