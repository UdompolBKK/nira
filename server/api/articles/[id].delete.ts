import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const auth = adminAuth()
    const db = adminFirestore()

    // Verify authentication
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'กรุณาเข้าสู่ระบบ'
      })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await auth.verifyIdToken(token)
    const uid = decodedToken.uid

    // Check if user is admin
    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      throw createError({
        statusCode: 403,
        message: 'ไม่พบข้อมูลผู้ใช้'
      })
    }

    const userData = userDoc.data()
    if (userData?.role !== 'admin' && userData?.role !== 'super-admin') {
      throw createError({
        statusCode: 403,
        message: 'คุณไม่มีสิทธิ์ในการลบบทความ'
      })
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบ ID บทความ'
      })
    }

    // Check if article exists
    const articleRef = db.collection('articles').doc(id)
    const articleDoc = await articleRef.get()

    if (!articleDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบบทความ'
      })
    }

    // Delete article
    await articleRef.delete()

    return {
      success: true,
      message: 'ลบบทความเรียบร้อยแล้ว'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error deleting article:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'เกิดข้อผิดพลาดในการลบบทความ'
    })
  }
})
