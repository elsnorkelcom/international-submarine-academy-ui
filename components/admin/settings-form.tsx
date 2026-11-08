'use client';

import { useEffect, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import type { Settings } from '@/lib/domain/types';

export function SettingsForm() {
  const { database } = useApp();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database) {
        return;
      }

      const current = await database.settings().get();

      if (!cancelled) {
        setSettings(current);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [database]);

  async function save() {
    if (!database || !settings) {
      return;
    }

    const { id, createdAt, updatedAt, createdBy, deletedAt, ...values } = settings;

    try {
      await database.settings().save(values as never);
      setMessage('Ajustes guardados.');
    } catch {
      setMessage('No se pudieron guardar los ajustes.');
    }
  }

  if (!settings) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</p>;
  }

  return (
    <div>
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Admin // Ajustes</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none tracking-tight">Ajustes</h1>
        <p className="mt-2 max-w-xl text-xs text-muted-foreground">
          Nombre de la aplicación, mensajes, colores del tema y funciones.
        </p>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Application name">
          <input
            value={settings.appName}
            onChange={(event) => setSettings({ ...settings, appName: event.target.value })}
            className="h-9 w-full rounded-sm border border-white/15 bg-white/5 px-2 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Default language">
          <select
            value={settings.defaultLanguage}
            onChange={(event) =>
              setSettings({ ...settings, defaultLanguage: event.target.value as Settings['defaultLanguage'] })
            }
            className="h-9 w-full rounded-sm border border-white/15 bg-white/5 px-2 text-sm outline-none focus:border-primary"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </Field>

        <LocalizedField
          label="Welcome message"
          value={settings.welcomeMessage}
          onChange={(value) => setSettings({ ...settings, welcomeMessage: value })}
        />

        <LocalizedField
          label="Access screen text"
          value={settings.accessScreenText}
          onChange={(value) => setSettings({ ...settings, accessScreenText: value })}
        />

        <LocalizedField
          label="Fiction notice"
          value={settings.fictionNotice}
          onChange={(value) => setSettings({ ...settings, fictionNotice: value })}
        />

        <Field label="Fallback content status">
          <select
            value={settings.fallbackContentStatus}
            onChange={(event) =>
              setSettings({
                ...settings,
                fallbackContentStatus: event.target.value as Settings['fallbackContentStatus'],
              })
            }
            className="h-9 w-full rounded-sm border border-white/15 bg-white/5 px-2 text-sm outline-none focus:border-primary"
          >
            <option value="pending">Pending</option>
            <option value="validated">Validated</option>
          </select>
        </Field>

        <Field label="Maximum attempts">
          <input
            type="number"
            value={settings.maxAttempts}
            onChange={(event) => setSettings({ ...settings, maxAttempts: Number(event.target.value) })}
            className="h-9 w-full rounded-sm border border-white/15 bg-white/5 px-2 text-sm outline-none focus:border-primary"
          />
        </Field>

        <Field label="Timer (seconds)">
          <input
            type="number"
            value={settings.timerSeconds}
            onChange={(event) => setSettings({ ...settings, timerSeconds: Number(event.target.value) })}
            className="h-9 w-full rounded-sm border border-white/15 bg-white/5 px-2 text-sm outline-none focus:border-primary"
          />
        </Field>

        <div className="md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">Theme colours</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {(Object.keys(settings.theme) as (keyof Settings['theme'])[]).map((key) => (
              <label key={key} className="block">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{key}</span>
                <span className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.theme[key]}
                    onChange={(event) =>
                      setSettings({ ...settings, theme: { ...settings.theme, [key]: event.target.value } })
                    }
                    className="h-8 w-10 rounded-sm border border-white/15 bg-transparent"
                  />
                  <input
                    value={settings.theme[key]}
                    onChange={(event) =>
                      setSettings({ ...settings, theme: { ...settings.theme, [key]: event.target.value } })
                    }
                    className="h-8 min-w-0 flex-1 rounded-sm border border-white/15 bg-white/5 px-1 font-mono text-[10px] outline-none focus:border-primary"
                  />
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">Feature flags</p>
          <div className="mt-2 flex flex-wrap gap-4">
            {(Object.keys(settings.featureFlags) as (keyof Settings['featureFlags'])[]).map((key) => (
              <label key={key} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={settings.featureFlags[key]}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      featureFlags: { ...settings.featureFlags, [key]: event.target.checked },
                    })
                  }
                  className="accent-[#00e08a]"
                />
                {key}
              </label>
            ))}
          </div>
        </div>
      </div>

      {message ? (
        <p className="mt-4 border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground/90">{message}</p>
      ) : null}

      <button
        type="button"
        onClick={() => void save()}
        className="mt-5 border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
      >
        Guardar ajustes
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function LocalizedField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { en: string; es: string };
  onChange: (value: { en: string; es: string }) => void;
}) {
  return (
    <div className="md:col-span-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">{label}</p>
      <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
        {(['en', 'es'] as const).map((language) => (
          <label key={language} className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{language}</span>
            <textarea
              value={value[language]}
              onChange={(event) => onChange({ ...value, [language]: event.target.value })}
              rows={2}
              className="mt-1 w-full rounded-sm border border-white/15 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-primary"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
