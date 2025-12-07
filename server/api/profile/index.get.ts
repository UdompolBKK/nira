// GET /api/profile - Get current user's profile
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'

export default defineEventHandler(async (event) => {
  const user = await verifyAuth(event)

  try {
    const db = adminFirestore()
    const docRef = db.collection('users').doc(user.uid)
    const doc = await docRef.get()

    if (!doc.exists) {
      return { profile: null }
    }

    return {
      profile: {
        uid: user.uid,
        ...doc.data()
      }
    }
  } catch (err: any) {
    console.error('Error getting profile:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
