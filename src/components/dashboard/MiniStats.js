'use client';

import styled from 'styled-components';
import { colors, fonts, radii } from '@/lib/theme';

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 4}, minmax(0, 1fr));
  background: ${colors.surface};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.lg};
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div`
  padding: 14px 18px;
  border-right: 1px solid ${colors.lineSoft};

  &:last-child {
    border-right: 0;
  }

  @media (max-width: 900px) {
    &:nth-child(2n) {
      border-right: 0;
    }
  }

  @media (max-width: 480px) {
    border-right: 0;
    border-bottom: 1px solid ${colors.lineSoft};

    &:last-child {
      border-bottom: 0;
    }
  }

  span {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 5px;
    font-family: ${fonts.display};
    font-size: 19px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${({ $tone }) =>
      $tone === 'danger' ? colors.danger : $tone === 'warning' ? colors.warning : colors.ink};
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  em {
    display: block;
    font-style: normal;
    margin-top: 3px;
    font-size: 10px;
    color: ${colors.faint};
  }
`;

export default function MiniStats({ items, cols }) {
  return (
    <Strip $cols={cols || items.length}>
      {items.map((item) => (
        <Cell key={item.label} $tone={item.tone}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          {item.hint ? <em>{item.hint}</em> : null}
        </Cell>
      ))}
    </Strip>
  );
}
