import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'

import { generateMeta } from '@/utilities/generateMeta'
import ImageCarousel from '@/components/ImageCarousel'
import { AvailableUnitsBlock } from '@/blocks/AvailableUnitsBlock/Component'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function DevelopmentPage({ params: paramsPromise }: Args) {
  const payload = await getPayload({ config: configPromise })

  const { slug = '' } = await paramsPromise
  const development = await queryDevelopmentBySlug({ slug })

  if (!development) {
    notFound()
  }

  console.log('✅ Development fetched units', development?.units)
  console.log(development)

  // Ensure each property has all required fields for Property type
  const properties = (development.availableUnits ?? []).map((unit: any) => ({
    id: unit.id,
    title: unit.title,
    slug: unit.slug,
    description: unit.description ?? '',
    google_maps_location: unit.google_maps_location ?? '',
    price: unit.price ?? 0,
    images: unit.images ?? [],
    status: unit.status ?? '',
    bedrooms: unit.bedrooms ?? 0,
    bathrooms: unit.bathrooms ?? 0,
    area: unit.area ?? 0,
    property_type: unit.property_type ?? '',
    area_square_meters: unit.area_square_meters ?? unit.area ?? 0,
    createdAt: unit.createdAt ?? new Date().toISOString(),
    updatedAt: unit.updatedAt ?? new Date().toISOString(),
    // Add other required fields with sensible defaults if missing
  }))

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Top Grid: Image and Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left side: Property content */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Property Image */}
          <ImageCarousel images={(development.images ?? []).map((imgObj: any) => imgObj.image)} />

          {/* Property Title */}
          <h1 className="text-3xl font-bold text-gray-900">{development.title}</h1>

          {/* Property Price */}
          {'price' in development && typeof development.price === 'number' ? (
            <div className="text-red-500 text-2xl font-semibold">
              ฿ {development.price.toLocaleString()}
            </div>
          ) : null}

          {/* Property Details */}
          <div className="flex flex-wrap gap-6 text-gray-700 text-sm border-t border-b py-4">
            <div className="flex items-center gap-2">
              🏷️ <span>{development.status}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Property Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {development.description ||
                'Wongamat Beach House For Sale (200m walk to beach) This property is an amazing investment opportunity with VERY HIGH RENTAL yield. Brand new house. Seaview wongamat beach & koh larn. 200 meter walking to beach. This is an perfect airbnb and daily rental unit. Freehold property. Property information: * 200sqm living area * 3 bedroom * 4 bathroom * 1 Big rooftop lounge terrace with Seaview to koh larn   * 2 balconys * open space livingroom, dining and kitchen first floor. * Laundry room * Freehold Property, Chanote. * No common fee. Highlights: * Brand New Development ‼️ * 200 meter walk to wongamat beach * Seaview * Private rooftop terrace * Top Location * Airbnb and daily rental friendly ✅ * All furniture included ✅ Nearby Attractions & Future Developments: * 100 meter to wongamat night market, Tops Supermarket & 7eleven. * 100 meter to Surf & Turf Beach Club, Colonial Bar & Restaurant * 500 meter walking to the glass house * Central Festival new beach shopping mall is coming only 300 meter away. * Sourrounded by high end restaurangs and beach clubs * 2km to terminal 21 shopping mall'}
            </p>
          </div>

          {/* Available Units */}
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Available Units</h3>
          {(development.availableUnits?.length ?? 0) > 0 ? (
            <AvailableUnitsBlock properties={properties} />
          ) : (
            <p className="mt-8">No properties found or loading...</p>
          )}
        </div>

        {/* Right side: Contact Form + Call Agent */}
        <div className="flex flex-col gap-4 h-fit">
          {/* Contact Form */}
          <div className="p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 text-center">Request Information</h2>
            <form className="flex flex-col gap-3">
              <input type="text" placeholder="Name" className="border rounded px-3 py-2 text-sm" />
              <input
                type="email"
                placeholder="Email"
                className="border rounded px-3 py-2 text-sm"
              />
              <input
                type="phone"
                placeholder="Phone"
                className="border rounded px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Message"
                className="border rounded px-3 py-2 text-sm"
                rows={3}
                defaultValue={`Hi, I'm interested in ${development.title}`}
              />
              <button
                type="submit"
                className="bg-red-500 text-white py-2 text-sm rounded hover:bg-red-600 transition"
              >
                Send
              </button>
            </form>
          </div>

          {/* Call Agent Box */}
          <div className="mt-2 p-4 border rounded-lg shadow-md bg-white flex flex-col gap-2 text-center">
            <h3 className="text-lg font-semibold text-gray-800">Call Agent</h3>
            <p className="text-sm text-gray-600">
              Contact our agent for quick info on this property
            </p>
            <a
              href="tel:+66968155224"
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded transition"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const development = await queryDevelopmentBySlug({ slug })

  if (!development) {
    return {
      title: 'Development not found',
      description: 'The requested development could not be located.',
    }
  }

  return generateMeta({ doc: development })
}

const queryDevelopmentBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.findByID({
    collection: 'developments',
    id: slug, // using id, not slug
    draft,
    overrideAccess: true,
  })

  return result || null
})
