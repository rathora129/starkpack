import {
  overviewMetrics,
  secondaryMetrics,
  revenueSeries,
  revenueMix,
  leadSources,
  productionSeries,
  financeSeries,
  qualitySeries,
  activityFeed,
  inventory,
  reportLibrary,
  scheduledReports,
  customers,
} from '@/data/admin';

const wait = (ms = 420) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchOverview() {
  await wait(460);
  const lowStock = inventory
    .filter((item) => item.onHand - item.allocated < item.reorder)
    .sort((a, b) => a.onHand - a.allocated - (b.onHand - b.allocated))
    .slice(0, 4);
  return {
    metrics: overviewMetrics,
    secondary: secondaryMetrics,
    revenueSeries,
    revenueMix,
    leadSources,
    productionSeries,
    financeSeries,
    qualitySeries,
    activity: activityFeed,
    lowStock,
    accountManagers: customers.slice(0, 4),
    generatedAt: new Date().toISOString(),
  };
}

export async function fetchReports(range = '30d') {
  await wait(380);
  return {
    range,
    revenueSeries,
    productionSeries,
    qualitySeries,
    leadSources,
    financeSeries,
    library: reportLibrary,
    scheduled: scheduledReports,
    generatedAt: new Date().toISOString(),
  };
}

export const queryKeys = {
  overview: ['dashboard-overview'],
  reports: (range) => ['reports', range],
};
