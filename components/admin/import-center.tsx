'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import type { ImportMode } from '@/lib/data/repository';
import { parseCsv, toCsv, toObjects, type ParsedCsv } from '@/lib/import/csv';
import { guessMapping, missingRequiredFields } from '@/lib/import/mapping';
import { runImport, templateCsv, type ImportReport } from '@/lib/import/run';
import { IMPORT_SPECS, type EntityImportSpec } from '@/lib/import/schemas';

type Step = 'file' | 'mapping' | 'report';

export function ImportCenter() {
  const { database } = useApp();
  const [spec, setSpec] = useState<EntityImportSpec>(IMPORT_SPECS[0]);
  const [csv, setCsv] = useState<ParsedCsv | null>(null);
  const [fileName, setFileName] = useState('');
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<ImportMode>('create-only');
  const [step, setStep] = useState<Step>('file');
  const [report, setReport] = useState<ImportReport | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const objects = useMemo(() => (csv ? toObjects(csv) : []), [csv]);
  const missing = useMemo(() => missingRequiredFields(mapping, spec), [mapping, spec]);

  function reset(nextSpec?: EntityImportSpec) {
    setCsv(null);
    setFileName('');
    setMapping({});
    setReport(null);
    setStep('file');
    setError('');

    if (nextSpec) {
      setSpec(nextSpec);
    }
  }

  async function handleFile(file: File) {
    setError('');
    const text = await file.text();

    try {
      const parsed = parseCsv(text);

      if (parsed.headers.length === 0) {
        setError('The file has no header row.');
        return;
      }

      setCsv(parsed);
      setFileName(file.name);
      setMapping(guessMapping(parsed.headers, spec));
      setStep('mapping');
    } catch {
      setError('The file could not be parsed.');
    }
  }

  async function handleRun() {
    if (!database || !csv) {
      return;
    }

    setRunning(true);
    setError('');

    try {
      const result = await runImport({ database, spec, objects, mapping, mode });
      setReport(result);
      setStep('report');
    } catch {
      setError('The import failed before writing data.');
    } finally {
      setRunning(false);
    }
  }

  function download(name: string, content: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Admin // Import</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          CSV Import Center
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Map any column layout into ISA entities. Every row is validated independently, and failed
          rows never block the rest of the file.
        </p>
      </header>

      <ol className="mt-8 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
        <StepBadge index="1" label="File" active={step === 'file'} done={step !== 'file'} />
        <StepBadge index="2" label="Mapping" active={step === 'mapping'} done={step === 'report'} />
        <StepBadge index="3" label="Report" active={step === 'report'} done={false} />
      </ol>

      {step === 'file' ? (
        <section className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-metal" htmlFor="entity">
              Target entity
            </label>
            <select
              id="entity"
              value={spec.collection}
              onChange={(event) => {
                const next = IMPORT_SPECS.find((item) => item.collection === event.target.value);
                if (next) reset(next);
              }}
              className="mt-2 h-10 w-full rounded-sm border border-white/15 bg-white/5 px-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              {IMPORT_SPECS.map((item) => (
                <option key={item.collection} value={item.collection}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted-foreground">{spec.description}</p>

            <button
              type="button"
              onClick={() => download(`${spec.collection}-template.csv`, templateCsv(spec))}
              className="mt-4 w-full border border-white/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition hover:border-primary hover:text-primary"
            >
              Download template
            </button>
          </div>

          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files[0];
              if (file) void handleFile(file);
            }}
            className="flex min-h-56 flex-col items-center justify-center gap-3 border border-dashed border-white/20 bg-white/[0.02] p-6 text-center"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Drop a CSV file here
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
            >
              Choose file
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Column names are not fixed: you map them in the next step.
            </p>
          </div>
        </section>
      ) : null}

      {step === 'mapping' && csv ? (
        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-4 border-y border-white/10 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-primary">{fileName}</span>
            <span>
              {csv.rows.length} rows · {csv.headers.length} columns · delimiter "{csv.delimiter}"
            </span>
            <button type="button" onClick={() => reset()} className="ml-auto text-muted-foreground hover:text-foreground">
              Change file
            </button>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Column mapping</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {spec.fields.map((field) => (
                  <label key={field.key} className="flex items-center gap-2">
                    <span className="w-40 shrink-0 truncate text-xs text-muted-foreground" title={field.label}>
                      {field.label}
                      {field.required ? <span className="text-primary"> *</span> : null}
                    </span>
                    <select
                      value={mapping[field.key] ?? ''}
                      onChange={(event) =>
                        setMapping((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      className="h-8 min-w-0 flex-1 rounded-sm border border-white/15 bg-white/5 px-1 text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="">— not mapped —</option>
                      {csv.headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              {missing.length > 0 ? (
                <p className="mt-4 border border-amber-300/40 bg-amber-300/5 px-3 py-2 text-xs text-amber-200">
                  Missing required: {missing.map((field) => field.label).join(', ')}
                </p>
              ) : null}
            </div>

            <aside className="border border-white/10 bg-white/[0.02] p-4">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Import mode</h2>
              {(['create-only', 'upsert', 'replace'] as ImportMode[]).map((option) => (
                <label key={option} className="mt-3 flex items-start gap-2 text-xs text-foreground">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === option}
                    onChange={() => setMode(option)}
                    className="mt-0.5 accent-[#00e08a]"
                  />
                  <span>
                    <span className="font-mono uppercase tracking-[0.14em]">{option}</span>
                    <span className="mt-0.5 block text-muted-foreground">
                      {option === 'create-only'
                        ? 'Insert new IDs, skip existing ones.'
                        : option === 'upsert'
                          ? 'Insert new IDs, update existing ones.'
                          : 'Clear the entity first, then insert.'}
                    </span>
                  </span>
                </label>
              ))}

              <button
                type="button"
                disabled={running || missing.length > 0 || objects.length === 0}
                onClick={() => void handleRun()}
                className="mt-5 w-full border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition enabled:hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {running ? 'Importing…' : `Import ${objects.length} rows`}
              </button>
            </aside>
          </div>

          <div className="mt-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Preview · first rows</h2>
            <div className="mt-3 overflow-x-auto border border-white/10">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-white/5 font-mono text-[10px] uppercase tracking-[0.14em] text-metal">
                  <tr>
                    {spec.fields.filter((field) => mapping[field.key]).map((field) => (
                      <th key={field.key} className="whitespace-nowrap px-3 py-2">
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {objects.slice(0, 4).map((object, index) => (
                    <tr key={index} className="border-t border-white/5">
                      {spec.fields
                        .filter((field) => mapping[field.key])
                        .map((field) => (
                          <td key={field.key} className="max-w-64 truncate px-3 py-2 text-foreground/90">
                            {object[mapping[field.key]] || '—'}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {step === 'report' && report ? (
        <section className="mt-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Import report</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-6">
            <Metric label="Rows" value={report.total} />
            <Metric label="Created" value={report.created} tone="good" />
            <Metric label="Updated" value={report.updated} tone="good" />
            <Metric label="Skipped" value={report.skipped} />
            <Metric label="Failed" value={report.failed} tone={report.failed > 0 ? 'bad' : undefined} />
            <Metric label="Mode" value={report.mode} />
          </dl>

          {report.issues.length > 0 ? (
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Issues</h3>
                <button
                  type="button"
                  onClick={() =>
                    download(
                      'import-errors.csv',
                      toCsv(
                        ['row', 'severity', 'message'],
                        report.issues.map((issue) => [issue.row, issue.severity, issue.message]),
                      ),
                    )
                  }
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary"
                >
                  Download errors CSV
                </button>
              </div>
              <div className="mt-2 max-h-72 overflow-auto border border-white/10">
                <table className="min-w-full text-left text-xs">
                  <tbody>
                    {report.issues.map((issue, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="w-20 px-3 py-1.5 font-mono text-[10px] text-metal">L{issue.row}</td>
                        <td className="w-16 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]">
                          <span className={issue.severity === 'error' ? 'text-red-300' : 'text-amber-200'}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-foreground/90">{issue.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="mt-5 border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-primary">
              Every row was imported without issues.
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition hover:border-primary hover:text-primary"
            >
              Import another file
            </button>
            <Link
              href="/museums"
              className="border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition hover:border-primary hover:text-primary"
            >
              View archive
            </Link>
          </div>
        </section>
      ) : null}

      {error ? (
        <p role="alert" className="mt-5 border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StepBadge({ index, label, active, done }: { index: string; label: string; active: boolean; done: boolean }) {
  return (
    <li
      className={`flex items-center gap-2 border px-3 py-1.5 ${
        active ? 'border-primary/50 text-primary' : done ? 'border-white/20 text-foreground' : 'border-white/10 text-muted-foreground'
      }`}
    >
      <span className="text-metal">{index}</span>
      {label}
    </li>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: 'good' | 'bad';
}) {
  const color = tone === 'good' ? 'text-primary' : tone === 'bad' ? 'text-red-300' : 'text-foreground';

  return (
    <div className="border border-white/10 px-3 py-2">
      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-metal">{label}</dt>
      <dd className={`mt-1 font-display text-lg font-bold ${color}`}>{value}</dd>
    </div>
  );
}
