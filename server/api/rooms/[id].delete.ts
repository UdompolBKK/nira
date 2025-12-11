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

    const db = adminFirestore()
    const roomRef = db.collection('rooms').doc(id)
    const roomDoc = await roomRef.get()

    if (!roomDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบห้องนี้'
      })
    }

    // Check if there are posts using this room
    const postsWithRoom = await db.collection('ventPosts')
      .where('roomId', '==', id)
      .limit(1)
      .get()

    if (!postsWithRoom.empty) {
      // Instead of deleting, just deactivate the room
      await roomRef.update({
        isActive: false,
        updatedAt: new Date()
      })

      return {
        success: true,
        message: 'ปิดใช้งานห้องเรียบร้อยแล้ว (มีโพสต์ที่ใช้ห้องนี้อยู่)'
      }
    }

    await roomRef.delete()

    return {
      success: true,
      message: 'ลบห้องเรียบร้อยแล้ว'
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Delete room error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete room'
    })
  }
})
