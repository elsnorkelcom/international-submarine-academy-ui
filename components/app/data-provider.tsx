'use client';

/**
 * Client data provider.
 *
 * Opens the local database, seeds it on first visit and exposes it together with
 * the active UI language. Pages never touch IndexedDB directly.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { IndexedDbStorage, LocalDatabase, MemoryStorage, ensureSeed } from '@/lib/data';
import { appStrings, isAppLanguage, type AppLanguage, type AppStrings } from '@/lib/i18n/app';

const LANGUAGE_KEY = 'isa-language';

interface AppContextValue {
  database: LocalDatabase | null;
  ready: boolean;
  degraded: boolean;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: AppStrings;
}

const AppContext = createContext<AppContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [database, setDatabase] = useState<LocalDatabase | null>(null);
  const [ready, setReady] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const stored = window.localStorage.getItem(LANGUAGE_KEY);

        if (isAppLanguage(stored)) {
          setLanguageState(stored);
        }
      } catch {
        // localStorage may be blocked; English stays as the default.
      }

      try {
        const local = new LocalDatabase(new IndexedDbStorage(), { actor: 'learner' });
        await ensureSeed(local, window.localStorage);

        if (!cancelled) {
          setDatabase(local);
          setReady(true);
        }
      } catch {
        // Private mode or blocked IndexedDB: keep the session working in memory.
        const memory = new LocalDatabase(new MemoryStorage(), { actor: 'learner' });
        await ensureSeed(memory, null);

        if (!cancelled) {
          setDatabase(memory);
          setReady(true);
          setDegraded(true);
        }
      }
    }

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);

    try {
      window.localStorage.setItem(LANGUAGE_KEY, next);
    } catch {
      // The choice stays in memory for this session.
    }
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      database,
      ready,
      degraded,
      language,
      setLanguage,
      t: appStrings[language],
    }),
    [database, ready, degraded, language, setLanguage],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside <DataProvider>.');
  }

  return context;
}
