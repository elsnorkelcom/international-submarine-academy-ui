import { DataProvider } from '@/components/app/data-provider';
import { MuseumRegister } from '@/components/museums/museum-register';
import { MuseumShell } from '@/components/museums/museum-shell';

export const metadata = {
  title: 'Submarine Museums — ISA',
  description: 'Register of preserved submarines and their museums.',
};

export default function MuseumsPage() {
  return (
    <DataProvider>
      <MuseumShell active="register">
        <MuseumRegister />
      </MuseumShell>
    </DataProvider>
  );
}
