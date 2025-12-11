// POST /api/consent/save - Save cookie consent to Firestore (PDPA requirement: keep for 5 years)
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
    const userId = decodedToken.uid

    const body = await readBody(event)
    const { preferences, userAgent, timestamp } = body

    if (!preferences || !timestamp) {
      throw createError({ statusCode: 400, message: 'Missing preferences or timestamp' })
    }

    const db = adminFirestore()

    // Get IP address from request (for audit trail)
    const ipAddress = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'

    // Save consent record (PDPA requires keeping consent records for 5 years)
    await db.collection('userConsents').add({
      userId,
      preferences: preferences,
      userAgent: userAgent || 'unknown',
      ipAddress: ipAddress,
      timestamp: new Date(timestamp),
      createdAt: new Date(),
      // PDPA requirement: Keep for 5 years
      expiresAt: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
    })

    return { success: true, message: 'Consent saved successfully' }
  } catch (err: any) {
    console.error('Error saving consent:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
