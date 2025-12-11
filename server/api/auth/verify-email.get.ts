import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    // Get Firebase Admin instances
    const auth = adminAuth()
    const db = adminFirestore()

    const query = getQuery(event)
    const { token, uid } = query

    if (!token || !uid) {
      // Redirect to error page
      return sendRedirect(event, '/login?error=invalid_link')
    }

    // Get user from Firestore
    const userDoc = await db.collection('users').doc(uid as string).get()

    if (!userDoc.exists) {
      return sendRedirect(event, '/login?error=user_not_found')
    }

    const userData = userDoc.data()!

    // Check if already verified
    if (userData.emailVerified === true) {
      return sendRedirect(event, '/login?verified=true&message=already_verified')
    }

    // Check verification token
    const verification = userData.emailVerification
    if (!verification || verification.token !== token) {
      return sendRedirect(event, '/login?error=invalid_token')
    }

    // Check if token expired
    const expiresAt = verification.expiresAt?.toDate?.() || new Date(verification.expiresAt)
    if (new Date() > expiresAt) {
      return sendRedirect(event, '/verify-email?error=token_expired')
    }

    // Update user as verified in Firestore
    await db.collection('users').doc(uid as string).update({
      emailVerified: true,
      'emailVerification.verifiedAt': new Date(),
      'emailVerification.token': null, // Clear token after use
      updatedAt: new Date()
    })

    // Also update Firebase Auth emailVerified status
    try {
      await auth.updateUser(uid as string, {
        emailVerified: true
      })
    } catch (authError) {
      console.error('Failed to update Firebase Auth emailVerified:', authError)
      // Continue even if this fails - Firestore is our source of truth
    }

    // Redirect to login with success message
    return sendRedirect(event, '/login?verified=true')
  } catch (error: any) {
    console.error('Verify email error:', error)
    return sendRedirect(event, '/login?error=verification_failed')
  }
})
