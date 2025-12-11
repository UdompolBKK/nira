import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()
    const query = getQuery(event)
    const includeHidden = query.includeHidden === 'true'

    let roomsQuery = db.collection('rooms').orderBy('order', 'asc')

    const snapshot = await roomsQuery.get()

    const rooms = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(room => includeHidden || room.isActive !== false)

    return {
      success: true,
      rooms
    }
  } catch (error: any) {
    console.error('Failed to get rooms:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get rooms'
    })
  }
})
