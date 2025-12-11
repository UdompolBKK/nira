// GET /api/posts/search?q=keyword - Search posts
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const keyword = (query.q as string || '').trim().toLowerCase()
  const limitCount = Math.min(parseInt(query.limit as string) || 20, 100)

  if (!keyword) {
    return { posts: [] }
  }

  try {
    const db = adminFirestore()

    // Get public posts and filter client-side
    // For production, use Algolia or Firebase Extensions for full-text search
    const snapshot = await db.collection('storyPosts')
      .where('visibility', '==', 'public')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    // Filter posts by keyword
    const filteredDocs = snapshot.docs.filter(doc => {
      const data = doc.data()
      const content = data.content as string | undefined
      const tags = data.tags as string[] | undefined
      return content?.toLowerCase().includes(keyword) ||
        tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
    }).slice(0, limitCount)

    // Fetch user profiles for author data
    const userIds = [...new Set(filteredDocs.map(doc => doc.data().userId).filter(Boolean))]
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

    const posts = filteredDocs.map(doc => {
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
    console.error('Error searching posts:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
