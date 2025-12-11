// GET /api/posts/:id - Get single post by ID
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  try {
    const db = adminFirestore()
    const doc = await db.collection('storyPosts').doc(id).get()

    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Post not found' })
    }

    const data = doc.data()!

    // Fetch author data from users collection
    let authorName = 'ไม่ระบุชื่อ'
    let authorSlug = null
    let authorPhoto = null

    if (data.userId) {
      try {
        const userDoc = await db.collection('users').doc(data.userId).get()
        if (userDoc.exists) {
          const userData = userDoc.data()
          authorName = userData?.displayName || userData?.slug || 'ไม่ระบุชื่อ'
          authorSlug = userData?.slug || null
          authorPhoto = userData?.photoURL || null
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
      }
    }

    return {
      post: {
        id: doc.id,
        ...data,
        authorName,
        authorSlug,
        authorPhoto,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      }
    }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error getting post:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
