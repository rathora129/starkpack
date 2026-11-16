'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { X, AlertTriangle } from 'lucide-react';
import { colors, fonts, radii, shadows } from '@/lib/theme';
import { Button } from './primitives';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const drawerIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1500;
  background: rgba(8, 22, 17, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  animation: ${fadeIn} 160ms ease;
  overflow-y: auto;

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

const ModalPanel = styled.div`
  width: 100%;
  max-width: ${({ $size }) =>
    $size === 'sm' ? '430px' : $size === 'lg' ? '760px' : $size === 'xl' ? '980px' : '590px'};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: ${colors.surface};
  border-radius: ${radii.lg};
  box-shadow: 0 40px 100px -30px rgba(6, 20, 15, 0.55);
  animation: ${modalIn} 220ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  @media (max-width: 640px) {
    max-height: 92vh;
  }
`;

const DrawerPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${({ $width }) => $width || '560px'};
  max-width: 100vw;
  background: ${colors.surface};
  box-shadow: -30px 0 80px -30px rgba(6, 20, 15, 0.4);
  animation: ${drawerIn} 260ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  z-index: 1401;
`;

const DrawerOverlay = styled(Overlay)`
  z-index: 1400;
  justify-content: flex-end;
  padding: 0;
  align-items: stretch;

  @media (max-width: 640px) {
    padding: 0;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 24px 17px;
  border-bottom: 1px solid ${colors.lineSoft};
  flex: 0 0 auto;
`;

const HeadText = styled.div`
  min-width: 0;
`;

const Title = styled.h3`
  font-family: ${fonts.sans};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${colors.ink};
  line-height: 1.3;
`;

const Description = styled.p`
  margin-top: 4px;
  font-size: 12px;
  color: ${colors.muted};
  line-height: 1.5;
`;

const CloseButton = styled.button`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: ${radii.xs};
  border: 0;
  background: ${colors.mist};
  color: ${colors.muted};
  transition: background 140ms ease, color 140ms ease;

  &:hover {
    background: #E9E5DC;
    color: ${colors.ink};
  }
`;

const Body = styled.div`
  padding: ${({ $flush }) => ($flush ? '0' : '22px 24px')};
  overflow-y: auto;
  flex: 1;
`;

const Foot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  flex-wrap: wrap;
  padding: 15px 24px;
  border-top: 1px solid ${colors.lineSoft};
  background: #FCFBF8;
  flex: 0 0 auto;
`;

function useLockBody(open) {
  useEffect(() => {
    if (!open) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);
}

function useEscape(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function useFocusTrap(open, ref) {
  useEffect(() => {
    if (!open) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const previous = document.activeElement;
    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const timer = setTimeout(() => {
      const first = node.querySelector(selector);
      (first || node).focus?.();
    }, 0);
    const onKey = (event) => {
      if (event.key !== 'Tab') return;
      const items = [...node.querySelectorAll(selector)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      node.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, ref]);
}

export function AppModal({ open, onClose, title, description, children, footer, size = 'md', flush = false }) {
  const mounted = useMounted();
  const panelRef = useRef(null);
  useLockBody(open);
  useEscape(open, onClose);
  useFocusTrap(open, panelRef);
  if (!mounted || !open) return null;
  return createPortal(
    <Overlay
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <ModalPanel ref={panelRef} $size={size} role="dialog" aria-modal="true" aria-label={title || 'Dialog'} tabIndex={-1}>
        <Head>
          <HeadText>
            {title ? <Title>{title}</Title> : null}
            {description ? <Description>{description}</Description> : null}
          </HeadText>
          <CloseButton onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </CloseButton>
        </Head>
        <Body $flush={flush}>{children}</Body>
        {footer ? <Foot>{footer}</Foot> : null}
      </ModalPanel>
    </Overlay>,
    document.body
  );
}

export function Drawer({ open, onClose, title, description, children, footer, width = '560px' }) {
  const mounted = useMounted();
  const panelRef = useRef(null);
  useLockBody(open);
  useEscape(open, onClose);
  useFocusTrap(open, panelRef);
  if (!mounted || !open) return null;
  return createPortal(
    <DrawerOverlay
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <DrawerPanel ref={panelRef} $width={width} role="dialog" aria-modal="true" aria-label={title || 'Details'} tabIndex={-1}>
        <Head>
          <HeadText>
            {title ? <Title>{title}</Title> : null}
            {description ? <Description>{description}</Description> : null}
          </HeadText>
          <CloseButton onClick={onClose} aria-label="Close panel">
            <X size={16} />
          </CloseButton>
        </Head>
        <Body>{children}</Body>
        {footer ? <Foot>{footer}</Foot> : null}
      </DrawerPanel>
    </DrawerOverlay>,
    document.body
  );
}

const ConfirmIcon = styled.div`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${colors.dangerBg};
  color: ${colors.danger};
  margin-bottom: 14px;
`;

const ConfirmText = styled.p`
  font-size: 13px;
  color: ${colors.muted};
  line-height: 1.6;
`;

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action will update the demo data.',
  confirmLabel = 'Confirm',
  tone = 'danger',
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button $variant="secondary" $size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            $variant={tone === 'danger' ? 'danger' : 'primary'}
            $size="sm"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <ConfirmIcon>
        <AlertTriangle size={20} />
      </ConfirmIcon>
      <ConfirmText>{message}</ConfirmText>
    </AppModal>
  );
}

export const ModalSection = styled.div`
  & + & {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${colors.lineSoft};
  }
`;

export const ModalSectionTitle = styled.h4`
  font-family: ${fonts.sans};
  font-size: 12px;
  font-weight: 700;
  color: ${colors.ink};
  margin-bottom: 10px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  min-width: 0;
`;

export const DetailLabel = styled.p`
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${colors.faint};
  margin-bottom: 3px;
`;

export const DetailValue = styled.p`
  font-size: 12.5px;
  color: ${colors.ink};
  line-height: 1.5;
  word-break: break-word;
`;

export const Timeline = styled.ol`
  position: relative;
  list-style: none;
  padding-left: 20px;
  margin: 0;

  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 4px;
    bottom: 4px;
    width: 1px;
    background: ${colors.line};
  }
`;

export const TimelineItem = styled.li`
  position: relative;
  padding-bottom: 16px;

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 4px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ $active }) => ($active ? colors.copper : colors.line)};
    border: 2px solid ${colors.surface};
    box-shadow: 0 0 0 1px ${({ $active }) => ($active ? colors.copper : colors.line)};
  }
`;

export const TimelineTitle = styled.p`
  font-size: 12.5px;
  font-weight: 700;
  color: ${colors.ink};
  line-height: 1.4;
`;

export const TimelineMeta = styled.p`
  font-size: 11px;
  color: ${colors.faint};
  margin-top: 2px;
`;

export const DrawerSummary = styled.div`
  background: ${colors.cream};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  padding: 16px;
  box-shadow: ${shadows.xs};
`;
