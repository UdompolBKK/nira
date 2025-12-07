# PetCanGo App

Nuxt 3 application with Firebase integration (Client SDK + Admin SDK)

## Setup

1. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Configure Firebase:

   - Create a `.env` file from `.env.example`:
     ```bash
     cp .env.example .env
     ```

   - Get Firebase Client config from [Firebase Console](https://console.firebase.google.com/):
     - Go to Project Settings → General → Your apps → Web app
     - Copy the config values to `.env`

   - Get Firebase Admin SDK credentials:
     - Go to Project Settings → Service Accounts
     - Click "Generate new private key"
     - Download the JSON file
     - Extract `project_id`, `client_email`, and `private_key` to `.env`

## Development

Start the development server:

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## Firebase Usage

### Client-side (Composables)

**Basic Firebase access:**
```vue
<script setup>
const { auth, firestore, storage } = useFirebase()
</script>
```

**Firestore operations:**
```vue
<script setup>
const { getDocument, getCollection, addDocument, updateDocument, deleteDocument } = useFirestore()

// Get a single document
const user = await getDocument('users', 'user-id')

// Get collection with query
const posts = await getCollection('posts', orderBy('createdAt', 'desc'), limit(10))

// Add document
const newId = await addDocument('posts', { title: 'Hello', content: 'World' })

// Update document
await updateDocument('posts', 'post-id', { title: 'Updated' })

// Delete document
await deleteDocument('posts', 'post-id')
</script>
```

**Storage operations:**
```vue
<script setup>
const { uploadFile, getFileUrl, deleteFile, listFiles } = useFirebaseStorage()

// Upload file
const handleUpload = async (file: File) => {
  const { url } = await uploadFile(`images/${file.name}`, file)
  console.log('Uploaded:', url)
}

// Get file URL
const imageUrl = await getFileUrl('images/photo.jpg')

// Delete file
await deleteFile('images/photo.jpg')

// List files in folder
const files = await listFiles('images/')
</script>
```

### Server-side (API Routes)

```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const firestore = adminFirestore()
  const auth = adminAuth()
  const storage = adminStorage()

  // Firestore Admin
  const snapshot = await firestore.collection('users').get()
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // Auth Admin
  const userRecord = await auth.getUser('user-id')

  // Storage Admin
  const bucket = storage.bucket()
  const [files] = await bucket.getFiles()

  return { users, userRecord, files }
})
```

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Learn More

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
