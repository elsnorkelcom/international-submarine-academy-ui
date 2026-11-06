import { DataProvider } from '@/components/app/data-provider';
import { MuseumMap } from '@/components/museums/museum-map';
import { MuseumShell } from '@/components/museums/museum-shell';

export const metadata = {
  title: 'Submarine museums plot — ISA',
  description: 'Map of preserved submarines and their museums.',
};

export default function MapPage() {
  return (
    <DataProvider>
      <MuseumShell active="map">
        <MuseumMap />
      </MuseumShell>
    </DataProvider>
  );
}
