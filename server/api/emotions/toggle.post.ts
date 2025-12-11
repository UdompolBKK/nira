// POST /api/emotions/toggle - Toggle emotion on a post
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'
import { FieldValue } from 'firebase-admin/firestore'

type EmotionType = 'like' | 'sad' | 'happy'

export default defineEventHandler(async (event) => {
  const authUser = await verifyAuth(event)

  const body = await readBody(event)
  const { postId, type } = body as { postId: string; type: EmotionType }

  if (!postId || !type) {
    throw createError({ statusCode: 400, message: 'Post ID and emotion type are required' })
  }

  if (!['like', 'sad', 'happy'].includes(type)) {
    throw createError({ statusCode: 400, message: 'Invalid emotion type' })
  }

  try {
    const db = adminFirestore()
    const emotionId = `${postId}_${authUser.uid}`
    const emotionRef = db.collection('emotions').doc(emotionId)
    const postRef = db.collection('storyPosts').doc(postId)

    const emotionDoc = await emotionRef.get()

    let action: 'added' | 'removed' | 'changed' = 'added'
    let previousType: EmotionType | null = null

    if (emotionDoc.exists) {
      const existingType = emotionDoc.data()?.type as EmotionType
      previousType = existingType

      if (existingType === type) {
        // Same emotion - remove it
        await emotionRef.delete()
        await postRef.update({
          [`${type}Count`]: FieldValue.increment(-1)
        })
        action = 'removed'
      } else {
        // Different emotion - update it
        await emotionRef.set({
          postId,
          userId: authUser.uid,
          type,
          createdAt: FieldValue.serverTimestamp()
        })
        await postRef.update({
          [`${existingType}Count`]: FieldValue.increment(-1),
          [`${type}Count`]: FieldValue.increment(1)
        })
        action = 'changed'
      }
    } else {
      // New emotion
      await emotionRef.set({
        postId,
        userId: authUser.uid,
        type,
        createdAt: FieldValue.serverTimestamp()
      })
      await postRef.update({
        [`${type}Count`]: FieldValue.increment(1)
      })
      action = 'added'
    }

    return {
      success: true,
      action,
      previousType,
      currentType: action === 'removed' ? null : type
    }
  } catch (err: any) {
    console.error('Error toggling emotion:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
