'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const PageClient = dynamic(() => import('./page.client'), { ssr: false })

export default function PageClientWrapper() {
  return <PageClient />
}
