import { DataProvider } from '@/components/app/data-provider';
import { MuseumFile } from '@/components/museums/museum-file';
import { MuseumShell } from '@/components/museums/museum-shell';
import museumsDataset from '@/lib/data/datasets/museums-snk-2025.json';

export function generateStaticParams() {
  return (museumsDataset as { id: string }[]).map((museum) => ({ id: museum.id }));
}

export default async function MuseumFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <DataProvider>
      <MuseumShell>
        <MuseumFile id={id} />
      </MuseumShell>
    </DataProvider>
  );
}
