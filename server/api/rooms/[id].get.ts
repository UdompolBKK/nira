import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Room ID is required'
      })
    }

    const db = adminFirestore()

    // Try to find by ID first
    let roomDoc = await db.collection('rooms').doc(id).get()

    // If not found by ID, try to find by slug
    if (!roomDoc.exists) {
      const slugQuery = await db.collection('rooms').where('slug', '==', id).limit(1).get()
      if (!slugQuery.empty) {
        roomDoc = slugQuery.docs[0]
      }
    }

    if (!roomDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบห้องนี้'
      })
    }

    return {
      success: true,
      room: {
        id: roomDoc.id,
        ...roomDoc.data()
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Get room error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get room'
    })
  }
})
