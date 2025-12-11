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

    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded'
      })
    }

    const storage = adminStorage()
    const bucket = storage.bucket()

    const uploadedFiles = []
    let folder = ''

    // First pass - get folder value
    for (const item of formData) {
      if (item.name === 'folder' && item.data) {
        folder = item.data.toString()
        break
      }
    }

    // Second pass - upload files
    for (const item of formData) {
      if (item.name === 'files' && item.filename && item.data) {
        // Validate file type
        if (!item.type?.startsWith('image/')) {
          continue // Skip non-image files
        }

        // Validate file size (max 10MB)
        if (item.data.length > 10 * 1024 * 1024) {
          throw createError({
            statusCode: 400,
            message: 'ไฟล์มีขนาดใหญ่เกิน 10MB'
          })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const ext = item.filename.split('.').pop()?.toLowerCase() || 'jpg'
        const sanitizedName = item.filename
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[^a-zA-Z0-9-_]/g, '_') // Sanitize filename
          .substring(0, 50) // Limit length

        const filename = `${sanitizedName}-${timestamp}-${randomStr}.${ext}`
        const filepath = folder ? `media/${folder}/${filename}` : `media/${filename}`

        const file = bucket.file(filepath)

        await file.save(item.data, {
          metadata: {
            contentType: item.type,
            metadata: {
              originalName: item.filename
            }
          }
        })

        // Make file publicly readable
        await file.makePublic()

        // Get public URL - use Firebase Storage URL format
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filepath)}?alt=media`

        uploadedFiles.push({
          name: filename,
          path: filepath,
          url,
          size: item.data.length,
          contentType: item.type
        })
      }
    }

    if (uploadedFiles.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบไฟล์รูปภาพที่จะอัปโหลด'
      })
    }

    return {
      success: true,
      message: `อัปโหลดสำเร็จ ${uploadedFiles.length} ไฟล์`,
      data: uploadedFiles
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to upload file'
    })
  }
})
