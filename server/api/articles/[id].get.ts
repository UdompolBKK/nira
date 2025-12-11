import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบ ID บทความ'
      })
    }

    // Get article by ID
    const articleDoc = await db.collection('articles').doc(id).get()

    if (!articleDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบบทความ'
      })
    }

    const articleData = articleDoc.data()!

    return {
      success: true,
      article: {
        id: articleDoc.id,
        ...articleData,
        createdAt: articleData.createdAt?.toDate?.() || articleData.createdAt,
        updatedAt: articleData.updatedAt?.toDate?.() || articleData.updatedAt,
        publishedAt: articleData.publishedAt?.toDate?.() || articleData.publishedAt
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error fetching article:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'เกิดข้อผิดพลาดในการโหลดบทความ'
    })
  }
})
