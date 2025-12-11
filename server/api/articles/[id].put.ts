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
        message: 'คุณไม่มีสิทธิ์ในการแก้ไขบทความ'
      })
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบ ID บทความ'
      })
    }

    // Check if article exists
    const articleRef = db.collection('articles').doc(id)
    const articleDoc = await articleRef.get()

    if (!articleDoc.exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบบทความ'
      })
    }

    const existingData = articleDoc.data()!

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

    // Check if slug already exists (excluding current article)
    const existingSlug = await db.collection('articles')
      .where('slug', '==', slug.trim())
      .limit(2)
      .get()

    const slugConflict = existingSlug.docs.some(doc => doc.id !== id)
    if (slugConflict) {
      throw createError({
        statusCode: 400,
        message: 'Slug นี้ถูกใช้แล้ว กรุณาเลือก Slug อื่น'
      })
    }

    // Prepare update data
    const now = new Date()
    const updateData: Record<string, any> = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt?.trim() || '',
      content: content || '',
      coverImage: coverImage || null,
      tags: tags || [],
      isPublished: isPublished || false,
      updatedAt: now
    }

    // Set publishedAt if publishing for the first time
    if (isPublished && !existingData.publishedAt) {
      updateData.publishedAt = now
    }

    await articleRef.update(updateData)

    return {
      success: true,
      message: isPublished ? 'อัปเดตและเผยแพร่บทความเรียบร้อยแล้ว' : 'อัปเดตบทความเรียบร้อยแล้ว'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error updating article:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตบทความ'
    })
  }
})
