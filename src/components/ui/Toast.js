'use client';

import styled, { keyframes } from 'styled-components';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
import { colors, fonts, radii, shadows } from '@/lib/theme';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Stack = styled.div`
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(380px, calc(100vw - 32px));
  pointer-events: none;

  @media (max-width: 640px) {
    right: 16px;
    bottom: 16px;
  }
`;

const toneMap = {
  success: { accent: colors.success, bg: colors.successBg, Icon: CheckCircle2 },
  warning: { accent: colors.warning, bg: colors.warningBg, Icon: AlertTriangle },
  danger: { accent: colors.danger, bg: colors.dangerBg, Icon: AlertTriangle },
  info: { accent: colors.info, bg: colors.infoBg, Icon: Info },
};

const ToastCard = styled.div`
  pointer-events: auto;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 14px 14px 15px;
  background: ${colors.surface};
  border: 1px solid ${colors.line};
  border-left: 3px solid ${(p) => (toneMap[p.$tone] || toneMap.success).accent};
  border-radius: ${radii.md};
  box-shadow: ${shadows.lift};
  animation: ${slideIn} 240ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const IconWrap = styled.span`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(p) => (toneMap[p.$tone] || toneMap.success).bg};
  color: ${(p) => (toneMap[p.$tone] || toneMap.success).accent};
  flex: 0 0 auto;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.p`
  font-family: ${fonts.sans};
  font-size: 13.5px;
  font-weight: 700;
  color: ${colors.ink};
  line-height: 1.35;
`;

const ToastMessage = styled.p`
  margin-top: 2px;
  font-size: 12.5px;
  color: ${colors.muted};
  line-height: 1.45;
`;

const Dismiss = styled.button`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  border-radius: 6px;
  color: ${colors.faint};
  transition: background 140ms ease, color 140ms ease;

  &:hover {
    background: ${colors.mist};
    color: ${colors.ink};
  }
`;

export function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts);
  const dismissToast = useUiStore((state) => state.dismissToast);

  return (
    <Stack aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const tone = toneMap[toast.tone] || toneMap.success;
        const Icon = tone.Icon;
        return (
          <ToastCard key={toast.id} $tone={toast.tone}>
            <IconWrap $tone={toast.tone}>
              <Icon size={16} strokeWidth={2.2} />
            </IconWrap>
            <Body>
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.message ? <ToastMessage>{toast.message}</ToastMessage> : null}
            </Body>
            <Dismiss aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}>
              <X size={14} />
            </Dismiss>
          </ToastCard>
        );
      })}
    </Stack>
  );
}
