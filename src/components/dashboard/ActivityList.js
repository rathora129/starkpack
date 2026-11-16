'use client';

import styled from 'styled-components';
import { colors, fonts } from '@/lib/theme';
import { timeAgo } from '@/lib/format';

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 11px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:last-child {
    border-bottom: 0;
    padding-bottom: 2px;
  }

  &:first-child {
    padding-top: 2px;
  }
`;

const Initials = styled.span`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $tone }) => $tone || colors.forest};
  color: #F6F6FF;
  font-size: 9.5px;
  font-weight: 700;
  flex: 0 0 auto;
  margin-top: 1px;
`;

const Body = styled.div`
  min-width: 0;
  flex: 1;

  p {
    font-size: 12px;
    color: ${colors.inkSoft};
    line-height: 1.5;

    strong {
      font-weight: 700;
      color: ${colors.ink};
    }
  }

  time {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.faint};
    font-family: ${fonts.sans};
  }
`;

const tones = {
  lead: '#D81E2C',
  production: '#1B1464',
  inventory: '#376C8A',
  finance: '#2E7D5B',
  artwork: '#7C491F',
  logistics: '#5C655F',
  commercial: '#B31420',
};

export default function ActivityList({ items, compact = false }) {
  return (
    <List>
      {items.map((item) => (
        <Item key={item.id} style={compact ? { padding: '10px 0' } : undefined}>
          <Initials $tone={tones[item.tone] || colors.forest}>{item.initials}</Initials>
          <Body>
            <p>
              <strong>{item.name}</strong> {item.action}
            </p>
            <time>{timeAgo(item.time)}</time>
          </Body>
        </Item>
      ))}
    </List>
  );
}
