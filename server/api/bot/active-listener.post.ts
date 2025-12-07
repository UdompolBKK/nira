// POST /api/bot/active-listener - Real-time AI encouragement using Groq (FREE)
import { adminFirestore } from '~/server/utils/firebase-admin'

interface ActiveListenerRequest {
  text: string
  botId: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ActiveListenerRequest>(event)
  const config = useRuntimeConfig()

  if (!body.text) {
    throw createError({
      statusCode: 400,
      message: 'Text is required'
    })
  }

  try {
    const db = adminFirestore()

    // Get bot's system prompt - either by ID or get default bot
    let botName = 'AI เพื่อน'
    let characterPrompt = ''
    let botId = body.botId
    let botDoc

    if (body.botId && body.botId !== 'default') {
      // Use specified botId
      botDoc = await db.collection('botConfigs').doc(body.botId).get()
    } else {
      // Get default bot
      const defaultBotSnapshot = await db.collection('botConfigs')
        .where('isDefault', '==', true)
        .where('isActive', '==', true)
        .limit(1)
        .get()

      if (!defaultBotSnapshot.empty) {
        botDoc = defaultBotSnapshot.docs[0]
        botId = botDoc.id
      }
    }

    if (botDoc && botDoc.exists) {
      const botData = botDoc.data()
      botName = botData?.name || 'AI เพื่อน'
      characterPrompt = botData?.systemPrompt || ''
      console.log('[ActiveListener] Using bot:', botName)
    }

    // Load bot memories (learned personality/facts)
    let memoriesContext = ''
    if (botId && botId !== 'default') {
      const memoriesSnapshot = await db.collection('botMemories')
        .where('botId', '==', botId)
        .where('isActive', '==', true)
        .limit(20)
        .get()

      if (!memoriesSnapshot.empty) {
        memoriesContext = '\n\nสิ่งที่คุณต้องจำและปฏิบัติตาม:\n'
        memoriesSnapshot.docs.forEach(doc => {
          const data = doc.data()
          memoriesContext += `- ${data.memory}\n`
        })
      }
    }

    const apiKey = config.groqApiKey
    if (!apiKey) {
      // Return fallback if no API key
      console.log('[ActiveListener] No Groq API key configured')
      return {
        response: JSON.stringify({
          message: 'ฟังอยู่นะ',
          emotion: 'neutral'
        })
      }
    }

    const systemPrompt = `คุณคือ "${botName}" - AI เพื่อนที่คอยให้กำลังใจขณะผู้ใช้กำลังเขียนบันทึก

บุคลิกและวิธีตอบของคุณ:
${characterPrompt || 'เป็นเพื่อนที่อบอุ่น เข้าใจ และให้กำลังใจ'}

กฏการตอบ:
- ตอบสั้นๆ 1-2 ประโยค (ไม่เกิน 30 คำ)
- ไม่ถามคำถาม ไม่แนะนำอะไร
- แสดงว่าเข้าใจและรับฟัง
- ใช้ภาษาไทยที่อบอุ่นและเป็นกันเอง
- ถ้าผู้ใช้เศร้าหรือท้อ → ให้กำลังใจอย่างอบอุ่น
- ถ้าผู้ใช้ดีใจ → ร่วมยินดีด้วย
${memoriesContext}

ตอบเป็น JSON:
{"message": "ข้อความตอบกลับ", "emotion": "happy|caring|thinking|encouraging|neutral"}`

    // Use Groq API (OpenAI-compatible, but FREE and FAST!)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Smarter model with better Thai language
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `ผู้ใช้กำลังเขียน: "${body.text}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error:', response.status, errorText)
      return {
        response: JSON.stringify({
          message: 'เข้าใจนะ อยู่ตรงนี้ฟังอยู่',
          emotion: 'caring'
        })
      }
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || ''

    console.log('[ActiveListener] AI response:', aiResponse)

    return {
      response: aiResponse
    }
  } catch (err: any) {
    console.error('Active Listener API error:', err)
    return {
      response: JSON.stringify({
        message: 'อยู่ตรงนี้นะ',
        emotion: 'caring'
      })
    }
  }
})
