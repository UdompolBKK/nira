// GET /api/bot/default - Get default bot config (public endpoint)
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()

    // Get default active bot
    const snapshot = await db.collection('botConfigs')
      .where('isDefault', '==', true)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return { bot: null }
    }

    const doc = snapshot.docs[0]
    const bot = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    }

    return { bot }
  } catch (err: any) {
    console.error('Error getting default bot:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
