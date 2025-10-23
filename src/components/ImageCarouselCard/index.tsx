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
  // Handle nested structures like { image: { url } }
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
  const hasMany = sources.length > 1

  const go = (dir: 1 | -1) =>
    hasMany && setCurrent((i) => (i + dir + sources.length) % sources.length)

  // Preload next/prev
  useEffect(() => {
    if (!hasMany) return
    const next = new window.Image()
    next.src = sources[(current + 1) % sources.length]!
    const prev = new window.Image()
    prev.src = sources[(current - 1 + sources.length) % sources.length]!
  }, [current, hasMany, sources])

  // Keyboard navigation
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
  }, [sources.length])

  // Swipe support
  const startX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches?.[0]
    if (touch) startX.current = touch.clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return
    const touch = e.changedTouches?.[0]
    if (!touch) return
    const dx = touch.clientX - startX.current
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
      // We detect hover/focus on the whole wrapper for cards wrapped in <Link>
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
        {/* Images (stacked, fade transition) */}
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
              priority={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              style={{ pointerEvents: i === current ? 'auto' : 'none' }}
            />
          ))}
        </div>

        {/* Buttons (always on top, fade in/out) */}
        {hasMany && (
          <>
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                go(-1)
              }}
              className={`absolute left-2 top-1/2 -translate-y-1/2
                         bg-white/80 hover:bg-white text-black
                         rounded-full w-11 h-11 sm:w-12 sm:h-12
                         flex items-center justify-center text-2xl font-bold
                         transition-opacity duration-300 z-20
                         ${hovered ? 'opacity-100' : 'opacity-0'}`}
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
              className={`absolute right-2 top-1/2 -translate-y-1/2
                         bg-white/80 hover:bg-white text-black
                         rounded-full w-11 h-11 sm:w-12 sm:h-12
                         flex items-center justify-center text-2xl font-bold
                         transition-opacity duration-300 z-20
                         ${hovered ? 'opacity-100' : 'opacity-0'}`}
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
