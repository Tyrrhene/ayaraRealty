import React, { useEffect, useState } from 'react'
import { Property } from '@/payload-types'
import { PropertyBlock } from '@/blocks/PropertyBlock/Component'

const LIMIT = 24

export default function PageClient() {
  const [properties, setProperties] = useState<Property[]>([])

  const fetchProperties = async () => {
    try {
      const query = new URLSearchParams({
        page: '1',
        limit: String(LIMIT),
        depth: '3',
      })

      const res = await fetch(`/api/properties?${query.toString()}`)

      if (!res.ok) {
        throw new Error(`Fetch failed with status: ${res.status}`)
      }

      const data = await res.json()
      setProperties(data.docs || [])
    } catch (err) {
      console.error('Error fetching properties:', err)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return (
    <div>
      <div className="mb-2 mt-6 ml-[40px]">Viewing {properties.length} Homes for Sale</div>
      <div className="mb-6 mt-2 ml-[40px]">
        Showing listings marketed by all brokers in the searched area.
      </div>

      <div>
        <PropertyBlock properties={properties} />
      </div>
    </div>
  )
}
