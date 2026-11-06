import { notFound } from 'next/navigation';

import { AdminShell } from '@/components/admin/admin-shell';
import { EntityTable } from '@/components/admin/entity-table';
import { ADMIN_ENTITIES, getAdminEntity } from '@/lib/admin/entities';

export function generateStaticParams() {
  return ADMIN_ENTITIES.map((entity) => ({ entity: entity.collection }));
}

export default async function AdminEntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity: collection } = await params;
  const entity = getAdminEntity(collection);

  if (!entity) {
    notFound();
  }

  return (
    <AdminShell>
      <EntityTable entity={entity} />
    </AdminShell>
  );
}
