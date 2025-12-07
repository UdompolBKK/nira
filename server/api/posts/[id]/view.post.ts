// POST /api/posts/:id/view - Increment view count
import { adminFirestore } from '~/server/utils/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  try {
    const db = adminFirestore()
    const postRef = db.collection('posts').doc(id)

    await postRef.update({
      viewCount: FieldValue.increment(1)
    })

    return { success: true }
  } catch (err: any) {
    console.error('Error incrementing view:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
