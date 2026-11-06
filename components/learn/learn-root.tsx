'use client';

import type { ReactNode } from 'react';

import { DataProvider } from '@/components/app/data-provider';
import { LearnShell } from '@/components/learn/learn-shell';
import { ProgressProvider } from '@/components/learn/progress-provider';

export function LearnRoot({
  children,
  active,
}: {
  children: ReactNode;
  active?: 'series' | 'profile';
}) {
  return (
    <DataProvider>
      <ProgressProvider>
        <LearnShell active={active}>{children}</LearnShell>
      </ProgressProvider>
    </DataProvider>
  );
}
