'use client';

import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  text-decoration: none;

  img {
    display: block;
    width: auto;
    object-fit: contain;
  }
`;

const HEIGHTS = { sm: 32, md: 42, lg: 58 };

export default function Logo({ inverse = false, size = 'md', href = '/' }) {
  const height = HEIGHTS[size] || HEIGHTS.md;
  return (
    <BrandLink href={href} aria-label="Stark Packmate home">
      <Image
        src={inverse ? '/brand/stark-packmate-logo-dark.png' : '/brand/stark-packmate-logo.png'}
        alt="Stark Packmate"
        width={270}
        height={148}
        priority={size !== 'sm'}
        style={{ height, width: 'auto' }}
      />
    </BrandLink>
  );
}
