'use client'

import type { Metadata } from 'next/types'
import PageClient from './page.client'

export default function Page() {
  return <PageClient />
}

export const metadata: Metadata = {
  title: `Payload Website Template Properties`,
}
