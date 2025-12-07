// GET /api/admin/bots - Get all bots (super admin only)
import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'

const SUPER_ADMIN_EMAILS = ['udompol.bkk@gmail.com']

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

    // Check if super admin
    if (!SUPER_ADMIN_EMAILS.includes(decodedToken.email || '')) {
      throw createError({ statusCode: 403, message: 'Forbidden - Super Admin only' })
    }

    // Get all bots
    const db = adminFirestore()
    const snapshot = await db.collection('botConfigs')
      .orderBy('createdAt', 'desc')
      .get()

    const bots = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    }))

    return { bots }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error getting bots:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
