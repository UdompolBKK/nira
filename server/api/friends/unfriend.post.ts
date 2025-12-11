// POST /api/friends/unfriend - Remove friend relationship
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
    const { friendId } = body

    if (!friendId) {
      throw createError({ statusCode: 400, message: 'Missing friendId' })
    }

    const db = adminFirestore()

    // Delete both directions of friendship
    // Delete: currentUser -> friend
    const friendsSnapshot1 = await db
      .collection('friends')
      .where('userId', '==', currentUserId)
      .where('friendId', '==', friendId)
      .get()

    // Delete: friend -> currentUser
    const friendsSnapshot2 = await db
      .collection('friends')
      .where('userId', '==', friendId)
      .where('friendId', '==', currentUserId)
      .get()

    // Delete all matching documents
    const batch = db.batch()
    friendsSnapshot1.docs.forEach(doc => batch.delete(doc.ref))
    friendsSnapshot2.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()

    return { success: true, message: 'Friend removed successfully' }
  } catch (err: any) {
    console.error('Error unfriending:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
