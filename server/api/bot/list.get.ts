// GET /api/bot/list - Get list of active bots for user selection
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async () => {
  try {
    const db = adminFirestore()

    // Get all active bots
    const botsSnapshot = await db.collection('botConfigs')
      .where('isActive', '==', true)
      .get()

    const bots = botsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || 'AI Bot',
        description: data.description || '',
        avatar: data.avatar || null,
        greeting: data.greeting || '',
        isDefault: data.isDefault || false
      }
    })

    // Sort: default bot first, then by name
    bots.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1
      if (!a.isDefault && b.isDefault) return 1
      return a.name.localeCompare(b.name)
    })

    return { bots }
  } catch (err: any) {
    console.error('Error fetching bot list:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
