// GET /api/notifications/list - Get user's notifications
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

    // Get notifications for current user
    const notificationsSnapshot = await db
      .collection('notifications')
      .where('userId', '==', currentUserId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    // Fetch sender info for each notification (relational data model)
    const notifications = await Promise.all(
      notificationsSnapshot.docs.map(async (doc) => {
        const data = doc.data()
        const senderId = data.senderId

        let senderName = 'ผู้ใช้'
        let senderPhoto = null

        let senderSlug = null

        if (senderId) {
          try {
            // Fetch sender's latest info from users collection
            const senderDoc = await db.collection('users').doc(senderId).get()

            if (senderDoc.exists) {
              const senderData = senderDoc.data()
              senderName = senderData?.displayName || senderData?.anonymousName || 'ผู้ใช้'
              senderPhoto = senderData?.photoURL || senderData?.photoURLThumb || null
              senderSlug = senderData?.slug || null
            }
          } catch (err) {
            console.error(`❌ [Notification ${doc.id}] Error fetching user ${senderId}:`, err)
          }
        }

        // Convert Firestore Timestamp to serializable format
        let createdAtValue = data.createdAt
        if (createdAtValue && typeof createdAtValue.toDate === 'function') {
          createdAtValue = createdAtValue.toDate().toISOString()
        } else if (createdAtValue && createdAtValue._seconds) {
          createdAtValue = new Date(createdAtValue._seconds * 1000).toISOString()
        }

        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          senderName: senderName,
          senderPhoto: senderPhoto,
          senderSlug: senderSlug, // Add slug for profile link
          message: data.message,
          read: data.read,
          status: data.status,
          actionUrl: data.actionUrl,
          createdAt: createdAtValue,
          senderId: senderId,
          postId: data.postId,
          requestId: data.requestId
        }
      })
    )

    return { success: true, notifications }
  } catch (err: any) {
    console.error('Error fetching notifications:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
