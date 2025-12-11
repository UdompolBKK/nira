// GET /api/user/check-slug - Check if slug is available
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

    // Get slug from query parameter
    const query = getQuery(event)
    const slug = query.slug as string

    if (!slug) {
      throw createError({ statusCode: 400, message: 'Missing slug parameter' })
    }

    const db = adminFirestore()

    // Check if slug exists
    const usersSnapshot = await db
      .collection('users')
      .where('slug', '==', slug)
      .get()

    if (usersSnapshot.empty) {
      // Slug is available
      return { success: true, available: true }
    }

    // Check if it belongs to current user
    const isOwnSlug = usersSnapshot.docs.some(doc => doc.id === currentUserId)

    if (isOwnSlug) {
      // It's user's own slug
      return { success: true, available: true, isOwn: true }
    } else {
      // Slug is taken by another user
      return { success: true, available: false }
    }
  } catch (err: any) {
    console.error('Error checking slug:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
