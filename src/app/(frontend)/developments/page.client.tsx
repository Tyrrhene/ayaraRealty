'use client'

import React, { useEffect, useState } from 'react'
import type { Property } from '@/payload-types'

const PageClient: React.FC = () => {
  const [Developments, setDevelopments] = useState<Property[]>([])

  useEffect(() => {
    console.log('✅ useEffect ran')
  }, [])

  console.log('✅ PageClient rendered')

  return <div className="p-8 text-lg">Properties Page</div>
}

export default PageClient
