// POST /api/posts - Create new post
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const user = await verifyAuth(event)
  const body = await readBody(event)

  const { content, visibility, isLocked, tags, moodCategory } = body

  if (!content) {
    throw createError({ statusCode: 400, message: 'Content is required' })
  }

  try {
    const db = adminFirestore()

    // Get user profile for author info
    const userDoc = await db.collection('users').doc(user.uid).get()
    const userData = userDoc.data()

    const postData: Record<string, any> = {
      userId: user.uid,
      authorName: userData?.displayName || 'ไม่ระบุชื่อ',
      content,
      excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150),
      visibility: visibility || 'public',
      isLocked: isLocked || false,
      tags: tags || [],
      moodCategory: moodCategory || 'normal',
      likeCount: 0,
      sadCount: 0,
      happyCount: 0,
      commentCount: 0,
      viewCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    if (userData?.slug) postData.authorSlug = userData.slug
    if (userData?.photoURL) postData.authorPhoto = userData.photoURL

    const docRef = await db.collection('posts').add(postData)

    return {
      success: true,
      id: docRef.id
    }
  } catch (err: any) {
    console.error('Error creating post:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
