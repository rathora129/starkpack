'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import {
  Search,
  ContactRound,
  Building2,
  ShoppingCart,
  FileText,
  Package,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Compass,
} from 'lucide-react';
import { AppModal } from '../ui/Overlay';
import { Kbd } from '../ui/primitives';
import { useUiStore } from '@/store/useUiStore';
import { useDemoStore } from '@/store/useDemoStore';
import { adminSearchPages } from '@/lib/nav';
import { products } from '@/data/catalog';
import { colors, fonts } from '@/lib/theme';

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 4px 20px 4px 22px;
  border-bottom: 1px solid ${colors.lineSoft};

  input {
    flex: 1;
    height: 56px;
    border: 0;
    outline: 0;
    background: transparent;
    font-family: ${fonts.sans};
    font-size: 15px;
    color: ${colors.ink};

    &::placeholder {
      color: #A2AAA4;
    }
  }

  kbd {
    flex: 0 0 auto;
  }
`;

const Results = styled.div`
  max-height: min(480px, 62vh);
  overflow-y: auto;
  padding: 8px;
`;

const GroupLabel = styled.p`
  padding: 9px 12px 5px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: ${colors.faint};
`;

const Result = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 11px;
  border: 0;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? colors.cream : 'transparent')};
  text-align: left;
  transition: background 120ms ease;

  &:hover {
    background: ${colors.cream};
  }
`;

const ResultIcon = styled.span`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: ${({ $bg }) => $bg || colors.mist};
  color: ${({ $fg }) => $fg || colors.inkSoft};
  flex: 0 0 auto;
`;

const ResultText = styled.span`
  min-width: 0;
  flex: 1;

  strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    font-size: 10.5px;
    color: ${colors.faint};
    line-height: 1.4;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Kind = styled.span`
  flex: 0 0 auto;
  font-size: 8.5px;
  font-weight: 700;
  color: ${colors.faint};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 3px 6px;
  border-radius: 4px;
  background: ${colors.mist};
`;

const SearchFoot = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 10px 18px;
  border-top: 1px solid ${colors.lineSoft};
  background: #FCFBF8;
  font-size: 9.5px;
  color: ${colors.faint};

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const NoResults = styled.div`
  padding: 40px 20px;
  text-align: center;

  strong {
    display: block;
    font-size: 13px;
    color: ${colors.ink};
    font-weight: 700;
  }

  p {
    margin-top: 4px;
    font-size: 11.5px;
    color: ${colors.muted};
  }
`;

const itemTypeStyles = {
  Page: { bg: '#EFF5F2', fg: '#1B1464' },
  Customer: { bg: '#E7F3EC', fg: '#2E7D5B' },
  Order: { bg: '#E8F1F6', fg: '#376C8A' },
  Lead: { bg: '#FBF1E3', fg: '#B31420' },
  Quote: { bg: '#F1F0EA', fg: '#5C655F' },
  Product: { bg: '#F4E6D6', fg: '#7C491F' },
};

export default function GlobalSearch() {
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const customers = useDemoStore((state) => state.customers);
  const orders = useDemoStore((state) => state.orders);
  const leads = useDemoStore((state) => state.leads);
  const quotes = useDemoStore((state) => state.quotes);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [
        {
          label: 'Jump to',
          items: adminSearchPages.slice(0, 7).map((page) => ({
            key: `page-${page.href}`,
            label: page.label,
            meta: page.group,
            href: page.href,
            type: 'Page',
            icon: page.icon,
          })),
        },
        {
          label: 'Recent orders',
          items: orders.slice(0, 3).map((order) => ({
            key: order.id,
            label: `${order.id} · ${order.customer}`,
            meta: `${order.status} · ${order.items[0]?.description || ''}`,
            href: '/admin/orders',
            type: 'Order',
            icon: ShoppingCart,
          })),
        },
      ];
    }

    const matches = (text) => String(text || '').toLowerCase().includes(q);
    const starts = (text) => String(text || '').toLowerCase().startsWith(q);

    const pageItems = adminSearchPages
      .filter((page) => matches(page.label) || matches(page.group))
      .slice(0, 4)
      .map((page) => ({
        key: `page-${page.href}`,
        label: page.label,
        meta: page.group,
        href: page.href,
        type: 'Page',
        icon: page.icon,
      }));

    const customerItems = customers
      .filter((c) => matches(c.company) || matches(c.contact) || matches(c.city) || matches(c.email))
      .slice(0, 4)
      .map((c) => ({
        key: c.id,
        label: c.company,
        meta: `${c.contact} · ${c.city} · ${c.segment}`,
        href: `/admin/customers?focus=${c.id}`,
        type: 'Customer',
        icon: Building2,
      }));

    const orderItems = [...orders]
      .filter(
        (o) =>
          matches(o.id) ||
          matches(o.customer) ||
          o.items.some((item) => matches(item.description)) ||
          matches(o.status)
      )
      .sort((a, b) => (starts(b.id) ? 1 : 0) - (starts(a.id) ? 1 : 0))
      .slice(0, 4)
      .map((o) => ({
        key: o.id,
        label: `${o.id} · ${o.customer}`,
        meta: `${o.status} · ${o.items[0]?.description || ''}`,
        href: `/admin/orders?focus=${o.id}`,
        type: 'Order',
        icon: ShoppingCart,
      }));

    const leadItems = leads
      .filter((l) => matches(l.company) || matches(l.contact) || matches(l.product) || matches(l.email))
      .slice(0, 4)
      .map((l) => ({
        key: l.id,
        label: l.company,
        meta: `${l.contact} · ${l.product} · ${l.stage}`,
        href: `/admin/leads?focus=${l.id}`,
        type: 'Lead',
        icon: ContactRound,
      }));

    const quoteItems = quotes
      .filter((quote) => matches(quote.id) || matches(quote.customer) || matches(quote.status))
      .slice(0, 3)
      .map((quote) => ({
        key: quote.id,
        label: `${quote.id} · ${quote.customer}`,
        meta: `${quote.status} · ${quote.items[0]?.description || ''}`,
        href: `/admin/quotations?focus=${quote.id}`,
        type: 'Quote',
        icon: FileText,
      }));

    const productItems = products
      .filter((p) => matches(p.name) || matches(p.category) || matches(p.tagline))
      .slice(0, 3)
      .map((p) => ({
        key: p.slug,
        label: p.name,
        meta: `${p.category} · ${p.tagline}`,
        href: `/products/${p.slug}`,
        type: 'Product',
        icon: Package,
      }));

    return [
      { label: 'Modules', items: pageItems },
      { label: 'Customers', items: customerItems },
      { label: 'Orders', items: orderItems },
      { label: 'Leads', items: leadItems },
      { label: 'Quotations', items: quoteItems },
      { label: 'Website products', items: productItems },
    ].filter((group) => group.items.length > 0);
  }, [query, customers, orders, leads, quotes]);

  const flat = groups.flatMap((group) => group.items);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const go = (item) => {
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  };

  const handleKey = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, flat.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      go(flat[active]);
    }
  };

  let cursor = -1;

  return (
    <AppModal open={open} onClose={() => setOpen(false)} size="lg" flush title="Global search" description="Modules, customers, orders, leads, quotations and products.">
      <SearchRow>
        <Search size={19} style={{ color: colors.faint }} />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a module, customer, order number or product…"
          aria-label="Global search"
        />
        <Kbd>ESC</Kbd>
      </SearchRow>
      <Results>
        {flat.length === 0 ? (
          <NoResults>
            <Compass size={26} style={{ color: colors.faint, margin: '0 auto 10px' }} />
            <strong>No results for “{query}”</strong>
            <p>Try a customer name, order number, module or product.</p>
          </NoResults>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <GroupLabel>{group.label}</GroupLabel>
              {group.items.map((item) => {
                cursor += 1;
                const index = cursor;
                const Icon = item.icon;
                const style = itemTypeStyles[item.type] || itemTypeStyles.Page;
                return (
                  <Result
                    key={item.key}
                    $active={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item)}
                  >
                    <ResultIcon $bg={style.bg} $fg={style.fg}>
                      <Icon size={14} />
                    </ResultIcon>
                    <ResultText>
                      <strong>{item.label}</strong>
                      <span>{item.meta}</span>
                    </ResultText>
                    <Kind>{item.type}</Kind>
                  </Result>
                );
              })}
            </div>
          ))
        )}
      </Results>
      <SearchFoot>
        <span>
          <Kbd>
            <ArrowUp size={8} />
          </Kbd>
          <Kbd>
            <ArrowDown size={8} />
          </Kbd>
          to navigate
        </span>
        <span>
          <Kbd>
            <CornerDownLeft size={8} />
          </Kbd>
          to open
        </span>
        <span style={{ marginLeft: 'auto' }}>Searches demo workspace data</span>
      </SearchFoot>
    </AppModal>
  );
}
