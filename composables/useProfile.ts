// composables/useProfile.ts - Using API with Firebase Admin SDK
import { ref } from 'vue'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useFirebase } from './useFirebase'

export interface UserProfile {
  uid?: string
  displayName?: string
  slug?: string
  photoURL?: string
  bio?: string
}

export const useProfile = (uid: string | null) => {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { user } = useAuth()
  const { storage } = useFirebase()

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

  // Return early if no uid
  if (!uid) {
    return {
      profile,
      loading,
      error,
      fetchProfile: async () => {},
      saveProfile: async () => false,
      uploadImage: async () => '',
      checkSlug: async () => false
    }
  }

  // Fetch profile from API
  const fetchProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return
      }

      const response = await $fetch<{ profile: UserProfile | null }>('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      profile.value = response.profile
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด'
    } finally {
      loading.value = false
    }
  }

  // Save profile via API
  const saveProfile = async (data: Partial<UserProfile>) => {
    loading.value = true
    error.value = null

    try {
      const token = await getAuthToken()
      if (!token) {
        error.value = 'กรุณาเข้าสู่ระบบ'
        return false
      }

      await $fetch('/api/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      })

      // Update local state
      if (profile.value) {
        profile.value = { ...profile.value, ...data }
      } else {
        profile.value = data
      }

      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'ไม่สามารถบันทึกโปรไฟล์ได้'
      return false
    } finally {
      loading.value = false
    }
  }

  // Upload image - using client-side Storage (configured with public upload rules)
  const uploadImage = async (file: File, onProgress?: (pct: number) => void): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        loading.value = true
        const path = `profiles/${uid}/avatar-${Date.now()}`
        const sRef = storageRef(storage, path)
        const task = uploadBytesResumable(sRef, file)

        task.on('state_changed', (snapshot) => {
          if (onProgress && snapshot.totalBytes) {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            onProgress(pct)
          }
        }, (err) => {
          error.value = err.message || String(err)
          reject(err)
        }, async () => {
          try {
            const url = await getDownloadURL(sRef)
            // Update profile via API
            await saveProfile({ photoURL: url })
            resolve(url)
          } catch (err: any) {
            error.value = err.message || String(err)
            reject(err)
          }
        })
      } catch (err: any) {
        error.value = err.message || String(err)
        reject(err)
      } finally {
        loading.value = false
      }
    })
  }

  // Check if slug is already taken via API
  const checkSlug = async (slug: string): Promise<boolean> => {
    try {
      const response = await $fetch<{ exists: boolean }>('/api/profile/check-slug', {
        params: { slug }
      })
      return response.exists
    } catch {
      return false
    }
  }

  // Initial fetch
  fetchProfile()

  return {
    profile,
    loading,
    error,
    fetchProfile,
    saveProfile,
    uploadImage,
    checkSlug
  }
}
