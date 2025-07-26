import type { Metadata } from 'next/types'
import dynamicImport from 'next/dynamic'

// Dynamically load client component with SSR disabled
const PageClient = dynamicImport(() => import('./page.client'), { ssr: false })

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
