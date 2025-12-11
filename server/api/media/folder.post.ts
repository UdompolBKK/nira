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
    const { name, parentFolder } = body

    if (!name) {
      throw createError({
        statusCode: 400,
        message: 'กรุณาระบุชื่อโฟลเดอร์'
      })
    }

    // Sanitize folder name
    const sanitizedName = name
      .replace(/[^a-zA-Z0-9-_\u0E00-\u0E7F]/g, '_') // Allow Thai characters
      .substring(0, 50)

    if (!sanitizedName) {
      throw createError({
        statusCode: 400,
        message: 'ชื่อโฟลเดอร์ไม่ถูกต้อง'
      })
    }

    const storage = adminStorage()
    const bucket = storage.bucket()

    // Create folder path
    const folderPath = parentFolder
      ? `media/${parentFolder}/${sanitizedName}/`
      : `media/${sanitizedName}/`

    // Create a placeholder file to represent the folder
    // Firebase Storage doesn't have real folders, so we create a .keep file
    const file = bucket.file(`${folderPath}.keep`)

    await file.save('', {
      metadata: {
        contentType: 'text/plain',
        metadata: {
          isPlaceholder: 'true'
        }
      }
    })

    return {
      success: true,
      message: 'สร้างโฟลเดอร์เรียบร้อยแล้ว',
      data: {
        name: sanitizedName,
        path: parentFolder ? `${parentFolder}/${sanitizedName}` : sanitizedName
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Create folder error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create folder'
    })
  }
})
