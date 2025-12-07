// GET /api/emotions/:postId - Get user's emotion for a post
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'

export default defineEventHandler(async (event) => {
  const authUser = await verifyAuth(event)

  const postId = getRouterParam(event, 'postId')
  if (!postId) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  try {
    const db = adminFirestore()
    const emotionId = `${postId}_${authUser.uid}`
    const emotionDoc = await db.collection('emotions').doc(emotionId).get()

    if (emotionDoc.exists) {
      const data = emotionDoc.data()
      return {
        emotion: data?.type || null
      }
    }

    return { emotion: null }
  } catch (err: any) {
    console.error('Error getting user emotion:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
