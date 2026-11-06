'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import { ADMIN_ENTITIES } from '@/lib/admin/entities';

interface EntityCount {
  collection: string;
  label: string;
  total: number;
  published: number;
  drafts: number;
}

export function AdminDashboard() {
  const { database } = useApp();
  const [counts, setCounts] = useState<EntityCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database) {
        return;
      }

      const result: EntityCount[] = [];

      for (const entity of ADMIN_ENTITIES) {
        try {
          const repository = database.repository(entity.collection) as unknown as {
            list(options: Record<string, unknown>): Promise<{ items: Record<string, unknown>[] }>;
          };
          const { items } = await repository.list({ pageSize: 0, includeDeleted: true });
          const live = items.filter((item) => item.deletedAt === null);
          const statusKey = entity.statusField;
          const published = statusKey
            ? live.filter((item) => String(item[statusKey] ?? '') === entity.publishedValue).length
            : 0;

          result.push({
            collection: entity.collection,
            label: entity.label,
            total: items.length,
            published,
            drafts: statusKey ? live.length - published : 0,
          });
        } catch {
          result.push({ collection: entity.collection, label: entity.label, total: 0, published: 0, drafts: 0 });
        }
      }

      if (!cancelled) {
        setCounts(result);
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [database]);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Admin // Overview</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none tracking-tight">
            Content overview
          </h1>
          <p className="mt-2 max-w-xl text-xs text-muted-foreground">
            Everything here lives in this browser. Use Export to keep a copy, or Import to load a CSV file.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/import"
            className="border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
          >
            Import CSV
          </Link>
          <Link
            href="/admin/settings"
            className="border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            Settings
          </Link>
        </div>
      </header>

      {loading ? (
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {counts.map((item) => (
            <Link
              key={item.collection}
              href={`/admin/${item.collection}`}
              className="group border border-white/10 bg-white/[0.02] p-4 transition hover:border-primary/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">{item.label}</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground group-hover:text-primary">
                {item.total}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {item.published} published · {item.drafts} draft
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
