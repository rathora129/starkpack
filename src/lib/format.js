export function formatCompactINR(value) {
  const num = Number(value) || 0;
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
}

export function formatINR(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value) || 0);
}

export function formatPercent(value, digits = 1) {
  return `${Number(value).toFixed(digits)}%`;
}

export function formatValue(value, type) {
  if (type === 'compactCurrency') return formatCompactINR(value);
  if (type === 'currency') return formatINR(value);
  if (type === 'percent') return `${Number(value).toFixed(1)}%`;
  if (type === 'decimal') return Number(value).toFixed(1);
  return formatNumber(value);
}

export function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(value.length === 10 ? `${value}T00:00:00+05:30` : value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
    ...options,
  }).format(date);
}

export function formatShortDate(value) {
  return formatDate(value, { year: undefined });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

export function timeAgo(value) {
  if (!value) return '';
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 0) return 'Just now';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(value);
}

export function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function stockHealth(item) {
  const available = item.onHand - item.allocated;
  if (available <= 0) return { label: 'Out of stock', tone: 'danger', available };
  if (available < item.reorder) return { label: 'Low stock', tone: 'warning', available };
  if (available < item.reorder * 1.35) return { label: 'Watch', tone: 'info', available };
  return { label: 'Healthy', tone: 'success', available };
}

const statusTones = {
  active: 'success',
  paid: 'success',
  approved: 'success',
  delivered: 'success',
  won: 'success',
  published: 'success',
  present: 'success',
  received: 'success',
  completed: 'success',
  healthy: 'success',
  excellent: 'success',
  qualified: 'success',
  pending: 'warning',
  sent: 'warning',
  'in review': 'warning',
  draft: 'neutral',
  'awaiting file': 'warning',
  invited: 'warning',
  'part paid': 'warning',
  negotiation: 'warning',
  proposal: 'warning',
  watch: 'info',
  confirmed: 'info',
  'in production': 'info',
  prepress: 'info',
  qc: 'info',
  dispatched: 'info',
  contacted: 'info',
  'quality check': 'info',
  printing: 'info',
  'die-cutting': 'info',
  gluing: 'info',
  new: 'copper',
  'in transit': 'info',
  'under review': 'warning',
  'at risk': 'warning',
  'on hold': 'warning',
  intentional: 'neutral',
  overdue: 'danger',
  delayed: 'danger',
  lost: 'danger',
  declined: 'danger',
  'changes requested': 'danger',
  'out of stock': 'danger',
  urgent: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
  paused: 'warning',
  archived: 'neutral',
  remote: 'info',
  'on leave': 'warning',
  'work from home': 'info',
};

export function statusTone(status) {
  return statusTones[String(status || '').toLowerCase()] || 'neutral';
}

export function bytes(value) {
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${(value / 1024).toFixed(0)} KB`;
  return `${value} B`;
}

export function downloadCSV(filename, headers, rows) {
  const escape = (cell) => {
    const text = cell === null || cell === undefined ? '' : String(cell);
    return `"${text.replace(/"/g, '""')}"`;
  };
  const lines = [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))];
  const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function plusDaysISO(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
