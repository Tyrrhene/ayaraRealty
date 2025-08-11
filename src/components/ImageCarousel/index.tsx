'use client'

import React, { useState } from 'react'

type ImageObject = { url: string }
type ImageCarouselProps = { images: ImageObject[] }

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0)
  const go = (dir: 1 | -1) => setCurrent((i) => (i + dir + images.length) % images.length)

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Main image */}
      <div className="relative flex-1 rounded-lg overflow-hidden">
        {images.length > 0 && (
          <img
            src={images[current]?.url}
            alt={`Image ${current + 1}`}
            loading="lazy"
            className="block w-full h-auto object-cover"
          />
        )}

        {/* Prev / Next - full-height side overlays clipped to the rounded container */}
        <button
          aria-label="Previous image"
          onClick={() => go(-1)}
          className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center
                     bg-black/20 hover:bg-black/30 text-white transition"
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          onClick={() => go(1)}
          className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center
                     bg-black/20 hover:bg-black/30 text-white transition"
        >
          ›
        </button>
      </div>

      <div className="text-right text-xs text-gray-500 mt-2 md:mt-0 md:absolute md:sr-only">
        {current + 1}/{images.length}
      </div>

      {/* Thumbnails rail (scrollable) */}
      <div
        className="
          flex md:flex-col gap-2
          overflow-x-auto md:overflow-x-hidden md:overflow-y-auto
          md:max-h-[420px] md:pr-1
        "
        aria-label="Image thumbnails"
      >
        {images.map((img, index) => (
          <button
            key={index}
            className={`border rounded overflow-hidden w-20 h-20 shrink-0 md:shrink
              ${current === index ? 'border-red-500' : 'border-gray-300'}`}
            onClick={() => setCurrent(index)}
          >
            <img
              src={img.url}
              alt={`Thumbnail ${index + 1}`}
              loading="lazy"
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
