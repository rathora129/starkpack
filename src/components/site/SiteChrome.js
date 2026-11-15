'use client';

import styled from 'styled-components';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import WhatsAppFloat from './WhatsAppFloat';
import { colors, radii, shadows } from '@/lib/theme';

const Main = styled.main`
  min-height: 60vh;
  background: ${colors.cream};
`;

const Skip = styled.a`
  position: fixed;
  top: -100px;
  left: 16px;
  z-index: 120;
  padding: 10px 16px;
  border-radius: ${radii.sm};
  background: ${colors.forest};
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  box-shadow: ${shadows.card};
  transition: top 160ms ease;

  &:focus {
    top: 12px;
  }
`;

export default function SiteChrome({ children }) {
  return (
    <>
      <Skip href="#site-main">Skip to content</Skip>
      <SiteHeader />
      <Main id="site-main">{children}</Main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
