import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getStorage, type Storage } from 'firebase-admin/storage'

let adminApp: App | null = null

export const getFirebaseAdmin = () => {
  if (!adminApp && getApps().length === 0) {
    const config = useRuntimeConfig()

    // Initialize with service account credentials
    adminApp = initializeApp({
      credential: cert({
        projectId: config.firebaseAdminProjectId,
        clientEmail: config.firebaseAdminClientEmail,
        privateKey: config.firebaseAdminPrivateKey?.replace(/\\n/g, '\n')
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
