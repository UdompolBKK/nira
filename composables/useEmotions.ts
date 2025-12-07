// composables/useEmotions.ts
// Emotion reactions system (Like, Sad, Happy) - Using API with Firebase Admin SDK

export type EmotionType = 'like' | 'sad' | 'happy'

export interface Emotion {
  id: string
  postId: string
  userId: string
  type: EmotionType
  createdAt: Date
}

export const useEmotions = () => {
  const { user } = useAuth()

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get Firebase auth token
  const getAuthToken = async (): Promise<string> => {
    const firebaseUser = user.value?._firebaseUser
    if (!firebaseUser) {
      throw new Error('กรุณาเข้าสู่ระบบก่อน')
    }
    const token = await firebaseUser.getIdToken()
    return token
  }

  // Get user's emotion on a post
  const getUserEmotion = async (postId: string): Promise<EmotionType | null> => {
    if (!user.value) return null

    try {
      const token = await getAuthToken()
      const response = await $fetch<{ emotion: EmotionType | null }>(`/api/emotions/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      return response.emotion
    } catch (err) {
      console.error('Error getting user emotion:', err)
      return null
    }
  }

  // Toggle emotion on a post
  const toggleEmotion = async (postId: string, type: EmotionType): Promise<boolean> => {
    if (!user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      await $fetch('/api/emotions/toggle', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { postId, type }
      })

      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด'
      return false
    } finally {
      loading.value = false
    }
  }

  // Get emotion counts for a post
  const getEmotionCounts = async (postId: string): Promise<{ like: number; sad: number; happy: number }> => {
    try {
      const response = await $fetch<{ counts: { like: number; sad: number; happy: number } }>(`/api/emotions/counts/${postId}`)
      return response.counts
    } catch (err) {
      console.error('Error getting emotion counts:', err)
      return { like: 0, sad: 0, happy: 0 }
    }
  }

  return {
    loading,
    error,
    getUserEmotion,
    toggleEmotion,
    getEmotionCounts
  }
}
