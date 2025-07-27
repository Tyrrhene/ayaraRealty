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
    sortBy: 'default', // Added
  })

  const fetchProperties = async () => {
    try {
      const query = new URLSearchParams({
        page: '1',
        limit: String(LIMIT),
        depth: '3',
      })

      if (filters.bedrooms > 0)
        query.append('where[bedrooms][greater_than_equal]', String(filters.bedrooms))

      if (filters.minPrice > 0)
        query.append('where[price][greater_than_equal]', String(filters.minPrice))

      if (filters.maxPrice > 0)
        query.append('where[price][less_than_equal]', String(filters.maxPrice))

      const res = await fetch(`/api/properties?${query.toString()}`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)

      const data = await res.json()
      setProperties(data.docs || [])
    } catch (err) {
      console.error('Failed to fetch properties:', err)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [filters])

  console.log('properties for slug' + properties)

  return (
    <div>
      <PropertiesSearchHeader filters={filters} setFilters={setFilters} />
      <div className="mb-2 mt-6 ml-[40px]">Viewing {properties.length} Homes for Sale</div>
      <div className="mb-6 mt-2 ml-[40px]">
        Showing listings marketed by all brokers in the searched area.
      </div>
      <SortDropdown
        sortBy={filters.sortBy}
        setSortBy={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
      />

      <div>
        <PropertyBlock properties={properties} />
      </div>
    </div>
  )
}
