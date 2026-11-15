'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { colors, fonts } from '@/lib/theme';

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  flex: 0 0 auto;
`;

const Mark = styled.span`
  display: grid;
  place-items: center;
  width: ${({ $size }) => ($size === 'sm' ? '34px' : '38px')};
  height: ${({ $size }) => ($size === 'sm' ? '34px' : '38px')};
  border-radius: ${({ $size }) => ($size === 'sm' ? '9px' : '10px')};
  background: ${({ $inverse }) => ($inverse ? colors.copper : colors.forest)};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  flex: 0 0 auto;
`;

const Wordmark = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1;
`;

const Name = styled.span`
  font-family: ${fonts.sans};
  font-size: ${({ $size }) => ($size === 'sm' ? '13px' : '14px')};
  font-weight: 800;
  letter-spacing: 0.09em;
  color: ${({ $inverse }) => ($inverse ? '#F9F6EE' : colors.ink)};
`;

const Sub = styled.span`
  font-family: ${fonts.sans};
  font-size: ${({ $size }) => ($size === 'sm' ? '6.5px' : '7px')};
  font-weight: 700;
  letter-spacing: 0.38em;
  color: ${({ $inverse }) => ($inverse ? 'rgba(249, 246, 238, 0.56)' : colors.copperDeep)};
`;

export default function Logo({ inverse = false, size = 'md', href = '/' }) {
  const markSize = size === 'sm' ? 34 : 38;
  return (
    <BrandLink href={href} aria-label="Stark Packmate home">
      <Mark $inverse={inverse} $size={size}>
        <svg width={markSize * 0.62} height={markSize * 0.62} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7.2 12 2.8l8 4.4v9.6L12 21.2 4 16.8V7.2Z"
            stroke={inverse ? '#FBEAE4' : '#F5EFE2'}
            strokeWidth="1.25"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <path d="M4 7.2 12 11.6l8-4.4M12 11.6v9.6" stroke={inverse ? '#4A2A12' : colors.copperSoft} strokeWidth="1.25" strokeLinejoin="round" />
          <path d="M8 9.4 12 7.2l4 2.2" stroke={inverse ? '#FBEAE4' : '#F5EFE2'} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
        </svg>
      </Mark>
      <Wordmark>
        <Name $inverse={inverse} $size={size}>
          STARK
        </Name>
        <Sub $inverse={inverse} $size={size}>
          PACKMATE
        </Sub>
      </Wordmark>
    </BrandLink>
  );
}
