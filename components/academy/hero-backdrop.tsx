'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Mission } from '@/lib/missions'

export function HeroBackdrop({ mission }: { mission: Mission }) {
  const [layers, setLayers] = useState<Mission[]>([mission])

  const current = layers[layers.length - 1]
  if (current.id !== mission.id) {
    setLayers([current, mission])
  }

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-background" aria-hidden="true">
      {layers.map((layer, index) => (
        <BackdropLayer key={layer.id} mission={layer} isEntering={index === layers.length - 1 && layers.length > 1} />
      ))}
    </div>
  )
}

function BackdropLayer({ mission, isEntering }: { mission: Mission; isEntering: boolean }) {
  const [videoFailed, setVideoFailed] = useState(false)
  const showVideo = mission.video && !videoFailed

  return (
    <div className={isEntering ? 'absolute inset-0 animate-in fade-in duration-1000' : 'absolute inset-0'}>
      {showVideo ? (
        <video
          src={mission.video}
          poster={mission.image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
          className="size-full object-cover object-center"
        />
      ) : (
        <Image
          src={mission.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center motion-safe:animate-hero-drift"
        />
      )}
    </div>
  )
}
