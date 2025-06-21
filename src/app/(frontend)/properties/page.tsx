import type { Metadata } from 'next/types'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
  return <PageClient />
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Properties`,
  }
}
