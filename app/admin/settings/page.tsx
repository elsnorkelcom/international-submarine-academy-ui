import { AdminShell } from '@/components/admin/admin-shell';
import { SettingsForm } from '@/components/admin/settings-form';

export const metadata = {
  title: 'ISA Admin · Settings',
};

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <SettingsForm />
    </AdminShell>
  );
}
