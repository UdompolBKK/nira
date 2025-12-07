// Server-side authentication helper
import { adminAuth } from './firebase-admin'
import { H3Event } from 'h3'

export interface AuthUser {
  uid: string
  email: string | undefined
  emailVerified: boolean
}

/**
 * Verify Firebase Auth token from request header
 */
export const verifyAuth = async (event: H3Event): Promise<AuthUser> => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized - No token provided' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await adminAuth().verifyIdToken(token)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified || false
    }
  } catch (err: any) {
    console.error('Token verification failed:', err.message)
    throw createError({ statusCode: 401, message: 'Unauthorized - Invalid token' })
  }
}

/**
 * Check if user is super admin
 */
const SUPER_ADMIN_EMAILS = ['udompol.bkk@gmail.com']

export const verifySuperAdmin = async (event: H3Event): Promise<AuthUser> => {
  const user = await verifyAuth(event)

  if (!user.email || !SUPER_ADMIN_EMAILS.includes(user.email)) {
    throw createError({ statusCode: 403, message: 'Forbidden - Super Admin only' })
  }

  return user
}
