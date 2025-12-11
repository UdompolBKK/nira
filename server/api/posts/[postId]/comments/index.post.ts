// POST /api/posts/:postId/comments - Add a comment to a post
import { adminFirestore } from '~/server/utils/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')
  const body = await readBody(event)

  if (!postId) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  const { content, authorId } = body

  if (!content || !authorId) {
    throw createError({ statusCode: 400, message: 'Content and authorId are required' })
  }

  try {
    const db = adminFirestore()

    // Get user profile for anonymousName
    let authorName = 'ไม่ระบุชื่อ'
    try {
      const userDoc = await db.collection('users').doc(authorId).get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        authorName = userData?.anonymousName || userData?.displayName || 'ไม่ระบุชื่อ'
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }

    // Add comment to subcollection
    const commentRef = await db
      .collection('storyPosts')
      .doc(postId)
      .collection('comments')
      .add({
        content,
        authorId,
        createdAt: FieldValue.serverTimestamp()
      })

    // Update comment count on post
    await db
      .collection('storyPosts')
      .doc(postId)
      .update({
        commentsCount: FieldValue.increment(1)
      })

    return {
      success: true,
      comment: {
        id: commentRef.id,
        content,
        authorName,
        authorId,
        createdAt: new Date()
      }
    }
  } catch (err: any) {
    console.error('Error adding comment:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
