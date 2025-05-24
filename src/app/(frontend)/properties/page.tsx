import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { PropertyBlock } from '@/blocks/PropertyBlock/Component'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const properties = await payload.find({
    collection: 'properties',
    depth: 2,
    limit: 12,
    overrideAccess: true,
    select: {
      title: true,
    },
  })

  return (
    <div className="">
      <PageClient />

      <div className="container mb-6 mt-6">Viewing 24 of 217 Homes for Sale</div>
      {/* <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>properties</h1>
        </div>
      </div> */}

      <div className="container mt-6">
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            name="sort"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="default"
          >
            <option value="default">Select</option>
            <option value="price-asc">Lowest Price</option>
            <option value="price-desc">Highest Price</option>
            <option value="newest">Newest Listed</option>
            <option value="oldest">Oldest Listed</option>
          </select>
        </div>
      </div>

      <PropertyBlock properties={properties.docs} />

      {/* <div className="container">
        {properties.totalPages > 1 && properties.page && (
          <Pagination page={properties.page} totalPages={properties.totalPages} />
        )}
      </div> */}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Properties`,
  }
}
