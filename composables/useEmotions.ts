// composables/useEmotions.ts
// Emotion reactions system (Like, Sad, Happy)

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  increment,
  Timestamp
} from 'firebase/firestore'

export type EmotionType = 'like' | 'sad' | 'happy'

export interface Emotion {
  id: string
  postId: string
  userId: string
  type: EmotionType
  createdAt: Date
}

export const useEmotions = () => {
  const { $firestore } = useNuxtApp()
  const { user } = useAuth()

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get user's emotion on a post
  const getUserEmotion = async (postId: string): Promise<EmotionType | null> => {
    if (!$firestore || !user.value) return null

    try {
      const emotionId = `${postId}_${user.value.uid}`
      const emotionRef = doc($firestore, 'emotions', emotionId)
      const emotionDoc = await getDoc(emotionRef)

      if (emotionDoc.exists()) {
        return emotionDoc.data().type as EmotionType
      }
      return null
    } catch (err) {
      console.error('Error getting user emotion:', err)
      return null
    }
  }

  // Toggle emotion on a post
  const toggleEmotion = async (postId: string, type: EmotionType): Promise<boolean> => {
    if (!$firestore || !user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    try {
      const emotionId = `${postId}_${user.value.uid}`
      const emotionRef = doc($firestore, 'emotions', emotionId)
      const postRef = doc($firestore, 'posts', postId)

      const emotionDoc = await getDoc(emotionRef)

      if (emotionDoc.exists()) {
        const existingType = emotionDoc.data().type as EmotionType

        if (existingType === type) {
          // Same emotion - remove it
          await deleteDoc(emotionRef)
          await updateDoc(postRef, {
            [`${type}Count`]: increment(-1)
          })
        } else {
          // Different emotion - update it
          await setDoc(emotionRef, {
            postId,
            userId: user.value.uid,
            type,
            createdAt: Timestamp.now()
          })
          await updateDoc(postRef, {
            [`${existingType}Count`]: increment(-1),
            [`${type}Count`]: increment(1)
          })
        }
      } else {
        // New emotion
        await setDoc(emotionRef, {
          postId,
          userId: user.value.uid,
          type,
          createdAt: Timestamp.now()
        })
        await updateDoc(postRef, {
          [`${type}Count`]: increment(1)
        })
      }

      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Get emotion counts for a post
  const getEmotionCounts = async (postId: string): Promise<{ like: number; sad: number; happy: number }> => {
    if (!$firestore) return { like: 0, sad: 0, happy: 0 }

    try {
      const postRef = doc($firestore, 'posts', postId)
      const postDoc = await getDoc(postRef)

      if (postDoc.exists()) {
        const data = postDoc.data()
        return {
          like: data.likeCount || 0,
          sad: data.sadCount || 0,
          happy: data.happyCount || 0
        }
      }
      return { like: 0, sad: 0, happy: 0 }
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
