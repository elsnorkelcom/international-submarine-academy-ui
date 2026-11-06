import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminShell } from '@/components/admin/admin-shell';

export const metadata = {
  title: 'ISA Admin',
  description: 'Local content administration for International Submarine Academy.',
};

export default function AdminPage() {
  return (
    <AdminShell>
      <AdminDashboard />
    </AdminShell>
  );
}
