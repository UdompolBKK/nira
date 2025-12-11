// GET /api/posts - Get public posts feed
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limitCount = Math.min(parseInt(query.limit as string) || 10, 50)
  const startAfterTimestamp = query.startAfter as string
  const postType = query.postType as string // 'vent' or 'story'
  const moodFilter = query.moodFilter as string // e.g., 'bad,worst,critical'

  try {
    const db = adminFirestore()
    let postsQuery = db.collection('storyPosts')
      .where('visibility', '==', 'public')

    // Filter by postType if provided
    if (postType) {
      postsQuery = postsQuery.where('postType', '==', postType)
    }

    // Filter by moodCategory if provided
    if (moodFilter) {
      const moodCategories = moodFilter.split(',')
      postsQuery = postsQuery.where('moodCategory', 'in', moodCategories)
    }

    postsQuery = postsQuery
      .orderBy('createdAt', 'desc')
      .limit(limitCount)

    if (startAfterTimestamp) {
      const startDate = new Date(startAfterTimestamp)
      postsQuery = postsQuery.startAfter(startDate)
    }

    const snapshot = await postsQuery.get()

    // Fetch user profiles (displayName, slug, photoURL from users collection)
    const userIds = [...new Set(snapshot.docs.map(doc => doc.data().userId).filter(Boolean))]
    const userProfiles = new Map()

    if (userIds.length > 0) {
      const profilePromises = userIds.map(async (userId) => {
        try {
          const profileDoc = await db.collection('users').doc(userId).get()
          if (profileDoc.exists) {
            const profileData = profileDoc.data()
            return [userId, {
              displayName: profileData?.displayName || profileData?.slug || 'ไม่ระบุชื่อ',
              slug: profileData?.slug || null,
              photoURL: profileData?.photoURL || null
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

    return {
      posts,
      hasMore: posts.length === limitCount
    }
  } catch (err: any) {
    console.error('Error getting posts:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
