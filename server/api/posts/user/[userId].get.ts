// GET /api/posts/user/:userId - Get posts by specific user
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  if (!userId) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  const query = getQuery(event)
  const limitCount = Math.min(parseInt(query.limit as string) || 10, 100)
  const order = query.order === 'asc' ? 'asc' : 'desc'

  try {
    const db = adminFirestore()
    const snapshot = await db.collection('posts')
      .where('userId', '==', userId)
      .orderBy('createdAt', order as 'asc' | 'desc')
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
    console.error('Error getting user posts:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
