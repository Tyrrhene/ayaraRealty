import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'digital-horizons',
    _status: 'published',

    // ✅ Added to satisfy required fields in your updated schema
    description:
      'Dive into the marvels of modern innovation, where the only constant is change. A journey where pixels and data converge to craft the future.',
    availableUnits: [], // put related unit IDs here later if/when you have units

    // If your relation expects IDs at create time, use [author.id]; otherwise [author] is fine
    authors: [author],

    content: {
      root: {
        type: 'root',
        children: [
          // ...unchanged content...
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description:
        'Dive into the marvels of modern innovation, where the only constant is change. A journey where pixels and data converge to craft the future.',
      image: heroImage.id,
      title: 'Digital Horizons: A Glimpse into Tomorrow',
    },
    relatedPosts: [],
    title: 'Digital Horizons: A Glimpse into Tomorrow',
  }
}