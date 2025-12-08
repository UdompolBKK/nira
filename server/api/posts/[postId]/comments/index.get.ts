// GET /api/posts/:postId/comments - Get comments for a post
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')

  if (!postId) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  try {
    const db = adminFirestore()

    // Get comments from subcollection
    const commentsSnapshot = await db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .get()

    // Get unique author IDs
    const authorIds = [...new Set(commentsSnapshot.docs.map(doc => doc.data().authorId).filter(Boolean))]
    const userProfiles = new Map()

    // Fetch user profiles
    if (authorIds.length > 0) {
      const profilePromises = authorIds.map(async (authorId) => {
        try {
          const profileDoc = await db.collection('users').doc(authorId as string).get()
          if (profileDoc.exists) {
            const profileData = profileDoc.data()
            return [authorId, {
              anonymousName: profileData?.anonymousName || profileData?.displayName || 'ไม่ระบุชื่อ'
            }]
          }
        } catch (err) {
          console.error(`Error fetching profile for user ${authorId}:`, err)
        }
        return [authorId, { anonymousName: 'ไม่ระบุชื่อ' }]
      })

      const profiles = await Promise.all(profilePromises)
      profiles.forEach(([authorId, profile]) => {
        userProfiles.set(authorId, profile)
      })
    }

    // Map comments with user profiles
    const comments = commentsSnapshot.docs.map(doc => {
      const data = doc.data()
      const userProfile = userProfiles.get(data.authorId) || { anonymousName: 'ไม่ระบุชื่อ' }

      return {
        id: doc.id,
        content: data.content,
        authorName: userProfile.anonymousName,
        authorId: data.authorId,
        createdAt: data.createdAt?.toDate?.() || new Date()
      }
    })

    return { comments }
  } catch (err: any) {
    console.error('Error getting comments:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
