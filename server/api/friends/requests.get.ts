// GET /api/friends/requests - Get pending friend requests for current user
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

    // Get pending friend requests where current user is the receiver
    const requestsSnapshot = await db
      .collection('friendRequests')
      .where('receiverId', '==', currentUserId)
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get()

    // Fetch sender info for each request (relational data model)
    const requests = await Promise.all(
      requestsSnapshot.docs.map(async (doc) => {
        const data = doc.data()
        const senderId = data.senderId

        // Fetch sender's latest info from users collection
        const senderDoc = await db.collection('users').doc(senderId).get()
        const senderData = senderDoc.data()

        return {
          id: doc.id,
          senderId: senderId,
          senderName: senderData?.displayName || senderData?.anonymousName || 'ผู้ใช้', // Get latest name from users collection
          senderPhoto: senderData?.photoURL || null, // Get latest photo from users collection
          receiverId: data.receiverId,
          status: data.status,
          createdAt: data.createdAt
        }
      })
    )

    return { success: true, requests }
  } catch (err: any) {
    console.error('Error fetching friend requests:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
