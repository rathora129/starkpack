'use client';

import styled from 'styled-components';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { colors, fonts, radii } from '@/lib/theme';
import { formatValue } from '@/lib/format';
import { MiniSparkline } from '@/components/ui/charts';

const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 17px 18px 15px;
  background: ${colors.surface};
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.lg};
  box-shadow: ${({ $accent }) => ($accent ? '0 22px 44px -34px rgba(11, 42, 34, 0.55)' : '0 1px 2px rgba(16, 35, 29, 0.04)')};
  overflow: hidden;

  ${({ $accent }) =>
    $accent
      ? `background: linear-gradient(160deg, #143D31 0%, #0C231C 100%); border-color: #0C231C;`
      : ''}
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const Label = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: ${({ $accent }) => ($accent ? 'rgba(249, 246, 238, 0.55)' : colors.faint)};
  line-height: 1.4;
`;

const IconTile = styled.span`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  flex: 0 0 auto;
  background: ${({ $accent }) => ($accent ? 'rgba(217, 160, 106, 0.14)' : colors.mist)};
  color: ${({ $accent }) => ($accent ? colors.copperSoft : colors.inkSoft)};
`;

const ValueRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
`;

const Value = styled.p`
  font-family: ${fonts.display};
  font-size: ${({ $small }) => ($small ? '23px' : '28px')};
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
  color: ${({ $accent }) => ($accent ? '#FBF8F2' : colors.ink)};
  font-variant-numeric: tabular-nums;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: -6px;

  span {
    font-size: 10.5px;
    color: ${({ $accent }) => ($accent ? 'rgba(249, 246, 238, 0.5)' : colors.faint)};
    line-height: 1.4;
  }
`;

const Delta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  background: ${({ $good }) => ($good ? 'rgba(46, 125, 91, 0.11)' : 'rgba(176, 71, 47, 0.11)')};
  color: ${({ $good }) => ($good ? '#23724F' : '#A33F29')};
`;

export default function KpiCard({
  label,
  value,
  format = 'number',
  delta,
  trend,
  hint,
  icon: Icon,
  spark,
  accent = false,
  small = false,
  onClick,
}) {
  const good = trend ? trend === 'up' : Number(delta) >= 0;
  return (
    <Card $accent={accent} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <Head>
        <Label $accent={accent}>{label}</Label>
        {Icon ? (
          <IconTile $accent={accent}>
            <Icon size={15} strokeWidth={1.8} />
          </IconTile>
        ) : null}
      </Head>
      <ValueRow>
        <Value $accent={accent} $small={small}>
          {formatValue(value, format)}
        </Value>
        {spark ? (
          <MiniSparkline
            data={spark}
            width={76}
            height={30}
            color={accent ? colors.copperSoft : colors.forest}
            id={label.replace(/\s+/g, '-')}
          />
        ) : null}
      </ValueRow>
      <Meta $accent={accent}>
        {typeof delta === 'number' ? (
          <Delta $good={good}>
            {good ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(delta)}%
          </Delta>
        ) : null}
        {hint ? <span>{hint}</span> : null}
      </Meta>
    </Card>
  );
}
