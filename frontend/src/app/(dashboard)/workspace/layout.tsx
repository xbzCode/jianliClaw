import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function WorkspaceRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
