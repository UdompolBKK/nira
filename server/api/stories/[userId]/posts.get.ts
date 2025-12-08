// GET /api/stories/:userId/posts - Get user's public posts for stories view
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  const query = getQuery(event)
  const viewerId = query.viewerId as string // Current logged-in user ID

  if (!userId) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  try {
    const db = adminFirestore()

    // Get user's public posts
    const postsSnapshot = await db
      .collection('posts')
      .where('userId', '==', userId)
      .where('visibility', '==', 'public')
      .orderBy('createdAt', 'asc')
      .limit(50)
      .get()

    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data()
      const isLocked = data.isLocked === true
      const isOwner = viewerId === userId

      return {
        id: doc.id,
        userId: data.userId,
        // If locked and viewer is not owner, don't send content
        content: (isLocked && !isOwner) ? null : data.content,
        excerpt: data.excerpt,
        moodCategory: data.moodCategory,
        likesCount: data.likesCount || 0,
        commentsCount: data.commentsCount || 0,
        viewCount: data.viewCount || 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        visibility: data.visibility,
        isLocked: isLocked
      }
    })

    return { posts }
  } catch (err: any) {
    console.error('Error getting user stories:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
