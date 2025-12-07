import { ref, watch } from 'vue'
import { doc, getDoc, setDoc, onSnapshot, query, collection, where, getDocs } from 'firebase/firestore'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useFirebase } from './useFirebase'

export const useProfile = (uid: string | null) => {
  const profile = ref<{ displayName?: string; slug?: string; photoURL?: string } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  if (!uid) return { profile, loading, error, saveProfile: async () => {}, uploadImage: async () => null, checkSlug: async () => false }

  const { firestore, storage } = useFirebase()
  const docRef = doc(firestore, 'users', uid as string)

  // realtime listener
  const unsub = onSnapshot(docRef, (snap) => {
    if (snap.exists()) profile.value = snap.data() as any
    else profile.value = null
  }, (err) => {
    error.value = String(err)
  })

  const saveProfile = async (data: { displayName?: string; slug?: string; photoURL?: string }) => {
    try {
      loading.value = true
      await setDoc(docRef, data, { merge: true })
      return true
    } catch (err: any) {
      error.value = err.message || String(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const uploadImage = async (file: File, onProgress?: (pct: number) => void) => {
    return new Promise<string>(async (resolve, reject) => {
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
            await setDoc(docRef, { photoURL: url }, { merge: true })
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

  const checkSlug = async (slug: string) => {
    try {
      const usersCol = collection(firestore, 'users')
      const q = query(usersCol, where('slug', '==', slug))
      const snaps = await getDocs(q)
      return snaps.empty === false
    } catch (err) {
      return false
    }
  }

  return { profile, loading, error, saveProfile, uploadImage, checkSlug, _unsub: unsub }
}
