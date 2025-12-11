// GET /api/vents - Get public vent posts feed
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limitCount = Math.min(parseInt(query.limit as string) || 10, 50)
  const startAfterTimestamp = query.startAfter as string
  const roomId = query.roomId as string

  try {
    const db = adminFirestore()
    let ventsQuery: FirebaseFirestore.Query = db.collection('ventPosts')

    // Filter by room if roomId is provided
    if (roomId) {
      ventsQuery = ventsQuery.where('roomId', '==', roomId)
    }

    ventsQuery = ventsQuery.orderBy('createdAt', 'desc').limit(limitCount)

    if (startAfterTimestamp) {
      const startDate = new Date(startAfterTimestamp)
      ventsQuery = ventsQuery.startAfter(startDate)
    }

    const snapshot = await ventsQuery.get()

    // Fetch user profiles (anonymousName and photoURL)
    const authorIds = [...new Set(snapshot.docs.map(doc => doc.data().authorId).filter(Boolean))]
    const userProfiles = new Map()

    if (authorIds.length > 0) {
      const profilePromises = authorIds.map(async (authorId) => {
        try {
          const profileDoc = await db.collection('users').doc(authorId).get()
          if (profileDoc.exists) {
            const profileData = profileDoc.data()
            return [authorId, {
              anonymousName: profileData?.anonymousName || profileData?.displayName || 'ไม่ระบุชื่อ',
              photoURL: profileData?.photoURL || null
            }]
          }
        } catch (err) {
          console.error(`Error fetching profile for user ${authorId}:`, err)
        }
        return [authorId, { anonymousName: 'ไม่ระบุชื่อ', photoURL: null }]
      })

      const profiles = await Promise.all(profilePromises)
      profiles.forEach(([authorId, profile]) => {
        userProfiles.set(authorId, profile)
      })
    }

    const vents = snapshot.docs.map(doc => {
      const data = doc.data()
      const userProfile = userProfiles.get(data.authorId) || { anonymousName: 'ไม่ระบุชื่อ', photoURL: null }

      // Debug: Log the first post to see the structure
      if (snapshot.docs[0].id === doc.id) {
        console.log('[vents API] First post data:', {
          id: doc.id,
          likes: data.likes,
          likesCount: data.likesCount,
          likeCount: data.likeCount,
          allKeys: Object.keys(data)
        })
      }

      // Calculate like count properly
      const likeCount = typeof data.likesCount === 'number'
        ? data.likesCount
        : (typeof data.likes === 'number'
          ? data.likes
          : (Array.isArray(data.likes) ? data.likes.length : 0))

      return {
        id: doc.id,
        userId: data.authorId,
        authorName: userProfile.anonymousName,
        authorPhoto: userProfile.photoURL,
        content: data.content,
        excerpt: data.excerpt || data.content?.replace(/<[^>]*>/g, '').substring(0, 150),
        moodCategory: data.moodCategory || 'normal',
        roomId: data.roomId || null,
        likeCount: likeCount,
        commentCount: data.commentsCount || 0,
        viewCount: data.viewCount || 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.editedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date()
      }
    })

    return {
      vents,
      hasMore: vents.length === limitCount
    }
  } catch (err: any) {
    console.error('Error getting vents:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
