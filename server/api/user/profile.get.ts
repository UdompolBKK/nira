// GET /api/user/profile - Get user profile (authenticated)
import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  // Get authorization header
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    // Verify token
    const decodedToken = await adminAuth().verifyIdToken(token)
    const userId = decodedToken.uid

    const db = adminFirestore()
    const userDoc = await db.collection('users').doc(userId).get()

    if (!userDoc.exists) {
      return {
        profile: null,
        exists: false
      }
    }

    const data = userDoc.data()

    return {
      profile: {
        displayName: data?.displayName || null,
        slug: data?.slug || null,
        aboutMe: data?.aboutMe || null,
        photoURL: data?.photoURL || null,
        updatedAt: data?.updatedAt?.toDate?.() || null
      },
      exists: true
    }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error getting profile:', err)
    throw createError({ statusCode: 500, message: err.message || 'Failed to get profile' })
  }
})
