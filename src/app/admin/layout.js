import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata = {
  title: 'Workspace',
  description:
    'STARK PACKMATE packaging business management demo workspace — sales, production, inventory, finance and website CMS.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
