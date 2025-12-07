// GET/DELETE /api/bot/memories - Get or delete bot memories
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const db = adminFirestore()

  // GET - List memories for a bot
  if (method === 'GET') {
    const query = getQuery(event)
    const botId = query.botId as string

    if (!botId) {
      throw createError({
        statusCode: 400,
        message: 'botId is required'
      })
    }

    try {
      // Query without orderBy to avoid requiring composite index
      const memoriesSnapshot = await db.collection('botMemories')
        .where('botId', '==', botId)
        .where('isActive', '==', true)
        .limit(100)
        .get()

      // Sort in memory instead
      const memories = memoriesSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      return { memories }
    } catch (err: any) {
      console.error('Error getting memories:', err)
      throw createError({ statusCode: 500, message: err.message })
    }
  }

  // DELETE - Soft delete a memory (set isActive to false)
  if (method === 'DELETE') {
    const body = await readBody(event)
    const memoryId = body.memoryId as string

    if (!memoryId) {
      throw createError({
        statusCode: 400,
        message: 'memoryId is required'
      })
    }

    try {
      await db.collection('botMemories').doc(memoryId).update({
        isActive: false,
        deletedAt: new Date()
      })

      return { success: true }
    } catch (err: any) {
      console.error('Error deleting memory:', err)
      throw createError({ statusCode: 500, message: err.message })
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
