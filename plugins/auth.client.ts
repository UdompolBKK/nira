// Client-side plugin to initialize Firebase Auth before app renders
// This ensures auth state is resolved before components mount

import { onAuthStateChanged, type User } from 'firebase/auth'

// Extract only serializable user data to avoid Vue reactivity issues
// with Firebase User object (which contains cross-origin references)
function extractUserData(firebaseUser: User | null) {
  if (!firebaseUser) return null

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    isAnonymous: firebaseUser.isAnonymous,
    metadata: {
      creationTime: firebaseUser.metadata.creationTime,
      lastSignInTime: firebaseUser.metadata.lastSignInTime
    },
    providerData: firebaseUser.providerData.map(p => ({
      providerId: p.providerId,
      uid: p.uid,
      displayName: p.displayName,
      email: p.email,
      photoURL: p.photoURL
    })),
    // Store reference for methods that need the original user
    _firebaseUser: markRaw(firebaseUser)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client
  if (import.meta.server) return

  const { auth } = useFirebase()

  // Get shared state
  const user = useState('auth-user', () => null)
  const loading = useState('auth-loading', () => true)
  const authInitialized = useState('auth-initialized', () => false)

  // If already initialized, skip
  if (authInitialized.value) return

  authInitialized.value = true

  // Set up persistent listener that stays active throughout app lifecycle
  // This will update state on login, logout, and token refresh
  onAuthStateChanged(auth, (currentUser) => {
    user.value = extractUserData(currentUser) as any
    loading.value = false
  }, (err) => {
    console.error('Auth error:', err)
    loading.value = false
  })
})
