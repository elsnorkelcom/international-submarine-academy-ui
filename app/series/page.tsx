import { LearnRoot } from '@/components/learn/learn-root';
import { SeriesView } from '@/components/learn/series-view';

export const metadata = {
  title: 'ISA Series · Missions',
  description: 'Seasons and missions of the International Submarine Academy.',
};

export default function SeriesPage() {
  return (
    <LearnRoot active="series">
      <SeriesView />
    </LearnRoot>
  );
}
