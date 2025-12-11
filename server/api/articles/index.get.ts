import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()
    const query = getQuery(event)

    const { published, limit: limitParam, page: pageParam } = query
    const limit = parseInt(limitParam as string) || 20
    const page = parseInt(pageParam as string) || 1
    const offset = (page - 1) * limit

    // Build query
    let articlesQuery = db.collection('articles')
      .orderBy('createdAt', 'desc')

    // Filter by published status if specified
    if (published === 'true') {
      articlesQuery = articlesQuery.where('isPublished', '==', true)
    } else if (published === 'false') {
      articlesQuery = articlesQuery.where('isPublished', '==', false)
    }

    // Get total count
    const totalSnapshot = await articlesQuery.count().get()
    const total = totalSnapshot.data().count

    // Get paginated results
    const snapshot = await articlesQuery
      .offset(offset)
      .limit(limit)
      .get()

    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      publishedAt: doc.data().publishedAt?.toDate?.() || doc.data().publishedAt
    }))

    return {
      success: true,
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    console.error('Error fetching articles:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'เกิดข้อผิดพลาดในการโหลดบทความ'
    })
  }
})
