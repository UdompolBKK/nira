// PUT /api/comments/:id - Update a comment
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const authUser = await verifyAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Comment ID is required' })
  }

  const body = await readBody(event)
  const { content } = body

  if (!content?.trim()) {
    throw createError({ statusCode: 400, message: 'Content is required' })
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
      throw createError({ statusCode: 403, message: 'คุณไม่มีสิทธิ์แก้ไขความคิดเห็นนี้' })
    }

    await commentRef.update({
      content: content.trim(),
      updatedAt: FieldValue.serverTimestamp()
    })

    return { success: true }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error updating comment:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
