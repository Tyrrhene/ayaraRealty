import type { PostArgs } from './post-1'
import { RequiredDataFromCollectionSlug } from 'payload'

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'another-post',
    _status: 'published',

    // ✅ required by your current schema
    description: 'Short summary for this post.',
    availableUnits: [], // keep [] if none yet; use unit IDs if/when you have them

    authors: [author], // or [author.id] if your schema expects IDs
    content: {
      root: {
        type: 'root',
        children: [
          // ...your existing nodes...
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      title: 'Another Post',
      description: 'Short summary for this post.',
      image: heroImage.id,
    },
    relatedPosts: [],
    title: 'Another Post',
  }
}