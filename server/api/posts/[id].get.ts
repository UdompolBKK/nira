// GET /api/posts/:id - Get single post by ID
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Post ID is required' })
  }

  try {
    const db = adminFirestore()
    const doc = await db.collection('posts').doc(id).get()

    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Post not found' })
    }

    const data = doc.data()!
    return {
      post: {
        id: doc.id,
        ...data,
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
