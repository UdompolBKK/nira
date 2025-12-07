// DELETE /api/admin/bots/:id - Delete bot (super admin only)
import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'

const SUPER_ADMIN_EMAILS = ['udompol.bkk@gmail.com']

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Bot ID is required' })
  }

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

    const db = adminFirestore()

    // Check if bot exists
    const botRef = db.collection('botConfigs').doc(id)
    const botDoc = await botRef.get()
    if (!botDoc.exists) {
      throw createError({ statusCode: 404, message: 'Bot not found' })
    }

    // Delete bot
    await botRef.delete()

    // Also delete related training data
    const trainingDocs = await db.collection('botTrainingData')
      .where('botId', '==', id)
      .get()

    if (!trainingDocs.empty) {
      const batch = db.batch()
      trainingDocs.docs.forEach(doc => {
        batch.delete(doc.ref)
      })
      await batch.commit()
    }

    return { success: true }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error deleting bot:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
