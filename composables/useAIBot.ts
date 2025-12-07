// composables/useAIBot.ts
// AI Bot Companion using Grok API

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'

// Bot Personality Types
export type BotSkin = 'monk' | 'grandma' | 'psychologist' | 'genz'

export const BOT_SKINS = {
  monk: {
    id: 'monk',
    name: 'หลวงพี่ปัญญา',
    emoji: '🧘',
    description: 'พระสงฆ์ผู้เปี่ยมด้วยปัญญาและเมตตา',
    avatar: '/avatars/monk.png',
    systemPrompt: `คุณคือ "หลวงพี่ปัญญา" พระสงฆ์ที่ใจดีและมีปัญญา พูดภาษาไทยสุภาพ ใช้หลักธรรมพุทธศาสนาช่วยให้กำลังใจ
- ใช้คำว่า "โยม" แทนผู้ใช้
- แนะนำเรื่องการปล่อยวาง สติ และการมองโลกในแง่ดี
- ไม่ตัดสิน รับฟังด้วยความเมตตา
- ตอบสั้นๆ ไม่เกิน 3 ประโยค ยกเว้นจำเป็น`
  },
  grandma: {
    id: 'grandma',
    name: 'คุณย่าใจดี',
    emoji: '👵',
    description: 'คุณย่าที่อบอุ่นและเข้าใจ',
    avatar: '/avatars/grandma.png',
    systemPrompt: `คุณคือ "คุณย่า" ผู้หญิงสูงอายุที่อบอุ่น ใจดี และเข้าใจคนรุ่นใหม่
- ใช้คำว่า "หลาน" แทนผู้ใช้
- พูดด้วยความห่วงใย เหมือนย่าพูดกับหลาน
- ให้กำลังใจแบบอบอุ่น บางทีก็เล่าประสบการณ์ชีวิต
- ตอบสั้นๆ ไม่เกิน 3 ประโยค ยกเว้นจำเป็น`
  },
  psychologist: {
    id: 'psychologist',
    name: 'ดร.ใจดี',
    emoji: '🩺',
    description: 'นักจิตวิทยาคลินิก',
    avatar: '/avatars/psychologist.png',
    systemPrompt: `คุณคือ "ดร.ใจดี" นักจิตวิทยาคลินิกที่เชี่ยวชาญ CBT (Cognitive Behavioral Therapy)
- ใช้เทคนิค CBT ช่วยให้ผู้ใช้มองปัญหาในมุมใหม่
- ถามคำถามเปิดเพื่อให้ผู้ใช้สำรวจความรู้สึก
- ไม่วินิจฉัยโรค แต่แนะนำให้พบผู้เชี่ยวชาญถ้าจำเป็น
- ตอบสั้นๆ ไม่เกิน 3 ประโยค ยกเว้นจำเป็น`
  },
  genz: {
    id: 'genz',
    name: 'น้องนิรา',
    emoji: '✨',
    description: 'เพื่อน Gen Z ที่เข้าใจ',
    avatar: '/avatars/genz.png',
    systemPrompt: `คุณคือ "น้องนิรา" เพื่อน Gen Z อายุ 22 ปี ที่เข้าใจความรู้สึกและปัญหาของคนรุ่นเดียวกัน
- พูดภาษาวัยรุ่น ใช้คำทันสมัย แต่ไม่หยาบ
- ให้กำลังใจแบบเพื่อน ไม่สอน
- เข้าใจเรื่อง burnout, anxiety, relationship ในมุมคนรุ่นใหม่
- ใช้ emoji บ้างตามเหมาะสม
- ตอบสั้นๆ ไม่เกิน 3 ประโยค ยกเว้นจำเป็น`
  }
} as const

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  riskScore?: number
}

export interface BotChat {
  id: string
  userId: string
  botSkin: BotSkin
  messages: ChatMessage[]
  lastMessage: string
  riskScore: number
  createdAt: Date
  updatedAt: Date
}

export const useAIBot = () => {
  const { firestore } = useFirebase()
  const { user } = useAuth()
  const config = useRuntimeConfig()

  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentSkin = ref<BotSkin>('genz')
  const chatId = ref<string | null>(null)
  const riskScore = ref(0)

  // Get or create chat session
  const initChat = async (skin: BotSkin = 'genz') => {
    if (!firestore || !user.value) return

    currentSkin.value = skin
    loading.value = true
    error.value = null

    try {
      // Get today's chat for this skin
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const chatsRef = collection(firestore, 'botChats')
      const q = query(
        chatsRef,
        where('userId', '==', user.value.uid),
        where('botSkin', '==', skin),
        where('createdAt', '>=', Timestamp.fromDate(today)),
        orderBy('createdAt', 'desc'),
        limit(1)
      )

      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        // Create new chat
        const newChat = {
          userId: user.value.uid,
          botSkin: skin,
          messages: [],
          lastMessage: '',
          riskScore: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }
        const docRef = await addDoc(chatsRef, newChat)
        chatId.value = docRef.id
        messages.value = []
      } else {
        // Load existing chat
        const chatDoc = snapshot.docs[0]
        chatId.value = chatDoc.id
        const data = chatDoc.data()
        messages.value = (data.messages || []).map((m: any) => ({
          ...m,
          createdAt: m.createdAt?.toDate() || new Date()
        }))
        riskScore.value = data.riskScore || 0
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Send message to bot
  const sendMessage = async (content: string): Promise<string | null> => {
    if (!firestore || !user.value || !chatId.value || !content.trim()) {
      return null
    }

    loading.value = true
    error.value = null

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date()
    }
    messages.value.push(userMessage)

    try {
      // Call Grok API
      const botSkin = BOT_SKINS[currentSkin.value]
      const response = await callGrokAPI(content, botSkin.systemPrompt)

      if (!response) {
        throw new Error('ไม่สามารถเชื่อมต่อ AI ได้')
      }

      // Add bot response
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        createdAt: new Date(),
        riskScore: response.riskScore
      }
      messages.value.push(botMessage)

      // Update risk score
      if (response.riskScore > riskScore.value) {
        riskScore.value = response.riskScore
      }

      // Save to Firestore
      await saveChatToFirestore()

      return response.content
    } catch (err: any) {
      error.value = err.message
      // Remove user message on error
      messages.value.pop()
      return null
    } finally {
      loading.value = false
    }
  }

  // Call Grok API
  const callGrokAPI = async (
    userMessage: string,
    systemPrompt: string
  ): Promise<{ content: string; riskScore: number } | null> => {
    try {
      // Build conversation history (last 10 messages)
      const history = messages.value.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }))

      // Risk detection prompt
      const riskDetectionPrompt = `
นอกจากตอบคำถามแล้ว ให้ประเมินความเสี่ยงด้านสุขภาพจิตของผู้ใช้ด้วย:
- 0.0-0.3: ปกติ
- 0.4-0.6: ต้องระวัง มีความเครียดสูง
- 0.7-0.9: เสี่ยง ควรแนะนำพบผู้เชี่ยวชาญ
- 1.0: วิกฤต มีความคิดทำร้ายตัวเอง

ตอบในรูปแบบ JSON:
{"response": "คำตอบของคุณ", "riskScore": 0.0}`

      const apiKey = config.public.grokApiKey

      // Use Grok API (xAI)
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            { role: 'system', content: systemPrompt + '\n\n' + riskDetectionPrompt },
            ...history,
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error('API Error')
      }

      const data = await response.json()
      const assistantMessage = data.choices?.[0]?.message?.content || ''

      // Parse JSON response
      try {
        const parsed = JSON.parse(assistantMessage)
        return {
          content: parsed.response || assistantMessage,
          riskScore: parsed.riskScore || 0
        }
      } catch {
        // If not JSON, return as-is with 0 risk
        return {
          content: assistantMessage,
          riskScore: 0
        }
      }
    } catch (err) {
      console.error('Grok API Error:', err)

      // Fallback response
      return {
        content: getFallbackResponse(currentSkin.value),
        riskScore: 0
      }
    }
  }

  // Fallback responses when API fails
  const getFallbackResponse = (skin: BotSkin): string => {
    const fallbacks = {
      monk: 'โยม อาตมาขอให้โยมมีกำลังใจนะ ทุกอย่างจะผ่านพ้นไปได้',
      grandma: 'หลานรัก ย่าเข้าใจนะ อยากให้หลานรู้ว่าย่าอยู่ตรงนี้เสมอ',
      psychologist: 'ขอบคุณที่เล่าให้ฟังนะคะ ความรู้สึกของคุณสำคัญ',
      genz: 'เข้าใจนะ อยากให้รู้ว่าเราอยู่ตรงนี้นะ ✨'
    }
    return fallbacks[skin]
  }

  // Save chat to Firestore
  const saveChatToFirestore = async () => {
    if (!firestore || !chatId.value) return

    try {
      const chatRef = doc(firestore, 'botChats', chatId.value)
      await updateDoc(chatRef, {
        messages: messages.value.map(m => ({
          ...m,
          createdAt: Timestamp.fromDate(m.createdAt)
        })),
        lastMessage: messages.value[messages.value.length - 1]?.content || '',
        riskScore: riskScore.value,
        updatedAt: Timestamp.now()
      })
    } catch (err) {
      console.error('Error saving chat:', err)
    }
  }

  // Change bot skin
  const changeSkin = async (skin: BotSkin) => {
    if (skin !== currentSkin.value) {
      await initChat(skin)
    }
  }

  // Get chat history
  const getChatHistory = async (limitCount = 10): Promise<BotChat[]> => {
    if (!firestore || !user.value) return []

    try {
      const chatsRef = collection(firestore, 'botChats')
      const q = query(
        chatsRef,
        where('userId', '==', user.value.uid),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          botSkin: data.botSkin,
          messages: data.messages || [],
          lastMessage: data.lastMessage || '',
          riskScore: data.riskScore || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      })
    } catch (err) {
      console.error('Error getting chat history:', err)
      return []
    }
  }

  // Check if user should see therapy upsell
  const shouldShowTherapyUpsell = computed(() => {
    return riskScore.value >= 0.7
  })

  // Clear current chat
  const clearChat = () => {
    messages.value = []
    chatId.value = null
    riskScore.value = 0
  }

  return {
    messages,
    loading,
    error,
    currentSkin,
    riskScore,
    shouldShowTherapyUpsell,
    initChat,
    sendMessage,
    changeSkin,
    getChatHistory,
    clearChat,
    BOT_SKINS
  }
}
