// GET /api/posts - Get public posts feed
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limitCount = Math.min(parseInt(query.limit as string) || 10, 50)
  const startAfterTimestamp = query.startAfter as string

  try {
    const db = adminFirestore()
    let postsQuery = db.collection('posts')
      .where('visibility', '==', 'public')
      .orderBy('createdAt', 'desc')
      .limit(limitCount)

    if (startAfterTimestamp) {
      const startDate = new Date(startAfterTimestamp)
      postsQuery = db.collection('posts')
        .where('visibility', '==', 'public')
        .orderBy('createdAt', 'desc')
        .startAfter(startDate)
        .limit(limitCount)
    }

    const snapshot = await postsQuery.get()
    const posts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    })

    return {
      posts,
      hasMore: posts.length === limitCount
    }
  } catch (err: any) {
    console.error('Error getting posts:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
