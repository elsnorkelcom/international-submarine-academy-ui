import { AccreditationPanel } from '@/components/admin/accreditation-panel';
import { AdminShell } from '@/components/admin/admin-shell';

export const metadata = {
  title: 'ISA Admin · Accreditation',
  description: 'Accreditation rules and credential registry.',
};

export default function AdminAccreditationPage() {
  return (
    <AdminShell>
      <AccreditationPanel />
    </AdminShell>
  );
}
