import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบ Slug บทความ'
      })
    }

    // Get article by slug
    const snapshot = await db.collection('articles')
      .where('slug', '==', slug.toLowerCase())
      .where('isPublished', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบบทความ'
      })
    }

    const articleDoc = snapshot.docs[0]
    const articleData = articleDoc.data()

    // Increment view count
    await db.collection('articles').doc(articleDoc.id).update({
      views: (articleData.views || 0) + 1
    })

    return {
      success: true,
      article: {
        id: articleDoc.id,
        ...articleData,
        views: (articleData.views || 0) + 1,
        createdAt: articleData.createdAt?.toDate?.() || articleData.createdAt,
        updatedAt: articleData.updatedAt?.toDate?.() || articleData.updatedAt,
        publishedAt: articleData.publishedAt?.toDate?.() || articleData.publishedAt
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error fetching article by slug:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'เกิดข้อผิดพลาดในการโหลดบทความ'
    })
  }
})
