// GET /api/bot/:id - Get specific bot config by ID (public endpoint)
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const botId = getRouterParam(event, 'id')

  if (!botId) {
    throw createError({ statusCode: 400, message: 'Bot ID is required' })
  }

  try {
    const db = adminFirestore()
    const doc = await db.collection('botConfigs').doc(botId).get()

    if (!doc.exists) {
      return { bot: null }
    }

    const data = doc.data()

    // Only return active bots
    if (!data?.isActive) {
      return { bot: null }
    }

    const bot = {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date()
    }

    return { bot }
  } catch (err: any) {
    console.error('Error getting bot by ID:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
