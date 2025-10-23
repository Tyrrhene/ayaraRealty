'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type ImageLike = string | { url?: string } | { image?: string } | { image?: { url?: string } }

type Props = {
  images: ImageLike[]
  aspectRatio?: string
  unoptimized?: boolean
  className?: string
}

function getSrc(img: ImageLike): string | undefined {
  if (typeof img === 'string') return img
  if (!img) return undefined
  // @ts-ignore
  if (img.url) return img.url
  // @ts-ignore
  if (img.image && typeof img.image === 'string') return img.image
  // @ts-ignore
  if (img.image?.url) return img.image.url
  return undefined
}

const ImageCarouselCard: React.FC<Props> = ({
  images,
  aspectRatio = '4 / 3',
  unoptimized,
  className = '',
}) => {
  const sources = images.map(getSrc).filter(Boolean) as string[]
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [restReady, setRestReady] = useState(false) // render the rest only after first loads
  const hasMany = sources.length > 1

  const go = (dir: 1 | -1) =>
    hasMany && restReady && setCurrent((i) => (i + dir + sources.length) % sources.length)

  // after the first finishes loading, preload others (browser cache)
  useEffect(() => {
    if (!restReady || sources.length < 2) return
    sources.slice(1).forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [restReady, sources])

  // keyboard nav
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [hasMany, restReady, sources.length])

  // swipe
  const startX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches?.[0]
    if (t) startX.current = t.clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null || !restReady) return
    const t = e.changedTouches?.[0]
    if (!t) return
    const dx = t.clientX - startX.current
    if (dx > 30) go(-1)
    if (dx < -30) go(1)
    startX.current = null
  }

  if (sources.length === 0) return null

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`select-none ${className}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg bg-gray-100"
        style={{ aspectRatio }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* --- First image only (eager). Renders immediately. --- */}
        {!restReady && (
          <Image
            src={sources[0]}
            alt="Image 1"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover absolute inset-0"
            unoptimized={unoptimized}
            priority
            loading="eager"
            onLoadingComplete={() => setRestReady(true)}
          />
        )}

        {/* --- After first loads, render all stacked (fade, cached) --- */}
        {restReady && (
          <div className="relative w-full h-full">
            {sources.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`Image ${i + 1} of ${sources.length}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-cover absolute inset-0 transition-opacity duration-500 ${
                  i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                unoptimized={unoptimized}
                loading="lazy"
                style={{ pointerEvents: i === current ? 'auto' : 'none' }}
              />
            ))}
          </div>
        )}

        {/* Buttons (only when many; hide until rest is ready to avoid navigating to unloaded imgs) */}
        {hasMany && (
          <>
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                go(-1)
              }}
              disabled={!restReady}
              className={`absolute left-2 top-1/2 -translate-y-1/2
                         bg-white/80 hover:bg-white text-black
                         rounded-full w-11 h-11 sm:w-12 sm:h-12
                         flex items-center justify-center text-2xl font-bold
                         transition-opacity duration-300 z-20
                         ${hovered && restReady ? 'opacity-100' : 'opacity-0'}
                         ${!restReady ? 'cursor-not-allowed opacity-0' : ''}`}
            >
              ‹
            </button>

            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                go(1)
              }}
              disabled={!restReady}
              className={`absolute right-2 top-1/2 -translate-y-1/2
                         bg-white/80 hover:bg-white text-black
                         rounded-full w-11 h-11 sm:w-12 sm:h-12
                         flex items-center justify-center text-2xl font-bold
                         transition-opacity duration-300 z-20
                         ${hovered && restReady ? 'opacity-100' : 'opacity-0'}
                         ${!restReady ? 'cursor-not-allowed opacity-0' : ''}`}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageCarouselCard
