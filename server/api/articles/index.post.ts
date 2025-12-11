import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const auth = adminAuth()
    const db = adminFirestore()

    // Verify authentication
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'กรุณาเข้าสู่ระบบ'
      })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await auth.verifyIdToken(token)
    const uid = decodedToken.uid

    // Check if user is admin
    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      throw createError({
        statusCode: 403,
        message: 'ไม่พบข้อมูลผู้ใช้'
      })
    }

    const userData = userDoc.data()
    if (userData?.role !== 'admin' && userData?.role !== 'super-admin') {
      throw createError({
        statusCode: 403,
        message: 'คุณไม่มีสิทธิ์ในการสร้างบทความ'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { title, slug, excerpt, content, coverImage, tags, isPublished } = body

    // Validate required fields
    if (!title?.trim()) {
      throw createError({
        statusCode: 400,
        message: 'กรุณาใส่หัวข้อบทความ'
      })
    }

    if (!slug?.trim()) {
      throw createError({
        statusCode: 400,
        message: 'กรุณาใส่ Slug (URL)'
      })
    }

    // Check if slug already exists
    const existingSlug = await db.collection('articles')
      .where('slug', '==', slug.trim())
      .limit(1)
      .get()

    if (!existingSlug.empty) {
      throw createError({
        statusCode: 400,
        message: 'Slug นี้ถูกใช้แล้ว กรุณาเลือก Slug อื่น'
      })
    }

    // Create article document
    const now = new Date()
    const articleData = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt?.trim() || '',
      content: content || '',
      coverImage: coverImage || null,
      tags: tags || [],
      isPublished: isPublished || false,
      authorId: uid,
      views: 0,
      createdAt: now,
      updatedAt: now,
      ...(isPublished ? { publishedAt: now } : {})
    }

    const docRef = await db.collection('articles').add(articleData)

    return {
      success: true,
      id: docRef.id,
      message: isPublished ? 'เผยแพร่บทความเรียบร้อยแล้ว' : 'บันทึกแบบร่างเรียบร้อยแล้ว'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error creating article:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'เกิดข้อผิดพลาดในการสร้างบทความ'
    })
  }
})
