'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  MapPin,
  Mail,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useDemoStore } from '@/store/useDemoStore';
import { colors, fonts, radii, transitions } from '@/lib/theme';
import { Container, Cta } from './ui';

const navItems = [
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Quality', href: '/quality' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const DemoRibbon = styled.div`
  background: ${colors.sidebar};
  color: rgba(249, 246, 238, 0.82);

  .compact {
    display: none;
  }

  @media (max-width: 700px) {
    .full {
      display: none;
    }

    .compact {
      display: inline-flex;
    }

    a {
      display: none;
    }
  }
`;

const RibbonInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 34px;
  padding: 6px 0;
  font-size: 10px;
  letter-spacing: 0.01em;

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${colors.copperSoft};
    box-shadow: 0 0 0 3px rgba(217, 160, 106, 0.15);
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-weight: 700;
    color: ${colors.copperSoft};
    transition: color ${transitions.fast};

    &:hover {
      color: #F3B4B9;
    }
  }
`;

const AnnounceBar = styled.div`
  background: ${colors.forest};
  color: rgba(249, 246, 238, 0.9);
`;

const AnnounceInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 38px;
  padding: 7px 0;
  font-size: 11px;
  text-align: center;

  strong {
    font-weight: 700;
    color: #fff;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${colors.copperSoft};
    font-weight: 700;

    &:hover {
      color: #F3B4B9;
    }
  }
`;

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 70;
  background: rgba(251, 248, 242, 0.93);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid ${({ $scrolled }) => ($scrolled ? colors.line : 'rgba(229, 224, 213, 0.5)')};
  box-shadow: ${({ $scrolled }) => ($scrolled ? '0 8px 28px -22px rgba(16, 35, 29, 0.4)' : 'none')};
  transition: border-color ${transitions.base}, box-shadow ${transitions.base};
`;

const BarInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  height: 68px;

  @media (max-width: 1180px) {
    height: 62px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 22px);

  @media (max-width: 1080px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  position: relative;
  font-size: 11.5px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? colors.forest : colors.muted)};
  padding: 6px 0;
  white-space: nowrap;
  transition: color ${transitions.fast};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.5px;
    background: ${colors.copper};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: left;
    transition: transform ${transitions.base};
  }

  &:hover {
    color: ${colors.ink};

    &::after {
      transform: scaleX(1);
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const PhoneLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 700;
  color: ${colors.inkSoft};
  transition: color ${transitions.fast};

  svg {
    color: ${colors.copper};
  }

  &:hover {
    color: ${colors.forest};
  }

  @media (max-width: 1280px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.line};
  background: #fff;
  color: ${colors.ink};

  @media (max-width: 1080px) {
    display: inline-flex;
  }
`;

const MobilePanel = styled.div`
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  justify-content: flex-end;
  background: rgba(12, 35, 28, 0.44);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity ${transitions.base};

  @media (min-width: 1081px) {
    display: none;
  }
`;

const MobileSheet = styled.div`
  width: min(420px, 90vw);
  height: 100%;
  background: ${colors.cream};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform ${transitions.slow};
  box-shadow: -30px 0 60px rgba(12, 35, 28, 0.2);
`;

const SheetHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.line};
`;

const SheetNav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  flex: 1;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 10px;
    border-bottom: 1px solid ${colors.lineSoft};
    font-size: 14px;
    font-weight: 700;
    color: ${colors.ink};
    transition: color ${transitions.fast};

    svg {
      color: ${colors.faint};
    }

    &:hover,
    &:focus-visible {
      color: ${colors.forest};

      svg {
        color: ${colors.copper};
      }
    }
  }
`;

const SheetFoot = styled.div`
  padding: 18px 20px 24px;
  background: ${colors.paper};
  border-top: 1px solid ${colors.line};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SheetContact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    font-weight: 600;
    color: ${colors.inkSoft};

    svg {
      color: ${colors.copper};
    }
  }
`;

export default function SiteHeader() {
  const pathname = usePathname();
  const announcement = useDemoStore((state) => state.cms.home.announcement);
  const announcementEnabled = useDemoStore((state) => state.cms.home.announcementEnabled);
  const contact = useDemoStore((state) => state.cms.contact);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <DemoRibbon>
        <Container>
          <RibbonInner>
            <span>
              <i />
              <span className="full">Interactive presentation · sample data, live demo actions</span>
              <span className="compact">Demo presentation · sample data</span>
            </span>
          </RibbonInner>
        </Container>
      </DemoRibbon>

      {announcementEnabled && announcement && !announcementDismissed ? (
        <AnnounceBar>
          <Container>
            <AnnounceInner>
              <span>
                <strong>Now booking:</strong> {announcement}
              </span>
              <Link href="/request-a-quote">
                Start an RFQ <ArrowRight size={11} />
              </Link>
            </AnnounceInner>
          </Container>
        </AnnounceBar>
      ) : null}

      <Bar $scrolled={scrolled}>
        <Container>
          <BarInner>
            <Logo />
            <Nav aria-label="Primary navigation">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} $active={isActive(item.href)}>
                  {item.label}
                </NavLink>
              ))}
            </Nav>
            <HeaderActions>
              <PhoneLink href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>
                <Phone size={13} /> {contact.phone}
              </PhoneLink>
              <Cta href="/request-a-quote" variant="primary" size="sm">
                Get a quote <ArrowRight size={13} />
              </Cta>
            </HeaderActions>
            <MenuButton type="button" aria-label="Open navigation menu" aria-expanded={open} onClick={() => setOpen(true)}>
              <Menu size={19} />
            </MenuButton>
          </BarInner>
        </Container>
      </Bar>

      <MobilePanel $open={open} onClick={() => setOpen(false)} aria-hidden={!open} inert={!open}>
        <MobileSheet $open={open} onClick={(event) => event.stopPropagation()} role="dialog" aria-label="Site navigation" aria-modal={open || undefined}>
          <SheetHead>
            <Logo size="sm" />
            <MenuButton type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)}>
              <X size={18} />
            </MenuButton>
          </SheetHead>
          <SheetNav>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label} <ArrowUpRight size={14} />
              </Link>
            ))}
          </SheetNav>
          <SheetFoot>
            <Cta href="/request-a-quote" variant="primary" size="md" onClick={() => setOpen(false)}>
              Request a quote <ArrowRight size={14} />
            </Cta>
            <SheetContact>
              <a href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>
                <Phone size={13} /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`}>
                <Mail size={13} /> {contact.email}
              </a>
              <a href="#site-footer">
                <MapPin size={13} /> {contact.address}
              </a>
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={13} /> Chat on WhatsApp
              </a>
            </SheetContact>
          </SheetFoot>
        </MobileSheet>
      </MobilePanel>
    </>
  );
}
