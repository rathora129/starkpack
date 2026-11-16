'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';
import { FlaskConical, RotateCcw, ShieldAlert } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import GlobalSearch from './GlobalSearch';
import { useUiStore, notify } from '@/store/useUiStore';
import { useDemoStore } from '@/store/useDemoStore';
import { useAuthStore } from '@/store/useAuthStore';
import { canAccess, demoRoleById } from '@/lib/nav';
import { colors, fonts, transitions } from '@/lib/theme';
import { ConfirmDialog } from '@/components/ui/Overlay';
import { ButtonLink } from '@/components/ui/primitives';

const Shell = styled.div`
  min-height: 100vh;
  background: ${colors.cream};
`;

const Main = styled.div`
  margin-left: 268px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 1100px) {
    margin-left: 0;
  }
`;

const DemoBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 26px;
  background: #F4E7D4;
  border-bottom: 1px solid #E9D6BB;
  color: #6B4423;
  font-size: 10.5px;
  line-height: 1.4;

  b {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    padding: 3px 7px;
    border-radius: 4px;
    background: #7C491F;
    color: #FBF3E7;
  }

  p {
    flex: 1;
    min-width: 0;
    color: #7C5B3A;
  }

  @media (max-width: 760px) {
    padding: 8px 14px;

    p {
      font-size: 10px;
    }
  }

  @media (max-width: 560px) {
    align-items: flex-start;

    p span {
      display: none;
    }
  }
`;

const ResetButton = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 9px;
  border-radius: 5px;
  border: 1px solid #D9BE9B;
  background: rgba(255, 255, 255, 0.5);
  color: #7C491F;
  font-family: ${fonts.sans};
  font-size: 9.5px;
  font-weight: 700;
  transition: background ${transitions.fast};

  &:hover {
    background: #fff;
  }
`;

const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1460px;
  padding: 22px 26px 48px;
  animation: starkFadeUp 260ms ease both;

  @media (max-width: 760px) {
    padding: 16px 14px 40px;
  }
`;

const Scrim = styled.div`
  display: none;

  @media (max-width: 1100px) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 70;
    background: rgba(13, 10, 51, 0.55);
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    backdrop-filter: blur(2px);
    transition: opacity 240ms ease;
  }
`;

const Boot = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: ${colors.cream};
  color: ${colors.muted};
  font-family: ${fonts.sans};
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const GateCard = styled.div`
  width: 100%;
  max-width: 430px;
  padding: 30px 26px;
  border: 1px solid ${colors.line};
  border-radius: 16px;
  background: ${colors.surface};
  box-shadow: 0 24px 60px -28px rgba(13, 10, 51, 0.35);
  text-align: center;

  span {
    display: inline-grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: ${colors.warningBg};
    color: ${colors.warning};
    margin-bottom: 14px;
  }

  h1 {
    font-family: ${fonts.display};
    font-size: 24px;
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.65;
    color: ${colors.muted};
  }

  div {
    margin-top: 18px;
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const commandOpen = useUiStore((state) => state.commandOpen);
  const [resetOpen, setResetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!session) router.replace('/workspace-access');
    else if (session.role === 'customer') router.replace('/portal');
  }, [mounted, session, router]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setMobileNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen, setMobileNavOpen]);

  useEffect(() => {
    const onKey = (event) => {
      const target = event.target;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(!useUiStore.getState().commandOpen);
        return;
      }
      if (event.key === '/' && !typing && !useUiStore.getState().commandOpen) {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setCommandOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  const handleReset = () => {
    useDemoStore.getState().resetDemo();
    setResetOpen(false);
    notify('Demo data restored', 'All modules have been reset to the original presentation dataset.', 'success');
  };

  if (!mounted) return <Boot>Loading workspace…</Boot>;
  if (!session) return <Boot>Redirecting to workspace access…</Boot>;
  if (session.role === 'customer') return <Boot>Opening customer portal…</Boot>;

  if (!canAccess(session.role, pathname)) {
    return (
      <Boot>
        <GateCard>
          <span><ShieldAlert size={20} /></span>
          <h1>Not available for this role</h1>
          <p>
            The {demoRoleById(session.role).label} demo role does not include this module. Sign out and
            choose another role to explore it, or return to the role home.
          </p>
          <div>
            <ButtonLink href={demoRoleById(session.role).home} $variant="primary" $size="sm">
              Go to {demoRoleById(session.role).label} home
            </ButtonLink>
            <ButtonLink href="/workspace-access" $variant="light" $size="sm">
              Switch demo role
            </ButtonLink>
          </div>
        </GateCard>
      </Boot>
    );
  }

  return (
    <Shell>
      <Sidebar />
      <Sidebar mobile $open={mobileNavOpen} />
      <Scrim $open={mobileNavOpen} onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
      <Main>
        <Topbar />
        <DemoBar>
          <b>
            <FlaskConical size={10} /> Demo mode
          </b>
          <p>
            Presentation workspace with sample packaging data. Actions are saved in memory only
            <span> and reset when the page is refreshed.</span>
          </p>
          <ResetButton onClick={() => setResetOpen(true)}>
            <RotateCcw size={11} /> Reset demo
          </ResetButton>
        </DemoBar>
        <Content key={pathname}>{children}</Content>
      </Main>
      <GlobalSearch />
      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset demo data?"
        message="Any leads, quotes, orders or edits you added during this session will be discarded and the original presentation dataset restored."
        confirmLabel="Reset everything"
        tone="danger"
      />
    </Shell>
  );
}
