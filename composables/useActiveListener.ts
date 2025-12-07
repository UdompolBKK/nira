// composables/useActiveListener.ts
// Active Listener AI - Provides real-time encouragement while user is typing

import {
  collection,
  getDocs,
  query,
  where,
  limit
} from 'firebase/firestore'

export interface ListenerResponse {
  message: string
  emotion: 'happy' | 'caring' | 'thinking' | 'encouraging' | 'neutral'
}

// Training data loaded from database
interface TrainedResponse {
  keywords: string[]
  response: string
  category: string
}

// Pre-defined encouragement messages (fallback)
const ENCOURAGEMENTS = {
  start: [
    { message: 'เริ่มเขียนกันเลย! ✨', emotion: 'happy' as const },
    { message: 'อยู่ตรงนี้ฟังนะ', emotion: 'caring' as const },
    { message: 'เล่าให้ฟังได้เลย', emotion: 'neutral' as const }
  ],
  positive: [
    { message: 'ดีใจด้วยนะ! 🎉', emotion: 'happy' as const },
    { message: 'น่ายินดีจัง', emotion: 'happy' as const },
    { message: 'ชอบที่เล่าให้ฟังเลย', emotion: 'caring' as const }
  ],
  stressed: [
    { message: 'อยู่ตรงนี้นะ', emotion: 'caring' as const },
    { message: 'เข้าใจนะ', emotion: 'caring' as const },
    { message: 'ไม่ต้องเก็บไว้คนเดียว', emotion: 'encouraging' as const }
  ],
  thinking: [
    { message: 'ค่อยๆ เขียนได้นะ', emotion: 'neutral' as const },
    { message: 'ไม่ต้องรีบ', emotion: 'caring' as const },
    { message: '...', emotion: 'thinking' as const }
  ],
  productive: [
    { message: 'เขียนได้ดีมาก!', emotion: 'encouraging' as const },
    { message: 'ดีเลย เล่าต่อได้', emotion: 'happy' as const },
    { message: 'ฟังอยู่นะ', emotion: 'caring' as const }
  ],
  idle: [
    { message: 'จะฟังตลอดเลย', emotion: 'neutral' as const },
    { message: 'เขียนต่อได้นะ', emotion: 'encouraging' as const },
    { message: '✨', emotion: 'neutral' as const }
  ]
}

// Default keywords (used when no training data)
const DEFAULT_KEYWORDS = {
  positive: ['ดีใจ', 'สนุก', 'รัก', 'ขอบคุณ', 'ยินดี', 'สำเร็จ', 'ภูมิใจ', 'มีความสุข', 'เยี่ยม', 'ได้', '555', 'หัวเราะ', 'ตื่นเต้น'],
  stressed: ['เหนื่อย', 'เครียด', 'กลัว', 'เศร้า', 'เสียใจ', 'โกรธ', 'หงุดหงิด', 'ไม่ไหว', 'ท้อ', 'ผิดหวัง', 'เบื่อ', 'อยากร้อง', 'น้ำตา', 'ยาก', 'ปัญหา', 'ไม่สบายใจ']
}

export const useActiveListener = () => {
  const config = useRuntimeConfig()
  const { firestore } = useFirebase()

  const currentResponse = ref<ListenerResponse | null>(null)
  const isListening = ref(false)
  const characterMood = ref<'idle' | 'listening' | 'responding'>('idle')
  const lastAnalyzedText = ref('')
  const isTyping = ref(false)
  const showBubble = ref(false)
  const trainedResponses = ref<TrainedResponse[]>([])
  const defaultBotId = ref<string | null>(null)

  // Debounce timer
  let debounceTimer: NodeJS.Timeout | null = null
  let hideTimer: NodeJS.Timeout | null = null
  let lastKeywordMatch = ref<string | null>(null)

  // Load training data from default bot
  const loadTrainingData = async () => {
    if (!firestore) return

    try {
      // Get default bot first
      const botsRef = collection(firestore, 'botConfigs')
      const botQuery = query(
        botsRef,
        where('isDefault', '==', true),
        where('isActive', '==', true),
        limit(1)
      )
      const botSnapshot = await getDocs(botQuery)

      if (botSnapshot.empty) return

      const botDoc = botSnapshot.docs[0]
      defaultBotId.value = botDoc.id

      // Load training data for this bot
      const trainingRef = collection(firestore, 'botTrainingData')
      const trainingQuery = query(
        trainingRef,
        where('botId', '==', botDoc.id),
        where('isActive', '==', true),
        limit(50) // Limit to 50 examples for performance
      )
      const trainingSnapshot = await getDocs(trainingQuery)

      trainedResponses.value = trainingSnapshot.docs.map(doc => ({
        keywords: doc.data().keywords || [],
        response: doc.data().idealResponse || '',
        category: doc.data().category || 'general'
      }))
    } catch (err) {
      console.error('Error loading training data:', err)
    }
  }

  // Start listening
  const startListening = async () => {
    isListening.value = true
    characterMood.value = 'idle'
    console.log('[ActiveListener] Started listening')

    // Load training data
    await loadTrainingData()

    // Show initial greeting after a delay
    setTimeout(() => {
      const greetings = ENCOURAGEMENTS.start
      const random = greetings[Math.floor(Math.random() * greetings.length)]
      showResponse(random)
    }, 1500)
  }

  // Stop listening
  const stopListening = () => {
    isListening.value = false
    characterMood.value = 'idle'
    currentResponse.value = null
    showBubble.value = false
  }

  // Analyze text and show response - realtime detection
  const analyzeText = (text: string) => {
    if (!isListening.value) {
      console.log('[ActiveListener] Not listening, skipping analysis')
      return
    }

    const cleanText = text.replace(/<[^>]*>/g, '').trim()
    console.log('[ActiveListener] Analyzing text:', cleanText.substring(0, 50))

    // Set typing state immediately
    isTyping.value = true
    characterMood.value = 'listening'

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Check for keyword match immediately (realtime)
    if (cleanText.length >= 2) {
      const matchedKeyword = findMatchedKeyword(cleanText)
      console.log('[ActiveListener] Keyword match result:', matchedKeyword, 'last:', lastKeywordMatch.value)
      if (matchedKeyword && matchedKeyword !== lastKeywordMatch.value) {
        lastKeywordMatch.value = matchedKeyword
        characterMood.value = 'responding'
        const response = getResponseFromText(cleanText)
        console.log('[ActiveListener] Showing response:', response.message)
        showResponse(response)
      }
    }

    // Debounce for stopping typing indicator
    debounceTimer = setTimeout(() => {
      isTyping.value = false

      // Skip if text hasn't changed significantly
      if (cleanText === lastAnalyzedText.value) return
      if (cleanText.length < 5) return

      lastAnalyzedText.value = cleanText

      // Show response based on text length if no keyword match
      if (!lastKeywordMatch.value && cleanText.length > 50) {
        characterMood.value = 'responding'
        const response = getResponseFromText(cleanText)
        showResponse(response)
      }
    }, 800) // Shorter debounce for better UX
  }

  // Find matched keyword in text
  const findMatchedKeyword = (text: string): string | null => {
    const lowerText = text.toLowerCase()

    // Check trained responses first
    for (const trained of trainedResponses.value) {
      for (const kw of trained.keywords) {
        if (lowerText.includes(kw.toLowerCase())) {
          return kw
        }
      }
    }

    // Check default keywords
    for (const kw of DEFAULT_KEYWORDS.positive) {
      if (lowerText.includes(kw)) return kw
    }
    for (const kw of DEFAULT_KEYWORDS.stressed) {
      if (lowerText.includes(kw)) return kw
    }

    return null
  }

  // Get response based on text content
  const getResponseFromText = (text: string): ListenerResponse => {
    const lowerText = text.toLowerCase()

    // First, check trained responses from database (priority)
    if (trainedResponses.value.length > 0) {
      for (const trained of trainedResponses.value) {
        const matchedKeyword = trained.keywords.some(kw =>
          lowerText.includes(kw.toLowerCase())
        )
        if (matchedKeyword) {
          // Map category to emotion
          const emotionMap: Record<string, ListenerResponse['emotion']> = {
            greeting: 'happy',
            support: 'caring',
            crisis: 'caring',
            general: 'neutral',
            farewell: 'caring'
          }
          return {
            message: trained.response,
            emotion: emotionMap[trained.category] || 'neutral'
          }
        }
      }
    }

    // Fallback to default keywords
    const hasPositive = DEFAULT_KEYWORDS.positive.some(kw => lowerText.includes(kw))
    if (hasPositive) {
      const responses = ENCOURAGEMENTS.positive
      return responses[Math.floor(Math.random() * responses.length)]
    }

    const hasStressed = DEFAULT_KEYWORDS.stressed.some(kw => lowerText.includes(kw))
    if (hasStressed) {
      const responses = ENCOURAGEMENTS.stressed
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // Based on text length
    if (text.length > 200) {
      const responses = ENCOURAGEMENTS.productive
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // Default thinking response
    const responses = ENCOURAGEMENTS.thinking
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Show response with bubble
  const showResponse = (response: ListenerResponse) => {
    currentResponse.value = response
    showBubble.value = true

    // Clear previous hide timer
    if (hideTimer) {
      clearTimeout(hideTimer)
    }

    // Hide bubble after delay
    hideTimer = setTimeout(() => {
      showBubble.value = false
      characterMood.value = 'idle'
    }, 5000)
  }

  // Call Grok API for smart response (optional, for more personalized responses)
  const getSmartResponse = async (text: string): Promise<ListenerResponse | null> => {
    const apiKey = config.public.grokApiKey
    if (!apiKey) return null

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: `คุณเป็น Active Listener ที่คอยให้กำลังใจ ไม่ต้องตอบยาว แค่พูดสั้นๆ 2-5 คำเท่านั้น เหมือนเพื่อนที่ฟังอยู่ข้างๆ
ตอบเป็น JSON: {"message": "ข้อความสั้นๆ", "emotion": "happy|caring|thinking|encouraging|neutral"}`
            },
            {
              role: 'user',
              content: `ผู้ใช้กำลังเขียน: "${text.substring(0, 200)}"`
            }
          ],
          temperature: 0.8,
          max_tokens: 50
        })
      })

      if (!response.ok) return null

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''

      try {
        return JSON.parse(content) as ListenerResponse
      } catch {
        return null
      }
    } catch {
      return null
    }
  }

  // Idle animation trigger
  const triggerIdleResponse = () => {
    if (!isListening.value || showBubble.value) return

    const responses = ENCOURAGEMENTS.idle
    const random = responses[Math.floor(Math.random() * responses.length)]
    showResponse(random)
  }

  // Cleanup
  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (hideTimer) clearTimeout(hideTimer)
  })

  return {
    currentResponse,
    isListening,
    characterMood,
    isTyping,
    showBubble,
    startListening,
    stopListening,
    analyzeText,
    triggerIdleResponse
  }
}
