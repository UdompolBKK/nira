// POST /api/bot/memory - Save a memory/personality trait for the bot
import { adminFirestore } from '~/server/utils/firebase-admin'

interface MemoryRequest {
  botId: string
  memory: string
  category: 'personality' | 'preference' | 'fact' | 'instruction'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<MemoryRequest>(event)

  if (!body.botId || !body.memory) {
    throw createError({
      statusCode: 400,
      message: 'botId and memory are required'
    })
  }

  try {
    const db = adminFirestore()

    // Save memory to botMemories collection
    const memoryDoc = await db.collection('botMemories').add({
      botId: body.botId,
      memory: body.memory,
      category: body.category || 'personality',
      createdAt: new Date(),
      isActive: true
    })

    console.log('[BotMemory] Saved memory:', body.memory.substring(0, 50))

    return {
      success: true,
      memoryId: memoryDoc.id
    }
  } catch (err: any) {
    console.error('Save memory error:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
