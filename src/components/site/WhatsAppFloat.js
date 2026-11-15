'use client';

import styled from 'styled-components';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useDemoStore } from '@/store/useDemoStore';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';

const Wrap = styled.div`
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 600px) {
    right: 16px;
    bottom: 16px;
  }
`;

const Bubble = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  border-radius: ${radii.md};
  background: #fff;
  border: 1px solid ${colors.lineSoft};
  box-shadow: ${shadows.lift};
  max-width: 230px;

  p {
    font-size: 10.5px;
    font-weight: 600;
    color: ${colors.inkSoft};
    line-height: 1.45;
  }

  small {
    display: block;
    font-size: 9px;
    color: ${colors.faint};
    font-weight: 500;
    margin-top: 1px;
  }

  button {
    position: absolute;
    top: 4px;
    right: 4px;
    border: 0;
    background: transparent;
    color: ${colors.faint};
    padding: 2px;
    display: grid;
    place-items: center;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const Float = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 48px;
  padding: 0 16px;
  border-radius: ${radii.pill};
  background: #1F7A54;
  color: #fff;
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: 700;
  box-shadow: 0 14px 30px -12px rgba(16, 55, 39, 0.55);
  transition: transform ${transitions.fast}, background ${transitions.fast};

  svg {
    flex: 0 0 auto;
  }

  &:hover {
    background: #17613F;
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 50%;

    span {
      display: none;
    }
  }
`;

export default function WhatsAppFloat() {
  const whatsapp = useDemoStore((state) => state.settings.whatsapp);
  const [dismissed, setDismissed] = useState(false);

  if (!whatsapp.enabled || !whatsapp.showOnWebsite) return null;

  const href = `https://wa.me/${String(whatsapp.number).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    whatsapp.message || 'Hi Stark Packmate, I would like to discuss a packaging requirement.'
  )}`;

  return (
    <Wrap>
      {!dismissed ? (
        <Bubble>
          <div>
            <p>Need packaging advice?</p>
            <small>Chat with a consultant on WhatsApp</small>
          </div>
          <button type="button" aria-label="Dismiss WhatsApp prompt" onClick={() => setDismissed(true)}>
            <X size={12} />
          </button>
        </Bubble>
      ) : null}
      <Float href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <MessageCircle size={18} />
        <span>WhatsApp</span>
      </Float>
    </Wrap>
  );
}
