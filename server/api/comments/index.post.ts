// POST /api/comments - Create a new comment
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const authUser = await verifyAuth(event)

  const body = await readBody(event)
  const { postId, content } = body

  if (!postId || !content?.trim()) {
    throw createError({ statusCode: 400, message: 'Post ID and content are required' })
  }

  try {
    const db = adminFirestore()

    // Get user profile for author info
    const userDoc = await db.collection('users').doc(authUser.uid).get()
    const userData = userDoc.data()

    const commentData = {
      postId,
      userId: authUser.uid,
      authorName: userData?.displayName || 'ไม่ระบุชื่อ',
      authorPhoto: userData?.photoURL || null,
      content: content.trim(),
      isPriority: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    const docRef = await db.collection('comments').add(commentData)

    // Update comment count on post
    await db.collection('posts').doc(postId).update({
      commentCount: FieldValue.increment(1)
    })

    return {
      success: true,
      commentId: docRef.id,
      comment: {
        id: docRef.id,
        ...commentData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  } catch (err: any) {
    console.error('Error creating comment:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
