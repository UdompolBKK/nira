// PUT /api/profile - Update current user's profile
import { adminFirestore } from '~/server/utils/firebase-admin'
import { verifyAuth } from '~/server/utils/auth-helper'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const user = await verifyAuth(event)
  const body = await readBody(event)

  // Allowed fields to update
  const allowedFields = ['displayName', 'slug', 'photoURL', 'bio']
  const updateData: Record<string, any> = {
    updatedAt: FieldValue.serverTimestamp()
  }

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field]
    }
  }

  try {
    const db = adminFirestore()
    const docRef = db.collection('users').doc(user.uid)

    // Check if document exists
    const doc = await docRef.get()
    if (doc.exists) {
      await docRef.update(updateData)
    } else {
      await docRef.set({
        ...updateData,
        createdAt: FieldValue.serverTimestamp()
      })
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error updating profile:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
