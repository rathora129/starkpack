'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Tooltip,
} from '@heroui/react';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Command,
  ContactRound,
  Factory,
  Boxes,
  PenTool,
  Truck,
  Wallet,
  ExternalLink,
  LogOut,
  Settings2,
  UserRound,
  Menu,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { adminNav, findAdminPage } from '@/lib/nav';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import { useDemoStore } from '@/store/useDemoStore';
import { useUiStore, notify } from '@/store/useUiStore';
import { currentUser } from '@/data/admin';
import { timeAgo } from '@/lib/format';
import { Kbd } from '@/components/ui/primitives';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 66px;
  padding: 0 26px;
  background: rgba(251, 248, 242, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${colors.lineSoft};

  @media (max-width: 1100px) {
    padding: 0 18px;
  }

  @media (max-width: 640px) {
    padding: 0 14px;
    gap: 10px;
  }
`;

const MenuButton = styled.button`
  display: none;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.line};
  background: #fff;
  color: ${colors.ink};
  flex: 0 0 auto;

  @media (max-width: 1100px) {
    display: grid;
  }
`;

const CrumbBar = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  flex: 1;
  font-size: 11.5px;
  color: ${colors.faint};
  white-space: nowrap;
  overflow: hidden;
`;

const CrumbHome = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${colors.muted};
  font-weight: 600;
  transition: color ${transitions.fast};

  &:hover {
    color: ${colors.ink};
  }

  @media (max-width: 640px) {
    span {
      display: none;
    }
  }
`;

const CrumbGroup = styled.span`
  color: ${colors.faint};

  @media (max-width: 900px) {
    display: none;
  }
`;

const CrumbCurrent = styled.strong`
  color: ${colors.ink};
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 0 0 auto;
`;

const SearchTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 250px;
  height: 36px;
  padding: 0 9px 0 11px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.sm};
  background: #fff;
  color: ${colors.faint};
  font-size: 11.5px;
  text-align: left;
  transition: border-color ${transitions.fast}, box-shadow ${transitions.fast};

  span {
    flex: 1;
  }

  &:hover {
    border-color: #C8C2B4;
    box-shadow: ${shadows.xs};
  }

  @media (max-width: 1240px) {
    width: 40px;
    padding: 0;
    justify-content: center;

    span,
    kbd {
      display: none;
    }
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const DemoPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 8px;
  border: 1px solid #E5CBA8;
  background: #FBF1E3;
  border-radius: 999px;
  color: ${colors.copperDeep};
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.11em;

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${colors.copper};
    animation: starkPulse 2.4s ease-in-out infinite;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const BellButton = styled.button`
  position: relative;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.line};
  background: #fff;
  color: ${colors.inkSoft};
  transition: background ${transitions.fast};

  &:hover {
    background: ${colors.cream};
  }

  .dot {
    position: absolute;
    top: 6px;
    right: 6px;
    min-width: 13px;
    height: 13px;
    padding: 0 3px;
    border-radius: 999px;
    background: ${colors.danger};
    border: 1.5px solid #fff;
    color: #fff;
    font-size: 7.5px;
    font-weight: 800;
    display: grid;
    place-items: center;
    line-height: 1;
  }
`;

const SiteButton = styled(Link)`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.line};
  background: #fff;
  color: ${colors.inkSoft};
  transition: background ${transitions.fast};

  &:hover {
    background: ${colors.cream};
  }

  @media (max-width: 780px) {
    display: none;
  }
`;

const ProfileTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 6px 0 4px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  transition: background ${transitions.fast}, border-color ${transitions.fast};

  &:hover {
    background: #fff;
    border-color: ${colors.line};
  }

  @media (max-width: 900px) {
    .profile-text,
    .profile-chevron {
      display: none;
    }
  }
`;

const ProfileText = styled.span`
  text-align: left;
  line-height: 1.2;

  strong {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 9px;
    color: ${colors.faint};
    margin-top: 1px;
  }
`;

const NotifWrap = styled.div`
  position: relative;
`;

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 9px);
  right: 0;
  width: 380px;
  max-height: min(540px, calc(100vh - 100px));
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid ${colors.line};
  border-radius: ${radii.md};
  box-shadow: 0 28px 70px -30px rgba(15, 35, 27, 0.45);
  overflow: hidden;
  z-index: 60;

  @media (max-width: 520px) {
    position: fixed;
    top: 62px;
    left: 10px;
    right: 10px;
    width: auto;
  }
`;

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid ${colors.lineSoft};

  strong {
    font-family: ${fonts.sans};
    font-size: 12.5px;
    font-weight: 700;
    color: ${colors.ink};
  }
`;

const MarkAll = styled.button`
  border: 0;
  background: transparent;
  color: ${colors.forest};
  font-size: 10px;
  font-weight: 700;
  padding: 3px 0;

  &:hover {
    text-decoration: underline;
  }
`;

const PanelList = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const NotifItem = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px 16px;
  border: 0;
  border-bottom: 1px solid ${colors.lineSoft};
  background: ${({ $unread }) => ($unread ? '#FCFAF4' : '#fff')};
  text-align: left;
  transition: background ${transitions.fast};

  &:hover {
    background: ${colors.cream};
  }
`;

const NotifIcon = styled.span`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${colors.mist};
  color: ${colors.inkSoft};
  flex: 0 0 auto;
`;

const NotifBody = styled.span`
  min-width: 0;
  flex: 1;

  strong {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.4;
  }

  em {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${colors.copper};
    flex: 0 0 auto;
  }

  p {
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
    margin-top: 2px;
  }

  time {
    display: block;
    font-size: 9.5px;
    color: ${colors.faint};
    margin-top: 4px;
  }
`;

const PanelFoot = styled.div`
  padding: 9px 16px;
  border-top: 1px solid ${colors.lineSoft};
  background: #FCFBF8;
  font-size: 9.5px;
  color: ${colors.faint};
  text-align: center;
`;

const iconByType = {
  lead: ContactRound,
  inventory: Boxes,
  artwork: PenTool,
  purchase: Truck,
  finance: Wallet,
  production: Factory,
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const notifications = useDemoStore((state) => state.notifications);
  const markNotificationRead = useDemoStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useDemoStore((state) => state.markAllNotificationsRead);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const page = findAdminPage(pathname);
  const group = adminNav.find((entry) => entry.items.some((item) => item.href === page.href))?.group;
  const unread = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    setNotifOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!notifOpen) return undefined;
    const onPointer = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setNotifOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [notifOpen]);

  return (
    <Header>
      <MenuButton onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
        <Menu size={18} />
      </MenuButton>
      <CrumbBar aria-label="Breadcrumb">
        <CrumbHome href="/admin">
          <LayoutGrid size={13} />
          <span>Admin</span>
        </CrumbHome>
        <ChevronRight size={11} />
        {group ? (
          <>
            <CrumbGroup>{group}</CrumbGroup>
            <ChevronRight size={11} />
          </>
        ) : null}
        <CrumbCurrent>{page.label}</CrumbCurrent>
      </CrumbBar>

      <Actions>
        <DemoPill title="Demo workspace · sample data resets when you refresh">
          <i />
          DEMO
        </DemoPill>
        <SearchTrigger onClick={() => setCommandOpen(true)} aria-label="Open global search">
          <Search size={14} />
          <span>Search anything…</span>
          <Kbd>
            <Command size={8} style={{ marginRight: 1 }} />K
          </Kbd>
        </SearchTrigger>
        <Tooltip content="Public website">
          <SiteButton href="/" target="_blank" rel="noopener noreferrer" aria-label="Open public website">
            <ExternalLink size={15} />
          </SiteButton>
        </Tooltip>
        <NotifWrap ref={notifRef}>
          <Tooltip content="Notifications">
            <BellButton
              onClick={() => setNotifOpen((open) => !open)}
              aria-label={`Notifications, ${unread} unread`}
              aria-expanded={notifOpen}
            >
              <Bell size={16} />
              {unread > 0 ? <span className="dot">{unread}</span> : null}
            </BellButton>
          </Tooltip>
          {notifOpen ? (
            <Panel role="dialog" aria-label="Notifications">
              <PanelHead>
                <strong>
                  Notifications {unread ? <span style={{ color: colors.copperDeep }}>({unread})</span> : null}
                </strong>
                <MarkAll onClick={markAllNotificationsRead}>Mark all read</MarkAll>
              </PanelHead>
              <PanelList>
                {notifications.slice(0, 8).map((item) => {
                  const Icon = iconByType[item.type] || Bell;
                  return (
                    <NotifItem
                      key={item.id}
                      $unread={!item.read}
                      onClick={() => {
                        markNotificationRead(item.id);
                        setNotifOpen(false);
                        router.push(item.href);
                      }}
                    >
                      <NotifIcon>
                        <Icon size={14} />
                      </NotifIcon>
                      <NotifBody>
                        <strong>
                          {!item.read ? <em /> : null}
                          {item.title}
                        </strong>
                        <p>{item.body}</p>
                        <time>{timeAgo(item.time)}</time>
                      </NotifBody>
                    </NotifItem>
                  );
                })}
              </PanelList>
              <PanelFoot>Demo notifications · click any item to jump to its module</PanelFoot>
            </Panel>
          ) : null}
        </NotifWrap>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <ProfileTrigger aria-label="Open profile menu">
              <Avatar name={currentUser.initials} size="sm" className="h-8 w-8 shrink-0 bg-[#17493B] text-[10px] font-bold text-white" />
              <ProfileText className="profile-text">
                <strong>{currentUser.name}</strong>
                <span>{currentUser.role}</span>
              </ProfileText>
              <ChevronDown size={13} className="profile-chevron" style={{ color: colors.faint }} />
            </ProfileTrigger>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile menu"
            className="min-w-[220px] border border-[#E5E0D5] bg-white p-1"
            itemClasses={{ base: 'rounded-md data-[hover=true]:bg-[#F6F4EE] py-2', title: 'text-[12px]' }}
          >
            <DropdownItem
              key="profile"
              startContent={<UserRound size={14} />}
              onPress={() => router.push('/admin/settings')}
            >
              Profile & settings
            </DropdownItem>
            <DropdownItem
              key="preferences"
              startContent={<Settings2 size={14} />}
              onPress={() => router.push('/admin/settings?tab=notifications')}
            >
              Notification preferences
            </DropdownItem>
            <DropdownItem
              key="portal"
              startContent={<ExternalLink size={14} />}
              onPress={() => router.push('/admin/portal')}
            >
              Preview customer portal
            </DropdownItem>
            <DropdownItem
              key="signout"
              startContent={<LogOut size={14} />}
              className="text-[#B0472F]"
              color="danger"
              onPress={() =>
                notify('Demo session', 'Sign-out is disabled in this presentation demo.', 'info')
              }
            >
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Actions>
    </Header>
  );
}
