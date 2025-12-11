// POST /api/friends/accept - Accept friend request
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

    if (!senderId) {
      throw createError({ statusCode: 400, message: 'Missing senderId' })
    }

    const db = adminFirestore()

    // If no requestId, try to find it from friendRequests collection
    if (!requestId) {
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

    // Update friend request status if found
    if (requestId) {
      const requestRef = db.collection('friendRequests').doc(requestId)
      const requestDoc = await requestRef.get()
      if (requestDoc.exists) {
        await requestRef.update({
          status: 'accepted',
          updatedAt: new Date()
        })
      }
    }

    // Check if already friends
    const existingFriend = await db.collection('friends')
      .where('userId', '==', currentUserId)
      .where('friendId', '==', senderId)
      .limit(1)
      .get()

    if (!existingFriend.empty) {
      // Already friends, just update notification
      if (notificationId) {
        await db.collection('notifications').doc(notificationId).update({
          status: 'accepted',
          read: true
        })
      }
      return { success: true, message: 'Already friends' }
    }

    // Create friend relationships (bidirectional)
    const friendsRef = db.collection('friends')

    // Add sender -> receiver friendship
    await friendsRef.add({
      userId: senderId,
      friendId: currentUserId,
      createdAt: new Date()
    })

    // Add receiver -> sender friendship
    await friendsRef.add({
      userId: currentUserId,
      friendId: senderId,
      createdAt: new Date()
    })

    // Create notification for sender (store only UIDs - names/photos fetched from users collection)
    const notificationsRef = db.collection('notifications')

    await notificationsRef.add({
      userId: senderId,
      type: 'friend_accepted',
      senderId: currentUserId,
      status: 'accepted',
      read: false,
      createdAt: new Date()
    })

    // Update original notification status to 'accepted'
    if (notificationId) {
      await db.collection('notifications').doc(notificationId).update({
        status: 'accepted',
        read: true
      })
    }

    return { success: true, message: 'Friend request accepted' }
  } catch (err: any) {
    console.error('Error accepting friend request:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
