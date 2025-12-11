// POST /api/friends/cancel - Cancel pending friend request
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

    const body = await readBody(event)
    const { requestId } = body

    if (!requestId) {
      throw createError({ statusCode: 400, message: 'Missing requestId' })
    }

    const db = adminFirestore()

    // Verify the request belongs to current user (sender)
    const requestDoc = await db.collection('friendRequests').doc(requestId).get()

    if (!requestDoc.exists) {
      throw createError({ statusCode: 404, message: 'Friend request not found' })
    }

    const requestData = requestDoc.data()
    if (requestData?.senderId !== currentUserId) {
      throw createError({ statusCode: 403, message: 'Not authorized to cancel this request' })
    }

    // Delete the friend request
    await db.collection('friendRequests').doc(requestId).delete()

    // Also delete the notification if exists
    const notificationsSnapshot = await db
      .collection('notifications')
      .where('requestId', '==', requestId)
      .where('type', '==', 'friend_request')
      .get()

    const batch = db.batch()
    notificationsSnapshot.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()

    return { success: true, message: 'Friend request cancelled' }
  } catch (err: any) {
    console.error('Error cancelling friend request:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
