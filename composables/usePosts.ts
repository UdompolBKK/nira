// composables/usePosts.ts
// CRUD operations for diary posts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  increment,
  onSnapshot,
  type DocumentData,
  type QueryDocumentSnapshot
} from 'firebase/firestore'

// Mood categories for diary entries
export type MoodCategory = 'good' | 'normal' | 'bad' | 'worst' | 'critical'

export const MOOD_CATEGORIES = {
  good: { label: 'ช่วงชีวิตที่ดี', emoji: '😊', color: 'bg-gray-100' },
  normal: { label: 'ช่วงเวลาทั่วไป', emoji: '😐', color: 'bg-gray-100' },
  bad: { label: 'ช่วงที่แย่', emoji: '😢', color: 'bg-gray-200' },
  worst: { label: 'ช่วงที่เลวร้ายที่สุด', emoji: '😰', color: 'bg-gray-300' },
  critical: { label: 'วิกฤต (ต้องการความช่วยเหลือ)', emoji: '🆘', color: 'bg-gray-900 text-white' }
} as const

export interface Post {
  id: string
  userId: string
  authorName: string
  authorSlug?: string
  authorPhoto?: string
  content: string
  excerpt?: string
  visibility: 'public' | 'friends' | 'private'
  isLocked: boolean
  tags: string[]
  moodCategory: MoodCategory
  likeCount: number
  sadCount: number
  happyCount: number
  commentCount: number
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostData {
  content: string
  visibility: 'public' | 'friends' | 'private'
  isLocked: boolean
  tags: string[]
  moodCategory: MoodCategory
}

export const usePosts = () => {
  const { firestore } = useFirebase()
  const { user } = useAuth()

  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastDoc = ref<QueryDocumentSnapshot<DocumentData> | null>(null)
  const hasMore = ref(true)

  // Convert Firestore doc to Post
  const docToPost = (doc: QueryDocumentSnapshot<DocumentData>): Post => {
    const data = doc.data()
    return {
      id: doc.id,
      userId: data.userId,
      authorName: data.authorName || 'ไม่ระบุชื่อ',
      authorSlug: data.authorSlug,
      authorPhoto: data.authorPhoto,
      content: data.content,
      excerpt: data.excerpt || data.content?.replace(/<[^>]*>/g, '').substring(0, 150),
      visibility: data.visibility || 'public',
      isLocked: data.isLocked || false,
      tags: data.tags || [],
      moodCategory: data.moodCategory || 'normal',
      likeCount: data.likeCount || 0,
      sadCount: data.sadCount || 0,
      happyCount: data.happyCount || 0,
      commentCount: data.commentCount || 0,
      viewCount: data.viewCount || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    }
  }

  // Get public posts (for browse page)
  const getPublicPosts = async (limitCount = 10, loadMore = false) => {
    if (!firestore) return []

    loading.value = true
    error.value = null

    try {
      const postsRef = collection(firestore, 'posts')
      let q = query(
        postsRef,
        where('visibility', '==', 'public'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      if (loadMore && lastDoc.value) {
        q = query(
          postsRef,
          where('visibility', '==', 'public'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc.value),
          limit(limitCount)
        )
      }

      const snapshot = await getDocs(q)
      const newPosts = snapshot.docs.map(docToPost)

      if (loadMore) {
        posts.value = [...posts.value, ...newPosts]
      } else {
        posts.value = newPosts
      }

      lastDoc.value = snapshot.docs[snapshot.docs.length - 1] || null
      hasMore.value = snapshot.docs.length === limitCount

      return newPosts
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Get featured posts (likes >= 50)
  const getFeaturedPosts = async (limitCount = 5) => {
    if (!firestore) return []

    try {
      const postsRef = collection(firestore, 'posts')
      const q = query(
        postsRef,
        where('visibility', '==', 'public'),
        where('likeCount', '>=', 50),
        orderBy('likeCount', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(docToPost)
    } catch (err: any) {
      console.error('Error getting featured posts:', err)
      return []
    }
  }

  // Get trending posts (top likes in 24h)
  const getTrendingPosts = async (limitCount = 10) => {
    if (!firestore) return []

    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const postsRef = collection(firestore, 'posts')
      const q = query(
        postsRef,
        where('visibility', '==', 'public'),
        where('createdAt', '>=', Timestamp.fromDate(yesterday)),
        orderBy('createdAt', 'desc'),
        orderBy('likeCount', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(docToPost)
    } catch (err: any) {
      console.error('Error getting trending posts:', err)
      return []
    }
  }

  // Get user's own posts
  const getMyPosts = async (limitCount = 20) => {
    if (!firestore || !user.value) return []

    loading.value = true
    try {
      const postsRef = collection(firestore, 'posts')
      const q = query(
        postsRef,
        where('userId', '==', user.value.uid),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      posts.value = snapshot.docs.map(docToPost)
      return posts.value
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Get single post by ID
  const getPost = async (postId: string): Promise<Post | null> => {
    if (!firestore) return null

    try {
      const postRef = doc(firestore, 'posts', postId)
      const postDoc = await getDoc(postRef)

      if (!postDoc.exists()) return null

      return docToPost(postDoc as QueryDocumentSnapshot<DocumentData>)
    } catch (err: any) {
      error.value = err.message
      return null
    }
  }

  // Create new post
  const createPost = async (data: CreatePostData): Promise<string | null> => {
    if (!firestore || !user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return null
    }

    loading.value = true
    try {
      // Get user profile for author info
      const userDoc = await getDoc(doc(firestore, 'users', user.value.uid))
      const userData = userDoc.data()

      const postData: Record<string, any> = {
        userId: user.value.uid,
        authorName: userData?.displayName || user.value.displayName || 'ไม่ระบุชื่อ',
        content: data.content,
        excerpt: data.content.replace(/<[^>]*>/g, '').substring(0, 150),
        visibility: data.visibility,
        isLocked: data.isLocked,
        tags: data.tags || [],
        moodCategory: data.moodCategory,
        likeCount: 0,
        sadCount: 0,
        happyCount: 0,
        commentCount: 0,
        viewCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      // Only add optional fields if they have values
      if (userData?.slug) postData.authorSlug = userData.slug
      if (userData?.photoURL || user.value.photoURL) {
        postData.authorPhoto = userData?.photoURL || user.value.photoURL
      }

      const postsRef = collection(firestore, 'posts')
      const docRef = await addDoc(postsRef, postData)

      return docRef.id
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Update post
  const updatePost = async (postId: string, data: Partial<CreatePostData>): Promise<boolean> => {
    if (!firestore || !user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    try {
      const postRef = doc(firestore, 'posts', postId)

      // Verify ownership
      const postDoc = await getDoc(postRef)
      if (!postDoc.exists() || postDoc.data().userId !== user.value.uid) {
        error.value = 'คุณไม่มีสิทธิ์แก้ไขโพสต์นี้'
        return false
      }

      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      }

      if (data.content) {
        updateData.excerpt = data.content.replace(/<[^>]*>/g, '').substring(0, 150)
      }

      await updateDoc(postRef, updateData)
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete post
  const deletePost = async (postId: string): Promise<boolean> => {
    if (!firestore || !user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return false
    }

    loading.value = true
    try {
      const postRef = doc(firestore, 'posts', postId)

      // Verify ownership
      const postDoc = await getDoc(postRef)
      if (!postDoc.exists() || postDoc.data().userId !== user.value.uid) {
        error.value = 'คุณไม่มีสิทธิ์ลบโพสต์นี้'
        return false
      }

      await deleteDoc(postRef)

      // Remove from local state
      posts.value = posts.value.filter(p => p.id !== postId)

      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Increment view count
  const incrementView = async (postId: string) => {
    if (!firestore) return

    try {
      const postRef = doc(firestore, 'posts', postId)
      await updateDoc(postRef, {
        viewCount: increment(1)
      })
    } catch (err) {
      console.error('Error incrementing view:', err)
    }
  }

  // Search posts by keyword
  const searchPosts = async (keyword: string, limitCount = 20): Promise<Post[]> => {
    if (!firestore || !keyword.trim()) return []

    try {
      // Simple search - get public posts and filter client-side
      // For production, use Algolia or Firebase Extensions
      const postsRef = collection(firestore, 'posts')
      const q = query(
        postsRef,
        where('visibility', '==', 'public'),
        orderBy('createdAt', 'desc'),
        limit(100)
      )

      const snapshot = await getDocs(q)
      const allPosts = snapshot.docs.map(docToPost)

      const searchLower = keyword.toLowerCase()
      return allPosts
        .filter(post =>
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
        .slice(0, limitCount)
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  // Get posts by tag
  const getPostsByTag = async (tag: string, limitCount = 20): Promise<Post[]> => {
    if (!firestore) return []

    try {
      const postsRef = collection(firestore, 'posts')
      const q = query(
        postsRef,
        where('visibility', '==', 'public'),
        where('tags', 'array-contains', tag),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(docToPost)
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  // Get posts by specific user ID (sorted from oldest to newest for timeline)
  const getUserPosts = async (userId: string, limitCount = 10, loadMore = false) => {
    if (!firestore || !userId) return []

    loading.value = true
    error.value = null

    try {
      const postsRef = collection(firestore, 'posts')
      let q = query(
        postsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'asc'),
        limit(limitCount)
      )

      if (loadMore && lastDoc.value) {
        q = query(
          postsRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'asc'),
          startAfter(lastDoc.value),
          limit(limitCount)
        )
      }

      const snapshot = await getDocs(q)
      const newPosts = snapshot.docs.map(docToPost)

      if (loadMore) {
        posts.value = [...posts.value, ...newPosts]
      } else {
        posts.value = newPosts
      }

      lastDoc.value = snapshot.docs[snapshot.docs.length - 1] || null
      hasMore.value = snapshot.docs.length === limitCount

      return newPosts
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Create post with custom createdAt (for inserting between posts)
  const createInsertedPost = async (
    data: CreatePostData,
    insertAfterDate: Date,
    insertBeforeDate: Date
  ): Promise<string | null> => {
    if (!firestore || !user.value) {
      error.value = 'กรุณาเข้าสู่ระบบก่อน'
      return null
    }

    loading.value = true
    try {
      // Get user profile for author info
      const userDoc = await getDoc(doc(firestore, 'users', user.value.uid))
      const userData = userDoc.data()

      // Calculate midpoint timestamp between the two posts
      const afterTime = insertAfterDate.getTime()
      const beforeTime = insertBeforeDate.getTime()
      const midTime = afterTime + Math.floor((beforeTime - afterTime) / 2)
      const insertedDate = new Date(midTime)

      const postData: Record<string, any> = {
        userId: user.value.uid,
        authorName: userData?.displayName || user.value.displayName || 'ไม่ระบุชื่อ',
        content: data.content,
        excerpt: data.content.replace(/<[^>]*>/g, '').substring(0, 150),
        visibility: data.visibility,
        isLocked: data.isLocked,
        tags: data.tags || [],
        moodCategory: data.moodCategory,
        likeCount: 0,
        sadCount: 0,
        happyCount: 0,
        commentCount: 0,
        viewCount: 0,
        createdAt: Timestamp.fromDate(insertedDate),
        updatedAt: Timestamp.now()
      }

      // Only add optional fields if they have values
      if (userData?.slug) postData.authorSlug = userData.slug
      if (userData?.photoURL || user.value.photoURL) {
        postData.authorPhoto = userData?.photoURL || user.value.photoURL
      }

      const postsRef = collection(firestore, 'posts')
      const docRef = await addDoc(postsRef, postData)

      return docRef.id
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Reset pagination
  const resetPagination = () => {
    posts.value = []
    lastDoc.value = null
    hasMore.value = true
  }

  return {
    posts,
    loading,
    error,
    hasMore,
    getPublicPosts,
    getFeaturedPosts,
    getTrendingPosts,
    getMyPosts,
    getUserPosts,
    getPost,
    createPost,
    createInsertedPost,
    updatePost,
    deletePost,
    incrementView,
    searchPosts,
    getPostsByTag,
    resetPagination
  }
}
