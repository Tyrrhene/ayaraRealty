// app/properties/page.client.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Property } from '@/payload-types'
import { PropertyBlock } from '@/blocks/PropertyBlock/Component'
import { PropertiesSearchHeader } from '@/components/PropertiesSearchHeader'
import { SortDropdown } from '@/components/SortDropdown'

const LIMIT = 24

export default function PageClient() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filters, setFilters] = useState({
    bedrooms: 0,
    development: '',
    type: '',
    location: '',
    minPrice: 0,
    maxPrice: 0,
    sortBy: 'default',
  })

  const fetchProperties = async () => {
    try {
      const query = new URLSearchParams({
        page: '1',
        limit: String(LIMIT),
        depth: '3',
      })

      if (filters.bedrooms > 0) {
        query.append('where[bedrooms][greater_than_equal]', String(filters.bedrooms))
      }

      if (filters.minPrice > 0) {
        query.append('where[price][greater_than_equal]', String(filters.minPrice))
      }

      if (filters.maxPrice > 0) {
        query.append('where[price][less_than_equal]', String(filters.maxPrice))
      }

      // Add sort logic here if needed
      const res = await fetch(`/api/properties?${query.toString()}`)

      if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`)

      const data = await res.json()
      setProperties(data.docs || [])
      console.log('✅ Properties fetched:', data.docs)
    } catch (err) {
      console.error('❌ Failed to fetch properties:', err)
    }
  }

  useEffect(() => {
    console.log('📦 Filters updated:', filters)
    fetchProperties()
  }, [filters])

  return (
    <div className="px-10">
      <PropertiesSearchHeader filters={filters} setFilters={setFilters} />

      <div className="mb-2 mt-6">Viewing {properties.length} Homes for Sale</div>
      <div className="mb-6 mt-2">
        Showing listings marketed by all brokers in the searched area.
      </div>

      <SortDropdown
        sortBy={filters.sortBy}
        setSortBy={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
      />

      {properties.length > 0 ? (
        <PropertyBlock properties={properties} />
      ) : (
        <p className="mt-8">No properties found or loading...</p>
      )}
    </div>
  )
}
