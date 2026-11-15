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

export function findAdminPage(pathname) {
  if (pathname === '/admin') return adminSearchPages[0];
  return (
    adminSearchPages.find(
      (item) => item.href !== '/admin' && pathname.startsWith(item.href)
    ) || adminSearchPages[0]
  );
}
