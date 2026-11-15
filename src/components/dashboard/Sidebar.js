'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Globe, X } from 'lucide-react';
import { adminNav } from '@/lib/nav';
import { colors, fonts, transitions } from '@/lib/theme';
import { useDemoStore } from '@/store/useDemoStore';
import { useUiStore } from '@/store/useUiStore';
import Logo from '@/components/brand/Logo';

const Aside = styled.aside`
  position: fixed;
  inset: 0 auto 0 0;
  width: 268px;
  background: ${colors.sidebar};
  display: flex;
  flex-direction: column;
  z-index: 40;
  border-right: 1px solid rgba(255, 255, 255, 0.04);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(600px 260px at 0% 0%, rgba(184, 115, 51, 0.08), transparent 70%);
  }

  @media (max-width: 1100px) {
    display: ${({ $mobile }) => ($mobile ? 'flex' : 'none')};
    width: 282px;
    z-index: 80;
    transform: translateX(${({ $open }) => ($open ? '0' : '-105%')});
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), visibility 260ms;
    box-shadow: 30px 0 80px -20px rgba(0, 0, 0, 0.6);
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 20px 18px;
  position: relative;
  z-index: 1;
`;

const CloseMobile = styled.button`
  display: none;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.65);

  @media (max-width: 1100px) {
    display: grid;
  }
`;

const Workspace = styled.div`
  position: relative;
  z-index: 1;
  margin: 0 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 11px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.035);
`;

const WorkspaceAvatar = styled.span`
  width: 31px;
  height: 31px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: ${colors.copper};
  color: #2C1708;
  font-size: 10.5px;
  font-weight: 800;
  flex: 0 0 auto;
`;

const WorkspaceText = styled.div`
  min-width: 0;
  flex: 1;

  strong {
    display: block;
    color: rgba(249, 246, 238, 0.9);
    font-size: 11.5px;
    font-weight: 700;
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    color: rgba(249, 246, 238, 0.4);
    font-size: 9.5px;
    margin-top: 1px;
  }
`;

const PlanChip = styled.span`
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: ${colors.copperSoft};
  border: 1px solid rgba(217, 160, 106, 0.3);
  border-radius: 4px;
  padding: 2px 5px;
  flex: 0 0 auto;
`;

const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 18px;
  position: relative;
  z-index: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.12) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border: 0;
  }
`;

const Group = styled.div`
  margin-top: 16px;

  &:first-child {
    margin-top: 4px;
  }
`;

const GroupLabel = styled.p`
  padding: 0 12px 7px;
  font-family: ${fonts.sans};
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  color: rgba(249, 246, 238, 0.32);
`;

const NavLink = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8.5px 12px;
  margin-bottom: 1px;
  border-radius: 8px;
  color: ${({ $active }) => ($active ? '#FBF8F2' : 'rgba(249, 246, 238, 0.58)')};
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.075)' : 'transparent')};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  line-height: 1.3;
  transition: background ${transitions.fast}, color ${transitions.fast};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 2px;
    border-radius: 0 2px 2px 0;
    background: ${colors.copper};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: opacity ${transitions.fast};
  }

  svg {
    flex: 0 0 auto;
    opacity: ${({ $active }) => ($active ? 1 : 0.75)};
    color: ${({ $active }) => ($active ? colors.copperSoft : 'currentColor')};
  }

  span {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.055);
    color: #FBF8F2;
  }
`;

const Count = styled.span`
  min-width: 19px;
  height: 17px;
  padding: 0 5px;
  border-radius: 5px;
  display: grid;
  place-items: center;
  background: rgba(184, 115, 51, 0.16);
  color: ${colors.copperSoft};
  font-size: 9px;
  font-weight: 700;
  flex: 0 0 auto;
`;

const Foot = styled.div`
  position: relative;
  z-index: 1;
  padding: 13px 16px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const SiteLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 8px;
  color: rgba(249, 246, 238, 0.62);
  font-size: 11px;
  font-weight: 600;
  transition: background ${transitions.fast}, color ${transitions.fast};

  svg:last-child {
    margin-left: auto;
    opacity: 0.5;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #FBF8F2;
  }
`;

const Version = styled.p`
  font-size: 8.5px;
  color: rgba(249, 246, 238, 0.27);
  padding: 8px 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${colors.copperSoft};
    display: inline-block;
    margin-right: 5px;
  }
`;

export default function Sidebar({ mobile = false, $open = false }) {
  const pathname = usePathname();
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const newLeads = useDemoStore((state) => state.leads.filter((lead) => lead.stage === 'New').length);
  const openQuotes = useDemoStore(
    (state) => state.quotes.filter((quote) => ['Sent', 'Negotiation'].includes(quote.status)).length
  );
  const pendingArtwork = useDemoStore(
    (state) => state.artwork.filter((job) => job.status !== 'Approved').length
  );
  const lowStock = useDemoStore(
    (state) => state.inventory.filter((item) => item.onHand - item.allocated < item.reorder).length
  );

  const badgeFor = (key) => {
    if (key === 'leads') return newLeads;
    if (key === 'quotes') return openQuotes;
    if (key === 'artwork') return pendingArtwork;
    if (key === 'stock') return lowStock;
    return null;
  };

  return (
    <Aside $mobile={mobile} $open={$open}>
      <Top>
        <Logo inverse href="/admin" />
        {mobile ? (
          <CloseMobile onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
            <X size={15} />
          </CloseMobile>
        ) : null}
      </Top>
      <Workspace>
        <WorkspaceAvatar>SP</WorkspaceAvatar>
        <WorkspaceText>
          <strong>Stark Packmate</strong>
          <span>Enterprise workspace</span>
        </WorkspaceText>
        <PlanChip>DEMO</PlanChip>
      </Workspace>
      <Nav>
        {adminNav.map((group) => (
          <Group key={group.group}>
            <GroupLabel>{group.group}</GroupLabel>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const count = item.badge ? badgeFor(item.badge) : 0;
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  $active={active}
                  onClick={() => setMobileNavOpen(false)}
                >
                  <Icon size={16} strokeWidth={1.9} />
                  <span>{item.label}</span>
                  {count ? <Count>{count}</Count> : null}
                </NavLink>
              );
            })}
          </Group>
        ))}
      </Nav>
      <Foot>
        <SiteLink href="/" target="_blank" rel="noopener noreferrer">
          <Globe size={14} />
          <span>View public website</span>
          <ArrowUpRight size={13} />
        </SiteLink>
        <Version>
          <span>
            <i /> Demo environment
          </span>
          v1.0
        </Version>
      </Foot>
    </Aside>
  );
}
