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
    await adminAuth().verifyIdToken(token)

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Room ID is required'
      })
    }

    const body = await readBody(event)
    const { name, description, image, color, icon, isActive, order } = body

    const db = adminFirestore()
    const roomRef = db.collection('rooms').doc(id)
    const roomDoc = await roomRef.get()

    if (!roomDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบห้องนี้'
      })
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date()
    }

    if (name !== undefined) {
      updateData.name = name.trim()
      // Update slug if name changed
      updateData.slug = name
        .toLowerCase()
        .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
    }
    if (description !== undefined) updateData.description = description.trim()
    if (image !== undefined) updateData.image = image
    if (color !== undefined) updateData.color = color
    if (icon !== undefined) updateData.icon = icon
    if (isActive !== undefined) updateData.isActive = isActive
    if (order !== undefined) updateData.order = order

    await roomRef.update(updateData)

    const updatedDoc = await roomRef.get()

    return {
      success: true,
      message: 'อัปเดตห้องเรียบร้อยแล้ว',
      room: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Update room error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update room'
    })
  }
})
