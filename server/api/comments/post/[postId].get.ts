// GET /api/comments/post/:postId - Get comments for a post
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')
  if (!postId) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  const query = getQuery(event)
  const limitCount = Math.min(parseInt(query.limit as string) || 50, 100)

  try {
    const db = adminFirestore()
    const snapshot = await db.collection('comments')
      .where('postId', '==', postId)
      .orderBy('isPriority', 'desc')
      .orderBy('createdAt', 'asc')
      .limit(limitCount)
      .get()

    const comments = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    })

    return { comments }
  } catch (err: any) {
    console.error('Error getting comments:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
