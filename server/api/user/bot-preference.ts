// GET/POST /api/user/bot-preference - Get or save user's selected bot
import { adminFirestore } from '~/server/utils/firebase-admin'

interface BotPreferenceRequest {
  userId: string
  botId: string
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const db = adminFirestore()

  // GET - Get user's bot preference
  if (method === 'GET') {
    const query = getQuery(event)
    const userId = query.userId as string

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'userId is required'
      })
    }

    try {
      const userPrefDoc = await db.collection('userBotPreferences').doc(userId).get()

      if (userPrefDoc.exists) {
        const data = userPrefDoc.data()
        return {
          botId: data?.botId || null,
          updatedAt: data?.updatedAt?.toDate() || null
        }
      }

      // No preference found - return null (will use default)
      return { botId: null }
    } catch (err: any) {
      console.error('Error getting bot preference:', err)
      throw createError({ statusCode: 500, message: err.message })
    }
  }

  // POST - Save user's bot preference
  if (method === 'POST') {
    const body = await readBody<BotPreferenceRequest>(event)

    if (!body.userId || !body.botId) {
      throw createError({
        statusCode: 400,
        message: 'userId and botId are required'
      })
    }

    try {
      await db.collection('userBotPreferences').doc(body.userId).set({
        botId: body.botId,
        updatedAt: new Date()
      }, { merge: true })

      console.log('[BotPreference] Saved preference for user:', body.userId, 'bot:', body.botId)

      return { success: true, botId: body.botId }
    } catch (err: any) {
      console.error('Error saving bot preference:', err)
      throw createError({ statusCode: 500, message: err.message })
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
