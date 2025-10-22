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
  // Handle nested shapes like { image: { url } }
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
  }, [sources.length])

  // swipe support
  const startX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches && e.touches[0]
    if (touch) startX.current = touch.clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return
    const touch = e.changedTouches && e.changedTouches[0]
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
      className={`select-none ${className}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          key={current}
          src={sources[current]}
          alt={`Image ${current + 1} of ${sources.length}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300"
          unoptimized={unoptimized}
        />

        {hasMany && (
          <>
            {/* Prev */}
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
                         transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            >
              ‹
            </button>

            {/* Next */}
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
                         transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
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
