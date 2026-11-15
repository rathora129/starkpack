'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Wallet,
  FileText,
  ShoppingCart,
  Clock,
  ArrowRight,
  Download,
  Plus,
  ContactRound,
  Factory,
  Boxes,
  Receipt,
  Check,
  Circle,
  Sparkles,
  ChevronRight,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import { ABC_CAMPAIGN_ID, ABC_COMPANY, ABC_CUSTOMER_ID } from '@/data/portal';
import { fetchOverview, queryKeys } from '@/lib/api';
import {
  formatCompactINR,
  formatINR,
  formatNumber,
  formatDate,
  downloadCSV,
  timeAgo,
} from '@/lib/format';
import { colors, fonts, radii, shadows } from '@/lib/theme';
import {
  PageHeaderBar,
  PageHeading,
  PageDescription,
  PageActions,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelSubtitle,
  PanelBody,
  PanelFooter,
  Button,
  ButtonLink,
  Skeleton,
  StatusChip,
  ProgressTrack,
  ProgressFill,
  Grid,
  TextLink,
  Kbd,
} from '@/components/ui/primitives';
import { Segmented, QuickSelect } from '@/components/ui/Controls';
import { TrendChart, DonutChart, BarsChart, RadialGauge } from '@/components/ui/charts';
import KpiCard from '@/components/dashboard/KpiCard';
import ActivityList from '@/components/dashboard/ActivityList';

const iconById = { wallet: Wallet, file: FileText, cart: ShoppingCart, clock: Clock };

const Split = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
  gap: 18px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const Triple = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const Greeting = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
  }
`;

const ChartTools = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const LegendNote = styled.p`
  font-size: 10.5px;
  color: ${colors.faint};
  padding: 0 22px 14px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;

  i {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    margin-right: 5px;
  }
`;

const StageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const StageRow = styled.div`
  display: grid;
  grid-template-columns: 88px 1fr 66px;
  align-items: center;
  gap: 10px;

  p {
    font-size: 11.5px;
    font-weight: 600;
    color: ${colors.inkSoft};
  }

  em {
    font-style: normal;
    font-size: 10.5px;
    color: ${colors.faint};
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

const TaskRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:last-of-type {
    border-bottom: 0;
  }
`;

const TaskCheck = styled.button`
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border-radius: 5px;
  border: 1.5px solid ${({ $done }) => ($done ? colors.forest : '#CFC9BB')};
  background: ${({ $done }) => ($done ? colors.forest : '#fff')};
  color: #fff;
  flex: 0 0 auto;
  margin-top: 1px;
`;

const TaskTitle = styled.div`
  flex: 1;
  min-width: 0;

  p {
    font-size: 11.5px;
    color: ${({ $done }) => ($done ? colors.faint : colors.inkSoft)};
    text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
    line-height: 1.4;
  }

  span {
    font-size: 9.5px;
    color: ${colors.faint};
    margin-top: 2px;
    display: flex;
    gap: 7px;
  }
`;

const AddTask = styled.form`
  display: flex;
  gap: 6px;
  margin-top: 11px;

  input {
    flex: 1;
    min-width: 0;
    height: 32px;
    border: 1px solid ${colors.line};
    border-radius: 7px;
    padding: 0 10px;
    font-size: 11.5px;
    font-family: ${fonts.sans};
    color: ${colors.ink};
    outline: none;

    &:focus {
      border-color: ${colors.forest};
    }
  }

  button {
    height: 32px;
    padding: 0 10px;
    border-radius: 7px;
    border: 1px solid ${colors.forest};
    background: ${colors.forest};
    color: #fff;
    font-size: 11px;
    font-weight: 700;
  }
`;

const LowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.lineSoft};

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: 0;
  }
`;

const LowName = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    color: ${colors.ink};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    font-size: 9.5px;
    color: ${colors.faint};
  }
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
`;

const Quick = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 13px;
  border-radius: ${radii.md};
  border: 1px solid ${colors.lineSoft};
  background: ${colors.cream};
  transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;

  svg {
    color: ${colors.copperDeep};
  }

  strong {
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.35;
  }

  span {
    font-size: 9.5px;
    color: ${colors.faint};
    line-height: 1.4;
  }

  &:hover {
    background: #fff;
    border-color: #D3CEC1;
    transform: translateY(-1px);
  }
`;

const GaugeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 14px;
`;

const GaugeText = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 16px;
    font-weight: 500;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.45;
  }
`;

const SparkNote = styled.p`
  font-size: 10px;
  color: ${colors.faint};
  line-height: 1.45;
  padding-top: 3px;
`;

const PulsePanel = styled(Panel)`
  padding: 0;
  overflow: hidden;
  border-color: #E3D6C2;
`;

const PulseHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 20px;
  background: linear-gradient(115deg, #FFFDF8 0%, ${colors.copperWash} 100%);
  border-bottom: 1px solid #EADFCE;

  small {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
    margin-bottom: 5px;
  }

  h3 {
    font-family: ${fonts.display};
    font-size: 18px;
    font-weight: 500;
    color: ${colors.ink};
  }

  p {
    margin-top: 4px;
    font-size: 11.5px;
    color: ${colors.muted};
    line-height: 1.5;
    max-width: 68ch;
  }
`;

const PulseActions = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
`;

const PulseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  background: #fff;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const PulseCell = styled(Link)`
  display: block;
  padding: 15px 18px;
  border-right: 1px solid ${colors.lineSoft};
  border-bottom: 1px solid ${colors.lineSoft};
  transition: background 140ms ease;

  &:hover {
    background: #FBFAF6;
  }

  span {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 6px;
    font-family: ${fonts.display};
    font-size: 22px;
    font-weight: 500;
    color: ${colors.ink};
    letter-spacing: -0.01em;
  }

  em {
    display: block;
    margin-top: 3px;
    font-style: normal;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.4;
  }
`;

function OverviewSkeleton() {
  return (
    <>
      <Grid $cols="repeat(4, minmax(0, 1fr))">
        {[0, 1, 2, 3].map((n) => (
          <Panel key={n} style={{ padding: 18 }}>
            <Skeleton $w="50%" $h="10px" />
            <div style={{ height: 14 }} />
            <Skeleton $w="70%" $h="26px" />
            <div style={{ height: 12 }} />
            <Skeleton $w="40%" $h="9px" />
          </Panel>
        ))}
      </Grid>
      <div style={{ height: 18 }} />
      <Split>
        <Panel style={{ padding: 22 }}>
          <Skeleton $w="32%" $h="14px" />
          <div style={{ height: 20 }} />
          <Skeleton $h="260px" />
        </Panel>
        <Panel style={{ padding: 22 }}>
          <Skeleton $w="55%" $h="14px" />
          <div style={{ height: 20 }} />
          <Skeleton $h="200px" />
        </Panel>
      </Split>
    </>
  );
}

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.overview,
    queryFn: fetchOverview,
  });
  const [chartView, setChartView] = useState('revenue');
  const [range, setRange] = useState('12');
  const [taskDraft, setTaskDraft] = useState('');

  const tasks = useDemoStore((state) => state.tasks);
  const toggleTask = useDemoStore((state) => state.toggleTask);
  const addTask = useDemoStore((state) => state.addTask);
  const revenueSeries = useDemoStore((state) => state.quotes);
  const allOrders = useDemoStore((state) => state.orders);
  const allInvoices = useDemoStore((state) => state.invoices);
  const allArtwork = useDemoStore((state) => state.artwork);
  const allProductionJobs = useDemoStore((state) => state.production);
  const allCampaignExpenses = useDemoStore((state) => state.campaignExpenses);

  const abcPulse = useMemo(() => {
    const orders = allOrders.filter((order) => order.customerId === ABC_CUSTOMER_ID);
    const orderIds = new Set(orders.map((order) => order.id));
    const invoices = allInvoices.filter(
      (invoice) => invoice.customerId === ABC_CUSTOMER_ID || orderIds.has(invoice.orderId)
    );
    const artwork = allArtwork.filter((item) => orderIds.has(item.orderId));
    const jobs = allProductionJobs.filter((job) => orderIds.has(job.orderId));
    const booked = orders.reduce((total, order) => total + (Number(order.value) || 0), 0);
    const campaignOrders = allOrders.filter(
      (order) => order.campaignId === ABC_CAMPAIGN_ID && order.status !== 'On hold'
    );
    const attributed = campaignOrders.reduce((total, order) => total + (Number(order.value) || 0), 0);
    const receipts = invoices.reduce((total, invoice) => total + (Number(invoice.paid) || 0), 0);
    const receivable = invoices.reduce(
      (total, invoice) => total + Math.max(0, (Number(invoice.amount) || 0) - (Number(invoice.paid) || 0)),
      0
    );
    const proofsAwaiting = artwork.filter(
      (item) => item.status !== 'Approved' && item.status !== 'Awaiting file' && item.proofStatus !== 'Approved'
    ).length;
    const spend = allCampaignExpenses
      .filter((expense) => expense.campaignId === ABC_CAMPAIGN_ID)
      .reduce((total, expense) => total + (Number(expense.amount) || 0), 0);
    const activeJob = jobs.find((job) => !['Pending', 'Dispatch'].includes(job.stage)) || jobs[0];

    return {
      orders,
      campaignOrders,
      invoices,
      artwork,
      jobs,
      booked,
      attributed,
      receipts,
      receivable,
      proofsAwaiting,
      spend,
      activeJob,
    };
  }, [allOrders, allInvoices, allArtwork, allProductionJobs, allCampaignExpenses]);

  const series = useMemo(() => {
    if (!data) return [];
    const months = Number(range);
    return data.revenueSeries.slice(-months);
  }, [data, range]);

  const openTasks = tasks.filter((task) => !task.done).length;
  const hour = new Date().getHours();
  const salutation = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const openPipeline = revenueSeries
    .filter((quote) => ['Sent', 'Negotiation'].includes(quote.status))
    .reduce((sum, quote) => sum + quote.total, 0);

  const exportSummary = () => {
    if (!data) return;
    downloadCSV(
      'stark-packmate-overview.csv',
      ['Month', 'Revenue (₹L)', 'Target (₹L)', 'Orders'],
      data.revenueSeries.map((row) => [row.month, row.revenue, row.target, row.orders])
    );
    notify('Summary exported', 'Overview metrics downloaded as CSV for the demo session.', 'success');
  };

  const submitTask = (event) => {
    event.preventDefault();
    const title = taskDraft.trim();
    if (!title) return;
    addTask(title);
    setTaskDraft('');
    notify('Task added', `“${title}” is now on the workspace list.`, 'success');
  };

  return (
    <div>
      <PageHeaderBar>
        <div>
          <Greeting>
            <span>{formatDate(new Date())} · Mumbai</span>
            <StatusChip $tone="success">All plants running</StatusChip>
          </Greeting>
          <PageHeading>{salutation}, Aarav.</PageHeading>
          <PageDescription>
            Here is how Stark Packmate is tracking today — commercial pipeline, plant output and
            cash health across all three facilities.
          </PageDescription>
        </div>
        <PageActions>
          <QuickSelect
            label="Reporting period"
            value={range}
            onChange={setRange}
            options={[
              { value: '3', label: 'Last 3 months' },
              { value: '6', label: 'Last 6 months' },
              { value: '12', label: 'Last 12 months' },
            ]}
          />
          <Button $variant="light" $size="sm" onClick={exportSummary} disabled={!data}>
            <Download size={14} /> Export
          </Button>
          <ButtonLink href="/admin/quotations?new=1" $variant="primary" $size="sm">
            <Plus size={14} /> New quotation
          </ButtonLink>
        </PageActions>
      </PageHeaderBar>

      {isLoading || !data ? (
        <OverviewSkeleton />
      ) : (
        <>
          <Grid $cols="repeat(4, minmax(0, 1fr))">
            {data.metrics.map((metric, index) => (
              <KpiCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                format={metric.format}
                delta={metric.delta}
                trend={metric.trend}
                hint={metric.hint}
                icon={iconById[metric.icon]}
                spark={metric.spark}
                accent={index === 0}
              />
            ))}
          </Grid>

          <div style={{ height: 18 }} />

          <PulsePanel>
            <PulseHead>
              <div>
                <small>
                  <Sparkles size={11} /> Connected demo account
                </small>
                <h3>{ABC_COMPANY} · {ABC_CUSTOMER_ID}</h3>
                <p>
                  These figures are computed live from the same demo records the customer portal writes to. Portal
                  actions — RFQs, quote acceptance, proof approval, repeat orders and payments — update this panel,
                  CRM, production, inventory and finance together.
                </p>
              </div>
              <PulseActions>
                <StatusChip $tone={abcPulse.proofsAwaiting ? 'warning' : 'success'}>
                  <ShieldCheck size={11} /> {abcPulse.proofsAwaiting} proof{abcPulse.proofsAwaiting === 1 ? '' : 's'} awaiting
                </StatusChip>
                <ButtonLink href="/admin/portal" $variant="secondary" $size="sm">
                  Open portal preview <ArrowRight size={13} />
                </ButtonLink>
              </PulseActions>
            </PulseHead>
            <PulseGrid>
              <PulseCell href="/admin/orders">
                <span>
                  <ShoppingCart size={11} /> Booked order value
                </span>
                <strong>{formatINR(abcPulse.booked)}</strong>
                <em>{abcPulse.orders.length} order{abcPulse.orders.length === 1 ? '' : 's'} · not pipeline</em>
              </PulseCell>
              <PulseCell href="/admin/finance">
                <span>
                  <Wallet size={11} /> Customer receipts
                </span>
                <strong>{formatINR(abcPulse.receipts)}</strong>
                <em>Payments recorded against invoices</em>
              </PulseCell>
              <PulseCell href="/admin/finance">
                <span>
                  <Receipt size={11} /> Receivables
                </span>
                <strong>{formatINR(abcPulse.receivable)}</strong>
                <em>{abcPulse.invoices.filter((invoice) => invoice.status !== 'Paid').length} open invoice(s)</em>
              </PulseCell>
              <PulseCell href="/admin/prepress">
                <span>
                  <Palette size={11} /> Proofs awaiting
                </span>
                <strong>{abcPulse.proofsAwaiting}</strong>
                <em>{abcPulse.activeJob ? `${abcPulse.activeJob.id} at ${abcPulse.activeJob.stage}` : 'No active job'}</em>
              </PulseCell>
              <PulseCell href="/admin/marketing">
                <span>
                  <Factory size={11} /> Campaign attributed revenue
                </span>
                <strong>{formatCompactINR(abcPulse.attributed)}</strong>
                <em>
                  {ABC_CAMPAIGN_ID} · {formatCompactINR(abcPulse.spend)} spend · {abcPulse.campaignOrders.length} orders,
                  all customers
                </em>
              </PulseCell>
            </PulseGrid>
          </PulsePanel>

          <Split>
            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>{chartView === 'revenue' ? 'Revenue against target' : 'Order volume'}</PanelTitle>
                  <PanelSubtitle>
                    {chartView === 'revenue'
                      ? 'Billed revenue in ₹ lakh, November to date.'
                      : 'Orders booked per month across all business units.'}
                  </PanelSubtitle>
                </div>
                <ChartTools>
                  <Segmented
                    value={chartView}
                    onChange={setChartView}
                    options={[
                      { value: 'revenue', label: 'Revenue' },
                      { value: 'orders', label: 'Orders' },
                    ]}
                  />
                </ChartTools>
              </PanelHeader>
              <PanelBody>
                {chartView === 'revenue' ? (
                  <TrendChart
                    data={series}
                    height={272}
                    series={[
                      { key: 'revenue', label: 'Revenue', color: colors.forest },
                      { key: 'target', label: 'Target', color: colors.copper, dashed: true },
                    ]}
                    formatter={(value) => `₹${value}L`}
                    yFormatter={(value) => `${value}L`}
                    showLegend
                  />
                ) : (
                  <BarsChart
                    data={series}
                    height={272}
                    series={[{ key: 'orders', label: 'Orders', color: colors.forestSoft }]}
                    formatter={(value) => `${value} orders`}
                  />
                )}
              </PanelBody>
              <LegendNote>
                <span>
                  <i style={{ background: colors.forest }} /> Billed revenue
                </span>
                <span>
                  <i style={{ background: colors.copper }} /> Monthly target
                </span>
                <span style={{ marginLeft: 'auto' }}>
                  MTD attainment <strong style={{ color: colors.forest }}>102.2%</strong>
                </span>
              </LegendNote>
            </Panel>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Revenue by product family</PanelTitle>
                  <PanelSubtitle>Share of ₹1.84 Cr billed this month.</PanelSubtitle>
                </div>
              </PanelHeader>
              <PanelBody>
                <DonutChart
                  data={data.revenueMix}
                  height={206}
                  centerValue="₹1.84 Cr"
                  centerLabel="November billed"
                />
              </PanelBody>
            </Panel>
          </Split>

          <div style={{ height: 18 }} />

          <Triple>
            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Plant output vs plan</PanelTitle>
                  <PanelSubtitle>Million boxes per month.</PanelSubtitle>
                </div>
              </PanelHeader>
              <PanelBody>
                <TrendChart
                  data={data.productionSeries}
                  height={196}
                  series={[
                    { key: 'output', label: 'Output', color: colors.forest },
                    { key: 'plan', label: 'Plan', color: '#CFC9BB', dashed: true },
                  ]}
                  formatter={(value) => `${value}M boxes`}
                  yFormatter={(value) => `${value}M`}
                />
                <SparkNote>October was the first month above 10M boxes. Line 3 added a night shift from 1 November.</SparkNote>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Sales pipeline</PanelTitle>
                  <PanelSubtitle>{formatCompactINR(openPipeline)} in open quotations.</PanelSubtitle>
                </div>
                <Link href="/admin/leads">
                  <TextLink as="span" style={{ fontSize: 11 }}>
                    View <ChevronRight size={12} />
                  </TextLink>
                </Link>
              </PanelHeader>
              <PanelBody>
                <StageList>
                  {data.revenueSeries &&
                    [
                      { stage: 'New', count: 28, value: 2140000, pct: 22 },
                      { stage: 'Contacted', count: 19, value: 1860000, pct: 36 },
                      { stage: 'Qualified', count: 14, value: 3240000, pct: 58 },
                      { stage: 'Proposal', count: 9, value: 2880000, pct: 78 },
                      { stage: 'Won', count: 6, value: 1460000, pct: 100 },
                    ].map((stage) => (
                      <StageRow key={stage.stage}>
                        <p>{stage.stage}</p>
                        <ProgressTrack>
                          <ProgressFill
                            $value={stage.pct}
                            $tone={stage.stage === 'Won' ? 'success' : undefined}
                          />
                        </ProgressTrack>
                        <em>{formatCompactINR(stage.value)}</em>
                      </StageRow>
                    ))}
                </StageList>
              </PanelBody>
              <PanelFooter>
                <span style={{ fontSize: 10.5, color: colors.faint }}>
                  Win rate <strong style={{ color: colors.ink }}>31.4%</strong> · avg cycle 18 days
                </span>
                <Link href="/admin/quotations">
                  <TextLink as="span" style={{ fontSize: 11 }}>
                    Quotations <ArrowRight size={12} />
                  </TextLink>
                </Link>
              </PanelFooter>
            </Panel>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Today’s focus</PanelTitle>
                  <PanelSubtitle>{openTasks} open tasks across the team.</PanelSubtitle>
                </div>
                <Kbd>T</Kbd>
              </PanelHeader>
              <PanelBody>
                {tasks.map((task) => (
                  <TaskRow key={task.id}>
                    <TaskCheck
                      $done={task.done}
                      onClick={() => toggleTask(task.id)}
                      aria-label={task.done ? `Mark ${task.title} as open` : `Complete ${task.title}`}
                    >
                      {task.done ? <Check size={11} strokeWidth={3} /> : <Circle size={8} style={{ opacity: 0 }} />}
                    </TaskCheck>
                    <TaskTitle $done={task.done}>
                      <p>{task.title}</p>
                      <span>
                        {task.due} · {task.priority} priority
                      </span>
                    </TaskTitle>
                  </TaskRow>
                ))}
                <AddTask onSubmit={submitTask}>
                  <input
                    value={taskDraft}
                    onChange={(event) => setTaskDraft(event.target.value)}
                    placeholder="Add a task…"
                    aria-label="New task"
                  />
                  <button type="submit">Add</button>
                </AddTask>
              </PanelBody>
            </Panel>
          </Triple>

          <div style={{ height: 18 }} />

          <Triple>
            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Cash position</PanelTitle>
                  <PanelSubtitle>₹64.2L receivables · ₹8.6L overdue.</PanelSubtitle>
                </div>
                <StatusChip $tone="warning">Watch</StatusChip>
              </PanelHeader>
              <PanelBody>
                <GaugeWrap>
                  <RadialGauge value={86} label="Collected" size={104} />
                  <GaugeText>
                    <strong>₹55.4L collected</strong>
                    <span>86% of November billings cleared. Three invoices need follow-up this week.</span>
                  </GaugeText>
                </GaugeWrap>
                <StageList style={{ gap: 10 }}>
                  {[
                    { label: 'Current', value: 3420000, pct: 53 },
                    { label: '1–30 days', value: 1860000, pct: 29 },
                    { label: '31–60 days', value: 740000, pct: 12 },
                    { label: '90+ days', value: 380000, pct: 6 },
                  ].map((bucket) => (
                    <StageRow key={bucket.label}>
                      <p>{bucket.label}</p>
                      <ProgressTrack>
                        <ProgressFill
                          $value={bucket.pct}
                          $tone={bucket.label === '90+ days' ? 'danger' : bucket.label === '31–60 days' ? 'warning' : undefined}
                        />
                      </ProgressTrack>
                      <em>{formatCompactINR(bucket.value)}</em>
                    </StageRow>
                  ))}
                </StageList>
              </PanelBody>
              <PanelFooter>
                <Link href="/admin/finance">
                  <TextLink as="span" style={{ fontSize: 11 }}>
                    Open finance <ArrowRight size={12} />
                  </TextLink>
                </Link>
                <span style={{ fontSize: 10.5, color: colors.faint }}>DSO 38 days</span>
              </PanelFooter>
            </Panel>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Low stock alerts</PanelTitle>
                  <PanelSubtitle>4 SKUs below reorder level.</PanelSubtitle>
                </div>
                <Link href="/admin/inventory">
                  <TextLink as="span" style={{ fontSize: 11 }}>
                    Inventory <ChevronRight size={12} />
                  </TextLink>
                </Link>
              </PanelHeader>
              <PanelBody>
                {data.lowStock.map((item) => {
                  const available = item.onHand - item.allocated;
                  return (
                    <LowRow key={item.id}>
                      <LowName>
                        <strong>{item.name}</strong>
                        <span>
                          {item.warehouse} · reorder at {formatNumber(item.reorder)} {item.unit}
                        </span>
                      </LowName>
                      <StatusChip $tone={available <= 0 ? 'danger' : 'warning'}>
                        {formatNumber(available)} {item.unit}
                      </StatusChip>
                    </LowRow>
                  );
                })}
              </PanelBody>
              <PanelFooter>
                <span style={{ fontSize: 10.5, color: colors.faint }}>
                  Supplier lead times 4–9 days
                </span>
                <Link href="/admin/purchasing">
                  <TextLink as="span" style={{ fontSize: 11 }}>
                    Raise PO <ArrowRight size={12} />
                  </TextLink>
                </Link>
              </PanelFooter>
            </Panel>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Team activity</PanelTitle>
                  <PanelSubtitle>Live across sales, plant and finance.</PanelSubtitle>
                </div>
              </PanelHeader>
              <PanelBody>
                <ActivityList items={data.activity.slice(0, 5)} compact />
              </PanelBody>
              <PanelFooter>
                <span style={{ fontSize: 10.5, color: colors.faint }}>
                  {formatNumber(data.secondary?.[3]?.value || 28)} new leads this week
                </span>
                <Link href="/admin/leads">
                  <TextLink as="span" style={{ fontSize: 11 }}>
                    CRM <ArrowRight size={12} />
                  </TextLink>
                </Link>
              </PanelFooter>
            </Panel>
          </Triple>

          <div style={{ height: 18 }} />

          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Jump back in</PanelTitle>
                <PanelSubtitle>Frequent workflows for the leadership team.</PanelSubtitle>
              </div>
              <Sparkles size={16} style={{ color: colors.copper }} />
            </PanelHeader>
            <PanelBody>
              <QuickGrid>
                <Quick href="/admin/leads?new=1">
                  <ContactRound size={17} />
                  <strong>Log a new lead</strong>
                  <span>Capture an enquiry and assign an owner.</span>
                </Quick>
                <Quick href="/admin/production">
                  <Factory size={17} />
                  <strong>Move a production job</strong>
                  <span>Update press, die-cutting and dispatch stages.</span>
                </Quick>
                <Quick href="/admin/inventory?adjust=1">
                  <Boxes size={17} />
                  <strong>Adjust stock</strong>
                  <span>Record receipts, issues and reconciliation.</span>
                </Quick>
                <Quick href="/admin/finance">
                  <Receipt size={17} />
                  <strong>Record a payment</strong>
                  <span>Update receivables against an invoice.</span>
                </Quick>
              </QuickGrid>
            </PanelBody>
          </Panel>
        </>
      )}
    </div>
  );
}
