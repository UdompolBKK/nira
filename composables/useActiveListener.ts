// composables/useActiveListener.ts
// Active Listener AI - Provides real-time encouragement while user is typing
// Using API with Firebase Admin SDK

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

  const currentResponse = ref<ListenerResponse | null>(null)
  const isListening = ref(false)
  const characterMood = ref<'idle' | 'listening' | 'responding'>('idle')
  const lastAnalyzedText = ref('')
  const isTyping = ref(false)
  const showBubble = ref(false)
  const trainedResponses = ref<TrainedResponse[]>([])
  const currentBotId = ref<string | null>(null)

  // Timers and state
  let lastKeywordMatch = ref<string | null>(null)

  // Load training data from API
  const loadTrainingData = async () => {
    try {
      const response = await $fetch<{ trainedResponses: TrainedResponse[]; botId: string | null }>('/api/bot/training-data')
      trainedResponses.value = response.trainedResponses
      // Only set if currentBotId is not already set
      if (!currentBotId.value) {
        currentBotId.value = response.botId
      }
    } catch (err) {
      console.error('Error loading training data:', err)
      // Use empty array as fallback - will use default keywords
      trainedResponses.value = []
    }
  }

  // Set the current bot ID (called when user changes bot selection)
  const setBotId = (botId: string) => {
    console.log('[ActiveListener] Bot changed to:', botId)
    currentBotId.value = botId
    // Clear last analyzed text to force re-analyze with new bot
    lastAnalyzedText.value = ''
  }

  // Start listening
  const startListening = async (botGreeting?: string) => {
    isListening.value = true
    characterMood.value = 'idle'
    console.log('[ActiveListener] Started listening')

    // Load training data
    await loadTrainingData()

    // Show initial greeting after a delay
    setTimeout(() => {
      // Use bot's greeting message if provided, otherwise use default
      if (botGreeting) {
        showResponse({
          message: botGreeting,
          emotion: 'caring'
        })
      } else {
        const greetings = ENCOURAGEMENTS.start
        const random = greetings[Math.floor(Math.random() * greetings.length)]
        showResponse(random)
      }
    }, 1500)
  }

  // Stop listening
  const stopListening = () => {
    isListening.value = false
    characterMood.value = 'idle'
    currentResponse.value = null
    showBubble.value = false
  }

  // Rate limit tracking
  let lastApiCallTime = 0
  const API_COOLDOWN = 5000 // 5 seconds between API calls
  let apiCallCount = ref(0)
  const MAX_API_CALLS_PER_SESSION = 50 // Increased limit

  // Idle detection - trigger when user stops typing for 2 seconds
  const IDLE_TIMEOUT = 2000 // 2 seconds after user stops typing
  let idleDetectionTimer: NodeJS.Timeout | null = null

  // Analyze text and show response - Triggered when user stops typing for 2 seconds
  const analyzeText = (text: string) => {
    if (!isListening.value) {
      console.log('[ActiveListener] Not listening, skipping analysis')
      return
    }

    const cleanText = text.replace(/<[^>]*>/g, '').trim()

    // User is typing - show typing indicator
    isTyping.value = true
    characterMood.value = 'listening'

    // Clear previous idle detection timer
    if (idleDetectionTimer) {
      clearTimeout(idleDetectionTimer)
    }

    // Start new idle detection - triggers when user stops typing for 2 seconds
    idleDetectionTimer = setTimeout(async () => {
      console.log('[ActiveListener] User stopped typing for 2s, analyzing:', cleanText.substring(0, 50))

      // User stopped typing
      isTyping.value = false

      // Skip if text hasn't changed
      if (cleanText === lastAnalyzedText.value) return
      if (cleanText.length < 10) return // Need at least 10 chars

      lastAnalyzedText.value = cleanText
      characterMood.value = 'responding'

      // Check rate limits before calling API
      const now = Date.now()
      const canCallApi = (
        now - lastApiCallTime >= API_COOLDOWN &&
        apiCallCount.value < MAX_API_CALLS_PER_SESSION
      )

      if (canCallApi) {
        // Call OpenAI API for smart, personalized response
        console.log('[ActiveListener] Calling OpenAI API...')
        lastApiCallTime = now
        apiCallCount.value++

        const smartResponse = await getSmartResponse(cleanText, currentBotId.value || undefined)

        if (smartResponse) {
          console.log('[ActiveListener] Got AI response:', smartResponse.message)
          showResponse(smartResponse)
          return
        }
      }

      // Fallback only if rate limited or API fails
      console.log('[ActiveListener] Using fallback (rate limited or API failed)')
      const fallbackResponse = getResponseFromText(cleanText)
      showResponse(fallbackResponse)
    }, IDLE_TIMEOUT) // 2 seconds after user stops typing
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

  // Show response with bubble - bubble stays visible until next response
  const showResponse = (response: ListenerResponse) => {
    currentResponse.value = response
    showBubble.value = true
    characterMood.value = 'idle'
    // Bubble stays visible - no auto-hide timer
  }

  // Call GPT-4o mini API for smart response via server API
  const getSmartResponse = async (text: string, botId?: string): Promise<ListenerResponse | null> => {
    try {
      const response = await $fetch<{ response: string }>('/api/bot/active-listener', {
        method: 'POST',
        body: {
          text: text.substring(0, 200),
          botId: botId || currentBotId.value || 'default'
        }
      })

      if (response?.response) {
        try {
          return JSON.parse(response.response) as ListenerResponse
        } catch {
          // If not JSON, create response from text
          return {
            message: response.response,
            emotion: 'neutral'
          }
        }
      }
      return null
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
    if (idleDetectionTimer) clearTimeout(idleDetectionTimer)
  })

  return {
    currentResponse,
    isListening,
    characterMood,
    isTyping,
    showBubble,
    currentBotId,
    startListening,
    stopListening,
    analyzeText,
    triggerIdleResponse,
    setBotId
  }
}
