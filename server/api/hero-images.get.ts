// server/api/hero-images.get.ts - Get hero banner images
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()
    const heroImagesRef = db.collection('heroImages')
    const snapshot = await heroImagesRef.orderBy('order', 'asc').get()

    if (snapshot.empty) {
      // Return empty array if no images in database
      return {
        images: []
      }
    }

    const images = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter((img: any) => img.isActive) // Only return active images

    return { images }
  } catch (error) {
    console.error('[API] Error fetching hero images:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching hero images'
    })
  }
})
