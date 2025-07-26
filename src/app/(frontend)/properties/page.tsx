import type { Metadata } from 'next'
import dynamicImport from 'next/dynamic' // ✅ Rename this

const PageClient = dynamicImport(() => import('./page.client'), { ssr: false })

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Payload Website Template Properties',
}

export default function Page() {
  return <PageClient />
}
