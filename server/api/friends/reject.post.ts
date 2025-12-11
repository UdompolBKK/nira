// POST /api/friends/reject - Reject friend request
import { adminFirestore } from '~/server/utils/firebase-admin'
import { adminAuth } from '~/server/utils/firebase-admin'

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

    const body = await readBody(event)
    let { requestId, senderId, notificationId } = body

    const db = adminFirestore()

    // If no requestId, try to find it from friendRequests collection
    if (!requestId && senderId) {
      const requestQuery = await db.collection('friendRequests')
        .where('senderId', '==', senderId)
        .where('receiverId', '==', currentUserId)
        .where('status', '==', 'pending')
        .limit(1)
        .get()

      if (!requestQuery.empty) {
        requestId = requestQuery.docs[0].id
      }
    }

    // Update friend request status to rejected if found
    if (requestId) {
      const requestRef = db.collection('friendRequests').doc(requestId)
      const requestDoc = await requestRef.get()
      if (requestDoc.exists) {
        await requestRef.update({
          status: 'rejected',
          updatedAt: new Date()
        })
      }
    }

    // Update notification status to 'rejected'
    if (notificationId) {
      await db.collection('notifications').doc(notificationId).update({
        status: 'rejected',
        read: true
      })
    }

    return { success: true, message: 'Friend request rejected' }
  } catch (err: any) {
    console.error('Error rejecting friend request:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
