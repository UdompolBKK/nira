// composables/useBotConfig.ts
// Bot Configuration & Training Management - Using API with Firebase Admin SDK

// Bot Configuration
export interface BotConfig {
  id: string
  name: string
  avatar: string
  description: string
  systemPrompt: string
  greeting: string
  isDefault: boolean
  isActive: boolean
  trainingCount: number
  createdAt: Date
  updatedAt: Date
}

// Training Data - examples for few-shot learning
export interface TrainingExample {
  id: string
  botId: string
  scenario: string
  userMessage: string
  idealResponse: string
  keywords: string[]
  category: 'greeting' | 'support' | 'crisis' | 'general' | 'farewell'
  isActive: boolean
  createdAt: Date
}

export const useBotConfig = () => {
  const { user } = useAuth()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const bots = ref<BotConfig[]>([])
  const trainingExamples = ref<TrainingExample[]>([])

  // Get auth token for API calls
  const getAuthToken = async (): Promise<string | null> => {
    const firebaseUser = user.value?._firebaseUser
    if (!firebaseUser) return null
    try {
      return await firebaseUser.getIdToken()
    } catch {
      return null
    }
  }

  // ============ Bot Configuration ============

  const getBots = async () => {
    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return []
      }

      const response = await $fetch<{ bots: BotConfig[] }>('/api/admin/bots', {
        headers: { Authorization: `Bearer ${token}` }
      })

      bots.value = response.bots.map(bot => ({
        ...bot,
        createdAt: new Date(bot.createdAt),
        updatedAt: new Date(bot.updatedAt)
      }))

      return bots.value
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด'
      return []
    } finally {
      loading.value = false
    }
  }

  const getDefaultBot = async (): Promise<BotConfig | null> => {
    try {
      const allBots = bots.value.length > 0 ? bots.value : await getBots()
      return allBots.find(bot => bot.isDefault && bot.isActive) || null
    } catch {
      return null
    }
  }

  const createBot = async (data: Omit<BotConfig, 'id' | 'createdAt' | 'updatedAt' | 'trainingCount'>) => {
    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return null
      }

      const response = await $fetch<{ success: boolean; id: string }>('/api/admin/bots', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      })

      if (response.success) {
        await getBots() // Refresh list
        return response.id
      }
      return null
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'ไม่สามารถสร้าง Bot ได้'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateBot = async (id: string, data: Partial<BotConfig>) => {
    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return false
      }

      const response = await $fetch<{ success: boolean }>(`/api/admin/bots/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      })

      if (response.success) {
        await getBots() // Refresh list
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'ไม่สามารถอัพเดท Bot ได้'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteBot = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return false
      }

      const response = await $fetch<{ success: boolean }>(`/api/admin/bots/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.success) {
        await getBots() // Refresh list
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'ไม่สามารถลบ Bot ได้'
      return false
    } finally {
      loading.value = false
    }
  }

  // ============ Training Examples (keeping client-side for now) ============
  // TODO: Move to API if needed

  const getTrainingExamples = async (botId: string) => {
    // Placeholder - will implement API later
    trainingExamples.value = []
    return []
  }

  const addTrainingExample = async (data: Omit<TrainingExample, 'id' | 'createdAt'>) => {
    // Placeholder - will implement API later
    return null
  }

  const deleteTrainingExample = async (id: string, botId: string) => {
    // Placeholder - will implement API later
    return false
  }

  const trainBotWithChat = async (
    botId: string,
    userMessage: string,
    botConfig: BotConfig
  ): Promise<string | null> => {
    // Placeholder - will implement API later
    return null
  }

  const saveTrainingFromChat = async (
    botId: string,
    scenario: string,
    userMessage: string,
    idealResponse: string,
    keywords: string[],
    category: TrainingExample['category']
  ) => {
    // Placeholder - will implement API later
    return null
  }

  const getTrainingContextForBot = async (botId: string): Promise<string> => {
    // Placeholder - will implement API later
    return ''
  }

  return {
    loading,
    error,
    bots,
    trainingExamples,
    // Bot Config
    getBots,
    getDefaultBot,
    createBot,
    updateBot,
    deleteBot,
    // Training
    getTrainingExamples,
    addTrainingExample,
    deleteTrainingExample,
    trainBotWithChat,
    saveTrainingFromChat,
    getTrainingContextForBot
  }
}
