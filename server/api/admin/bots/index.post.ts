// POST /api/admin/bots - Create new bot (super admin only)
import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

const SUPER_ADMIN_EMAILS = ['udompol.bkk@gmail.com']

export default defineEventHandler(async (event) => {
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
    const { name, avatar, description, systemPrompt, greeting, isDefault, isActive } = body

    if (!name) {
      throw createError({ statusCode: 400, message: 'Name is required' })
    }

    const db = adminFirestore()

    // If setting as default, unset other defaults first
    if (isDefault) {
      const defaultBots = await db.collection('botConfigs')
        .where('isDefault', '==', true)
        .get()

      const batch = db.batch()
      defaultBots.docs.forEach(doc => {
        batch.update(doc.ref, { isDefault: false })
      })
      await batch.commit()
    }

    // Create bot
    const docRef = await db.collection('botConfigs').add({
      name,
      avatar: avatar || '',
      description: description || '',
      systemPrompt: systemPrompt || '',
      greeting: greeting || '',
      isDefault: isDefault || false,
      isActive: isActive !== false,
      trainingCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })

    return {
      success: true,
      id: docRef.id
    }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error creating bot:', err)
    throw createError({ statusCode: 500, message: err.message })
  }
})
