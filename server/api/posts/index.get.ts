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
    let postsQuery = db.collection('posts')
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

    // Fetch user profiles for anonymous names
    const userIds = [...new Set(snapshot.docs.map(doc => doc.data().userId).filter(Boolean))]
    const userProfiles = new Map()

    if (userIds.length > 0) {
      const profilePromises = userIds.map(async (userId) => {
        try {
          const profileDoc = await db.collection('users').doc(userId).get()
          if (profileDoc.exists) {
            const profileData = profileDoc.data()
            return [userId, {
              anonymousName: profileData?.anonymousName || 'ไม่ระบุชื่อ',
              authorPhoto: profileData?.photoURL || null
            }]
          }
        } catch (err) {
          console.error(`Error fetching profile for user ${userId}:`, err)
        }
        return [userId, { anonymousName: 'ไม่ระบุชื่อ', authorPhoto: null }]
      })

      const profiles = await Promise.all(profilePromises)
      profiles.forEach(([userId, profile]) => {
        userProfiles.set(userId, profile)
      })
    }

    const posts = snapshot.docs.map(doc => {
      const data = doc.data()
      const userProfile = userProfiles.get(data.userId) || { anonymousName: 'ไม่ระบุชื่อ', authorPhoto: null }

      return {
        id: doc.id,
        ...data,
        authorName: userProfile.anonymousName,
        authorPhoto: userProfile.authorPhoto,
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
