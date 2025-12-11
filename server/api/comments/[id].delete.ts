// DELETE /api/comments/:id - Delete a comment
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const authUser = await verifyAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Comment ID is required' })
  }

  const query = getQuery(event)
  const postId = query.postId as string

  if (!postId) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  try {
    const db = adminFirestore()
    const commentRef = db.collection('comments').doc(id)
    const commentDoc = await commentRef.get()

    if (!commentDoc.exists) {
      throw createError({ statusCode: 404, message: 'Comment not found' })
    }

    const commentData = commentDoc.data()
    if (commentData?.userId !== authUser.uid) {
      throw createError({ statusCode: 403, message: 'คุณไม่มีสิทธิ์ลบความคิดเห็นนี้' })
    }

    await commentRef.delete()

    // Update comment count on post
    await db.collection('storyPosts').doc(postId).update({
      commentCount: FieldValue.increment(-1)
    })

    return { success: true }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error deleting comment:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
