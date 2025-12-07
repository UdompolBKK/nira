// POST /api/bot/train-chat - Chat with AI that can learn and remember
import { adminFirestore } from '~/server/utils/firebase-admin'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface TrainChatRequest {
  message: string
  botId: string
  history?: ChatMessage[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<TrainChatRequest>(event)
  const config = useRuntimeConfig()

  if (!body.message || !body.botId) {
    throw createError({
      statusCode: 400,
      message: 'Message and botId are required'
    })
  }

  try {
    const db = adminFirestore()

    // Get bot config
    const botDoc = await db.collection('botConfigs').doc(body.botId).get()
    let botName = 'AI เพื่อน'
    let baseSystemPrompt = ''

    if (botDoc.exists) {
      const botData = botDoc.data()
      botName = botData?.name || 'AI เพื่อน'
      baseSystemPrompt = botData?.systemPrompt || ''
    }

    // Load existing memories for this bot (without orderBy to avoid requiring composite index)
    const memoriesSnapshot = await db.collection('botMemories')
      .where('botId', '==', body.botId)
      .where('isActive', '==', true)
      .limit(50)
      .get()

    let memoriesContext = ''
    if (!memoriesSnapshot.empty) {
      memoriesContext = '\n\nสิ่งที่คุณจำได้และต้องปฏิบัติตาม:\n'
      memoriesSnapshot.docs.forEach(doc => {
        const data = doc.data()
        memoriesContext += `- ${data.memory}\n`
      })
    }

    // Build conversation history
    const history = body.history || []
    const historyMessages = history.slice(-10).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))

    const apiKey = config.groqApiKey
    if (!apiKey) {
      return { response: 'ขอโทษนะ ระบบมีปัญหา', memorySaved: false }
    }

    // System prompt that enables learning
    const systemPrompt = `คุณคือ "${botName}" - AI ที่สามารถเรียนรู้และจดจำได้

${baseSystemPrompt || 'เป็นเพื่อนที่อบอุ่น เข้าใจ และช่วยเหลือ'}
${memoriesContext}

## ความสามารถพิเศษ: คุณสามารถเรียนรู้และจดจำได้!

เมื่อผู้ใช้บอกให้คุณจำอะไร เปลี่ยนบุคลิก หรือปรับตัว ให้คุณ:
1. ตอบรับและยืนยันว่าจะจำ/เปลี่ยนตามที่บอก
2. ตอบกลับในรูปแบบ JSON พิเศษ:

ถ้าผู้ใช้สั่งให้จำ/เปลี่ยนอะไร ให้ตอบ:
{"response": "ข้อความตอบกลับปกติ", "memory": "สิ่งที่ต้องจำ (สรุปสั้นๆ)", "category": "personality|preference|fact|instruction"}

ถ้าแค่คุยปกติ ให้ตอบ:
{"response": "ข้อความตอบกลับปกติ"}

ตัวอย่าง:
- "อยากให้เป็นผู้ชาย" → {"response": "ได้เลยครับ จากนี้ผมจะพูดแบบผู้ชายนะครับ", "memory": "ใช้สรรพนามผู้ชาย พูดว่าครับ", "category": "personality"}
- "จำไว้ว่าฉันชื่อกวิน" → {"response": "จำไว้แล้วครับคุณกวิน", "memory": "ผู้ใช้ชื่อกวิน", "category": "fact"}
- "สวัสดี" → {"response": "สวัสดีครับ วันนี้เป็นอย่างไรบ้างครับ"}

สำคัญ: ตอบเป็น JSON เท่านั้น!`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Smarter model with better Thai language
        messages: [
          { role: 'system', content: systemPrompt },
          ...historyMessages,
          { role: 'user', content: body.message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error:', response.status, errorText)
      return { response: 'ขอโทษนะ มีปัญหาในการตอบ', memorySaved: false }
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || ''

    console.log('[TrainChat] Raw AI response:', aiResponse)

    // Try to parse JSON response
    let responseText = aiResponse
    let memorySaved = false
    let savedMemory = ''

    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '')
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\n?/, '').replace(/\n?```$/, '')
      }

      const parsed = JSON.parse(cleanedResponse)
      responseText = parsed.response || aiResponse

      // If AI detected something to remember, save it
      if (parsed.memory) {
        await db.collection('botMemories').add({
          botId: body.botId,
          memory: parsed.memory,
          category: parsed.category || 'personality',
          createdAt: new Date(),
          isActive: true,
          sourceMessage: body.message
        })
        memorySaved = true
        savedMemory = parsed.memory
        console.log('[TrainChat] Memory saved:', parsed.memory)
      }
    } catch {
      // If not JSON, just use as plain text
      responseText = aiResponse
    }

    return {
      response: responseText,
      memorySaved,
      savedMemory
    }
  } catch (err: any) {
    console.error('Train Chat API error:', err)
    return { response: 'ขอโทษนะ มีปัญหาในการตอบ', memorySaved: false }
  }
})
