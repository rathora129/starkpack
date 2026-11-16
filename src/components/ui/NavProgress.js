'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { colors } from '@/lib/theme';

const Bar = styled.div`
  position: fixed;
  inset: 0 auto auto 0;
  height: 2.5px;
  z-index: 3000;
  pointer-events: none;
  background: linear-gradient(90deg, ${colors.copper}, ${colors.forest});
  box-shadow: 0 0 10px rgba(216, 30, 44, 0.35);
  width: ${({ $done }) => ($done ? '100%' : '78%')};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: width ${({ $done }) => ($done ? '160ms' : '520ms')} ease, opacity 240ms ease 90ms;
`;

export function NavProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;
      const next = new URL(href, window.location.href);
      if (next.pathname === window.location.pathname && next.search === window.location.search) return;
      activeRef.current = true;
      setDone(false);
      setActive(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    const failsafe = setTimeout(() => {
      setActive(false);
      setDone(false);
    }, 4000);
    return () => clearTimeout(failsafe);
  }, [active]);

  useEffect(() => {
    if (!activeRef.current) return undefined;
    activeRef.current = false;
    setDone(true);
    const timer = setTimeout(() => {
      setActive(false);
      setDone(false);
    }, 320);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <Bar aria-hidden="true" $visible={active} $done={done} />;
}
