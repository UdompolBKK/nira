// GET /api/posts/my - Get current user's posts
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'

export default defineEventHandler(async (event) => {
  const user = await verifyAuth(event)
  const query = getQuery(event)
  const limitCount = Math.min(parseInt(query.limit as string) || 20, 100)

  try {
    const db = adminFirestore()
    const snapshot = await db.collection('posts')
      .where('userId', '==', user.uid)
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
    console.error('Error getting my posts:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
