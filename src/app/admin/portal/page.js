'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Copy, ExternalLink, FlaskConical, ShieldAlert, LogIn } from 'lucide-react';
import PortalWorkspace from '@/components/portal/PortalWorkspace';
import { portalDemoAccess, ABC_COMPANY } from '@/data/portal';
import { notify } from '@/store/useUiStore';
import { colors, fonts, radii, shadows } from '@/lib/theme';
import {
  PageHeaderBar,
  PageHeading,
  PageDescription,
  PageActions,
  Button,
  ButtonLink,
  StatusChip,
} from '@/components/ui/primitives';

const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 12px 15px;
  margin-bottom: 16px;
  border: 1px dashed ${colors.copperSoft};
  border-radius: ${radii.md};
  background: ${colors.copperWash};

  svg {
    flex: 0 0 auto;
    margin-top: 2px;
    color: ${colors.copperDeep};
  }

  p {
    font-size: 11.5px;
    line-height: 1.6;
    color: ${colors.inkSoft};
  }

  strong {
    color: ${colors.ink};
  }

  code {
    font-family: ${fonts.mono};
    font-size: 11px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(184, 115, 51, 0.24);
    border-radius: 4px;
    padding: 1px 5px;
  }
`;

const Frame = styled.div`
  border: 1px solid ${colors.line};
  border-radius: ${radii.xl};
  overflow: hidden;
  background: ${colors.cream};
  box-shadow: ${shadows.card};
`;

const BrowserBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 15px;
  background: #EFECE4;
  border-bottom: 1px solid ${colors.line};

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #C9C2B3;
  }
`;

const UrlPill = styled.span`
  margin-left: 6px;
  flex: 1;
  max-width: 420px;
  padding: 4px 11px;
  border-radius: ${radii.pill};
  background: #fff;
  border: 1px solid ${colors.lineSoft};
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function AdminPortalPage() {
  const [fullHref, setFullHref] = useState('/portal');
  const [initialTab, setInitialTab] = useState('overview');

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    const allowed = ['overview', 'rfqs', 'quotations', 'orders', 'artwork', 'invoices', 'profile', 'support'];
    if (tab && allowed.includes(tab)) setInitialTab(tab);
  }, []);

  const copyLink = async () => {
    const href = `${window.location.origin}/portal`;
    setFullHref(href);
    try {
      await navigator.clipboard.writeText(href);
      notify('Portal link copied', 'Share it with the demo customer. The link opens the sign-in screen.', 'success');
    } catch {
      notify('Copy blocked by the browser', 'Open the full portal and copy the address bar instead.', 'warning');
    }
  };

  return (
    <>
      <PageHeaderBar>
        <div>
          <PageHeading>Customer portal</PageHeading>
          <PageDescription>
            The exact workspace {ABC_COMPANY} sees. Every customer action here writes to the same demo records the
            CRM, production, inventory and finance modules read.
          </PageDescription>
        </div>
        <PageActions>
          <Button $variant="secondary" $size="sm" onClick={copyLink}>
            <Copy size={13} /> Copy demo link
          </Button>
          <ButtonLink href="/portal" target="_blank" rel="noopener noreferrer" $variant="primary" $size="sm">
            <ExternalLink size={13} /> Open full portal
          </ButtonLink>
        </PageActions>
      </PageHeaderBar>

      <Notice>
        <ShieldAlert size={16} />
        <p>
          <strong>Preview of a fictional customer workspace.</strong> No authentication is enforced here; the
          customer login is a demo gate at <code>/portal</code> with credentials <code>{portalDemoAccess.email}</code>{' '}
          / <code>{portalDemoAccess.password}</code>. All records are demo data held in browser memory — they are
          not encrypted, production-secure or persistent, and reset on a hard refresh. Signed out?{' '}
          <Link href="/portal" style={{ fontWeight: 700, color: colors.copperDeep }}>
            <LogIn size={11} style={{ verticalAlign: '-1px' }} /> Open the demo login
          </Link>
          .
        </p>
      </Notice>

      <Frame>
        <BrowserBar>
          <i />
          <i />
          <i />
          <UrlPill>{fullHref}</UrlPill>
          <BarRight>
            <StatusChip $tone="warning">
              <FlaskConical size={10} /> Demo preview
            </StatusChip>
          </BarRight>
        </BrowserBar>
        <PortalWorkspace key={initialTab} embedded initialTab={initialTab} />
      </Frame>
    </>
  );
}
