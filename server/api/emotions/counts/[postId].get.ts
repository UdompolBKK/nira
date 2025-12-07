// GET /api/emotions/counts/:postId - Get emotion counts for a post
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')
  if (!postId) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  try {
    const db = adminFirestore()
    const postDoc = await db.collection('posts').doc(postId).get()

    if (!postDoc.exists) {
      return {
        counts: { like: 0, sad: 0, happy: 0 }
      }
    }

    const data = postDoc.data()
    return {
      counts: {
        like: data?.likeCount || 0,
        sad: data?.sadCount || 0,
        happy: data?.happyCount || 0
      }
    }
  } catch (err: any) {
    console.error('Error getting emotion counts:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
