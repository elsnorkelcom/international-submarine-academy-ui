import { AdminShell } from '@/components/admin/admin-shell';
import { ImportCenter } from '@/components/admin/import-center';

export const metadata = {
  title: 'CSV Import Center — ISA',
  description: 'Import museums, institutions and questions from CSV files.',
};

export default function AdminImportPage() {
  return (
    <AdminShell>
      <ImportCenter />
    </AdminShell>
  );
}
