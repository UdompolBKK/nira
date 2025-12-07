import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type Storage } from 'firebase/storage'

// Singleton instances
let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let firebaseFirestore: Firestore | null = null
let firebaseStorage: Storage | null = null

export const useFirebase = () => {
  // Initialize only once
  if (!firebaseApp) {
    const config = useRuntimeConfig()

    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId
    }

    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig)
    } else {
      firebaseApp = getApps()[0]
    }

    firebaseAuth = getAuth(firebaseApp)
    firebaseFirestore = getFirestore(firebaseApp)
    firebaseStorage = getStorage(firebaseApp)
  }

  return {
    app: firebaseApp as FirebaseApp,
    auth: firebaseAuth as Auth,
    firestore: firebaseFirestore as Firestore,
    storage: firebaseStorage as Storage
  }
}
