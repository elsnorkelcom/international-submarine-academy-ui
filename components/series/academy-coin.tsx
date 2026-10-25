'use client'

import Image from 'next/image'
import { useRef, type PointerEvent } from 'react'

const EDGE_LAYERS = Array.from({ length: 15 }, (_, i) => i - 7)
const HALF_THICKNESS = 8

type AcademyCoinProps = {
  glow: string
  seasonLabel: string
  className?: string
}

export function AcademyCoin({ glow, seasonLabel, className = '' }: AcademyCoinProps) {
  const tiltRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const tilt = tiltRef.current
    if (!tilt || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    tilt.style.transform = `rotateX(${(-y * 28).toFixed(1)}deg) rotateY(${(x * 28).toFixed(1)}deg)`
  }

  function resetTilt() {
    if (tiltRef.current) tiltRef.current.style.transform = 'rotateX(8deg) rotateY(0deg)'
  }

  return (
    <div
      className={`relative aspect-square [perspective:1100px] ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      role="img"
      aria-label={`Moneda de la International Submarine Academy, ${seasonLabel}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-[12%] rounded-full opacity-60 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: glow }}
      />
      <div
        ref={tiltRef}
        className="relative size-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{ transform: 'rotateX(8deg) rotateY(0deg)' }}
      >
        <div className="relative size-full motion-safe:animate-coin-spin [transform-style:preserve-3d]">
          {EDGE_LAYERS.map((z) => (
            <div
              key={z}
              aria-hidden="true"
              className="absolute inset-[1.5%] rounded-full bg-gradient-to-r from-[#5c4312] via-[#e3bb5c] to-[#5c4312]"
              style={{ transform: `translateZ(${z}px)` }}
            />
          ))}

          <div
            className="absolute inset-0 overflow-hidden rounded-full [backface-visibility:hidden]"
            style={{ transform: `translateZ(${HALF_THICKNESS}px)` }}
          >
            <Image
              src="/images/academy-logo.png"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 320px, 176px"
              className="object-contain"
            />
            <div className="coin-sheen absolute inset-0 rounded-full mix-blend-overlay motion-safe:animate-coin-sheen" />
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-full border-[6px] border-[#b98c2e] bg-[radial-gradient(circle_at_35%_30%,#f3d488,#b98c2e_55%,#6e5016)] text-[#3b2a07] shadow-[inset_0_0_24px_rgba(0,0,0,0.45)] [backface-visibility:hidden]"
            style={{ transform: `rotateY(180deg) translateZ(${HALF_THICKNESS}px)` }}
          >
            <span className="font-display text-[0.6em] font-bold uppercase tracking-[0.3em] md:text-xs">
              Submarine Academy
            </span>
            <span className="my-1 font-display text-5xl font-extrabold uppercase leading-none md:text-7xl">
              STEM+A
            </span>
            <span className="font-mono text-[0.6em] uppercase tracking-[0.25em] md:text-[11px]">
              {seasonLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
