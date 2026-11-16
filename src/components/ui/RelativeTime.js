'use client';

import { formatShortDate, timeAgo } from '@/lib/format';
import { useHydrated } from '@/hooks/useHydrated';

export default function RelativeTime({ value, as: Tag = 'time', ...rest }) {
  const hydrated = useHydrated();
  return <Tag {...rest}>{hydrated ? timeAgo(value) : formatShortDate(value)}</Tag>;
}
