'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PortalLogin from '@/components/portal/PortalLogin';
import PortalWorkspace from '@/components/portal/PortalWorkspace';
import { PORTAL_SESSION_KEY } from '@/data/portal';
import { colors, fonts } from '@/lib/theme';

const Boot = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: ${colors.cream};
  font-family: ${fonts.sans};
  color: ${colors.muted};
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export default function PortalPage() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    try {
      setSignedIn(Boolean(window.sessionStorage.getItem(PORTAL_SESSION_KEY)));
    } catch {
      setSignedIn(false);
    }
    setReady(true);
  }, []);

  const signOut = () => {
    try {
      window.sessionStorage.removeItem(PORTAL_SESSION_KEY);
    } catch {
      /* ignore blocked storage */
    }
    setSignedIn(false);
  };

  if (!ready) return <Boot>Loading demo portal…</Boot>;
  if (!signedIn) return <PortalLogin onSignedIn={() => setSignedIn(true)} />;

  return <PortalWorkspace onSignOut={signOut} />;
}
