import { LearnRoot } from '@/components/learn/learn-root';
import { ProfileView } from '@/components/learn/profile-view';

export const metadata = {
  title: 'ISA Series · Profile',
  description: 'Local learning record of the International Submarine Academy.',
};

export default function ProfilePage() {
  return (
    <LearnRoot active="profile">
      <ProfileView />
    </LearnRoot>
  );
}
