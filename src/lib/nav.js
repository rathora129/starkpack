import {
  LayoutDashboard,
  Globe2,
  PanelsTopLeft,
  ContactRound,
  Building2,
  FileText,
  ShoppingCart,
  Factory,
  PenTool,
  Boxes,
  Truck,
  Users,
  Wallet,
  Megaphone,
  BarChart3,
  UserRoundCheck,
  Settings2,
} from 'lucide-react';

export const adminNav = [
  {
    group: 'Workspace',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Website CMS', href: '/admin/cms', icon: Globe2 },
      { label: 'Landing Pages', href: '/admin/landing-pages', icon: PanelsTopLeft },
      { label: 'Marketing & Agency', href: '/admin/marketing', icon: Megaphone },
    ],
  },
  {
    group: 'Revenue',
    items: [
      { label: 'CRM & Leads', href: '/admin/leads', icon: ContactRound, badge: 'leads' },
      { label: 'Customers', href: '/admin/customers', icon: Building2 },
      { label: 'Quotations', href: '/admin/quotations', icon: FileText, badge: 'quotes' },
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Production', href: '/admin/production', icon: Factory },
      { label: 'Prepress & Artwork', href: '/admin/prepress', icon: PenTool, badge: 'artwork' },
      { label: 'Inventory', href: '/admin/inventory', icon: Boxes, badge: 'stock' },
      { label: 'Purchase & Suppliers', href: '/admin/purchasing', icon: Truck },
    ],
  },
  {
    group: 'Company',
    items: [
      { label: 'HR & Employees', href: '/admin/hr', icon: Users },
      { label: 'Finance', href: '/admin/finance', icon: Wallet },
      { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    ],
  },
  {
    group: 'Experience',
    items: [
      { label: 'Customer Portal', href: '/admin/portal', icon: UserRoundCheck },
      { label: 'Settings', href: '/admin/settings', icon: Settings2 },
    ],
  },
];

export const adminSearchPages = adminNav.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.group }))
);

const DEMO_PASSWORD = 'StarkDemo#2026';

export const demoRoles = [
  {
    id: 'owner',
    label: 'Owner',
    person: 'Ashish Rathor',
    email: 'owner@starkpackmate.demo',
    password: DEMO_PASSWORD,
    hint: 'Full workspace access',
    hrefs: null,
    home: '/admin',
  },
  {
    id: 'admin',
    label: 'Admin',
    person: 'Neha Kulkarni',
    email: 'admin@starkpackmate.demo',
    password: DEMO_PASSWORD,
    hint: 'All modules, settings and CMS',
    hrefs: null,
    home: '/admin',
  },
  {
    id: 'sales-manager',
    label: 'Sales Manager',
    person: 'Rahul Mehta',
    email: 'sales.manager@starkpackmate.demo',
    password: DEMO_PASSWORD,
    hint: 'CRM, quotations, orders, marketing',
    hrefs: [
      '/admin',
      '/admin/leads',
      '/admin/customers',
      '/admin/quotations',
      '/admin/orders',
      '/admin/marketing',
      '/admin/reports',
      '/admin/portal',
    ],
    home: '/admin',
  },
  {
    id: 'sales-executive',
    label: 'Sales Executive',
    person: 'Priya Nair',
    email: 'sales.executive@starkpackmate.demo',
    password: DEMO_PASSWORD,
    hint: 'Leads, customers, quotations and orders',
    hrefs: ['/admin', '/admin/leads', '/admin/customers', '/admin/quotations', '/admin/orders', '/admin/portal'],
    home: '/admin',
  },
  {
    id: 'production-manager',
    label: 'Production Manager',
    person: 'Sandeep Patil',
    email: 'production.manager@starkpackmate.demo',
    password: DEMO_PASSWORD,
    hint: 'Production, prepress, inventory and purchasing',
    hrefs: [
      '/admin',
      '/admin/orders',
      '/admin/production',
      '/admin/prepress',
      '/admin/inventory',
      '/admin/purchasing',
      '/admin/reports',
    ],
    home: '/admin',
  },
  {
    id: 'inventory-manager',
    label: 'Inventory Manager',
    person: 'Farhan Shaikh',
    email: 'inventory.manager@starkpackmate.demo',
    password: DEMO_PASSWORD,
    hint: 'Stock, purchasing and order fulfilment',
    hrefs: ['/admin', '/admin/orders', '/admin/inventory', '/admin/purchasing', '/admin/reports'],
    home: '/admin',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    person: 'Meera Iyer',
    email: 'accounts@starkpackmate.demo',
    password: DEMO_PASSWORD,
    hint: 'Customers, orders, finance and reports',
    hrefs: ['/admin', '/admin/customers', '/admin/orders', '/admin/finance', '/admin/reports', '/admin/portal'],
    home: '/admin',
  },
  {
    id: 'hr',
    label: 'HR',
    person: 'Anita Desai',
    email: 'hr@starkpackmate.demo',
    password: DEMO_PASSWORD,
    hint: 'People, attendance and reports',
    hrefs: ['/admin', '/admin/hr', '/admin/reports'],
    home: '/admin',
  },
  {
    id: 'customer',
    label: 'Customer',
    person: 'Ritu Bansal',
    email: 'ritu.bansal@abcfoods.in',
    password: 'ABCfoods#2026',
    hint: 'ABC Foods customer portal',
    hrefs: [],
    home: '/portal',
  },
];

export const demoRoleById = (id) => demoRoles.find((item) => item.id === id) || demoRoles[0];

export function navForRole(role) {
  const config = demoRoleById(role);
  if (!config.hrefs) return adminNav;
  return adminNav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => config.hrefs.includes(item.href)),
    }))
    .filter((group) => group.items.length);
}

export function canAccess(role, pathname) {
  const config = demoRoleById(role);
  if (!config.hrefs) return true;
  return config.hrefs.some((href) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)));
}

export function findAdminPage(pathname) {
  if (pathname === '/admin') return adminSearchPages[0];
  return (
    adminSearchPages.find(
      (item) => item.href !== '/admin' && pathname.startsWith(item.href)
    ) || adminSearchPages[0]
  );
}
