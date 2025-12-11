import { adminAuth, adminStorage } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'กรุณาเข้าสู่ระบบ'
      })
    }

    const token = authHeader.split('Bearer ')[1]
    await adminAuth().verifyIdToken(token)

    const body = await readBody(event)
    const { path } = body

    if (!path) {
      throw createError({
        statusCode: 400,
        message: 'ต้องระบุ path ของไฟล์'
      })
    }

    // Security check - only allow deleting from media folder
    if (!path.startsWith('media/')) {
      throw createError({
        statusCode: 403,
        message: 'ไม่อนุญาตให้ลบไฟล์นอกโฟลเดอร์ media'
      })
    }

    const storage = adminStorage()
    const bucket = storage.bucket()

    const file = bucket.file(path)

    // Check if file exists
    const [exists] = await file.exists()
    if (!exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบไฟล์'
      })
    }

    await file.delete()

    return {
      success: true,
      message: 'ลบไฟล์เรียบร้อยแล้ว'
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Delete error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete file'
    })
  }
})
