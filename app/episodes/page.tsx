import { LearnRoot } from '@/components/learn/learn-root';
import { MissionView } from '@/components/learn/mission-view';

export const metadata = {
  title: 'ISA Series · Mission',
  description: 'Mission player of the International Submarine Academy.',
};

export default function EpisodePage() {
  return (
    <LearnRoot>
      <MissionView />
    </LearnRoot>
  );
}
