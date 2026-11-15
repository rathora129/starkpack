export const PRODUCTION_FLOW = ['Pending', 'Prepress', 'Approval', 'Printing', 'Finishing', 'Quality Check', 'Dispatch'];

export const sum = (rows, key) => rows.reduce((total, row) => total + Number(row[key] || 0), 0);

export const OPEN_LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Proposal'];
export const QUALIFIED_STAGES = ['Qualified', 'Proposal', 'Won'];

export const campaignFor = (state, id) => state.campaigns.find((campaign) => campaign.id === id) || null;

export const campaignMetricsFor = (state, campaign) => {
  const leads = state.leads.filter((lead) => lead.campaignId === campaign.id);
  const qualifiedLeads = leads.filter((lead) => QUALIFIED_STAGES.includes(lead.stage));
  const quotes = state.quotes.filter((quote) => quote.campaignId === campaign.id);
  const acceptedQuotes = quotes.filter((quote) => quote.status === 'Accepted');
  const orders = state.orders.filter((order) => order.campaignId === campaign.id && order.status !== 'On hold');
  const expenses = state.campaignExpenses.filter((expense) => expense.campaignId === campaign.id);
  const formLeads = state.landingPages
    .filter((page) => page.campaign === campaign.id)
    .reduce((total, page) => total + Number(page.formSubmissions || 0), 0);
  const spend = sum(expenses, 'amount');
  const revenue = sum(orders, 'value');
  const quoteValue = sum(quotes, 'total');
  const totalLeads = leads.length + formLeads;

  return {
    ...campaign,
    spend,
    revenue,
    quoteValue,
    leads: leads.length,
    formLeads,
    totalLeads,
    qualifiedLeads: qualifiedLeads.length,
    quotes: quotes.length,
    acceptedQuotes: acceptedQuotes.length,
    orders: orders.length,
    qualifiedRate: leads.length ? (qualifiedLeads.length / leads.length) * 100 : 0,
    costPerLead: totalLeads ? spend / totalLeads : 0,
    costPerOrder: orders.length ? spend / orders.length : 0,
    roas: spend ? revenue / spend : null,
    roi: spend ? ((revenue - spend) / spend) * 100 : null,
    expenses,
  };
};

export const campaignMetrics = (state) => state.campaigns.map((campaign) => campaignMetricsFor(state, campaign));

export const marketingTotals = (state) => {
  const rows = campaignMetrics(state);
  const mediaSpend = rows.reduce((total, row) => total + row.spend, 0);
  const agencyFees = sum(state.agencyFees, 'fee');
  const agencyPaid = state.agencyFees.filter((fee) => fee.status === 'Paid').reduce((total, fee) => total + fee.fee, 0);
  const revenue = rows.reduce((total, row) => total + row.revenue, 0);
  const quoteValue = rows.reduce((total, row) => total + row.quoteValue, 0);
  const crmLeads = rows.reduce((total, row) => total + row.leads, 0);
  const formLeads = rows.reduce((total, row) => total + row.formLeads, 0);
  const qualifiedLeads = rows.reduce((total, row) => total + row.qualifiedLeads, 0);
  const orders = rows.reduce((total, row) => total + row.orders, 0);
  const investment = mediaSpend + agencyFees;

  return {
    mediaSpend,
    agencyFees,
    agencyPaid,
    investment,
    revenue,
    quoteValue,
    crmLeads,
    formLeads,
    totalLeads: crmLeads + formLeads,
    qualifiedLeads,
    orders,
    roas: mediaSpend ? revenue / mediaSpend : null,
    roi: investment ? ((revenue - investment) / investment) * 100 : null,
    costPerLead: crmLeads + formLeads ? investment / (crmLeads + formLeads) : 0,
    costPerOrder: orders ? investment / orders : 0,
  };
};

export const leadPipeline = (state) => {
  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
  const counts = stages.map((stage) => ({
    stage,
    count: state.leads.filter((lead) => lead.stage === stage).length,
    value: state.leads.filter((lead) => lead.stage === stage).reduce((total, lead) => total + lead.value, 0),
  }));
  return {
    counts,
    openValue: state.leads.filter((lead) => OPEN_LEAD_STAGES.includes(lead.stage)).reduce((total, lead) => total + lead.value, 0),
    wonValue: state.leads.filter((lead) => lead.stage === 'Won').reduce((total, lead) => total + lead.value, 0),
    total: state.leads.length,
  };
};

export const orderTotals = (state) => {
  const confirmed = state.orders.filter((order) => order.status !== 'On hold');
  const revenue = sum(confirmed, 'value');
  const collected = confirmed.reduce((total, order) => total + Number(order.payment?.paid || 0), 0);
  const openOrders = state.orders.filter((order) => !['Delivered', 'On hold'].includes(order.status));
  return {
    revenue,
    collected,
    outstanding: revenue - collected,
    confirmedCount: confirmed.length,
    openCount: openOrders.length,
    openValue: sum(openOrders, 'value'),
    delivered: state.orders.filter((order) => order.status === 'Delivered').length,
  };
};

export const quotationTotalsFor = (state) => {
  const active = state.quotes.filter((quote) => ['Draft', 'Sent', 'Negotiation'].includes(quote.status));
  const accepted = state.quotes.filter((quote) => quote.status === 'Accepted');
  return {
    count: state.quotes.length,
    activeCount: active.length,
    activeValue: sum(active, 'total'),
    acceptedCount: accepted.length,
    acceptedValue: sum(accepted, 'total'),
    value: sum(state.quotes, 'total'),
    winRate: state.quotes.length ? (accepted.length / state.quotes.length) * 100 : 0,
  };
};

export const financeKpis = (state) => {
  const billed = sum(state.invoices, 'amount');
  const collectedInvoices = sum(state.invoices, 'paid');
  const overdue = state.invoices
    .filter((invoice) => invoice.status === 'Overdue')
    .reduce((total, invoice) => total + (invoice.amount - invoice.paid), 0);
  const income = state.financeTransactions.filter((tx) => tx.type === 'Income').reduce((total, tx) => total + tx.amount, 0);
  const expenses = state.financeTransactions.filter((tx) => tx.type === 'Expense').reduce((total, tx) => total + tx.amount, 0);
  const orders = orderTotals(state);

  return {
    billed,
    collectedInvoices,
    receivables: billed - collectedInvoices,
    overdue,
    income,
    expenses,
    netCash: income - expenses,
    orderRevenue: orders.revenue,
    orderCollected: orders.collected,
    orderOutstanding: orders.outstanding,
    recordedCosts: expenses,
    contribution: orders.revenue - expenses,
  };
};

export const monthlyFinance = (state) => {
  const months = new Map();
  const ensure = (month) => {
    if (!months.has(month)) months.set(month, { month, income: 0, expenses: 0, orderRevenue: 0, orders: 0 });
    return months.get(month);
  };
  state.financeTransactions.forEach((tx) => {
    const row = ensure(tx.date.slice(0, 7));
    if (tx.type === 'Income') row.income += tx.amount;
    else row.expenses += tx.amount;
  });
  state.orders.forEach((order) => {
    if (order.status === 'On hold') return;
    const row = ensure(String(order.createdAt).slice(0, 7));
    row.orderRevenue += order.value;
    row.orders += 1;
  });
  const label = (month) => {
    const [year, value] = month.split('-');
    const date = new Date(Number(year), Number(value) - 1, 1);
    return date.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
  };
  return Array.from(months.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((row) => ({ ...row, label: label(row.month), net: row.income - row.expenses }));
};

export const inventorySummary = (state) => {
  const value = state.inventory.reduce((total, item) => total + item.onHand * item.unitCost, 0);
  const lowStock = state.inventory.filter((item) => item.onHand <= item.reorder);
  const raw = state.inventory.filter((item) => item.itemType !== 'Finished goods');
  const finished = state.inventory.filter((item) => item.itemType === 'Finished goods');
  return {
    value,
    skuCount: state.inventory.length,
    rawCount: raw.length,
    finishedCount: finished.length,
    lowStock,
    lowStockCount: lowStock.length,
    movementCount: state.stockMovements.length,
  };
};

export const productionSummary = (state) => {
  const todayValue = new Date().toISOString().slice(0, 10);
  const byStage = PRODUCTION_FLOW.map((stage) => ({
    stage,
    jobs: state.production.filter((job) => job.stage === stage),
  }));
  const overdue = state.production.filter((job) => job.stage !== 'Dispatch' && job.deadline && job.deadline < todayValue);
  const checklistDone = state.production.reduce(
    (total, job) => total + (job.checklist || []).filter((item) => item.done).length,
    0
  );
  const checklistTotal = state.production.reduce((total, job) => total + (job.checklist || []).length, 0);
  return {
    byStage,
    overdue,
    overdueCount: overdue.length,
    active: state.production.filter((job) => job.stage !== 'Dispatch').length,
    dispatched: state.production.filter((job) => job.stage === 'Dispatch').length,
    checklistDone,
    checklistTotal,
    checklistRate: checklistTotal ? (checklistDone / checklistTotal) * 100 : 0,
  };
};

export const hrSummary = (state) => {
  const present = state.employees.filter((employee) => employee.status === 'Present').length;
  const onLeave = state.employees.filter((employee) => employee.status === 'On leave').length;
  const remote = state.employees.filter((employee) => employee.status === 'Remote').length;
  const payroll = sum(state.salaryRecords, 'net');
  const pendingLeaves = state.leaves.filter((leave) => leave.status === 'Pending').length;
  const openTasks = state.employeeTasks.filter((task) => task.status !== 'Done').length;
  return { present, onLeave, remote, payroll, pendingLeaves, openTasks, headcount: state.employees.length };
};

export const reportLibrary = [
  {
    id: 'sales',
    title: 'Sales & order register',
    category: 'Sales',
    description: 'Every order with value, payment position, delivery status and owner.',
    icon: 'trending',
    updated: 'Live demo data',
  },
  {
    id: 'leads',
    title: 'Lead pipeline report',
    category: 'Leads',
    description: 'Source, stage, owner, potential value and next action for all enquiries.',
    icon: 'users',
    updated: 'Live demo data',
  },
  {
    id: 'quotations',
    title: 'Quotation register',
    category: 'Sales',
    description: 'Quote value, discount, revision count and accept / decline status.',
    icon: 'file',
    updated: 'Live demo data',
  },
  {
    id: 'production',
    title: 'Production job status',
    category: 'Production',
    description: 'Stage, machine, operator, deadline and checklist completion by job.',
    icon: 'factory',
    updated: 'Live demo data',
  },
  {
    id: 'inventory',
    title: 'Inventory valuation',
    category: 'Inventory',
    description: 'Raw materials and finished goods with stock cover and reorder position.',
    icon: 'boxes',
    updated: 'Live demo data',
  },
  {
    id: 'employees',
    title: 'Employee & payroll',
    category: 'Employees',
    description: 'Directory, attendance status, department and current salary records.',
    icon: 'users',
    updated: 'Live demo data',
  },
  {
    id: 'finance',
    title: 'Finance ledger',
    category: 'Finance',
    description: 'Income, expenses, customer receipts and recorded costs by reference.',
    icon: 'wallet',
    updated: 'Live demo data',
  },
  {
    id: 'marketing',
    title: 'Marketing & agency ROI',
    category: 'Marketing',
    description: 'Spend by channel, attributed leads, quotes, orders and confirmed revenue.',
    icon: 'megaphone',
    updated: 'Live demo data',
  },
];

const csvSafe = (value) => (value === null || value === undefined ? '' : value);

export const buildReport = (state, id) => {
  if (id === 'sales') {
    return {
      filename: 'stark-packmate-sales-orders.csv',
      headers: ['Order', 'Customer', 'Status', 'Value', 'Paid', 'Balance', 'Payment status', 'Due date', 'Created', 'Owner'],
      rows: state.orders.map((order) => [
        order.id,
        order.customer,
        order.status,
        order.value,
        order.payment?.paid || 0,
        order.value - (order.payment?.paid || 0),
        order.payment?.paymentStatus || '—',
        order.dueDate,
        order.createdAt,
        order.owner,
      ]),
    };
  }
  if (id === 'leads') {
    const totals = leadPipeline(state);
    return {
      filename: 'stark-packmate-lead-pipeline.csv',
      headers: ['Lead', 'Company', 'Contact', 'Source', 'Campaign', 'Stage', 'Owner', 'Potential value', 'Next action', 'Open pipeline', 'Won value'],
      rows: state.leads.map((lead, index) => [
        lead.id,
        lead.company,
        lead.contact,
        lead.source,
        campaignFor(state, lead.campaignId)?.name || 'Organic / none',
        lead.stage,
        lead.owner,
        lead.value,
        lead.nextAction,
        index === 0 ? totals.openValue : '',
        index === 0 ? totals.wonValue : '',
      ]),
    };
  }
  if (id === 'quotations') {
    return {
      filename: 'stark-packmate-quotations.csv',
      headers: ['Quote', 'Customer', 'Status', 'Revision', 'Items', 'Subtotal', 'Discount', 'Tax', 'Total', 'Valid until', 'Owner'],
      rows: state.quotes.map((quote) => [
        quote.id,
        quote.customer,
        quote.status,
        quote.revision || 1,
        quote.items.length,
        quote.subtotal,
        quote.discount || 0,
        quote.tax,
        quote.total,
        quote.validUntil,
        quote.owner,
      ]),
    };
  }
  if (id === 'production') {
    return {
      filename: 'stark-packmate-production-jobs.csv',
      headers: ['Job', 'Order', 'Customer', 'Product', 'Quantity', 'Stage', 'Machine', 'Assigned to', 'Deadline', 'Checklist done'],
      rows: state.production.map((job) => [
        job.id,
        job.orderId,
        job.customer,
        job.product,
        job.quantity,
        job.stage,
        job.machine,
        job.assignedTo || job.operator,
        job.deadline || job.due,
        `${(job.checklist || []).filter((item) => item.done).length}/${(job.checklist || []).length}`,
      ]),
    };
  }
  if (id === 'inventory') {
    return {
      filename: 'stark-packmate-inventory.csv',
      headers: ['Code', 'Item', 'Type', 'Category', 'On hand', 'Allocated', 'Reorder level', 'Unit', 'Unit cost', 'Stock value', 'Supplier', 'Warehouse'],
      rows: state.inventory.map((item) => [
        item.id,
        item.name,
        item.itemType || 'Raw material',
        item.category,
        item.onHand,
        item.allocated,
        item.reorder,
        item.unit,
        item.unitCost,
        item.onHand * item.unitCost,
        item.supplier,
        item.warehouse,
      ]),
    };
  }
  if (id === 'employees') {
    return {
      filename: 'stark-packmate-employees.csv',
      headers: ['Employee', 'Name', 'Role', 'Department', 'Shift', 'Status', 'Joined', 'Email', 'Phone', 'Net salary'],
      rows: state.employees.map((employee) => {
        const salary = state.salaryRecords.find((record) => record.employeeId === employee.id);
        return [
          employee.id,
          employee.name,
          employee.role,
          employee.department,
          employee.shift,
          employee.status,
          employee.joined,
          employee.email,
          employee.phone,
          salary ? salary.net : '',
        ];
      }),
    };
  }
  if (id === 'finance') {
    return {
      filename: 'stark-packmate-finance-ledger.csv',
      headers: ['Entry', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Reference', 'Status'],
      rows: state.financeTransactions.map((tx) => [
        tx.id,
        tx.date,
        tx.type,
        tx.category,
        tx.description,
        tx.amount,
        tx.reference,
        tx.status,
      ]),
    };
  }
  if (id === 'marketing') {
    return {
      filename: 'stark-packmate-marketing-roi.csv',
      headers: [
        'Campaign',
        'Channel',
        'Status',
        'Budget',
        'Media spend',
        'CRM leads',
        'Form leads',
        'Qualified leads',
        'Quotations',
        'Quotation value',
        'Confirmed orders',
        'Confirmed revenue',
        'ROAS',
        'ROI %',
      ],
      rows: state.campaigns.map((campaign) => {
        const metrics = campaignMetricsFor(state, campaign);
        return [
          campaign.name,
          campaign.channel,
          campaign.status,
          campaign.budget,
          metrics.spend,
          metrics.leads,
          metrics.formLeads,
          metrics.qualifiedLeads,
          metrics.quotes,
          metrics.quoteValue,
          metrics.orders,
          metrics.revenue,
          metrics.roas ? metrics.roas.toFixed(2) : '—',
          metrics.roi === null ? '—' : metrics.roi.toFixed(1),
        ];
      }),
    };
  }
  return {
    filename: 'stark-packmate-marketing-roi.csv',
    headers: ['Metric', 'Value'],
    rows: Object.entries(marketingTotals(state)).map(([key, value]) => [key, csvSafe(value)]),
  };
};
