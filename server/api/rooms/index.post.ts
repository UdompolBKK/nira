import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'

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
    const decodedToken = await adminAuth().verifyIdToken(token)

    const body = await readBody(event)
    const { name, description, image, color, icon, isActive, order } = body

    if (!name?.trim()) {
      throw createError({
        statusCode: 400,
        message: 'กรุณาระบุชื่อห้อง'
      })
    }

    const db = adminFirestore()

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)

    // Check if slug already exists
    const existingRoom = await db.collection('rooms').where('slug', '==', slug).get()
    if (!existingRoom.empty) {
      throw createError({
        statusCode: 400,
        message: 'ชื่อห้องนี้มีอยู่แล้ว'
      })
    }

    const roomData = {
      name: name.trim(),
      slug,
      description: description?.trim() || '',
      image: image || null,
      color: color || '#6B7280',
      icon: icon || 'lucide:message-circle',
      isActive: isActive !== false,
      order: order || 0,
      postCount: 0,
      createdBy: decodedToken.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await db.collection('rooms').add(roomData)

    return {
      success: true,
      message: 'สร้างห้องเรียบร้อยแล้ว',
      room: {
        id: docRef.id,
        ...roomData
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Create room error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create room'
    })
  }
})
