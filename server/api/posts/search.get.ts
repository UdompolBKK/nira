// GET /api/posts/search?q=keyword - Search posts
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const keyword = (query.q as string || '').trim().toLowerCase()
  const limitCount = Math.min(parseInt(query.limit as string) || 20, 100)

  if (!keyword) {
    return { posts: [] }
  }

  try {
    const db = adminFirestore()

    // Get public posts and filter client-side
    // For production, use Algolia or Firebase Extensions for full-text search
    const snapshot = await db.collection('posts')
      .where('visibility', '==', 'public')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    const posts = snapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          content: data.content as string | undefined,
          tags: data.tags as string[] | undefined,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        }
      })
      .filter(post =>
        post.content?.toLowerCase().includes(keyword) ||
        post.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
      )
      .slice(0, limitCount)

    return { posts }
  } catch (err: any) {
    console.error('Error searching posts:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
