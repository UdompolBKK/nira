// PUT /api/posts/:id - Update post
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const user = await verifyAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  const body = await readBody(event)

  try {
    const db = adminFirestore()
    const postRef = db.collection('posts').doc(id)
    const postDoc = await postRef.get()

    if (!postDoc.exists) {
      throw createError({ statusCode: 404, message: 'Post not found' })
    }

    // Verify ownership
    if (postDoc.data()?.userId !== user.uid) {
      throw createError({ statusCode: 403, message: 'คุณไม่มีสิทธิ์แก้ไขโพสต์นี้' })
    }

    const updateData: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp()
    }

    const allowedFields = ['content', 'visibility', 'isLocked', 'tags', 'moodCategory']
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (body.content) {
      updateData.excerpt = body.content.replace(/<[^>]*>/g, '').substring(0, 150)
    }

    await postRef.update(updateData)

    return { success: true }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error updating post:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
