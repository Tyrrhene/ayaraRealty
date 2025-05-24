import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Property } from '@/blocks/PropertyBlock/config'
import ImageCarousel from '@/components/ImageCarousel'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const similarProperties = await payload.find({
    collection: 'properties',
    limit: 5,
    depth: 1,
    where: {
      status: { equals: 'For Sale' },
    },
  })

  const properties = await payload.find({
    collection: 'properties',
    draft: false,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    depth: 4,
    select: {
      id: true, // <-- select id
    },
  })

  const params = properties.docs.map(({ id }) => {
    return { slug: id } // <-- map id to slug
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/properties/' + slug
  const post = await queryPostBySlug({ slug })

  const payload = await getPayload({ config: configPromise })
  const similarProperties = await payload.find({
    collection: 'properties',
    limit: 5,
    depth: 1,
    where: {
      status: { equals: 'For Sale' },
    },
  })

  if (!post) return <PayloadRedirects url={url} />
  console.log(post)

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Top Grid: Image and Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left side: Property content */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Property Image */}
          <ImageCarousel images={post.images.map((imageObj) => imageObj.image)} />

          {/* Property Title */}
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          {/* Property Price */}
          <div className="text-red-500 text-2xl font-semibold">฿ {post.price.toLocaleString()}</div>
          {/* Property Details */}
          <div className="flex flex-wrap gap-6 text-gray-700 text-sm border-t border-b py-4">
            <div className="flex items-center gap-2">
              🏠 <span>{post.property_type}</span>
            </div>
            <div className="flex items-center gap-2">
              📍 <span>Location not set</span> {/* (optional) */}
            </div>
            <div className="flex items-center gap-2">
              🛏️ <span>{post.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              🛁 <span>{post.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              📐 <span>{post.area_sqft} sqft</span>
            </div>
            <div className="flex items-center gap-2">
              🏷️ <span>{post.status}</span>
            </div>
          </div>
          {/* Property Description */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Property Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {post.description ||
                'Wongamat Beach House For Sale (200m walk to beach) This property is an amazing investment opportunity with VERY HIGH RENTAL yield. Brand new house. Seaview wongamat beach & koh larn. 200 meter walking to beach. This is an perfect airbnb and daily rental unit. Freehold property. Property information: * 200sqm living area * 3 bedroom * 4 bathroom * 1 Big rooftop lounge terrace with Seaview to koh larn   * 2 balconys * open space livingroom, dining and kitchen first floor. * Laundry room * Freehold Property, Chanote. * No common fee. Highlights: * Brand New Development ‼️ * 200 meter walk to wongamat beach * Seaview * Private rooftop terrace * Top Location * Airbnb and daily rental friendly ✅ * All furniture included ✅ Nearby Attractions & Future Developments: * 100 meter to wongamat night market, Tops Supermarket & 7eleven. * 100 meter to Surf & Turf Beach Club, Colonial Bar & Restaurant * 500 meter walking to the glass house * Central Festival new beach shopping mall is coming only 300 meter away. * Sourrounded by high end restaurangs and beach clubs * 2km to terminal 21 shopping mall'}
            </p>
          </div>
        </div>

        {/* Right side: Contact Form */}
        {/* Right side: Contact Form */}
        {/* Right side: Contact Form + Map */}
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
                defaultValue={`Hi, I'm interested in ${post.title}`}
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
            <p className="text-sm text-gray-600">Get quick info about this property</p>
            <a
              href="tel:+66123456789"
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded transition"
            >
              📞 Call Now
            </a>
          </div>

          {/* Google Map Embed — OUTSIDE the form box */}
          {
            <div className="mt-2 border rounded-md overflow-hidden shadow-sm">
              <iframe
                className="w-full h-96"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`${post.google_maps_location}&t=k&output=embed`}
              ></iframe>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.findByID({
    collection: 'properties',
    id: slug, // <-- id, not slug!
    draft,
    overrideAccess: true,
  })

  return result || null
})
