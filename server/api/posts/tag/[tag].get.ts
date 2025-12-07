// GET /api/posts/tag/:tag - Get posts by tag
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const tag = getRouterParam(event, 'tag')
  if (!tag) {
    throw createError({ statusCode: 400, message: 'Tag is required' })
  }

  const query = getQuery(event)
  const limitCount = Math.min(parseInt(query.limit as string) || 20, 100)

  try {
    const db = adminFirestore()
    const snapshot = await db.collection('posts')
      .where('visibility', '==', 'public')
      .where('tags', 'array-contains', tag)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get()

    const posts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    })

    return { posts }
  } catch (err: any) {
    console.error('Error getting posts by tag:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
