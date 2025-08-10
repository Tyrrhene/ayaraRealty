'use client'

import React, { useEffect, useState } from 'react'
import type { Property } from '@/payload-types'
import RichText from '@/components/RichText'
import Link from 'next/link'

const LIMIT = 6
const DISPLAY_PAGE_RANGE = 5

export const PropertyLandingBlock: React.FC<{
  id?: string
  introContent?: any
}> = ({ id, introContent }) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await fetch(`/api/properties?page=${page}&limit=${LIMIT}&depth=1`)
      const data = await res.json()

      setProperties(data.docs)
      setTotalPages(data.totalPages || 1)
    }

    fetchProperties()
  }, [page])

  const getPageNumbers = () => {
    const start = Math.max(1, page - Math.floor(DISPLAY_PAGE_RANGE / 2))
    const end = Math.min(totalPages, start + DISPLAY_PAGE_RANGE - 1)
    const correctedStart = Math.max(1, end - DISPLAY_PAGE_RANGE + 1)
    return Array.from({ length: end - correctedStart + 1 }, (_, i) => correctedStart + i)
  }

  return (
    <div className="my-12" id={`block-${id}`}>
      <div className="container mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {introContent && (
          <div className="mb-4 lg:mb-0">
            <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
          </div>
        )}
      </div>

      <div className="container px-[40px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="w-full rounded overflow-hidden shadow-lg hover:shadow-xl bg-white transition transform hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full">
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src={property.images?.[0]?.image?.url ?? '/placeholder.jpg'}
                  alt={property.title ?? 'Property image'}
                />
              </div>

              <div className="flex-1 px-6 py-4 flex flex-col justify-between border border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{property.title}</h2>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <div className="rounded-full bg-blue-600 py-1 px-2 text-xs font-medium text-white">
                      {property.property_type || 'Property'}
                    </div>
                    <div className="rounded-full bg-yellow-500 py-1 px-2 text-xs font-medium text-white">
                      {property.status || 'For Sale'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center">
                      <img src="https://img.icons8.com/windows/24/null/bedroom.png" />
                      <p className="ml-2 text-sm font-medium text-gray-700">
                        {property.bedrooms} Bedrooms
                      </p>
                    </div>
                    <div className="flex items-center">
                      <img src="https://img.icons8.com/pastel-glyph/24/null/bath--v2.png" />
                      <p className="ml-2 text-sm font-medium text-gray-700">
                        {property.bathrooms} Bathrooms
                      </p>
                    </div>
                    <div className="flex items-center">
                      <img src="https://img.icons8.com/ios-glyphs/24/null/expand--v1.png" />
                      <p className="ml-2 text-sm font-medium text-gray-700">
                        {property.area_square_meters} square meters
                      </p>
                    </div>
                  </div>

                  <p className="text-2xl font-extrabold">${property.price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-3 flex-wrap justify-center mt-12 mr-12">
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-4 py-2 text-lg rounded-lg transition ${
                page === num
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
