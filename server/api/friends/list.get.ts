// GET /api/friends/list - Get user's friend list
import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    // Get Firebase Auth token
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth().verifyIdToken(token)
    const currentUserId = decodedToken.uid

    const db = adminFirestore()

    // Get all friendships where current user is userId
    const friendsSnapshot = await db
      .collection('friends')
      .where('userId', '==', currentUserId)
      .get()

    // Get friend user details
    const friendPromises = friendsSnapshot.docs.map(async (friendDoc) => {
      const friendId = friendDoc.data().friendId
      const userDoc = await db.collection('users').doc(friendId).get()

      if (userDoc.exists) {
        const userData = userDoc.data()
        return {
          id: friendId,
          displayName: userData?.displayName || userData?.anonymousName || 'ผู้ใช้',
          photoURL: userData?.photoURL || null,
          slug: userData?.slug || null,
          createdAt: friendDoc.data().createdAt
        }
      }
      return null
    })

    const friends = (await Promise.all(friendPromises)).filter(f => f !== null)

    return { success: true, friends }
  } catch (err: any) {
    console.error('Error fetching friends:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
