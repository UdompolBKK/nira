// PUT /api/user/profile - Update user profile (authenticated)
import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'

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
    const userId = decodedToken.uid

    // Parse body
    const body = await readBody(event)
    const { displayName, slug, aboutMe, photoURL, photoURLThumb } = body

    // Validate
    if (!displayName?.trim()) {
      throw createError({ statusCode: 400, message: 'Display name is required' })
    }

    if (!slug?.trim()) {
      throw createError({ statusCode: 400, message: 'Slug is required' })
    }

    // Sanitize slug
    const sanitizedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')

    if (sanitizedSlug.length < 3) {
      throw createError({ statusCode: 400, message: 'Slug must be at least 3 characters' })
    }

    if (sanitizedSlug.length > 20) {
      throw createError({ statusCode: 400, message: 'Slug must not exceed 20 characters' })
    }

    const db = adminFirestore()

    // Check if slug is already taken by another user
    const slugQuery = await db.collection('users')
      .where('slug', '==', sanitizedSlug)
      .get()

    if (!slugQuery.empty) {
      // Check if it's not the current user
      const existingUser = slugQuery.docs[0]
      if (existingUser.id !== userId) {
        throw createError({ statusCode: 409, message: `@${sanitizedSlug} is already taken` })
      }
    }

    // Update user document
    const userRef = db.collection('users').doc(userId)

    const updateData: any = {
      displayName: displayName.trim(),
      slug: sanitizedSlug,
      updatedAt: new Date()
    }

    // About me - limit to 300 characters
    if (aboutMe !== undefined) {
      updateData.aboutMe = (aboutMe || '').trim().substring(0, 300)
    }

    if (photoURL) {
      updateData.photoURL = photoURL
    }

    if (photoURLThumb) {
      updateData.photoURLThumb = photoURLThumb
    }

    await userRef.set(updateData, { merge: true })

    return {
      success: true,
      message: 'Profile updated successfully',
      profile: {
        displayName: displayName.trim(),
        slug: sanitizedSlug,
        aboutMe: updateData.aboutMe || null,
        photoURL: photoURL || null,
        photoURLThumb: photoURLThumb || null
      }
    }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Error updating profile:', err)
    throw createError({ statusCode: 500, message: err.message || 'Failed to update profile' })
  }
})
