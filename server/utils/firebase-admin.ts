import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getStorage, type Storage } from 'firebase-admin/storage'

let adminApp: App | null = null

export const getFirebaseAdmin = () => {
  if (!adminApp && getApps().length === 0) {
    const config = useRuntimeConfig()

    // Process private key - handle multiple formats
    let privateKey = config.firebaseAdminPrivateKey || ''

    // Remove surrounding quotes if present (dotenv may include them)
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) ||
        (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1)
    }

    // Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n')

    // Debug: log config presence (not values)
    console.log('Firebase Admin Config:', {
      hasProjectId: !!config.firebaseAdminProjectId,
      hasClientEmail: !!config.firebaseAdminClientEmail,
      hasPrivateKey: !!privateKey,
      privateKeyLength: privateKey.length,
      privateKeyStartsWith: privateKey.substring(0, 30),
      privateKeyEndsWith: privateKey.substring(privateKey.length - 30)
    })

    if (!config.firebaseAdminProjectId || !config.firebaseAdminClientEmail || !privateKey) {
      throw new Error('Firebase Admin SDK credentials are not configured properly')
    }

    // Initialize with service account credentials
    adminApp = initializeApp({
      credential: cert({
        projectId: config.firebaseAdminProjectId,
        clientEmail: config.firebaseAdminClientEmail,
        privateKey: privateKey
      }),
      storageBucket: config.public.firebaseStorageBucket
    })
  } else if (!adminApp) {
    adminApp = getApps()[0]
  }

  return adminApp
}

export const adminAuth = (): Auth => {
  return getAuth(getFirebaseAdmin())
}

export const adminFirestore = (): Firestore => {
  return getFirestore(getFirebaseAdmin())
}

export const adminStorage = (): Storage => {
  return getStorage(getFirebaseAdmin())
}
