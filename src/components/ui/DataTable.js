'use client';

import styled from 'styled-components';
import { Inbox } from 'lucide-react';
import { colors, fonts } from '@/lib/theme';
import { EmptyState } from './primitives';

const Wrap = styled.div`
  width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
`;

const Table = styled.table`
  width: 100%;
  min-width: ${({ $minWidth }) => $minWidth || '720px'};
  border-collapse: collapse;
  font-family: ${fonts.sans};
`;

const Thead = styled.thead`
  background: #FBFAF6;
`;

const Th = styled.th`
  padding: 11px 16px;
  text-align: ${({ $align }) => $align || 'left'};
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${colors.faint};
  border-bottom: 1px solid ${colors.lineSoft};
  white-space: nowrap;
`;

const Tr = styled.tr`
  ${({ $clickable }) =>
    $clickable
      ? `
        cursor: pointer;
        &:hover { background: #FBFAF6; }
        &:focus-visible { outline: 2px solid ${colors.copper}; outline-offset: -2px; }
      `
      : ''}
`;

const Tbody = styled.tbody`
  tr:last-child td {
    border-bottom: 0;
  }
`;

const Td = styled.td`
  padding: ${({ $dense }) => ($dense ? '10px 16px' : '13px 16px')};
  border-bottom: 1px solid ${colors.lineSoft};
  font-size: 12.5px;
  color: ${colors.inkSoft};
  text-align: ${({ $align }) => $align || 'left'};
  vertical-align: middle;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 13px 16px;
  border-top: 1px solid ${colors.lineSoft};
  font-size: 11.5px;
  color: ${colors.muted};
`;

export function DataTable({
  columns,
  rows,
  onRowClick,
  minWidth = '760px',
  dense = false,
  footer,
  emptyTitle = 'Nothing here yet',
  emptyHint = 'New records will appear here as your team works.',
}) {
  return (
    <div>
      <Wrap>
        <Table $minWidth={minWidth}>
          <Thead>
            <tr>
              {columns.map((column) => (
                <Th key={column.key} $align={column.align} style={{ width: column.width }}>
                  {column.label}
                </Th>
              ))}
            </tr>
          </Thead>
          <Tbody>
            {rows.map((row, rowIndex) => (
              <Tr
                key={row.id || row.key || rowIndex}
                $clickable={Boolean(onRowClick)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
              >
                {columns.map((column) => (
                  <Td key={column.key} $align={column.align} $dense={dense}>
                    {column.render ? column.render(row, rowIndex) : row[column.key]}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Wrap>
      {rows.length === 0 ? (
        <EmptyState>
          <Inbox size={28} />
          <strong>{emptyTitle}</strong>
          <p>{emptyHint}</p>
        </EmptyState>
      ) : null}
      {footer ? <Footer>{footer}</Footer> : null}
    </div>
  );
}

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
`;

export const CellPrimary = styled.div`
  font-weight: 700;
  color: ${colors.ink};
  font-size: 12.5px;
  line-height: 1.35;
`;

export const CellSecondary = styled.div`
  font-size: 11px;
  color: ${colors.faint};
  line-height: 1.4;
  margin-top: 1px;
`;

export const CellStrong = styled.span`
  font-family: ${fonts.sans};
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${colors.ink};
`;

export const CellMuted = styled.span`
  color: ${colors.faint};
  font-size: 11.5px;
`;
