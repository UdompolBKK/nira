// GET /api/posts/tag/:tag - Get posts by tag
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const tag = getRouterParam(event, 'tag')
  if (!tag) {
    throw createError({ statusCode: 400, message: 'Tag is required' })
  }

  const query = getQuery(event)
  const limitCount = Math.min(parseInt(query.limit as string) || 20, 100)

  try {
    const db = adminFirestore()
    const snapshot = await db.collection('storyPosts')
      .where('visibility', '==', 'public')
      .where('tags', 'array-contains', tag)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get()

    // Fetch user profiles for author data
    const userIds = [...new Set(snapshot.docs.map(doc => doc.data().userId).filter(Boolean))]
    const userProfiles = new Map()

    if (userIds.length > 0) {
      const profilePromises = userIds.map(async (userId) => {
        try {
          const userDoc = await db.collection('users').doc(userId).get()
          if (userDoc.exists) {
            const userData = userDoc.data()
            return [userId, {
              displayName: userData?.displayName || userData?.slug || 'ไม่ระบุชื่อ',
              slug: userData?.slug || null,
              photoURL: userData?.photoURL || null
            }]
          }
        } catch (err) {
          console.error(`Error fetching profile for user ${userId}:`, err)
        }
        return [userId, { displayName: 'ไม่ระบุชื่อ', slug: null, photoURL: null }]
      })

      const profiles = await Promise.all(profilePromises)
      profiles.forEach(([userId, profile]) => {
        userProfiles.set(userId, profile)
      })
    }

    const posts = snapshot.docs.map(doc => {
      const data = doc.data()
      const userProfile = userProfiles.get(data.userId) || { displayName: 'ไม่ระบุชื่อ', slug: null, photoURL: null }

      return {
        id: doc.id,
        ...data,
        authorName: userProfile.displayName,
        authorSlug: userProfile.slug,
        authorPhoto: userProfile.photoURL,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    })

    return { posts }
  } catch (err: any) {
    console.error('Error getting posts by tag:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
