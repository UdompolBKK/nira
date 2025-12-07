// DELETE /api/posts/:id - Delete post
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'

export default defineEventHandler(async (event) => {
  const user = await verifyAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  try {
    const db = adminFirestore()
    const postRef = db.collection('posts').doc(id)
    const postDoc = await postRef.get()

    if (!postDoc.exists) {
      throw createError({ statusCode: 404, message: 'Post not found' })
    }

    // Verify ownership
    if (postDoc.data()?.userId !== user.uid) {
      throw createError({ statusCode: 403, message: 'คุณไม่มีสิทธิ์ลบโพสต์นี้' })
    }

    await postRef.delete()

    return { success: true }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error deleting post:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
