'use client';

import { useId } from 'react';
import styled from 'styled-components';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ComposedChart,
} from 'recharts';
import { colors, fonts, chartPalette } from '@/lib/theme';

const TooltipBox = styled.div`
  background: #0E241D;
  color: #F6F6FF;
  border-radius: 9px;
  padding: 9px 12px;
  box-shadow: 0 14px 30px -14px rgba(0, 0, 0, 0.5);
  font-family: ${fonts.sans};
  min-width: 120px;

  p {
    margin: 0;
    font-size: 11px;
    color: rgba(249, 246, 238, 0.62);
    margin-bottom: 4px;
    font-weight: 600;
  }

  strong {
    display: block;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.7;
  }

  i {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }
`;

const ChartCanvas = styled.div`
  width: 100%;
  height: ${({ $h }) => $h}px;
  min-width: 0;

  .recharts-cartesian-axis-tick-value {
    font-family: ${fonts.sans};
    font-size: 10.5px;
    fill: ${colors.faint};
  }

  .recharts-legend-item-text {
    font-family: ${fonts.sans};
    font-size: 11px !important;
    color: ${colors.muted} !important;
  }

  .recharts-surface {
    overflow: visible;
  }
`;

function ChartTip({ active, payload, label, formatter, prefix = '' }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <TooltipBox>
      <p>{label}</p>
      {payload.map((entry) => (
        <strong key={entry.dataKey || entry.name}>
          <i style={{ background: entry.color || entry.payload?.fill || colors.copper }} />
          {entry.name}: {formatter ? formatter(entry.value) : `${prefix}${entry.value}`}
        </strong>
      ))}
    </TooltipBox>
  );
}

export function TrendChart({
  data,
  xKey = 'month',
  series = [],
  height = 280,
  formatter,
  yFormatter,
  yDomain,
  showLegend = false,
}) {
  return (
    <ChartCanvas $h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            {series.map((s, index) => (
              <linearGradient key={s.key} id={`grad-${s.key}-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color || chartPalette[index]} stopOpacity={0.22} />
                <stop offset="100%" stopColor={s.color || chartPalette[index]} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="#EFEBE2" strokeDasharray="3 5" vertical={false} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} dy={8} minTickGap={18} />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={48}
            domain={yDomain}
            tickFormatter={yFormatter || ((value) => value)}
          />
          <Tooltip
            content={<ChartTip formatter={formatter} prefix="₹" />}
            cursor={{ stroke: '#CFC9BB', strokeDasharray: '3 4' }}
          />
          {showLegend ? <Legend iconType="circle" iconSize={7} wrapperStyle={{ paddingTop: 10 }} /> : null}
          {series.map((s, index) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color || chartPalette[index]}
              strokeWidth={s.width || 2}
              strokeDasharray={s.dashed ? '5 4' : undefined}
              fill={`url(#grad-${s.key}-${index})`}
              activeDot={{ r: 4, strokeWidth: 0 }}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCanvas>
  );
}

export function BarsChart({
  data,
  xKey = 'month',
  series = [],
  height = 280,
  formatter,
  stacked = false,
  yFormatter,
}) {
  return (
    <ChartCanvas $h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barGap={4}>
          <CartesianGrid stroke="#EFEBE2" strokeDasharray="3 5" vertical={false} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} dy={8} minTickGap={18} />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={yFormatter || ((value) => value)}
          />
          <Tooltip content={<ChartTip formatter={formatter} />} cursor={{ fill: 'rgba(16,35,29,0.04)' }} />
          {series.map((s, index) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId={stacked ? 'a' : undefined}
              fill={s.color || chartPalette[index]}
              radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              maxBarSize={s.maxBarSize || 26}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCanvas>
  );
}

export function ComboChart({ data, xKey = 'month', bars = [], lines = [], height = 280, formatter }) {
  return (
    <ChartCanvas $h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#EFEBE2" strokeDasharray="3 5" vertical={false} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} dy={8} minTickGap={18} />
          <YAxis axisLine={false} tickLine={false} width={46} />
          <Tooltip content={<ChartTip formatter={formatter} />} cursor={{ fill: 'rgba(16,35,29,0.04)' }} />
          {bars.map((s, index) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color || chartPalette[index]}
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
          ))}
          {lines.map((s, index) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color || chartPalette[index + 1]}
              strokeWidth={2}
              dot={{ r: 2.5, strokeWidth: 0, fill: s.color || chartPalette[index + 1] }}
              activeDot={{ r: 4, fill: s.color || chartPalette[index + 1] }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCanvas>
  );
}

export function DonutChart({ data, height = 250, colors: colorList = chartPalette, centerLabel, centerValue, showLegend = true, formatter }) {
  const total = data.reduce((sum, item) => sum + Number(item.value), 0);
  return (
    <div>
      <DonutWrap $h={height}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="86%"
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={entry.color || colorList[index % colorList.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0];
                const percent = total ? Math.round((item.value / total) * 100) : 0;
                return (
                  <TooltipBox>
                    <p>{item.name}</p>
                    <strong>
                      <i style={{ background: item.payload.fill }} />
                      {formatter ? formatter(item.value) : `${item.value}%`} · {percent}% of mix
                    </strong>
                  </TooltipBox>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerValue ? (
          <Center>
            <strong>{centerValue}</strong>
            <span>{centerLabel}</span>
          </Center>
        ) : null}
      </DonutWrap>
      {showLegend ? (
        <LegendGrid>
          {data.map((item, index) => (
            <LegendRow key={item.name}>
              <LegendDot style={{ background: item.color || colorList[index % colorList.length] }} />
              <LegendName>{item.name}</LegendName>
              <LegendValue>{formatter ? formatter(item.value) : `${item.value}%`}</LegendValue>
            </LegendRow>
          ))}
        </LegendGrid>
      ) : null}
    </div>
  );
}

const DonutWrap = styled.div`
  position: relative;
  width: 100%;
  height: ${({ $h }) => $h}px;
`;

const Center = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  strong {
    font-family: ${fonts.display};
    font-size: 23px;
    font-weight: 500;
    color: ${colors.ink};
    line-height: 1.1;
  }

  span {
    font-size: 10px;
    color: ${colors.muted};
    margin-top: 3px;
    text-align: center;
    max-width: 110px;
    line-height: 1.4;
  }
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px 14px;
  margin-top: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
`;

const LegendDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex: 0 0 auto;
`;

const LegendName = styled.span`
  font-size: 10.5px;
  color: ${colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const LegendValue = styled.span`
  font-size: 10.5px;
  font-weight: 700;
  color: ${colors.inkSoft};
`;

export function MiniSparkline({ data, color = colors.forest, width = 96, height = 34, id }) {
  const generatedId = useId();
  const gradientId = `spark-${id || generatedId.replace(/:/g, '')}`;
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((value, index) => [index * step, height - ((value - min) / span) * (height - 5) - 2]);
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.4" fill={color} />
    </svg>
  );
}

export function SimpleLineChart({ data, xKey = 'month', series = [], height = 260 }) {
  return (
    <ChartCanvas $h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#EFEBE2" strokeDasharray="3 5" vertical={false} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} dy={8} minTickGap={18} />
          <YAxis axisLine={false} tickLine={false} width={44} />
          <Tooltip content={<ChartTip />} cursor={{ stroke: '#CFC9BB', strokeDasharray: '3 4' }} />
          {series.map((s, index) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color || chartPalette[index]}
              strokeWidth={2}
              dot={{ r: 2.5, strokeWidth: 0, fill: s.color || chartPalette[index] }}
              activeDot={{ r: 4, fill: s.color || chartPalette[index] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCanvas>
  );
}

export function RadialGauge({ value, label, color = colors.forest, size = 132 }) {
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, value) / 100) * circumference;
  return (
    <GaugeWrap $size={size}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EFECE4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <GaugeLabel>
        <strong>{Math.round(value)}%</strong>
        <span>{label}</span>
      </GaugeLabel>
    </GaugeWrap>
  );
}

const GaugeWrap = styled.div`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex: 0 0 auto;
`;

const GaugeLabel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  strong {
    font-family: ${fonts.sans};
    font-size: 21px;
    font-weight: 800;
    color: ${colors.ink};
    letter-spacing: -0.03em;
  }

  span {
    font-size: 9.5px;
    color: ${colors.muted};
    margin-top: 1px;
    text-align: center;
    max-width: 80px;
    line-height: 1.3;
  }
`;
