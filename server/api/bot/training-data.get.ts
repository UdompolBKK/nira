// GET /api/bot/training-data - Get default bot's training data
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async () => {
  try {
    const db = adminFirestore()

    // Get default bot first
    const botsSnapshot = await db.collection('botConfigs')
      .where('isDefault', '==', true)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (botsSnapshot.empty) {
      return { trainedResponses: [], botId: null }
    }

    const botDoc = botsSnapshot.docs[0]
    const botId = botDoc.id

    // Load training data for this bot
    const trainingSnapshot = await db.collection('botTrainingData')
      .where('botId', '==', botId)
      .where('isActive', '==', true)
      .limit(50)
      .get()

    const trainedResponses = trainingSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        keywords: data.keywords || [],
        response: data.idealResponse || '',
        category: data.category || 'general'
      }
    })

    return { trainedResponses, botId }
  } catch (err: any) {
    console.error('Error loading training data:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
