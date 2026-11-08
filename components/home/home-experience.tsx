'use client';

import { ProgressProvider } from '@/components/learn/progress-provider';
import { DataProvider } from '@/components/app/data-provider';
import { PresentationHero } from './presentation-hero';
import { SeasonShowcase } from './season-showcase';

/** Home experience: real database content with local progress. */
export function HomeExperience() {
  return (
    <DataProvider>
      <ProgressProvider>
        <PresentationHero />
        <SeasonShowcase />
      </ProgressProvider>
    </DataProvider>
  );
}
