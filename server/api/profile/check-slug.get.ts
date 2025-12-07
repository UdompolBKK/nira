// GET /api/profile/check-slug?slug=xxx - Check if slug is already taken
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug as string

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  try {
    const db = adminFirestore()
    const snapshot = await db.collection('users')
      .where('slug', '==', slug)
      .limit(1)
      .get()

    return {
      exists: !snapshot.empty,
      available: snapshot.empty
    }
  } catch (err: any) {
    console.error('Error checking slug:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
