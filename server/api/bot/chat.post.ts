// POST /api/bot/chat - Chat with AI using Groq (FREE and FAST)
import { adminFirestore } from '~/server/utils/firebase-admin'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  botId: string
  systemPrompt?: string
  history?: ChatMessage[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatRequest>(event)
  const config = useRuntimeConfig()

  if (!body.message || !body.botId) {
    throw createError({
      statusCode: 400,
      message: 'Message and botId are required'
    })
  }

  try {
    const db = adminFirestore()

    // Get bot config for system prompt if not provided
    let systemPrompt = body.systemPrompt
    if (!systemPrompt) {
      const botDoc = await db.collection('botConfigs').doc(body.botId).get()
      if (botDoc.exists) {
        systemPrompt = botDoc.data()?.systemPrompt || getDefaultSystemPrompt()
      } else {
        systemPrompt = getDefaultSystemPrompt()
      }
    }

    // Load training data for this bot to provide context
    const trainingSnapshot = await db.collection('botTrainingData')
      .where('botId', '==', body.botId)
      .where('isActive', '==', true)
      .limit(20)
      .get()

    let trainingContext = ''
    if (!trainingSnapshot.empty) {
      trainingContext = '\n\nตัวอย่างการตอบที่ดี:\n'
      trainingSnapshot.docs.forEach(doc => {
        const data = doc.data()
        if (data.userMessage && data.idealResponse) {
          trainingContext += `- เมื่อ user พูดว่า "${data.userMessage}" → ตอบว่า "${data.idealResponse}"\n`
        }
      })
    }

    // Build conversation history
    const history = body.history || []
    const historyMessages = history.slice(-10).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))

    // Use Groq API (FREE and FAST!)
    const apiKey = config.groqApiKey
    if (!apiKey) {
      console.error('Groq API key not configured')
      return {
        response: getFallbackResponse()
      }
    }

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
            content: systemPrompt + trainingContext
          },
          ...historyMessages,
          {
            role: 'user',
            content: body.message
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error:', response.status, errorText)
      return {
        response: getFallbackResponse()
      }
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || getFallbackResponse()

    return {
      response: aiResponse
    }
  } catch (err: any) {
    console.error('Chat API error:', err)
    return {
      response: getFallbackResponse()
    }
  }
})

function getDefaultSystemPrompt(): string {
  return `คุณคือ AI เพื่อนที่เข้าใจและให้กำลังใจ พูดภาษาไทยสุภาพและเป็นกันเอง
- รับฟังด้วยความเข้าใจ ไม่ตัดสิน
- ให้กำลังใจและคำแนะนำที่เป็นประโยชน์
- ตอบสั้นๆ กระชับ ไม่เกิน 2-3 ประโยค
- ใช้ภาษาอบอุ่นและเป็นมิตร`
}

function getFallbackResponse(): string {
  const responses = [
    'เข้าใจนะ อยู่ตรงนี้ฟังอยู่นะ',
    'ขอบคุณที่เล่าให้ฟังนะ',
    'ความรู้สึกของคุณสำคัญ',
    'อยากให้รู้ว่าไม่ได้อยู่คนเดียวนะ'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
