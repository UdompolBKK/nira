import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // Get Firebase Admin instances (they are functions that return the instances)
    const auth = adminAuth()
    const db = adminFirestore()

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'กรุณากรอกอีเมลและรหัสผ่าน'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        message: 'รูปแบบอีเมลไม่ถูกต้อง'
      })
    }

    // Validate password length
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      })
    }

    // Create user in Firebase Auth
    let userRecord
    try {
      userRecord = await auth.createUser({
        email: email,
        password: password,
        emailVerified: false
      })
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-exists') {
        throw createError({
          statusCode: 400,
          message: 'อีเมลนี้ถูกใช้งานแล้ว'
        })
      }
      throw authError
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user document in Firestore
    const now = new Date()
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      emailVerified: false,
      displayName: null,
      anonymousName: null,
      photoURL: null,
      slug: null,
      bio: null,
      role: 'user',
      isPremium: false,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      // Verification data
      emailVerification: {
        token: verificationToken,
        expiresAt: expiresAt,
        sentAt: now
      }
    })

    // Create custom token for client to sign in
    const customToken = await auth.createCustomToken(userRecord.uid)

    return {
      success: true,
      uid: userRecord.uid,
      customToken: customToken,
      message: 'สร้างบัญชีเรียบร้อยแล้ว'
    }
  } catch (error: any) {
    console.error('Signup error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่'
    })
  }
})
