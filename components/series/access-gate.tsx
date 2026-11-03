'use client'

import Image from 'next/image'
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react'

const SESSION_STORAGE_KEY = 'isa-evaluation-access'
const ACCESS_GRANTED_VALUE = 'granted'
const FALLBACK_EVALUATION_CODE = 'ISA-DEMO'

const evaluationCode = process.env.NEXT_PUBLIC_ISA_EVALUATION_CODE?.trim() || FALLBACK_EVALUATION_CODE

export function AccessGate({ children }: { children: ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false)
  const [code, setCode] = useState('')
  const [hasError, setHasError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      setHasAccess(window.sessionStorage.getItem(SESSION_STORAGE_KEY) === ACCESS_GRANTED_VALUE)
    } catch {
      // Si el navegador bloquea sessionStorage, el filtro sigue funcionando durante esta visita.
    }
  }, [])

  useEffect(() => {
    if (!hasAccess) {
      inputRef.current?.focus()
    }
  }, [hasAccess, hasError])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (code === evaluationCode) {
      try {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, ACCESS_GRANTED_VALUE)
      } catch {
        // El acceso se mantiene en memoria si el navegador no permite guardar la sesión.
      }
      setHasAccess(true)
      return
    }

    setCode('')
    setHasError(true)
  }

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />

      <section
        aria-labelledby="access-gate-title"
        className="relative w-full max-w-lg border border-white/10 bg-black/75 p-7 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex size-32 items-center justify-center rounded-full border border-primary/30 bg-black/35 p-4 shadow-[0_0_36px_rgba(0,255,136,0.16)]">
            <Image
              src="/images/academy-logo.png"
              alt="Logo de International Submarine Academy"
              width={128}
              height={128}
              priority
              className="size-full object-contain"
            />
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground">
            ISA <span className="text-primary">Series</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">Acceso restringido</span>
        </div>

        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-primary">Filtro de evaluación</p>
        <h1 id="access-gate-title" className="font-display text-6xl font-extrabold uppercase leading-[0.84] tracking-tight text-foreground sm:text-7xl">
          Clasificado
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
          Introducí el código de evaluación para acceder a la serie vertical de International Submarine Academy.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="evaluation-code" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-metal">
              Código de evaluación
            </label>
            <input
              ref={inputRef}
              id="evaluation-code"
              name="evaluation-code"
              type="password"
              value={code}
              onChange={(event) => {
                setCode(event.target.value)
                if (hasError) setHasError(false)
              }}
              aria-describedby="evaluation-error"
              aria-invalid={hasError}
              autoComplete="current-password"
              className="h-12 w-full rounded-sm border border-white/15 bg-white/5 px-4 font-mono text-sm tracking-widest text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Ingresá el código"
            />
            <p id="evaluation-error" className="mt-2 min-h-5 text-sm text-red-300" role="alert" aria-live="polite">
              {hasError ? 'El código ingresado no es válido.' : ''}
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-primary px-5 font-display text-sm font-bold uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Verificar acceso
          </button>
        </form>

      </section>
    </main>
  )
}
