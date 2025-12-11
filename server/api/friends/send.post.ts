// POST /api/friends/send - Send friend request
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
    const { receiverId } = body

    if (!receiverId) {
      throw createError({ statusCode: 400, message: 'Missing receiverId' })
    }

    const db = adminFirestore()

    // Create friend request (store only UIDs - names/photos fetched from users collection)
    const requestRef = await db.collection('friendRequests').add({
      senderId: currentUserId,
      receiverId: receiverId,
      status: 'pending',
      createdAt: new Date()
    })

    // Create notification for receiver (store only UIDs - names/photos fetched from users collection)
    await db.collection('notifications').add({
      userId: receiverId,
      type: 'friend_request',
      senderId: currentUserId,
      requestId: requestRef.id,
      status: 'pending',
      read: false,
      createdAt: new Date()
    })

    return {
      success: true,
      message: 'Friend request sent',
      requestId: requestRef.id
    }
  } catch (err: any) {
    console.error('Error sending friend request:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
