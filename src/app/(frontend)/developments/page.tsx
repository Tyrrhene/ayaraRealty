'use client'

import React, { useEffect, useState } from 'react'
import { Development } from '@/payload-types'
import { DevelopmentBlock } from '@/blocks/DevelopmentBlock/Component'

const LIMIT = 24

export default function PageClient() {
  const [developments, setDevelopments] = useState<Development[]>([])

  const fetchDevelopments = async () => {
    try {
      const query = new URLSearchParams({
        page: '1',
        limit: String(LIMIT),
        depth: '3',
      })

      const res = await fetch(`/api/developments?${query.toString()}`)

      if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`)

      const data = await res.json()
      setDevelopments(data.docs || [])
      console.log('✅ developments fetched:', data.docs)
    } catch (err) {
      console.error('❌ Failed to fetch properties:', err)
    }
  }

  useEffect(() => {
    console.log('📦 Filters updated:')
    fetchDevelopments()
  }, [])

  return (
    <div className="px-10">
      {developments.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold mt-8 ml-10">New Developments In Pattaya</h1>
          <DevelopmentBlock developments={developments} />
        </>
      ) : (
        <p className="mt-8">No Developments found or loading...</p>
      )}
    </div>
  )
}
