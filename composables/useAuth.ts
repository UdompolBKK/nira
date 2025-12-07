import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
  type Auth
} from 'firebase/auth'

// Serializable user data type (safe for Vue reactivity)
export interface SerializableUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  isAnonymous: boolean
  metadata: {
    creationTime?: string
    lastSignInTime?: string
  }
  providerData: Array<{
    providerId: string
    uid: string
    displayName: string | null
    email: string | null
    photoURL: string | null
  }>
  customClaims?: Record<string, any> // Custom claims for roles
  _firebaseUser?: User // Raw reference (marked as non-reactive)
}

// Extract only serializable user data to avoid Vue reactivity issues
// with Firebase User object (which contains cross-origin references)
function extractUserData(firebaseUser: User | null): SerializableUser | null {
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

// Store auth reference outside composable
let authInstance: Auth | null = null

const getAuthInstance = (): Auth | null => {
  if (!authInstance && import.meta.client) {
    try {
      const { auth } = useFirebase()
      authInstance = auth
    } catch (err) {
      console.error('Failed to initialize Firebase Auth:', err)
    }
  }
  return authInstance
}

export const useAuth = () => {
  const user = useState<SerializableUser | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => true)
  const error = useState<string | null>('auth-error', () => null)
  const authInitialized = useState<boolean>('auth-initialized', () => false)

  // Auth initialization is handled by plugins/auth.client.ts
  // Fallback: If plugin hasn't run yet (shouldn't happen), initialize here
  if (!authInitialized.value && import.meta.client) {
    const auth = getAuthInstance()
    if (auth) {
      authInitialized.value = true
      onAuthStateChanged(auth, (currentUser) => {
        user.value = extractUserData(currentUser)
        loading.value = false
      }, (err) => {
        console.error('Auth state change error:', err)
        loading.value = false
      })
    } else {
      loading.value = false
    }
  }

  /**
   * Sign in with Email and Password
   */
  const signInWithEmail = async (email: string, password: string): Promise<UserCredential | null> => {
    const auth = getAuthInstance()
    if (!auth) {
      error.value = 'ไม่สามารถเชื่อมต่อระบบได้'
      return null
    }

    try {
      error.value = null
      loading.value = true
      const credential = await signInWithEmailAndPassword(auth, email, password)
      // Don't set user here - let onAuthStateChanged handle it
      // This avoids reactivity issues with Firebase User object
      return credential
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      console.error('Email sign in error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign up with Email and Password
   */
  const signUpWithEmail = async (email: string, password: string): Promise<UserCredential | null> => {
    const auth = getAuthInstance()
    if (!auth) {
      error.value = 'ไม่สามารถเชื่อมต่อระบบได้'
      return null
    }

    try {
      error.value = null
      loading.value = true
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      // Don't set user here - let onAuthStateChanged handle it
      return credential
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      console.error('Email sign up error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with Google
   */
  const signInWithGoogle = async (): Promise<UserCredential | null> => {
    const auth = getAuthInstance()
    if (!auth) {
      error.value = 'ไม่สามารถเชื่อมต่อระบบได้'
      return null
    }

    try {
      error.value = null
      loading.value = true
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      const credential = await signInWithPopup(auth, provider)
      // Don't set user here - let onAuthStateChanged handle it
      return credential
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      console.error('Google sign in error:', err)
      return null
    } finally {
      loading.value = false
    }
  }


  /**
   * Sign out
   */
  const logout = async (): Promise<boolean> => {
    const auth = getAuthInstance()
    if (!auth) return false

    try {
      error.value = null
      await signOut(auth)
      user.value = null
      return true
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      console.error('Sign out error:', err)
      return false
    }
  }

  /**
   * Get user-friendly error messages
   */
  const getErrorMessage = (code: string): string => {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'อีเมลนี้ถูกใช้งานแล้ว',
      'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
      'auth/user-not-found': 'ไม่พบผู้ใช้งานนี้',
      'auth/wrong-password': 'รหัสผ่านไม่ถูกต้อง',
      'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
      'auth/too-many-requests': 'คำขอมากเกินไป กรุณาลองใหม่ภายหลัง',
      'auth/popup-closed-by-user': 'ปิดหน้าต่างการเข้าสู่ระบบ',
      'auth/cancelled-popup-request': 'ยกเลิกการเข้าสู่ระบบ',
      'auth/account-exists-with-different-credential': 'บัญชีนี้มีอยู่แล้วด้วยวิธีการเข้าสู่ระบบอื่น'
    }
    return errorMessages[code] || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Check if user is Super Admin
   * ตรวจสอบจาก custom claims ใน Firebase Auth หรือ email fallback
   */
  const isSuperAdmin = computed(() => {
    if (!user.value) return false

    // ตรวจสอบจาก custom claims (if available)
    const claims = user.value.customClaims
    if (claims) {
      if (claims.superAdmin === true || claims.role === 'superadmin') {
        return true
      }
    }

    // Fallback: ตรวจสอบจาก email (สำหรับ development และ initial setup)
    const superAdminEmails = ['udompol.bkk@gmail.com']
    return superAdminEmails.includes(user.value?.email || '')
  })

  /**
   * Check if user is admin (includes Super Admin)
   * ตรวจสอบจาก custom claims ใน Firebase Auth
   */
  const isAdmin = computed(() => {
    if (!user.value) return false

    // Super Admin is also Admin
    if (isSuperAdmin.value) return true

    // ตรวจสอบจาก custom claims (if available)
    const claims = user.value.customClaims
    if (claims) {
      if (claims.admin === true || claims.role === 'admin') {
        return true
      }
    }

    return false
  })

  /**
   * Get user role
   */
  const userRole = computed(() => {
    if (isSuperAdmin.value) return 'superadmin'
    if (isAdmin.value) return 'admin'
    if (isAuthenticated.value) return 'user'
    return 'guest'
  })

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userRole,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout
  }
}
