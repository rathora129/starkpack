'use client';

import styled from 'styled-components';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Leaf,
  Award,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useDemoStore } from '@/store/useDemoStore';
import { colors, fonts, radii, transitions } from '@/lib/theme';
import { Container, Cta } from './ui';

const Foot = styled.footer`
  background: ${colors.sidebar};
  color: rgba(243, 239, 228, 0.66);
  padding: 0 0 28px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: -140px;
    top: 60px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(184, 115, 51, 0.12), transparent 68%);
    pointer-events: none;
  }
`;

const TopBand = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
  padding: 58px 0 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;

  h2 {
    color: #F9F6EE;
    font-size: clamp(30px, 4vw, 48px);
    letter-spacing: -0.03em;
    max-width: 620px;
  }

  p {
    margin-top: 12px;
    font-size: 13px;
    max-width: 460px;
    line-height: 1.7;
  }
`;

const TopActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.1fr;
  gap: 36px;
  padding: 44px 0;
  position: relative;
  z-index: 1;

  @media (max-width: 1000px) {
    grid-template-columns: 1.4fr 1fr 1fr;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const BrandCol = styled.div`
  p {
    margin-top: 16px;
    font-size: 12px;
    line-height: 1.7;
    max-width: 280px;
  }

  @media (max-width: 1000px) {
    grid-column: 1 / -1;
    margin-bottom: 4px;
  }
`;

const CertRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 18px;
`;

const Cert = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: ${radii.pill};
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgba(243, 239, 228, 0.72);

  svg {
    color: ${colors.copperSoft};
  }
`;

const ColTitle = styled.h4`
  font-family: ${fonts.sans};
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(249, 246, 238, 0.42);
  margin-bottom: 14px;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;

  a {
    font-size: 12px;
    color: rgba(243, 239, 228, 0.7);
    transition: color ${transitions.fast}, transform ${transitions.fast};
    width: fit-content;

    &:hover {
      color: #F9F6EE;
      transform: translateX(2px);
    }
  }
`;

const ContactLine = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11.5px;
  line-height: 1.55;
  color: rgba(243, 239, 228, 0.7);
  transition: color ${transitions.fast};

  svg {
    color: ${colors.copperSoft};
    flex: 0 0 auto;
    margin-top: 1px;
  }

  &:hover {
    color: #F9F6EE;
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 10px;
  color: rgba(243, 239, 228, 0.42);
  position: relative;
  z-index: 1;

  div {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  a {
    color: rgba(243, 239, 228, 0.62);
    font-weight: 600;

    &:hover {
      color: ${colors.copperSoft};
    }
  }
`;

const productLinks = [
  ['Corrugated shipping', '/products/corrugated-shipping-boxes'],
  ['Premium mailers', '/products/premium-mailer-boxes'],
  ['Folding cartons', '/products/printed-folding-cartons'],
  ['Rigid gift boxes', '/products/rigid-gift-boxes'],
  ['Kraft retail bags', '/products/kraft-retail-bags'],
];

const solutionLinks = [
  ['E-commerce fulfilment', '/solutions'],
  ['Retail & brand', '/solutions'],
  ['Industrial & logistics', '/solutions'],
  ['Food & beverage', '/solutions'],
  ['Sustainability', '/quality'],
];

const companyLinks = [
  ['About us', '/about'],
  ['Manufacturing', '/capabilities'],
  ['Quality & compliance', '/quality'],
  ['Portfolio', '/portfolio'],
  ['Contact', '/contact'],
  ['Request a quote', '/request-a-quote'],
];

export default function SiteFooter() {
  const contact = useDemoStore((state) => state.cms.contact);

  return (
    <Foot id="site-footer">
      <Container>
        <TopBand>
          <div>
            <h2>Let&apos;s engineer your next pack.</h2>
            <p>
              Share your product, volumes and launch date. A packaging consultant will respond within one
              business day with structures, indicative pricing and a production plan.
            </p>
          </div>
          <TopActions>
            <Cta href="/request-a-quote" variant="copper" size="lg">
              Request a quote <ArrowRight size={15} />
            </Cta>
            <Cta href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`} variant="ghostLight" size="lg">
              <Phone size={15} /> Talk to us
            </Cta>
          </TopActions>
        </TopBand>

        <Columns>
          <BrandCol>
            <Logo inverse />
            <p>
              Precision packaging manufacturing for brands that care how their product arrives. Three plants,
              16 years, 120 million boxes a year.
            </p>
            <CertRow>
              <Cert>
                <ShieldCheck size={10} /> ISO 9001
              </Cert>
              <Cert>
                <Leaf size={10} /> FSC®
              </Cert>
              <Cert>
                <Award size={10} /> BRCGS AA
              </Cert>
            </CertRow>
          </BrandCol>

          <div>
            <ColTitle>Products</ColTitle>
            <Col>
              {productLinks.map(([label, href]) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
            </Col>
          </div>

          <div>
            <ColTitle>Solutions</ColTitle>
            <Col>
              {solutionLinks.map(([label, href]) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
            </Col>
          </div>

          <div>
            <ColTitle>Company</ColTitle>
            <Col>
              {companyLinks.map(([label, href]) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
            </Col>
          </div>
        </Columns>

        <Columns style={{ gridTemplateColumns: '1.1fr 1fr 1fr 1.6fr', paddingTop: 0 }}>
          <ContactLine href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>
            <Phone size={12} /> {contact.phone}
          </ContactLine>
          <ContactLine href={`mailto:${contact.email}`}>
            <Mail size={12} /> {contact.email}
          </ContactLine>
          <ContactLine href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={12} /> WhatsApp us
          </ContactLine>
          <ContactLine as="span">
            <MapPin size={12} /> {contact.address}
          </ContactLine>
        </Columns>

        <Bottom>
          <div>
            <span>© {new Date().getFullYear()} Stark Packmate Private Limited · GSTIN 27AABCS4821F1Z5</span>
          </div>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> {contact.hours}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={10} /> Mumbai · Pune · Chennai
            </span>
            <Link href="/admin">
              Admin demo <ArrowUpRight size={10} />
            </Link>
          </div>
        </Bottom>
      </Container>
    </Foot>
  );
}
