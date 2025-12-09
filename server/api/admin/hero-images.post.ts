// server/api/admin/hero-images.post.ts - Upload hero banner image to Firebase Storage
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

    // Parse multipart form data
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const fileData = formData.find(item => item.name === 'file')
    if (!fileData || !fileData.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file data found'
      })
    }

    // Validate file type (only images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(fileData.type || '')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only JPEG, PNG, and WebP are allowed'
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = fileData.filename?.split('.').pop() || 'jpg'
    const filename = `hero-images/${timestamp}.${extension}`

    // Upload to Firebase Storage
    const storage = adminStorage()
    const bucket = storage.bucket()
    const file = bucket.file(filename)

    await file.save(fileData.data, {
      metadata: {
        contentType: fileData.type,
        metadata: {
          uploadedBy: decodedToken.uid,
          uploadedAt: new Date().toISOString()
        }
      }
    })

    // Make file publicly accessible
    await file.makePublic()

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

    // Get current max order
    const heroImagesSnapshot = await db.collection('heroImages').orderBy('order', 'desc').limit(1).get()
    const maxOrder = heroImagesSnapshot.empty ? -1 : heroImagesSnapshot.docs[0].data().order

    // Save metadata to Firestore
    const heroImageDoc = await db.collection('heroImages').add({
      url: publicUrl,
      filename,
      order: maxOrder + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: decodedToken.uid
    })

    return {
      success: true,
      image: {
        id: heroImageDoc.id,
        url: publicUrl,
        filename,
        order: maxOrder + 1,
        isActive: true
      }
    }
  } catch (error: any) {
    console.error('[API] Error uploading hero image:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error uploading hero image'
    })
  }
})
