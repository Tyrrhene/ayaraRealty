import type { Metadata } from 'next'
import PageClientWrapper from './PageClientWrapper'

export const metadata: Metadata = {
  title: 'Payload Website Template Properties',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
  return <PageClientWrapper />
}
