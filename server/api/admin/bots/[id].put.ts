// PUT /api/admin/bots/:id - Update bot (super admin only)
import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

const SUPER_ADMIN_EMAILS = ['udompol.bkk@gmail.com']

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Bot ID is required' })
  }

  // Get authorization header
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    // Verify token
    const decodedToken = await adminAuth().verifyIdToken(token)

    // Check if super admin
    if (!SUPER_ADMIN_EMAILS.includes(decodedToken.email || '')) {
      throw createError({ statusCode: 403, message: 'Forbidden - Super Admin only' })
    }

    // Get body
    const body = await readBody(event)
    const db = adminFirestore()

    // Check if bot exists
    const botRef = db.collection('botConfigs').doc(id)
    const botDoc = await botRef.get()
    if (!botDoc.exists) {
      throw createError({ statusCode: 404, message: 'Bot not found' })
    }

    // If setting as default, unset other defaults first
    if (body.isDefault) {
      const defaultBots = await db.collection('botConfigs')
        .where('isDefault', '==', true)
        .get()

      const batch = db.batch()
      defaultBots.docs.forEach(doc => {
        if (doc.id !== id) {
          batch.update(doc.ref, { isDefault: false })
        }
      })
      await batch.commit()
    }

    // Update bot
    const updateData: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp()
    }

    // Only include fields that were provided
    if (body.name !== undefined) updateData.name = body.name
    if (body.avatar !== undefined) updateData.avatar = body.avatar
    if (body.description !== undefined) updateData.description = body.description
    if (body.systemPrompt !== undefined) updateData.systemPrompt = body.systemPrompt
    if (body.greeting !== undefined) updateData.greeting = body.greeting
    if (body.isDefault !== undefined) updateData.isDefault = body.isDefault
    if (body.isActive !== undefined) updateData.isActive = body.isActive

    await botRef.update(updateData)

    return { success: true }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error updating bot:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
