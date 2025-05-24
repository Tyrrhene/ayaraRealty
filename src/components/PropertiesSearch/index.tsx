'use client'

import React from 'react'

export const PropertiesSearch: React.FC<{
  filters: {
    bedrooms: number
    development: string
    type: string
    location: string
    minPrice: number
    maxPrice: number
  }
  setFilters: React.Dispatch<React.SetStateAction<typeof filters>>
}> = ({ filters, setFilters }) => {
  return (
    <div className="pt-1 pb-1 bg-[#FEFEFF] text-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap gap-4 justify-between">
          {/** Development */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Development</label>
            <select className="mt-1 block w-40 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm">
              <option>Developments</option>
            </select>
          </div>

          {/** Looking For */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Looking For</label>
            <select className="mt-1 block w-40 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm">
              <option>Houses</option>
            </select>
          </div>

          {/** Locations */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Locations</label>
            <select className="mt-1 block w-40 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm">
              <option>All Locations</option>
            </select>
          </div>

          {/** Bedrooms */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Bedrooms</label>
            <select
              className="mt-1 block w-40 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm"
              value={filters.bedrooms}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, bedrooms: Number(e.target.value) }))
              }
            >
              <option value={0}>Any</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </div>

          {/** Min Budget */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Min Budget</label>
            <select
              className="mt-1 block w-40 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev: typeof filters) => ({
                  ...prev,
                  minPrice: Number(e.target.value),
                }))
              }
            >
              <option value={0}>No Min</option>
              {[...Array(20)].map((_, i) => {
                const value = (i + 1) * 50000
                return (
                  <option key={value} value={value}>
                    ${value.toLocaleString()}
                  </option>
                )
              })}
            </select>
          </div>

          {/** Max Budget */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Max Budget</label>
            <select
              className="mt-1 block w-40 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev: typeof filters) => ({
                  ...prev,
                  maxPrice: Number(e.target.value),
                }))
              }
            >
              <option value={0}>No Max</option>
              {[...Array(20)].map((_, i) => {
                const value = (i + 1) * 50000
                return (
                  <option key={value} value={value}>
                    ${value.toLocaleString()}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
