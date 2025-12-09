// server/api/admin/hero-images/[id].delete.ts - Delete hero banner image
import { adminFirestore, adminStorage, adminAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin authorization
    const authHeader = event.node.req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const token = authHeader.split('Bearer ')[1]
    const auth = adminAuth()
    const decodedToken = await auth.verifyIdToken(token)

    // Check if user has super-admin role
    const db = adminFirestore()
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (!userData || userData.role !== 'super-admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - Super admin access required'
      })
    }

    const imageId = event.context.params?.id
    if (!imageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image ID is required'
      })
    }

    // Get image document
    const imageDoc = await db.collection('heroImages').doc(imageId).get()
    if (!imageDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found'
      })
    }

    const imageData = imageDoc.data()

    // Delete file from Storage (if filename exists)
    if (imageData?.filename) {
      try {
        const storage = adminStorage()
        const bucket = storage.bucket()
        const file = bucket.file(imageData.filename)
        await file.delete()
      } catch (storageError) {
        console.error('[API] Error deleting file from storage:', storageError)
        // Continue even if storage deletion fails
      }
    }

    // Delete document from Firestore
    await db.collection('heroImages').doc(imageId).delete()

    return {
      success: true,
      message: 'Hero image deleted successfully'
    }
  } catch (error: any) {
    console.error('[API] Error deleting hero image:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error deleting hero image'
    })
  }
})
