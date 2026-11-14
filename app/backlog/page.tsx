import { LearnRoot } from '@/components/learn/learn-root';
import { BacklogView } from '@/components/backlog/backlog-view';
import { useApp } from '@/components/app/data-provider';

export default function BacklogPage() {
  const { t } = useApp();
  return (
    <LearnRoot>
      <BacklogView t={t.learn.series} />
    </LearnRoot>
  );
}
