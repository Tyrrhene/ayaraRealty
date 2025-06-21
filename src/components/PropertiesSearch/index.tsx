'use client'

import React from 'react'

export const PropertiesSearchHeader: React.FC<{
  filters: {
    bedrooms: number
    development: string
    type: string
    location: string
    minPrice: number
    maxPrice: number
  }
  setFilters: React.Dispatch<React.SetStateAction<any>>
}> = ({ filters, setFilters }) => {
  return (
    <div className="w-screen flex justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl">
        <div className="flex flex-wrap justify-center gap-6">
          {/* Common Fields */}
          {[
            {
              label: 'Development',
              value: filters.development,
              onChange: (v: string) => setFilters((prev: any) => ({ ...prev, development: v })),
              options: ['All Developments', 'Dev A', 'Dev B'],
              key: 'development',
            },
            {
              label: 'Type',
              value: filters.type,
              onChange: (v: string) => setFilters((prev: any) => ({ ...prev, type: v })),
              options: ['All Types', 'House', 'Condo', 'Loft'],
              key: 'type',
            },
            {
              label: 'Location',
              value: filters.location,
              onChange: (v: string) => setFilters((prev: any) => ({ ...prev, location: v })),
              options: ['All Locations', 'Bangkok', 'Pattaya'],
              key: 'location',
            },
          ].map(({ label, value, onChange, options, key }) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <select
                className="mt-1 w-44 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              >
                {options.map((opt, i) => (
                  <option key={i} value={opt === options[0] ? '' : opt.toLowerCase()}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Bedrooms */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Bedrooms</label>
            <select
              className="mt-1 w-44 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filters.bedrooms}
              onChange={(e) =>
                setFilters((prev: any) => ({ ...prev, bedrooms: Number(e.target.value) }))
              }
            >
              <option value={0}>Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          {[
            { label: 'Min Price', key: 'minPrice', value: filters.minPrice },
            { label: 'Max Price', key: 'maxPrice', value: filters.maxPrice },
          ].map(({ label, key, value }) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <select
                className="mt-1 w-44 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={value}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    [key]: Number(e.target.value),
                  }))
                }
              >
                <option value={0}>{label === 'Min Price' ? 'No Min' : 'No Max'}</option>
                {[...Array(20)].map((_, i) => {
                  const val = (i + 1) * 50000
                  return (
                    <option key={val} value={val}>
                      ${val.toLocaleString()}
                    </option>
                  )
                })}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
