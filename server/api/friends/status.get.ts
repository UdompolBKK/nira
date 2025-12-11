// GET /api/friends/status - Check friend status with another user
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

    // Get target user ID from query parameter
    const query = getQuery(event)
    const targetUserId = query.targetUserId as string

    if (!targetUserId) {
      throw createError({ statusCode: 400, message: 'Missing targetUserId parameter' })
    }

    const db = adminFirestore()

    // Check if already friends
    const friendsSnapshot = await db
      .collection('friends')
      .where('userId', '==', currentUserId)
      .where('friendId', '==', targetUserId)
      .get()

    if (!friendsSnapshot.empty) {
      return {
        success: true,
        status: 'friends',
        friendId: friendsSnapshot.docs[0].id
      }
    }

    // Check if pending friend request (current user sent request)
    const requestsSnapshot = await db
      .collection('friendRequests')
      .where('senderId', '==', currentUserId)
      .where('receiverId', '==', targetUserId)
      .where('status', '==', 'pending')
      .get()

    if (!requestsSnapshot.empty) {
      return {
        success: true,
        status: 'pending',
        requestId: requestsSnapshot.docs[0].id
      }
    }

    // No relationship
    return {
      success: true,
      status: 'none'
    }
  } catch (err: any) {
    console.error('Error checking friend status:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
