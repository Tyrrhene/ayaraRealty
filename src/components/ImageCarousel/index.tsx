'use client'

import React, { useState } from 'react'

type ImageCarouselProps = {
  images: string[]
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0)
  console.log(images)

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Main Image test */}
      <div className="flex-1">
        <img
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="rounded-lg w-full h-auto object-cover"
        />
        <div className="text-right text-xs text-gray-500 mt-2">
          {current + 1}/{images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            className={`border rounded overflow-hidden w-20 h-20 ${
              current === index ? 'border-red-500' : 'border-gray-300'
            }`}
            onClick={() => setCurrent(index)}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
