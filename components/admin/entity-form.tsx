'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AdminEntity, AdminField } from '@/lib/admin/entities';
import { validateValues } from '@/lib/admin/validation';

export type EntityValues = Record<string, unknown>;

interface EntityFormProps {
  entity: AdminEntity;
  initial?: EntityValues | null;
  onSubmit: (values: EntityValues) => Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}

export function EntityForm({ entity, initial, onSubmit, onCancel, busy }: EntityFormProps) {
  const [values, setValues] = useState<EntityValues>({});
  const [error, setError] = useState('');

  useEffect(() => {
    const base: EntityValues = {};

    for (const field of entity.fields) {
      base[field.key] = initial?.[field.key] ?? emptyValue(field);
    }

    setValues(base);
  }, [entity, initial]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const outcome = validateValues(entity, values);

    if (!outcome.valid) {
      setError(outcome.message);
      return;
    }

    setError('');

    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'The record could not be saved.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-white/10 bg-black/40 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide">
          {initial ? `Edit ${entity.singular}` : `New ${entity.singular}`}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {entity.fields.map((field) => (
          <FieldInput
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
          />
        ))}
      </div>

      {error ? (
        <p role="alert" className="mt-4 border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition enabled:hover:bg-primary/20 disabled:opacity-40"
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: AdminField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const label = (
    <Label className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">
      {field.label}
      {field.required ? <span className="text-primary"> *</span> : null}
    </Label>
  );

  if (field.type === 'localized' || field.type === 'localizedTextarea') {
    const localized = isLocalized(value) ? value : { en: '', es: '' };
    const Control = field.type === 'localizedTextarea' ? Textarea : Input;

    return (
      <div className="md:col-span-2">
        {label}
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {(['en', 'es'] as const).map((language) => (
            <div key={language}>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                {language}
              </span>
              <Control
                value={localized[language]}
                onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  onChange({ ...localized, [language]: event.target.value })
                }
                rows={field.type === 'localizedTextarea' ? 3 : undefined}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <label className="block">
        {label}
        <Select
          value={String(value ?? '')}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1.5"
        >
          <option value="">—</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
    );
  }

  if (field.type === 'boolean') {
    return (
      <Label className="mt-6">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 accent-[#00e08a]"
        />
        {field.label}
      </Label>
    );
  }

  if (field.type === 'textarea') {
    return (
      <label className="block md:col-span-2">
        {label}
        <Textarea
          value={String(value ?? '')}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="mt-1.5"
        />
      </label>
    );
  }

  if (field.type === 'list') {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return (
      <label className="block">
        {label}
        <Input
          value={list.join(', ')}
          onChange={(event) =>
            onChange(
              event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter((item) => item.length > 0),
            )
          }
          className="mt-1.5"
        />
      </label>
    );
  }

  return (
    <label className="block">
      {label}
      <Input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={
          field.type === 'number'
            ? value === null || value === undefined
              ? ''
              : String(value)
            : field.type === 'date'
              ? String(value ?? '').slice(0, 10)
              : String(value ?? '')
        }
        onChange={(event) =>
          onChange(
            field.type === 'number'
              ? event.target.value === ''
                ? null
                : Number(event.target.value)
              : event.target.value,
          )
        }
        className="mt-1.5"
      />
      {field.hint ? <span className="mt-1 block text-[10px] text-muted-foreground">{field.hint}</span> : null}
    </label>
  );
}

function emptyValue(field: AdminField): unknown {
  if (field.type === 'localized' || field.type === 'localizedTextarea') return { en: '', es: '' };
  if (field.type === 'list') return [];
  if (field.type === 'number') return null;
  if (field.type === 'boolean') return false;
  return '';
}

function isLocalized(value: unknown): value is { en: string; es: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { en?: unknown }).en === 'string' &&
    typeof (value as { es?: unknown }).es === 'string'
  );
}
