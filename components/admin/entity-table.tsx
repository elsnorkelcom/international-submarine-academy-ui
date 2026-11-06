'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { EntityForm, type EntityValues } from '@/components/admin/entity-form';
import { useApp } from '@/components/app/data-provider';
import type { AdminEntity } from '@/lib/admin/entities';
import type { EntityBase } from '@/lib/domain/types';
import { toCsv } from '@/lib/import/csv';

type Row = EntityBase & Record<string, unknown>;

interface GenericRepository {
  list(options: Record<string, unknown>): Promise<{ items: Row[]; total: number }>;
  create(input: Record<string, unknown>): Promise<Row>;
  update(id: string, patch: Record<string, unknown>): Promise<Row>;
  softDelete(id: string): Promise<Row>;
  restore(id: string): Promise<Row>;
  duplicate(id: string): Promise<Row>;
}

const PAGE_SIZE = 20;

export function EntityTable({ entity }: { entity: AdminEntity }) {
  const { database } = useApp();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState(entity.defaultSort ?? 'id');
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const repository = useMemo(
    () => (database ? (database.repository(entity.collection) as unknown as GenericRepository) : null),
    [database, entity.collection],
  );

  const refresh = useCallback(async () => {
    if (!repository) {
      return;
    }

    setLoading(true);

    try {
      const result = await repository.list({ pageSize: 0, includeDeleted: true });
      setRows(result.items);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const statuses = useMemo(() => {
    const field = entity.statusField;
    if (!field) return [];

    return Array.from(new Set(rows.map((row) => String(row[field] ?? '')).filter(Boolean))).sort();
  }, [rows, entity.statusField]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    let items = rows;

    if (status !== 'all' && entity.statusField) {
      items = items.filter((row) => String(row[entity.statusField as string] ?? '') === status);
    }

    if (needle) {
      items = items.filter((row) => JSON.stringify(row).toLowerCase().includes(needle));
    }

    return [...items].sort((left, right) => {
      const a = sortValue(left, sortBy);
      const b = sortValue(right, sortBy);
      const order = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b));
      return ascending ? order : -order;
    });
  }, [rows, search, status, sortBy, ascending, entity.statusField]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function toggleSelection(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runBulk(action: 'publish' | 'unpublish' | 'delete' | 'restore' | 'duplicate') {
    if (!repository || selected.size === 0) {
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      for (const id of selected) {
        if (action === 'delete') {
          await repository.softDelete(id);
        } else if (action === 'restore') {
          await repository.restore(id);
        } else if (action === 'duplicate') {
          await repository.duplicate(id);
        } else if (entity.statusField) {
          await repository.update(id, {
            [entity.statusField]: action === 'publish' ? entity.publishedValue : entity.draftValue,
          });
        }
      }

      setMessage(`${selected.size} record(s) updated.`);
      setSelected(new Set());
      await refresh();
    } catch {
      setMessage('Some records could not be updated.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(values: EntityValues) {
    if (!repository) {
      return;
    }

    setBusy(true);

    try {
      if (editing) {
        await repository.update(editing.id, values);
      } else {
        await repository.create(values);
      }

      setEditing(null);
      setCreating(false);
      setMessage('Saved.');
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  function exportRows(items: Row[]) {
    const headers = ['id', ...entity.fields.map((field) => field.key), 'createdAt', 'updatedAt', 'deletedAt'];
    const csv = toCsv(
      headers,
      items.map((row) =>
        headers.map((header) => {
          const value = (row as Record<string, unknown>)[header];
          if (value && typeof value === 'object' && 'en' in (value as Record<string, unknown>)) {
            return String((value as { en?: string }).en ?? '');
          }
          if (Array.isArray(value)) return value.join('|');
          return value === null || value === undefined ? '' : String(value);
        }),
      ),
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entity.collection}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Admin // {entity.label}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none tracking-tight">
            {entity.label}
          </h1>
          <p className="mt-2 max-w-xl text-xs text-muted-foreground">{entity.description}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => exportRows(visible)}
            className="border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
          >
            New {entity.singular}
          </button>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-end gap-3 border-y border-white/10 py-3">
        <label className="flex min-w-48 flex-1 flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">Search</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search any field"
            className="h-9 rounded-sm border border-white/15 bg-white/5 px-2 text-sm outline-none focus:border-primary"
          />
        </label>

        {statuses.length > 0 ? (
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">Status</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="h-9 rounded-sm border border-white/15 bg-white/5 px-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">All</option>
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">Sort</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-9 rounded-sm border border-white/15 bg-white/5 px-2 text-sm outline-none focus:border-primary"
          >
            {entity.columns.map((column) => (
              <option key={column.key} value={column.key}>
                {column.label}
              </option>
            ))}
            <option value="updatedAt">Updated</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => setAscending((value) => !value)}
          className="h-9 border border-white/15 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
        >
          {ascending ? 'A→Z' : 'Z→A'}
        </button>

        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-primary">{String(visible.length).padStart(3, '0')}</span> records
        </span>
      </div>

      {selected.size > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            {selected.size} selected
          </span>
          <BulkButton label="Publish" onClick={() => void runBulk('publish')} disabled={busy || !entity.statusField} />
          <BulkButton label="Unpublish" onClick={() => void runBulk('unpublish')} disabled={busy || !entity.statusField} />
          <BulkButton label="Delete" onClick={() => void runBulk('delete')} disabled={busy} />
          <BulkButton label="Restore" onClick={() => void runBulk('restore')} disabled={busy} />
          <BulkButton label="Duplicate" onClick={() => void runBulk('duplicate')} disabled={busy} />
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      ) : null}

      {message ? (
        <p className="mt-3 border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground/90">{message}</p>
      ) : null}

      {creating || editing ? (
        <div className="mt-4">
          <EntityForm
            entity={entity}
            initial={editing ? (editing as EntityValues) : null}
            busy={busy}
            onSubmit={handleSave}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
          />
        </div>
      ) : null}

      {loading ? (
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="mt-8 border border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-muted-foreground">
          No records match the current filters.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 font-mono text-[10px] uppercase tracking-[0.14em] text-metal">
              <tr>
                <th className="w-8 px-2 py-2">
                  <input
                    type="checkbox"
                    aria-label="Select page"
                    checked={pageItems.length > 0 && pageItems.every((row) => selected.has(row.id))}
                    onChange={(event) => {
                      setSelected((current) => {
                        const next = new Set(current);
                        for (const row of pageItems) {
                          if (event.target.checked) next.add(row.id);
                          else next.delete(row.id);
                        }
                        return next;
                      });
                    }}
                    className="accent-[#00e08a]"
                  />
                </th>
                {entity.columns.map((column) => (
                  <th key={column.key} className="px-3 py-2">
                    {column.label}
                  </th>
                ))}
                <th className="px-3 py-2">Updated</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((row) => {
                const deleted = row.deletedAt !== null;

                return (
                  <tr key={row.id} className={`border-t border-white/5 ${deleted ? 'opacity-50' : ''}`}>
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.id}`}
                        checked={selected.has(row.id)}
                        onChange={() => toggleSelection(row.id)}
                        className="accent-[#00e08a]"
                      />
                    </td>
                    {entity.columns.map((column) => (
                      <td key={column.key} className="max-w-72 truncate px-3 py-2">
                        <CellValue row={row} column={column} />
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-muted-foreground">
                      {String(row.updatedAt ?? '').slice(0, 10)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      {deleted ? (
                        <RowButton label="Restore" onClick={() => void restoreRow(row.id)} />
                      ) : (
                        <>
                          <RowButton label="Edit" onClick={() => setEditing(row)} />
                          <RowButton label="Duplicate" onClick={() => void duplicateRow(row.id)} />
                          <RowButton label="Delete" onClick={() => void deleteRow(row.id)} danger />
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 ? (
        <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={safePage === 1}
            className="border border-white/15 px-3 py-1.5 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {safePage} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={safePage === pageCount}
            className="border border-white/15 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );

  async function deleteRow(id: string) {
    if (!repository) return;
    await repository.softDelete(id);
    await refresh();
  }

  async function restoreRow(id: string) {
    if (!repository) return;
    await repository.restore(id);
    await refresh();
  }

  async function duplicateRow(id: string) {
    if (!repository) return;
    await repository.duplicate(id);
    await refresh();
  }
}

function CellValue({ row, column }: { row: Row; column: AdminEntity['columns'][number] }) {
  const value = row[column.key];

  if (value && typeof value === 'object' && 'en' in (value as Record<string, unknown>)) {
    return <span>{String((value as { en?: string }).en ?? '')}</span>;
  }

  if (column.type === 'status') {
    return (
      <span className="border border-white/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {String(value ?? '—')}
      </span>
    );
  }

  if (Array.isArray(value)) {
    return <span>{value.join(', ')}</span>;
  }

  return <span>{value === null || value === undefined || value === '' ? '—' : String(value)}</span>;
}

function BulkButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground transition enabled:hover:text-foreground disabled:opacity-30"
    >
      {label}
    </button>
  );
}

function RowButton({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ml-2 font-mono text-[9px] uppercase tracking-[0.16em] transition hover:underline ${
        danger ? 'text-red-300' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function sortValue(row: Row, key: string): string | number {
  const value = row[key];

  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && 'en' in (value as Record<string, unknown>)) {
    return String((value as { en?: string }).en ?? '').toLowerCase();
  }

  return String(value ?? '').toLowerCase();
}
