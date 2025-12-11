import { doc, getDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  email: string | null
  emailVerified: boolean
  displayName: string | null
  anonymousName: string | null
  photoURL: string | null
  slug: string | null
  bio: string | null
  role: 'user' | 'admin' | 'superadmin'
  isPremium: boolean
  createdAt: Date | null
  updatedAt: Date | null
  lastLoginAt: Date | null
}

// Global state for user profile
const userProfile = ref<UserProfile | null>(null)
const profileLoading = ref(true)
const profileError = ref<string | null>(null)

let unsubscribe: Unsubscribe | null = null

export const useUserProfile = () => {
  const { firestore } = useFirebase()
  const { user } = useAuth()

  /**
   * Fetch user profile from Firestore (one-time)
   */
  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    if (!firestore) return null

    try {
      const userDoc = await getDoc(doc(firestore, 'users', uid))

      if (!userDoc.exists()) {
        return null
      }

      const data = userDoc.data()
      return {
        uid: userDoc.id,
        email: data.email || null,
        emailVerified: data.emailVerified || false,
        displayName: data.displayName || null,
        anonymousName: data.anonymousName || null,
        photoURL: data.photoURL || null,
        slug: data.slug || null,
        bio: data.bio || null,
        role: data.role || 'user',
        isPremium: data.isPremium || false,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  /**
   * Subscribe to user profile changes (real-time)
   */
  const subscribeToProfile = (uid: string) => {
    if (!firestore) return

    // Unsubscribe from previous listener
    if (unsubscribe) {
      unsubscribe()
    }

    profileLoading.value = true
    profileError.value = null

    unsubscribe = onSnapshot(
      doc(firestore, 'users', uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          userProfile.value = {
            uid: docSnapshot.id,
            email: data.email || null,
            emailVerified: data.emailVerified || false,
            displayName: data.displayName || null,
            anonymousName: data.anonymousName || null,
            photoURL: data.photoURL || null,
            slug: data.slug || null,
            bio: data.bio || null,
            role: data.role || 'user',
            isPremium: data.isPremium || false,
            createdAt: data.createdAt?.toDate?.() || null,
            updatedAt: data.updatedAt?.toDate?.() || null,
            lastLoginAt: data.lastLoginAt?.toDate?.() || null
          }
        } else {
          userProfile.value = null
        }
        profileLoading.value = false
      },
      (error) => {
        console.error('Error subscribing to user profile:', error)
        profileError.value = 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้'
        profileLoading.value = false
      }
    )
  }

  /**
   * Clear profile data and unsubscribe
   */
  const clearProfile = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    userProfile.value = null
    profileLoading.value = false
    profileError.value = null
  }

  /**
   * Check if user email is verified
   */
  const isEmailVerified = computed(() => {
    // For Google users, always consider verified
    if (user.value?.providerData?.some(p => p.providerId === 'google.com')) {
      return true
    }
    // For email/password users, check Firestore
    return userProfile.value?.emailVerified ?? false
  })

  /**
   * Check if user is admin (includes superadmin)
   */
  const isAdmin = computed(() => {
    const role = userProfile.value?.role
    return role === 'admin' || role === 'superadmin'
  })

  /**
   * Check if user is superadmin
   */
  const isSuperAdmin = computed(() => {
    return userProfile.value?.role === 'superadmin'
  })

  /**
   * Check if user has premium subscription
   */
  const isPremium = computed(() => {
    return userProfile.value?.isPremium ?? false
  })

  // Auto-subscribe when user changes
  if (import.meta.client) {
    watch(user, (newUser) => {
      if (newUser?.uid) {
        subscribeToProfile(newUser.uid)
      } else {
        clearProfile()
      }
    }, { immediate: true })
  }

  return {
    userProfile,
    profileLoading,
    profileError,
    fetchProfile,
    subscribeToProfile,
    clearProfile,
    isEmailVerified,
    isAdmin,
    isSuperAdmin,
    isPremium
  }
}
